/**
 * Central Cross-Module Automation Engine
 * ========================================
 * Listens for events across modules and automatically triggers cross-module updates,
 * maintaining the Unified Student Profile as the single source of truth.
 *
 * Design Principles:
 *   - DEEP DELEGATION: Reuses existing services only. Zero duplicated business logic.
 *   - BATCHING & DEBOUNCING: Groups events occurring within 300ms to prevent duplicate renders.
 *   - SILENT & NON-BLOCKING: Fire-and-forget queue execution, never blocks UI or crashes modules.
 *   - EVENT HISTORY: Maintained in local history array for diagnostics & auditing.
 */

import { AUTOMATION_EVENTS, AUTOMATION_RULES } from './automationRules'
import { dispatchAIAction } from './aiActionRouter'

export { AUTOMATION_EVENTS, AUTOMATION_RULES }

// In-memory queue & history state
let eventQueue = []
let isProcessing = false
let batchTimeout = null
let customRuleRegistry = { ...AUTOMATION_RULES }
const HISTORY_STORAGE_KEY = 'zenscore_automation_history_v1'

/**
 * Get stored automation history log
 * @returns {Array} Array of historical automation entries
 */
export function getAutomationHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Record an entry into local automation history log
 */
function recordHistory(entry) {
  try {
    const current = getAutomationHistory()
    const updated = [entry, ...current].slice(0, 50) // keep last 50
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.info('[AutomationEngine] History storage notice:', err?.message)
  }
}

/**
 * Register a custom set of automation rules to extend defaults
 * @param {Object} rules - Map of EVENT_TYPE -> Array of Rule objects
 */
export function registerAutomationRules(rules = {}) {
  customRuleRegistry = { ...customRuleRegistry, ...rules }
  console.info('[AutomationEngine] Registered custom automation rules:', Object.keys(rules))
}

/**
 * Registers an event into the Automation Queue.
 * Automatically batches events occurring within a 300ms window.
 *
 * @param {string} eventType - Event identifier from AUTOMATION_EVENTS
 * @param {Object} payload - Data payload associated with the event
 */
export function registerAutomation(eventType, payload = {}) {
  if (!eventType) return

  console.info(`[AutomationEngine] Event registered: ${eventType}`, payload)

  // Prevent duplicate identical event in current queue
  const isDuplicate = eventQueue.some(
    (item) => item.eventType === eventType && JSON.stringify(item.payload) === JSON.stringify(payload)
  )

  if (!isDuplicate) {
    eventQueue.push({
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      eventType,
      payload,
      timestamp: new Date().toISOString()
    })
  }

  // Debounce batch processing within 300ms window
  if (batchTimeout) clearTimeout(batchTimeout)
  batchTimeout = setTimeout(() => {
    processAutomationQueue()
  }, 300)
}

/**
 * Processes all queued automation events sequentially.
 */
export async function processAutomationQueue() {
  if (isProcessing || eventQueue.length === 0) return

  isProcessing = true
  const currentBatch = [...eventQueue]
  eventQueue = [] // Clear pending queue

  console.info(`[AutomationEngine] Processing batch of ${currentBatch.length} event(s)...`)

  for (const item of currentBatch) {
    const { eventType, payload, timestamp } = item
    const startTime = performance.now()

    const rules = customRuleRegistry[eventType] || []
    const affectedModules = []

    for (const rule of rules) {
      const res = await executeAutomationRule(rule, payload)
      if (res && res.targetModule) {
        affectedModules.push(res.targetModule)
      }
    }

    const duration = Math.round(performance.now() - startTime)

    recordHistory({
      eventId: item.id,
      event: eventType,
      time: timestamp,
      status: 'completed',
      durationMs: duration,
      affectedModules: Array.from(new Set(affectedModules))
    })
  }

  isProcessing = false

  // If new items were queued during execution, process them
  if (eventQueue.length > 0) {
    processAutomationQueue()
  }
}

/**
 * Executes a single automation rule mapping to target module action.
 *
 * @param {Object} rule - { targetModule, actionType }
 * @param {Object} eventPayload - Data payload passed from registering module
 */
export async function executeAutomationRule(rule, eventPayload = {}) {
  if (!rule || !rule.actionType) return { success: false }

  const { targetModule, actionType } = rule
  console.info(`[AutomationEngine] Executing rule: ${targetModule} -> ${actionType}`)

  try {
    let result = { success: true }

    switch (actionType) {
      case 'REFRESH_DASHBOARD':
      case 'NOTIFY_DASHBOARD': {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('REFRESH_DASHBOARD_DATA'))
        }
        break
      }

      case 'UPDATE_AI_CONTEXT':
      case 'ADAPT_AI_RECOMMENDATIONS':
      case 'RECORD_JOB_APPLICATION':
      case 'REFRESH_AI_MEMORY': {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('AI_PROFILE_REFRESH'))
        }
        break
      }

      case 'REFRESH_CAREER_READINESS':
      case 'REFRESH_CAREER_DASHBOARD':
      case 'REFRESH_CAREER_PROGRESS': {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('CAREERS_DATA_REFRESH'))
        }
        break
      }

      case 'REFRESH_SKILLS_RECOMMENDATIONS':
      case 'REFRESH_SKILLS_ROADMAP':
      case 'REFRESH_SKILLS':
      case 'UPDATE_VERIFIED_SKILLS':
      case 'UPDATE_SKILLS_PROGRESS': {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('SKILLS_DATA_REFRESH'))
        }
        break
      }

      case 'REFRESH_COURSES_RECOMMENDATIONS':
      case 'REFRESH_COURSES_ROADMAP':
      case 'REFRESH_COURSES': {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('COURSES_DATA_REFRESH'))
        }
        break
      }

      case 'REFRESH_JOBS_RECOMMENDATIONS': {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('JOBS_DATA_REFRESH'))
        }
        break
      }

      default: {
        // Delegate to AI Action Router for general action types
        result = await dispatchAIAction({ type: actionType, payload: eventPayload })
        break
      }
    }

    return {
      success: true,
      targetModule,
      actionType,
      result
    }
  } catch (err) {
    console.info(`[AutomationEngine] Execution warning (${targetModule}:${actionType}):`, err?.message || err)
    return {
      success: false,
      targetModule,
      actionType,
      error: err?.message
    }
  }
}
