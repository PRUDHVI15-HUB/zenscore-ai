import React from 'react'
import { Trophy, Award, Sparkles, Lock } from 'lucide-react'

/**
 * AchievementsCard Component
 * Displays unlocked achievements and badges grid.
 *
 * Props:
 * - achievements: Array of AchievementItem objects
 */

export default React.memo(function AchievementsCard({ achievements = [] }) {
  const items = Array.isArray(achievements) ? achievements : []

  const unlockedItems = items.filter(a => a.unlocked !== false)

  if (unlockedItems.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mb-3">
          <Trophy className="w-6 h-6 stroke-[2]" />
        </div>
        <h4 className="font-sora text-base font-bold text-slate-900 mb-1">
          No achievements yet
        </h4>
        <p className="text-xs text-slate-500 max-w-sm">
          Keep learning to unlock your first badge.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Trophy className="w-4.5 h-4.5 stroke-[2.2]" />
          </div>
          <h3 className="font-sora text-lg font-bold text-slate-900">
            Badges & Achievements
          </h3>
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
          <Sparkles className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          {unlockedItems.length} Unlocked
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id || item.title}
            className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
              item.unlocked !== false
                ? 'bg-amber-50/40 border-amber-200/70 hover:border-amber-300 shadow-sm'
                : 'bg-slate-50 border-slate-200/60 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm border border-amber-100">
                  {item.icon || '🏆'}
                </div>
                {item.unlocked === false && <Lock className="w-4 h-4 text-slate-400" />}
              </div>

              <h4 className="font-sora text-sm font-bold text-slate-900 mb-1">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                {item.description}
              </p>
            </div>

            <span className="text-[11px] font-semibold text-amber-700 block">
              {item.earnedAt || 'Unlocked'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
})
