import { apiFetch } from '../api'

/**
 * Perform authenticated global contextual search
 * @param {string} query - The search query
 * @param {string} context - Current page context (e.g. 'dashboard', 'academics', 'careers', 'skills', 'courses', 'jobs', 'productivity', 'ai-tutor')
 * @param {AbortSignal} [signal] - Optional AbortController signal
 * @returns {Promise<{success: boolean, query: string, context: string, totalResults: number, results: Array}>}
 */
export const performGlobalSearch = async (query, context = 'dashboard', signal = null) => {
  if (!query || typeof query !== 'string' || query.trim().length < 2) {
    return {
      success: true,
      query: query || '',
      context,
      totalResults: 0,
      results: []
    }
  }

  const cleanQuery = query.trim()
  const cleanContext = context ? context.toLowerCase().replace(/^\//, '').split('/')[0] : 'dashboard'
  const params = new URLSearchParams({
    q: cleanQuery,
    context: cleanContext,
    limit: '20'
  })

  return await apiFetch(`/search?${params.toString()}`, {
    method: 'GET',
    signal
  })
}

export default {
  performGlobalSearch
}
