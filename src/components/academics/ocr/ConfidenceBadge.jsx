import React from 'react'

export default function ConfidenceBadge({ score }) {
  const getBadgeStyle = (s) => {
    if (s >= 80) {
      return {
        bg: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30',
        label: 'High Confidence'
      }
    }
    if (s >= 60) {
      return {
        bg: 'bg-yellow-50 text-yellow-750 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900/30',
        label: 'Medium Confidence'
      }
    }
    return {
      bg: 'bg-red-50 text-red-750 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30',
      label: 'Low Confidence'
    }
  }

  const { bg, label } = getBadgeStyle(score)

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${bg}`}>
      <span>{score}%</span>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      <span>{label}</span>
    </span>
  )
}
