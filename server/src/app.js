import fs from "fs";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { standardLimiter } from "./middlewares/rateLimiter.js";
import { globalErrorHandler } from "./middlewares/errorMiddleware.js";
import authRoutes from "./routes/auth.routes.js";
import { protect } from "./middlewares/authMiddleware.js";
import businessRoutes from "./routes/business.routes.js";
import leadRoutes from "./routes/lead.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import healthRoutes from "./routes/health.routes.js";
import hyperlocalRoutes from "./routes/hyperlocal.routes.js";
import hyperlocalWebhookRoutes from "./routes/hyperlocalWebhook.routes.js";
import widgetRoutes from "./routes/widget.routes.js";
import { runtimeConfig } from "./config/env.js";

const app = express();

// Security & Diagnostics Middleware
app.use(helmet());
app.use(standardLimiter);

app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const msg = `[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)\n`;
        // Explicitly log 4xx errors to console for deep debugging
        if (res.statusCode >= 400 && res.statusCode < 500) {
            console.error(`🚨 [Backend Error Triggered] ${req.method} ${req.originalUrl || req.url} returned ${res.statusCode}. Check auth headers/CORS/proxy map.`);
        }
        try {

            fs.appendFileSync('/tmp/webhook-log.txt', msg);
        } catch (e) { }
    });
    next();
});
app.use(cors({
    origin: runtimeConfig.clientUrl,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'API is running...',
        health: '/api/health',
        ready: '/api/health/ready',
    });
});

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/webhooks", webhookRoutes);
app.use("/", webhookRoutes); // Catch-all for stripped /whatsapp or /api/webhooks/whatsapp

app.use("/api/hyperlocal", hyperlocalRoutes);
app.use("/hyperlocal", hyperlocalRoutes);

app.use("/api/widget", widgetRoutes);
app.use("/", hyperlocalRoutes); // Catch-all for stripped /:id/conversations

app.use("/webhooks/hyperlocal", hyperlocalWebhookRoutes);
app.use("/hyperlocal-webhook", hyperlocalWebhookRoutes);

app.get("/api/private", protect, (req, res) => {
    res.json({
        message: "You are authorized 🎉",
        user: req.user,
    });
});

// Final Error Handling Middleware
app.use(globalErrorHandler);

export default app;

