import mongoose from "mongoose";

const hyperlocalConversationSchema = new mongoose.Schema({
    // Context
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HyperlocalBusiness",
        required: true,
        index: true,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HyperlocalCustomer",
        required: true,
        index: true,
    },
    customerPhone: { type: String, required: true }, // Denormalised for fast lookup

    // === MESSAGE DATA ===
    messageId: { type: String, default: "" }, // WhatsApp message ID from Meta
    direction: {
        type: String,
        enum: ["inbound", "outbound"],
        required: true,
    },
    sender: {
        type: String,
        enum: ["customer", "bot", "human"],
        required: true,
    },
    content: {
        type: { type: String, enum: ["text", "image", "audio", "document", "video"], default: "text" },
        text: { type: String, default: "" },
        mediaUrl: { type: String, default: "" },
        caption: { type: String, default: "" },
    },

    // === AI PROCESSING ===
    intent: {
        type: String,
        enum: ["pricing", "booking", "location", "hours", "services", "contact", "complaint", "greeting", "other"],
        default: "other",
    },
    aiConfidence: { type: Number, default: 0 }, // 0-100
    aiResponse: { type: String, default: "" },  // The generated response text

    // === STATUS ===
    status: {
        type: String,
        enum: ["sent", "delivered", "read", "failed", "pending"],
        default: "sent",
    },

    // Timestamps from Meta webhook or local
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

// Index for fast dashboard conversation fetches
hyperlocalConversationSchema.index({ business: 1, timestamp: -1 });
hyperlocalConversationSchema.index({ business: 1, customerPhone: 1, timestamp: -1 });

export default mongoose.model("HyperlocalConversation", hyperlocalConversationSchema);
