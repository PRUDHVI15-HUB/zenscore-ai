import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Layers, ChevronRight, CheckCircle2, Map } from 'lucide-react'

/**
 * RoadmapCard Component
 * Displays a single Roadmap summary card.
 *
 * Props:
 * - roadmap: Roadmap object
 * - isSelected: boolean
 * - onClick: function(roadmap)
 */

export default React.memo(function RoadmapCard({ roadmap, isSelected = false, onClick }) {
  if (!roadmap) return null

  const {
    title,
    category = 'General',
    difficulty = 'Beginner',
    durationWeeks = 8,
    totalModules = 6,
    progress = 0,
    icon = '🛣️',
    color = '#EFF6FF',
    accent = '#2563EB'
  } = roadmap

  const difficultyStyles = {
    Beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    Intermediate: 'bg-blue-50 text-blue-700 border-blue-200/60',
    Advanced: 'bg-purple-50 text-purple-700 border-purple-200/60'
  }
  const diffBadgeStyle = difficultyStyles[difficulty] || 'bg-slate-50 text-slate-700 border-slate-200'

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 12px 28px -5px rgba(15, 23, 42, 0.08)' }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick && onClick(roadmap)}
      style={{ background: 'var(--bg-soft, #FFFFFF)', borderColor: isSelected ? '#7C3AED' : 'var(--border, #E2E8F0)' }}
      className={`rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between h-full ${
        isSelected
          ? 'ring-2 ring-purple-500/20 shadow-md'
          : 'shadow-sm hover:border-purple-300'
      }`}
    >
      <div>
        {/* Top Header: Icon & Category + Difficulty Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm"
              style={{ backgroundColor: color }}
            >
              {icon}
            </div>
            <div>
              <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block">
                {category}
              </span>
              <h3 style={{ color: 'var(--text-dark, #0F172A)' }} className="font-sora text-base font-bold leading-snug">
                {title}
              </h3>
            </div>
          </div>
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${diffBadgeStyle} flex-shrink-0`}>
            {difficulty}
          </span>
        </div>

        {/* Stats Meta Row */}
        <div style={{ background: 'var(--bg, #F8FAFC)', borderColor: 'var(--border, #E2E8F0)', color: 'var(--text-mid, #475569)' }} className="flex items-center gap-4 text-xs my-4 py-2 px-3 rounded-xl border">
          <span className="flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {durationWeeks} weeks
          </span>
          <span className="flex items-center gap-1 font-medium">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            {totalModules} modules
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="text-slate-500">Roadmap Progress</span>
            <span className="text-purple-600 font-bold">{progress}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Button Footer */}
      <button
        type="button"
        className={`w-full h-10 rounded-xl font-sora font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
          isSelected
            ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/20'
            : 'bg-slate-900 hover:bg-purple-600 text-white shadow-sm'
        }`}
      >
        <span>{isSelected ? 'Viewing Roadmap' : 'Continue Roadmap'}</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  )
})
