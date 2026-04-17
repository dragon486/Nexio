import Lead from "../../models/Lead.js";
import { sendEmail } from "../../services/emailService.js";
import redis from "../../config/redis.js";
import logger from "../../utils/logger.js";

/**
 * Worker handler for Email Dispatches
 */
export const emailSenderHandler = async (job) => {
    const { to, subject, body, ownerId, leadId, businessId } = job.data;
    const service = "email";

    try {
        // 1. LAYER 1: REDIS DISTRIBUTED IDEMPOTENCY
        const idempotencyKey = `idempotency:${service}:${leadId}:${job.id}`;
        const lock = await redis.set(idempotencyKey, "locked", "NX", "EX", 86400); // 24h TTL

        if (!lock) {
            logger.warn(`[Worker] Distributed idempotency hit for ${idempotencyKey}. Skipping external call.`);
            return { skipped: "idempotency_hit" };
        }

        // 2. LAYER 2: ATOMIC DATABASE GUARD
        if (leadId) {
            const guard = await Lead.findOneAndUpdate(
                { _id: leadId, emailSentAt: { $exists: false } }, // Atomic check
                { 
                    $set: { 
                        emailSentAt: new Date(), 
                        status: "contacted", 
                        isAutoPilotContacted: true,
                        contactedAt: new Date() 
                    } 
                },
                { new: true }
            );

            if (!guard) {
                logger.warn(`[Worker] Atomic DB guard hit for Lead ${leadId}. Email already sent. Aborting.`);
                return { skipped: "db_guard_hit" };
            }
        }

        // 3. EXECUTE EXTERNAL API
        if (isMockMode()) {
            const latency = getSimulatedLatency(200, 500); // Network is faster than AI
            await sleep(latency);
            logger.info(`[Simulation] 📧 Mock email dispatch successful (${latency}ms). Lead: ${leadId}`);
            return { success: true, threadId: "mock_thread_" + Date.now(), simulated: true };
        }

        logger.info(`[Worker] 📧 Sending email to ${to} (Lead: ${leadId})`);
        const result = await sendEmail(to, subject, body, ownerId);

        // 4. Update result metadata (threadId)
        if (leadId && result?.threadId) {
            await Lead.updateOne(
                { _id: leadId },
                { 
                    $set: { 
                        gmailThreadId: result.threadId,
                        lastEmailReceivedAt: new Date()
                    } 
                }
            );
        }

        return { success: true, threadId: result?.threadId };

    } catch (err) {
        logger.error(`[Worker] ❌ Email dispatch failed for ${to}`, err);
        throw err; // Trigger BullMQ retry
    }
};
