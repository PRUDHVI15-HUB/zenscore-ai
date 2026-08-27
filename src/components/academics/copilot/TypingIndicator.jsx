/**
 * TypingIndicator.jsx — Premium Contextual Typing Indicator (Phase 5)
 *
 * Pulsing dots, avatar, and stage transition animation matching ZenScore styling.
 * All logic/STAGES array untouched.
 */
import React, { useState, useEffect } from 'react'
import ZenScoreIcon from '../../common/ZenScoreIcon'

const STAGES = [
  'Analyzing academic record…',
  'Reviewing semester performance…',
  'Calculating insights…',
  'Checking recommendations…',
  'Preparing personalized advice…',
]

export default function TypingIndicator() {
  const [stageIdx, setStageIdx] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setStageIdx(i => (i + 1) % STAGES.length)
        setFade(true)
      }, 250)
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '2px 8px',
        animation: 'msg-slide-fade 0.3s ease forwards',
      }}
      role="status"
      aria-live="polite"
      aria-label="ZenScore AI is thinking"
    >
      {/* Bot Avatar */}
      <ZenScoreIcon size={32} />

      {/* Bubble */}
      <div style={{
        background: '#fff',
        border: '1px solid #E2E8F0',
        borderRadius: '4px 18px 18px 18px',
        padding: '12px 16px',
        boxShadow: '0 1px 3px rgba(15,23,42,0.02)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minWidth: 260,
      }}>
        {/* Pulsing Dots */}
        <div style={{ display: 'flex', gap: 4 }} aria-hidden="true">
          <span className="typing-dot typing-dot--1" style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED' }} />
          <span className="typing-dot typing-dot--2" style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED' }} />
          <span className="typing-dot typing-dot--3" style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED' }} />
        </div>

        {/* Text */}
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: '#94A3B8',
            opacity: fade ? 1 : 0,
            transition: 'opacity 0.25s ease',
          }}
        >
          {STAGES[stageIdx]}
        </span>
      </div>
    </div>
  )
}
