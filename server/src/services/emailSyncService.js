import { google } from "googleapis";
import User from "../models/User.js";
import Lead from "../models/Lead.js";
import { emitToBusiness } from "../utils/socket.js";

const SYNC_INTERVAL = 60000; // 60 seconds

// Helper to decode Gmail message parts safely
const decodeBase64 = (data) => {
    return Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString("utf-8");
};

// Helper: Extract plain text body from a Gmail message payload
const extractBody = (payload) => {
    if (!payload) return "";

    let body = "";

    // Sometimes the body is right in the root payload
    if (payload.body && payload.body.data) {
        body = decodeBase64(payload.body.data);
    }

    // Otherwise it's in parts
    if (payload.parts && payload.parts.length > 0) {
        // Prefer text/plain, fallback to text/html
        const textPart = payload.parts.find(p => p.mimeType === "text/plain");
        const htmlPart = payload.parts.find(p => p.mimeType === "text/html");

        if (textPart && textPart.body && textPart.body.data) {
            body = decodeBase64(textPart.body.data);
        } else if (htmlPart && htmlPart.body && htmlPart.body.data) {
            body = decodeBase64(htmlPart.body.data);
            // Minimal HTML strip (for better UI display)
            body = body.replace(/<[^>]*>?/gm, '');
        } else {
            // Recursive check for nested parts (multipart/alternative)
            for (const part of payload.parts) {
                if (part.parts) {
                    const nestedBody = extractBody(part);
                    if (nestedBody) return nestedBody;
                }
            }
        }
    }

    return stripQuotedReply(body.trim());
};

const stripQuotedReply = (text) => {
    // 1. Gmail format: "On Sat, Feb 21, 2026 ... wrote:"
    const splitIndex = text.search(/\nOn\s+(.*?)\s+wrote:/i);
    if (splitIndex !== -1) {
        text = text.substring(0, splitIndex);
    }

    // 2. Outlook format: "-----Original Message-----"
    const outlookSplit = text.search(/-----Original Message-----/i);
    if (outlookSplit !== -1) {
        text = text.substring(0, outlookSplit);
    }

    // 3. Alternative Outlook format block
    const outlookSplit2 = text.search(/________________________________/i);
    if (outlookSplit2 !== -1) {
        text = text.substring(0, outlookSplit2);
    }

    return text.trim();
};

