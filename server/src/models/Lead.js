import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        phone: String,
        source: {
            type: String,
            default: "website",
        },
        message: String,
        status: {
            type: String,
            enum: ["new", "contacted", "qualified", "converted", "lost"],
            default: "new",
        },
        isAutoPilotContacted: {
            type: Boolean,
            default: false,
        },
        read: {
            type: Boolean,
            default: false,
        },
        aiScore: {
            type: Number,
            default: 0,
        },
        aiPriority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "low",
        },
        aiNotes: String,
        business: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Business",
            required: true,
        },
        gmailThreadId: String,
        lastEmailReceivedAt: Date,
        meta: Object,
        aiResponse: {
            emailSubject: String,
            emailBody: String,
            email: String,
            whatsapp: String,
            salesFollowup: String,
            callScript: String,

            generatedAt: Date,
        },
        conversationHistory: [
            {
                role: { type: String, enum: ["user", "model"], required: true },
                content: { type: String, required: true },
                timestamp: { type: Date, default: Date.now },
            },
        ],
        requiresReview: {
            type: Boolean,
            default: false,
        },
        safetyFlags: [String],
        memorySummary: { type: String, default: "" },
        // Precision ROI Tracking
        contactedAt: { type: Date, default: null },
        qualifiedAt: { type: Date, default: null },
        convertedAt: { type: Date, default: null },
        dealSize: { type: Number, default: 0 },
        isSample: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
