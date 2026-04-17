import express from "express";
import {
    getMe, register, login, googleLogin, forgotPassword, resetPassword,
    initiateGmailConnect, handleGmailCallback, disconnectGmail
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/google", googleLogin);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Gmail OAuth Integration
router.get("/google/gmail-connect", protect, initiateGmailConnect);
router.get("/google/gmail-callback", handleGmailCallback);
router.post("/google/gmail-disconnect", protect, disconnectGmail);

export default router;
