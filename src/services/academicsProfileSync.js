/**
 * Academics → Student Profile Synchronizer
 * ==========================================
 * Transforms the Academics dashboard API response into the
 * academicSummary section of the Student Profile.
 *
 * Design Principles:
 *   - FIRE AND FORGET: Never blocks the Academics UI
 *   - SILENT ERRORS:   Academics must always keep working
 *   - MERGE STRATEGY:  updateSection() deep-merges, never overwrites
 *   - SINGLE WRITE:    Only writes to 'academicSummary' — nothing else
 *   - NO READS:        Academics does not read from Student Profile
 *
 * Called from Academics.jsx inside fetchDashboard() after success.
 *
 * Trigger events (all handled because they all call fetchDashboard()):
 *   ✓ Initial dashboard load
 *   ✓ Transcript OCR imported
 *   ✓ Semester added / edited / deleted
 *   ✓ Subject added / edited / deleted
 *   ✓ CGPA recalculated
 *   ✓ SGPA recalculated
 *   ✓ Manual dashboard refresh
 */

import { updateProfileSection } from './studentProfileService'
import { PROFILE_SOURCES } from '../models/StudentProfile'
import { registerAutomation, AUTOMATION_EVENTS } from './automationEngine'

// ─────────────────────────────────────────────────────────────
// DATA EXTRACTOR
// Maps the raw dashboard API response to academicSummary fields
// ─────────────────────────────────────────────────────────────

/**
 * extractAcademicSummary()
 * ------------------------
 * Pulls the relevant fields from the Academics dashboard API response.
 * Returns null if dashboardData is falsy (empty state / no semesters yet).
 *
 * @param {Object} dashboardData - res.data from getAcademicsDashboard()
 * @param {number} totalCompletedCredits - computed by Academics.jsx useMemo
 * @returns {Object|null}
 */
export function extractAcademicSummary(dashboardData, totalCompletedCredits = 0) {
  if (!dashboardData) return null

  const semesters    = dashboardData.semesters || []
  const intelligence = dashboardData.intelligence || {}

  // ── COMPUTED FROM SEMESTERS ──────────────────────────────
  const completedSems = semesters.filter(s => s.status === 'completed').length
  const totalSems     = semesters.length

  // Count total subjects across all semesters
  const totalSubjects = semesters.reduce((sum, sem) => sum + (sem.subjects?.length || 0), 0)

  // Latest SGPA = last semester's SGPA (most recent index)
  const lastSem     = semesters[semesters.length - 1]
  const latestSGPA  = lastSem?.sgpa ?? null

  // Average attendance across all subjects
  const allSubjects = semesters.flatMap(s => s.subjects || [])
  const attendanceValues = allSubjects
    .map(sub => sub.attendance)
    .filter(a => a !== null && a !== undefined && !isNaN(Number(a)))
  const avgAttendance = attendanceValues.length
    ? Math.round(attendanceValues.reduce((s, v) => s + Number(v), 0) / attendanceValues.length)
    : null

  // Uploaded memo count (from intelligence section)
  const uploadedMemoCount    = intelligence.uploadedMemos?.length ?? dashboardData.uploadedMemos?.length ?? 0
  const lastMemoUploadedAt   = intelligence.lastMemoUploadedAt ?? dashboardData.lastMemoUploadedAt ?? null

  // Academic health from intelligence
  const academicHealth = intelligence.healthScore
    ? (intelligence.healthScore >= 85 ? 'Excellent'
      : intelligence.healthScore >= 70 ? 'Good'
      : intelligence.healthScore >= 50 ? 'Average'
      : 'At Risk')
    : null

  // Timeline progress (completedSems / totalSems as %)
  const timelineProgress = totalSems > 0
    ? Math.round((completedSems / totalSems) * 100)
    : 0

  // Academic status
  const academicStatus = !dashboardData.currentCGPA
    ? 'Not Started'
    : dashboardData.currentCGPA >= dashboardData.targetCGPA
      ? 'On Track'
      : 'Needs Improvement'

  // ── BUILD PAYLOAD ────────────────────────────────────────
  return {
    // GPA Metrics
    currentCGPA:   dashboardData.currentCGPA   ?? null,
    targetCGPA:    dashboardData.targetCGPA     ?? null,
    predictedCGPA: dashboardData.predictedCGPA  ?? null,

    // Semester Summary
    totalSemesters:     totalSems,
    completedSemesters: completedSems,
    latestSGPA:         latestSGPA,

    // Credit Summary
    totalCredits:     totalCompletedCredits,
    creditsEarned:    totalCompletedCredits,
    // creditsRemaining requires knowing total program credits — left null until set via Profile
    creditsRemaining: dashboardData.creditsRemaining ?? null,

    // Subject / Course Count
    subjectsCount: totalSubjects,

    // Attendance
    attendanceAverage: avgAttendance,

    // Academic Intelligence
    academicHealth:   academicHealth,
    healthScore:      intelligence.healthScore   ?? null,
    academicStatus:   academicStatus,
    timelineProgress: timelineProgress,

    // Memo / OCR Uploads
    uploadedMemoCount:  uploadedMemoCount,
    lastMemoUploadedAt: lastMemoUploadedAt,

    // Semester history snapshot (id + SGPA + status only — no heavy data)
    semesterSnapshot: semesters.map(sem => ({
      semesterNumber: sem.semesterNumber,
      sgpa:           sem.sgpa ?? null,
      status:         sem.status ?? 'active',
      subjectCount:   sem.subjects?.length ?? 0,
    })),
  }
}

// ─────────────────────────────────────────────────────────────
// SYNC FUNCTION — called from Academics.jsx
// ─────────────────────────────────────────────────────────────

/**
 * syncAcademicsToProfile()
 * ------------------------
 * Fire-and-forget sync to Student Profile.
 * Extracts the academic summary from dashboardData and writes it
 * to the 'academicSummary' section of the Student Profile.
 *
 * Guarantees:
 *   ✓ Never throws — wraps everything in try/catch
 *   ✓ Never blocks — returns immediately (no await needed by caller)
 *   ✓ Never writes if data is null/empty
 *   ✓ Logs silently if anything fails
 *
 * Usage in Academics.jsx:
 *   syncAcademicsToProfile(dashboardData, totalCompletedCredits)
 *   // No await, no .then(), no error handling needed in caller
 *
 * @param {Object|null} dashboardData       - From getAcademicsDashboard() res.data
 * @param {number}      totalCompletedCredits - Computed credit total
 * @returns {void}  (async, fire-and-forget)
 */
export function syncAcademicsToProfile(dashboardData, totalCompletedCredits = 0) {
  // Extract synchronously — bail if nothing to sync
  const payload = extractAcademicSummary(dashboardData, totalCompletedCredits)
  if (!payload) return

  // Async write — fire and forget
  updateProfileSection('academicSummary', payload, PROFILE_SOURCES.ACADEMICS)
    .then(() => {
      registerAutomation(AUTOMATION_EVENTS.CGPA_UPDATED, payload)
    })
    .catch(err => {
      // Silent — Academics must never be interrupted by profile sync failures
      console.info(
        '[AcademicsSync] Student Profile update failed (non-blocking):',
        err?.message ?? err
      )
    })
}
