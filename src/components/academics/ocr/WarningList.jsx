import React from 'react'

export default function WarningList({ warnings = [], onWarningClick }) {
  const severityOrder = { ERROR: 0, WARNING: 1, INFO: 2 }

  // Group warnings by severity safely
  const groupedWarnings = warnings.reduce((acc, curr) => {
    const sev = curr.severity || 'WARNING'
    if (!acc[sev]) acc[sev] = []
    acc[sev].push(curr)
    return acc
  }, {})

  const sortedSeverities = Object.keys(groupedWarnings).sort((a, b) => {
    return (severityOrder[a] ?? 99) - (severityOrder[b] ?? 99)
  })

  const getSeverityStyle = (sev) => {
    switch (sev) {
      case 'ERROR':
        return {
          header: 'text-red-700 dark:text-red-405 border-red-100 dark:border-red-950 bg-red-50/50 dark:bg-red-950/10',
          dot: 'bg-red-500'
        }
      case 'WARNING':
        return {
          header: 'text-yellow-800 dark:text-yellow-450 border-yellow-100 dark:border-yellow-950 bg-yellow-50/50 dark:bg-yellow-950/10',
          dot: 'bg-yellow-500'
        }
      default:
        return {
          header: 'text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-950 bg-blue-50/50 dark:bg-blue-950/10',
          dot: 'bg-blue-500'
        }
    }
  }

  if (warnings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
        <svg className="w-8 h-8 text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          No warnings or parsing errors
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-450 mt-0.5">
          Validation layer passed successfully without issues.
        </div>
      </div>
    )
  }

  return (
    <div className="max-h-64 overflow-y-auto w-full flex flex-col gap-3 pr-1">
      {sortedSeverities.map(sev => {
        const { header, dot } = getSeverityStyle(sev)
        const list = groupedWarnings[sev]

        return (
          <div key={sev} className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
            {/* Severity Header */}
            <div className={`px-3 py-1.5 text-xs font-semibold border-b flex items-center gap-2 ${header}`}>
              <span className={`w-2 h-2 rounded-full ${dot}`} />
              <span>{sev} ({list.length})</span>
            </div>

            {/* Warning Cards List */}
            <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
              {list.map((warning, idx) => (
                <div
                  key={idx}
                  className={`px-4 py-2.5 text-xs text-slate-600 dark:text-slate-300 transition-all ${
                    warning.subjectId
                      ? 'hover:bg-slate-50 dark:hover:bg-slate-950 cursor-pointer hover:text-blue-600 dark:hover:text-blue-450'
                      : ''
                  }`}
                  onClick={() => {
                    if (warning.subjectId && onWarningClick) {
                      onWarningClick(warning.subjectId)
                    }
                  }}
                >
                  <div className="flex justify-between items-start gap-3">
                    <span className="leading-relaxed">{warning.message}</span>
                    {warning.subjectId && (
                      <span className="text-[10px] uppercase font-bold text-blue-500 flex-shrink-0 tracking-wider">
                        Inspect →
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
