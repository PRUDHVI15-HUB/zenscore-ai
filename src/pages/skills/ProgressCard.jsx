import React from 'react'
import { Award, BookOpen, CheckCircle2, ShieldCheck, Clock } from 'lucide-react'

/**
 * ProgressCard Component
 * Header banner displaying Skill title, difficulty badge, real completion metrics,
 * and active phase indicators without any manual completion buttons.
 */
export default function ProgressCard({
  skill,
  userProgress,
  activeLesson
}) {
  const percent = userProgress?.completionPercentage || 0
  const completedLessons = userProgress?.completedLessons || []
  const completedCount = completedLessons.length
  const totalCount = skill?.lessons?.length || 6
  const isMastered = percent === 100

  return (
    <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden mb-6 border border-purple-900/30">
      {/* Background Accent Blurs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-purple-500/20 text-purple-300 border border-purple-400/30">
              {typeof skill?.category === 'object' ? skill?.category?.name : (skill?.category || 'Engineering')}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800/80 text-slate-300 border border-slate-700/60">
              {skill?.difficulty || skill?.level || 'Intermediate'}
            </span>
          </div>

          <h1 className="font-sora text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
            {skill?.name || skill?.title || 'Skill Workspace'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {skill?.description || 'Master this engineering technology through structured modules, interactive practice, and hands-on exercises.'}
          </p>
        </div>

        {/* Real Progress Metrics Widget */}
        <div className="w-full md:w-80 bg-slate-800/60 backdrop-blur-md rounded-xl p-5 border border-slate-700/60 flex flex-col justify-between shrink-0">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-2">
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-400" />
              <span>Skill Progress</span>
            </span>
            <span className="text-purple-300 font-bold font-sora text-sm">{percent}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-700/80 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11.5px] text-slate-300 pt-2 border-t border-slate-700/50">
            <span>{completedCount} of {totalCount} Lessons Mastered</span>
            <span className={`font-semibold ${isMastered ? 'text-emerald-400' : 'text-purple-300'}`}>
              {isMastered ? '✓ Mastered' : 'In Progress'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
