import React from 'react'

/**
 * FilterBar Component
 * Difficulty and Category single-select filter chips with active states and keyboard navigation.
 *
 * Props:
 * - selectedDifficulty: string (default: "All")
 * - selectedCategory: string (default: "All")
 * - onDifficultyChange: function(difficulty: string)
 * - onCategoryChange: function(category: string)
 * - difficulties: string[]
 * - categories: string[]
 */

const DEFAULT_DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced']
const DEFAULT_CATEGORIES = [
  'All',
  'Web Development',
  'Data Science',
  'AI / ML',
  'Cloud',
  'DevOps',
  'Cybersecurity',
  'Mobile',
  'UI/UX'
]

export default React.memo(function FilterBar({
  selectedDifficulty = 'All',
  selectedCategory = 'All',
  onDifficultyChange,
  onCategoryChange,
  difficulties = DEFAULT_DIFFICULTIES,
  categories = DEFAULT_CATEGORIES
}) {
  return (
    <div className="space-y-4">
      {/* Category Chips Row */}
      <div>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Categories
        </span>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange && onCategoryChange(cat)}
                aria-pressed={isActive}
                aria-label={`Filter by category: ${cat}`}
                style={{
                  background: isActive ? undefined : 'var(--bg-soft, #FFFFFF)',
                  borderColor: isActive ? undefined : 'var(--border, #E2E8F0)',
                  color: isActive ? '#FFFFFF' : 'var(--text-mid, #475569)'
                }}
                className={`h-8 px-3.5 rounded-full text-xs border transition-all duration-180 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/30 ${
                  isActive
                    ? 'bg-purple-600 text-white font-bold shadow-sm shadow-purple-600/20'
                    : 'hover:border-purple-400 font-medium'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Difficulty Chips Row */}
      <div>
        <span style={{ color: 'var(--text-muted, #94A3B8)' }} className="text-[11px] font-bold uppercase tracking-wider block mb-2">
          Difficulty Level
        </span>
        <div className="flex flex-wrap gap-2">
          {difficulties.map((diff) => {
            const isActive = selectedDifficulty === diff
            return (
              <button
                key={diff}
                type="button"
                onClick={() => onDifficultyChange && onDifficultyChange(diff)}
                aria-pressed={isActive}
                aria-label={`Filter by difficulty: ${diff}`}
                style={{
                  background: isActive ? undefined : 'var(--bg-soft, #FFFFFF)',
                  borderColor: isActive ? undefined : 'var(--border, #E2E8F0)',
                  color: isActive ? '#FFFFFF' : 'var(--text-mid, #475569)'
                }}
                className={`h-8 px-3.5 rounded-full text-xs border transition-all duration-180 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/30 ${
                  isActive
                    ? 'bg-purple-600 text-white font-bold shadow-sm shadow-purple-600/20'
                    : 'hover:border-purple-400 font-medium'
                }`}
              >
                {diff}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
})
