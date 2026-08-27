import React from 'react'
import { Sparkles, CheckCircle2 } from 'lucide-react'

export default function PersonalInsightsCard({ insights = [] }) {
  return (
    <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderRadius: 20, padding: 24, border: '1px solid var(--border, #E2E8F0)', height: 320 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        <Sparkles size={20} style={{ color: '#7C3AED' }} />
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--text-dark, #0F172A)', margin: 0 }}>
          Personal Insights
        </h3>
      </div>

      {insights.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {insights.map((insight, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                background: 'var(--bg, #F8FAFC)',
                padding: '12px 14px',
                borderRadius: 14,
                border: '1px solid var(--border, #E2E8F0)'
              }}
            >
              <CheckCircle2 size={18} style={{ color: '#059669', flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontSize: 13, color: 'var(--text-mid, #334155)', fontWeight: 600, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.4 }}>
                {insight}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ fontSize: 13, color: 'var(--text-muted, #64748B)', textAlign: 'center', paddingTop: 40 }}>
          Complete more sessions to generate personal insights.
        </div>
      )}
    </div>
  )
}
