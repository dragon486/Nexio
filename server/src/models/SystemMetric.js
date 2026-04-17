import mongoose from "mongoose";

const systemMetricSchema = new mongoose.Schema({
    queueName: { type: String, required: true },
    successCount: { type: Number, default: 0 },
    failureCount: { type: Number, default: 0 },
    p95Latency: { type: Number, default: 0 }, // in ms
    timestamp: { 
        type: Date, 
        required: true, 
        index: true 
    } // Hourly bucket
}, { timestamps: true });

// Index for efficient historical querying
systemMetricSchema.index({ queueName: 1, timestamp: -1 });

export default mongoose.model("SystemMetric", systemMetricSchema);
