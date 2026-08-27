import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AppLayout from '../../components/AppLayout'
import { useAuth } from '../../context/AuthContext'
import {
  getCompanyProfile,
  isFollowingCompany,
  followCompany,
  unfollowCompany,
  toggleCompanyNotifications,
  saveJob,
  removeSavedJob,
  applyForJob,
  getSavedJobs,
  getMyApplications
} from '../../services/api'

import JobCard from '../../components/jobs/listings/JobCard'
import JobDetailsModal from '../../components/jobs/listings/JobDetailsModal'
import LoadingSkeleton from '../../components/jobs/listings/LoadingSkeleton'

import {
  Building2, Bell, BellOff, Sparkles, ArrowLeft, CheckCircle2, Briefcase,
  Globe, ShieldCheck, UserPlus, UserCheck, Code2
} from 'lucide-react'

export default function CompanyProfilePage() {
  const { companyName } = useParams()
  const decodedCompany = decodeURIComponent(companyName || '')
  const { user } = useAuth()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Follow State
  const [isFollowing, setIsFollowing] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  // Job Actions State
  const [savedJobIds, setSavedJobIds] = useState([])
  const [appliedJobIds, setAppliedJobIds] = useState([])
  const [selectedModalJob, setSelectedModalJob] = useState(null)
  const [toastMsg, setToastMsg] = useState(null)

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // Fetch Company Profile & Openings
  const fetchProfile = useCallback(async () => {
    if (!decodedCompany) return
    setLoading(true)
    try {
      const res = await getCompanyProfile(decodedCompany)
      if (res && res.profile) {
        setProfile(res.profile)
      }

      if (user) {
        const followRes = await isFollowingCompany(decodedCompany)
        if (followRes) {
          setIsFollowing(!!followRes.following)
          setNotificationsEnabled(!!followRes.notificationsEnabled)
        }

        getSavedJobs()
          .then(r => r?.jobs && setSavedJobIds(r.jobs.map(j => j._id || j.id)))
          .catch(() => {})

        getMyApplications()
          .then(r => r?.applications && setAppliedJobIds(r.applications.map(a => a.jobId || a.job?._id).filter(Boolean)))
          .catch(() => {})
      }
    } catch (err) {
      console.warn('Error loading company profile:', err)
      showToast('Could not load company profile.')
    } finally {
      setLoading(false)
    }
  }, [decodedCompany, user])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  // Follow / Unfollow Handler
  const handleToggleFollow = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      if (isFollowing) {
        await unfollowCompany(decodedCompany)
        setIsFollowing(false)
        showToast(`Unfollowed ${decodedCompany}.`)
      } else {
        await followCompany(decodedCompany)
        setIsFollowing(true)
        showToast(`You are now following ${decodedCompany}.`)
      }
    } catch (err) {
      console.error('Error toggling follow:', err)
      showToast('Action failed. Please try again.')
    }
  }

  // Notifications Toggle Handler
  const handleToggleNotifs = async () => {
    try {
      const res = await toggleCompanyNotifications(decodedCompany)
      setNotificationsEnabled(res.notificationsEnabled)
      showToast(`Notifications ${res.notificationsEnabled ? 'enabled' : 'disabled'} for ${decodedCompany}.`)
    } catch (err) {
      console.error('Error toggling notifications:', err)
    }
  }

  const handleToggleSave = async (id) => {
    const isSaved = savedJobIds.includes(id)
    setSavedJobIds(prev => isSaved ? prev.filter(i => i !== id) : [...prev, id])
    try {
      if (isSaved) await removeSavedJob(id)
      else await saveJob(id)
    } catch (err) {
      console.warn('Save job error:', err)
    }
  }

  const handleApply = async (job) => {
    const jobId = job.id || job._id
    const fallbackUrl = job.applyUrl || job.applyLink || `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${job.title || job.role} ${job.company}`)}`

    try {
      const res = await applyForJob(jobId)
      const targetUrl = res?.redirectUrl || fallbackUrl
      if (targetUrl) {
        window.open(targetUrl, '_blank', 'noopener,noreferrer')
      }
    } catch (err) {
      if (fallbackUrl) {
        window.open(fallbackUrl, '_blank', 'noopener,noreferrer')
      }
    }
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

      <div className="container" style={{ margin: '24px auto 60px', padding: '0 24px' }}>
        
        {/* Back Link Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/jobs')}
            style={{
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
              padding: '6px 14px',
              borderRadius: 20,
              color: '#334155',
              cursor: 'pointer',
              fontSize: 12.5,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'Sora, sans-serif'
            }}
          >
            <ArrowLeft size={14} strokeWidth={2.5} />
            <span>Back to Jobs Portal</span>
          </button>

          <button
            onClick={() => navigate('/jobs/following')}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              cursor: 'pointer',
              fontSize: 12.5,
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <span>Companies Watchlist</span>
          </button>
        </div>

        {/* Company Header Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #2563EB 100%)',
            borderRadius: 24,
            padding: '36px 40px',
            boxShadow: '0 12px 36px rgba(15, 23, 42, 0.18)',
            marginBottom: 28,
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 24
          }}
        >
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <div style={{
              width: 76,
              height: 76,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 38,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
              flexShrink: 0
            }}>
              {profile?.companyLogo || '🏢'}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h1 style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: 'clamp(24px, 3.5vw, 32px)',
                  fontWeight: 800,
                  margin: 0,
                  letterSpacing: '-0.5px'
                }}>
                  {decodedCompany}
                </h1>

                <span style={{
                  fontSize: 11.5,
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: 12,
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#A7F3D0',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  <CheckCircle2 size={12} />
                  {profile?.hiringStatus || 'Actively Hiring'}
                </span>
              </div>

              <p style={{
                fontSize: 14,
                color: 'rgba(255, 255, 255, 0.85)',
                margin: '6px 0 0',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                {profile?.industry || 'Technology'} • {profile?.activeJobs || 0} Active Job Openings
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button
              onClick={handleToggleFollow}
              style={{
                height: 44,
                padding: '0 24px',
                borderRadius: 14,
                background: isFollowing ? 'rgba(255, 255, 255, 0.15)' : '#FFFFFF',
                color: isFollowing ? '#FFFFFF' : '#2563EB',
                border: isFollowing ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
                cursor: 'pointer',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 800,
                fontSize: 14,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: isFollowing ? 'none' : '0 4px 14px rgba(0, 0, 0, 0.15)'
              }}
            >
              {isFollowing ? <UserCheck size={18} /> : <UserPlus size={18} />}
              <span>{isFollowing ? 'Following ✓' : 'Follow Company'}</span>
            </button>

            {isFollowing && (
              <button
                onClick={handleToggleNotifs}
                title={notificationsEnabled ? 'Mute hiring alerts' : 'Enable hiring alerts'}
                style={{
                  height: 44,
                  width: 44,
                  borderRadius: 14,
                  background: notificationsEnabled ? '#F5F3FF' : 'rgba(255, 255, 255, 0.15)',
                  color: notificationsEnabled ? '#7C3AED' : '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {notificationsEnabled ? <Bell size={18} /> : <BellOff size={18} />}
              </button>
            )}
          </div>
        </motion.div>

        {loading && <LoadingSkeleton count={4} />}

        {!loading && profile && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            
            {/* FREQUENTLY HIRED SKILLS & TECH STACK */}
            {profile.frequentlyHiredSkills && profile.frequentlyHiredSkills.length > 0 && (
              <div style={{
                background: '#FFFFFF',
                borderRadius: 20,
                padding: 24,
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <Code2 size={18} style={{ color: '#2563EB' }} />
                  <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Frequently Hired Skills & Tech Stack
                  </h3>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {profile.frequentlyHiredSkills.map((sk, idx) => (
                    <span key={idx} style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      padding: '6px 14px',
                      borderRadius: 10,
                      background: '#F5F3FF',
                      color: '#7C3AED',
                      border: '1px solid #DDD6FE'
                    }}>
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* OPEN POSITIONS LIST */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Active Job Openings at {decodedCompany} ({(profile.latestJobs || []).length})
                </h2>
              </div>

              {(!profile.latestJobs || profile.latestJobs.length === 0) ? (
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: 20,
                  padding: 40,
                  textAlign: 'center',
                  border: '1px border-dashed #CBD5E1',
                  color: '#64748B'
                }}>
                  No active job listings for this company at the moment. Follow to receive future hiring alerts!
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: 20
                }}>
                  {profile.latestJobs.map(job => (
                    <JobCard
                      key={job._id || job.id}
                      job={{ ...job, id: job._id || job.id }}
                      onViewDetails={() => setSelectedModalJob({ ...job, id: job._id || job.id })}
                      onSave={() => handleToggleSave(job._id || job.id)}
                      onApply={() => handleApply(job)}
                      isSaved={savedJobIds.includes(job._id || job.id)}
                      isApplied={appliedJobIds.includes(job._id || job.id)}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* JOB DETAILS MODAL */}
      <JobDetailsModal
        job={selectedModalJob}
        onClose={() => setSelectedModalJob(null)}
        onApply={(job) => handleApply(job)}
        onSave={(id) => handleToggleSave(id)}
        isSaved={selectedModalJob ? savedJobIds.includes(selectedModalJob._id || selectedModalJob.id) : false}
        isApplied={selectedModalJob ? appliedJobIds.includes(selectedModalJob._id || selectedModalJob.id) : false}
      />
    </AppLayout>
  )
}
