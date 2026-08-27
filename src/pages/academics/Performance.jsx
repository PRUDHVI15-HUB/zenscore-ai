import React from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import AcademicAnalytics from '../../components/academics/AcademicAnalytics'
import { ArrowLeft, TrendingUp, Sparkles } from 'lucide-react'

export default function Performance() {
  const navigate = useNavigate()

  return (
    <AppLayout>
      <div className="container" style={{ padding: '32px 24px', maxWidth: 1140, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
        
        {/* Page Header */}
        <div style={{
          background: 'var(--bg-soft, #FFFFFF)',
          border: '1px solid var(--border, #E2E8F0)',
          borderRadius: 24,
          padding: 24,
          boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: 'rgba(5, 150, 105, 0.12)',
              color: '#059669',
              border: '1px solid rgba(5, 150, 105, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              flexShrink: 0
            }}>
              📊
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  color: '#059669',
                  textTransform: 'uppercase',
                  background: 'rgba(5, 150, 105, 0.12)',
                  padding: '2px 8px',
                  borderRadius: 6,
                  border: '1px solid rgba(5, 150, 105, 0.25)'
                }}>
                  Performance & Trends
                </span>
              </div>
              <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 800, color: 'var(--text-dark, #0F172A)', margin: 0, letterSpacing: '-0.4px' }}>
                Academic Performance
              </h1>
              <p style={{ fontSize: 13, color: 'var(--text-muted, #64748B)', margin: 0, maxWidth: 540, lineHeight: 1.5 }}>
                Track your CGPA, SGPA progression graph, credit completion, strongest semester, and academic trend analytics.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => navigate('/academics')}
              style={{
                padding: '10px 18px',
                fontSize: 12.5,
                fontWeight: 700,
                color: 'var(--text-dark, #334155)',
                background: 'var(--bg, #F1F5F9)',
                border: '1px solid var(--border, #E2E8F0)',
                borderRadius: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s'
              }}
            >
              <ArrowLeft size={14} />
              Back to Academics
            </button>
          </div>
        </div>

        {/* Phase 4 Semester Analytics Dashboard Component */}
        <AcademicAnalytics />

      </div>
    </AppLayout>
  )
}
