/**
 * AIPredictionPanel
 *
 * Phase 3 UI Revamp — AI Performance Prediction & Key Insights
 *
 * Layout (left → right on desktop, stacked on mobile):
 *  ┌──────────────────────────────────┬──────────────┐
 *  │  Prediction text + large value   │ Circle ring  │
 *  ├──────────────────────────────────┴──────────────┤
 *  │  4 metric stat cards (Backlog | Placement |     │
 *  │  Attendance | Goal Progress)                    │
 *  ├─────────────────────────────────────────────────┤
 *  │  Key Insights list + "View Detailed Analysis"   │
 *  └─────────────────────────────────────────────────┘
 *
 * Props (all read-only, no mutation):
 *  - predictedCGPA     number | null
 *  - currentCGPA       number | null
 *  - targetCGPA        number | null
 *  - healthScore       { score, status, breakdown:{attendance,grades,cgpa,risk} }
 *  - insights          { strongestSubject, weakestSubject, averageAttendance,
 *                        averageGrade, improvementTrend, creditsCompleted }
 *  - semesters         array of semester objects
 *  - loading           boolean
 *  - onViewDetails     () => void   (scrolls to detailed sections)
 */

import React, { useState, useEffect, useRef } from 'react'

// ─── helpers ────────────────────────────────────────────────────────────────

function clamp(val, min = 0, max = 100) {
  return Math.min(max, Math.max(min, val ?? 0))
}

// Derive a 0-100 confidence score from predictedCGPA vs currentCGPA
function getProbability(predicted, current) {
  if (!predicted || !current) return 72 // neutral placeholder
  const ratio = predicted / 10 // CGPA is /10 scale
  return Math.round(clamp(ratio * 100))
}

// ─── Animated circle ────────────────────────────────────────────────────────

function CircleProgress({ value, size = 120, strokeWidth = 10, color = '#7C3AED' }) {
  const [animated, setAnimated] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * radius
  const offset = circ - (animated / 100) * circ

  useEffect(() => {
    let frame
    let start = null
    const duration = 900
    const target = clamp(value)

    function step(ts) {
      if (!start) start = ts
      const progress = Math.min(1, (ts - start) / duration)
      // ease-out-cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimated(Math.round(eased * target))
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [value])

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)', display: 'block' }}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F1F5F9"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.05s linear' }}
        />
      </svg>
      {/* Centre label */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, color: '#1E293B', lineHeight: 1 }}>
          {animated}%
        </span>
        <span style={{ fontSize: 9, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 2 }}>
          Probability
        </span>
      </div>
    </div>
  )
}

// ─── Metric stat card ────────────────────────────────────────────────────────

function MetricCard({ icon, label, value, status, description, color, bg, border }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? bg : '#fff',
        border: `1px solid ${hov ? border : '#E2E8F0'}`,
        borderRadius: 16,
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        transition: 'all 0.18s ease',
        transform: hov ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hov ? '0 6px 16px rgba(15,23,42,0.06)' : '0 1px 2px rgba(15,23,42,0.03)',
        cursor: 'default',
        flex: '1 1 0',
        minWidth: 130,
      }}
    >
      {/* Icon + label row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          flexShrink: 0,
        }}>
          {icon}
        </div>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </span>
      </div>
      {/* Value + status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#1E293B' }}>
          {value}
        </span>
        <span style={{
          fontSize: 9.5,
          fontWeight: 700,
          padding: '2px 7px',
          borderRadius: 99,
          background: bg,
          color,
          whiteSpace: 'nowrap',
        }}>
          {status}
        </span>
      </div>
      {/* Description */}
      <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500, lineHeight: 1.4 }}>
        {description}
      </span>
    </div>
  )
}

// ─── Insight row ─────────────────────────────────────────────────────────────

