import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useCareer } from '../../../context/CareerContext'
import { useStudentProfile } from '../../../context/StudentProfileContext'
import { generateOverviewAIInsights } from '../../../services/ai/overviewAIService'
import { resolveContinueLearningDestination } from '../../../services/learning/continueLearningResolver'
import { resolveCareerAwareJobFilters, buildCareerAwareJobUrl } from '../../../services/jobs/careerAwareJobResolver'
import { resolveCareerIntelligence } from '../../../services/careers/careerIntelligenceResolver'
import { resolveNextCareerSkill } from '../../../services/careers/careerSkillResolver'
import ChangeCareerRoleModal from '../ChangeCareerRoleModal'
import {
  Target,
  TrendingUp,
  BookOpen,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Zap,
  FileUp,
  Building2,
  Compass,
  RefreshCw,
  Code,
  Terminal,
  Cpu,
  ShieldCheck,
  BarChart3,
  Layers,
  ExternalLink,
  Mic,
  GraduationCap,
  Activity
} from 'lucide-react'

// Available Target Career Goals list for Step 1 selection
const POPULAR_CAREER_GOALS = [
  { id: 'backend', title: 'Backend Engineer', icon: '💻', tag: 'Node.js, Java, System Design', salary: '₹18L - ₹30L LPA', color: '#EFF6FF', accent: '#2563EB' },
  { id: 'frontend', title: 'Frontend Engineer', icon: '🌐', tag: 'React, TypeScript, Next.js', salary: '₹15L - ₹28L LPA', color: '#FDF4FF', accent: '#C026D3' },
  { id: 'fullstack', title: 'Full Stack Developer', icon: '🚀', tag: 'MERN, Microservices, Cloud', salary: '₹20L - ₹35L LPA', color: '#F0FDF4', accent: '#059669' },
  { id: 'ai', title: 'AI & ML Engineer', icon: '🤖', tag: 'Python, PyTorch, LLMs, RAG', salary: '₹22L - ₹45L LPA', color: '#F5F3FF', accent: '#7C3AED' },
  { id: 'data', title: 'Data Scientist', icon: '📊', tag: 'Python, SQL, Machine Learning', salary: '₹18L - ₹32L LPA', color: '#FFF7ED', accent: '#D97706' },
  { id: 'devops', title: 'DevOps & Cloud Engineer', icon: '⚙️', tag: 'AWS, Docker, Kubernetes', salary: '₹18L - ₹32L LPA', color: '#F0F9FF', accent: '#0284C7' },
  { id: 'cyber', title: 'Cybersecurity Engineer', icon: '🛡️', tag: 'Network Security, Ethical Hacking', salary: '₹16L - ₹30L LPA', color: '#FFF1F2', accent: '#E11D48' },
  { id: 'pm', title: 'Product Manager', icon: '🎯', tag: 'Strategy, Agile, Analytics', salary: '₹15L - ₹45L LPA', color: '#ECFDF5', accent: '#047857' }
]

