/**
 * AIRecommendations.jsx — Premium Recommendation Action Cards (Phase 5)
 *
 * Each card features: priority left ribbon, large title, confidence score, estimated impact, Action button.
 * All internal expand states and logic preserved.
 */
import React, { useState } from 'react'

const TYPE_CONFIG = {
  critical: {
    ribbon:      '#DC2626',
    border:      '#FEE2E2',
    bg:          '#FFF1F2',
    color:       '#DC2626',
    iconBg:      '#FFF1F2',
    icon:        '🚨',
    btnBg:       'linear-gradient(135deg, #DC2626, #B91C1C)',
    btnHoverBg:  'linear-gradient(135deg, #B91C1C, #991B1B)',
    btnLabel:    'Review Now',
  },
  warning: {
    ribbon:      '#D97706',
    border:      '#FEF3C7',
    bg:          '#FFFBEB',
    color:       '#D97706',
    iconBg:      '#FFFBEB',
    icon:        '⚠️',
    btnBg:       'linear-gradient(135deg, #D97706, #B45309)',
    btnHoverBg:  'linear-gradient(135deg, #B45309, #92400E)',
    btnLabel:    'Start Revision',
  },
  suggestion: {
    ribbon:      '#2563EB',
    border:      '#DBEAFE',
    bg:          '#EFF6FF',
    color:       '#2563EB',
    iconBg:      '#EFF6FF',
    icon:        '💡',
    btnBg:       'linear-gradient(135deg, #2563EB, #1D4ED8)',
    btnHoverBg:  'linear-gradient(135deg, #1D4ED8, #1E40AF)',
    btnLabel:    'Practice Now',
  },
}

function RecommendationCard({ item, idx, isOpen, onToggle }) {
  const [hov, setHov] = useState(false)
  const [btnHov, setBtnHov] = useState(false)
  const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.suggestion

  const handleSmartActionClick = (e) => {
    e.stopPropagation()
    const el = document.getElementById('subject-health-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggle(item.id)
    }
  }

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 20,
        border: `1px solid ${hov ? '#C7D2FE' : '#E2E8F0'}`,
        borderLeft: `5px solid ${cfg.ribbon}`,
        boxShadow: hov ? '0 6px 18px rgba(15,23,42,0.06)' : '0 1px 3px rgba(15,23,42,0.02)',
        transform: hov ? 'translateY(-1px)' : 'translateY(0)',
        transition: 'all 0.18s ease',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      onClick={() => onToggle(item.id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      aria-controls={`recommendation-panel-${item.id}`}
      onKeyDown={handleKeyDown}
    >
      {/* Header Row */}
      <div style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 200, flex: 1 }}>
          {/* Icon wrapper */}
          <div style={{ width: 40, height: 40, borderRadius: 12, background: cfg.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
            {cfg.icon}
          </div>
          {/* Title and message excerpt */}
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
              <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 14.5, fontWeight: 800, color: '#1E293B', margin: 0 }}>
                {item.title}
              </h4>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: '#F3F0FF', color: '#7C3AED', border: '1px solid #DDD6FE' }}>
                {item.subject}
              </span>
            </div>
            <p style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.message}
            </p>
          </div>
        </div>

        {/* Priority Badge & Arrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <span style={{
            fontSize: 9.5,
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 99,
            background: cfg.bg,
            color: cfg.color,
            border: `1px solid ${cfg.border}`,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {item.priority}
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transition: 'transform 0.2s ease',
              transform: isOpen ? 'rotate(180deg)' : 'none',
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Expanded body block */}
      {isOpen && (
        <div
          id={`recommendation-panel-${item.id}`}
          style={{
            padding: '20px 22px',
            background: '#FAFBFF',
            borderTop: '1px solid #F1F5F9',
            cursor: 'default',
          }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Action text */}
            <div>
              <span style={{ fontSize: 9.5, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: 6 }}>
                Action Plan
              </span>
              <p style={{ fontSize: 12.5, fontWeight: 700, color: '#1E293B', background: '#fff', border: '1px solid #E2E8F0', padding: '12px 14px', borderRadius: 12, margin: 0, lineHeight: 1.5 }}>
                👉 {item.action}
              </p>
            </div>

            {/* Bottom Row: metadata stats + primary Action button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', paddingTop: 12, borderTop: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {/* CGPA impact */}
                <div style={{ background: '#fff', border: '1px solid #E2E8F0', padding: '6px 12px', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>CGPA Impact</span>
                  <span style={{ fontSize: 12, fontWeight: 855, color: '#059669' }}>{item.estimatedImpact}</span>
                </div>
                {/* Confidence */}
                <div style={{ background: '#fff', border: '1px solid #E2E8F0', padding: '6px 12px', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Confidence</span>
                  <span style={{ fontSize: 12, fontWeight: 855, color: '#2563EB' }}>{item.confidence}%</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onMouseEnter={() => setBtnHov(true)}
                onMouseLeave={() => setBtnHov(false)}
                onClick={handleSmartActionClick}
                style={{
                  padding: '9px 18px',
                  background: btnHov ? cfg.btnHoverBg : cfg.btnBg,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Sora, sans-serif',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 2px 6px rgba(15,23,42,0.05)',
                }}
              >
                {cfg.btnLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AIRecommendations({ recommendations }) {
  const [expandedIds, setExpandedIds] = useState({})

  if (!recommendations || recommendations.length === 0) {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{ padding: '32px', textAlign: 'center', color: '#94A3B8', fontSize: 13, fontWeight: 600, background: '#fff', borderRadius: 20, border: '1px solid #E2E8F0' }}
      >
        You're doing great! No recommendations at this time.
      </div>
    )
  }

  const toggleExpand = (id) => {
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
      role="region"
      aria-label="AI Recommendations list"
    >
      {recommendations.map((item, idx) => (
        <RecommendationCard
          key={item.id || idx}
          item={item}
          idx={idx}
          isOpen={!!expandedIds[item.id]}
          onToggle={toggleExpand}
        />
      ))}
    </div>
  )
}
