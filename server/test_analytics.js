import "dotenv/config";
import mongoose from "mongoose";
import Lead from "./src/models/Lead.js";
import Business from "./src/models/Business.js";
import User from "./src/models/User.js";
import { getLeadAnalytics } from "./src/controllers/analytics.controller.js";

// Mock Rep/Res
const mockRes = {
    json: (data) => console.log("\n--- Analytics Result ---\n", JSON.stringify(data, null, 2)),
    status: (code) => ({ json: (data) => console.error("Error:", code, data) })
};

async function verifyAnalytics() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // 1. Setup Mock Data
        // Create a temporary user
        const mockUser = await User.create({
            name: "Analytics Tester",
            email: `analytics_${Date.now()}@test.com`,
            password: "hashedpassword123"
        });

        // Create a temporary business
        const business = await Business.create({
            name: "Analytics Corp",
            owner: mockUser._id,
            apiKey: `key_${Date.now()}`
        });

        console.log(`Created Mock Business: ${business.name} (${business._id})`);

        // Seed some specific leads
        console.log("Seeding leads...");
        await Lead.create([
            { business: business._id, name: "A", status: "new", aiScore: 20, aiPriority: "low" },
            { business: business._id, name: "B", status: "contacted", aiScore: 50, aiPriority: "medium" },
            { business: business._id, name: "C", status: "qualified", aiScore: 80, aiPriority: "high" },
            { business: business._id, name: "D", status: "converted", aiScore: 95, aiPriority: "high" },
            { business: business._id, name: "E", status: "lost", aiScore: 10, aiPriority: "low" },
        ]);

        // 2. Call Controller
        const mockReq = {
            user: { businessId: business._id.toString() }
        };

        await getLeadAnalytics(mockReq, mockRes);

    } catch (e) {
        console.error(e);
    } finally {
        // Cleanup? 
        // await mongoose.connection.db.dropDatabase(); // Too dangerous
        await mongoose.disconnect();
    }
}

verifyAnalytics();
