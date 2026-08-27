import React from 'react'
import { SearchX, RefreshCw } from 'lucide-react'

/**
 * EmptyState Component
 * Shown when no skills match the active search or category/difficulty filters.
 *
 * Props:
 * - onClearFilters: function (resets search and filter state)
 * - title: string
 * - description: string
 */

export default React.memo(function EmptyState({
  onClearFilters,
  title = 'No skills found',
  description = 'Try another search or clear filters.'
}) {
  return (
    <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderColor: 'var(--border, #E2E8F0)' }} className="rounded-2xl p-10 border shadow-sm text-center flex flex-col items-center justify-center min-h-[300px] my-4">
      <div style={{ background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }} className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
        <SearchX className="w-8 h-8 stroke-[1.8]" />
      </div>
      <h3 style={{ color: 'var(--text-dark, #0F172A)' }} className="font-sora text-lg font-bold mb-1.5">
        {title}
      </h3>
      <p style={{ color: 'var(--text-muted, #64748B)' }} className="text-sm max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {onClearFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-sora font-semibold text-xs transition-all shadow-md shadow-purple-600/20 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Clear Filters</span>
        </button>
      )}
    </div>
  )
})
