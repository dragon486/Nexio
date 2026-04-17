import 'dotenv/config';
import axios from "axios";
import mongoose from "mongoose";
import connectDB, { disconnectDB } from "../config/db.js";
import stressTestService from "../services/stressTestService.js";
import logger from "../utils/logger.js";

/**
 * High-Pressure Load Generator for Nexio
 * Generates realistic lead data with fixed RNG seeds.
 */

// --- Minimal Mock Data Generator (Replaces Faker to avoid env friction) ---
class MockData {
    constructor(seed) {
        this.seed = seed;
    }

    randomItem(arr) {
        const x = Math.sin(this.seed++) * 10000;
        const idx = Math.floor((x - Math.floor(x)) * arr.length);
        return arr[idx];
    }

    name() {
        return this.randomItem(["Alex", "Jordan", "Taylor", "Casey", "Morgan", "Riley", "Quinn"]);
    }

    message() {
        return this.randomItem([
            "I am interested in hiring your team for a project.",
            "Can you tell me about your pricing?",
            "Just checking in to say hi.",
            "I need a quote for a warehouse installation.",
            "How do I book a consultation?"
        ]);
    }

    email(name) {
        return `${name.toLowerCase()}.${Math.floor(Math.random() * 1000)}@test.com`;
    }
}

const runLoadTest = async () => {
    const config = {
        rps: parseInt(process.env.TEST_RPS) || 10,
        maxJobs: parseInt(process.env.TEST_MAX_JOBS) || 1000,
        maxDurationMs: (parseInt(process.env.TEST_DURATION_MINS) || 10) * 60 * 1000,
        apiKey: process.env.TEST_API_KEY || "admin_load_test_key",
        apiEndpoint: process.env.TEST_ENDPOINT || "http://localhost:8080/api/leads/capture"
    };

    const runId = `run_${Date.now()}`;
    const mock = new MockData(12345); // FIXED SEED per CTO request
    await connectDB();

    logger.info(`🔥 [LoadGen] Starting Run: ${runId} | RPS: ${config.rps} | Limit: ${config.maxJobs} jobs`);

    const startSnapshot = await stressTestService.captureSnapshot(runId, "initial");
    const startTime = Date.now();
    let jobsSent = 0;
    let stopReason = null;

    const intervalMs = 1000 / config.rps;

    const testLoop = setInterval(async () => {
        // Hard-stop conditions
        if (jobsSent >= config.maxJobs) {
            stopReason = "max_jobs_reached";
            clearInterval(testLoop);
            return;
        }
        if (Date.now() - startTime > config.maxDurationMs) {
            stopReason = "timeout";
            clearInterval(testLoop);
            return;
        }

        const name = mock.name();
        const payload = {
            name,
            email: mock.email(name),
            message: mock.message(),
            source: "load_test", // Mandatory tagging
            apiKey: config.apiKey, // Passed in body for middleware
            meta: {
                testRunId: runId, // Context propagation
                isSimulation: true
            }
        };

        jobsSent++;
        
        try {
            axios.post(config.apiEndpoint, payload).catch(e => {
                logger.error(`[LoadGen] Request Failed: ${e.response?.status} - ${JSON.stringify(e.response?.data)}`);
            });
        } catch (e) {
            // Silently swallow network errors during high pressure
        }

        if (jobsSent % 50 === 0) {
            logger.info(`🚀 [LoadGen] Progress: ${jobsSent}/${config.maxJobs} sent...`);
        }
    }, intervalMs);

    // Watch for loop termination
    while (!stopReason) {
        await new Promise(r => setTimeout(r, 1000));
    }

    logger.info(`🏁 [LoadGen] Run Finished: ${stopReason}. Waiting for queue draining...`);
    
    // Give workers time to catch up (based on simulated latency)
    await new Promise(r => setTimeout(r, 5000));

    const endSnapshot = await stressTestService.captureSnapshot(runId, "final");
    await stressTestService.finalizeReport(runId, startSnapshot, endSnapshot, config);
    
    await mongoose.connection.close();
};

runLoadTest().catch(err => {
    logger.error("💥 [LoadGen] Fatal Failure", err);
});
