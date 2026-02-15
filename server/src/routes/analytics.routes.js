import express from "express";
import { getLeadAnalytics } from "../controllers/analytics.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getLeadAnalytics);

export default router;
