import React from 'react'
import { AlertCircle, ArrowUpRight } from 'lucide-react'

export default function WeaknessCard({ weaknesses = [] }) {
  return (
    <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 24, border: '1px solid #E2E8F0', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <AlertCircle size={18} style={{ color: '#D97706' }} />
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Areas for Growth
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {weaknesses.map((w, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              background: '#FFFBEB',
              padding: '12px 14px',
              borderRadius: 14,
              border: '1px solid #FDE68A'
            }}
          >
            <ArrowUpRight size={16} style={{ color: '#B45309', flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: 13, color: '#78350F', fontWeight: 600, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.4 }}>
              {w}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
