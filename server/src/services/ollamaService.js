/**
 * processWithOllama
 * Local LLM fallback for lead scoring when Gemini is unavailable.
 * @param {Object} lead - lead object
 * @param {Array} history - [{role, content}]
 * @param {String} summary - past context
 * @returns {Object} { aiScore, aiPriority, aiNotes, aiResponse }
 */
export const processWithOllama = async (lead, history = [], summary = "", businessName = "NEXIO", senderName = "the Sales Team") => {
    try {
        const historyText = history.map(h => `${h.role === "user" ? "Lead" : "AI"}: ${h.content}`).join("\n");

        const prompt = `
You are the Local Intelligence Core for ${businessName}. 
Your goal is to evaluate leads and generate follow-ups.

MEMORY CONTEXT:
${summary || "No prior context."}

RECENT HISTORY:
${historyText || "No recent history."}

CURRENT INTERACTION:
Name: ${lead.name}
Email: ${lead.email}
Phone: ${lead.phone}
Message: ${lead.message}
Source: ${lead.source || 'whatsapp'}

Task 1: Cumulative Trajectory Scoring
- Score (0-100): Evaluate the ENTIRE RECENT HISTORY. 
  - A first message of "Hi" is Score ~40.
  - If they mention "buy", "price", "how much", "interested" in any turn, Score MUST be 85-95.
  - The latest high-value signal overrides previous low-intent states.
- Priority: low (0-40), medium (41-75), high (76-100).
- Notes: Brief reasoning starting with "[OLLAMA LOCAL BRAIN]".

Task 2: Generate Content
- Generate "emailSubject", "emailBody", and "whatsapp" (1-2 sentences).

Output ONLY pure JSON:
{
  "aiScore": <number>,
  "aiPriority": "<low|medium|high>",
  "aiNotes": "<string>",
  "aiResponse": {
    "emailSubject": "<string>",
    "emailBody": "<string>",
    "whatsapp": "<short string>"
  }
}`;

        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            body: JSON.stringify({
                model: 'llama3.2:3b',
                prompt: prompt,
                stream: false,
                format: 'json'
            })
        });

        if (!response.ok) throw new Error(`Ollama error: ${response.statusText}`);
        
        const data = await response.json();
        const result = JSON.parse(data.response);

        return {
            ...result,
            aiNotes: `${result.aiNotes} (Local AI Active) `
        };
    } catch (error) {
        console.error("[Ollama Service] Local LLM failed:", error.message);
        throw error;
    }
};
