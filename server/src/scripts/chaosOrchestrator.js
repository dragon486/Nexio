import { execSync } from "child_process";
import logger from "../utils/logger.js";

/**
 * Chaos Orchestrator for Arlo.ai
 * Targets and terminates worker processes during load tests to verify resiliency.
 */

const chaosRun = async () => {
    const runId = process.env.TEST_RUN_ID || `chaos_${Date.now()}`;
    const interval = parseInt(process.env.CHAOS_INTERVAL_MS) || 15000;
    const maxTerminations = parseInt(process.env.CHAOS_MAX_KILLS) || 5;

    logger.info(`💀 [Chaos] Orchestrator active. Run: ${runId} | Interval: ${interval}ms`);

    let kills = 0;

    const chaosLoop = setInterval(() => {
        if (kills >= maxTerminations) {
            logger.info("🏁 [Chaos] Maximum terminations reached. Stopping.");
            clearInterval(chaosLoop);
            return;
        }

        try {
            // Find worker processes (looking for 'src/workers/index.js')
            const stdout = execSync("ps aux | grep 'src/workers/index.js' | grep -v grep").toString();
            const lines = stdout.trim().split("\n");

            if (lines.length === 0 || !lines[0]) {
                logger.warn("⚠️ [Chaos] No active workers found to terminate.");
                return;
            }

            // Pick a random line/PID
            const line = lines[Math.floor(Math.random() * lines.length)];
            const parts = line.trim().split(/\s+/);
            const pid = parts[1];

            logger.warn(`💥 [Chaos] TERMINATING WORKER PID: ${pid} | Reason: Forced Failure Injection`);
            
            // Kill the process - SIGTERM for graceful attempt, but we want failure.
            // Using SIGKILL (kill -9) to simulate a hard crash.
            execSync(`kill -9 ${pid}`);
            
            kills++;
            logger.info(`💀 [Chaos] Workers remaining in this run: ${maxTerminations - kills}`);

        } catch (err) {
            // grep failing means no processes found
            logger.debug("[Chaos] No target processes detected in this tick.");
        }
    }, interval);

    // Watch for hard-stop from environment
    process.on("SIGINT", () => {
        clearInterval(chaosLoop);
        process.exit(0);
    });
};

chaosRun().catch(err => {
    logger.error("💥 [Chaos] Orchestrator fatal error", err);
});
