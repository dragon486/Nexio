import { z } from "zod";

/**
 * Validator for creating a new lead
 */
export const createLeadSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    phone: z.string().min(10, "Phone must be at least 10 digits").max(15, "Phone must not exceed 15 digits"),
    businessId: z.string().optional(), // Often taken from req.user
    message: z.string().optional(),
    dealSize: z.number().nonnegative().optional(),
    source: z.string().optional(),
});

/**
 * Validator for capturing a lead (external widget)
 */
export const captureLeadSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("A valid email is required"),
    phone: z.string().optional(), // Phone might be optional for some capture forms
    message: z.string().optional(),
    dealSize: z.number().nonnegative().optional().default(0),
    source: z.string().optional().default("website"),
});

/**
 * Validator for updating a lead's status or details
 */
export const updateLeadSchema = z.object({
    status: z.enum(["new", "contacted", "qualified", "converted", "lost"]).optional(),
    dealSize: z.number().nonnegative().optional(),
    read: z.boolean().optional(),
});
