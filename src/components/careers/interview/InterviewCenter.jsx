import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCareer } from '../../../context/CareerContext'
import { useStudentProfile } from '../../../context/StudentProfileContext'
import { resolveCanonicalCareerGoal } from '../../../services/careers/careerNormalizer'
import { getSynchronizedInterviewState } from '../../../services/interview/interviewSyncService'
import { getInterviewAnalytics, saveInterviewAnalytics } from '../../../services/interview/interviewAnalytics'
import { getAIMockInterview } from '../../../services/ai/mockInterviewService'
import { generatePlacementReport } from '../../../services/interview/interviewReportService'
import { generateInterviewCertificate } from '../../../services/interview/interviewCertificateService'
import InterviewPrepModule from './InterviewPrepModule'
import {
  Mic,
  Target,
  Award,
  Zap,
  Code,
  UserCheck,
  Brain,
  Building2,
  Play,
  Clock,
  CheckCircle2,
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  ChevronRight
} from 'lucide-react'

export default function InterviewCenter({ selectedRole = '', onSelectCareerRole }) {
  const career = useCareer()
  const studentProfileCtx = useStudentProfile()
  const activeTargetRole = resolveCanonicalCareerGoal(studentProfileCtx?.profile, career, selectedRole)

  // View state: 'center' (Overview Hub) vs 'active_module' (Live Simulator)
  const [viewMode, setViewMode] = useState('center') // 'center' | 'active_module'
  const [activeCategory, setActiveCategory] = useState('technical')
  const [difficulty, setDifficulty] = useState('Medium')
  const [selectedCompany, setSelectedCompany] = useState('Amazon')
  const [selectedReport, setSelectedReport] = useState(null)
  const [activeCert, setActiveCert] = useState(null)
  const [toastMsg, setToastMsg] = useState('')

  // Sync analytics & state
  const [analytics, setAnalytics] = useState(() => getInterviewAnalytics())
  const interviewState = getSynchronizedInterviewState(career)

  const historyList = useMemo(() => {
    return analytics?.sessionHistory || []
  }, [analytics])

  const totalCompleted = analytics?.totalSessionsCompleted || historyList.length
  const avgScore = analytics?.averageScore || (historyList.length > 0 ? Math.round(historyList.reduce((acc, h) => acc + (h.score || 0), 0) / historyList.length) : 0)

  const readinessPct = useMemo(() => {
    if (totalCompleted > 0) {
      return Math.min(100, Math.round((avgScore * 0.7) + (Math.min(totalCompleted, 10) * 3)))
    }
    return interviewState?.metrics?.overallReadiness || 0
  }, [totalCompleted, avgScore, interviewState])

  const currentStreak = analytics?.currentStreak || (totalCompleted > 0 ? 1 : 0)

  const triggerToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3500)
  }

  // AI Feedback Insights (Role-aware & Dynamic)
  const aiFeedbackInsights = useMemo(() => {
    if (historyList.length === 0) {
      return [
        { id: 1, text: `Complete your first AI mock interview round to unlock targeted feedback for ${activeTargetRole}.`, type: 'action' },
        { id: 2, text: `Practice STAR framework responses to structure technical and behavioral answers effectively.`, type: 'action' },
        { id: 3, text: `Select a practice domain (Technical, HR, Aptitude, or Company-specific) to start practicing.`, type: 'action' },
      ]
    }
    return [
      { id: 1, text: `Communication clarity is tracked across ${totalCompleted} evaluated ${activeTargetRole} round(s).`, type: 'positive' },
      { id: 2, text: `Average technical score: ${avgScore}% across recent mock interview attempts.`, type: 'positive' },
      { id: 3, text: `Focus on explaining system architecture trade-offs using the STAR framework.`, type: 'action' },
      { id: 4, text: `Continue practicing to improve your placement readiness index for ${activeTargetRole}.`, type: 'action' }
    ]
  }, [activeTargetRole, historyList, totalCompleted, avgScore])

  // Companies for Section 3
  const targetCompanies = ['Amazon', 'Google', 'Microsoft', 'Infosys', 'TCS', 'Accenture']

  const handleStartInterview = (category = 'technical', company = 'Amazon') => {
    setActiveCategory(category)
    setSelectedCompany(company)
    setViewMode('active_module')
    triggerToast(`🚀 Launched AI Interview Session for ${company}!`)
  }

  const handleViewReport = (item) => {
    setSelectedReport(item)
  }

  // If in active interview module mode, render the preserved InterviewPrepModule wrapped in a clean header
  if (viewMode === 'active_module') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#FFFFFF', borderRadius: 18, border: '1px solid #E2E8F0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <button
            onClick={() => setViewMode('center')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 12,
              background: '#F1F5F9',
              color: '#0F172A',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Sora, sans-serif',
              fontWeight: 700,
              fontSize: 13
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Interview Center</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: '#7C3AED', fontFamily: 'Sora, sans-serif' }}>
            <Sparkles size={16} />
            <span>Active AI Practice Workspace · {selectedCompany}</span>
          </div>
        </div>

        <InterviewPrepModule selectedRole={activeTargetRole} onSelectCareerRole={onSelectCareerRole} />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 1140, margin: '0 auto', paddingBottom: 64, color: '#0F172A' }}>

      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          background: '#0F172A', color: '#FFFFFF', padding: '14px 20px', borderRadius: 16,
          boxShadow: '0 12px 32px rgba(0,0,0,0.25)', fontFamily: 'Sora, sans-serif', fontSize: 13.5, fontWeight: 700,
        }}>
          {toastMsg}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* SECTION 1: HEADER BANNER                                   */}
      {/* ────────────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 50%, #EC4899 100%)',
        borderRadius: 24,
        padding: '36px 40px',
        boxShadow: '0 12px 36px rgba(109, 40, 217, 0.18)',
        position: 'relative',
        overflow: 'hidden',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
        flexWrap: 'wrap'
      }}>
        {/* Ambient glow circle */}
        <div style={{
          position: 'absolute',
          top: '-40%',
          right: '15%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(124, 58, 237, 0) 70%)',
          filter: 'blur(36px)',
          pointerEvents: 'none'
        }} />

        <div style={{ zIndex: 2, flex: '1 1 420px', maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
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
          }}>
            <Sparkles size={13} style={{ color: '#FDE047' }} />
            <span>PLACEMENT READINESS HUB</span>
          </div>

          <h1 style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: 'clamp(24px, 3.5vw, 32px)',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            margin: 0,
            lineHeight: 1.2
          }}>
            🎤 Interview Center
          </h1>

          <p style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 14.5,
            lineHeight: 1.6,
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0
          }}>
            Prepare confidently for your next placement interview with AI-evaluated mock rounds, technical challenges, and personalized feedback.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 6 }}>
            <button
              onClick={() => handleStartInterview('technical', selectedCompany)}
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
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
              }}
            >
              <Play size={16} fill="#6D28D9" />
              <span>Start Mock Interview</span>
            </button>

            <button
              onClick={() => {
                const practiceSection = document.getElementById('practice-categories-section')
                if (practiceSection) practiceSection.scrollIntoView({ behavior: 'smooth' })
              }}
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
                gap: 8
              }}
            >
              <Code size={16} />
              <span>Practice Questions</span>
            </button>
          </div>
        </div>

        {/* Right Badge Card */}
        <div style={{ zIndex: 2, background: 'rgba(255, 255, 255, 0.16)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.28)', borderRadius: 20, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 6, minWidth: 220 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255, 255, 255, 0.8)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Target Role Match</span>
          <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#FDE047' }}>⚡ {activeTargetRole}</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', marginTop: 4 }}>Placement Readiness: <strong style={{ color: '#FFFFFF' }}>{readinessPct}%</strong></span>
        </div>
      </section>


      {/* ────────────────────────────────────────────────────────── */}
      {/* SECTION 2: INTERVIEW READINESS (4 SUMMARY CARDS)            */}
      {/* ────────────────────────────────────────────────────────── */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {/* Card 1: Overall Readiness */}
        <motion.div
          whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)' }}
          style={{
            background: '#FFFFFF',
            borderRadius: 18,
            padding: '18px 20px',
            border: '1px solid #DDD6FE',
            boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: 16
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Target size={22} style={{ color: '#7C3AED' }} strokeWidth={2.2} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748B', fontFamily: 'DM Sans, sans-serif' }}>Overall Readiness</span>
            <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>{readinessPct}%</span>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: '#7C3AED', fontFamily: 'DM Sans, sans-serif', marginTop: 1 }}>Target Placement Match</span>
          </div>
        </motion.div>

        {/* Card 2: Mock Interviews Completed */}
        <motion.div
          whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)' }}
          style={{
            background: '#FFFFFF',
            borderRadius: 18,
            padding: '18px 20px',
            border: '1px solid #BFDBFE',
            boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: 16
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Mic size={22} style={{ color: '#2563EB' }} strokeWidth={2.2} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748B', fontFamily: 'DM Sans, sans-serif' }}>Mock Interviews Completed</span>
            <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>{totalCompleted}</span>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: '#2563EB', fontFamily: 'DM Sans, sans-serif', marginTop: 1 }}>Evaluated Rounds</span>
          </div>
        </motion.div>

        {/* Card 3: Average Interview Score */}
        <motion.div
          whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)' }}
          style={{
            background: '#FFFFFF',
            borderRadius: 18,
            padding: '18px 20px',
            border: '1px solid #BBF7D0',
            boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: 16
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Award size={22} style={{ color: '#059669' }} strokeWidth={2.2} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748B', fontFamily: 'DM Sans, sans-serif' }}>Average Interview Score</span>
            <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>{avgScore}%</span>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: '#059669', fontFamily: 'DM Sans, sans-serif', marginTop: 1 }}>Technical & HR Rating</span>
          </div>
        </motion.div>

        {/* Card 4: Current Streak */}
        <motion.div
          whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)' }}
          style={{
            background: '#FFFFFF',
            borderRadius: 18,
            padding: '18px 20px',
            border: '1px solid #FDE68A',
            boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: 16
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Zap size={22} style={{ color: '#D97706' }} strokeWidth={2.2} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748B', fontFamily: 'DM Sans, sans-serif' }}>Current Streak</span>
            <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>{currentStreak} Days</span>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: '#D97706', fontFamily: 'DM Sans, sans-serif', marginTop: 1 }}>Active Daily Practice</span>
          </div>
        </motion.div>
      </section>


      {/* ────────────────────────────────────────────────────────── */}
      {/* SECTION 3: PRACTICE CATEGORIES (4 CLEAN CARDS)             */}
      {/* ────────────────────────────────────────────────────────── */}
      <section id="practice-categories-section" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.05em', color: '#7C3AED', textTransform: 'uppercase' }}>
            Curated Practice Paths
          </span>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Practice Categories
          </h2>
          <p style={{ fontSize: 13.5, color: '#64748B', margin: 0 }}>
            Choose a targeted domain to start your AI-evaluated placement practice.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
          {/* Card 1: Technical Interview */}
          <motion.div
            whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(124, 58, 237, 0.1)' }}
            onClick={() => handleStartInterview('technical', selectedCompany)}
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: 24,
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 16,
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Code size={24} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 17, fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>
                  💻 Technical Interview
                </h3>
                <p style={{ fontSize: 13, color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                  Practice programming, data structures, algorithm challenges, and core CS subjects.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 8, borderTop: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#7C3AED', fontFamily: 'Sora, sans-serif' }}>Start Technical →</span>
              <ChevronRight size={16} style={{ color: '#7C3AED' }} />
            </div>
          </motion.div>

          {/* Card 2: HR Interview */}
          <motion.div
            whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(37, 99, 235, 0.1)' }}
            onClick={() => handleStartInterview('hr', selectedCompany)}
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: 24,
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 16,
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCheck size={24} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 17, fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>
                  👔 HR Interview
                </h3>
                <p style={{ fontSize: 13, color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                  Master behavioral, situational, leadership, and communication STAR questions.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 8, borderTop: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#2563EB', fontFamily: 'Sora, sans-serif' }}>Start HR Round →</span>
              <ChevronRight size={16} style={{ color: '#2563EB' }} />
            </div>
          </motion.div>

          {/* Card 3: Aptitude */}
          <motion.div
            whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(5, 150, 105, 0.1)' }}
            onClick={() => handleStartInterview('aptitude', selectedCompany)}
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: 24,
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 16,
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: '#F0FDF4', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={24} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 17, fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>
                  🧠 Aptitude
                </h3>
                <p style={{ fontSize: 13, color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                  Sharpen logical reasoning, quantitative aptitude, verbal ability, and data interpretation.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 8, borderTop: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#059669', fontFamily: 'Sora, sans-serif' }}>Start Aptitude →</span>
              <ChevronRight size={16} style={{ color: '#059669' }} />
            </div>
          </motion.div>

          {/* Card 4: Company Specific */}
          <motion.div
            whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(217, 119, 6, 0.1)' }}
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: 24,
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 16
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={24} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 17, fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>
                  🏢 Company Specific
                </h3>
                <p style={{ fontSize: 12.5, color: '#64748B', margin: '0 0 10px', lineHeight: 1.4 }}>
                  Prepare for target company hiring bars:
                </p>

                {/* Company Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {targetCompanies.map(c => (
                    <button
                      key={c}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStartInterview('company', c)
                      }}
                      style={{
                        padding: '3px 10px',
                        borderRadius: 8,
                        background: selectedCompany === c ? '#D97706' : '#FEF3C7',
                        color: selectedCompany === c ? '#FFFFFF' : '#B45309',
                        border: 'none',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily: 'Sora, sans-serif'
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleStartInterview('company', selectedCompany)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 10,
                background: '#FDF6B2',
                color: '#894B0E',
                border: 'none',
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: 'Sora, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <span>Explore {selectedCompany} Hub</span>
              <ChevronRight size={14} />
            </button>
          </motion.div>
        </div>
      </section>


      {/* ────────────────────────────────────────────────────────── */}
      {/* SECTION 4: MOCK INTERVIEW LAUNCH CARD                      */}
      {/* ────────────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #F5F3FF 0%, #EFF6FF 100%)',
        borderRadius: 24,
        border: '1px solid #DDD6FE',
        padding: 32,
        boxShadow: '0 8px 30px rgba(124, 58, 237, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.05em', color: '#7C3AED', textTransform: 'uppercase' }}>
              AI Powered Simulation
            </span>
            <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Ready for a Mock Interview?
            </h3>
            <p style={{ fontSize: 13.5, color: '#64748B', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={15} style={{ color: '#7C3AED' }} />
              Estimated Duration: <strong style={{ color: '#0F172A' }}>15–30 Minutes</strong>
            </p>
          </div>

          {/* Difficulty Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FFFFFF', padding: '6px 12px', borderRadius: 14, border: '1px solid #DDD6FE' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B', fontFamily: 'Sora, sans-serif' }}>Difficulty:</span>
            {['Easy', 'Medium', 'Hard'].map(diff => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 8,
                  background: difficulty === diff ? '#7C3AED' : 'transparent',
                  color: difficulty === diff ? '#FFFFFF' : '#475569',
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Sora, sans-serif',
                  transition: 'all 0.2s'
                }}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <button
            onClick={() => handleStartInterview('technical', selectedCompany)}
            style={{
              height: 44,
              padding: '0 26px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Sora, sans-serif',
              fontWeight: 800,
              fontSize: 14,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 16px rgba(124, 58, 237, 0.25)'
            }}
          >
            <Play size={16} fill="#FFFFFF" />
            <span>Start AI Interview</span>
          </button>

          <button
            onClick={() => handleStartInterview('technical', selectedCompany)}
            style={{
              height: 44,
              padding: '0 22px',
              borderRadius: 14,
              background: '#FFFFFF',
              color: '#475569',
              border: '1px solid #CBD5E1',
              cursor: 'pointer',
              fontFamily: 'Sora, sans-serif',
              fontWeight: 700,
              fontSize: 13.5,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <Clock size={16} />
            <span>Resume Previous</span>
          </button>
        </div>
      </section>


      {/* ────────────────────────────────────────────────────────── */}
      {/* SECTION 5: INTERVIEW HISTORY                               */}
      {/* ────────────────────────────────────────────────────────── */}
      <section style={{
        background: '#FFFFFF',
        borderRadius: 24,
        border: '1px solid #E2E8F0',
        padding: 28,
        boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.05em', color: '#64748B', textTransform: 'uppercase' }}>
              Evaluation Log
            </span>
            <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Interview History
            </h2>
          </div>

          <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B', fontFamily: 'DM Sans, sans-serif' }}>
            {historyList.length} Sessions Logged
          </span>
        </div>

        {/* History Table / Records */}
        {historyList.length === 0 ? (
          /* EMPTY STATE */
          <div style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
              🎤
            </div>
            <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
              🎤 No Mock Interviews Yet
            </h3>
            <p style={{ fontSize: 13.5, color: '#64748B', maxWidth: 420, margin: 0 }}>
              Start your first AI-powered mock interview to evaluate your placement readiness.
            </p>
            <button
              onClick={() => handleStartInterview('technical', selectedCompany)}
              style={{
                marginTop: 8,
                padding: '10px 22px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
                color: '#FFFFFF',
                border: 'none',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 800,
                fontSize: 13.5,
                cursor: 'pointer'
              }}
            >
              Start Interview
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {historyList.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '16px 20px',
                  borderRadius: 16,
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    🏢
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 800, color: '#0F172A' }}>
                      {item.company || 'Enterprise'} · {item.interviewType || item.topic || 'Technical Round'}
                    </span>
                    <span style={{ fontSize: 12, color: '#64748B' }}>
                      Date: {item.date || 'Recent'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#2563EB' }}>
                      {item.score || 84}%
                    </span>
                    <span style={{
                      fontSize: 10.5,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 6,
                      background: item.statusBg || '#ECFDF5',
                      color: item.statusColor || '#047857'
                    }}>
                      {item.status || 'Passed'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleViewReport(item)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 10,
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      color: '#475569',
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: 'Sora, sans-serif',
                      cursor: 'pointer'
                    }}
                  >
                    View Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>


      {/* ────────────────────────────────────────────────────────── */}
      {/* SECTION 6: AI FEEDBACK                                     */}
      {/* ────────────────────────────────────────────────────────── */}
      <section style={{
        background: '#FFFFFF',
        borderRadius: 24,
        border: '1px solid #E2E8F0',
        padding: 28,
        boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={18} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
              AI Personalized Feedback & Insights
            </h2>
            <span style={{ fontSize: 12, color: '#64748B' }}>
              Real-time AI mentor recommendations based on your performance
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          {aiFeedbackInsights.map((fb) => (
            <div
              key={fb.id}
              style={{
                padding: '14px 16px',
                borderRadius: 14,
                background: fb.type === 'positive' ? '#F0FDF4' : '#EFF6FF',
                border: fb.type === 'positive' ? '1px solid #BBF7D0' : '1px solid #BFDBFE',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10
              }}
            >
              <CheckCircle2 size={18} style={{ color: fb.type === 'positive' ? '#059669' : '#2563EB', flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontSize: 13, color: '#0F172A', lineHeight: 1.5, fontFamily: 'DM Sans, sans-serif' }}>
                {fb.text}
              </span>
            </div>
          ))}
        </div>
      </section>


      {/* ────────────────────────────────────────────────────────── */}
      {/* REPORT MODAL (When clicking "View Report")                 */}
      {/* ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedReport && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
          }}>
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              style={{
                background: '#FFFFFF', borderRadius: 24, padding: 32, maxWidth: 540, width: '100%',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 20, position: 'relative'
              }}
            >
              <button
                onClick={() => setSelectedReport(null)}
                style={{ position: 'absolute', top: 20, right: 20, background: '#F1F5F9', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={22} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, margin: 0 }}>
                    {selectedReport.company || 'Enterprise'} Interview Report
                  </h3>
                  <span style={{ fontSize: 12, color: '#64748B' }}>{selectedReport.interviewType} · {selectedReport.date}</span>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 16, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: 12, color: '#64748B' }}>Overall Score</span>
                  <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 800, color: '#7C3AED' }}>{selectedReport.score || 86}%</div>
                </div>
                <span style={{ padding: '6px 14px', borderRadius: 8, background: '#ECFDF5', color: '#047857', fontSize: 12, fontWeight: 800 }}>
                  {selectedReport.status || 'Passed'}
                </span>
              </div>

              <div>
                <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 800, margin: '0 0 6px' }}>Mentor Summary & Feedback</h4>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, margin: 0, background: '#F5F3FF', padding: 12, borderRadius: 12, border: '1px solid #DDD6FE' }}>
                  "{selectedReport.feedback || 'Demonstrated strong core technical knowledge, clean coding structure, and confident verbal delivery.'}"
                </p>
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                style={{
                  width: '100%', padding: '12px', borderRadius: 14, background: '#7C3AED', color: '#FFFFFF', border: 'none',
                  fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 14, cursor: 'pointer'
                }}
              >
                Close Report
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
