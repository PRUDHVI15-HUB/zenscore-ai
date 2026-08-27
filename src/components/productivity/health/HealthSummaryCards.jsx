import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Activity, Flame, ShieldAlert } from 'lucide-react'

export default function HealthSummaryCards({ data }) {
  const cards = [
    {
      title: 'Focus Health Score',
      val: `${data.healthScore} / 100`,
      sub: data.healthTier,
      icon: Heart,
      color: data.healthColor,
      bg: `${data.healthColor}15`
    },
    {
      title: 'Consistency Score',
      val: `${data.consistencyScore} / 100`,
      sub: `${data.studyDaysThisWeek} / 7 Days Studied`,
      icon: Activity,
      color: '#7C3AED',
      bg: '#F3E8FF'
    },
    {
      title: 'Burnout Risk',
      val: data.burnoutRisk,
      sub: 'Based on workload & breaks',
      icon: ShieldAlert,
      color: data.burnoutColor,
      bg: data.burnoutBg
    },
    {
      title: 'Recovery Score',
      val: `${data.recoveryScore} / 100`,
      sub: 'Session spacing & balance',
      icon: Flame,
      color: '#2563EB',
      bg: '#EFF6FF'
    }
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
      {cards.map((c) => {
        const CIcon = c.icon
        return (
          <motion.div
            key={c.title}
            whileHover={{ translateY: -2 }}
            style={{
              background: '#FFFFFF',
              borderRadius: 18,
              padding: '20px',
              border: `1px solid ${c.color}25`,
              boxShadow: '0 2px 12px rgba(15, 23, 42, 0.03)',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
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
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: c.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: c.color
                }}
              >
                <CIcon size={18} />
              </div>
            </div>

            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 800, color: '#0F172A' }}>
              {c.val}
            </div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 4, fontFamily: 'DM Sans, sans-serif' }}>
              {c.sub}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
