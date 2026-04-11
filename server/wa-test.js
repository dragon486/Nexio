import dotenv from 'dotenv';
dotenv.config();
import { processWithOllama } from './src/services/ollamaService.js';

console.log('--- OLLAMA LOCAL BRAIN TEST ---');
const testLead = {
    name: "Adel Muhammed",
    email: "adel@test.com",
    phone: "918848258969",
    message: "Hi"
};
const history = [
    { role: "user", content: "Hi" },
    { role: "model", content: "Hello! How can I help?" },
    { role: "user", content: "I will buy. How much for your solar solutions?" }
];

console.log('Testing "Trajectory Recall" (History) on Local M2 chip...');

processWithOllama(testLead, history, "User wants to buy energy solutions", "Nexio", "Tony Stark")
    .then(result => {
        console.log('Local AI Response:', JSON.stringify(result, null, 2));
        if (result.aiScore >= 85) {
            console.log('✅ SUCCESS: Local Brain recognized historical intent!');
        } else {
            console.log('❌ FAILURE: Local Brain score too low:', result.aiScore);
        }
        process.exit(0);
    })
    .catch(err => {
        console.error('Ollama Integration Error:', err.message);
        process.exit(1);
    });
