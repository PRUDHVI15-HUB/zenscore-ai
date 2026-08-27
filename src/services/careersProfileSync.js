/**
 * Careers → Student Profile Synchronizer
 * ========================================
 * Transforms data from CareerContext state into the
 * careerProfile section of the Unified Student Profile.
 *
 * Design Principles:
 *   - FIRE AND FORGET: Never blocks the Careers UI or CareerContext
 *   - SILENT ERRORS:   Careers must always keep working
 *   - MERGE STRATEGY:  updateSection() deep-merges, never overwrites
 *   - SINGLE WRITE:    Only writes to 'careerProfile' — nothing else
 *   - NO READS:        Careers does not read from Student Profile
 *
 * Called from CareerContext.jsx:
 *   1. Inside refreshAllCareerData() after all API promises settle
 *   2. Inside finishOnboarding() after onboarding completes
 *
 * Trigger events (all covered because they call refreshAllCareerData()):
 *   ✓ Career onboarding completed
 *   ✓ Career goal changed
 *   ✓ Career dashboard refreshed
 *   ✓ Roadmap generated / updated
 *   ✓ Resume uploaded / ATS score updated
 *   ✓ Interview prep progress updated
 *   ✓ Learning hub data refreshed
 */

import { updateProfileSection } from './studentProfileService'
import { PROFILE_SOURCES } from '../models/StudentProfile'
import { registerAutomation, AUTOMATION_EVENTS } from './automationEngine'

// ─────────────────────────────────────────────────────────────
// DATA EXTRACTOR
// Maps CareerContext state → careerProfile fields
// ─────────────────────────────────────────────────────────────

/**
 * extractCareerProfile()
 * ----------------------
 * Builds the careerProfile payload from the combined state of
 * all career submodule API responses.
 *
 * @param {Object} params
 * @param {string}      params.currentCareer        - Currently selected career goal
 * @param {boolean}     params.onboardingCompleted   - Whether onboarding is done
 * @param {Object|null} params.dashboardData         - From fetchCareersDashboard()
 * @param {Object|null} params.learningData          - From fetchLearningHub()
 * @param {Object|null} params.resumeData            - From fetchResumeCenter()
 * @param {Object|null} params.interviewData         - From fetchInterviewCenter()
 * @param {Object|null} params.currentRoadmap        - Current roadmap object
 * @param {number}      params.careerReadiness       - Computed readiness score
 * @param {number}      params.interviewReadiness    - Computed interview readiness
 * @returns {Object|null} - null if nothing meaningful to sync
 */
