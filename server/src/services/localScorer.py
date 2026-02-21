import sys
import json
import re
from textblob import TextBlob

def analyze_lead(data):
    message = data.get("message", "")
    name = data.get("name", "Unknown")
    
    # 1. Sentiment Analysis (TextBlob)
    blob = TextBlob(message)
    sentiment = blob.sentiment.polarity # -1 to 1
    
    # 2. Keyword & Intent Heuristics
    keywords_high = ["demo", "schedule", "pricing", "enterprise", "quote", "immediately", "urgent"]
    keywords_med = ["question", "looking", "interested", "how", "details"]
    
    high_impact_count = sum(1 for word in keywords_high if word in message.lower())
    med_impact_count = sum(1 for word in keywords_med if word in message.lower())
    
    # 3. Calculate Score
    # Base score on sentiment
    base_score = 40 + (sentiment * 30) # 10 to 70 range
    
    # Adjust for intent
    intent_boost = (high_impact_count * 15) + (med_impact_count * 5)
    
    final_score = min(max(int(base_score + intent_boost), 15), 98)
    
    # 4. Determine Priority
    priority = "low"
    if final_score >= 80:
        priority = "high"
    elif final_score >= 50:
        priority = "medium"
        
    # 5. Generate Notes
    sentiment_str = "positive" if sentiment > 0.1 else "neutral" if sentiment > -0.1 else "negative"
    notes = f"[Resilience Mode] Scored by Arlo's Local Brain. Sentiment is {sentiment_str}. "
    
    if high_impact_count > 0:
        notes += "Detected high-intent keywords suggesting a demo or pricing request."
    elif med_impact_count > 0:
        notes += "Detected moderate user interest."
    else:
        notes += "Lead appears to be a general inquiry."

    return {
        "aiScore": final_score,
        "aiPriority": priority,
        "aiNotes": notes,
        "aiResponse": {
            "analysis": notes,
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
