import React, { useState } from 'react'
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Clock,
  Award,
  Sparkles,
  FileText,
  ShieldCheck,
  Zap,
  Target,
  Lock
} from 'lucide-react'

/**
 * ModuleSidebar Component
 * Production sticky companion sidebar rendering collapsible curriculum phases,
 * live completion metrics, certificate unlocks, and quick study tools to eliminate dead space.
 */
export default function ModuleSidebar({
  skill,
  activeLessonId,
  onSelectLesson,
  onOpenAI,
  onOpenNotes
}) {
  const [expandedModules, setExpandedModules] = useState({})

  const toggleModule = (moduleIdx) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleIdx]: !prev[moduleIdx]
    }))
  }

  const lessons = skill?.lessons || []
  const modules = skill?.modules || []
  const userProgress = skill?.userProgress || {}
  const completedLessons = userProgress.completedLessons?.length || lessons.filter(l => l.isCompleted).length || 0
  const totalLessons = lessons.length || 1
  const completionPercentage = userProgress.completionPercentage || Math.round((completedLessons / totalLessons) * 100)
  const isMastered = completionPercentage === 100

  return (
    <div className="w-full lg:w-80 shrink-0 sticky top-6 self-start space-y-4 font-inter">
      {/* ─────────────────────────────────────────────────────────────
          1. CURRICULUM OUTLINE SIDEBAR CARD
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <h3 className="font-sora text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>Curriculum Outline</span>
          </h3>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
            {completedLessons} / {totalLessons} Done
          </span>
        </div>

        {/* Modules List */}
        <div className="space-y-2.5 overflow-y-auto max-h-[calc(100vh-320px)] pr-1 custom-scrollbar">
          {modules.map((mod, modIdx) => {
            const isExpanded = expandedModules[modIdx] !== false
            const completedCount = mod.lessons?.filter(l => l.isCompleted).length || 0
            const totalCount = mod.lessons?.length || 0
            const isModuleComplete = totalCount > 0 && completedCount === totalCount
            const isPhaseLocked = Boolean(mod.isLocked)

            return (
              <div key={mod.id || modIdx} className={`border rounded-xl overflow-hidden ${isPhaseLocked ? 'border-slate-200 bg-slate-100/50 opacity-75' : 'border-slate-100 bg-slate-50/50'}`}>
                {/* Module Phase Header */}
                <button
                  type="button"
                  onClick={() => toggleModule(modIdx)}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-slate-100/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 pr-2 min-w-0">
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <span className="font-sora text-xs font-bold text-slate-800 line-clamp-1 flex items-center gap-1.5">
                        {isPhaseLocked && <Lock className="w-3 h-3 text-slate-400 shrink-0" />}
                        <span>{mod.title}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                        {completedCount} / {totalCount} lessons completed
                      </span>
                    </div>
                  </div>

                  {isModuleComplete ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  ) : isPhaseLocked ? (
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                      <Lock className="w-3 h-3" />
                    </span>
                  ) : null}
                </button>

                {/* Module Lessons List */}
                {isExpanded && (
                  <div className="bg-white border-t border-slate-100 py-1 divide-y divide-slate-50">
                    {mod.lessons?.map((lesson) => {
                      const isActive = activeLessonId === lesson.id
                      const isDone = lesson.isCompleted
                      const isLocked = lesson.isLocked && !isDone

                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          disabled={isLocked}
                          onClick={() => !isLocked && onSelectLesson && onSelectLesson(lesson)}
                          className={`w-full px-3 py-2 flex items-start gap-2.5 text-left transition-all ${
                            isLocked
                              ? 'bg-slate-50/70 text-slate-400 cursor-not-allowed opacity-60'
                              : isActive
                                ? 'bg-purple-50/90 text-purple-900 border-l-4 border-purple-600 font-semibold cursor-pointer'
                                : 'hover:bg-slate-50 text-slate-700 cursor-pointer'
                          }`}
                        >
                          <span className="mt-0.5 shrink-0">
                            {isDone ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-50" />
                            ) : isLocked ? (
                              <Lock className="w-3.5 h-3.5 text-slate-400" />
                            ) : (
                              <Circle className={`w-3.5 h-3.5 ${isActive ? 'text-purple-600' : 'text-slate-300'}`} />
                            )}
                          </span>

                          <div className="flex-1 min-w-0">
                            <span className={`text-xs block line-clamp-1 ${isActive ? 'font-bold text-purple-950' : 'font-medium'}`}>
                              {lesson.title?.startsWith(`${lesson.lessonNumber}.`) ? lesson.title : `${lesson.lessonNumber}. ${lesson.title}`}
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              <span>{lesson.estimatedMinutes || 30} mins</span>
                              {isLocked && <span className="ml-1 text-[9.5px] font-bold text-slate-400">(Locked)</span>}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. SIDEBAR LEARNING MILESTONE PROGRESS WIDGET
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white rounded-2xl p-4 shadow-sm border border-purple-900/30 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-purple-200">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>Skill Milestone</span>
          </span>
          <span className="font-mono text-purple-300 font-bold">{completionPercentage}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-700/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 transition-all duration-500 rounded-full"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-slate-700/60">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>12 Day Streak</span>
          </span>
          <span className="font-semibold text-emerald-400">
            {isMastered ? '✓ Ready for Cert' : `${totalLessons - completedLessons} Lessons Left`}
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. COMPACT STUDY TOOLS LAUNCHER
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-3.5 flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenAI}
          className="flex-1 h-9 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/70 text-xs font-sora font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask AI</span>
        </button>

        <button
          type="button"
          onClick={onOpenNotes}
          className="flex-1 h-9 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/70 text-xs font-sora font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-amber-600" />
          <span>My Notes</span>
        </button>
      </div>
    </div>
  )
}
