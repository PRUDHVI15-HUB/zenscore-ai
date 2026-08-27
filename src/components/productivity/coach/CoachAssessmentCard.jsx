import React from 'react'
import { Sparkles, Brain, CheckCircle2 } from 'lucide-react'

export default function CoachAssessmentCard({ assessment = '' }) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
        borderRadius: 20,
        padding: 24,
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 20px rgba(124, 58, 237, 0.04)',
        marginBottom: 24
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: '#F3E8FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#7C3AED'
          }}
        >
          <Brain size={18} />
        </div>
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Overall Assessment
        </h3>
      </div>

      <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.6, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
        {assessment}
      </p>
    </div>
  )
}
