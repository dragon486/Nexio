const DB_READY_STATES = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
};

export const buildHealthSnapshot = ({
    timestamp = new Date().toISOString(),
    uptimeSeconds = process.uptime(),
    dbReadyState = 0,
    config,
} = {}) => {
    const databaseReady = dbReadyState === 1;

    return {
        status: databaseReady ? "ok" : "degraded",
        ready: databaseReady,
        timestamp,
        uptimeSeconds: Math.round(uptimeSeconds),
        database: {
            ready: databaseReady,
            state: DB_READY_STATES[dbReadyState] || "unknown",
        },
        integrations: {
            aiScoring: Boolean(config?.geminiApiKey),
            smtpFallback: Boolean(config?.smtp?.user && config?.smtp?.pass),
            googleOAuth: Boolean(config?.google?.clientId && config?.google?.clientSecret),
            whatsappWebhook: Boolean(config?.meta?.verifyToken),
        },
    };
};
