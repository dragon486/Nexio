import express from "express";
import {
    handleHyperlocalVerification,
    handleHyperlocalInbound,
} from "../controllers/hyperlocalWebhook.controller.js";

const router = express.Router();

// Meta webhook verification — public GET
router.get("/:businessId", handleHyperlocalVerification);

// Inbound WhatsApp messages — public POST (authenticated via Meta signature / verify token)
router.post("/:businessId", handleHyperlocalInbound);

export default router;
