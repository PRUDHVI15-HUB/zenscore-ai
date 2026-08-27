import React from 'react'
import { Flame, RefreshCw, Zap, Coffee } from 'lucide-react'

export default function RecoveryCard({ score = 0, pausedSessions = 0, avgMinutes = 0 }) {
  let recoveryLabel = 'Optimal Recovery'
  let recoveryColor = '#059669'

  if (score < 50) {
    recoveryLabel = 'Needs Recovery Rest'
    recoveryColor = '#DC2626'
  } else if (score < 75) {
    recoveryLabel = 'Moderate Recovery'
    recoveryColor = '#D97706'
  }

  return (
    <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 24, border: '1px solid #E2E8F0', height: 320, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Coffee size={18} style={{ color: '#2563EB' }} />
            <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>
              Recovery & Spacing
            </h3>
          </div>

          <span
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              background: '#EFF6FF',
              color: '#2563EB',
              fontSize: 12,
              fontWeight: 800,
              fontFamily: 'Sora, sans-serif'
            }}
          >
            {score} / 100
          </span>
        </div>

        <div style={{ background: '#F8FAFC', borderRadius: 16, padding: 18, border: '1px solid #E2E8F0', marginBottom: 16 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0F172A', marginBottom: 4, fontFamily: 'Sora, sans-serif' }}>
            Recovery Status: <span style={{ color: recoveryColor }}>{recoveryLabel}</span>
          </div>
          <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5, fontFamily: 'DM Sans, sans-serif' }}>
            Measures break frequency, session spacing, and work-rest distribution.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
            <span style={{ color: '#64748B' }}>Average Session Length:</span>
            <span style={{ fontWeight: 700, color: '#0F172A', fontFamily: 'Sora, sans-serif' }}>{avgMinutes} mins</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
            <span style={{ color: '#64748B' }}>Paused / Interrupted Sessions:</span>
            <span style={{ fontWeight: 700, color: '#2563EB', fontFamily: 'Sora, sans-serif' }}>{pausedSessions}</span>
          </div>
        </div>
      </div>

      <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden', width: '100%' }}>
        <div style={{ height: '100%', width: `${score}%`, background: recoveryColor, borderRadius: 3 }} />
      </div>
    </div>
  )
}
