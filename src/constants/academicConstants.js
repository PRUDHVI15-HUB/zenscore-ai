/**
 * academicConstants.js
 * Central constants for the Academics module across ZenScore AI.
 */

export const DEFAULT_TOTAL_DEGREE_CREDITS = 160
export const WEAK_SUBJECT_GRADE_THRESHOLD = 6.5
export const WEAK_SUBJECT_ATTENDANCE_THRESHOLD = 75
export const EXCELLENT_GRADE_THRESHOLD = 8.5
export const EXCELLENT_ATTENDANCE_THRESHOLD = 85

/**
 * CONFIDENCE_THRESHOLDS
 * Defines prediction confidence tiers based on the number of data-rich semesters of history:
 * - High confidence: >= 4 data-rich semesters
 * - Medium confidence: 2 to 3 data-rich semesters
 * - Low confidence: < 2 data-rich semesters (0 or 1 semester)
 */
export const CONFIDENCE_THRESHOLDS = {
  high: 4,
  medium: 2,
  low: 1,
  details: {
    low: { minSemesters: 0, maxSemesters: 1, label: 'Low' },
    medium: { minSemesters: 2, maxSemesters: 3, label: 'Medium' },
    high: { minSemesters: 4, label: 'High' }
  }
}
