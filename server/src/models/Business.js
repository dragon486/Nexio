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
        plan: {
            type: String,
            enum: ["free", "starter", "pro", "enterprise"],
            default: "free",
        },
        settings: {
            autoReply: { type: Boolean, default: true },
            aiFollowup: { type: Boolean, default: true },
            leadScoring: { type: Boolean, default: true },
            workingHours: {
                start: { type: String, default: "09:00" },
                end: { type: String, default: "18:00" },
            },
        },
    },
    { timestamps: true }
);

export default mongoose.model("Business", businessSchema);
