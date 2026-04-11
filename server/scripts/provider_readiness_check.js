import "dotenv/config";
import { google } from "googleapis";
import connectDB, { disconnectDB } from "../src/config/db.js";
import User from "../src/models/User.js";
import Business from "../src/models/Business.js";
import { runtimeConfig } from "../src/config/env.js";
import { sendEmail } from "../src/services/emailService.js";
import { sendWhatsAppMessage } from "../src/services/whatsappService.js";

const startedAt = new Date();
const timestamp = startedAt.toISOString();
const results = [];

const getErrorMessage = (error) =>
    error?.response?.data?.error?.message ||
    error?.response?.data?.message ||
    error?.message ||
    String(error);

const pushResult = (provider, status, details) => {
    const result = { provider, status, ...details };
    results.push(result);
    const label = status === "passed" ? "PASS" : "FAIL";
    console.log(`[${label}] ${provider.toUpperCase()}`, JSON.stringify(details));
};

const normalizePhone = (value) => (value || "").replace(/[^\d]/g, "");

const getEmailRecipient = (user) =>
    (process.env.PROVIDER_TEST_EMAIL || process.env.SMTP_TEST_RECIPIENT || user?.gmailEmail || user?.email || runtimeConfig.smtp.user || "").trim();

const getWhatsAppRecipient = (business) =>
    normalizePhone(process.env.PROVIDER_TEST_PHONE || process.env.WHATSAPP_TEST_PHONE || business?.settings?.businessPhone || "");

const sortGmailCandidates = (users) =>
    [...users].sort((left, right) => {
        const leftScore = left.gmailStatus === "active" ? 1 : 0;
        const rightScore = right.gmailStatus === "active" ? 1 : 0;
        return rightScore - leftScore || right.updatedAt.getTime() - left.updatedAt.getTime();
    });

const createGmailClient = async (user) => {
    const oauth2Client = new google.auth.OAuth2(
        runtimeConfig.google.clientId,
        runtimeConfig.google.clientSecret
    );

    oauth2Client.setCredentials({
        refresh_token: user.gmailRefreshToken,
        access_token: user.gmailAccessToken
    });

    if (!user.gmailTokenExpiry || user.gmailTokenExpiry < new Date(Date.now() + 60000)) {
        try {
            const { credentials } = await oauth2Client.refreshAccessToken();
            user.gmailAccessToken = credentials.access_token;
            if (credentials.expiry_date) {
                user.gmailTokenExpiry = new Date(credentials.expiry_date);
            }
            user.gmailStatus = "active";
            await user.save();
            oauth2Client.setCredentials({
                refresh_token: user.gmailRefreshToken,
                access_token: user.gmailAccessToken
            });
        } catch (error) {
            if (getErrorMessage(error).includes("invalid_grant")) {
                user.gmailStatus = "error";
                await user.save();
            }
            throw error;
        }
    }

    return google.gmail({ version: "v1", auth: oauth2Client });
};

const runGmailCheck = async () => {
    if (!runtimeConfig.google.clientId || !runtimeConfig.google.clientSecret) {
        pushResult("gmail", "failed", { reason: "Google OAuth credentials are not configured." });
        return;
    }

    const candidates = sortGmailCandidates(await User.find({ gmailRefreshToken: { $exists: true, $ne: "" } }));
    if (candidates.length === 0) {
        pushResult("gmail", "failed", { reason: "No Gmail-connected user was found in the database." });
        return;
    }

    let lastError = "No valid Gmail connection was found.";

    for (const user of candidates) {
        try {
            const gmail = await createGmailClient(user);
            const profile = await gmail.users.getProfile({ userId: "me" });
            const recipient = getEmailRecipient(user);

            if (!recipient) {
                throw new Error("No safe email recipient is configured for the Gmail provider check.");
            }

            const sendResult = await sendEmail(
                recipient,
                `[NEXIO Launch Check] Gmail API ${timestamp}`,
                `NEXIO Gmail provider verification completed at ${timestamp}.`,
                user._id
            );

            if (sendResult?.provider !== "gmail") {
                throw new Error("Gmail send fell back to SMTP instead of using the Gmail API.");
            }

            pushResult("gmail", "passed", {
                account: user.gmailEmail || user.email,
                mailbox: profile.data.emailAddress,
                recipient,
                messageId: sendResult?.messageId || null,
                threadId: sendResult?.threadId || null
            });
            return;
        } catch (error) {
            lastError = `${user.email}: ${getErrorMessage(error)}`;
        }
    }

    pushResult("gmail", "failed", { reason: lastError });
};

const runSmtpCheck = async () => {
    if (!runtimeConfig.smtp.user || !runtimeConfig.smtp.pass || runtimeConfig.smtp.user === "user@example.com") {
        pushResult("smtp", "failed", { reason: "SMTP credentials are not configured." });
        return;
    }

    const fallbackUser = await User.findOne({ gmailRefreshToken: { $exists: true, $ne: "" } }).sort({ updatedAt: -1 });
    const recipient = getEmailRecipient(fallbackUser);

    if (!recipient) {
        pushResult("smtp", "failed", { reason: "No safe email recipient is configured for the SMTP provider check." });
        return;
    }

    try {
        const sendResult = await sendEmail(
            recipient,
            `[NEXIO Launch Check] SMTP ${timestamp}`,
            `NEXIO SMTP provider verification completed at ${timestamp}.`
        );

        if (sendResult?.provider !== "smtp") {
            throw new Error("SMTP provider check did not use the SMTP transport.");
        }

        pushResult("smtp", "passed", {
            recipient,
            messageId: sendResult?.messageId || null
        });
    } catch (error) {
        pushResult("smtp", "failed", { reason: getErrorMessage(error), recipient });
    }
};

const runWhatsAppCheck = async () => {
    const businesses = await Business.find({
        "whatsappConfig.isActive": true,
        "whatsappConfig.phoneNumberId": { $exists: true, $ne: "" },
        "whatsappConfig.accessToken": { $exists: true, $ne: "" }
    }).sort({ updatedAt: -1 });

    if (businesses.length === 0) {
        pushResult("whatsapp", "failed", { reason: "No active WhatsApp business configuration was found." });
        return;
    }

    let lastError = "No safe WhatsApp test recipient is configured.";

    for (const business of businesses) {
        const recipient = getWhatsAppRecipient(business);

        if (!recipient) {
            lastError = `${business.name}: set PROVIDER_TEST_PHONE/WHATSAPP_TEST_PHONE or settings.businessPhone before running the check.`;
            continue;
        }

        try {
            const response = await sendWhatsAppMessage(
                recipient,
                `NEXIO launch verification message at ${timestamp}.`,
                business.whatsappConfig
            );

            pushResult("whatsapp", "passed", {
                business: business.name,
                recipient,
                messageId: response?.messages?.[0]?.id || null
            });
            return;
        } catch (error) {
            lastError = `${business.name}: ${getErrorMessage(error)}`;
        }
    }

    pushResult("whatsapp", "failed", { reason: lastError });
};

const main = async () => {
    await connectDB();

    try {
        console.log(`Running provider readiness check at ${timestamp}`);
        await runGmailCheck();
        await runSmtpCheck();
        await runWhatsAppCheck();
    } finally {
        await disconnectDB();
    }

    const failed = results.filter((result) => result.status !== "passed");
    console.log(JSON.stringify({ startedAt: timestamp, results }, null, 2));

    if (failed.length > 0) {
        process.exitCode = 1;
    }
};

await main();
