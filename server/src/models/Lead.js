import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        phone: String,
        source: {
            type: String,
            default: "website",
        },
        message: String,
        status: {
            type: String,
            enum: ["new", "contacted", "qualified", "converted", "lost"],
            default: "new",
        },
        score: {
            type: Number,
            default: 0,
        },
        business: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Business",
            required: true,
        },
        meta: Object,
    },
    { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
