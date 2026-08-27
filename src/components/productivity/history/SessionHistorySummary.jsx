import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Layers, Clock, TrendingUp, Award } from 'lucide-react'

export default function SessionHistorySummary({ stats }) {
  const cards = [
    {
      title: "Today's Sessions",
      val: stats.todaySessions,
      icon: Calendar,
      color: '#7C3AED',
      bg: '#F3E8FF'
    },
    {
      title: 'Total Sessions',
      val: stats.totalSessions,
      icon: Layers,
      color: '#2563EB',
      bg: '#EFF6FF'
    },
    {
      title: 'Total Focus Hours',
      val: stats.totalFocusHours,
      icon: Clock,
      color: '#059669',
      bg: '#F0FDF4'
    },
    {
      title: 'Avg Session Time',
      val: stats.avgSessionTime,
      icon: TrendingUp,
      color: '#D97706',
      bg: '#FFFBEB'
    },
    {
      title: 'Longest Session',
      val: stats.longestSession,
      icon: Award,
      color: '#EC4899',
      bg: '#FDF2F8'
    }
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
      {cards.map((c) => {
        const CIcon = c.icon
        return (
          <motion.div
            key={c.title}
            whileHover={{ translateY: -2 }}
            style={{
              background: 'var(--bg-soft, #FFFFFF)',
              borderRadius: 18,
              padding: '18px 20px',
              border: '1px solid var(--border, #E2E8F0)',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: c.color,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  fontFamily: 'Sora, sans-serif'
                }}
              >
                {c.title}
              </span>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CIcon size={18} style={{ color: c.color }} />
              </div>
            </div>

            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 800, color: 'var(--text-dark, #0F172A)' }}>
              {c.val}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
