import React from 'react'

export default function StatCard({
  icon,
  title,
  value,
  subtitle,
  color = 'blue',
  trend,
  loading = false,
  onClick,
  className = ''
}) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50/50 dark:bg-blue-950/20',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-100/50 dark:border-blue-900/30',
      fill: 'stroke-blue-600 dark:stroke-blue-400'
    },
    purple: {
      bg: 'bg-purple-50/50 dark:bg-purple-950/20',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-100/50 dark:border-purple-900/30',
      fill: 'stroke-purple-600 dark:stroke-purple-400'
    },
    green: {
      bg: 'bg-green-50/50 dark:bg-green-955/20',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-100/50 dark:border-green-900/30',
      fill: 'stroke-green-600 dark:stroke-green-400'
    },
    orange: {
      bg: 'bg-orange-50/50 dark:bg-orange-950/20',
      text: 'text-orange-600 dark:text-orange-400',
      border: 'border-orange-100/50 dark:border-orange-900/30',
      fill: 'stroke-orange-600 dark:stroke-orange-400'
    },
    red: {
      bg: 'bg-red-50/50 dark:bg-red-955/20',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-100/50 dark:border-red-900/30',
      fill: 'stroke-red-600 dark:stroke-red-400'
    },
    neutral: {
      bg: 'bg-slate-50/50 dark:bg-slate-800/30',
      text: 'text-slate-655 dark:text-slate-400',
      border: 'border-slate-100 dark:border-slate-800/40',
      fill: 'stroke-slate-500 dark:stroke-slate-400'
    }
  }

  const activeColor = colorMap[color] || colorMap.blue
  const isClickable = typeof onClick === 'function'

  const handleKeyDown = (e) => {
    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick(e)
    }
  }

  // Determine if this is a GPA/CGPA metric that warrants radial dials
  const isGPAMetric = title && (title.toLowerCase().includes('cgpa') || title.toLowerCase().includes('gpa'))
  
  // Try parsing value to float. Note: value could be a custom JSX node for empty states.
  const numericVal = typeof value === 'number' ? value : parseFloat(value)
  const showRadial = isGPAMetric && !isNaN(numericVal) && numericVal >= 0 && numericVal <= 10

  // Determine dynamic status badge based on GPA scale
  const getStatusBadge = (val) => {
    if (val >= 8.5) {
      return { label: 'Excellent', style: 'bg-green-50 text-green-600 border-green-100 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/30' }
    }
    if (val >= 6.5) {
      return { label: 'On Track', style: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30' }
    }
    return { label: 'Needs Improvement', style: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30' }
  }

  const statusBadge = showRadial ? getStatusBadge(numericVal) : null

  if (loading) {
    return (
      <div 
        className="p-6 bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm animate-pulse flex justify-between items-center"
        aria-hidden="true"
      >
        <div className="flex flex-col gap-3 flex-1">
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-850 rounded-xl" />
          <div className="w-24 h-4 bg-slate-200 dark:bg-slate-850 rounded" />
          <div className="w-16 h-8 bg-slate-200 dark:bg-slate-850 rounded" />
          <div className="w-32 h-3.5 bg-slate-200 dark:bg-slate-850 rounded" />
        </div>
        {isGPAMetric && (
          <div className="w-14 h-14 rounded-full border-4 border-slate-100 dark:border-slate-800 flex-shrink-0" />
        )}
      </div>
    )
  }

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? onClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      className={`p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-sm flex items-center justify-between gap-4 transition-all duration-200 text-left ${
        isClickable 
          ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900' 
          : ''
      } ${className}`}
    >
      {/* Metrics Section */}
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        {/* Icon & Status Row */}
        <div className="flex items-center gap-2">
          {icon && (
            <div className={`w-10 h-10 rounded-xl ${activeColor.bg} ${activeColor.text} border ${activeColor.border} flex items-center justify-center text-xl font-semibold flex-shrink-0 select-none`}>
              {icon}
            </div>
          )}
          {statusBadge && (
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg border uppercase tracking-wider select-none ${statusBadge.style}`}>
              {statusBadge.label}
            </span>
          )}
        </div>

        {/* Title */}
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-450 dark:text-slate-500 mt-1 select-none">
          {title}
        </span>

        {/* Value */}
        <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
          {showRadial ? (
            <span className="text-2xl font-extrabold text-slate-850 dark:text-slate-100 tracking-tight font-sans">
              {numericVal.toFixed(2)} <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">/ 10</span>
            </span>
          ) : (
            <div className="w-full text-slate-850 dark:text-slate-100 break-words">
              {React.isValidElement(value) ? (
                value
              ) : (
                <span className="text-2xl font-extrabold tracking-tight font-sans">
                  {value}
                </span>
              )}
            </div>
          )}

          {/* Trend Indicator */}
          {trend && (
            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full select-none flex-shrink-0 ${
              trend.isPositive 
                ? 'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400' 
                : 'bg-red-50 text-red-650 dark:bg-red-955/30 dark:text-red-400'
            }`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1 select-none">
            {subtitle}
          </span>
        )}
      </div>

      {/* Radial Circle Indicator Column */}
      {showRadial && (
        <div className="relative flex items-center justify-center w-14 h-14 flex-shrink-0 select-none">
          {/* SVG Ring Progress */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="28"
              cy="28"
              r="22"
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth="4"
              fill="transparent"
            />
            <circle
              cx="28"
              cy="28"
              r="22"
              className={`${activeColor.fill} transition-all duration-500 ease-out`}
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 22}
              strokeDashoffset={2 * Math.PI * 22 - (numericVal / 10) * (2 * Math.PI * 22)}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-[10px] font-extrabold text-slate-750 dark:text-slate-300">
            {Math.round((numericVal / 10) * 100)}%
          </span>
        </div>
      )}
    </div>
  )
}
