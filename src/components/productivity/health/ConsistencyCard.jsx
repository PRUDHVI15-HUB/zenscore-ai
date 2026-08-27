import React from 'react'
import { Activity, Flame, CheckCircle2, Calendar } from 'lucide-react'

export default function ConsistencyCard({ score = 0, currentStreak = 0, bestStreak = 0, studyDaysThisWeek = 0, completionRate = 0 }) {
  return (
    <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 24, border: '1px solid #E2E8F0', height: 320, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={18} style={{ color: '#7C3AED' }} />
            <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>
              Consistency Tracker
            </h3>
          </div>

          <span
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              background: '#F3E8FF',
              color: '#7C3AED',
              fontSize: 12,
              fontWeight: 800,
              fontFamily: 'Sora, sans-serif'
            }}
          >
            {score}% Consistency
          </span>
        </div>

        {/* GitHub-style Streak Banner */}
        <div style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)', borderRadius: 16, padding: '16px', border: '1px solid #FED7AA', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: '#F97316', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={22} fill="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#9A3412' }}>
                {currentStreak} Day Streak
              </div>
              <div style={{ fontSize: 11.5, color: '#C2410C', fontWeight: 600 }}>
                Best Streak: {bestStreak} Days 🏆
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
            <span style={{ color: '#64748B' }}>Study Days This Week:</span>
            <span style={{ fontWeight: 700, color: '#0F172A', fontFamily: 'Sora, sans-serif' }}>{studyDaysThisWeek} / 7 Days</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
            <span style={{ color: '#64748B' }}>Completion Rate:</span>
            <span style={{ fontWeight: 700, color: '#059669', fontFamily: 'Sora, sans-serif' }}>{completionRate}%</span>
          </div>
        </div>
      </div>

      <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden', width: '100%' }}>
        <div style={{ height: '100%', width: `${score}%`, background: 'linear-gradient(90deg, #7C3AED, #2563EB)', borderRadius: 3 }} />
      </div>
    </div>
  )
}
