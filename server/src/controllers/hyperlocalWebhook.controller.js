import { GoogleGenerativeAI } from "@google/generative-ai";
import HyperlocalBusiness from "../models/HyperlocalBusiness.js";
import HyperlocalCustomer from "../models/HyperlocalCustomer.js";
import HyperlocalConversation from "../models/HyperlocalConversation.js";
import { sendWhatsAppMessage } from "../services/whatsappService.js";
import { emitToBusiness } from "../utils/socket.js";
import { runtimeConfig } from "../config/env.js";

const genAI = new GoogleGenerativeAI(runtimeConfig.geminiApiKey || process.env.GEMINI_API_KEY);

// ─────────────────────────────────────────────────────────────
// META WEBHOOK VERIFICATION
// GET /webhooks/hyperlocal/:businessId
// ─────────────────────────────────────────────────────────────
export const handleHyperlocalVerification = async (req, res) => {
    try {
        const { businessId } = req.params;
        const mode = req.query["hub.mode"];
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];

        if (mode !== "subscribe" || !challenge) return res.sendStatus(400);

        const business = await HyperlocalBusiness.findById(businessId);
        if (!business) return res.sendStatus(404);

        // Match against this specific business's verify token OR the global token
        const globalToken = process.env.META_VERIFY_TOKEN;
        if (token === business.whatsappConfig.verifyToken || token === globalToken) {
            console.log(`[Hyperlocal Webhook] Verification OK for business: ${business.name}`);
            return res.status(200).send(challenge);
        }

        console.warn(`[Hyperlocal Webhook] Invalid verify token for business ${businessId}`);
        res.sendStatus(403);
    } catch (err) {
        console.error("[Hyperlocal Webhook] Verification error:", err);
        res.sendStatus(500);
    }
};

// ─────────────────────────────────────────────────────────────
// INBOUND MESSAGE HANDLER
// POST /webhooks/hyperlocal/:businessId
// ─────────────────────────────────────────────────────────────
export const handleHyperlocalInbound = async (req, res) => {
    // ALWAYS respond 200 immediately to Meta to prevent retries
    res.sendStatus(200);

    try {
        const { businessId } = req.params;
        const body = req.body;

        if (!body.object || !body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) return;

        const value = body.entry[0].changes[0].value;
        const message = value.messages[0];
        const senderPhone = message.from;
        const messageType = message.type;

        // Extract text content
        let messageText = "";
        if (messageType === "text") {
            messageText = message.text?.body || "";
        } else if (messageType === "button") {
            messageText = message.button?.text || "";
        } else if (messageType === "interactive") {
            messageText = message.interactive?.button_reply?.title ||
                          message.interactive?.list_reply?.title || "";
        } else {
            messageText = `[${messageType} message]`;
        }

        if (!messageText) return;

        console.log(`[Hyperlocal] Inbound from ${senderPhone} → business ${businessId}: "${messageText}"`);

        // 1. Load business
        const business = await HyperlocalBusiness.findById(businessId);
        if (!business || !business.whatsappConfig?.isActive || !business.isActive) {
            console.warn(`[Hyperlocal] Business ${businessId} not found or inactive.`);
            return;
        }

        // 2. Check message quota
        if (business.messagesUsed >= business.messagesIncluded * 1.2) {
            // Soft cap: allow 20% overage, then stop
            console.warn(`[Hyperlocal] Quota exceeded for ${business.name}`);
            return;
        }

        // 3. Upsert customer
        const senderName = value.contacts?.[0]?.profile?.name || senderPhone;
        const customer = await HyperlocalCustomer.findOneAndUpdate(
            { business: business._id, phone: senderPhone },
            {
                $set: { lastMessageDate: new Date(), name: senderName },
                $inc: { totalMessages: 1 },
                $setOnInsert: { firstMessageDate: new Date(), tags: ["new"] },
            },
            { upsert: true, new: true }
        );

        // 4. Log inbound conversation entry
        await HyperlocalConversation.create({
            business: business._id,
            customer: customer._id,
            customerPhone: senderPhone,
            messageId: message.id,
            direction: "inbound",
            sender: "customer",
            content: { type: "text", text: messageText },
            timestamp: new Date(Number(message.timestamp) * 1000 || Date.now()),
        });

        // 5. Detect intent via Gemini
        const { intent, confidence } = await detectIntent(messageText, business.category);
        console.log(`[Hyperlocal] Intent detected: ${intent} (${confidence}%) for "${messageText}"`);

        // 6. Check if intent is enabled
        const intentEnabled = business.botConfig.enabledIntents?.[intent] !== false;

        // 7. Generate response
        let responseText = "";
        let actualSender = "bot";

        if (!intentEnabled || intent === "contact") {
            // Handoff to human
            responseText = business.botConfig.handoffMessage;
            actualSender = "human";
            business.stats.humanHandoffCount++;
        } else {
            responseText = await generateResponse(intent, messageText, business, customer);
            business.stats.botHandledCount++;
        }

        // 8. Send reply
        try {
            await sendWhatsAppMessage(senderPhone, responseText, business.whatsappConfig);
        } catch (sendErr) {
            console.error(`[Hyperlocal] Failed to send reply to ${senderPhone}:`, sendErr.message);
            // Log as failed but don't throw
        }

        // 9. Log outbound conversation entry
        await HyperlocalConversation.create({
            business: business._id,
            customer: customer._id,
            customerPhone: senderPhone,
            direction: "outbound",
            sender: actualSender,
            content: { type: "text", text: responseText },
            intent,
            aiConfidence: confidence,
            aiResponse: responseText,
            timestamp: new Date(),
        });

        // 10. Update business stats
        business.stats.totalMessages = (business.stats.totalMessages || 0) + 2;
        business.stats.totalCustomers = await HyperlocalCustomer.countDocuments({ business: business._id });
        business.messagesUsed = (business.messagesUsed || 0) + 1;
        await business.save();

        // 11. Real-time dashboard update via Socket.IO
        emitToBusiness(business._id, "hyperlocal_new_message", {
            customerPhone: senderPhone,
            customerName: customer.name,
            message: messageText,
            botResponse: responseText,
            intent,
            timestamp: new Date(),
        });

    } catch (err) {
        console.error("[Hyperlocal] Webhook processing error:", err);
    }
};

