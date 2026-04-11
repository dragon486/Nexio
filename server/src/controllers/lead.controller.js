import Lead from "../models/Lead.js";
import Business from "../models/Business.js";
import Notification from "../models/Notification.js";
import { emitToBusiness } from "../utils/socket.js";
import { processLead } from "../services/aiScoring.js";
import { sendEmail } from "../services/emailService.js";
import { sendWhatsAppMessage } from "../services/whatsappService.js";
import { validateAiOutput, getFallbackEmail } from "../utils/safetyGuard.js";
import { getEmailDraft, hasEmailDraft, normalizeAiResponse } from "../utils/aiResponse.js";
import { runtimeConfig } from "../config/env.js";

// Helper: Check & Increment Email Limit
const checkAndIncrementEmailLimit = async (business) => {
    const today = new Date();
    const lastReset = new Date(business.settings.lastEmailReset || 0);

    // Reset if it's a new day
    if (today.getDate() !== lastReset.getDate() || today.getMonth() !== lastReset.getMonth()) {
        business.settings.emailsSentToday = 0;
        business.settings.lastEmailReset = today;
    }

    // Check Limit (Skip for Pro/Enterprise if we had logic, but user wants limits for now)
    // Assuming 'pro' has higher limits, but for safety we enforce the DB limit value
    if (business.settings.emailsSentToday >= business.settings.dailyEmailLimit) {
        return false; // Limit reached
    }

    // Increment
    business.settings.emailsSentToday += 1;
    await business.save();
    return true;
};

// Helper: Handle AI Limit Notification
const notifyAiLimit = async (businessId, aiNotes, leadName) => {
    try {
        const isLimit = aiNotes?.includes("Limit") || aiNotes?.includes("Quota");
        if (!isLimit) return;

        // Check if a recent notification for this already exists (avoid spam)
        const recentNotif = await Notification.findOne({
            business: businessId,
            type: "ai_limit",
            createdAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) } // Last 5 mins
        });

        if (recentNotif) return;

        const isDaily = aiNotes.includes("Daily") || aiNotes.includes("Quota");
        const title = isDaily ? "Daily AI Quota Reached " : "AI Rate Limit Hit ⏳";
        const message = isDaily
            ? aiNotes
            : `NEXIO hit a rate limit while processing ${leadName}. ${aiNotes}`;

        await Notification.create({
            business: businessId,
            type: "ai_limit",
            title,
            message,
            meta: { leadName }
        });
    } catch (err) {
        console.error("Failed to create AI limit notification:", err);
    }
};

// Helper: Check if within Working Hours
const isWithinWorkingHours = (business) => {
    if (!business.settings.applyWorkingHours) return true;

    const now = new Date();
    const start = business.settings.workingHours?.start || "09:00";
    const end = business.settings.workingHours?.end || "18:00";

    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);

    const currentH = now.getHours();
    const currentM = now.getMinutes();

    const startTimeInMinutes = startH * 60 + startM;
    const endTimeInMinutes = endH * 60 + endM;
    const currentTimeInMinutes = currentH * 60 + currentM;

    return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
};

