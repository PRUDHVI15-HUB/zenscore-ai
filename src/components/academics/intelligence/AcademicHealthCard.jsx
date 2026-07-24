/**
 * AcademicHealthCard.jsx — Phase 5 Step 1 Premium Redesign
 *
 * Props (unchanged):
 *   healthScore: {
 *     score        : number  0-100
 *     status       : string  'EXCELLENT' | 'GOOD' | 'NEEDS IMPROVEMENT' | 'CRITICAL'
 *     color        : string  'green' | 'blue' | 'yellow' | 'red'
 *     trend        : { direction, delta, percentage, reason }
 *     breakdown    : { attendance, grades, cgpa, risk }
 *     explanation  : { summary, strengths[], improvements[] }
 *   }
 *
 * All logic / calculations are UNTOUCHED.
 * Only presentation is redesigned.
 */
import React, { useState, useEffect, useRef } from 'react'

// ─── Design tokens ───────────────────────────────────────────────────────────
const COLOR_MAP = {
  green: {
    ring:        '#059669',
    ringTrack:   '#D1FAE5',
    statusBg:    '#ECFDF5',
    statusColor: '#059669',
    statusBorder:'#A7F3D0',
    label:       'Excellent',
  },
  blue: {
    ring:        '#2563EB',
    ringTrack:   '#DBEAFE',
    statusBg:    '#EFF6FF',
    statusColor: '#2563EB',
    statusBorder:'#BFDBFE',
    label:       'Good',
  },
  yellow: {
    ring:        '#D97706',
    ringTrack:   '#FEF3C7',
    statusBg:    '#FFFBEB',
    statusColor: '#D97706',
    statusBorder:'#FDE68A',
    label:       'Average',
  },
  red: {
    ring:        '#DC2626',
    ringTrack:   '#FEE2E2',
    statusBg:    '#FFF1F2',
    statusColor: '#DC2626',
    statusBorder:'#FECDD3',
    label:       'Critical',
  },
}

// ─── Animated circular score ring ───────────────────────────────────────────
function ScoreRing({ score, color, status }) {
  const [animated, setAnimated] = useState(0)
  const tokens = COLOR_MAP[color] || COLOR_MAP.red

  // requestAnimationFrame ease-out countdown
  useEffect(() => {
    if (!score) return
    let frame
    let start = null
    const duration = 900
    const target = Math.min(100, Math.max(0, Math.round(score)))

    function step(ts) {
      if (!start) start = ts
      const progress = Math.min(1, (ts - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimated(Math.round(eased * target))
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [score])

  const size = 120
  const sw = 9
  const radius = (size - sw) / 2
  const circ = 2 * Math.PI * radius
  const offset = circ - (animated / 100) * circ

  return (
    <div
      style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}
      role="progressbar"
      aria-valuenow={Math.round(score)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Academic health score: ${Math.round(score)} out of 100`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)', display: 'block' }}
        aria-hidden="true"
      >
        {/* Track */}
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={tokens.ringTrack} strokeWidth={sw} />
        {/* Progress */}
        <circle
          cx={size/2}
          cy={size/2}
          r={radius}
          fill="none"
          stroke={tokens.ring}
          strokeWidth={sw}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.04s linear' }}
        />
      </svg>
      {/* Centre label */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 26, fontWeight: 800, color: '#1E293B', lineHeight: 1 }}>
          {animated}
        </span>
        <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: tokens.statusColor, marginTop: 3 }}>
          {tokens.label}
        </span>
      </div>
    </div>
  )
}

// ─── Metric card ─────────────────────────────────────────────────────────────
function MetricCard({ icon, label, value, subtitle, color, bg, border }) {
  const [hov, setHov] = useState(false)
  const pct = Math.min(100, Math.max(0, parseInt(value) || 0))

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: '1 1 0',
        minWidth: 110,
        background: hov ? bg : '#fff',
        border: `1px solid ${hov ? border : '#E2E8F0'}`,
        borderRadius: 16,
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        transition: 'all 0.18s ease',
        transform: hov ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hov ? '0 6px 18px rgba(15,23,42,0.07)' : '0 1px 2px rgba(15,23,42,0.03)',
        cursor: 'default',
      }}
    >
      {/* Icon + label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }} aria-hidden="true">
          {icon}
        </div>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </span>
      </div>
      {/* Value */}
      <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>
        {value}
      </span>
      {/* Mini progress bar */}
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${value}`}
        style={{ width: '100%', height: 5, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}
      >
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.7s ease' }} />
      </div>
      {/* Subtitle */}
      <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>{subtitle}</span>
    </div>
  )
}

// ─── Trend banner ─────────────────────────────────────────────────────────────
function TrendBanner({ trend }) {
  if (!trend?.direction) return null

  const cfg = {
    UP:     { icon: '↑', color: '#059669', bg: 'linear-gradient(90deg,#ECFDF5,#F0FDF4)', border: '#A7F3D0', label: 'Improving' },
    DOWN:   { icon: '↓', color: '#DC2626', bg: 'linear-gradient(90deg,#FFF1F2,#FEF2F2)', border: '#FECDD3', label: 'Declining' },
    STABLE: { icon: '→', color: '#2563EB', bg: 'linear-gradient(90deg,#EFF6FF,#F0F9FF)', border: '#BFDBFE', label: 'Stable'    },
  }[trend.direction] || { icon: '→', color: '#64748B', bg: 'linear-gradient(90deg,#F8FAFC,#F1F5F9)', border: '#E2E8F0', label: 'Stable' }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '13px 18px',
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: 14,
        flexWrap: 'wrap',
      }}
      role="note"
      aria-label={`Health trajectory: ${cfg.label}`}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 20, color: cfg.color, fontWeight: 800, lineHeight: 1 }} aria-hidden="true">{cfg.icon}</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: cfg.color, fontFamily: 'Sora, sans-serif' }}>{cfg.label}</span>
        {trend.delta !== undefined && (
          <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: '#fff', color: cfg.color, border: `1px solid ${cfg.border}` }}>
            {trend.direction === 'UP' ? '+' : ''}{trend.delta}
            {trend.percentage ? ` (${trend.percentage}%)` : ''}
          </span>
        )}
      </div>
      {trend.reason && (
        <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500, lineHeight: 1.4, flex: 1 }}>
          {trend.reason}
        </span>
      )}
    </div>
  )
}

