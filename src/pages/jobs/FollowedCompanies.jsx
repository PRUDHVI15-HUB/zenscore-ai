import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AppLayout from '../../components/AppLayout'
import { useAuth } from '../../context/AuthContext'
import {
  getFollowedCompanies,
  unfollowCompany,
  toggleCompanyNotifications
} from '../../services/api'

import LoadingSkeleton from '../../components/jobs/listings/LoadingSkeleton'
import Pagination from '../../components/jobs/listings/Pagination'

import {
  Building2, Bell, BellOff, ExternalLink, Sparkles, ArrowRight, CheckCircle2,
  Briefcase, UserMinus, Globe, ShieldCheck
} from 'lucide-react'

import JobsSubNavHeader from '../../components/jobs/navigation/JobsSubNavHeader'

export default function FollowedCompaniesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [paginationInfo, setPaginationInfo] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 })
  const [toastMsg, setToastMsg] = useState(null)

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // Fetch followed companies list
  const fetchCompanies = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const res = await getFollowedCompanies({ page: currentPage, limit: 12 })
      if (res && res.companies) {
        setCompanies(res.companies)
        if (res.pagination) setPaginationInfo(res.pagination)
      } else {
        setCompanies([])
      }
    } catch (err) {
      if (err?.name === 'AbortError' || err?.message?.includes('aborted')) return
      showToast('Could not load followed companies.')
      setCompanies([])
    } finally {
      setLoading(false)
    }
  }, [user, currentPage])

  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  const handleUnfollow = async (companyName) => {
    try {
      await unfollowCompany(companyName)
      setCompanies(prev => prev.filter(c => c.companyName.toLowerCase() !== companyName.toLowerCase()))
      showToast(`Unfollowed ${companyName}.`)
    } catch (err) {
      console.error('Error unfollowing company:', err)
      showToast('Failed to unfollow company.')
    }
  }

  const handleToggleNotifications = async (companyName) => {
    try {
      const res = await toggleCompanyNotifications(companyName)
      setCompanies(prev => prev.map(c => {
        if (c.companyName.toLowerCase() === companyName.toLowerCase()) {
          return { ...c, notificationsEnabled: res.notificationsEnabled }
        }
        return c
      }))
      showToast(`Notifications ${res.notificationsEnabled ? 'enabled' : 'disabled'} for ${companyName}.`)
    } catch (err) {
      console.error('Error toggling notifications:', err)
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

      {/* Unified Sub Navigation Header with Back Button & 6-Pill Bar */}
      <JobsSubNavHeader
        activeTab="following"
        title={`Followed Companies (${paginationInfo.total || companies.length})`}
        subtitle="Track top employers, monitor hiring activity, and receive real-time notifications when your favorite companies post new job roles."
        badge="COMPANY WATCHLIST"
      />

      <div className="container" style={{ margin: '24px auto 60px', padding: '0 24px' }}>

        {/* LOADING STATE */}
        {loading && <LoadingSkeleton count={6} />}

        {/* EMPTY STATE */}
        {!loading && companies.length === 0 && (
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
              🏢
            </div>

            <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 800, color: '#0F172A', margin: 0 }}>
              No Companies Followed Yet
            </h3>

            <p style={{ fontSize: 14, color: '#64748B', maxWidth: 440, lineHeight: 1.55, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
              Follow companies on job cards to build your personalized watchlist and get hiring alerts.
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
              <span>Explore Jobs & Companies</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* FOLLOWED COMPANIES GRID */}
        {!loading && companies.length > 0 && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 20
            }}>
              {companies.map(comp => {
                const formattedDate = new Date(comp.followedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })

                return (
                  <motion.div
                    key={comp.id}
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
                    {/* Top Row: Company Logo, Name & Status */}
                    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 52,
                        height: 52,
                        borderRadius: '50%',
                        background: '#F8FAFC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 26,
                        border: '1px solid #E2E8F0',
                        flexShrink: 0
                      }}>
                        {comp.companyLogo || '🏢'}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h3 style={{
                            fontFamily: 'Sora, sans-serif',
                            fontSize: 16.5,
                            fontWeight: 800,
                            color: '#0F172A',
                            margin: 0
                          }}>
                            {comp.companyName}
                          </h3>

                          <button
                            onClick={() => handleToggleNotifications(comp.companyName)}
                            title={comp.notificationsEnabled ? 'Mute hiring alerts' : 'Enable hiring alerts'}
                            style={{
                              background: comp.notificationsEnabled ? '#F5F3FF' : '#F1F5F9',
                              color: comp.notificationsEnabled ? '#7C3AED' : '#94A3B8',
                              border: comp.notificationsEnabled ? '1px solid #DDD6FE' : '1px solid #CBD5E1',
                              borderRadius: 8,
                              padding: 6,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {comp.notificationsEnabled ? <Bell size={15} /> : <BellOff size={15} />}
                          </button>
                        </div>

                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: '#15803D',
                          marginTop: 4
                        }}>
                          <CheckCircle2 size={12} />
                          <span>{comp.hiringStatus || 'Actively Hiring'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats Box */}
                    <div style={{
                      background: '#F8FAFC',
                      borderRadius: 12,
                      padding: '12px 14px',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: '#475569'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Briefcase size={14} style={{ color: '#2563EB' }} />
                        <strong style={{ color: '#0F172A' }}>{comp.activeJobs || 0}</strong> Active Openings
                      </span>
                      <span style={{ fontSize: 11, color: '#94A3B8' }}>
                        Followed {formattedDate}
                      </span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => navigate(`/companies/${encodeURIComponent(comp.companyName)}`)}
                        style={{
                          flex: 1,
                          height: 38,
                          borderRadius: 10,
                          background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                          color: '#FFFFFF',
                          border: 'none',
                          cursor: 'pointer',
                          fontFamily: 'Sora, sans-serif',
                          fontWeight: 700,
                          fontSize: 12.5,
                          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                        }}
                      >
                        Company Profile & Jobs
                      </button>

                      <button
                        onClick={() => handleUnfollow(comp.companyName)}
                        title="Unfollow company"
                        style={{
                          height: 38,
                          padding: '0 12px',
                          borderRadius: 10,
                          background: '#FFF1F2',
                          color: '#DC2626',
                          border: '1px solid #FECDD3',
                          cursor: 'pointer',
                          fontSize: 12,
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <UserMinus size={14} />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* PAGINATION */}
            <Pagination
              currentPage={currentPage}
              totalPages={paginationInfo.totalPages || 1}
              totalItems={paginationInfo.total || companies.length}
              itemsPerPage={12}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </AppLayout>
  )
}
