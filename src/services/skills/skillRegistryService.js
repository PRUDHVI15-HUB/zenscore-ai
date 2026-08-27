/**
 * skillRegistryService.js
 * Event-Driven Skill Registry Service for ZenScore AI (Phase 7 - Sprint 2).
 * Manages verified skills, pending skills, and missing skill gap calculations.
 */

import { CANONICAL_SKILLS, SKILL_LEVELS } from './skillRegistry'
import { publishActivityEvent, EVENT_TYPES } from './activityEventBus'

export const SKILL_REGISTRY_STORAGE_KEY = 'zenscore_skill_registry_v1.1'

// Target Role Competency Requirements Dictionary
export const ROLE_SKILL_REQUIREMENTS = {
  'Backend Engineer': [
    'Java', 'Spring Boot', 'SQL & PostgreSQL', 'Node.js / Express',
    'Docker', 'Microservices', 'System Design', 'Git & GitHub',
    'REST APIs', 'AWS Cloud Services'
  ],
  'Frontend Engineer': [
    'JavaScript', 'TypeScript', 'React', 'Next.js',
    'TailwindCSS', 'State Management', 'REST APIs', 'Git & GitHub',
    'HTML5 & CSS3', 'Performance Optimization'
  ],
  'Full Stack Developer': [
    'JavaScript', 'TypeScript', 'React', 'Node.js / Express',
    'SQL & PostgreSQL', 'MongoDB', 'Docker', 'REST APIs',
    'Git & GitHub', 'AWS Cloud Services'
  ],
  'AI Engineer': [
    'Python', 'PyTorch', 'RAG Pipelines', 'Vector DB (Qdrant)',
    'FastAPI', 'Prompt Engineering', 'LangChain', 'Docker',
    'Git & GitHub', 'Math & Linear Algebra'
  ],
  'Machine Learning Engineer': [
    'Python', 'PyTorch', 'TensorFlow', 'Scikit-Learn',
    'Pandas & NumPy', 'MLOps & MLflow', 'Docker', 'FastAPI',
    'Git & GitHub', 'Math & Linear Algebra'
  ],
  'Data Scientist': [
    'Python', 'Predictive Modeling', 'SQL & PostgreSQL', 'Scikit-Learn',
    'Data Visualization', 'Pandas & NumPy', 'Statistics', 'Git & GitHub'
  ],
  'Cloud Engineer': [
    'AWS Cloud Services', 'Docker', 'Kubernetes', 'Terraform IaC',
    'Linux & Bash', 'CI/CD Pipelines', 'Git & GitHub', 'Networking'
  ],
  'DevOps Engineer': [
    'Docker', 'Kubernetes', 'CI/CD Pipelines', 'Terraform IaC',
    'Linux & Bash', 'Prometheus & Grafana', 'Git & GitHub', 'AWS Cloud Services'
  ],
  'Cybersecurity Engineer': [
    'Network Security', 'SIEM Threat Detection', 'Cryptography', 'Linux & Bash',
    'Ethical Hacking', 'OWASP Top 10', 'Python', 'Git & GitHub'
  ]
}

/**
 * Retrieves skill registry state from LocalStorage.
 */
export function getSkillRegistryState() {
  try {
    const cached = localStorage.getItem(SKILL_REGISTRY_STORAGE_KEY)
    if (cached) return JSON.parse(cached)
  } catch (e) {
    console.warn('[SkillRegistryService] LocalStorage read error:', e)
  }

  // Zero-progress default schema for new students
  const defaultState = {
    verifiedSkills: [],
    pendingSkills: [],
    skillHistory: [],
    lastUpdated: new Date().toISOString()
  }

  saveSkillRegistryState(defaultState)
  return defaultState
}

/**
 * Persists skill registry state to LocalStorage.
 */
export function saveSkillRegistryState(stateObj) {
  try {
    localStorage.setItem(SKILL_REGISTRY_STORAGE_KEY, JSON.stringify(stateObj))
  } catch (e) {
    console.warn('[SkillRegistryService] LocalStorage write error:', e)
  }
}

/**
 * Checks if a specific skill is verified.
 */
export function isSkillVerified(skillName) {
  if (!skillName) return false
  const state = getSkillRegistryState()
  return state.verifiedSkills.some(s => s.skillName === skillName || s.skillId === skillName)
}

/**
 * Gets array of all verified skill names.
 */
export function getVerifiedSkills() {
  const state = getSkillRegistryState()
  return state.verifiedSkills.map(s => s.skillName || s.skillId)
}

/**
 * Gets count of verified skills.
 */
export function getVerifiedSkillCount() {
  const state = getSkillRegistryState()
  return state.verifiedSkills.length
}

/**
 * Gets missing unverified skills for a target career role.
 */
export function getMissingSkills(targetRole = 'Backend Engineer') {
  const required = ROLE_SKILL_REQUIREMENTS[targetRole] || ROLE_SKILL_REQUIREMENTS['Backend Engineer']
  const verified = getVerifiedSkills()
  return required.filter(skill => !verified.includes(skill))
}

/**
 * Verifies a skill upon verified user activity.
 * Publishes SKILL_VERIFIED activity event.
 *
 * @param {string} skillName - Name of the skill
 * @param {Object} sourceDetails - Activity metadata (source: 'COURSE' | 'QUIZ' | 'CODING_LAB' | 'PROJECT')
 */
export function verifySkill(skillName, sourceDetails = {}) {
  if (!skillName) return

  const state = getSkillRegistryState()
  const existing = state.verifiedSkills.find(s => s.skillName === skillName || s.skillId === skillName)

  if (existing) {
    // Already verified - update level if higher
    existing.level = sourceDetails.level || existing.level || SKILL_LEVELS.MASTERED
    existing.lastUpdated = new Date().toISOString()
    saveSkillRegistryState(state)
    return existing
  }

  const newVerifiedSkill = {
    skillId: skillName,
    skillName,
    level: sourceDetails.level || SKILL_LEVELS.INTERMEDIATE,
    category: CANONICAL_SKILLS[skillName]?.category || 'Engineering Core',
    verifiedAt: new Date().toISOString(),
    source: sourceDetails.source || 'LMS Activity',
    xpEarned: sourceDetails.xpEarned || 150,
  }

  state.verifiedSkills.push(newVerifiedSkill)
  state.skillHistory.push({
    action: 'VERIFIED',
    skillName,
    source: sourceDetails.source || 'LMS Activity',
    timestamp: new Date().toISOString(),
  })
  state.lastUpdated = new Date().toISOString()

  saveSkillRegistryState(state)

  return newVerifiedSkill
}
