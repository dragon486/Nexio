import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
    createLead,
    getLeads,
    captureLead
} from "../controllers/lead.controller.js";

const router = express.Router();

// PUBLIC → websites, bots, landing pages
router.post("/capture", captureLead);

// PRIVATE → dashboard
router.post("/", protect, createLead);
router.get("/", protect, getLeads);

router.post("/capture", captureLead);

export default router;
