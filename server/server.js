import 'dotenv/config';
import { createServer } from "http";
import mongoose from "mongoose";
import app from './src/app.js';
import connectDB, { disconnectDB } from "./src/config/db.js";
import { runtimeConfig, validateRuntimeConfig, getRuntimeWarnings } from "./src/config/env.js";
import { initSocket } from "./src/utils/socket.js";
import { initEmailSyncService, stopEmailSyncService } from "./src/services/emailSyncService.js";
import metricsService from "./src/services/metricsService.js";
import logger from "./src/utils/logger.js";
import fs from 'fs';
import path from 'path';

// ... existing logger setup ...

const PORT = runtimeConfig.port || 8080;
const server = createServer(app);
let flushInterval;

    await connectDB();
 
    await initSocket(server);
    initEmailSyncService();

    // Mission-Critical: Metrics Persistence Flush (15m cycle)
    flushInterval = setInterval(() => {
        metricsService.flushToMongo();
    }, 15 * 60 * 1000);

    await new Promise((resolve) => {
        server.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
            resolve();
        });
    });
};

let shuttingDown = false;

const shutdown = async (signal) => {
    if (shuttingDown) {
        return;
    }

    shuttingDown = true;
    logger.warn(`[Shutdown] Received ${signal}. Draining services...`);

    if (flushInterval) clearInterval(flushInterval);
    
    // Final defensive flush
    await metricsService.flushToMongo();

    stopEmailSyncService();

    await new Promise((resolve) => {
        server.close(() => resolve());
    });

    if (mongoose.connection.readyState !== 0) {
        await disconnectDB();
    }

    console.log("[Shutdown] Complete.");
    process.exit(0);
};

process.on("SIGINT", () => {
    shutdown("SIGINT").catch((error) => {
        console.error("[Shutdown] Failed:", error);
        process.exit(1);
    });
});

process.on("SIGTERM", () => {
    shutdown("SIGTERM").catch((error) => {
        console.error("[Shutdown] Failed:", error);
        process.exit(1);
    });
});

startServer().catch((error) => {
    console.error("[Startup] Failed to boot server:", error);
    process.exit(1);
});

// Nexio Production Pipeline Active
// Built for Scale & Automated Deployment
