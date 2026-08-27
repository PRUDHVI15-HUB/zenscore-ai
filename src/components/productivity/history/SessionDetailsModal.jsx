import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Award, Clock, Calendar, Layers, Target, CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react'
import { formatDateStr, formatTimeStr } from '../../../services/productivity/sessionHistoryService'

export default function SessionDetailsModal({ session, onClose, onDeleteClick }) {
  if (!session) return null

  const {
    topic,
    category,
    goal,
    plannedMinutes,
    actualMinutes,
    startTime,
    endTime,
    completed,
    xpEarned
  } = session

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#FFFFFF',
            borderRadius: 24,
            padding: '32px',
            maxWidth: 520,
            width: '100%',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
            position: 'relative',
            border: '1px solid #E2E8F0'
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              background: '#F1F5F9',
              border: 'none',
              borderRadius: 12,
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748B'
            }}
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: 20,
                background: '#F3E8FF',
                color: '#7C3AED',
                fontSize: 12,
                fontWeight: 700,
                fontFamily: 'Sora, sans-serif'
              }}
            >
              {category || 'Module'}
            </span>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: 20,
                background: completed ? '#F0FDF4' : '#FEF2F2',
                color: completed ? '#166534' : '#DC2626',
                fontSize: 12,
                fontWeight: 700,
                fontFamily: 'Sora, sans-serif'
              }}
            >
              {completed ? 'Completed' : 'Incomplete'}
            </span>
          </div>

          <h3
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: 22,
              fontWeight: 800,
              color: '#0F172A',
              marginBottom: 16,
              lineHeight: 1.3
            }}
          >
            {topic}
          </h3>

          {/* XP Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
              borderRadius: 16,
              padding: '16px 20px',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 24
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', opacity: 0.9 }}>
                XP Earned
              </div>
              <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 800, marginTop: 2 }}>
                +{xpEarned || actualMinutes || 0} XP
              </div>
            </div>
            <Award size={28} style={{ color: '#FDE047' }} />
          </div>

          {/* Details Grid */}
          <div
            style={{
              background: '#F8FAFC',
              borderRadius: 16,
              padding: 20,
              border: '1px solid #E2E8F0',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              marginBottom: 24,
              textAlign: 'left'
            }}
          >
            <div>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Date</div>
              <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 700, color: '#0F172A', marginTop: 2 }}>
                {formatDateStr(startTime || session.date)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Time Window</div>
              <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 700, color: '#0F172A', marginTop: 2 }}>
                {formatTimeStr(startTime)} – {formatTimeStr(endTime)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Planned Duration</div>
              <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 700, color: '#0F172A', marginTop: 2 }}>
                {plannedMinutes} Mins
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Actual Duration</div>
              <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 700, color: '#059669', marginTop: 2 }}>
                {actualMinutes} Mins
              </div>
            </div>

            {goal && (
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Goal</div>
                <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 13.5, fontWeight: 700, color: '#334155', marginTop: 2 }}>
                  {goal}
                </div>
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            {onDeleteClick && (
              <button
                onClick={() => onDeleteClick(session)}
                style={{
                  height: 42,
                  padding: '0 18px',
                  borderRadius: 12,
                  background: '#FEF2F2',
                  color: '#DC2626',
                  border: '1px solid #FCA5A5',
                  cursor: 'pointer',
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: 700,
                  fontSize: 13,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Trash2 size={16} />
                <span>Delete Session</span>
              </button>
            )}

            <button
              onClick={onClose}
              style={{
                height: 42,
                padding: '0 24px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 700,
                fontSize: 13.5
              }}
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
