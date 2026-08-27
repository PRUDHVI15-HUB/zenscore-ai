import React from 'react'
import { Search, Filter, Calendar, Layers, CheckCircle2 } from 'lucide-react'

const MODULE_OPTIONS = [
  'All',
  'Courses',
  'DSA',
  'Roadmap',
  'Resume',
  'Interview',
  'Academics',
  'Project',
  'Other'
]

const DATE_OPTIONS = ['Today', 'Last 7 Days', 'Last 30 Days', 'All Time']

const STATUS_OPTIONS = ['All', 'Completed', 'Incomplete']

export default function SessionHistoryFilters({
  searchQuery,
  setSearchQuery,
  moduleFilter,
  setModuleFilter,
  dateFilter,
  setDateFilter,
  statusFilter,
  setStatusFilter
}) {
  return (
    <div
      style={{
        background: '#F8FAFC',
        borderRadius: 18,
        padding: '20px',
        border: '1px solid #E2E8F0',
        marginBottom: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}
    >
      {/* Search Bar Input */}
      <div style={{ position: 'relative', width: '100%' }}>
        <Search
          size={18}
          style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
        />
        <input
          type="text"
          placeholder="Search Topic, Goal, or Module..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            height: 44,
            padding: '0 16px 0 46px',
            borderRadius: 12,
            border: '1.5px solid #CBD5E1',
            background: '#FFFFFF',
            fontSize: 13.5,
            fontFamily: 'DM Sans, sans-serif',
            color: '#0F172A',
            outline: 'none',
            transition: 'border 0.2s ease'
          }}
        />
      </div>

      {/* Filter Options Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        {/* Module Filter */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 700, color: '#475569', marginBottom: 6, fontFamily: 'Sora, sans-serif' }}>
            <Layers size={13} style={{ color: '#7C3AED' }} />
            <span>Module</span>
          </label>
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            style={{
              width: '100%',
              height: 38,
              padding: '0 12px',
              borderRadius: 10,
              border: '1.5px solid #CBD5E1',
              background: '#FFFFFF',
              fontSize: 13,
              fontFamily: 'DM Sans, sans-serif',
              color: '#0F172A',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {MODULE_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m === 'All' ? 'All Modules' : m}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 700, color: '#475569', marginBottom: 6, fontFamily: 'Sora, sans-serif' }}>
            <Calendar size={13} style={{ color: '#7C3AED' }} />
            <span>Date Range</span>
          </label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              width: '100%',
              height: 38,
              padding: '0 12px',
              borderRadius: 10,
              border: '1.5px solid #CBD5E1',
              background: '#FFFFFF',
              fontSize: 13,
              fontFamily: 'DM Sans, sans-serif',
              color: '#0F172A',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {DATE_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 700, color: '#475569', marginBottom: 6, fontFamily: 'Sora, sans-serif' }}>
            <CheckCircle2 size={13} style={{ color: '#7C3AED' }} />
            <span>Status</span>
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              width: '100%',
              height: 38,
              padding: '0 12px',
              borderRadius: 10,
              border: '1.5px solid #CBD5E1',
              background: '#FFFFFF',
              fontSize: 13,
              fontFamily: 'DM Sans, sans-serif',
              color: '#0F172A',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All Statuses' : s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
