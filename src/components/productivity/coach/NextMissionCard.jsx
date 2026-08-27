import React from 'react'
import { Zap, Play } from 'lucide-react'

export default function NextMissionCard({ nextMission = '', onStartMission }) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)',
        borderRadius: 20,
        padding: 24,
        color: '#FFFFFF',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.2)',
        marginBottom: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}
    >
      <div style={{ flex: 1, minWidth: 260 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: '#4C1D95',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#A78BFA'
            }}
          >
            <Zap size={16} />
          </div>
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontFamily: 'Sora, sans-serif',
              color: '#A78BFA'
            }}
          >
            Next Mission (Single Actionable Objective)
          </span>
        </div>

        <h3
          style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: 18,
            fontWeight: 800,
            color: '#FFFFFF',
            margin: 0,
            lineHeight: 1.4
          }}
        >
          {nextMission}
        </h3>
      </div>

      <button
        onClick={onStartMission}
        style={{
          height: 44,
          padding: '0 24px',
          borderRadius: 14,
          background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
          color: '#FFFFFF',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'Sora, sans-serif',
          fontWeight: 700,
          fontSize: 13.5,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)',
          transition: 'all 0.2s ease'
        }}
      >
        <Play size={16} fill="#FFFFFF" />
        <span>Start Mission Session</span>
      </button>
    </div>
  )
}
