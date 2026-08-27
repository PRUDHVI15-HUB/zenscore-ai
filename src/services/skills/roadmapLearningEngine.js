/**
 * roadmapLearningEngine.js
 * Real Learning Engine & Course Integration Service for ZenScore AI (Product 4 - Sprint D).
 * Handles persistent lesson progress, video tracking, interactive coding labs, quizzes, and project completions.
 */

import { registerSkillUpdate } from './skillRegistry'

export const LEARNING_STORAGE_KEY = 'zenscore_learning_progress_v1.1'

/**
 * Gets or initializes learning engine progress state from localStorage.
 */
export function getLearningEngineState() {
  try {
    const cached = localStorage.getItem(LEARNING_STORAGE_KEY)
    if (cached) return JSON.parse(cached)
  } catch (e) {
    console.warn('[LearningEngine] localStorage read error:', e)
  }

  const defaultState = {
    version: 'v1.1',
    lastActivePhaseId: 1,
    lastLessonId: 'l1',
    lastVideoTimeSeconds: 145,
    phaseProgress: {
      1: { lessonPct: 100, videoPct: 100, quizPct: 100, projectPct: 100, overallPct: 100, isCompleted: true },
      2: { lessonPct: 80, videoPct: 100, quizPct: 100, projectPct: 50, overallPct: 82, isCompleted: false },
      3: { lessonPct: 40, videoPct: 50, quizPct: 0, projectPct: 0, overallPct: 22, isCompleted: false },
    },
    completedLessons: ['l1', 'l2', 'l3', 'l4', 'l5'],
    completedQuizzes: ['q1', 'q2'],
    completedLabs: ['lab1', 'lab2'],
    completedProjects: ['p1'],
    learningHistory: [
      { id: 'h1', type: 'Lesson', title: 'Java 17 OOP Principles', timestamp: '2026-07-20', xp: 50 },
      { id: 'h2', type: 'Quiz', title: 'Multithreading & Concurrency MCQ', timestamp: '2026-07-22', xp: 100 },
      { id: 'h3', type: 'Project', title: 'Student Management REST API', timestamp: '2026-07-25', xp: 250 },
    ],
  }

  saveLearningEngineState(defaultState)
  return defaultState
}

/**
 * Persists learning engine state to localStorage.
 */
export function saveLearningEngineState(stateObj) {
  try {
    localStorage.setItem(LEARNING_STORAGE_KEY, JSON.stringify(stateObj))
  } catch (e) {
    console.warn('[LearningEngine] localStorage save error:', e)
  }
}

/**
 * Generates interactive lessons, quiz questions, and coding labs for a given roadmap phase.
 */
