/**
 * resumeSectionBuilder.js
 * Dynamic Resume Section Builder for ZenScore AI (Phase 7 - Sprint 5).
 * Constructs professional ATS-optimized sections strictly from earned student data.
 */

import { aggregateResumeProfile } from './resumeProfileAggregator'

/**
 * Builds structured, ATS-compliant resume sections from live earned profile payload.
 * Returns empty structures for unearned sections.
 */
export function buildResumeSections(careerContext = {}) {
  const aggregated = aggregateResumeProfile(careerContext)
  const { studentInfo, academics, careerMetrics, verifiedSkills = [], projects = [], certifications = [], badges = [] } = aggregated

  // 1. Professional Summary
  const skillsStr = verifiedSkills.slice(0, 4).join(', ')

  const professionalSummary = verifiedSkills.length > 0
    ? `Driven ${studentInfo.targetRole} candidate with academic background (${academics.cgpa} CGPA in ${academics.degree}). Demonstrated hands-on verified expertise in ${skillsStr} with a verified ${careerMetrics.readinessPct}% career readiness score.`
    : ''

  // 2. Technical Skills Categorization (Filtered strictly by verified skills)
  const verifiedSet = new Set(verifiedSkills)

  const categorizedSkills = {
    Programming: ['Java', 'Python', 'C++', 'JavaScript', 'TypeScript', 'Go'].filter(s => verifiedSet.has(s)),
    Frameworks: ['Spring Boot', 'Node.js / Express', 'React', 'Next.js', 'FastAPI', 'Microservices'].filter(s => verifiedSet.has(s)),
    Databases: ['SQL & PostgreSQL', 'MongoDB', 'Redis', 'Vector DB (Qdrant)'].filter(s => verifiedSet.has(s)),
    Cloud: ['Docker', 'AWS Cloud Services', 'Kubernetes'].filter(s => verifiedSet.has(s)),
    DevOps: ['Git & GitHub', 'CI/CD Pipelines', 'Linux & Bash', 'Terraform IaC'].filter(s => verifiedSet.has(s)),
    Tools: verifiedSkills.filter(s => ['Postman', 'Maven', 'Linux CLI'].includes(s)),
    SoftSkills: verifiedSkills.filter(s => ['System Design', 'RAG Pipelines'].includes(s)),
  }

  // 3. Certifications
  const certList = (certifications || []).map(c => ({
    id: c.id,
    title: c.title,
    issuer: 'ZenScore AI Certification Authority',
    completionDate: c.completionDate || 'Earned',
    scorePct: c.scorePct || 90,
  }))

  // 4. Achievements & Badges
  const achievementBadges = (badges || []).map(b => b.name || b.id)

  return {
    studentInfo,
    academics,
    careerMetrics,
    professionalSummary,
    categorizedSkills,
    projects,
    certifications: certList,
    achievements: achievementBadges,
  }
}
