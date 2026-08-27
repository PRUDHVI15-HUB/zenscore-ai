import { useState, useEffect, lazy, Suspense } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../context/AuthContext'
import { useCareer } from '../context/CareerContext'
import { useStudentProfile } from '../context/StudentProfileContext'
import { resolveCanonicalCareerGoal } from '../services/careers/careerNormalizer'
import CareersHero from '../components/careers/CareersHero'
import CareerOnboarding from '../components/careers/CareerOnboarding'
import { Loader2 } from 'lucide-react'

const AICareerCommandCenter = lazy(() => import('../components/careers/hero/AICareerCommandCenter'))
const LearningHub = lazy(() => import('../components/careers/learning/LearningHub'))
const ResumeCenter = lazy(() => import('../components/careers/resume/ResumeCenter'))
const JobsIntegrationHub = lazy(() => import('../components/careers/jobs/JobsIntegrationHub'))
const InterviewCenter = lazy(() => import('../components/careers/interview/InterviewCenter'))

const ModuleFallback = () => (
  <div style={{ padding: '60px 24px', textAlign: 'center', fontFamily: 'Sora, sans-serif', color: 'var(--text-muted)' }}>
    <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
    <div style={{ fontWeight: 700, fontSize: 14 }}>Loading ZenScore Module...</div>
  </div>
)

// Full-page loading screen while we check onboarding status
const ProfileCheckLoader = () => (
  <div style={{
    minHeight: 'calc(100vh - 64px)',
    background: '#F8FAFF',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    gap: 14, fontFamily: 'Sora, sans-serif',
  }}>
    <Loader2 size={32} style={{ color: '#7C3AED', animation: 'spin 1s linear infinite' }} />
    <div style={{ color: '#64748B', fontSize: 13.5, fontWeight: 600 }}>
      Loading your career profile...
    </div>
    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
  </div>
)