// ─────────────────────────────────────────────────────────────
// AI INTENT DETECTION
// ─────────────────────────────────────────────────────────────
async function detectIntent(message, category) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are an intent classifier for a ${category} business WhatsApp bot.

Customer message: "${message}"

Classify the intent as exactly ONE of:
- pricing (asking about costs, plans, fees, rates, how much)
- booking (want to book, appointment, schedule, reserve, availability)
- location (address, directions, where, maps, how to reach)
- hours (opening time, closing time, when open, timing)
- services (what services, what do you offer, facilities, treatments)
- contact (talk to human, speak to manager, call, complaint escalation)
- greeting (hello, hi, hey, good morning - just a greeting)
- other (anything else)

Respond with ONLY a JSON object like: {"intent": "pricing", "confidence": 92}`;

        const result = await model.generateContent(prompt);
        const raw = result.response.text().trim();

        // Extract JSON robustly
        const match = raw.match(/\{[^}]+\}/);
        if (match) {
            const parsed = JSON.parse(match[0]);
            return {
                intent: parsed.intent || "other",
                confidence: parseInt(parsed.confidence) || 70,
            };
        }
    } catch (err) {
        console.error("[Hyperlocal] Intent detection failed, falling back:", err.message);
    }

    // Fallback: keyword matching
    return fallbackIntentDetect(message);
}

function fallbackIntentDetect(message) {
    const lower = message.toLowerCase();
    if (/price|cost|fee|rate|plan|how much|membership|package|charge/.test(lower))
        return { intent: "pricing", confidence: 75 };
    if (/book|appointment|schedule|slot|available|reserve|timing|visit/.test(lower))
        return { intent: "booking", confidence: 75 };
    if (/where|address|location|directions?|map|reach|near/.test(lower))
        return { intent: "location", confidence: 75 };
    if (/open|close|timing|hours?|when|time/.test(lower))
        return { intent: "hours", confidence: 75 };
    if (/service|offer|facility|treatment|menu|do you have/.test(lower))
        return { intent: "services", confidence: 75 };
    if (/manager|human|speak|call|complaint|talk to/.test(lower))
        return { intent: "contact", confidence: 75 };
    if (/^(hi|hello|hey|good morning|good afternoon|good evening|namaste|hola)/.test(lower))
        return { intent: "greeting", confidence: 90 };
    return { intent: "other", confidence: 50 };
}

// ─────────────────────────────────────────────────────────────
// AI RESPONSE GENERATION
// ─────────────────────────────────────────────────────────────
async function generateResponse(intent, customerMessage, business, customer) {
    // Build context string from business data
    const servicesList = business.services?.length > 0
        ? business.services.map(s =>
            `• ${s.name}: ${formatCurrency(s.price, business.currency)} ${s.duration ? `(${s.duration})` : ""}`
          ).join("\n")
        : "Please contact us directly for pricing.";

    const hoursText = formatHours(business.hours);
    const location = business.address?.street
        ? `${business.address.street}, ${business.address.city}${business.address.mapsLink ? `\n📍 Maps: ${business.address.mapsLink}` : ""}`
        : "Please contact us for our address.";

    // Direct template responses for reliability
    const templates = {
        greeting: () =>
            business.botConfig.welcomeMessage,

        pricing: () =>
            `Here are our services and pricing at *${business.name}*:\n\n${servicesList}\n\nWould you like to book an appointment or have more questions? 😊`,

        services: () =>
            `At *${business.name}*, we offer:\n\n${servicesList}\n\nInterested in booking? Just let me know! ✨`,

        location: () =>
            `📍 *${business.name}* is located at:\n${location}\n\nWe'd love to see you! 🙏`,

        hours: () =>
            `⏰ *${business.name}* business hours:\n${hoursText}\n\nFeel free to visit or message us anytime!`,

        booking: () =>
            `Great, I'd love to help you book!\n\nOur services:\n${servicesList}\n\nWhich service interests you, and what date/time works best? 📅`,

        other: async () => await generateAIResponse(customerMessage, business, servicesList, hoursText, location),
    };

    try {
        const fn = templates[intent] || templates.other;
        return await fn();
    } catch (err) {
        console.error("[Hyperlocal] Response generation error:", err.message);
        return `Thank you for your message! 🙏 Our team at *${business.name}* will get back to you shortly.`;
    }
}

