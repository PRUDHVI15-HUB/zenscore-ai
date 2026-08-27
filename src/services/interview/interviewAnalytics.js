/**
 * interviewAnalytics.js
 * Interview Session Analytics Service for ZenScore AI (Product 6 - Sprint A).
 * Tracks mock interview history, response scores, technical accuracy, and communication clarity.
 */

export const INTERVIEW_ANALYTICS_KEY = 'zenscore_interview_analytics_v1.1'

/**
 * Gets interview analytics history from localStorage.
 */
export function getInterviewAnalytics() {
  try {
    const cached = localStorage.getItem(INTERVIEW_ANALYTICS_KEY)
    if (cached) return JSON.parse(cached)
  } catch (e) {
    console.warn('[InterviewAnalytics] localStorage read error:', e)
  }

  const defaultAnalytics = {
    totalSessionsCompleted: 0,
    averageScore: 0,
    technicalAccuracyPct: 0,
    communicationClarityPct: 0,
    sessionHistory: [],
  }

  saveInterviewAnalytics(defaultAnalytics)
  return defaultAnalytics
}

/**
 * Persists interview analytics to localStorage.
 */
export function saveInterviewAnalytics(analyticsObj) {
  try {
    localStorage.setItem(INTERVIEW_ANALYTICS_KEY, JSON.stringify(analyticsObj))
  } catch (e) {
    console.warn('[InterviewAnalytics] localStorage save error:', e)
  }
}
