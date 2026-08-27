import React from 'react'
import { LineChart, Compass } from 'lucide-react'

/**
 * EmptyProgress Component
 * Displayed when user has zero activity or progress recorded yet.
 *
 * Props:
 * - onExplore: function
 */

export default React.memo(function EmptyProgress({ onExplore }) {
  return (
    <div className="bg-white rounded-2xl p-10 border border-slate-200/80 shadow-sm text-center flex flex-col items-center justify-center min-h-[300px]">
      <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4 shadow-sm">
        <LineChart className="w-8 h-8 stroke-[1.8]" />
      </div>
      <h3 className="font-sora text-lg font-bold text-slate-900 mb-1.5">
        No progress recorded yet
      </h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        Start learning a skill roadmap to begin tracking your progress metrics and streaks.
      </p>
      {onExplore && (
        <button
          type="button"
          onClick={onExplore}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-sora font-semibold text-xs transition-all shadow-md shadow-purple-600/20 cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          <span>Explore Skills</span>
        </button>
      )}
    </div>
  )
})
