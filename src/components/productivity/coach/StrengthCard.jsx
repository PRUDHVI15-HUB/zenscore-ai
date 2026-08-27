import React from 'react'
import { Award, CheckCircle2 } from 'lucide-react'

export default function StrengthCard({ strengths = [] }) {
  return (
    <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 24, border: '1px solid #E2E8F0', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Award size={18} style={{ color: '#059669' }} />
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Your Strengths
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {strengths.map((str, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              background: '#F0FDF4',
              padding: '12px 14px',
              borderRadius: 14,
              border: '1px solid #BBF7D0'
            }}
          >
            <CheckCircle2 size={16} style={{ color: '#166534', flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: 13, color: '#14532D', fontWeight: 600, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.4 }}>
              {str}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
