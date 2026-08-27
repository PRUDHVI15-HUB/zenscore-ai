import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Award } from 'lucide-react'

export default function ProductivityScoreCard({ score = 0, tier = 'Beginner' }) {
  const circleRadius = 54
  const circumference = 2 * Math.PI * circleRadius
  const strokeDashoffset = circumference - (score / 100) * circumference

  const tierColors = {
    Beginner: '#64748B',
    Focused: '#2563EB',
    Consistent: '#7C3AED',
    Elite: '#059669'
  }

  const badgeColor = tierColors[tier] || '#7C3AED'

  return (
    <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderRadius: 20, padding: 24, border: '1px solid var(--border, #E2E8F0)', height: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
        <Zap size={18} style={{ color: '#7C3AED' }} />
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--text-dark, #0F172A)', margin: 0 }}>
          Productivity Score
        </h3>
      </div>

      {/* Progress Circle */}
      <div style={{ position: 'relative', width: 130, height: 130, marginBottom: 14 }}>
        <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="65" cy="65" r={circleRadius} fill="none" stroke="var(--border, #F1F5F9)" strokeWidth="10" />
          <circle
            cx="65"
            cy="65"
            r={circleRadius}
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>

        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 32, fontWeight: 800, color: 'var(--text-dark, #0F172A)', lineHeight: 1 }}>
            {score}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted, #64748B)', fontWeight: 600, marginTop: 2 }}>/ 100</div>
        </div>
      </div>

      {/* Tier Badge */}
      <span
        style={{
          padding: '4px 14px',
          borderRadius: 20,
          background: `${badgeColor}15`,
          color: badgeColor,
          border: `1px solid ${badgeColor}30`,
          fontSize: 12,
          fontWeight: 800,
          fontFamily: 'Sora, sans-serif'
        }}
      >
        🏆 {tier} Tier
      </span>
    </div>
  )
}
