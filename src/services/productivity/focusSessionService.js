import { getStoredSessions, saveStoredSession } from '../../utils/focusSessionStorage'
import { syncProductivityToProfile } from '../profileSync/productivityProfileSync'
import { addFocusLog } from '../api'

/**
 * Calculate XP earned based on actual minutes focused
 * Rule: 1 Minute = 1 XP, Max Cap = 120 XP
 * @param {number} actualMinutes 
 * @returns {number} XP Earned
 */
export const calculateXP = (actualMinutes) => {
  if (!actualMinutes || actualMinutes <= 0) return 0
  const minutes = Math.round(actualMinutes)
  return Math.min(120, Math.max(1, minutes))
}

/**
 * Publish FOCUS_SESSION_COMPLETED custom event
 * @param {Object} payload 
 */
export const publishFocusSessionCompleted = (payload) => {
  try {
    const customEvent = new CustomEvent('FOCUS_SESSION_COMPLETED', {
      detail: payload,
      bubbles: true
    })
    window.dispatchEvent(customEvent)
  } catch (error) {
    console.error('Failed to publish FOCUS_SESSION_COMPLETED event:', error)
  }
}

/**
 * Build complete session record object
 */
export const createSessionObject = ({
  topic,
  category = 'Courses',
  goal = '',
  plannedMinutes = 25,
  actualMinutes,
  startTime,
  endTime = new Date().toISOString(),
  completed = true,
  paused = false
}) => {
  const actualMins = actualMinutes !== undefined ? Number(actualMinutes) : Number(plannedMinutes)
  const xpEarned = calculateXP(actualMins)
  const dateStr = new Date().toISOString().split('T')[0]

  return {
    id: `fs_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    topic,
    category,
    goal,
    plannedMinutes: Number(plannedMinutes),
    actualMinutes: actualMins,
    startTime: startTime || new Date().toISOString(),
    endTime,
    completed,
    paused,
    date: dateStr,
    xpEarned
  }
}

/**
 * Complete and save session, then publish event and persist to backend
 * @param {Object} sessionObj 
 * @returns {Object} Saved session and updated list
 */
export const completeAndSaveSession = (sessionObj) => {
  const savedList = saveStoredSession(sessionObj)

  // Publish event payload
  const eventPayload = {
    sessionId: sessionObj.id,
    topic: sessionObj.topic,
    category: sessionObj.category,
    plannedMinutes: sessionObj.plannedMinutes,
    actualMinutes: sessionObj.actualMinutes,
    xpEarned: sessionObj.xpEarned,
    completedAt: sessionObj.endTime
  }

  // Dual Persistence: Fire asynchronous backend cloud save
  addFocusLog({
    subject: sessionObj.topic,
    durationMinutes: sessionObj.actualMinutes,
    notes: sessionObj.goal,
    category: sessionObj.category,
    clientSessionId: sessionObj.id,
    date: sessionObj.startTime || sessionObj.endTime
  }).catch((err) => {
    console.info('[FocusSessionService] Cloud sync notice:', err?.message || err)
  })

  publishFocusSessionCompleted(eventPayload)
  syncProductivityToProfile(eventPayload)

  return {
    session: sessionObj,
    allSessions: savedList
  }
}

export const getAllSessions = () => getStoredSessions()
