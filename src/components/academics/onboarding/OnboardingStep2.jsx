import React from 'react'

const DATA_METHODS = [
  {
    id: 'manual',
    icon: '✏️',
    title: 'Enter Manually',
    description: 'Type in your grades and marks subject by subject',
    badge: 'Recommended',
    badgeColor: 'from-indigo-500 to-purple-500',
    gradient: 'from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30',
    border: 'border-indigo-200/60 dark:border-indigo-700/40',
    hoverBorder: 'hover:border-indigo-400/80 dark:hover:border-indigo-500/60',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/50',
  },
  {
    id: 'pdf',
    icon: '📄',
    title: 'Upload PDF / Image',
    description: 'Upload your marksheet or transcript for AI extraction',
    badge: 'Smart',
    badgeColor: 'from-violet-500 to-pink-500',
    gradient: 'from-violet-50 to-pink-50 dark:from-violet-950/30 dark:to-pink-950/30',
    border: 'border-violet-200/60 dark:border-violet-700/40',
    hoverBorder: 'hover:border-violet-400/80 dark:hover:border-violet-500/60',
    iconBg: 'bg-violet-100 dark:bg-violet-900/50',
  },
  {
    id: 'paste',
    icon: '📋',
    title: 'Paste Text',
    description: 'Paste results text directly from your university portal',
    badge: 'Quick',
    badgeColor: 'from-emerald-500 to-teal-500',
    gradient: 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30',
    border: 'border-emerald-200/60 dark:border-emerald-700/40',
    hoverBorder: 'hover:border-emerald-400/80 dark:hover:border-emerald-500/60',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
  },
]

export default function OnboardingStep2({ profileData, onContinue, onBack }) {
  const [selected, setSelected] = React.useState(null)

  const handleContinue = () => {
    if (!selected) return
    onContinue({ method: selected })
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="text-center flex flex-col gap-2">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-3xl shadow-lg mb-2">
          📊
        </div>
        <h1 className="text-3xl font-black text-slate-850 dark:text-white font-sans tracking-tight">
          Add Your Data
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          How would you like to add your academic records?
        </p>
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="w-8 h-1.5 rounded-full bg-indigo-300 dark:bg-indigo-700" />
          <span className="w-8 h-1.5 rounded-full bg-indigo-500" />
          <span className="w-8 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step 2 of 3 — Data Entry Method</p>
      </div>

      {/* Profile Summary Pill */}
      {profileData && (
        <div className="mx-auto flex items-center gap-3 px-5 py-2.5 bg-white/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 rounded-full backdrop-blur-sm shadow-sm">
          <span className="text-base">🎓</span>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
            {profileData.branch} · Semester {profileData.semester} · {profileData.university}
          </span>
        </div>
      )}

      {/* Method Cards */}
      <div className="flex flex-col gap-4">
        {DATA_METHODS.map((method) => {
          const isSelected = selected === method.id
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => setSelected(method.id)}
              className={`w-full text-left p-5 rounded-[20px] border-2 transition-all duration-200 flex items-center gap-4 group relative overflow-hidden
                bg-gradient-to-br ${method.gradient}
                ${isSelected
                  ? `border-indigo-500 dark:border-indigo-400 shadow-lg shadow-indigo-500/10`
                  : `${method.border} ${method.hoverBorder} hover:shadow-md hover:-translate-y-0.5`
                }
              `}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-3.5 right-4 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shadow-sm">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl ${method.iconBg} flex items-center justify-center text-2xl flex-shrink-0 transition-transform group-hover:scale-110`}>
                {method.icon}
              </div>

              {/* Text */}
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{method.title}</span>
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r ${method.badgeColor} text-white uppercase tracking-widest`}>
                    {method.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{method.description}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3.5 bg-white/70 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 text-sm font-bold rounded-2xl transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:-translate-y-0.5 backdrop-blur-sm"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          disabled={!selected}
          className={`flex-1 py-3.5 font-extrabold text-sm rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 
            ${selected
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
            }
          `}
        >
          Continue
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  )
}
