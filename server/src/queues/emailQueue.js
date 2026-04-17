import { createQueue } from "./baseQueue.js";
import { QUEUE_NAMES, JOB_TYPES } from "./constants.js";

const emailQueue = createQueue(QUEUE_NAMES.EMAIL_SEND);

/**
 * Enqueue an email dispatch
 */
export const enqueueEmail = async (data) => {
    return await emailQueue.add(JOB_TYPES.SEND_EMAIL, data, {
        priority: 5, // STANDARD: Normal background priority
    });
};

export default emailQueue;
