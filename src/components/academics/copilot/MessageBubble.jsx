/**
 * MessageBubble.jsx — Premium Message Bubbles (Phase 5)
 *
 * Rich markdown-like rendering, smart action short links, follow-up chip list,
 * copy / regenerate actions, and dynamic streaming animation.
 * All props/callbacks/logic untouched.
 */
import React, { useState, useEffect, memo } from 'react'

const CLASSIFICATION_MAP = {
  'CGPA':             { label: 'CGPA',         color: '#2563EB', bg: '#EFF6FF' },
  'Attendance':       { label: 'Attendance',    color: '#059669', bg: '#ECFDF5' },
  'Health Score':     { label: 'Health Score',  color: '#7C3AED', bg: '#F5F3FF' },
  'Subject':          { label: 'Subject',       color: '#D97706', bg: '#FFFBEB' },
  'Semester':         { label: 'Semester',      color: '#0891B2', bg: '#ECFEFF' },
  'Recommendation':   { label: 'Advice',        color: '#DB2777', bg: '#FDF2F8' },
  'General Academic': { label: 'Academic',      color: '#4F46E5', bg: '#EEF2FF' },
}

function parseInline(text) {
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|https?:\/\/[^\s]+)/g)
  return tokens.map((tok, i) => {
    if (tok.startsWith('**') && tok.endsWith('**'))
      return <strong key={i} style={{ fontWeight: 800, color: '#1E293B' }}>{tok.slice(2, -2)}</strong>
    if (tok.startsWith('*') && tok.endsWith('*') && tok.length > 2)
      return <em key={i} style={{ fontStyle: 'italic' }}>{tok.slice(1, -1)}</em>
    if (tok.startsWith('`') && tok.endsWith('`') && tok.length > 2)
      return <code key={i} style={{ background: '#F1F5F9', padding: '2px 5px', borderRadius: 4, fontFamily: 'monospace', fontSize: '90%', color: '#E11D48' }}>{tok.slice(1, -1)}</code>
    if (/^https?:\/\//.test(tok))
      return <a key={i} href={tok} style={{ color: '#7C3AED', textDecoration: 'underline', fontWeight: 600 }} target="_blank" rel="noopener noreferrer">{tok}</a>
    return tok
  })
}

function RenderMarkdown({ text }) {
  if (!text) return null
  const lines = text.split('\n')
  const nodes = []
  let i = 0

  while (i < lines.length) {
    const raw = lines[i]
    const trimmed = raw.trim()

    if (trimmed === '') {
      nodes.push(<div key={i} style={{ height: 8 }} />)
      i++
      continue
    }

    // Numbered list
    const numMatch = trimmed.match(/^(\d+)[.)]\s+(.*)/)
    if (numMatch) {
      const listItems = []
      while (i < lines.length) {
        const t2 = lines[i].trim()
        const m2 = t2.match(/^(\d+)[.)]\s+(.*)/)
        if (!m2) break
        listItems.push(
          <li key={i} style={{ display: 'flex', gap: 6, marginBottom: 4, alignItems: 'flex-start' }}>
            <span style={{ fontWeight: 800, color: '#7C3AED', flexShrink: 0 }}>{m2[1]}.</span>
            <span>{parseInline(m2[2])}</span>
          </li>
        )
        i++
      }
      nodes.push(<ol key={`ol-${i}`} style={{ listStyle: 'none', margin: '8px 0', padding: 0 }} role="list">{listItems}</ol>)
      continue
    }

    // Bullet list
    const bulletMatch = trimmed.match(/^([•\-\*])\s+(.*)/)
    if (bulletMatch) {
      const listItems = []
      while (i < lines.length) {
        const t2 = lines[i].trim()
        const m2 = t2.match(/^([•\-\*])\s+(.*)/)
        if (!m2) break
        listItems.push(
          <li key={i} style={{ display: 'flex', gap: 8, marginBottom: 4, alignItems: 'flex-start' }}>
            <span style={{ color: '#7C3AED', fontWeight: 800, flexShrink: 0 }}>•</span>
            <span>{parseInline(m2[2])}</span>
          </li>
        )
        i++
      }
      nodes.push(<ul key={`ul-${i}`} style={{ listStyle: 'none', margin: '8px 0', padding: 0 }} role="list">{listItems}</ul>)
      continue
    }

    // Paragraph
    nodes.push(<p key={i} style={{ margin: '0 0 10px 0', fontSize: 13, color: '#475569', lineHeight: 1.6, fontWeight: 500 }}>{parseInline(trimmed)}</p>)
    i++
  }

  return <div>{nodes}</div>
}

