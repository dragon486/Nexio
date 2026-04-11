import Notification from "../models/Notification.js";
import { emitToBusiness } from "./socket.js";

/**
 * Creates a notification in the DB and emits a socket event to the business dashboard.
 */
export const createNotification = async (businessId, { type, title, message, link, meta }) => {
    try {
        const notification = await Notification.create({
            business: businessId,
            type: type || "info",
            title,
            message,
            link,
            meta,
            read: false
        });

        // Emit to the dashboard for real-time badge updates
        emitToBusiness(businessId, "new_notification", notification);
        
        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};
