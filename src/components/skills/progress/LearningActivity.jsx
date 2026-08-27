import React from 'react'
import { Activity, CheckCircle2, PlayCircle, FileCheck, Award } from 'lucide-react'

/**
 * LearningActivity Component
 * Shows recent student learning activity timeline.
 *
 * Props:
 * - activities: Array of LearningActivityItem objects
 */

export default React.memo(function LearningActivity({ activities = [] }) {
  const items = Array.isArray(activities) ? activities : []

  if (items.length === 0) {
    return (
      <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderColor: 'var(--border, #E2E8F0)' }} className="rounded-2xl p-8 border shadow-sm text-center">
        <div style={{ background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }} className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Activity className="w-6 h-6 stroke-[2]" />
        </div>
        <h4 style={{ color: 'var(--text-dark, #0F172A)' }} className="font-sora text-base font-bold mb-1">
          No Learning Activity Logged
        </h4>
        <p style={{ color: 'var(--text-muted, #64748B)' }} className="text-xs max-w-sm mx-auto">
          Complete a lesson or take a quiz to start building your real-time activity log.
        </p>
      </div>
    )
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'quiz':
        return <FileCheck className="w-4 h-4 text-purple-600" />
      case 'project':
        return <Award className="w-4 h-4 text-emerald-600" />
      case 'video':
        return <PlayCircle className="w-4 h-4 text-blue-600" />
      default:
        return <CheckCircle2 className="w-4 h-4 text-purple-600" />
    }
  }

  return (
    <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderColor: 'var(--border, #E2E8F0)' }} className="rounded-2xl p-6 sm:p-7 border shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div style={{ background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }} className="w-8 h-8 rounded-lg flex items-center justify-center">
          <Activity className="w-4.5 h-4.5 stroke-[2.2]" />
        </div>
        <h3 style={{ color: 'var(--text-dark, #0F172A)' }} className="font-sora text-lg font-bold">
          Recent Learning Activity
        </h3>
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            className="flex items-start gap-3.5 p-3.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              {getTypeIcon(item.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-0.5">
                <h4 className="font-sora text-sm font-semibold text-slate-900 truncate">
                  {item.title}
                </h4>
                <span className="text-xs font-medium text-slate-400 flex-shrink-0">
                  {item.timestamp}
                </span>
              </div>
              {item.skillName && (
                <span className="text-xs text-purple-600 font-medium">
                  {item.skillName}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})
