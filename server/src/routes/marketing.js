import express from "express";
import { sendEmail } from "../services/emailService.js";
import { runtimeConfig } from "../config/env.js";
import logger from "../utils/logger.js";

const router = express.Router();

// POST /api/marketing/contact
// Public endpoint for landing page lead capture
router.post("/contact", async (req, res) => {
    try {
        const { name, email, protocol, scope } = req.body;

        if (!name || !email || !scope) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing required architectural parameters (Name, Email, Scope)." 
            });
        }

        logger.info(`📝 [Marketing] New Lead captured: ${name} (${email})`);

        // Prepare the notification email for the Nexio Owner (Adel)
        const subject = `🚀 New Nexio Lead: ${name} (${protocol})`;
        const html = `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #3b82f6;">Nexio Lead Alert</h2>
                <p>A new architectural sync has been requested via the Nexio Landing Page.</p>
                <hr style="border: none; border-top: 1px solid #eee;" />
                <p><strong>Lead Name:</strong> ${name}</p>
                <p><strong>Enterprise Email:</strong> ${email}</p>
                <p><strong>Project Protocol:</strong> ${protocol}</p>
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 20px;">
                    <p><strong>Project Scope:</strong></p>
                    <p>${scope}</p>
                </div>
                <hr style="border: none; border-top: 1px solid #eee;" />
                <p style="font-size: 12px; color: #666;">This message was generated automatically by the Nexio Production Pipeline.</p>
            </div>
        `;

        // Send to the system owner (Adel)
        // Defaulting to the SMTP user which is usually the owner's mail
        await sendEmail(runtimeConfig.smtp.user, subject, html);

        res.status(200).json({ 
            success: true, 
            message: "Signal received. Our technical leads will initiate contact shortly." 
        });
    } catch (error) {
        logger.error("❌ [Marketing] Error processing contact request:", error);
        res.status(500).json({ 
            success: false, 
            message: "Transmission failed. Please retry or contact support@nexio.ai directly." 
        });
    }
});

export default router;
