/**
 * SuggestedQuestions.jsx — Premium Horizontal Scroll Chips (Phase 5)
 *
 * Horizontal scroll chip list with custom buttons matching dashboard style.
 * All props/logic untouched.
 */
import React, { useState } from 'react'

const DEFAULT_QUESTIONS = [
  'Why is my health score low?',
  'How can I improve my CGPA?',
  'Which subject is highest risk?',
  'Explain my recommendations.',
  'How many credits remain?',
  'What is my average attendance?',
]

function QuestionChip({ question, onSelect, disabled }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      type="button"
      onClick={() => !disabled && onSelect?.(question)}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '6px 14px',
        background: hov ? '#F5F3FF' : '#fff',
        color: hov ? '#7C3AED' : '#475569',
        border: `1px solid ${hov ? '#C7D2FE' : '#E2E8F0'}`,
        borderRadius: 99,
        fontSize: 11.5,
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        whiteSpace: 'nowrap',
        outline: 'none',
      }}
      tabIndex={disabled ? -1 : 0}
      aria-label={`Ask: ${question}`}
    >
      <span style={{ color: '#7C3AED', fontWeight: 800 }} aria-hidden="true">✦</span>
      <span>{question}</span>
    </button>
  )
}

export default function SuggestedQuestions({
  questions = DEFAULT_QUESTIONS,
  onSelect,
  disabled = false
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        padding: '4px 2px 10px',
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE
      }}
      role="group"
      aria-label="Suggested questions"
    >
      {/* Hide scrollbar for Chrome/Safari */}
      <style>{`
        div[aria-label="Suggested questions"]::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {questions.map((q, i) => (
        <QuestionChip
          key={i}
          question={q}
          onSelect={onSelect}
          disabled={disabled}
        />
      ))}
    </div>
  )
}
