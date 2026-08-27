import React from 'react'
import { Sparkles, Quote } from 'lucide-react'

export default function MotivationCard({ motivation = '' }) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 50%, #4C1D95 100%)',
        borderRadius: 20,
        padding: 24,
        color: '#FFFFFF',
        boxShadow: '0 8px 24px rgba(124, 58, 237, 0.18)',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <Sparkles size={18} style={{ color: '#FDE047' }} />
        <span
          style={{
            fontSize: 12,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontFamily: 'Sora, sans-serif',
            color: '#DDD6FE'
          }}
        >
          Daily Mindset
        </span>
      </div>

      <p
        style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: 16,
          fontWeight: 700,
          lineHeight: 1.5,
          margin: 0,
          color: '#FFFFFF',
          fontStyle: 'italic'
        }}
      >
        "{motivation}"
      </p>
    </div>
  )
}
