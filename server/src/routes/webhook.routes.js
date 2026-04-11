import express from "express";
import { handleMetaVerification, handleIncomingWhatsApp } from "../controllers/webhook.controller.js";

const router = express.Router();

// Meta Cloud API Webhook Verification (supports both path and stripped root)
router.get("/whatsapp", handleMetaVerification);
router.get("/", handleMetaVerification);

// Meta Cloud API Incoming Messages (supports both path and stripped root)
router.post("/whatsapp", handleIncomingWhatsApp);
router.post("/", handleIncomingWhatsApp);

export default router;
