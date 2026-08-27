/**
 * skillReadinessCalculator.js
 * Live Skill Readiness Calculator for ZenScore AI Product 3 (Skill Gap Analyzer).
 * Evaluates aggregated student profile against active target career requirements.
 */

import { aggregateStudentSkills } from './skillAggregator'
import { SKILL_CATEGORIES, SKILL_LEVELS } from './skillRegistry'
import { normalizeCareerTitle } from '../careers/careerNormalizer'

// Career Requirements Database
const CAREER_REQUIREMENTS = {
  'Backend Engineer': {
    requiredSkills: ['Java', 'Spring Boot', 'SQL & PostgreSQL', 'Docker', 'Redis', 'Kubernetes', 'Git & GitHub', 'Microservices', 'AWS Cloud Services', 'System Design'],
    highPriorityMissing: ['Docker', 'Redis', 'System Design'],
    learningTimeline: [
      { stage: 'Priority 1', skill: 'Docker Containers', duration: '2 Weeks', difficulty: 'Medium' },
      { stage: 'Priority 2', skill: 'Redis In-Memory Cache', duration: '2 Weeks', difficulty: 'Medium' },
      { stage: 'Priority 3', skill: 'AWS Core Infrastructure', duration: '3 Weeks', difficulty: 'Hard' },
      { stage: 'Priority 4', skill: 'High Scalability System Design', duration: '4 Weeks', difficulty: 'Hard' },
    ],
  },
  'Frontend Engineer': {
    requiredSkills: ['React', 'TypeScript', 'JavaScript', 'Next.js', 'HTML5 & CSS3', 'Git & GitHub', 'Tailwind CSS', 'Core Web Vitals'],
    highPriorityMissing: ['Next.js', 'Core Web Vitals'],
    learningTimeline: [
      { stage: 'Priority 1', skill: 'Next.js App Router', duration: '2 Weeks', difficulty: 'Medium' },
      { stage: 'Priority 2', skill: 'Core Web Vitals & Performance', duration: '1.5 Weeks', difficulty: 'Medium' },
      { stage: 'Priority 3', skill: 'Jest & React Testing Library', duration: '2 Weeks', difficulty: 'Medium' },
    ],
  },
  'Full Stack Developer': {
    requiredSkills: ['React', 'Node.js / Express', 'SQL & PostgreSQL', 'MongoDB', 'Docker', 'TypeScript', 'Git & GitHub', 'AWS Cloud Services'],
    highPriorityMissing: ['Docker', 'AWS Cloud Services'],
    learningTimeline: [
      { stage: 'Priority 1', skill: 'Docker Containers', duration: '2 Weeks', difficulty: 'Medium' },
      { stage: 'Priority 2', skill: 'AWS Infrastructure', duration: '3 Weeks', difficulty: 'Hard' },
      { stage: 'Priority 3', skill: 'TypeScript Enterprise Patterns', duration: '2 Weeks', difficulty: 'Medium' },
    ],
  },
  'AI Engineer': {
    requiredSkills: ['Python', 'PyTorch', 'FastAPI', 'RAG Pipelines', 'Vector DB (Qdrant)', 'SQL & PostgreSQL', 'Git & GitHub', 'Docker'],
    highPriorityMissing: ['RAG Pipelines', 'Vector DB (Qdrant)', 'PyTorch'],
    learningTimeline: [
      { stage: 'Priority 1', skill: 'RAG Architecture & LangChain', duration: '3 Weeks', difficulty: 'Hard' },
      { stage: 'Priority 2', skill: 'Qdrant Vector Database', duration: '2 Weeks', difficulty: 'Medium' },
      { stage: 'Priority 3', skill: 'PyTorch Model Fine-tuning', duration: '4 Weeks', difficulty: 'Hard' },
    ],
  },
  'AI / ML Engineer': {
    requiredSkills: ['Python', 'PyTorch', 'FastAPI', 'RAG Pipelines', 'Vector DB (Qdrant)', 'SQL & PostgreSQL', 'Git & GitHub', 'Docker'],
    highPriorityMissing: ['RAG Pipelines', 'Vector DB (Qdrant)', 'PyTorch'],
    learningTimeline: [
      { stage: 'Priority 1', skill: 'RAG Architecture & LangChain', duration: '3 Weeks', difficulty: 'Hard' },
      { stage: 'Priority 2', skill: 'Qdrant Vector Database', duration: '2 Weeks', difficulty: 'Medium' },
      { stage: 'Priority 3', skill: 'PyTorch Model Fine-tuning', duration: '4 Weeks', difficulty: 'Hard' },
    ],
  },
  'Machine Learning Engineer': {
    requiredSkills: ['Python', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'FastAPI', 'MLOps & MLflow', 'Git & GitHub', 'Docker'],
    highPriorityMissing: ['PyTorch', 'MLOps & MLflow', 'TensorFlow'],
    learningTimeline: [
      { stage: 'Priority 1', skill: 'PyTorch Deep Learning', duration: '3 Weeks', difficulty: 'Hard' },
      { stage: 'Priority 2', skill: 'MLOps & Model Deployment', duration: '2 Weeks', difficulty: 'Medium' },
      { stage: 'Priority 3', skill: 'TensorFlow & Keras', duration: '3 Weeks', difficulty: 'Hard' },
    ],
  },
  'DevOps Engineer': {
    requiredSkills: ['Docker', 'Kubernetes', 'AWS Cloud Services', 'CI/CD Pipelines', 'Linux & Bash', 'Python', 'Git & GitHub', 'Terraform'],
    highPriorityMissing: ['Docker', 'Kubernetes', 'CI/CD Pipelines'],
    learningTimeline: [
      { stage: 'Priority 1', skill: 'Docker Containerization', duration: '2 Weeks', difficulty: 'Medium' },
      { stage: 'Priority 2', skill: 'Kubernetes Cluster Management', duration: '3 Weeks', difficulty: 'Hard' },
      { stage: 'Priority 3', skill: 'GitHub Actions & CI/CD', duration: '2 Weeks', difficulty: 'Medium' },
    ],
  },
  'DevOps & SRE Engineer': {
    requiredSkills: ['Docker', 'Kubernetes', 'AWS Cloud Services', 'CI/CD Pipelines', 'Linux & Bash', 'Python', 'Git & GitHub', 'Terraform'],
    highPriorityMissing: ['Docker', 'Kubernetes', 'CI/CD Pipelines'],
    learningTimeline: [
      { stage: 'Priority 1', skill: 'Docker Containerization', duration: '2 Weeks', difficulty: 'Medium' },
      { stage: 'Priority 2', skill: 'Kubernetes Cluster Management', duration: '3 Weeks', difficulty: 'Hard' },
      { stage: 'Priority 3', skill: 'GitHub Actions & CI/CD', duration: '2 Weeks', difficulty: 'Medium' },
    ],
  },
  'Data Scientist': {
    requiredSkills: ['Python', 'SQL & PostgreSQL', 'Pandas & NumPy', 'Machine Learning', 'Data Visualization', 'Git & GitHub', 'Scikit-Learn'],
    highPriorityMissing: ['Pandas & NumPy', 'Machine Learning', 'Data Visualization'],
    learningTimeline: [
      { stage: 'Priority 1', skill: 'Pandas & Exploratory Data Analysis', duration: '2 Weeks', difficulty: 'Medium' },
      { stage: 'Priority 2', skill: 'Machine Learning Algorithms & Scikit-Learn', duration: '3 Weeks', difficulty: 'Hard' },
      { stage: 'Priority 3', skill: 'Interactive Data Dashboards', duration: '2 Weeks', difficulty: 'Medium' },
    ],
  },
  'Cloud Engineer': {
    requiredSkills: ['AWS Cloud Services', 'Linux & Bash', 'Docker', 'Python', 'Git & GitHub', 'Kubernetes', 'Terraform'],
    highPriorityMissing: ['Docker', 'Kubernetes', 'Terraform'],
    learningTimeline: [
      { stage: 'Priority 1', skill: 'Docker Containers', duration: '2 Weeks', difficulty: 'Medium' },
      { stage: 'Priority 2', skill: 'AWS VPC & Cloud Architecture', duration: '3 Weeks', difficulty: 'Hard' },
      { stage: 'Priority 3', skill: 'Kubernetes Container Orchestration', duration: '3 Weeks', difficulty: 'Hard' },
    ],
  },
  'Cybersecurity Engineer': {
    requiredSkills: ['Linux & Bash', 'Cybersecurity Fundamentals', 'SIEM & Threat Detection', 'Ethical Hacking', 'Network Security', 'Python', 'Git & GitHub'],
    highPriorityMissing: ['SIEM & Threat Detection', 'Ethical Hacking', 'Network Security'],
    learningTimeline: [
      { stage: 'Priority 1', skill: 'Network Security Protocols', duration: '2 Weeks', difficulty: 'Medium' },
      { stage: 'Priority 2', skill: 'SIEM & Log Monitoring', duration: '2.5 Weeks', difficulty: 'Hard' },
      { stage: 'Priority 3', skill: 'Ethical Hacking & Penetration Testing', duration: '3 Weeks', difficulty: 'Hard' },
    ],
  },
}

