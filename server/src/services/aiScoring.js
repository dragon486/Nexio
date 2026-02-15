import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * scoreLead
 * @param {Object} lead - lead object { name, email, phone, message }
 * @returns {Object} { aiScore, aiPriority, aiNotes }
 */
/**
 * processLead
 * @param {Object} lead - lead object { name, email, phone, message }
 * @param {Array} history - interaction history [{role, content}]
 * @param {String} summary - memory summary of past context
 * @returns {Object} { aiScore, aiPriority, aiNotes, aiResponse, newSummary }
 */
export const processLead = async (lead, history = [], summary = "") => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

        // Construct History Context
        const historyText = history.map(h => `${h.role === "user" ? "Lead" : "AI"}: ${h.content}`).join("\n");

        const prompt = `
You are a highly skilled Sales AI Assistant for Arlo.ai.
Your goal is to evaluate leads and generate personalized, high-conversion follow-up content.

MEMORY CONTEXT:
${summary ? `Past Context Summary: ${summary}` : "No prior context."}

RECENT HISTORY:
${historyText || "No recent history."}

CURRENT INTERACTION:
Name: ${lead.name}
Email: ${lead.email}
Phone: ${lead.phone}
Message: ${lead.message}

Business Settings:
- Tone: ${lead.businessSettings?.tone || 'professional'}
- Style: ${lead.businessSettings?.followupStyle || 'soft'}

Task 1: Score & Classify
- Score (0-100): Based on intent, budget (if mentioned), and urgency.
- Priority: low, medium, high.
- Notes: Brief reasoning.

Task 2: Generate Content (Based on Score & Context)
- Adapt tone to be ${lead.businessSettings?.tone || 'professional'}.
- If Score < 40: Generate ONLY an "email". Polite, nurturing.
- If Score 40-70: Generate "email" AND "whatsapp". persuasive, inviting.
- If Score > 70: Generate "email", "whatsapp", "callScript" (for sales rep), and "salesFollowup" (internal note). Aggressive, high-touch.

Output JSON Structure:
{
  "aiScore": <number>,
  "aiPriority": "<low|medium|high>",
  "aiNotes": "<string>",
  "aiResponse": {
    "email": "<subject> ... <body> ...",
    "whatsapp": "<short message>",
    "salesFollowup": "<tips for sales rep>",
    "callScript": "<intro> ... <key_points> ..."
  },
  "newSummary": "<updated summary of the ENTIRE conversation including this turn, max 2 sentences>"
}
* Omit fields in aiResponse if not required by score.
* Respond EXACTLY in JSON. No Markdown.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up markdown if present
        text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");

        const data = JSON.parse(text);

        return {
            aiScore: data.aiScore || 0,
            aiPriority: data.aiPriority || "low",
            aiNotes: data.aiNotes || "",
            aiResponse: {
                email: data.aiResponse?.email || null,
                whatsapp: data.aiResponse?.whatsapp || null,
                salesFollowup: data.aiResponse?.salesFollowup || null,
                callScript: data.aiResponse?.callScript || null,
                generatedAt: new Date()
            },
            newSummary: data.newSummary || summary
        };
    } catch (error) {
        console.error("AI Processing Error:", error.message);
        // Return default/fallback structure
        return {
            aiScore: 0,
            aiPriority: "low",
            aiNotes: "AI failed to process. Check limits.",
            aiResponse: {}
        };
    }
};
