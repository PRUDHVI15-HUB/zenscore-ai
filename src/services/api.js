const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const cleanBase = rawBase.replace(/\/+$/, '')
const BASE_URL = cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`

const getToken = () => localStorage.getItem('zenscore_jwt')
const setToken = (token) => localStorage.setItem('zenscore_jwt', token)
const removeToken = () => localStorage.removeItem('zenscore_jwt')

const apiFetch = async (endpoint, options = {}) => {
  const token = getToken()
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers })
    const data = await res.json()
    if (!res.ok) {
      throw {
        success: false,
        message: data.message || 'API Error',
        errors: data.errors || []
      }
    }
    return data
  } catch (err) {
    if (err && typeof err === 'object' && 'success' in err) {
      throw err
    }
    throw {
      success: false,
      message: err.message || 'Network connection failed',
      errors: [err]
    }
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

export const getImportSession = (sessionId) => apiFetch(`/ocr/session/${sessionId}`)
export const confirmImportSession = (sessionId) => apiFetch(`/ocr/confirm/${sessionId}`, { method: 'POST' })
export const deleteImportSession = (sessionId) => apiFetch(`/ocr/session/${sessionId}`, { method: 'DELETE' })

// ── ACADEMICS ──
export const getAcademicsDashboard = () => apiFetch('/academics/dashboard')
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

// Legacy compatibility exports (aliases)
export const getAcademicDashboard = getAcademicsDashboard
export const addCGPA = updateCGPA
export const predictGPA = predictAcademics
export const getStudyPlan = generateStudyPlan

// ── CAREERS ──
export const getCareerPaths = () => apiFetch('/careers/paths')
export const getCareerRoles = () => apiFetch('/careers/roles')
export const getSkillGap = (roleId) => apiFetch('/careers/skill-gap', { method: 'POST', body: JSON.stringify({ roleId }) })

// ── SKILLS ──
export const getSkillCategories = () => apiFetch('/skills/categories')
export const getSkillByCategory = (category) => apiFetch(`/skills/${category}`)

// ── JOBS ──
export const getJobs = (filters = {}) => {
  const params = new URLSearchParams(filters).toString()
  return apiFetch(`/jobs${params ? `?${params}` : ''}`)
}
export const getReadinessScore = (jobId) => apiFetch('/jobs/readiness-score', { method: 'POST', body: JSON.stringify({ jobId }) })

// ── PRODUCTIVITY ──
export const addFocusLog = (payload) => apiFetch('/productivity/focus-log', { method: 'POST', body: JSON.stringify(payload) })
export const getProductivityAnalytics = () => apiFetch('/productivity/analytics')
export const getAISuggestion = () => apiFetch('/productivity/ai-suggestion', { method: 'POST' })

// ── COURSES ──
export const getCourses = (filters = {}) => {
  const params = new URLSearchParams(filters).toString()
  return apiFetch(`/courses${params ? `?${params}` : ''}`)
}
export const getCourseById = (courseId) => apiFetch(`/courses/${courseId}`)
export const getCourseStats = () => apiFetch('/courses/stats')
export const getRecommendedCourses = () => apiFetch('/courses/recommended')
export const getContinueLearning = () => apiFetch('/courses/continue-learning')
export const enrollInCourse = (courseId) => apiFetch(`/courses/${courseId}/enroll`, { method: 'POST' })
export const toggleBookmark = (courseId) => apiFetch(`/courses/${courseId}/bookmark`, { method: 'POST' })
export const completeModuleVideo = (courseId, moduleIndex) => apiFetch(`/courses/${courseId}/modules/${moduleIndex}/video`, { method: 'POST' })
export const completeModuleNotes = (courseId, moduleIndex) => apiFetch(`/courses/${courseId}/modules/${moduleIndex}/notes`, { method: 'POST' })
export const submitModuleQuiz = (courseId, moduleIndex, answers) => apiFetch(`/courses/${courseId}/modules/${moduleIndex}/quiz`, { method: 'POST', body: JSON.stringify({ answers }) })
export const evaluateCodingExercise = (courseId, moduleIndex, code) => apiFetch(`/courses/${courseId}/modules/${moduleIndex}/coding`, { method: 'POST', body: JSON.stringify({ code }) })
export const submitModuleAssignment = (courseId, moduleIndex, submission) => apiFetch(`/courses/${courseId}/modules/${moduleIndex}/assignment`, { method: 'POST', body: JSON.stringify({ submission }) })
export const completeModule = (courseId, moduleIndex) => apiFetch(`/courses/${courseId}/modules/${moduleIndex}/complete`, { method: 'POST' })
export const getRoadmap = () => apiFetch('/courses/roadmap')
export const adjustRoadmap = (payload) => apiFetch('/courses/roadmap/adjust', { method: 'POST', body: JSON.stringify(payload) })
export const getDailyChallenge = () => apiFetch('/courses/daily-challenge')
export const submitDailyChallenge = () => apiFetch('/courses/daily-challenge/submit', { method: 'POST' })
export const getNotifications = () => apiFetch('/courses/notifications')
export const getCertificates = () => apiFetch('/courses/certificates')
export const getLearningAnalytics = () => apiFetch('/courses/analytics')