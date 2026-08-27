import React from 'react'
import { Layers, AlertTriangle } from 'lucide-react'

export default function StudyBalanceCard({ studyBalance = [], skewedCategory = null }) {
  return (
    <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 24, border: '1px solid #E2E8F0', height: 320, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Layers size={18} style={{ color: '#7C3AED' }} />
            <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>
              Study Balance Analysis
            </h3>
          </div>

          <span
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              background: skewedCategory ? '#FEF2F2' : '#F0FDF4',
              color: skewedCategory ? '#DC2626' : '#166534',
              fontSize: 11.5,
              fontWeight: 800,
              fontFamily: 'Sora, sans-serif'
            }}
          >
            {skewedCategory ? 'Skewed Focus' : 'Balanced'}
          </span>
        </div>

        {/* Skew Warning Banner */}
        {skewedCategory && (
          <div style={{ background: '#FEF2F2', borderRadius: 14, padding: '12px 14px', border: '1px solid #FCA5A5', marginBottom: 14, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <AlertTriangle size={18} style={{ color: '#DC2626', flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: 12, color: '#991B1B', lineHeight: 1.45, fontFamily: 'DM Sans, sans-serif' }}>
              <strong>Warning:</strong> {skewedCategory} accounts for over 70% of your total study time. Consider diversifying your focus across other modules.
            </div>
          </div>
        )}

        {/* Top 4 Categories List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {studyBalance
            .filter((sb) => sb.minutes > 0)
            .slice(0, 3)
            .map((sb) => (
              <div key={sb.category}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{sb.category}</span>
                  <span style={{ fontWeight: 700, color: '#7C3AED' }}>
                    {(sb.minutes / 60).toFixed(1)}h ({sb.percentage}%)
                  </span>
                </div>
                <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${sb.percentage}%`, background: '#7C3AED', borderRadius: 3 }} />
                </div>
              </div>
            ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 12, fontSize: 11.5, color: '#64748B' }}>
        Categories Tracked: <strong style={{ color: '#0F172A' }}>{studyBalance.filter((s) => s.minutes > 0).length} Modules</strong>
      </div>
    </div>
  )
}
