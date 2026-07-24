/**
 * ChatHeader.jsx — Premium Conversation Controls Header (Phase 5)
 *
 * Title, status badge indicator, New Chat / Export / Clear control toolbar buttons.
 * All props/callbacks/confirmation overlay logic untouched.
 */
import React, { useState } from 'react'

export default function ChatHeader({
  onClear,
  onNew,
  onExport,
  isOnline = true,
  hasMessages = false,
  disabled = false
}) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [newHov, setNewHov] = useState(false)
  const [expHov, setExpHov] = useState(false)
  const [clrHov, setClrHov] = useState(false)

  const handleClearClick = () => {
    if (disabled) return
    setShowConfirm(true)
  }

  const handleConfirmClear = () => {
    onClear?.()
    setShowConfirm(false)
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid #F1F5F9',
        flexWrap: 'wrap',
        gap: 12,
        position: 'relative',
      }}
      role="banner"
      aria-label="AI Academic Copilot header"
    >
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          fontSize: 10.5,
          fontWeight: 750,
          color: isOnline ? '#059669' : '#DC2626',
          textTransform: 'uppercase',
          letterSpacing: '0.6px',
          background: isOnline ? '#ECFDF5' : '#FFF1F2',
          padding: '4px 10px',
          borderRadius: 99,
          border: `1px solid ${isOnline ? '#A7F3D0' : '#FECDD3'}`,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6
        }}>
          <span style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: isOnline ? '#10B981' : '#EF4444',
            display: 'inline-block'
          }}
          className={isOnline ? 'animate-pulse' : ''}
          aria-hidden="true"
          />
          {isOnline ? 'Copilot Active' : 'Offline'}
        </span>
      </div>

      {/* Right Action buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* New Chat */}
        <button
          type="button"
          onClick={onNew}
          disabled={disabled}
          onMouseEnter={() => setNewHov(true)}
          onMouseLeave={() => setNewHov(false)}
          style={{
            padding: '6px 12px',
            background: newHov ? '#F5F3FF' : '#fff',
            color: newHov ? '#7C3AED' : '#475569',
            border: `1px solid ${newHov ? '#C7D2FE' : '#E2E8F0'}`,
            borderRadius: 8,
            fontSize: 11,
            fontWeight: 700,
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
          aria-label="Start a new conversation"
        >
          <span style={{ fontSize: 12 }}>+</span>
          <span>New Chat</span>
        </button>

        {/* Export */}
        <button
          type="button"
          onClick={onExport}
          disabled={disabled || !hasMessages}
          onMouseEnter={() => setExpHov(true)}
          onMouseLeave={() => setExpHov(false)}
          style={{
            padding: '6px 12px',
            background: expHov ? '#FAFBFF' : '#fff',
            color: expHov ? '#1E293B' : '#475569',
            border: `1px solid ${expHov ? '#C7D2FE' : '#E2E8F0'}`,
            borderRadius: 8,
            fontSize: 11,
            fontWeight: 700,
            cursor: (disabled || !hasMessages) ? 'not-allowed' : 'pointer',
            opacity: (disabled || !hasMessages) ? 0.5 : 1,
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
          aria-label="Export conversation history"
        >
          <span style={{ fontSize: 11 }}>⬇</span>
          <span>Export</span>
        </button>

        {/* Clear */}
        <button
          type="button"
          onClick={handleClearClick}
          disabled={disabled || !hasMessages}
          onMouseEnter={() => setClrHov(true)}
          onMouseLeave={() => setClrHov(false)}
          style={{
            padding: '6px 12px',
            background: clrHov ? '#FFF1F2' : '#fff',
            color: clrHov ? '#DC2626' : '#94A3B8',
            border: `1px solid ${clrHov ? '#FECDD3' : '#E2E8F0'}`,
            borderRadius: 8,
            fontSize: 11,
            fontWeight: 700,
            cursor: (disabled || !hasMessages) ? 'not-allowed' : 'pointer',
            opacity: (disabled || !hasMessages) ? 0.5 : 1,
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
          aria-label="Clear chat messages"
        >
          <span style={{ fontSize: 11 }}>🗑️</span>
          <span>Clear</span>
        </button>
      </div>

      {/* Confirmation Dialog Overlay */}
      {showConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-dialog-title"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255,255,255,0.96)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <span id="clear-dialog-title" style={{ fontSize: 12.5, fontWeight: 800, color: '#1E293B' }}>
              Clear this conversation?
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={handleConfirmClear}
                style={{ padding: '5px 14px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                style={{ padding: '5px 14px', background: '#F1F5F9', color: '#475569', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
