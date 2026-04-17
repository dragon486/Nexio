import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Calls the local Python scorer as a fallback when API is unavailable.
 * @param {Object} leadData - { name, email, phone, message }
 * @returns {Promise<Object>} - { aiScore, aiPriority, aiNotes, aiResponse }
 */
export const runLocalScoring = (leadData) => {
    return new Promise((resolve, reject) => {
        const pythonPath = process.env.PYTHON_PATH || "python3";
        const pythonProcess = spawn(pythonPath, [path.join(__dirname, "localScorer.py")]);

        let output = "";
        let errorOutput = "";

        pythonProcess.stdin.write(JSON.stringify(leadData));
        pythonProcess.stdin.end();

        pythonProcess.stdout.on("data", (data) => {
            output += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            errorOutput += data.toString();
        });

        pythonProcess.on("close", (code) => {
            if (code !== 0) {
                console.error("Python Scorer Error:", errorOutput);
                return reject(new Error(errorOutput || "Python process exited with code " + code));
            }
            try {
                resolve(JSON.parse(output));
            } catch (e) {
                reject(new Error("Failed to parse Python output: " + output));
            }
        });
    });
};
