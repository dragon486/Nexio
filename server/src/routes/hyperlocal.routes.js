import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
    registerBusiness,
    getMyBusiness,
    updateConfig,
    getConversations,
    getCustomers,
    sendBroadcast,
    getBroadcasts,
    getAnalytics,
} from "../controllers/hyperlocal.controller.js";

const router = express.Router();

// All routes are protected
router.use(protect);

router.post("/register", registerBusiness);
router.get("/my", getMyBusiness);
router.put("/:id/config", updateConfig);
router.get("/:id/conversations", getConversations);
router.get("/:id/customers", getCustomers);
router.get("/:id/broadcasts", getBroadcasts);
router.post("/:id/broadcast", sendBroadcast);
router.get("/:id/analytics", getAnalytics);

export default router;
