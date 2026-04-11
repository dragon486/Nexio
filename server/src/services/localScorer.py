import sys
import json
import re
from textblob import TextBlob

FREE_DOMAINS = {
    "gmail.com", "yahoo.com", "hotmail.com",
    "outlook.com", "icloud.com", "aol.com"
}

HIGH_INTENT_PATTERNS = {
    r"\bdemo\b": 18,
    r"\bschedule\b": 12,
    r"\bpricing\b": 18,
    r"\bprice\b": 14,
    r"\bquote\b": 18,
    r"\bproposal\b": 16,
    r"\benterprise\b": 20,
    r"\burgent\b": 14,
    r"\bimmediately\b": 14,
    r"\basap\b": 14,
    r"\bbuy\b": 18,
    r"\bpurchase\b": 18,
    r"\bbudget\b": 14,
    r"\btrial\b": 10,
    r"\bmeeting\b": 10,
    r"\bcall\b": 8,
    r"\bbook\b": 10,
}

MEDIUM_INTENT_PATTERNS = {
    r"\bquestion\b": 4,
    r"\blooking\b": 6,
    r"\binterested\b": 8,
    r"\bhow\b": 3,
    r"\bdetails\b": 5,
    r"\binfo\b": 4,
    r"\bhelp\b": 4,
    r"\bintegration\b": 8,
    r"\bteam\b": 5,
    r"\bcompany\b": 5,
    r"\bbusiness\b": 5,
    r"\bsolution\b": 5,
    r"\bservice\b": 4,
}

SOFT_NEGATIVE_PATTERNS = {
    r"\bseo\b": 8,
    r"\bmarketing services\b": 10,
    r"\bguest post\b": 14,
    r"\bcrypto\b": 6,
    r"\bcheap\b": 8,
}

HARD_SPAM_PATTERNS = {
    r"\bviagra\b": 25,
    r"\bunsubscribe\b": 18,
    r"\bfree money\b": 25,
    r"\bguaranteed profit\b": 25,
    r"\bclick here\b": 18,
    r"http[s]?://": 10,
    r"www\.": 10,
}

URGENCY_PATTERNS = [
    r"\burgent\b",
    r"\basap\b",
    r"\bimmediately\b",
    r"\bright now\b",
    r"\btoday\b",
    r"\bthis week\b",
]

BUDGET_PATTERNS = [
    r"\bbudget\b",
    r"\bquote\b",
    r"\bpricing\b",
    r"\bprice\b",
    r"\bcost\b",
    r"\bplan\b",
    r"\$\d+",
    r"₹\d+",
    r"€\d+",
    r"£\d+",
]

BUSINESS_CONTEXT_PATTERNS = [
    r"\bour team\b",
    r"\bmy team\b",
    r"\bcompany\b",
    r"\bstartup\b",
    r"\borganization\b",
    r"\benterprise\b",
    r"\bclient\b",
    r"\bfor our business\b",
]

LOW_QUALITY_PATTERNS = [
    r"^\s*hi\s*$",
    r"^\s*hello\s*$",
    r"^\s*interested\s*$",
    r"^\s*call me\s*$",
    r"^\s*need details\s*$",
]

EMAIL_PATTERN = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"
PHONE_PATTERN = r"\b(?:\+?\d[\d\s\-()]{7,}\d)\b"


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", (text or "").strip().lower())


def count_weighted_matches(text: str, pattern_map: dict) -> tuple[int, list[str]]:
    score = 0
    hits = []
    for pattern, weight in pattern_map.items():
        if re.search(pattern, text, re.IGNORECASE):
            score += weight
            hits.append(pattern)
    return score, hits


def count_matches(text: str, patterns: list[str]) -> int:
    return sum(1 for pattern in patterns if re.search(pattern, text, re.IGNORECASE))


def safe_name(name: str) -> str:
    cleaned = (name or "").strip()
    if not cleaned:
        return "there"
    return re.sub(r"[^\w\s.'-]", "", cleaned)[:50] or "there"


def build_email(priority: str, name: str, source: str = "website") -> tuple[str, str]:
    if source == "widget":
        if priority in ["high", "medium"]:
            return "Chat Reply", "I'm experiencing a bit of a system delay at this exact moment, but your request is important! Could you please drop your email or phone number here so our team can get right back to you with a direct answer?"
        else:
            return "Chat Reply", "I'm experiencing a bit of a system delay right now! I've saved your message for my team to review, but feel free to explore the site in the meantime."
            
    greeting = f"Hi {name},\n\n"

    if priority == "high":
        subject = "Next Steps Regarding Your Inquiry"
        body = (
            greeting +
            "Thanks for reaching out. We received your inquiry and would be happy to help. "
            "If you'd like, reply with a convenient time and we can continue the conversation promptly.\n\n"
            "Best regards,"
        )
    elif priority == "medium":
        subject = "Information Regarding Your Request"
        body = (
            greeting +
            "Thanks for reaching out. We received your message and wanted to follow up. "
            "If you have any specific questions, feel free to reply here and we’ll be glad to help.\n\n"
            "Best,"
        )
    else:
        subject = "Re: Your Inquiry"
        body = (
            greeting +
            "Thanks for reaching out. We received your message and our team is reviewing it now. "
            "We try to respond to all inquiries within 24 hours.\n\n"
            "Thanks,"
        )

    return subject, body


