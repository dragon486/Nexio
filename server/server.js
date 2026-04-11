import 'dotenv/config';
import { createServer } from "http";
import mongoose from "mongoose";
import app from './src/app.js';
import connectDB, { disconnectDB } from "./src/config/db.js";
import { runtimeConfig, validateRuntimeConfig, getRuntimeWarnings } from "./src/config/env.js";
import { initSocket } from "./src/utils/socket.js";
import { initEmailSyncService, stopEmailSyncService } from "./src/services/emailSyncService.js";
import fs from 'fs';
import path from 'path';

// Log to file for debugging
const logFile = fs.createWriteStream(path.join(process.cwd(), 'debug.log'), { flags: 'a' });
const logStdout = process.stdout;

console.log = (...args) => {
    logFile.write(new Date().toISOString() + ' [INFO] ' + args.join(' ') + '\n');
    logStdout.write(args.join(' ') + '\n');
};
console.error = (...args) => {
    logFile.write(new Date().toISOString() + ' [ERROR] ' + args.join(' ') + '\n');
    logStdout.write(args.join(' ') + '\n');
};

validateRuntimeConfig();
getRuntimeWarnings().forEach((warning) => {
    console.warn(`[Startup Warning] ${warning}`);
});

const PORT = runtimeConfig.port;
const server = createServer(app);

const startServer = async () => {
    await connectDB();

    initSocket(server);
    initEmailSyncService();

    await new Promise((resolve) => {
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
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
    console.log(`[Shutdown] Received ${signal}. Draining services...`);

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
