import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Plus, FileUp, FileText, BookOpen, TrendingUp, Bot, ArrowUpRight, Award, Target, GraduationCap } from 'lucide-react'

/**
 * AcademicsHero Component
 * Exact replica of SkillsHero & CareersHero styling: curved floating card layout, 3D illustration, snapshot panel, and full-width tab bar.
 */
export default function AcademicsHero({
  currentCGPA = null,
  targetCGPA = null,
  predictedCGPA = null,
  healthScore = 92,
  onAddSemester,
  onImportTranscript,
  onUploadMemo,
  onOpenCopilot,
  activeTab = 'dashboard',
  setActiveTab,
  tabs = [
    { id: 'transcript', label: 'My Memos', Icon: FileText, route: '/academics/transcript' },
    { id: 'subjects', label: 'My Subjects', Icon: BookOpen, route: '/academics/subjects' },
    { id: 'performance', label: 'Performance', Icon: TrendingUp, route: '/academics/performance' },
    { id: 'ai', label: 'AI Academic Assistant', Icon: Bot, route: '/academics/ai' }
  ]
}) {
  const navigate = useNavigate()

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

  const handleTabClick = (tab) => {
    if (tab.route) {
      navigate(tab.route)
    } else if (setActiveTab) {
      setActiveTab(tab.id)
    }
  }

  return (
    <div id="academics-hero-banner" className="w-full" style={{ marginBottom: 8 }}>
      {/* Curved Banner Card matching SkillsHero / CareersHero styling */}
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
        className="academics-hero-card"
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
            <span>ACADEMICS HUB</span>
          </div>

          {/* Title - Matched to Skills/Careers Header Scale */}
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
            Academic Performance Center
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
            Track semester SGPAs, CGPA trajectory, attendance margins, and subject risk scores with AI performance metrics.
          </p>

          {/* Two CTA Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.02, translateY: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={onUploadMemo || onImportTranscript}
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
              <FileUp size={16} strokeWidth={2.4} />
              <span>Upload Memo</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, translateY: -1, background: 'rgba(255, 255, 255, 0.22)' }}
              whileTap={{ scale: 0.98 }}
              onClick={onAddSemester}
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
              <Plus size={16} strokeWidth={2.4} />
              <span>Add Semester</span>
            </motion.button>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Standardized Snapshot Panel */}
        <motion.div
          variants={itemVariants}
          style={{
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap'
          }}
        >
          {/* Glassmorphic Snapshot Card */}
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
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
            }}
          >
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'rgba(255, 255, 255, 0.85)',
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <Sparkles size={12} style={{ color: '#FDE047' }} />
              Academics Snapshot
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>Current CGPA</span>
                <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 800, color: '#FDE047' }}>
                  {currentCGPA != null ? Number(currentCGPA).toFixed(2) : '\u2014'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>Target CGPA</span>
                <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>
                  {targetCGPA != null ? Number(targetCGPA).toFixed(2) : '\u2014 Set'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>Predicted</span>
                <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 700, color: '#A7F3D0' }}>
                  {predictedCGPA != null ? Number(predictedCGPA).toFixed(2) : '\u2014'}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Navigation Tabs Bar under the Curved Card */}
      {tabs.length > 0 && (
        <div
          className="academics-nav-tabs"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
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
                  height: 42,
                  padding: '0 14px',
                  borderRadius: 12,
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
                  boxShadow: isActive ? '0 4px 12px rgba(124, 58, 237, 0.25)' : '0 1px 3px rgba(0, 0, 0, 0.02)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={15} strokeWidth={isActive ? 2.3 : 2} />
                <span>{t.label}</span>
                <ArrowUpRight size={14} style={{ opacity: isActive ? 0.95 : 0.65, marginLeft: 2, flexShrink: 0 }} />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
