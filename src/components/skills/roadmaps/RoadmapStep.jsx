import React from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  PlayCircle,
  Lock,
  Clock,
  Video,
  BookOpen,
  Code,
  FileQuestion,
  FolderGit2,
  ChevronRight
} from 'lucide-react'

/**
 * RoadmapStep Component
 * Single module node in the vertical learning timeline.
 *
 * Props:
 * - module: RoadmapModule object
 * - index: number
 * - isLast: boolean
 * - onModuleAction: function(module)
 */

export default React.memo(function RoadmapStep({
  module,
  index = 0,
  isLast = false,
  onModuleAction
}) {
  if (!module) return null

  const {
    id,
    title,
    description,
    duration = '2 hrs',
    status = 'locked', // "completed" | "current" | "locked"
    resources = {}
  } = module

  const {
    videos = 0,
    readings = 0,
    exercises = 0,
    quiz = false,
    project = false
  } = resources

  const isCompleted = status === 'completed'
  const isCurrent = status === 'current'
  const isLocked = status === 'locked'

  return (
    <div className="relative flex items-start gap-4 sm:gap-6 group">
      {/* Timeline Node & Connector Line */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Node Status Icon */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-all ${
            isCompleted
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
              : isCurrent
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-4 ring-purple-100'
              : 'bg-slate-100 border-2 border-slate-300 text-slate-400'
          }`}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          ) : isCurrent ? (
            <PlayCircle className="w-5 h-5 fill-current" />
          ) : (
            <Lock className="w-4 h-4" />
          )}
        </div>

        {/* Vertical Connector Line */}
        {!isLast && (
          <div
            className={`w-0.5 my-2 flex-1 min-h-[60px] ${
              isCompleted ? 'bg-emerald-400' : isCurrent ? 'bg-purple-300' : 'bg-slate-200'
            }`}
          />
        )}
      </div>

      {/* Module Card Content */}
      <motion.div
        whileHover={{ y: -2 }}
        onClick={() => onModuleAction && onModuleAction(module)}
        style={{ background: 'var(--bg-soft, #FFFFFF)', borderColor: 'var(--border, #E2E8F0)' }}
        className={`flex-1 rounded-2xl p-5 sm:p-6 border shadow-sm transition-all mb-6 cursor-pointer group-hover:border-purple-300 ${
          isCurrent
            ? 'ring-2 ring-purple-500/10 shadow-md'
            : 'hover:border-purple-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--text-muted, #94A3B8)' }} className="text-xs font-extrabold tracking-wider">
              MODULE {index + 1}
            </span>
            {isCompleted && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                ✅ Completed
              </span>
            )}
            {isCurrent && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60 animate-pulse">
                ▶ In Progress
              </span>
            )}
            {isLocked && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                🔒 Next Up
              </span>
            )}
          </div>

          <span style={{ color: 'var(--text-muted, #94A3B8)' }} className="flex items-center gap-1 text-xs font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {duration}
          </span>
        </div>

        {/* Title & Description */}
        <h4 style={{ color: 'var(--text-dark, #0F172A)' }} className="font-sora text-base font-bold mb-1.5 group-hover:text-purple-600 transition-colors">
          {title}
        </h4>
        <p style={{ color: 'var(--text-muted, #64748B)' }} className="text-xs sm:text-sm leading-relaxed mb-4">
          {description}
        </p>

        {/* Resources & Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
          {/* Resource Icons */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            {videos > 0 && (
              <span className="flex items-center gap-1 font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                <Video className="w-3.5 h-3.5 text-blue-500" />
                {videos} {videos === 1 ? 'video' : 'videos'}
              </span>
            )}
            {readings > 0 && (
              <span className="flex items-center gap-1 font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                {readings} {readings === 1 ? 'reading' : 'readings'}
              </span>
            )}
            {exercises > 0 && (
              <span className="flex items-center gap-1 font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                <Code className="w-3.5 h-3.5 text-indigo-500" />
                {exercises} {exercises === 1 ? 'exercise' : 'exercises'}
              </span>
            )}
            {quiz && (
              <span className="flex items-center gap-1 font-medium bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg border border-purple-100">
                <FileQuestion className="w-3.5 h-3.5 text-purple-600" />
                Quiz included
              </span>
            )}
            {project && (
              <span className="flex items-center gap-1 font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-100">
                <FolderGit2 className="w-3.5 h-3.5 text-emerald-600" />
                Mini Project
              </span>
            )}
          </div>

          {/* Module Action Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              if (onModuleAction) onModuleAction(module)
            }}
            className={`h-9 px-4 rounded-xl font-sora font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
              isCurrent
                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20'
                : isCompleted
                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-slate-900 hover:bg-purple-600 text-white'
            }`}
          >
            <span>
              {isCurrent ? 'Continue Learning' : isCompleted ? 'Review Lesson' : 'Start Module'}
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  )
})
