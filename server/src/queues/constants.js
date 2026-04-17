/**
 * Central constants for the BullMQ Queue System
 */

export const QUEUE_NAMES = {
    LEAD_PROCESSING: "lead-processing",
    EMAIL_SEND: "email-send",
    WHATSAPP_SEND: "whatsapp-send",
};

export const JOB_TYPES = {
    PROCESS_LEAD: "process-lead",
    SEND_EMAIL: "send-email",
    SEND_WHATSAPP: "send-whatsapp",
};

export const QUEUE_PREFIX = "nexio:queue";
