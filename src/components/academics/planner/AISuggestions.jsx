/**
 * AISuggestions — Priority-sorted recommendation cards.
 * Each card: icon, title, explanation, priority badge, Take Action button.
 */
import React, { useState } from 'react'

const PRIORITY_CONFIG = {
  High:   { color: '#DC2626', bg: '#FFF1F2', border: '#FECDD3', dot: '#DC2626' },
  Medium: { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', dot: '#D97706' },
  Low:    { color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', dot: '#059669' },
}

function SuggestionCard({ suggestion, index }) {
  const [hov, setHov] = useState(false)
  const pCfg = PRIORITY_CONFIG[suggestion.priority] || PRIORITY_CONFIG.Medium

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? '#FAFBFF' : '#fff',
        border: `1px solid ${hov ? '#C7D2FE' : '#E2E8F0'}`,
        borderRadius: 16,
        padding: '16px 18px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        transition: 'all 0.18s ease',
        transform: hov ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hov ? '0 6px 18px rgba(15,23,42,0.07)' : '0 1px 2px rgba(15,23,42,0.03)',
        cursor: 'default',
        opacity: 1,
        animation: `fadeUp 0.3s ease ${index * 60}ms both`,
      }}
    >
      {/* Icon */}
      <div style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        background: '#EEF2FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        flexShrink: 0,
        transition: 'transform 0.18s ease',
        transform: hov ? 'scale(1.08)' : 'scale(1)',
      }}>
        {suggestion.icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>
            {suggestion.title}
          </span>
          <span style={{
            fontSize: 9.5,
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 99,
            background: pCfg.bg,
            color: pCfg.color,
            border: `1px solid ${pCfg.border}`,
            whiteSpace: 'nowrap',
          }}>
            {suggestion.priority}
          </span>
        </div>
        <p style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, lineHeight: 1.4, margin: 0, marginBottom: 10 }}>
          {suggestion.explanation}
        </p>
        <ActionBtn />
      </div>
    </div>
  )
}

function ActionBtn() {
  const [hov, setHov] = useState(false)
  return (
    <button
      type="button"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '5px 14px',
        background: hov ? '#EEF2FF' : '#F8FAFC',
        color: hov ? '#6366F1' : '#475569',
        border: `1px solid ${hov ? '#C7D2FE' : '#E2E8F0'}`,
        borderRadius: 8,
        fontSize: 11,
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
      }}
    >
      Take Action →
    </button>
  )
}

export default function AISuggestions({ suggestions = [] }) {
  if (suggestions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 20px', color: '#CBD5E1', fontSize: 13, fontWeight: 600 }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>✨</div>
        Add academic data to generate AI suggestions.
      </div>
    )
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {suggestions.map((s, i) => (
          <SuggestionCard key={i} suggestion={s} index={i} />
        ))}
      </div>
    </>
  )
}
