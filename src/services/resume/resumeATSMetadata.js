/**
 * resumeATSMetadata.js
 * Dynamic Resume ATS Score & Section Completion Engine for ZenScore AI (Phase 7 - Sprint 5).
 * Calculates real-time ATS scores, section completion percentages, and missing item audit logs.
 */

import { buildResumeSections } from './resumeSectionBuilder'

/**
 * Calculates real-time ATS metadata and section completion percentages.
 * Zero fake scores for new students.
 */
export function calculateResumeATSMetadata(careerContext = {}) {
  const sections = buildResumeSections(careerContext)

  let completionScore = 0
  const missingItems = []

  // 1. Profile Information (15%)
  if (sections.studentInfo?.name && sections.studentInfo?.email && sections.studentInfo?.phone) {
    completionScore += 15
  } else {
    missingItems.push('Contact Details')
  }

  // 2. Technical Skills (20%)
  const verifiedSkillsCount = Object.values(sections.categorizedSkills || {}).flat().length
  if (verifiedSkillsCount >= 5) {
    completionScore += 20
  } else if (verifiedSkillsCount > 0) {
    completionScore += Math.round((verifiedSkillsCount / 5) * 20)
    missingItems.push('Technical Skills (Verify 5+ roadmap skills)')
  } else {
    missingItems.push('Technical Skills (Complete roadmap lessons)')
  }

  // 3. Projects (20%)
  const projectsCount = (sections.projects || []).length
  if (projectsCount >= 2) {
    completionScore += 20
  } else if (projectsCount === 1) {
    completionScore += 10
    missingItems.push('Projects (Complete 2nd capstone project)')
  } else {
    missingItems.push('Projects (Complete Phase Capstone Projects)')
  }

  // 4. Certificates (10%)
  const certsCount = (sections.certifications || []).length
  if (certsCount >= 1) {
    completionScore += 10
  } else {
    missingItems.push('Certifications (Earn Career Certification)')
  }

  // 5. Achievements (10%)
  const badgesCount = (sections.achievements || []).length
  if (badgesCount >= 2) {
    completionScore += 10
  } else if (badgesCount === 1) {
    completionScore += 5
    missingItems.push('Achievements (Earn 2+ platform badges)')
  } else {
    missingItems.push('Achievements (Unlock milestone badges)')
  }

  // 6. Keywords Match (15%)
  if (verifiedSkillsCount >= 3) {
    completionScore += 15
  } else if (verifiedSkillsCount > 0) {
    completionScore += Math.round((verifiedSkillsCount / 3) * 15)
    missingItems.push('Keyword Alignment')
  } else {
    missingItems.push('Keyword Alignment')
  }

  // 7. Professional Summary (10%)
  if (sections.professionalSummary && sections.professionalSummary.length > 30) {
    completionScore += 10
  } else {
    missingItems.push('Professional Summary')
  }

  const completionPct = Math.min(100, completionScore)
  const atsReadabilityScore = completionPct

  return {
    completionPct,
    atsReadabilityScore,
    atsStatus: completionPct >= 85 ? 'ATS Executive Grade' : completionPct >= 50 ? 'ATS Competitive Grade' : completionPct > 0 ? 'Needs Optimization' : 'Not Generated',
    missingItems,
    targetRole: sections.studentInfo?.targetRole || 'Backend Engineer',
    keywordCoveragePct: Math.min(100, Math.round(verifiedSkillsCount * 12.5)),
  }
}
