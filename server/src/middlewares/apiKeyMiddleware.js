import Business from "../models/Business.js";

export const verifyApiKey = async (req, res, next) => {
    try {
        const apiKey = req.headers["x-api-key"];

        if (!apiKey) {
            return res.status(401).json({ message: "API key missing" });
        }

        const business = await Business.findOne({ apiKey });

        if (!business) {
            return res.status(401).json({ message: "Invalid API key" });
        }

        req.business = business;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
