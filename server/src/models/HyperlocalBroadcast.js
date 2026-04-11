import mongoose from "mongoose";

const recipientSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "HyperlocalCustomer" },
    phone: { type: String },
    status: {
        type: String,
        enum: ["pending", "sent", "delivered", "read", "failed"],
        default: "pending",
    },
    failReason: { type: String, default: "" },
}, { _id: false });

const hyperlocalBroadcastSchema = new mongoose.Schema({
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HyperlocalBusiness",
        required: true,
        index: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    // === CONTENT ===
    message: { type: String, required: true },
    mediaUrl: { type: String, default: "" },
    mediaType: {
        type: String,
        enum: ["none", "image", "document"],
        default: "none",
    },

    // === TARGETING ===
    targetAudience: {
        type: String,
        enum: ["all", "active_members", "expired_members", "new_customers", "vip", "custom"],
        default: "all",
    },
    customFilters: { type: mongoose.Schema.Types.Mixed, default: null },

    // === RECIPIENTS (snapshot at send time) ===
    recipients: [recipientSchema],
    totalRecipients: { type: Number, default: 0 },
    sentCount: { type: Number, default: 0 },
    deliveredCount: { type: Number, default: 0 },
    readCount: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 },

    // === SCHEDULING ===
    scheduledFor: { type: Date, default: null },
    status: {
        type: String,
        enum: ["draft", "scheduled", "sending", "sent", "failed"],
        default: "draft",
    },

    // === COST ===
    costPerMessage: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },

    // Timestamps
    sentAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model("HyperlocalBroadcast", hyperlocalBroadcastSchema);
