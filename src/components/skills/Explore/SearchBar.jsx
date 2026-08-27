import React, { useState, useEffect, useCallback } from 'react'
import { Search, X } from 'lucide-react'

/**
 * SearchBar Component
 * Production-ready debounced search bar with clear button & ARIA accessibility.
 *
 * Props:
 * - value: string (initial/current search query)
 * - onChange: function(query: string) (debounced callback)
 * - placeholder: string (default: "Search skills...")
 * - debounceMs: number (default: 300)
 */

export default React.memo(function SearchBar({
  value = '',
  onChange,
  placeholder = 'Search skills...',
  debounceMs = 300
}) {
  const [searchTerm, setSearchTerm] = useState(value)

  // Sync internal state if external value prop changes
  useEffect(() => {
    setSearchTerm(value)
  }, [value])

  // Debounced callback execution
  useEffect(() => {
    const handler = setTimeout(() => {
      if (onChange && searchTerm !== value) {
        onChange(searchTerm)
      }
    }, debounceMs)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm, onChange, value, debounceMs])

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleClear = useCallback(() => {
    setSearchTerm('')
    if (onChange) {
      onChange('')
    }
  }, [onChange])

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4.5 h-4.5 stroke-[2.2]" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder={placeholder}
        aria-label="Search skills"
        style={{ background: 'var(--bg-soft, #FFFFFF)', borderColor: 'var(--border, #E2E8F0)', color: 'var(--text-dark, #0F172A)' }}
        className="w-full h-11 pl-10 pr-10 border rounded-2xl text-sm font-medium placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/20 rounded-r-2xl"
        >
          <div className="w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        </button>
      )}
    </div>
  )
})
