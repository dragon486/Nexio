import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    service: { type: String, default: "" },
    date: { type: Date },
    status: {
        type: String,
        enum: ["confirmed", "cancelled", "completed", "pending"],
        default: "pending",
    },
    notes: { type: String, default: "" },
}, { _id: true, timestamps: true });

const hyperlocalCustomerSchema = new mongoose.Schema({
    // Links to the business
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HyperlocalBusiness",
        required: true,
        index: true,
    },

    // === IDENTITY ===
    phone: { type: String, required: true }, // Primary identifier (WhatsApp number)
    name: { type: String, default: "" },     // Extracted from WhatsApp profile or self-identified
    email: { type: String, default: "" },

    // === CLASSIFICATION ===
    tags: {
        type: [String],
        enum: ["vip", "regular", "new", "prospect", "churned", "follow_up"],
        default: ["new"],
    },

    // === ENGAGEMENT ===
    firstMessageDate: { type: Date, default: Date.now },
    lastMessageDate: { type: Date, default: Date.now },
    totalMessages: { type: Number, default: 1 },

    // === BUSINESS-SPECIFIC ===
    membershipStatus: {
        type: String,
        enum: ["active", "expired", "trial", "none"],
        default: "none",
    },
    membershipExpiry: { type: Date, default: null },
    totalSpent: { type: Number, default: 0 },
    bookings: [bookingSchema],

    // === MARKETING ===
    allowBroadcasts: { type: Boolean, default: true }, // Opt-out flag
    lastBroadcastDate: { type: Date, default: null },

    // === NOTES ===
    agentNotes: { type: String, default: "" },
}, { timestamps: true });

// Compound index: one customer per phone per business
hyperlocalCustomerSchema.index({ business: 1, phone: 1 }, { unique: true });

export default mongoose.model("HyperlocalCustomer", hyperlocalCustomerSchema);