export default function Careers({ forcedStep = null }) {
  const { user, backendUser } = useAuth()
  const career = useCareer()
  const navigate = useNavigate()
  const location = useLocation()
  const { subTab } = useParams()

  const [activeTab, setActiveTab] = useState(() => subTab || 'overview')
  const [selectedPath, setSelectedPath] = useState('')

  useEffect(() => { if (!user) navigate('/') }, [user, navigate])

  // Sync tab state whenever URL subTab parameter changes
  useEffect(() => {
    if (subTab) {
      setActiveTab(subTab)
    } else {
      setActiveTab('overview')
    }
  }, [subTab, location.pathname])

  const handleTabChange = (newTab) => {
    setActiveTab(newTab)
    const normalized = (() => {
      if (newTab === 'overview' || newTab === 'dashboard') return 'overview'
      if (newTab === 'learning' || newTab === 'roadmap' || newTab === 'skillgap') return 'learning'
      if (newTab === 'resume') return 'resume'
      if (newTab === 'jobs' || newTab === 'paths' || newTab === 'companies' || newTab === 'internships' || newTab === 'salary') return 'jobs'
  return 'overview'
    })()

    if (normalized === 'overview') {
      navigate('/careers')
    } else {
      navigate(`/careers/${normalized}`)
    }
  }

  // Normalize tab keys to Phase 1 Primary 5 Tabs
  const currentTab = (() => {
    if (activeTab === 'overview' || activeTab === 'dashboard') return 'overview'
    if (activeTab === 'learning' || activeTab === 'roadmap' || activeTab === 'skillgap') return 'learning'
    if (activeTab === 'resume') return 'resume'
    if (activeTab === 'jobs' || activeTab === 'paths' || activeTab === 'companies' || activeTab === 'internships' || activeTab === 'salary') return 'jobs'
return 'overview'
  })()

  const studentProfileCtx = useStudentProfile()

  // Current active career path derived using single source of truth precedence
  const activeRole = resolveCanonicalCareerGoal(studentProfileCtx?.profile, career, selectedPath)

  // ── ONBOARDING GATE ──
  // While we're fetching profile status or loading student profile, show spinner inside layout
  const isHydrating = Boolean(career?.isCheckingProfile || studentProfileCtx?.isLoading)

  if (isHydrating) {
    return (
      <AppLayout>
        <ProfileCheckLoader />
      </AppLayout>
    )
  }

  // Check if forced setup or onboarding requested via prop or route
  const isForcedSetup = Boolean(
    forcedStep === 'setup' ||
    subTab === 'setup' ||
    subTab === 'onboarding' ||
    location.pathname.includes('/careers/setup') ||
    location.pathname.includes('/careers/onboarding') ||
    new URLSearchParams(location.search).get('setup') === 'true'
  )

  // Determine whether onboarding has been completed
  // IMPORTANT: Only trust explicit user-set signals — never derived activeRole (has fallbacks)
  const explicitStoredCareer = (() => {
    try {
      const v = localStorage.getItem('zenscore_selected_career')
      return v && v.trim().length > 0 ? v : null
    } catch { return null }
  })()
  const hasCompletedOnboarding = !isForcedSetup && Boolean(
    career?.onboardingCompleted === true ||
    (career?.currentCareer && career.currentCareer.trim().length > 0) ||
    (studentProfileCtx?.profile?.careerProfile?.selectedCareerGoal && studentProfileCtx?.profile?.careerProfile?.selectedCareerGoal.trim().length > 0) ||
    studentProfileCtx?.profile?.careerProfile?.onboardingCompleted === true ||
    backendUser?.careerProfile?.selectedCareerGoal ||
    backendUser?.targetCareer ||
    explicitStoredCareer ||
    localStorage.getItem('zenscore_career_onboarding_completed') === 'true'
  )


  // If onboarding is NOT completed or explicitly requested, show the wizard INSIDE AppLayout
  if (!hasCompletedOnboarding) {
    return (
      <AppLayout>
        <CareerOnboarding />
      </AppLayout>
    )
  }

  // ── EXISTING CAREERS DASHBOARD (UNTOUCHED) ──
  return (
    <AppLayout>
      {/* ── PHASE 1 HERO BANNER & 5-TAB NAVIGATION ── */}
      <CareersHero
        currentFocus={activeRole}
        activeTab={currentTab}
        setActiveTab={handleTabChange}
        onExploreRole={(newRole) => {
          if (newRole) setSelectedPath(newRole)
          handleTabChange('overview')
        }}
      />

      {/* ── PHASE 6 INTERVIEW CENTER & TABS CONTAINER ── */}
      <Suspense fallback={<ModuleFallback />}>
        {currentTab === 'overview' && (
          <div className="container" style={{ padding: '24px 24px 48px', margin: '0 auto' }}>
            <AICareerCommandCenter
              user={user}
              selectedRole={selectedPath}
              onNavigateTab={handleTabChange}
            />
          </div>
        )}

        {currentTab !== 'overview' && (
          <div className="container" style={{ padding: '32px 24px 48px', margin: '0 auto' }}>
            {/* 2. LEARNING HUB (UNIFIED ROADMAP + SKILL GAP) */}
            {currentTab === 'learning' && (
              <LearningHub
                selectedRole={activeRole}
                onSelectCareerRole={(roleTitle) => {
                  setSelectedPath(roleTitle)
                  if (career?.selectCareerGoal) career.selectCareerGoal(roleTitle)
                }}
                onNavigateTab={handleTabChange}
              />
            )}

            {/* 3. RESUME CENTER (ATS + WORKSPACE) */}
            {currentTab === 'resume' && (
              <ResumeCenter
                selectedRole={activeRole}
                onSelectCareerRole={(roleTitle) => {
                  setSelectedPath(roleTitle)
                  if (career?.selectCareerGoal) career.selectCareerGoal(roleTitle)
                }}
              />
            )}

            {/* 4. JOBS INTEGRATION HUB (CAREER -> JOBS BRIDGE) */}
            {currentTab === 'jobs' && (
              <JobsIntegrationHub
                selectedRole={activeRole}
                onSelectCareerRole={(roleTitle) => {
                  setSelectedPath(roleTitle)
                  if (career?.selectCareerGoal) career.selectCareerGoal(roleTitle)
                }}
              />
            )}

            {/* 5. INTERVIEW CENTER (PHASE 6 PLACEMENT READINESS HUB) */}
            {currentTab === 'interview' && (
              <InterviewCenter
                selectedRole={activeRole}
                onSelectCareerRole={(roleTitle) => {
                  setSelectedPath(roleTitle)
                  if (career?.selectCareerGoal) career.selectCareerGoal(roleTitle)
                }}
              />
            )}
          </div>
        )}
      </Suspense>
    </AppLayout>
  )
}