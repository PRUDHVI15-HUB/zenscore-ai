import { useAuth } from './AuthContext'
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getOrGenerateRoadmap, unlockNextRoadmapPhase, saveRoadmapToStorage } from '../services/skills/roadmapSyncService'
import { generatePersonalizedRoadmap } from '../services/skills/roadmapGenerator'
import { getGamificationState, awardXPAndCheckBadges, calculateLevelInfo, ALL_BADGES } from '../services/skills/gamificationService'
import { subscribeToActivityEvents, EVENT_TYPES } from '../services/skills/activityEventBus'
import { verifySkill, getVerifiedSkills, getVerifiedSkillCount } from '../services/skills/skillRegistryService'
import { getRoadmapEngineState, calculateOverallProgress, getTodayMission as getDynamicTodayMission } from '../services/roadmap/roadmapProgressEngine'
import {
  fetchCareersDashboard,
  fetchLearningHub,
  fetchResumeCenter,
  fetchOpportunities,
  fetchInterviewCenter,
  fetchCopilotContext,
  syncCareerModule,
  fetchCareerProfileStatus,
  completeCareerOnboarding
} from '../services/careersApiService'
import { syncCareersToProfile } from '../services/careersProfileSync'
import { registerAutomation, AUTOMATION_EVENTS } from '../services/automationEngine'
import { updateProfileSection } from '../services/studentProfileService'

const CareerContext = createContext()

export const useCareer = () => useContext(CareerContext)

export const CAREER_MARKET_METADATA = {
  'Backend Engineer': {
    demand: '★★★★★ Very High',
    salary: '₹18L – ₹30L LPA',
    recruiters: ['Google', 'Microsoft', 'Amazon', 'Swiggy', 'Uber', 'Atlassian'],
    growingSkill: 'System Design',
    openings: '42,000+ Jobs',
    hiringTrend: '⬆ Rising',
  },
  'Frontend Engineer': {
    demand: '★★★★★ Very High',
    salary: '₹15L – ₹28L LPA',
    recruiters: ['Meta', 'Netflix', 'Airbnb', 'Flipkart', 'CRED', 'Razorpay'],
    growingSkill: 'Next.js 14 App Router',
    openings: '38,000+ Jobs',
    hiringTrend: '⬆ Rising',
  },
  'Full Stack Developer': {
    demand: '★★★★★ Very High',
    salary: '₹20L – ₹35L LPA',
    recruiters: ['Stripe', 'Atlassian', 'Swiggy', 'Zomato', 'Freshworks', 'Postman'],
    growingSkill: 'Docker & Microservices',
    openings: '50,000+ Jobs',
    hiringTrend: '⬆ Rising',
  },
  'AI Engineer': {
    demand: '★★★★★ Very High',
    salary: '₹22L – ₹45L LPA',
    recruiters: ['OpenAI', 'Google DeepMind', 'Microsoft', 'Anthropic', 'NVIDIA', 'CoHere'],
    growingSkill: 'RAG & Vector DBs',
    openings: '28,000+ Jobs',
    hiringTrend: '⬆ Rising',
  },
  'Machine Learning Engineer': {
    demand: '★★★★★ Very High',
    salary: '₹20L – ₹42L LPA',
    recruiters: ['Google DeepMind', 'NVIDIA', 'OpenAI', 'Meta AI', 'Microsoft', 'Apple'],
    growingSkill: 'PyTorch & MLOps Pipelines',
    openings: '22,000+ Jobs',
    hiringTrend: '⬆ Rising Fast',
  },
  'Data Scientist': {
    demand: '★★★★☆ High',
    salary: '₹18L – ₹32L LPA',
    recruiters: ['Amazon', 'Walmart', 'PhonePe', 'Uber', 'Fractal', 'Mu Sigma'],
    growingSkill: 'Predictive Modeling',
    openings: '32,000+ Jobs',
    hiringTrend: '⬆ Steady',
  },
  'Cloud Engineer': {
    demand: '★★★★☆ High',
    salary: '₹16L – ₹30L LPA',
    recruiters: ['AWS', 'Microsoft Azure', 'Google Cloud', 'TCS', 'Infosys', 'Wipro'],
    growingSkill: 'Terraform IaC',
    openings: '35,000+ Jobs',
    hiringTrend: '⬆ Rising',
  },
  'DevOps Engineer': {
    demand: '★★★★★ Very High',
    salary: '₹18L – ₹32L LPA',
    recruiters: ['Atlassian', 'Red Hat', 'Datadog', 'GitLab', 'HashiCorp', 'Swiggy'],
    growingSkill: 'Kubernetes Helm',
    openings: '34,000+ Jobs',
    hiringTrend: '⬆ Rising',
  },
  'Cybersecurity Engineer': {
    demand: '★★★★☆ High',
    salary: '₹16L – ₹30L LPA',
    recruiters: ['Palo Alto Networks', 'Cisco', 'CrowdStrike', 'Deloitte', 'KPMG', 'Mandiant'],
    growingSkill: 'SIEM & Threat Detection',
    openings: '25,000+ Jobs',
    hiringTrend: '⬆ Steady',
  },
}

