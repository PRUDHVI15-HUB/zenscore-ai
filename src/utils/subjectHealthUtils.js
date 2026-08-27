/**
 * subjectHealthUtils.js
 * Centralized utility for computing and evaluating subject health status on the frontend.
 */
import {
  WEAK_SUBJECT_GRADE_THRESHOLD,
  WEAK_SUBJECT_ATTENDANCE_THRESHOLD,
  EXCELLENT_GRADE_THRESHOLD,
  EXCELLENT_ATTENDANCE_THRESHOLD
} from '../constants/academicConstants'

/**
 * Checks whether a subject is considered healthy or requires academic attention.
 * @param {number|null} attendance - Attendance percentage (0-100)
 * @param {number|null} finalGrade - Grade points (0-10)
 * @returns {boolean} True if healthy, false if requires attention
 */
export const isSubjectHealthy = (attendance, finalGrade) => {
  const attValid = attendance === null || attendance === undefined || attendance >= WEAK_SUBJECT_ATTENDANCE_THRESHOLD
  const gradeValid = finalGrade === null || finalGrade === undefined || finalGrade >= WEAK_SUBJECT_GRADE_THRESHOLD
  return attValid && gradeValid
}

/**
 * Gets formatted health status label.
 * @param {number|null} attendance
 * @param {number|null} finalGrade
 * @returns {'Healthy' | 'Requires Attention'}
 */
export const getSubjectHealthStatus = (attendance, finalGrade) => {
  return isSubjectHealthy(attendance, finalGrade) ? 'Healthy' : 'Requires Attention'
}

/**
 * Returns detailed health level (Excellent, Healthy, Needs Work).
 * @param {number|null} attendance
 * @param {number|null} finalGrade
 * @returns {'Excellent' | 'Healthy' | 'Needs Work'}
 */
export const getDetailedSubjectHealth = (attendance, finalGrade) => {
  const att = attendance ?? 100
  const grade = finalGrade ?? 0
  if (grade >= EXCELLENT_GRADE_THRESHOLD && att >= EXCELLENT_ATTENDANCE_THRESHOLD) return 'Excellent'
  if (grade < WEAK_SUBJECT_GRADE_THRESHOLD || att < WEAK_SUBJECT_ATTENDANCE_THRESHOLD) return 'Needs Work'
  return 'Healthy'
}
