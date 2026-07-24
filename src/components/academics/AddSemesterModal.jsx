import React, { useState, useEffect, useRef } from 'react'
import { createSemester } from '../../services/api'

export default function AddSemesterModal({
  isOpen,
  onClose,
  onSuccess
}) {
  const [semesterNumber, setSemesterNumber] = useState('')
  const [status, setStatus] = useState('Current')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setSemesterNumber('')
      setStatus('Current')
      setErrorMsg('')
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    const semNum = parseInt(semesterNumber)
    if (isNaN(semNum) || semNum < 1 || semNum > 8) {
      setErrorMsg('Semester number must be an integer between 1 and 8.')
      return
    }

    setLoading(true)
    setErrorMsg('')
    try {
      const res = await createSemester({ semesterNumber: semNum, status })
      if (res.success) {
        onSuccess(res.data)
        onClose()
      } else {
        setErrorMsg(res.message || 'Failed to add semester.')
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full纵 max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col gap-6 animate-scale-up text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-extrabold text-slate-850 dark:text-slate-100 font-sans tracking-tight">
            Add Semester
          </h3>
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-xl select-none"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-150 text-red-600 text-xs font-semibold rounded-xl dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Semester Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Semester Number
            </label>
            <input
              ref={inputRef}
              type="number"
              min="1"
              max="8"
              required
              placeholder="e.g. 1"
              value={semesterNumber}
              onChange={(e) => setSemesterNumber(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Semester Status
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus('Current')}
                className={`py-2.5 text-xs font-bold rounded-xl border transition-all select-none ${
                  status === 'Current'
                    ? 'border-blue-500 bg-blue-50/50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
                    : 'border-slate-200 dark:border-slate-800 bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                Current
              </button>
              <button
                type="button"
                onClick={() => setStatus('Completed')}
                className={`py-2.5 text-xs font-bold rounded-xl border transition-all select-none ${
                  status === 'Completed'
                    ? 'border-blue-500 bg-blue-50/50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
                    : 'border-slate-200 dark:border-slate-800 bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition-all select-none disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md transition-all select-none disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {loading ? 'Adding...' : 'Add Semester'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
