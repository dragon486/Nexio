import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

let socket;

export const initSocket = (businessId) => {
    if (socket) {
        socket.disconnect();
    }

    socket = io(SOCKET_URL);

    socket.on("connect", () => {
        console.log("🔌 Connected to live updates");
        if (businessId) {
            socket.emit("join_business", businessId);
        }
    });

    socket.on("disconnect", () => {
        console.log("🔌 Disconnected from live updates");
    });

    return socket;
};

export const getSocket = () => socket;

export const subscribeToLeads = (callback) => {
    if (!socket) return;
    socket.on("new_lead", callback);
};

export const subscribeToAnalytics = (callback) => {
    if (!socket) return;
    socket.on("update_analytics", callback);
};

export const unsubscribeFromLeads = (callback) => {
    if (!socket) return;
    socket.off("new_lead", callback);
};

export const unsubscribeFromAnalytics = (callback) => {
    if (!socket) return;
    socket.off("update_analytics", callback);
};
