import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles, Briefcase, Building2, Target, TrendingUp, Mic, GraduationCap, Send, FileText, Bookmark, Bell, ArrowUpRight
} from 'lucide-react'
import { getJobs, getJobStats } from '../../services/api'
import { useCareer } from '../../context/CareerContext'
import { useStudentProfile } from '../../context/StudentProfileContext'
import { resolveCanonicalCareerGoal } from '../../services/careers/careerNormalizer'

/**
 * Default Tabs List matching Courses/Skills tab bar design
 */
export const DEFAULT_JOBS_TABS = [
  { id: 'listings', label: 'Find Your Job', Icon: Briefcase, route: '/jobs/listings' },
  { id: 'saved', label: 'Saved Jobs', Icon: Bookmark, route: '/jobs/saved' },
  { id: 'applications', label: 'My Applications', Icon: FileText, route: '/jobs/applications' },
  { id: 'alerts', label: 'Job Alerts', Icon: Bell, route: '/jobs/alerts' },
  { id: 'analytics', label: 'Analytics', Icon: TrendingUp, route: '/jobs/analytics' },
  { id: 'following', label: 'Followed Companies', Icon: Building2, route: '/jobs/following' }
]

/**
 * Structured Data Constants for Hero Statistics & Job Snapshot
 */
export const DEFAULT_HERO_STATS = [
  {
    id: 'jobs',
    label: 'Jobs Available',
    value: '440+',
    subtext: 'Live across ATS & Sources',
    Icon: Briefcase,
    color: '#2563EB',
    bg: '#EFF6FF',
    border: '#BFDBFE'
  },
  {
    id: 'internships',
    label: 'Internships',
    value: '14+',
    subtext: 'Fresh student openings',
    Icon: GraduationCap,
    color: '#7C3AED',
    bg: '#F5F3FF',
    border: '#DDD6FE'
  },
  {
    id: 'companies',
    label: 'Companies Hiring',
    value: '65+',
    subtext: 'Top MNCs & Enterprise',
    Icon: Building2,
    color: '#059669',
    bg: '#F0FDF4',
    border: '#BBF7D0'
  },
  {
    id: 'applications',
    label: 'Applications Sent',
    value: '0',
    subtext: 'Active Candidate Applications',
    Icon: Send,
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A'
  }
]

export const DEFAULT_SNAPSHOT_DATA = {
  targetRole: 'Software Engineer',
  placementReadiness: 82,
  matchedJobs: 24,
  interviewScore: 76
}

/**
 * JobsHero Component (ZenScore AI Jobs & Placement Portal Hero)
 * Complete with Hero Banner, Upgraded Job Snapshot Card, 4 Quick Stats Cards, and Pill Navigation Tabs Bar.
 */
