import React from 'react'

export function JobCardSkeleton() {
  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 20,
      padding: 22,
      border: '1px solid #E2E8F0',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      boxShadow: '0 2px 10px rgba(15,23,42,0.03)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: 80, height: 20, borderRadius: 10, background: '#E2E8F0' }} className="animate-pulse" />
        <div style={{ width: 60, height: 20, borderRadius: 10, background: '#E2E8F0' }} className="animate-pulse" />
      </div>

      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#E2E8F0' }} className="animate-pulse" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ width: '70%', height: 18, borderRadius: 6, background: '#E2E8F0' }} className="animate-pulse" />
          <div style={{ width: '40%', height: 14, borderRadius: 6, background: '#E2E8F0' }} className="animate-pulse" />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        <div style={{ width: 90, height: 24, borderRadius: 8, background: '#E2E8F0' }} className="animate-pulse" />
        <div style={{ width: 70, height: 24, borderRadius: 8, background: '#E2E8F0' }} className="animate-pulse" />
      </div>

      <div style={{ width: '100%', height: 44, borderRadius: 12, background: '#F1F5F9' }} className="animate-pulse" />

      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, height: 38, borderRadius: 10, background: '#E2E8F0' }} className="animate-pulse" />
        <div style={{ width: 100, height: 38, borderRadius: 10, background: '#E2E8F0' }} className="animate-pulse" />
      </div>
    </div>
  )
}

export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: 20,
      marginTop: 20
    }}>
      {Array.from({ length: count }).map((_, idx) => (
        <JobCardSkeleton key={idx} />
      ))}
    </div>
  )
}
