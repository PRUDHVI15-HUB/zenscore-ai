import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AppLayout from '../../components/AppLayout'
import { useAuth } from '../../context/AuthContext'
import AIChatPanel from '../../components/academics/copilot/AIChatPanel'
import { isSubjectHealthy } from '../../utils/subjectHealthUtils'

import {
  getAcademicsDashboard,
  getAIOverview,
  aiStudyPlan,
  aiCgpaPredict,
  getAIRecommendations,
  getAIAlerts
} from '../../services/api'

import {
  Bot,
  Sparkles,
  ArrowLeft,
  Award,
  Target,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  TrendingUp,
  BookOpen,
  RefreshCw,
  Clock,
  Layers,
  FileUp,
  Plus,
  HelpCircle,
  Zap,
  Sliders,
  X,
  MessageSquare
} from 'lucide-react'

export default function AIAssistant() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const plannerSectionRef = useRef(null)
  const predictorSectionRef = useRef(null)

  // Overall Data States
  const [dashboardData, setDashboardData] = useState(null)
  const [overview, setOverview] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  // Copilot Drawer State
  const [isCopilotOpen, setIsCopilotOpen] = useState(false)

  // Study Planner States
  const [planType, setPlanType] = useState('weekly')
  const [schedulePlan, setSchedulePlan] = useState(null)
  const [plannerLoading, setPlannerLoading] = useState(false)

  // CGPA Predictor States
  const [expectedSGPA, setExpectedSGPA] = useState('8.50')
  const [remainingCredits, setRemainingCredits] = useState('20')
  const [predictionResult, setPredictionResult] = useState(null)
  const [predictLoading, setPredictLoading] = useState(false)

  // Redirect unauthenticated users
  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  // Hydrate AI Workspace Context
  const fetchAIWorkspaceData = async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      const [dashRes, overviewRes, recsRes, alertsRes] = await Promise.all([
        getAcademicsDashboard().catch(() => ({ success: false })),
        getAIOverview().catch(() => ({ success: false })),
        getAIRecommendations().catch(() => ({ success: false })),
        getAIAlerts().catch(() => ({ success: false }))
      ])

      if (dashRes.success) setDashboardData(dashRes.data)
      if (overviewRes.success) setOverview(overviewRes.data)
      if (recsRes.success) setRecommendations(recsRes.data?.recommendations || [])
      if (alertsRes.success) setAlerts(alertsRes.data?.alerts || [])
    } catch (err) {
      setErrorMsg(err.message || 'Failed to initialize AI Academic Assistant.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchAIWorkspaceData()
    }
  }, [user])

  // Trigger Study Plan Generation
  const handleGenerateStudyPlan = async (type = planType) => {
    setPlannerLoading(true)
    try {
      const res = await aiStudyPlan({ planType: type })
      if (res.success && res.data) {
        setSchedulePlan(res.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setPlannerLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      handleGenerateStudyPlan('weekly')
    }
  }, [user])

  // Trigger CGPA Prediction Simulation
  const handleRunPrediction = async () => {
    setPredictLoading(true)
    try {
      const res = await aiCgpaPredict({
        expectedSGPA: parseFloat(expectedSGPA) || 8.5,
        remainingCredits: parseInt(remainingCredits, 10) || 20
      })
      if (res.success && res.data) {
        setPredictionResult(res.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setPredictLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      handleRunPrediction()
    }
  }, [user])

  // Extract weak/attention subjects (Only active backlogs/arrears or current semester risks)
  const weakSubjectsList = React.useMemo(() => {
    if (!dashboardData || !dashboardData.semesters) return []
    const list = []
    dashboardData.semesters.forEach(sem => {
      const isCompleted = sem.status === 'Completed'
      if (sem.subjects) {
        sem.subjects.forEach(sub => {
          const att = sub.attendance !== undefined && sub.attendance !== null ? Number(sub.attendance) : null
          const grade = sub.finalGrade !== undefined && sub.finalGrade !== null ? Number(sub.finalGrade) : null
          const gStr = String(sub.grade || '').toUpperCase()
          const isFailed = sub.isFailed === true || sub.result === 'FAIL' || gStr === 'F' || gStr === 'FAIL' || gStr === 'FAILED' || gStr === 'AB' || (sub.credits === 0 && (sub.creditsSecured === 0 || grade === 0 || sub.gradePoints === 0)) || (grade !== null && grade < 4.0)

          // In a Completed semester, ONLY failed subjects (backlogs) need attention!
          // In a Current active semester, low attendance (<75%) or low grade (<6.0) is a risk.
          const needsAttention = isCompleted
            ? isFailed
            : (isFailed || (att !== null && att < 75) || (grade !== null && grade > 0 && grade < 6.0))

          if (needsAttention) {
            list.push({
              name: sub.name,
              code: sub.code || `SEM-${sem.semesterNumber}`,
              semester: sem.semesterNumber,
              attendance: att ?? 100,
              grade: grade !== null && grade > 0 ? grade.toFixed(2) : (isFailed ? 'Failed' : 'Pending'),
              reason: isFailed
                ? 'Backlog / Arrear Subject (Re-exam required)'
                : (att !== null && att < 75) ? `Attendance is low (${att}%)` : `Grade requires recovery (${grade ?? 'N/A'})`,
              suggestion: isFailed
                ? 'Review course syllabus and practice past papers for upcoming backlog re-exam.'
                : (att !== null && att < 75) ? 'Attend next lectures consistently to cross 75% mark.' : 'Complete practice papers and assignments before exams.',
              priority: isFailed ? 'High' : 'Medium'
            })
          }
        })
      }
    })
    return list
  }, [dashboardData])

  const hasRecords = dashboardData && dashboardData.semesters && dashboardData.semesters.length > 0

  return (
    <AppLayout>
      <div className="container" style={{ padding: '32px 24px', maxWidth: 1140, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* â”€â”€ SECTION 1: PAGE HEADER â”€â”€ */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 24,
          padding: 24,
          boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: '#F5F3FF',
              color: '#7C3AED',
              border: '1px solid #DDD6FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              flexShrink: 0
            }}>
              <Bot size={22} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  color: '#7C3AED',
                  textTransform: 'uppercase',
                  background: '#F5F3FF',
                  padding: '2px 8px',
                  borderRadius: 6,
                  border: '1px solid #DDD6FE'
                }}>
                  Academic Intelligence
                </span>
              </div>
              <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.4px' }}>
                AI Academic Assistant
              </h1>
              <p style={{ fontSize: 13, color: '#64748B', margin: 0, maxWidth: 540, lineHeight: 1.5 }}>
                Your personalized academic mentor powered by your real academic records.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => navigate('/academics')}
              style={{
                padding: '10px 18px',
                fontSize: 12.5,
                fontWeight: 700,
                color: '#334155',
                background: '#F1F5F9',
                border: '1px solid #E2E8F0',
                borderRadius: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s'
              }}
            >
              <ArrowLeft size={14} />
              Back to Academics
            </button>

            <button
              onClick={() => setIsCopilotOpen(true)}
              style={{
                padding: '10px 20px',
                fontSize: 12.5,
                fontWeight: 700,
                color: '#FFFFFF',
                background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                border: 'none',
                borderRadius: 12,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s'
              }}
            >
              <Bot size={15} />
              Ask AI Copilot
            </button>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {[1, 2, 3, 4].map(n => <div key={n} style={{ height: 80, background: '#F8FAFC', borderRadius: 16 }} />)}
            </div>
            <div style={{ height: 240, background: '#F8FAFC', borderRadius: 24 }} />
          </div>
        ) : !hasRecords ? (
          /* EMPTY STATE */
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 24,
            padding: 48,
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            maxWidth: 500,
            margin: '0 auto'
          }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
              <BookOpen size={26} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                No academic records available yet.
              </h3>
              <p style={{ fontSize: 13, color: '#64748B', maxWidth: 360, margin: '6px auto 0' }}>
                Upload your semester memo or log your semesters to activate personalized AI mentorship and guidance.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
              <button
                onClick={() => navigate('/academics/transcript')}
                style={{ padding: '10px 20px', fontSize: 12.5, fontWeight: 700, color: '#FFFFFF', background: '#4F46E5', border: 'none', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <FileUp size={14} />
                Upload Memo
              </button>
              <button
                onClick={() => navigate('/academics')}
                style={{ padding: '10px 20px', fontSize: 12.5, fontWeight: 700, color: '#334155', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <ArrowLeft size={14} />
                Go Back
              </button>
            </div>
          </div>
        ) : (
          <React.Fragment>
            {/* â”€â”€ SECTION 2: ACADEMIC OVERVIEW (4 STAT CARDS) â”€â”€ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20 }}>
              {/* Current CGPA */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: 20,
                padding: '20px 24px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B', fontFamily: 'Sora, sans-serif' }}>Current CGPA</span>
                  <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#7C3AED' }}>
                    {overview?.currentCGPA ? Number(overview.currentCGPA).toFixed(2) : '0.00'}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: '#94A3B8' }}>Cumulative Grade Average</span>
                </div>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: '#F5F3FF',
                  color: '#7C3AED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Award size={22} strokeWidth={2.2} />
                </div>
              </div>

              {/* Target CGPA */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: 20,
                padding: '20px 24px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B', fontFamily: 'Sora, sans-serif' }}>Target CGPA</span>
                  <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#2563EB' }}>
              {overview?.targetCGPA != null ? Number(overview.targetCGPA).toFixed(2) : '\u2014 Set Goal'}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: '#94A3B8' }}>Graduation Goal</span>
                </div>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: '#EFF6FF',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Target size={22} strokeWidth={2.2} />
                </div>
              </div>

              {/* Subjects Requiring Attention */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: 20,
                padding: '20px 24px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B', fontFamily: 'Sora, sans-serif' }}>Requires Attention</span>
                  <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#D97706' }}>
                    {overview?.attentionSubjectsCount || 0} Subjects
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: '#94A3B8' }}>Low Attendance or Grade</span>
                </div>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: '#FFFBEB',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <AlertTriangle size={22} strokeWidth={2.2} />
                </div>
              </div>

              {/* Attendance Status */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: 20,
                padding: '20px 24px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B', fontFamily: 'Sora, sans-serif' }}>Overall Attendance</span>
                  <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#059669' }}>
                    {overview?.overallAttendance || '100%'}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: '#94A3B8' }}>{overview?.attendanceStatus || 'Healthy'}</span>
                </div>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: '#F0FDF4',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <CheckCircle2 size={22} strokeWidth={2.2} />
                </div>
              </div>
            </div>

            {/* â”€â”€ SECTION 9: QUICK AI ACTIONS CARDS â”€â”€ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <button
                onClick={() => setIsCopilotOpen(true)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: 20,
                  padding: 16,
                  textAlign: 'left',
                  boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  <Bot size={22} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 800, color: '#0F172A' }}>Ask Academic AI</span>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Open Copilot drawer</span>
                </div>
              </button>

              <button
                onClick={() => plannerSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: 20,
                  padding: 16,
                  textAlign: 'left',
                  boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  <Calendar size={22} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 800, color: '#0F172A' }}>Generate Study Plan</span>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Personalized schedule</span>
                </div>
              </button>

              <button
                onClick={() => predictorSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: 20,
                  padding: 16,
                  textAlign: 'left',
                  boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  <Target size={22} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 800, color: '#0F172A' }}>Predict CGPA</span>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Simulate future SGPA</span>
                </div>
              </button>

              <button
                onClick={() => {
                  const target = document.getElementById('weak-subjects-section')
                  if (target) target.scrollIntoView({ behavior: 'smooth' })
                }}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: 20,
                  padding: 16,
                  textAlign: 'left',
                  boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  <AlertTriangle size={16} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 800, color: '#0F172A' }}>Analyze Weak Subjects</span>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Identify low attendance</span>
                </div>
              </button>
            </div>

            {/* â”€â”€ SECTION 4: AI STUDY PLANNER â”€â”€ */}
            <div ref={plannerSectionRef} style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 24,
              padding: 24,
              boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: 20
            }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 14, flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    <Calendar size={22} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      AI Study Planner
                    </h3>
                    <span style={{ fontSize: 12, color: '#64748B' }}>Automated revision schedule tailored to your enrolled courses</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {['daily', 'weekly', 'exam', 'roadmap'].map(type => (
                    <button
                      key={type}
                      onClick={() => {
                        setPlanType(type)
                        handleGenerateStudyPlan(type)
                      }}
                      style={{
                        padding: '6px 14px',
                        fontSize: 11,
                        fontWeight: 800,
                        borderRadius: 10,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        cursor: 'pointer',
                        background: planType === type ? '#2563EB' : '#F1F5F9',
                        color: planType === type ? '#FFFFFF' : '#475569',
                        border: planType === type ? 'none' : '1px solid #E2E8F0'
                      }}
                    >
                      {type} Plan
                    </button>
                  ))}
                </div>
              </div>

              {plannerLoading ? (
                <div style={{ padding: 32, textAlign: 'center', fontSize: 13, color: '#64748B', display: 'flex', alignItems: 'center', justifyCenter: 'center', gap: 8 }}>
                  <div style={{ width: 16, height: 16, border: '2px solid #2563EB', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  Generating custom study roadmap...
                </div>
              ) : schedulePlan ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                    {schedulePlan.schedule?.map((item, idx) => (
                      <div key={idx} style={{ padding: 16, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between' }}>
                          <span style={{ fontSize: 10.5, fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', background: '#EFF6FF', padding: '2px 8px', borderRadius: 6 }}>
                            {item.timeSlot}
                          </span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>{item.focus}</span>
                        </div>
                        <p style={{ fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                          {item.task}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', paddingTop: 12, borderTop: '1px solid #F1F5F9' }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: '#475569' }}>
                      <Zap size={14} style={{ display: 'inline', marginRight: 4 }} /> {schedulePlan.recommendation}
                    </span>
                    <button
                      onClick={() => handleGenerateStudyPlan()}
                      style={{ padding: '8px 16px', fontSize: 12, fontWeight: 700, color: '#334155', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <RefreshCw size={14} />
                      Regenerate Plan
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            {/* â”€â”€ SECTION 5: CGPA PREDICTOR SIMULATION â”€â”€ */}
            <div ref={predictorSectionRef} style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 24,
              padding: 24,
              boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: 20
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #F1F5F9', paddingBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  <Target size={22} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    CGPA Simulator & Predictor
                  </h3>
                  <span style={{ fontSize: 12, color: '#64748B' }}>Simulate future semester SGPAs to check path to Target CGPA</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, alignItems: 'center' }}>
                {/* Inputs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>
                      Expected Next Semester SGPA (0.0 - 10.0)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={expectedSGPA}
                      onChange={(e) => setExpectedSGPA(e.target.value)}
                      style={{
                        padding: '10px 14px',
                        fontSize: 13,
                        fontWeight: 700,
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: 12,
                        outline: 'none',
                        color: '#0F172A'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>
                      Remaining Degree Credits
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={remainingCredits}
                      onChange={(e) => setRemainingCredits(e.target.value)}
                      style={{
                        padding: '10px 14px',
                        fontSize: 13,
                        fontWeight: 700,
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: 12,
                        outline: 'none',
                        color: '#0F172A'
                      }}
                    />
                  </div>

                  <button
                    onClick={handleRunPrediction}
                    disabled={predictLoading}
                    style={{
                      padding: '10px',
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: '#FFFFFF',
                      background: '#4F46E5',
                      border: 'none',
                      borderRadius: 12,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(79,70,229,0.2)'
                    }}
                  >
                    {predictLoading ? 'Simulating...' : 'Run Simulation'}
                  </button>
                </div>

                {/* Prediction Result Display */}
                {predictionResult && (
                  <div style={{ padding: 24, background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: '#475569' }}>Predicted Final CGPA</span>
                      <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 800, color: '#4F46E5' }}>
                        {predictionResult.predictedCGPA?.toFixed(2)}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #C7D2FE', paddingTop: 12 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: '#475569' }}>Required SGPA for Target ({predictionResult.targetCGPA})</span>
                      <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#7C3AED' }}>
                        {predictionResult.requiredSGPA?.toFixed(2)}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '4px 12px',
                        borderRadius: 20,
                        background: predictionResult.isAchievable ? '#ECFDF5' : '#FFFBEB',
                        color: predictionResult.isAchievable ? '#047857' : '#B45309',
                        border: predictionResult.isAchievable ? '1px solid #A7F3D0' : '1px solid #FDE68A'
                      }}>
                        {predictionResult.isAchievable ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <Target size={14} /> Target is Achievable!
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <AlertTriangle size={14} /> Requires Exceptional SGPA
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* â”€â”€ SECTION 6: WEAK SUBJECT ANALYSIS â”€â”€ */}
            <div id="weak-subjects-section" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ padding: '4px 8px', borderRadius: 8, background: '#FFFBEB', color: '#D97706', fontSize: 12 }}>
                    <AlertTriangle size={16} />
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.05em', color: '#D97706', textTransform: 'uppercase' }}>
                    Risk Assessment
                  </span>
                </div>
                <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.4px' }}>
                  Weak Subject & Attendance Hazards
                </h2>
                <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>
                  Courses with low attendance or grades requiring recovery prior to final examinations.
                </p>
              </div>

              {weakSubjectsList.length === 0 ? (
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, padding: 24, textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <CheckCircle2 size={18} />
                  🎉 All Completed Courses Passed Cleanly! No active backlogs or attendance hazards.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                  {weakSubjectsList.map((sub, idx) => (
                    <div key={idx} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, padding: 20, boxShadow: '0 4px 20px rgba(15,23,42,0.03)', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between', gap: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between' }}>
                        <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 800, color: '#0F172A' }}>
                          {sub.name} ({sub.code})
                        </span>
                        <span style={{
                          fontSize: 10.5,
                          fontWeight: 800,
                          padding: '3px 10px',
                          borderRadius: 20,
                          background: sub.priority === 'High' ? '#FEF2F2' : '#FFFBEB',
                          color: sub.priority === 'High' ? '#DC2626' : '#D97706',
                          border: sub.priority === 'High' ? '1px solid #FECACA' : '1px solid #FDE68A'
                        }}>
                          {sub.priority} Priority
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', fontSize: 12, color: '#64748B' }}>
                        <span>Attendance: <strong style={{ color: '#0F172A' }}>{sub.attendance}%</strong></span>
                        <span>Grade: <strong style={{ color: '#4F46E5' }}>{sub.grade}</strong></span>
                      </div>

                      <div style={{ padding: 12, background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, fontSize: 12, color: '#92400E' }}>
                        <strong>Reason:</strong> {sub.reason}
                        <div style={{ marginTop: 4, color: '#B45309', fontWeight: 500 }}><Sparkles size={14} style={{ display: 'inline', marginRight: 4 }} /> {sub.suggestion}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* â”€â”€ SECTION 7 & 8: SMART RECOMMENDATIONS & ACADEMIC ALERTS â”€â”€ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
              {/* Smart Recommendations */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 24, padding: 24, boxShadow: '0 4px 20px rgba(15,23,42,0.03)', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={18} style={{ color: '#7C3AED' }} />
                  Smart Recommendations
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {recommendations.map((rec, i) => (
                    <div key={i} style={{ padding: 14, background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: 16, display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 12.5 }}>
                      <Zap size={18} style={{ color: '#7C3AED' }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ fontWeight: 800, color: '#0F172A', fontFamily: 'Sora, sans-serif' }}>{rec.type}</span>
                        <span style={{ color: '#475569' }}>{rec.recommendation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Academic Alerts */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 24, padding: 24, boxShadow: '0 4px 20px rgba(15,23,42,0.03)', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle size={18} style={{ color: '#D97706' }} />
                  Academic Alerts
                </h3>

                {alerts.length === 0 ? (
                  <div style={{ padding: 24, textAlign: 'center', fontSize: 12.5, color: '#94A3B8', fontWeight: 600 }}>
                    No active academic alerts. All requirements clear!
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {alerts.map((alt) => (
                      <div key={alt.id} style={{ padding: 14, background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 16, display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 12.5 }}>
                        <span style={{ fontSize: 16 }}><AlertTriangle size={16} /></span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span style={{ fontWeight: 800, color: '#92400E', fontFamily: 'Sora, sans-serif' }}>{alt.title}</span>
                          <span style={{ color: '#B45309' }}>{alt.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </React.Fragment>
        )}

        {/* â”€â”€ FLOATING ASK AI ACTION BUTTON (FAB) â”€â”€ */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCopilotOpen(true)}
          style={{
            position: 'fixed',
            bottom: 28,
            right: 28,
            zIndex: 900,
            padding: '12px 20px',
            background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 50,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: '0 8px 24px rgba(124, 58, 237, 0.35)',
            fontFamily: 'Sora, sans-serif',
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '0.02em'
          }}
        >
          <div style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14
          }}>
            <Bot size={22} />
          </div>
          Ask Academic AI
        </motion.button>

        {/* â”€â”€ RIGHT-SIDE SLIDE-OVER COPILOT DRAWER â”€â”€ */}
        <AnimatePresence>
          {isCopilotOpen && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsCopilotOpen(false)}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(15, 23, 42, 0.45)',
                  backdropFilter: 'blur(4px)'
                }}
              />

              {/* Drawer Container */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: '100%',
                  maxWidth: 540,
                  background: '#FFFFFF',
                  boxShadow: '-10px 0 40px rgba(15, 23, 42, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}
              >
                {/* Drawer Top Header Bar */}
                <div style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#F8FAFC'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontSize: 18,
                      boxShadow: '0 2px 10px rgba(124, 58, 237, 0.3)'
                    }}>
                      <Bot size={22} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 800, color: '#0F172A' }}>
                        Academic AI Copilot
                      </div>
                      <div style={{ fontSize: 11, color: '#059669', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                        Online & Context Aware
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsCopilotOpen(false)}
                    aria-label="Close AI Copilot"
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      border: '1px solid #E2E8F0',
                      background: '#FFFFFF',
                      color: '#64748B',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Embedded Copilot Chat Container */}
                <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                  <AIChatPanel style={{ height: '100%', border: 'none', borderRadius: 0, boxShadow: 'none' }} />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </AppLayout>
  )
}
