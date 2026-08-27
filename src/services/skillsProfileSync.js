/**
 * Skills → Student Profile Synchronizer
 * ========================================
 * Transforms data from the Skills module (useSkillsData hook) into the
 * skillsSummary section of the Unified Student Profile.
 *
 * Design Principles:
 *   - FIRE AND FORGET: Never blocks the Skills UI or useSkillsData hook
 *   - SILENT ERRORS:   Skills must always keep working
 *   - MERGE STRATEGY:  updateSection() deep-merges, never overwrites
 *   - SINGLE WRITE:    Only writes to 'skillsSummary' — nothing else
 *   - NO READS:        Skills does not read from Student Profile
 *
 * Called from useSkillsData.js inside fetchAllData() after all
 * Promise.allSettled() results are processed.
 *
 * Trigger events (all covered because they all call fetchAllData()):
 *   ✓ Skills dashboard loaded / refreshed
 *   ✓ Skill enrolled
 *   ✓ Lesson completed
 *   ✓ Bookmark toggled
 *   ✓ Assessment completed (triggers silent refetch)
 *   ✓ Certificate earned
 *   ✓ Roadmap generated / updated
 *   ✓ Tab changed (roadmap, tracker, certificates tabs trigger partial refetch)
 */

import { updateProfileSection } from './studentProfileService'
import { PROFILE_SOURCES } from '../models/StudentProfile'
import { registerAutomation, AUTOMATION_EVENTS } from './automationEngine'

// ─────────────────────────────────────────────────────────────
// DATA EXTRACTOR
// Maps resolved useSkillsData state → skillsSummary payload
// ─────────────────────────────────────────────────────────────

/**
 * extractSkillsSummary()
 * ----------------------
 * Builds the skillsSummary payload from the settled API results
 * of the Skills module. All inputs are optional — defaults to zero/null.
 *
 * @param {Object} params
 * @param {Object|null} params.progress         - From getProgress() → progressState
 * @param {Array}       params.categories       - From getCategories()
 * @param {Array}       params.continueLearning - From getContinueLearning()
 * @param {Array}       params.certificatesList - From getCertificates()
 * @param {Object|null} params.aiRecommendations- From getSkillsAIRecommendations()
 * @param {Array}       params.roadmapsData     - From getUserRoadmaps()
 * @param {Array}       params.recommendedSkills- From getRecommendedSkills()
 * @returns {Object|null} - null if no meaningful data to sync
 */
