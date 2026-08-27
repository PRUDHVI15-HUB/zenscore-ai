/**
 * interviewSyncService.js
 * Live Interview Synchronization Service for ZenScore AI (Product 6 - Sprint A).
 * Synchronizes interview readiness metrics across platform events and persists to 'interview_foundation_v1.1'.
 */

import { calculateInterviewReadiness } from './interviewReadinessCalculator'

export const INTERVIEW_STORAGE_KEY = 'interview_foundation_v1.1'

/**
 * Gets or initializes synchronized interview foundation from localStorage.
 */
export function getSynchronizedInterviewState(careerContext = {}) {
  try {
    const cached = localStorage.getItem(INTERVIEW_STORAGE_KEY)
    if (cached) return JSON.parse(cached)
  } catch (e) {
    console.warn('[InterviewSyncService] localStorage read error:', e)
  }

  const readiness = calculateInterviewReadiness(careerContext)
  const defaultState = {
    version: 'interview_foundation_v1.1',
    lastSyncedAt: new Date().toISOString(),
    metrics: readiness,
    completedMockSessionsCount: 0,
  }

  saveSynchronizedInterviewState(defaultState)
  return defaultState
}

/**
 * Persists synchronized interview state to localStorage.
 */
export function saveSynchronizedInterviewState(stateObj) {
  try {
    localStorage.setItem(INTERVIEW_STORAGE_KEY, JSON.stringify({ ...stateObj, lastSyncedAt: new Date().toISOString() }))
  } catch (e) {
    console.warn('[InterviewSyncService] localStorage save error:', e)
  }
}

/**
 * Forces a live resynchronization of all interview metrics.
 */
export function syncInterviewState(careerContext = {}) {
  const updatedReadiness = calculateInterviewReadiness(careerContext)
  const stateObj = {
    version: 'interview_foundation_v1.1',
    lastSyncedAt: new Date().toISOString(),
    metrics: updatedReadiness,
    completedMockSessionsCount: 0,
  }
  saveSynchronizedInterviewState(stateObj)
  return stateObj
}
