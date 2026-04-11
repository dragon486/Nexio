import express from "express";
import { verifyApiKey } from "../middlewares/apiKeyMiddleware.js";
import { getWidgetConfig, handleWidgetChat } from "../controllers/widget.controller.js";

const router = express.Router();

// Get basic widget configuration (Name, Colors, etc.)
router.get("/config", verifyApiKey, getWidgetConfig);

// Process a chat message
router.post("/chat", verifyApiKey, handleWidgetChat);

export default router;
