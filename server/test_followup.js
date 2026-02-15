import "dotenv/config";
import { processLead } from "./src/services/aiScoring.js";

const highValueLead = {
    name: "Enterprise Director",
    email: "director@bigcorp.com",
    phone: "555-000-0000",
    message: "We need an enterprise license for 500 seats immediately. Budget is $50k."
};

const lowValueLead = {
    name: "Test",
    email: "test@test.com",
    phone: "0000000000",
    message: "hi"
};

console.log("--- Testing AI Auto Follow-Up ---");

async function runTests() {
    console.log("\n1. Testing HIGH Value Lead (Expect: All Content)");
    try {
        const result1 = await processLead(highValueLead);
        console.log("Score:", result1.aiScore);
        console.log("Generated Content Keys:", Object.keys(result1.aiResponse).filter(k => result1.aiResponse[k]));
        if (result1.aiResponse.email && result1.aiResponse.whatsapp && result1.aiResponse.callScript) {
            console.log("✅ SUCCESS: All content generated.");
        } else {
            console.log("❌ FAIL: Missing content.");
        }
    } catch (e) { console.error(e); }

    console.log("\n2. Testing LOW Value Lead (Expect: Email Only)");
    try {
        const result2 = await processLead(lowValueLead);
        console.log("Score:", result2.aiScore);
        console.log("Generated Content Keys:", Object.keys(result2.aiResponse).filter(k => result2.aiResponse[k]));

        // generatedAt is always there, so we check for others
        const hasWhatsapp = !!result2.aiResponse.whatsapp;
        const hasCallScript = !!result2.aiResponse.callScript;

        if (!hasWhatsapp && !hasCallScript && result2.aiResponse.email) {
            console.log("✅ SUCCESS: Only Email generated.");
        } else {
            console.log("❌ FAIL: Unexpected content generated.");
        }
    } catch (e) { console.error(e); }
}

runTests();
