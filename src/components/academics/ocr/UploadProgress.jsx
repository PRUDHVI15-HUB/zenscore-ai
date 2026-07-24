import React from 'react'

export default function UploadProgress({ currentStage }) {
  const stages = [
    { key: 'Uploading', label: 'File Upload' },
    { key: 'OCR', label: 'OCR Recognition' },
    { key: 'Parsing', label: 'Rule Parsing' },
    { key: 'Validation', label: 'Data Validation' },
    { key: 'AI Repair', label: 'AI Fallback Repair' },
    { key: 'Completed', label: 'Completed' }
  ]

  const getStageIndex = (stage) => {
    return stages.findIndex(s => s.key === stage)
  }

  const activeIndex = getStageIndex(currentStage)

  return (
    <div className="w-full flex flex-col gap-4 py-4 px-2">
      <div className="flex items-center justify-between w-full md:flex-row flex-col gap-4">
        {stages.map((stage, idx) => {
          const isCompleted = idx < activeIndex || currentStage === 'Completed'
          const isActive = idx === activeIndex && currentStage !== 'Completed'

          return (
            <div key={stage.key} className="flex-1 flex flex-col items-center relative text-center w-full">
              {/* Stepper Dot */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 ${
                  isCompleted
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : isActive
                    ? 'border-blue-500 bg-white dark:bg-slate-900 text-blue-500 shadow-md ring-4 ring-blue-100 dark:ring-blue-900/30'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-xs font-semibold">{idx + 1}</span>
                )}
              </div>

              {/* Stepper Label */}
              <span
                className={`text-xs mt-2 font-medium ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-semibold'
                    : isCompleted
                    ? 'text-slate-800 dark:text-slate-200'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {stage.label}
              </span>

              {/* Connecting Line */}
              {idx < stages.length - 1 && (
                <div
                  className={`hidden md:block absolute top-4 left-[60%] right-[-40%] h-0.5 z-0 ${
                    idx < activeIndex ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
