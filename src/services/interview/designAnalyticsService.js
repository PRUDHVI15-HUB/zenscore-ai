/**
 * designAnalyticsService.js
 * Design Analytics Service for ZenScore AI (Product 6 - Sprint D).
 * Tracks system design sessions, score breakdowns, and architecture progress.
 */

export const DESIGN_ANALYTICS_KEY = 'zenscore_design_analytics_v1.1'

export function getDesignAnalytics() {
  try {
    const cached = localStorage.getItem(DESIGN_ANALYTICS_KEY)
    if (cached) return JSON.parse(cached)
  } catch (e) {
    console.warn('[DesignAnalytics] localStorage read error:', e)
  }

  const defaultData = {
    totalDesignSessions: 3,
    averageScore: 92,
    completedDesigns: [
      { id: 'des_1', title: 'Design YouTube Video Streaming Platform', type: 'HLD', score: 94, date: '2026-07-26', company: 'Google' },
      { id: 'des_2', title: 'Design Parking Lot System', type: 'LLD', score: 90, date: '2026-07-23', company: 'Amazon' },
    ],
  }

  saveDesignAnalytics(defaultData)
  return defaultData
}

export function saveDesignAnalytics(dataObj) {
  try {
    localStorage.setItem(DESIGN_ANALYTICS_KEY, JSON.stringify(dataObj))
  } catch (e) {
    console.warn('[DesignAnalytics] localStorage save error:', e)
  }
}
