/**
 * interviewGraduationService.js
 * Dynamic Interview Graduation Engine for ZenScore AI (Phase 7 - Sprint 6).
 * Evaluates readiness threshold and unlocks 'Interview Graduate' credentials only when earned.
 */

export const GRADUATION_STORAGE_KEY = 'zenscore_interview_graduation_v1.1'

export function evaluateInterviewGraduation(readinessScore = 0) {
  const isGraduated = readinessScore >= 80

  const graduationData = {
    isGraduated,
    status: isGraduated ? 'INTERVIEW GRADUATE — PLACEMENT READY ✅' : 'PREPARATION IN PROGRESS',
    graduatedAt: isGraduated ? new Date().toISOString() : null,
    placementReadyScore: readinessScore,
    dreamCompanyEligibility: isGraduated ? '88% Eligible for MAANG & Tier 1 Product Roles' : 'Requirements Remaining (0%)',
    unlockedBadges: isGraduated ? ['Interview Graduate', 'Placement Champion', 'System Design Architect'] : [],
  }

  try {
    localStorage.setItem(GRADUATION_STORAGE_KEY, JSON.stringify(graduationData))
  } catch (e) {
    console.warn('[InterviewGraduation] localStorage save error:', e)
  }

  return graduationData
}
