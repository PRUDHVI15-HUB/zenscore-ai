/**
 * StudentProfileService v1.1.0
 * ============================
 * Centralized service for managing the Student Profile.
 *
 * Architecture: Section Metadata Envelope
 * ─────────────────────────────────────────
 * Every section write stamps:
 *   status:      'live'
 *   source:      'Academics' | 'Careers' | 'Skills' | ...
 *   lastUpdated: ISO timestamp
 *   version:     previous + 1
 *   data:        merged section payload
 *
 * Public API:
 *   getStudentProfile()                         → full profile
 *   getProfileSection(name)                     → single section envelope
 *   getSectionData(name)                        → just the .data object
 *   updateStudentProfile(partial)               → deep merge full profile
 *   updateProfileSection(name, data, source)    → write to one section
 *   refreshStudentProfile()                     → force backend re-fetch
 *   markSectionStale(name)                      → mark as 'stale'
 *   isSectionStale(name, maxAgeMs)              → staleness check
 *   getSectionAge(name)                         → ms since last update
 *   getIntegrationReport()                      → status of all sections
 *   resetProfile()                              → clear on logout
 *
 * IMPORTANT: No business logic. No calculations. No AI. No sync.
 *
 * Storage:
 *   Primary  → Backend API  (GET /api/student/profile)
 *   Fallback → localStorage (key: zenscore_student_profile)
 */

import { apiFetch } from './api'
import { enqueueUpdate } from './syncQueue'
import { auth } from '../firebase'
import {
  createEmptyStudentProfile,
  createSectionEnvelope,
  PROFILE_SECTIONS,
  SECTION_STATUS,
} from '../models/StudentProfile'

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

// Returns a user-scoped storage key so different users never share localStorage cache
const _getStorageKey = () => {
  const uid = auth?.currentUser?.uid
  return uid ? `zenscore_student_profile_${uid}` : null
}

const PROFILE_VERSION  = '1.1.0'

// Default stale threshold: 7 days in milliseconds
const DEFAULT_STALE_MS = 7 * 24 * 60 * 60 * 1000

// ─────────────────────────────────────────────────────────────
// INTERNAL HELPERS
// ─────────────────────────────────────────────────────────────

