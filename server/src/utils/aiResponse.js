const sanitizeText = (value) => {
    if (typeof value !== "string") {
        return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
};

export const normalizeAiResponse = (aiResponse = {}, options = {}) => {
    const emailSubject = sanitizeText(aiResponse.emailSubject);
    const emailBody = sanitizeText(aiResponse.emailBody ?? aiResponse.email);
    const whatsapp = sanitizeText(aiResponse.whatsapp);
    const salesFollowup = sanitizeText(aiResponse.salesFollowup);
    const callScript = sanitizeText(aiResponse.callScript);
    const generatedAt = aiResponse.generatedAt || options.generatedAt || new Date();

    if (!emailSubject && !emailBody && !whatsapp && !salesFollowup && !callScript) {
        return {};
    }

    return {
        emailSubject,
        emailBody,
        // Keep the legacy `email` key for backward compatibility with older flows.
        email: emailBody,
        whatsapp,
        salesFollowup,
        callScript,
        generatedAt,
    };
};

export const getEmailDraft = (aiResponse = {}) => aiResponse.emailBody || aiResponse.email || "";

export const hasEmailDraft = (aiResponse = {}) => Boolean(getEmailDraft(aiResponse));
