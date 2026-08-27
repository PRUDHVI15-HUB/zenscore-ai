import React from 'react'
import { Calendar, TrendingUp, Clock, Layers } from 'lucide-react'

export default function MonthlyComparisonCard({ monthlyComparison }) {
  const { currentMonth, prevMonth, improvementPct } = monthlyComparison
  const isPositive = parseFloat(improvementPct) >= 0

  return (
    <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderRadius: 20, padding: 24, border: '1px solid var(--border, #E2E8F0)', height: 320 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--text-dark, #0F172A)', margin: 0 }}>
          📅 Monthly Comparison
        </h3>
        <span
          style={{
            padding: '4px 10px',
            borderRadius: 20,
            background: isPositive ? 'rgba(5, 150, 105, 0.15)' : 'rgba(220, 38, 38, 0.15)',
            color: isPositive ? '#10B981' : '#EF4444',
            fontSize: 12,
            fontWeight: 800,
            fontFamily: 'Sora, sans-serif'
          }}
        >
          {isPositive ? `+${improvementPct}%` : `${improvementPct}%`} Improvement
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Current Month */}
        <div style={{ background: 'var(--bg, #F8FAFC)', borderRadius: 16, padding: 16, border: '1px solid var(--border, #E2E8F0)' }}>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted, #64748B)', fontWeight: 700, textTransform: 'uppercase' }}>
            {currentMonth.name}
          </div>
          <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 800, color: '#7C3AED', marginTop: 4 }}>
            {currentMonth.hours} hrs
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-mid, #475569)', marginTop: 4 }}>
            {currentMonth.sessions} Sessions • Avg {currentMonth.avgDuration}m
          </div>
        </div>

        {/* Previous Month */}
        <div style={{ background: 'var(--bg, #F8FAFC)', borderRadius: 16, padding: 16, border: '1px solid var(--border, #E2E8F0)' }}>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted, #64748B)', fontWeight: 700, textTransform: 'uppercase' }}>
            {prevMonth.name}
          </div>
          <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 800, color: 'var(--text-muted, #64748B)', marginTop: 4 }}>
            {prevMonth.hours} hrs
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-mid, #475569)', marginTop: 4 }}>
            {prevMonth.sessions} Sessions • Avg {prevMonth.avgDuration}m
          </div>
        </div>
      </div>

      <div style={{ background: '#F5F3FF', borderRadius: 14, padding: '12px 16px', border: '1px solid #DDD6FE', fontSize: 12.5, color: '#6D28D9', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'DM Sans, sans-serif' }}>
        <TrendingUp size={16} />
        <span>
          {isPositive
            ? `Your study volume increased by ${improvementPct}% compared to last month!`
            : `Keep pushing! Complete a few more sessions to surpass last month's output.`}
        </span>
      </div>
    </div>
  )
}
