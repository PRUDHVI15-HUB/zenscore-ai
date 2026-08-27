/**
 * Career-Aware Job Filter Resolver Service
 * =========================================
 * Resolves intelligent job search filters based on StudentProfileContext and CareerContext.
 *
 * Priority Order:
 * Role:
 *   1. careerProfile.selectedCareerGoal
 *   2. jobsSummary.bestMatchedRole
 *   3. careerContext.currentCareer / targetCareer
 *
 * Location:
 *   1. jobsSummary.preferredLocation
 *   2. user basicProfile location
 *
 * Work Mode:
 *   1. jobsSummary.preferredWorkMode
 *
 * Salary Range:
 *   1. jobsSummary.preferredSalaryRange
 *   2. careerProfile.expectedSalary
 *
 * Skills:
 *   1. Top verified skills from skillsSummary
 */

export function resolveCareerAwareJobFilters(studentProfile = {}, careerContext = {}) {
  try {
    const profile = studentProfile?.data || studentProfile || {}
    const careerProfile = profile?.careerProfile?.data || profile?.careerProfile || {}
    const jobsSummary = profile?.jobsSummary?.data || profile?.jobsSummary || {}
    const skillsSummary = profile?.skillsSummary?.data || profile?.skillsSummary || {}

    // 1. Role Resolution
    const role =
      careerProfile?.selectedCareerGoal ||
      jobsSummary?.bestMatchedRole ||
      careerContext?.currentCareer ||
      ''

    // 2. Location Resolution
    const location =
      jobsSummary?.preferredLocation ||
      profile?.basicProfile?.location ||
      ''

    // 3. Work Mode Resolution
    const workMode =
      jobsSummary?.preferredWorkMode ||
      ''

    // 4. Salary Range Resolution
    const salaryRange =
      jobsSummary?.preferredSalaryRange ||
      careerProfile?.expectedSalary ||
      ''

    // 5. Skills (Top verified skills)
    const skills =
      skillsSummary?.verifiedSkillsList ||
      (skillsSummary?.currentSkill ? [skillsSummary.currentSkill] : [])

    const filterObj = {
      source: 'career-explore'
    }

    if (role && role.trim()) filterObj.role = role.trim()
    if (location && location.trim()) filterObj.location = location.trim()
    if (workMode && workMode.trim()) filterObj.workMode = workMode.trim()
    if (salaryRange && salaryRange.trim()) filterObj.salaryRange = salaryRange.trim()
    if (Array.isArray(skills) && skills.length > 0) filterObj.skills = skills.slice(0, 3)

    return filterObj
  } catch (err) {
    console.info('[CareerAwareJobResolver] Exception during resolution:', err?.message || err)
    return { source: 'career-explore' }
  }
}

/**
 * Builds a URL search string with resolved career-aware parameters.
 *
 * @param {Object} filters - Resolved filter object
 * @returns {string} - URL search string e.g. "/jobs/listings?search=AI%20Engineer&location=Bangalore&workMode=Hybrid"
 */
export function buildCareerAwareJobUrl(filters = {}) {
  const params = new URLSearchParams()

  if (filters.role) {
    params.set('search', filters.role)
    params.set('role', filters.role)
  }
  if (filters.location && filters.location !== 'All') {
    params.set('location', filters.location)
  }
  if (filters.workMode && filters.workMode !== 'All') {
    params.set('workMode', filters.workMode)
  }
  if (filters.salaryRange) {
    params.set('salary', filters.salaryRange)
  }

  const queryString = params.toString()
  return `/jobs/listings${queryString ? `?${queryString}` : ''}`
}
