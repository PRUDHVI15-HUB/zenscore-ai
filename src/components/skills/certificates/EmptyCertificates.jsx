import React from 'react'
import { Award, Compass } from 'lucide-react'

/**
 * EmptyCertificates Component
 * Displayed when no certificates exist or match filters.
 *
 * Props:
 * - onExplore: function
 */

export default React.memo(function EmptyCertificates({ onExplore }) {
  return (
    <div className="bg-white rounded-2xl p-10 border border-slate-200/80 shadow-sm text-center flex flex-col items-center justify-center min-h-[300px]">
      <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4 shadow-sm">
        <Award className="w-8 h-8 stroke-[1.8]" />
      </div>
      <h3 className="font-sora text-lg font-bold text-slate-900 mb-1.5">
        No certificates found
      </h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        Complete skill roadmaps and assessments to earn shareable, verified certificates.
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