export function extractCareerProfile({
  currentCareer        = '',
  onboardingCompleted  = false,
  dashboardData        = null,
  learningData         = null,
  resumeData           = null,
  interviewData        = null,
  currentRoadmap       = null,
  careerReadiness      = 0,
  interviewReadiness   = 0,
}) {
  // Don't sync if no career goal has been selected yet
  if (!currentCareer && !onboardingCompleted) return null

  const dash    = dashboardData  || {}
  const learn   = learningData   || {}
  const resume  = resumeData     || {}
  const interview = interviewData || {}

  // ── CAREER GOAL ──────────────────────────────────────────
  const selectedCareerGoal = currentCareer
    || dash.careerGoal?.targetCareer
    || ''

  const careerCategory = dash.careerGoal?.category || null
  const expectedSalary = dash.careerGoal?.expectedSalary || null

  // ── READINESS ────────────────────────────────────────────
  const careerReadinessPct = dash.careerReadiness?.overallReadinessPct ?? careerReadiness ?? 0
  const learningScore      = dash.careerReadiness?.learningScore        ?? 0
  const resumeScore        = dash.careerReadiness?.resumeScore          ?? resume.atsScore ?? 0
  const interviewScore     = dash.careerReadiness?.interviewScore       ?? interviewReadiness ?? 0

  // ── CAREER STAGE ─────────────────────────────────────────
  const careerStage  = dash.careerStatus      || 'Learning'
  const currentStage = learn.currentStage     || dash.learningProgress?.currentStage || null

  // ── ROADMAP ───────────────────────────────────────────────
  const currentRoadmapId       = currentRoadmap?.id       || currentRoadmap?.title     || null
  const roadmapProgress        = learn.learningProgress   ?? 0
  const currentPhaseTitle      = currentRoadmap?.currentPhase?.title || null
  const estimatedCompletionDays = currentRoadmap?.estimatedCompletionDays || null

  // Count completed milestones from roadmap phases
  const completedMilestones = currentRoadmap?.phases
    ? currentRoadmap.phases.filter(p => p.completed === true).length
    : 0
  const totalMilestones = currentRoadmap?.phases?.length || 0

  // ── RESUME / ATS ──────────────────────────────────────────
  const resumeUploaded    = resume.resumeUploaded    ?? false
  const resumeATSScore    = resume.atsScore          ?? resume.resumeReadiness ?? 0
  const resumeVersion     = resume.resumeVersion     || null
  const resumeLastUpdated = resume.uploadDate        || null

  // ── INTERVIEW ─────────────────────────────────────────────
  const interviewReadinessPct = interview.interviewReadiness ?? interviewReadiness ?? 0
  const mockInterviewsDone    = interview.mockInterviews      ?? 0
  const interviewAvgScore     = interview.averageScore        ?? 0

  // ── LEARNING ──────────────────────────────────────────────
  const completedSkillsCount = learn.completedSkills?.length ?? 0
  const requiredSkillsCount  = learn.requiredSkills?.length  ?? 0
  const nextRecommendedSkill = learn.nextRecommendedSkill    || null

  // ── CAREER LAST ACTIVITY ──────────────────────────────────
  const careerLastActivity = dash.latestActivity || new Date().toISOString()

  // ── BUILD PAYLOAD ─────────────────────────────────────────
  return {
    // Core career identity
    selectedCareerGoal,
    careerCategory,
    expectedSalary,
    onboardingCompleted,

    // Readiness scores
    careerReadinessPct,
    learningScore,
    resumeScoreInProfile:   resumeScore,
    interviewScoreInProfile: interviewScore,

    // Career stage
    careerStage,
    currentStage,

    // Roadmap
    currentRoadmapId,
    roadmapProgress,
    currentPhaseTitle,
    estimatedCompletionDays,
    completedMilestones,
    totalMilestones,

    // Resume & ATS
    resumeUploaded,
    resumeATSScore,
    resumeVersion,
    resumeLastUpdated,

    // Interview
    interviewReadinessPct,
    mockInterviewsDone,
    interviewAvgScore,

    // Learning
    completedSkillsCount,
    requiredSkillsCount,
    nextRecommendedSkill,

    // Activity tracking
    careerLastActivity,
  }
}

// ─────────────────────────────────────────────────────────────
// SYNC FUNCTION — called from CareerContext.jsx
// ─────────────────────────────────────────────────────────────

/**
 * syncCareersToProfile()
 * ----------------------
 * Fire-and-forget sync to Student Profile.
 *
 * Guarantees:
 *   ✓ Never throws — all wrapped in try/catch
 *   ✓ Never blocks — returns immediately (no await needed by caller)
 *   ✓ Never writes if no career goal selected
 *   ✓ Only writes to 'careerProfile' section
 *   ✓ Silent on failure
 *
 * Usage in CareerContext.jsx:
 *   syncCareersToProfile({ currentCareer, onboardingCompleted, dashboardData, ... })
 *   // No await, no .then(), no error handling needed in caller
 *
 * @param {Object} params - All career state fields (see extractCareerProfile)
 * @returns {void}  (async, fire-and-forget)
 */
export function syncCareersToProfile(params) {
  const payload = extractCareerProfile(params)
  if (!payload) return  // Nothing to sync (no career selected yet)

  // Async write — fire and forget
  updateProfileSection('careerProfile', payload, PROFILE_SOURCES.CAREERS)
    .then(() => {
      registerAutomation(AUTOMATION_EVENTS.CAREER_GOAL_CHANGED, payload)
    })
    .catch(err => {
      // Silent — Careers must never be interrupted by profile sync failures
      console.info(
        '[CareersSync] Student Profile update failed (non-blocking):',
        err?.message ?? err
      )
    })
}
