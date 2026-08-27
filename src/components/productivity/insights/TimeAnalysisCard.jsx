import React from 'react'
import { Sun, Sunset, Moon, Coffee } from 'lucide-react'

export default function TimeAnalysisCard({ timeAnalysis }) {
  const BLOCK_ICONS = {
    Morning: Sun,
    Afternoon: Coffee,
    Evening: Sunset,
    Night: Moon
  }

  const BLOCK_COLORS = {
    Morning: { color: '#D97706', bg: '#FFFBEB' },
    Afternoon: { color: '#0284C7', bg: '#F0F9FF' },
    Evening: { color: '#7C3AED', bg: '#F3E8FF' },
    Night: { color: '#EC4899', bg: '#FDF2F8' }
  }

  return (
    <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderRadius: 20, padding: 24, border: '1px solid var(--border, #E2E8F0)', height: 320 }}>
      <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--text-dark, #0F172A)', marginBottom: 20 }}>
        🌅 Time of Day Distribution
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {timeAnalysis.map((ta) => {
          const Icon = BLOCK_ICONS[ta.block] || Sun
          const style = BLOCK_COLORS[ta.block] || { color: '#7C3AED', bg: '#F3E8FF' }
          return (
            <div key={ta.block}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: style.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: style.color }}>
                    <Icon size={15} />
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--text-dark, #0F172A)', fontFamily: 'Sora, sans-serif' }}>{ta.block}</span>
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: style.color }}>
                  {ta.hours} hrs ({ta.percentage}%)
                </span>
              </div>

              <div style={{ height: 7, background: 'var(--bg, #F1F5F9)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${ta.percentage}%`, background: style.color, borderRadius: 4, transition: 'width 0.5s ease' }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
