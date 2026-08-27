import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Compass, BrainCircuit, Target } from 'lucide-react'

/**
 * CoursesHero Component
 * Exact replica of SkillsHero styling, curved floating card layout, 3D illustration, snapshot panel, and full-width tab bar.
 */
export default function CoursesHero({
  currentFocus = '',
  careerGoal = '',
  onExplore,
  onTakeAssessment,
  activeTab = 'explore',
  setActiveTab,
  tabs = []
}) {
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
    } else if (setActiveTab) {
      setActiveTab('explore')
      const targetEl = document.getElementById('courses-content-section')
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleAssessmentClick = () => {
    if (onTakeAssessment) {
      onTakeAssessment()
    } else if (setActiveTab) {
      setActiveTab('roadmap')
      const targetEl = document.getElementById('courses-content-section')
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <div className="container" style={{ padding: '24px 24px 0', margin: '0 auto' }}>
      {/* Curved Banner Card matching SkillsHero / Dashboard styling */}
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
        className="courses-hero-card"
      >
        {/* Soft background ambient blur circle */}
        <div
          style={{
            position: 'absolute',
            top: '-30%',
            right: '20%',
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.18) 0%, rgba(124, 58, 237, 0) 70%)',
            filter: 'blur(32px)',
            pointerEvents: 'none'
          }}
        />

        {/* LEFT COLUMN */}
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
            <span>COURSES HUB</span>
          </div>

          {/* Title - Matched to Skills Header Scale */}
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
            Courses Hub
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
            Master industry-ready course specializations through structured video modules, hands-on labs, AI guidance, and personalized progress tracking.
          </p>

          {/* Two CTA Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.02, translateY: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExploreClick}
              style={{
                height: 40,
                padding: '0 20px',
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
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)'
              }}
            >
              <Compass size={16} strokeWidth={2.4} />
              <span>Explore Courses</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, translateY: -1, background: 'rgba(255, 255, 255, 0.22)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAssessmentClick}
              style={{
                height: 40,
                padding: '0 20px',
                borderRadius: 12,
                background: 'rgba(255, 255, 255, 0.14)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.28)',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 600,
                fontSize: 13.5,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7
              }}
            >
              <BrainCircuit size={16} strokeWidth={2.2} />
              <span>AI Recommendations</span>
            </motion.button>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Standardized Courses Snapshot Panel */}
        <motion.div
          variants={itemVariants}
          style={{
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            position: 'relative'
          }}
          className="courses-hero-right"
        >
          {/* Glassmorphic Courses Snapshot Card */}
          <motion.div
            whileHover={{ translateY: -3, scale: 1.02 }}
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
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: 'rgba(255, 255, 255, 0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={13} style={{ color: '#FDE047' }} />
                <span>Course Track</span>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(255,255,255,0.2)', padding: '2px 7px', borderRadius: 10 }}>
                Live
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <div style={{ fontSize: 10.5, color: 'rgba(255, 255, 255, 0.75)', fontWeight: 600 }}>Active Subject</div>
                <div
                  style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#FDE047',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginTop: 2
                  }}
                >
                  ⚡ {currentFocus && currentFocus.trim().length > 0 ? currentFocus : 'No Subject Set'}
                </div>
              </div>

              <div style={{ paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.18)' }}>
                <div style={{ fontSize: 10.5, color: 'rgba(255, 255, 255, 0.75)', fontWeight: 600 }}>Career Track</div>
                <div
                  style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginTop: 2
                  }}
                >
                  <Target size={13} style={{ color: '#C084FC', flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{careerGoal && careerGoal.trim().length > 0 ? careerGoal : 'Set Career Goal'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Navigation Tabs Bar under the Curved Card */}
      {tabs.length > 0 && (
        <div
          className="courses-nav-tabs"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
            gap: 10,
            marginTop: 24,
            width: '100%'
          }}
        >
          {tabs.map((t) => {
            const isActive = activeTab === t.id
            const Icon = t.Icon
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab && setActiveTab(t.id)}
                style={{
                  height: 42,
                  padding: '0 16px',
                  borderRadius: 12,
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
                  justifyContent: 'center',
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
                {Icon && <Icon size={16} strokeWidth={2.2} />}
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Embedded Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .courses-hero-card {
            padding: 24px 20px !important;
          }
          .courses-hero-right {
            width: 100%;
            justify-content: space-between;
            margin-top: 12px;
          }
        }
        @media (max-width: 640px) {
          .courses-nav-tabs {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  )
}
