import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Sparkles, Award, Clock, Layers, Target, Save, ArrowRight } from 'lucide-react'
import { calculateXP, createSessionObject, completeAndSaveSession } from '../../services/productivity/focusSessionService'

export default function FocusCompletionCard({ completedData, onSessionSaved }) {
  const {
    topic,
    category,
    goal,
    plannedMinutes,
    actualMinutes,
    startTime,
    endTime,
    completed,
    paused
  } = completedData

  const xpEarned = calculateXP(actualMinutes)
  const formattedEndTime = new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const handleSave = () => {
    const sessionObj = createSessionObject({
      topic,
      category,
      goal,
      plannedMinutes,
      actualMinutes,
      startTime,
      endTime,
      completed,
      paused
    })

    const result = completeAndSaveSession(sessionObj)
    if (onSessionSaved) {
      onSessionSaved(result)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: '#FFFFFF',
        borderRadius: 24,
        padding: '36px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 12px 36px rgba(15, 23, 42, 0.06)',
        maxWidth: 640,
        margin: '0 auto',
        textAlign: 'center'
      }}
    >
      {/* Success Badge Banner */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 20,
          background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          margin: '0 auto 20px',
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
        }}
      >
        <CheckCircle2 size={36} strokeWidth={2.5} />
      </div>

      <h2
        style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: 26,
          fontWeight: 800,
          color: '#0F172A',
          marginBottom: 6
        }}
      >
        Session Completed! 🎉
      </h2>

      <p style={{ fontSize: 14, color: '#64748B', marginBottom: 28, fontFamily: 'DM Sans, sans-serif' }}>
        Awesome work staying focused! Review your session summary below and save your progress.
      </p>

      {/* XP Highlight Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
          borderRadius: 18,
          padding: '20px',
          color: '#FFFFFF',
          marginBottom: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 8px 20px rgba(124, 58, 237, 0.25)'
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>
            XP Earned
          </div>
          <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 32, fontWeight: 800 }}>
            +{xpEarned} XP
          </div>
        </div>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Award size={26} style={{ color: '#FDE047' }} />
        </div>
      </div>

      {/* Details Grid */}
      <div
        style={{
          background: '#F8FAFC',
          borderRadius: 18,
          padding: '20px',
          border: '1px solid #E2E8F0',
          marginBottom: 28,
          textAlign: 'left',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16
        }}
      >
        <div>
          <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Topic</div>
          <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 700, color: '#0F172A', marginTop: 2 }}>
            {topic}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Module Category</div>
          <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 700, color: '#7C3AED', marginTop: 2 }}>
            {category}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Planned Duration</div>
          <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 700, color: '#0F172A', marginTop: 2 }}>
            {plannedMinutes} Mins
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Actual Duration</div>
          <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 700, color: '#059669', marginTop: 2 }}>
            {actualMinutes} Mins
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Completion Time</div>
          <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 700, color: '#0F172A', marginTop: 2 }}>
            {formattedEndTime}
          </div>
        </div>

        {goal && (
          <div>
            <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Goal</div>
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 700, color: '#475569', marginTop: 2 }}>
              {goal}
            </div>
          </div>
        )}
      </div>

      {/* Save Primary Button */}
      <motion.button
        whileHover={{ scale: 1.02, translateY: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        style={{
          height: 48,
          width: '100%',
          borderRadius: 14,
          background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
          color: '#FFFFFF',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'Sora, sans-serif',
          fontWeight: 800,
          fontSize: 15,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          boxShadow: '0 6px 20px rgba(16, 185, 129, 0.3)'
        }}
      >
        <Save size={18} />
        <span>Save Session</span>
      </motion.button>
    </motion.div>
  )
}
