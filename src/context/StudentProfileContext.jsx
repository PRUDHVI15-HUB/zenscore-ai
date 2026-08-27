/**
 * StudentProfileContext v1.1.0
 * ============================
 * React context for the unified Student Profile.
 *
 * Changes in v1.1.0:
 *   - updateSection(name, data, source) now accepts a `source` parameter
 *   - All selectors read from section.data (not section directly)
 *   - integrationReport replaces integrationStatus (richer metadata)
 *   - New helpers: getSectionAge(), isSectionStale()
 *
 * Usage:
 *   import { useStudentProfile } from '../context/StudentProfileContext'
 *   const { profile, updateSection, currentCGPA, isLoading } = useStudentProfile()
 *
 * Module write pattern:
 *   await updateSection('academicSummary', { currentCGPA: 8.5 }, 'Academics')
 *   //                  ^section name      ^data payload         ^source tag
 *
 * The source tag is what powers AI time-awareness:
 *   "Your Skills were updated 2 days ago but your Jobs haven't synced in 3 weeks."
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo
} from 'react'
import { auth } from '../firebase'
import {
  getStudentProfile,
  updateStudentProfile,
  refreshStudentProfile,
  updateProfileSection,
  getSectionData,
  getIntegrationReport,
  isSectionStale,
  getSectionAge,
  resetProfile,
} from '../services/studentProfileService'
import { createEmptyStudentProfile } from '../models/StudentProfile'

// ─────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────

const StudentProfileContext = createContext(null)

// ─────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────

export function StudentProfileProvider({ children }) {
  const [profile,           setProfile]           = useState(createEmptyStudentProfile)
  const [isLoading,         setIsLoading]         = useState(true)
  const [isRefreshing,      setIsRefreshing]      = useState(false)
  const [error,             setError]             = useState(null)
  const [integrationReport, setIntegrationReport] = useState({})

  // ── LOAD ON AUTH CHANGE — reloads profile per user ──────────
  useEffect(() => {
    let cancelled = false
    let currentUid = null

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      const uid = firebaseUser?.uid || null

      if (!uid) {
        // Logged out — reset to empty profile immediately
        if (!cancelled) {
          setProfile(createEmptyStudentProfile())
          setIntegrationReport({})
          setIsLoading(false)
        }
        return
      }

      // Different user logged in — reset stale profile first
      if (currentUid && currentUid !== uid) {
        if (!cancelled) {
          setProfile(createEmptyStudentProfile())
          setIntegrationReport({})
        }
      }
      currentUid = uid

      setIsLoading(true)
      setError(null)
      try {
        const [loaded, report] = await Promise.all([
          getStudentProfile(),
          getIntegrationReport(),
        ])
        if (!cancelled) {
          setProfile(loaded)
          setIntegrationReport(report)
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('[StudentProfileContext] Load error:', err?.message)
          setError(err?.message || 'Failed to load profile')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })

    return () => { cancelled = true; unsubscribe() }
  }, [])

  // Helper: refresh report after any write
  const _refreshReport = useCallback(async () => {
    const report = await getIntegrationReport()
    setIntegrationReport(report)
    return report
  }, [])

  // ── UPDATE FULL PROFILE ────────────────────────────────────
  const updateProfile = useCallback(async (partial) => {
    try {
      const updated = await updateStudentProfile(partial)
      setProfile(updated)
      await _refreshReport()
      return updated
    } catch (err) {
      console.warn('[StudentProfileContext] updateProfile error:', err?.message)
      throw err
    }
  }, [_refreshReport])

  // ── UPDATE A SINGLE SECTION ────────────────────────────────
  /**
   * Write data for one section. Primary module API.
   *
   * @param {string} sectionName  - e.g. 'academicSummary'
   * @param {Object} sectionData  - Payload to merge into section.data
   * @param {string} source       - Module name: 'Academics', 'Skills', etc.
   *
   * @example — from Academics module:
   *   await updateSection('academicSummary', { currentCGPA: 8.5 }, 'Academics')
   *
   * @example — from Skills module:
   *   await updateSection('skillsSummary', { totalVerified: 12 }, 'Skills')
   */
  const updateSection = useCallback(async (sectionName, sectionData, source = 'System') => {
    try {
      const updated = await updateProfileSection(sectionName, sectionData, source)
      setProfile(updated)
      await _refreshReport()
      return updated
    } catch (err) {
      console.warn('[StudentProfileContext] updateSection error:', err?.message)
      throw err
    }
  }, [_refreshReport])

  // ── REFRESH FROM BACKEND ───────────────────────────────────
  const refresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const fresh = await refreshStudentProfile()
      setProfile(fresh)
      await _refreshReport()
      return fresh
    } catch (err) {
      console.warn('[StudentProfileContext] refresh error:', err?.message)
    } finally {
      setIsRefreshing(false)
    }
  }, [_refreshReport])

  // ── RESET (LOGOUT) ─────────────────────────────────────────
  const reset = useCallback(() => {
    resetProfile()
    setProfile(createEmptyStudentProfile())
    setIntegrationReport({})
    setError(null)
  }, [])

  // ── STALENESS HELPERS ──────────────────────────────────────
  /**
   * Check if a section is stale (past the provided max age).
   * @param {string} sectionName
   * @param {number} [maxAgeMs] - Default: 7 days
   * @returns {Promise<boolean>}
   */
  const checkSectionStale = useCallback(
    (sectionName, maxAgeMs) => isSectionStale(sectionName, maxAgeMs),
    []
  )

  /**
   * Get how many milliseconds ago a section was last updated.
   * Returns Infinity if never updated.
   * @param {string} sectionName
   * @returns {Promise<number>}
   */
  const getSectionAgeMs = useCallback(
    (sectionName) => getSectionAge(sectionName),
    []
  )

  // ── CONVENIENCE SELECTORS ──────────────────────────────────
  // All read from section.data — NOT section directly (v1.1.0 change)

  const selectors = useMemo(() => {
    const basic        = profile.basicProfile?.data        ?? {}
    const academic     = profile.academicSummary?.data     ?? {}
    const career       = profile.careerProfile?.data       ?? {}
    const skills       = profile.skillsSummary?.data       ?? {}
    const courses      = profile.coursesSummary?.data      ?? {}
    const jobs         = profile.jobsSummary?.data         ?? {}
    const productivity = profile.productivitySummary?.data ?? {}

    return {
      // Basic identity
      userName:        basic.name,
      userEmail:       basic.email,
      userCollege:     basic.college,
      userDegree:      basic.degree,
      userBranch:      basic.branch,
      currentSemester: basic.currentSemester,

      // Academic
      currentCGPA:    academic.currentCGPA,
      targetCGPA:     academic.targetCGPA,
      academicHealth: academic.academicHealth,

      // Career
      selectedCareerGoal:   career.selectedCareerGoal,
      careerOnboardingDone: career.onboardingCompleted,
      experienceLevel:      career.experienceLevel,

      // Skills
      verifiedSkillsCount: skills.totalVerified ?? 0,
      skillGap:            skills.skillGapSummary,

      // Courses
      activeCourseCount:    (courses.activeCourses?.length)    ?? 0,
      completedCourseCount: (courses.completedCourses?.length) ?? 0,

      // Jobs
      appliedJobsCount: jobs.appliedCount ?? 0,
      savedJobsCount:   jobs.savedCount   ?? 0,

      // Productivity
      currentStreak:   productivity.currentStreak  ?? 0,
      studyHoursToday: productivity.studyHoursToday ?? 0,

      // Profile completeness
      profileCompletePct: basic.profileCompletePct ?? 0,
    }
  }, [profile])

  // ── CONTEXT VALUE ──────────────────────────────────────────

  const value = {
    // Raw profile
    profile,

    // State
    isLoading,
    isRefreshing,
    error,

    // Integration report — { sectionName: { status, source, lastUpdated, version } }
    integrationReport,

    // Staleness utilities
    checkSectionStale,
    getSectionAgeMs,

    // Actions
    updateProfile,   // full profile deep merge
    updateSection,   // single section write (primary module API)
    refresh,         // force backend re-fetch
    reset,           // clear on logout

    // Convenience selectors
    ...selectors,

    // Section envelope accessors (includes metadata + data)
    basicProfile:        profile.basicProfile,
    academicSummary:     profile.academicSummary,
    careerProfile:       profile.careerProfile,
    skillsSummary:       profile.skillsSummary,
    coursesSummary:      profile.coursesSummary,
    jobsSummary:         profile.jobsSummary,
    productivitySummary: profile.productivitySummary,
    aiSummary:           profile.aiSummary,

    // Section .data shortcuts (most modules only need .data)
    basicProfileData:        profile.basicProfile?.data,
    academicSummaryData:     profile.academicSummary?.data,
    careerProfileData:       profile.careerProfile?.data,
    skillsSummaryData:       profile.skillsSummary?.data,
    coursesSummaryData:      profile.coursesSummary?.data,
    jobsSummaryData:         profile.jobsSummary?.data,
    productivitySummaryData: profile.productivitySummary?.data,
    aiSummaryData:           profile.aiSummary?.data,
  }

  return (
    <StudentProfileContext.Provider value={value}>
      {children}
    </StudentProfileContext.Provider>
  )
}

