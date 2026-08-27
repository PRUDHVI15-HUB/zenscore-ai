/**
 * roadmapGenerator.js
 * Dynamic Roadmap Generator for ZenScore AI.
 * Transforms Skill Gap Intelligence, Industry Priority Queue & Learning Recommendations
 * into a fully structured, data-driven Learning Roadmap.
 */

import { calculateSkillReadiness } from './skillReadinessCalculator'
import { normalizeCareerTitle } from '../careers/careerNormalizer'

export const ROADMAP_VERSION = 'v1.1'

const DEFAULT_ROLE_SKILLS = {
  'Frontend Engineer': ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Core Web Vitals'],
  'Backend Engineer': ['Docker', 'Redis', 'AWS Cloud Services', 'System Design', 'Microservices'],
  'Full Stack Developer': ['React', 'Node.js', 'MongoDB', 'Docker', 'AWS Cloud Services'],
  'AI Engineer': ['Python', 'PyTorch', 'RAG Pipelines', 'Vector DB (Qdrant)', 'FastAPI'],
  'Machine Learning Engineer': ['Python', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'MLOps & MLflow'],
  'DevOps Engineer': ['Docker', 'Kubernetes', 'CI/CD Pipelines', 'AWS Cloud Services', 'Terraform'],
  'Data Scientist': ['Python', 'SQL & PostgreSQL', 'Pandas & NumPy', 'Machine Learning', 'Data Visualization'],
  'Cloud Engineer': ['AWS Cloud Services', 'Linux & Bash', 'Docker', 'Kubernetes', 'Terraform'],
  'Cybersecurity Engineer': ['Linux & Bash', 'Cybersecurity Fundamentals', 'SIEM & Threat Detection', 'Ethical Hacking', 'Network Security'],
  'Product Manager': ['Product Strategy', 'Agile & Scrum', 'User Analytics', 'A/B Testing', 'System Architecture']
}

/**
 * Generates a complete data-driven personalized learning roadmap.
 *
 * @param {string} targetCareer - Selected career title
 * @param {Object} contextData - Live student profile & Skill Gap state
 * @returns {Object} Structured roadmap object containing phases, progress, and metadata
 */
export function generatePersonalizedRoadmap(targetCareer = 'Backend Engineer', contextData = {}) {
  const canonicalRole = normalizeCareerTitle(targetCareer)
  const readinessReport = calculateSkillReadiness(canonicalRole, contextData)
  const missingSkills = readinessReport.missingSkills || []

  const fallbackSkills = DEFAULT_ROLE_SKILLS[canonicalRole] || DEFAULT_ROLE_SKILLS['Backend Engineer']

  // Default initial phases based on target career if no missing skills returned
  const defaultSkills = missingSkills.length > 0
    ? missingSkills.map(m => m.name)
    : fallbackSkills

  let accumulatedDays = 0

  const phases = defaultSkills.map((sName, idx) => {
    const isFirst = idx === 0
    const phaseNum = idx + 1
    const estDays = (idx + 1) * 5 + 2
    accumulatedDays += estDays

    return {
      phase: phaseNum,
      title: `Phase ${phaseNum}: ${sName} Enterprise Mastery`,
      skill: sName,
      estimatedDays: estDays,
      status: isFirst ? 'Active' : 'Locked',
      isUnlocked: isFirst,
      isCompleted: false,
      xp: 150 + idx * 50,
      completionCriteria: `Build & verify a working production project integrating ${sName}.`,
      resources: {
        docs: `https://docs.${sName.toLowerCase().replace(/[^a-z]/g, '')}.com`,
        youtube: `${sName} Complete Masterclass`,
        practice: `Interactive ${sName} Playground`,
        github: `awesome-${sName.toLowerCase().replace(/[^a-z]/g, '')}`,
      },
      projects: {
        beginner: `Build & run a basic ${sName} proof-of-concept module`,
        intermediate: `Integrate ${sName} into your existing Spring Boot / Node.js backend`,
        advanced: `Deploy high-availability ${sName} microservice with automated healthchecks`,
      },
      interviewTasks: [
        `Explain core architecture & trade-offs of ${sName}`,
        `Solve hands-on practical troubleshooting task for ${sName}`,
        `Configure production-ready deployment settings for ${sName}`,
      ],
      dailyMission: {
        title: `Master ${sName} Core Fundamentals`,
        desc: `Complete interactive hands-on lab for ${sName} and implement key features.`,
        time: '45 Mins',
        xp: 150,
      },
    }
  })

  const currentPhase = phases.find(p => p.status === 'Active') || phases[0] || {
    phase: 1,
    title: 'Phase 1: Core Engineering Foundations',
    skill: 'Core Engineering',
    dailyMission: { title: 'Review Core Backend Architecture', desc: 'Implement REST controllers.', time: '45 Mins', xp: 150 },
  }

  const completedPhasesCount = phases.filter(p => p.isCompleted).length
  const roadmapProgress = phases.length > 0 ? Math.round((completedPhasesCount / phases.length) * 100) : 0

  return {
    version: ROADMAP_VERSION,
    targetCareer,
    generatedAt: new Date().toISOString(),
    estimatedCompletionDays: accumulatedDays,
    roadmapProgress,
    currentPhase,
    phases,
  }
}
