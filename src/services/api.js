import { syncJobsToProfile } from './profileSync/jobsProfileSync'
import { syncProductivityToProfile } from './profileSync/productivityProfileSync'

const localBase = 'http://localhost:5000/api'
const cloudBase = 'https://zenscore-backend.onrender.com/api'

const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
const defaultBase = isLocalhost ? localBase : cloudBase

const configuredBase = (import.meta.env.VITE_API_URL || defaultBase).replace(/\/+$/, '')
const PRIMARY_URL = configuredBase.endsWith('/api') ? configuredBase : `${configuredBase}/api`
const FALLBACK_URL = PRIMARY_URL.includes('localhost') ? cloudBase : localBase

const getToken = () => {
  try {
    const t = localStorage.getItem('zenscore_jwt')
    if (!t || t === 'null' || t === 'undefined' || t === 'mock_guest_token') return null
    return t
  } catch {
    return null
  }
}
const setToken = (token) => {
  if (token && token !== 'mock_guest_token') {
    localStorage.setItem('zenscore_jwt', token)
  }
}
const removeToken = () => localStorage.removeItem('zenscore_jwt')

export const apiFetch = async (endpoint, options = {}) => {
  const token = getToken()
  const timeoutLimit = options.timeoutMs || 15000

  // Normalize endpoint to prevent double '/api' prefixing and ensure leading slash
  const cleanEndpoint = endpoint.startsWith('/api/')
    ? endpoint.replace(/^\/api/, '')
    : (endpoint.startsWith('/') ? endpoint : `/${endpoint}`)

  // Guard private endpoints against unauthenticated network requests
  const isPrivateEndpoint = /^\/(student|careers|applications|ocr|academics|auth\/me|search|notifications)/i.test(cleanEndpoint)
  if (!token && isPrivateEndpoint && !options.allowUnauthenticated) {
    const error = new Error('Authentication required')
    error.status = 401
    error.isAuthError = true
    throw error
  }

  const makeRequest = async (baseUrl) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutLimit)

    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    }

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    try {
      const res = await fetch(`${baseUrl}${cleanEndpoint}`, {
        ...options,
        headers,
        signal: options.signal || controller.signal,
      })

      clearTimeout(timeoutId)


      let data = {}
      try {
        data = await res.json()
      } catch (parseErr) {
        data = { message: 'Failed to parse JSON response from server.' }
      }

      if (!res.ok) {
        const error = new Error(data.message || `HTTP Error ${res.status}`)
        error.status = res.status
        error.data = data
        throw error
      }

      return data
    } catch (err) {
      clearTimeout(timeoutId)
      throw err
    }
  }

  // 1. Attempt Primary URL (e.g. localhost)
  try {
    return await makeRequest(PRIMARY_URL)
  } catch (primaryErr) {
    const isNetworkError = primaryErr.message?.includes('Failed to fetch') || !window.navigator.onLine

    // 2. If localhost failed with connection refused, attempt fallback URL (e.g. Render cloud API)
    if (isNetworkError && PRIMARY_URL !== FALLBACK_URL && primaryErr.name !== 'AbortError') {
      try {
        return await makeRequest(FALLBACK_URL)
      } catch (fallbackErr) {
        throw fallbackErr
      }
    }

    throw primaryErr
  }
}

export const loginWithFirebaseToken = async (idToken) => {
  const data = await apiFetch('/auth/firebase-login', {
    method: 'POST',
    body: JSON.stringify({ idToken }),
  })
  if (data.token) setToken(data.token)
  return data
}

export const getMe = () => apiFetch('/auth/me')
export { getToken, setToken, removeToken }

// ── OCR PIPELINE ──
export const uploadTranscript = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return apiFetch('/ocr/upload', {
    method: 'POST',
    body: formData
  })
}
export const uploadMemo = uploadTranscript

export const getImportSession = (sessionId) => apiFetch(`/ocr/session/${sessionId}`)
export const confirmImportSession = (sessionId, payload = {}) => apiFetch(`/ocr/confirm/${sessionId}`, { method: 'POST', body: JSON.stringify(payload) })
export const deleteImportSession = (sessionId) => apiFetch(`/ocr/session/${sessionId}`, { method: 'DELETE' })

// ── ACADEMICS ──
export const getAcademicsDashboard = () => apiFetch('/academics/dashboard')
export const getAcademicsAnalytics = () => apiFetch('/academics/analytics')
export const createSemester = (payload) => apiFetch('/academics/semester', { method: 'POST', body: JSON.stringify(payload) })
export const updateSemester = (payload) => apiFetch('/academics/semester', { method: 'PUT', body: JSON.stringify(payload) })
export const deleteSemester = (semesterNumber) => apiFetch(`/academics/semester/${semesterNumber}`, { method: 'DELETE' })
export const createSubject = (payload) => apiFetch('/academics/subject', { method: 'POST', body: JSON.stringify(payload) })
export const updateSubject = (payload) => apiFetch('/academics/subject', { method: 'PUT', body: JSON.stringify(payload) })
export const deleteSubject = (semesterNumber, subjectId) => apiFetch(`/academics/subject/${semesterNumber}/${subjectId}`, { method: 'DELETE' })
export const updateCGPA = (payload) => apiFetch('/academics/cgpa', { method: 'POST', body: JSON.stringify(payload) })
export const predictAcademics = () => apiFetch('/academics/predict', { method: 'POST' })
export const getWeakSubjects = () => apiFetch('/academics/weak-subjects')
export const generateStudyPlan = () => apiFetch('/academics/study-plan', { method: 'POST' })
export const setTargetCGPA = (targetCGPA) => apiFetch('/academics/target-cgpa', { method: 'PUT', body: JSON.stringify({ targetCGPA }) })

