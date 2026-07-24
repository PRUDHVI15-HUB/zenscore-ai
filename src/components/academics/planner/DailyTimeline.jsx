/**
 * DailyTimeline — Today's study schedule with time-blocked tasks,
 * priority badges, and animated checkboxes.
 */
import React, { useState } from 'react'

const PRIORITY_CONFIG = {
  High:   { color: '#DC2626', bg: '#FFF1F2', label: 'High'   },
  Medium: { color: '#D97706', bg: '#FFFBEB', label: 'Medium' },
  Low:    { color: '#059669', bg: '#ECFDF5', label: 'Low'    },
}

function Checkbox({ checked, onChange }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      type="button"
      onClick={onChange}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-checked={checked}
      role="checkbox"
      style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        border: `2px solid ${checked ? '#7C3AED' : hov ? '#A78BFA' : '#D1D5DB'}`,
        background: checked ? '#7C3AED' : hov ? '#F5F3FF' : '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.18s ease',
        flexShrink: 0,
        padding: 0,
      }}
    >
      {checked && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
  )
}

function TimelineTask({ task, onToggle, isLast }) {
  const [hov, setHov] = useState(false)
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.Medium

  return (
    <div style={{ display: 'flex', gap: 0, position: 'relative' }}>
      {/* Time column */}
      <div style={{ width: 100, flexShrink: 0, paddingTop: 14, paddingRight: 16, textAlign: 'right' }}>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: '#94A3B8', whiteSpace: 'nowrap' }}>
          {task.time}
        </span>
      </div>

      {/* Timeline dot + line */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 32, flexShrink: 0 }}>
        <div style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: task.completed ? '#7C3AED' : '#E2E8F0',
          border: `2px solid ${task.completed ? '#7C3AED' : '#D1D5DB'}`,
          marginTop: 16,
          transition: 'all 0.2s ease',
          zIndex: 1,
          flexShrink: 0,
        }} />
        {!isLast && (
          <div style={{ width: 2, flex: 1, background: '#F1F5F9', marginTop: 4, minHeight: 24 }} />
        )}
      </div>

      {/* Task card */}
      <div style={{ flex: 1, paddingBottom: isLast ? 0 : 12, paddingLeft: 12 }}>
        <div
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            background: hov ? '#FAFBFF' : '#fff',
            border: `1px solid ${hov ? '#C7D2FE' : '#E2E8F0'}`,
            borderRadius: 14,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            transition: 'all 0.18s ease',
            transform: hov ? 'translateX(2px)' : 'translateX(0)',
            cursor: 'default',
            opacity: task.completed ? 0.65 : 1,
          }}
        >
          {/* Subject icon */}
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 11,
            background: task.completed ? '#F1F5F9' : '#EEF2FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            flexShrink: 0,
          }}>
            {task.icon}
          </div>

          {/* Subject name + duration */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#1E293B',
              textDecoration: task.completed ? 'line-through' : 'none',
              marginBottom: 2,
            }}>
              {task.subject}
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>
              {task.duration}
            </div>
          </div>

          {/* Priority badge */}
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            padding: '3px 9px',
            borderRadius: 99,
            background: priority.bg,
            color: priority.color,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            {priority.label}
          </span>

          {/* Checkbox */}
          <Checkbox checked={task.completed} onChange={() => onToggle(task.id)} />
        </div>
      </div>
    </div>
  )
}

export default function DailyTimeline({ tasks = [], onToggleTask }) {
  if (tasks.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 20px', color: '#CBD5E1', fontSize: 13, fontWeight: 600 }}>
        No tasks scheduled for today.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {tasks.map((task, i) => (
        <TimelineTask
          key={task.id}
          task={task}
          onToggle={onToggleTask}
          isLast={i === tasks.length - 1}
        />
      ))}
    </div>
  )
}
