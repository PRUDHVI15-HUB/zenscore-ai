import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getAcademicsAnalytics } from '../../services/api'
import { DEFAULT_TOTAL_DEGREE_CREDITS } from '../../constants/academicConstants'
import {
  Award,
  Target,
  Sparkles,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  PieChart,
  Layers
} from 'lucide-react'

export default function AcademicAnalytics({ analyticsData: propData }) {
  const [data, setData] = useState(propData || null)
  const [loading, setLoading] = useState(!propData)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (propData) {
      setData(propData)
      setLoading(false)
      return
    }

    const fetchAnalytics = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await getAcademicsAnalytics()
        if (res.success && res.data) {
          setData(res.data)
        } else {
          setError(res.message || 'Failed to fetch academic analytics.')
        }
      } catch (err) {
        setError(err.message || 'Error connecting to analytics service.')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [propData])

  // Loading Skeletons
  if (loading) {
    return (
      <div style={{ background: 'var(--bg-soft, #FFFFFF)', border: '1px solid var(--border, #E2E8F0)', borderRadius: 24, padding: 24, boxShadow: '0 4px 20px rgba(15,23,42,0.03)', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ height: 24, width: 180, background: 'var(--bg, #F1F5F9)', borderRadius: 8 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {[1, 2, 3, 4].map(n => (
            <div key={n} style={{ height: 80, background: 'var(--bg, #F8FAFC)', borderRadius: 16 }} />
          ))}
        </div>
        <div style={{ height: 200, background: 'var(--bg, #F8FAFC)', borderRadius: 16 }} />
      </div>
    )
  }

  // Handle Empty State
  const hasSemesters = data && data.semesterProgress && data.semesterProgress.length > 0

  if (error || !hasSemesters) {
    return (
      <div style={{ background: 'var(--bg-soft, #FFFFFF)', border: '1px solid var(--border, #E2E8F0)', borderRadius: 24, padding: 36, textAlign: 'center', boxShadow: '0 4px 20px rgba(15,23,42,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(79, 70, 229, 0.12)', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
          <BarChart3 size={20} />
        </div>
        <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: 'var(--text-dark, #0F172A)', margin: 0 }}>
          No Semester Analytics Available
        </h4>
        <p style={{ fontSize: 13, color: 'var(--text-muted, #64748B)', maxWidth: 380, margin: 0 }}>
          {error || 'Upload your first semester memo to unlock AI-powered semester analytics and progression graphs.'}
        </p>
      </div>
    )
  }

  const {
    currentCGPA = 0,
    targetCGPA = null,
    prediction = null,
    creditsCompleted = 0,
    creditsRemaining = DEFAULT_TOTAL_DEGREE_CREDITS,
    completionPercentage = 0,
    semesterProgress = [],
    bestSemester = null,
    worstSemester = null,
    trend = 'Stable',
    summary = ''
  } = data

  // Trend Badge Color Mapping
  let trendColorClass = 'bg-blue-50 text-blue-600 border-blue-200'
  let TrendIcon = Minus
  if (trend === 'Improving') {
    trendColorClass = 'bg-emerald-50 text-emerald-600 border-emerald-200'
    TrendIcon = TrendingUp
  } else if (trend === 'Needs Improvement') {
    trendColorClass = 'bg-amber-50 text-amber-600 border-amber-200'
    TrendIcon = TrendingDown
  }

  // Calculate SVG line points for progress graph
  const chartHeight = 160
  const chartWidth = 500
  const maxSgpa = 10

  const points = semesterProgress.map((sem, idx) => {
    const x = (idx / (Math.max(1, semesterProgress.length - 1))) * (chartWidth - 60) + 30
    const y = chartHeight - (sem.sgpa / maxSgpa) * (chartHeight - 40) - 20
    return { x, y, sgpa: sem.sgpa, label: sem.label }
  })

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`
  }, '')

  const fillD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - 10} L ${points[0].x} ${chartHeight - 10} Z`
    : ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* â”€â”€ SECTION HEADER â”€â”€ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ padding: '4px 8px', borderRadius: 8, background: 'rgba(79, 70, 229, 0.12)', color: '#4F46E5', fontSize: 12 }}>
            <BarChart3 size={20} />
          </span>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.05em', color: '#4F46E5', textTransform: 'uppercase' }}>
            Semester Analytics
          </span>
        </div>
        <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--text-dark, #0F172A)', margin: 0, letterSpacing: '-0.4px' }}>
          Academic Progression & Insights
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted, #64748B)', margin: 0 }}>
          Analytics calculated exclusively from your uploaded semester memos.
        </p>
      </div>

      {/* â”€â”€ 1. ACADEMIC OVERVIEW (4 STAT CARDS) â”€â”€ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        {/* Current CGPA */}
        <div style={{
          background: 'var(--bg-soft, #FFFFFF)',
          borderRadius: 20,
          padding: '20px 24px',
          border: '1px solid var(--border, #E2E8F0)',
          boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted, #64748B)', fontFamily: 'Sora, sans-serif' }}>Current CGPA</span>
            <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#4F46E5' }}>
              {Number(currentCGPA).toFixed(2)}
            </span>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted, #94A3B8)' }}>Cumulative Grade Average</span>
          </div>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: 'rgba(79, 70, 229, 0.12)',
            color: '#4F46E5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Award size={22} strokeWidth={2.2} />
          </div>
        </div>

        {/* Target CGPA */}
        <div style={{
          background: 'var(--bg-soft, #FFFFFF)',
          borderRadius: 20,
          padding: '20px 24px',
          border: '1px solid var(--border, #E2E8F0)',
          boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted, #64748B)', fontFamily: 'Sora, sans-serif' }}>Target CGPA</span>
            <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#2563EB' }}>
              {targetCGPA != null ? Number(targetCGPA).toFixed(2) : '\u2014'}
            </span>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted, #94A3B8)' }}>Target Goal</span>
          </div>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: 'rgba(37, 99, 235, 0.12)',
            color: '#2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Target size={22} strokeWidth={2.2} />
          </div>
        </div>

        {/* Predicted CGPA */}
        <div style={{
          background: 'var(--bg-soft, #FFFFFF)',
          borderRadius: 20,
          padding: '20px 24px',
          border: '1px solid var(--border, #E2E8F0)',
          boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted, #64748B)', fontFamily: 'Sora, sans-serif' }}>Predicted CGPA</span>
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#7C3AED' }}>
                {prediction?.isAvailable ? Number(prediction.predictedCGPA).toFixed(2) : '\u2014'}
              </span>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted, #94A3B8)' }}>
                {prediction?.isAvailable ? `${prediction.confidenceLabel} confidence` : 'Add records to forecast'}
              </span>
            </div>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'rgba(124, 58, 237, 0.12)',
              color: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Sparkles size={22} strokeWidth={2.2} />
            </div>
          </div>

          {/* Graduation Scenario Range Projection */}
          {prediction?.isAvailable && prediction?.scenarioProjection && (
            <div style={{
              background: 'var(--bg, #F8FAFC)',
              borderRadius: 12,
              padding: '10px 12px',
              border: '1px solid var(--border, #E2E8F0)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#6D28D9', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Scenario Range
                </span>
                {prediction.scenarioProjection.hasHistory ? (
                  <span style={{ fontSize: 10, fontWeight: 600, color: '#059669', background: 'rgba(5, 150, 105, 0.1)', padding: '2px 6px', borderRadius: 4 }}>
                    ±{prediction.scenarioProjection.standardDeviation} SD
                  </span>
                ) : (
                  <span style={{ fontSize: 10, fontWeight: 600, color: '#D97706', background: 'rgba(217, 119, 6, 0.1)', padding: '2px 6px', borderRadius: 4 }}>
                    {prediction.scenarioProjection.flag || 'insufficient history'}
                  </span>
                )}
              </div>

              {prediction.scenarioProjection.hasHistory ? (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-dark, #0F172A)' }}>
                    {prediction.scenarioProjection.low.toFixed(2)} – {prediction.scenarioProjection.high.toFixed(2)}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted, #64748B)' }}>
                    (Exp: {prediction.scenarioProjection.expected.toFixed(2)})
                  </span>
                </div>
              ) : (
                <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-mid, #475569)' }}>
                  Baseline: {prediction.predictedCGPA?.toFixed(2) || '\u2014'} (insufficient history)
                </span>
              )}
            </div>
          )}
        </div>

        {/* Credits Earned */}
        <div style={{
          background: 'var(--bg-soft, #FFFFFF)',
          borderRadius: 20,
          padding: '20px 24px',
          border: '1px solid var(--border, #E2E8F0)',
          boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted, #64748B)', fontFamily: 'Sora, sans-serif' }}>Credits Earned</span>
            <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#059669' }}>
              {creditsCompleted}
            </span>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted, #94A3B8)' }}>Total Credits Completed</span>
          </div>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: 'rgba(5, 150, 105, 0.12)',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <GraduationCap size={22} strokeWidth={2.2} />
          </div>
        </div>
      </div>

      {/* â”€â”€ 2 & 3. SEMESTER PROGRESS GRAPH & CREDITS PROGRESS â”€â”€ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        {/* Semester Progress Graph */}
        <div style={{
          gridColumn: 'span 2 / span 2',
          background: 'var(--bg-soft, #FFFFFF)',
          border: '1px solid var(--border, #E2E8F0)',
          borderRadius: 24,
          padding: 24,
          boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 800, color: 'var(--text-dark, #0F172A)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <BarChart3 size={18} style={{ color: '#4F46E5' }} />
                SGPA Progression Graph
              </h3>
              <span style={{ fontSize: 12, color: 'var(--text-muted, #64748B)' }}>Semester-wise SGPA trajectory</span>
            </div>

            {/* Performance Trend Badge */}
            <div style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(4, 120, 87, 0.15)', color: '#10B981', border: '1px solid rgba(4, 120, 87, 0.3)' }}>
              <TrendIcon size={14} />
              <span>{trend}</span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div style={{ width: '100%', overflowX: 'auto', padding: '8px 0' }}>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: 180, overflow: 'visible' }}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Background horizontal grid lines */}
              {[2, 4, 6, 8, 10].map(val => {
                const y = chartHeight - (val / 10) * (chartHeight - 40) - 20
                return (
                  <line
                    key={val}
                    x1="20"
                    y1={y}
                    x2={chartWidth - 20}
                    y2={y}
                    stroke="var(--border, #F1F5F9)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                )
              })}

              {/* Gradient Area Fill */}
              {fillD && <path d={fillD} fill="url(#chartGradient)" />}

              {/* Main Curve Line */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data Points */}
              {points.map((pt, i) => (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="6"
                    fill="var(--bg-soft, #FFFFFF)"
                    stroke="#4F46E5"
                    strokeWidth="3"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 12}
                    textAnchor="middle"
                    fill="var(--text-dark, #0F172A)"
                    fontSize="11"
                    fontWeight="800"
                    fontFamily="Sora, sans-serif"
                  >
                    {pt.sgpa.toFixed(2)}
                  </text>
                  <text
                    x={pt.x}
                    y={chartHeight - 2}
                    textAnchor="middle"
                    fill="var(--text-muted, #64748B)"
                    fontSize="10"
                    fontWeight="600"
                  >
                    {pt.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Degree Credits Progress Card */}
        <div style={{
          background: 'var(--bg-soft, #FFFFFF)',
          border: '1px solid var(--border, #E2E8F0)',
          borderRadius: 24,
          padding: 24,
          boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 16
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 800, color: 'var(--text-dark, #0F172A)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <PieChart size={18} style={{ color: '#059669' }} />
              Degree Credits Progress
            </h3>
            <span style={{ fontSize: 12, color: 'var(--text-muted, #64748B)' }}>Degree completion percentage</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px 0', gap: 12 }}>
            <div style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border, #F1F5F9)" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="10"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * Math.min(100, completionPercentage)) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div style={{ position: 'absolute', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--text-dark, #0F172A)' }}>
                  {completionPercentage}%
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted, #64748B)' }}>Complete</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border, #F1F5F9)', paddingTop: 12, fontSize: 12 }}>
            <span style={{ color: 'var(--text-muted, #64748B)', fontWeight: 600 }}>Earned: <strong style={{ color: 'var(--text-dark, #0F172A)' }}>{creditsCompleted}</strong></span>
            <span style={{ color: 'var(--text-muted, #64748B)', fontWeight: 600 }}>Remaining: <strong style={{ color: 'var(--text-dark, #0F172A)' }}>{creditsRemaining}</strong></span>
          </div>
        </div>
      </div>

      {/* â”€â”€ 4 & 5. STRONGEST / WEAKEST SEMESTER & TREND SUMMARY â”€â”€ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
        {/* Strongest Semester */}
        <div style={{ background: 'var(--bg-soft, #FFFFFF)', border: '1px solid var(--border, #E2E8F0)', borderRadius: 20, padding: 20, boxShadow: '0 4px 20px rgba(15,23,42,0.03)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(5, 150, 105, 0.12)', padding: '3px 8px', borderRadius: 6, width: 'fit-content', border: '1px solid rgba(5, 150, 105, 0.25)' }}>
            <Sparkles size={13} style={{ display: 'inline', marginRight: 4 }} /> Strongest Semester
          </span>
          {bestSemester ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: 'var(--text-dark, #0F172A)' }}>
                Semester {bestSemester.semesterNumber}
              </span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: '#059669' }}>
                Peak SGPA: {bestSemester.sgpa.toFixed(2)}
              </span>
            </div>
          ) : (
            <span style={{ fontSize: 12, color: 'var(--text-muted, #94A3B8)' }}>No records evaluated</span>
          )}
        </div>

        {/* Weakest Semester */}
        <div style={{ background: 'var(--bg-soft, #FFFFFF)', border: '1px solid var(--border, #E2E8F0)', borderRadius: 20, padding: 20, boxShadow: '0 4px 20px rgba(15,23,42,0.03)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(217, 119, 6, 0.12)', padding: '3px 8px', borderRadius: 6, width: 'fit-content', border: '1px solid rgba(217, 119, 6, 0.25)' }}>
            <AlertTriangle size={13} style={{ display: "inline", marginRight: 4 }} /> Needs Focus Term
          </span>
          {worstSemester ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: 'var(--text-dark, #0F172A)' }}>
                Semester {worstSemester.semesterNumber}
              </span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: '#D97706' }}>
                Lowest SGPA: {worstSemester.sgpa.toFixed(2)}
              </span>
            </div>
          ) : (
            <span style={{ fontSize: 12, color: 'var(--text-muted, #94A3B8)' }}>No records evaluated</span>
          )}
        </div>

        {/* Performance Trend Summary */}
        <div style={{ background: 'var(--bg-soft, #FFFFFF)', border: '1px solid var(--border, #E2E8F0)', borderRadius: 20, padding: 20, boxShadow: '0 4px 20px rgba(15,23,42,0.03)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(79, 70, 229, 0.12)', padding: '3px 8px', borderRadius: 6, width: 'fit-content', border: '1px solid rgba(79, 70, 229, 0.25)' }}>
            <TrendingUp size={13} style={{ display: 'inline', marginRight: 4 }} /> Academic Summary
          </span>
          <p style={{ fontSize: 12.5, color: 'var(--text-mid, #334155)', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
            {summary}
          </p>
        </div>
      </div>
    </div>
  )
}
