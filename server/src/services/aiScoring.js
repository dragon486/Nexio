import { GoogleGenerativeAI } from "@google/generative-ai";
import { runLocalScoring } from "./pythonBridge.js";

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
let apiFallbackUntil = null;
let apiFallbackReason = null;
let apiFallbackIsDaily = false;

export const processLead = async (lead, history = [], summary = "", businessName = "Arlo.ai", senderName = "the Sales Team") => {
    try {
        // Fast-fail if we are in a known quota outage
        if (apiFallbackUntil && Date.now() < apiFallbackUntil) {
            console.log(`[Resilience Mode] Fast-failing Gemini API call. Known outage: ${apiFallbackReason}`);
            const fakeError = new Error(`Quota exceeded: ${apiFallbackReason}`);
            fakeError.isFastFail = true;
            fakeError.isDaily = apiFallbackIsDaily;
            throw fakeError;
        }

        const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

        // Construct History Context
        const historyText = history.map(h => `${h.role === "user" ? "Lead" : "AI"}: ${h.content}`).join("\n");

        const prompt = `
You are a highly skilled Sales AI Assistant representing ${businessName}.
Your goal is to evaluate leads and generate personalized, high-conversion follow-up content.
When signing off emails or messages, ALWAYS use a professional signature like: "Best regards, the ${businessName} team" or "Best regards, ${senderName} from ${businessName}". Keep it concise and DO NOT repeat the company name twice.

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
- Tone: ${lead.business?.settings?.tone || 'professional'}
- Style: ${lead.business?.settings?.followupStyle || 'soft'}
- Scheduling Link: ${lead.business?.settings?.schedulingLink || 'Not provided'}
- Contact Number: ${lead.business?.settings?.businessPhone || 'Not provided'}
- Instructions: ${lead.business?.settings?.availabilityInstructions || 'Standard business hours.'}

Task 1: Score & Classify
- Score (0-100): Based on intent, budget (if mentioned), and urgency.
- Priority: low, medium, high.
- Notes: Brief reasoning.

Task 2: Generate Content (Based on Score & Context)
- Adapt tone to be ${lead.business?.settings?.tone || 'professional'}.
- STRICTLY FOLLOW these instructions: ${lead.business?.settings?.availabilityInstructions || 'None'}.
- If Score < 40: Generate ONLY "emailSubject" and "emailBody". Polite, nurturing.
- If Score 40-70: Generate "emailSubject", "emailBody", AND "whatsapp". persuasive, inviting.
- If Score > 70: Generate "emailSubject", "emailBody", "whatsapp", "callScript", and "salesFollowup". Aggressive, high-touch.
- If proposing a meeting, use this link: ${lead.business?.settings?.schedulingLink || 'Request availability'}.
- If sharing contact info, use this number: ${lead.business?.settings?.businessPhone || 'our official office line'}.

CRITICAL RULES:
1. NEVER use placeholders like [Insert name], [Insert number], or [Company Name]. 
2. If specific data (like a link or phone number) is missing, use general professional language or invitation to contact (e.g., "you can reach us directly" or "contact our team via the link provided").
3. DO NOT hallucinate details.
4. MUST format emailBody with proper paragraphs using newlines (\n).

Output JSON Structure:
{
  "aiScore": <number>,
  "aiPriority": "<low|medium|high>",
  "aiNotes": "<string>",
  "aiResponse": {
    "emailSubject": "<clear, engaging subject line>",
    "emailBody": "<email body text, include \\n for paragraphs>",
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
        text = text.replace(/^```json\s* /, "").replace(/\s * ```$/, "");

        const data = JSON.parse(text);

        return {
            aiScore: data.aiScore || 0,
            aiPriority: data.aiPriority || "low",
            aiNotes: data.aiNotes || "",
            aiResponse: {
                emailSubject: data.aiResponse?.emailSubject || null,
                email: data.aiResponse?.emailBody || data.aiResponse?.email || null,
                whatsapp: data.aiResponse?.whatsapp || null,
                salesFollowup: data.aiResponse?.salesFollowup || null,
                callScript: data.aiResponse?.callScript || null,
                generatedAt: new Date()
            },
            newSummary: data.newSummary || summary
        };
    } catch (error) {
        const errorMessage = error.message || "";
        const isQuotaError = errorMessage.includes("Quota exceeded") || errorMessage.includes("429") || error.isFastFail;
        const errorDetails = JSON.stringify(error) || "";
        const isDaily = error.isDaily || (isQuotaError && (errorMessage.includes("PerDay") ||
            errorMessage.includes("limit: 20") ||
            errorDetails.includes("PerDay") ||
            errorDetails.includes("GenerateRequestsPerDay")));

        // Cache the outage to automatically fast-fail subsequent leads
        if (isQuotaError && !error.isFastFail) {
            apiFallbackUntil = Date.now() + (isDaily ? 24 * 60 * 60 * 1000 : 60 * 1000); // 24h for daily, 60s for burst
            apiFallbackReason = isDaily ? "Daily Quota Hit" : "Rate Limit Hit";
            apiFallbackIsDaily = isDaily;
            console.warn(`[Resilience Mode] Gemini API limit reached.caching outage until ${new Date(apiFallbackUntil).toLocaleTimeString()} `);
        }

        console.error("AI Generation Error:", errorMessage);

        // Resilience Mode: Try local scoring for any transient/quota error
        try {
            console.log("[Resilience Mode] Attempting local Python scoring...");
            const localResult = await runLocalScoring(lead);

            let suffix = " (Note: Gemini API is temporarily unavailable).";
            if (isDaily) suffix = " (Note: Gemini daily quota hit).";
            else if (isQuotaError) suffix = " (Note: Gemini is briefly overwhelmed).";

            return {
                ...localResult,
                aiNotes: `${localResult.aiNotes}${suffix} `
            };
        } catch (fallbackError) {
            console.error("Local Fallback Failed:", fallbackError.message);

            // Extreme fallback if even Python fails
            if (isDaily) {
                return {
                    aiScore: 0,
                    aiPriority: "low",
                    aiNotes: "Daily AI Quota reached. Please try again tomorrow or upgrade.",
                    aiResponse: {}
                };
            }

            const resetTime = new Date(Date.now() + 60 * 1000);
            const fullEndString = new Intl.DateTimeFormat('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric'
            }).format(resetTime) + ' at ' + new Intl.DateTimeFormat('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            }).format(resetTime);

            return {
                aiScore: isQuotaError ? 0 : null,
                aiPriority: "low",
                aiNotes: isQuotaError
                    ? `AI Rate Limit Hit.Reset at ${fullEndString}.`
                    : "AI Processing Error. Please try again later.",
                aiResponse: {}
            };
        }
    }
};
