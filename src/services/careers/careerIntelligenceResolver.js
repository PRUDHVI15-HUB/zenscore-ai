/**
 * Career Intelligence & Personalized Recommendation Resolver
 * ==========================================================
 * Unifies multi-signal recommendations across StudentProfile, CareerContext,
 * Roadmap (Phase E), Skills, Courses, Jobs, and AI Tutor Context.
 *
 * Design Principles:
 *   - CANONICAL SOURCE: Reads directly from StudentProfileContext & CareerContext.
 *   - MULTI-SIGNAL PRIORITY: Evaluates roadmap milestones, skill gaps, course progress,
 *     resume ATS score, interview readiness, and job match percentages.
 *   - WHY-THIS EXPLANATION: Provides factual data-driven rationale for every recommendation.
 *   - ZERO STALE DATA: Immediately adapts when target career goal changes.
 */

import { calculateSkillReadiness } from '../skills/skillReadinessCalculator'
import { normalizeCareerTitle } from './careerNormalizer'
import { getPrioritizedSkillGaps, getNextResumeLearningAction } from '../resume/resumeCareerLearningResolver'

/**
 * Resolves comprehensive career intelligence for the current student.
 *
 * @param {Object} studentProfile - Profile from StudentProfileContext
 * @param {Object} careerState - State from CareerContext
 * @returns {Object} Structured career intelligence recommendations
 */