function CopyButton({ text, disabled }) {
  const [copied, setCopied] = useState(false)
  const [hov, setHov] = useState(false)

  const handleCopy = async () => {
    if (disabled) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'none',
        border: 'none',
        fontSize: 11,
        fontWeight: 700,
        color: copied ? '#059669' : hov ? '#7C3AED' : '#94A3B8',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: 0,
      }}
      aria-label={copied ? 'Copied to clipboard' : 'Copy response'}
    >
      <span>{copied ? '✓ Copied' : '📋 Copy'}</span>
    </button>
  )
}

function RegenerateButton({ onRegenerate, disabled }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      type="button"
      onClick={onRegenerate}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'none',
        border: 'none',
        fontSize: 11,
        fontWeight: 700,
        color: hov ? '#7C3AED' : '#94A3B8',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: 0,
      }}
      aria-label="Regenerate this response"
    >
      <span>🔄 Ask Again</span>
    </button>
  )
}

function SmartActionButtons({ suggestions = [], disabled }) {
  const getActionTarget = (text) => {
    const lower = text.toLowerCase()
    if (lower.includes('attendance')) return { label: 'View Attendance', id: 'subject-health-section' }
    if (lower.includes('risk')) return { label: 'Show Risk Analysis', id: 'subject-risk-section' }
    if (lower.includes('timeline')) return { label: 'Open Semester Timeline', id: 'semester-timeline-section' }
    if (lower.includes('recommendation') || lower.includes('advice') || lower.includes('tip')) return { label: 'Open Recommendations', id: 'ai-recommendations-section' }
    if (lower.includes('health')) return { label: 'View Health Score', id: 'academic-health-section' }
    if (lower.includes('plan') || lower.includes('strategy')) return { label: 'Create Study Plan', id: 'ai-recommendations-section' }
    return null
  }

  const handleScroll = (id) => {
    if (disabled) return
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const actions = suggestions.map(s => getActionTarget(s)).filter(Boolean)
  if (actions.length === 0) return null
  const uniqueActions = actions.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)

  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }} role="group" aria-label="Smart dashboard shortcuts">
      {uniqueActions.map((act) => (
        <button
          key={act.id}
          type="button"
          onClick={() => handleScroll(act.id)}
          disabled={disabled}
          style={{
            padding: '5px 12px',
            background: '#EFF6FF',
            color: '#2563EB',
            border: '1px solid #BFDBFE',
            borderRadius: 8,
            fontSize: 11,
            fontWeight: 700,
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <span>🔗</span>
          <span>{act.label}</span>
        </button>
      ))}
    </div>
  )
}

const FOLLOWUP_MAP = {
  'CGPA': ['How can I improve my CGPA?', 'Can I reach a CGPA of 9.0?', 'Show my CGPA trend over semesters.'],
  'Attendance': ['Which subjects have low attendance?', 'How much attendance do I still need?', 'Am I at risk due to attendance?'],
  'Health Score': ['Why is my health score low?', 'How can I improve my health score?', 'Show me a breakdown of my score.'],
  'Subject': ['Which subject is highest risk?', 'Give me a study plan for this subject.', 'What are my weak areas?'],
  'Semester': ['Compare my semesters.', 'Which semester was my best?', 'Show my semester timeline.'],
  'Recommendation': ['Give me more study tips.', 'What should I do this week?', 'Prioritize my action items.'],
  'General Academic': ['Analyze my overall performance.', 'What is my biggest academic risk?', 'Show me key recommendations.'],
}
const DEFAULT_FOLLOWUPS = ['Analyze my academic performance.', 'What subjects need the most attention?', 'Show me key recommendations.']

