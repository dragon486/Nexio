import mongoose from 'mongoose';
import { runtimeConfig } from './env.js';

const DB_READY_STATES = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
};

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    const conn = await mongoose.connect(runtimeConfig.mongoUri, {
        autoIndex: runtimeConfig.nodeEnv !== "production",
        maxPoolSize: 20,
        serverSelectionTimeoutMS: 10000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn.connection;
};

export const disconnectDB = async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
    }
};

export const getDatabaseState = () => ({
    ready: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    state: DB_READY_STATES[mongoose.connection.readyState] || "unknown",
});

export default connectDB;
