/**
 * baseAIService.js
 * Centralized, secure, fault-tolerant base service for all ZenScore AI features.
 * Features:
 *  - Persistent localStorage Caching with 24-hour TTL
 *  - Prompt Versioning & Automatic Cache Invalidation
 *  - Response Validation & Defensive Sanitization
 *  - Environment-Aware Developer Telemetry & Minimal Production Logging
 *  - Reusable architecture for Overview, Career Explorer, Skill Gap, Roadmap
 */

const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 Hours
const DEV_LOGGING = import.meta.env.DEV

// Developer Telemetry Store
const TELEMETRY_STORAGE_KEY = 'zenscore_ai_telemetry'

function getTelemetry() {
  try {
    const raw = localStorage.getItem(TELEMETRY_STORAGE_KEY)
    return raw ? JSON.parse(raw) : { requestsCount: 0, cacheHits: 0, cacheMisses: 0, totalResponseTimeMs: 0, successCount: 0, failureCount: 0, lastGenerated: null }
  } catch {
    return { requestsCount: 0, cacheHits: 0, cacheMisses: 0, totalResponseTimeMs: 0, successCount: 0, failureCount: 0, lastGenerated: null }
  }
}

function updateTelemetry(type, responseTimeMs = 0, success = true) {
  try {
    const t = getTelemetry()
    if (type === 'hit') {
      t.cacheHits += 1
    } else if (type === 'miss') {
      t.requestsCount += 1
      t.cacheMisses += 1
      t.totalResponseTimeMs += responseTimeMs
      if (success) t.successCount += 1
      else t.failureCount += 1
      t.lastGenerated = new Date().toISOString()
    }
    localStorage.setItem(TELEMETRY_STORAGE_KEY, JSON.stringify(t))
  } catch (e) {
    if (DEV_LOGGING) console.warn('[AITelemetry] Save error:', e)
  }
}

export function getAIMetricsSummary() {
  const t = getTelemetry()
  const total = t.cacheHits + t.cacheMisses
  const hitRate = total > 0 ? ((t.cacheHits / total) * 100).toFixed(1) + '%' : '0%'
  const avgTime = t.requestsCount > 0 ? (t.totalResponseTimeMs / t.requestsCount).toFixed(0) + 'ms' : '0ms'
  const successRate = (t.successCount + t.failureCount) > 0 ? ((t.successCount / (t.successCount + t.failureCount)) * 100).toFixed(1) + '%' : '100%'

  return {
    requestsCount: t.requestsCount,
    cacheHits: t.cacheHits,
    cacheMisses: t.cacheMisses,
    hitRate,
    avgResponseTimeMs: avgTime,
    successRate,
    lastGenerated: t.lastGenerated,
  }
}

/**
 * Execute an AI Request with Persistent Caching, Validation, and Error Fallback.
 */
export async function executeAIRequest({
  featureKey,
  cacheSubKey,
  promptVersion = 'v1.0',
  prompt,
  requestPayload = {},
  endpoint,
  requiredFields = [],
  fallbackData = {},
  forceRefresh = false,
}) {
  const fullCacheKey = `zenscore_ai_cache_${featureKey}_${cacheSubKey}`
  const now = Date.now()

  // 1. Persistent Cache Check (Task 2 & 7)
  if (!forceRefresh) {
    try {
      const cachedRaw = localStorage.getItem(fullCacheKey)
      if (cachedRaw) {
        const parsed = JSON.parse(cachedRaw)
        const isFresh = now - parsed.generatedAt < CACHE_TTL_MS
        const isMatchingVersion = parsed.promptVersion === promptVersion

        if (isFresh && isMatchingVersion && parsed.data) {
          if (DEV_LOGGING) console.log(`[AIService:${featureKey}] Persistent cache hit (TTL valid, version ${promptVersion})`)
          updateTelemetry('hit')
          return { data: parsed.data, isCached: true, isFallback: false }
        }
      }
    } catch (err) {
      if (DEV_LOGGING) console.warn(`[AIService:${featureKey}] Cache read error:`, err)
    }
  }

  // 2. Cache Miss — Call Backend API (Task 1 & 8)
  updateTelemetry('miss')
  const startTime = Date.now()

  try {
    const devFallback = 'http://localhost:5000/api'
    const rawBase = (import.meta.env.DEV && import.meta.env.VITE_API_URL?.includes('onrender.com'))
      ? devFallback
      : (import.meta.env.VITE_API_URL || devFallback)
    const cleanBase = rawBase.replace(/\/+$/, '')
    const BASE_URL = cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`
    const token = localStorage.getItem('zenscore_jwt')

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ prompt, payload: requestPayload, promptVersion }),
    })

    const responseTimeMs = Date.now() - startTime

    if (res.ok) {
      const result = await res.json()
      const aiData = result?.data || result

      // 3. Response Validation (Supports string, number, object & array required fields)
      const isValid = requiredFields.every(field => {
        if (!aiData || aiData[field] === undefined || aiData[field] === null) return false
        if (typeof aiData[field] === 'string') return aiData[field].trim().length > 0
        return true
      })

      if (isValid) {
        // Save to Persistent Cache (Task 2)
        const cacheObj = {
          promptVersion,
          generatedAt: now,
          expiresAt: now + CACHE_TTL_MS,
          data: aiData,
        }
        localStorage.setItem(fullCacheKey, JSON.stringify(cacheObj))

        updateTelemetry('miss', responseTimeMs, true)
        if (DEV_LOGGING) console.log(`[AIService:${featureKey}] Fresh AI response received & cached (${responseTimeMs}ms)`)
        return { data: aiData, isCached: false, isFallback: false }
      }
    }
  } catch (error) {
    const responseTimeMs = Date.now() - startTime
    updateTelemetry('miss', responseTimeMs, false)
    if (DEV_LOGGING) console.warn(`[AIService:${featureKey}] Backend AI request fallback engaged:`, error?.message || error)
  }

  // 4. Defensive Fallback Sanitization (Task 4 & 5)
  const sanitizedFallback = { ...fallbackData }
  requiredFields.forEach(field => {
    if (sanitizedFallback[field] === undefined || sanitizedFallback[field] === null) {
      sanitizedFallback[field] = fallbackData[field] !== undefined ? fallbackData[field] : `Information temporarily unavailable.`
    }
  })

  // Try to preserve previous valid cache if backend failed
  try {
    const cachedRaw = localStorage.getItem(fullCacheKey)
    if (cachedRaw) {
      const parsed = JSON.parse(cachedRaw)
      if (parsed?.data) {
        if (DEV_LOGGING) console.log(`[AIService:${featureKey}] Backend failed, reusing existing persistent cache`)
        return { data: parsed.data, isCached: true, isFallback: true }
      }
    }
  } catch {}

  return { data: sanitizedFallback, isCached: false, isFallback: true }
}
