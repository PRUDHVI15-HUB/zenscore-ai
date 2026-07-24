/**
 * ChatInput.jsx — Fixed Bottom Chat Input Bar (Phase 5)
 *
 * Textarea field, typing character counters, loading states, and submit trigger button.
 * All props/max-length limits/growth hooks untouched.
 */
import React, { useRef, useEffect, useState } from 'react'

const MAX_LENGTH = 500

export default function ChatInput({
  value,
  onChange,
  onSend,
  loading = false,
  placeholder = 'Ask anything about your academics…',
}) {
  const textareaRef = useRef(null)
  const [btnHov, setBtnHov] = useState(false)
  const charCount = value.length
  const canSend = !loading && value.trim().length > 0 && charCount <= MAX_LENGTH

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`
  }, [value])

  // Focus on mount
  useEffect(() => {
    if (!loading) {
      textareaRef.current?.focus()
    }
  }, [loading])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (canSend) onSend?.()
    }
  }

  const handleChange = (e) => {
    if (e.target.value.length <= MAX_LENGTH) {
      onChange?.(e.target.value)
    }
  }

  const nearLimit = charCount >= MAX_LENGTH * 0.85
  const atLimit = charCount >= MAX_LENGTH

  return (
    <div
      style={{
        padding: '16px 20px',
        borderTop: '1px solid #F1F5F9',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
      role="form"
      aria-label="Message input area"
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 12,
        background: '#F8FAFC',
        border: `1px solid ${atLimit ? '#DC2626' : '#E2E8F0'}`,
        borderRadius: 14,
        padding: '10px 14px',
        position: 'relative',
      }}>
        <textarea
          ref={textareaRef}
          id="copilot-chat-input"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={loading ? 'AI is thinking…' : placeholder}
          disabled={loading}
          rows={1}
          maxLength={MAX_LENGTH}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: 13,
            color: '#1E293B',
            resize: 'none',
            fontFamily: 'inherit',
            lineHeight: 1.5,
            padding: 0,
            maxHeight: 140,
            overflowY: 'auto',
          }}
          aria-label="Type your academic question"
          aria-describedby="chat-input-hint chat-char-counter"
          aria-disabled={loading}
          autoComplete="off"
          spellCheck="true"
        />

        {/* Action Panel: Char Counter & Send Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span
            id="chat-char-counter"
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: atLimit ? '#DC2626' : nearLimit ? '#D97706' : '#94A3B8',
            }}
            aria-live="polite"
            aria-atomic="true"
            aria-label={`${charCount} of ${MAX_LENGTH} characters`}
          >
            {charCount}/{MAX_LENGTH}
          </span>

          <button
            type="button"
            onClick={() => canSend && onSend?.()}
            disabled={!canSend}
            onMouseEnter={() => setBtnHov(true)}
            onMouseLeave={() => setBtnHov(false)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: canSend
                ? btnHov ? '#6D28D9' : '#7C3AED'
                : '#F1F5F9',
              color: canSend ? '#fff' : '#94A3B8',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: canSend ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s ease',
            }}
            aria-label={loading ? 'AI is responding, please wait' : 'Send message'}
            aria-disabled={!canSend}
          >
            {loading ? (
              <svg className="chat-send-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      <div id="chat-input-hint" style={{ fontSize: 10.5, color: '#94A3B8', fontWeight: 550, margin: 0, paddingLeft: 4 }}>
        Press <kbd style={{ background: '#F1F5F9', padding: '1px 4px', borderRadius: 4, border: '1px solid #E2E8F0', fontStyle: 'normal' }}>Enter</kbd> to send · <kbd style={{ background: '#F1F5F9', padding: '1px 4px', borderRadius: 4, border: '1px solid #E2E8F0', fontStyle: 'normal' }}>Shift + Enter</kbd> for new line
      </div>
    </div>
  )
}
