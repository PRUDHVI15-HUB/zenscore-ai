import React from 'react'
import { Flame, Zap } from 'lucide-react'

/**
 * LearningStreakCard Component
 * Displays streak information (days, fire icon, trend motivation).
 *
 * Props:
 * - streakDays: number
 * - bestStreak: number
 */

export default React.memo(function LearningStreakCard({ streakDays = 0, bestStreak = 0 }) {
  return (
    <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderColor: 'var(--border, #E2E8F0)' }} className="rounded-2xl p-6 border shadow-sm flex flex-col justify-between h-full relative overflow-hidden group">
      <div className="flex items-center justify-between mb-3">
        <span style={{ color: 'var(--text-muted, #94A3B8)' }} className="text-xs font-bold uppercase tracking-wider">
          Current Streak
        </span>
        <div style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B' }} className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
          <Flame className="w-5 h-5 fill-amber-500 animate-bounce" />
        </div>
      </div>

      <div className="my-2">
        <div className="flex items-baseline gap-2">
          <span style={{ color: 'var(--text-dark, #0F172A)' }} className="font-sora text-3xl font-extrabold">
            {streakDays}
          </span>
          <span className="font-sora text-base font-bold text-amber-600">
            Days 🔥
          </span>
        </div>
        <p style={{ color: 'var(--text-muted, #64748B)' }} className="text-xs mt-1">
          Personal Best: <strong style={{ color: 'var(--text-dark, #0F172A)' }} className="font-semibold">{bestStreak} Days</strong>
        </p>
      </div>

      <div style={{ borderColor: 'var(--border, #E2E8F0)' }} className="pt-3 border-t flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
        <Zap className="w-3.5 h-3.5 fill-current" />
        <span>Keep learning daily to maintain streak!</span>
      </div>
    </div>
  )
})
