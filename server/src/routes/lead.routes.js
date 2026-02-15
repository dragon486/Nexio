import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
    createLead,
    getLeads,
    captureLead,
    getLead,
    generateFollowup
} from "../controllers/lead.controller.js";
import { verifyApiKey } from "../middlewares/apiKeyMiddleware.js";

const router = express.Router();

// PUBLIC → websites, bots, landing pages (SECURE)
router.post("/capture", verifyApiKey, captureLead);

// PRIVATE → dashboard
router.post("/", protect, createLead);
router.get("/", protect, getLeads);
router.get("/:id", protect, getLead);
router.post("/:id/generate-followup", protect, generateFollowup);

export default router;
