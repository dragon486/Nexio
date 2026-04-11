import HyperlocalBusiness from "../models/HyperlocalBusiness.js";
import HyperlocalCustomer from "../models/HyperlocalCustomer.js";
import HyperlocalConversation from "../models/HyperlocalConversation.js";
import HyperlocalBroadcast from "../models/HyperlocalBroadcast.js";
import { sendWhatsAppMessage } from "../services/whatsappService.js";
import { emitToBusiness } from "../utils/socket.js";

// ─────────────────────────────────────────────────────────────
// BUSINESS REGISTRATION & CONFIG
// ─────────────────────────────────────────────────────────────

/**
 * POST /api/hyperlocal/register
 * Creates a new Hyperlocal business for the authenticated user.
 */
export const registerBusiness = async (req, res) => {
    try {
        const { name, category, tagline, address, billingEmail, currency, whatsappConfig } = req.body;

        if (!name || !category) {
            return res.status(400).json({ message: "Business name and category are required." });
        }

        // One user can only have one hyperlocal business (for now)
        const existing = await HyperlocalBusiness.findOne({ owner: req.user._id });
        if (existing) {
            return res.status(409).json({
                message: "You already have a Hyperlocal business.",
                businessId: existing._id,
            });
        }

        const business = await HyperlocalBusiness.create({
            owner: req.user._id,
            name,
            category,
            tagline: tagline || "",
            address: address || {},
            currency: currency || "INR",
            billingInfo: { email: billingEmail || req.user.email, autoRenewal: true },
            // Add WhatsApp config if provided
            whatsappConfig: whatsappConfig || {},
            // Set default welcome message based on category
            botConfig: {
                template: ["gym", "salon", "restaurant", "retail", "clinic", "education", "hotel", "other"].includes(category) ? category : "other",
                welcomeMessage: getDefaultWelcome(name, category),
            },
        });

        res.status(201).json({ success: true, business });
    } catch (err) {
        console.error("[Hyperlocal] registerBusiness:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

/**
 * GET /api/hyperlocal/my
 * Returns the authenticated user's Hyperlocal business.
 */
export const getMyBusiness = async (req, res) => {
    try {
        const business = await HyperlocalBusiness.findOne({ owner: req.user._id });
        if (!business) {
            return res.status(404).json({ message: "No Hyperlocal business found. Please register first." });
        }
        res.json(business);
    } catch (err) {
        console.error("[Hyperlocal] getMyBusiness:", err);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * PUT /api/hyperlocal/:id/config
 * Updates bot config, services, hours, and WhatsApp settings.
 */
export const updateConfig = async (req, res) => {
    try {
        const business = await HyperlocalBusiness.findOne({
            _id: req.params.id,
            owner: req.user._id,
        });
        if (!business) return res.status(404).json({ message: "Business not found." });

        const { botConfig, services, hours, address, whatsappConfig, name, tagline, plan, currency } = req.body;

        if (botConfig)      business.botConfig      = { ...business.botConfig.toObject(), ...botConfig };
        if (services)       business.services       = services;
        if (hours)          business.hours          = { ...business.hours.toObject(), ...hours };
        if (address)        business.address        = { ...business.address.toObject(), ...address };
        if (name)           business.name           = name;
        if (tagline)        business.tagline        = tagline;
        if (currency)       business.currency       = currency;

        // WhatsApp config update — activate bot when credentials are set
        if (whatsappConfig) {
            business.whatsappConfig = { ...business.whatsappConfig.toObject(), ...whatsappConfig };
            if (whatsappConfig.phoneNumberId && whatsappConfig.accessToken) {
                business.whatsappConfig.isActive = true;
            }
        }

        // Plan upgrade
        if (plan && ["starter", "business", "enterprise"].includes(plan)) {
            business.plan = plan;
            const quotas = { starter: 500, business: 2000, enterprise: 10000 };
            business.messagesIncluded = quotas[plan];
        }

        await business.save();
        res.json({ success: true, business });
    } catch (err) {
        console.error("[Hyperlocal] updateConfig:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────
// CONVERSATIONS
// ─────────────────────────────────────────────────────────────

/**
 * GET /api/hyperlocal/:id/conversations
 * Returns paginated conversations grouped by customer.
 */
export const getConversations = async (req, res) => {
    try {
        const { page = 1, limit = 30, phone } = req.query;

        const business = await HyperlocalBusiness.findOne({
            _id: req.params.id,
            owner: req.user._id,
        });
        if (!business) return res.status(404).json({ message: "Business not found." });

        const query = { business: business._id };
        if (phone) query.customerPhone = phone;

        const conversations = await HyperlocalConversation.find(query)
            .sort({ timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate("customer", "name phone tags membershipStatus");

        const total = await HyperlocalConversation.countDocuments(query);

        res.json({ conversations, total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (err) {
        console.error("[Hyperlocal] getConversations:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ─────────────────────────────────────────────────────────────
// CUSTOMERS
// ─────────────────────────────────────────────────────────────

/**
 * GET /api/hyperlocal/:id/customers
 * Returns paginated customer list with filters.
 */
export const getCustomers = async (req, res) => {
    try {
        const { page = 1, limit = 25, tag, membership, search } = req.query;

        const business = await HyperlocalBusiness.findOne({
            _id: req.params.id,
            owner: req.user._id,
        });
        if (!business) return res.status(404).json({ message: "Business not found." });

        const query = { business: business._id };
        if (tag) query.tags = tag;
        if (membership) query.membershipStatus = membership;
        if (search) query.$or = [
            { name: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
        ];

        const customers = await HyperlocalCustomer.find(query)
            .sort({ lastMessageDate: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await HyperlocalCustomer.countDocuments(query);
        res.json({ customers, total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (err) {
        console.error("[Hyperlocal] getCustomers:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ─────────────────────────────────────────────────────────────
// BROADCASTS
// ─────────────────────────────────────────────────────────────

/**
 * GET /api/hyperlocal/:id/broadcasts
 */
export const getBroadcasts = async (req, res) => {
    try {
        const business = await HyperlocalBusiness.findOne({ _id: req.params.id, owner: req.user._id });
        if (!business) return res.status(404).json({ message: "Business not found." });

        const broadcasts = await HyperlocalBroadcast.find({ business: business._id })
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(broadcasts);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * POST /api/hyperlocal/:id/broadcast
 * Fans out a broadcast message to all targeted customers.
 */
export const sendBroadcast = async (req, res) => {
    try {
        const { message, targetAudience = "all", customFilters, scheduledFor } = req.body;

        if (!message) return res.status(400).json({ message: "Message is required." });

        const business = await HyperlocalBusiness.findOne({
            _id: req.params.id,
            owner: req.user._id,
        });
        if (!business) return res.status(404).json({ message: "Business not found." });

        // Resolve recipients
        const customerQuery = { business: business._id, allowBroadcasts: true };
        if (targetAudience === "active_members") customerQuery.membershipStatus = "active";
        if (targetAudience === "expired_members") customerQuery.membershipStatus = "expired";
        if (targetAudience === "new_customers") customerQuery.tags = "new";
        if (targetAudience === "vip") customerQuery.tags = "vip";

        const customers = await HyperlocalCustomer.find(customerQuery);

        const costPerMessage = { starter: 1, business: 0.75, enterprise: 0.5 }[business.plan] || 1;
        const totalCost = customers.length * costPerMessage;

        const recipients = customers.map(c => ({
            customer: c._id,
            phone: c.phone,
            status: "pending",
        }));

        const broadcast = await HyperlocalBroadcast.create({
            business: business._id,
            createdBy: req.user._id,
            message,
            targetAudience,
            customFilters: customFilters || null,
            recipients,
            totalRecipients: customers.length,
            costPerMessage,
            totalCost,
            currency: business.currency,
            scheduledFor: scheduledFor || null,
            status: scheduledFor ? "scheduled" : "sending",
        });

        // If not scheduled, send immediately in background
        if (!scheduledFor) {
            sendBroadcastMessages(broadcast, business).catch(err =>
                console.error("[Hyperlocal] Broadcast send error:", err)
            );
        }

        res.status(201).json({
            success: true,
            broadcast: {
                _id: broadcast._id,
                totalRecipients: broadcast.totalRecipients,
                totalCost: broadcast.totalCost,
                currency: broadcast.currency,
                status: broadcast.status,
            },
        });
    } catch (err) {
        console.error("[Hyperlocal] sendBroadcast:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────
// ANALYTICS
// ─────────────────────────────────────────────────────────────

/**
 * GET /api/hyperlocal/:id/analytics
 * Returns aggregated analytics for the business dashboard.
 */
export const getAnalytics = async (req, res) => {
    try {
        const business = await HyperlocalBusiness.findOne({
            _id: req.params.id,
            owner: req.user._id,
        });
        if (!business) return res.status(404).json({ message: "Business not found." });

        const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days

        const [
            totalMessages,
            totalCustomers,
            newCustomers,
            intentBreakdown,
            dailyMessages,
            broadcastStats,
        ] = await Promise.all([
            HyperlocalConversation.countDocuments({ business: business._id }),
            HyperlocalCustomer.countDocuments({ business: business._id }),
            HyperlocalCustomer.countDocuments({ business: business._id, firstMessageDate: { $gte: since } }),
            HyperlocalConversation.aggregate([
                { $match: { business: business._id, direction: "inbound", intent: { $ne: "other" } } },
                { $group: { _id: "$intent", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 6 },
            ]),
            HyperlocalConversation.aggregate([
                { $match: { business: business._id, timestamp: { $gte: since } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ]),
            HyperlocalBroadcast.aggregate([
                { $match: { business: business._id, status: "sent" } },
                {
                    $group: {
                        _id: null,
                        totalSent: { $sum: "$sentCount" },
                        totalDelivered: { $sum: "$deliveredCount" },
                        totalRead: { $sum: "$readCount" },
                    },
                },
            ]),
        ]);

        const botHandled = await HyperlocalConversation.countDocuments({
            business: business._id,
            sender: "bot",
        });
        const humanHandoff = await HyperlocalConversation.countDocuments({
            business: business._id,
            sender: "human",
        });

        res.json({
            overview: {
                totalMessages,
                totalCustomers,
                newCustomers,
                botHandledPercent: totalMessages > 0 ? Math.round((botHandled / totalMessages) * 100) : 0,
                humanHandoffCount: humanHandoff,
                messagesUsed: business.messagesUsed,
                messagesIncluded: business.messagesIncluded,
            },
            intentBreakdown: intentBreakdown.map(i => ({ intent: i._id, count: i.count })),
            dailyMessages: dailyMessages.map(d => ({ date: d._id, count: d.count })),
            broadcastStats: broadcastStats[0] || { totalSent: 0, totalDelivered: 0, totalRead: 0 },
        });
    } catch (err) {
        console.error("[Hyperlocal] getAnalytics:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

async function sendBroadcastMessages(broadcast, business) {
    let sentCount = 0;
    let failedCount = 0;

    for (const recipient of broadcast.recipients) {
        try {
            await sendWhatsAppMessage(recipient.phone, broadcast.message, business.whatsappConfig);
            recipient.status = "sent";
            sentCount++;

            // Update customer's last broadcast date
            await HyperlocalCustomer.findByIdAndUpdate(recipient.customer, {
                lastBroadcastDate: new Date(),
            });

            // Small delay to avoid rate limits
            await new Promise(r => setTimeout(r, 250));
        } catch (err) {
            recipient.status = "failed";
            recipient.failReason = err.message;
            failedCount++;
        }
    }

    broadcast.sentCount = sentCount;
    broadcast.failedCount = failedCount;
    broadcast.status = "sent";
    broadcast.sentAt = new Date();
    broadcast.completedAt = new Date();
    await broadcast.save();

    // Emit to dashboard
    emitToBusiness(business._id, "broadcast_complete", {
        broadcastId: broadcast._id,
        sentCount,
        failedCount,
    });
}

function getDefaultWelcome(name, category) {
    const templates = {
        gym: `Hi! 👋 Welcome to ${name}!\n\nHow can I help you today?\n• Membership plans 💪\n• Book a free trial\n• View facilities\n• Talk to a trainer`,
        salon: `Hi! 👋 Welcome to ${name}!\n\nHow can I help you?\n• View services & pricing 💇\n• Book an appointment\n• Check availability\n• Our location`,
        restaurant: `Hi! 👋 Welcome to ${name}!\n\nHow can I help you? 🍽️\n• View our menu\n• Make a reservation\n• Order & delivery\n• Today's specials`,
        retail: `Hi! 👋 Welcome to ${name}!\n\nHow can I help you? 🛒\n• Browse products\n• Check prices\n• Store timings\n• Contact us`,
        clinic: `Hi! 👋 Welcome to ${name}!\n\nHow can I help you? 🏥\n• Book an appointment\n• Our services\n• Consultation fees\n• Working hours`,
        default: `Hi! 👋 Welcome to ${name}!\n\nHow can I help you today?`,
    };
    return templates[category] || templates.default;
}