function InsightRow({ icon, iconBg, iconColor, title, description }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '11px 14px',
        borderRadius: 12,
        background: hov ? '#FAFBFF' : 'transparent',
        transition: 'background 0.15s ease',
        cursor: 'default',
      }}
    >
      <div style={{
        width: 32,
        height: 32,
        borderRadius: 10,
        background: iconBg,
        color: iconColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 15,
        flexShrink: 0,
        marginTop: 1,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1E293B', marginBottom: 2 }}>
          {title}
        </div>
        <div style={{ fontSize: 11.5, color: '#94A3B8', fontWeight: 500, lineHeight: 1.4 }}>
          {description}
        </div>
      </div>
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function AIPredictionPanel({
  predictedCGPA,
  currentCGPA,
  targetCGPA,
  healthScore,
  insights,
  semesters = [],
  loading = false,
  onViewDetails,
  onGeneratePrediction,
}) {
  // ── Derived values ───────────────────────────────────────────
  const predicted = predictedCGPA && predictedCGPA > 0 ? parseFloat(predictedCGPA).toFixed(2) : null
  const probability = getProbability(predictedCGPA, currentCGPA)

  const attendance = insights?.averageAttendance ?? healthScore?.breakdown?.attendance ?? 0
  const grades = healthScore?.breakdown?.grades ?? 0
  const risk = healthScore?.breakdown?.risk ?? 0
  const creditsCompleted = insights?.creditsCompleted ?? 0
  const creditsTarget = 160

  // Goal progress
  const goalProgress = (() => {
    if (!currentCGPA || !targetCGPA) return 0
    const ratio = Math.min(1, parseFloat(currentCGPA) / parseFloat(targetCGPA))
    return Math.round(ratio * 100)
  })()

  // Placement readiness (proxy from grades + attendance)
  const placementReady = Math.round((grades * 0.6 + clamp(attendance) * 0.4))

  // Backlog risk (inverse of risk score)
  const backlogRisk = Math.max(0, 100 - Math.round(risk))

  // ── Metric cards ─────────────────────────────────────────────
  const metrics = [
    {
      icon: '🚨',
      label: 'Backlog Risk',
      value: backlogRisk < 20 ? 'Low' : backlogRisk < 50 ? 'Medium' : 'High',
      status: `${100 - backlogRisk}% safe`,
      description: backlogRisk < 20 ? 'No subjects at failing risk' : 'Some subjects need attention',
      color: backlogRisk < 20 ? '#059669' : backlogRisk < 50 ? '#D97706' : '#DC2626',
      bg: backlogRisk < 20 ? '#ECFDF5' : backlogRisk < 50 ? '#FFFBEB' : '#FFF1F2',
      border: backlogRisk < 20 ? '#A7F3D0' : backlogRisk < 50 ? '#FDE68A' : '#FECDD3',
    },
    {
      icon: '🎯',
      label: 'Placement Readiness',
      value: `${placementReady}%`,
      status: placementReady >= 75 ? 'Ready' : placementReady >= 50 ? 'On Track' : 'Developing',
      description: 'Based on academic performance index',
      color: placementReady >= 75 ? '#059669' : placementReady >= 50 ? '#2563EB' : '#D97706',
      bg: placementReady >= 75 ? '#ECFDF5' : placementReady >= 50 ? '#EFF6FF' : '#FFFBEB',
      border: placementReady >= 75 ? '#A7F3D0' : placementReady >= 50 ? '#BFDBFE' : '#FDE68A',
    },
    {
      icon: '📅',
      label: 'Attendance Status',
      value: `${Math.round(attendance)}%`,
      status: attendance >= 75 ? 'Good' : attendance >= 60 ? 'Warning' : 'Critical',
      description: attendance >= 75 ? 'Meets university requirement' : 'Below safe attendance threshold',
      color: attendance >= 75 ? '#059669' : attendance >= 60 ? '#D97706' : '#DC2626',
      bg: attendance >= 75 ? '#ECFDF5' : attendance >= 60 ? '#FFFBEB' : '#FFF1F2',
      border: attendance >= 75 ? '#A7F3D0' : attendance >= 60 ? '#FDE68A' : '#FECDD3',
    },
    {
      icon: '🏆',
      label: 'Goal Progress',
      value: `${goalProgress}%`,
      status: goalProgress >= 90 ? 'Achieved' : goalProgress >= 70 ? 'Near Goal' : 'In Progress',
      description: `Towards ${targetCGPA ? parseFloat(targetCGPA).toFixed(2) : '8.00'} CGPA target`,
      color: goalProgress >= 90 ? '#059669' : goalProgress >= 70 ? '#7C3AED' : '#2563EB',
      bg: goalProgress >= 90 ? '#ECFDF5' : goalProgress >= 70 ? '#F3F0FF' : '#EFF6FF',
      border: goalProgress >= 90 ? '#A7F3D0' : goalProgress >= 70 ? '#DDD6FE' : '#BFDBFE',
    },
  ]

  // ── Key insights list ────────────────────────────────────────
  const insightItems = (() => {
    const items = []

    // Attendance insight
    if (attendance < 75) {
      items.push({
        icon: '📉',
        iconBg: '#FFF1F2',
        iconColor: '#DC2626',
        title: 'Attendance affecting CGPA',
        description: `Average attendance is ${Math.round(attendance)}% — below the 75% requirement. This directly impacts your grade eligibility.`,
      })
    } else {
      items.push({
        icon: '✅',
        iconBg: '#ECFDF5',
        iconColor: '#059669',
        title: 'Strong attendance record',
        description: `Average attendance is ${Math.round(attendance)}% — well above the minimum requirement.`,
      })
    }

    // Weakest subject
    if (insights?.weakestSubject?.name) {
      items.push({
        icon: '⚠️',
        iconBg: '#FFFBEB',
        iconColor: '#D97706',
        title: `${insights.weakestSubject.name} needs improvement`,
        description: insights.weakestSubject.explanation || `Grade: ${insights.weakestSubject.finalGrade}/10 — focus here to raise your CGPA.`,
      })
    }

    // Strongest subject
    if (insights?.strongestSubject?.name) {
      items.push({
        icon: '⭐',
        iconBg: '#EFF6FF',
        iconColor: '#2563EB',
        title: `Strong ${insights.strongestSubject.name} performance`,
        description: insights.strongestSubject.explanation || `Grade: ${insights.strongestSubject.finalGrade}/10 — keep maintaining this level.`,
      })
    }

    // Improvement trend
    if (insights?.improvementTrend?.direction) {
      const dir = insights.improvementTrend.direction
      items.push({
        icon: dir === 'UP' ? '📈' : dir === 'DOWN' ? '📉' : '➡️',
        iconBg: dir === 'UP' ? '#ECFDF5' : dir === 'DOWN' ? '#FFF1F2' : '#F1F5F9',
        iconColor: dir === 'UP' ? '#059669' : dir === 'DOWN' ? '#DC2626' : '#64748B',
        title: dir === 'UP' ? 'Improving academic trend' : dir === 'DOWN' ? 'Declining trend detected' : 'Stable academic trajectory',
        description: insights.improvementTrend.reason || 'Semester-over-semester SGPA comparison.',
      })
    }

    // Credits note
    if (creditsCompleted > 0) {
      items.push({
        icon: '📚',
        iconBg: '#F3F0FF',
        iconColor: '#7C3AED',
        title: `${creditsCompleted} credits completed`,
        description: `${Math.round((creditsCompleted / creditsTarget) * 100)}% of ${creditsTarget}-credit degree goal achieved.`,
      })
    }

    return items.slice(0, 5)
  })()

  // ── No prediction state ──────────────────────────────────────
  const noPrediction = !predicted && !loading

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 24,
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 4px rgba(15,23,42,0.04)',
        overflow: 'hidden',
      }}
    >
      {/* ── SECTION 1: Prediction Header ── */}
      <div
        style={{
          padding: '28px 32px',
          borderBottom: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        {/* Left: title + prediction text */}
        <div style={{ flex: 1, minWidth: 260 }}>
          {/* Label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.6px', background: '#F3F0FF', padding: '3px 10px', borderRadius: 99 }}>
              AI Intelligence
            </span>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              ✨ AI Performance Prediction
            </span>
          </div>

          {noPrediction ? (
            /* No prediction yet */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#1E293B', fontFamily: 'Sora, sans-serif', lineHeight: 1.2 }}>
                Ready to predict your CGPA?
              </div>
              <p style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500, maxWidth: 380, lineHeight: 1.5 }}>
                Log at least 2 semesters and generate your AI-powered academic forecast.
              </p>
              {onGeneratePrediction && (
                <button
                  onClick={onGeneratePrediction}
                  style={{
                    marginTop: 4,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 12,
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'Sora, sans-serif',
                    boxShadow: '0 4px 12px rgba(124,58,237,0.25)',
                    width: 'fit-content',
                    transition: 'opacity 0.15s',
                  }}
                >
                  ✨ Generate AI Forecast
                </button>
              )}
            </div>
          ) : loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ width: 200, height: 24, background: '#F1F5F9', borderRadius: 8 }} />
              <div style={{ width: 140, height: 44, background: '#F1F5F9', borderRadius: 12 }} />
              <div style={{ width: 260, height: 14, background: '#F1F5F9', borderRadius: 6 }} />
            </div>
          ) : (
            /* Has prediction */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 14, color: '#64748B', fontWeight: 600 }}>
                You can finish this semester with
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: 48,
                  fontWeight: 800,
                  color: '#7C3AED',
                  lineHeight: 1,
                  letterSpacing: '-1px',
                }}>
                  {predicted}
                </span>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#94A3B8' }}>CGPA</span>
              </div>
              <p style={{ fontSize: 12.5, color: '#94A3B8', fontWeight: 500, maxWidth: 380, lineHeight: 1.5, marginTop: 2 }}>
                AI forecast based on your semester history, subject grades, and performance velocity.
              </p>
            </div>
          )}
        </div>

        {/* Right: animated circle */}
        {!noPrediction && (
          <CircleProgress
            value={loading ? 0 : probability}
            size={128}
            strokeWidth={10}
            color="#7C3AED"
          />
        )}
      </div>

      {/* ── SECTION 2: Prediction Metrics Row ── */}
      <div
        style={{
          padding: '20px 32px',
          borderBottom: '1px solid #F1F5F9',
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        {metrics.map((m, i) => (
          <MetricCard key={i} {...m} />
        ))}
      </div>

      {/* ── SECTION 3: Key Insights ── */}
      <div style={{ padding: '20px 32px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#1E293B', fontFamily: 'Sora, sans-serif' }}>
            Key Insights
          </span>
          {onViewDetails && (
            <button
              onClick={onViewDetails}
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#7C3AED',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              View Detailed Analysis →
            </button>
          )}
        </div>

        {insightItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#CBD5E1', fontSize: 13, fontWeight: 600 }}>
            Add more academic data to generate insights.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {insightItems.map((item, i) => (
              <InsightRow key={i} {...item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
