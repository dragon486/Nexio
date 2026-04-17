import { GoogleGenerativeAI } from "@google/generative-ai";
import { runLocalScoring } from "./pythonBridge.js";
import { processWithOllama } from "./ollamaService.js";
import { normalizeAiResponse } from "../utils/aiResponse.js";
import { runtimeConfig } from "../config/env.js";
import { isMockMode, getSimulatedLatency, sleep } from "../utils/simulationUtils.js";

const genAI = new GoogleGenerativeAI(runtimeConfig.geminiApiKey);

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

export const processLead = async (lead, history = [], summary = "", businessName = "NEXIO", senderName = "the Sales Team", context = "email") => {
    // [SIMULATION MODE] Bypassing LLM costs during load tests
    if (isMockMode()) {
        const latency = getSimulatedLatency();
        await sleep(latency);
        
        const testId = lead.meta?.testRunId || "LOAD_TEST";
        
        return {
            aiScore: Math.floor(Math.random() * 40) + 60, // Ensure high score for follow-up testing
            aiPriority: "high",
            aiNotes: `[SIMULATION] Deterministic response (${latency}ms). Run: ${testId}`,
            aiResponse: normalizeAiResponse({
                emailSubject: `Re: Your Inquiry - ${businessName}`,
                emailBody: `Thank you for reaching out to ${businessName}. This is a simulated high-intent follow-up.`,
                whatsapp: "Hi! This is a simulated automation message.",
                generatedAt: new Date()
            }),
            newSummary: "Simulated conversation context."
        };
    }

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

        const roleInstruction = context === "widget"
            ? `You are a live conversational AI Chat Agent representing ${businessName} embedded directly on their website. Your goal is to reply in real-time to the website visitor. Keep your responses VERY short, concise, and conversational (1-3 sentences max). NEVER write like an email (no "Subject", no "Best regards", no formal sign-offs). Just answer the question directly and naturally.`
            : `You are a highly skilled Sales AI Assistant representing ${businessName}.
Your goal is to evaluate leads and generate personalized, high-conversion follow-up content.
When signing off emails or messages, ALWAYS use a professional signature like: "Best regards, the ${businessName} team" or "Best regards, ${senderName} from ${businessName}". Keep it concise and DO NOT repeat the company name twice.`;

        const prompt = `
${roleInstruction}

MEMORY CONTEXT:
${summary ? `Past Context Summary: ${summary}` : "No prior context."}

RECENT HISTORY:
${historyText || "No recent history."}

CURRENT INTERACTION:
Name: ${lead.name}
Email: ${lead.email}
Phone: ${lead.phone}
Message: ${lead.message}
Source: ${lead.source || 'Direct Entry'}

Business Settings:
- Tone: ${lead.business?.settings?.tone || 'professional'}
- Style: ${lead.business?.settings?.followupStyle || 'soft'}
- Scheduling Link: ${lead.business?.settings?.schedulingLink || 'Not provided'}
- Contact Number: ${lead.business?.settings?.businessPhone || 'Not provided'}
- Instructions: ${lead.business?.settings?.availabilityInstructions || 'Standard business hours.'}

BUSINESS KNOWLEDGE BASE (Use this to answer customer questions accurately):
${lead.business?.settings?.knowledgeBase || 'No specialized knowledge base provided. Answer generally based on the business name.'}

Task 1: Cumulative Trajectory Scoring
- Score (0-100): Evaluate the ENTIRE RECENT HISTORY. 
  - A first message of "Hi" or "Hello" is a baseline (Score ~40, low priority).
  - If the lead explicitly mentions "hire", "price", "cost", "buy", "interested in a quote", the score should instantly "Convert" to Hot (Score 80-95, high priority). General questions about background/skills should just be Warm (50-60).
  - Do not let an initial cold start suppress a later high-intent signal. The latest high-value signal always overrides previous low-intent states.
- Priority: low (0-40), medium (41-75), high (76-100).
- Notes: Brief reasoning including "Intent converted" if applicable. If a quota/limit error is passed in, use "LIMIT_REACHED" as the notes.
- PROACTIVE IDENTITY RULE: If the user's Name is still "Anonymous Visitor" and the Score is > 40 (they ask any valid question), you MUST politely ask for their name so you know who you are speaking with.
- QUALIFIED LEAD RULE: If the Score is > 70 AND you don't already have the user's Email, you MUST pivot to ask for their Email address. 
- NOTE: Ensure you exhaustively answer their actual question FIRST using the knowledge base before asking for contact info. Do not dodge their questions.

Task 2: Generate Content (Fixed Requirement)
- WHATSAPP DUAL-CHANNEL RULE: If the "Source" above is "whatsapp", you MUST generate both "emailBody" AND "whatsapp" fields. 
- TONE: Adapt tone to be ${lead.business?.settings?.tone || 'professional'}.
- Tone Guidelines: ${lead.business?.settings?.tone || 'professional'} / Style: ${lead.business?.settings?.followupStyle || 'soft'}.
- If context is "widget": Generate "chatResponse" as a short, snappy conversational reply to their message. CRITICAL: ANSWER their actual question using the Knowledge Base! THEN apply the IDENTITY and QUALIFIED LEAD rules to politely ask for their name/email if missing. ALSO generate a formal, rich "emailBody" and "emailSubject" that a human rep could click-to-send as a follow-up email.
- If context is "email": Generate "emailSubject" and standard formal "emailBody".
- If Score > 70 AND context is "email": Generate "whatsapp", "callScript", and "salesFollowup".
- CRITICAL EXTRACTION: If the user provides a Name (e.g. "I'm John", "Name is Alex"), Email, or Phone number, you MUST populate "extractedName", "extractedEmail", or "extractedPhone" with the EXACT string. If they don't, set them to null.
- If proposing a meeting, use this link: ${lead.business?.settings?.schedulingLink || 'Request availability'}.
- If sharing contact info, use this number: ${lead.business?.settings?.businessPhone || 'our official office line'}.

CRITICAL RULES:
1. NEVER use placeholders like [Insert name], [Insert number], or [Company Name]. 
2. If specific data (like a link or phone number) is missing, use general professional language or invitation to contact (e.g., "you can reach us directly" or "contact our team via the link provided").
3. DO NOT hallucinate details.
4. MUST format emailBody with proper paragraphs using newlines (\n).
5. WHATSAPP RULE: The "whatsapp" field MUST be extremely brief (1-2 sentences). NEVER include "Dear [Name]", "Best regards", or any signatures. Send it as a direct message.

Output JSON Structure:
{
  "aiScore": <number>,
  "aiPriority": "<low|medium|high>",
  "aiNotes": "<string>",
  "extractedName": "<first or full name if provided, else null>",
  "extractedEmail": "<email address if user provided one in this turn, else null>",
  "extractedPhone": "<phone number if user provided one in this turn, else null>",
  "aiResponse": {
    "chatResponse": "<short conversational reply for chat/widget>",
    "emailSubject": "<clear, engaging subject line>",
    "emailBody": "<rich, comprehensive email body text, include \\n for paragraphs>",
    "whatsapp": "<short message>",
    "salesFollowup": "<tips for sales rep>",
    "callScript": "<intro> ... <key_points> ..."
  },
  "newSummary": "<updated summary of the ENTIRE conversation including this turn, max 2 sentences>"
}
* Do NOT include keys with null values; omit fields ONLY if they are completely irrelevant (like callScript for low scores), EXCEPT "whatsapp" for WhatsApp sources.
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
            extractedName: data.extractedName || null,
            extractedEmail: data.extractedEmail || null,
            extractedPhone: data.extractedPhone || null,
            aiResponse: normalizeAiResponse({
                chatResponse: data.aiResponse?.chatResponse || null,
                emailSubject: data.aiResponse?.emailSubject || null,
                emailBody: data.aiResponse?.emailBody || data.aiResponse?.email || null,
                whatsapp: data.aiResponse?.whatsapp || null,
                salesFollowup: data.aiResponse?.salesFollowup || null,
                callScript: data.aiResponse?.callScript || null,
                generatedAt: new Date()
            }),
            newSummary: data.newSummary || summary
        };
    } catch (error) {
        const errorMessage = error.message || "";
        const isQuotaError = errorMessage.includes("Quota exceeded") || errorMessage.includes("429") || errorMessage.includes("503") || error.isFastFail;
        
        if (isQuotaError) {
            console.log(`[Resilience Mode] Gemini Quota Limit detected. Attempting Local Ollama Brain...`);
            try {
                const ollamaResult = await processWithOllama(lead, history, summary, businessName, senderName);
                return {
                    ...ollamaResult,
                    aiNotes: `${ollamaResult.aiNotes} (LIMIT_REACHED) [Local Brain Active]`
                };
            } catch (ollamaErr) {
                console.error("[Resilience Mode] Local Ollama Brain unavailable:", ollamaErr.message);
                const localResult = await runLocalScoring(lead);
                return {
                    ...localResult,
                    aiNotes: `${localResult.aiNotes} (LIMIT_REACHED) [Emergency Fallback Active]`
                };
            }
        }
        
        console.error("AI Generation Error:", errorMessage);
        throw error;
    }
};
