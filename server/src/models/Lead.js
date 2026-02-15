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
        meta: Object,
        aiResponse: {
            whatsapp: String,
            email: String,
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
        memorySummary: { type: String, default: "" },
    },
    { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
