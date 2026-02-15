import "dotenv/config";
import mongoose from "mongoose";
import User from "./src/models/User.js";
import { register } from "./src/controllers/auth.controller.js";

// Mock Request/Response
const mockReq = {
    body: {
        name: "Test User",
        email: "test_reg@example.com",
        password: "password123"
    }
};

const mockRes = {
    status: (code) => ({
        json: (data) => console.log(`Response [${code}]:`, JSON.stringify(data, null, 2))
    }),
    json: (data) => console.log("Response [200]:", JSON.stringify(data, null, 2))
};

async function testRegister() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // Cleanup first
        await User.deleteOne({ email: mockReq.body.email });

        await register(mockReq, mockRes);

    } catch (e) {
        console.error("Test Error:", e);
    } finally {
        await mongoose.disconnect();
    }
}

testRegister();
