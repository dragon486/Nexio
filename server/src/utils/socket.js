import { Server } from "socket.io";
import { runtimeConfig } from "../config/env.js";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: runtimeConfig.clientUrl,
            methods: ["GET", "POST"],
        },
    });

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
