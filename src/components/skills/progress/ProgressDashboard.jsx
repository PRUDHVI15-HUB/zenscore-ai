import React from 'react'
import ProgressSummary from './ProgressSummary'
import LearningActivity from './LearningActivity'
import SkillProgressList from './SkillProgressList'
import AchievementsCard from './AchievementsCard'
import ProgressSkeleton from './ProgressSkeleton'
import EmptyProgress from './EmptyProgress'
import ErrorProgress from './ErrorProgress'
import { BarChart3 } from 'lucide-react'

/**
 * ProgressDashboard Component
 * Master learning analytics container.
 *
 * Prepared for:
 * GET /api/v1/users/me/progress
 * GET /api/v1/users/me/activity
 * GET /api/v1/users/me/achievements
 *
 * Props:
 * - progressSummary: ProgressSummaryData object
 * - learningActivity: LearningActivityItem[]
 * - activeSkills: ActiveSkillItem[]
 * - achievements: AchievementItem[]
 * - loading: boolean
 * - error: boolean | string | null
 * - onContinueSkill: function(skill)
 * - onExplore: function()
 * - onRetry: function()
 */

export default function ProgressDashboard({
  progressSummary = null,
  learningActivity = null,
  activeSkills = null,
  achievements = null,
  loading = false,
  error = null,
  onContinueSkill,
  onExplore,
  onRetry
}) {
  // 1. Loading State
  if (loading) {
    return <ProgressSkeleton />
  }

  // 2. Error State
  if (error) {
    return (
      <ErrorProgress
        onRetry={onRetry}
        message={typeof error === 'string' ? error : 'Unable to load progress analytics.'}
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h2 className="font-sora text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <span>My Progress & Learning Analytics</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track your study hours, active skill milestones, streak consistency, and unlocked badges.
          </p>
        </div>

        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 self-start sm:self-auto">
          Updated Today
        </span>
      </div>

      {/* Section 1: Summary Cards */}
      <ProgressSummary data={progressSummary || undefined} />

      {/* Section 2: Learning Activity */}
      <LearningActivity activities={learningActivity || undefined} />

      {/* Section 3: Skill Progress List */}
      <SkillProgressList skills={activeSkills || undefined} onContinueSkill={onContinueSkill} />

      {/* Section 4: Achievements & Badges */}
      <AchievementsCard achievements={achievements || undefined} />
    </div>
  )
}