// Phase 5 AI Assistant & Copilot API endpoints
export const getAIOverview = () => apiFetch('/academics/ai/overview')
export const aiChat = (payload) => apiFetch('/academics/ai/chat', { method: 'POST', body: JSON.stringify(payload) })
export const aiStudyPlan = (payload) => apiFetch('/academics/ai/study-plan', { method: 'POST', body: JSON.stringify(payload) })
export const aiCgpaPredict = (payload) => apiFetch('/academics/ai/cgpa-predict', { method: 'POST', body: JSON.stringify(payload) })
export const getAIRecommendations = () => apiFetch('/academics/ai/recommendations')
export const getAIAlerts = () => apiFetch('/academics/ai/alerts')
export const askCopilot = (question, conversationHistory = []) => apiFetch('/academics/copilot/chat', { method: 'POST', body: JSON.stringify({ question, conversationHistory }) })

// Legacy compatibility exports (aliases)
export const getAcademicDashboard = getAcademicsDashboard
export const addCGPA = updateCGPA
export const predictGPA = predictAcademics
export const getStudyPlan = generateStudyPlan

// ── CAREERS ──
export const getCareerPaths = () => apiFetch('/careers/paths')
export const getCareerRoles = () => apiFetch('/careers/roles')
export const getSkillGap = (roleId) => apiFetch('/careers/skill-gap', { method: 'POST', body: JSON.stringify({ roleId }) })
export const getCareerProfile = () => apiFetch('/careers/profile')

// ── SKILLS ──
export const getSkillCategories = () => apiFetch('/skills/categories')
export const getSkillByCategory = (category) => apiFetch(`/skills/${category}`)
export const getSkillsAIRecommendations = () => apiFetch('/skills/ai-recommendations')

// ── JOBS ──
export const getJobs = async (filters = {}) => {
  const cleanFilters = {}
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '' && filters[key] !== 'All' && filters[key] !== '0') {
      cleanFilters[key] = filters[key]
    }
  })
  const params = new URLSearchParams(cleanFilters).toString()
  const res = await apiFetch(`/jobs${params ? `?${params}` : ''}`)
  syncJobsToProfile(res)
  return res
}
export const getJobById = (id) => apiFetch(`/jobs/${id}`)
export const getFeaturedJobs = () => apiFetch('/jobs/featured')
export const getRecommendedJobs = async () => {
  const res = await apiFetch('/jobs/recommended')
  syncJobsToProfile(res)
  return res
}
export const getLatestJobs = () => apiFetch('/jobs/latest')
export const getJobStats = async () => {
  const res = await apiFetch('/jobs/stats')
  syncJobsToProfile(res)
  return res
}
export const getReadinessScore = (jobId) => apiFetch('/jobs/readiness-score', { method: 'POST', body: JSON.stringify({ jobId }) })

// ── SAVED JOBS (BOOKMARKS) ──
export const saveJob = async (jobId) => {
  const res = await apiFetch(`/jobs/${jobId}/save`, { method: 'POST' })
  syncJobsToProfile({ savedAction: 'save', jobId, res })
  return res
}
export const removeSavedJob = async (jobId) => {
  const res = await apiFetch(`/jobs/${jobId}/save`, { method: 'DELETE' })
  syncJobsToProfile({ savedAction: 'remove', jobId, res })
  return res
}
export const getSavedJobs = (params = {}) => {
  const searchParams = new URLSearchParams(params).toString()
  return apiFetch(`/jobs/saved${searchParams ? `?${searchParams}` : ''}`)
}
export const isJobSaved = (jobId) => apiFetch(`/jobs/${jobId}/is-saved`)

// ── JOB APPLICATIONS ──
export const applyForJob = async (jobId, payload = {}) => {
  const res = await apiFetch(`/jobs/${jobId}/apply`, { method: 'POST', body: JSON.stringify(payload) })
  syncJobsToProfile({ applyAction: 'apply', jobId, res })
  return res
}
export const getMyApplications = (params = {}) => {
  const searchParams = new URLSearchParams(params).toString()
  return apiFetch(`/applications/me${searchParams ? `?${searchParams}` : ''}`)
}
export const getMyApplicationStats = () => apiFetch('/applications/me/stats')
export const getApplicationAnalytics = () => apiFetch('/applications/me/analytics')
export const getApplication = (id) => apiFetch(`/applications/${id}`)
export const getApplicationStatus = (jobId) => apiFetch(`/jobs/${jobId}/application-status`)

