import User from "../models/User.js";
import Business from "../models/Business.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "User already exists" });

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashed,
        });

        const apiKey = crypto.randomBytes(24).toString("hex");
        const business = await Business.create({
            name: `${name}'s Business`,
            owner: user._id,
            apiKey
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        const safeUser = { ...user._doc };
        delete safeUser.password;

        res.status(201).json({ token, user: safeUser });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        const safeUser = { ...user._doc };
        delete safeUser.password;

        const business = await Business.findOne({ owner: user._id });

        res.json({ token, user: safeUser, business });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
