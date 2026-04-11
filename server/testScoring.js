import { processLead } from './src/services/aiScoring.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const history = [
  { role: "user", content: "what projects has he done?" },
  { role: "model", content: "I've handled various high-impact projects across multiple sectors." },
  { role: "user", content: "good i would like to hire him" },
  { role: "model", content: "That's great to hear! Adel is currently accepting new projects. Could you please provide your email address or phone number?" },
  { role: "user", content: "8848258969 is my whatsapp number" }
];

const leadData = {
    name: "Anonymous Visitor",
    message: "8848258969 is my whatsapp number",
    business: {
        settings: { tone: "professional", followupStyle: "soft", knowledgeBase: "Some KB here" }
    }
};

(async () => {
    try {
        const result = await processLead(leadData, history, "User wants to hire", "NEXIO", "Sales Engine", "widget");
        console.log(JSON.stringify(result, null, 2));
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
})();
