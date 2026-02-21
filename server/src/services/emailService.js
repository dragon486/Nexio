import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import User from "../models/User.js";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.example.com",
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendEmail = async (to, subject, html, userId = null) => {
    try {
        const formattedHtml = typeof html === 'string' ? html.replace(/\n/g, '<br>') : html;

        if (userId) {
            const user = await User.findById(userId);
            if (user && user.gmailRefreshToken) {
                console.log(`📧 [EmailService] Using Gmail API for: ${user.gmailEmail || user.email}`);

                const oauth2Client = new google.auth.OAuth2(
                    process.env.GOOGLE_CLIENT_ID,
                    process.env.GOOGLE_CLIENT_SECRET
                );

                oauth2Client.setCredentials({
                    refresh_token: user.gmailRefreshToken,
                    access_token: user.gmailAccessToken
                });

                // Auto-refresh token if needed
                if (!user.gmailTokenExpiry || user.gmailTokenExpiry < new Date(Date.now() + 60000)) {
                    console.log("🔄 [EmailService] Token expired. Refreshing...");
                    const { credentials } = await oauth2Client.refreshAccessToken();
                    user.gmailAccessToken = credentials.access_token;
                    user.gmailTokenExpiry = new Date(credentials.expiry_date);
                    await user.save();
                    console.log("✅ [EmailService] Token refreshed successfully.");
                }

                const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

                const message = [
                    `To: ${to}`,
                    `Subject: ${subject}`,
                    `Content-Type: text/html; charset=utf-8`,
                    '',
                    formattedHtml
                ].join('\n');

                const raw = Buffer.from(message)
                    .toString('base64')
                    .replace(/\+/g, '-')
                    .replace(/\//g, '_')
                    .replace(/=+$/, '');

                const res = await gmail.users.messages.send({
                    userId: 'me',
                    requestBody: { raw }
                });

                console.log("📧 [EmailService] Gmail API Email sent successfully: %s", res.data.id);
                // Return exactly what the controller expects for thread tracking
                return {
                    messageId: res.data.id,
                    threadId: res.data.threadId
                };
            }
        }

        // Fallback to default SMTP
        if (!process.env.SMTP_USER || process.env.SMTP_USER === "user@example.com") {
            console.warn("⚠️ [EmailService] Default SMTP not configured. Skipping email.");
            return;
        }

        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"Arlo AI" <noreply@arlo.ai>',
            to,
            subject,
            html: formattedHtml, // <-- Use the converted HTML wrapper
        });

        console.log("📧 [EmailService] System SMTP Email sent successfully: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("❌ [EmailService] Error details:", error.message || error);
        throw error;
    }
};
