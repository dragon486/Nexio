import mongoose from "mongoose";

const businessSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        industry: {
            type: String,
        },
        website: {
            type: String,
        },
        timezone: {
            type: String,
            default: "Asia/Kolkata",
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        apiKey: {
            type: String,
            unique: true,
            required: true,
        },
        aiCredits: {
            type: Number,
            default: 1, // Free trial for one time demo
        },
        plan: {
            type: String,
            enum: ["free", "starter", "pro", "enterprise"],
            default: "free",
        },
        targetAudience: String,
        avgDealSize: String,
        onboardingCompleted: { type: Boolean, default: false },
        settings: {
            autoReply: { type: Boolean, default: true },
            aiFollowup: { type: Boolean, default: true },
            leadScoring: { type: Boolean, default: true },
            tone: {
                type: String,
                enum: ["friendly", "professional", "aggressive"],
                default: "professional"
            },
            followupStyle: {
                type: String,
                enum: ["soft", "direct", "urgent"],
                default: "soft"
            },
            minScoreToAutoReply: { type: Number, default: 50 },
            responseDelay: { type: Number, default: 2 }, // minutes
            dailyEmailLimit: { type: Number, default: 50 },
            autoReply: { type: Boolean, default: false },
            workingHours: {
                start: { type: String, default: "09:00" },
                end: { type: String, default: "18:00" },
            },
        },
    },
    { timestamps: true }
);

export default mongoose.model("Business", businessSchema);