// ── JOB ALERTS ──
export const getJobAlerts = () => apiFetch('/job-alerts')
export const createJobAlert = (payload) => apiFetch('/job-alerts', { method: 'POST', body: JSON.stringify(payload) })
export const updateJobAlert = (id, payload) => apiFetch(`/job-alerts/${id}`, { method: 'PATCH', body: JSON.stringify(payload) })
export const deleteJobAlert = (id) => apiFetch(`/job-alerts/${id}`, { method: 'DELETE' })
export const toggleJobAlert = (id) => apiFetch(`/job-alerts/${id}/toggle`, { method: 'PATCH' })

// ── COMPANIES ──
export const getCompanyProfile = (company) => apiFetch(`/companies/${encodeURIComponent(company)}/profile`)
export const getFollowedCompanies = (params = {}) => {
  const searchParams = new URLSearchParams(params).toString()
  return apiFetch(`/companies/following${searchParams ? `?${searchParams}` : ''}`)
}
export const isFollowingCompany = (company) => apiFetch(`/companies/${encodeURIComponent(company)}/is-following`)
export const followCompany = (company) => apiFetch(`/companies/${encodeURIComponent(company)}/follow`, { method: 'POST' })
export const unfollowCompany = (company) => apiFetch(`/companies/${encodeURIComponent(company)}/follow`, { method: 'DELETE' })
export const toggleCompanyNotifications = (company) => apiFetch(`/companies/${encodeURIComponent(company)}/notifications`, { method: 'PATCH' })

// ── PROVIDER LIVE SYNC ──
export const syncAdzunaJobs = () => apiFetch('/jobs/providers/adzuna/sync', { method: 'POST' })
export const syncJobsFromProvider = (providerName = 'adzuna') => apiFetch(`/jobs/providers/${providerName}/sync`, { method: 'POST' })

// ── USER PROFILE ──
export const getStudentProfile = () => apiFetch('/profile/me')
export const updateStudentProfile = (payload) => apiFetch('/profile/me', { method: 'PUT', body: JSON.stringify(payload) })
export const patchStudentProfile = (payload) => apiFetch('/profile/me', { method: 'PATCH', body: JSON.stringify(payload) })
export const updateProfileStatus = (isPublic) => apiFetch('/profile/status', { method: 'PUT', body: JSON.stringify({ isPublic }) })
export const getZenScore = () => apiFetch('/profile/zenscore')

// ── PRODUCTIVITY ──
export const addFocusLog = async (payload) => {
  const cleanPayload = {
    subject: (payload.subject || payload.topic || '').trim(),
    durationMinutes: Number(payload.durationMinutes || payload.actualMinutes || payload.minutes || 25),
    notes: (payload.notes || payload.goal || '').trim(),
    category: (payload.category || 'Courses').trim(),
    clientSessionId: payload.clientSessionId || payload.id || null,
    date: payload.date || payload.startTime || new Date().toISOString()
  }
  const res = await apiFetch('/productivity/focus-log', { method: 'POST', body: JSON.stringify(cleanPayload) })
  syncProductivityToProfile(res?.data || res)
  return res
}
export const getFocusLogs = () => apiFetch('/productivity/focus-log')
export const deleteFocusLog = (id) => apiFetch(`/productivity/focus-log/${id}`, { method: 'DELETE' })
export const getProductivityAnalytics = async () => {
  const res = await apiFetch('/productivity/analytics')
  syncProductivityToProfile(res?.data || res)
  return res
}
export const getAISuggestion = () => apiFetch('/productivity/ai-suggestion', { method: 'POST' })

// ── COURSES (Consolidated & Re-exported from canonical coursesService) ──
export {
  getCourses,
  getCourseById,
  getCourse,
  getCourseStats,
  getRecommendedCourses,
  getContinueLearning,
  enrollInCourse,
  toggleBookmark,
  toggleCourseBookmark,
  completeModuleVideo,
  completeModuleNotes,
  submitModuleQuiz,
  getModuleQuiz,
  getQuizResults,
  getModuleCoding,
  evaluateCodingExercise,
  saveModuleCodingDraft,
  getModuleProject,
  runModuleProjectTests,
  submitModuleProject,
  saveModuleProjectDraft,
  submitModuleAssignment,
  completeModule,
  getRoadmap,
  adjustRoadmap,
  getDailyChallenge,
  submitDailyChallenge,
  getNotifications,
  getCertificates,
  getLearningAnalytics,
  getModuleStudyNote,
  saveModuleStudyNote,
  askCourseModuleAITutor,
  updateLastOpenedModule
} from './courses/coursesService'

// ── GLOBAL SEARCH ──
export { performGlobalSearch, performGlobalSearch as globalSearch } from './search/searchService'

// ── GLOBAL LIVE NOTIFICATIONS ──
export {
  getNotifications as getGlobalNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification as deleteGlobalNotification
} from './notifications/notificationService'