export function CareerProvider({ children }) {
  // ── ONBOARDING STATE ──
  // null = still checking, true = completed, false = not completed (show wizard)
  const [onboardingCompleted, setOnboardingCompleted] = useState(null)
  const [isCheckingProfile, setIsCheckingProfile] = useState(true)

  // Target career goal defaults to empty string until explicitly chosen by student
  const [currentCareer, setCurrentCareerState] = useState(() => {
    try {
      return localStorage.getItem('zenscore_selected_career') || ''
    } catch {
      return ''
    }
  })

  // Function to set and save career goal (Full Career Pivot Synchronization)
  const changeCareerGoal = async (newRole) => {
    if (!newRole) return
    const prevCareer = currentCareer
    setCurrentCareerState(newRole)
    setOnboardingCompleted(true)
    try {
      localStorage.setItem('zenscore_selected_career', newRole)
      localStorage.setItem('zenscore_career_onboarding_completed', 'true')

      // 1. Generate or retrieve personalized roadmap for new target role
      const newRoadmap = getOrGenerateRoadmap(newRole, { completed: 0, total: 24 })
      setCurrentRoadmap(newRoadmap)
      if (newRoadmap) {
        saveRoadmapToStorage(newRoadmap)
      }

      // 2. Sync backend career API
      await syncCareerModule('profile', { careerGoal: { targetCareer: newRole } }).catch(() => null)

      // 3. Immediately write canonical selectedCareerGoal to StudentProfile
      await updateProfileSection('careerProfile', {
        selectedCareerGoal: newRole,
        currentRoadmapId: newRoadmap?.id || newRole,
        currentPhaseTitle: newRoadmap?.currentPhase?.title || 'Phase 1: Foundations',
        onboardingCompleted: true,
        careerLastActivity: new Date().toISOString()
      }, 'Careers').catch(() => null)

      // 4. Trigger Cross-Module Automation Engine Event
      registerAutomation(AUTOMATION_EVENTS.CAREER_GOAL_CHANGED, {
        previousCareer: prevCareer,
        newCareer: newRole,
        timestamp: new Date().toISOString()
      })

      // 5. Refresh all backend career data
      refreshAllCareerData()
    } catch (err) {
      console.warn('Failed to persist selected career goal:', err)
    }
  }

  // Live Backend Data States
  const [dashboardData, setDashboardData] = useState(null)
  const [learningData, setLearningData] = useState(null)
  const [resumeData, setResumeData] = useState(null)
  const [opportunitiesData, setOpportunitiesData] = useState(null)
  const [interviewData, setInterviewData] = useState(null)
  const [copilotContextData, setCopilotContextData] = useState(null)
  const [isBackendLoading, setIsBackendLoading] = useState(true)

  // Local fallback metrics
  const [careerReadiness, setCareerReadiness] = useState(0)
  const [completedSkills, setCompletedSkills] = useState(0)
  const [verifiedSkillsList, setVerifiedSkillsList] = useState([])
  const [totalSkills, setTotalSkills] = useState(24)
  const [projectsBuilt, setProjectsBuilt] = useState(0)
  const [resumeScore, setResumeScore] = useState(0)
  const [interviewReadiness, setInterviewReadiness] = useState(0)
  const [certificatesList, setCertificatesList] = useState([])

  const [gamificationState, setGamificationState] = useState(() => getGamificationState())
  const [currentRoadmap, setCurrentRoadmap] = useState(() => {
    // Only generate a roadmap if the student has already selected a career goal
    const savedCareer = (() => { try { return localStorage.getItem('zenscore_selected_career') || '' } catch { return '' } })()
    return savedCareer ? getOrGenerateRoadmap(savedCareer, { completed: 0, total: 24 }) : null
  })

  const activePhaseObj = currentRoadmap?.currentPhase || {
    title: 'Phase 1: Foundations',
    dailyMission: { title: 'Complete Initial Orientation & Skill Assessment', time: '15 Minutes', xp: 150 },
  }

  const [currentRoadmapPhase, setCurrentRoadmapPhase] = useState(activePhaseObj.title || 'Phase 1: Foundations')
  const [todayMission, setTodayMission] = useState({
    title: activePhaseObj.dailyMission?.title || 'Select Target Career Goal',
    time: '5 Minutes',
    xp: 100,
    readinessBoost: '+5%',
  })

  const [estimatedCompletionDays, setEstimatedCompletionDays] = useState(currentRoadmap?.estimatedCompletionDays || 90)

  // Fetch Live Backend Data for All Careers Submodules
  const refreshAllCareerData = useCallback(async () => {
    setIsBackendLoading(true)
    try {
      const [dash, learn, res, opp, int, cop] = await Promise.allSettled([
        fetchCareersDashboard(),
        fetchLearningHub(),
        fetchResumeCenter(),
        fetchOpportunities(),
        fetchInterviewCenter(),
        fetchCopilotContext()
      ])

      // Resolve settled values
      const dashVal  = dash.status  === 'fulfilled' && dash.value  ? dash.value  : null
      const learnVal = learn.status === 'fulfilled' && learn.value ? learn.value : null
      const resVal   = res.status   === 'fulfilled' && res.value   ? res.value   : null
      const intVal   = int.status   === 'fulfilled' && int.value   ? int.value   : null

      if (dashVal) {
        setDashboardData(dashVal)
        if (dashVal.careerGoal?.targetCareer) {
          setCurrentCareerState(dashVal.careerGoal.targetCareer)
          try { localStorage.setItem('zenscore_selected_career', dashVal.careerGoal.targetCareer) } catch {}
        }
      }
      if (learnVal) setLearningData(learnVal)
      if (resVal)   setResumeData(resVal)
      if (opp.status === 'fulfilled' && opp.value) setOpportunitiesData(opp.value)
      if (intVal)   setInterviewData(intVal)
      if (cop.status === 'fulfilled' && cop.value) setCopilotContextData(cop.value)

      // ── STUDENT PROFILE SYNC ──────────────────────────────────────
      // Fire-and-forget: never blocks UI, never throws, silent on error
      // Read currentCareer from localStorage here since state update is async
      const latestCareer = (() => { try { return localStorage.getItem('zenscore_selected_career') || '' } catch { return '' } })()
      syncCareersToProfile({
        currentCareer:       dashVal?.careerGoal?.targetCareer || latestCareer,
        onboardingCompleted: true,  // refreshAllCareerData only called when onboarding is done
        dashboardData:       dashVal,
        learningData:        learnVal,
        resumeData:          resVal,
        interviewData:       intVal,
        currentRoadmap:      null,  // roadmap is local state, not accessible here — synced via finishOnboarding
        careerReadiness:     dashVal?.careerReadiness?.overallReadinessPct ?? 0,
        interviewReadiness:  intVal?.interviewReadiness ?? 0,
      })
      // ─────────────────────────────────────────────────────────────
    } catch (err) {
      console.warn('[CareerContext] Live data sync fallback notice:', err?.message)
    } finally {
      setIsBackendLoading(false)
    }
  }, [])

  // ── CHECK ONBOARDING STATUS ON MOUNT & AUTH CHANGE ──
  const { user, backendUser } = useAuth()

  useEffect(() => {
    let cancelled = false
    const checkOnboardingStatus = async () => {
      setIsCheckingProfile(true)
      try {
        // 1. Fast path: check backendUser from auth context if already loaded
        const authTargetRole = backendUser?.careerProfile?.selectedCareerGoal || backendUser?.targetCareer || backendUser?.careerGoal?.targetCareer || backendUser?.targetRole
        if (authTargetRole && authTargetRole.trim().length > 0) {
          if (!cancelled) {
            setOnboardingCompleted(true)
            setCurrentCareerState(authTargetRole)
            try {
              localStorage.setItem('zenscore_selected_career', authTargetRole)
              localStorage.setItem('zenscore_career_onboarding_completed', 'true')
            } catch {}
          }
        }

        // 2. Query backend for authoritative profile status
        const { onboardingCompleted: apiCompleted, profile: apiProfile } = await fetchCareerProfileStatus()
        
        const apiTargetRole = apiProfile?.careerGoal?.targetCareer || apiProfile?.targetCareer || apiProfile?.selectedCareerGoal
        if (apiProfile && (apiCompleted === true || apiProfile.onboardingCompleted === true || apiTargetRole)) {
          const role = apiTargetRole || authTargetRole || ''
          if (!cancelled) {
            setOnboardingCompleted(true)
            setCurrentCareerState(role)
            try {
              if (role) localStorage.setItem('zenscore_selected_career', role)
              localStorage.setItem('zenscore_career_onboarding_completed', 'true')
            } catch {}
          }
        } else if (apiProfile && apiProfile.onboardingCompleted === false && !apiTargetRole && !authTargetRole) {
          // Explicitly new/un-onboarded user from backend
          if (!cancelled) {
            setOnboardingCompleted(false)
            setCurrentCareerState('')
            try {
              localStorage.removeItem('zenscore_selected_career')
              localStorage.removeItem('zenscore_career_onboarding_completed')
            } catch {}
          }
        } else {
          // Fallback: check cached student profile if backend unreachable
          const cachedCareer = (() => { try { return localStorage.getItem('zenscore_selected_career') || '' } catch { return '' } })()
          const cachedFlag = (() => { try { return localStorage.getItem('zenscore_career_onboarding_completed') === 'true' } catch { return false } })()
          // Only mark as done if there's a real cached career that the user explicitly selected
          const isDone = Boolean((cachedFlag && cachedCareer && cachedCareer.length > 0) || authTargetRole)
          if (!cancelled) {
            setOnboardingCompleted(isDone)
            if (isDone) setCurrentCareerState(cachedCareer || authTargetRole || '')
          }
        }
      } catch (err) {
        if (!cancelled) {
          const cachedCareer = (() => { try { return localStorage.getItem('zenscore_selected_career') || '' } catch { return '' } })()
          const cachedFlag = (() => { try { return localStorage.getItem('zenscore_career_onboarding_completed') === 'true' } catch { return false } })()
          const authTargetRole = backendUser?.careerProfile?.selectedCareerGoal || backendUser?.targetCareer
          const isDone = Boolean((cachedFlag && cachedCareer) || authTargetRole)
          setOnboardingCompleted(isDone)
          if (isDone) setCurrentCareerState(cachedCareer || authTargetRole || '')
        }
      } finally {
        if (!cancelled) setIsCheckingProfile(false)
      }
    }
    checkOnboardingStatus()
    return () => { cancelled = true }
  }, [user, backendUser])

  // ── COMPLETE ONBOARDING ACTION ──
  const finishOnboarding = useCallback(async (payload) => {
    // Must have an explicit career goal — never default to a random career
    const targetCareer = payload?.careerGoal?.targetCareer || payload?.targetCareer || ''
    if (!targetCareer) {
      console.warn('[CareerContext] finishOnboarding called with no targetCareer — ignoring')
      return null
    }

    try {
      localStorage.setItem('zenscore_selected_career', targetCareer)
      localStorage.setItem('zenscore_career_onboarding_completed', 'true')
    } catch {}

    setOnboardingCompleted(true)
    setCurrentCareerState(targetCareer)

    const profile = await completeCareerOnboarding(payload).catch(() => null)

    // Write canonical selectedCareerGoal and onboardingCompleted to StudentProfile
    await updateProfileSection('careerProfile', {
      selectedCareerGoal: targetCareer,
      onboardingCompleted: true,
      currentRoadmapId: targetCareer,
      experienceLevel: payload?.skillLevel || 'Beginner',
      dreamCompanies: payload?.dreamCompanies || []
    }, 'Careers').catch(() => null)

    // Sync to student profile envelope
    syncCareersToProfile({
      currentCareer: targetCareer,
      onboardingCompleted: true,
      dashboardData: null,
      learningData: null,
      resumeData: null,
      interviewData: null,
      currentRoadmap: null,
      careerReadiness: 0,
      interviewReadiness: 0,
    })

    refreshAllCareerData()
    return profile
  }, [refreshAllCareerData])

  useEffect(() => {
    // Only load career data if onboarding is complete
    if (onboardingCompleted === true) {
      refreshAllCareerData()
    }
  }, [onboardingCompleted, refreshAllCareerData])

  const awardXP = (amount, sourceReason = 'General Action') => {
    setGamificationState(prev => {
      const updated = awardXPAndCheckBadges(prev, amount, sourceReason)
      return { ...updated }
    })
  }

  const completeRoadmapPhase = (phaseId) => {
    const updated = unlockNextRoadmapPhase(currentRoadmap, phaseId)
    if (updated) {
      setCurrentRoadmap({ ...updated })
      awardXP(300, `Completed Phase ${phaseId}`)
      saveRoadmapToStorage(updated)
      syncCareerModule('skills', { phaseId })
    }
  }

  const syncSkillCompletion = (skillName) => {
    setCompletedSkills(prev => Math.min(prev + 1, totalSkills))
    setVerifiedSkillsList(prev => [...new Set([...prev, skillName])])
    setCareerReadiness(prev => Math.min(100, prev + 5))
    awardXP(150, skillName)
    syncCareerModule('skills', { skillName })
  }

  const getCurrentReadiness = () => dashboardData?.careerReadiness?.overallReadinessPct || careerReadiness
  const getCompletedSkillCount = () => learningData?.completedSkills?.length || completedSkills
  const getATSScore = () => resumeData?.atsScore || resumeScore
  const getInterviewReadiness = () => interviewData?.interviewReadiness || interviewReadiness
  const getRoadmapProgress = () => {
    if (learningData?.learningProgress !== undefined) return learningData.learningProgress
    return 0
  }

  const value = {
    // ── ONBOARDING STATE ──
    onboardingCompleted,
    isCheckingProfile,
    finishOnboarding,

    // Live Backend Data States
    dashboardData,
    learningData,
    resumeData,
    opportunitiesData,
    interviewData,
    copilotContextData,
    isBackendLoading,
    refreshAllCareerData,

    // Identity & Status
    hasSelectedCareerGoal: Boolean(currentCareer),
    currentCareer,
    setCurrentCareer: changeCareerGoal,
    selectCareerGoal: changeCareerGoal,
    selectCareerRole: changeCareerGoal,

    // Dynamic Earned Progress Metrics
    careerReadiness: getCurrentReadiness(),
    completedSkills: getCompletedSkillCount(),
    verifiedSkillsList,
    totalSkills,
    remainingSkills: Math.max(0, totalSkills - getCompletedSkillCount()),
    projectsBuilt,
    resumeScore: getATSScore(),
    interviewReadiness: getInterviewReadiness(),
    certificatesList,

    // Roadmap Engine
    currentRoadmap,
    roadmapVersion: 'v1.1',
    roadmapGeneratedAt: currentRoadmap?.generatedAt || new Date().toISOString(),
    roadmapProgress: getRoadmapProgress(),
    currentRoadmapPhase,
    todayMission,
    estimatedCompletionDays,
    completeRoadmapPhase,
    syncSkillCompletion,
  }

  return <CareerContext.Provider value={value}>{children}</CareerContext.Provider>
}
