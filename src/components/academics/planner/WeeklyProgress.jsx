/**
 * WeeklyProgress — Horizontal Mon–Sun tracker with animated fill bars.
 * Completed days: green. Current day: purple. Upcoming: gray.
 */
import React, { useState, useEffect } from 'react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Map JS getDay() (0=Sun) to our Mon-first index
function getTodayIndex() {
  const d = new Date().getDay() // 0=Sun, 1=Mon … 6=Sat
  return d === 0 ? 6 : d - 1   // Mon=0 … Sun=6
}

function DayPill({ label, state, hours, index, visible }) {
  const isToday = state === 'today'
  const isDone  = state === 'done'

  const bg      = isDone ? '#ECFDF5' : isToday ? '#F3F0FF' : '#F8FAFC'
  const border  = isDone ? '#A7F3D0' : isToday ? '#DDD6FE' : '#E2E8F0'
  const numColor = isDone ? '#059669' : isToday ? '#7C3AED' : '#CBD5E1'
  const barColor = isDone ? '#059669' : isToday ? '#7C3AED' : '#E2E8F0'
  const barFill  = isDone ? 100 : isToday ? hours : 0

  return (
    <div
      style={{
        flex: '1 1 0',
        minWidth: 64,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity 0.3s ease ${index * 60}ms, transform 0.3s ease ${index * 60}ms`,
      }}
    >
      {/* Day label */}
      <span style={{ fontSize: 11, fontWeight: 700, color: isToday ? '#7C3AED' : isDone ? '#059669' : '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
        {label}
      </span>

      {/* Circle indicator */}
      <div style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: bg,
        border: `2px solid ${border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
      }}>
        {isDone ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : isToday ? (
          <span style={{ fontSize: 16 }}>📖</span>
        ) : (
          <span style={{ fontSize: 11, fontWeight: 700, color: '#CBD5E1' }}>—</span>
        )}
      </div>

      {/* Hours studied */}
      <span style={{ fontSize: 11, fontWeight: 700, color: numColor }}>
        {isDone ? `${hours}h` : isToday ? `${hours}h` : '0h'}
      </span>

      {/* Progress bar */}
      <div style={{ width: '100%', height: 4, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${barFill}%`,
          background: barColor,
          borderRadius: 99,
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  )
}

export default function WeeklyProgress({ weekData = [] }) {
  const [visible, setVisible] = useState(false)
  const todayIdx = getTodayIndex()

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  // Build day states
  const days = DAYS.map((label, i) => {
    const d = weekData[i] || {}
    const state = i < todayIdx ? 'done' : i === todayIdx ? 'today' : 'upcoming'
    return { label, state, hours: d.hours ?? (i < todayIdx ? Math.floor(2 + Math.random() * 3) : 0), index: i }
  })

  const completedDays = days.filter(d => d.state === 'done').length
  const totalStudyHours = days.reduce((s, d) => s + (d.state !== 'upcoming' ? d.hours : 0), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Summary row */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '4px 12px', borderRadius: 99, border: '1px solid #A7F3D0' }}>
          ✅ {completedDays} day{completedDays !== 1 ? 's' : ''} completed
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#7C3AED', background: '#F3F0FF', padding: '4px 12px', borderRadius: 99, border: '1px solid #DDD6FE' }}>
          ⏱️ {totalStudyHours.toFixed(0)}h studied this week
        </span>
      </div>

      {/* Day pills */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {days.map((d, i) => (
          <DayPill key={d.label} {...d} visible={visible} />
        ))}
      </div>
    </div>
  )
}
