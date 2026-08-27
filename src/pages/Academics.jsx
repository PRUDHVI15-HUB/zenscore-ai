import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../context/AuthContext'
import AcademicsHero from '../components/academics/AcademicsHero'
import AddSemesterModal from '../components/academics/AddSemesterModal'
import AddSubjectModal from '../components/academics/AddSubjectModal'
import TranscriptOCRModal from '../components/academics/TranscriptOCRModal'
import EditSemesterModal from '../components/academics/EditSemesterModal'
import EditSubjectModal from '../components/academics/EditSubjectModal'
import ConfirmationModal from '../components/common/ConfirmationModal'
import { getAcademicsDashboard, deleteSemester, deleteSubject, setTargetCGPA } from '../services/api'
import { syncAcademicsToProfile } from '../services/academicsProfileSync'

import {
  FileText,
  BookOpen,
  TrendingUp,
  Bot,
  ArrowUpRight,
  Award,
  Target,
  Sparkles,
  GraduationCap,
  Clock,
  CheckCircle2
} from 'lucide-react'

// Section Header Helper matching Jobs / Courses design system
const SectionTitle = ({ icon: Icon, label, title, description }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{
        padding: '4px 8px',
        borderRadius: 8,
        background: 'rgba(124, 58, 237, 0.12)',
        color: '#8B5CF6',
        border: '1px solid rgba(124, 58, 237, 0.25)',
        fontSize: 12,
        display: 'inline-flex',
        alignItems: 'center'
      }}>
        {typeof Icon === 'string' ? Icon : <Icon size={14} />}
      </span>
      <span style={{
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: '0.05em',
        color: '#8B5CF6',
        textTransform: 'uppercase'
      }}>
        {label}
      </span>
    </div>
    <h2 style={{
      fontFamily: 'Sora, sans-serif',
      fontSize: 22,
      fontWeight: 800,
      color: 'var(--text-dark, #0F172A)',
      letterSpacing: '-0.4px',
      margin: '4px 0 0'
    }}>
      {title}
    </h2>
    {description && (
      <p style={{ fontSize: 13, color: 'var(--text-muted, #64748B)', margin: 0, lineHeight: 1.5 }}>
        {description}
      </p>
    )}
  </div>
)

