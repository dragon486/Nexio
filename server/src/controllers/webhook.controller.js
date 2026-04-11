import fs from "fs";
import Business from "../models/Business.js";
import Lead from "../models/Lead.js";
import { processLead } from "../services/aiScoring.js";
import { sendWhatsAppMessage } from "../services/whatsappService.js";
import { emitToBusiness } from "../utils/socket.js";
import { createNotification } from "../utils/notification.js";
import { normalizeAiResponse } from "../utils/aiResponse.js";
import HyperlocalBusiness from "../models/HyperlocalBusiness.js";
import { handleHyperlocalInbound } from "./hyperlocalWebhook.controller.js";

/**
 * handleMetaVerification
 * Required by Meta to verify the webhook endpoint.
 * GET /api/webhooks/whatsapp
 */
export const handleMetaVerification = async (req, res) => {
    try {
        const mode = req.query["hub.mode"];
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];

        // Since we are multi-tenant, we should check if ANY business has this verifyToken configured.
        // OR we can use a single environment-level verify token for the whole app.
        // For SaaS, it's usually 1 Meta App -> multiple clients, so 1 global token is best.
        // But if they have custom tokens per business, we check the DB.
        
        if (mode === "subscribe" && token && challenge) {
            // Secure Multi-Tenant Validation
            const globalToken = process.env.META_VERIFY_TOKEN;
            const business = await Business.findOne({ "whatsappConfig.verifyToken": token });
            const hlBusiness = await HyperlocalBusiness.findOne({ "whatsappConfig.verifyToken": token });

            if (token === globalToken || business || hlBusiness) {
                console.log(`[Webhook] Secure Meta verification granted for valid token.`);
                res.status(200).send(challenge);
            } else {
                console.warn(`[Webhook] Unauthorized Meta verification attempt blocked.`);
                res.sendStatus(403);
            }
        } else {
            res.sendStatus(400);
        }
    } catch (error) {
        console.error("Meta Verification Error:", error);
        res.sendStatus(500);
    }
};

/**
 * handleIncomingWhatsApp
 * Receives messages from Meta Cloud API.
 * POST /api/webhooks/whatsapp
 */
