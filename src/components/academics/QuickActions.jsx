import React from 'react'

/**
 * QuickActions — 6-button grid card (Phase 2 Revamp)
 * Dashboard-style: white card, thin border, 3x2 square action buttons
 * with tinted icon backgrounds and hover elevation.
 */

const ACTIONS = [
  {
    id: 'add-marks',
    icon: '📝',
    label: 'Add Marks',
    color: '#2563EB',
    bg: '#EFF6FF',
    border: '#BFDBFE',
  },
  {
    id: 'attendance',
    icon: '📅',
    label: 'Attendance',
    color: '#7C3AED',
    bg: '#F3F0FF',
    border: '#DDD6FE',
  },
  {
    id: 'upload-transcript',
    icon: '📄',
    label: 'Upload Transcript',
    color: '#0284C7',
    bg: '#F0F9FF',
    border: '#BAE6FD',
  },
  {
    id: 'ai-study-planner',
    icon: '🤖',
    label: 'AI Study Planner',
    color: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
  },
  {
    id: 'ai-tutor',
    icon: '✨',
    label: 'AI Tutor',
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
  },
  {
    id: 'semester-manager',
    icon: '🗂️',
    label: 'Semester Manager',
    color: '#DC2626',
    bg: '#FFF1F2',
    border: '#FECDD3',
  },
]

export default function QuickActions({
  onOpenSemester,
  onOpenSubject,
  onGenerateAI,
  onUpload,
}) {
  // Map action IDs to handlers
  const getHandler = (id) => {
    switch (id) {
      case 'add-marks':       return onOpenSubject
      case 'attendance':      return () => {} // future
      case 'upload-transcript': return onUpload
      case 'ai-study-planner':  return onGenerateAI
      case 'ai-tutor':          return () => window.location.href = '/ai-tutor'
      case 'semester-manager':  return onOpenSemester
      default: return () => {}
    }
  }

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 24,
        padding: '24px 28px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
      }}
    >
      {/* Card header */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#1E293B', fontFamily: 'Sora, sans-serif' }}>
            Quick Actions
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, marginTop: 2 }}>
            Manage academics, upload transcripts, and more
          </div>
        </div>
      </div>

      {/* 3-column action grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
        }}
      >
        {ACTIONS.map((action) => (
          <ActionButton
            key={action.id}
            {...action}
            onClick={getHandler(action.id)}
          />
        ))}
      </div>
    </div>
  )
}

function ActionButton({ icon, label, color, bg, border, onClick }) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: '18px 12px',
        background: hovered ? bg : '#fff',
        border: `1.5px solid ${hovered ? border : '#F1F5F9'}`,
        borderRadius: 16,
        cursor: 'pointer',
        transition: 'all 0.18s ease',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? `0 6px 16px rgba(15,23,42,0.06)` : 'none',
        textAlign: 'center',
        minHeight: 88,
      }}
    >
      {/* Icon pill */}
      <div style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        flexShrink: 0,
        transition: 'transform 0.18s ease',
        transform: hovered ? 'scale(1.08)' : 'scale(1)',
      }}>
        {icon}
      </div>
      {/* Label */}
      <span style={{
        fontSize: 11.5,
        fontWeight: 700,
        color: hovered ? color : '#334155',
        lineHeight: 1.3,
        transition: 'color 0.18s ease',
      }}>
        {label}
      </span>
    </button>
  )
}
