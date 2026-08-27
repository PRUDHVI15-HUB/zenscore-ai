import React from 'react'
import { AlertCircle, RotateCcw } from 'lucide-react'

/**
 * ErrorCertificates Component
 * Shown when API fetch or certificate loading encounters an error.
 *
 * Props:
 * - onRetry: function
 * - message: string
 */

export default React.memo(function ErrorCertificates({
  onRetry,
  message = 'Unable to load certificates.'
}) {
  return (
    <div className="bg-rose-50/70 border border-rose-200/90 rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[280px]">
      <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 mb-4 shadow-sm">
        <AlertCircle className="w-7 h-7 stroke-[2]" />
      </div>
      <h3 className="font-sora text-base font-bold text-rose-950 mb-1">
        {message}
      </h3>
      <p className="text-xs text-rose-700/80 max-w-sm mb-6">
        Please check your connection or try again in a few moments.
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-sora font-semibold text-xs transition-all shadow-md shadow-rose-600/20 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  )
})
