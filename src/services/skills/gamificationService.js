/**
 * gamificationService.js
 * Gamification & Achievement Engine for ZenScore AI (Product 4 - Sprint B).
 * Manages XP calculation, Level Progression, Daily Streaks, Weekly Activity, and Badges.
 */

export const GAMIFICATION_STORAGE_KEY = 'zenscore_gamification_v1.1'

export const LEVEL_THRESHOLDS = [
  { level: 1, title: 'Novice Engineer', minXP: 0 },
  { level: 2, title: 'Junior Developer', minXP: 500 },
  { level: 3, title: 'Core Specialist', minXP: 1200 },
  { level: 4, title: 'Senior Architect', minXP: 2500 },
  { level: 5, title: 'Engineering Fellow', minXP: 5000 },
]

export const ALL_BADGES = [
  { id: 'java_beginner', name: 'Java Beginner', icon: '☕', description: 'Mastered Java 17 fundamentals & OOP' },
  { id: 'sql_warrior', name: 'SQL Warrior', icon: '⚔️', description: 'Built & optimized complex SQL databases' },
  { id: 'docker_explorer', name: 'Docker Explorer', icon: '🐳', description: 'Containerized production microservices' },
  { id: 'api_architect', name: 'API Architect', icon: '🔌', description: 'Designed high-throughput REST APIs' },
  { id: 'backend_builder', name: 'Backend Builder', icon: '🏗️', description: 'Completed 3 production backend projects' },
  { id: 'aws_explorer', name: 'AWS Explorer', icon: '☁️', description: 'Deployed cloud infrastructure to AWS' },
  { id: 'system_designer', name: 'System Designer', icon: '📐', description: 'Mastered distributed system architecture' },
  { id: 'interview_ready', name: 'Interview Ready', icon: '🏅', description: 'Reached 90%+ overall career readiness' },
]

/**
 * Calculates current level details based on total XP.
 */
export function calculateLevelInfo(totalXP = 0) {
  let currentLevelObj = LEVEL_THRESHOLDS[0]
  let nextLevelObj = LEVEL_THRESHOLDS[1]

  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_THRESHOLDS[i].minXP) {
      currentLevelObj = LEVEL_THRESHOLDS[i]
      nextLevelObj = LEVEL_THRESHOLDS[i + 1] || null
      break
    }
  }

  const currentLevel = currentLevelObj.level
  const minXP = currentLevelObj.minXP
  const maxXP = nextLevelObj ? nextLevelObj.minXP : minXP + 2500
  const xpInCurrentLevel = totalXP - minXP
  const xpNeededForNext = nextLevelObj ? nextLevelObj.minXP - totalXP : 0
  const progressPct = Math.min(100, Math.round((xpInCurrentLevel / (maxXP - minXP)) * 100))

  return {
    level: currentLevel,
    title: currentLevelObj.title,
    totalXP,
    minXP,
    maxXP,
    xpNeededForNext,
    progressPct,
  }
}

/**
 * Gets or initializes gamification state from localStorage.
 */
export function getGamificationState() {
  try {
    const cached = localStorage.getItem(GAMIFICATION_STORAGE_KEY)
    if (cached) return JSON.parse(cached)
  } catch (e) {
    console.warn('[Gamification] localStorage read error:', e)
  }

  const defaultState = {
    totalXP: 0,
    currentStreak: 0,
    bestStreak: 0,
    lastStudyDate: null,
    unlockedBadges: [],
    weeklyProgress: { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false },
    completedActivitiesCount: 0,
  }

  saveGamificationState(defaultState)
  return defaultState
}

/**
 * Persists gamification state to localStorage.
 */
export function saveGamificationState(stateObj) {
  try {
    localStorage.setItem(GAMIFICATION_STORAGE_KEY, JSON.stringify(stateObj))
  } catch (e) {
    console.warn('[Gamification] localStorage save error:', e)
  }
}

/**
 * Awards XP and checks for newly unlocked badges.
 */
export function awardXPAndCheckBadges(currentState, xpAmount = 300, newSkillName = '') {
  const newXP = (currentState.totalXP || 0) + xpAmount

  // Update streak if today is a new study day
  const todayStr = new Date().toISOString().split('T')[0]
  let newStreak = currentState.currentStreak || 1
  let newBestStreak = currentState.bestStreak || 1

  if (currentState.lastStudyDate !== todayStr) {
    newStreak = (currentState.currentStreak || 0) + 1
    newBestStreak = Math.max(newStreak, currentState.bestStreak || 1)
  }

  // Check badges to unlock
  const existingBadgeIds = new Set((currentState.unlockedBadges || []).map(b => b.id))
  const newBadges = [...(currentState.unlockedBadges || [])]

  if (newXP >= 1200 && !existingBadgeIds.has('api_architect')) {
    newBadges.push({ id: 'api_architect', earnedDate: todayStr })
  }
  if (newSkillName.toLowerCase().includes('docker') && !existingBadgeIds.has('docker_explorer')) {
    newBadges.push({ id: 'docker_explorer', earnedDate: todayStr })
  }
  if (newSkillName.toLowerCase().includes('aws') && !existingBadgeIds.has('aws_explorer')) {
    newBadges.push({ id: 'aws_explorer', earnedDate: todayStr })
  }
  if (newSkillName.toLowerCase().includes('system') && !existingBadgeIds.has('system_designer')) {
    newBadges.push({ id: 'system_designer', earnedDate: todayStr })
  }

  const updatedState = {
    ...currentState,
    totalXP: newXP,
    currentStreak: newStreak,
    bestStreak: newBestStreak,
    lastStudyDate: todayStr,
    unlockedBadges: newBadges,
    completedActivitiesCount: (currentState.completedActivitiesCount || 0) + 1,
  }

  saveGamificationState(updatedState)
  return updatedState
}
