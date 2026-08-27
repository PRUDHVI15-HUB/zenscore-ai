import React from 'react'
import { ShieldAlert, AlertTriangle, CheckCircle } from 'lucide-react'

export default function BurnoutCard({ risk = 'Low', color = '#059669', bg = '#F0FDF4', longestSession = 0 }) {
  return (
    <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 24, border: '1px solid #E2E8F0', height: 320, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldAlert size={18} style={{ color }} />
            <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>
              Burnout Risk
            </h3>
          </div>

          <span
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              background: bg,
              color: color,
              border: `1px solid ${color}30`,
              fontSize: 12,
              fontWeight: 800,
              fontFamily: 'Sora, sans-serif'
            }}
          >
            {risk} Risk
          </span>
        </div>

        <div style={{ background: bg, borderRadius: 14, padding: 16, border: `1px solid ${color}20`, marginBottom: 16 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0F172A', marginBottom: 4, fontFamily: 'Sora, sans-serif' }}>
            Risk Status: <span style={{ color }}>{risk} Level</span>
          </div>
          <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5, fontFamily: 'DM Sans, sans-serif' }}>
            {risk === 'Low' && 'Your study pacing and session lengths are well within safe cognitive stamina boundaries.'}
            {risk === 'Medium' && 'Moderate workload detected. Ensure you take 10-minute micro-breaks after sessions.'}
            {risk === 'High' && 'High cognitive strain detected! Multiple long sessions without sufficient recovery.'}
            {risk === 'Critical' && 'Critical fatigue warning! Immediate rest and recovery recommended.'}
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 14, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748B' }}>
        <span>Longest Session: <strong style={{ color: '#0F172A' }}>{longestSession}m</strong></span>
        <span>Status: <strong style={{ color }}>{risk === 'Low' ? 'Safe' : 'Watch'}</strong></span>
      </div>
    </div>
  )
}
