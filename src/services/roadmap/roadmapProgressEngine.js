/**
 * roadmapProgressEngine.js
 * Central Roadmap Progress & Phase Unlock Automation Engine for ZenScore AI (Phase 7 - Sprint 3).
 * Subscribes to ActivityEventBus and automates task completions, phase unlocks, and daily mission generation.
 */

import { subscribeToActivityEvents, EVENT_TYPES } from '../skills/activityEventBus'
import { getInitialTasksForRole, isTaskDependenciesSatisfied, TASK_STATUS } from './roadmapTaskEngine'

export const ROADMAP_ENGINE_STORAGE_KEY = 'zenscore_roadmap_engine_v1.1'

/**
 * Retrieves roadmap engine state from LocalStorage.
 */
export function getRoadmapEngineState(role = 'Backend Engineer') {
  try {
    const cached = localStorage.getItem(ROADMAP_ENGINE_STORAGE_KEY)
    if (cached) {
      const parsed = JSON.parse(cached)
      if (parsed && parsed.role === role) {
        return parsed
      }
    }
  } catch (e) {
    console.warn('[RoadmapProgressEngine] LocalStorage read error:', e)
  }

  // Initial state for new student (Phase 1 unlocked, Phases 2-4 locked)
  const initialTasks = getInitialTasksForRole(role)
  const defaultState = {
    version: 'v1.1',
    role,
    completedTasks: [],
    completedLessons: [],
    completedQuizzes: [],
    completedCodingLabs: [],
    completedProjects: [],
    unlockedPhases: [1],
    phaseProgress: { 1: 0, 2: 0, 3: 0, 4: 0 },
    overallProgress: 0,
    tasks: initialTasks.map(t => ({
      ...t,
      status: t.phase === 1 ? TASK_STATUS.IN_PROGRESS : TASK_STATUS.LOCKED
    })),
    lastUpdated: new Date().toISOString(),
  }

  saveRoadmapEngineState(defaultState)
  return defaultState
}

/**
 * Persists roadmap engine state to LocalStorage.
 */
export function saveRoadmapEngineState(stateObj) {
  try {
    localStorage.setItem(ROADMAP_ENGINE_STORAGE_KEY, JSON.stringify(stateObj))
  } catch (e) {
    console.warn('[RoadmapProgressEngine] LocalStorage write error:', e)
  }
}

/**
 * Calculates phase completion percentage for a given phase number (1 to 4).
 */
export function calculatePhaseProgress(phaseNum = 1, state = getRoadmapEngineState()) {
  const phaseTasks = state.tasks.filter(t => t.phase === phaseNum)
  if (!phaseTasks.length) return 0

  const completedCount = phaseTasks.filter(t => state.completedTasks.includes(t.taskId) || t.status === TASK_STATUS.COMPLETED).length
  return Math.min(100, Math.round((completedCount / phaseTasks.length) * 100))
}

/**
 * Calculates overall roadmap completion percentage across all 4 phases.
 */
export function calculateOverallProgress(state = getRoadmapEngineState()) {
  if (!state.tasks || !state.tasks.length) return 0
  const completedCount = state.tasks.filter(t => state.completedTasks.includes(t.taskId) || t.status === TASK_STATUS.COMPLETED).length
  return Math.min(100, Math.round((completedCount / state.tasks.length) * 100))
}

/**
 * Gets list of unlocked phase numbers (e.g. [1] or [1, 2]).
 */
export function getUnlockedPhases(state = getRoadmapEngineState()) {
  return state.unlockedPhases || [1]
}

/**
 * Gets list of locked phase numbers (e.g. [2, 3, 4]).
 */
export function getLockedPhases(state = getRoadmapEngineState()) {
  const unlocked = getUnlockedPhases(state)
  return [1, 2, 3, 4].filter(p => !unlocked.includes(p))
}

/**
 * Gets list of completed lesson IDs.
 */
export function getCompletedLessons(state = getRoadmapEngineState()) {
  return state.completedLessons || []
}

/**
 * Gets list of remaining lesson IDs.
 */
export function getRemainingLessons(state = getRoadmapEngineState()) {
  const allLessonIds = state.tasks.flatMap(t => t.lessonIds || [])
  const completed = getCompletedLessons(state)
  return [...new Set(allLessonIds.filter(id => !completed.includes(id)))]
}

/**
 * Generates Today's Mission from the first incomplete task in the current active unlocked phase.
 * Returns clean object without hardcoding.
 */
