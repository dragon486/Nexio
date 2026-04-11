import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
    createBusiness,
    getMyBusiness,
    updateBusiness,
    uploadKnowledgeBase
} from "../controllers/business.controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", protect, createBusiness);
router.get("/my", protect, getMyBusiness);
router.put("/:id", protect, updateBusiness);
router.post("/:id/upload-kb", protect, upload.single('file'), uploadKnowledgeBase);

export default router;
