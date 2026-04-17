import { createQueue } from "./baseQueue.js";
import { QUEUE_NAMES, JOB_TYPES } from "./constants.js";

const leadQueue = createQueue(QUEUE_NAMES.LEAD_PROCESSING);

/**
 * Enqueue a lead for processing (AI Scoring + Actions)
 * Uses leadId as jobId for IDEMPOTENCY.
 */
export const enqueueLead = async (data, customJobId = null) => {
    return await leadQueue.add(JOB_TYPES.PROCESS_LEAD, data, {
        jobId: customJobId || `lead_${data.leadId}`, // Default idempotency by leadId
        priority: 1, // HIGH: Lead capture takes precedence
    });
};

export default leadQueue;
