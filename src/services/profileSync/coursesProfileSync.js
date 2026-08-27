/**
 * Courses → Student Profile Synchronizer
 * ========================================
 * Transforms data from the Courses module (useCoursesData hook) into the
 * coursesSummary section of the Unified Student Profile.
 *
 * Design Principles:
 *   - FIRE AND FORGET: Never blocks the Courses UI or useCoursesData hook
 *   - SILENT ERRORS:   Courses must always keep working
 *   - MERGE STRATEGY:  updateSection() deep-merges, never overwrites
 *   - SINGLE WRITE:    Only writes to 'coursesSummary' — nothing else
 *   - NO READS:        Courses does not read from Student Profile
 *
 * Called from useCoursesData.js inside fetchAllData() after all
 * Promise.allSettled() results are processed.
 *
 * Trigger events (all covered because they all call fetchAllData()):
 *   ✓ Initial page load / tab change
 *   ✓ Course enrolled
 *   ✓ Lesson completed
 *   ✓ Module completed
 *   ✓ Course finished
 *   ✓ Recommendation refresh
 *   ✓ Certificate generated
 *   ✓ refetch() called
 * Note: handleBookmarkToggle uses optimistic local update — sync happens on
 * next full fetchAllData() which covers all real state changes.
 */

import { updateProfileSection } from '../studentProfileService'
import { PROFILE_SOURCES } from '../../models/StudentProfile'
import { registerAutomation, AUTOMATION_EVENTS } from '../automationEngine'

// ─────────────────────────────────────────────────────────────
// DATA EXTRACTOR
// Maps resolved useCoursesData state → coursesSummary payload
// ─────────────────────────────────────────────────────────────

/**
 * extractCoursesSummary()
 * -----------------------
 * Builds the coursesSummary payload from the settled API results
 * of the Courses module. All inputs are optional — defaults to zero/null.
 *
 * @param {Object} params
 * @param {Array}       params.courses          - From getCourses()
 * @param {Object|null} params.stats            - From getCourseStats()
 * @param {Array}       params.recommended      - From getRecommendedCourses()
 * @param {Array}       params.continueLearning - From getContinueLearning()
 * @param {Object|null} params.roadmap          - From getRoadmap()
 * @param {Array}       params.certificatesList - From getCertificates()
 * @param {Object|null} params.analytics        - From getLearningAnalytics()
 * @returns {Object|null} - null if no meaningful data to sync
 */
