import { Queue } from "bullmq";
import connection from "../config/redis.js";
import { QUEUE_PREFIX } from "./constants.js";

/**
 * Common Queue Configuration
 */
export const defaultJobOptions = {
    attempts: 5, // Increased for production resiliency
    backoff: {
        type: "exponential",
        delay: 5000,
    },
    removeOnComplete: {
        age: 3600, // Keep last hour of success for quick debugging
        count: 1000
    },
    removeOnFail: {
        age: 24 * 3600 * 7, // Keep failed jobs for 7 days (DLQ)
    },
    stackTraceLimit: 10,
};

/**
 * Creates a BullMQ Queue with standard Arlo configuration
 */
export const createQueue = (name) => {
    return new Queue(name, {
        connection,
        prefix: QUEUE_PREFIX,
        defaultJobOptions,
    });
};
