import React from 'react'

/**
 * SkillSkeleton Component
 * Animated skeleton placeholder cards (6 items) displayed while loading.
 *
 * Props:
 * - count: number (default: 6)
 */

export default React.memo(function SkillSkeleton({ count = 6 }) {
  const skeletons = Array.from({ length: count })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {skeletons.map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm animate-pulse flex flex-col justify-between h-[310px]"
        >
          <div>
            {/* Top Row Skeleton */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-200" />
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-slate-200 rounded" />
                  <div className="h-4 w-32 bg-slate-200 rounded" />
                </div>
              </div>
              <div className="h-5 w-16 bg-slate-200 rounded-full" />
            </div>

            {/* Title & Subtitle Skeleton */}
            <div className="space-y-2 mb-4">
              <div className="h-4 w-3/4 bg-slate-200 rounded" />
              <div className="h-3 w-full bg-slate-150 bg-slate-200/70 rounded" />
              <div className="h-3 w-5/6 bg-slate-150 bg-slate-200/70 rounded" />
            </div>

            {/* Info Row Skeleton */}
            <div className="h-9 w-full bg-slate-100 rounded-xl mb-4" />
          </div>

          {/* Button Skeleton */}
          <div className="h-10 w-full bg-slate-200 rounded-xl" />
        </div>
      ))}
    </div>
  )
})
