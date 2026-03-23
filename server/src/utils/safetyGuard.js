/**
 * SafetyGuard.js
 * Production-grade AI Output Validation (Act Phase - V5)
 */

/**
 * Validates AI-generated email content for hallucinations, placeholders, structure, and liability.
 * @param {string} text - The raw email body to validate.
 * @returns {Object} { safe: boolean, reason: string | null }
 */
export const validateAiOutput = (text) => {
    // 1. Missing Content Check
    if (!text || typeof text !== 'string' || text.trim() === '') {
        return { safe: false, reason: "Content is missing or empty" };
    }

    const trimmedText = text.trim();
    const maxLength = 2500;

    // 2. Length Check
    if (text.length > maxLength) {
        return { safe: false, reason: "Content length exceeds 2500 characters" };
    }

    // 3. RAW JSON Leakage Detection
    const jsonPattern = /^\s*{\s*"[a-zA-Z0-9_-]+"\s*:/;
    if (jsonPattern.test(trimmedText)) {
        return { safe: false, reason: "Raw JSON leakage detected" };
    }

    /**
     * 4. LEGAL LIABILITY & BRAND PROTECTION (V5 Patch)
     * Targets dangerous financial/legal promises or aggressive spammy tone.
     */
    const legalRiskPattern = /\b(guarantee|guaranteed|100% ROI|legally binding|no risk|risk-free|money back|ensure success|promised|will definitely)\b/i;
    if (legalRiskPattern.test(trimmedText)) {
        return { safe: false, reason: "Forbidden legal or financial claim detected (Guarantee/Risk-free)" };
    }

    const aggressionPattern = /!{3,}|(ACT NOW|LIMITED TIME|YOU WON'T BELIEVE|BUY NOW|URGENT OFFER|CLICK HERE|DO NOT MISS)/;
    if (aggressionPattern.test(trimmedText)) {
        return { safe: false, reason: "Unprofessional or aggressive/spammy tone detected" };
    }

    /**
     * PRECISION PLACEHOLDER DETECTION
     */
    const keywords = "First\\s*Name|Last\\s*Name|Name|Company|Business|Client|User|Goal|Date|Link|Email|Phone|City|Industry|Recipient|Contact|Meeting|Website|Product|Insert";
    const placeholderPatterns = [
        new RegExp(`\\[(?:${keywords})[^\\]\\n]{0,25}\\]`, "gi"),
        new RegExp(`\\{(?:${keywords})[^}\\n]{0,25}\\}`, "gi"),
        new RegExp(`<(?:${keywords})[^>\\n]{0,25}>`, "gi"),
        /\b[A-Z]{3,}(?:_[A-Z]{3,})+\b/g
    ];

    for (const pattern of placeholderPatterns) {
        const match = text.match(pattern);
        if (match) {
            return { safe: false, reason: `Unfilled placeholder detected: ${match[0]}` };
        }
    }

    /**
     * SUSPICIOUS INSTRUCTION & ARTIFACT DETECTION
     */
    const leakagePatterns = [
        /\b(?:insert|replace)\b\s+(?:name|link|email|phone|company|business|client|user|date|info|details)\b/gi, 
        /\btodo\b[:\s]+[a-z_]+/gi,
        /\b(?:use|this|a|the)\b\s+placeholder\b/gi,
        /\[\s*\]/g,
        /```[\s\S]*?```/g,
        /^#{1,6}\s/m,
        /\*\*[^*]+\*\*/g
    ];

    for (const pattern of leakagePatterns) {
        const match = text.match(pattern);
        if (match) {
            return { safe: false, reason: `AI artifact or instruction detected: "${match[0]}"` };
        }
    }

    /**
     * STRUCTURAL INTEGRITY (Lightweight V4)
     */
    const hasGreeting = /^(hi|hello|dear|hey|good morning|good afternoon|good evening|to the)/i.test(trimmedText);
    const hasClosing = /(best|regards|sincerely|thanks|thank you|talk soon|cheers|looking forward|all the best|warmly)\s*[,.]?\s*[a-z ]{0,30}$/i.test(trimmedText);

    if (!hasGreeting && !hasClosing) {
        return { safe: false, reason: "Missing basic email structure (No greeting and no closing detected)" };
    }

    return { safe: true, reason: null };
};

/**
 * Fallback Email Template
 */
export const getFallbackEmail = (businessName, leadName) => {
    const greeting = leadName ? `Hi ${leadName},` : `Hi there,`;
    return `${greeting}\n\n` +
           `Thanks for reaching out. I’ve received your message and will get back to you shortly.\n\n` +
           `Best,\n` +
           `${businessName}`;
};