function FollowUpChips({ classification, onSelect, disabled }) {
  const chips = FOLLOWUP_MAP[classification] || DEFAULT_FOLLOWUPS
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14, borderTop: '1px solid #F1F5F9', paddingTop: 10 }} role="group" aria-label="Follow-up questions">
      <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: 4 }}>
        <span>💬</span> Follow Up Questions
      </span>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {chips.slice(0, 3).map((q, i) => (
          <button
            key={i}
            type="button"
            className="msg-followup-chip"
            onClick={() => !disabled && onSelect?.(q)}
            disabled={disabled}
            style={{
              padding: '6px 12px',
              background: '#fff',
              border: '1px solid #E2E8F0',
              borderRadius: 99,
              fontSize: 11,
              fontWeight: 700,
              color: '#64748B',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}

function EnhancedErrorCard({ errorType, onRetry }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: 12, padding: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#DC2626', fontWeight: 800, fontSize: 12.5 }}>
        <span>⚠️</span>
        <span>AI Copilot error ({errorType})</span>
      </div>
      <p style={{ fontSize: 11.5, color: '#9F1239', margin: 0, lineHeight: 1.4 }}>
        The query could not be completed at this time. Please check your network connection and retry.
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style={{ width: 'fit-content', padding: '4px 10px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', marginTop: 4 }}
        >
          Retry
        </button>
      )}
    </div>
  )
}

const MessageBubble = memo(function MessageBubble({
  role,
  content,
  suggestions = [],
  classification,
  timestamp,
  isError = false,
  errorType,
  onRegenerate,
  onSelectFollowup,
  onRetry,
  isLoading = false,
  isStreaming = false,
  onStreamingComplete,
}) {
  const isUser = role === 'user'
  const classInfo = CLASSIFICATION_MAP[classification] || null
  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : ''

  const [displayedContent, setDisplayedContent] = useState(() => (isStreaming ? '' : content))
  const [localStreamingActive, setLocalStreamingActive] = useState(isStreaming)

  useEffect(() => {
    if (!isStreaming || !content) {
      setDisplayedContent(content)
      setLocalStreamingActive(false)
      onStreamingComplete?.()
      return
    }

    setDisplayedContent('')
    setLocalStreamingActive(true)
    let currentLength = 0
    const totalLength = content.length
    let timer

    const step = () => {
      const increment = Math.floor(Math.random() * 11) + 10
      currentLength = Math.min(currentLength + increment, totalLength)
      setDisplayedContent(content.slice(0, currentLength))

      if (currentLength < totalLength) {
        const delay = Math.floor(Math.random() * 21) + 20
        timer = setTimeout(step, delay)
      } else {
        setLocalStreamingActive(false)
        onStreamingComplete?.()
      }
    }

    timer = setTimeout(step, 30)
    return () => clearTimeout(timer)
  }, [content, isStreaming, onStreamingComplete])

  if (isUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '2px 8px' }} role="listitem">
        <div style={{
          maxWidth: '80%',
          background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
          color: '#fff',
          borderRadius: '18px 18px 4px 18px',
          padding: '12px 16px',
          boxShadow: '0 4px 12px rgba(124,58,237,0.15)',
        }}
        aria-label={`You: ${content}`}
        >
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, fontWeight: 550, whiteSpace: 'pre-wrap' }}>
            {content}
          </p>
          {formattedTime && (
            <div style={{ fontSize: 9.5, opacity: 0.8, textAlign: 'right', marginTop: 4, fontWeight: 600 }}>
              {formattedTime}
            </div>
          )}
        </div>
      </div>
    )
  }

  const controlsDisabled = isLoading || localStreamingActive

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '2px 8px' }} role="listitem">
      {/* Bot Avatar */}
      <div style={{
        width: 32,
        height: 32,
        borderRadius: 10,
        background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(124,58,237,0.2)',
      }}
      aria-hidden="true"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
          <path d="M8 12h.01M12 12h.01M16 12h.01"/>
        </svg>
      </div>

      {/* Bot Card */}
      <div style={{
        flex: 1,
        maxWidth: '82%',
        background: '#fff',
        border: '1px solid #E2E8F0',
        borderRadius: '4px 18px 18px 18px',
        padding: '16px',
        boxShadow: '0 1px 3px rgba(15,23,42,0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        {/* Classification tag */}
        {classInfo && !isError && (
          <span style={{
            fontSize: 9,
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: 99,
            background: classInfo.bg,
            color: classInfo.color,
            width: 'fit-content',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {classInfo.label}
          </span>
        )}

        {/* Bubble content */}
        {isError ? (
          <EnhancedErrorCard errorType={errorType} onRetry={onRetry} />
        ) : (
          <RenderMarkdown text={displayedContent} />
        )}

        {/* Shortcuts */}
        {!isError && !localStreamingActive && suggestions?.length > 0 && (
          <SmartActionButtons suggestions={suggestions} disabled={controlsDisabled} />
        )}

        {/* Follow ups */}
        {!isError && !localStreamingActive && onSelectFollowup && (
          <FollowUpChips classification={classification} onSelect={onSelectFollowup} disabled={controlsDisabled} />
        )}

        {/* Footer Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: 8, marginTop: 4 }}>
          <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>{formattedTime}</span>
          {!isError && !localStreamingActive && (
            <div style={{ display: 'flex', gap: 12 }}>
              <CopyButton text={content} disabled={controlsDisabled} />
              {onRegenerate && <RegenerateButton onRegenerate={onRegenerate} disabled={controlsDisabled} />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export default MessageBubble