// ─── Strengths card ───────────────────────────────────────────────────────────
function StrengthsCard({ items }) {
  if (!items?.length) return null
  return (
    <div style={{ flex: '1 1 0', minWidth: 200, background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 16, padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 16 }} aria-hidden="true">🎉</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: '#166534', fontFamily: 'Sora, sans-serif' }}>Strengths</span>
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }} role="list">
        {items.map((str, idx) => (
          <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }} role="listitem">
            <span style={{ flexShrink: 0, width: 18, height: 18, borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }} aria-hidden="true">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span style={{ fontSize: 12, color: '#166534', fontWeight: 500, lineHeight: 1.4 }}>{str}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── Improvements card ───────────────────────────────────────────────────────
function ImprovementsCard({ items }) {
  if (!items?.length) return null
  return (
    <div style={{ flex: '1 1 0', minWidth: 200, background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 16, padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 16 }} aria-hidden="true">⚠️</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: '#92400E', fontFamily: 'Sora, sans-serif' }}>Areas to Improve</span>
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }} role="list">
        {items.map((imp, idx) => (
          <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }} role="listitem">
            <span style={{ flexShrink: 0, width: 18, height: 18, borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }} aria-hidden="true">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </span>
            <span style={{ fontSize: 12, color: '#92400E', fontWeight: 500, lineHeight: 1.4 }}>{imp}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── Action button ────────────────────────────────────────────────────────────
function ActionBtn({ label, primary, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '10px 22px',
        background: primary
          ? hov ? 'linear-gradient(135deg,#6D28D9,#4338CA)' : 'linear-gradient(135deg,#7C3AED,#4F46E5)'
          : hov ? '#F1F5F9' : '#fff',
        color: primary ? '#fff' : hov ? '#1E293B' : '#475569',
        border: primary ? 'none' : '1px solid #E2E8F0',
        borderRadius: 12,
        fontSize: 12.5,
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: 'Sora, sans-serif',
        boxShadow: primary
          ? hov ? '0 6px 18px rgba(124,58,237,0.3)' : '0 4px 12px rgba(124,58,237,0.18)'
          : '0 1px 2px rgba(15,23,42,0.04)',
        transition: 'all 0.18s ease',
        transform: hov ? 'translateY(-1px)' : 'translateY(0)',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
const AcademicHealthCard = ({ healthScore }) => {
  // ── unchanged data extraction ──────────────────────────────────────────────
  const score       = healthScore?.score ?? 0
  const status      = healthScore?.status ?? 'NEEDS IMPROVEMENT'
  const color       = healthScore?.color ?? 'red'
  const trend       = healthScore?.trend ?? {}
  const breakdown   = healthScore?.breakdown ?? {}
  const explanation = healthScore?.explanation ?? {}

  const tokens = COLOR_MAP[color] || COLOR_MAP.red

  // ── empty state ────────────────────────────────────────────────────────────
  if (!healthScore) {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{ padding: '32px', textAlign: 'center', color: '#94A3B8', fontSize: 13, fontWeight: 600, background: '#fff', borderRadius: 20, border: '1px solid #E2E8F0' }}
      >
        Academic health data will appear once records are available.
      </div>
    )
  }

  // ── metric cards data ──────────────────────────────────────────────────────
  const metrics = [
    {
      icon: '📋',
      label: 'Attendance',
      value: `${breakdown.attendance ?? 0}%`,
      subtitle: breakdown.attendance >= 75 ? 'Above minimum' : 'Below threshold',
      color: breakdown.attendance >= 75 ? '#059669' : breakdown.attendance >= 60 ? '#D97706' : '#DC2626',
      bg: breakdown.attendance >= 75 ? '#ECFDF5' : breakdown.attendance >= 60 ? '#FFFBEB' : '#FFF1F2',
      border: breakdown.attendance >= 75 ? '#A7F3D0' : breakdown.attendance >= 60 ? '#FDE68A' : '#FECDD3',
    },
    {
      icon: '🎯',
      label: 'Grades Index',
      value: `${breakdown.grades ?? 0}%`,
      subtitle: breakdown.grades >= 75 ? 'Strong performance' : 'Room to grow',
      color: '#7C3AED',
      bg: '#F3F0FF',
      border: '#DDD6FE',
    },
    {
      icon: '📈',
      label: 'CGPA Ratio',
      value: `${breakdown.cgpa ?? 0}%`,
      subtitle: 'Cumulative index',
      color: '#2563EB',
      bg: '#EFF6FF',
      border: '#BFDBFE',
    },
    {
      icon: '🛡️',
      label: 'Subject Safety',
      value: `${breakdown.risk ?? 0}%`,
      subtitle: breakdown.risk >= 80 ? 'No subjects at risk' : 'Some subjects flagged',
      color: '#059669',
      bg: '#ECFDF5',
      border: '#A7F3D0',
    },
  ]

  return (
    <div
      role="region"
      aria-label="Academic Health Dashboard"
      style={{
        background: '#fff',
        borderRadius: 24,
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 4px rgba(15,23,42,0.04)',
        overflow: 'hidden',
      }}
    >
      {/* ── HEADER: title/subtitle (left) + animated ring (right) ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          padding: '24px 28px',
          borderBottom: '1px solid #F1F5F9',
          flexWrap: 'wrap',
        }}
      >
        {/* Left */}
        <div style={{ flex: 1, minWidth: 220 }}>
          {/* Section tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: tokens.statusColor, textTransform: 'uppercase', letterSpacing: '0.6px', background: tokens.statusBg, padding: '3px 10px', borderRadius: 99, border: `1px solid ${tokens.statusBorder}` }}>
              {status}
            </span>
          </div>

          {/* Summary or default description */}
          {explanation.summary ? (
            <p style={{ fontSize: 13.5, color: '#475569', fontWeight: 500, margin: 0, lineHeight: 1.6, maxWidth: 520, fontStyle: 'italic' }}>
              "{explanation.summary}"
            </p>
          ) : (
            <p style={{ fontSize: 12.5, color: '#94A3B8', fontWeight: 500, margin: 0, lineHeight: 1.5, maxWidth: 380 }}>
              Overall academic wellness and performance metrics.
            </p>
          )}
        </div>

        {/* Right: Score ring */}
        <ScoreRing score={score} color={color} status={status} />
      </div>

      {/* ── BODY ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '24px 28px' }}>

        {/* Trend banner */}
        {trend.direction && <TrendBanner trend={trend} />}

        {/* Metrics Row */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {metrics.map((m, i) => (
            <MetricCard key={i} {...m} />
          ))}
        </div>

        {/* Strengths & Improvements */}
        {((explanation.strengths?.length > 0) || (explanation.improvements?.length > 0)) && (
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <StrengthsCard items={explanation.strengths} />
            <ImprovementsCard items={explanation.improvements} />
          </div>
        )}

        {/* Action buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            paddingTop: 4,
            borderTop: '1px solid #F1F5F9',
            flexWrap: 'wrap',
          }}
        >
          <ActionBtn label="View Detailed Analysis" primary={false} onClick={() => {}} />
          <ActionBtn label="✨ Generate AI Study Plan" primary={true} onClick={() => {}} />
        </div>
      </div>
    </div>
  )
}

export default React.memo(AcademicHealthCard)
