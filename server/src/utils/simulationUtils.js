/**
 * Simulation Utilities for Load Testing & Chaos Engineering
 */

/**
 * Generates a deterministic latency between min and max ms.
 * Uses a simple pseudo-random generator based on a seed if provided, 
 * or just a bounded Math.random distribution for now.
 * 
 * Target range: 500ms - 1200ms
 */
export const getSimulatedLatency = (min = 500, max = 1200) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Returns a promise that resolves after a simulated delay.
 */
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Checks if mock mode is active globally.
 */
export const isMockMode = () => process.env.MOCK_SERVICES === "true";
