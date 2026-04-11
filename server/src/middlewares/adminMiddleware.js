import User from "../models/User.js";

// Master Superadmin Email List
const SUPERADMIN_EMAILS = [
    'adelmuhammed786@gmail.com'
];

export const isAdmin = async (req, res, next) => {
    try {
        // req.user is populated by the protect middleware which runs BEFORE this middleware
        if (!req.user || !req.user.email) {
            return res.status(401).json({ message: "Not authorized. Missing credentials." });
        }

        if (SUPERADMIN_EMAILS.includes(req.user.email)) {
            next();
        } else {
            return res.status(403).json({ message: "Security Violation: Access denied. This incident will be logged." });
        }
    } catch (error) {
        console.error("Admin Auth Error:", error);
        return res.status(500).json({ message: "Internal server error during authentication." });
    }
};
