/**
 * careerSkillResolver.js
 * Dedicated Career Skill Resolver for ZenScore AI.
 * Resolves the next required unverified career skill according to strict priority rules.
 */

import { normalizeCareerTitle, resolveCanonicalCareerGoal } from './careerNormalizer'
import { generatePersonalizedRoadmap } from '../skills/roadmapGenerator'

/**
 * Normalizes a skill string or ID into a clean skillId (e.g. "JavaScript" -> "sk_javascript").
 */
export function formatSkillId(skillNameOrId) {
  if (!skillNameOrId) return 'sk_general'
  if (typeof skillNameOrId !== 'string') return 'sk_general'
  if (skillNameOrId.startsWith('sk_')) return skillNameOrId.toLowerCase()
  const slug = skillNameOrId.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
  return `sk_${slug}`
}

/**
 * Resolves the next required/unverified skill for a student's canonical career.
 * 
 * Priority:
 * 1. Current in-progress skill
 * 2. First required skill in current roadmap phase that is not completed/verified
 * 3. First required skill that is not verified in the roadmap
 * 4. Recommended next skill
 * 5. First incomplete skill in the career roadmap
 * 
 * @param {Object} studentProfile - Canonical student profile object
 * @param {Object} careerState - CareerContext state object
 * @returns {Object} { skillId, skillName, phaseNumber, category, status, isAllCompleted }
 */
export function resolveNextCareerSkill(studentProfile, careerState = {}) {
  const canonicalRole = resolveCanonicalCareerGoal(studentProfile, careerState)
  const normalizedRole = normalizeCareerTitle(canonicalRole)

  // 1. Gather verified / completed skills set from profile & context
  const skillsSummary = studentProfile?.skillsSummary || {}
  const verifiedList = Array.isArray(skillsSummary.verifiedSkills)
    ? skillsSummary.verifiedSkills
    : Array.isArray(careerState?.verifiedSkillsList)
    ? careerState.verifiedSkillsList
    : []

  const completedList = Array.isArray(skillsSummary.completedSkills)
    ? skillsSummary.completedSkills
    : Array.isArray(careerState?.learningData?.completedSkills)
    ? careerState.learningData.completedSkills
    : []

  const verifiedSet = new Set([
    ...verifiedList.map(s => (typeof s === 'string' ? s.toLowerCase() : s?.name?.toLowerCase())),
    ...completedList.map(s => (typeof s === 'string' ? s.toLowerCase() : s?.name?.toLowerCase()))
  ].filter(Boolean))

  const isSkillDone = (sName) => {
    if (!sName) return false
    const lower = sName.toLowerCase()
    if (verifiedSet.has(lower)) return true
    for (const v of verifiedSet) {
      if (v.includes(lower) || lower.includes(v)) return true
    }
    return false
  }

  // 2. Obtain current career roadmap
  const activeRoadmap = (normalizeCareerTitle(careerState?.currentRoadmap?.targetCareer) === normalizedRole && careerState?.currentRoadmap?.phases)
    ? careerState.currentRoadmap
    : generatePersonalizedRoadmap(normalizedRole)

  const phases = activeRoadmap?.phases || []

  // Flatten roadmap skills
  const roadmapSkills = phases.map((p, idx) => {
    const name = p.skill || p.title?.replace(/^Phase \d+:\s*/, '') || `Skill ${idx + 1}`
    const isCompleted = p.isCompleted || isSkillDone(name)
    const isInProgress = !isCompleted && (p.status === 'Active' || idx === 0)
    return {
      phaseNumber: p.phase || idx + 1,
      name,
      skillId: formatSkillId(name),
      isCompleted,
      isInProgress,
      difficulty: (p.estimatedDays || 10) > 14 ? 'Advanced' : (p.estimatedDays || 10) > 7 ? 'Intermediate' : 'Beginner',
      whyMatters: p.completionCriteria || `Essential production skill for ${normalizedRole}.`
    }
  })

  // Check if ALL roadmap skills are completed
  const totalSkillsCount = roadmapSkills.length
  const verifiedSkillsCount = roadmapSkills.filter(s => s.isCompleted).length

  if (totalSkillsCount > 0 && verifiedSkillsCount === totalSkillsCount) {
    return {
      skillId: roadmapSkills[roadmapSkills.length - 1].skillId,
      skillName: roadmapSkills[roadmapSkills.length - 1].name,
      phaseNumber: roadmapSkills[roadmapSkills.length - 1].phaseNumber,
      category: `Phase ${roadmapSkills[roadmapSkills.length - 1].phaseNumber}`,
      status: 'completed',
      isAllCompleted: true,
      verifiedSkillsCount,
      totalSkillsCount,
      targetCareer: normalizedRole,
      message: 'Skills Assessment Complete! All required career skills verified.'
    }
  }

  // PRIORITY 1: Current in-progress skill from profile or context
  if (skillsSummary.currentSkill && !isSkillDone(skillsSummary.currentSkill)) {
    const match = roadmapSkills.find(s => s.name.toLowerCase() === skillsSummary.currentSkill.toLowerCase())
    if (match) {
      return {
        ...match,
        category: `Phase ${match.phaseNumber}`,
        status: 'in-progress',
        isAllCompleted: false,
        verifiedSkillsCount,
        totalSkillsCount,
        targetCareer: normalizedRole
      }
    }
  }

  // PRIORITY 2: In-progress skill from roadmap
  const inProgressRoadmapSkill = roadmapSkills.find(s => s.isInProgress && !s.isCompleted)
  if (inProgressRoadmapSkill) {
    return {
      ...inProgressRoadmapSkill,
      category: `Phase ${inProgressRoadmapSkill.phaseNumber}`,
      status: 'in-progress',
      isAllCompleted: false,
      verifiedSkillsCount,
      totalSkillsCount,
      targetCareer: normalizedRole
    }
  }

  // PRIORITY 3: First unverified skill in current active roadmap phase
  const unverifiedPhaseSkill = roadmapSkills.find(s => !s.isCompleted)
  if (unverifiedPhaseSkill) {
    return {
      ...unverifiedPhaseSkill,
      category: `Phase ${unverifiedPhaseSkill.phaseNumber}`,
      status: 'recommended',
      isAllCompleted: false,
      verifiedSkillsCount,
      totalSkillsCount,
      targetCareer: normalizedRole
    }
  }

  // PRIORITY 4: Recommended next skill from skillsSummary
  if (skillsSummary.recommendedNextSkill && !isSkillDone(skillsSummary.recommendedNextSkill)) {
    const sName = skillsSummary.recommendedNextSkill
    return {
      skillId: formatSkillId(sName),
      skillName: sName,
      phaseNumber: 1,
      category: 'Phase 1',
      status: 'recommended',
      isAllCompleted: false,
      verifiedSkillsCount,
      totalSkillsCount,
      targetCareer: normalizedRole
    }
  }

  // PRIORITY 5: First incomplete skill fallback
  const firstIncomplete = roadmapSkills.find(s => !s.isCompleted) || roadmapSkills[0]
  return {
    skillId: firstIncomplete ? firstIncomplete.skillId : 'sk_general',
    skillName: firstIncomplete ? firstIncomplete.name : 'Core Skill',
    phaseNumber: firstIncomplete ? firstIncomplete.phaseNumber : 1,
    category: `Phase ${firstIncomplete ? firstIncomplete.phaseNumber : 1}`,
    status: 'recommended',
    isAllCompleted: false,
    verifiedSkillsCount,
    totalSkillsCount,
    targetCareer: normalizedRole
  }
}
