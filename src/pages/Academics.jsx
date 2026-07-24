import React, { useState, useEffect, Component } from 'react'
import AcademicsOnboarding, { isOnboardingComplete } from '../components/academics/onboarding/AcademicsOnboarding'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../context/AuthContext'
import SectionHeader from '../components/common/SectionHeader'
import WelcomeStats from '../components/academics/WelcomeStats'
import QuickActions from '../components/academics/QuickActions'
import SubjectHealth from '../components/academics/SubjectHealth'
import AddSemesterModal from '../components/academics/AddSemesterModal'
import AddSubjectModal from '../components/academics/AddSubjectModal'
import TranscriptOCRModal from '../components/academics/TranscriptOCRModal'
import { getAcademicsDashboard, predictAcademics, deleteSemester, deleteSubject } from '../services/api'

// Import Academic Intelligence Components
import AIPredictionPanel from '../components/academics/intelligence/AIPredictionPanel'
import AcademicHealthCard from '../components/academics/intelligence/AcademicHealthCard'
import AIInsights from '../components/academics/intelligence/AIInsights'
import SubjectRiskCards from '../components/academics/intelligence/SubjectRiskCards'
import AIRecommendations from '../components/academics/intelligence/AIRecommendations'
import SemesterTimeline from '../components/academics/intelligence/SemesterTimeline'
import AIChatPanel from '../components/academics/copilot/AIChatPanel'
import SubjectTable from '../components/academics/SubjectTable'
import StudyPlanner from '../components/academics/planner/StudyPlanner'

// Import Modals & Common Utilities
import EditSemesterModal from '../components/academics/EditSemesterModal'
import EditSubjectModal from '../components/academics/EditSubjectModal'
import ConfirmationModal from '../components/common/ConfirmationModal'

// Premium Section Header (Academics Revamp Stage 1)
const RevampedSectionHeader = ({ icon, label, title, description }) => (
  <div className="mb-6 flex flex-col gap-1">
    <div className="flex items-center gap-2">
      <span className="text-sm bg-indigo-50 dark:bg-indigo-950/40 p-1.5 rounded-lg border border-indigo-100/50 dark:border-indigo-900/50 shadow-sm leading-none flex items-center justify-center">
        {icon}
      </span>
      <span className="text-[10px] font-extrabold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
        {label}
      </span>
    </div>
    <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-sans tracking-tight mt-1">
      {title}
    </h3>
    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-normal mt-0.5">
      {description}
    </p>
  </div>
)

/**
 * CopilotErrorBoundary
 * Class-based error boundary that catches any runtime exceptions thrown
 * by AIChatPanel and renders a friendly fallback card instead of crashing
 * the entire Academics page.
 */
class CopilotErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // Log for monitoring — never expose to user
    console.error('[AIChatPanel Error Boundary]', error, info?.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="p-6 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 rounded-2xl text-center flex flex-col items-center gap-3"
          role="alert"
          aria-live="assertive"
        >
          <span className="text-2xl" aria-hidden="true">🤖</span>
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400">
              Academic Copilot Unavailable
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-500 max-w-xs">
              Please refresh the page or try again later. Your academic data is unaffected.
            </p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all"
          >
            Try Again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function Academics() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Onboarding gate — reads localStorage so returning users skip the flow
  const [onboarded, setOnboarded] = useState(() => isOnboardingComplete())

  // State Management
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [showSemesterModal, setShowSemesterModal] = useState(false)
  const [showSubjectModal, setShowSubjectModal] = useState(false)
  const [showOCRModal, setShowOCRModal] = useState(false)
  const [predictionLoading, setPredictionLoading] = useState(false)
  const [showCopilotDrawer, setShowCopilotDrawer] = useState(false)

  // Edit / Delete Modals & States
  const [selectedSemester, setSelectedSemester] = useState(null)
  const [showEditSemesterModal, setShowEditSemesterModal] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [selectedSubjectSemNum, setSelectedSubjectSemNum] = useState(null)
  const [showEditSubjectModal, setShowEditSubjectModal] = useState(false)
  
  const [deleteSemesterData, setDeleteSemesterData] = useState(null)
  const [showDeleteSemesterModal, setShowDeleteSemesterModal] = useState(false)
  const [deleteSubjectData, setDeleteSubjectData] = useState(null)
  const [deleteSubjectSemNum, setDeleteSubjectSemNum] = useState(null)
  const [showDeleteSubjectModal, setShowDeleteSubjectModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Redirect unauthenticated traffic
  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  // Hydrate dashboard metrics
  const fetchDashboard = async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await getAcademicsDashboard()
      if (res.success) {
        setDashboardData(res.data)
      } else {
        if (res.status === 404 || res.message?.includes('not found')) {
          setDashboardData(null)
        } else {
          setErrorMsg(res.message || 'Failed to retrieve academic dashboard details.')
        }
      }
    } catch (err) {
      const status = err.response?.status
      const msg = err.response?.data?.message || err.message
      if (status === 404 || msg?.includes('not found')) {
        setDashboardData(null)
      } else {
        setErrorMsg(msg || 'Unable to connect to the server. Please check your connection.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Load context on mount
  useEffect(() => {
    if (user) {
      fetchDashboard()
    }
  }, [user])

  // Flat list subjects mapper — attaches _semesterNumber so SubjectTable
  // can correctly route edit / delete actions to the right semester.
  const getFlattenedSubjects = () => {
    if (!dashboardData || !dashboardData.semesters) return []
    const allSubjects = []
    dashboardData.semesters.forEach(sem => {
      if (sem.subjects) {
        sem.subjects.forEach(sub => {
          allSubjects.push({ ...sub, _semesterNumber: sem.semesterNumber })
        })
      }
    })
    return allSubjects
  }

  const handleEditSemesterTrigger = (sem) => {
    setSelectedSemester(sem)
    setShowEditSemesterModal(true)
  }

  const handleDeleteSemesterTrigger = (sem) => {
    setDeleteSemesterData(sem)
    setShowDeleteSemesterModal(true)
  }

  const handleConfirmDeleteSemester = async () => {
    if (!deleteSemesterData) return
    setDeleteLoading(true)
    try {
      const res = await deleteSemester(deleteSemesterData.semesterNumber)
      if (res.success) {
        setDashboardData(res.data)
        fetchDashboard() // Refresh dashboard context
        setShowDeleteSemesterModal(false)
      } else {
        alert(res.message || 'Failed to delete semester.')
      }
    } catch (err) {
      alert(err.message || 'An error occurred while deleting the semester.')
    } finally {
      setDeleteLoading(false)
    }
  }

  const findSemesterNumberForSubject = (sub) => {
    if (!dashboardData || !dashboardData.semesters) return null
    for (let sem of dashboardData.semesters) {
      if (sem.subjects) {
        const found = sem.subjects.some(s => String(s._id || s.id) === String(sub._id || sub.id))
        if (found) return sem.semesterNumber
      }
    }
    return null
  }

  const handleEditSubjectTrigger = (sub) => {
    const semNum = findSemesterNumberForSubject(sub)
    if (semNum !== null) {
      setSelectedSubjectSemNum(semNum)
      setSelectedSubject(sub)
      setShowEditSubjectModal(true)
    }
  }

  const handleDeleteSubjectTrigger = (sub) => {
    const semNum = findSemesterNumberForSubject(sub)
    if (semNum !== null) {
      setDeleteSubjectSemNum(semNum)
      setDeleteSubjectData(sub)
      setShowDeleteSubjectModal(true)
    }
  }

  const handleConfirmDeleteSubject = async () => {
    if (!deleteSubjectData || !deleteSubjectSemNum) return
    setDeleteLoading(true)
    try {
      const res = await deleteSubject(deleteSubjectSemNum, deleteSubjectData._id || deleteSubjectData.id)
      if (res.success) {
        setDashboardData(res.data)
        fetchDashboard() // Refresh dashboard context
        setShowDeleteSubjectModal(false)
      } else {
        alert(res.message || 'Failed to delete subject.')
      }
    } catch (err) {
      alert(err.message || 'An error occurred while deleting the subject.')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleGeneratePrediction = async () => {
    setPredictionLoading(true)
    try {
      const res = await predictAcademics()
      if (res.success) {
        alert(res.message || 'Prediction generated successfully!')
        fetchDashboard()
      }
    } catch (err) {
      alert(err.message || 'Failed to generate prediction.')
    } finally {
      setPredictionLoading(false)
    }
  }

  const handleGenerateAI = () => {
    alert('Coming in Phase 4: Custom AI-generated study roadmap tailored to your curriculum.')
  }

  const handleUploadScreenshot = () => {
    alert('Coming in Phase 8: OCR grade sheet scanner. Drop transcripts to auto-log your metrics.')
  }

  const hasSemesters = dashboardData?.semesters && dashboardData.semesters.length > 0

  // ── Onboarding Gate ──────────────────────────────────────────
  // Show the 3-step onboarding wizard for first-time users.
  // Once complete it marks localStorage and flips `onboarded` to true,
  // which causes a re-render into the normal dashboard below.
  if (!onboarded) {
    return (
      <AcademicsOnboarding
        onComplete={() => {
          setOnboarded(true)
          // Trigger a fresh dashboard load so newly created profile shows up
          if (user) fetchDashboard()
        }}
      />
    )
  }

  return (
    <AppLayout>
      <style>{`
        @keyframes floatIllustrate {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1.5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .float-icon {
          animation: floatIllustrate 5s ease-in-out infinite;
        }
      `}</style>

      <div style={{ padding: '32px', flex: 1, maxWidth: 1140, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* ── 1. PREMIUM HERO BANNER ── */}
        <section
          className="relative rounded-[30px] p-8 md:p-10 shadow-lg border border-indigo-100/10 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8"
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4f46e5 100%)',
          }}
        >
          <div className="absolute top-[-50px] left-[10%] w-[300px] height-[300px] rounded-full bg-indigo-500/10 blur-[60px] pointer-events-none" />

          <div className="flex items-start gap-5 z-10 flex-1">
            <div className="float-icon text-5xl bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl shadow-inner flex items-center justify-center flex-shrink-0">
              📚
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-extrabold tracking-widest text-indigo-300 uppercase">
                ZenScore AI Analytics
              </span>
              <h2 className="text-3xl font-extrabold text-white font-sans tracking-tight leading-tight">
                Academics
              </h2>
              <p className="text-sm text-indigo-100 max-w-xl leading-relaxed">
                Monitor your academic journey with AI-powered insights, health analysis, performance tracking, and intelligent recommendations.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 z-10 w-full md:w-auto flex-shrink-0">
            <button
              onClick={() => setShowOCRModal(true)}
              className="px-6 py-3 text-xs font-bold text-indigo-900 bg-white hover:bg-indigo-50 active:bg-indigo-100 rounded-xl shadow-md transition-all duration-150 hover:-translate-y-0.5 flex items-center justify-center gap-2 select-none"
            >
              <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Import Transcript
            </button>
            <button
              onClick={handleGenerateAI}
              className="px-6 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl border border-indigo-400/30 hover:border-indigo-400/50 shadow-sm transition-all duration-150 hover:-translate-y-0.5 flex items-center justify-center gap-2 select-none"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate AI Plan
            </button>
            <button
              onClick={() => setShowCopilotDrawer(true)}
              className="px-6 py-3 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-xl border border-purple-400/30 hover:border-purple-400/50 shadow-md transition-all duration-150 hover:-translate-y-0.5 flex items-center justify-center gap-2 select-none"
            >
              <svg className="w-4 h-4 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Ask AI Copilot
            </button>
          </div>
        </section>

        {/* Dynamic Fetch Error Handling Banner */}
        {errorMsg ? (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-150 dark:border-red-900/50 rounded-2xl p-6 text-center shadow-sm max-w-lg mx-auto mt-12 flex flex-col gap-4 items-center">
            <span className="text-3xl">⚠️</span>
            <div className="text-left flex flex-col gap-1">
              <h4 className="text-sm font-bold text-red-800 dark:text-red-400">
                Failed to Load Dashboard Data
              </h4>
              <p className="text-xs text-red-600 dark:text-red-450">
                {errorMsg}
              </p>
            </div>
            <button
              onClick={fetchDashboard}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-xs font-bold text-white rounded-xl shadow transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <>
            {/* 1. CGPA Metric Circular Indicator Cards */}
            <WelcomeStats
              currentCGPA={dashboardData?.currentCGPA}
              targetCGPA={dashboardData?.targetCGPA}
              predictedCGPA={dashboardData?.predictedCGPA}
              loading={loading || predictionLoading}
              semesters={dashboardData?.semesters || []}
              onGeneratePrediction={handleGeneratePrediction}
              healthScore={dashboardData?.intelligence?.healthScore}
            />

            {/* 2. Quick Action Bar Triggers */}
            <QuickActions
              onOpenSemester={() => setShowSemesterModal(true)}
              onOpenSubject={() => setShowSubjectModal(true)}
              onGenerateAI={handleGenerateAI}
              onUpload={handleUploadScreenshot}
            />

            {/* 3. Skeletons Loader or Dashboard Content blocks */}
            {loading ? (
              <div className="flex flex-col gap-8 animate-pulse mt-8" aria-hidden="true">
                {/* Health Card Skeleton */}
                <div className="p-6 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/20 dark:border-slate-800/20 rounded-2xl flex flex-col md:flex-row gap-6 justify-between items-center">
                  <div className="flex items-center gap-5 w-full md:w-auto">
                    <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
                    <div className="flex flex-col gap-2.5 flex-1">
                      <div className="w-28 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="w-36 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
                    {[1, 2, 3, 4].map(n => (
                      <div key={n} className="w-24 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                    ))}
                  </div>
                </div>

                {/* Insights Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="p-5 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/20 dark:border-slate-800/20 rounded-2xl h-32 flex flex-col justify-between">
                      <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="w-2/3 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="w-1/2 h-3.5 bg-slate-200 dark:bg-slate-800 rounded" />
                    </div>
                  ))}
                </div>

                {/* Risk Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="p-5 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/20 dark:border-slate-800/20 rounded-2xl h-36 flex flex-col justify-between">
                      <div className="w-1/2 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="w-2/3 h-2.5 bg-slate-200 dark:bg-slate-800 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            ) : !hasSemesters ? (
              <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-[24px] p-12 text-center shadow-sm max-w-lg mx-auto mt-8 flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl shadow-md select-none">
                  📝
                </div>
                <div className="flex flex-col gap-1.5 text-center">
                  <h4 className="text-sm font-extrabold text-slate-850 dark:text-slate-200 uppercase tracking-widest font-sans">
                    Begin Your Academic Track
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal max-w-xs mx-auto">
                    Log your semesters and courses, or upload your grade transcripts to activate the AI performance metrics dashboard.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                  <button
                    onClick={() => setShowOCRModal(true)}
                    className="px-6 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-850 rounded-xl shadow-md transition-all select-none hover:-translate-y-0.5 duration-150 flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Import Transcript
                  </button>
                  <button
                    onClick={() => setShowSemesterModal(true)}
                    className="px-6 py-3 text-xs font-bold text-slate-750 dark:text-slate-200 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm transition-all select-none hover:-translate-y-0.5 duration-150"
                  >
                    + Add Semester
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-8">

                {/* ── AI Performance Prediction Panel (Phase 3) ── */}
                <AIPredictionPanel
                  id="ai-prediction-section"
                  predictedCGPA={dashboardData?.predictedCGPA}
                  currentCGPA={dashboardData?.currentCGPA}
                  targetCGPA={dashboardData?.targetCGPA}
                  healthScore={dashboardData?.intelligence?.healthScore}
                  insights={dashboardData?.intelligence?.insights}
                  semesters={dashboardData?.semesters || []}
                  loading={false}
                  onGeneratePrediction={handleGeneratePrediction}
                  onViewDetails={() => {
                    document.getElementById('academic-health-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                />

                {/* ── AI Study Planner & Academic Workspace (Phase 4) ── */}
                <StudyPlanner />

                {/* A. Academic Health Score Card */}
                <div id="academic-health-section" className="flex flex-col gap-4">
                  <RevampedSectionHeader
                    icon="🏥"
                    label="Academic Health"
                    title="Academic Health Index"
                    description="Monitor your overall academic wellness and performance."
                  />
                  {dashboardData?.intelligence?.healthScore ? (
                    <AcademicHealthCard healthScore={dashboardData.intelligence.healthScore} />
                  ) : (
                    <div className="p-5 bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl text-center text-slate-500 text-xs font-semibold">
                      No academic intelligence available yet.
                    </div>
                  )}
                </div>

                {/* B. AI Insights Cards Grid */}
                <div id="ai-insights-section" className="flex flex-col gap-4">
                  <RevampedSectionHeader
                    icon="💡"
                    label="Insights"
                    title="AI Academic Insights"
                    description="Gain automated intelligence into your learning velocity."
                  />
                  {dashboardData?.intelligence?.insights ? (
                    <AIInsights insights={dashboardData.intelligence.insights} />
                  ) : (
                    <div className="p-5 bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl text-center text-slate-500 text-xs font-semibold">
                      No academic intelligence available yet.
                    </div>
                  )}
                </div>

                {/* C. Subject Risk Metrics Grid */}
                <div id="subject-risk-section" className="flex flex-col gap-4">
                  <RevampedSectionHeader
                    icon="⚠️"
                    label="Risk Analysis"
                    title="Subject Risk Metrics"
                    description="Assess subject margins, credit weights, and performance hazards."
                  />
                  {dashboardData?.intelligence?.riskScores ? (
                    <SubjectRiskCards riskScores={dashboardData.intelligence.riskScores} />
                  ) : (
                    <div className="p-5 bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl text-center text-slate-500 text-xs font-semibold">
                      No academic intelligence available yet.
                    </div>
                  )}
                </div>

                {/* D. AI Actionable Recommendations List */}
                <div id="ai-recommendations-section" className="flex flex-col gap-4">
                  <RevampedSectionHeader
                    icon="🎯"
                    label="Recommendations"
                    title="Actionable AI Recommendations"
                    description="AI-guided focus adjustments to elevate your grades."
                  />
                  {dashboardData?.intelligence?.recommendations ? (
                    <AIRecommendations recommendations={dashboardData.intelligence.recommendations} />
                  ) : (
                    <div className="p-5 bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl text-center text-slate-500 text-xs font-semibold">
                      No academic intelligence available yet.
                    </div>
                  )}
                </div>

                {/* F. Expandable Performance Timeline */}
                <div id="semester-timeline-section" className="flex flex-col gap-4">
                  <RevampedSectionHeader
                    icon="⏳"
                    label="Timeline"
                    title="Academic Performance Timeline"
                    description="Track semester SGPAs, logged subjects, and completion stages."
                  />
                  {dashboardData?.semesters ? (
                    <SemesterTimeline 
                      semesters={dashboardData.semesters} 
                      onEditSemester={handleEditSemesterTrigger}
                      onDeleteSemester={handleDeleteSemesterTrigger}
                    />
                  ) : (
                    <div className="p-5 bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl text-center text-slate-500 text-xs font-semibold">
                      No semester timeline details available.
                    </div>
                  )}
                </div>

                {/* F. My Subjects — Compact Table View */}
                <div
                  id="subject-health-section"
                  style={{
                    background: '#fff',
                    borderRadius: 24,
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
                    padding: '24px 28px',
                  }}
                >
                  {/* Section header row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.6px', background: '#EEF2FF', padding: '3px 10px', borderRadius: 99 }}>
                          Subjects
                        </span>
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#1E293B', fontFamily: 'Sora, sans-serif' }}>
                        My Subjects
                      </div>
                      <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, marginTop: 2 }}>
                        Attendance, marks, and performance status for all enrolled subjects
                      </div>
                    </div>
                    <button
                      onClick={() => setShowSubjectModal(true)}
                      style={{
                        padding: '8px 18px',
                        background: '#6366F1',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily: 'Sora, sans-serif',
                        boxShadow: '0 2px 8px rgba(99,102,241,0.2)',
                        flexShrink: 0,
                      }}
                    >
                      + Add Subject
                    </button>
                  </div>

                  <SubjectTable
                    subjects={getFlattenedSubjects()}
                    onEditSubject={handleEditSubjectTrigger}
                    onDeleteSubject={handleDeleteSubjectTrigger}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* 4. Add Semester Input Modal */}
        <AddSemesterModal
          isOpen={showSemesterModal}
          onClose={() => setShowSemesterModal(false)}
          onSuccess={(updatedData) => {
            setDashboardData(updatedData)
            fetchDashboard() // Refresh dashboard context
          }}
        />

        {/* 5. Add Course Subject Modal */}
        <AddSubjectModal
          isOpen={showSubjectModal}
          onClose={() => setShowSubjectModal(false)}
          semesters={dashboardData?.semesters || []}
          onSuccess={(updatedData) => {
            setDashboardData(updatedData)
            fetchDashboard() // Refresh dashboard context
          }}
        />

        {/* 6. Transcript OCR Modal */}
        <TranscriptOCRModal
          isOpen={showOCRModal}
          onClose={() => setShowOCRModal(false)}
          onImportComplete={() => {
            alert('Academic transcript imported and processed successfully!')
            fetchDashboard() // Refresh academics data context
          }}
        />

        {/* 7. Edit Semester Modal */}
        {selectedSemester && (
          <EditSemesterModal
            isOpen={showEditSemesterModal}
            onClose={() => {
              setShowEditSemesterModal(false)
              setSelectedSemester(null)
            }}
            semester={selectedSemester}
            onSuccess={(updatedData) => {
              setDashboardData(updatedData)
              fetchDashboard()
            }}
          />
        )}

        {/* 8. Edit Subject Modal */}
        {selectedSubject && (
          <EditSubjectModal
            isOpen={showEditSubjectModal}
            onClose={() => {
              setShowEditSubjectModal(false)
              setSelectedSubject(null)
              setSelectedSubjectSemNum(null)
            }}
            semesterNumber={selectedSubjectSemNum}
            subject={selectedSubject}
            onSuccess={(updatedData) => {
              setDashboardData(updatedData)
              fetchDashboard()
            }}
          />
        )}

        {/* 9. Delete Semester Confirmation Modal */}
        {deleteSemesterData && (
          <ConfirmationModal
            isOpen={showDeleteSemesterModal}
            onCancel={() => {
              setShowDeleteSemesterModal(false)
              setDeleteSemesterData(null)
            }}
            onConfirm={handleConfirmDeleteSemester}
            loading={deleteLoading}
            title={`Delete Semester ${deleteSemesterData.semesterNumber}?`}
            message="Accidental deletion hazard: Deleting this semester will permanently delete all its subjects. This action cannot be undone."
            confirmText="Delete Semester"
          />
        )}

        {/* 10. Delete Subject Confirmation Modal */}
        {deleteSubjectData && (
          <ConfirmationModal
            isOpen={showDeleteSubjectModal}
            onCancel={() => {
              setShowDeleteSubjectModal(false)
              setDeleteSubjectData(null)
              setDeleteSubjectSemNum(null)
            }}
            onConfirm={handleConfirmDeleteSubject}
            loading={deleteLoading}
            title={`Delete Subject "${deleteSubjectData.name}"?`}
            message="This subject will be permanently removed from your record. This action cannot be undone."
            confirmText="Delete Subject"
          />
        )}

        {/* 11. AI Copilot Side Drawer */}
        {showCopilotDrawer && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div
              onClick={() => setShowCopilotDrawer(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-200"
              style={{ animation: 'fadeIn 0.2s ease-out' }}
            />
            {/* Drawer */}
            <div
              className="relative w-full max-w-[500px] h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800"
              style={{ animation: 'slideIn 0.28s cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg text-white font-semibold shadow-md shadow-indigo-500/10">
                    🤖
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-850 dark:text-slate-200">
                      Academic AI Copilot
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Ask questions about your academic progress
                    </p>
                  </div>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={() => setShowCopilotDrawer(false)}
                  className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-xs font-bold transition-all shadow-sm active:scale-95"
                  aria-label="Close Copilot"
                >
                  ✕
                </button>
              </div>

              {/* Chat Panel */}
              <div className="flex-1 overflow-hidden relative flex flex-col bg-slate-50/30 dark:bg-slate-950/10">
                <CopilotErrorBoundary>
                  <AIChatPanel style={{ height: '100%', border: 'none', borderRadius: 0, boxShadow: 'none' }} />
                </CopilotErrorBoundary>
              </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes slideIn {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
              }
            `}} />
          </div>
        )}
      </div>
    </AppLayout>
  )
}