function _readFromStorage() {
  try {
    const key = _getStorageKey()
    if (!key) return null
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed?._meta?.version !== PROFILE_VERSION) {
      localStorage.removeItem(key)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function _writeToStorage(profile) {
  try {
    const key = _getStorageKey()
    if (!key) return // Don't cache if no user logged in
    localStorage.setItem(key, JSON.stringify(profile))
  } catch (err) {
    console.warn('[StudentProfileService] localStorage write failed:', err?.message)
  }
}

function _deepMerge(base, partial) {
  if (!partial || typeof partial !== 'object') return base
  const result = { ...base }
  for (const key of Object.keys(partial)) {
    if (
      partial[key] !== null &&
      typeof partial[key] === 'object' &&
      !Array.isArray(partial[key]) &&
      typeof result[key] === 'object' &&
      result[key] !== null &&
      !Array.isArray(result[key])
    ) {
      result[key] = _deepMerge(result[key], partial[key])
    } else {
      result[key] = partial[key]
    }
  }
  return result
}

function _stampMeta(profile) {
  return {
    ...profile,
    _meta: { ...profile._meta, updatedAt: new Date().toISOString() }
  }
}

/**
 * Validates that `name` is a known section.
 * Logs a warning (not throw) so callers aren't broken during development.
 */
function _validateSection(name) {
  if (!PROFILE_SECTIONS.includes(name)) {
    console.warn(
      `[StudentProfileService] Unknown section: "${name}". ` +
      `Valid sections: ${PROFILE_SECTIONS.join(', ')}`
    )
    return false
  }
  return true
}

// ─────────────────────────────────────────────────────────────
// SECTION ENVELOPE HELPER
// Builds the updated envelope for a section write
// ─────────────────────────────────────────────────────────────

/**
 * Produces an updated section envelope when a module writes data.
 * @param {SectionEnvelope} existing  - Current envelope from the profile
 * @param {Object}          newData   - Partial data to merge into existing.data
 * @param {string}          source    - Module name (e.g. 'Academics')
 * @returns {SectionEnvelope}
 */
function _buildUpdatedEnvelope(existing, newData, source) {
  const currentVersion = existing?.version ?? 0
  const currentData    = existing?.data ?? {}
  return {
    status:      SECTION_STATUS.LIVE,
    source:      source || 'System',
    lastUpdated: new Date().toISOString(),
    version:     currentVersion + 1,
    data:        _deepMerge(currentData, newData),
  }
}

// ─────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────

/**
 * getStudentProfile()
 * -------------------
 * Returns the full Student Profile.
 * Backend-first; falls back to localStorage; then returns empty profile.
 *
 * @returns {Promise<StudentProfile>}
 */
export async function getStudentProfile() {
  // 1. Try backend
  try {
    const res = await apiFetch('/student/profile')
    const profileData = res?.profile || res?.data
    if (res?.success && profileData) {
      const profile = _deepMerge(createEmptyStudentProfile(), profileData)
      _writeToStorage(profile)
      return profile
    }
  } catch {
    // Graceful fallback to local cache
  }

  // 2. Fall back to localStorage
  const stored = _readFromStorage()
  if (stored) return stored

  // 3. Return clean empty profile
  const empty = createEmptyStudentProfile()
  const now   = new Date().toISOString()
  empty._meta.createdAt = now
  empty._meta.updatedAt = now
  return empty
}

/**
 * getProfileSection()
 * -------------------
 * Returns the full section envelope (with metadata).
 *
 * @param {string} sectionName
 * @returns {Promise<SectionEnvelope|null>}
 *
 * @example
 * const envelope = await getProfileSection('academicSummary')
 * // { status: 'live', source: 'Academics', lastUpdated: '...', version: 3, data: {...} }
 */
export async function getProfileSection(sectionName) {
  if (!_validateSection(sectionName)) return null
  const profile = await getStudentProfile()
  return profile?.[sectionName] ?? null
}

/**
 * getSectionData()
 * ----------------
 * Returns ONLY the .data payload of a section, skipping envelope metadata.
 * Convenience method for components that only care about the actual data.
 *
 * @param {string} sectionName
 * @returns {Promise<Object|null>}
 *
 * @example
 * const data = await getSectionData('academicSummary')
 * // { currentCGPA: 8.5, completedSemesters: 4, ... }
 */
export async function getSectionData(sectionName) {
  const envelope = await getProfileSection(sectionName)
  return envelope?.data ?? null
}

/**
 * updateStudentProfile()
 * ----------------------
 * Low-level deep merge of the full profile.
 * Prefer updateProfileSection() for module-level writes.
 *
 * @param {Partial<StudentProfile>} partial
 * @returns {Promise<StudentProfile>}
 */
export async function updateStudentProfile(partial) {
  const current = _readFromStorage() || createEmptyStudentProfile()
  const updated  = _stampMeta(_deepMerge(current, partial))
  _writeToStorage(updated)

  // Fire-and-forget backend sync
  apiFetch('/student/profile', {
    method: 'PATCH',
    body: JSON.stringify(partial),
  }).catch(() => {
    console.info('[StudentProfileService] Backend PATCH fallback to sync queue.')
  })

  return updated
}

/**
 * updateProfileSection()
 * ----------------------
 * Primary write API for modules.
 *
 * Writes data for one named section and stamps the metadata envelope:
 *   - status      → 'live'
 *   - source      → provided module name
 *   - lastUpdated → current ISO timestamp
 *   - version     → previous version + 1
 *   - data        → deep-merged with existing .data
 *
 * @param {string} sectionName  - e.g. 'academicSummary'
 * @param {Object} sectionData  - Partial payload to merge into .data
 * @param {string} source       - Module name (e.g. 'Academics', 'Skills')
 * @returns {Promise<StudentProfile>}
 *
 * @example — Academics module writes:
 *   await updateProfileSection('academicSummary', { currentCGPA: 8.5 }, 'Academics')
 *
 * @example — Skills module writes:
 *   await updateProfileSection('skillsSummary', { totalVerified: 12 }, 'Skills')
 */
export async function updateProfileSection(sectionName, sectionData, source = 'System') {
  if (!_validateSection(sectionName)) return getStudentProfile()

  const current         = _readFromStorage() || createEmptyStudentProfile()
  const existingEnvelope = current[sectionName] ?? createSectionEnvelope()
  const updatedEnvelope  = _buildUpdatedEnvelope(existingEnvelope, sectionData, source)

  const updatedProfile = _stampMeta(_deepMerge(current, { [sectionName]: updatedEnvelope }))
  _writeToStorage(updatedProfile)

  // Background Cloud Synchronization (Non-Blocking)
  enqueueUpdate(sectionName, sectionData, source)

  return updatedProfile
}

/**
 * refreshStudentProfile()
 * -----------------------
 * Force re-fetch from backend. Overwrites local cache.
 *
 * @returns {Promise<StudentProfile>}
 */
export async function refreshStudentProfile() {
  try {
    const res = await apiFetch('/student/profile/refresh')
    if (res?.success && res?.data) {
      const profile = _deepMerge(createEmptyStudentProfile(), res.data)
      profile._meta.lastRefreshedAt = new Date().toISOString()
      _writeToStorage(profile)
      return profile
    }
  } catch {
    console.info('[StudentProfileService] Refresh endpoint not yet live. Using cached profile.')
  }
  return getStudentProfile()
}

/**
 * markSectionStale()
 * ------------------
 * Marks a section as 'stale' without changing its data.
 * Called when a module detects its data may be out of date.
 *
 * @param {string} sectionName
 * @returns {Promise<StudentProfile>}
 */
export async function markSectionStale(sectionName) {
  if (!_validateSection(sectionName)) return getStudentProfile()
  const current  = _readFromStorage() || createEmptyStudentProfile()
  const envelope = current[sectionName] ?? createSectionEnvelope()
  return updateStudentProfile({
    [sectionName]: { ...envelope, status: SECTION_STATUS.STALE }
  })
}

/**
 * isSectionStale()
 * ----------------
 * Returns true if the section's lastUpdated is older than maxAgeMs,
 * or if the section has never been written (status === 'pending').
 *
 * @param {string} sectionName
 * @param {number} [maxAgeMs=DEFAULT_STALE_MS]  - Default: 7 days
 * @returns {Promise<boolean>}
 *
 * @example — AI Tutor checking if skills data is current:
 *   const stale = await isSectionStale('skillsSummary', 3 * 24 * 60 * 60 * 1000) // 3 days
 */
export async function isSectionStale(sectionName, maxAgeMs = DEFAULT_STALE_MS) {
  const envelope = await getProfileSection(sectionName)
  if (!envelope || envelope.status === SECTION_STATUS.PENDING) return true
  if (!envelope.lastUpdated) return true
  const age = Date.now() - new Date(envelope.lastUpdated).getTime()
  return age > maxAgeMs
}

/**
 * getSectionAge()
 * ---------------
 * Returns how many milliseconds ago the section was last updated.
 * Returns Infinity if the section has never been written.
 *
 * @param {string} sectionName
 * @returns {Promise<number>}  milliseconds since last update (Infinity if never)
 *
 * @example — AI Tutor generating staleness message:
 *   const ageMs = await getSectionAge('jobsSummary')
 *   const days  = Math.floor(ageMs / 86400000)
 *   // "Your Jobs data hasn't been refreshed in 3 weeks."
 */
export async function getSectionAge(sectionName) {
  const envelope = await getProfileSection(sectionName)
  if (!envelope?.lastUpdated) return Infinity
  return Date.now() - new Date(envelope.lastUpdated).getTime()
}

/**
 * getIntegrationReport()
 * ----------------------
 * Returns a summary of all sections — status, source, lastUpdated, version.
 * Useful for:
 *   - Debugging which modules are connected
 *   - Dashboard "data freshness" indicators
 *   - AI Tutor time-aware insight generation
 *
 * @returns {Promise<Object>}  { sectionName: { status, source, lastUpdated, version } }
 *
 * @example return value:
 * {
 *   basicProfile:        { status: 'pending', source: null,         lastUpdated: null,         version: 1 },
 *   academicSummary:     { status: 'live',    source: 'Academics',  lastUpdated: '2026-08-06', version: 3 },
 *   skillsSummary:       { status: 'stale',   source: 'Skills',     lastUpdated: '2026-07-20', version: 7 },
 *   jobsSummary:         { status: 'pending', source: null,         lastUpdated: null,         version: 1 },
 * }
 */
export async function getIntegrationReport() {
  const profile = await getStudentProfile()
  const report  = {}
  for (const section of PROFILE_SECTIONS) {
    const envelope = profile[section] ?? {}
    report[section] = {
      status:      envelope.status      ?? SECTION_STATUS.PENDING,
      source:      envelope.source      ?? null,
      lastUpdated: envelope.lastUpdated ?? null,
      version:     envelope.version     ?? 1,
    }
  }
  return report
}

/**
 * resetProfile()
 * --------------
 * Clears the Student Profile from localStorage.
 * Called on logout. Does NOT delete backend data.
 */
export function resetProfile() {
  try {
    // Remove current user's scoped key
    const key = _getStorageKey()
    if (key) localStorage.removeItem(key)
    // Also clear any stale profile keys from previous sessions
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith('zenscore_student_profile')) {
        localStorage.removeItem(k)
      }
    })
  } catch {
    // ignore
  }
}