def analyze_lead(data):
    raw_message = data.get("message", "") or ""
    raw_name = data.get("name", "")
    email = (data.get("email", "") or "").strip()
    phone = (data.get("phone", "") or "").strip()
    source = data.get("source", "website")

    name = safe_name(raw_name)
    message = normalize_text(raw_message)
    msg_len = len(message)

    # Empty / missing message fast path
    if not message:
        subject, body = build_email("low", name, source)
        return {
            "aiScore": 10,
            "aiPriority": "low",
            "aiNotes": "[Resilience Mode] Empty message received. Lead captured safely but requires manual review.",
            "aiResponse": {
                "emailSubject": subject,
                "email": body,
                "status": "Resilience Mode Active"
            }
        }

    # Sentiment is a small helper, not the main decider
    blob = TextBlob(raw_message)
    sentiment = blob.sentiment.polarity

    # Intent and risk signals
    high_score, high_hits = count_weighted_matches(message, HIGH_INTENT_PATTERNS)
    med_score, med_hits = count_weighted_matches(message, MEDIUM_INTENT_PATTERNS)
    soft_neg_score, soft_neg_hits = count_weighted_matches(message, SOFT_NEGATIVE_PATTERNS)
    hard_neg_score, hard_neg_hits = count_weighted_matches(message, HARD_SPAM_PATTERNS)

    urgency_count = count_matches(message, URGENCY_PATTERNS)
    budget_count = count_matches(message, BUDGET_PATTERNS)
    business_context_count = count_matches(message, BUSINESS_CONTEXT_PATTERNS)

    # Base score
    base_score = 30 + (sentiment * 10)

    # Profile intelligence
    profile_boost = 0
    profile_notes = []

    if email and "@" in email:
        domain = email.split("@", 1)[1].lower()
        if domain not in FREE_DOMAINS:
            profile_boost += 15
            profile_notes.append("corporate email detected")
        else:
            profile_notes.append("free email domain")

    if phone:
        profile_boost += 5
        profile_notes.append("phone number provided")

    # Message quality
    quality_boost = 0
    quality_penalty = 0
    quality_notes = []

    if msg_len > 100:
        quality_boost += 5
        quality_notes.append("detailed message")
    elif msg_len < 40 and not high_hits: # Only penalize brevity if no high-intent hits found
        quality_penalty += 15
        quality_notes.append("brief inquiry")

    if "?" in raw_message:
        quality_boost += 3
        quality_notes.append("explicit question detected")

    if any(re.match(pattern, message, re.IGNORECASE) for pattern in LOW_QUALITY_PATTERNS):
        quality_penalty += 12
        quality_notes.append("low-information message")

    # Context boosts
    context_boost = min(urgency_count * 8, 16) + min(budget_count * 8, 16) + min(business_context_count * 6, 12)

    # Risk penalties
    penalty = soft_neg_score + hard_neg_score

    exclamations = raw_message.count("!")
    if exclamations >= 4:
        penalty += 6
        quality_notes.append("excessive punctuation")

    # Final score
    final_score = int(base_score + high_score + med_score + profile_boost + quality_boost + context_boost - quality_penalty - penalty)
    final_score = max(0, min(final_score, 99))

    # Priority
    if final_score >= 70:
        priority = "high"
    elif final_score >= 40:
        priority = "medium"
    else:
        priority = "low"

    # Notes
    sentiment_str = "positive" if sentiment > 0.1 else "negative" if sentiment < -0.1 else "neutral"
    note_parts = [f"[Resilience Mode] Scored by NEXIO Local. Sentiment is {sentiment_str}."]

    if hard_neg_hits:
        note_parts.append("Strong spam/solicitation signals detected.")
    elif soft_neg_hits:
        note_parts.append("Some low-quality or solicitation indicators detected.")

    if high_hits:
        note_parts.append("Detected high-intent buying signals.")
    elif med_hits:
        note_parts.append("Detected moderate exploration interest.")
    else:
        note_parts.append("Lead appears to be a general inquiry.")

    if urgency_count:
        note_parts.append("Urgency indicators detected.")
    if budget_count:
        note_parts.append("Budget/pricing intent detected.")
    if business_context_count:
        note_parts.append("Business/team context detected.")
    if profile_notes:
        note_parts.append("Profile signals: " + ", ".join(profile_notes) + ".")
    if quality_notes:
        note_parts.append("Quality notes: " + ", ".join(quality_notes) + ".")

    if priority == "high":
        note_parts.append("Lead appears commercially valuable and should be prioritized.")
    elif priority == "medium":
        note_parts.append("Lead shows moderate buying intent and is worth follow-up.")
    else:
        note_parts.append("Lead appears low-intent, vague, or exploratory.")

    notes = " ".join(note_parts)

    # Safe fallback draft
    subject, body = build_email(priority, name, source)

    return {
        "aiScore": final_score,
        "aiPriority": priority,
        "aiNotes": notes,
        "aiResponse": {
            "emailSubject": subject,
            "email": body,
            "status": "Resilience Mode Active"
        }
    }


if __name__ == "__main__":
    try:
        input_data = sys.stdin.read()
        if not input_data:
            print(json.dumps({"error": "No input data"}))
            sys.exit(1)

        data = json.loads(input_data)
        result = analyze_lead(data)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
