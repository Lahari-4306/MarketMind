const DOMAIN_GUARD_RESPONSE = "I am MarketMind, a specialized Sales and Marketing Intelligence Assistant. I can only answer questions related to sales, marketing, lead generation, campaign strategy, market analysis, and business growth.";

const ALLOWED_DOMAINS = [
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
];

const BLOCKED_DOMAINS = [
  "politics", "religion", "sports", "medical", "health", "legal", "law",
  "general knowledge", "history", "geography", "physics", "chemistry",
  "entertainment", "movies", "music", "games", "cooking", "travel", "weather"
];

const MARKETING_SALES_KEYWORDS = [
  "product", "customer", "market", "industry", "business", "sell", "buy", 
  "campaign", "pitch", "lead", "score", "analysis", "strategy", "growth",
  "revenue", "sales", "audience", "target", "brand", "competitor", "value"
];

export function isDomainAllowed(query) {
  if (!query || typeof query !== 'string') return true;

  const queryLower = query.toLowerCase();

  for (const blocked of BLOCKED_DOMAINS) {
    if (queryLower.includes(blocked)) {
      return false;
    }
  }

  for (const allowed of ALLOWED_DOMAINS) {
    if (queryLower.includes(allowed)) {
      return true;
    }
  }

  for (const keyword of MARKETING_SALES_KEYWORDS) {
    if (queryLower.includes(keyword)) {
      return true;
    }
  }

  return true;
}

export function validateInput(input, inputType = 'general') {
  if (!input || typeof input !== 'string') {
    return { valid: true, message: '' };
  }

  // For structured form inputs (campaigns, pitches, lead scoring),
  // always allow — they are marketing-context inputs by nature.
  if (
    inputType === 'campaign' ||
    inputType === 'sales_pitch' ||
    inputType === 'lead_scoring' ||
    inputType === 'market_analysis' ||
    inputType === 'business_insights'
  ) {
    return { valid: true, message: '' };
  }

  if (!isDomainAllowed(input)) {
    return {
      valid: false,
      message: DOMAIN_GUARD_RESPONSE
    };
  }

  return { valid: true, message: '' };
}

export { DOMAIN_GUARD_RESPONSE };
