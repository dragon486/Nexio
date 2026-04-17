import Notification from "../models/Notification.js";

/**
 * Helper: Check & Increment Email Limit
 */
export const checkAndIncrementEmailLimit = async (business) => {
    const today = new Date();
    const lastReset = new Date(business.settings.lastEmailReset || 0);

    // Reset if it's a new day
    if (today.getDate() !== lastReset.getDate() || today.getMonth() !== lastReset.getMonth()) {
        business.settings.emailsSentToday = 0;
        business.settings.lastEmailReset = today;
    }

    // Check Limit
    if (business.settings.emailsSentToday >= business.settings.dailyEmailLimit) {
        return false; // Limit reached
    }

    // Increment
    business.settings.emailsSentToday += 1;
    await business.save();
    return true;
};

/**
 * Helper: Handle AI Limit Notification
 */
export const notifyAiLimit = async (businessId, aiNotes, leadName) => {
    try {
        const isLimit = aiNotes?.includes("Limit") || aiNotes?.includes("Quota");
        if (!isLimit) return;

        const recentNotif = await Notification.findOne({
            business: businessId,
            type: "ai_limit",
            createdAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) } // Last 5 mins
        });

        if (recentNotif) return;

        const isDaily = aiNotes.includes("Daily") || aiNotes.includes("Quota");
        const title = isDaily ? "Daily AI Quota Reached " : "AI Rate Limit Hit ⏳";
        const message = isDaily
            ? aiNotes
            : `NEXIO hit a rate limit while processing ${leadName}. ${aiNotes}`;

        await Notification.create({
            business: businessId,
            type: "ai_limit",
            title,
            message,
            meta: { leadName }
        });
    } catch (err) {
        console.error("Failed to create AI limit notification:", err);
    }
};

/**
 * Helper: Check if within Working Hours
 */
export const isWithinWorkingHours = (business) => {
    if (!business.settings.applyWorkingHours) return true;

    const now = new Date();
    const start = business.settings.workingHours?.start || "09:00";
    const end = business.settings.workingHours?.end || "18:00";

    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);

    const currentH = now.getHours();
    const currentM = now.getMinutes();

    const startTimeInMinutes = startH * 60 + startM;
    const endTimeInMinutes = endH * 60 + endM;
    const currentTimeInMinutes = currentH * 60 + currentM;

    return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
};
