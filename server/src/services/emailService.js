import nodemailer from "nodemailer";
import { google } from "googleapis";
import User from "../models/User.js";
import { runtimeConfig } from "../config/env.js";

const transporter = nodemailer.createTransport({
    host: runtimeConfig.smtp.host,
    port: runtimeConfig.smtp.port,
    secure: runtimeConfig.smtp.port === 465,
    auth: {
        user: runtimeConfig.smtp.user,
        pass: runtimeConfig.smtp.pass,
    },
});

const sendViaSmtp = async (to, subject, html) => {
    if (!runtimeConfig.smtp.user || runtimeConfig.smtp.user === "user@example.com" || !runtimeConfig.smtp.pass) {
        console.warn("⚠️ [EmailService] Default SMTP not configured. Skipping email.");
        return null;
    }

    const info = await transporter.sendMail({
        from: runtimeConfig.smtp.from,
        to,
        subject,
        html,
    });

    console.log("📧 [EmailService] System SMTP Email sent successfully: %s", info.messageId);
    return { ...info, provider: "smtp" };
};

export const sendEmail = async (to, subject, html, userId = null) => {
    try {
        const formattedHtml = typeof html === 'string' ? html.replace(/\n/g, '<br>') : html;
        const resolvedUserId = typeof userId === "object" ? userId?._id || userId?.id : userId;

        if (resolvedUserId && runtimeConfig.google.clientId && runtimeConfig.google.clientSecret) {
            const user = await User.findById(resolvedUserId);
            if (user?.gmailRefreshToken) {
                console.log(`📧 [EmailService] Using Gmail API for: ${user.gmailEmail || user.email}`);

                const oauth2Client = new google.auth.OAuth2(
                    runtimeConfig.google.clientId,
                    runtimeConfig.google.clientSecret
                );

                oauth2Client.setCredentials({
                    refresh_token: user.gmailRefreshToken,
                    access_token: user.gmailAccessToken
                });

                try {
                    if (!user.gmailTokenExpiry || user.gmailTokenExpiry < new Date(Date.now() + 60000)) {
                        console.log("🔄 [EmailService] Token expired. Refreshing...");
                        const { credentials } = await oauth2Client.refreshAccessToken();
                        user.gmailAccessToken = credentials.access_token;
                        user.gmailTokenExpiry = credentials.expiry_date ? new Date(credentials.expiry_date) : user.gmailTokenExpiry;
                        user.gmailStatus = "active";
                        await user.save();
                        oauth2Client.setCredentials({
                            refresh_token: user.gmailRefreshToken,
                            access_token: user.gmailAccessToken
                        });
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

                    user.gmailStatus = "active";
                    await user.save();
                    console.log("📧 [EmailService] Gmail API Email sent successfully: %s", res.data.id);
                    return {
                        messageId: res.data.id,
                        threadId: res.data.threadId,
                        provider: "gmail"
                    };
                } catch (gmailError) {
                    const errorMessage = gmailError?.message || String(gmailError);
                    if (errorMessage.includes("invalid_grant")) {
                        user.gmailStatus = "error";
                        await user.save();
                    }
                    console.warn("⚠️ [EmailService] Gmail send failed. Falling back to SMTP:", errorMessage);
                }
            }
        }

        return await sendViaSmtp(to, subject, formattedHtml);
    } catch (error) {
        console.error("❌ [EmailService] Error details:", error.message || error);
        throw error;
    }
};
