import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ArrowLeft, Upload, FileText } from 'lucide-react'
import { useStudentProfile } from '../../../context/StudentProfileContext'
import { useCareer } from '../../../context/CareerContext'
import { resolveCanonicalCareerGoal } from '../../../services/careers/careerNormalizer'

export default function ResumeHero({ currentFocus = '' }) {
  const navigate = useNavigate()
  const studentProfileCtx = useStudentProfile()
  const career = useCareer()

  const activeFocus = resolveCanonicalCareerGoal(studentProfileCtx?.profile, career, currentFocus)

  return (
    <div className="container" style={{ margin: '0 auto', padding: '24px 24px 0' }}>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
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
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 720 }}>
          {/* Top Row: Back Button & Portal Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ x: -3, background: 'rgba(255, 255, 255, 0.28)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/careers')}
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
              <span>Back to Careers Portal</span>
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
              <span>ZENCORE AI RESUME CENTER</span>
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
            📄 Resume Center & ATS Workspace
          </h1>

          <p style={{
            fontSize: 14.5,
            lineHeight: 1.6,
            color: 'rgba(255, 255, 255, 0.9)',
            margin: '0 0 24px',
            maxWidth: 600
          }}>
            Build a professional resume, evaluate your ATS readability score, and optimize section formatting for {currentFocus}.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