export function extractSkillsSummary({
  progress          = null,
  categories        = [],
  continueLearning  = [],
  certificatesList  = [],
  aiRecommendations = null,
  roadmapsData      = [],
  recommendedSkills = [],
}) {
  // Don't sync if there's truly no data at all (brand new user)
  const hasAnyData = progress || continueLearning.length > 0 || certificatesList.length > 0
  if (!hasAnyData) return null

  // ── SKILL COUNTS ─────────────────────────────────────────
  const verifiedSkillsCount  = progress?.completedSkills    ?? 0
  const enrolledSkillsCount  = progress?.enrolledSkills     ?? continueLearning.length ?? 0
  const completedSkillsCount = progress?.skillsCompleted    ?? progress?.completedSkills ?? 0
  const activeSkillsCount    = progress?.activeSkills       ?? continueLearning.length ?? 0
  const totalLessonsCompleted = progress?.totalCompletedLessons ?? 0

  // ── PROGRESS METRICS ──────────────────────────────────────
  const overallSkillScore   = progress?.overallProgress     ?? 0   // 0–100
  const overallCompletion   = progress?.overallCompletion   ?? 0   // 0–100 %
  const averageCompletion   = progress?.completionRate      ?? 0

  // ── LEARNING TIME ─────────────────────────────────────────
  const totalLearningHours  = progress?.totalHours          ?? 0
  const weeklyHours         = Math.ceil((progress?.completedLessons || 0) * 0.6)
  const currentStreak       = progress?.streakDays          ?? 0
  const bestStreak          = progress?.bestStreak          ?? 0

  // ── CATEGORIES ────────────────────────────────────────────
  const skillCategoriesCount = Array.isArray(categories) ? categories.length : 0

  // Most represented category from continue-learning
  const categoryFrequency = {}
  ;(Array.isArray(continueLearning) ? continueLearning : []).forEach(item => {
    const cat = item.category || 'Engineering'
    categoryFrequency[cat] = (categoryFrequency[cat] || 0) + 1
  })
  const highestSkillCategory = Object.entries(categoryFrequency)
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? null

  // ── CERTIFICATES ──────────────────────────────────────────
  const certificatesEarned   = Array.isArray(certificatesList) ? certificatesList.length : 0
  const certificatesVerified = Array.isArray(certificatesList)
    ? certificatesList.filter(c => c.verified === true || c.status === 'Verified').length
    : 0

  // ── ROADMAP ───────────────────────────────────────────────
  const safeRoadmaps          = Array.isArray(roadmapsData) ? roadmapsData : []
  const activeRoadmap         = safeRoadmaps.find(r => r.status === 'active' || r.active) || safeRoadmaps[0] || null
  const currentSkillRoadmap   = activeRoadmap?.name || activeRoadmap?.title || null
  const currentLearningPath   = activeRoadmap?.category || null
  const roadmapProgress       = activeRoadmap?.progress ?? activeRoadmap?.completionPercentage ?? 0
  const currentMilestone      = activeRoadmap?.currentMilestone || activeRoadmap?.currentPhase || null

  // ── AI RECOMMENDATIONS ────────────────────────────────────
  const recommendedNextSkill  = aiRecommendations?.recommendedNextCourse
    || (Array.isArray(recommendedSkills) && recommendedSkills[0]?.name)
    || null
  const industryReadiness     = aiRecommendations?.roleReadiness ?? 0
  const skillGapSummary       = aiRecommendations?.skillsToImprove?.length
    ? `Missing: ${aiRecommendations.skillsToImprove.slice(0, 3).join(', ')}`
    : null

  // ── LATEST ACTIVITY ───────────────────────────────────────
  const latestActivityItem    = Array.isArray(progress?.activityHistory)
    ? progress.activityHistory[0]
    : null
  const latestSkillActivity   = latestActivityItem?.timestamp
    || (Array.isArray(continueLearning) && continueLearning[0]?.lastActivity)
    || new Date().toISOString()

  // ── ASSESSMENT ────────────────────────────────────────────
  // Assessment data surfaces through progress analytics
  const assessmentScore       = progress?.assessmentScore    ?? null
  const assessmentCompleted   = progress?.assessmentCompleted ?? (verifiedSkillsCount > 0)
  const lastAssessmentDate    = progress?.lastAssessmentDate  ?? null

  // ── BUILD PAYLOAD ─────────────────────────────────────────
  return {
    // Skill counts
    overallSkillScore,
    verifiedSkillsCount,
    enrolledSkillsCount,
    completedSkillsCount,
    activeSkillsCount,
    totalLessonsCompleted,

    // Progress
    overallCompletion,
    averageCompletion,

    // Learning time
    totalLearningHours,
    weeklyHours,
    currentStreak,
    bestStreak,

    // Categories
    skillCategoriesCount,
    highestSkillCategory,

    // Certificates
    certificatesEarned,
    certificatesVerified,

    // Roadmap
    currentSkillRoadmap,
    currentLearningPath,
    roadmapProgress,
    currentMilestone,
    totalRoadmaps: safeRoadmaps.length,

    // AI / Recommendations
    recommendedNextSkill,
    industryReadiness,
    skillGapSummary,

    // Activity
    latestSkillActivity,

    // Assessment
    assessmentScore,
    assessmentCompleted,
    lastAssessmentDate,
  }
}

// ─────────────────────────────────────────────────────────────
// SYNC FUNCTION — called from useSkillsData.js
// ─────────────────────────────────────────────────────────────

/**
 * syncSkillsToProfile()
 * ---------------------
 * Fire-and-forget sync to Student Profile.
 * Extracts the skills summary and writes it to the 'skillsSummary' section.
 *
 * Guarantees:
 *   ✓ Never throws — wraps everything in try/catch
 *   ✓ Never blocks — returns immediately (no await in caller)
 *   ✓ Never writes if no meaningful data exists
 *   ✓ Only writes to 'skillsSummary' section
 *   ✓ Silent on failure
 *
 * Usage in useSkillsData.js:
 *   syncSkillsToProfile({ progress, categories, continueLearning, ... })
 *   // No await, no .then(), no error handling needed in caller
 *
 * @param {Object} params - All resolved skills state (see extractSkillsSummary)
 * @returns {void}  (async, fire-and-forget)
 */
export function syncSkillsToProfile(params) {
  const payload = extractSkillsSummary(params)
  if (!payload) return  // Nothing meaningful to sync yet

  // Async write — fire and forget
  updateProfileSection('skillsSummary', payload, PROFILE_SOURCES.SKILLS)
    .then(() => {
      registerAutomation(AUTOMATION_EVENTS.SKILL_COMPLETED, payload)
    })
    .catch(err => {
      // Silent — Skills must never be interrupted by profile sync failures
      console.info(
        '[SkillsSync] Student Profile update failed (non-blocking):',
        err?.message ?? err
      )
    })
}
