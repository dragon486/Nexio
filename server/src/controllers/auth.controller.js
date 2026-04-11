import { google } from "googleapis";
import User from "../models/User.js";
import Business from "../models/Business.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../services/emailService.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getOAuth2Client = () => {
    const apiUrl = (process.env.API_URL || 'http://localhost:8000').trim().replace(/\/$/, "");
    const clientId = (process.env.GOOGLE_CLIENT_ID || "").trim().replace(/^"|"$/g, '');
    const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || "").trim().replace(/^"|"$/g, '');

    return new OAuth2Client(
        clientId,
        clientSecret,
        `${apiUrl}/api/auth/google/gmail-callback`
    );
};

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log("📝 Registering user:", email);

        const existing = await User.findOne({ email });
        if (existing) {
            console.log("⚠️ User already exists:", email);
            return res.status(400).json({ message: "User already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);
        console.log("🔑 Password hashed");

        const user = await User.create({
            name,
            email,
            password: hashed,
        });
        console.log("👤 User created:", user._id);

        const business = await Business.create({
            name: `${name}'s Business`,
            owner: user._id,
        });
        console.log("🏢 Business created:", business._id);

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        console.log("🎟️ Token generated");

        const safeUser = { ...user._doc };
        delete safeUser.password;

        // System Email: Welcome (Exempt from limits)
        try {
            console.log("📧 Sending welcome email...");
            const welcomeSubject = "Welcome to NEXIO! 🚀";
            const welcomeBody = `
                <h2>Welcome to NEXIO, ${name}!</h2>
                <p>We're thrilled to have you onboard.</p>
                <p>Your AI Sales Assistant is ready to help you close more deals.</p>
                <br/>
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard">Go to Dashboard</a>
            `;
            // Awaiting for debug purposes
            await sendEmail(email, welcomeSubject, welcomeBody);
            console.log("✅ Welcome email sent");
        } catch (mailError) {
            console.error("❌ Welcome email failed:", mailError);
        }

        console.log("🏁 Registration complete. Sending response.");
        res.status(201).json({ token, user: safeUser });

    } catch (error) {
        console.error("🔴 Registration Error:", error);
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("🔑 Login attempt for:", email);

        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User not found:", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }
        console.log("👤 User found:", user._id);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Password mismatch for:", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }
        console.log("✅ Password matched");

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        console.log("🎟️ Token generated");

        const safeUser = { ...user._doc };
        delete safeUser.password;

        const business = await Business.findOne({ owner: user._id });
        console.log("🏢 Business lookup complete:", business ? business.name : "None");

        res.json({ token, user: safeUser, business });

    } catch (error) {
        console.error("🔴 Login Error:", error);
        res.status(500).json({ error: error.message });
    }
};

export const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: "No token provided" });
        }

        const clientId = (process.env.GOOGLE_CLIENT_ID || "").trim().replace(/^"|"$/g, '');
        
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: clientId,
        });
        const { name, email, picture, sub } = ticket.getPayload();

        let user = await User.findOne({ email });
        let isNewUser = false;

        if (user) {
            if (!user.googleId) {
                user.googleId = sub;
                user.avatar = picture;
                await user.save();
            }
        } else {
            isNewUser = true;
            // Create new user with a random password since it's required by schema fallback
            const randomPassword = crypto.randomBytes(16).toString("hex");
            const hashed = await bcrypt.hash(randomPassword, 10);

            user = await User.create({
                name,
                email,
                password: hashed,
                googleId: sub,
                avatar: picture,
            });

            await Business.create({
                name: `${name}'s Business`,
                owner: user._id,
            });

            // Welcome Email
            try {
                const welcomeSubject = "Welcome to NEXIO! 🚀";
                const welcomeBody = `
                    <h2>Welcome to NEXIO, ${name}!</h2>
                    <p>You've successfully signed in with Google.</p>
                `;
                sendEmail(email, welcomeSubject, welcomeBody);
            } catch (mailError) {
                console.error("Welcome email failed:", mailError);
            }
        }

        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        const safeUser = { ...user._doc };
        delete safeUser.password;

        const business = await Business.findOne({ owner: user._id });

        res.json({ token: jwtToken, user: safeUser, business, isNewUser });
    } catch (error) {
        console.error("Google Login Error:", error);
        res.status(500).json({ error: "Google Login Failed: " + error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send Email
        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
        const subject = "Password Reset Request";
        const body = `
            <p>You requested a password reset.</p>
            <p>Please click the link below to reset your password:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>If you didn't request this, please ignore this email.</p>
        `;

        await sendEmail(email, subject, body);
        res.json({ message: "Reset link sent to email" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Hash new password
        const hashed = await bcrypt.hash(password, 10);
        user.password = hashed;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: "Password reset successful" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Gmail OAuth Integration
export const initiateGmailConnect = async (req, res) => {
    try {
        const client = getOAuth2Client();
        const url = client.generateAuthUrl({
            access_type: 'offline', // Critical for refresh_token
            scope: [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/gmail.send',
                'https://www.googleapis.com/auth/gmail.readonly'
            ],
            prompt: 'consent', // Force consent to ensure we always get a refresh_token
            state: String(req.user.id) // Pass user ID as string
        });
        res.json({ url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const handleGmailCallback = async (req, res) => {
    try {
        const { code, state } = req.query;
        if (!code) {
            console.error("❌ No code provided in redirect");
            return res.status(400).send("No code provided");
        }

        console.log("📡 Received Google OAuth code. Fetching tokens...");
        const client = getOAuth2Client();
        const { tokens } = await client.getToken(code);
        console.log("✅ Tokens received successfully");

        const user = await User.findById(state);
        if (!user) {
            console.error("❌ User not found for state:", state);
            return res.status(404).send("User not found");
        }

        user.gmailAccessToken = tokens.access_token;
        if (tokens.refresh_token) {
            console.log("📦 Refresh token found and saved");
            user.gmailRefreshToken = tokens.refresh_token;
        } else {
            console.warn("⚠️ No refresh token received. User might need to re-consent.");
        }
        user.gmailTokenExpiry = new Date(tokens.expiry_date);
        user.gmailStatus = 'active';

        console.log("🕵️ Verifying User ID Token...");
        const clientId = (process.env.GOOGLE_CLIENT_ID || "").trim().replace(/^"|"$/g, '');

        if (!tokens.id_token) {
            console.log("💁 No ID token, using access token to fetch email...");
            client.setCredentials(tokens);
            const oauth2 = google.oauth2({ version: 'v2', auth: client });
            const userinfo = await oauth2.userinfo.get();
            user.gmailEmail = userinfo.data.email;
        } else {
            const info = await client.verifyIdToken({
                idToken: tokens.id_token,
                audience: clientId,
            });
            user.gmailEmail = info.getPayload().email;
        }

        console.log("💾 Saving user with Gmail email:", user.gmailEmail);
        await user.save();

        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard/settings/integrations?success=gmail`);
    } catch (error) {
        console.error("🔴 Gmail Callback Error Details:", error);
        res.status(500).send("Authentication failed: " + error.message);
    }
};

export const disconnectGmail = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.gmailAccessToken = undefined;
        user.gmailRefreshToken = undefined;
        user.gmailEmail = undefined;
        user.gmailTokenExpiry = undefined;
        user.gmailStatus = 'disconnected';

        await user.save();

        res.json({ message: "Gmail disconnected successfully" });
    } catch (error) {
        console.error("🔴 Gmail Disconnect Error:", error);
        res.status(500).json({ error: error.message });
    }
};
