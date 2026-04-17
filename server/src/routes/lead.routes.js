import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
    createLead,
    getLeads,
    captureLead,
    getLead,
    generateFollowup,
    sendMessage,
    markAsRead,
    markAllAsRead,
    updateLead
} from "../controllers/lead.controller.js";
import { verifyApiKey } from "../middlewares/apiKeyMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { createLeadSchema, captureLeadSchema, updateLeadSchema } from "../validators/lead.validator.js";

const router = express.Router();

// PUBLIC → websites, bots, landing pages (SECURE)
router.post("/capture", verifyApiKey, validate(captureLeadSchema), captureLead);

// PRIVATE → dashboard
router.post("/", protect, validate(createLeadSchema), createLead);
router.get("/", protect, getLeads);
router.get("/:id", protect, getLead);
router.patch("/all/read", protect, markAllAsRead);
router.patch("/:id/read", protect, markAsRead);
router.patch("/:id", protect, validate(updateLeadSchema), updateLead);
router.post("/:id/generate-followup", protect, generateFollowup);
router.post("/:id/message", protect, sendMessage);


export default router;
