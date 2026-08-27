import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AppLayout from '../../components/AppLayout'
import { useAuth } from '../../context/AuthContext'
import { useStudentProfile } from '../../context/StudentProfileContext'
import TranscriptOCRModal from '../../components/academics/TranscriptOCRModal'
import ConfirmationModal from '../../components/common/ConfirmationModal'

import {
  getAcademicsDashboard,
  deleteSemester
} from '../../services/api'

import {
  FileText,
  Upload,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Trash2,
  Eye,
  Sparkles,
  Layers,
  FileCheck
} from 'lucide-react'

export default function MyTranscript() {
  const { user } = useAuth()
  const { profile } = useStudentProfile()
  const navigate = useNavigate()

  // Dashboard & Semester Data
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  // Modal States
  const [showOCRModal, setShowOCRModal] = useState(false)
  const [viewSemester, setViewSemester] = useState(null)
  const [deleteSemesterData, setDeleteSemesterData] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Redirect unauthenticated users
  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  // Hydrate Academics Data from Backend
  const fetchAcademicsData = async () => {
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
          setErrorMsg(res.message || 'Failed to retrieve academic memo data.')
        }
      }
    } catch (err) {
      const status = err.response?.status
      const msg = err.response?.data?.message || err.message
      if (status === 404 || msg?.includes('not found')) {
        setDashboardData(null)
      } else {
        setErrorMsg(msg || 'Unable to connect to the server.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchAcademicsData()
    }
  }, [user])

  // Calculate memo statistics
  const stats = useMemo(() => {
    const semesters = dashboardData?.semesters || []
    const uploadedCount = semesters.length
    const ocrProcessedCount = semesters.filter(s => s.subjects && s.subjects.length > 0).length
    const pendingCount = 0

    let lastUploadedStr = 'No memos yet'
    if (semesters.length > 0) {
      const sorted = [...semesters].sort((a, b) => b.semesterNumber - a.semesterNumber)
      lastUploadedStr = `Semester ${sorted[0].semesterNumber}`
    }

    return {
      uploadedCount,
      ocrProcessedCount,
      pendingCount,
      lastUploadedStr
    }
  }, [dashboardData])

  // Generate complete grid for Semesters 1 to 8
  const semesterGrid = useMemo(() => {
    const semestersMap = new Map()
    if (dashboardData && dashboardData.semesters) {
      dashboardData.semesters.forEach(s => semestersMap.set(s.semesterNumber, s))
    }

    const grid = []
    for (let i = 1; i <= 8; i++) {
      const existing = semestersMap.get(i)
      grid.push({
        semesterNumber: i,
        isUploaded: !!existing,
        data: existing || null,
        statusLabel: existing ? (existing.status || 'Uploaded') : 'Not Uploaded',
        sgpa: existing?.sgpa ? Number(existing.sgpa).toFixed(2) : null,
        subjectCount: existing?.subjects ? existing.subjects.length : 0
      })
    }
    return grid
  }, [dashboardData])

  // Recent Upload Activity Feed
  const recentActivities = useMemo(() => {
    if (!dashboardData || !dashboardData.semesters) return []
    const list = []
    dashboardData.semesters.forEach(sem => {
      list.push({
        id: `activity-${sem.semesterNumber}`,
        semNumber: sem.semesterNumber,
        type: 'Semester Memo Upload',
        timestamp: 'Recently',
        status: 'Completed',
        subjectsCount: sem.subjects?.length || 0,
        sgpa: sem.sgpa ? Number(sem.sgpa).toFixed(2) : 'N/A'
      })
    })
    return list.reverse().slice(0, 5)
  }, [dashboardData])

  // Delete Semester Handler
  const handleConfirmDelete = async () => {
    if (!deleteSemesterData) return
    setDeleteLoading(true)
    try {
      const res = await deleteSemester(deleteSemesterData.semesterNumber)
      if (res.success) {
        fetchAcademicsData()
        setShowDeleteModal(false)
      } else {
        alert(res.message || 'Failed to delete semester memo.')
      }
    } catch (err) {
      alert(err.message || 'An error occurred while deleting the semester memo.')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <AppLayout>
      <div className="container" style={{ padding: '32px 24px', maxWidth: 1140, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* ── SECTION 1: PAGE HEADER ── */}
        <div style={{
          background: 'var(--bg-soft, #FFFFFF)',
          border: '1px solid var(--border, #E2E8F0)',
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
              background: 'rgba(79, 70, 229, 0.12)',
              color: '#4F46E5',
              border: '1px solid rgba(79, 70, 229, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              flexShrink: 0
            }}>
              📄
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  color: '#4F46E5',
                  textTransform: 'uppercase',
                  background: 'rgba(79, 70, 229, 0.12)',
                  padding: '2px 8px',
                  borderRadius: 6,
                  border: '1px solid rgba(79, 70, 229, 0.25)'
                }}>
                  Academic Management
                </span>
              </div>
              <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 800, color: 'var(--text-dark, #0F172A)', margin: 0, letterSpacing: '-0.4px' }}>
                My Memos
              </h1>
              <p style={{ fontSize: 13, color: 'var(--text-muted, #64748B)', margin: 0, maxWidth: 540, lineHeight: 1.5 }}>
                Manage your semester marks memos, upload new grade sheets, and extract academic records using AI-powered OCR.
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
                color: 'var(--text-dark, #334155)',
                background: 'var(--bg, #F1F5F9)',
                border: '1px solid var(--border, #E2E8F0)',
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
              onClick={() => setShowOCRModal(true)}
              style={{
                padding: '10px 20px',
                fontSize: 12.5,
                fontWeight: 700,
                color: '#FFFFFF',
                background: '#4F46E5',
                border: 'none',
                borderRadius: 12,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s'
              }}
            >
              <Upload size={14} />
              Upload Memo
            </button>
          </div>
        </div>

        {/* ── STUDENT ACADEMIC IDENTITY CARD ── */}
        <div style={{
          background: 'var(--bg-soft, #FFFFFF)',
          border: '1px solid var(--border, #E2E8F0)',
          borderRadius: 24,
          padding: 24,
          boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted, #64748B)', textTransform: 'uppercase' }}>Student Name</span>
            <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 800, color: 'var(--text-dark, #0F172A)' }}>
              {profile?.personalInfo?.data?.name || user?.displayName || user?.email?.split('@')[0] || '—'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted, #64748B)', textTransform: 'uppercase' }}>Roll / Registration No.</span>
            <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--text-mid, #334155)' }}>
              {user?.rollNumber || profile?.academicSummary?.data?.rollNumber || 'Not available'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted, #64748B)', textTransform: 'uppercase' }}>Degree & Branch</span>
            <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--text-mid, #334155)' }}>
              {profile?.academicSummary?.data?.degree && profile?.academicSummary?.data?.branch
                ? `${profile.academicSummary.data.degree} — ${profile.academicSummary.data.branch}`
                : profile?.academicSummary?.data?.degree || 'Not available'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted, #64748B)', textTransform: 'uppercase' }}>Current Semester</span>
            <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 800, color: '#4F46E5' }}>
              {dashboardData?.semesters?.length ? `Semester ${dashboardData.semesters.length + 1}` : 'Pending'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted, #64748B)', textTransform: 'uppercase' }}>Cumulative CGPA</span>
            <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 800, color: '#059669' }}>
              {dashboardData?.currentCGPA ? Number(dashboardData.currentCGPA).toFixed(2) : 'Not available'}
            </span>
          </div>
        </div>

        {/* ── SECTION 2: TRANSCRIPT STATISTICS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20 }}>
          {/* Card 1: Uploaded Semesters */}
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
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted, #64748B)', fontFamily: 'Sora, sans-serif' }}>Uploaded Semesters</span>
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#4F46E5' }}>
                {loading ? '...' : `${stats.uploadedCount} / 8`}
              </span>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted, #94A3B8)' }}>Total Degree Semesters Logged</span>
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
              <Layers size={22} strokeWidth={2.2} />
            </div>
          </div>

          {/* Card 2: OCR Processed */}
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
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted, #64748B)', fontFamily: 'Sora, sans-serif' }}>OCR Processed</span>
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#059669' }}>
                {loading ? '...' : stats.ocrProcessedCount}
              </span>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted, #94A3B8)' }}>AI Digitized Memos</span>
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
              <FileCheck size={22} strokeWidth={2.2} />
            </div>
          </div>

          {/* Card 3: Pending Review */}
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
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted, #64748B)', fontFamily: 'Sora, sans-serif' }}>Pending Review</span>
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#D97706' }}>
                {loading ? '...' : stats.pendingCount}
              </span>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted, #94A3B8)' }}>Active OCR Confirmations</span>
            </div>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'rgba(217, 119, 6, 0.12)',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Clock size={22} strokeWidth={2.2} />
            </div>
          </div>

          {/* Card 4: Last Uploaded */}
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
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted, #64748B)', fontFamily: 'Sora, sans-serif' }}>Last Uploaded</span>
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 800, color: '#7C3AED' }}>
                {loading ? '...' : stats.lastUploadedStr}
              </span>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted, #94A3B8)' }}>Most Recent Activity</span>
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
        </div>

        {/* ── SECTION 3: SEMESTER TRANSCRIPT GRID ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ padding: '4px 8px', borderRadius: 8, background: 'rgba(79, 70, 229, 0.12)', color: '#4F46E5', fontSize: 12 }}>
                📚
              </span>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.05em', color: '#4F46E5', textTransform: 'uppercase' }}>
                Semester Catalog
              </span>
            </div>
            <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--text-dark, #0F172A)', margin: 0, letterSpacing: '-0.4px' }}>
              Semester Memos (Semesters 1 - 8)
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted, #64748B)', margin: 0 }}>
              Overview of all 8 degree semesters. Upload, view, replace, or download your official semester memos.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {semesterGrid.map(sem => (
              <div
                key={sem.semesterNumber}
                style={{
                  background: sem.isUploaded ? 'var(--bg-soft, #FFFFFF)' : 'var(--bg, #F8FAFC)',
                  border: sem.isUploaded ? '1px solid var(--border, #E2E8F0)' : '1px dashed var(--border, #CBD5E1)',
                  borderRadius: 20,
                  padding: 20,
                  boxShadow: sem.isUploaded ? '0 4px 20px rgba(15,23,42,0.03)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: 'var(--text-dark, #0F172A)' }}>
                    Semester {sem.semesterNumber}
                  </span>
                  <span style={{
                    fontSize: 10.5,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: sem.isUploaded ? 'rgba(4, 120, 87, 0.15)' : 'var(--bg-soft, #F1F5F9)',
                    color: sem.isUploaded ? '#10B981' : 'var(--text-muted, #64748B)',
                    border: sem.isUploaded ? '1px solid rgba(4, 120, 87, 0.3)' : '1px solid var(--border, #E2E8F0)'
                  }}>
                    {sem.statusLabel}
                  </span>
                </div>

                {sem.isUploaded ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted, #64748B)' }}>SGPA Score:</span>
                      <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#4F46E5' }}>
                        {sem.sgpa || 'In Progress'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted, #64748B)' }}>Enrolled Courses:</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-dark, #0F172A)' }}>
                        {sem.subjectCount} Subjects
                      </span>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '12px 0', textAlign: 'center' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted, #94A3B8)' }}>No official memo uploaded for this term.</span>
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 12, borderTop: '1px solid var(--border, #F1F5F9)' }}>
                  {sem.isUploaded ? (
                    <React.Fragment>
                      <button
                        onClick={() => setViewSemester(sem.data)}
                        style={{ flex: 1, padding: '8px', fontSize: 11.5, fontWeight: 700, color: '#4F46E5', background: 'rgba(79, 70, 229, 0.12)', border: '1px solid rgba(79, 70, 229, 0.25)', borderRadius: 10, cursor: 'pointer' }}
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          setDeleteSemesterData(sem.data)
                          setShowDeleteModal(true)
                        }}
                        style={{ padding: '8px 10px', fontSize: 11.5, fontWeight: 700, color: '#DC2626', background: 'rgba(220, 38, 38, 0.12)', border: '1px solid rgba(220, 38, 38, 0.25)', borderRadius: 10, cursor: 'pointer' }}
                        title="Delete Record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </React.Fragment>
                  ) : (
                    <button
                      onClick={() => setShowOCRModal(true)}
                      style={{ width: '100%', padding: '9px', fontSize: 12, fontWeight: 700, color: '#FFFFFF', background: '#4F46E5', border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    >
                      <Upload size={14} />
                      Upload Memo
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 4: RECENT UPLOAD ACTIVITY ── */}
        <div style={{ background: 'var(--bg-soft, #FFFFFF)', border: '1px solid var(--border, #E2E8F0)', borderRadius: 24, padding: 24, boxShadow: '0 4px 20px rgba(15,23,42,0.03)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: 'var(--text-dark, #0F172A)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Clock size={20} style={{ color: '#4F46E5' }} />
            Recent Memo Upload Activity
          </h3>

          {recentActivities.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-muted, #94A3B8)', margin: 0 }}>No memo upload history available.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentActivities.map(act => (
                <div key={act.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg, #F8FAFC)', borderRadius: 14, border: '1px solid var(--border, #F1F5F9)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(79, 70, 229, 0.12)', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      📄
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-dark, #0F172A)', fontFamily: 'Sora, sans-serif' }}>
                        Semester {act.semNumber} Memo
                      </span>
                      <span style={{ fontSize: 11.5, color: 'var(--text-muted, #64748B)' }}>
                        {act.subjectsCount} Subjects Logged • SGPA: {act.sgpa}
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#059669', background: 'rgba(5, 150, 105, 0.12)', padding: '3px 10px', borderRadius: 8, border: '1px solid rgba(5, 150, 105, 0.25)' }}>
                    {act.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI OCR IMPORTER POPUP MODAL */}
        <TranscriptOCRModal
          isOpen={showOCRModal}
          onClose={() => setShowOCRModal(false)}
          onImportComplete={() => {
            setShowOCRModal(false)
            fetchAcademicsData()
          }}
        />

        {/* View Semester Detail Modal */}
        {viewSemester && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
            <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderRadius: 24, width: '100%', maxWidth: 600, padding: 28, border: '1px solid var(--border, #E2E8F0)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border, #F1F5F9)', paddingBottom: 16 }}>
                <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 800, color: 'var(--text-dark, #0F172A)', margin: 0 }}>
                  Semester {viewSemester.semesterNumber} Record
                </h3>
                <button onClick={() => setViewSemester(null)} style={{ background: 'none', border: 'none', fontSize: 18, color: 'var(--text-muted, #94A3B8)', cursor: 'pointer', fontWeight: 800 }}>✕</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ background: 'var(--bg, #F8FAFC)', padding: 14, borderRadius: 14, border: '1px solid var(--border, #F1F5F9)' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted, #64748B)', fontWeight: 700 }}>Semester SGPA</span>
                  <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, color: '#4F46E5', marginTop: 2 }}>{viewSemester.sgpa || 'In Progress'}</div>
                </div>
                <div style={{ background: 'var(--bg, #F8FAFC)', padding: 14, borderRadius: 14, border: '1px solid var(--border, #F1F5F9)' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted, #64748B)', fontWeight: 700 }}>Enrolled Subjects</span>
                  <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--text-dark, #0F172A)', marginTop: 2 }}>{viewSemester.subjects?.length || 0} Courses</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-dark, #0F172A)', fontFamily: 'Sora, sans-serif' }}>Subject Breakdown:</span>
                <div style={{ maxHeight: 220, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {viewSemester.subjects?.map((sub, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg, #F8FAFC)', borderRadius: 10, border: '1px solid var(--border, #E2E8F0)', fontSize: 12.5 }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-dark, #0F172A)' }}>{sub.name} ({sub.code || `SUB-${i+1}`})</span>
                      <div style={{ display: 'flex', gap: 12, color: 'var(--text-muted, #64748B)' }}>
                        <span>{sub.credits} Credits</span>
                        <span style={{ fontWeight: 800, color: '#4F46E5' }}>Grade: {sub.finalGrade || 'Pending'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setViewSemester(null)}
                style={{ padding: '10px', fontSize: 13, fontWeight: 700, color: '#FFFFFF', background: '#4F46E5', border: 'none', borderRadius: 12, cursor: 'pointer' }}
              >
                Close Summary
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          title={`Delete Semester ${deleteSemesterData?.semesterNumber} Memo?`}
          message="This will permanently delete the official semester memo record and all subjects stored for this semester."
          confirmText="Delete Record"
          danger
          loading={deleteLoading}
        />

      </div>
    </AppLayout>
  )
}
