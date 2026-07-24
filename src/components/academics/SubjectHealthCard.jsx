/**
 * SubjectHealthCard.jsx — Premium Subject Card Redesign (Phase 5)
 *
 * Subject details, status badge, mini progress metrics, and action callbacks.
 * All props/logic untouched.
 */
import React, { useState } from 'react'

const HEALTH_THEMES = {
  Excellent: {
    border:      '#A7F3D0',
    badgeBg:     '#ECFDF5',
    color:       '#059669',
    bar:         '#059669',
    accentBg:    '#059669',
  },
  Healthy: {
    border:      '#BFDBFE',
    badgeBg:     '#EFF6FF',
    color:       '#2563EB',
    bar:         '#2563EB',
    accentBg:    '#2563EB',
  },
  'Needs Work': {
    border:      '#FECDD3',
    badgeBg:     '#FFF1F2',
    color:       '#DC2626',
    bar:         '#DC2626',
    accentBg:    '#DC2626',
  },
}

export default function SubjectHealthCard({ subject, health = 'Healthy', onEdit, onDelete }) {
  const [hov, setHov] = useState(false)
  const theme = HEALTH_THEMES[health] || HEALTH_THEMES.Healthy
  const attProgress = Math.min(100, Math.max(0, subject.attendance || 0))

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff',
        borderRadius: 20,
        border: `1px solid ${hov ? '#C7D2FE' : '#E2E8F0'}`,
        boxShadow: hov ? '0 6px 18px rgba(15,23,42,0.06)' : '0 1px 3px rgba(15,23,42,0.02)',
        transform: hov ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.18s ease',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        minHeight: 180,
        cursor: 'default',
      }}
    >
      {/* Top section: Title, Badge and Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 12 }}>
          <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 800, color: '#1E293B', margin: 0, lineHeight: 1.4, flex: 1 }}>
            {subject.name}
          </h4>

          {/* Actions group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(subject)}
                style={{ width: 26, height: 26, borderRadius: 6, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 11 }}
                title="Edit Subject"
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(subject)}
                style={{ width: 26, height: 26, borderRadius: 6, background: '#FFF1F2', border: '1px solid #FECDD3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 11 }}
                title="Delete Subject"
              >
                🗑️
              </button>
            )}
          </div>
        </div>

        {/* Labels row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 9.5,
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 99,
            background: theme.badgeBg,
            color: theme.color,
            border: `1px solid ${theme.border}`,
            textTransform: 'uppercase',
            letterSpacing: '0.4px',
          }}>
            {health}
          </span>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {subject.credits} Credits
          </span>
        </div>

        {/* Last studied date */}
        {subject.lastStudied && (
          <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 550, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>📅</span>
            <span>Last studied: {new Date(subject.lastStudied).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
          </div>
        )}
      </div>

      {/* Progress & Metrics */}
      <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 14, marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Attendance</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: subject.attendance < 75 ? '#DC2626' : '#1E293B' }}>
              {subject.attendance}%
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Final Grade</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#1E293B' }}>
              {subject.finalGrade > 0 ? subject.finalGrade.toFixed(2) : '0.00'}
            </span>
          </div>
        </div>

        {/* Mini progress bar */}
        <div
          role="progressbar"
          aria-valuenow={attProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ width: '100%', height: 4, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}
        >
          <div style={{
            width: `${attProgress}%`,
            height: '100%',
            background: attProgress < 75 ? '#DC2626' : attProgress < 85 ? '#D97706' : '#059669',
            borderRadius: 99,
            transition: 'width 0.6s ease',
          }} />
        </div>
      </div>
    </div>
  )
}
