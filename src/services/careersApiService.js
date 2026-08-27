import { apiFetch } from './api'

/**
 * CareersApiService (Stage 4: Frontend Live Data Connection)
 * Wraps backend Careers endpoints with robust fallback defaults and error resilience.
 * IMPORTANT: No career goal is ever assumed/hardcoded. Fallbacks use empty string for targetCareer.
 */

// 0. Check onboarding status (GET /api/careers/profile)
export async function fetchCareerProfileStatus() {
  try {
    const res = await apiFetch('/careers/profile')
    if (res?.success && res?.data) {
      return {
        onboardingCompleted: res.data.onboardingCompleted === true,
        profile: res.data
      }
    }
  } catch (err) {
    if (err?.status !== 401) {
      console.warn('[CareersApiService] Profile status fetch notice:', err?.message || err)
    }
  }
  // If we can't reach the server, default to not completed (safe — shows onboarding)
  return { onboardingCompleted: false, profile: null }
}

// 0b. Complete onboarding (POST /api/careers/profile/complete)
export async function completeCareerOnboarding(payload) {
  try {
    const res = await apiFetch('/careers/profile/complete', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    if (res?.success && res?.data) return res.data
  } catch (err) {
    console.warn('[CareersApiService] Onboarding complete backend notice:', err?.message || err)
  }
  return {
    onboardingCompleted: true,
    careerGoal: payload?.careerGoal || { targetCareer: payload?.targetCareer || '' }
  }
}

// 1. Fetch Dashboard API (GET /api/careers/dashboard)
export async function fetchCareersDashboard() {
  try {
    const res = await apiFetch('/careers/dashboard')
    if (res?.success && res?.data) return res.data
  } catch (err) {
    console.warn('[CareersApiService] Dashboard live fetch notice:', err?.message || err)
  }
  return {
    careerGoal: { targetCareer: '', category: 'Engineering', status: 'Learning', expectedSalary: '' },
    careerStatus: 'Learning',
    careerReadiness: { overallReadinessPct: 0, learningScore: 0, resumeScore: 0, interviewScore: 0 },
    learningProgress: { learningProgressPct: 0, currentStage: 'Stage 2: Core Skill Building' },
    resumeStatus: 'Not Uploaded',
    atsScore: 0,
    jobsApplied: 0,
    recommendedJobsCount: 0,
    interviewReadiness: 0,
    latestAIInsight: 'Complete your profile to receive personalized career insights.',
    latestActivity: new Date().toISOString()
  }
}

// 2. Fetch Learning Hub API (GET /api/careers/learning)
export async function fetchLearningHub() {
  try {
    const res = await apiFetch('/careers/learning')
    if (res?.success && res?.data) return res.data
  } catch (err) {
    console.warn('[CareersApiService] Learning Hub live fetch notice:', err?.message || err)
  }
  return {
    targetCareer: '',
    requiredSkills: [],
    completedSkills: [],
    remainingSkills: [],
    learningProgress: 0,
    currentRoadmap: '',
    currentStage: 'Stage 2: Core Skill Building',
    nextRecommendedSkill: '',
    learningResources: [],
    estimatedCompletion: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
  }
}

// 3. Fetch Resume Center API (GET /api/careers/resume)
export async function fetchResumeCenter() {
  try {
    const res = await apiFetch('/careers/resume')
    if (res?.success && res?.data) return res.data
  } catch (err) {
    console.warn('[CareersApiService] Resume Center live fetch notice:', err?.message || err)
  }
  return {
    resumeUploaded: false,
    resumeName: '',
    atsScore: 0,
    resumeVersion: '',
    uploadDate: null,
    resumeReadiness: 0,
    resumeSuggestions: [
      'Upload a PDF or DOCX resume to analyze your ATS score and keyword matching.',
      'Align project descriptions with quantifiable technical achievements.'
    ],
    resumeHistory: []
  }
}

// 4. Fetch Career Opportunities API (GET /api/careers/opportunities)
export async function fetchOpportunities() {
  try {
    const res = await apiFetch('/careers/opportunities')
    if (res?.success && res?.data) return res.data
  } catch (err) {
    console.warn('[CareersApiService] Opportunities live fetch notice:', err?.message || err)
  }
  return {
    careerGoal: { targetCareer: '', expectedSalary: '' },
    resume: { atsScore: 0, resumeStatus: 'Not Uploaded' },
    jobMatching: { matchScore: 0, targetRole: '', matchingSkillsCount: 0 },
    recommendedJobs: [],
    savedJobsCount: 0,
    appliedJobsCount: 0,
    latestApplications: [],
    careerMatchInsights: 'Complete onboarding to receive personalized job matches.'
  }
}

// 5. Fetch Interview Center API (GET /api/careers/interview)
export async function fetchInterviewCenter() {
  try {
    const res = await apiFetch('/careers/interview')
    if (res?.success && res?.data) return res.data
  } catch (err) {
    console.warn('[CareersApiService] Interview Center live fetch notice:', err?.message || err)
  }
  return {
    interviewReadiness: 0,
    mockInterviews: 0,
    averageScore: 0,
    technicalScore: 0,
    hrScore: 0,
    communicationScore: 0,
    interviewHistory: [],
    latestFeedback: 'Start an AI-evaluated mock interview to test your technical knowledge.',
    nextRecommendation: 'Select a category (Technical, HR, Aptitude, or Company) above to begin.'
  }
}

// 6. Fetch Copilot Context API (GET /api/careers/copilot/context)
export async function fetchCopilotContext() {
  try {
    const res = await apiFetch('/careers/copilot/context')
    if (res?.success && res?.data) return res.data
  } catch (err) {
    console.warn('[CareersApiService] Copilot Context live fetch notice:', err?.message || err)
  }
  return {
    targetRole: '',
    careerStatus: 'Onboarding',
    overallReadinessPct: 0,
    currentCGPA: 0,
    completedSkills: [],
    atsScore: 0,
    interviewAverageScore: 0,
    appliedJobsCount: 0,
    topRecommendations: ['Complete your career profile to get personalized recommendations.']
  }
}

// 7. Sync Module (POST /api/careers/sync/:module)
export async function syncCareerModule(moduleName, payload = {}) {
  try {
    const res = await apiFetch(`/careers/sync/${moduleName}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    if (res?.success && res?.data) return res.data
  } catch (err) {
    console.warn(`[CareersApiService] Sync ${moduleName} notice:`, err?.message || err)
  }
  return null
}
