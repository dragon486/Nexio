import "dotenv/config";
import { processLead } from "./src/services/aiScoring.js";

async function verifyMemory() {
    console.log("--- Verifying AI Conversation Memory ---");

    // 1. Simulate 1st turn
    console.log("\n1. Turn 1 (New Lead)");
    const lead1 = {
        name: "Memory Tester",
        email: "mem@test.com",
        phone: "555-555-5555",
        message: "How much does the Pro plan cost?"
    };
    const result1 = await processLead(lead1, [], "");
    console.log("AI Response:", result1.aiResponse.email.substring(0, 100) + "...");

    // 2. Simulate 2nd turn (Context Awareness)
    console.log("\n2. Turn 2 (Follow-up - 'Is THAT per month?')");
    const history = [
        { role: "user", content: lead1.message },
        { role: "model", content: result1.aiResponse.email }
    ];
    // User asks ambiguous question relying on history ("that")
    const lead2 = { ...lead1, message: "Is that price per month or year?" };

    const result2 = await processLead(lead2, history, result1.newSummary);
    console.log("AI Response:", result2.aiResponse.email.substring(0, 100) + "...");

    if (result2.aiResponse.email.toLowerCase().includes("month") || result2.aiResponse.email.toLowerCase().includes("year")) {
        console.log("✅ SUCCESS: AI understood context.");
    } else {
        console.log("⚠️ WARNING: AI might have missed context.");
    }

    // 3. Simulate Long Conversation (Compression)
    console.log("\n3. Turn 10 (Compression Check)");
    // Fake a long summary
    const longSummary = "User asked about Pro plan pricing. AI confirmed $49/mo. User asked about team seats. AI said $10/seat. User asked about API limits.";
    const result3 = await processLead({ ...lead1, message: "What about Enterprise?" }, [], longSummary);

    if (result3.newSummary && result3.newSummary.length > 10) {
        console.log("✅ SUCCESS: New summary generated:", result3.newSummary);
    } else {
        console.log("❌ FAIL: Summary not generated.");
    }
}

verifyMemory();
