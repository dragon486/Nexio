import "dotenv/config";
import { sendEmail } from "./src/services/emailService.js";

async function verifyEmail() {
    console.log("--- Verifying Email Service ---");
    console.log("SMTP Host:", process.env.SMTP_HOST);
    console.log("SMTP User:", process.env.SMTP_USER);

    const to = "test@example.com"; // User should probably change this or I'll just see if it connects
    const subject = "Test Email from Arlo AI";
    const html = "<p>This is a <b>test email</b> from your AI Auto-Sender implementation.</p>";

    try {
        console.log(`Sending test email to ${to}...`);
        const info = await sendEmail(to, subject, html);
        console.log("✅ Email Sent Successfully!");
        console.log("Message ID:", info.messageId);
        if (info.messageId) {
            console.log("Verify link (if Ethereal): %s", import("nodemailer").then(n => n.getTestMessageUrl(info).catch(() => "")));
        }
    } catch (error) {
        console.error("❌ Email Sending Failed:", error.message);
        console.log("Please check your SMTP credentials in .env");
    }
}

verifyEmail();