export default function Academics() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // State Management
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [showSemesterModal, setShowSemesterModal] = useState(false)
  const [showSubjectModal, setShowSubjectModal] = useState(false)
  const [showOCRModal, setShowOCRModal] = useState(false)

  // Target CGPA modal state
  const [showSetTargetModal, setShowSetTargetModal] = useState(false)
  const [targetInput, setTargetInput] = useState('')
  const [targetSaving, setTargetSaving] = useState(false)

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

  // Redirect unauthenticated users
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
        // ── STUDENT PROFILE SYNC ──────────────────────────────────────
        // Fire-and-forget: never blocks UI, never throws, silent on error
        // totalCompletedCredits is not yet computed here (useMemo runs after render),
        // so we pass 0 as initial — the useEffect below re-syncs with the correct value.
        syncAcademicsToProfile(res.data, 0)
        // ─────────────────────────────────────────────────────────────
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

  useEffect(() => {
    if (user) {
      fetchDashboard()
    }
  }, [user])

  // Calculate total completed credits across all semesters
  const totalCompletedCredits = useMemo(() => {
    if (!dashboardData || !dashboardData.semesters) return 0
    let credits = 0
    dashboardData.semesters.forEach(sem => {
      if (sem.subjects) {
        sem.subjects.forEach(sub => {
          credits += (sub.credits || 0)
        })
      }
    })
    return credits
  }, [dashboardData])

  // ── RE-SYNC with correct credit total after useMemo resolves ──
  // Prevents duplicate writes: only runs when totalCompletedCredits changes
  // and dashboardData is available. Uses a ref to skip the initial render.
  const hasSyncedRef = useRef(false)
  useEffect(() => {
    if (!dashboardData || loading) return
    if (!hasSyncedRef.current) {
      hasSyncedRef.current = true
      return // skip first render (fetchDashboard already initiated a sync)
    }
    // Re-sync with the now-accurate credit total (deep merge — safe to call)
    syncAcademicsToProfile(dashboardData, totalCompletedCredits)
  }, [totalCompletedCredits, dashboardData, loading])

  // Compute dynamic recent activity feed
  const recentActivities = useMemo(() => {
    if (!dashboardData || !dashboardData.semesters || dashboardData.semesters.length === 0) {
      return []
    }

    const list = []
    dashboardData.semesters.forEach(sem => {
      list.push({
        id: `sem-${sem.semesterNumber}`,
        title: `Semester ${sem.semesterNumber} Added (${sem.status})`,
        subtitle: `SGPA: ${sem.sgpa || 'Pending'} • ${sem.subjects?.length || 0} Subjects Enrolled`,
        time: 'Recently',
        icon: GraduationCap,
        color: '#7C3AED',
        bg: '#F5F3FF'
      })

      if (sem.subjects) {
        sem.subjects.forEach(sub => {
          list.push({
            id: `sub-${sub._id || sub.name}`,
            title: `${sub.name}`,
            subtitle: `Semester ${sem.semesterNumber} • ${sub.credits} Credits • Grade: ${sub.finalGrade || 'In Progress'}`,
            time: 'Recently',
            icon: BookOpen,
            color: '#2563EB',
            bg: '#EFF6FF'
          })
        })
      }
    })

    return list.slice(0, 5)
  }, [dashboardData])

  // Handle Set Target CGPA
  const handleSetTarget = async () => {
    const val = parseFloat(targetInput)
    if (isNaN(val) || val < 0 || val > 10) return
    setTargetSaving(true)
    try {
      const res = await setTargetCGPA(val)
      if (res.success) {
        setDashboardData(prev => prev ? { ...prev, targetCGPA: res.data.targetCGPA, prediction: res.data.prediction } : prev)
        setShowSetTargetModal(false)
        setTargetInput('')
      }
    } catch (err) {
      console.error('Failed to set target CGPA', err)
    } finally {
      setTargetSaving(false)
    }
  }

  // Modal Action Handlers
  const handleConfirmDeleteSemester = async () => {
    if (!deleteSemesterData) return
    setDeleteLoading(true)
    try {
      const res = await deleteSemester(deleteSemesterData.semesterNumber)
      if (res.success) {
        fetchDashboard()
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

  const handleConfirmDeleteSubject = async () => {
    if (!deleteSubjectData || !deleteSubjectSemNum) return
    setDeleteLoading(true)
    try {
      const res = await deleteSubject(deleteSubjectSemNum, deleteSubjectData._id || deleteSubjectData.id)
      if (res.success) {
        fetchDashboard()
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

  return (
    <AppLayout>
      <div className="container" style={{ padding: '32px 24px', maxWidth: 1140, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* ── SECTION 1: HERO BANNER ── */}
        <AcademicsHero
          currentCGPA={dashboardData?.currentCGPA}
          targetCGPA={dashboardData?.targetCGPA}
          predictedCGPA={dashboardData?.prediction?.predictedCGPA}
          healthScore={dashboardData?.intelligence?.healthScore}
          onAddSemester={() => setShowSemesterModal(true)}
          onImportTranscript={() => setShowOCRModal(true)}
        />

        {/* Error State Banner */}
        {errorMsg && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: 20,
            padding: 24,
            textAlign: 'center',
            maxWidth: 500,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            alignItems: 'center'
          }}>
            <span style={{ fontSize: 32 }}>⚠️</span>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: '#991B1B', margin: 0, fontFamily: 'Sora, sans-serif' }}>Failed to Load Academics</h4>
              <p style={{ fontSize: 12, color: '#B91C1C', marginTop: 4, margin: 0 }}>{errorMsg}</p>
            </div>
            <button
              onClick={fetchDashboard}
              style={{
                padding: '8px 20px',
                background: '#DC2626',
                color: '#FFFFFF',
                fontSize: 12,
                fontWeight: 700,
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(220,38,38,0.2)'
              }}
            >
              Retry Connection
            </button>
          </div>
        )}

        {!errorMsg && (
          <React.Fragment>
            {/* ── SECTION 2: ACADEMIC SNAPSHOT (4 METRIC CARDS) ── */}
            <div>
              <SectionTitle
                icon={Award}
                label="GPA & Credit Metrics"
                title="Academic Snapshot"
                description="Live CGPA standings, target goals, forecast predictions, and total logged credit units."
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20 }}>
                {/* 1. Current CGPA */}
                <div style={{
                  background: 'var(--bg-soft, #FFFFFF)',
                  borderRadius: 20,
                  padding: '20px 24px',
                  border: '1px solid var(--border, #E2E8F0)',
                  boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted, #64748B)', fontFamily: 'Sora, sans-serif' }}>Current CGPA</span>
                    <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#4F46E5' }}>
                      {loading ? '...' : (dashboardData?.currentCGPA ? Number(dashboardData.currentCGPA).toFixed(2) : '0.00')}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted, #94A3B8)' }}>Cumulative Grade Point Average</span>
                  </div>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: 'rgba(79, 70, 229, 0.12)',
                    color: '#4F46E5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Award size={22} strokeWidth={2.2} />
                  </div>
                </div>

                {/* 2. Target CGPA — click to set */}
                <div
                  id="academics-target-cgpa-card"
                  onClick={() => { setTargetInput(dashboardData?.targetCGPA != null ? String(dashboardData.targetCGPA) : ''); setShowSetTargetModal(true) }}
                  style={{
                    background: 'var(--bg-soft, #FFFFFF)',
                    borderRadius: 20,
                    padding: '20px 24px',
                    border: '1px solid var(--border, #E2E8F0)',
                    boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s ease, border-color 0.2s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,99,235,0.12)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border, #E2E8F0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(15,23,42,0.03)' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted, #64748B)', fontFamily: 'Sora, sans-serif' }}>Target CGPA</span>
                    <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#2563EB' }}>
                      {loading ? '...' : (dashboardData?.targetCGPA != null ? Number(dashboardData.targetCGPA).toFixed(2) : '— Set')}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 500, color: '#2563EB', opacity: 0.7 }}>Click to set your goal</span>
                  </div>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: 'rgba(37, 99, 235, 0.12)',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Target size={22} strokeWidth={2.2} />
                  </div>
                </div>

                {/* 3. Predicted CGPA — dynamically calculated from predictionEngine */}
                <div style={{
                  background: 'var(--bg-soft, #FFFFFF)',
                  borderRadius: 20,
                  padding: '20px 24px',
                  border: '1px solid var(--border, #E2E8F0)',
                  boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted, #64748B)', fontFamily: 'Sora, sans-serif' }}>Predicted CGPA</span>
                    <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#7C3AED' }}>
                      {loading ? '...' : (dashboardData?.prediction?.isAvailable ? Number(dashboardData.prediction.predictedCGPA).toFixed(2) : '—')}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted, #94A3B8)' }}>
                      {dashboardData?.prediction?.isAvailable
                        ? (dashboardData.prediction.requiredNextSGPA != null
                            ? `Req. Next Sem: ~${dashboardData.prediction.requiredNextSGPA} SGPA`
                            : `Next Sem: ~${dashboardData.prediction.predictedNextSGPA} SGPA · ${dashboardData.prediction.confidenceLabel}`)
                        : 'Upload memo to forecast'}
                    </span>
                  </div>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: 'rgba(124, 58, 237, 0.12)',
                    color: '#7C3AED',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Sparkles size={22} strokeWidth={2.2} />
                  </div>
                </div>

                {/* 4. Credits Completed */}
                <div style={{
                  background: 'var(--bg-soft, #FFFFFF)',
                  borderRadius: 20,
                  padding: '20px 24px',
                  border: '1px solid var(--border, #E2E8F0)',
                  boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted, #64748B)', fontFamily: 'Sora, sans-serif' }}>Credits Completed</span>
                    <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#059669' }}>
                      {loading ? '...' : totalCompletedCredits}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted, #94A3B8)' }}>Total Credit Units Earned</span>
                  </div>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: 'rgba(5, 150, 105, 0.12)',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <GraduationCap size={22} strokeWidth={2.2} />
                  </div>
                </div>
              </div>
            </div>

            {/* ── SECTION 4: RECENT ACTIVITY ── */}
            <div>
              <SectionTitle
                icon={Clock}
                label="Timeline & Event Logs"
                title="Recent Activity"
                description="Chronological log of grade sheet uploads, semester updates, and subject entries."
              />

              {recentActivities.length === 0 ? (
                <div style={{
                  background: 'var(--bg-soft, #FFFFFF)',
                  border: '1px solid var(--border, #E2E8F0)',
                  borderRadius: 24,
                  padding: 36,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12
                }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 16,
                    background: 'rgba(79, 70, 229, 0.12)',
                    color: '#4F46E5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22
                  }}>
                    ⏱️
                  </div>
                  <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: 'var(--text-dark, #0F172A)', margin: 0 }}>
                    No Recent Academic Activity
                  </h4>
                  <p style={{ fontSize: 13, color: 'var(--text-muted, #64748B)', maxWidth: 360, margin: 0 }}>
                    Log your semesters or upload a semester memo to start building your academic timeline.
                  </p>
                </div>
              ) : (
                <div style={{
                  background: 'var(--bg-soft, #FFFFFF)',
                  border: '1px solid var(--border, #E2E8F0)',
                  borderRadius: 24,
                  padding: 24,
                  boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16
                }}>
                  {recentActivities.map((act) => {
                    const Icon = act.icon
                    return (
                      <div key={act.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingBottom: 12,
                        borderBottom: '1px solid var(--border, #F1F5F9)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: 12,
                            background: act.bg,
                            color: act.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <Icon size={18} strokeWidth={2.2} />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 13.5, fontWeight: 800, color: 'var(--text-dark, #0F172A)' }}>
                              {act.title}
                            </span>
                            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted, #64748B)' }}>
                              {act.subtitle}
                            </span>
                          </div>
                        </div>
                        <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted, #94A3B8)' }}>
                          {act.time}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </React.Fragment>
        )}

        {/* ── MODALS ── */}
        <AddSemesterModal
          isOpen={showSemesterModal}
          onClose={() => setShowSemesterModal(false)}
          onSuccess={() => {
            setShowSemesterModal(false)
            fetchDashboard()
          }}
        />

        <AddSubjectModal
          isOpen={showSubjectModal}
          onClose={() => setShowSubjectModal(false)}
          onSuccess={() => {
            setShowSubjectModal(false)
            fetchDashboard()
          }}
        />

        <TranscriptOCRModal
          isOpen={showOCRModal}
          onClose={() => setShowOCRModal(false)}
          onSuccess={() => {
            setShowOCRModal(false)
            fetchDashboard()
          }}
        />

        <EditSemesterModal
          isOpen={showEditSemesterModal}
          onClose={() => setShowEditSemesterModal(false)}
          semester={selectedSemester}
          onSuccess={() => {
            setShowEditSemesterModal(false)
            fetchDashboard()
          }}
        />

        <EditSubjectModal
          isOpen={showEditSubjectModal}
          onClose={() => setShowEditSubjectModal(false)}
          subject={selectedSubject}
          semesterNumber={selectedSubjectSemNum}
          onSuccess={() => {
            setShowEditSubjectModal(false)
            fetchDashboard()
          }}
        />

        <ConfirmationModal
          isOpen={showDeleteSemesterModal}
          onClose={() => setShowDeleteSemesterModal(false)}
          onConfirm={handleConfirmDeleteSemester}
          title={`Delete Semester ${deleteSemesterData?.semesterNumber}?`}
          message="This action will permanently delete this semester and all associated subject records."
          confirmText="Delete Semester"
          danger
          loading={deleteLoading}
        />

        <ConfirmationModal
          isOpen={showDeleteSubjectModal}
          onClose={() => setShowDeleteSubjectModal(false)}
          onConfirm={handleConfirmDeleteSubject}
          title={`Delete ${deleteSubjectData?.name}?`}
          message="This action will permanently remove this subject from your semester record."
          confirmText="Delete Subject"
          danger
          loading={deleteLoading}
        />

        {/* ── SET TARGET CGPA MODAL ── */}
        {showSetTargetModal && (
          <div
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(15,23,42,0.48)',
              backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 24
            }}
            onClick={() => setShowSetTargetModal(false)}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background: 'var(--bg-soft, #FFFFFF)',
                borderRadius: 24,
                padding: '32px 28px',
                width: '100%',
                maxWidth: 400,
                boxShadow: '0 24px 60px rgba(15,23,42,0.14)',
                display: 'flex',
                flexDirection: 'column',
                gap: 20
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(37,99,235,0.1)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Target size={20} strokeWidth={2.3} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 17, fontWeight: 800, color: 'var(--text-dark, #0F172A)', margin: 0 }}>Set Target CGPA</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-muted, #64748B)', margin: 0 }}>Your graduation CGPA goal (0.0 – 10.0)</p>
                  </div>
                </div>
              </div>

              <input
                id="academics-target-cgpa-input"
                type="number"
                min="0"
                max="10"
                step="0.01"
                placeholder="e.g. 8.50"
                value={targetInput}
                onChange={e => setTargetInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSetTarget() }}
                autoFocus
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 14,
                  border: '1.5px solid var(--border, #E2E8F0)',
                  fontSize: 20,
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: 700,
                  color: '#0F172A',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                  textAlign: 'center'
                }}
                onFocus={e => { e.target.style.borderColor = '#2563EB' }}
                onBlur={e => { e.target.style.borderColor = 'var(--border, #E2E8F0)' }}
              />

              {targetInput !== '' && (parseFloat(targetInput) < 0 || parseFloat(targetInput) > 10 || isNaN(parseFloat(targetInput))) && (
                <p style={{ fontSize: 12, color: '#DC2626', margin: '-10px 0 0', textAlign: 'center' }}>Please enter a value between 0 and 10</p>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => { setShowSetTargetModal(false); setTargetInput('') }}
                  style={{
                    flex: 1, height: 44, borderRadius: 12,
                    border: '1px solid var(--border, #E2E8F0)',
                    background: 'transparent', cursor: 'pointer',
                    fontSize: 13, fontWeight: 600, color: 'var(--text-mid, #475569)'
                  }}
                >
                  Cancel
                </button>
                <button
                  id="academics-set-target-save"
                  onClick={handleSetTarget}
                  disabled={targetSaving || targetInput === '' || parseFloat(targetInput) < 0 || parseFloat(targetInput) > 10}
                  style={{
                    flex: 2, height: 44, borderRadius: 12,
                    border: 'none',
                    background: targetSaving ? '#93C5FD' : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                    color: '#FFFFFF', cursor: targetSaving ? 'not-allowed' : 'pointer',
                    fontSize: 13, fontWeight: 700,
                    fontFamily: 'Sora, sans-serif',
                    boxShadow: '0 4px 12px rgba(37,99,235,0.2)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {targetSaving ? 'Saving...' : 'Save Target'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  )
}