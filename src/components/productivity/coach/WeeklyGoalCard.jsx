import React from 'react'
import { Target, Flag } from 'lucide-react'

export default function WeeklyGoalCard({ goal = '' }) {
  return (
    <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 24, border: '1px solid #E2E8F0', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <Target size={18} style={{ color: '#7C3AED' }} />
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Weekly Target Goal
        </h3>
      </div>

      <div style={{ background: '#F3E8FF', borderRadius: 14, padding: 16, border: '1px solid #DDD6FE' }}>
        <p style={{ fontSize: 13.5, color: '#6D28D9', fontWeight: 700, lineHeight: 1.5, margin: 0, fontFamily: 'Sora, sans-serif' }}>
          🎯 {goal}
        </p>
      </div>
    </div>
  )
}
