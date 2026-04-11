import Business from "../models/Business.js";
import crypto from 'crypto';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

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

        // Special handling for nested objects to avoid overwriting the whole object
        let finalUpdates = { ...updates };
        
        const flatten = (obj, prefix) => {
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

        if (updates.settings) {
            delete finalUpdates.settings;
            flatten(updates.settings, 'settings');
        }

        if (updates.whatsappConfig) {
            delete finalUpdates.whatsappConfig;
            flatten(updates.whatsappConfig, 'whatsappConfig');
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

export const uploadKnowledgeBase = async (req, res) => {
    try {
        const { id } = req.params;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "No PDF file uploaded" });
        }

        if (file.mimetype !== "application/pdf") {
            return res.status(400).json({ message: "Only PDF files are supported" });
        }

        // Parse PDF text
        const pdfData = await pdfParse(file.buffer);
        let extractedText = pdfData.text || "";
        
        // Clean up excessive whitespace
        extractedText = extractedText.replace(/\s+/g, ' ').trim();

        // Find business and append text
        const business = await Business.findOne({ _id: id, owner: req.user._id });
        if (!business) {
            return res.status(404).json({ message: "Business not found" });
        }

        // Keep existing text and append new text
        const currentKb = business.settings?.knowledgeBase || "";
        const updatedKb = currentKb ? `${currentKb}\n\n[Appended PDF Data]:\n${extractedText}` : extractedText;

        business.settings = {
            ...business.settings,
            knowledgeBase: updatedKb
        };

        await business.save();

        res.json({ message: "Knowledge base updated successfully", business });
    } catch (error) {
        console.error("PDF Parsing Error:", error);
        res.status(500).json({ error: "Failed to process PDF file" });
    }
};
