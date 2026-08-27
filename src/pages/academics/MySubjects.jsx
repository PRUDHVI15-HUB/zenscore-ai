import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AppLayout from '../../components/AppLayout'
import { useAuth } from '../../context/AuthContext'
import AddSubjectModal from '../../components/academics/AddSubjectModal'
import EditSubjectModal from '../../components/academics/EditSubjectModal'
import ConfirmationModal from '../../components/common/ConfirmationModal'

import {
  getAcademicsDashboard,
  deleteSubject
} from '../../services/api'
import { isSubjectHealthy, getSubjectHealthStatus } from '../../utils/subjectHealthUtils'

import {
  BookOpen,
  Plus,
  ArrowLeft,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  PenSquare,
  Trash2,
  Eye,
  Book,
  GraduationCap,
  Award,
  Layers,
  Sparkles,
  X,
  SlidersHorizontal
} from 'lucide-react'

export default function MySubjects() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Academic Data State
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState('ALL')
  const [selectedHealthFilter, setSelectedHealthFilter] = useState('ALL')
  const [sortField, setSortField] = useState('name')

  // Modals & Drawer States
  const [showAddModal, setShowAddModal] = useState(false)
  const [editSubjectData, setEditSubjectData] = useState(null)
  const [editSemNum, setEditSemNum] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const [deleteSubData, setDeleteSubData] = useState(null)
  const [deleteSemNum, setDeleteSemNum] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [drawerSubject, setDrawerSubject] = useState(null)

  // Redirect unauthenticated users
  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  // Hydrate Academics Data from Backend
  const fetchSubjectsData = async () => {
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
          setErrorMsg(res.message || 'Failed to retrieve subjects catalog.')
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
      fetchSubjectsData()
    }
  }, [user])

  // Flatten subjects across all semesters with rich metadata
  const allSubjects = useMemo(() => {
    if (!dashboardData || !dashboardData.semesters) return []
    const list = []
    dashboardData.semesters.forEach(sem => {
      if (sem.subjects) {
        sem.subjects.forEach(sub => {
          const attendance = sub.attendance !== undefined && sub.attendance !== null ? Number(sub.attendance) : null
          const finalGrade = sub.finalGrade !== undefined && sub.finalGrade !== null ? Number(sub.finalGrade) : null
          const isPassed = finalGrade !== null ? finalGrade >= 5.0 : true
          const healthy = isSubjectHealthy(attendance, finalGrade)

          list.push({
            ...sub,
            semesterNumber: sem.semesterNumber,
            semesterStatus: sem.status,
            attendance,
            finalGrade,
            isPassed,
            healthStatus: getSubjectHealthStatus(attendance, finalGrade)
          })
        })
      }
    })
    return list
  }, [dashboardData])

  // Compute 4 Summary Statistics
  const statistics = useMemo(() => {
    const totalSubjects = allSubjects.length
    const completedSubjects = allSubjects.filter(s => s.finalGrade !== null).length

    const attSubjects = allSubjects.filter(s => s.attendance !== null)
    const avgAtt = attSubjects.length > 0
      ? `${(attSubjects.reduce((acc, curr) => acc + curr.attendance, 0) / attSubjects.length).toFixed(1)}%`
      : 'Not recorded'

    const gradedSubjects = allSubjects.filter(s => s.finalGrade !== null)
    const avgGrade = gradedSubjects.length > 0
      ? (gradedSubjects.reduce((acc, curr) => acc + curr.finalGrade, 0) / gradedSubjects.length).toFixed(2)
      : 'N/A'

    return {
      totalSubjects,
      completedSubjects,
      avgAttendance: avgAtt,
      avgGrade
    }
  }, [allSubjects])

  // Filter & Sort Logic
  const filteredSubjects = useMemo(() => {
    return allSubjects
      .filter(sub => {
        const matchesQuery =
          sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (sub.code && sub.code.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesSem =
          selectedSemesterFilter === 'ALL' ||
          sub.semesterNumber.toString() === selectedSemesterFilter

        const matchesHealth =
          selectedHealthFilter === 'ALL' ||
          sub.healthStatus === selectedHealthFilter

        return matchesQuery && matchesSem && matchesHealth
      })
      .sort((a, b) => {
        if (sortField === 'name') return a.name.localeCompare(b.name)
        if (sortField === 'semester') return a.semesterNumber - b.semesterNumber
        if (sortField === 'attendance') return b.attendance - a.attendance
        if (sortField === 'grade') return (b.finalGrade || 0) - (a.finalGrade || 0)
        return 0
      })
  }, [allSubjects, searchQuery, selectedSemesterFilter, selectedHealthFilter, sortField])

  // Delete Subject Handler
  const handleConfirmDeleteSubject = async () => {
    if (!deleteSubData || !deleteSemNum) return
    setDeleteLoading(true)
    try {
      const res = await deleteSubject(deleteSemNum, deleteSubData._id || deleteSubData.id)
      if (res.success) {
        fetchSubjectsData()
        setShowDeleteModal(false)
        if (drawerSubject?._id === deleteSubData._id) {
          setDrawerSubject(null)
        }
      } else {
        alert(res.message || 'Failed to delete subject.')
      }
    } catch (err) {
      alert(err.message || 'An error occurred while deleting subject.')
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
              📚
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
                  Academic Catalog
                </span>
              </div>
              <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 800, color: 'var(--text-dark, #0F172A)', margin: 0, letterSpacing: '-0.4px' }}>
                My Subjects
              </h1>
              <p style={{ fontSize: 13, color: 'var(--text-muted, #64748B)', margin: 0, maxWidth: 540, lineHeight: 1.5 }}>
                Track course attendance margins, credit weights, SGPA impact, and subject risk scores across all degree terms.
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
              onClick={() => setShowAddModal(true)}
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
              <Plus size={14} />
              Add Subject
            </button>
          </div>
        </div>

        {/* ── SECTION 2: SUBJECT STATISTICS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20 }}>
          {/* Total Subjects */}
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
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted, #64748B)', fontFamily: 'Sora, sans-serif' }}>Total Subjects</span>
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#4F46E5' }}>
                {loading ? '...' : statistics.totalSubjects}
              </span>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted, #94A3B8)' }}>Enrolled Across Semesters</span>
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
              <BookOpen size={22} strokeWidth={2.2} />
            </div>
          </div>

          {/* Completed Subjects */}
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
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted, #64748B)', fontFamily: 'Sora, sans-serif' }}>Completed Subjects</span>
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#059669' }}>
                {loading ? '...' : statistics.completedSubjects}
              </span>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted, #94A3B8)' }}>Graded Courses Passed</span>
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
              <CheckCircle2 size={22} strokeWidth={2.2} />
            </div>
          </div>

          {/* Average Attendance */}
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
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted, #64748B)', fontFamily: 'Sora, sans-serif' }}>Average Attendance</span>
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#2563EB' }}>
                {loading ? '...' : statistics.avgAttendance}
              </span>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted, #94A3B8)' }}>Overall Class Presence</span>
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
              <GraduationCap size={22} strokeWidth={2.2} />
            </div>
          </div>

          {/* Average Grade */}
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
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted, #64748B)', fontFamily: 'Sora, sans-serif' }}>Average Grade</span>
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#7C3AED' }}>
                {loading ? '...' : statistics.avgGrade}
              </span>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted, #94A3B8)' }}>Mean Academic Score</span>
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
              <Award size={22} strokeWidth={2.2} />
            </div>
          </div>
        </div>

        {/* ── SECTION 3: FILTERS & SEARCH BAR ── */}
        <div style={{
          background: 'var(--bg-soft, #FFFFFF)',
          border: '1px solid var(--border, #E2E8F0)',
          borderRadius: 20,
          padding: 16,
          boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 14,
          flexWrap: 'wrap'
        }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: 12, color: 'var(--text-muted, #94A3B8)' }} />
            <input
              type="text"
              placeholder="Search by subject name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 40px',
                fontSize: 12.5,
                background: 'var(--bg, #F8FAFC)',
                border: '1px solid var(--border, #E2E8F0)',
                borderRadius: 12,
                color: 'var(--text-dark, #0F172A)',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {/* Semester Filter */}
            <select
              value={selectedSemesterFilter}
              onChange={(e) => setSelectedSemesterFilter(e.target.value)}
              style={{
                padding: '10px 14px',
                fontSize: 12.5,
                background: 'var(--bg, #F8FAFC)',
                border: '1px solid var(--border, #E2E8F0)',
                borderRadius: 12,
                color: 'var(--text-dark, #0F172A)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <option key={n} value={n.toString()}>Semester {n}</option>
              ))}
            </select>

            {/* Health Filter */}
            <select
              value={selectedHealthFilter}
              onChange={(e) => setSelectedHealthFilter(e.target.value)}
              style={{
                padding: '10px 14px',
                fontSize: 12.5,
                background: 'var(--bg, #F8FAFC)',
                border: '1px solid var(--border, #E2E8F0)',
                borderRadius: 12,
                color: 'var(--text-dark, #0F172A)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Health Statuses</option>
              <option value="Healthy">Healthy</option>
              <option value="Requires Attention">Requires Attention</option>
            </select>

            {/* Sort Field */}
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              style={{
                padding: '10px 14px',
                fontSize: 12.5,
                background: 'var(--bg, #F8FAFC)',
                border: '1px solid var(--border, #E2E8F0)',
                borderRadius: 12,
                color: 'var(--text-dark, #0F172A)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="name">Sort by Name</option>
              <option value="semester">Sort by Semester</option>
              <option value="attendance">Sort by Attendance</option>
              <option value="grade">Sort by Grade</option>
            </select>
          </div>
        </div>

        {/* ── SECTION 4: SUBJECTS TABLE / CARDS ── */}
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
          {filteredSubjects.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(79, 70, 229, 0.12)', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                📚
              </div>
              <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: 'var(--text-dark, #0F172A)', margin: 0 }}>
                No Academic Subjects Found
              </h4>
              <p style={{ fontSize: 13, color: 'var(--text-muted, #64748B)', maxWidth: 360, margin: 0 }}>
                {searchQuery ? 'Try adjusting your search terms or filter selection.' : 'Add your first subject to start tracking attendance and course grades.'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowAddModal(true)}
                  style={{ marginTop: 8, padding: '10px 20px', fontSize: 12.5, fontWeight: 700, color: '#FFFFFF', background: '#4F46E5', border: 'none', borderRadius: 12, cursor: 'pointer' }}
                >
                  + Add First Subject
                </button>
              )}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border, #E2E8F0)', background: 'var(--bg, #F8FAFC)' }}>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 800, color: 'var(--text-muted, #475569)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject Name</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 800, color: 'var(--text-muted, #475569)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Semester</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 800, color: 'var(--text-muted, #475569)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Credits</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 800, color: 'var(--text-muted, #475569)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Attendance</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 800, color: 'var(--text-muted, #475569)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Grade</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 800, color: 'var(--text-muted, #475569)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 800, color: 'var(--text-muted, #475569)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubjects.map(sub => (
                    <tr
                      key={`${sub.semesterNumber}-${sub._id || sub.name}`}
                      style={{ borderBottom: '1px solid var(--border, #F1F5F9)', transition: 'background 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg, #F8FAFC)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 13.5, fontWeight: 800, color: 'var(--text-dark, #0F172A)' }}>
                            {sub.name}
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--text-muted, #94A3B8)' }}>
                            {sub.code || `SEM-${sub.semesterNumber}`}
                          </span>
                        </div>
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-dark, #334155)', background: 'var(--bg, #F1F5F9)', padding: '4px 10px', borderRadius: 8 }}>
                          Sem {sub.semesterNumber}
                        </span>
                      </td>

                      <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: 'var(--text-dark, #0F172A)' }}>
                        {sub.credits} Units
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 110 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, fontWeight: 700 }}>
                            {sub.attendance !== null ? (
                              <span style={{ color: sub.attendance >= 75 ? '#059669' : '#DC2626' }}>{sub.attendance}%</span>
                            ) : (
                              <span style={{ color: 'var(--text-muted, #94A3B8)', fontSize: 11 }}>Not recorded</span>
                            )}
                          </div>
                          {sub.attendance !== null && (
                            <div style={{ width: '100%', height: 6, background: 'var(--border, #E2E8F0)', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ width: `${Math.min(100, Math.max(0, sub.attendance))}%`, height: '100%', background: sub.attendance >= 75 ? '#10B981' : '#EF4444', borderRadius: 3 }} />
                            </div>
                          )}
                        </div>
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 13.5, fontWeight: 800, color: sub.finalGrade !== null ? '#4F46E5' : 'var(--text-muted, #94A3B8)' }}>
                          {sub.finalGrade !== null ? sub.finalGrade.toFixed(2) : 'In Progress'}
                        </span>
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          fontSize: 10.5,
                          fontWeight: 800,
                          padding: '3px 10px',
                          borderRadius: 8,
                          background: sub.healthStatus === 'Healthy' ? 'rgba(4, 120, 87, 0.15)' : 'rgba(185, 28, 28, 0.15)',
                          color: sub.healthStatus === 'Healthy' ? '#10B981' : '#EF4444',
                          border: sub.healthStatus === 'Healthy' ? '1px solid rgba(4, 120, 87, 0.3)' : '1px solid rgba(185, 28, 28, 0.3)'
                        }}>
                          {sub.healthStatus}
                        </span>
                      </td>

                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                          <button
                            onClick={() => setDrawerSubject(sub)}
                            style={{ padding: 6, background: 'var(--bg, #F1F5F9)', border: '1px solid var(--border, #E2E8F0)', borderRadius: 8, color: 'var(--text-dark, #475569)', cursor: 'pointer' }}
                            title="View Details"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setEditSubjectData(sub)
                              setEditSemNum(sub.semesterNumber)
                              setShowEditModal(true)
                            }}
                            style={{ padding: 6, background: 'rgba(79, 70, 229, 0.12)', border: '1px solid rgba(79, 70, 229, 0.25)', borderRadius: 8, color: '#4F46E5', cursor: 'pointer' }}
                            title="Edit Subject"
                          >
                            <PenSquare size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteSubData(sub)
                              setDeleteSemNum(sub.semesterNumber)
                              setShowDeleteModal(true)
                            }}
                            style={{ padding: 6, background: 'rgba(220, 38, 38, 0.12)', border: '1px solid rgba(220, 38, 38, 0.25)', borderRadius: 8, color: '#DC2626', cursor: 'pointer' }}
                            title="Delete Subject"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Subject Details Drawer Modal */}
        {drawerSubject && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
            <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderRadius: 24, width: '100%', maxWidth: 540, padding: 28, border: '1px solid var(--border, #E2E8F0)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border, #F1F5F9)', paddingBottom: 14 }}>
                <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: 'var(--text-dark, #0F172A)', margin: 0 }}>
                  {drawerSubject.name} Overview
                </h3>
                <button onClick={() => setDrawerSubject(null)} style={{ background: 'none', border: 'none', fontSize: 18, color: 'var(--text-muted, #94A3B8)', cursor: 'pointer', fontWeight: 800 }}>✕</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{ background: 'var(--bg, #F8FAFC)', padding: 14, borderRadius: 14, border: '1px solid var(--border, #F1F5F9)' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted, #64748B)', fontWeight: 700 }}>Semester Term</span>
                  <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: 'var(--text-dark, #0F172A)', marginTop: 2 }}>Semester {drawerSubject.semesterNumber}</div>
                </div>
                <div style={{ background: 'var(--bg, #F8FAFC)', padding: 14, borderRadius: 14, border: '1px solid var(--border, #F1F5F9)' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted, #64748B)', fontWeight: 700 }}>Credits Allotted</span>
                  <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#4F46E5', marginTop: 2 }}>{drawerSubject.credits} Units</div>
                </div>
                <div style={{ background: 'var(--bg, #F8FAFC)', padding: 14, borderRadius: 14, border: '1px solid var(--border, #F1F5F9)' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted, #64748B)', fontWeight: 700 }}>Attendance Percentage</span>
                  <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: drawerSubject.attendance >= 75 ? '#059669' : '#DC2626', marginTop: 2 }}>{drawerSubject.attendance}%</div>
                </div>
                <div style={{ background: 'var(--bg, #F8FAFC)', padding: 14, borderRadius: 14, border: '1px solid var(--border, #F1F5F9)' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted, #64748B)', fontWeight: 700 }}>Course Grade</span>
                  <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#7C3AED', marginTop: 2 }}>{drawerSubject.finalGrade !== null ? drawerSubject.finalGrade.toFixed(2) : 'In Progress'}</div>
                </div>
              </div>

              <div style={{ padding: 16, background: drawerSubject.healthStatus === 'Healthy' ? '#ECFDF5' : '#FEF2F2', border: drawerSubject.healthStatus === 'Healthy' ? '1px solid #A7F3D0' : '1px solid #FECACA', borderRadius: 16 }}>
                <span style={{ fontSize: 12.5, fontWeight: 800, color: drawerSubject.healthStatus === 'Healthy' ? '#047857' : '#991B1B' }}>
                  {drawerSubject.healthStatus === 'Healthy' ? '✅ Course Status is Healthy' : '⚠️ Requires Academic Attention'}
                </span>
                <p style={{ fontSize: 12, color: drawerSubject.healthStatus === 'Healthy' ? '#065F46' : '#B91C1C', marginTop: 4, margin: 0 }}>
                  {drawerSubject.healthStatus === 'Healthy'
                    ? 'Attendance and grades are within ideal bounds. Keep up the solid performance!'
                    : 'Attendance is below 75% or grade requires recovery. Prioritize upcoming lectures and lab assignments.'}
                </p>
              </div>

              <button
                onClick={() => setDrawerSubject(null)}
                style={{ padding: '10px', fontSize: 13, fontWeight: 700, color: '#FFFFFF', background: '#4F46E5', border: 'none', borderRadius: 12, cursor: 'pointer' }}
              >
                Close Drawer
              </button>
            </div>
          </div>
        )}

        {/* Modals */}
        <AddSubjectModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            fetchSubjectsData()
          }}
        />

        <EditSubjectModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          subject={editSubjectData}
          semesterNumber={editSemNum}
          onSuccess={() => {
            setShowEditModal(false)
            fetchSubjectsData()
          }}
        />

        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDeleteSubject}
          title={`Delete ${deleteSubData?.name}?`}
          message="This action will permanently delete this subject from your semester record."
          confirmText="Delete Subject"
          danger
          loading={deleteLoading}
        />

      </div>
    </AppLayout>
  )
}
