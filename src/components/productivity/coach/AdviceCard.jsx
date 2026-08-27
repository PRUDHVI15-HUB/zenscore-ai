import React from 'react'
import { Calendar, Compass } from 'lucide-react'

export default function AdviceCard({ advice = '' }) {
  return (
    <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 24, border: '1px solid #E2E8F0', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <Compass size={18} style={{ color: '#2563EB' }} />
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Today's Focus Advice
        </h3>
      </div>

      <div style={{ background: '#EFF6FF', borderRadius: 14, padding: 16, border: '1px solid #BFDBFE' }}>
        <p style={{ fontSize: 13.5, color: '#1E40AF', fontWeight: 600, lineHeight: 1.5, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
          {advice}
        </p>
      </div>
    </div>
  )
}
