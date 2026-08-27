/**
 * roadmapSyncService.js
 * Roadmap Sync & Lifecycle Service for ZenScore AI.
 * Automatically synchronizes Skill Gap, Courses & Projects with the dynamic Roadmap.
 */

import { generatePersonalizedRoadmap, ROADMAP_VERSION } from './roadmapGenerator'
import { registerSkillUpdate } from './skillRegistry'
import { normalizeCareerTitle } from '../careers/careerNormalizer'
import { auth } from '../../firebase'

const _getStorageKey = () => {
  const uid = auth?.currentUser?.uid
  return uid ? `zenscore_live_roadmap_v1.1_${uid}` : 'zenscore_live_roadmap_v1.1_guest'
}

/**
 * Gets cached roadmap or generates a new dynamic roadmap.
 */
export function getOrGenerateRoadmap(targetCareer = 'Backend Engineer', contextData = {}) {
  const canonicalRole = normalizeCareerTitle(targetCareer)
  const key = _getStorageKey()
  try {
    const cached = localStorage.getItem(key)
    if (cached) {
      const parsed = JSON.parse(cached)
      if (parsed.version === ROADMAP_VERSION && normalizeCareerTitle(parsed.targetCareer) === canonicalRole) {
        return parsed
      }
    }
  } catch (e) {
    console.warn('[RoadmapSync] localStorage read error:', e)
  }

  const fresh = generatePersonalizedRoadmap(canonicalRole, contextData)
  saveRoadmapToStorage(fresh)
  return fresh
}

/**
 * Persists roadmap to localStorage.
 */
export function saveRoadmapToStorage(roadmapObj) {
  try {
    const key = _getStorageKey()
    localStorage.setItem(key, JSON.stringify(roadmapObj))
  } catch (e) {
    console.warn('[RoadmapSync] localStorage save error:', e)
  }
}

/**
 * Unlocks the next phase when a phase or skill is completed.
 */
export function unlockNextRoadmapPhase(currentRoadmap, completedPhaseNumber) {
  if (!currentRoadmap || !Array.isArray(currentRoadmap.phases)) return currentRoadmap

  let unlockedNext = false

  const nextPhases = currentRoadmap.phases.map(p => {
    if (p.phase === completedPhaseNumber) {
      // Mark mastered skill in registry
      registerSkillUpdate(p.skill, 'Mastered', 95, 'Roadmap Phase Completion')
      return { ...p, isCompleted: true, status: 'Completed', isUnlocked: true }
    }
    if (!unlockedNext && p.phase > completedPhaseNumber && p.status === 'Locked') {
      unlockedNext = true
      return { ...p, status: 'Active', isUnlocked: true }
    }
    return p
  })

  const currentActivePhase = nextPhases.find(p => p.status === 'Active') || nextPhases[nextPhases.length - 1]
  const completedCount = nextPhases.filter(p => p.isCompleted).length
  const progressPct = Math.round((completedCount / nextPhases.length) * 100)

  const updatedRoadmap = {
    ...currentRoadmap,
    phases: nextPhases,
    currentPhase: currentActivePhase,
    roadmapProgress: progressPct,
    updatedAt: new Date().toISOString(),
  }

  saveRoadmapToStorage(updatedRoadmap)
  return updatedRoadmap
}
