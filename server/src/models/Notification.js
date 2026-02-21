import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        business: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Business",
            required: true,
            index: true
        },
        type: {
            type: String,
            enum: ["info", "warning", "error", "success", "ai_limit"],
            default: "info"
        },
        title: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        read: {
            type: Boolean,
            default: false
        },
        link: String, // Optional redirect link (e.g. to a specific lead)
        meta: Object  // Store resetTime or other context
    },
    { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
