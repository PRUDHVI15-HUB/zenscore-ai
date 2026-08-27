import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AppLayout from '../../components/AppLayout'
import { useAuth } from '../../context/AuthContext'
import { getSavedJobs, removeSavedJob, saveJob, getJobById } from '../../services/api'

import JobCard from '../../components/jobs/listings/JobCard'
import JobDetailsModal from '../../components/jobs/listings/JobDetailsModal'
import Pagination from '../../components/jobs/listings/Pagination'
import LoadingSkeleton from '../../components/jobs/listings/LoadingSkeleton'

import { Bookmark, Sparkles, ArrowRight, RotateCcw, ArrowLeft } from 'lucide-react'

import JobsSubNavHeader from '../../components/jobs/navigation/JobsSubNavHeader'

export default function SavedJobsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [paginationInfo, setPaginationInfo] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 })
  const [selectedModalJob, setSelectedModalJob] = useState(null)
  const [appliedJobIds, setAppliedJobIds] = useState([])
  const [toastMsg, setToastMsg] = useState(null)

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // Fetch saved jobs from backend MongoDB API
  const fetchSavedJobs = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const response = await getSavedJobs({ page: currentPage, limit: 12 })
      if (response && response.jobs) {
        const normalized = response.jobs.map(j => ({
          ...j,
          id: j._id || j.id,
          skills: j.skills || j.requiredSkills || []
        }))
        setSavedJobs(normalized)
        if (response.pagination) {
          setPaginationInfo(response.pagination)
        }
      } else {
        setSavedJobs([])
      }
    } catch (err) {
      if (err?.name === 'AbortError' || err?.message?.includes('aborted')) return
      showToast('Could not load saved jobs. Please try again.')
      setSavedJobs([])
    } finally {
      setLoading(false)
    }
  }, [user, currentPage])

  useEffect(() => {
    fetchSavedJobs()
  }, [fetchSavedJobs])

  // Handle Remove Saved Job
  const handleRemoveSaved = async (jobId) => {
    // Optimistic UI update
    setSavedJobs(prev => prev.filter(j => (j.id || j._id) !== jobId))
    showToast('Job removed from saved bookmarks')

    try {
      await removeSavedJob(jobId)
      // Refetch count
      setPaginationInfo(prev => ({ ...prev, total: Math.max(0, prev.total - 1) }))
    } catch (err) {
      console.error('Failed to remove saved job:', err)
      showToast('Failed to remove job. Please try again.')
      // Refetch to sync state
      fetchSavedJobs()
    }
  }

  // Handle View Details Modal
  const handleViewDetails = async (job) => {
    const jobId = job._id || job.id
    setSelectedModalJob(job)
    try {
      const res = await getJobById(jobId)
      if (res && res.job) {
        setSelectedModalJob({
          ...res.job,
          id: res.job._id || res.job.id,
          skills: res.job.skills || res.job.requiredSkills || []
        })
      }
    } catch (err) {
      console.warn('Failed to fetch detail for modal:', err)
    }
  }

  const handleApply = (job) => {
    const targetUrl = job.applyUrl || job.applyLink || `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${job.title || job.role} ${job.company}`)}`
    window.open(targetUrl, '_blank', 'noopener,noreferrer')
    showToast(`Redirecting to ${job.company} Career Portal...`)
  }

  return (
    <AppLayout>
      {/* Toast Notification Banner */}
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

      {/* Unified Sub Navigation Header with Back Button & 6-Pill Bar */}
      <JobsSubNavHeader
        activeTab="saved"
        title={`Your Saved Opportunities (${paginationInfo.total || savedJobs.length})`}
        subtitle="Review and apply to jobs you have bookmarked across all your devices."
        badge="SAVED BOOKMARKS"
      />

      <div className="container" style={{ margin: '24px auto 60px', padding: '0 24px' }}>
        
        {/* LOADING STATE */}
        {loading && <LoadingSkeleton count={6} />}

        {/* EMPTY STATE */}
        {!loading && savedJobs.length === 0 && (
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
              background: '#F5F3FF',
              color: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              border: '1px solid #DDD6FE'
            }}>
              ⭐
            </div>

            <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 800, color: '#0F172A', margin: 0 }}>
              No Saved Jobs Yet
            </h3>

            <p style={{ fontSize: 14, color: '#64748B', maxWidth: 440, lineHeight: 1.55, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
              Start exploring jobs and save opportunities you'd like to revisit later.
            </p>

            <button
              onClick={() => navigate('/jobs/listings')}
              style={{
                marginTop: 6,
                height: 42,
                padding: '0 24px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 800,
                fontSize: 13.5,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.25)'
              }}
            >
              <span>Explore Jobs</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* SAVED JOBS GRID */}
        {!loading && savedJobs.length > 0 && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 20
            }}>
              {savedJobs.map(job => (
                <JobCard
                  key={job._id || job.id}
                  job={job}
                  isSaved={true}
                  isApplied={appliedJobIds.includes(job._id || job.id)}
                  onSave={() => handleRemoveSaved(job._id || job.id)}
                  onApply={handleApply}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            {/* PAGINATION */}
            <Pagination
              currentPage={currentPage}
              totalPages={paginationInfo.totalPages || 1}
              totalItems={paginationInfo.total || savedJobs.length}
              itemsPerPage={12}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* JOB DETAILS MODAL */}
      <JobDetailsModal
        job={selectedModalJob}
        onClose={() => setSelectedModalJob(null)}
        onApply={handleApply}
        onSave={() => {
          if (selectedModalJob) {
            handleRemoveSaved(selectedModalJob._id || selectedModalJob.id)
            setSelectedModalJob(null)
          }
        }}
        isSaved={true}
        isApplied={selectedModalJob ? appliedJobIds.includes(selectedModalJob.id || selectedModalJob._id) : false}
      />
    </AppLayout>
  )
}
