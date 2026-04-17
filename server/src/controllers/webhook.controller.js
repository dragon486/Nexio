import fs from "fs";
import Business from "../models/Business.js";
import Lead from "../models/Lead.js";
import { emitToBusiness } from "../utils/socket.js";
import { createNotification } from "../utils/notification.js";
import { enqueueLead } from "../queues/leadQueue.js";
import HyperlocalBusiness from "../models/HyperlocalBusiness.js";
import { handleHyperlocalInbound } from "./hyperlocalWebhook.controller.js";

/**
 * handleMetaVerification
 * Required by Meta to verify the webhook endpoint.
 */
export const handleMetaVerification = async (req, res) => {
    try {
        const mode = req.query["hub.mode"];
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];

        if (mode === "subscribe" && token && challenge) {
            const globalToken = process.env.META_VERIFY_TOKEN;
            const business = await Business.findOne({ "whatsappConfig.verifyToken": token });
            const hlBusiness = await HyperlocalBusiness.findOne({ "whatsappConfig.verifyToken": token });

            if (token === globalToken || business || hlBusiness) {
                console.log(`[Webhook] Secure Meta verification granted.`);
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
 */
export const handleIncomingWhatsApp = async (req, res) => {
    try {
        const body = req.body;
        // Basic logging
        fs.appendFileSync('/tmp/webhook-log.txt', `[${new Date().toISOString()}] INBOUND WHATSAPP\n`);

        if (body.object === "whatsapp_business_account") {
            const entry = body.entry?.[0];
            const change = entry?.changes?.[0]?.value;
            const message = change?.messages?.[0];

            if (message) {
                const phoneNumberId = change.metadata.phone_number_id;
                const senderPhone = message.from;
                const messageId = message.id;

                let messageBody = "";
                if (message.type === 'text') messageBody = message.text.body;
                else if (message.type === 'button') messageBody = message.button.text;
                else messageBody = `[Sent a ${message.type} message]`;

                console.log(`[Webhook] Inbound: "${messageBody}" from ${senderPhone}`);

                // 1. Resolve Business
                const business = await Business.findOne({ "whatsappConfig.phoneNumberId": phoneNumberId }).populate('owner');
                
                if (!business) {
                    const hlBusiness = await HyperlocalBusiness.findOne({ "whatsappConfig.phoneNumberId": phoneNumberId });
                    if (hlBusiness) {
                        req.params.businessId = hlBusiness._id.toString();
                        return handleHyperlocalInbound(req, res);
                    }
                    return res.sendStatus(200);
                }

                // Plan Check
                if (!business.whatsappConfig?.isActive || business.plan === "free") {
                    return res.sendStatus(200);
                }

                // 2. Resolve/Create Lead
                let lead = await Lead.findOne({ phone: senderPhone, business: business._id });
                if (!lead) {
                    const senderName = change.contacts?.[0]?.profile?.name || senderPhone;
                    lead = await Lead.create({
                        name: senderName,
                        phone: senderPhone,
                        email: `${senderPhone}@whatsapp.lead`,
                        source: "whatsapp",
                        business: business._id,
                        processingStatus: "pending"
                    });
                    emitToBusiness(business._id, "new_lead", lead);
                }

                // 3. Update Status and History
                lead.conversationHistory.push({ role: "user", content: messageBody, timestamp: new Date() });
                lead.read = false;
                lead.processingStatus = "pending";
                await lead.save();

                // 4. Enqueue for AI Processing
                if (business.settings.autoReply) {
                    await enqueueLead({
                        leadId: lead._id,
                        initiatorName: business.owner?.name || "the Team"
                    }, `whatsapp:${messageId}`); // Idempotency per WhatsApp message ID
                }

                // Real-time Update
                emitToBusiness(business._id, "update_analytics", {});
                emitToBusiness(business._id, "new_message", { leadId: lead._id, content: messageBody, timestamp: new Date() });

                // Notification (Delayed check in worker, but we can do a quick check here if score existed)
                if (lead.aiScore >= 50) {
                    await createNotification(business._id, {
                        type: "lead",
                        title: `Message from ${lead.name}`,
                        message: `New WhatsApp message. AI Score: ${lead.aiScore}%`,
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
