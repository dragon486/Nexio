import mongoose from "mongoose";

const adminAuditSchema = new mongoose.Schema({
    actionType: { 
        type: String, 
        required: true,
        enum: ["RETRY_ALL", "PURGE_DLQ", "PLAN_CHANGE", "IMPERSONATION", "BULK_DELETE"]
    },
    adminId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    ipAddress: String,
    status: {
        type: String,
        enum: ["success", "failure"],
        default: "success"
    }
}, { timestamps: true });

adminAuditSchema.index({ adminId: 1, actionType: 1, timestamp: -1 });

export default mongoose.model("AdminAudit", adminAuditSchema);
