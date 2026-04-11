import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";
import { getSystemStatus, getAllUsers, updateUserPlan, deleteUser, impersonateUser } from "../controllers/admin.controller.js";

const router = express.Router();

// All routes must pass through protect AND isAdmin
router.use(protect, isAdmin);

// GET /api/admin/system-status
router.get("/system-status", getSystemStatus);

// GET /api/admin/users
router.get("/users", getAllUsers);

// PUT /api/admin/users/:id/plan
router.put("/users/:id/plan", updateUserPlan);

// DELETE /api/admin/users/:id
router.delete("/users/:id", deleteUser);

// POST /api/admin/impersonate/:id
router.post("/impersonate/:id", impersonateUser);

export default router;
