import { createQueue } from "./baseQueue.js";
import { QUEUE_NAMES, JOB_TYPES } from "./constants.js";

const whatsappQueue = createQueue(QUEUE_NAMES.WHATSAPP_SEND);

/**
 * Enqueue a WhatsApp message dispatch
 */
export const enqueueWhatsApp = async (data) => {
    return await whatsappQueue.add(JOB_TYPES.SEND_WHATSAPP, data, {
        priority: 5, // STANDARD: Normal background priority
    });
};

export default whatsappQueue;
