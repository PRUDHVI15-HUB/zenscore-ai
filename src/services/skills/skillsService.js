import { apiFetch } from '../api'

/**
 * Dedicated Production API Service for Skills Module & Roadmap Engine
 */
export const getCategories = () => apiFetch('/skills/categories')

export const getSkills = (filters = {}) => {
  const cleanFilters = {}
  Object.keys(filters).forEach(key => {
    if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '' && filters[key] !== 'all') {
      cleanFilters[key] = filters[key]
    }
  })
  const params = new URLSearchParams(cleanFilters).toString()
  return apiFetch(`/skills${params ? `?${params}` : ''}`)
}

export const getSkill = (skillId) => apiFetch(`/skills/${skillId}`)

export const enrollSkill = (skillId) => apiFetch(`/skills/${skillId}/enroll`, { method: 'POST' })

export const completeLesson = (skillId, lessonId) =>
  apiFetch(`/skills/${skillId}/lessons/${lessonId}/complete`, { method: 'POST' })

export const getContinueLearning = () => apiFetch('/skills/continue-learning')

export const getProgress = () => apiFetch('/skills/progress')

export const getRecommendedSkills = () => apiFetch('/skills/recommended')

export const getSkillsAIRecommendations = () => apiFetch('/skills/ai-recommendations')

// Interactive Learning Engine Endpoints (Step 6)
export const getLessonNote = (lessonId) =>
  apiFetch(`/skills/lesson/${lessonId}/note`)

export const saveLessonNote = (lessonId, content) =>
  apiFetch(`/skills/lesson/${lessonId}/note`, {
    method: 'POST',
    body: JSON.stringify({ content })
  })

export const toggleLessonBookmark = (lessonId) =>
  apiFetch(`/skills/lesson/${lessonId}/bookmark`, { method: 'POST' })

export const recordLearnComplete = (skillId, lessonId) =>
  apiFetch(`/skills/${skillId}/lessons/${lessonId}/learn-complete`, { method: 'POST' })

export const submitLessonAssessment = (skillId, lessonId, answers) =>
  apiFetch(`/skills/${skillId}/lessons/${lessonId}/assessment/submit`, {
    method: 'POST',
    body: JSON.stringify({ answers })
  })

export const verifyPracticalTask = (skillId, lessonId, code = '', command = '') =>
  apiFetch(`/skills/${skillId}/lessons/${lessonId}/task/verify`, {
    method: 'POST',
    body: JSON.stringify({ code, command })
  })

export const askLessonAI = (lessonId, prompt, history = [], promptType = 'explain') =>
  apiFetch(`/skills/lesson/${lessonId}/ai`, {
    method: 'POST',
    body: JSON.stringify({ prompt, history, promptType })
  })

// Production Roadmap Engine Endpoints (Step 8)
export const getUserRoadmaps = () => apiFetch('/roadmaps/user')

export const enrollRoadmap = (roadmapId) =>
  apiFetch('/roadmaps/enroll', { method: 'POST', body: JSON.stringify({ roadmapId }) })

export const updateRoadmapNode = (roadmapId, nodeId) =>
  apiFetch(`/roadmaps/node/${nodeId}`, { method: 'PATCH', body: JSON.stringify({ roadmapId }) })
