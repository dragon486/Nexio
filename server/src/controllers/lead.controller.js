import Lead from "../models/Lead.js";
import Business from "../models/Business.js";
import { processLead } from "../services/aiScoring.js";
import { sendEmail } from "../services/emailService.js";

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
            try {
                // Fetch existing history if any (for createLead it's likely empty unless we looked up by email, but keeping it simple)
                const aiResult = await processLead({
                    ...leadData,
                    businessSettings: business.settings
                }, [], "");
                Object.assign(leadData, aiResult);

                // Save to History
                leadData.conversationHistory = [
                    { role: "user", content: leadData.message },
                    { role: "model", content: JSON.stringify(aiResult.aiResponse) } // Storing simplified JSON for now
                ];
                if (aiResult.newSummary) leadData.memorySummary = aiResult.newSummary;

                // Deduct Credit
                business.aiCredits -= 1;
                await business.save();

                // Auto-Send Email
                if (business.settings.autoReply && aiResult.aiResponse?.email) {
                    await sendEmail(leadData.email, "Re: Your Inquiry - " + business.name, aiResult.aiResponse.email);
                }
            } catch (e) {
                console.error("AI Scoring failed:", e.message);
            }
        } else {
            leadData.aiNotes = "AI Limit Reached. Upgrade to Premium for scoring.";
        }

        const lead = await Lead.create(leadData);

        res.status(201).json(lead);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const captureLead = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        const leadData = {
            name,
            email,
            phone,
            message,
            business: req.business._id,
            source: "website"
        };

        // Check AI Credits (req.business is available, but fetch fresh doc to save)
        const business = await Business.findById(req.business._id);

        if (business && business.aiCredits > 0) {
            try {
                // Check for existing lead to get history? 
                // captureLead usually implies new lead, but if we want context, we should query by email first?
                // For now, treating as new.
                const aiResult = await processLead({
                    name, email, phone, message,
                    businessSettings: business.settings
                }, [], "");
                Object.assign(leadData, aiResult);

                leadData.conversationHistory = [
                    { role: "user", content: message },
                    { role: "model", content: JSON.stringify(aiResult.aiResponse) }
                ];
                if (aiResult.newSummary) leadData.memorySummary = aiResult.newSummary;

                // Deduct Credit
                business.aiCredits -= 1;
                await business.save();

                // Auto-Send Email
                if (business.settings.autoReply && aiResult.aiResponse?.email) {
                    await sendEmail(email, "Re: Your Inquiry - " + business.name, aiResult.aiResponse.email);
                }
            } catch (e) {
                console.error("AI Scoring failed:", e.message);
            }
        } else {
            leadData.aiNotes = "AI Limit Reached. Upgrade to Premium for scoring.";
        }

        const lead = await Lead.create(leadData);

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
            business: req.user.businessId
        }).sort({ aiScore: -1, createdAt: -1 });

        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getLead = async (req, res) => {
    try {
        const lead = await Lead.findOne({
            _id: req.params.id,
            business: req.user.businessId
        });
        if (!lead) return res.status(404).json({ message: "Lead not found" });
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
        // For now, we simulate a regeneration or call processLead again with "followup" intent
        // To keep it simple, we just re-run processLead with current context
        const aiResult = await processLead(lead, lead.conversationHistory || [], lead.memorySummary || "");

        // Update Lead with new insights
        lead.aiScore = aiResult.aiScore || lead.aiScore;
        lead.aiPriority = aiResult.aiPriority || lead.aiPriority;
        lead.aiNotes = aiResult.aiNotes || lead.aiNotes;

        // Add to history if new content generated
        if (aiResult.aiResponse) {
            lead.conversationHistory.push({
                role: "model",
                content: JSON.stringify(aiResult.aiResponse),
                timestamp: new Date()
            });
        }

        await lead.save();
        res.json(lead);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
