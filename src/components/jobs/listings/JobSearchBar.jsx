import React from 'react'
import { Search, X } from 'lucide-react'

export default function JobSearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
      <input
        type="text"
        placeholder="Search across job title, company name, or required skills (e.g., React, Python, Google)..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          width: '100%',
          height: 46,
          padding: '0 42px 0 46px',
          borderRadius: 14,
          border: '1.5px solid #E2E8F0',
          background: '#FFFFFF',
          fontSize: 14,
          fontWeight: 500,
          color: '#0F172A',
          outline: 'none',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
          fontFamily: 'DM Sans, sans-serif'
        }}
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          style={{
            position: 'absolute',
            right: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
