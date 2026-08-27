/**
 * LocalStorage wrapper for ZenScore AI Focus Session Engine
 * Key: productivity_focus_v1
 */

const STORAGE_KEY = 'productivity_focus_v1'

/**
 * Default empty state for brand-new student reset (Phase 2)
 */
export const DEFAULT_PRODUCTIVITY_STATE = {
  totalFocusMinutes: 0,
  sessionsCompleted: 0,
  longestSession: 0,
  averageSession: 0,
  currentStreak: 0,
  weeklyFocus: 0,
  productivityScore: 0,
  focusHealth: null,
  aiCoachUnlocked: false,
  sessionHistory: []
}

/**
 * Get all stored focus sessions
 * @returns {Array} Array of session objects
 */
export const getStoredSessions = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading productivity_focus_v1 from localStorage:', error)
    return []
  }
}

/**
 * Save a new focus session
 * @param {Object} session Session object
 * @returns {Array} Updated array of sessions
 */
export const saveStoredSession = (session) => {
  try {
    const existing = getStoredSessions()
    const updated = [session, ...existing]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
  } catch (error) {
    console.error('Error saving session to productivity_focus_v1:', error)
    return []
  }
}

/**
 * Delete a session by ID
 * @param {string} sessionId 
 * @returns {Array} Updated array of sessions
 */
export const deleteStoredSession = (sessionId) => {
  try {
    const existing = getStoredSessions()
    const updated = existing.filter((s) => s.id !== sessionId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
  } catch (error) {
    console.error('Error deleting session from productivity_focus_v1:', error)
    return []
  }
}

/**
 * Clear all focus sessions and reset all productivity local storage state to zero demo state
 */
export const clearStoredSessions = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
    // Clear AI Coach caches
    Object.keys(localStorage).forEach((k) => {
      if (k.includes('ai_productivity_coach_v1') || k.includes('zenscore_ai_cache_productivity')) {
        localStorage.removeItem(k)
      }
    })
  } catch (error) {
    console.error('Error clearing productivity_focus_v1:', error)
  }
}

export const resetProductivityState = () => {
  clearStoredSessions()
  return DEFAULT_PRODUCTIVITY_STATE
}
