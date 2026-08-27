import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AppLayout from '../../components/AppLayout'
import { useAuth } from '../../context/AuthContext'
import {
  getMyApplications,
  getMyApplicationStats,
  getApplication,
  saveJob,
  removeSavedJob,
  getJobById
} from '../../services/api'

import JobCard from '../../components/jobs/listings/JobCard'
import JobDetailsModal from '../../components/jobs/listings/JobDetailsModal'
import Pagination from '../../components/jobs/listings/Pagination'
import LoadingSkeleton from '../../components/jobs/listings/LoadingSkeleton'
import ApplicationTimeline from '../../components/jobs/ApplicationTimeline'

import {
  FileText, Sparkles, ArrowRight, ExternalLink, Calendar, CheckCircle2, Clock,
  Search, Filter, RotateCcw, X, Mic, Award, XCircle
} from 'lucide-react'

import JobsSubNavHeader from '../../components/jobs/navigation/JobsSubNavHeader'

export default function MyApplicationsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // State
  const [applications, setApplications] = useState([])
  const [stats, setStats] = useState({ totalApplications: 0, interviews: 0, offers: 0, rejected: 0, withdrawn: 0 })
  const [loading, setLoading] = useState(true)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortBy, setSortBy] = useState('newest')

  // Pagination & Modals
  const [currentPage, setCurrentPage] = useState(1)
  const [paginationInfo, setPaginationInfo] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 })
  const [selectedModalJob, setSelectedModalJob] = useState(null)
  const [selectedApplicationDetail, setSelectedApplicationDetail] = useState(null)
  const [savedJobIds, setSavedJobIds] = useState([])
  const [toastMsg, setToastMsg] = useState(null)

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // Debounce search input (350ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 350)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch Dashboard Stats once on mount
  useEffect(() => {
    if (user) {
      getMyApplicationStats()
        .then(res => {
          if (res && res.stats) setStats(res.stats)
        })
        .catch(err => console.warn('Could not load application stats:', err))
    }
  }, [user])

  // Fetch Applications list from backend API
  const fetchMyApplications = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const response = await getMyApplications({
        search: debouncedSearch,
        status: statusFilter,
        sort: sortBy,
        page: currentPage,
        limit: 12
      })

      if (response && response.applications) {
        setApplications(response.applications)
        if (response.pagination) {
          setPaginationInfo(response.pagination)
        }
      } else {
        setApplications([])
      }
    } catch (err) {
      console.warn('Error fetching applications from MongoDB API:', err)
      showToast('Could not load applications. Please try again.')
      setApplications([])
    } finally {
      setLoading(false)
    }
  }, [user, debouncedSearch, statusFilter, sortBy, currentPage])

  useEffect(() => {
    fetchMyApplications()
  }, [fetchMyApplications])

  // Status badge styling
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Offer':
        return { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' }
      case 'Technical Interview':
      case 'HR Interview':
      case 'Assessment':
        return { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A' }
      case 'Resume Reviewed':
        return { bg: '#F5F3FF', color: '#7C3AED', border: '#DDD6FE' }
      case 'Rejected':
      case 'Withdrawn':
        return { bg: '#FFF1F2', color: '#DC2626', border: '#FECDD3' }
      default:
        return { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' }
    }
  }

  // Handle View Details Click
  const handleViewDetails = async (app) => {
    setSelectedApplicationDetail(app)
    setSelectedModalJob(app.jobDetails || app)

    if (app.id) {
      try {
        const fullApp = await getApplication(app.id)
        if (fullApp && fullApp.application) {
          setSelectedApplicationDetail(fullApp.application)
          if (fullApp.application.jobDetails) {
            setSelectedModalJob(fullApp.application.jobDetails)
          }
        }
      } catch (err) {
        console.warn('Could not load full application timeline:', err)
      }
    }
  }

  const handleToggleSave = async (jobId) => {
    const isSaved = savedJobIds.includes(jobId)
    setSavedJobIds(prev => isSaved ? prev.filter(id => id !== jobId) : [...prev, jobId])
    try {
      if (isSaved) await removeSavedJob(jobId)
      else await saveJob(jobId)
    } catch (err) {
      console.warn('Save action failed:', err)
    }
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setDebouncedSearch('')
    setStatusFilter('All')
    setSortBy('newest')
    setCurrentPage(1)
  }

  return (
    <AppLayout>
      {/* Toast Banner */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: 24,
              right: 24,
              zIndex: 9999,
              background: '#0F172A',
              color: '#FFFFFF',
              padding: '12px 20px',
              borderRadius: 14,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              fontSize: 13.5,
              fontWeight: 700,
              fontFamily: 'Sora, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            <Sparkles size={16} style={{ color: '#FDE047' }} />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <JobsSubNavHeader
        activeTab="applications"
        title="My Applications Dashboard"
        subtitle="Monitor recruitment stages, track interview progression, and analyze your placement statistics."
        badge="PLACEMENT DASHBOARD"
      />

      <div className="container" style={{ margin: '24px auto 60px', padding: '0 24px' }}>
        
        {/* 4 SUMMARY STAT CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: 16,
          marginBottom: 24
        }}>
          {[
            { label: 'Total Applications', val: stats.totalApplications || applications.length, icon: FileText, color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
            { label: 'Interviews Active', val: stats.interviews || 0, icon: Mic, color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
            { label: 'Offers Received', val: stats.offers || 0, icon: Award, color: '#059669', bg: '#F0FDF4', border: '#BBF7D0' },
            { label: 'Rejections / Closed', val: stats.rejected || 0, icon: XCircle, color: '#DC2626', bg: '#FFF1F2', border: '#FECDD3' }
          ].map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} style={{
                background: '#FFFFFF',
                borderRadius: 18,
                padding: '18px 20px',
                border: `1px solid ${s.border}`,
                boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
                display: 'flex',
                alignItems: 'center',
                gap: 14
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: s.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: s.color,
                  flexShrink: 0
                }}>
                  <Icon size={22} strokeWidth={2.2} />
                </div>
                <div>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748B', display: 'block' }}>
                    {s.label}
                  </span>
                  <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 800, color: '#0F172A', lineHeight: 1.1, marginTop: 2 }}>
                    {s.val}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* SEARCH, FILTERS & SORT BAR */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 18,
          padding: 16,
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          marginBottom: 24
        }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 240px' }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search applications by title or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  height: 38,
                  padding: '0 14px 0 40px',
                  borderRadius: 10,
                  border: '1px solid #CBD5E1',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#0F172A',
                  outline: 'none',
                  fontFamily: 'DM Sans, sans-serif'
                }}
              />
            </div>

            {/* Status Filter Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                height: 38,
                padding: '0 12px',
                borderRadius: 10,
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                fontSize: 12.5,
                fontWeight: 600,
                color: '#334155',
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif'
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Resume Reviewed">Resume Reviewed</option>
              <option value="Assessment">Assessment</option>
              <option value="Technical Interview">Technical Interview</option>
              <option value="HR Interview">HR Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                height: 38,
                padding: '0 12px',
                borderRadius: 10,
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                fontSize: 12.5,
                fontWeight: 600,
                color: '#334155',
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif'
              }}
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="company">Sort: Company (A-Z)</option>
            </select>

            {/* Clear Filters Button */}
            {(searchQuery || statusFilter !== 'All' || sortBy !== 'newest') && (
              <button
                onClick={handleClearFilters}
                style={{
                  height: 38,
                  padding: '0 12px',
                  borderRadius: 10,
                  background: '#F1F5F9',
                  color: '#475569',
                  border: '1px solid #CBD5E1',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <RotateCcw size={13} /> Reset
              </button>
            )}
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && <LoadingSkeleton count={6} />}

        {/* EMPTY STATE */}
        {!loading && applications.length === 0 && (
          <div style={{
            background: '#FFFFFF',
            borderRadius: 24,
            padding: '56px 24px',
            textAlign: 'center',
            border: '1px border-dashed #CBD5E1',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14
          }}>
            <div style={{
              width: 68,
              height: 68,
              borderRadius: 22,
              background: '#EFF6FF',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              border: '1px solid #BFDBFE'
            }}>
              📋
            </div>

            <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 800, color: '#0F172A', margin: 0 }}>
              No Applications Found
            </h3>

            <p style={{ fontSize: 14, color: '#64748B', maxWidth: 440, lineHeight: 1.55, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
              Start applying to jobs to track your placement journey and interview progress.
            </p>

            <button
              onClick={() => navigate('/jobs/listings')}
              style={{
                marginTop: 6,
                height: 42,
                padding: '0 24px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 800,
                fontSize: 13.5,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)'
              }}
            >
              <span>Explore Jobs</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* APPLICATIONS LIST GRID */}
        {!loading && applications.length > 0 && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 20
            }}>
              {applications.map(app => {
                const statusStyle = getStatusBadgeStyle(app.status)
                const jobDoc = app.jobDetails || {}
                const formattedDate = new Date(app.appliedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })

                return (
                  <motion.div
                    key={app.id}
                    whileHover={{ y: -3, boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)' }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: 20,
                      padding: 22,
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 16
                    }}
                  >
                    {/* Top Row: Application Status Badge & AI Match */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        fontSize: 11.5,
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: 10,
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        border: `1px solid ${statusStyle.border}`,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5
                      }}>
                        <CheckCircle2 size={13} />
                        {app.status}
                      </span>

                      {app.aiMatch && (
                        <span style={{
                          fontSize: 11,
                          fontWeight: 800,
                          padding: '3px 9px',
                          borderRadius: 12,
                          background: '#F5F3FF',
                          color: '#7C3AED',
                          border: '1px solid #DDD6FE'
                        }}>
                          {app.aiMatch}% Match
                        </span>
                      )}
                    </div>

                    {/* Company Logo & Job Title */}
                    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: '#F8FAFC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 24,
                        border: '1px solid #E2E8F0',
                        flexShrink: 0
                      }}>
                        {app.logo || '💼'}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                          fontFamily: 'Sora, sans-serif',
                          fontSize: 16,
                          fontWeight: 800,
                          color: '#0F172A',
                          margin: 0,
                          lineHeight: 1.25,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {app.title}
                        </h3>

                        <div style={{
                          fontSize: 12.5,
                          color: '#475569',
                          fontWeight: 600,
                          marginTop: 4
                        }}>
                          <span style={{ color: '#1E293B', fontWeight: 700 }}>{app.company}</span>
                          <span> • </span>
                          <span style={{ color: '#64748B' }}>{app.location} ({app.workMode})</span>
                        </div>
                      </div>
                    </div>

                    {/* Application Date & Type */}
                    <div style={{
                      background: '#F8FAFC',
                      borderRadius: 12,
                      padding: '10px 14px',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: 11.5,
                      color: '#475569',
                      fontWeight: 600
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={13} style={{ color: '#94A3B8' }} />
                        Applied on {formattedDate}
                      </span>
                      <span style={{ textTransform: 'capitalize', color: '#2563EB', fontWeight: 700 }}>
                        {app.applicationType} Flow
                      </span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleViewDetails(app)}
                        style={{
                          flex: 1,
                          height: 38,
                          borderRadius: 10,
                          background: '#F1F5F9',
                          color: '#334155',
                          border: '1px solid #CBD5E1',
                          cursor: 'pointer',
                          fontFamily: 'Sora, sans-serif',
                          fontWeight: 700,
                          fontSize: 12
                        }}
                      >
                        View Details
                      </button>

                      {app.applyLink && app.applyLink !== '#' && (
                        <button
                          onClick={() => window.open(app.applyLink, '_blank', 'noopener,noreferrer')}
                          style={{
                            height: 38,
                            padding: '0 14px',
                            borderRadius: 10,
                            background: '#EFF6FF',
                            color: '#2563EB',
                            border: '1px solid #BFDBFE',
                            cursor: 'pointer',
                            fontFamily: 'Sora, sans-serif',
                            fontWeight: 700,
                            fontSize: 12,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5
                          }}
                        >
                          <span>Portal</span>
                          <ExternalLink size={13} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* PAGINATION */}
            <Pagination
              currentPage={currentPage}
              totalPages={paginationInfo.totalPages || 1}
              totalItems={paginationInfo.total || applications.length}
              itemsPerPage={12}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* JOB DETAILS & TIMELINE MODAL */}
      <JobDetailsModal
        job={selectedModalJob}
        onClose={() => {
          setSelectedModalJob(null)
          setSelectedApplicationDetail(null)
        }}
        onApply={() => {}}
        onSave={() => handleToggleSave(selectedModalJob?._id || selectedModalJob?.id)}
        isSaved={selectedModalJob ? savedJobIds.includes(selectedModalJob._id || selectedModalJob.id) : false}
        isApplied={true}
      >
        {/* Render Vertical Recruitment Timeline inside Modal */}
        {selectedApplicationDetail && (
          <ApplicationTimeline
            status={selectedApplicationDetail.status}
            timeline={selectedApplicationDetail.timeline || []}
            appliedAt={selectedApplicationDetail.appliedAt}
            lastUpdated={selectedApplicationDetail.lastUpdated}
          />
        )}
      </JobDetailsModal>
    </AppLayout>
  )
}
