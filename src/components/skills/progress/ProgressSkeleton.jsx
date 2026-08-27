import React from 'react'

/**
 * ProgressSkeleton Component
 * Animated skeleton placeholders during loading state.
 */

export default React.memo(function ProgressSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* 4 Summary Card Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((idx) => (
          <div key={idx} className="h-36 bg-slate-200 rounded-2xl" />
        ))}
      </div>

      {/* Activity Skeleton */}
      <div className="h-64 bg-slate-200 rounded-2xl" />

      {/* Skill Progress List Skeleton */}
      <div className="h-72 bg-slate-200 rounded-2xl" />

      {/* Achievements Skeleton */}
      <div className="h-56 bg-slate-200 rounded-2xl" />
    </div>
  )
})
