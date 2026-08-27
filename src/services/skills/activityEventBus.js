/**
 * activityEventBus.js
 * Lightweight Publish/Subscribe Event Bus & Event History Logger for ZenScore AI (Phase 7 - Sprint 2).
 * Enables real-time activity event propagation across Courses, Skill Registry, Roadmap, Resume, and Overview.
 */

export const EVENT_TYPES = {
  LESSON_COMPLETED: 'LESSON_COMPLETED',
  QUIZ_COMPLETED: 'QUIZ_COMPLETED',
  CODING_LAB_COMPLETED: 'CODING_LAB_COMPLETED',
  ASSESSMENT_COMPLETED: 'ASSESSMENT_COMPLETED',
  PROJECT_COMPLETED: 'PROJECT_COMPLETED',
  ROADMAP_PHASE_COMPLETED: 'ROADMAP_PHASE_COMPLETED',
  CERTIFICATE_EARNED: 'CERTIFICATE_EARNED',
  BADGE_UNLOCKED: 'BADGE_UNLOCKED',
}

export const EVENT_STORAGE_KEY = 'zenscore_activity_events_v1.1'

const listeners = new Set()
const processedEventIds = new Set()

/**
 * Retrieves event log history from LocalStorage with fallback.
 */
export function getActivityEventHistory() {
  try {
    const raw = localStorage.getItem(EVENT_STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.warn('[ActivityEventBus] LocalStorage read error:', e)
  }
  return []
}

/**
 * Persists event log history to LocalStorage.
 */
function saveActivityEventHistory(eventsArray) {
  try {
    // Keep max 100 recent events
    const trimmed = eventsArray.slice(-100)
    localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(trimmed))
  } catch (e) {
    console.warn('[ActivityEventBus] LocalStorage write error:', e)
  }
}

/**
 * Publishes an activity event across all active subscriber listeners.
 * Ensures event deduplication to prevent double XP or repeated triggers.
 *
 * @param {string} eventType - Member of EVENT_TYPES
 * @param {Object} payload - Event metadata (studentId, courseId, lessonId, skillId, skillName, xpEarned)
 */
export function publishActivityEvent(eventType, payload = {}) {
  if (!eventType) return

  const timestamp = Date.now()
  const eventId = payload.eventId || `evt_${eventType}_${payload.skillId || payload.lessonId || 'gen'}_${timestamp}`

  // Deduplication check
  if (processedEventIds.has(eventId)) {
    console.warn(`[ActivityEventBus] Event ${eventId} already processed. Skipping duplicate.`)
    return
  }
  processedEventIds.add(eventId)

  const fullEvent = {
    eventId,
    eventType,
    studentId: payload.studentId || 'student_1',
    courseId: payload.courseId || null,
    lessonId: payload.lessonId || null,
    skillId: payload.skillId || payload.skillName || null,
    skillName: payload.skillName || payload.skillId || 'Core Engineering',
    xpEarned: payload.xpEarned || 150,
    timestamp,
    details: payload.details || {},
  }

  // Save to LocalStorage audit log
  const history = getActivityEventHistory()
  history.push(fullEvent)
  saveActivityEventHistory(history)

  // Notify all subscribed listener callbacks
  listeners.forEach(callback => {
    try {
      callback(fullEvent)
    } catch (err) {
      console.error('[ActivityEventBus] Error in event listener callback:', err)
    }
  })

  return fullEvent
}

/**
 * Subscribes a callback listener function to incoming activity events.
 *
 * @param {Function} callback - Function receiving (eventObj)
 * @returns {Function} Unsubscribe function () => void
 */
export function subscribeToActivityEvents(callback) {
  if (typeof callback !== 'function') return () => {}

  listeners.add(callback)

  return () => {
    listeners.delete(callback)
  }
}
