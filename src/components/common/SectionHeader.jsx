import React from 'react'

export default function SectionHeader({
  icon,
  title,
  description,
  actions,
  className = ''
}) {
  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 ${className}`}>
      {/* Title & Description Block */}
      <div className="flex items-start gap-3.5">
        {icon && (
          <div className="w-12 h-12 rounded-2xl bg-white/70 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-800/40 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm mt-0.5 select-none">
            {icon}
          </div>
        )}
        <div className="flex flex-col gap-1 text-left">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-850 dark:text-slate-100 tracking-tight font-sans">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Optional Action Controls */}
      {actions && (
        <div className="flex items-center gap-2.5 self-start md:self-center flex-wrap">
          {actions}
        </div>
      )}
    </div>
  )
}
