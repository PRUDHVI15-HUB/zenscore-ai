import { apiFetch } from '../api'

/**
 * Dedicated Canonical API Service for Courses Module & Learning Engine
 * Single Source of Truth for all Course operations.
 */
export const getCourses = (filters = {}) => {
  const cleanFilters = {}
  Object.keys(filters).forEach(key => {
    if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '' && filters[key] !== 'all') {
      cleanFilters[key] = filters[key]
    }
  })
  const params = new URLSearchParams(cleanFilters).toString()
  return apiFetch(`/courses${params ? `?${params}` : ''}`)
}

export const getCourseById = (courseId) => apiFetch(`/courses/${courseId}`)
export const getCourse = getCourseById

export const getCourseStats = () => apiFetch('/courses/stats')

export const getRecommendedCourses = () => apiFetch('/courses/recommended')

export const getContinueLearning = () => apiFetch('/courses/continue-learning')

export const enrollInCourse = (courseId) => apiFetch(`/courses/${courseId}/enroll`, { method: 'POST' })

export const toggleCourseBookmark = (courseId) => apiFetch(`/courses/${courseId}/bookmark`, { method: 'POST' })
export const toggleBookmark = toggleCourseBookmark

// Module Learning Activities
export const completeModuleVideo = (courseId, moduleIndex, payload = {}) =>
  apiFetch(`/courses/${courseId}/modules/${moduleIndex}/video`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })

export const completeModuleNotes = (courseId, moduleIndex) =>
  apiFetch(`/courses/${courseId}/modules/${moduleIndex}/notes`, { method: 'POST' })

// Phase 3 Practice Quiz & Assessment Engine
export const getModuleQuiz = (courseId, moduleIndex) =>
  apiFetch(`/courses/${courseId}/modules/${moduleIndex}/quiz`)

export const submitModuleQuiz = (courseId, moduleIndex, answers) =>
  apiFetch(`/courses/${courseId}/modules/${moduleIndex}/quiz/submit`, {
    method: 'POST',
    body: JSON.stringify({ answers })
  })

export const getQuizResults = (courseId, moduleIndex) =>
  apiFetch(`/courses/${courseId}/modules/${moduleIndex}/quiz/results`)

// Phase 4 Real Coding Workspace & Execution Engine
export const getModuleCoding = (courseId, moduleIndex) =>
  apiFetch(`/courses/${courseId}/modules/${moduleIndex}/coding`)

export const evaluateCodingExercise = (courseId, moduleIndex, code, language) =>
  apiFetch(`/courses/${courseId}/modules/${moduleIndex}/coding/run`, {
    method: 'POST',
    body: JSON.stringify({ code, language })
  })

export const saveModuleCodingDraft = (courseId, moduleIndex, code) =>
  apiFetch(`/courses/${courseId}/modules/${moduleIndex}/coding/save`, {
    method: 'POST',
    body: JSON.stringify({ code })
  })

// Phase 5 AI Project Grader & Hands-On Capstone Project Validation
export const getModuleProject = (courseId, moduleIndex) =>
  apiFetch(`/courses/${courseId}/modules/${moduleIndex}/project`)

export const runModuleProjectTests = (courseId, moduleIndex, code, language) =>
  apiFetch(`/courses/${courseId}/modules/${moduleIndex}/project/run`, {
    method: 'POST',
    body: JSON.stringify({ code, language })
  })

export const submitModuleProject = (courseId, moduleIndex, code, language) =>
  apiFetch(`/courses/${courseId}/modules/${moduleIndex}/project/submit`, {
    method: 'POST',
    body: JSON.stringify({ code, language })
  })

export const saveModuleProjectDraft = (courseId, moduleIndex, code, language) =>
  apiFetch(`/courses/${courseId}/modules/${moduleIndex}/project/save`, {
    method: 'POST',
    body: JSON.stringify({ code, language })
  })

export const submitModuleAssignment = (courseId, moduleIndex, submission) => {
  const bodyPayload = typeof submission === 'object' ? submission : { submissionText: submission }
  return apiFetch(`/courses/${courseId}/modules/${moduleIndex}/assignment`, {
    method: 'POST',
    body: JSON.stringify(bodyPayload)
  })
}

export const completeModule = (courseId, moduleIndex) =>
  apiFetch(`/courses/${courseId}/modules/${moduleIndex}/complete`, { method: 'POST' })

// Personal Study Notes per Course Module
export const getModuleStudyNote = (courseId, moduleIndex) =>
  apiFetch(`/courses/${courseId}/modules/${moduleIndex}/note`)

export const saveModuleStudyNote = (courseId, moduleIndex, content) =>
  apiFetch(`/courses/${courseId}/modules/${moduleIndex}/note`, {
    method: 'POST',
    body: JSON.stringify({ content })
  })

// Contextual AI Tutor for Course Module
export const askCourseModuleAITutor = (courseId, moduleIndex, question, conversationHistory = []) =>
  apiFetch(`/courses/${courseId}/modules/${moduleIndex}/tutor`, {
    method: 'POST',
    body: JSON.stringify({ question, conversationHistory })
  })

export const getRoadmap = () => apiFetch('/courses/roadmap')

export const adjustRoadmap = (payload) =>
  apiFetch('/courses/roadmap/adjust', {
    method: 'POST',
    body: JSON.stringify(payload)
  })

export const getDailyChallenge = () => apiFetch('/courses/daily-challenge')

export const submitDailyChallenge = () => apiFetch('/courses/daily-challenge/submit', { method: 'POST' })

export const updateLastOpenedModule = (courseId, moduleIndex) =>
  apiFetch(`/courses/${courseId}/last-opened`, {
    method: 'POST',
    body: JSON.stringify({ moduleIndex })
  })

export const getCertificates = () => apiFetch('/courses/certificates')

export const getLearningAnalytics = () => apiFetch('/courses/analytics')
export const getNotifications = () => apiFetch('/courses/notifications')
