import express from "express";
import {
    register, login, googleLogin, forgotPassword, resetPassword,
    initiateGmailConnect, handleGmailCallback, disconnectGmail
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Gmail OAuth Integration
router.get("/google/gmail-connect", protect, initiateGmailConnect);
router.get("/google/gmail-callback", handleGmailCallback);
router.post("/google/gmail-disconnect", protect, disconnectGmail);

export default router;
