import Redis from "ioredis";

const redisConfig = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    maxRetriesPerRequest: null, // Required for BullMQ
};

// Single Redis connection shared across the app but logically separated by BullMQ prefixes
const connection = new Redis(redisConfig);

connection.on("error", (err) => {
    console.error("Redis Connection Error:", err);
});

export default connection;
export { redisConfig };
