import React from 'react'
import { Briefcase, MapPin } from 'lucide-react'

export default function CareerCoachCard({ careerSuggestion = '', career = 'Backend Engineer' }) {
  return (
    <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 24, border: '1px solid #E2E8F0', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Briefcase size={18} style={{ color: '#0284C7' }} />
          <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Career Recommendation
          </h3>
        </div>

        <span
          style={{
            padding: '3px 10px',
            borderRadius: 20,
            background: '#F0F9FF',
            color: '#0284C7',
            border: '1px solid #BAE6FD',
            fontSize: 11.5,
            fontWeight: 800,
            fontFamily: 'Sora, sans-serif'
          }}
        >
          {career}
        </span>
      </div>

      <div style={{ background: '#F0F9FF', borderRadius: 14, padding: 16, border: '1px solid #BAE6FD' }}>
        <p style={{ fontSize: 13, color: '#0369A1', fontWeight: 600, lineHeight: 1.5, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
          {careerSuggestion}
        </p>
      </div>
    </div>
  )
}
