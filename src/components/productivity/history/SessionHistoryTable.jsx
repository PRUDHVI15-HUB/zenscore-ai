import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Trash2, CheckCircle2, AlertTriangle, Layers, Clock, Calendar } from 'lucide-react'
import { formatDateStr, formatTimeStr } from '../../../services/productivity/sessionHistoryService'

export default function SessionHistoryTable({ sessions = [], onViewDetails, onDeleteSession }) {
  const [sessionToDelete, setSessionToDelete] = useState(null)

  const handleConfirmDelete = () => {
    if (sessionToDelete && onDeleteSession) {
      onDeleteSession(sessionToDelete.id)
      setSessionToDelete(null)
    }
  }

  return (
    <>
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 20,
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)'
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'DM Sans, sans-serif' }}>
            <thead>
              <tr
                style={{
                  background: '#F8FAFC',
                  borderBottom: '1px solid #E2E8F0',
                  fontSize: 12,
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: 700,
                  color: '#475569',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                <th style={{ padding: '16px 20px' }}>Study Topic</th>
                <th style={{ padding: '16px 16px' }}>Module</th>
                <th style={{ padding: '16px 16px' }}>Goal</th>
                <th style={{ padding: '16px 16px' }}>Date</th>
                <th style={{ padding: '16px 16px' }}>Time</th>
                <th style={{ padding: '16px 16px' }}>Planned</th>
                <th style={{ padding: '16px 16px' }}>Actual</th>
                <th style={{ padding: '16px 16px' }}>XP Earned</th>
                <th style={{ padding: '16px 16px' }}>Status</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {sessions.map((s) => {
                const startTimeFormatted = formatTimeStr(s.startTime)
                const endTimeFormatted = formatTimeStr(s.endTime)
                const dateFormatted = formatDateStr(s.startTime || s.date)

                return (
                  <tr
                    key={s.id}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Topic */}
                    <td style={{ padding: '16px 20px', fontWeight: 700, color: '#0F172A', fontFamily: 'Sora, sans-serif', fontSize: 13.5 }}>
                      {s.topic}
                    </td>

                    {/* Module (Category) */}
                    <td style={{ padding: '16px 16px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: 16,
                          background: '#F3E8FF',
                          color: '#7C3AED',
                          fontSize: 11.5,
                          fontWeight: 700,
                          fontFamily: 'Sora, sans-serif'
                        }}
                      >
                        {s.category || 'Module'}
                      </span>
                    </td>

                    {/* Goal */}
                    <td style={{ padding: '16px 16px', fontSize: 12.5, color: s.goal ? '#475569' : '#94A3B8', maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {s.goal || '—'}
                    </td>

                    {/* Date */}
                    <td style={{ padding: '16px 16px', fontSize: 12.5, color: '#475569', fontWeight: 600 }}>
                      {dateFormatted}
                    </td>

                    {/* Time Window */}
                    <td style={{ padding: '16px 16px', fontSize: 12, color: '#64748B' }}>
                      {startTimeFormatted} – {endTimeFormatted}
                    </td>

                    {/* Planned Mins */}
                    <td style={{ padding: '16px 16px', fontSize: 13, color: '#475569', fontWeight: 600 }}>
                      {s.plannedMinutes}m
                    </td>

                    {/* Actual Mins */}
                    <td style={{ padding: '16px 16px', fontSize: 13, color: '#059669', fontWeight: 700 }}>
                      {s.actualMinutes}m
                    </td>

                    {/* XP Earned */}
                    <td style={{ padding: '16px 16px', fontSize: 13, color: '#7C3AED', fontWeight: 800, fontFamily: 'Sora, sans-serif' }}>
                      +{s.xpEarned || s.actualMinutes || 0} XP
                    </td>

                    {/* Status */}
                    <td style={{ padding: '16px 16px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: 20,
                          background: s.completed ? '#F0FDF4' : '#FEF2F2',
                          color: s.completed ? '#166534' : '#DC2626',
                          fontSize: 11.5,
                          fontWeight: 700,
                          fontFamily: 'Sora, sans-serif'
                        }}
                      >
                        {s.completed ? 'Completed' : 'Incomplete'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          onClick={() => onViewDetails && onViewDetails(s)}
                          style={{
                            height: 32,
                            padding: '0 10px',
                            borderRadius: 8,
                            border: '1px solid #CBD5E1',
                            background: '#FFFFFF',
                            color: '#475569',
                            cursor: 'pointer',
                            fontSize: 12,
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                          title="View Details"
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </button>

                        <button
                          onClick={() => setSessionToDelete(s)}
                          style={{
                            height: 32,
                            padding: '0 10px',
                            borderRadius: 8,
                            border: '1px solid #FCA5A5',
                            background: '#FEF2F2',
                            color: '#DC2626',
                            cursor: 'pointer',
                            fontSize: 12,
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                          title="Delete Session"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog Modal */}
      {sessionToDelete && (
        <AnimatePresence>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 99999,
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20
            }}
            onClick={() => setSessionToDelete(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#FFFFFF',
                borderRadius: 24,
                padding: '28px',
                maxWidth: 420,
                width: '100%',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
                border: '1px solid #E2E8F0',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  background: '#FEF2F2',
                  color: '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  border: '1px solid #FCA5A5'
                }}
              >
                <AlertTriangle size={26} />
              </div>

              <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>
                Delete this study session?
              </h3>

              <p style={{ fontSize: 13.5, color: '#64748B', marginBottom: 24, lineHeight: 1.5, fontFamily: 'DM Sans, sans-serif' }}>
                Are you sure you want to delete <strong style={{ color: '#0F172A' }}>"{sessionToDelete.topic}"</strong>? This will recalculate all session statistics.
              </p>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button
                  onClick={() => setSessionToDelete(null)}
                  style={{
                    height: 42,
                    padding: '0 20px',
                    borderRadius: 12,
                    border: '1.5px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#475569',
                    fontFamily: 'Sora, sans-serif',
                    fontWeight: 600,
                    fontSize: 13.5,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={handleConfirmDelete}
                  style={{
                    height: 42,
                    padding: '0 22px',
                    borderRadius: 12,
                    border: 'none',
                    background: '#DC2626',
                    color: '#FFFFFF',
                    fontFamily: 'Sora, sans-serif',
                    fontWeight: 800,
                    fontSize: 13.5,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(220, 38, 38, 0.3)'
                  }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}
    </>
  )
}
