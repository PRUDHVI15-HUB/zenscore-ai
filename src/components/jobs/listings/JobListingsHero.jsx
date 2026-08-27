import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Briefcase,
  Bookmark,
  ArrowDown,
  FileText,
  Bell,
  TrendingUp,
  Building2,
  ArrowLeft,
  ArrowUpRight
} from 'lucide-react'

export const JOBS_NAV_TABS = [
  { id: 'listings', label: 'Find Your Job', Icon: Briefcase, route: '/jobs/listings' },
  { id: 'saved', label: 'Saved Jobs', Icon: Bookmark, route: '/jobs/saved' },
  { id: 'applications', label: 'My Applications', Icon: FileText, route: '/jobs/applications' },
  { id: 'alerts', label: 'Job Alerts', Icon: Bell, route: '/jobs/alerts' },
  { id: 'analytics', label: 'Analytics', Icon: TrendingUp, route: '/jobs/analytics' },
  { id: 'following', label: 'Followed Companies', Icon: Building2, route: '/jobs/following' }
]

export default function JobListingsHero({ onBrowseClick, onSavedJobsClick, onSyncClick, isSyncing, savedCount = 0 }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="container" style={{ margin: '0 auto', padding: '24px 24px 0' }}>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 50%, #EC4899 100%)',
          borderRadius: 24,
          padding: '36px 40px',
          boxShadow: '0 12px 36px rgba(109, 40, 217, 0.18)',
          position: 'relative',
          overflow: 'hidden',
          color: '#FFFFFF'
        }}
      >
        {/* Soft background ambient glow circle */}
        <div style={{
          position: 'absolute',
          top: '-40%',
          right: '15%',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(124, 58, 237, 0) 70%)',
          filter: 'blur(36px)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 720 }}>
          {/* Top Row: Back Button & Portal Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ x: -3, background: 'rgba(255, 255, 255, 0.28)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/jobs')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 20,
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                color: '#FFFFFF',
                fontSize: 12.5,
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: 'Sora, sans-serif',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              <ArrowLeft size={15} strokeWidth={2.5} />
              <span>Back to Jobs Portal</span>
            </motion.button>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 12px',
              borderRadius: 20,
              background: 'rgba(255, 255, 255, 0.14)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#F3E8FF',
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: '0.04em'
            }}>
              <Sparkles size={13} style={{ color: '#FDE047' }} />
              <span>ZENCORE AI JOB PORTAL</span>
            </div>
          </div>

          <h1 style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: 'clamp(24px, 3.5vw, 32px)',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            margin: '0 0 10px',
            lineHeight: 1.25
          }}>
            Find Your Next Opportunity
          </h1>

          <p style={{
            fontSize: 14.5,
            lineHeight: 1.6,
            color: 'rgba(255, 255, 255, 0.9)',
            margin: '0 0 24px',
            fontFamily: 'DM Sans, sans-serif'
          }}>
            Discover internships and full-time opportunities from leading companies, personalized for your skills and career goals.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBrowseClick}
              style={{
                height: 40,
                padding: '0 20px',
                borderRadius: 12,
                background: '#FFFFFF',
                color: '#6D28D9',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 800,
                fontSize: 13,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)'
              }}
            >
              <Briefcase size={15} strokeWidth={2.4} />
              <span>Browse Jobs</span>
              <ArrowDown size={13} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ── 6-PILL SUB-NAVIGATION TAB BAR ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
          gap: 10,
          marginTop: 20,
          width: '100%'
        }}
        className="jobs-sub-nav-tabs"
      >
        {JOBS_NAV_TABS.map((t) => {
          const isActive = t.id === 'listings'
          const Icon = t.Icon
          return (
            <button
              key={t.id}
              onClick={() => navigate(t.route)}
              style={{
                height: 44,
                padding: '0 12px',
                borderRadius: 14,
                border: isActive ? '1px solid #7C3AED' : '1px solid var(--border, #E2E8F0)',
                cursor: 'pointer',
                background: isActive
                  ? 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)'
                  : 'var(--bg-soft, #FFFFFF)',
                color: isActive ? '#FFFFFF' : 'var(--text-mid, #475569)',
                fontFamily: 'Sora, sans-serif',
                fontWeight: isActive ? 700 : 600,
                fontSize: 12.5,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                transition: 'all 0.18s ease',
                boxShadow: isActive
                  ? '0 4px 14px rgba(124, 58, 237, 0.25)'
                  : '0 1px 3px rgba(0, 0, 0, 0.03)'
              }}
            >
              {Icon && <Icon size={14} strokeWidth={2.2} className="shrink-0" />}
              <span className="truncate">{t.label}</span>
              <ArrowUpRight size={12} style={{ opacity: isActive ? 0.95 : 0.5, flexShrink: 0 }} />
            </button>
          )
        })}
      </motion.div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 900px) {
          .jobs-sub-nav-tabs {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 580px) {
          .jobs-sub-nav-tabs {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
      `}</style>
    </div>
  )
}
