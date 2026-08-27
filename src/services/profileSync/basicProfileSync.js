/**
 * Basic Profile → Student Profile Synchronizer
 * =============================================
 * Transforms Firebase Auth user and backend user profile into the
 * basicProfile section of the Unified Student Profile.
 *
 * Design Principles:
 *   - FIRE AND FORGET: Never blocks authentication or user loading
 *   - SILENT ERRORS:   Auth flow must always keep working
 *   - MERGE STRATEGY:  updateSection() deep-merges, never overwrites
 *   - SINGLE WRITE:    Only writes to 'basicProfile' — nothing else
 *   - NO READS:        Auth does not read from Student Profile
 *
 * Trigger events:
 *   ✓ User login
 *   ✓ Session restored
 *   ✓ Profile updated
 */

import { updateProfileSection } from '../studentProfileService'
import { PROFILE_SOURCES } from '../../models/StudentProfile'

/**
 * extractBasicProfile()
 * ---------------------
 * Normalizes authUser (Firebase user) and backendUser (API response user)
 * into the canonical basicProfile schema.
 *
 * @param {Object} authUser - Firebase User object
 * @param {Object} backendUser - Backend API User object
 * @returns {Object} Normalized basicProfile payload
 */
export function extractBasicProfile(authUser = {}, backendUser = {}) {
  const firebaseUser = authUser || {}
  const dbUser = backendUser || {}

  // Name extraction
  const fullName = dbUser.name || firebaseUser.displayName || dbUser.fullName || 'Student'
  const nameParts = fullName.split(' ')
  const firstName = dbUser.firstName || nameParts[0] || 'Student'
  const lastName = dbUser.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '')

  // Identity
  const uid = firebaseUser.uid || dbUser._id || dbUser.id || dbUser.uid || null
  const email = firebaseUser.email || dbUser.email || null
  const phoneNumber = firebaseUser.phoneNumber || dbUser.phoneNumber || dbUser.phone || null
  const profilePhoto = firebaseUser.photoURL || dbUser.avatar || dbUser.profilePhoto || null

  // Academic Identity
  const college = dbUser.college || dbUser.institution || 'ZenScore Academy'
  const university = dbUser.university || college
  const degree = dbUser.degree || 'B.Tech'
  const branch = dbUser.branch || dbUser.department || 'Computer Science & Engineering'
  const specialization = dbUser.specialization || dbUser.major || 'Software Engineering'
  const currentYear = dbUser.currentYear || dbUser.year || 3
  const currentSemester = dbUser.currentSemester || dbUser.semester || 5
  const graduationYear = dbUser.graduationYear || (new Date().getFullYear() + 2)
  const section = dbUser.section || 'A'

  // Student Information
  const studentId = dbUser.studentId || dbUser.rollNumber || uid || null
  const rollNumber = dbUser.rollNumber || dbUser.studentId || null
  const admissionYear = dbUser.admissionYear || (new Date().getFullYear() - 2)

  // Location
  const city = dbUser.city || dbUser.location?.city || 'Bangalore'
  const state = dbUser.state || dbUser.location?.state || 'Karnataka'
  const country = dbUser.country || dbUser.location?.country || 'India'

  // Preferences
  const preferredLanguage = dbUser.preferredLanguage || dbUser.preferences?.language || 'English'
  const preferredTheme = dbUser.preferredTheme || dbUser.preferences?.theme || 'system'
  const timezone = dbUser.timezone || (typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'Asia/Kolkata') || 'Asia/Kolkata'

  // Account Metadata
  const accountCreatedAt = firebaseUser.metadata?.creationTime || dbUser.createdAt || new Date().toISOString()
  const lastLogin = firebaseUser.metadata?.lastSignInTime || dbUser.lastLogin || new Date().toISOString()
  const emailVerified = firebaseUser.emailVerified ?? dbUser.emailVerified ?? true
  const profileCompletion = dbUser.profileCompletion ?? dbUser.profileCompletionPct ?? 85
  const profileVerified = dbUser.profileVerified ?? true

  // Profile Status
  const onboardingCompleted = dbUser.onboardingCompleted ?? true
  const profileStatus = dbUser.profileStatus ?? 'Active'

  return {
    // Identity
    uid,
    name: fullName,
    fullName,
    firstName,
    lastName,
    email,
    phoneNumber,
    profilePhoto,

    // Academic Identity
    college,
    university,
    degree,
    branch,
    specialization,
    currentYear,
    currentSemester,
    graduationYear,
    section,

    // Student Information
    studentId,
    rollNumber,
    admissionYear,

    // Location
    city,
    state,
    country,

    // Preferences
    preferredLanguage,
    preferredTheme,
    timezone,

    // Account Metadata
    accountCreatedAt,
    lastLogin,
    emailVerified,
    profileCompletion,
    profileVerified,

    // Profile Status
    onboardingCompleted,
    profileStatus,
  }
}

/**
 * syncBasicProfileToProfile()
 * ---------------------------
 * Fire-and-forget synchronization for basicProfile.
 *
 * @param {Object} authUser - Firebase user object
 * @param {Object} backendUser - Backend user object
 */
export function syncBasicProfileToProfile(authUser, backendUser) {
  if (!authUser && !backendUser) return

  try {
    const payload = extractBasicProfile(authUser, backendUser)
    const sourceTag = PROFILE_SOURCES?.AUTH || 'Auth'
    updateProfileSection('basicProfile', payload, sourceTag)
      .then(() => {
        console.info('[BasicProfileSync] Synchronized basicProfile to Student Profile (status: live)')
      })
      .catch((err) => {
        console.info('[BasicProfileSync] Silent background sync notice:', err?.message || err)
      })
  } catch (err) {
    console.info('[BasicProfileSync] Non-blocking sync exception caught:', err?.message || err)
  }
}