export default function AICareerCommandCenter({ user, selectedRole, onNavigateTab }) {
  const navigate = useNavigate()

  // Single Source of Truth: StudentProfileContext & CareerContext
  const studentProfileCtx = useStudentProfile()
  const profile = studentProfileCtx?.profile || {}

  const academicSummary = profile?.academicSummary?.data || profile?.academicSummary || {}
  const careerProfile = profile?.careerProfile?.data || profile?.careerProfile || {}
  const skillsSummary = profile?.skillsSummary?.data || profile?.skillsSummary || {}
  const coursesSummary = profile?.coursesSummary?.data || profile?.coursesSummary || {}
  const jobsSummary = profile?.jobsSummary?.data || profile?.jobsSummary || {}
  const productivitySummary = profile?.productivitySummary?.data || profile?.productivitySummary || {}

  const career = useCareer()
  const dashData = career?.dashboardData
  const isLoading = career?.isBackendLoading && !dashData
  const [isNavigatingLearning, setIsNavigatingLearning] = useState(false)
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false)

  const handleContinueLearning = async () => {
    if (isNavigatingLearning) return
    setIsNavigatingLearning(true)
    try {
      const dest = await resolveContinueLearningDestination(studentProfileCtx?.profile, career)
      if (dest?.path) {
        navigate(dest.path)
      } else if (onNavigateTab) {
        onNavigateTab('learning')
      }
    } catch {
      if (onNavigateTab) onNavigateTab('learning')
    } finally {
      setIsNavigatingLearning(false)
    }
  }

  const handleExploreJobs = () => {
    if (onNavigateTab) {
      onNavigateTab('jobs')
    } else {
      navigate('/careers/jobs')
    }
  }

  // 1. Target Role & Goal Details
  const currentCareer = selectedRole || careerProfile?.selectedCareerGoal || dashData?.careerGoal?.targetCareer || career?.currentCareer || ''
  const hasSelectedGoal = Boolean(currentCareer)

  const careerCategory = careerProfile?.category || dashData?.careerGoal?.category || 'Engineering'
  const expectedSalary = careerProfile?.expectedSalary || dashData?.careerGoal?.expectedSalary || '₹18L - ₹30L LPA'
  const careerStatus = careerProfile?.careerStatus || dashData?.careerStatus || 'Active Learning'

  // Resolve next required/unverified career skill and accurate total role skills count
  const nextCareerSkill = useMemo(() => {
    return resolveNextCareerSkill(studentProfileCtx?.profile, career)
  }, [studentProfileCtx?.profile, career])

  // 2. Submodule Data Extraction
  const careerReadiness = Number(careerProfile?.careerReadinessPct ?? dashData?.careerReadiness?.overallReadinessPct ?? career?.careerReadiness ?? 0)
  const atsScore = Number(careerProfile?.resumeATSScore ?? dashData?.atsScore ?? career?.resumeScore ?? 0)

  const totalSkillsCount = Number(nextCareerSkill?.totalSkillsCount || skillsSummary?.totalSkills || 10)
  const verifiedSkillsCount = Number(nextCareerSkill?.verifiedSkillsCount ?? skillsSummary?.verifiedSkillsCount ?? dashData?.completedSkillsCount ?? career?.completedSkills ?? 0)
  const verifiedSkillsPct = totalSkillsCount > 0 ? Math.min(100, Math.round((verifiedSkillsCount / totalSkillsCount) * 100)) : 0
  const rawSkillActivity = skillsSummary?.latestVerifiedSkill || skillsSummary?.latestSkillActivity
  const formattedSkillActivity = (() => {
    if (!rawSkillActivity) return verifiedSkillsCount > 0 ? `${currentCareer} Core` : 'None verified yet'
    if (typeof rawSkillActivity === 'string' && rawSkillActivity.includes('T') && rawSkillActivity.includes('Z')) {
      try {
        const d = new Date(rawSkillActivity)
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }
      } catch {}
    }
    return rawSkillActivity
  })()
  const latestVerifiedSkill = formattedSkillActivity

  const courseProgress = Number(coursesSummary?.overallProgress ?? dashData?.learningProgress?.learningProgressPct ?? 0)
  const productivityScore = Number(productivitySummary?.productivityScore ?? 0)
  const cgpaVal = Number(academicSummary?.currentCGPA ?? 0)
  const academicHealthPct = cgpaVal > 0 ? Math.min(100, Math.round((cgpaVal / 10) * 100)) : 0

  // 3. Placement Match Score (Weighted: 40% Readiness, 20% ATS, 15% Verified Skills, 10% Courses, 10% Productivity, 5% Academics)
  const placementMatch = useMemo(() => {
    const score = Math.round(
      (careerReadiness * 0.40) +
      (atsScore * 0.20) +
      (verifiedSkillsPct * 0.15) +
      (courseProgress * 0.10) +
      (productivityScore * 0.10) +
      (academicHealthPct * 0.05)
    )
    return Math.min(100, Math.max(0, score))
  }, [careerReadiness, atsScore, verifiedSkillsPct, courseProgress, productivityScore, academicHealthPct])

  const placementBadge = useMemo(() => {
    if (placementMatch >= 85) return { label: 'Excellent', color: '#059669', bg: '#F0FDF4', border: '#BBF7D0' }
    if (placementMatch >= 70) return { label: 'Very Good', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' }
    if (placementMatch >= 55) return { label: 'Good', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' }
    if (placementMatch >= 40) return { label: 'Average', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' }
    return { label: 'Needs Improvement', color: '#DC2626', bg: '#FEF2F2', border: '#FCA5A5' }
  }, [placementMatch])

  // 4. Roadmap Progress
  const roadmapProgress = Number(careerProfile?.roadmapProgress ?? dashData?.learningProgress?.learningProgressPct ?? career?.roadmapProgress ?? 0)
  const completedMilestones = Number(careerProfile?.completedMilestones ?? Math.floor((roadmapProgress / 100) * 12))
  const currentPhase = careerProfile?.currentPhase || (career?.currentRoadmap?.currentPhase?.title || 'Phase 1: Foundations')
  const remainingPhases = Number(careerProfile?.remainingPhases ?? (career?.currentRoadmap?.phases ? career.currentRoadmap.phases.filter(p => !p.isCompleted).length : 4))
  const estimatedCompletion = careerProfile?.estimatedCompletion || '90 Days'

  // 5. Jobs Metrics
  const recommendedJobsCount = Number(
    career?.opportunitiesData?.recommendedJobs?.length ||
    jobsSummary?.recommendedJobsCount ||
    dashData?.recommendedJobsCount ||
    16
  )
  const jobsAppliedCount = Number(jobsSummary?.appliedJobsCount ?? dashData?.jobsApplied ?? 0)
  const bestMatchJob = jobsSummary?.bestMatch || (currentCareer ? `Senior ${currentCareer}` : 'Target Career Goal')
  const highestMatchPct = Number(jobsSummary?.highestMatchPct ?? (recommendedJobsCount > 0 ? 94 : 0))
  const remoteJobsCount = Number(jobsSummary?.remoteJobsCount ?? 0)
  const newJobsToday = Number(jobsSummary?.newJobsToday ?? 0)

  // 6. Resume ATS Metrics
  const resumeUploadStatus = careerProfile?.resumeUploadStatus || (atsScore > 0 ? 'Uploaded & Verified' : 'Not Uploaded')
  const lastScanTime = careerProfile?.lastScan || 'Recently'
  const missingKeywordsCount = Number(careerProfile?.missingKeywordsCount ?? 0)
  const resumeVersion = careerProfile?.resumeVersion || 'v1.0'
  const atsBadge = atsScore >= 80 ? { label: 'Excellent', color: '#059669', bg: '#F0FDF4', border: '#BBF7D0' } : atsScore >= 60 ? { label: 'Good', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' } : { label: 'Needs Improvement', color: '#DC2626', bg: '#FEF2F2', border: '#FCA5A5' }

  // 7. Interview Readiness Metrics
  const interviewScore = Number(careerProfile?.interviewScore ?? careerProfile?.interviewReadinessPct ?? career?.interviewReadiness ?? 0)
  const mockInterviewsCount = Number(careerProfile?.mockInterviewsCount ?? careerProfile?.mockInterviewsDone ?? 0)
  const questionsPracticedCount = Number(careerProfile?.questionsPracticed ?? 0)
  const weakTopics = careerProfile?.weakTopics || 'System Architecture'
  const interviewBadge = interviewScore >= 80 ? { label: 'Interview Ready', color: '#059669', bg: '#F0FDF4', border: '#BBF7D0' } : interviewScore >= 60 ? { label: 'Practicing', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' } : { label: 'Needs Practice', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' }

  // 8. Learning Progress Metrics
  const currentCourseTitle = coursesSummary?.currentCourse || (currentCareer ? `${currentCareer} Foundations` : 'Select Course')
  const currentLessonTitle = coursesSummary?.currentLesson || 'Module 1: Getting Started'
  const currentSkillTitle = skillsSummary?.currentSkill || (currentCareer ? `${currentCareer} Skill Tree` : 'Select Skill')
  const todaysGoalTitle = productivitySummary?.todaysGoal || 'Complete 1 Skill Lesson'
  const remainingLearningHours = Number(coursesSummary?.remainingHours ?? 0)

  // 9. Career Readiness Details
  const currentStageTitle = careerProfile?.currentStage || 'Stage 1: Core Skill Building'
  const nextMilestoneTitle = careerProfile?.nextMilestone || 'Complete Skills Assessment'
  const completionETATitle = careerProfile?.completionETA || '45 Days'

  // User display name
  const rawName = user?.displayName || user?.name || (user?.email ? user.email.split('@')[0] : 'Student')
  const cleanName = rawName.replace(/[0-9]/g, '').replace(/[\._-]/g, ' ').trim()
  const userName = cleanName ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1) : 'Student'

  // AI Recommendation Focus State
  const [aiInsights, setAiInsights] = useState(null)
  const [loadingAI, setLoadingAI] = useState(false)

  const latestAIInsight = dashData?.latestAIInsight || (!hasSelectedGoal
    ? 'Select a target career goal below to generate your personalized placement roadmap.'
    : verifiedSkillsCount === 0
      ? `Begin your ${currentCareer} journey by completing your first skill module.`
      : `High placement match (${placementMatch}%) for ${currentCareer} roles.`)

  useEffect(() => {
    if (!hasSelectedGoal) return
    let isMounted = true
    setLoadingAI(true)
    generateOverviewAIInsights({
      userName,
      currentCareer,
      careerReadiness,
      roadmapProgress,
      completedSkills: verifiedSkillsCount
    }, false)
      .then(res => {
        if (isMounted) {
          setAiInsights(res)
          setLoadingAI(false)
        }
      })
      .catch(() => {
        if (isMounted) setLoadingAI(false)
      })

    return () => { isMounted = false }
  }, [hasSelectedGoal, currentCareer, userName, careerReadiness, roadmapProgress, verifiedSkillsCount])

  // Dynamic Multi-Signal Career Intelligence Resolver
  const careerIntelligence = useMemo(() => {
    return resolveCareerIntelligence(studentProfileCtx?.profile, career)
  }, [studentProfileCtx?.profile, career])

  const nextAction = careerIntelligence?.nextBestAction



  // Strict Sequential Stage Pipeline matching the 4 Hero Cards (Overview, Learning, Resume, Jobs):
  const s1Done = hasSelectedGoal
  const s2Done = s1Done && Boolean(nextCareerSkill?.isAllCompleted || (totalSkillsCount > 0 && verifiedSkillsCount >= totalSkillsCount) || roadmapProgress >= 80)
  const s3Done = s2Done && Boolean(atsScore >= 75)
  const s4Done = s3Done && Boolean(jobsAppliedCount > 0)

  // Determine single active stage ID (1..4)
  const activeStageId = !s1Done ? 1 : !s2Done ? 2 : !s3Done ? 3 : 4

  // Dynamic Career Journey Stages (Matching 4 Hero Cards: Career Selection -> Skills & Learning -> Resume Ready -> Apply for Jobs)
  const journeyStages = [
    {
      id: 1,
      title: 'Career Selection',
      status: s1Done ? 'completed' : 'current',
      description: s1Done ? `Target: ${currentCareer}` : 'Select Target Role'
    },
    {
      id: 2,
      title: 'Skills & Learning',
      status: s2Done ? 'completed' : s1Done ? 'current' : 'upcoming',
      description: s2Done ? 'Skills Verified ✓' : `${verifiedSkillsCount}/${totalSkillsCount} Skills Verified`
    },
    {
      id: 3,
      title: 'Resume Ready',
      status: s3Done ? 'completed' : s2Done ? 'current' : 'upcoming',
      description: atsScore > 0 ? `ATS Score: ${atsScore}%` : 'Upload Resume'
    },
    {
      id: 4,
      title: 'Apply for Jobs',
      status: s4Done ? 'completed' : s3Done ? 'current' : 'upcoming',
      description: `${recommendedJobsCount} Openings`
    }
  ]

  const stageActions = {
    1: { label: hasSelectedGoal ? 'Change Goal' : 'Set Career Goal', action: () => setIsChangeModalOpen(true) },
    2: {
      label: nextCareerSkill?.isAllCompleted ? 'Skills Complete ✓' : `Assess ${nextCareerSkill?.skillName || 'Skills'}`,
      action: () => {
        const query = nextCareerSkill?.skillId
          ? `?skillId=${nextCareerSkill.skillId}&skill=${encodeURIComponent(nextCareerSkill.skillName)}&focus=skills`
          : '?focus=skills'
        if (onNavigateTab) {
          onNavigateTab('learning')
        } else {
          navigate(`/careers/learning${query}`)
        }
      }
    },
    3: { label: 'Upload Resume', action: () => onNavigateTab && onNavigateTab('resume') },
    4: { label: 'Browse Jobs', action: handleExploreJobs },
  }

  const recentActivities = useMemo(() => {
    if (verifiedSkillsCount > 0 || jobsAppliedCount > 0 || atsScore > 0) {
      return [
        {
          id: 'act-1',
          title: verifiedSkillsCount > 0 ? `Verified ${verifiedSkillsCount} Skills in ${currentCareer}` : `Selected Target Goal (${currentCareer})`,
          category: 'Career Milestone',
          timestamp: 'Recently',
          icon: '📚',
          badge: verifiedSkillsCount > 0 ? 'Completed' : 'Active',
          badgeBg: '#F0FDF4',
          badgeColor: '#047857'
        },
        {
          id: 'act-2',
          title: atsScore > 0 ? `Uploaded Resume (ATS Score: ${atsScore}%)` : 'Resume Verification Pending',
          category: 'Resume Center',
          timestamp: 'Recently',
          icon: '📄',
          badge: atsScore > 0 ? `ATS ${atsScore}%` : 'Pending',
          badgeBg: atsScore > 0 ? '#EFF6FF' : '#FEF3C7',
          badgeColor: atsScore > 0 ? '#1D4ED8' : '#B45309'
        }
      ]
    }

    return [
      {
        id: 'act-1',
        title: hasSelectedGoal ? `Target Goal set to ${currentCareer}` : 'Target Career Goal Not Selected',
        category: 'Career Goal',
        timestamp: 'Just now',
        icon: '🎯',
        badge: hasSelectedGoal ? 'Goal Set' : 'Select Goal',
        badgeBg: hasSelectedGoal ? '#F5F3FF' : '#FFF7ED',
        badgeColor: hasSelectedGoal ? '#6D28D9' : '#C2410C'
      },
      {
        id: 'act-2',
        title: 'Ready to start Learning Roadmap',
        category: 'Learning Hub',
        timestamp: 'Pending',
        icon: '🚀',
        badge: 'Start Now',
        badgeBg: '#EFF6FF',
        badgeColor: '#1D4ED8'
      }
    ]
  }, [verifiedSkillsCount, jobsAppliedCount, atsScore, currentCareer, hasSelectedGoal])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '0 0 48px', fontFamily: 'DM Sans, sans-serif' }}>

      {/* SKELETON LOADER FOR INITIAL LOADING */}
      {isLoading && (
        <div style={{ padding: 24, borderRadius: 20, background: 'var(--bg-soft, #FFFFFF)', border: '1px solid var(--border, #E2E8F0)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <RefreshCw size={20} className="animate-spin" style={{ color: '#7C3AED' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-dark, #0F172A)' }}>Connecting to ZenScore Unified Career Engine...</span>
        </div>
      )}

      {/* ── INTERACTIVE CAREER GOAL SELECTION CARD (IF NO GOAL IS SELECTED YET) ── */}
      {!hasSelectedGoal && (
        <div
          style={{
            background: 'var(--bg-soft, #FFFFFF)',
            borderRadius: 24,
            padding: '28px 32px',
            border: '2px solid #7C3AED',
            boxShadow: '0 12px 32px rgba(124, 58, 237, 0.12)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 14, background: '#F5F3FF', border: '1px solid #DDD6FE', color: '#7C3AED', fontSize: 11.5, fontWeight: 800, fontFamily: 'Sora, sans-serif', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                <Target size={14} /> STEP 1: SELECT YOUR TARGET CAREER GOAL
              </div>
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--text-dark, #0F172A)', margin: '8px 0 4px' }}>
                Choose the Placement Role You Want to Master 🚀
              </h3>
              <p style={{ fontSize: 13.5, color: 'var(--text-muted, #64748B)', margin: 0, fontWeight: 600 }}>
                Selecting your career goal unlocks your personalized skill roadmap, ATS resume suggestions, and matched job openings.
              </p>
            </div>
          </div>

          {/* Role Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 14 }}>
            {POPULAR_CAREER_GOALS.map((goal) => (
              <div
                key={goal.id}
                onClick={async () => {
                  if (career?.selectCareerGoal) await career.selectCareerGoal(goal.title)
                  if (studentProfileCtx?.updateSection) {
                    await studentProfileCtx.updateSection('careerProfile', { selectedCareerGoal: goal.title }, 'Careers').catch(() => null)
                  }
                }}
                style={{
                  padding: 18,
                  borderRadius: 18,
                  background: goal.color,
                  border: `1.5px solid ${goal.accent}30`,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 12,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.borderColor = goal.accent
                  e.currentTarget.style.boxShadow = `0 8px 20px ${goal.accent}20`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = `${goal.accent}30`
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 26 }}>{goal.icon}</span>
                    <span style={{ fontSize: 10.5, fontWeight: 800, color: goal.accent, background: '#FFFFFF', padding: '2px 8px', borderRadius: 10 }}>
                      Select Goal →
                    </span>
                  </div>
                  <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>
                    {goal.title}
                  </h4>
                  <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>{goal.tag}</span>
                </div>
                <div style={{ borderTop: `1px solid ${goal.accent}20`, paddingTop: 8, fontSize: 12, fontWeight: 800, color: goal.accent }}>
                  Expected: {goal.salary}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SECTION 1: PRIMARY OVERVIEW STAT CARDS (ROW 1: PLACEMENT MATCH, ROADMAP, SKILLS, JOBS) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>

        {/* Card 1: Placement Match (Weighted 40/20/15/10/10/5 Score) */}
        <div
          style={{
            background: 'var(--bg-soft, #FFFFFF)',
            borderRadius: 20,
            padding: '20px 22px',
            border: '1px solid var(--border, #E2E8F0)',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted, #64748B)' }}>Placement Match</span>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: placementBadge.bg, border: `1px solid ${placementBadge.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: placementBadge.color }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 30, fontWeight: 800, color: 'var(--text-dark, #0F172A)', lineHeight: 1 }}>
              {placementMatch}%
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 10, background: placementBadge.bg, color: placementBadge.color, border: `1px solid ${placementBadge.border}` }}>
                {placementBadge.label}
              </span>
            </div>
          </div>
          <div style={{ width: '100%', height: 6, background: 'var(--border, #F1F5F9)', borderRadius: 3, marginTop: 14, overflow: 'hidden' }}>
            <div style={{ width: `${placementMatch}%`, height: '100%', background: 'linear-gradient(90deg, #10B981, #059669)', borderRadius: 3 }} />
          </div>
        </div>

        {/* Card 2: Roadmap Progress */}
        <div
          onClick={() => onNavigateTab && onNavigateTab('learning')}
          style={{
            background: 'var(--bg-soft, #FFFFFF)',
            borderRadius: 20,
            padding: '20px 22px',
            border: '1px solid var(--border, #E2E8F0)',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted, #64748B)' }}>Roadmap Progress</span>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: '#EFF6FF', border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
              <BookOpen size={18} />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 30, fontWeight: 800, color: 'var(--text-dark, #0F172A)', lineHeight: 1 }}>
              {roadmapProgress}%
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 10, background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }}>
                {completedMilestones} Milestones · {remainingPhases} Phases Left
              </span>
            </div>
          </div>
          <div style={{ width: '100%', height: 6, background: 'var(--border, #F1F5F9)', borderRadius: 3, marginTop: 14, overflow: 'hidden' }}>
            <div style={{ width: `${roadmapProgress}%`, height: '100%', background: 'linear-gradient(90deg, #3B82F6, #2563EB)', borderRadius: 3 }} />
          </div>
        </div>

        {/* Card 3: Verified Skills */}
        <div
          onClick={() => {
            if (onNavigateTab) {
              onNavigateTab('learning')
            } else {
              navigate('/careers/learning')
            }
          }}
          style={{
            background: 'var(--bg-soft, #FFFFFF)',
            borderRadius: 20,
            padding: '20px 22px',
            border: '1px solid var(--border, #E2E8F0)',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted, #64748B)' }}>Verified Skills</span>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: '#F5F3FF', border: '1px solid #DDD6FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED' }}>
              <Award size={18} />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 30, fontWeight: 800, color: 'var(--text-dark, #0F172A)', lineHeight: 1 }}>
              {verifiedSkillsCount} <span style={{ fontSize: 16, color: 'var(--text-muted, #94A3B8)', fontWeight: 600 }}>/ {totalSkillsCount}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 10, background: '#F5F3FF', color: '#6D28D9', border: '1px solid #DDD6FE' }}>
                Latest: {latestVerifiedSkill}
              </span>
            </div>
          </div>
          <div style={{ width: '100%', height: 6, background: 'var(--border, #F1F5F9)', borderRadius: 3, marginTop: 14, overflow: 'hidden' }}>
            <div style={{ width: `${verifiedSkillsPct}%`, height: '100%', background: 'linear-gradient(90deg, #7C3AED, #6D28D9)', borderRadius: 3 }} />
          </div>
        </div>

        {/* Card 4: Recommended Jobs */}
        <div
          onClick={handleExploreJobs}
          style={{
            background: 'var(--bg-soft, #FFFFFF)',
            borderRadius: 20,
            padding: '20px 22px',
            border: '1px solid var(--border, #E2E8F0)',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted, #64748B)' }}>Recommended Jobs</span>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: '#FFFBEB', border: '1px solid #FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
              <Briefcase size={18} />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 30, fontWeight: 800, color: 'var(--text-dark, #0F172A)', lineHeight: 1 }}>
              {recommendedJobsCount}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 10, background: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A' }}>
                {recommendedJobsCount > 0 ? `Best: ${highestMatchPct}% Match (${remoteJobsCount} Remote)` : 'Select goal for matches'}
              </span>
            </div>
          </div>
          <div style={{ width: '100%', height: 6, background: 'var(--border, #F1F5F9)', borderRadius: 3, marginTop: 14, overflow: 'hidden' }}>
            <div style={{ width: `${recommendedJobsCount > 0 ? 85 : 10}%`, height: '100%', background: 'linear-gradient(90deg, #F59E0B, #D97706)', borderRadius: 3 }} />
          </div>
        </div>

      </div>

      {/* ── SECTION 1B: SECONDARY OVERVIEW STAT CARDS (ROW 2: RESUME ATS, INTERVIEW READINESS, LEARNING PROGRESS, CAREER READINESS) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>

        {/* Card 5: Resume ATS */}
        <div
          onClick={() => onNavigateTab && onNavigateTab('resume')}
          style={{
            background: 'var(--bg-soft, #FFFFFF)',
            borderRadius: 20,
            padding: '20px 22px',
            border: '1px solid var(--border, #E2E8F0)',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted, #64748B)' }}>Resume ATS Score</span>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: atsBadge.bg, border: `1px solid ${atsBadge.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: atsBadge.color }}>
              <FileUp size={18} />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 30, fontWeight: 800, color: 'var(--text-dark, #0F172A)', lineHeight: 1 }}>
              {atsScore}%
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 10, background: atsBadge.bg, color: atsBadge.color, border: `1px solid ${atsBadge.border}` }}>
                {atsBadge.label} · {missingKeywordsCount} Missing Keywords
              </span>
            </div>
          </div>
          <div style={{ width: '100%', height: 6, background: 'var(--border, #F1F5F9)', borderRadius: 3, marginTop: 14, overflow: 'hidden' }}>
            <div style={{ width: `${atsScore}%`, height: '100%', background: 'linear-gradient(90deg, #6366F1, #4F46E5)', borderRadius: 3 }} />
          </div>
        </div>



        {/* Card 7: Learning Progress */}
        <div
          onClick={() => onNavigateTab && onNavigateTab('learning')}
          style={{
            background: 'var(--bg-soft, #FFFFFF)',
            borderRadius: 20,
            padding: '20px 22px',
            border: '1px solid var(--border, #E2E8F0)',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted, #64748B)' }}>Learning Progress</span>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: '#F0FDF4', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <GraduationCap size={18} />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 30, fontWeight: 800, color: 'var(--text-dark, #0F172A)', lineHeight: 1 }}>
              {courseProgress}%
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 10, background: '#F0FDF4', color: '#047857', border: '1px solid #BBF7D0' }}>
                {currentCourseTitle ? `${currentCourseTitle} · ` : ''}{remainingLearningHours}h Left
              </span>
            </div>
          </div>
          <div style={{ width: '100%', height: 6, background: 'var(--border, #F1F5F9)', borderRadius: 3, marginTop: 14, overflow: 'hidden' }}>
            <div style={{ width: `${courseProgress}%`, height: '100%', background: 'linear-gradient(90deg, #10B981, #059669)', borderRadius: 3 }} />
          </div>
        </div>

        {/* Card 8: Career Readiness */}
        <div
          style={{
            background: 'var(--bg-soft, #FFFFFF)',
            borderRadius: 20,
            padding: '20px 22px',
            border: '1px solid var(--border, #E2E8F0)',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted, #64748B)' }}>Career Readiness</span>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: '#F5F3FF', border: '1px solid #DDD6FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED' }}>
              <Activity size={18} />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 30, fontWeight: 800, color: 'var(--text-dark, #0F172A)', lineHeight: 1 }}>
              {careerReadiness}%
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 10, background: '#F5F3FF', color: '#6D28D9', border: '1px solid #DDD6FE' }}>
                ETA: {completionETATitle} · Next: {nextMilestoneTitle}
              </span>
            </div>
          </div>
          <div style={{ width: '100%', height: 6, background: 'var(--border, #F1F5F9)', borderRadius: 3, marginTop: 14, overflow: 'hidden' }}>
            <div style={{ width: `${careerReadiness}%`, height: '100%', background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)', borderRadius: 3 }} />
          </div>
        </div>

      </div>

      {/* ── SECTION 2: AI PLACEMENT INSIGHT BANNER ── */}
      <div
        style={{
          borderRadius: 20,
          background: 'var(--bg-soft, #F5F3FF)',
          border: '1px solid var(--border, #DDD6FE)',
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          boxShadow: '0 4px 16px rgba(124, 58, 237, 0.05)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 280 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)', flexShrink: 0 }}>
            <Zap size={20} style={{ color: '#FDE047' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#7C3AED', fontFamily: 'Sora, sans-serif' }}>
                ⚡ NEXT BEST ACTION: {nextAction?.title || 'Personalized Placement Focus'}
              </span>
            </div>
            <p style={{ margin: '3px 0 0', fontSize: 13.5, fontWeight: 700, color: 'var(--text-dark, #1E293B)', lineHeight: 1.45 }}>
              {nextAction?.reason || (loadingAI ? 'Calculating latest career insights...' : latestAIInsight)}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (nextAction?.tabTarget && onNavigateTab) {
              onNavigateTab(nextAction.tabTarget)
            } else if (nextAction?.targetPath) {
              navigate(nextAction.targetPath)
            } else {
              handleContinueLearning()
            }
          }}
          disabled={isNavigatingLearning}
          style={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
            color: '#FFFFFF',
            border: 'none',
            padding: '10px 20px',
            borderRadius: 14,
            fontFamily: 'Sora, sans-serif',
            fontWeight: 800,
            fontSize: 12.5,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 4px 14px rgba(124, 58, 237, 0.25)',
            transition: 'all 0.15s ease',
            opacity: isNavigatingLearning ? 0.7 : 1
          }}
        >
          <span>{nextAction?.ctaLabel || (isNavigatingLearning ? 'Resuming...' : 'Continue Learning')}</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* ── SECTION 3: CAREER JOURNEY STAGE TRACKER ── */}
      <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderRadius: 24, padding: '28px 32px', border: '1px solid var(--border, #E2E8F0)', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: 'var(--text-dark, #0F172A)', margin: 0 }}>
              🚀 Career Journey Stage Tracker
            </h3>
            <span style={{ fontSize: 12.5, color: 'var(--text-muted, #64748B)', fontWeight: 600 }}>Your end-to-end placement execution pipeline</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#7C3AED', background: 'rgba(124, 58, 237, 0.12)', padding: '6px 14px', borderRadius: 20, border: '1px solid var(--border, #DDD6FE)' }}>
            Stage {activeStageId} of 4 Active
          </span>
        </div>

        {/* Journey Timeline Steps */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
          {journeyStages.map((stage) => {
            const isCompleted = stage.status === 'completed'
            const isCurrent = stage.status === 'current'
            const stageAction = stageActions[stage.id]

            return (
              <div
                key={stage.id}
                style={{
                  padding: 16,
                  borderRadius: 16,
                  background: isCurrent ? '#F5F3FF' : isCompleted ? '#F0FDF4' : 'var(--bg-soft, #FFFFFF)',
                  border: isCurrent ? '2px solid #7C3AED' : isCompleted ? '1.5px solid #059669' : '1px solid var(--border, #E2E8F0)',
                  position: 'relative',
                  display: 'flex', flexDirection: 'column', gap: 8,
                  boxShadow: isCurrent ? '0 4px 14px rgba(124, 58, 237, 0.1)' : '0 2px 8px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: isCurrent ? '#6D28D9' : isCompleted ? '#047857' : 'var(--text-muted, #64748B)', fontFamily: 'Sora, sans-serif' }}>
                    0{stage.id}
                  </span>
                  {isCompleted && <CheckCircle2 size={16} style={{ color: '#059669' }} />}
                  {isCurrent && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#7C3AED' }} />}
                </div>

                <div>
                  <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 13.5, fontWeight: 800, color: isCurrent ? '#4C1D95' : isCompleted ? '#065F46' : 'var(--text-dark, #0F172A)', margin: '0 0 3px' }}>
                    {stage.title}
                  </h4>
                  <p style={{ fontSize: 11.5, color: isCurrent ? '#5B21B6' : isCompleted ? '#047857' : 'var(--text-muted, #64748B)', fontWeight: 600, margin: 0, lineHeight: 1.35 }}>
                    {stage.description}
                  </p>
                </div>

                {/* Action button — only on current stage */}
                {isCurrent && stageAction && (
                  <button
                    onClick={stageAction.action}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '5px 10px', borderRadius: 8, marginTop: 2,
                      background: '#7C3AED', color: '#FFFFFF',
                      border: 'none', cursor: 'pointer',
                      fontSize: 11, fontWeight: 700, fontFamily: 'Sora, sans-serif',
                      boxShadow: '0 2px 8px rgba(124,58,237,0.3)',
                      transition: 'all 0.15s',
                      width: 'fit-content',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#6D28D9'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#7C3AED'; e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    {stageAction.label} <ExternalLink size={10} />
                  </button>
                )}

                {/* Subtle "Done" link for completed stages */}
                {isCompleted && (
                  <span style={{ fontSize: 10.5, color: '#059669', fontWeight: 700 }}>✓ Completed</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── SECTION 4: RECENT ACTIVITY STREAM & QUICK MODULE ACTIONS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>

        {/* RECENT CAREER ACTIVITY STREAM */}
        <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderRadius: 24, padding: '24px 28px', border: '1px solid var(--border, #E2E8F0)', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: 'var(--text-dark, #0F172A)', margin: 0 }}>
              ⏱️ Recent Activity Stream
            </h3>
            <span style={{ fontSize: 11.5, color: 'var(--text-muted, #64748B)', fontWeight: 700 }}>Live Sync</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentActivities.map((act) => (
              <div key={act.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 14, borderRadius: 14, background: 'var(--bg, #F8FAFC)', border: '1px solid var(--border, #E2E8F0)' }}>
                <span style={{ fontSize: 20 }}>{act.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h5 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-dark, #0F172A)', margin: 0 }}>{act.title}</h5>
                    <span style={{ fontSize: 10.5, fontWeight: 800, padding: '3px 9px', borderRadius: 10, background: act.badgeBg, color: act.badgeColor }}>{act.badge}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, fontSize: 11, color: 'var(--text-muted, #64748B)', fontWeight: 600 }}>
                    <span>{act.category}</span>
                    <span>•</span>
                    <span>{act.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK MODULE ACCESS CARDS */}
        <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderRadius: 24, padding: '24px 28px', border: '1px solid var(--border, #E2E8F0)', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: 'var(--text-dark, #0F172A)', margin: 0 }}>
            ⚡ Quick Module Shortcuts
          </h3>

          <div
            onClick={handleContinueLearning}
            style={{ padding: 16, borderRadius: 16, background: '#EFF6FF', border: '1px solid #BFDBFE', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: '#2563EB', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={19} />
              </div>
              <div>
                <h5 style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 800, color: '#1E40AF', margin: 0 }}>Learning Hub</h5>
                <span style={{ fontSize: 12, color: '#1D4ED8', fontWeight: 600 }}>{roadmapProgress}% Completed · Next: Foundational Skills</span>
              </div>
            </div>
            <ArrowRight size={17} style={{ color: '#2563EB' }} />
          </div>

          <div
            onClick={() => onNavigateTab && onNavigateTab('resume')}
            style={{ padding: 16, borderRadius: 16, background: '#F5F3FF', border: '1px solid #DDD6FE', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: '#7C3AED', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileUp size={19} />
              </div>
              <div>
                <h5 style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 800, color: '#5B21B6', margin: 0 }}>Resume Center</h5>
                <span style={{ fontSize: 12, color: '#6D28D9', fontWeight: 600 }}>{atsScore > 0 ? `ATS Score: ${atsScore}%` : 'Upload PDF Resume'}</span>
              </div>
            </div>
            <ArrowRight size={17} style={{ color: '#7C3AED' }} />
          </div>

          <div
            onClick={handleExploreJobs}
            style={{ padding: 16, borderRadius: 16, background: '#FFF7ED', border: '1px solid #FED7AA', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: '#EA580C', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={19} />
              </div>
              <div>
                <h5 style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 800, color: '#9A3412', margin: 0 }}>Career Opportunities</h5>
                <span style={{ fontSize: 12, color: '#C2410C', fontWeight: 600 }}>{recommendedJobsCount} Openings · {jobsAppliedCount} Applications</span>
              </div>
            </div>
            <ArrowRight size={17} style={{ color: '#EA580C' }} />
          </div>
        </div>

      </div>

      {/* Change Career Role Modal */}
      <ChangeCareerRoleModal
        isOpen={isChangeModalOpen}
        onClose={() => setIsChangeModalOpen(false)}
        currentRole={currentCareer}
      />
    </div>
  )
}