// ─────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────

/**
 * useStudentProfile()
 * -------------------
 * Primary hook for any component that needs student data.
 *
 * @returns {StudentProfileContextValue}
 *
 * @example — Reading data:
 *   const { currentCGPA, selectedCareerGoal, currentStreak } = useStudentProfile()
 *
 * @example — Module writing its section:
 *   const { updateSection } = useStudentProfile()
 *   await updateSection('academicSummary', { currentCGPA: 8.7 }, 'Academics')
 *
 * @example — AI Tutor checking staleness:
 *   const { checkSectionStale, getSectionAgeMs } = useStudentProfile()
 *   const skillsStale = await checkSectionStale('skillsSummary', 3 * 86400000) // 3 days
 *   const ageMs       = await getSectionAgeMs('jobsSummary')
 *   // "Your Jobs data hasn't been refreshed in X days."
 *
 * @example — Dashboard reading integration report:
 *   const { integrationReport } = useStudentProfile()
 *   // { academicSummary: { status:'live', source:'Academics', lastUpdated:'...', version:3 } }
 */
export function useStudentProfile() {
  const ctx = useContext(StudentProfileContext)
  if (!ctx) {
    throw new Error(
      'useStudentProfile() must be called inside <StudentProfileProvider>. ' +
      'Ensure it wraps your application in App.jsx.'
    )
  }
  return ctx
}

export default StudentProfileContext
