import redis from "../config/redis.js";
import SystemMetric from "../models/SystemMetric.js";
import logger from "../utils/logger.js";

const METRIC_PREFIX = "nexio:metrics:";

/**
 * Service for tracking real-time and historical job metrics.
 */
class MetricsService {
    /**
     * Increment job counters in Redis
     * @param {string} queueName 
     * @param {string} status 'success' | 'failure'
     * @param {number} latency ms
     */
    async trackJob(queueName, status, latency = 0) {
        const now = new Date();
        const hourKey = this._getHourKey(now, queueName);
        
        try {
            const pipeline = redis.pipeline();
            
            // Increment counters
            if (status === "success") {
                pipeline.incr(`${hourKey}:success`);
            } else {
                pipeline.incr(`${hourKey}:failure`);
            }

            // Track latency (simple sum for averaging during flush)
            pipeline.incrby(`${hourKey}:latency_sum`, Math.round(latency));
            pipeline.incr(`${hourKey}:count`);
            
            // Set expiry to 25 hours (just enough to cover potential flush delays)
            pipeline.expire(`${hourKey}:success`, 90000);
            pipeline.expire(`${hourKey}:failure`, 90000);
            pipeline.expire(`${hourKey}:latency_sum`, 90000);
            pipeline.expire(`${hourKey}:count`, 90000);

            await pipeline.exec();
        } catch (err) {
            logger.error(`[Metrics] Failed to track job for ${queueName}`, err);
        }
    }

    /**
     * Flush ephemeral Redis counters to MongoDB SystemMetric collection.
     * Usually called by a cron or a dedicated background task.
     */
    async flushToMongo() {
        logger.info("[Metrics] Starting flush to MongoDB...");
        
        try {
            // Find all metric keys in Redis
            const keys = await redis.keys(`${METRIC_PREFIX}*`);
            const processedHours = new Set();

            for (const key of keys) {
                // key format: nexio:metrics:2026-04-17:01:queueName:status
                const parts = key.split(":");
                const hourSlug = `${parts[2]}:${parts[3]}`; // 2026-04-17:01
                const queueName = parts[4];
                processedHours.add(`${hourSlug}|${queueName}`);
            }

            for (const item of processedHours) {
                const [hourSlug, queueName] = item.split("|");
                const hourKey = `${METRIC_PREFIX}${hourSlug}:${queueName}`;

                const [success, failure, latencySum, count] = await Promise.all([
                    redis.get(`${hourKey}:success`).then(v => parseInt(v) || 0),
                    redis.get(`${hourKey}:failure`).then(v => parseInt(v) || 0),
                    redis.get(`${hourKey}:latency_sum`).then(v => parseInt(v) || 0),
                    redis.get(`${hourKey}:count`).then(v => parseInt(v) || 0)
                ]);

                if (count === 0) continue;

                const avgLatency = Math.round(latencySum / count);
                const timestamp = new Date(`${hourSlug.split(":")[0]}T${hourSlug.split(":")[1]}:00:00Z`);

                // Upsert into MongoDB
                await SystemMetric.findOneAndUpdate(
                    { queueName, timestamp },
                    { 
                        $set: { 
                            successCount: success,
                            failureCount: failure,
                            p95Latency: avgLatency // Using avg for simplicity in v1
                        } 
                    },
                    { upsert: true }
                );

                logger.debug(`[Metrics] Flushed ${queueName} for hour ${hourSlug}`);
            }

            logger.info("[Metrics] Flush complete.");
        } catch (err) {
            logger.error("[Metrics] Critical failure during flush", err);
        }
    }

    _getHourKey(date, queueName) {
        const ymd = date.toISOString().split("T")[0];
        const hour = date.getUTCHours().toString().padStart(2, "0");
        return `${METRIC_PREFIX}${ymd}:${hour}:${queueName}`;
    }
}

export default new MetricsService();
