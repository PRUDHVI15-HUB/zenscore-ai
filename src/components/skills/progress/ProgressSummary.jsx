import React from 'react'
import { Clock, CheckCircle2, Flame, TrendingUp, Award } from 'lucide-react'
import LearningStreakCard from './LearningStreakCard'

/**
 * ProgressSummary Component
 * 4 metric summary cards displaying learning metrics.
 *
 * Props:
 * - data: ProgressSummaryData object
 */

export default React.memo(function ProgressSummary({ data = {} }) {
  const {
    totalHours = 0,
    weeklyTrend = '0 hrs this week',
    skillsCompleted = 0,
    completionRate = 0,
    streakDays = 0,
    bestStreak = 0,
    overallProgress = 0
  } = data

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* 1. Total Learning Hours Card */}
      <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderColor: 'var(--border, #E2E8F0)' }} className="rounded-2xl p-6 border shadow-sm flex flex-col justify-between h-full">
        <div className="flex items-center justify-between mb-3">
          <span style={{ color: 'var(--text-muted, #94A3B8)' }} className="text-xs font-bold uppercase tracking-wider">
            Total Learning Hours
          </span>
          <div style={{ background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }} className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
            <Clock className="w-5 h-5 stroke-[2]" />
          </div>
        </div>
        <div className="my-2">
          <span style={{ color: 'var(--text-dark, #0F172A)' }} className="font-sora text-3xl font-extrabold">
            {totalHours}
          </span>
          <span style={{ color: 'var(--text-muted, #64748B)' }} className="text-xs ml-1 font-semibold">hrs</span>
        </div>
        <div style={{ borderColor: 'var(--border, #E2E8F0)' }} className="pt-3 border-t flex items-center gap-1.5 text-xs text-purple-600 font-semibold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{weeklyTrend}</span>
        </div>
      </div>

      {/* 2. Skills Completed Card */}
      <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderColor: 'var(--border, #E2E8F0)' }} className="rounded-2xl p-6 border shadow-sm flex flex-col justify-between h-full">
        <div className="flex items-center justify-between mb-3">
          <span style={{ color: 'var(--text-muted, #94A3B8)' }} className="text-xs font-bold uppercase tracking-wider">
            Skills Completed
          </span>
          <div style={{ background: 'rgba(5, 150, 105, 0.12)', color: '#059669' }} className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-5 h-5 stroke-[2]" />
          </div>
        </div>
        <div className="my-2">
          <span style={{ color: 'var(--text-dark, #0F172A)' }} className="font-sora text-3xl font-extrabold">
            {skillsCompleted}
          </span>
          <span style={{ color: 'var(--text-muted, #64748B)' }} className="text-xs ml-1 font-semibold">skills</span>
        </div>
        <div style={{ borderColor: 'var(--border, #E2E8F0)' }} className="pt-3 border-t flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
          <span>{completionRate}% completion rate</span>
        </div>
      </div>

      {/* 3. Current Streak Card */}
      <LearningStreakCard streakDays={streakDays} bestStreak={bestStreak} />

      {/* 4. Overall Progress Card */}
      <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderColor: 'var(--border, #E2E8F0)' }} className="rounded-2xl p-6 border shadow-sm flex flex-col justify-between h-full">
        <div className="flex items-center justify-between mb-3">
          <span style={{ color: 'var(--text-muted, #94A3B8)' }} className="text-xs font-bold uppercase tracking-wider">
            Overall Progress
          </span>
          <div style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#6366F1' }} className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
            <Award className="w-5 h-5 stroke-[2]" />
          </div>
        </div>
        <div className="my-2">
          <div className="flex items-baseline justify-between mb-1.5">
            <span style={{ color: 'var(--text-dark, #0F172A)' }} className="font-sora text-3xl font-extrabold">
              {overallProgress}%
            </span>
            <span className="text-xs font-bold text-indigo-600">Active Path</span>
          </div>
          <div style={{ background: 'var(--border, #E2E8F0)' }} className="h-2.5 w-full rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
        <div style={{ borderColor: 'var(--border, #E2E8F0)', color: 'var(--text-muted, #64748B)' }} className="pt-3 border-t text-xs font-medium">
          Target: <strong style={{ color: 'var(--text-dark, #0F172A)' }}>Full Mastery</strong>
        </div>
      </div>
    </div>
  )
})
