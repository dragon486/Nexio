import express from "express";
import cors from "cors";
import dotenv from "dotenv"; // Keep dotenv as it was in the original and is generally useful
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import { protect } from "./middlewares/authMiddleware.js";
import businessRoutes from "./routes/business.routes.js";
import leadRoutes from "./routes/lead.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";



dotenv.config(); // Keep dotenv config as it was in the original

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'API is running...' });
});

app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/api/private", protect, (req, res) => {
    res.json({
        message: "You are authorized 🎉",
        user: req.user,
    });
});



export default app;