export function getPhaseLearningContent(phaseSkill = 'Docker', phaseTitle = 'Phase 3: Docker Containers') {
  const cleanSkill = phaseSkill || 'Core Engineering'

  return {
    lessons: [
      { id: 'l1', title: `Introduction to ${cleanSkill} Architecture`, duration: '12 Mins', type: 'video' },
      { id: 'l2', title: `Core Directives & Building ${cleanSkill} Configurations`, duration: '18 Mins', type: 'article' },
      { id: 'l3', title: `Multi-Stage Production Build Patterns for ${cleanSkill}`, duration: '20 Mins', type: 'video' },
      { id: 'l4', title: `Networking, Volumes & Environment Isolation in ${cleanSkill}`, duration: '25 Mins', type: 'lab' },
    ],
    codingLab: {
      id: `lab_${cleanSkill.toLowerCase().replace(/[^a-z]/g, '')}`,
      title: `Hands-on ${cleanSkill} Production Coding Challenge`,
      instructions: `Write a production-grade configuration file for ${cleanSkill} incorporating multi-stage builds and security hardening.`,
      starterCode: `// ${cleanSkill} Production Starter Configuration\n// Step 1: Define environment base\n// Step 2: Configure port mapping and healthcheck\nmodule.exports = {\n  target: "${cleanSkill.toLowerCase()}",\n  port: 8080,\n  healthCheck: "/actuator/health"\n};`,
      solutionCode: `// Verified ${cleanSkill} Enterprise Solution\nmodule.exports = {\n  target: "${cleanSkill.toLowerCase()}",\n  port: 8080,\n  healthCheck: "/actuator/health",\n  secured: true\n};`,
    },
    quiz: {
      id: `quiz_${cleanSkill.toLowerCase().replace(/[^a-z]/g, '')}`,
      title: `${cleanSkill} Technical Mastery Assessment`,
      passingScore: 80,
      questions: [
        {
          id: 'q1',
          question: `What is the primary operational benefit of using ${cleanSkill} in microservice architecture?`,
          options: [
            'Environment consistency across dev, staging, and production',
            'Slower build times with higher overhead',
            'Manual server provisioning without automation',
            'Direct memory mutation bypassing operating system controls',
          ],
          correctIdx: 0,
        },
        {
          id: 'q2',
          question: `Which configuration directive optimizes caching efficiency in ${cleanSkill}?`,
          options: [
            'Placing frequently changing source code lines after dependency installation steps',
            'Disabling layer caching completely',
            'Recompiling all binaries on every single container boot',
            'Storing database passwords directly inside git repositories',
          ],
          correctIdx: 0,
        },
      ],
    },
    projects: {
      beginner: `Build & containerize a basic ${cleanSkill} hello-world application`,
      intermediate: `Integrate ${cleanSkill} with Spring Boot & PostgreSQL database stack`,
      advanced: `Deploy high-availability multi-region ${cleanSkill} microservices with automated healthchecks`,
    },
    resources: {
      docs: `https://docs.${cleanSkill.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      youtube: `${cleanSkill} Complete Engineering Masterclass`,
      github: `awesome-${cleanSkill.toLowerCase().replace(/[^a-z]/g, '')}`,
      practice: `Interactive ${cleanSkill} Hands-On Playground`,
      book: `Mastering ${cleanSkill} in Enterprise Production`,
    },
  }
}

/**
 * Completes a lesson, quiz, or lab, updating progress and registering skill progress.
 */
export function recordLearningActivity(currentState, activityType = 'Lesson', title = '', phaseId = 1, xpReward = 50) {
  const historyItem = {
    id: `hist_${Date.now()}`,
    type: activityType,
    title: title || `${activityType} Progress`,
    timestamp: new Date().toISOString().split('T')[0],
    xp: xpReward,
  }

  const prevPhaseData = currentState.phaseProgress?.[phaseId] || { lessonPct: 0, videoPct: 0, quizPct: 0, projectPct: 0, overallPct: 0 }

  let newLessonPct = prevPhaseData.lessonPct
  let newQuizPct = prevPhaseData.quizPct
  let newProjectPct = prevPhaseData.projectPct

  if (activityType === 'Lesson') newLessonPct = Math.min(100, newLessonPct + 25)
  if (activityType === 'Quiz') newQuizPct = 100
  if (activityType === 'Project') newProjectPct = 100

  const newOverall = Math.round((newLessonPct * 0.4) + (newQuizPct * 0.3) + (newProjectPct * 0.3))

  const updatedState = {
    ...currentState,
    lastActivePhaseId: phaseId,
    phaseProgress: {
      ...currentState.phaseProgress,
      [phaseId]: {
        ...prevPhaseData,
        lessonPct: newLessonPct,
        quizPct: newQuizPct,
        projectPct: newProjectPct,
        overallPct: newOverall,
        isCompleted: newOverall >= 90,
      },
    },
    learningHistory: [historyItem, ...(currentState.learningHistory || []).slice(0, 20)],
  }

  saveLearningEngineState(updatedState)
  registerSkillUpdate(title, newOverall >= 90 ? 'Mastered' : 'Advanced', newOverall, 'Learning Engine')

  return updatedState
}
