/**
 * resumeCareerLearningResolver.js
 * =========================================================================
 * Centralized Learning Priority Engine bridging Real Resume Analysis,
 * Target Career Requirements, Skills Roadmap, and Courses Registry.
 *
 * Rules:
 *   - Analytical & Read-only: Does NOT mutate verified skill status directly.
 *   - Data-Driven: Evaluates Resume Skills vs Verified Skills vs Target Career Requirements.
 *   - Real Routes: Uses valid platform routes (/skills, /courses, /careers/learning).
 */

const CAREER_SKILLS_MAP = {
  'Frontend Developer': ['JavaScript', 'TypeScript', 'React', 'HTML', 'CSS', 'Tailwind CSS', 'Next.js', 'Git', 'REST API'],
  'Frontend Engineer': ['JavaScript', 'TypeScript', 'React', 'HTML', 'CSS', 'Tailwind CSS', 'Next.js', 'Git', 'REST API'],
  'Backend Developer': ['Node.js', 'Express', 'Python', 'Java', 'SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'REST API', 'Git'],
  'Backend Engineer': ['Node.js', 'Express', 'Python', 'Java', 'SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'REST API', 'Git'],
  'Full Stack Developer': ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'SQL', 'MongoDB', 'HTML', 'CSS', 'Docker', 'Git'],
  'Full Stack Engineer': ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'SQL', 'MongoDB', 'HTML', 'CSS', 'Docker', 'Git'],
  'AI Engineer': ['Python', 'PyTorch', 'TensorFlow', 'LLM', 'RAG', 'LangChain', 'FastAPI', 'Vector DB', 'SQL', 'Git', 'Docker'],
  'AI / ML Engineer': ['Python', 'PyTorch', 'TensorFlow', 'LLM', 'RAG', 'LangChain', 'FastAPI', 'Vector DB', 'SQL', 'Git', 'Docker'],
  'Data Scientist': ['Python', 'R', 'SQL', 'Pandas', 'NumPy', 'Scikit-Learn', 'TensorFlow', 'Tableau', 'Power BI', 'Git'],
  'DevOps Engineer': ['Docker', 'Kubernetes', 'AWS', 'Linux', 'CI/CD', 'Terraform', 'Ansible', 'Git', 'Python', 'Shell Scripting'],
  'Game Developer': ['C++', 'C#', 'Unity', 'Unreal Engine', 'OpenGL', 'Data Structures', 'Git', '3D Math']
}

// Map of canonical skills to platform routes / slugs
const KNOWN_SKILL_SLUGS = {
  'React': 'react',
  'TypeScript': 'typescript',
  'JavaScript': 'javascript',
  'Node.js': 'nodejs',
  'Express': 'express',
  'Python': 'python',
  'PyTorch': 'pytorch',
  'Docker': 'docker',
  'Kubernetes': 'kubernetes',
  'AWS': 'aws',
  'SQL': 'sql',
  'PostgreSQL': 'postgresql',
  'MongoDB': 'mongodb',
  'Next.js': 'nextjs',
  'REST API': 'rest-api',
  'Git': 'git'
}

/**
 * Normalizes skill strings to match canonical naming.
 */
export function normalizeSkillName(name) {
  if (!name) return ''
  const trimmed = name.trim()
  const lower = trimmed.toLowerCase()
  if (lower === 'js' || lower === 'reactjs') return 'React'
  if (lower === 'ts') return 'TypeScript'
  if (lower === 'node' || lower === 'nodejs') return 'Node.js'
  if (lower === 'py') return 'Python'
  if (lower === 'postgres') return 'PostgreSQL'
  return trimmed
}

/**
 * Compares target career requirements against student resume skills and verified skills.
 */
export function getResumeSkillGaps(resumeSkills = [], targetCareer = 'Full Stack Developer', verifiedSkills = []) {
  const required = CAREER_SKILLS_MAP[targetCareer] || CAREER_SKILLS_MAP['Full Stack Developer']
  const normalizedResumeSkills = (resumeSkills || []).map(normalizeSkillName)
  const normalizedVerifiedSkills = (verifiedSkills || []).map(normalizeSkillName)

  const resumeLower = normalizedResumeSkills.map(s => s.toLowerCase())
  const verifiedLower = normalizedVerifiedSkills.map(s => s.toLowerCase())

  const matchedResumeSkills = []
  const missingResumeSkills = []
  const verifiedMissingSkills = []
  const unverifiedResumeSkills = []

  for (const reqSkill of required) {
    const isPresentOnResume = resumeLower.includes(reqSkill.toLowerCase())
    const isVerified = verifiedLower.includes(reqSkill.toLowerCase())

    if (isPresentOnResume) {
      matchedResumeSkills.push(reqSkill)
      if (!isVerified) {
        unverifiedResumeSkills.push(reqSkill)
      }
    } else {
      missingResumeSkills.push(reqSkill)
    }

    if (!isVerified) {
      verifiedMissingSkills.push(reqSkill)
    }
  }

  const matchRatio = required.length > 0 ? matchedResumeSkills.length / required.length : 0
  const matchScore = Math.round(matchRatio * 100)

  return {
    targetCareer,
    requiredSkills: required,
    matchedResumeSkills,
    missingResumeSkills,
    unverifiedResumeSkills,
    verifiedMissingSkills,
    matchScore
  }
}

