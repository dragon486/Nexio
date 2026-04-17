import leadQueue from "../queues/leadQueue.js";
import emailQueue from "../queues/emailQueue.js";
import whatsappQueue from "../queues/whatsappQueue.js";
import AdminAudit from "../models/AdminAudit.js";
import logger from "../utils/logger.js";

const queues = {
    lead: leadQueue,
    email: emailQueue,
    whatsapp: whatsappQueue
};

/**
 * Controller for Administrative Queue Operations
 */
export const getQueueStats = async (req, res) => {
    try {
        const stats = {};
        for (const [name, queue] of Object.entries(queues)) {
            const [waiting, active, completed, failed, delayed] = await Promise.all([
                queue.getWaitingCount(),
                queue.getActiveCount(),
                queue.getCompletedCount(),
                queue.getFailedCount(),
                queue.getDelayedCount()
            ]);
            stats[name] = { waiting, active, completed, failed, delayed };
        }
        res.json(stats);
    } catch (err) {
        logger.error("[QueueController] Failed to fetch stats", err);
        res.status(500).json({ error: "Failed to fetch queue statistics" });
    }
};

export const retryFailedJobs = async (req, res) => {
    const { queueName } = req.params;
    const queue = queues[queueName];

    if (!queue) return res.status(404).json({ error: "Queue not found" });

    try {
        const failedJobs = await queue.getFailed();
        
        // Log Audit Trail
        await AdminAudit.create({
            actionType: "RETRY_ALL",
            adminId: req.user.id,
            metadata: { queueName, jobCount: failedJobs.length },
            ipAddress: req.ip
        });

        // Bulk Retry
        await Promise.all(failedJobs.map(job => job.retry()));

        logger.info(`[Admin] Queue ${queueName}: Retried ${failedJobs.length} jobs.`);
        res.json({ message: `Successfully enqueued ${failedJobs.length} jobs for retry.`, retriedCount: failedJobs.length });
    } catch (err) {
        logger.error(`[QueueController] Failed to retry jobs for ${queueName}`, err);
        res.status(500).json({ error: "Internal server error during retry operation" });
    }
};

export const purgeDLQ = async (req, res) => {
    const { queueName } = req.params;
    const queue = queues[queueName];

    if (!queue) return res.status(404).json({ error: "Queue not found" });

    try {
        const failedCount = await queue.getFailedCount();

        // Security: Log Audit Trail (Mandatory for destructive actions)
        await AdminAudit.create({
            actionType: "PURGE_DLQ",
            adminId: req.user.id,
            metadata: { queueName, purgedCount: failedCount },
            ipAddress: req.ip
        });

        // Clean jobs failing older than 0ms (clears all failed)
        await queue.clean(0, 0, 'failed');

        logger.warn(`[Admin] Queue ${queueName}: PURGED ${failedCount} failed jobs.`);
        res.json({ message: `Successfully purged ${failedCount} failed jobs from ${queueName}.` });
    } catch (err) {
        logger.error(`[QueueController] Failed to purge jobs for ${queueName}`, err);
        res.status(500).json({ error: "Internal server error during purge operation" });
    }
};