export const handleIncomingWhatsApp = async (req, res) => {
    try {
        const body = req.body;
        fs.appendFileSync('/tmp/webhook-log.txt', `[${new Date().toISOString()}] INCOMING POST req.body:\n${JSON.stringify(body, null, 2)}\n`);

        // Meta wraps data in "object" === "whatsapp_business_account"
        if (body.object) {
            if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages && body.entry[0].changes[0].value.messages[0]) {
                const value = body.entry[0].changes[0].value;
                const metadata = value.metadata;
                const phoneNumberId = metadata.phone_number_id;
                
                const message = value.messages[0];
                const senderPhone = message.from; // Sender's WhatsApp number
                const messageType = message.type; // Usually 'text', 'image', etc.
                
                let messageBody = "";
                if (messageType === 'text') {
                    messageBody = message.text.body;
                } else if (messageType === 'button') {
                    messageBody = message.button.text;
                } else {
                    messageBody = `[Sent a ${messageType} message]`; // Fallback for voice, images
                }

                console.log(`[Webhook] Incoming WhatsApp msg to ${phoneNumberId} from ${senderPhone}: "${messageBody}"`);

                // 1. Find the local Business (CRM or Hyperlocal)
                let business = await Business.findOne({ "whatsappConfig.phoneNumberId": phoneNumberId }).populate('owner');
                
                if (!business) {
                    // Fallback: Check if it's a Hyperlocal business
                    const hlBusiness = await HyperlocalBusiness.findOne({ "whatsappConfig.phoneNumberId": phoneNumberId });
                    if (hlBusiness) {
                        console.log(`[Webhook] Routing to Hyperlocal handler for business: ${hlBusiness.name}`);
                        // Fake the params.businessId that the hyperlocal handler expects
                        req.params.businessId = hlBusiness._id.toString();
                        return handleHyperlocalInbound(req, res);
                    }

                    console.error(`[Webhook] Business matching phoneNumberId ${phoneNumberId} not found or inactive.`);
                    return res.sendStatus(200); // Always return 200 to Meta
                }

                if (!business.whatsappConfig?.isActive) {
                    console.error(`[Webhook] Business ${business.name} has inactive WhatsApp config.`);
                    return res.sendStatus(200);
                }

                if (business.plan === "free" || business.plan === "starter") {
                    console.warn(`[Webhook] IGNORING payload for ${business.name} - Plan is ${business.plan} (WhatsApp Bot is a Pro feature)`);
                    return res.sendStatus(200);
                }

                // 2. Find or create the Lead
                // We'll search by phone, since that's what WhatsApp uses. We might need a generic email if new.
                let lead = await Lead.findOne({ phone: senderPhone, business: business._id });
                
                if (!lead) {
                    const senderName = value.contacts && value.contacts[0].profile ? value.contacts[0].profile.name : senderPhone;
                    lead = await Lead.create({
                        name: senderName,
                        phone: senderPhone,
                        email: `${senderPhone}@whatsapp.lead`, // Placeholder since we only have phone
                        message: messageBody, // Initial message
                        source: "whatsapp",
                        business: business._id,
                        isSample: false
                    });
                    
                    // Emit to dashboard
                    emitToBusiness(business._id, "new_lead", lead);
                }

                // 3. Append user message to history
                lead.conversationHistory.push({ role: "user", content: messageBody, timestamp: new Date() });
                lead.read = false;
                
                // 4. Determine AI Response Mode (Are we on AutoPilot?)
                // Also, only generate AI response if the message meets criteria (e.g. no human intervention flag)
                if (business.settings.autoReply) {
                    try {
                        const bName = (business.name || "NEXIO").replace("'s Business", "");
                        const aiResult = await processLead(
                            { ...lead.toObject(), message: messageBody, business }, 
                            lead.conversationHistory, 
                            lead.memorySummary || "", 
                            bName, 
                            business.owner?.name || "the Team"
                        );

                        // Update AI fields
                        if (aiResult.aiScore !== undefined) lead.aiScore = aiResult.aiScore;
                        if (aiResult.aiPriority) lead.aiPriority = aiResult.aiPriority;
                        if (aiResult.aiNotes) lead.aiNotes = aiResult.aiNotes;
                        if (aiResult.newSummary) lead.memorySummary = aiResult.newSummary;
                        aiResult.aiResponse = normalizeAiResponse(aiResult.aiResponse);
                        lead.aiResponse = aiResult.aiResponse;

                        const responseText = aiResult.aiResponse?.whatsapp || "I've received your message and our team is looking into it. I'll update you shortly!";

                        // Record AI response in DB as JSON for dashboard symmetry
                        lead.conversationHistory.push({ 
                            role: "model", 
                            content: JSON.stringify({ ...aiResult.aiResponse, autoSent: true }), 
                            timestamp: new Date() 
                        });
                        lead.status = "contacted";
                        lead.contactedAt = lead.contactedAt || new Date();

                        // 5. Send message back via WhatsApp
                        try {
                            await sendWhatsAppMessage(senderPhone, responseText, business.whatsappConfig);
                        } catch (sendErr) {
                            console.error("[Webhook] Failed to send via Meta Graph (Simulation Mode or Invalid Token):", sendErr.message);
                        }
                    } catch (aiErr) {
                        console.error("[Webhook] AI Processing or Sending failed:", aiErr);
                        // Optional fallback: send a static message if AI fails
                    }
                }
                
                await lead.save();
                
                // Notify dashboard of message update
                emitToBusiness(business._id, "update_analytics", {});
                emitToBusiness(business._id, "new_message", { leadId: lead._id, content: messageBody, timestamp: new Date() });

                // Create persistent notification for Dashboard Bell
                if (lead.aiScore >= 50) {
                    await createNotification(business._id, {
                        type: "lead",
                        title: `New WhatsApp Lead!`,
                        message: `${lead.name} sent a message via WhatsApp. AI Score: ${lead.aiScore}%`,
                        link: `/dashboard/leads/${lead._id}`,
                        meta: { leadId: lead._id, channel: "whatsapp" }
                    });
                }

            }
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error("Webhook POST Error:", error);
        res.sendStatus(500);
    }
};
