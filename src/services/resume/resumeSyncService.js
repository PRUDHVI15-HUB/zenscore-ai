/**
 * resumeSyncService.js
 * Live Resume Synchronization Service for ZenScore AI (Product 5 - Sprint A).
 * Synchronizes resume sections across platform events and persists to 'resume_profile_v1.1'.
 */

import { buildResumeSections } from './resumeSectionBuilder'

export const RESUME_STORAGE_KEY = 'resume_profile_v1.1'

/**
 * Gets or initializes the synchronized resume profile from localStorage.
 */
export function getSynchronizedResumeProfile(careerContext = {}) {
  try {
    const cached = localStorage.getItem(RESUME_STORAGE_KEY)
    if (cached) return JSON.parse(cached)
  } catch (e) {
    console.warn('[ResumeSyncService] localStorage read error:', e)
  }

  const generatedSections = buildResumeSections(careerContext)
  const defaultProfile = {
    version: 'v1.1',
    lastSyncedAt: new Date().toISOString(),
    sections: generatedSections,
  }

  saveSynchronizedResumeProfile(defaultProfile)
  return defaultProfile
}

/**
 * Persists synchronized resume profile to localStorage.
 */
export function saveSynchronizedResumeProfile(profileObj) {
  try {
    localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify({ ...profileObj, lastSyncedAt: new Date().toISOString() }))
  } catch (e) {
    console.warn('[ResumeSyncService] localStorage save error:', e)
  }
}

/**
 * Forces a live resynchronization of all resume sections from CareerContext & Skill Registry.
 */
export function syncResumeProfile(careerContext = {}) {
  const updatedSections = buildResumeSections(careerContext)
  const profileObj = {
    version: 'v1.1',
    lastSyncedAt: new Date().toISOString(),
    sections: updatedSections,
  }
  saveSynchronizedResumeProfile(profileObj)
  return profileObj
}
