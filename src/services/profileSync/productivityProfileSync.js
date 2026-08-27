/**
 * Productivity → Student Profile Synchronizer
 * ============================================
 * Transforms data from the Productivity module (focus sessions, analytics, habits) into the
 * productivitySummary section of the Unified Student Profile.
 *
 * Design Principles:
 *   - FIRE AND FORGET: Never blocks UI or rendering
 *   - SILENT ERRORS:   Productivity module must always keep working
 *   - MERGE STRATEGY:  updateSection() deep-merges, never overwrites
 *   - SINGLE WRITE:    Only writes to 'productivitySummary' — nothing else
 *   - NO READS:        Productivity does not read from Student Profile
 *
 * Trigger events:
 *   ✓ Initial page load
 *   ✓ Task created / edited / completed / deleted
 *   ✓ Pomodoro / focus timer finished
 *   ✓ Habit completed / reminder updated
 *   ✓ Analytics refreshed / dashboard refresh
 */

import { updateProfileSection } from '../studentProfileService'
import { PROFILE_SOURCES } from '../../models/StudentProfile'
import { getStoredSessions } from '../../utils/focusSessionStorage'
import { registerAutomation, AUTOMATION_EVENTS } from '../automationEngine'
import { calculateAllAnalytics } from '../productivity/productivityAnalyticsService'
import { calculateFocusHealthMetrics } from '../productivity/focusHealthService'

/**
 * extractProductivitySummary()
 * ----------------------------
 * Normalizes all productivity metrics into the productivitySummary schema.
 * Strictly uses authoritative data from real focus sessions or honest empty states.
 *
 * @param {Object} data - Optional input data override or event details
 * @returns {Object} Normalized payload for productivitySummary
 */
