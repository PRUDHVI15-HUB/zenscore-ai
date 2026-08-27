import React from 'react'
import { Search, X, Filter, ArrowUpDown } from 'lucide-react'

/**
 * CertificateFilters Component
 * Search bar, status filters, and sorting select control.
 *
 * Props:
 * - searchQuery: string
 * - onSearchChange: function(query)
 * - statusFilter: string
 * - onStatusFilterChange: function(status)
 * - sortBy: string
 * - onSortByChange: function(sort)
 */

export default React.memo(function CertificateFilters({
  searchQuery = '',
  onSearchChange,
  statusFilter = 'All',
  onStatusFilterChange,
  sortBy = 'Newest',
  onSortByChange
}) {
  const statusOptions = ['All', 'Completed', 'In Progress', 'Expired']
  const sortOptions = ['Newest', 'Oldest', 'Alphabetical']

  return (
    <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderColor: 'var(--border, #E2E8F0)' }} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border shadow-sm">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          placeholder="Search certificates by title or ID..."
          aria-label="Search certificates"
          style={{ background: 'var(--bg, #F8FAFC)', borderColor: 'var(--border, #E2E8F0)', color: 'var(--text-dark, #0F172A)' }}
          className="w-full h-10 pl-9 pr-9 border rounded-xl text-xs font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange && onSearchChange('')}
            aria-label="Clear search"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Status Chips & Sort Dropdown */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Chips */}
        <div style={{ background: 'var(--bg, #F8FAFC)', borderColor: 'var(--border, #E2E8F0)' }} className="flex items-center gap-1.5 p-1 rounded-xl border">
          {statusOptions.map((st) => {
            const isActive = statusFilter === st
            return (
              <button
                key={st}
                type="button"
                onClick={() => onStatusFilterChange && onStatusFilterChange(st)}
                className={`h-8 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            )
          })}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange && onSortByChange(e.target.value)}
            className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
          >
            {sortOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
})
