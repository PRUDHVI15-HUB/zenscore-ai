import React from 'react'

/**
 * CertificateSkeleton Component
 * Animated skeleton placeholder cards for loading state.
 */

export default React.memo(function CertificateSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((idx) => (
          <div key={idx} className="h-32 bg-slate-200 rounded-2xl" />
        ))}
      </div>

      {/* Filter Bar Skeleton */}
      <div className="h-14 bg-slate-200 rounded-2xl" />

      {/* Grid Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div key={idx} className="h-64 bg-slate-200 rounded-2xl" />
        ))}
      </div>
    </div>
  )
})
