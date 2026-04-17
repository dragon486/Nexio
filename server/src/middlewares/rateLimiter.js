import rateLimit from "express-rate-limit";

/**
 * Standard Rate Limiter
 * Limits requests to 100 per 15 minutes per IP by default.
 */
export const standardLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window`
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req, res) => process.env.MOCK_SERVICES === "true",
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes"
    }
});

/**
 * Auth Rate Limiter
 * Stricter limits for login and registration to prevent brute force attacks.
 */
export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // Limit each IP to 20 attempts per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many authentication attempts. Please try again after an hour."
    }
});
