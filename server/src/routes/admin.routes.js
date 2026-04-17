import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";
import { getSystemStatus, getAllUsers, updateUserPlan, deleteUser, impersonateUser } from "../controllers/admin.controller.js";
import { getQueueStats, retryFailedJobs, purgeDLQ } from "../controllers/queue.controller.js";

const router = express.Router();

// All routes must pass through protect AND isAdmin
router.use(protect, isAdmin);

// System Management
router.get("/system-status", getSystemStatus);
router.get("/users", getAllUsers);

// Queue Management
router.get("/queues/stats", getQueueStats);
router.post("/queues/:queueName/retry", retryFailedJobs);
router.post("/queues/:queueName/purge", purgeDLQ);

// Client Node Management
router.put("/users/:id/plan", updateUserPlan);
router.delete("/users/:id", deleteUser);
router.post("/impersonate/:id", impersonateUser);

export default router;