async function generateAIResponse(message, business, servicesList, hoursText, location) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are a friendly WhatsApp customer service bot for *${business.name}*, a ${business.category} business.

Business Info:
- Name: ${business.name}
- Category: ${business.category}
- Services: ${servicesList}
- Hours: ${hoursText}
- Location: ${location}
- Persona: ${business.botConfig.aiPersona || "friendly"}

Customer message: "${message}"

Write a helpful, concise WhatsApp reply (max 3-4 sentences). Use WhatsApp formatting (bold with *). Be conversational and helpful. Include a relevant emoji. Do NOT mention you are an AI.`;

        const result = await model.generateContent(prompt);
        return result.response.text().trim();
    } catch (err) {
        return `Thanks for reaching out to *${business.name}*! We'll get back to you shortly. 🙏`;
    }
}

// ─────────────────────────────────────────────────────────────
// UTILITY FORMATTERS
// ─────────────────────────────────────────────────────────────
function formatCurrency(amount, currency = "INR") {
    const symbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£", SGD: "S$", AED: "AED " };
    return `${symbols[currency] || currency + " "}${Number(amount).toLocaleString()}`;
}

function formatHours(hours) {
    if (!hours) return "Please contact us for our hours.";
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const dayShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return days.map((day, i) => {
        const h = hours[day];
        if (!h || h.closed) return `${dayShort[i]}: Closed`;
        return `${dayShort[i]}: ${h.open || "09:00"} – ${h.close || "21:00"}`;
    }).join("\n");
}
