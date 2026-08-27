/**
 * careerMarketCache.js
 * Persistent localStorage Cache Engine for Live Industry Intelligence.
 */

const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 Hours
export const MARKET_CACHE_VERSION = 'v1.1'

export function getCachedMarketData(careerTitle) {
  const cacheKey = `zenscore_ai_cache_market_${careerTitle.replace(/\s+/g, '_')}_${MARKET_CACHE_VERSION}`
  try {
    const raw = localStorage.getItem(cacheKey)
    if (raw) {
      const parsed = JSON.parse(raw)
      const now = Date.now()
      if (now - parsed.generatedAt < CACHE_TTL_MS && parsed.version === MARKET_CACHE_VERSION && parsed.data) {
        return parsed.data
      }
    }
  } catch (e) {
    console.warn('[CareerMarketCache] Cache read error:', e)
  }
  return null
}

export function setCachedMarketData(careerTitle, data) {
  const cacheKey = `zenscore_ai_cache_market_${careerTitle.replace(/\s+/g, '_')}_${MARKET_CACHE_VERSION}`
  try {
    const obj = {
      version: MARKET_CACHE_VERSION,
      generatedAt: Date.now(),
      data,
    }
    localStorage.setItem(cacheKey, JSON.stringify(obj))
  } catch (e) {
    console.warn('[CareerMarketCache] Cache write error:', e)
  }
}