export const syncEmails = async () => {
    try {
        console.log("🔄 [EmailSync] Starting Gmail API polling cycle...");

        // 1. Find all users who have an active Gmail connection with the readonly scope.
        // If they haven't re-consented, the API call will fail gracefully for them.
        const users = await User.find({ gmailRefreshToken: { $exists: true, $ne: "" } });

        for (const user of users) {
            try {
                const oauth2Client = new google.auth.OAuth2(
                    process.env.GOOGLE_CLIENT_ID,
                    process.env.GOOGLE_CLIENT_SECRET
                );

                oauth2Client.setCredentials({
                    refresh_token: user.gmailRefreshToken,
                    access_token: user.gmailAccessToken
                });

                // Auto-refresh token if needed
                if (!user.gmailTokenExpiry || user.gmailTokenExpiry < new Date(Date.now() + 60000)) {
                    try {
                        const { credentials } = await oauth2Client.refreshAccessToken();
                        user.gmailAccessToken = credentials.access_token;
                        user.gmailTokenExpiry = new Date(credentials.expiry_date);
                        user.gmailStatus = 'active'; // Reset if it was in error
                        await user.save();
                    } catch (refreshErr) {
                        if (refreshErr.message.includes("invalid_grant")) {
                            user.gmailStatus = 'error';
                            await user.save();
                            emitToBusiness(await getBusinessIdForUser(user._id), "gmail_status_change", { status: 'error', email: user.email });
                            throw new Error("re-auth required");
                        }
                        throw refreshErr;
                    }
                }

                // Ensure status is active if we reached here
                if (user.gmailStatus !== 'active') {
                    user.gmailStatus = 'active';
                    await user.save();
                }

                const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

                // 2. Find all leads for THIS user's business that have a threadId.
                // We'll only look at active leads to save API calls.
                const activeLeads = await Lead.find({
                    business: await getBusinessIdForUser(user._id),
                    gmailThreadId: { $ne: null },
                    status: { $in: ["contacted", "qualified"] } // Optimization
                });

                if (activeLeads.length === 0) continue;

                for (const lead of activeLeads) {
                    try {
                        // 3. Fetch the full thread from Gmail
                        const res = await gmail.users.threads.get({
                            userId: 'me',
                            id: lead.gmailThreadId,
                            format: 'full' // Need full payload to extract bodies
                        });

                        const messages = res.data.messages || [];

                        // 4. We only care about messages AFTER the 'lastEmailReceivedAt' timestamp
                        // or messages that we haven't seen yet.
                        // Since 'conversationHistory' tracks the count, we can compare.
                        // A more robust way is tracking exact message IDs, 
                        // but comparing counts against the thread is simpler for MVP.

                        // The thread contains ALL messages (our sent + their replies).
                        // Let's filter to only messages NOT sent by us (the user).
                        // Or, simpler: Compare the total messages in the thread vs our history.
                        // Wait, we generate AI responses that aren't technically in the thread immediately.
                        // Best approach: Track Gmail Message IDs we have processed.

                        // For this implementation, let's look at the LAST message in the thread.
                        const lastMessage = messages[messages.length - 1];

                        if (!lastMessage) {
                            console.log(`[EmailSync] Thread ${lead.gmailThreadId} has no messages. (Lead: ${lead.name})`);
                            continue;
                        }

                        const internalDate = parseInt(lastMessage.internalDate);
                        const messageDate = new Date(internalDate);

                        console.log(`[EmailSync] Lead ${lead.name} | Last Msg Date: ${messageDate.toISOString()} | Tracked: ${lead.lastEmailReceivedAt?.toISOString()}`);

                        // If the last message is newer than the lead's tracked time
                        if (!lead.lastEmailReceivedAt || messageDate > lead.lastEmailReceivedAt) {

                            const headers = lastMessage.payload?.headers || [];
                            const fromHeader = headers.find(h => h.name.toLowerCase() === 'from');

                            // Prioritize checking if the sender is the lead
                            const isFromLead = fromHeader && fromHeader.value.includes(lead.email);
                            const role = isFromLead ? "user" : "model";

                            console.log(`[EmailSync] Lead ${lead.name} | Msg is newer! From: ${fromHeader?.value} | Routing as: ${role}`);

                            // It's a new incoming reply or a manual outbound reply!
                            const bodyText = extractBody(lastMessage.payload);
                            console.log(`[EmailSync] Lead ${lead.name} | Extracted body length: ${bodyText?.length}`);

                            if (bodyText) {
                                // Prevent echoing automated emails that Arlo JUST sent
                                // by seeing if a heavily similar text is already in history
                                const isDuplicate = lead.conversationHistory.some(h => {
                                    // Parse stringified JSON if it was an AI email draft
                                    let contentToCheck = h.content;
                                    try {
                                        const parsed = JSON.parse(h.content);
                                        contentToCheck = parsed.emailBody || parsed.email || h.content;
                                    } catch (e) { }

                                    const safeBody = bodyText.trim().toLowerCase();
                                    const safeHistory = contentToCheck.trim().toLowerCase();
                                    return safeHistory === safeBody || safeHistory.includes(safeBody) || safeBody.includes(safeHistory);
                                });

                                if (isDuplicate) {
                                    console.log(`[EmailSync] Lead ${lead.name} | Skipping duplicate/echoed message.`);
                                    // Update timestamp so we don't check it again
                                    lead.lastEmailReceivedAt = messageDate;
                                    await lead.save();
                                    continue;
                                }

                                console.log(`📥 [EmailSync] New sync detected for Lead ${lead.name}`);

                                // Append to history
                                lead.conversationHistory.push({
                                    role: role,
                                    content: bodyText,
                                    timestamp: messageDate
                                });

                                // Mark as unread ONLY if the lead replied
                                if (role === "user") {
                                    lead.read = false;
                                }

                                // Update timestamp so we don't process this message again
                                lead.lastEmailReceivedAt = messageDate;

                                await lead.save();

                                // Emit socket event to instantly update the UI
                                emitToBusiness(lead.business, "new_message", {
                                    leadId: lead._id,
                                    content: bodyText,
                                    timestamp: messageDate
                                });
                            }
                        }

                    } catch (threadErr) {
                        // Skip deleted/missing threads gracefully
                        if (threadErr.code === 404) {
                            console.log(`[EmailSync] Thread ${lead.gmailThreadId} no longer exists. Skipping.`);
                        } else {
                            console.error(`[EmailSync] Error fetching thread ${lead.gmailThreadId}:`, threadErr.message);
                        }
                    }
                }
            } catch (userErr) {
                // Might fail if user revoked access or hasn't accepted the new readonly scope yet
                if (userErr.message === "re-auth required" || userErr.message.includes("invalid_grant")) {
                    console.log(`⚠️ [EmailSync] Re-auth required for ${user.email}`);
                } else {
                    console.error(`⚠️ [EmailSync] Could not sync user ${user.email}:`, userErr.message);
                }
            }
        }
    } catch (error) {
        console.error("❌ [EmailSync] Critical Service Error:", error);
    }
};

// Helper since Lead schema stores Business ID directly
async function getBusinessIdForUser(userId) {
    const mongoose = (await import('mongoose')).default;
    const Business = mongoose.model("Business");
    const biz = await Business.findOne({ owner: userId });
    return biz ? biz._id : null;
}

export const initEmailSyncService = () => {
    syncEmails(); // Run immediately on boot
    setInterval(syncEmails, SYNC_INTERVAL);
    console.log(`⏰ [EmailSync] Service initialized. Polling every ${SYNC_INTERVAL / 1000}s.`);
};
