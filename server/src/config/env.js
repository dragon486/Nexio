const trim = (value) => (typeof value === "string" ? value.trim() : "");

const toInt = (value, fallback) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeUrl = (value, fallback) => {
    const normalized = trim(value || fallback);
    return normalized.replace(/\/+$/, "");
};

export const runtimeConfig = Object.freeze({
    nodeEnv: trim(process.env.NODE_ENV) || "development",
    port: toInt(process.env.PORT, 8000),
    clientUrl: normalizeUrl(process.env.CLIENT_URL, "http://localhost:5173"),
    apiUrl: normalizeUrl(process.env.API_URL, "http://localhost:8000"),
    mongoUri: trim(process.env.MONGO_URI),
    jwtSecret: trim(process.env.JWT_SECRET),
    geminiApiKey: trim(process.env.GEMINI_API_KEY),
    google: {
        clientId: trim(process.env.GOOGLE_CLIENT_ID).replace(/^"|"$/g, ""),
        clientSecret: trim(process.env.GOOGLE_CLIENT_SECRET).replace(/^"|"$/g, ""),
    },
    smtp: {
        host: trim(process.env.SMTP_HOST) || "smtp.example.com",
        port: toInt(process.env.SMTP_PORT, 587),
        user: trim(process.env.SMTP_USER),
        pass: trim(process.env.SMTP_PASS),
        from: trim(process.env.EMAIL_FROM) || '"NEXIO" <noreply@nexio.ai>',
    },
    meta: {
        verifyToken: trim(process.env.META_VERIFY_TOKEN),
    },
});

export const getRuntimeWarnings = () => {
    const warnings = [];

    if (!runtimeConfig.geminiApiKey) {
        warnings.push("GEMINI_API_KEY is not configured. AI scoring will rely on fallback modes only.");
    }

    if (!runtimeConfig.google.clientId || !runtimeConfig.google.clientSecret) {
        warnings.push("Google OAuth credentials are incomplete. Gmail connect and sync features will be unavailable.");
    }

    if (!runtimeConfig.smtp.user || !runtimeConfig.smtp.pass) {
        warnings.push("SMTP credentials are incomplete. System email fallback will be skipped.");
    }

    if (!runtimeConfig.meta.verifyToken) {
        warnings.push("META_VERIFY_TOKEN is not configured. Global WhatsApp webhook verification will rely on per-business tokens only.");
    }

    return warnings;
};

export const validateRuntimeConfig = () => {
    const errors = [];

    if (!runtimeConfig.mongoUri) {
        errors.push("MONGO_URI is required.");
    }

    if (!runtimeConfig.jwtSecret) {
        errors.push("JWT_SECRET is required.");
    }

    if (errors.length > 0) {
        throw new Error(`Runtime configuration invalid: ${errors.join(" ")}`);
    }

    return {
        errors,
        warnings: getRuntimeWarnings(),
    };
};
