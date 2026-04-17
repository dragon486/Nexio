import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import { runtimeConfig } from "../config/env.js";
import logger from "./logger.js";

let io;

export const initSocket = async (server) => {
    io = new Server(server, {
        cors: {
            origin: runtimeConfig.clientUrl,
            methods: ["GET", "POST"],
        },
    });

    // MISSION-CRITICAL: Redis Adapter for multi-instance sync
    const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL;
    if (redisUrl) {
        try {
            const pubClient = createClient({ url: redisUrl });
            const subClient = pubClient.duplicate();

            await Promise.all([pubClient.connect(), subClient.connect()]);
            
            io.adapter(createAdapter(pubClient, subClient));
            logger.info("📡 [Socket.io] Redis Adapter enabled. Cross-instance sync active.");
        } catch (err) {
            logger.error("❌ [Socket.io] Failed to connect Redis Adapter:", err);
            // Fallback to local adapter in dev
        }
    }

    io.on("connection", (socket) => {
        console.log("🔌 New client connected:", socket.id);

        socket.on("join_business", (businessId) => {
            socket.join(businessId);
            console.log(`🏢 Socket ${socket.id} joined room: ${businessId}`);
        });

        socket.on("disconnect", () => {
            console.log("🔌 Client disconnected:", socket.id);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

export const emitToBusiness = (businessId, event, data) => {
    if (io) {
        const roomId = businessId.toString();
        console.log(`📡 Emitting ${event} to business room: ${roomId}`);
        io.to(roomId).emit(event, data);
    } else {
        console.warn("⚠️ Socket.io not initialized, cannot emit.");
    }
};
