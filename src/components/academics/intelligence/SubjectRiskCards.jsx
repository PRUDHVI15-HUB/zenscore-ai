/**
 * SubjectRiskCards.jsx — Premium Redesign (Phase 5)
 *
 * Left accent borders, priority badges, progress index bar, trigger list bullets.
 * All logic/sorting/props untouched.
 */
import React, { useState } from 'react'

const RISK_THEMES = {
  HIGH: {
    accent:  '#DC2626',
    border:  '#FEE2E2',
    bg:      '#FFF1F2',
    color:   '#DC2626',
    badge:   'bg-rose-50 text-rose-700 border-rose-250',
    bar:     '#DC2626',
    iconBg:  '#FFF1F2',
    icon:    '🚨',
  },
  MEDIUM: {
    accent:  '#D97706',
    border:  '#FEF3C7',
    bg:      '#FFFBEB',
    color:   '#D97706',
    badge:   'bg-amber-50 text-amber-700 border-amber-250',
    bar:     '#D97706',
    iconBg:  '#FFFBEB',
    icon:    '⚠️',
  },
  LOW: {
    accent:  '#059669',
    border:  '#D1FAE5',
    bg:      '#ECFDF5',
    color:   '#059669',
    badge:   'bg-emerald-50 text-emerald-700 border-emerald-250',
    bar:     '#059669',
    iconBg:  '#ECFDF5',
    icon:    '🛡️',
  },
}

function SubjectRiskCard({ item }) {
  const [hov, setHov] = useState(false)
  const theme = RISK_THEMES[item.level] || RISK_THEMES.LOW

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff',
        borderRadius: 20,
        border: `1px solid ${hov ? '#C7D2FE' : '#E2E8F0'}`,
        borderLeft: `5px solid ${theme.accent}`,
        padding: '20px 22px',
        boxShadow: hov ? '0 6px 18px rgba(15,23,42,0.06)' : '0 1px 3px rgba(15,23,42,0.02)',
        transform: hov ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.18s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        flex: '1 1 300px',
        cursor: 'default',
      }}
    >
      {/* Title & Level Badge */}
      <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 12 }}>
        <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 14.5, fontWeight: 800, color: '#1E293B', margin: 0 }}>
          {item.subject}
        </h4>
        <span style={{
          fontSize: 9.5,
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: 99,
          background: theme.bg,
          color: theme.color,
          border: `1px solid ${theme.border}`,
          whiteSpace: 'nowrap',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          {item.level} Risk
        </span>
      </div>

      {/* Progress index bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 5 }}>
          <span>Risk Index</span>
          <span style={{ color: theme.color, fontWeight: 800 }}>{item.score} / 100</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={item.score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Risk score for ${item.subject} is ${item.score}%`}
          style={{ width: '100%', height: 6, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}
        >
          <div style={{ width: `${Math.min(100, Math.max(0, item.score))}%`, height: '100%', background: theme.bar, borderRadius: 99, transition: 'width 0.7s ease' }} />
        </div>
      </div>

      {/* Trigger indicators list */}
      <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 9.5, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>
          Trigger Indicators
        </span>
        {item.reasons && item.reasons.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {item.reasons.map((reason, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 11.5, color: '#64748B', fontWeight: 500, lineHeight: 1.4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: theme.accent, marginTop: 5, flexShrink: 0 }} />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: '#059669', fontWeight: 700 }}>
            <span>✅</span>
            <span>Safe standing — no warning flags.</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SubjectRiskCards({ riskScores }) {
  if (!riskScores || riskScores.length === 0) {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{ padding: '32px', textAlign: 'center', color: '#94A3B8', fontSize: 13, fontWeight: 600, background: '#fff', borderRadius: 20, border: '1px solid #E2E8F0' }}
      >
        No subject risk analytics computed.
      </div>
    )
  }

  // Sorting: HIGH first, then MEDIUM, then LOW
  const sortedScores = [...riskScores].sort((a, b) => {
    const priority = { HIGH: 3, MEDIUM: 2, LOW: 1 }
    return (priority[b.level] || 0) - (priority[a.level] || 0)
  })

  const hasHighRisk = sortedScores.some(s => s.level === 'HIGH')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Safe banner if no High Risk */}
      {!hasHighRisk && (
        <div
          role="status"
          aria-live="polite"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 18px',
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            borderRadius: 16,
            fontSize: 12.5,
            fontWeight: 700,
            color: '#059669',
          }}
        >
          <span style={{ fontSize: 18 }} aria-hidden="true">🛡️</span>
          <span>Academic Safe Zone: No high-risk subjects detected. All courses are within safe standings.</span>
        </div>
      )}

      {/* Grid wrapper */}
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}
        role="region"
        aria-label="Course Subject Risks Panel"
      >
        {sortedScores.map((item, idx) => (
          <SubjectRiskCard key={idx} item={item} />
        ))}
      </div>
    </div>
  )
}
