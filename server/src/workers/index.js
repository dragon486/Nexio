import 'dotenv/config';
import { Worker } from "bullmq";
import connectDB from "../config/db.js";
import connection from "../config/redis.js";
import { QUEUE_NAMES, QUEUE_PREFIX } from "../queues/constants.js";
import { leadProcessorHandler } from "./handlers/leadProcessor.js";
import { emailSenderHandler } from "./handlers/emailSender.js";
import { whatsappSenderHandler } from "./handlers/whatsappSender.js";
import logger from "../utils/logger.js";
import metricsService from "../services/metricsService.js";

/**
 * standalone Worker entry point
 */
const startWorkers = async () => {
    // 1. Ensure DB Connection
    await connectDB();

    logger.info("🚀 [Worker Server] Initializing mission-critical workers...");

    // 2. Initialize Workers with Concurrency Matrix
    const leadWorker = new Worker(QUEUE_NAMES.LEAD_PROCESSING, leadProcessorHandler, { 
        connection, 
        prefix: QUEUE_PREFIX,
        concurrency: 5 // Higher CPU impact due to AI processing
    });

    const emailWorker = new Worker(QUEUE_NAMES.EMAIL_SEND, emailSenderHandler, { 
        connection, 
        prefix: QUEUE_PREFIX,
        concurrency: 15 // Network-bound, higher concurrency safe
    });

    const whatsappWorker = new Worker(QUEUE_NAMES.WHATSAPP_SEND, whatsappSenderHandler, { 
        connection, 
        prefix: QUEUE_PREFIX,
        concurrency: 15 // Network-bound
    });

    const workers = [leadWorker, emailWorker, whatsappWorker];

    // 3. Telemetry and Persistence
    workers.forEach(worker => {
        worker.on("completed", async (job, result) => {
            const latency = Date.now() - job.timestamp;
            await metricsService.trackJob(worker.name, "success", latency);
            logger.info(`✅ [Worker] Job ${job.id} finalized: ${worker.name}`);
        });

        worker.on("failed", async (job, err) => {
            await metricsService.trackJob(worker.name, "failure");
            logger.error(`❌ [Worker] Job ${job.id} failed in ${worker.name}`, err);
        });

        worker.on("error", (err) => {
            logger.error(`🚨 [Worker] Fatal queue error: ${worker.name}`, err);
        });
    });

    // 4. Persistence Cycle: Handled by main API server to avoid race conditions.
    // However, workers still track real-time job counts in Redis.

    logger.info("🦾 [Worker Server] All systems online. Monitoring pipeline throughput.");

    // 5. Graceful Shutdown Protocol
    const shutdown = async (signal) => {
        logger.warn(`[Shutdown] Received ${signal}. Draining work...`);
        
        // Final flush before exit (safe redundancy)
        await metricsService.flushToMongo();
        
        await Promise.all(workers.map(w => w.close()));
        logger.info("[Shutdown] Workers drained. Safe exit.");
        process.exit(0);
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
};

startWorkers().catch(err => {
    logger.error("💥 [Worker Server] BOOT FAILURE", err);
    process.exit(1);
});
