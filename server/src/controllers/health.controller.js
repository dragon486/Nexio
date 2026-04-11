import mongoose from "mongoose";
import { runtimeConfig } from "../config/env.js";
import { buildHealthSnapshot } from "../services/healthService.js";

const createSnapshot = () => buildHealthSnapshot({
    dbReadyState: mongoose.connection.readyState,
    config: runtimeConfig,
});

export const getHealth = (req, res) => {
    res.json(createSnapshot());
};

export const getReadiness = (req, res) => {
    const snapshot = createSnapshot();
    res.status(snapshot.ready ? 200 : 503).json(snapshot);
};
