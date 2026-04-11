import mongoose from "mongoose";
import crypto from "crypto";

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
        currency: {
            type: String,
            default: "USD",
        },
        locale: {
            type: String,
            default: "en-US",
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        apiKey: {
            type: String,
            unique: true,
            default: () => "sk_live_" + crypto.randomBytes(24).toString("hex")
        },
        publicKey: {
            type: String,
            unique: true,
            default: () => "pk_live_" + crypto.randomBytes(24).toString("hex")
        },
        allowedDomains: [
            {
                type: String,
                trim: true,
                lowercase: true
            }
        ],
        aiCredits: {
            type: Number,
            default: 1, // Free trial for one time demo
        },
        plan: {
            type: String,
            enum: ["free", "founder_starter", "growth", "enterprise"],
            default: "free"
        },
        subscriptionExpiresAt: {
            type: Date
        },
        trialExpiresAt: {
            type: Date,
            default: () => new Date(+new Date() + 7*24*60*60*1000) // 7 days from now
        },
        conversationsUsed: {
            type: Number,
            default: 0
        },
        maxConversations: {
            type: Number,
            default: 50 // Default for free trial
        },
        maxBots: {
            type: Number,
            default: 1 // Default for free trial
        },
        targetAudience: String,
        avgDealSize: String,
        onboardingCompleted: { type: Boolean, default: false },
        whatsappConfig: {
            phoneNumberId: { type: String, default: "" },   // Meta Phone Number ID
            verifyToken: { type: String, default: "" },     // Used for webhook validation
            accessToken: { type: String, default: "" },     // Permanent System User Token
            isActive: { type: Boolean, default: false }     // Toggle bot on/off
        },
        settings: {
            knowledgeBase: { type: String, default: "" },   // Global AI Company Brain
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
            emailsSentToday: { type: Number, default: 0 },
            lastEmailReset: { type: Date, default: Date.now },
            workingHours: {
                start: { type: String, default: "09:00" },
                end: { type: String, default: "18:00" },
            },
            applyWorkingHours: { type: Boolean, default: false },
            schedulingLink: { type: String, default: "" },
            businessPhone: { type: String, default: "" },
            availabilityInstructions: { type: String, default: "" },
            isWidgetActive: { type: Boolean, default: false },
        },
    },
    { timestamps: true }
);

export default mongoose.model("Business", businessSchema);
