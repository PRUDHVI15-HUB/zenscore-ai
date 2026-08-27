/**
 * careerMarketService.js
 * Main Service for ZenScore AI Live Industry Intelligence.
 * Orchestrates Market Metadata + AI Enrichment + Persistent Caching + Fallbacks.
 */

import { executeAIRequest } from '../ai/baseAIService'
import { getCachedMarketData, setCachedMarketData, MARKET_CACHE_VERSION } from './careerMarketCache'
import { parseCareerMarketData } from './careerMarketParser'
import { generateCareerMarketFallback } from './careerMarketFallback'

/**
 * Retrieves full Live Industry Intelligence for a target career role.
 *
 * @param {string} careerTitle - e.g., 'Backend Engineer'
 * @param {boolean} forceRefresh - If true, bypasses cache
 * @returns {Promise<Object>} Formatted & validated market intelligence data object
 */
export async function getCareerMarketIntelligence(careerTitle = 'Backend Engineer', forceRefresh = false) {
  // 1. Check Persistent Cache (Task / Requirement 24h)
  if (!forceRefresh) {
    const cached = getCachedMarketData(careerTitle)
    if (cached) {
      return parseCareerMarketData(cached, careerTitle)
    }
  }

  const fallback = generateCareerMarketFallback(careerTitle)

  const prompt = `You are the Live Industry Intelligence Engine for ZenScore AI.
Generate comprehensive, real-world tech industry market data for the engineering career "${careerTitle}":

Return ONLY a valid JSON object matching this structure:
{
  "careerTitle": "${careerTitle}",
  "marketDemand": {
    "level": "★★★★★ Very High",
    "openPositions": "42,000+ Jobs",
    "hiringTrend": "📈 Rising (+24% YoY)"
  },
  "salaryProgression": {
    "fresher": "₹8 – ₹14 LPA",
    "exp1to3": "₹15 – ₹22 LPA",
    "exp3to5": "₹24 – ₹35 LPA",
    "senior": "₹35 – ₹55 LPA",
    "architect": "₹60L+ LPA"
  },
  "topRecruiters": [
    { "name": "Company Name", "status": "High Hiring", "focus": "DSA + LLD + System Design", "salary": "₹28 – ₹45 LPA" }
  ],
  "techStack": ["Technology 1", "Technology 2"],
  "certifications": [
    { "name": "Cert Name", "difficulty": "Medium", "value": "Very High", "duration": "1.5 Months" }
  ],
  "interviewProcess": [
    { "step": 1, "title": "Online Assessment", "desc": "Short description" }
  ],
  "futureOutlook": {
    "futureDemand": "▲ +27%",
    "automationRisk": "Low",
    "remotePct": "88%",
    "globalDemand": "Excellent",
    "stability": "★★★★★"
  },
  "industryNews": [
    "Short industry news update 1",
    "Short industry news update 2",
    "Short industry news update 3"
  ]
}`

  try {
    const result = await executeAIRequest({
      featureKey: 'market_intel',
      cacheSubKey: careerTitle.replace(/\s+/g, '_'),
      promptVersion: MARKET_CACHE_VERSION,
      prompt,
      requestPayload: { careerTitle },
      endpoint: '/careers/explorer/market-intel-ai',
      requiredFields: ['careerTitle', 'marketDemand', 'salaryProgression'],
      fallbackData: fallback,
      forceRefresh,
    })

    const parsed = parseCareerMarketData(result.data, careerTitle)
    setCachedMarketData(careerTitle, parsed)
    return parsed
  } catch (err) {
    console.warn('[CareerMarketService] Fallback engaged:', err)
    const fallbackParsed = parseCareerMarketData(fallback, careerTitle)
    setCachedMarketData(careerTitle, fallbackParsed)
    return fallbackParsed
  }
}
