import React, { useState } from 'react'

/**
 * WelcomeStats — 4-Card KPI Overview Row (Phase 2 Revamp)
 * Clean Dashboard-style cards: white bg, thin border, soft shadow,
 * colored circle icon, mini SVG sparkline, hover elevation.
 */
export default function WelcomeStats({
  currentCGPA,
  targetCGPA,
  predictedCGPA,
  loading = false,
  semesters = [],
  onGeneratePrediction,
  healthScore,
}) {
  // ── Derived metrics ─────────────────────────────────────────
  const allSubjects = semesters.flatMap(sem => sem.subjects || [])

  const getCGPATrend = () => {
    if (!semesters || semesters.length < 2) return null
    const diff = parseFloat(
      ((semesters[semesters.length - 1]?.sgpa || 0) -
       (semesters[semesters.length - 2]?.sgpa || 0)).toFixed(2)
    )
    return { value: `${diff >= 0 ? '+' : ''}${diff}`, isPositive: diff >= 0 }
  }
  const cgpaTrend = getCGPATrend()
  const healthValue = healthScore?.score ?? null

  const getHealthStatus = (val) => {
    if (val === null) return { label: 'Pending', color: '#64748b', bg: '#F1F5F9' }
    if (val >= 80) return { label: 'Excellent', color: '#059669', bg: '#ECFDF5' }
    if (val >= 60) return { label: 'Healthy', color: '#2563EB', bg: '#EFF6FF' }
    if (val >= 40) return { label: 'Needs Work', color: '#D97706', bg: '#FFF7ED' }
    return { label: 'At Risk', color: '#DC2626', bg: '#FFF1F2' }
  }
  const healthStatus = getHealthStatus(healthValue)

  // ── Mini sparkline paths ─────────────────────────────────────
  const sparklines = {
    cgpa:    'M0,18 Q25,4 50,12 T100,2',
    target:  'M0,15 L40,15 L70,5 L100,5',
    predict: 'M0,16 Q30,8 60,10 T100,2',
    health:  'M0,18 Q20,6 50,12 Q80,16 100,4',
  }

  // ── Cards config ─────────────────────────────────────────────
  const cgpaVal   = loading ? '—' : (currentCGPA ? parseFloat(currentCGPA).toFixed(2) : '—')
  const targetVal = loading ? '—' : (targetCGPA ? parseFloat(targetCGPA).toFixed(2) : '8.00')
  const predVal   = loading ? '—' : (predictedCGPA && predictedCGPA > 0 ? parseFloat(predictedCGPA).toFixed(2) : null)
  const healthVal = loading ? '—' : (healthValue !== null ? `${healthValue}%` : '—')

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 24,
      }}
    >
      {/* ── 1. Current CGPA ── */}
      <KPICard
        label="Current CGPA"
        value={cgpaVal}
        sub="Cumulative weighted GPA"
        iconBg="#EFF6FF"
        iconColor="#2563EB"
        accentColor="#2563EB"
        sparkPath={sparklines.cgpa}
        trend={cgpaTrend}
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        }
      />

      {/* ── 2. Target CGPA ── */}
      <KPICard
        label="Target CGPA"
        value={targetVal}
        sub="Graduation goal"
        iconBg="#F3F0FF"
        iconColor="#7C3AED"
        accentColor="#7C3AED"
        sparkPath={sparklines.target}
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        }
      />

      {/* ── 3. Predicted CGPA ── */}
      <KPICard
        label="Predicted CGPA"
        value={predVal ?? '—'}
        sub={predVal ? 'AI next semester forecast' : 'Log 2+ semesters to predict'}
        iconBg="#ECFDF5"
        iconColor="#059669"
        accentColor="#059669"
        sparkPath={sparklines.predict}
        badge={predVal ? 'AI Forecast' : null}
        badgeColor="#059669"
        badgeBg="#ECFDF5"
        emptyAction={!predVal && !loading ? onGeneratePrediction : null}
        emptyActionLabel="Generate Forecast"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        }
      />

      {/* ── 4. Academic Health ── */}
      <KPICard
        label="Academic Health"
        value={healthVal}
        sub="Overall wellness index"
        iconBg={healthStatus.bg}
        iconColor={healthStatus.color}
        accentColor={healthStatus.color}
        sparkPath={sparklines.health}
        badge={healthValue !== null ? healthStatus.label : null}
        badgeColor={healthStatus.color}
        badgeBg={healthStatus.bg}
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        }
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// KPICard — individual metric card
// ─────────────────────────────────────────────────────────────
function KPICard({
  label, value, sub,
  iconBg, iconColor, accentColor,
  sparkPath,
  trend,
  badge, badgeColor, badgeBg,
  emptyAction, emptyActionLabel,
  icon,
}) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 20,
        padding: 24,
        border: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: 160,
        boxShadow: hovered
          ? '0 8px 24px rgba(15,23,42,0.07)'
          : '0 1px 3px rgba(15,23,42,0.03)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.2s ease',
        cursor: 'default',
      }}
    >
      {/* Top row: label + icon */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
          {label}
        </div>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: iconBg,
          color: iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>

      {/* Value + trend pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        {emptyAction ? (
          <button
            onClick={emptyAction}
            style={{
              padding: '6px 14px',
              background: iconBg,
              color: iconColor,
              border: `1px solid ${iconBg}`,
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {emptyActionLabel}
          </button>
        ) : (
          <>
            <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#1E293B', lineHeight: 1 }}>
              {value}
            </span>
            {trend && (
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                padding: '3px 7px',
                borderRadius: 99,
                background: trend.isPositive ? '#ECFDF5' : '#FFF1F2',
                color: trend.isPositive ? '#059669' : '#DC2626',
                flexShrink: 0,
              }}>
                {trend.value}
              </span>
            )}
            {badge && (
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 99,
                background: badgeBg,
                color: badgeColor,
                flexShrink: 0,
              }}>
                {badge}
              </span>
            )}
          </>
        )}
      </div>

      {/* Bottom row: sub + sparkline */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <span style={{ fontSize: 11.5, color: '#94A3B8', fontWeight: 600 }}>{sub}</span>
        <svg width="72" height="20" viewBox="0 0 100 22" fill="none" style={{ flexShrink: 0 }}>
          <path d={sparkPath} stroke={accentColor} strokeWidth="2" strokeLinecap="round" opacity="0.55" fill="none" />
        </svg>
      </div>
    </div>
  )
}
