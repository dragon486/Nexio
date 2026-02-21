import axios from 'axios';

async function testRegister() {
    console.log("📡 Attempting to register...");
    try {
        const response = await axios.post('http://localhost:8000/api/auth/register', {
            name: "Test User",
            email: `test_${Date.now()}@example.com`,
            password: "Password123!"
        });
        console.log("✅ Success:", response.data);
    } catch (error) {
        console.error("❌ Error:", error.response?.status, error.response?.data || error.message);
    }
}

testRegister();
