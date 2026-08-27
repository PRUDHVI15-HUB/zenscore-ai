import React from 'react'
import { Map, Clock, CheckCircle2, Trophy, Sparkles, ArrowRight } from 'lucide-react'

/**
 * RoadmapProgress Component
 * Header / Banner component showing current roadmap completion %, modules progress, remaining time,
 * and a direct 1-click launcher to enter the interactive Skill Workspace.
 *
 * Props:
 * - roadmap: Roadmap object
 * - onLaunchWorkspace: function(roadmap)
 */

export default React.memo(function RoadmapProgress({ roadmap, onLaunchWorkspace }) {
  if (!roadmap) return null

  const {
    title,
    category = 'General',
    difficulty = 'Intermediate',
    durationWeeks = 8,
    progress = 0,
    completedModules = 0,
    totalModules = 6,
    timeRemaining = '4.5 hrs remaining',
    skillId
  } = roadmap

  return (
    <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800 relative overflow-hidden mb-8">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Side Info */}
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-purple-200 text-xs font-semibold">
            <Map className="w-3.5 h-3.5 text-purple-400" />
            <span>{category} • {difficulty}</span>
          </div>

          <h2 className="font-sora text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {title} Roadmap
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Follow this structured, step-by-step module path to master key competencies and complete real-world projects.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2 font-medium">
            <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {completedModules} of {totalModules} Modules Completed
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {timeRemaining}
            </span>
          </div>

          {/* Direct Skill Workspace launcher CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onLaunchWorkspace && onLaunchWorkspace(roadmap)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-sora font-bold text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>Enter Interactive Learning Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Side Completion Meter */}
        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 text-center min-w-[200px] flex flex-col items-center justify-center flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 mb-2">
            <Trophy className="w-5 h-5 stroke-[2]" />
          </div>

          <div className="font-sora text-3xl font-extrabold text-white tracking-tight">
            {progress}%
          </div>
          <span className="text-[11px] font-semibold text-purple-200 uppercase tracking-wider block mt-0.5 mb-3">
            Overall Completion
          </span>

          <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
})
