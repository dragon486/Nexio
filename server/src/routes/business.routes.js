import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
    createBusiness,
    getMyBusiness,
} from "../controllers/business.controller.js";

const router = express.Router();

router.post("/", protect, createBusiness);
router.get("/my", protect, getMyBusiness);

export default router;
