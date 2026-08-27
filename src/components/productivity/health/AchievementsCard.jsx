import React from 'react'
import { Trophy, CheckCircle2, Lock } from 'lucide-react'

export default function AchievementsCard({ achievements = [] }) {
  return (
    <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 24, border: '1px solid #E2E8F0', height: 340, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        <Trophy size={20} style={{ color: '#D97706' }} />
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Focus Achievements
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, overflowY: 'auto' }}>
        {achievements.map((ach) => (
          <div
            key={ach.id}
            style={{
              background: ach.unlocked ? '#FFFBEB' : '#F8FAFC',
              borderRadius: 16,
              padding: 14,
              border: ach.unlocked ? '1px solid #FDE68A' : '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              opacity: ach.unlocked ? 1 : 0.65,
              transition: 'all 0.2s ease'
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: ach.unlocked ? '#F59E0B' : '#CBD5E1',
                color: '#FFFFFF',
                fontSize: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {ach.icon}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 12.5, fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {ach.title}
                </span>
                {ach.unlocked ? (
                  <CheckCircle2 size={14} style={{ color: '#D97706', flexShrink: 0 }} />
                ) : (
                  <Lock size={12} style={{ color: '#94A3B8', flexShrink: 0 }} />
                )}
              </div>

              <div style={{ fontSize: 11, color: '#64748B', marginTop: 2, fontFamily: 'DM Sans, sans-serif' }}>
                {ach.desc}
              </div>

              <div style={{ fontSize: 10.5, fontWeight: 700, color: ach.unlocked ? '#B45309' : '#94A3B8', marginTop: 4 }}>
                {ach.unlocked ? 'UNLOCKED' : ach.progress}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
