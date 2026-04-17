import Lead from "../../models/Lead.js";
import Business from "../../models/Business.js";
import { sendWhatsAppMessage } from "../../services/whatsappService.js";
import redis from "../../config/redis.js";
import logger from "../../utils/logger.js";

/**
 * Worker handler for WhatsApp Dispatches
 */
export const whatsappSenderHandler = async (job) => {
    const { to, body, businessId, leadId } = job.data;
    const service = "whatsapp";

    try {
        // 1. Resolve State
        const business = await Business.findById(businessId);
        if (!business || !business.whatsappConfig?.accessToken) {
            throw new Error(`WhatsApp credentials missing for business ${businessId}`);
        }

        // 2. LAYER 1: REDIS DISTRIBUTED IDEMPOTENCY
        // Prevents two workers from executing the same side effect simultaneously
        const idempotencyKey = `idempotency:${service}:${leadId}:${job.id}`;
        const lock = await redis.set(idempotencyKey, "locked", "NX", "EX", 86400); // 24h TTL

        if (!lock) {
            logger.warn(`[Worker] Distributed idempotency hit for ${idempotencyKey}. Skipping external call.`);
            return { skipped: "idempotency_hit" };
        }

        // 3. LAYER 2: ATOMIC DATABASE GUARD
        // Prevents re-sending if a previous attempt technically succeeded but worker crashed before completion
        if (leadId) {
            const guard = await Lead.findOneAndUpdate(
                { _id: leadId, whatsappSentAt: { $exists: false } }, // Atomic check
                { $set: { whatsappSentAt: new Date(), status: "contacted", contactedAt: new Date() } },
                { new: true }
            );

            if (!guard) {
                logger.warn(`[Worker] Atomic DB guard hit for Lead ${leadId}. WhatsApp already sent. Aborting.`);
                return { skipped: "db_guard_hit" };
            }
        }

        // 4. EXECUTE EXTERNAL API
        if (isMockMode()) {
            const latency = getSimulatedLatency(300, 600);
            await sleep(latency);
            logger.info(`[Simulation] 💬 Mock WhatsApp dispatch successful (${latency}ms). Lead: ${leadId}`);
            return { success: true, simulated: true };
        }

        logger.info(`[Worker] 💬 Sending WhatsApp to ${to} (Lead: ${leadId})`);
        await sendWhatsAppMessage(to, body, business.whatsappConfig);

        return { success: true };

    } catch (err) {
        logger.error(`[Worker] ❌ WhatsApp dispatch failed for ${to}`, err);
        throw err; // Trigger BullMQ retry
    }
};
