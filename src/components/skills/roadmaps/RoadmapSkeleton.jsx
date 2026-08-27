import React from 'react'

/**
 * RoadmapSkeleton Component
 * Animated skeleton placeholder during loading state.
 */

export default React.memo(function RoadmapSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-44 w-full bg-slate-200 rounded-2xl" />

      {/* Grid Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((idx) => (
          <div key={idx} className="h-48 bg-slate-200 rounded-2xl" />
        ))}
      </div>

      {/* Timeline Steps Skeletons */}
      <div className="space-y-4 pt-4">
        {[1, 2, 3].map((idx) => (
          <div key={idx} className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0" />
            <div className="flex-1 h-32 bg-slate-200 rounded-2xl" />
          </div>
        ))}
      </div>
    </div>
  )
})
