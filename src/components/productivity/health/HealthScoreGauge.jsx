import React from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

export default function HealthScoreGauge({ score = 0, tier = 'Average', color = '#7C3AED' }) {
  const circleRadius = 54
  const circumference = 2 * Math.PI * circleRadius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 24, border: '1px solid #E2E8F0', height: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
        <Heart size={18} style={{ color }} />
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Focus Health Gauge
        </h3>
      </div>

      {/* Radial SVG Circle */}
      <div style={{ position: 'relative', width: 130, height: 130, marginBottom: 14 }}>
        <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="65" cy="65" r={circleRadius} fill="none" stroke="#F1F5F9" strokeWidth="10" />
          <circle
            cx="65"
            cy="65"
            r={circleRadius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>

        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 32, fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
            {score}
          </div>
          <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginTop: 2 }}>/ 100</div>
        </div>
      </div>

      {/* Tier Badge */}
      <span
        style={{
          padding: '4px 14px',
          borderRadius: 20,
          background: `${color}15`,
          color: color,
          border: `1px solid ${color}30`,
          fontSize: 12,
          fontWeight: 800,
          fontFamily: 'Sora, sans-serif'
        }}
      >
        💚 {tier} Health
      </span>
    </div>
  )
}
