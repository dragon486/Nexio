import mongoose from "mongoose";
import crypto from "crypto";

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    duration: { type: String, default: "" }, // e.g. "30 days", "60 min"
    image: { type: String, default: "" },
}, { _id: true });

const hoursSchema = new mongoose.Schema({
    open: { type: String, default: "09:00" },
    close: { type: String, default: "21:00" },
    closed: { type: Boolean, default: false },
}, { _id: false });

const hyperlocalBusinessSchema = new mongoose.Schema({
    // Ownership — ties to the main NEXIO user system
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    publicId: {
        type: String,
        unique: true,
        default: () => "hl_" + crypto.randomBytes(8).toString("hex"),
    },

    // === IDENTITY ===
    name: { type: String, required: true },
    category: {
        type: String,
        required: true,
    },
    logo: { type: String, default: "" },
    photos: [String],
    tagline: { type: String, default: "" },

    // === LOCATION ===
    address: {
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        country: { type: String, default: "India" },
        pincode: { type: String, default: "" },
        mapsLink: { type: String, default: "" }, // Google Maps URL
        coordinates: {
            lat: { type: Number, default: null },
            lng: { type: Number, default: null },
        },
    },

    // === HOURS ===
    hours: {
        monday:    { type: hoursSchema, default: () => ({}) },
        tuesday:   { type: hoursSchema, default: () => ({}) },
        wednesday: { type: hoursSchema, default: () => ({}) },
        thursday:  { type: hoursSchema, default: () => ({}) },
        friday:    { type: hoursSchema, default: () => ({}) },
        saturday:  { type: hoursSchema, default: () => ({}) },
        sunday:    { type: hoursSchema, default: () => ({ closed: true }) },
    },

    // === SERVICES ===
    services: [serviceSchema],

    // === WHATSAPP CONFIG ===
    // Reuses the same Meta Cloud API structure as the main platform
    whatsappConfig: {
        phoneNumberId: { type: String, default: "" },
        verifyToken: { type: String, default: () => crypto.randomBytes(12).toString("hex") },
        accessToken: { type: String, default: "" },
        phoneNumber: { type: String, default: "" }, // Display value e.g. +919876512345
        isActive: { type: Boolean, default: false },
    },

    // === BOT CONFIG ===
    botConfig: {
        template: {
            type: String,
            enum: ["gym", "salon", "restaurant", "retail", "clinic", "education", "hotel", "other", "custom"],
            default: "custom",
        },
        welcomeMessage: {
            type: String,
            default: "Hi! 👋 Welcome! How can I help you today?",
        },
        aiPersona: {
            type: String,
            enum: ["friendly", "professional", "energetic"],
            default: "friendly",
        },
        handoffKeywords: {
            type: [String],
            default: ["manager", "human", "call me", "speak to", "owner"],
        },
        handoffMessage: {
            type: String,
            default: "Sure! Let me connect you with our team. Please call us directly or we'll reach out to you shortly. 📞",
        },
        offlineMessage: {
            type: String,
            default: "Thanks for messaging us! 🙏 We're currently closed but will respond as soon as we open.",
        },
        // Which intents the bot responds to automatically
        enabledIntents: {
            pricing: { type: Boolean, default: true },
            booking: { type: Boolean, default: true },
            location: { type: Boolean, default: true },
            hours: { type: Boolean, default: true },
            services: { type: Boolean, default: true },
            contact: { type: Boolean, default: true },
        },
    },

    // === SUBSCRIPTION ===
    plan: {
        type: String,
        enum: ["starter", "business", "enterprise"],
        default: "starter",
    },
    currency: {
        type: String,
        default: "INR", // Supports any ISO 4217 code: USD, INR, SGD, AED, etc.
    },
    planStartDate: { type: Date, default: Date.now },
    planEndDate: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
    messagesIncluded: { type: Number, default: 500 },
    messagesUsed: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },

    // === BILLING ===
    billingInfo: {
        email: { type: String, default: "" },
        autoRenewal: { type: Boolean, default: true },
    },

    // === AGGREGATE STATS (denormalised for fast reads) ===
    stats: {
        totalMessages: { type: Number, default: 0 },
        totalCustomers: { type: Number, default: 0 },
        totalBookings: { type: Number, default: 0 },
        botHandledCount: { type: Number, default: 0 },
        humanHandoffCount: { type: Number, default: 0 },
    },
}, { timestamps: true });

export default mongoose.model("HyperlocalBusiness", hyperlocalBusinessSchema);
