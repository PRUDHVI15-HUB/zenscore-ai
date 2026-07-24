/**
 * ProductivitySummary — 4 KPI cards: Study Hours, Completed, Pending, Weekly %
 * Dashboard-style white cards with mini sparklines and trend arrows.
 */
import React, { useState } from 'react'

function TrendArrow({ direction }) {
  if (direction === 'up')
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    )
  if (direction === 'down')
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    )
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function MiniSparkline({ data, color }) {
  const max = Math.max(...data, 1)
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 80
    const y = 20 - (v / max) * 16
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width="80" height="22" viewBox="0 0 80 22">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
    </svg>
  )
}

function ProdCard({ icon, iconBg, iconColor, label, value, unit, trend, trendLabel, sparkData, accentColor }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff',
        borderRadius: 20,
        padding: '20px 22px',
        border: `1px solid ${hov ? '#C7D2FE' : '#E2E8F0'}`,
        boxShadow: hov ? '0 8px 24px rgba(15,23,42,0.07)' : '0 1px 3px rgba(15,23,42,0.03)',
        transform: hov ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 10,
        flex: '1 1 0',
        minWidth: 150,
        cursor: 'default',
      }}
    >
      {/* Top */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </div>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>
          {icon}
        </div>
      </div>
      {/* Value */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 26, fontWeight: 800, color: '#1E293B', lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8' }}>{unit}</span>}
      </div>
      {/* Bottom: trend + sparkline */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <TrendArrow direction={trend} />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8' }}>{trendLabel}</span>
        </div>
        <MiniSparkline data={sparkData} color={accentColor} />
      </div>
    </div>
  )
}

export default function ProductivitySummary({ data = {} }) {
  const {
    studyHours = 3.5,
    completedTasks = 4,
    pendingTasks = 3,
    weeklyProductivity = 72,
  } = data

  const cards = [
    {
      icon: '⏱️', iconBg: '#EFF6FF', iconColor: '#2563EB',
      label: "Today's Study Hours",
      value: studyHours, unit: 'hrs',
      trend: studyHours >= 4 ? 'up' : 'stable',
      trendLabel: studyHours >= 4 ? 'Above target' : 'Near target',
      sparkData: [2, 3, 2.5, 4, 3.5, studyHours],
      accentColor: '#2563EB',
    },
    {
      icon: '✅', iconBg: '#ECFDF5', iconColor: '#059669',
      label: 'Completed Tasks',
      value: completedTasks, unit: 'tasks',
      trend: completedTasks >= 3 ? 'up' : 'down',
      trendLabel: 'Today',
      sparkData: [1, 2, 3, 2, 4, completedTasks],
      accentColor: '#059669',
    },
    {
      icon: '📋', iconBg: '#FFFBEB', iconColor: '#D97706',
      label: 'Pending Tasks',
      value: pendingTasks, unit: 'tasks',
      trend: pendingTasks <= 2 ? 'up' : 'down',
      trendLabel: pendingTasks <= 2 ? 'Almost done' : 'Clear soon',
      sparkData: [5, 4, 3, 4, 3, pendingTasks],
      accentColor: '#D97706',
    },
    {
      icon: '📊', iconBg: '#F3F0FF', iconColor: '#7C3AED',
      label: 'Weekly Productivity',
      value: `${weeklyProductivity}`, unit: '%',
      trend: weeklyProductivity >= 70 ? 'up' : 'down',
      trendLabel: weeklyProductivity >= 70 ? 'On track' : 'Needs boost',
      sparkData: [60, 65, 70, 68, 72, weeklyProductivity],
      accentColor: '#7C3AED',
    },
  ]

  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {cards.map((c, i) => <ProdCard key={i} {...c} />)}
    </div>
  )
}
