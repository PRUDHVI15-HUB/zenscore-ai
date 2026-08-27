import { getStoredSessions, deleteStoredSession } from '../../utils/focusSessionStorage'

/**
 * Fetch all sessions from productivity_focus_v1
 */
export const getHistorySessions = () => {
  return getStoredSessions()
}

/**
 * Delete session by ID
 */
export const removeHistorySession = (sessionId) => {
  return deleteStoredSession(sessionId)
}

/**
 * Calculate Summary Stats dynamically
 */
export const calculateHistoryStats = (sessions = []) => {
  const todayStr = new Date().toISOString().split('T')[0]

  const todaySessions = sessions.filter((s) => s.date === todayStr).length
  const totalSessions = sessions.length

  const totalMinutes = sessions.reduce((sum, s) => sum + (Number(s.actualMinutes) || 0), 0)
  const totalFocusHours = (totalMinutes / 60).toFixed(1)

  const avgSessionTime = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0

  const longestSession =
    totalSessions > 0
      ? Math.max(...sessions.map((s) => Number(s.actualMinutes) || 0))
      : 0

  return {
    todaySessions,
    totalSessions,
    totalFocusHours: `${totalFocusHours} hrs`,
    avgSessionTime: `${avgSessionTime} mins`,
    longestSession: `${longestSession} mins`
  }
}

/**
 * Filter Sessions dynamically by Search, Module, Date, and Status
 */
export const filterHistorySessions = (
  sessions = [],
  { searchQuery = '', moduleFilter = 'All', dateFilter = 'All Time', statusFilter = 'All' }
) => {
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  return sessions.filter((s) => {
    // 1. Search Query Filter (Topic, Goal, Category)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      const matchTopic = (s.topic || '').toLowerCase().includes(q)
      const matchGoal = (s.goal || '').toLowerCase().includes(q)
      const matchCategory = (s.category || '').toLowerCase().includes(q)
      if (!matchTopic && !matchGoal && !matchCategory) {
        return false
      }
    }

    // 2. Module Filter
    if (moduleFilter !== 'All' && s.category !== moduleFilter) {
      return false
    }

    // 3. Date Filter
    if (dateFilter === 'Today') {
      if (s.date !== todayStr) return false
    } else if (dateFilter === 'Last 7 Days') {
      const sDate = new Date(s.date || s.startTime)
      const diffTime = Math.abs(today - sDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (diffDays > 7) return false
    } else if (dateFilter === 'Last 30 Days') {
      const sDate = new Date(s.date || s.startTime)
      const diffTime = Math.abs(today - sDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (diffDays > 30) return false
    }

    // 4. Status Filter
    if (statusFilter === 'Completed') {
      if (!s.completed) return false
    } else if (statusFilter === 'Incomplete') {
      if (s.completed) return false
    }

    return true
  })
}

/**
 * Format timestamp into e.g. "7:15 PM"
 */
export const formatTimeStr = (isoStr) => {
  if (!isoStr) return '--:--'
  try {
    return new Date(isoStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch (e) {
    return '--:--'
  }
}

/**
 * Format date string into e.g. "29 Jul" or "29 Jul 2026"
 */
export const formatDateStr = (dateInput) => {
  if (!dateInput) return '---'
  try {
    const d = new Date(dateInput)
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
  } catch (e) {
    return dateInput
  }
}