/**
 * Calculates prioritized skill gaps with actionable metadata.
 */
export function getPrioritizedSkillGaps(resumeSkills = [], verifiedSkills = [], targetCareer = 'Full Stack Developer', enrolledSkills = [], completedSkills = []) {
  const gapsReport = getResumeSkillGaps(resumeSkills, targetCareer, verifiedSkills)
  const completedLower = (completedSkills || []).map(s => normalizeSkillName(s).toLowerCase())
  const enrolledLower = (enrolledSkills || []).map(s => normalizeSkillName(s).toLowerCase())

  const prioritized = []

  // 1. CRITICAL Gaps: Required for target career & completely absent from resume & not verified
  for (const skill of gapsReport.missingResumeSkills) {
    const sLower = skill.toLowerCase()
    if (completedLower.includes(sLower)) continue // Skip if already completed in platform

    const slug = KNOWN_SKILL_SLUGS[skill] || null
    prioritized.push({
      skill,
      priority: 'CRITICAL',
      reason: `Required for ${targetCareer} and absent from your uploaded resume.`,
      careerImpact: `Boosts ${targetCareer} match score by +${Math.round(100 / gapsReport.requiredSkills.length)}%`,
      resumeStatus: 'Absent from Resume',
      verificationStatus: 'Unverified',
      isEnrolled: enrolledLower.includes(sLower),
      learningPath: slug ? `/skills/${slug}` : '/skills',
      coursePath: '/courses'
    })
  }

  // 2. HIGH Gaps: Listed on resume BUT NOT verified in Skills module (Verification Gap)
  for (const skill of gapsReport.unverifiedResumeSkills) {
    const sLower = skill.toLowerCase()
    if (completedLower.includes(sLower)) continue

    const slug = KNOWN_SKILL_SLUGS[skill] || null
    prioritized.push({
      skill,
      priority: 'HIGH',
      reason: `Listed on your resume, but requires formal skill verification assessment.`,
      careerImpact: 'Validates recruiter credibility and unlocks advanced job match badges.',
      resumeStatus: 'Listed on Resume',
      verificationStatus: 'Verification Needed',
      isEnrolled: enrolledLower.includes(sLower),
      learningPath: slug ? `/skills/${slug}` : '/skills',
      coursePath: '/courses'
    })
  }

  return prioritized
}

/**
 * Resolves top recommended skill for learning hub & next best action.
 */
export function getRecommendedSkill(prioritizedGaps = []) {
  if (!prioritizedGaps || prioritizedGaps.length === 0) return null
  const topGap = prioritizedGaps[0]

  return {
    skill: topGap.skill,
    priority: topGap.priority,
    reason: topGap.reason,
    ctaLabel: `Learn ${topGap.skill} →`,
    targetPath: topGap.learningPath
  }
}

/**
 * Resolves recommended course for top skill gap.
 */
export function getRecommendedCourse(prioritizedGaps = []) {
  if (!prioritizedGaps || prioritizedGaps.length === 0) return null
  const topGap = prioritizedGaps[0]

  return {
    title: `${topGap.skill} Mastery for Enterprise Applications`,
    skill: topGap.skill,
    duration: '3 Weeks',
    difficulty: topGap.priority === 'CRITICAL' ? 'Essential' : 'Intermediate',
    ctaLabel: `Start ${topGap.skill} Course →`,
    targetPath: topGap.coursePath
  }
}

/**
 * Resolves Next Best Action for Careers Command Center.
 */
export function getNextResumeLearningAction(prioritizedGaps = [], targetCareer = 'Full Stack Developer') {
  if (!prioritizedGaps || prioritizedGaps.length === 0) {
    return {
      title: `Career Profile Ready for ${targetCareer}`,
      reason: `Your resume and verified skills meet all primary requirements for ${targetCareer}.`,
      category: 'Career Complete',
      ctaLabel: 'Explore Open Jobs →',
      targetPath: '/careers',
      tabTarget: 'opportunities',
      actionType: 'COMPLETE'
    }
  }

  const topGap = prioritizedGaps[0]
  return {
    title: topGap.priority === 'CRITICAL' ? `Learn ${topGap.skill}` : `Verify ${topGap.skill}`,
    reason: topGap.reason,
    category: topGap.priority === 'CRITICAL' ? 'Skill Gap' : 'Verification Gap',
    ctaLabel: `Start ${topGap.skill} →`,
    targetPath: topGap.learningPath,
    tabTarget: 'learning',
    actionType: 'SKILL_GAP'
  }
}
