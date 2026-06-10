import os
import httpx
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
print("GROQ KEY LOADED:", os.getenv("GROQ_API_KEY"))
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama-3.3-70b-versatile"

DOMAIN_GUARD_RESPONSE = "I am MarketMind, a specialized Sales and Marketing Intelligence Assistant. I can only answer questions related to sales, marketing, lead generation, campaign strategy, market analysis, and business growth."

ALLOWED_DOMAINS = [
    "sales", "marketing", "lead generation", "campaign", "market analysis",
    "swot analysis", "business growth", "product launch", "customer acquisition",
    "brand strategy", "marketing strategy", "sales strategy", "advertising",
    "promotional", "target audience", "customer segmentation", "value proposition",
    "competitive analysis", "market research", "business development", "revenue growth",
    "conversion", "retention", "engagement", "pipeline", "prospect", "b2b", "b2c",
    "crm", "funnel", "outreach", "prospecting", "qualifying", "closing",
    "negotiation", "pitch", "presentation", "roi", "kpis", "metrics",
    "branding", "positioning", "messaging", "content marketing", "email marketing",
    "social media", "digital marketing", "inbound", "outbound", "channel",
    "pricing strategy", "go-to-market", "launch", "product-market fit",
    "customer success", "upselling", "cross-selling", "churn", "loyalty"
]

BLOCKED_DOMAINS = [

    "politics", "religion", "sports", "legal", "law",
    "general knowledge", "history", "geography", "science", "physics", "chemistry",
    "entertainment", "movies", "music", "games", "cooking", "travel", "weather"
]

def is_domain_allowed(query: str) -> bool:
    query_lower = query.lower()

    for blocked in BLOCKED_DOMAINS:
        if blocked in query_lower:
            return False

    for allowed in ALLOWED_DOMAINS:
        if allowed in query_lower:
            return True

    marketing_sales_keywords = [
        "product", "customer", "market", "industry", "business", "sell", "buy",
        "campaign", "pitch", "lead", "score", "analysis", "strategy", "growth",
        "revenue", "sales", "audience", "target", "brand", "competitor", "value"
    ]

    for keyword in marketing_sales_keywords:
        if keyword in query_lower:
            return True

    return True

def generate_campaign(product_name: str, industry: str, target_audience: str, campaign_goal: str) -> str:
    prompt = f"""Create a comprehensive marketing campaign for the following:

Product Name: {product_name}
Industry: {industry}
Target Audience: {target_audience}
Campaign Goal: {campaign_goal}


STRICT OUTPUT RULES (MUST FOLLOW):
- side headings in bold and uppercase
- use bullet points for lists
- provide actionable and specific recommendations
- Output ONLY plain text
- Do NOT use markdown (#, *, **, -, bullet points)
- Do NOT use symbols for formatting
- Do NOT number lines
- Use ONLY clean section headers in ALL CAPS
- Keep spacing between sections

OUTPUT FORMAT (FOLLOW EXACTLY):
CAMPAIGN OVERVIEW
KEY MESSAGES AND VALUE PROPOSITIONS
MARKETING CHANNELS STRATEGY
CONTENT IDEAS
BUDGET ALLOCATION SUGGESTIONS
TIMELINE AND MILESTONES
KPIS AND SUCCESS METRICS
RISK MITIGATION STRATEGIES """

    return call_groq_api(prompt)

def generate_sales_pitch(product: str, customer_type: str) -> str:
    prompt = f"""Create a compelling sales pitch for the following:

Product: {product}
Customer Type: {customer_type}

STRICT OUTPUT RULES (MUST FOLLOW):
- side headings in bold and uppercase
- use bullet points for lists
- provide actionable and specific recommendations
- Output ONLY plain text
- Do NOT use markdown (#, *, **, -, bullet points)
- Do NOT use symbols for formatting
- Do NOT number lines
- Use ONLY clean section headers in ALL CAPS
- Keep spacing between sections

OUTPUT FORMAT (FOLLOW EXACTLY):
1. Opening Hook
2. Problem Identification
3. Solution Presentation
4. Value Proposition
5. Social Proof Elements
6. Handling Objections
7. Call to Action
8. Follow-up Strategy"""

    return call_groq_api(prompt)

