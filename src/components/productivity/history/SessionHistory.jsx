import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SessionHistorySummary from './SessionHistorySummary'
import SessionHistoryFilters from './SessionHistoryFilters'
import SessionHistoryTable from './SessionHistoryTable'
import SessionDetailsModal from './SessionDetailsModal'
import FocusEmptyState from '../FocusEmptyState'
import {
  getHistorySessions,
  removeHistorySession,
  calculateHistoryStats,
  filterHistorySessions
} from '../../../services/productivity/sessionHistoryService'

export default function SessionHistory({ onStartFirstSession }) {
  const [sessions, setSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)

  // Filters State
  const [searchQuery, setSearchQuery] = useState('')
  const [moduleFilter, setModuleFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('All Time')
  const [statusFilter, setStatusFilter] = useState('All')

  // Load Sessions
  const loadSessions = () => {
    const data = getHistorySessions()
    setSessions(data)
  }

  useEffect(() => {
    loadSessions()

    // Auto Update when FOCUS_SESSION_COMPLETED is published
    const handleSessionCompletedEvent = () => {
      loadSessions()
    }

    window.addEventListener('FOCUS_SESSION_COMPLETED', handleSessionCompletedEvent)
    return () => {
      window.removeEventListener('FOCUS_SESSION_COMPLETED', handleSessionCompletedEvent)
    }
  }, [])

  // Delete Session Handler
  const handleDeleteSession = (sessionId) => {
    const updated = removeHistorySession(sessionId)
    setSessions(updated)
    if (selectedSession && selectedSession.id === sessionId) {
      setSelectedSession(null)
    }
  }

  // Calculate dynamic stats
  const stats = calculateHistoryStats(sessions)

  // Filtered Sessions List
  const filteredSessions = filterHistorySessions(sessions, {
    searchQuery,
    moduleFilter,
    dateFilter,
    statusFilter
  })

  // Global Empty State (No sessions exist in LocalStorage)
  if (sessions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <FocusEmptyState
          onStartFirstSession={onStartFirstSession}
          icon="📜"
          title="No sessions completed yet."
          subtitle="Complete your first focus session to build your study history."
        />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h2
          style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: 24,
            fontWeight: 800,
            color: '#0F172A',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            margin: 0
          }}
        >
          <span>📜 Session History</span>
        </h2>
        <p style={{ fontSize: 14, color: '#64748B', marginTop: 4, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
          Track every completed study session.
        </p>
      </div>

      {/* 5 Summary Cards */}
      <SessionHistorySummary stats={stats} />

      {/* Search & Filters */}
      <SessionHistoryFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        moduleFilter={moduleFilter}
        setModuleFilter={setModuleFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Session Table or Search Empty State */}
      {filteredSessions.length > 0 ? (
        <SessionHistoryTable
          sessions={filteredSessions}
          onViewDetails={(session) => setSelectedSession(session)}
          onDeleteSession={handleDeleteSession}
        />
      ) : (
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 20,
            padding: '40px 24px',
            textAlign: 'center',
            border: '1px solid #E2E8F0'
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
          <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>
            No matching sessions found
          </h4>
          <p style={{ fontSize: 13, color: '#64748B', marginTop: 4, fontFamily: 'DM Sans, sans-serif' }}>
            Try adjusting your search keywords or filter dropdowns.
          </p>
        </div>
      )}

      {/* Session Details Modal */}
      {selectedSession && (
        <SessionDetailsModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onDeleteClick={(s) => {
            handleDeleteSession(s.id)
            setSelectedSession(null)
          }}
        />
      )}
    </motion.div>
  )
}
