import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Business from "../models/Business.js";

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password");

            // Attach Business ID to User object for convenience in controllers
            const business = await Business.findOne({ owner: req.user._id });
            if (business) {
                req.user.businessId = business._id;
                req.business = business;
            }

            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};