/**
 * Calculates real-time skill readiness analytics for Product 3.
 *
 * @param {string} targetCareer - Target career title
 * @param {Object} contextData - Live CareerContext state
 * @returns {Object} Complete live skill gap report object
 */
export function calculateSkillReadiness(targetCareer = 'Backend Engineer', contextData = {}) {
  const canonicalRole = normalizeCareerTitle(targetCareer)
  const aggregatedSkills = aggregateStudentSkills(contextData)
  const roleConfig = CAREER_REQUIREMENTS[canonicalRole] || CAREER_REQUIREMENTS[targetCareer] || CAREER_REQUIREMENTS['Backend Engineer']

  const requiredSkillNames = roleConfig.requiredSkills
  let totalPoints = 0
  let currentCount = 0

  const categoriesMap = {}

  // Process required skills against aggregated student profile
  requiredSkillNames.forEach(sName => {
    const studentSkill = aggregatedSkills[sName] || {
      name: sName,
      category: SKILL_CATEGORIES.PROGRAMMING,
      level: SKILL_LEVELS.NOT_STARTED,
      percentage: 0,
    }

    const catName = studentSkill.category || SKILL_CATEGORIES.PROGRAMMING
    if (!categoriesMap[catName]) {
      categoriesMap[catName] = { name: catName, skills: [] }
    }

    categoriesMap[catName].skills.push({
      name: sName,
      level: studentSkill.percentage,
      status: studentSkill.level,
    })

    if (studentSkill.percentage >= 50) {
      currentCount += 1
    }
    totalPoints += studentSkill.percentage
  })

  // Grouped Categories List
  const categoriesList = Object.values(categoriesMap)

  // Compute Overall Readiness Score (Dynamic 0–100%)
  const maxPossible = requiredSkillNames.length * 100
  const readinessScore = maxPossible > 0 ? Math.min(100, Math.round((totalPoints / maxPossible) * 100)) : 0

  // Identify Missing Skills
  const missingSkills = requiredSkillNames
    .filter(sName => !aggregatedSkills[sName] || aggregatedSkills[sName].percentage < 50)
    .map(sName => {
      const isHigh = roleConfig.highPriorityMissing.includes(sName)
      return {
        name: sName,
        priority: isHigh ? 'HIGH' : 'MEDIUM',
        time: isHigh ? '2 Weeks' : '3 Weeks',
        reason: `Essential requirement for 85%+ of ${targetCareer} postings.`,
      }
    })

  // AI Actionable Recommendations based on live gaps
  const aiRecommendations = missingSkills.slice(0, 3).map((m, idx) => {
    if (idx === 0) return `Master ${m.name} containers/tools first before advancing to complex cloud deployment.`
    if (idx === 1) return `Build a hands-on project utilizing ${m.name} to prove practical engineering competency.`
    return `Review ${m.name} core patterns to increase your ${targetCareer} readiness above 85%.`
  })

  if (aiRecommendations.length === 0) {
    aiRecommendations.push(`Congratulations! Your profile exhibits high overall readiness for ${targetCareer}. Focus on mock interviews and System Design.`)
  }

  // Verified Strengths
  const strengths = Object.values(aggregatedSkills)
    .filter(s => s.percentage >= 80)
    .map(s => `Strong ${s.name} Competency (${s.level})`)

  if (strengths.length === 0) {
    strengths.push('Demonstrated learning capability and core programming fundamentals')
  }

  return {
    targetCareer,
    readiness: readinessScore,
    currentCount,
    requiredCount: requiredSkillNames.length,
    missingCount: missingSkills.length,
    categories: categoriesList,
    missingSkills,
    aiRecommendations,
    learningTimeline: roleConfig.learningTimeline,
    strengths,
  }
}
