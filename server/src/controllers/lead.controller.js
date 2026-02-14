import Lead from "../models/Lead.js";

export const createLead = async (req, res) => {
    try {
        const lead = await Lead.create({
            ...req.body,
            business: req.user?.businessId || req.body.businessId,
            source: "dashboard"
        });

        res.status(201).json(lead);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const captureLead = async (req, res) => {
    try {
        const { name, email, phone, business } = req.body;

        if (!business) {
            return res.status(400).json({ message: "Business ID required" });
        }

        const lead = await Lead.create({
            name,
            email,
            phone,
            business,
            source: "website"
        });

        res.status(201).json({
            success: true,
            message: "Lead captured successfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getLeads = async (req, res) => {
    try {
        const leads = await Lead.find({
            business: req.user.businessId
        }).sort({ createdAt: -1 });

        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
