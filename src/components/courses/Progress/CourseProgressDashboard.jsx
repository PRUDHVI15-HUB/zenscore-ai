import React from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Clock, CheckCircle2, Flame, Award, TrendingUp, Layers, Activity } from 'lucide-react'

export default function CourseProgressDashboard({
  progressSummary = null,
  activeCourses = [],
  learningActivity = [],
  achievements = [],
  onContinueCourse
}) {
  const summary = progressSummary || {
    totalHours: 0,
    weeklyTrend: '+0 hrs this week',
    skillsCompleted: 0,
    completionRate: 0,
    streakDays: 0,
    bestStreak: 0,
    overallProgress: 0
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h2 className="font-sora text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <span>Course Progress & Learning Analytics</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track study hours, active course milestones, streak consistency, and unlocked badges.
          </p>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Study Hours</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Clock className="w-5 h-5 stroke-[2]" />
            </div>
          </div>
          <div className="my-2">
            <span className="font-sora text-3xl font-extrabold text-slate-900">{summary.totalHours}</span>
            <span className="text-xs text-slate-500 ml-1 font-semibold">hrs</span>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-purple-600 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{summary.weeklyTrend}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Courses Completed</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5 stroke-[2]" />
            </div>
          </div>
          <div className="my-2">
            <span className="font-sora text-3xl font-extrabold text-slate-900">{summary.skillsCompleted}</span>
            <span className="text-xs text-slate-500 ml-1 font-semibold">courses</span>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <span>{summary.completionRate}% completion rate</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Streak</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <Flame className="w-5 h-5 fill-current" />
            </div>
          </div>
          <div className="my-2">
            <span className="font-sora text-3xl font-extrabold text-slate-900">{summary.streakDays}</span>
            <span className="text-xs font-bold text-amber-600 ml-1">Days 🔥</span>
          </div>
          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
            Personal Best: <strong className="text-slate-800">{summary.bestStreak} Days</strong>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Progress</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Award className="w-5 h-5 stroke-[2]" />
            </div>
          </div>
          <div className="my-2">
            <span className="font-sora text-3xl font-extrabold text-slate-900">{summary.overallProgress}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-600 to-indigo-600" style={{ width: `${summary.overallProgress}%` }} />
          </div>
        </div>
      </div>

      {/* Active Courses List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Layers className="w-5 h-5 text-purple-600" />
          <h3 className="font-sora text-base font-bold text-slate-900">Active Course Progress</h3>
        </div>

        {activeCourses.length === 0 ? (
          <p className="text-xs text-slate-500">No active courses in progress.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {activeCourses.map((c) => (
              <div key={c.id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-sora text-xs font-bold text-slate-900">{c.name}</h4>
                  <span className="text-[10px] text-slate-400">{c.category} • {c.currentModule}</span>
                </div>
                <button
                  onClick={() => onContinueCourse && onContinueCourse(c)}
                  className="px-3 py-1.5 bg-purple-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Continue
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Badges Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="font-sora text-base font-bold text-slate-900">Specialization Badges</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((ach) => (
            <div key={ach.id} className={`p-4 rounded-xl border text-center ${ach.unlocked ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
              <div className="text-2xl mb-1">{ach.icon}</div>
              <h4 className="font-sora text-xs font-bold text-slate-900 mb-0.5">{ach.title}</h4>
              <span className="text-[10px] text-slate-500">{ach.earnedAt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
