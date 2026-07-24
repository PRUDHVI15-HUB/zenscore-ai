/**
 * UpcomingExams — Premium table card showing exams, days left,
 * preparation status badges, and action buttons.
 */
import React, { useState } from 'react'

const STATUS_CONFIG = {
  Excellent: { color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  Good:      { color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  Average:   { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  Critical:  { color: '#DC2626', bg: '#FFF1F2', border: '#FECDD3' },
}

const ACTION_CONFIG = {
  'Start Revision': { color: '#DC2626', bg: '#FFF1F2', hoverBg: '#FEE2E2' },
  'Continue':       { color: '#2563EB', bg: '#EFF6FF', hoverBg: '#DBEAFE' },
  'View Plan':      { color: '#7C3AED', bg: '#F3F0FF', hoverBg: '#EDE9FE' },
}

function DaysLeftBadge({ days }) {
  const color = days <= 3 ? '#DC2626' : days <= 7 ? '#D97706' : days <= 14 ? '#2563EB' : '#059669'
  const bg    = days <= 3 ? '#FFF1F2' : days <= 7 ? '#FFFBEB' : days <= 14 ? '#EFF6FF' : '#ECFDF5'
  return (
    <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 99, background: bg, color, whiteSpace: 'nowrap', fontFamily: 'Sora, sans-serif' }}>
      {days}d left
    </span>
  )
}

function ActionBtn({ label }) {
  const [hov, setHov] = useState(false)
  const cfg = ACTION_CONFIG[label] || ACTION_CONFIG['View Plan']
  return (
    <button
      type="button"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '5px 13px',
        background: hov ? cfg.hoverBg : cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.bg}`,
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

export default function UpcomingExams({ exams = [] }) {
  if (exams.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 20px' }}>
        <div style={{ fontSize: 30, marginBottom: 8 }}>📅</div>
        <div style={{ fontSize: 13, color: '#CBD5E1', fontWeight: 600 }}>No upcoming exams scheduled.</div>
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
            {['Subject', 'Exam Date', 'Days Left', 'Preparation', 'Action'].map(col => (
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
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {exams.map((exam, i) => {
            const statusCfg = STATUS_CONFIG[exam.status] || STATUS_CONFIG.Average
            const isLast = i === exams.length - 1
            return (
              <tr
                key={i}
                style={{ borderBottom: isLast ? 'none' : '1px solid #F8FAFC', transition: 'background 0.15s ease' }}
                onMouseEnter={e => e.currentTarget.style.background = '#FAFBFF'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Subject */}
                <td style={{ padding: '13px 14px', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                      {exam.icon || '📗'}
                    </div>
                    <span style={{ fontWeight: 700, color: '#1E293B', fontSize: 13 }}>{exam.subject}</span>
                  </div>
                </td>
                {/* Date */}
                <td style={{ padding: '13px 14px', verticalAlign: 'middle', textAlign: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>{exam.date}</span>
                </td>
                {/* Days left */}
                <td style={{ padding: '13px 14px', verticalAlign: 'middle', textAlign: 'center' }}>
                  <DaysLeftBadge days={exam.daysLeft} />
                </td>
                {/* Status */}
                <td style={{ padding: '13px 14px', verticalAlign: 'middle', textAlign: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: statusCfg.bg, color: statusCfg.color, border: `1px solid ${statusCfg.border}`, whiteSpace: 'nowrap' }}>
                    {exam.status}
                  </span>
                </td>
                {/* Action */}
                <td style={{ padding: '13px 14px', verticalAlign: 'middle', textAlign: 'center' }}>
                  <ActionBtn label={exam.action} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
