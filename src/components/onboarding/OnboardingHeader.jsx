import React from 'react'
import ZenScoreLogo from '../common/ZenScoreLogo'

export default function OnboardingHeader({ currentStep = 1, totalSteps = 9, onSkip }) {
  return (
    <header style={{
      width: '100%',
      padding: '14px clamp(16px, 3vw, 48px) 8px clamp(16px, 3vw, 48px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      maxWidth: 1360,
      margin: '0 auto',
      position: 'relative',
      zIndex: 10,
      flexShrink: 0,
      gap: 8
    }}>
      {/* ── Official Platform Logo ── */}
      <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, flexShrink: 0 }}>
        <ZenScoreLogo size={28} showText={true} to={null} />
      </div>

      {/* ── Center Progress Indicator ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: '#F8FAFC',
        padding: '4px 10px',
        borderRadius: 20,
        border: '1px solid #F1F5F9'
      }}>
        <div style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: '#4F46E5',
          flexShrink: 0
        }} />

        <span style={{
          fontSize: 11.5,
          fontWeight: 700,
          color: '#0F172A',
          fontFamily: 'Sora, sans-serif',
          whiteSpace: 'nowrap'
        }}>
          {currentStep} of {totalSteps}
        </span>

        {/* Hide extra dot rail on narrow screens, show dots on desktop/tablet */}
        <div className="hidden sm:flex" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {Array.from({ length: totalSteps - 1 }).map((_, i) => {
            const stepNum = i + 2
            const isCompleted = stepNum <= currentStep

            return (
              <div
                key={i}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: isCompleted ? '#4F46E5' : '#CBD5E1',
                  transition: 'all 0.25s ease'
                }}
              />
            )
          })}
        </div>
      </div>

      {/* ── Right Skip Button ── */}
      <div>
        {currentStep < totalSteps ? (
          <button
            onClick={onSkip}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              fontSize: 12.5,
              fontWeight: 700,
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: 6,
              transition: 'all 0.15s ease',
              fontFamily: 'DM Sans, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#0F172A'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#64748B'
            }}
          >
            SKIP
          </button>
        ) : (
          <div style={{ width: 44 }} />
        )}
      </div>
    </header>
  )
}