export function getTodayMission(state = getRoadmapEngineState()) {
  const activeUnlockedPhase = Math.max(...(state.unlockedPhases || [1]))
  const incompleteTask = state.tasks.find(
    t => t.phase <= activeUnlockedPhase && !state.completedTasks.includes(t.taskId) && t.status !== TASK_STATUS.COMPLETED
  )

  if (incompleteTask) {
    return {
      taskId: incompleteTask.taskId,
      title: incompleteTask.title,
      time: incompleteTask.estimatedTime || '45 Mins',
      xp: incompleteTask.rewardXP || 150,
      difficulty: incompleteTask.difficulty || 'Medium',
      skillName: incompleteTask.skillName || 'Engineering Core',
      phase: incompleteTask.phase,
      readinessBoost: '+4%',
    }
  }

  return {
    title: 'Complete Phase Capstone Review & Skill Verification',
    time: '30 Mins',
    xp: 200,
    difficulty: 'Medium',
    skillName: 'Architecture',
    phase: activeUnlockedPhase,
    readinessBoost: '+5%',
  }
}

/**
 * Evaluates roadmap tasks and automates phase unlocks upon event triggers.
 */
export function processActivityEventInRoadmap(eventObj, role = 'Backend Engineer') {
  if (!eventObj) return

  const state = getRoadmapEngineState(role)
  let stateModified = false

  // Record completed IDs
  if (eventObj.eventType === EVENT_TYPES.LESSON_COMPLETED && eventObj.lessonId) {
    if (!state.completedLessons.includes(eventObj.lessonId)) {
      state.completedLessons.push(eventObj.lessonId)
      stateModified = true
    }
  } else if (eventObj.eventType === EVENT_TYPES.QUIZ_COMPLETED && (eventObj.skillName || eventObj.skillId)) {
    const qKey = eventObj.skillName || eventObj.skillId
    if (!state.completedQuizzes.includes(qKey)) {
      state.completedQuizzes.push(qKey)
      stateModified = true
    }
  } else if (eventObj.eventType === EVENT_TYPES.CODING_LAB_COMPLETED && (eventObj.skillName || eventObj.skillId)) {
    const lKey = eventObj.skillName || eventObj.skillId
    if (!state.completedCodingLabs.includes(lKey)) {
      state.completedCodingLabs.push(lKey)
      stateModified = true
    }
  } else if (eventObj.eventType === EVENT_TYPES.PROJECT_COMPLETED && (eventObj.skillName || eventObj.skillId)) {
    const pKey = eventObj.skillName || eventObj.skillId
    if (!state.completedProjects.includes(pKey)) {
      state.completedProjects.push(pKey)
      stateModified = true
    }
  }

  // Re-evaluate task completions
  state.tasks.forEach(task => {
    if (!state.completedTasks.includes(task.taskId)) {
      const isSatisfied = isTaskDependenciesSatisfied(task, state)
      if (isSatisfied) {
        state.completedTasks.push(task.taskId)
        task.status = TASK_STATUS.COMPLETED
        stateModified = true
      }
    }
  })

  // Re-calculate phase progress percentages & unlock next phases
  [1, 2, 3, 4].forEach(pNum => {
    const progressPct = calculatePhaseProgress(pNum, state)
    state.phaseProgress[pNum] = progressPct

    // Auto Phase Unlock: Unlock phase N+1 if phase N is 100% complete
    if (progressPct >= 100 && pNum < 4) {
      const nextPNum = pNum + 1
      if (!state.unlockedPhases.includes(nextPNum)) {
        state.unlockedPhases.push(nextPNum)
        // Set tasks of next phase to IN_PROGRESS
        state.tasks.forEach(t => {
          if (t.phase === nextPNum && t.status === TASK_STATUS.LOCKED) {
            t.status = TASK_STATUS.IN_PROGRESS
          }
        })
        stateModified = true
      }
    }
  })

  state.overallProgress = calculateOverallProgress(state)
  state.lastUpdated = new Date().toISOString()

  if (stateModified) {
    saveRoadmapEngineState(state)
  }

  return state
}

// Auto-subscribe to EventBus
subscribeToActivityEvents((eventObj) => {
  try {
    processActivityEventInRoadmap(eventObj)
  } catch (err) {
    console.error('[RoadmapProgressEngine] Error processing activity event:', err)
  }
})
