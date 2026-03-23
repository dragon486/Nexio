import Business from "../models/Business.js";
import crypto from 'crypto';

export const createBusiness = async (req, res) => {
    try {
        const { name, industry } = req.body;
        const business = await Business.create({
            name,
            industry,
            owner: req.user._id
        });
        res.status(201).json(business);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMyBusiness = async (req, res) => {
    try {
        // Find business by owner ID (which comes from auth middleware)
        const business = await Business.findOne({ owner: req.user._id });
        if (!business) {
            return res.status(404).json({ message: "Business not found" });
        }

        // Patch: Generate API Keys if missing (for legacy data)
        let updated = false;
        if (!business.apiKey) {
            business.apiKey = "sk_live_" + crypto.randomBytes(24).toString("hex");
            updated = true;
        }
        if (!business.publicKey) {
            business.publicKey = "pk_live_" + crypto.randomBytes(24).toString("hex");
            updated = true;
        }

        if (updated) {
            await business.save();
        }

        res.json(business);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateBusiness = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Special handling for nested settings to avoid overwriting the whole object
        let finalUpdates = { ...updates };
        if (updates.settings) {
            delete finalUpdates.settings;
            // Recursively flatten the settings object for Mongoose $set
            const flatten = (obj, prefix = 'settings') => {
                for (const key in obj) {
                    const value = obj[key];
                    const path = `${prefix}.${key}`;
                    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
                        flatten(value, path);
                    } else {
                        finalUpdates[path] = value;
                    }
                }
            };
            flatten(updates.settings);
        }

        const business = await Business.findOneAndUpdate(
            { _id: id, owner: req.user._id },
            { $set: finalUpdates },
            { returnDocument: 'after' }
        );

        if (!business) {
            return res.status(404).json({ message: "Business not found" });
        }

        res.json(business);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
