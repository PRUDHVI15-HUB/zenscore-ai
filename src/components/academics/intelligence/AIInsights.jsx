/**
 * AIInsights.jsx — Premium Analytics Panel Redesign (Phase 5)
 *
 * Props (unchanged):
 *   insights: {
 *     strongestSubject  : { name, finalGrade, credits, explanation }
 *     weakestSubject    : { name, finalGrade, credits, explanation }
 *     bestSemester      : { semester, sgpa }
 *     worstSemester     : { semester, sgpa }
 *     creditsCompleted  : number
 *     creditsRemaining  : number
 *     averageAttendance : number
 *     averageGrade      : number
 *     improvementTrend  : { direction, delta, percentage, reason }
 *   }
 */
import React, { useState } from 'react'

function InsightCard({ title, label, icon, iconBg, iconColor, hoverBorder, bg, children }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff',
        borderRadius: 20,
        border: `1px solid ${hov ? hoverBorder : '#E2E8F0'}`,
        padding: '20px 22px',
        boxShadow: hov ? '0 6px 18px rgba(15,23,42,0.06)' : '0 1px 3px rgba(15,23,42,0.02)',
        transform: hov ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.18s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: 160,
        flex: '1 1 280px',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative inner glow or slight gradient bg if hovered */}
      {hov && bg && (
        <div style={{ position: 'absolute', inset: 0, background: bg, opacity: 0.05, zIndex: 0, pointerEvents: 'none' }} />
      )}

      <div style={{ zIndex: 1 }}>
        {/* Header indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>
            {icon}
          </div>
          <div>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: iconColor, textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block' }}>
              {label}
            </span>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#1E293B', fontFamily: 'Sora, sans-serif' }}>
              {title}
            </span>
          </div>
        </div>

        {/* Content slot */}
        <div style={{ fontSize: 12.5, color: '#64748B', fontWeight: 500, lineHeight: 1.5 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default function AIInsights({ insights }) {
  if (!insights) {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{ padding: '32px', textAlign: 'center', color: '#94A3B8', fontSize: 13, fontWeight: 600, background: '#fff', borderRadius: 20, border: '1px solid #E2E8F0' }}
      >
        Insights will appear once academic data is available.
      </div>
    )
  }

  const {
    strongestSubject,
    weakestSubject,
    bestSemester,
    worstSemester,
    creditsCompleted = 0,
    creditsRemaining = 160,
    averageAttendance = 0,
    averageGrade = 0,
    improvementTrend = {}
  } = insights

  const totalTargetCredits = 160
  const progressPercent = Math.min(100, Math.max(0, (creditsCompleted / totalTargetCredits) * 100))

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 20,
      }}
      role="region"
      aria-label="AI Performance Insights Grid"
    >
      {/* 1. Strongest Subject Panel */}
      <InsightCard
        label="Academics Star"
        title="Strongest Subject"
        icon="⭐"
        iconBg="#ECFDF5"
        iconColor="#059669"
        hoverBorder="#A7F3D0"
        bg="#059669"
      >
        {strongestSubject ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#1E293B' }}>{strongestSubject.name}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8' }}>({strongestSubject.credits} Credits)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: 99 }}>
                Grade: {strongestSubject.finalGrade} / 10
              </span>
            </div>
            {strongestSubject.explanation && (
              <p style={{ fontSize: 11.5, color: '#64748B', margin: '4px 0 0', lineHeight: 1.4, fontStyle: 'italic' }}>
                "{strongestSubject.explanation}"
              </p>
            )}
          </div>
        ) : (
          <span style={{ color: '#CBD5E1' }}>No subject grading history available.</span>
        )}
      </InsightCard>

      {/* 2. Weakest Subject Panel */}
      <InsightCard
        label="Critical Attention"
        title="Weakest Subject"
        icon="⚠️"
        iconBg="#FFF1F2"
        iconColor="#DC2626"
        hoverBorder="#FECDD3"
        bg="#DC2626"
      >
        {weakestSubject ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#1E293B' }}>{weakestSubject.name}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8' }}>({weakestSubject.credits} Credits)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#DC2626', background: '#FFF1F2', padding: '2px 8px', borderRadius: 99 }}>
                Grade: {weakestSubject.finalGrade} / 10
              </span>
            </div>
            {weakestSubject.explanation && (
              <p style={{ fontSize: 11.5, color: '#64748B', margin: '4px 0 0', lineHeight: 1.4, fontStyle: 'italic' }}>
                "{weakestSubject.explanation}"
              </p>
            )}
          </div>
        ) : (
          <span style={{ color: '#CBD5E1' }}>No subject grading history available.</span>
        )}
      </InsightCard>

      {/* 3. Semester Standings Panel */}
      <InsightCard
        label="Performance Standing"
        title="Semester Standings"
        icon="📊"
        iconBg="#EFF6FF"
        iconColor="#2563EB"
        hoverBorder="#BFDBFE"
        bg="#2563EB"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {bestSemester ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>Best (Sem {bestSemester.semester})</span>
              <span style={{ fontSize: 11, fontWeight: 850, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: 6 }}>
                {bestSemester.sgpa} SGPA
              </span>
            </div>
          ) : (
            <span style={{ color: '#CBD5E1', fontSize: 11.5 }}>No semester entries yet.</span>
          )}
          {worstSemester && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>Worst (Sem {worstSemester.semester})</span>
              <span style={{ fontSize: 11, fontWeight: 850, color: '#D97706', background: '#FFFBEB', padding: '2px 8px', borderRadius: 6 }}>
                {worstSemester.sgpa} SGPA
              </span>
            </div>
          )}
        </div>
      </InsightCard>

      {/* 4. Degree Credits Progression Card */}
      <InsightCard
        label="Degree Pipeline"
        title="Credits Progress"
        icon="📚"
        iconBg="#F3F0FF"
        iconColor="#7C3AED"
        hoverBorder="#DDD6FE"
        bg="#7C3AED"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 700 }}>
            <span style={{ color: '#1E293B' }}>{creditsCompleted} Completed</span>
            <span style={{ color: '#7C3AED' }}>{creditsRemaining} Remaining</span>
          </div>

          <div
            role="progressbar"
            aria-valuenow={creditsCompleted}
            aria-valuemin={0}
            aria-valuemax={totalTargetCredits}
            style={{ width: '100%', height: 6, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}
          >
            <div style={{ width: `${progressPercent}%`, height: '100%', background: '#7C3AED', borderRadius: 99, transition: 'width 0.7s ease' }} />
          </div>

          <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>
            {progressPercent.toFixed(1)}% of {totalTargetCredits} credit goal achieved.
          </span>
        </div>
      </InsightCard>

      {/* 5. Key Performance Averages Card */}
      <InsightCard
        label="Averages Overview"
        title="Academic Statistics"
        icon="🎯"
        iconBg="#FFFBEB"
        iconColor="#D97706"
        hoverBorder="#FDE68A"
        bg="#D97706"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: '#F8FAFC', padding: '8px 10px', borderRadius: 12, border: '1px solid #E2E8F0', textAlign: 'center' }}>
            <span style={{ fontSize: 9.5, color: '#94A3B8', display: 'block', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>Attendance</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#1E293B' }}>{averageAttendance}%</span>
          </div>
          <div style={{ background: '#F8FAFC', padding: '8px 10px', borderRadius: 12, border: '1px solid #E2E8F0', textAlign: 'center' }}>
            <span style={{ fontSize: 9.5, color: '#94A3B8', display: 'block', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>Grade Point</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#1E293B' }}>{averageGrade} / 10</span>
          </div>
        </div>
      </InsightCard>

      {/* 6. Improvement Trajectory Card */}
      <InsightCard
        label="Trajectory Trend"
        title="Velocity Status"
        icon="📈"
        iconBg="#F0FDFA"
        iconColor="#0D9488"
        hoverBorder="#99F6E4"
        bg="#0D9488"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              fontSize: 10,
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: 99,
              background: improvementTrend.direction === 'UP' ? '#ECFDF5' : improvementTrend.direction === 'DOWN' ? '#FFF1F2' : '#F1F5F9',
              color: improvementTrend.direction === 'UP' ? '#059669' : improvementTrend.direction === 'DOWN' ? '#DC2626' : '#64748B',
            }}>
              {improvementTrend.direction || 'STABLE'}
            </span>
            {improvementTrend.delta !== 0 && (
              <span style={{ fontSize: 11.5, fontWeight: 800, color: improvementTrend.delta > 0 ? '#059669' : '#DC2626' }}>
                {improvementTrend.delta > 0 ? '+' : ''}{improvementTrend.delta} ({improvementTrend.percentage}%)
              </span>
            )}
          </div>
          {improvementTrend.reason && (
            <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500, margin: 0, lineHeight: 1.4 }}>
              {improvementTrend.reason}
            </p>
          )}
        </div>
      </InsightCard>
    </div>
  )
}
