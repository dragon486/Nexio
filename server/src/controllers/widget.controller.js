import Lead from "../models/Lead.js";
import Business from "../models/Business.js";
import { processLead } from "../services/aiScoring.js";
import { emitToBusiness } from "../utils/socket.js";
import { createNotification } from "../utils/notification.js";
import { normalizeAiResponse } from "../utils/aiResponse.js";
import { getEmailDraft } from "../utils/aiResponse.js";
import { validateAiOutput, getFallbackEmail } from "../utils/safetyGuard.js";

export const getWidgetConfig = async (req, res) => {
    try {
        const business = req.business;
        // Strip out the "'s Business" if it exists for a cleaner frontend name
        const bName = (business.name || "NEXIO").replace("'s Business", "");
        
        // Mark the widget as active if this is the first ping
        if (!business.settings?.isWidgetActive) {
            await Business.findByIdAndUpdate(business._id, {
                $set: { "settings.isWidgetActive": true }
            });
        }
        
        res.json({
            name: bName,
            color: business.settings?.brandColor || "#3b82f6", // Default fallback
            welcomeMessage: business.settings?.widgetWelcome || `Hi! I'm the AI assistant for ${bName}. How can I help you today?`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const handleWidgetChat = async (req, res) => {
    try {
        const { message, leadId } = req.body;
        const business = await Business.findById(req.business._id).populate('owner');

        let isCreditExhausted = false;
        if (!business) {
            return res.status(403).json({ error: "Business not found." });
        }
        if (business.aiCredits <= 0) {
            isCreditExhausted = true;
        }

        let lead;
        const bName = (business.name || "NEXIO").replace("'s Business", "");

        if (leadId) {
            // Fetch existing lead
            lead = await Lead.findOne({ _id: leadId, business: business._id });
        }

        if (!lead) {
            // Create anonymous lead on first contact
            lead = await Lead.create({
                name: "Anonymous Visitor",
                business: business._id,
                source: "widget",
                message: message,
                status: "new",
                isSample: false,
                dealSize: 0,
                conversationHistory: []
            });
        }

        // We prepare the leadData for the AI
        const leadData = lead.toObject();
        leadData.message = message; // Set latest message

        let aiResult = { aiScore: 0, aiResponse: {} };

        if (isCreditExhausted) {
            // Do not call processLead, respond gracefully.
            lead.aiNotes = "AI Limit Reached. Upgrade to Premium for scoring.";
            aiResult.aiResponse = normalizeAiResponse({
                emailBody: "Thanks for reaching out! Our team has received your message and will be in touch shortly. Please leave your email or phone number if you haven't already so we can get back to you!",
            });
        } else {
            try {
                // Run through the AI pipe
                const result = await processLead(
                    { ...leadData, business: business }, 
                    lead.conversationHistory, 
                    lead.memorySummary || "", 
                    bName, 
                    business.owner?.name || "the Sales Team",
                    "widget"
                );

                aiResult = result;
                aiResult.aiResponse = normalizeAiResponse(aiResult.aiResponse);

                // Cost credit only if successful call
                business.aiCredits -= 1;
                await business.save();

                // Update Lead logic
                if (aiResult.aiScore !== undefined) {
                    lead.aiScore = Math.max(lead.aiScore || 0, aiResult.aiScore);
                    lead.aiPriority = aiResult.aiPriority || "low";
                }
                
                // Save Extracted Contact Info from the conversation
                if (aiResult.extractedName && (!lead.name || lead.name === "Anonymous Visitor")) {
                    lead.name = aiResult.extractedName;
                }
                if (aiResult.extractedEmail) lead.email = aiResult.extractedEmail;
                if (aiResult.extractedPhone) lead.phone = aiResult.extractedPhone;
                if (aiResult.aiNotes !== undefined) lead.aiNotes = aiResult.aiNotes;
                lead.aiResponse = aiResult.aiResponse;
                if (aiResult.newSummary) lead.memorySummary = aiResult.newSummary;

            } catch (e) {
                console.error("AI Service failure in Widget Chat:", e.message);
                aiResult.aiResponse = normalizeAiResponse({
                    chatResponse: "I'm having a bit of trouble connecting right now. Please try again or leave your contact info!",
                    emailBody: "I'm having a bit of trouble connecting right now. Please try again or leave your contact info!", 
                });
            }
        }

        // Update history synchronously to DB
        lead.conversationHistory.push({ role: "user", content: message });
        
        // Add the plain text response from AI (Prefer chatResponse for widget, fallback to emailBody)
        const replyContent = aiResult.aiResponse.chatResponse || aiResult.aiResponse.emailBody || aiResult.aiResponse.email || "Thanks, let me get back to you shortly.";
        
        // Save the detailed stringified JSON block like `captureLead` does, OR just save the reply?
        // Wait, standard `captureLead` saves `JSON.stringify(aiResult.aiResponse)` as model output for the dashboard view.
        lead.conversationHistory.push({ role: "model", content: JSON.stringify(aiResult.aiResponse) });

        await lead.save();

        // Emit realtime update ONLY if it crosses the threshold or has real contact info
        const isQualifiedLead = lead.name !== "Anonymous Visitor" || lead.aiScore >= 50 || (lead.email && lead.email !== "") || (lead.phone && lead.phone !== "");
        
        if (isQualifiedLead) {
            emitToBusiness(lead.business, "new_lead", lead); 
            emitToBusiness(lead.business, "update_analytics", {});

            // Create persistent notification for Dashboard badge
            const intentInfo = lead.email || lead.phone || "High Intent Interaction";
            await createNotification(lead.business, {
                type: "lead",
                title: `New High-Intent Lead!`,
                message: `${lead.name} (${intentInfo}) is ready for review.`,
                link: `/dashboard/leads/${lead._id}`,
                meta: { leadId: lead._id, score: lead.aiScore }
            });
        }

        // Return precisely what the widget needs
        res.json({
            success: true,
            leadId: lead._id,
            reply: replyContent,
            score: lead.aiScore
        });

    } catch (error) {
        console.error("Widget chat error:", error);
        res.status(500).json({ error: error.message });
    }
};