export function extractCoursesSummary({
  courses          = [],
  stats            = null,
  recommended      = [],
  continueLearning = [],
  roadmap          = null,
  certificatesList = [],
  analytics        = null,
}) {
  // Don't sync if truly empty (brand-new user, nothing loaded)
  const hasAnyData = stats || continueLearning.length > 0 || certificatesList.length > 0
  if (!hasAnyData) return null

  const safeContinue = Array.isArray(continueLearning) ? continueLearning : []
  const safeCourses  = Array.isArray(courses)          ? courses          : []
  const safeCerts    = Array.isArray(certificatesList) ? certificatesList : []
  const safeRecs     = Array.isArray(recommended)      ? recommended      : []

  // ── ENROLLMENT COUNTS ─────────────────────────────────────
  const enrolledCourses   = safeContinue.length || stats?.startedCount || 0
  const completedCourses  = stats?.completedCount || 0
  const activeCourses     = safeContinue.filter(c => !c.isCompleted).length || enrolledCourses
  const totalCourses      = safeCourses.length || stats?.totalCourses || 0
  const bookmarkedCourses = safeCourses.filter(c => c.isBookmarked).length || 0

  // ── LEARNING PROGRESS ─────────────────────────────────────
  const completedLessons = stats?.completedLessons || analytics?.completedLessons || 0
  const totalLessons     = stats?.totalLessons     || analytics?.totalLessons     || 0
  const overallProgress  = analytics?.completionRate || stats?.overallProgress    || 0
  const averageCourseCompletion = safeContinue.length > 0
    ? Math.round(
        safeContinue.reduce((sum, c) => sum + (c.completionPercentage || c.completedPercent || 0), 0)
        / safeContinue.length
      )
    : 0

  // ── LEARNING HOURS ────────────────────────────────────────
  const weeklyLearningHours  = analytics?.weeklyHours  || stats?.weeklyHours  || 0
  const monthlyLearningHours = analytics?.monthlyHours || stats?.monthlyHours || 0
  const learningHours        = weeklyLearningHours     // backward-compat alias

  // ── CURRENT COURSE ────────────────────────────────────────
  // Most recently studied active course
  const mostRecentCourse = safeContinue
    .filter(c => !c.isCompleted)
    .sort((a, b) => new Date(b.lastStudiedAt || 0) - new Date(a.lastStudiedAt || 0))[0] || null

  const currentCourse  = mostRecentCourse?.course?.title || mostRecentCourse?.name || null
  const currentModule  = mostRecentCourse
    ? `Module ${(mostRecentCourse.lastOpenedModuleIndex ?? 0) + 1}`
    : null
  const currentLesson  = mostRecentCourse?.lastLesson?.title || null

  // ── CERTIFICATES ──────────────────────────────────────────
  const certificatesEarned  = safeCerts.length
  const certificatesPending = safeContinue.filter(c => c.completionPercentage >= 100 && !c.certificateIssued).length

  // ── RECOMMENDATIONS ───────────────────────────────────────
  const topRec              = safeRecs[0] || null
  const recommendedCourse   = topRec?.title || topRec?.name || null
  const recommendedCategory = topRec?.category || null
  const nextLearningGoal    = analytics?.nextGoal || roadmap?.nextMilestone || null

  // ── ACTIVITY ──────────────────────────────────────────────
  const lastCourseActivity = mostRecentCourse?.lastStudiedAt
    || safeContinue[0]?.lastStudiedAt
    || new Date().toISOString()

  const lastCompletedLesson = safeContinue
    .flatMap(c => c.completedLessons || [])
    .sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0))[0]?.title || null

  // Compact history snapshot (last 5 active courses)
  const recentCourseHistory = safeContinue
    .slice(0, 5)
    .map(c => ({
      courseId:   c.course?._id || c._id,
      title:      c.course?.title || c.name || 'Course',
      progress:   c.completionPercentage || c.completedPercent || 0,
      lastStudied: c.lastStudiedAt || null,
      completed:   c.isCompleted || false,
    }))

  // ── ROADMAP LINKAGE ───────────────────────────────────────
  const linkedCareerRoadmap = roadmap?.careerGoal || roadmap?.title || null
  const roadmapCoverage     = roadmap?.coveragePct || roadmap?.progress || 0

  // ── BUILD PAYLOAD ─────────────────────────────────────────
  return {
    // Enrollment
    totalCourses,
    enrolledCourses,
    activeCourses,
    completedCourses,
    bookmarkedCourses,

    // Learning progress
    completedLessons,
    totalLessons,
    overallProgress,
    averageCourseCompletion,
    learningHours,

    // Current
    currentCourse,
    currentModule,
    currentLesson,

    // Certificates
    certificatesEarned,
    certificatesPending,

    // Recommendations
    recommendedCourse,
    recommendedCategory,
    nextLearningGoal,

    // Activity
    lastCourseActivity,
    lastCompletedLesson,
    recentCourseHistory,

    // Roadmap
    linkedCareerRoadmap,
    roadmapCoverage,

    // Analytics
    weeklyLearningHours,
    monthlyLearningHours,
  }
}

// ─────────────────────────────────────────────────────────────
// SYNC FUNCTION — called from useCoursesData.js
// ─────────────────────────────────────────────────────────────

/**
 * syncCoursesToProfile()
 * ----------------------
 * Fire-and-forget sync to Student Profile.
 * Extracts the courses summary and writes it to 'coursesSummary'.
 *
 * Guarantees:
 *   ✓ Never throws — wraps everything in try/catch
 *   ✓ Never blocks — returns immediately (no await in caller)
 *   ✓ Never writes if no meaningful data exists
 *   ✓ Only writes to 'coursesSummary' section
 *   ✓ Silent on failure
 *
 * Usage in useCoursesData.js:
 *   syncCoursesToProfile({ stats, continueLearning, certificatesList, ... })
 *   // No await, no .then(), no error handling needed in caller
 *
 * @param {Object} params - All resolved courses state (see extractCoursesSummary)
 * @returns {void}  (async, fire-and-forget)
 */
export function syncCoursesToProfile(params) {
  const payload = extractCoursesSummary(params)
  if (!payload) return  // Nothing meaningful to sync yet

  // Async write — fire and forget
  updateProfileSection('coursesSummary', payload, PROFILE_SOURCES.COURSES)
    .then(() => {
      registerAutomation(AUTOMATION_EVENTS.COURSE_COMPLETED, payload)
    })
    .catch(err => {
      // Silent — Courses must never be interrupted by profile sync failures
      console.info(
        '[CoursesSync] Student Profile update failed (non-blocking):',
        err?.message ?? err
      )
    })
}
