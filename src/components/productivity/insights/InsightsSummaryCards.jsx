import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Layers, TrendingUp, Award, Calendar, BookOpen, Zap, Target } from 'lucide-react'

export default function InsightsSummaryCards({ metrics }) {
  const cards = [
    { label: 'Total Focus Time', val: metrics.totalFocusTime, icon: Clock, color: '#7C3AED', bg: '#F3E8FF' },
    { label: 'Total Sessions', val: metrics.totalSessions, icon: Layers, color: '#2563EB', bg: '#EFF6FF' },
    { label: 'Avg Session Duration', val: metrics.avgSessionDuration, icon: TrendingUp, color: '#059669', bg: '#F0FDF4' },
    { label: 'Longest Session', val: metrics.longestSession, icon: Award, color: '#EC4899', bg: '#FDF2F8' },
    { label: 'Most Productive Day', val: metrics.mostProductiveDay, icon: Calendar, color: '#D97706', bg: '#FFFBEB' },
    { label: 'Most Studied Module', val: metrics.mostStudiedModule, icon: BookOpen, color: '#0284C7', bg: '#F0F9FF' },
    { label: 'Current Week Focus', val: metrics.currentWeekFocusTime, icon: Zap, color: '#9333EA', bg: '#FAF5FF' },
    { label: 'Current Month Focus', val: metrics.currentMonthFocusTime, icon: Target, color: '#16A34A', bg: '#F0FDF4' }
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16, marginBottom: 28 }}>
      {cards.map((c) => {
        const CIcon = c.icon
        return (
          <motion.div
            key={c.label}
            whileHover={{ translateY: -2 }}
            style={{
              background: '#FFFFFF',
              borderRadius: 18,
              padding: '18px 20px',
              border: `1px solid ${c.color}25`,
              boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: c.color,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  fontFamily: 'Sora, sans-serif'
                }}
              >
                {c.label}
              </span>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: c.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: c.color
                }}
              >
                <CIcon size={16} />
              </div>
            </div>

            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, color: '#0F172A' }}>
              {c.val}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