export const createLead = async (req, res) => {
    try {
        const leadData = {
            ...req.body,
            business: req.user?.businessId || req.body.businessId,
            source: "dashboard"
        };

        // Check AI Credits
        const business = await Business.findById(leadData.business);

        if (business && business.aiCredits > 0) {
            let aiResult = { aiScore: 0, aiResponse: {} };
            const bName = (business.name || "NEXIO").replace("'s Business", "");
            let serviceFailed = false;

            try {
                // Primary AI Pipeline
                const result = await processLead({
                    ...leadData,
                    business: business
                }, [], "", bName, req.user?.name || "the Sales Team");
                
                aiResult = result;
                aiResult.aiResponse = normalizeAiResponse(aiResult.aiResponse);
                Object.assign(leadData, aiResult);

                // 1. Safety Validation (Act Phase)
                const emailContent = getEmailDraft(aiResult.aiResponse);
                const safetyResult = validateAiOutput(emailContent);

                if (!safetyResult.safe) {
                    console.error(`[Safety Intercept] AI content rejected in createLead: ${safetyResult.reason}`);
                    leadData.requiresReview = true;
                    leadData.aiNotes = (leadData.aiNotes || "") + `\n[Safety Block] AI-generated reply replaced with fallback: ${safetyResult.reason}`;
                    
                    // Trigger Fallback Email (Safe Mode)
                    aiResult.aiResponse = normalizeAiResponse({
                        ...aiResult.aiResponse,
                        emailSubject: `Re: Your Inquiry - ${bName}`,
                        emailBody: getFallbackEmail(bName, leadData.name),
                    });
                }
            } catch (e) {
                console.error("AI Service failure in createLead:", e.message);
                serviceFailed = true;
                leadData.requiresReview = true;
                leadData.aiNotes = (leadData.aiNotes || "") + `\n[System Fallback] AI service unavailable, fallback email sent.`;
                
                // Trigger Rescue Fallback
                aiResult.aiResponse = normalizeAiResponse({
                    emailSubject: `Re: Your Inquiry - ${bName}`,
                    emailBody: getFallbackEmail(bName, leadData.name),
                });
            }

            // 2. Auto-Send Email (Unified Logic)
            const minScore = business.settings.minScoreToAutoReply || 50;
            const shouldSend = (aiResult.aiScore >= minScore) || serviceFailed;

            if (business.settings.autoReply && hasEmailDraft(aiResult.aiResponse) && shouldSend) {
                const inHours = isWithinWorkingHours(business);
                const canSend = inHours && (await checkAndIncrementEmailLimit(business));

                if (canSend) {
                    const subject = aiResult.aiResponse.emailSubject || "Re: Your Inquiry - " + business.name;
                    await sendEmail(leadData.email, subject, getEmailDraft(aiResult.aiResponse), business.owner);
                    leadData.status = "contacted";
                    leadData.isAutoPilotContacted = true;
                    leadData.contactedAt = leadData.contactedAt || new Date();
                    aiResult.aiResponse.autoSent = true; 
                } else if (!inHours) {
                    console.log(`[Auto-Pilot] Outside working hours for ${business.name}. Skipping auto-send.`);
                    leadData.aiNotes = (leadData.aiNotes || "") + "\n[System] Auto-reply scheduled: Outside working hours.";
                } else {
                    console.warn(`Email limit reached for business ${business.name}`);
                    leadData.aiNotes = (leadData.aiNotes || "") + "\n[System] Auto-reply skipped: Daily email limit reached.";
                }
            }

            leadData.aiResponse = aiResult.aiResponse;

            // 3. Save to History
            const newHistory = [];
            if (leadData.message) {
                newHistory.push({ role: "user", content: leadData.message });
            }

            if (aiResult.aiScore > 0 || (aiResult.aiResponse && Object.keys(aiResult.aiResponse).length > 0)) {
                newHistory.push({ role: "model", content: JSON.stringify(aiResult.aiResponse) });
            }
            leadData.conversationHistory = newHistory;
            if (aiResult.newSummary) leadData.memorySummary = aiResult.newSummary;

            // Notify if limit hit
            if (aiResult.aiScore === 0) {
                await notifyAiLimit(business._id, aiResult.aiNotes, leadData.name || "a website lead");
            }
        } else {
            leadData.aiNotes = "AI Limit Reached. Upgrade to Premium for scoring.";
        }

        const lead = await Lead.create(leadData);

        // Real-time Update
        emitToBusiness(lead.business, "new_lead", lead);
        emitToBusiness(lead.business, "update_analytics", {});

        res.status(201).json(lead);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const captureLead = async (req, res) => {
    try {
        const { name, email, phone, message, dealSize, source } = req.body;

        const leadData = {
            name,
            email,
            phone,
            message,
            dealSize: dealSize || 0,
            source: source || "website",
            isSample: false,
            business: req.business._id
        };

        // Check AI Credits (req.business is available, but fetch fresh doc to save)
        const business = await Business.findById(req.business._id).populate('owner');

        if (business && business.aiCredits > 0) {
            let aiResult = { aiScore: 0, aiResponse: {} };
            const bName = (business.name || "NEXIO").replace("'s Business", "");
            let serviceFailed = false;

            try {
                // Primary AI Pipeline
                const result = await processLead({
                    name, email, phone, message,
                    business: business
                }, [], "", bName, business.owner?.name || "the Sales Team");

                aiResult = result;
                aiResult.aiResponse = normalizeAiResponse(aiResult.aiResponse);

                // Atomic credit deduction - ONLY on success
                business.aiCredits -= 1;
                await business.save();

                // Object assignment for lead data
                if (aiResult.aiScore !== undefined) {
                    leadData.aiScore = aiResult.aiScore;
                    leadData.aiPriority = aiResult.aiPriority || "low";
                }
                if (aiResult.aiNotes !== undefined) leadData.aiNotes = aiResult.aiNotes;
                leadData.aiResponse = aiResult.aiResponse;

                // 1. Safety Validation (Act Phase)
                const emailContent = getEmailDraft(aiResult.aiResponse);
                const safetyResult = validateAiOutput(emailContent);

                if (!safetyResult.safe) {
                    console.error(`[Safety Intercept] AI content rejected in captureLead: ${safetyResult.reason}`);
                    leadData.requiresReview = true;
                    leadData.aiNotes = (leadData.aiNotes || "") + `\n[Safety Block] AI-generated reply replaced with fallback: ${safetyResult.reason}`;
                    
                    // Trigger Fallback Email (Safe Mode)
                    aiResult.aiResponse = normalizeAiResponse({
                        ...aiResult.aiResponse,
                        emailSubject: `Re: Your Inquiry - ${bName}`,
                        emailBody: getFallbackEmail(bName, name),
                    });
                }
            } catch (e) {
                console.error("AI Service failure in captureLead:", e.message);
                serviceFailed = true;
                leadData.requiresReview = true;
                leadData.aiNotes = (leadData.aiNotes || "") + `\n[System Fallback] AI service unavailable, fallback email sent.`;
                
                // Trigger Rescue Fallback
                aiResult.aiResponse = normalizeAiResponse({
                    emailSubject: `Re: Your Inquiry - ${bName}`,
                    emailBody: getFallbackEmail(bName, name),
                });
            }

            // 2. Auto-Send Email (Unified Logic)
            const minScore = business.settings.minScoreToAutoReply || 50;
            const shouldSend = (aiResult.aiScore >= minScore) || serviceFailed;

            if (business.settings.autoReply && hasEmailDraft(aiResult.aiResponse) && shouldSend) {
                const inHours = isWithinWorkingHours(business);
                const canSend = inHours && (await checkAndIncrementEmailLimit(business));

                if (canSend) {
                    try {
                        const subject = aiResult.aiResponse.emailSubject || "Re: Your Inquiry - " + business.name;
                        const emailResult = await sendEmail(email, subject, getEmailDraft(aiResult.aiResponse), business.owner._id);
                        leadData.status = "contacted";
                        leadData.isAutoPilotContacted = true;
                        leadData.contactedAt = leadData.contactedAt || new Date();
                        aiResult.aiResponse.autoSent = true; 

                        if (emailResult && emailResult.threadId) {
                            leadData.gmailThreadId = emailResult.threadId;
                            leadData.lastEmailReceivedAt = new Date();
                        }
                    } catch (emailErr) {
                        console.error(`❌ [Auto-Pilot] Failed to send email to ${email}:`, emailErr.message);
                    }
                }
            }

            leadData.aiResponse = aiResult.aiResponse;

            // 3. Save to History
            const newHistory = [];
            if (message) {
                newHistory.push({ role: "user", content: message });
            }

            if (aiResult.aiScore > 0 || (aiResult.aiResponse && Object.keys(aiResult.aiResponse).length > 0)) {
                newHistory.push({ role: "model", content: JSON.stringify(aiResult.aiResponse) });
            }

            leadData.conversationHistory = newHistory;
            if (aiResult.newSummary) leadData.memorySummary = aiResult.newSummary;

            // Notify if limit hit
            if (aiResult.aiScore === 0) {
                await notifyAiLimit(business._id, aiResult.aiNotes, name || "a website lead");
            }
        } else {
            leadData.aiNotes = "AI Limit Reached. Upgrade to Premium for scoring.";
        }

        const lead = await Lead.create(leadData);

        // Smart Notification: Email the Business Owner (Internal System Email - Bypass Limits)
        if (business?.owner?.email) {
            try {
                const isHot = leadData.aiScore >= 70;
                const adminSubject = isHot ? `🔥 HOT LEAD: ${name} (Score: ${leadData.aiScore})` : `New Lead: ${name}`;

                const adminBody = `
                    <h3>${isHot ? '🔥 High Priority Lead Detected!' : 'New Lead Captured'}</h3>
                    <p><strong>NEXIO Analysis:</strong> ${leadData.aiNotes || 'Pending...'}</p>
                    <hr/>
                    <ul>
                        <li><strong>Name:</strong> ${name}</li>
                        <li><strong>Email:</strong> ${email}</li>
                        <li><strong>Phone:</strong> ${phone || 'N/A'}</li>
                        <li><strong>Score:</strong> ${leadData.aiScore || 0}/100</li>
                    </ul>
                    <p><em>"${message}"</em></p>
                    <br/>
                    <a href="${runtimeConfig.clientUrl}/dashboard/leads/${lead._id}" style="background:${isHot ? '#EF4444' : '#8B5CF6'}; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">
                        ${isHot ? 'Take Action Now' : 'View in Dashboard'}
                    </a>
                `;
                // Direct sendEmail call bypasses checkAndIncrementEmailLimit
                sendEmail(business.owner.email, adminSubject, adminBody);
            } catch (notifyErr) {
                console.error("Failed to notify business owner:", notifyErr);
            }
        }

        // Real-time Update
        emitToBusiness(lead.business, "new_lead", lead);
        emitToBusiness(lead.business, "update_analytics", {});

        res.status(201).json({
            success: true,
            message: "Lead captured successfully",
            lead
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getLeads = async (req, res) => {
    try {
        const leads = await Lead.find({
            business: req.user.businessId,
            $or: [
                { name: { $ne: 'Anonymous Visitor' } },
                { aiScore: { $gte: 50 } },
                { email: { $exists: true, $ne: "" } },
                { phone: { $exists: true, $ne: "" } }
            ]
        }).sort({ createdAt: -1 });

        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getLead = async (req, res) => {
    console.log(`[API] Fetching lead ID: ${req.params.id} for business: ${req.user.businessId}`);
    try {
        const lead = await Lead.findOne({
            _id: req.params.id,
            business: req.user.businessId
        });
        if (!lead) {
            console.log(`[API] Lead ${req.params.id} not found`);
            return res.status(404).json({ message: "Lead not found" });
        }
        console.log(`[API] Lead ${req.params.id} found, sending response`);
        res.json(lead);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const generateFollowup = async (req, res) => {
    try {
        const lead = await Lead.findOne({
            _id: req.params.id,
            business: req.user.businessId
        });
        if (!lead) return res.status(404).json({ message: "Lead not found" });

        // Trigger AI Logic (Re-using processLead or similar)
        const business = await Business.findById(req.user.businessId);
        const bName = business?.name?.replace("'s Business", "") || "NEXIO";
        const aiResult = await processLead({
            ...lead.toObject(),
            business: business
        }, lead.conversationHistory || [], lead.memorySummary || "", bName, req.user?.name || business?.owner?.name || "the Sales Team");
        aiResult.aiResponse = normalizeAiResponse(aiResult.aiResponse);

        // Update Lead with new insights (Ensure atomic update to avoid mismatches)
        if (aiResult.aiScore !== undefined && aiResult.aiScore !== null) {
            lead.aiScore = aiResult.aiScore;
            lead.aiPriority = aiResult.aiPriority || "low";
        }
        if (aiResult.aiNotes !== undefined) lead.aiNotes = aiResult.aiNotes;
        lead.aiResponse = aiResult.aiResponse;

        // Add to history ONLY if content exists or it's a quota hit warning
        if (aiResult.aiScore > 0 || aiResult.aiNotes === "LIMIT_REACHED" || (aiResult.aiResponse && Object.keys(aiResult.aiResponse).length > 0)) {
            lead.conversationHistory.push({
                role: "model",
                content: JSON.stringify({ ...aiResult.aiResponse, autoSent: false }),
                timestamp: new Date()
            });
        }

        await lead.save();
        res.json(lead);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { content, type = "email", subject } = req.body;
        const lead = await Lead.findOne({
            _id: req.params.id,
            business: req.user.businessId
        });
        if (!lead) return res.status(404).json({ message: "Lead not found" });

        const business = await Business.findById(req.user.businessId);

        // 1. Send via Email Service
        if (type === "email") {
            const canSend = await checkAndIncrementEmailLimit(business);
            if (!canSend) {
                return res.status(403).json({ message: "Daily email limit reached. Upgrade to Pro." });
            }

            try {
                // Ensure manual send uses the Gmail API by passing the owner ID
                const emailResult = await sendEmail(
                    lead.email,
                    subject || `Message from ${business.name}`,
                    content,
                    business.owner // <--- This activates Gmail OAuth
                );

                if (emailResult && emailResult.threadId) {
                    lead.gmailThreadId = emailResult.threadId;
                    lead.lastEmailReceivedAt = new Date();
                }
            } catch (emailError) {
                console.error("Manual email failed:", emailError);
                // Ideally we should rollback the increment here, but for now it's fine.
            }
        } else if (type === "whatsapp") {
            if (!business.whatsappConfig?.isActive || !business.whatsappConfig?.accessToken) {
                return res.status(400).json({ message: "WhatsApp integration is not active for this account." });
            }
            if (!lead.phone) {
                return res.status(400).json({ message: "This lead does not possess a documented phone number." });
            }
            try {
                await sendWhatsAppMessage(
                    lead.phone,
                    content,
                    business.whatsappConfig
                );
            } catch (whatsappError) {
                console.error("Manual WhatsApp dispatch failed:", whatsappError);
                return res.status(500).json({ message: "WhatsApp API rejected the message. Verify your Meta credentials." });
            }
        }

        // 2. Update History
        lead.conversationHistory.push({
            role: "model",
            content: content,
            timestamp: new Date()
        });

        // 3. Update Status
        lead.status = "contacted";
        lead.contactedAt = lead.contactedAt || new Date();

        await lead.save();
        res.json(lead);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const lead = await Lead.findOneAndUpdate(
            { _id: req.params.id, business: req.user.businessId },
            { read: true },
            { returnDocument: 'after' }
        );
        if (!lead) return res.status(404).json({ message: "Lead not found" });
        res.json(lead);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        await Lead.updateMany(
            { business: req.user.businessId, read: false },
            { read: true }
        );
        res.json({ success: true, message: "All leads marked as read" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateLead = async (req, res) => {
    try {
        const { status, dealSize } = req.body;
        const lead = await Lead.findOne({
            _id: req.params.id,
            business: req.user.businessId
        });

        if (!lead) return res.status(404).json({ message: "Lead not found" });

        // Update fields if provided
        if (dealSize !== undefined) lead.dealSize = dealSize;
        
        if (status && lead.status !== status) {
            const validStatuses = ["new", "contacted", "qualified", "converted", "lost"];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: "Invalid status" });
            }

            lead.status = status;

            // Anchor timestamps on first transition (Phase 2 logic)
            const now = new Date();
            if (status === "contacted" && !lead.contactedAt) lead.contactedAt = now;
            if (status === "qualified" && !lead.qualifiedAt) {
                lead.qualifiedAt = now;
                // If it reached qualified, it must have been contacted
                if (!lead.contactedAt) lead.contactedAt = now;
            }
            if (status === "converted" && !lead.convertedAt) {
                lead.convertedAt = now;
                // If it reached converted, it must have been contacted and qualified
                if (!lead.contactedAt) lead.contactedAt = now;
                if (!lead.qualifiedAt) lead.qualifiedAt = now;
            }
        }

        await lead.save();
        
        // Real-time Update for Dashboard
        emitToBusiness(lead.business, "update_analytics", {});
        
        res.json(lead);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