export default function JobsHero({
  snapshotData = null,
  heroStats: customHeroStats,
  activeTab = 'listings',
  setActiveTab,
  tabs = DEFAULT_JOBS_TABS,
  onExplore
}) {
  const navigate = useNavigate()
  const [stats, setStats] = useState(customHeroStats || DEFAULT_HERO_STATS)

  useEffect(() => {
    let isMounted = true
    const fetchLiveStats = async () => {
      try {
        const res = await getJobStats()
        if (isMounted && res && res.success && res.stats) {
          const { totalJobs, totalInternships, companiesCount, applicationsCount } = res.stats
          setStats([
            {
              id: 'jobs',
              label: 'Jobs Available',
              value: `${totalJobs}+`,
              subtext: 'Live across ATS & Sources',
              Icon: Briefcase,
              color: '#2563EB',
              bg: '#EFF6FF',
              border: '#BFDBFE'
            },
            {
              id: 'internships',
              label: 'Internships',
              value: `${totalInternships}+`,
              subtext: 'Fresh student openings',
              Icon: GraduationCap,
              color: '#7C3AED',
              bg: '#F5F3FF',
              border: '#DDD6FE'
            },
            {
              id: 'companies',
              label: 'Companies Hiring',
              value: `${companiesCount}+`,
              subtext: 'Top MNCs & Enterprise',
              Icon: Building2,
              color: '#059669',
              bg: '#F0FDF4',
              border: '#BBF7D0'
            },
            {
              id: 'applications',
              label: 'Applications Sent',
              value: `${applicationsCount}`,
              subtext: 'Active Candidate Applications',
              Icon: Send,
              color: '#D97706',
              bg: '#FFFBEB',
              border: '#FDE68A'
            }
          ])
        }
      } catch (err) {
        if (err?.name === 'AbortError' || err?.message?.includes('aborted')) return
      }
    }
    fetchLiveStats()
    return () => { isMounted = false }
  }, [])

  const careerCtx = useCareer()
  const studentProfileCtx = useStudentProfile()
  const explicitTarget = snapshotData?.targetRole && snapshotData.targetRole !== 'Software Engineer' ? snapshotData.targetRole : ''
  const canonicalRole = resolveCanonicalCareerGoal(
    studentProfileCtx?.profile,
    careerCtx,
    explicitTarget
  )

  // Combined snapshot data with fallback and live synchronized target role
  const snapshot = {
    ...DEFAULT_SNAPSHOT_DATA,
    ...(snapshotData || {}),
    targetRole: (canonicalRole && canonicalRole.trim().length > 0) ? canonicalRole : 'Set Career Goal'
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    }
  }

  const handleExploreClick = () => {
    if (onExplore) {
      onExplore()
    }
    navigate('/jobs/listings')
  }

  const handleTabClick = (tab) => {
    if (setActiveTab) setActiveTab(tab.id)
    if (tab.id === 'listings') {
      navigate('/jobs/listings')
    } else if (tab.route) {
      navigate(tab.route)
    }
  }

  return (
    <div className="container" style={{ padding: '24px 24px 0', margin: '0 auto' }}>
      {/* Main Hero Curved Banner Card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          background: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 50%, #EC4899 100%)',
          borderRadius: 24,
          padding: '32px 36px',
          boxShadow: '0 12px 36px rgba(109, 40, 217, 0.18)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap'
        }}
        className="jobs-hero-card"
      >
        {/* Animated background ambient glow circle */}
        <motion.div
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.18, 0.28, 0.18]
          }}
          transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '-30%',
            right: '20%',
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, rgba(124, 58, 237, 0) 70%)',
            filter: 'blur(36px)',
            pointerEvents: 'none'
          }}
        />

        {/* LEFT COLUMN: Badge, Title, Subtitle, CTAs */}
        <motion.div
          variants={itemVariants}
          style={{ zIndex: 2, flex: '1 1 440px', maxWidth: 540 }}
        >
          {/* Top Pill Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              borderRadius: 20,
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#F3E8FF',
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: '0.04em',
              marginBottom: 10
            }}
          >
            <Sparkles size={13} style={{ color: '#FDE047' }} />
            <span>JOBS & OPPORTUNITIES</span>
          </div>

          {/* Hero Title */}
          <h1
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: 'clamp(22px, 3vw, 28px)',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.5px',
              marginBottom: 8,
              lineHeight: 1.2
            }}
          >
            Find Your Next Job & Opportunity
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.55,
              color: 'rgba(255, 255, 255, 0.88)',
              maxWidth: 500,
              marginBottom: 20
            }}
          >
            Discover verified tech jobs, internships, apply with AI matching, and track your applications in real-time.
          </p>

          {/* Action Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExploreClick}
              style={{
                height: 42,
                padding: '0 24px',
                borderRadius: 12,
                background: '#FFFFFF',
                color: '#6D28D9',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 700,
                fontSize: 13.5,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
                transition: 'all 0.2s ease'
              }}
            >
              <Briefcase size={16} strokeWidth={2.4} />
              <span>Find Your Job</span>
            </motion.button>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: 3D Floating Illustration + Upgraded Glassmorphism Snapshot Panel */}
        {/* RIGHT COLUMN: Standardized Glassmorphic Job Snapshot Panel */}
        <motion.div
          variants={itemVariants}
          style={{
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            position: 'relative'
          }}
          className="jobs-hero-right"
        >
          {/* Glassmorphic Job Snapshot Card */}
          <motion.div
            whileHover={{ translateY: -3, scale: 1.02 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'rgba(255, 255, 255, 0.16)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.28)',
              borderRadius: 18,
              padding: '16px 20px',
              width: 230,
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}
          >
            {/* Header Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={13} style={{ color: '#FDE047' }} />
                <span>Job Snapshot</span>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10, background: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                LIVE
              </span>
            </div>

            {/* 🎯 Target Role */}
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: 12, padding: '8px 12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div style={{ fontSize: 10, color: 'rgba(255, 255, 255, 0.75)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Target size={12} style={{ color: '#FDE047' }} />
                Target Role
              </div>
              <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 800, color: '#FFFFFF', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {snapshot.targetRole}
              </div>
            </div>

            {/* 📈 Placement Readiness Progress Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 10.5, color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <TrendingUp size={12} style={{ color: '#34D399' }} />
                  Placement Readiness
                </span>
                <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 12, fontWeight: 800, color: '#34D399' }}>
                  {snapshot.placementReadiness}%
                </span>
              </div>
              <div style={{ width: '100%', height: 5, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 99, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${snapshot.placementReadiness}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, #34D399 0%, #A7F3D0 100%)', borderRadius: 99 }}
                />
              </div>
            </div>

            {/* 2-Column Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: '8px 10px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <div style={{ fontSize: 9.5, color: 'rgba(255, 255, 255, 0.75)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Briefcase size={11} style={{ color: '#60A5FA' }} />
                  Matched
                </div>
                <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 13.5, fontWeight: 800, color: '#60A5FA', marginTop: 2 }}>
                  {snapshot.matchedJobs} Jobs
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: '8px 10px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <div style={{ fontSize: 9.5, color: 'rgba(255, 255, 255, 0.75)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Mic size={11} style={{ color: '#F472B6' }} />
                  Interview
                </div>
                <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 13.5, fontWeight: 800, color: '#F472B6', marginTop: 2 }}>
                  {snapshot.interviewScore}% Score
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* 4 HERO QUICK STATISTICS CARDS */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: 16,
          marginTop: 24,
          width: '100%'
        }}
      >
        {stats.map((stat) => {
          const IconComponent = stat.Icon
          return (
            <motion.div
              key={stat.id}
              whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                background: '#FFFFFF',
                borderRadius: 18,
                padding: '18px 20px',
                border: `1px solid ${stat.border || '#E2E8F0'}`,
                boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                cursor: 'default'
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: stat.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <IconComponent size={22} style={{ color: stat.color }} strokeWidth={2.2} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748B', fontFamily: 'DM Sans, sans-serif' }}>
                  {stat.label}
                </span>
                <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
                  {stat.value}
                </span>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: stat.color, fontFamily: 'DM Sans, sans-serif', marginTop: 1 }}>
                  {stat.subtext}
                </span>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* 4 NAVIGATION PILL TABS BAR DIRECTLY BELOW THE 4 QUICK STATS CARDS */}
      {tabs.length > 0 && (
        <div
          className="jobs-nav-tabs"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))',
            gap: 10,
            marginTop: 20,
            width: '100%'
          }}
        >
          {tabs.map((t) => {
            const isActive = activeTab === t.id
            const Icon = t.Icon
            return (
              <button
                key={t.id}
                onClick={() => handleTabClick(t)}
                style={{
                  height: 44,
                  padding: '0 14px',
                  borderRadius: 14,
                  border: isActive ? '1px solid #7C3AED' : '1px solid var(--border, #E2E8F0)',
                  cursor: 'pointer',
                  background: isActive
                    ? 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)'
                    : 'var(--bg-soft, #FFFFFF)',
                  color: isActive ? '#FFFFFF' : 'var(--text-mid, #475569)',
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: 13,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 7,
                  transition: 'all 0.2s ease',
                  boxShadow: isActive
                    ? '0 4px 14px rgba(124, 58, 237, 0.25)'
                    : '0 1px 3px rgba(0, 0, 0, 0.03)'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = '#7C3AED'
                    e.currentTarget.style.color = 'var(--text-dark, #1E293B)'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'var(--border, #E2E8F0)'
                    e.currentTarget.style.color = 'var(--text-mid, #475569)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }
                }}
              >
                {Icon && <Icon size={15} strokeWidth={2.2} className="shrink-0" />}
                <span className="truncate">{t.label}</span>
                <ArrowUpRight size={13} style={{ opacity: isActive ? 0.95 : 0.6, marginLeft: 2, flexShrink: 0 }} />
              </button>
            )
          })}
        </div>
      )}

      {/* Responsive Breakpoints CSS */}
      <style>{`
        @media (max-width: 768px) {
          .jobs-hero-card {
            padding: 24px 20px !important;
          }
          .jobs-hero-right {
            width: 100%;
            justify-content: space-between;
            margin-top: 12px;
          }
          .jobs-nav-tabs {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 8px !important;
          }
        }
        @media (max-width: 480px) {
          .jobs-nav-tabs {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
          }
        }
      `}</style>
    </div>
  )
}
