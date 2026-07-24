import React, { useState } from 'react'

/**
 * SubjectTable — Compact table view of My Subjects (Phase 2 Revamp)
 * Columns: Subject | Attendance | Internal Marks | Status | Action
 * Design: Dashboard-style white card, thin dividers, colored status badges,
 *         inline progress bars for attendance.
 */

// ── Status helpers ─────────────────────────────────────────────────────────────
function getStatus(subject) {
  if (subject.health) return subject.health
  const att = subject.attendance ?? 100
  const marks = subject.internalMarks ?? subject.marks ?? null
  if (att < 60 || (marks !== null && marks < 35)) return 'At Risk'
  if (att < 75 || (marks !== null && marks < 50)) return 'Needs Work'
  if (att >= 90 && (marks === null || marks >= 70)) return 'Excellent'
  return 'Healthy'
}

const STATUS_CONFIG = {
  Excellent:   { color: '#059669', bg: '#ECFDF5', label: 'Excellent' },
  Healthy:     { color: '#2563EB', bg: '#EFF6FF', label: 'Healthy' },
  'Needs Work':{ color: '#D97706', bg: '#FFFBEB', label: 'Needs Work' },
  'At Risk':   { color: '#DC2626', bg: '#FFF1F2', label: 'At Risk' },
}

function AttBar({ value }) {
  const clamped = Math.min(100, Math.max(0, value ?? 0))
  const color = clamped >= 75 ? '#059669' : clamped >= 60 ? '#D97706' : '#DC2626'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 110 }}>
      <div style={{ flex: 1, height: 6, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ width: `${clamped}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.4s ease' }} />
      </div>
      <span style={{ fontSize: 11.5, fontWeight: 700, color: '#475569', minWidth: 32, textAlign: 'right' }}>
        {clamped}%
      </span>
    </div>
  )
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Healthy
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 11,
      fontWeight: 700,
      padding: '3px 10px',
      borderRadius: 99,
      background: cfg.bg,
      color: cfg.color,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
      {cfg.label}
    </span>
  )
}

export default function SubjectTable({ subjects = [], onEditSubject, onDeleteSubject }) {
  const [expandedRow, setExpandedRow] = useState(null)

  if (!subjects || subjects.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 20px' }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>📚</div>
        <div style={{ fontSize: 13.5, color: '#94A3B8', fontWeight: 600, marginBottom: 16 }}>
          No subjects logged yet.
        </div>
        <div style={{ fontSize: 12, color: '#CBD5E1', fontWeight: 500 }}>
          Add semesters and subjects to see performance data here.
        </div>
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        {/* ── Header ── */}
        <thead>
          <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
            {['Subject', 'Attendance', 'Internal Marks', 'Status', 'Action'].map(col => (
              <th
                key={col}
                style={{
                  textAlign: col === 'Subject' ? 'left' : 'center',
                  padding: '10px 14px',
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: '#94A3B8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  whiteSpace: 'nowrap',
                  userSelect: 'none',
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        {/* ── Body ── */}
        <tbody>
          {subjects.map((sub, i) => {
            const status = getStatus(sub)
            const marks = sub.internalMarks ?? sub.marks ?? null
            const isLast = i === subjects.length - 1

            return (
              <tr
                key={sub._id || sub.name || i}
                style={{
                  borderBottom: isLast ? 'none' : '1px solid #F8FAFC',
                  transition: 'background 0.15s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#FAFBFF'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Subject name */}
                <td style={{ padding: '14px 14px', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: '#F8FAFC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      flexShrink: 0,
                      color: '#6366F1',
                    }}>
                      📗
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1E293B', fontSize: 13 }}>
                        {sub.name}
                      </div>
                      {sub.credits && (
                        <div style={{ fontSize: 10.5, color: '#94A3B8', fontWeight: 600, marginTop: 1 }}>
                          {sub.credits} credits
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Attendance bar */}
                <td style={{ padding: '14px 14px', verticalAlign: 'middle', textAlign: 'center' }}>
                  <AttBar value={sub.attendance} />
                </td>

                {/* Internal Marks */}
                <td style={{ padding: '14px 14px', verticalAlign: 'middle', textAlign: 'center' }}>
                  {marks !== null ? (
                    <span style={{
                      fontWeight: 800,
                      fontSize: 14,
                      color: marks >= 70 ? '#059669' : marks >= 50 ? '#2563EB' : marks >= 35 ? '#D97706' : '#DC2626',
                      fontFamily: 'Sora, sans-serif',
                    }}>
                      {marks}
                    </span>
                  ) : (
                    <span style={{ fontSize: 12, color: '#CBD5E1', fontWeight: 600 }}>—</span>
                  )}
                </td>

                {/* Status badge */}
                <td style={{ padding: '14px 14px', verticalAlign: 'middle', textAlign: 'center' }}>
                  <StatusBadge status={status} />
                </td>

                {/* Action button */}
                <td style={{ padding: '14px 14px', verticalAlign: 'middle', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <ActionBtn
                      label="Edit"
                      color="#6366F1"
                      bg="#EEF2FF"
                      onClick={() => onEditSubject?.(sub, sub._semesterNumber)}
                    />
                    <ActionBtn
                      label="Delete"
                      color="#DC2626"
                      bg="#FFF1F2"
                      onClick={() => onDeleteSubject?.(sub, sub._semesterNumber)}
                    />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function ActionBtn({ label, color, bg, onClick }) {
  const [hov, setHov] = React.useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '5px 12px',
        background: hov ? bg : '#F8FAFC',
        color: hov ? color : '#64748B',
        border: `1px solid ${hov ? bg : '#E2E8F0'}`,
        borderRadius: 8,
        fontSize: 11,
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  )
}
