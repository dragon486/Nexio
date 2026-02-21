import axios from 'axios';

const API_KEY = "f3f0780e66cffcf8800dcf48d12bb9ff39f3115cf35ca648"; // John's API Key from previous logs
const BASE_URL = "http://localhost:8000";

async function simulateLiveLead() {
    console.log("📡 Sending live lead capture request...");

    try {
        const response = await axios.post(`${BASE_URL}/api/leads/capture`, {
            name: "Live Test User ⚡️",
            email: "live_test@example.com",
            message: "I need this urgently for my business. I have a budget of $50k."
        }, {
            headers: {
                'x-api-key': API_KEY
            }
        });

        console.log("✅ SUCCESS: Lead captured!");
        console.log("Details:", {
            id: response.data._id,
            score: response.data.aiScore,
            status: response.data.status
        });
    } catch (error) {
        console.error("❌ FAILED:", error.response?.data || error.message);
    }
}

simulateLiveLead();
