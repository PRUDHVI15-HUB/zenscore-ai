import React from 'react'
import { motion } from 'framer-motion'

const INTENSITY_COLORS = {
  0: 'var(--border, #F1F5F9)', // No Study
  1: '#DDD6FE', // Low (1-25m)
  2: '#A78BFA', // Medium (26-50m)
  3: '#7C3AED', // High (51-89m)
  4: '#5B21B6'  // Very High (90m+)
}

const INTENSITY_LABELS = {
  0: 'No Study (0m)',
  1: 'Low (1-25m)',
  2: 'Medium (26-50m)',
  3: 'High (51-89m)',
  4: 'Very High (90m+)'
}

export default function StudyHeatmap({ heatmapData }) {
  return (
    <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderRadius: 20, padding: 24, border: '1px solid var(--border, #E2E8F0)', marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--text-dark, #0F172A)', margin: 0 }}>
            🔥 Study Activity Heatmap (Last 90 Days)
          </h3>
          <p style={{ fontSize: 12.5, color: 'var(--text-muted, #64748B)', marginTop: 2, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
            GitHub-style daily focus intensity tracking
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted, #64748B)', fontWeight: 600 }}>
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              title={INTENSITY_LABELS[level]}
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                background: INTENSITY_COLORS[level]
              }}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div
        style={{
          display: 'grid',
          gridAutoFlow: 'column',
          gridTemplateRows: 'repeat(7, 1fr)',
          gap: 5,
          overflowX: 'auto',
          paddingBottom: 8
        }}
      >
        {heatmapData.map((day, idx) => (
          <motion.div
            key={day.date}
            whileHover={{ scale: 1.25, zIndex: 10 }}
            title={`${day.displayDate}: ${day.minutes} Mins Studied (${INTENSITY_LABELS[day.intensity]})`}
            style={{
              width: 13,
              height: 13,
              borderRadius: 3,
              background: INTENSITY_COLORS[day.intensity],
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          />
        ))}
      </div>
    </div>
  )
}
