import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.example.com",
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

/**
 * sendEmail
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML body content
 */
export const sendEmail = async (to, subject, html) => {
    try {
        if (!process.env.SMTP_USER || process.env.SMTP_USER === "user@example.com") {
            console.warn("⚠️ SMTP not configured. Skipping email send.");
            return;
        }

        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"Arlo AI" <noreply@arlo.ai>',
            to,
            subject,
            html,
        });

        console.log("📧 Email sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("❌ Error sending email:", error.message);
        throw error;
    }
};
