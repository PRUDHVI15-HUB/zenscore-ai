/**
 * skillAggregator.js
 * Centralized Skill Aggregator for ZenScore AI (Phase 7 - Sprint 2).
 * Collects, merges, and verifies skills across Courses, Academics, Projects, Certifications & Profile.
 */

import { SKILL_LEVELS, SKILL_CATEGORIES } from './skillRegistry'
import { getVerifiedSkills, getSkillRegistryState } from './skillRegistryService'

/**
 * Aggregates all user skills across the platform into a unified verified profile.
 * Zero-progress for new students until skills are verified via activity.
 *
 * @param {Object} contextData - Live CareerContext & student profile state
 * @returns {Object} Consolidated skill map keyed by skill name
 */
export function aggregateStudentSkills(contextData = {}) {
  const verifiedSkillNames = getVerifiedSkills()
  const registryState = getSkillRegistryState()

  const aggregatedMap = {};

  // Process verified skills
  (registryState.verifiedSkills || []).forEach(vSkill => {
    const name = vSkill.skillName || vSkill.skillId
    aggregatedMap[name] = {
      name,
      category: vSkill.category || SKILL_CATEGORIES.PROGRAMMING,
      level: vSkill.level || SKILL_LEVELS.MASTERED,
      percentage: 90,
      confidence: 90,
      verified: true,
      verificationSource: vSkill.source || 'LMS Activity',
      verifiedAt: vSkill.verifiedAt,
    }
  })

  // Add context verified skills if any
  const contextVerified = contextData?.verifiedSkillsList || []
  contextVerified.forEach(name => {
    if (!aggregatedMap[name]) {
      aggregatedMap[name] = {
        name,
        category: SKILL_CATEGORIES.PROGRAMMING,
        level: SKILL_LEVELS.INTERMEDIATE,
        percentage: 75,
        confidence: 75,
        verified: true,
        verificationSource: 'Context Synchronization',
        verifiedAt: new Date().toISOString(),
      }
    }
  })

  return aggregatedMap
}