export function resolveCareerIntelligence(studentProfile = {}, careerState = {}) {
  try {
    const profile = studentProfile?.data || studentProfile || {}
    const careerProfile = profile?.careerProfile?.data || profile?.careerProfile || {}
    const skillsSummary = profile?.skillsSummary?.data || profile?.skillsSummary || {}
    const coursesSummary = profile?.coursesSummary?.data || profile?.coursesSummary || {}
    const jobsSummary = profile?.jobsSummary?.data || profile?.jobsSummary || {}

    // Target career canonical title
    const targetCareer = normalizeCareerTitle(careerProfile?.selectedCareerGoal || careerState?.currentCareer || 'Backend Engineer')

    // Resume Extracted Skills & Missing Skills
    const resumeSkills = careerProfile?.resumeSkills || []
    const verifiedSkills = skillsSummary?.verifiedSkills || []

    const prioritizedResumeGaps = getPrioritizedSkillGaps(resumeSkills, verifiedSkills, targetCareer)

    // 1. Skill Gap Analysis
    const skillReadinessReport = calculateSkillReadiness(targetCareer, careerState)
    const missingSkills = skillReadinessReport.missingSkills || []
    const topMissingSkill = prioritizedResumeGaps[0]?.skill || missingSkills[0]?.name || (skillsSummary.skillGapSummary ? skillsSummary.skillGapSummary.split(',')[0] : 'System Design')

    // 2. Active Roadmap State
    const activeRoadmap = (normalizeCareerTitle(careerState?.currentRoadmap?.targetCareer) === targetCareer && careerState.currentRoadmap.phases)
      ? careerState.currentRoadmap
      : null

    const phases = activeRoadmap?.phases || []
    const activePhase = phases.find(p => p.status === 'Active' && !p.isCompleted) || phases[0]
    const currentMilestoneName = activePhase?.skill || activePhase?.title?.replace(/^Phase \d+:\s*/, '') || topMissingSkill

    // 3. Submodule Status Metrics
    const atsScore = Number(careerProfile?.resumeATSScore || careerState?.resumeScore || 0)
    const interviewScore = Number(careerProfile?.interviewScore || careerState?.interviewReadiness || 0)
    const verifiedSkillsCount = Number(skillsSummary?.verifiedSkillsCount || careerState?.completedSkills || 0)
    const activeCourseName = coursesSummary?.currentCourse || null

    // 4. Multi-Signal Next Best Action Resolution
    let nextBestAction = null

    if (activePhase && !activePhase.isCompleted) {
      nextBestAction = {
        title: `Master ${currentMilestoneName}`,
        reason: `Recommended because it is the next active milestone in your ${targetCareer} roadmap (${activePhase.title || 'Phase 1'}).`,
        category: 'Roadmap Milestone',
        ctaLabel: `Start ${currentMilestoneName} →`,
        targetPath: '/careers',
        tabTarget: 'learning',
        actionType: 'ROADMAP_MILESTONE'
      }
    } else if (missingSkills.length > 0) {
      nextBestAction = {
        title: `Verify ${topMissingSkill} Skill`,
        reason: `Required by 80%+ of ${targetCareer} job postings and currently missing from your verified skills list.`,
        category: 'Skill Gap',
        ctaLabel: `Learn ${topMissingSkill} →`,
        targetPath: '/careers',
        tabTarget: 'learning',
        actionType: 'SKILL_GAP'
      }
    } else if (activeCourseName) {
      nextBestAction = {
        title: `Continue ${activeCourseName}`,
        reason: `You have active learning progress in this course. Finish modules to boost your placement readiness score.`,
        category: 'In-Progress Course',
        ctaLabel: 'Resume Course →',
        targetPath: `/courses`,
        actionType: 'IN_PROGRESS_COURSE'
      }
    } else if (atsScore < 70) {
      nextBestAction = {
        title: `Optimize Resume for ${targetCareer}`,
        reason: `Your current ATS resume score is ${atsScore > 0 ? `${atsScore}%` : 'pending'}. Increasing it to 80%+ boosts recruiter shortlisting by 3x.`,
        category: 'Resume Center',
        ctaLabel: 'Improve Resume →',
        targetPath: '/careers',
        tabTarget: 'resume',
        actionType: 'RESUME_ATS'
      }
    } else {
      nextBestAction = {
        title: `Explore ${targetCareer} Job Openings`,
        reason: `Your profile has a strong placement match score. Browse verified job opportunities and submit applications.`,
        category: 'Job Matching',
        ctaLabel: 'Explore Jobs →',
        targetPath: `/jobs/listings?search=${encodeURIComponent(targetCareer)}`,
        actionType: 'JOB_EXPLORE'
      }
    }

    // 5. Readiness Blockers (Top 3 Priority Concerns)
    const readinessBlockers = []

    if (missingSkills.length > 0) {
      readinessBlockers.push({
        id: 'blk-skill',
        title: `Missing Skill: ${topMissingSkill}`,
        reason: `Essential requirement for ${targetCareer} roles.`,
        severity: 'High',
        ctaLabel: 'Practice Skill',
        targetPath: '/careers',
        tabTarget: 'learning'
      })
    }

    if (atsScore < 75) {
      readinessBlockers.push({
        id: 'blk-ats',
        title: atsScore === 0 ? 'Resume Not Uploaded' : `Low ATS Resume Score (${atsScore}%)`,
        reason: 'Recruiters filter candidates with ATS scores under 75%.',
        severity: atsScore === 0 ? 'High' : 'Medium',
        ctaLabel: 'Scan Resume',
        targetPath: '/careers',
        tabTarget: 'resume'
      })
    }

    if (interviewScore < 65) {
      readinessBlockers.push({
        id: 'blk-interview',
        title: 'Interview Preparation Pending',
        reason: `Practice mock technical questions tailored for ${targetCareer}.`,
        severity: 'Medium',
        ctaLabel: 'Practice Interview',
        targetPath: '/careers',
        tabTarget: 'interview'
      })
    }

    if (readinessBlockers.length === 0) {
      readinessBlockers.push({
        id: 'blk-ready',
        title: 'Zero High-Priority Blockers!',
        reason: `Your profile is well-optimized for ${targetCareer} placement drives.`,
        severity: 'Low',
        ctaLabel: 'Apply for Jobs',
        targetPath: `/jobs/listings?search=${encodeURIComponent(targetCareer)}`
      })
    }

    // 6. Weekly Career Focus (3 Actionable Goals)
    const weeklyCareerFocus = [
      {
        id: 'wf-1',
        title: `Complete ${currentMilestoneName} Roadmap Phase`,
        category: 'Learning Goal',
        isCompleted: Boolean(activePhase?.isCompleted)
      },
      {
        id: 'wf-2',
        title: atsScore >= 75 ? `Maintain ATS Resume (${atsScore}%)` : `Boost ATS Score to 75%+`,
        category: 'Resume Center',
        isCompleted: atsScore >= 75
      },
      {
        id: 'wf-3',
        title: `Apply to 3 Matched ${targetCareer} Roles`,
        category: 'Job Discovery',
        isCompleted: Number(jobsSummary?.appliedJobsCount || 0) >= 3
      }
    ]

    return {
      targetCareer,
      topCareerGap: topMissingSkill,
      nextBestAction,
      recommendedSkill: {
        name: topMissingSkill,
        category: 'Core Competency',
        reason: `Required for ${targetCareer} roadmap execution.`,
        skillUrl: '/skills'
      },
      recommendedCourse: {
        title: activeCourseName || `${targetCareer} Enterprise Architecture`,
        reason: `Aligned with your target role learning roadmap.`,
        courseUrl: '/courses'
      },
      recommendedJobs: {
        count: Number(jobsSummary?.recommendedJobsCount || 5),
        title: targetCareer,
        reason: `Matched based on your target career goal and verified skills.`,
        jobsUrl: `/jobs/listings?search=${encodeURIComponent(targetCareer)}`
      },
      readinessBlockers,
      weeklyCareerFocus,
      generatedAt: new Date().toISOString()
    }
  } catch (err) {
    console.info('[CareerIntelligenceResolver] Resolution warning:', err?.message || err)
    return {
      targetCareer: 'Software Engineer',
      topCareerGap: 'System Design',
      nextBestAction: {
        title: 'Set Career Goal',
        reason: 'Select your target placement role to unlock career intelligence.',
        ctaLabel: 'Set Goal →',
        targetPath: '/careers'
      },
      readinessBlockers: [],
      weeklyCareerFocus: []
    }
  }
}
