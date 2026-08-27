import React from 'react'
import { Sparkles, CheckCircle2 } from 'lucide-react'

export default function RecommendationsCard({ recommendations = [] }) {
  return (
    <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 24, border: '1px solid #E2E8F0', height: 340, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        <Sparkles size={20} style={{ color: '#059669' }} />
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Health Recommendations
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
        {recommendations.map((rec, idx) => (
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
            <CheckCircle2 size={18} style={{ color: '#166534', flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: 13, color: '#14532D', fontWeight: 600, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.45 }}>
              {rec}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
