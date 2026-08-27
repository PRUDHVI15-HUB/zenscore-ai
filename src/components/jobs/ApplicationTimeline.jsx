import React from 'react'
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react'

const STAGES = [
  'Applied',
  'Resume Reviewed',
  'Assessment',
  'Technical Interview',
  'HR Interview',
  'Offer'
]

export default function ApplicationTimeline({ status = 'Applied', timeline = [], appliedAt, lastUpdated }) {
  const isRejected = status === 'Rejected'
  const isWithdrawn = status === 'Withdrawn'

  // Determine current stage index in default progression
  const currentStageIndex = STAGES.findIndex(s => s.toLowerCase() === status.toLowerCase())
  const activeIndex = currentStageIndex !== -1 ? currentStageIndex : 0

  return (
    <div style={{
      background: '#F8FAFC',
      borderRadius: 18,
      padding: 20,
      border: '1px solid #E2E8F0',
      marginTop: 16
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 800, color: '#0F172A', margin: 0 }}>
          Recruitment Timeline
        </h4>
        <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>
          Real-time Sync
        </span>
      </div>

      {/* Special Banner for Rejected / Withdrawn */}
      {isRejected && (
        <div style={{
          background: '#FFF1F2',
          borderRadius: 12,
          padding: '10px 14px',
          border: '1px solid #FECDD3',
          color: '#DC2626',
          fontSize: 12.5,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 16
        }}>
          <AlertCircle size={16} />
          <span>Application Status: Rejected / Closed</span>
        </div>
      )}

      {isWithdrawn && (
        <div style={{
          background: '#F1F5F9',
          borderRadius: 12,
          padding: '10px 14px',
          border: '1px solid #CBD5E1',
          color: '#475569',
          fontSize: 12.5,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 16
        }}>
          <AlertCircle size={16} />
          <span>Application Withdrawn</span>
        </div>
      )}

      {/* Vertical Timeline Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
        {STAGES.map((stageName, idx) => {
          const isCompleted = !isRejected && !isWithdrawn && idx <= activeIndex
          const isCurrent = !isRejected && !isWithdrawn && idx === activeIndex
          
          // Find matching timeline record from backend
          const timelineRecord = timeline.find(t => t.status?.toLowerCase() === stageName.toLowerCase())
          const recordDate = timelineRecord ? new Date(timelineRecord.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null

          return (
            <div key={stageName} style={{ display: 'flex', gap: 14, position: 'relative', paddingBottom: idx === STAGES.length - 1 ? 0 : 20 }}>
              
              {/* Connecting Vertical Line */}
              {idx !== STAGES.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: 11,
                  top: 24,
                  bottom: 0,
                  width: 2,
                  background: isCompleted && idx < activeIndex ? '#10B981' : '#E2E8F0',
                  zIndex: 1
                }} />
              )}

              {/* Stage Icon */}
              <div style={{ zIndex: 2, flexShrink: 0, marginTop: 2 }}>
                {isCompleted ? (
                  <CheckCircle2 size={24} style={{ color: isCurrent ? '#7C3AED' : '#10B981' }} fill={isCurrent ? '#F5F3FF' : '#ECFDF5'} />
                ) : (
                  <Circle size={24} style={{ color: '#CBD5E1' }} />
                )}
              </div>

              {/* Stage Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: 13.5,
                    fontWeight: isCompleted ? 800 : 600,
                    color: isCompleted ? (isCurrent ? '#7C3AED' : '#0F172A') : '#94A3B8'
                  }}>
                    {stageName}
                  </span>

                  {recordDate && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>
                      {recordDate}
                    </span>
                  )}
                </div>

                {/* Remarks or description if available */}
                {timelineRecord?.remarks && (
                  <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2, fontFamily: 'DM Sans, sans-serif' }}>
                    {timelineRecord.remarks}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
