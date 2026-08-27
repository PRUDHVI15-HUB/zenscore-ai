/**
 * Onboarding State Management Utility
 * Robustly tracks onboarding completion per user across Firebase UID, Email,
 * Backend database profile, and account registration metadata.
 */

const STORAGE_KEY_PREFIX = 'zenscore_onboarding_completed'

export function isOnboardingCompleted(user = null, backendUser = null) {
  try {
    if (!user) return false

    const uid = typeof user === 'string' ? user : (user?.uid || user?.id)
    const email = typeof user === 'object' ? user?.email : null

    // 1. Only check user-specific localStorage flags (uid or email scoped)
    if (uid && localStorage.getItem(`${STORAGE_KEY_PREFIX}_${uid}`) === 'true') return true
    if (email && localStorage.getItem(`${STORAGE_KEY_PREFIX}_${email.toLowerCase()}`) === 'true') return true
    // NOTE: Do NOT check the generic `zenscore_onboarding_completed` key — it gets set for all users

    // 2. Check Backend Profile — only trust explicit server-side markers
    if (backendUser) {
      if (backendUser.isOnboarded === true || backendUser.onboardingCompleted === true) {
        if (uid) setOnboardingCompleted(uid, true)
        return true
      }
      // Must have an actual career goal / academic profile saved by the user
      if (backendUser.careerProfile?.selectedCareerGoal || backendUser.targetRole) {
        if (uid) setOnboardingCompleted(uid, true)
        return true
      }
      if (backendUser.college && backendUser.branch) {
        if (uid) setOnboardingCompleted(uid, true)
        return true
      }
    }

    // NOTE: Do NOT check generic student profile keys or Firebase metadata timestamps —
    // they trigger for ALL new users and bypass onboarding incorrectly.

    return false
  } catch {
    return false
  }
}

export function setOnboardingCompleted(userId = null, completed = true) {
  try {
    if (!userId) return  // Always require a user ID — never write a global flag
    const id = typeof userId === 'object' ? (userId.uid || userId.email) : userId
    if (id) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_${id}`, completed ? 'true' : 'false')
    }
  } catch (e) {
    console.warn('Failed to save onboarding state to localStorage:', e)
  }
}

export function resetOnboarding(userId = null) {
  try {
    if (userId) {
      const id = typeof userId === 'object' ? (userId.uid || userId.email) : userId
      if (id) {
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}_${id}`)
      }
    }
    localStorage.removeItem(STORAGE_KEY_PREFIX)
  } catch (e) {
    console.warn('Failed to reset onboarding state:', e)
  }
}
