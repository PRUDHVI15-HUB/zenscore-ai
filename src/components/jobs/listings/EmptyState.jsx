import React from 'react'
import { SearchX, RotateCcw } from 'lucide-react'

export default function EmptyState({ onClearFilters, message = 'No jobs found matching your filters.' }) {
  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 24,
      padding: '56px 24px',
      textAlign: 'center',
      border: '1px border-dashed #CBD5E1',
      boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 14,
      marginTop: 20
    }}>
      <div style={{
        width: 64,
        height: 64,
        borderRadius: 20,
        background: '#F1F5F9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#64748B'
      }}>
        <SearchX size={32} />
      </div>

      <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
        {message}
      </h3>

      <p style={{ fontSize: 13.5, color: '#64748B', maxWidth: 440, lineHeight: 1.5, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
        Try clearing your search query, location filters, or category preferences to discover more opportunities.
      </p>

      {onClearFilters && (
        <button
          onClick={onClearFilters}
          style={{
            marginTop: 6,
            height: 40,
            padding: '0 20px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
            color: '#FFFFFF',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Sora, sans-serif',
            fontWeight: 700,
            fontSize: 13,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 14px rgba(124, 58, 237, 0.22)'
          }}
        >
          <RotateCcw size={14} />
          <span>Clear Filters</span>
        </button>
      )}
    </div>
  )
}
