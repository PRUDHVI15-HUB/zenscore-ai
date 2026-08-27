import React from 'react'
import { ShieldAlert, HeartPulse } from 'lucide-react'

export default function BurnoutCoachCard({ advice = '', risk = 'Low' }) {
  const riskColors = {
    Low: { color: '#059669', bg: '#F0FDF4', border: '#BBF7D0' },
    Medium: { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
    High: { color: '#F97316', bg: '#FFF7ED', border: '#FFEDD5' },
    Critical: { color: '#DC2626', bg: '#FEF2F2', border: '#FCA5A5' }
  }

  const style = riskColors[risk] || riskColors['Low']

  return (
    <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 24, border: '1px solid #E2E8F0', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <HeartPulse size={18} style={{ color: style.color }} />
          <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Burnout Coach
          </h3>
        </div>

        <span
          style={{
            padding: '3px 10px',
            borderRadius: 20,
            background: style.bg,
            color: style.color,
            border: `1px solid ${style.border}`,
            fontSize: 11.5,
            fontWeight: 800,
            fontFamily: 'Sora, sans-serif'
          }}
        >
          {risk} Risk
        </span>
      </div>

      <div style={{ background: style.bg, borderRadius: 14, padding: 16, border: `1px solid ${style.border}` }}>
        <p style={{ fontSize: 13, color: style.color, fontWeight: 600, lineHeight: 1.5, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
          {advice}
        </p>
      </div>
    </div>
  )
}
