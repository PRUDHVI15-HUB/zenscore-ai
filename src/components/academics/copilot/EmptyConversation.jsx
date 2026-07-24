/**
 * EmptyConversation.jsx — Premium AI Copilot Onboarding screen (Phase 5)
 *
 * Clean white grids, micro-elevations, consistent border radius and colors.
 * All props/callbacks untouched.
 */
import React, { useState } from 'react'

const SUGGESTIONS = [
  { icon: '📈', label: 'Analyze my CGPA', question: 'Analyze my CGPA' },
  { icon: '⚠️', label: 'Why is my health score low?', question: 'Why is my health score low?' },
  { icon: '🎯', label: 'Build a study strategy', question: 'Build a study strategy' },
  { icon: '📚', label: 'Which subjects need attention?', question: 'Which subjects need attention?' },
  { icon: '📅', label: 'Show semester insights', question: 'Show semester insights' },
  { icon: '🔥', label: 'Give me improvement suggestions', question: 'Give me improvement suggestions' },
]

function SuggestionCard({ icon, label, question, onClick, disabled }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? '#FAFBFF' : '#fff',
        border: `1px solid ${hov ? '#C7D2FE' : '#E2E8F0'}`,
        borderRadius: 16,
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        cursor: disabled ? 'not-allowed' : 'pointer',
        textAlign: 'left',
        transition: 'all 0.18s ease',
        transform: hov ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hov ? '0 4px 12px rgba(15,23,42,0.05)' : '0 1px 2px rgba(15,23,42,0.02)',
      }}
      aria-label={`Ask: ${label}`}
    >
      <span style={{ fontSize: 18 }} aria-hidden="true">{icon}</span>
      <span style={{ fontSize: 12.5, fontWeight: 700, color: '#475569' }}>{label}</span>
    </button>
  )
}

export default function EmptyConversation({ onSelectQuestion, disabled = false }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        gap: 28,
        textAlign: 'center',
        minHeight: '440px',
      }}
      role="main"
      aria-label="Start a conversation with the AI Academic Copilot"
    >
      {/* Visual Pulsing Avatar */}
      <div style={{ position: 'relative', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden="true">
        <div style={{
          width: 60,
          height: 60,
          borderRadius: 18,
          background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: '0 8px 24px rgba(124,58,237,0.3)',
          zIndex: 1,
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
            <path d="M8 12h.01M12 12h.01M16 12h.01"/>
          </svg>
        </div>
        {/* Pulsing ring decorators */}
        <div className="empty-conv__pulse empty-conv__pulse--1" style={{ position: 'absolute', borderRadius: '50%', border: '1px solid rgba(124, 58, 237, 0.2)', width: 76, height: 76 }} />
        <div className="empty-conv__pulse empty-conv__pulse--2" style={{ position: 'absolute', borderRadius: '50%', border: '1px solid rgba(124, 58, 237, 0.1)', width: 92, height: 92 }} />
      </div>

      {/* Header Description */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#1E293B', margin: 0 }}>
          Academic AI Copilot
        </h3>
        <p style={{ fontSize: 12.5, color: '#94A3B8', fontWeight: 500, margin: 0, maxWidth: 360, lineHeight: 1.5 }}>
          Ask anything about your academics, CGPA targets, attendance requirements, or custom study strategies.
        </p>
      </div>

      {/* Suggestion Chips Grid */}
      <div style={{ width: '100%', maxWidth: 560 }} aria-label="Quick start options">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          {SUGGESTIONS.map(({ icon, label, question }) => (
            <SuggestionCard
              key={label}
              icon={icon}
              label={label}
              onClick={() => !disabled && onSelectQuestion?.(question)}
              disabled={disabled}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
