import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
    createBusiness,
    getMyBusiness,
    updateBusiness,
} from "../controllers/business.controller.js";

const router = express.Router();

router.post("/", protect, createBusiness);
router.get("/my", protect, getMyBusiness);
router.put("/:id", protect, updateBusiness);

export default router;
