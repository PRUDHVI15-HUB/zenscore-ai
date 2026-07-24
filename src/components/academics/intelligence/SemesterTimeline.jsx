/**
 * SemesterTimeline.jsx — Premium Academic Performance Timeline (Phase 5)
 *
 * Visual node dots, SGPA badges, status capsules, compact table layout for subjects, and edit/delete callbacks.
 * All props/logic/sorting untouched.
 */
import React, { useState } from 'react'

function SemesterCard({ sem, isOpen, onToggle, onEdit, onDelete }) {
  const [hov, setHov] = useState(false)
  const isCurrent = sem.status === 'Current'

  const totalCredits = sem.subjects
    ? sem.subjects.reduce((sum, s) => sum + (Number(s.credits) || 0), 0)
    : 0

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggle(sem.semesterNumber)
    }
  }

  return (
    <div style={{ display: 'flex', gap: 0, position: 'relative' }}>
      {/* Visual Timeline Node */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 44, flexShrink: 0 }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: isCurrent ? 'linear-gradient(135deg, #7C3AED, #4F46E5)' : '#fff',
          border: `3px solid ${isCurrent ? '#F3F0FF' : '#E2E8F0'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 800,
          color: isCurrent ? '#fff' : '#64748B',
          boxShadow: '0 2px 4px rgba(15,23,42,0.04)',
          zIndex: 1,
          marginTop: 18,
          cursor: 'pointer',
        }}
        onClick={() => onToggle(sem.semesterNumber)}
        >
          {sem.semesterNumber}
        </div>
        <div style={{ width: 2, flex: 1, background: '#E2E8F0', marginTop: 4, minHeight: 40 }} />
      </div>

      {/* Card Body */}
      <div style={{ flex: 1, paddingLeft: 16, paddingBottom: 24 }}>
        <div
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            background: '#fff',
            borderRadius: 20,
            border: `1px solid ${hov ? '#C7D2FE' : '#E2E8F0'}`,
            boxShadow: hov ? '0 6px 18px rgba(15,23,42,0.06)' : '0 1px 3px rgba(15,23,42,0.02)',
            transition: 'all 0.18s ease',
            overflow: 'hidden',
          }}
        >
          {/* Header Row */}
          <div
            onClick={() => onToggle(sem.semesterNumber)}
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13.5, fontWeight: 800, color: '#1E293B', fontFamily: 'Sora, sans-serif' }}>
                Semester {sem.semesterNumber}
              </span>
              <span style={{
                fontSize: 9.5,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 99,
                background: isCurrent ? '#EFF6FF' : '#F8FAFC',
                color: isCurrent ? '#2563EB' : '#64748B',
                border: `1px solid ${isCurrent ? '#BFDBFE' : '#E2E8F0'}`,
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
              }}>
                {sem.status}
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8' }}>
                Credits: <strong style={{ color: '#64748B' }}>{totalCredits}</strong>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} onClick={e => e.stopPropagation()}>
              {/* SGPA Badge */}
              <span style={{
                fontSize: 11.5,
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: 8,
                background: '#F3F0FF',
                color: '#7C3AED',
                border: '1px solid #DDD6FE',
                fontFamily: 'Sora, sans-serif',
              }}>
                {sem.sgpa ? `${sem.sgpa} SGPA` : '0.00 SGPA'}
              </span>

              {/* Actions group */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => onEdit(sem)}
                    style={{
                      width: 28, height: 28, borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                    }}
                    title="Edit Semester"
                  >
                    ✏️
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(sem)}
                    style={{
                      width: 28, height: 28, borderRadius: 8, background: '#FFF1F2', border: '1px solid #FECDD3',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                    }}
                    title="Delete Semester"
                  >
                    🗑️
                  </button>
                )}
              </div>

              {/* Accordion Arrow */}
              <button
                type="button"
                onClick={() => onToggle(sem.semesterNumber)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="2.5"
                  style={{
                    transition: 'transform 0.2s ease',
                    transform: isOpen ? 'rotate(180deg)' : 'none',
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          </div>

          {/* Subjects Table accordion */}
          {isOpen && (
            <div style={{ padding: '16px 20px', background: '#FAFBFF', borderTop: '1px solid #F1F5F9' }}>
              {sem.subjects && sem.subjects.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                        {['Subject Name', 'Credits', 'Attendance', 'Final Grade'].map((col, idx) => (
                          <th
                            key={col}
                            style={{
                              textAlign: idx === 0 ? 'left' : idx === 3 ? 'right' : 'center',
                              padding: '8px 12px',
                              fontSize: 10,
                              fontWeight: 700,
                              color: '#94A3B8',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sem.subjects.map((sub, sIdx) => (
                        <tr key={sIdx} style={{ borderBottom: sIdx === sem.subjects.length - 1 ? 'none' : '1px solid #F1F5F9' }}>
                          <td style={{ padding: '10px 12px', fontWeight: 700, color: '#1E293B' }}>{sub.name}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748B', fontWeight: 600 }}>{sub.credits}</td>
                          <td style={{
                            padding: '10px 12px',
                            textAlign: 'center',
                            fontWeight: 800,
                            color: sub.attendance < 75 ? '#DC2626' : sub.attendance < 85 ? '#D97706' : '#059669',
                          }}>
                            {sub.attendance}%
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#1E293B' }}>
                            {sub.finalGrade !== undefined && sub.finalGrade !== null ? sub.finalGrade : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ color: '#CBD5E1', fontSize: 12, fontStyle: 'italic' }}>
                  No subjects logged inside this semester.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SemesterTimeline({ semesters, onEditSemester, onDeleteSemester }) {
  const [expandedSems, setExpandedSems] = useState({})

  if (!semesters || semesters.length === 0) {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{ padding: '32px', textAlign: 'center', color: '#94A3B8', fontSize: 13, fontWeight: 600, background: '#fff', borderRadius: 20, border: '1px solid #E2E8F0' }}
      >
        Start by adding your first semester.
      </div>
    )
  }

  // Sort semesters by semesterNumber ascending
  const sortedSems = [...semesters].sort((a, b) => a.semesterNumber - b.semesterNumber)

  const toggleExpand = (semNumber) => {
    setExpandedSems(prev => ({
      ...prev,
      [semNumber]: !prev[semNumber],
    }))
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column' }}
      role="region"
      aria-label="Academic Performance Timeline"
    >
      {sortedSems.map((sem) => (
        <SemesterCard
          key={sem.semesterNumber}
          sem={sem}
          isOpen={!!expandedSems[sem.semesterNumber]}
          onToggle={toggleExpand}
          onEdit={onEditSemester}
          onDelete={onDeleteSemester}
        />
      ))}
    </div>
  )
}
