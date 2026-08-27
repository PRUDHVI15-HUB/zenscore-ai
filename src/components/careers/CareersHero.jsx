import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Target, LayoutDashboard, Map, FileText, Briefcase, Mic, Compass, ArrowRight, Sparkles, ArrowUpRight, Loader2 } from 'lucide-react'
import { useStudentProfile } from '../../context/StudentProfileContext'
import { useCareer } from '../../context/CareerContext'
import { resolveContinueLearningDestination } from '../../services/learning/continueLearningResolver'
import { resolveCareerAwareJobFilters, buildCareerAwareJobUrl } from '../../services/jobs/careerAwareJobResolver'
import ChangeCareerRoleModal from './ChangeCareerRoleModal'

/**
 * CareersHero Component (Standardized to Jobs portal main hero layout)
 * Features top glassmorphism pill badge, Sora title, DM Sans subtitle, dual action CTAs, target role card, and 5 diagonal-arrow sub-nav cards.
 */
export default function CareersHero({
  currentFocus = '',
  onExploreRole,
  activeTab = 'overview',
  setActiveTab
}) {
  const navigate = useNavigate()
  const studentProfileCtx = useStudentProfile()
  const career = useCareer()
  const [isNavigating, setIsNavigating] = useState(false)
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false)

  const handleContinueLearning = async () => {
    if (isNavigating) return
    setIsNavigating(true)
    try {
      const dest = await resolveContinueLearningDestination(studentProfileCtx?.profile, career)
      if (dest?.path) {
        navigate(dest.path)
      } else if (setActiveTab) {
        setActiveTab('learning')
      }
    } catch {
      if (setActiveTab) setActiveTab('learning')
    } finally {
      setIsNavigating(false)
    }
  }

  const handleExploreJobs = () => {
    if (setActiveTab) {
      setActiveTab('jobs')
    } else {
      navigate('/careers/jobs')
    }
  }
  const primaryTabs = [
    { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
    { id: 'learning', label: 'Learning', Icon: Map },
    { id: 'resume', label: 'Resume', Icon: FileText },
    { id: 'jobs', label: 'Jobs', Icon: Briefcase }
  ]

  // Map legacy tab IDs to Phase 1 primary 5 tabs for active tab highlight
  const getNormalizedActiveTab = (tabId) => {
    if (tabId === 'dashboard' || tabId === 'overview') return 'overview'
    if (tabId === 'roadmap' || tabId === 'skillgap' || tabId === 'learning') return 'learning'
    if (tabId === 'resume') return 'resume'
    if (tabId === 'jobs' || tabId === 'paths' || tabId === 'companies' || tabId === 'internships' || tabId === 'salary') return 'jobs'
    if (tabId === 'interview') return 'interview'
    return 'overview'
  }

  const normalizedTab = getNormalizedActiveTab(activeTab)

  return (
    <div className="container" style={{ padding: '24px 24px 0', margin: '0 auto' }}>
      {/* ── UNIFIED HERO BANNER ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
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
        className="careers-hero-card"
      >
        {/* Soft background ambient blur circle */}
        <div
          style={{
            position: 'absolute',
            top: '-30%',
            right: '15%',
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.18) 0%, rgba(124, 58, 237, 0) 70%)',
            filter: 'blur(32px)',
            pointerEvents: 'none'
          }}
        />

        {/* LEFT COLUMN: Pill Badge, Title, Subtitle, & Action CTAs */}
        <div style={{ zIndex: 2, flex: '1 1 420px', maxWidth: 580, display: 'flex', flexDirection: 'column', gap: 12 }}>
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
              width: 'fit-content'
            }}
          >
            <Sparkles size={13} style={{ color: '#FDE047' }} />
            <span>CAREERS HUB</span>
          </div>

          <div>
            <h1
              style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: 'clamp(24px, 3vw, 32px)',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '-0.5px',
                marginBottom: 8,
                lineHeight: 1.2
              }}
            >
              💼 Careers Dashboard
            </h1>

            <p
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 14,
                lineHeight: 1.55,
                color: 'rgba(255, 255, 255, 0.9)',
                margin: 0
              }}
            >
              Track your target career role, learning progress, resume ATS match, and interview readiness in one focused space.
            </p>
          </div>

          {/* Action CTAs: Continue Learning & Explore Jobs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
            <button
              onClick={handleContinueLearning}
              disabled={isNavigating}
              style={{
                height: 42,
                padding: '0 22px',
                borderRadius: 12,
                background: '#FFFFFF',
                color: '#6D28D9',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 800,
                fontSize: 13.5,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.2s ease',
                opacity: isNavigating ? 0.7 : 1
              }}
            >
              {isNavigating ? <Loader2 size={15} className="animate-spin" /> : null}
              <span>{isNavigating ? 'Resuming...' : 'Continue Learning'}</span>
              {!isNavigating && <ArrowRight size={15} />}
            </button>

            <button
              onClick={handleExploreJobs}
              style={{
                height: 42,
                padding: '0 20px',
                borderRadius: 12,
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(8px)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                cursor: 'pointer',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 700,
                fontSize: 13.5,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s ease'
              }}
            >
              <Briefcase size={15} />
              <span>Explore Jobs</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Target Career Card */}
        <div style={{ zIndex: 2, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.16)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.28)',
              borderRadius: 18,
              padding: '16px 20px',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              width: 230
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: 'rgba(255, 255, 255, 0.8)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <Target size={13} style={{ color: '#FDE047' }} />
              <span>Target Career Role</span>
            </div>

            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#FDE047' }}>
              ⚡ {currentFocus || 'Not Selected'}
            </div>

            <button
              onClick={() => setIsChangeModalOpen(true)}
              style={{
                marginTop: 4,
                padding: '6px 12px',
                borderRadius: 10,
                background: '#FFFFFF',
                color: '#6D28D9',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 700,
                fontSize: 11.5,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Compass size={13} />
              <span>{currentFocus ? 'Change Target Role' : 'Select Target Role'}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Change Career Role Modal */}
      <ChangeCareerRoleModal
        isOpen={isChangeModalOpen}
        onClose={() => setIsChangeModalOpen(false)}
        currentRole={currentFocus}
        onRoleChanged={(newRole) => {
          if (onExploreRole) onExploreRole(newRole)
        }}
      />

      {/* ── STANDARDIZED 5-CARD NAVIGATION GRID WITH DIAGONAL ARROWS ↗ (Matching Jobs Portal) ── */}
      <div
        className="careers-nav-tabs"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
          gap: 10,
          marginTop: 24,
          width: '100%'
        }}
      >
        {primaryTabs.map(tab => {
          const isActive = normalizedTab === tab.id
          const Icon = tab.Icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                height: 48,
                padding: '0 16px',
                borderRadius: 14,
                border: isActive ? '1px solid #7C3AED' : '1px solid var(--border, #E2E8F0)',
                cursor: 'pointer',
                background: isActive
                  ? 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)'
                  : 'var(--bg-soft, #FFFFFF)',
                color: isActive ? '#FFFFFF' : 'var(--text-mid, #475569)',
                fontFamily: 'Sora, sans-serif',
                fontWeight: isActive ? 700 : 600,
                fontSize: 13.5,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
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
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Icon size={16} strokeWidth={2.2} />
                <span>{tab.label}</span>
              </div>
              <ArrowUpRight size={15} style={{ opacity: isActive ? 0.9 : 0.5, flexShrink: 0 }} />
            </button>
          )
        })}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .careers-nav-tabs {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  )
}
