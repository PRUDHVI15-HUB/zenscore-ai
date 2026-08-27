import { executeAIRequest } from '../ai/baseAIService'
import { getStoredSessions } from '../../utils/focusSessionStorage'
import { getFocusHealthData } from './focusHealthService'
import { getAnalyticsData } from './productivityAnalyticsService'

const CACHE_KEY = 'ai_productivity_coach_v1'

/**
 * Invalidate AI Coach cache
 */
export const invalidateCoachCache = () => {
  try {
    const keys = Object.keys(localStorage)
    keys.forEach((k) => {
      if (k.includes('ai_productivity_coach_v1') || k.includes('zenscore_ai_cache_productivity_coach')) {
        localStorage.removeItem(k)
      }
    })
  } catch (e) {
    console.warn('Failed to invalidate coach cache:', e)
  }
}

/**
 * Get AI Productivity Coach payload & execute AI request
 */
export const getAIProductivityCoachData = async (forceRefresh = false) => {
  const sessions = getStoredSessions()
  if (!sessions || sessions.length < 3) {
    return { hasData: false }
  }

  const health = getFocusHealthData()
  const insights = getAnalyticsData()

  // Read Career & Context from localStorage
  const career = localStorage.getItem('user_career_target') || 'Backend Engineer'
  const roadmap = localStorage.getItem('user_roadmap_phase') || 'Phase 2 - Microservices'
  const resume = localStorage.getItem('user_resume_status') || 'Built'
  const interview = localStorage.getItem('user_interview_readiness') || 'Intermediate'

  const requestPayload = {
    focusSessions: sessions,
    health,
    insights,
    career,
    roadmap,
    resume,
    interview
  }

  const fallbackData = generateFallbackCoachData(requestPayload)

  try {
    const result = await executeAIRequest({
      featureKey: 'productivity_coach',
      cacheSubKey: 'v1',
      promptVersion: 'v1.0',
      prompt: 'Generate AI Productivity Coaching advice',
      requestPayload,
      endpoint: '/productivity/coach',
      requiredFields: [
        'overallAssessment',
        'strengths',
        'weaknesses',
        'dailyAdvice',
        'weeklyGoal',
        'burnoutAdvice',
        'careerSuggestion',
        'motivation',
        'nextMission'
      ],
      fallbackData,
      forceRefresh
    })

    return {
      hasData: true,
      data: result.data || fallbackData,
      isCached: result.isCached,
      isFallback: result.isFallback
    }
  } catch (err) {
    console.warn('AI Coach Request Exception, using fallback:', err)
    return {
      hasData: true,
      data: fallbackData,
      isCached: false,
      isFallback: true
    }
  }
}

/**
 * Deterministic fallback coach generator using actual student data
 */
export function generateFallbackCoachData(payload = {}) {
  const { focusSessions = [], health = {}, insights = {}, career = 'Backend Engineer', roadmap = 'Phase 2' } = payload
  const summary = insights.summaryMetrics || {}
  const totalSessions = focusSessions.length
  const healthScore = health.healthScore || 75
  const burnoutRisk = health.burnoutRisk || 'Low'
  const mostStudied = summary.mostStudiedModule || 'DSA'

  return {
    overallAssessment: `You've maintained consistent focus this week with ${totalSessions} completed sessions totaling ${summary.totalFocusTime || '0 hrs'}. Your Focus Health score stands at ${healthScore}/100 with a ${health.healthTier || 'Good'} rating.`,
    strengths: [
      `Maintained a ${health.currentStreak || 0}-day study streak`,
      `Completed ${totalSessions} focus sessions with ${summary.totalFocusTime || '0 hrs'} total focus time`,
      `Dedicated primary effort to ${mostStudied}`,
      `Recorded a longest session of ${summary.longestSession || '0 mins'}`
    ],
    weaknesses: [
      `Need more study distribution across non-${mostStudied} categories`,
      `Ensure a 10-15 minute micro-break after sessions exceeding 60 minutes`
    ],
    dailyAdvice: `Spend 45 minutes on ${roadmap} and follow up with a 10-minute rest block.`,
    weeklyGoal: `Complete ${Math.max(5, totalSessions + 3)} sessions and reach ${Math.round((Number(summary.totalSessions) || 1) * 1.5)} study hours.`,
    focusRecommendation: `Recommend 45-minute deep work blocks with 10-minute recovery breaks.`,
    burnoutAdvice:
      burnoutRisk === 'Low'
        ? "You're maintaining a healthy study balance."
        : burnoutRisk === 'Medium'
        ? "Recommend taking 15-minute breaks after 60-minute sessions."
        : burnoutRisk === 'High'
        ? "High fatigue detected! Reduce session duration to 30 minutes."
        : "Critical burnout risk! Recommend taking a full recovery day.",
    roadmapSuggestion: `Dedicate your next 2 sessions to advancing ${roadmap}.`,
    careerSuggestion: `For ${career}, focus heavily on core technical topics and hands-on project implementation.`,
    motivation: `Consistency builds mastery. Every completed focus session brings you one step closer to your career goals!`,
    nextMission: `Complete a 45-minute focus session on ${mostStudied}.`
  }
}
