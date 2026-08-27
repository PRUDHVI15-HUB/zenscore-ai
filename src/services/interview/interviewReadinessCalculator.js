/**
 * interviewReadinessCalculator.js
 * Dynamic Activity-Earned Interview Readiness Calculator for ZenScore AI (Phase 7 - Sprint 6).
 * Computes Technical, Behavioral, Coding, System Design, Communication readiness %, confidence score, and company fit.
 */

import { getVerifiedSkills } from '../skills/skillRegistryService'
import { getRoadmapEngineState } from '../roadmap/roadmapProgressEngine'
import { getInterviewAnalytics } from './interviewAnalytics'
import { calculateResumeATSMetadata } from '../resume/resumeATSMetadata'

/**
 * Calculates real-time interview readiness metrics across 5 dimensions.
 * Zero-progress for brand-new students.
 */
export function calculateInterviewReadiness(careerContext = {}) {
  const targetRole = careerContext.currentCareer || 'Backend Engineer'

  const verifiedSkills = getVerifiedSkills()
  const roadmapState = getRoadmapEngineState(targetRole)
  const analytics = getInterviewAnalytics()
  const atsMetadata = calculateResumeATSMetadata(careerContext)

  // 1. Technical Readiness (Derived from Verified Skills & Roadmap Progress)
  const verifiedCount = verifiedSkills.length
  const technicalReadiness = verifiedCount >= 5 ? 100 : Math.round((verifiedCount / 5) * 100)

  // 2. Coding Readiness (Derived from Completed Coding Labs)
  const completedLabs = (roadmapState.completedLabs || []).length
  const codingReadiness = completedLabs >= 4 ? 100 : Math.round((completedLabs / 4) * 100)

  // 3. System Design Readiness (Derived from Completed Capstone Projects)
  const completedProjects = (roadmapState.completedProjects || []).length
  const systemDesignReadiness = completedProjects >= 2 ? 100 : Math.round((completedProjects / 2) * 100)

  // 4. Behavioral & Communication Readiness (Derived from Completed Mock Interviews)
  const completedSessions = analytics.totalSessionsCompleted || 0
  const behavioralReadiness = completedSessions >= 3 ? Math.min(100, analytics.averageScore || 85) : Math.round((completedSessions / 3) * 100)
  const communicationReadiness = completedSessions >= 3 ? Math.min(100, analytics.communicationClarityPct || 85) : Math.round((completedSessions / 3) * 100)

  // 5. Resume Quality Score
  const resumeScore = atsMetadata.atsReadabilityScore || 0

  // Overall Weighted Interview Readiness Formula
  const overallReadiness = Math.round(
    technicalReadiness * 0.25 +
    codingReadiness * 0.25 +
    systemDesignReadiness * 0.20 +
    behavioralReadiness * 0.15 +
    resumeScore * 0.15
  )

  const confidenceScore = Math.round(
    (technicalReadiness + codingReadiness + systemDesignReadiness + behavioralReadiness) / 4
  )

  const strongAreas = verifiedSkills.map(s => `${s} Principles & Implementation`)
  const weakAreas = []
  const missingTopics = []
  const priorityTopics = []

  if (verifiedCount === 0) {
    missingTopics.push(`Core ${targetRole} Fundamentals`)
    priorityTopics.push({ topic: `Complete Phase 1 Roadmap for ${targetRole}`, priority: 'High', estimatedHours: 5 })
  }

  return {
    targetRole,
    overallReadiness,
    technicalReadiness,
    codingReadiness,
    systemDesignReadiness,
    behavioralReadiness,
    communicationReadiness,
    confidenceScore,
    resumeScore,
    completedSessions,
    averageScore: analytics.averageScore || 0,
    strongAreas,
    weakAreas,
    missingTopics,
    priorityTopics,
  }
}
