import Lead from "../models/Lead.js";
import Business from "../models/Business.js";
import { emitToBusiness } from "../utils/socket.js";
import { enqueueLead } from "../queues/leadQueue.js";
import { runtimeConfig } from "../config/env.js";

export const createLead = async (req, res) => {
    try {
        const leadData = {
            ...req.body,
            business: req.user?.businessId || req.body.businessId,
            source: req.body.source || "dashboard",
            processingStatus: "pending",
            meta: req.body.meta || {},
            isSample: req.body.isSample || false
        };

        const lead = await Lead.create(leadData);

        // Enqueue background processing
        await enqueueLead({
            leadId: lead._id,
            initiatorName: req.user?.name || "the Sales Team",
            meta: lead.meta // Context propagation
        });

        // Real-time Update (Initial skeleton)
        emitToBusiness(lead.business, "new_lead", lead);
        emitToBusiness(lead.business, "update_analytics", {});

        res.status(202).json({
            success: true,
            message: "Lead created and queued for processing",
            lead
        });
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
            isSample: req.body.isSample || false,
            meta: req.body.meta || {},
            business: req.business._id,
            processingStatus: "pending"
        };

        const lead = await Lead.create(leadData);

        // Fetch business owner name for the AI context
        const business = await Business.findById(req.business._id).populate('owner');

        // Enqueue background processing
        await enqueueLead({
            leadId: lead._id,
            initiatorName: business?.owner?.name || "the Sales Team",
            meta: lead.meta // Context propagation
        });

        // Real-time Update
        emitToBusiness(lead.business, "new_lead", lead);
        emitToBusiness(lead.business, "update_analytics", {});

        res.status(202).json({
            success: true,
            message: "Lead captured and queued for processing",
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