def generate_lead_score(company_size: str, industry: str, budget: str, engagement_level: str) -> tuple[float, str, str]:
    prompt = f"""Analyze and score this lead based on BANT criteria:

Company Size: {company_size}
Industry: {industry}
Budget: {budget}
Engagement Level: {engagement_level}

STRICT OUTPUT RULES (MUST FOLLOW):
- side headings in bold and uppercase
- use bullet points for lists
- provide actionable and specific recommendations
- Output ONLY plain text
- Do NOT use markdown (#, *, **, -, bullet points)
- Do NOT use symbols for formatting
- Do NOT number lines
- Use ONLY clean section headers in ALL CAPS
- Keep spacing between sections

OUTPUT FORMAT (FOLLOW EXACTLY):
1. Lead Score (0-100)
2. Priority Level (High/Medium/Low)
3. Detailed Analysis explaining the score
4. Recommended Next Steps

Format your response with clear sections."""

    analysis = call_groq_api(prompt)

    score = 50.0
    if budget.lower() in ["high", "large", "enterprise"]:
        score += 20
    elif budget.lower() in ["medium", "mid"]:
        score += 10

    if engagement_level.lower() in ["high", "very active"]:
        score += 15
    elif engagement_level.lower() in ["medium", "moderate"]:
        score += 5

    if company_size.lower() in ["large", "enterprise", "500+"]:
        score += 10
    elif company_size.lower() in ["medium", "50-500"]:
        score += 5

    score = min(100, max(0, score))

    if score >= 75:
        priority = "High"
    elif score >= 50:
        priority = "Medium"
    else:
        priority = "Low"

    return score, priority, analysis

def generate_market_analysis(industry: str) -> str:
    prompt = f"""Conduct a comprehensive market analysis for the following industry:

Industry: {industry}

STRICT OUTPUT RULES (MUST FOLLOW):
- side headings in bold and uppercase
- use bullet points for lists
- provide actionable and specific recommendations
- Output ONLY plain text
- Do NOT use markdown (#, *, **, -, bullet points)
- Do NOT use symbols for formatting
- Do NOT number lines
- Use ONLY clean section headers in ALL CAPS
- Keep spacing between sections

OUTPUT FORMAT (FOLLOW EXACTLY):
1. Industry Overview
2. Market Size and Growth Trends
3. Key Players and Competition
4. SWOT Analysis
5. Consumer Behavior Insights
6. Emerging Trends
7. Opportunities and Threats
8. Strategic Recommendations"""

    return call_groq_api(prompt)

def generate_business_insights(business_description: str) -> str:
    prompt = f"""Analyze this business and provide strategic insights:

Business Description: {business_description}

STRICT OUTPUT RULES (MUST FOLLOW):
- side headings in bold and uppercase
- use bullet points for lists
- provide actionable and specific recommendations
- Output ONLY plain text
- Do NOT use markdown (#, *, **, -, bullet points)
- Do NOT use symbols for formatting
- Do NOT number lines
- Use ONLY clean section headers in ALL CAPS
- Keep spacing between sections

OUTPUT FORMAT (FOLLOW EXACTLY):
1. Business Overview Summary
2. Strengths Analysis
3. Weaknesses Identification
4. Market Position Assessment
5. Growth Opportunities
6. Competitive Advantages
7. Risk Assessment
8. Strategic Recommendations
9. Action Items
10. Key Performance Indicators to Track"""

    return call_groq_api(prompt)

def call_groq_api(prompt: str) -> str:
    if not GROQ_API_KEY:
        return "Error: GROQ_API_KEY not configured. Please set the GROQ_API_KEY environment variable."

    if not is_domain_allowed(prompt):
        return DOMAIN_GUARD_RESPONSE

    system_prompt = """You are MarketMind, an expert Sales and Marketing Intelligence Assistant. You must answer only sales and marketing related questions. If a question is outside this domain, politely refuse and return the predefined response.

Provide detailed, actionable, and professional insights. Structure your responses clearly with headings and bullet points where appropriate."""

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 2048
    }

    try:
        with httpx.Client(timeout=60.0) as client:
            response = client.post(GROQ_API_URL, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
    except httpx.HTTPStatusError as e:
        return f"Error calling Groq API: {e.response.status_code} - {e.response.text}"
    except Exception as e:
        return f"Error: {str(e)}"
