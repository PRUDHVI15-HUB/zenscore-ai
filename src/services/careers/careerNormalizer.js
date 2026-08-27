/**
 * Centralized Career Normalizer Service
 * =====================================
 * Establishes the Single Source of Truth precedence for career goals and
 * normalizes user/onboarding career titles to canonical role keys.
 *
 * Precedence Order:
 * 1. StudentProfile.careerProfile.selectedCareerGoal
 * 2. CareerContext.currentCareer
 * 3. LocalStorage persistence ('zenscore_selected_career')
 * 4. Fallback default ('Backend Engineer')
 */

/**
 * Normalizes any career title string or onboarding selection to canonical role key.
 *
 * @param {string} rawTitle - Raw career title input
 * @returns {string} Canonical career title (e.g. 'Frontend Engineer', 'AI Engineer')
 */
export function normalizeCareerTitle(rawTitle = '') {
  if (!rawTitle || typeof rawTitle !== 'string') return ''

  const trimmed = rawTitle.trim()
  const lower = trimmed.toLowerCase()

  if (/front\s*end|ui\/ux|web\s*dev.*front/i.test(lower)) {
    return 'Frontend Engineer'
  }
  if (/back\s*end|server|api\s*dev/i.test(lower)) {
    return 'Backend Engineer'
  }
  if (/full\s*stack|fullstack/i.test(lower)) {
    return 'Full Stack Developer'
  }
  if (/machine\s*learning|ml\s*engineer|deep\s*learning|tensorflow|pytorch/i.test(lower)) {
    return 'Machine Learning Engineer'
  }
  if (/ai|llm|genai|generative\s*ai|artificial/i.test(lower)) {
    return 'AI Engineer'
  }
  if (/devops|sre|site\s*reliability|ci\/?cd/i.test(lower)) {
    return 'DevOps Engineer'
  }
  if (/data\s*sci|analytics|data\s*analyst/i.test(lower)) {
    return 'Data Scientist'
  }
  if (/cloud|aws|azure|gcp/i.test(lower)) {
    return 'Cloud Engineer'
  }
  if (/cyber|security|infosec|ethical/i.test(lower)) {
    return 'Cybersecurity Engineer'
  }
  if (/product\s*manag|pm/i.test(lower)) {
    return 'Product Manager'
  }

  return trimmed
}

/**
 * Resolves the canonical target career title using the single source of truth precedence.
 *
 * @param {Object} studentProfile - Profile from StudentProfileContext
 * @param {Object} careerState - State from CareerContext
 * @param {string} overrideRole - Explicit selected role prop
 * @returns {string} Normalized canonical target career title
 */
export function resolveCanonicalCareerGoal(studentProfile = {}, careerState = {}, overrideRole = '') {
  try {
    const profile = studentProfile?.data || studentProfile || {}
    const careerProfile = profile?.careerProfile?.data || profile?.careerProfile || profile

    const rawGoal =
      overrideRole ||
      careerState?.currentCareer ||
      careerProfile?.careerGoal?.targetCareer ||
      profile?.careerGoal?.targetCareer ||
      careerProfile?.selectedCareerGoal ||
      (() => {
        try {
          return localStorage.getItem('zenscore_selected_career') || ''
        } catch {
          return ''
        }
      })()

    return rawGoal ? normalizeCareerTitle(rawGoal) : ''
  } catch (err) {
    console.info('[CareerNormalizer] Resolution fallback notice:', err?.message || err)
    return ''
  }
}