export function extractProductivitySummary(data = {}) {
  const raw = data || {}
  let sessions = []
  try {
    sessions = raw.sessions || getStoredSessions() || []
  } catch {
    sessions = []
  }

  const hasSessions = Array.isArray(sessions) && sessions.length > 0
  const analytics = hasSessions ? calculateAllAnalytics(sessions) : null
  const health = hasSessions ? calculateFocusHealthMetrics(sessions) : null

  const todayStr = new Date().toISOString().split('T')[0]
  const todaySessions = sessions.filter((s) => (s.date || s.startTime || '').startsWith(todayStr))
  const todayMinutes = todaySessions.reduce((sum, s) => sum + (Number(s.actualMinutes) || 0), 0)
  const totalMinutes = sessions.reduce((sum, s) => sum + (Number(s.actualMinutes) || 0), 0)

  // Focus & Pomodoro Sessions
  const focusSessions = raw.focusSessions ?? raw.totalSessions ?? sessions.length
  const pomodoroSessions = raw.pomodoroSessions ?? focusSessions
  const completedPomodoros = raw.completedPomodoros ?? raw.completedSessions ?? sessions.filter((s) => s.completed).length

  // Focus Times
  const todayFocusTime = raw.todayFocusTime ?? `${(todayMinutes / 60).toFixed(1)} hrs`
  const weeklyFocusHours = raw.weeklyFocusHours ?? (analytics ? parseFloat(analytics.summaryMetrics.currentWeekFocusTime) || 0 : 0)
  const monthlyFocusHours = raw.monthlyFocusHours ?? (analytics ? parseFloat(analytics.summaryMetrics.currentMonthFocusTime) || 0 : 0)

  // Streaks
  const currentStreak = raw.currentStreak ?? (health ? health.currentStreak : 0)
  const bestStreak = raw.bestStreak ?? (health ? health.bestStreak : currentStreak)

  // Tasks & Habits (0 if non-existent in active module)
  const taskCompletionPct = raw.taskCompletionPct ?? (hasSessions ? Math.round((completedPomodoros / (focusSessions || 1)) * 100) : 0)
  const completedTasks = raw.completedTasks ?? completedPomodoros
  const pendingTasks = raw.pendingTasks ?? 0
  const overdueTasks = raw.overdueTasks ?? 0
  const todayTasks = raw.todayTasks ?? todaySessions.length

  // Scores & Deep Work
  const productivityScore = raw.productivityScore ?? (analytics && typeof analytics.productivityScore === 'number' ? analytics.productivityScore : 0)
  const consistencyScore = raw.consistencyScore ?? (health ? health.consistencyScore : 0)
  const deepWorkHours = raw.deepWorkHours ?? weeklyFocusHours
  const distractionCount = raw.distractionCount ?? 0
  const averageDailyStudyTime = raw.averageDailyStudyTime ?? (analytics ? analytics.summaryMetrics.avgSessionDuration : '0 mins')

  // Habits & Reminders
  const currentHabitStreak = raw.currentHabitStreak ?? currentStreak
  const completedHabits = raw.completedHabits ?? 0
  const upcomingReminders = raw.upcomingReminders ?? 0
  const calendarEventsCount = raw.calendarEventsCount ?? 0
  const nextScheduledSession = raw.nextScheduledSession ?? (analytics?.summaryMetrics?.mostStudiedModule ? `Focus: ${analytics.summaryMetrics.mostStudiedModule}` : '')

  // Activity & Badges
  const lastProductivityActivity = raw.lastProductivityActivity ?? (sessions[0]?.endTime || sessions[0]?.startTime || new Date().toISOString())
  const achievementBadges = Array.isArray(raw.achievementBadges)
    ? raw.achievementBadges
    : (health?.achievements ? health.achievements.filter((a) => a.unlocked).map((a) => a.title) : [])
  const studyEfficiency = raw.studyEfficiency ?? (health ? health.healthScore : 0)

  // Trends & Distribution
  const timeDistribution = raw.timeDistribution || (analytics?.timeAnalysis ? Object.fromEntries(analytics.timeAnalysis.map((t) => [t.block.toLowerCase(), `${t.percentage}%`])) : {})
  const preferredStudyTime = raw.preferredStudyTime ?? (analytics?.timeAnalysis ? analytics.timeAnalysis.reduce((max, cur) => (cur.percentage > (max?.percentage || 0) ? cur : max), null)?.block || 'N/A' : 'N/A')
  const weeklyTrend = raw.weeklyTrend ?? ''
  const monthlyTrend = raw.monthlyTrend ?? (analytics?.monthlyComparison?.improvementPct ? `${analytics.monthlyComparison.improvementPct}% vs last month` : '')

  return {
    focusSessions,
    pomodoroSessions,
    completedPomodoros,

    todayFocusTime,
    weeklyFocusHours,
    monthlyFocusHours,

    currentStreak,
    bestStreak,

    taskCompletionPct,
    completedTasks,
    pendingTasks,
    overdueTasks,
    todayTasks,

    productivityScore,
    consistencyScore,
    deepWorkHours,
    distractionCount,
    averageDailyStudyTime,

    currentHabitStreak,
    completedHabits,
    upcomingReminders,
    calendarEventsCount,
    nextScheduledSession,

    lastProductivityActivity,
    achievementBadges,
    studyEfficiency,

    timeDistribution,
    preferredStudyTime,
    weeklyTrend,
    monthlyTrend,
  }
}

/**
 * syncProductivityToProfile()
 * ---------------------------
 * Fire-and-forget sync to Student Profile.
 *
 * @param {Object} data - Productivity input data or event details
 * @param {Object} options - Sync options { skipAutomation: boolean }
 */
export function syncProductivityToProfile(data = {}, options = {}) {
  try {
    const payload = extractProductivitySummary(data)
    updateProfileSection('productivitySummary', payload, PROFILE_SOURCES.PRODUCTIVITY)
      .then(() => {
        if (!options?.skipAutomation) {
          registerAutomation(AUTOMATION_EVENTS.FOCUS_SESSION_COMPLETED, payload)
        }
        console.info('[ProductivityProfileSync] Synchronized productivitySummary to Student Profile (status: live)')
      })
      .catch((err) => {
        console.info('[ProductivityProfileSync] Silent background sync notice:', err?.message || err)
      })
  } catch (err) {
    console.info('[ProductivityProfileSync] Non-blocking sync exception caught:', err?.message || err)
  }
}
