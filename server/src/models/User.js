import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            // Password is required only if googleId is not present
            required: function () { return !this.googleId; }
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true
        },
        avatar: String,
        plan: {
            type: String,
            default: "free",
        },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        // Gmail OAuth Tokens
        gmailAccessToken: String,
        gmailRefreshToken: String,
        gmailTokenExpiry: Date,
        gmailEmail: String, // The actual email address associated with the tokens
        gmailStatus: {
            type: String,
            enum: ['active', 'error', 'disconnected'],
            default: 'disconnected'
        },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
