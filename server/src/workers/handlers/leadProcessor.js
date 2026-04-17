import Lead from "../../models/Lead.js";
import Business from "../../models/Business.js";
import { processLead } from "../../services/aiScoring.js";
import { validateAiOutput, getFallbackEmail } from "../../utils/safetyGuard.js";
import { getEmailDraft, hasEmailDraft, normalizeAiResponse } from "../../utils/aiResponse.js";
import { checkAndIncrementEmailLimit, isWithinWorkingHours, notifyAiLimit } from "../../utils/businessRules.js";
import { enqueueEmail } from "../../queues/emailQueue.js";
import { emitToBusiness } from "../../utils/socket.js";

/**
 * Worker handler for Lead Processing (AI Scoring + Decisioning)
 */
export const leadProcessorHandler = async (job) => {
    const { leadId, initiatorName, meta = {} } = job.data;
    const testId = meta?.testRunId || "PROD";
    console.log(`[Worker] ⚙️ Processing lead: ${leadId} (Job: ${job.id}) | Run: ${testId}`);

    try {
        // 1. Retrieve Data
        const lead = await Lead.findById(leadId);
        if (!lead) throw new Error(`Lead ${leadId} not found`);

        const business = await Business.findById(lead.business).populate('owner');
        if (!business) throw new Error(`Business ${lead.business} not found`);

        // Update status to processing
        lead.processingStatus = "processing";
        await lead.save();

        // 2. Check AI Credits
        if (business.aiCredits <= 0) {
            lead.aiNotes = "AI Limit Reached. Upgrade for scoring.";
            lead.processingStatus = "completed";
            await lead.save();
            return { status: "limit_reached" };
        }

        // 3. AI Scoring Pipeline
        let aiResult = { aiScore: 0, aiResponse: {} };
        const bName = (business.name || "NEXIO").replace("'s Business", "");
        let serviceFailed = false;

        try {
            const result = await processLead(
                lead.toObject(),
                lead.conversationHistory || [],
                lead.memorySummary || "",
                bName,
                initiatorName || "the Sales Team"
            );

            aiResult = result;
            aiResult.aiResponse = normalizeAiResponse(aiResult.aiResponse);
            
            // Deduct Credits
            business.aiCredits -= 1;
            await business.save();

            // Safety Validation
            const emailContent = getEmailDraft(aiResult.aiResponse);
            const safetyResult = validateAiOutput(emailContent);

            if (!safetyResult.safe) {
                console.error(`[Safety Intercept] AI content rejected for lead ${leadId}: ${safetyResult.reason}`);
                lead.requiresReview = true;
                lead.aiNotes = (lead.aiNotes || "") + `\n[Safety Block] AI-generated reply replaced with fallback: ${safetyResult.reason}`;
                
                aiResult.aiResponse = normalizeAiResponse({
                    ...aiResult.aiResponse,
                    emailSubject: `Re: Your Inquiry - ${bName}`,
                    emailBody: getFallbackEmail(bName, lead.name),
                });
            }
        } catch (aiErr) {
            console.error(`[AI Error] Processing failed for lead ${leadId}:`, aiErr.message);
            serviceFailed = true;
            lead.requiresReview = true;
            lead.aiNotes = (lead.aiNotes || "") + `\n[System Fallback] AI service unavailable, using fallback response.`;
            
            aiResult.aiResponse = normalizeAiResponse({
                emailSubject: `Re: Your Inquiry - ${bName}`,
                emailBody: getFallbackEmail(bName, lead.name),
            });
        }

        // 4. Update Lead with AI Results
        lead.aiScore = aiResult.aiScore || 0;
        lead.aiPriority = aiResult.aiPriority || "low";
        lead.aiNotes = aiResult.aiNotes || lead.aiNotes;
        lead.aiResponse = aiResult.aiResponse;
        
        if (aiResult.newSummary) lead.memorySummary = aiResult.newSummary;

        // Push to History
        if (aiResult.aiScore > 0 || (aiResult.aiResponse && Object.keys(aiResult.aiResponse).length > 0)) {
            lead.conversationHistory.push({
                role: "model",
                content: JSON.stringify(aiResult.aiResponse),
                timestamp: new Date()
            });
        }

        // 5. Automation Decision (Auto-Reply)
        const minScore = business.settings.minScoreToAutoReply || 50;
        const shouldSend = (aiResult.aiScore >= minScore) || serviceFailed;

        if (business.settings.autoReply && hasEmailDraft(aiResult.aiResponse) && shouldSend) {
            const inHours = isWithinWorkingHours(business);
            const canSend = inHours && (await checkAndIncrementEmailLimit(business));

            if (canSend) {
                const subject = aiResult.aiResponse.emailSubject || "Re: Your Inquiry - " + business.name;
                
                // ENQUEUE THE SECONDARY JOB (Email)
                await enqueueEmail({
                    to: lead.email,
                    subject,
                    body: getEmailDraft(aiResult.aiResponse),
                    ownerId: business.owner._id,
                    leadId: lead._id,
                    businessId: business._id
                });

                lead.aiNotes = (lead.aiNotes || "") + "\n[System] Auto-reply queued for delivery.";
            } else if (!inHours) {
                lead.aiNotes = (lead.aiNotes || "") + "\n[System] Auto-reply skipped: Outside working hours.";
            } else {
                lead.aiNotes = (lead.aiNotes || "") + "\n[System] Auto-reply skipped: Daily email limit reached.";
            }
        }

        // 6. Finalize
        lead.processingStatus = "completed";
        await lead.save();

        // Notify if limit hit warning
        if (aiResult.aiScore === 0) {
            await notifyAiLimit(business._id, aiResult.aiNotes, lead.name || "a lead");
        }

        // Real-time Update (Note: Works best if Socket.io has Redis adapter)
        emitToBusiness(business._id, "new_lead", lead);
        emitToBusiness(business._id, "update_analytics", {});

        console.log(`[Worker] ✅ Lead processed successfully: ${leadId}`);
        return { success: true, leadId };

    } catch (err) {
        console.error(`[Worker] ❌ Failed to process lead ${leadId}:`, err);
        
        // Update DB with error info for observability
        const lead = await Lead.findById(leadId);
        if (lead) {
            lead.processingStatus = "failed";
            lead.lastProcessingError = err.message;
            await lead.save();
        }

        throw err; // Rethrow to trigger BullMQ retry
    }
};
