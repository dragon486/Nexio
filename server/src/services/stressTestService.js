import redis from "../config/redis.js";
import Lead from "../models/Lead.js";
import { QUEUE_NAMES, QUEUE_PREFIX } from "../queues/constants.js";
import { Queue } from "bullmq";
import connection from "../config/redis.js";
import logger from "../utils/logger.js";
import fs from "fs/promises";
import path from "path";

/**
 * Service for managing Stress Test Lifecycles and Snapshots
 */
class StressTestService {
    constructor() {
        this.queues = {};
        Object.values(QUEUE_NAMES).forEach(name => {
            this.queues[name] = new Queue(name, { connection, prefix: QUEUE_PREFIX });
        });
    }

    /**
     * Captures a point-in-time snapshot of system health
     */
    async captureSnapshot(runId, phase = "initial") {
        logger.info(`[StressTest] Capturing ${phase} snapshot for Run: ${runId}`);
        
        try {
            const queueMetrics = {};
            for (const [name, queue] of Object.entries(this.queues)) {
                const [waiting, active, completed, failed, delayed] = await Promise.all([
                    queue.getWaitingCount(),
                    queue.getActiveCount(),
                    queue.getCompletedCount(),
                    queue.getFailedCount(),
                    queue.getDelayedCount()
                ]);
                
                queueMetrics[name] = { waiting, active, completed, failed, delayed };
            }

            // Redis Stats
            const info = await redis.info("memory");
            const usedMemory = info.match(/used_memory_human:(\S+)/)?.[1] || "unknown";

            // DB Stats (Optional: targeted to test leads)
            const dbTestLeads = await Lead.countDocuments({ "meta.testRunId": runId });

            const snapshot = {
                runId,
                phase,
                timestamp: new Date().toISOString(),
                metrics: {
                    queues: queueMetrics,
                    redis: { usedMemory },
                    db: { testLeads: dbTestLeads }
                }
            };

            return snapshot;
        } catch (err) {
            logger.error(`[StressTest] Snapshot failure: ${err.message}`);
            throw err;
        }
    }

    /**
     * Finalizes test run and generates stress-results.json
     */
    async finalizeReport(runId, startSnapshot, endSnapshot, config) {
        logger.info(`[StressTest] Generating final report for Run: ${runId}`);

        const resultsDir = path.join(process.cwd(), "stress-results");
        try {
            await fs.mkdir(resultsDir, { recursive: true });
        } catch (e) {}

        const report = {
            runId,
            config,
            startTime: startSnapshot.timestamp,
            endTime: endSnapshot.timestamp,
            durationMs: new Date(endSnapshot.timestamp) - new Date(startSnapshot.timestamp),
            delta: {
                leadsCreated: endSnapshot.metrics.db.testLeads - startSnapshot.metrics.db.testLeads,
                jobsCompleted: this._calculateDelta(startSnapshot.metrics.queues, endSnapshot.metrics.queues, "completed"),
                jobsFailed: this._calculateDelta(startSnapshot.metrics.queues, endSnapshot.metrics.queues, "failed")
            },
            snapshots: { start: startSnapshot, end: endSnapshot }
        };

        const filePath = path.join(resultsDir, `run_${runId}.json`);
        await fs.writeFile(filePath, JSON.stringify(report, null, 2));
        
        logger.info(`[StressTest] Report locked: ${filePath}`);
        return report;
    }

    _calculateDelta(start, end, field) {
        let total = 0;
        for (const queue of Object.keys(end)) {
            total += (end[queue][field] || 0) - (start[queue]?.[field] || 0);
        }
        return total;
    }
}

export default new StressTestService();
