import React, { useEffect } from 'react'

export default function OnboardingSkipModal({ isOpen, onCancel, onConfirm }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: 16
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: 16,
        padding: '28px 24px',
        maxWidth: 420,
        width: '100%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
        textAlign: 'center',
        fontFamily: 'DM Sans, sans-serif'
      }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: '#EFF6FF',
          color: '#4F46E5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          margin: '0 auto 16px'
        }}>
          💡
        </div>

        <h3 style={{
          fontSize: 18,
          fontWeight: 800,
          color: '#0F172A',
          marginBottom: 8,
          fontFamily: 'Sora, sans-serif'
        }}>
          Skip onboarding?
        </h3>

        <p style={{
          fontSize: 14,
          color: '#64748B',
          lineHeight: 1.5,
          marginBottom: 24
        }}>
          You can explore ZenScore AI and all modules anytime directly from your dashboard.
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 8,
              border: '1px solid #E2E8F0',
              background: '#F8FAFC',
              color: '#334155',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#F1F5F9')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#F8FAFC')}
          >
            Continue Onboarding
          </button>

          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 8,
              border: 'none',
              background: '#4F46E5',
              color: '#FFFFFF',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#4338CA')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#4F46E5')}
          >
            Skip & Enter ZenScore
          </button>
        </div>
      </div>
    </div>
  )
}
