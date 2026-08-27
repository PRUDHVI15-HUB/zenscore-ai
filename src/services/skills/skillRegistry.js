/**
 * skillRegistry.js
 * Centralized Canonical Skill Registry for ZenScore AI.
 * Defines skill metadata, categories, levels, and verification sources.
 */

export const SKILL_CATEGORIES = {
  PROGRAMMING: 'Programming Languages',
  FRAMEWORKS: 'Frameworks & Architecture',
  DATABASES: 'Databases & Storage',
  CLOUD: 'Cloud & Infrastructure',
  DEVOPS: 'DevOps & Tooling',
  SOFT_SKILLS: 'Engineering Core & System Design',
}

export const SKILL_LEVELS = {
  NOT_STARTED: 'Not Started',
  LEARNING: 'In Progress',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  MASTERED: 'Mastered',
}

// Canonical Skill Dictionary
export const CANONICAL_SKILLS = {
  // Backend & General Programming
  Java: { category: SKILL_CATEGORIES.PROGRAMMING, defaultLevel: SKILL_LEVELS.MASTERED, priority: 'HIGH' },
  Python: { category: SKILL_CATEGORIES.PROGRAMMING, defaultLevel: SKILL_LEVELS.INTERMEDIATE, priority: 'MEDIUM' },
  'C++': { category: SKILL_CATEGORIES.PROGRAMMING, defaultLevel: SKILL_LEVELS.INTERMEDIATE, priority: 'MEDIUM' },
  Go: { category: SKILL_CATEGORIES.PROGRAMMING, defaultLevel: SKILL_LEVELS.NOT_STARTED, priority: 'MEDIUM' },
  JavaScript: { category: SKILL_CATEGORIES.PROGRAMMING, defaultLevel: SKILL_LEVELS.MASTERED, priority: 'HIGH' },
  TypeScript: { category: SKILL_CATEGORIES.PROGRAMMING, defaultLevel: SKILL_LEVELS.ADVANCED, priority: 'HIGH' },

  // Frameworks
  'Spring Boot': { category: SKILL_CATEGORIES.FRAMEWORKS, defaultLevel: SKILL_LEVELS.ADVANCED, priority: 'HIGH' },
  'Node.js / Express': { category: SKILL_CATEGORIES.FRAMEWORKS, defaultLevel: SKILL_LEVELS.INTERMEDIATE, priority: 'HIGH' },
  React: { category: SKILL_CATEGORIES.FRAMEWORKS, defaultLevel: SKILL_LEVELS.MASTERED, priority: 'HIGH' },
  'Next.js': { category: SKILL_CATEGORIES.FRAMEWORKS, defaultLevel: SKILL_LEVELS.LEARNING, priority: 'HIGH' },
  FastAPI: { category: SKILL_CATEGORIES.FRAMEWORKS, defaultLevel: SKILL_LEVELS.INTERMEDIATE, priority: 'MEDIUM' },
  Microservices: { category: SKILL_CATEGORIES.FRAMEWORKS, defaultLevel: SKILL_LEVELS.LEARNING, priority: 'HIGH' },

  // Databases
  'SQL & PostgreSQL': { category: SKILL_CATEGORIES.DATABASES, defaultLevel: SKILL_LEVELS.MASTERED, priority: 'HIGH' },
  MongoDB: { category: SKILL_CATEGORIES.DATABASES, defaultLevel: SKILL_LEVELS.ADVANCED, priority: 'MEDIUM' },
  Redis: { category: SKILL_CATEGORIES.DATABASES, defaultLevel: SKILL_LEVELS.NOT_STARTED, priority: 'HIGH' },
  'Vector DB (Qdrant)': { category: SKILL_CATEGORIES.DATABASES, defaultLevel: SKILL_LEVELS.NOT_STARTED, priority: 'MEDIUM' },

  // Cloud & DevOps
  Docker: { category: SKILL_CATEGORIES.CLOUD, defaultLevel: SKILL_LEVELS.NOT_STARTED, priority: 'HIGH' },
  'AWS Cloud Services': { category: SKILL_CATEGORIES.CLOUD, defaultLevel: SKILL_LEVELS.INTERMEDIATE, priority: 'HIGH' },
  Kubernetes: { category: SKILL_CATEGORIES.CLOUD, defaultLevel: SKILL_LEVELS.NOT_STARTED, priority: 'MEDIUM' },
  'Git & GitHub': { category: SKILL_CATEGORIES.DEVOPS, defaultLevel: SKILL_LEVELS.MASTERED, priority: 'HIGH' },
  'CI/CD Pipelines': { category: SKILL_CATEGORIES.DEVOPS, defaultLevel: SKILL_LEVELS.LEARNING, priority: 'MEDIUM' },
  'Linux & Bash': { category: SKILL_CATEGORIES.DEVOPS, defaultLevel: SKILL_LEVELS.INTERMEDIATE, priority: 'MEDIUM' },

  // System Design & AI
  'System Design': { category: SKILL_CATEGORIES.SOFT_SKILLS, defaultLevel: SKILL_LEVELS.NOT_STARTED, priority: 'HIGH' },
  'RAG Pipelines': { category: SKILL_CATEGORIES.SOFT_SKILLS, defaultLevel: SKILL_LEVELS.NOT_STARTED, priority: 'MEDIUM' },
  PyTorch: { category: SKILL_CATEGORIES.SOFT_SKILLS, defaultLevel: SKILL_LEVELS.NOT_STARTED, priority: 'MEDIUM' },
}

const REGISTRY_STORAGE_KEY = 'zenscore_skill_registry'

/**
 * Get all registered skills with persistent user modifications.
 */
export function getRegisteredSkills() {
  try {
    const saved = localStorage.getItem(REGISTRY_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return { ...CANONICAL_SKILLS, ...parsed }
    }
  } catch (e) {
    console.warn('[SkillRegistry] localStorage read error:', e)
  }
  return { ...CANONICAL_SKILLS }
}

/**
 * Updates a skill's status, confidence, and verification source in the registry.
 */
export function registerSkillUpdate(skillName, level, confidence = 85, source = 'User Activity') {
  const currentRegistry = getRegisteredSkills()
  const existing = currentRegistry[skillName] || {
    category: SKILL_CATEGORIES.PROGRAMMING,
    priority: 'MEDIUM',
  }

  const updatedSkill = {
    ...existing,
    name: skillName,
    level,
    confidence,
    source,
    updatedAt: new Date().toISOString(),
  }

  const nextRegistry = { ...currentRegistry, [skillName]: updatedSkill }

  try {
    localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(nextRegistry))
  } catch (e) {
    console.warn('[SkillRegistry] localStorage save error:', e)
  }

  return nextRegistry
}
