import React, { useState, useEffect, useRef } from 'react'
import { updateSubject } from '../../services/api'

export default function EditSubjectModal({
  isOpen,
  onClose,
  semesterNumber,
  subject,
  onSuccess
}) {
  const [name, setName] = useState('')
  const [credits, setCredits] = useState('3')
  const [attendance, setAttendance] = useState('100')
  const [finalGrade, setFinalGrade] = useState('0')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const nameInputRef = useRef(null)

  useEffect(() => {
    if (isOpen && subject) {
      setName(subject.name || '')
      setCredits((subject.credits || 3).toString())
      setAttendance((subject.attendance || 100).toString())
      setFinalGrade((subject.finalGrade !== undefined ? subject.finalGrade : 0).toString())
      setErrorMsg('')
      setTimeout(() => nameInputRef.current?.focus(), 100)
    }
  }, [isOpen, subject])

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

  if (!isOpen || !subject) return null

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || name.trim().length < 3) {
      setErrorMsg('Subject name must be at least 3 characters long.')
      return
    }

    const subCredits = parseInt(credits)
    if (isNaN(subCredits) || subCredits < 1 || subCredits > 6) {
      setErrorMsg('Credits must be an integer between 1 and 6.')
      return
    }

    const subAttendance = parseFloat(attendance)
    if (isNaN(subAttendance) || subAttendance < 0 || subAttendance > 100) {
      setErrorMsg('Attendance must be a percentage between 0 and 100.')
      return
    }

    const subGrade = parseFloat(finalGrade || 0)
    if (isNaN(subGrade) || subGrade < 0 || subGrade > 10) {
      setErrorMsg('Final Grade must be a number between 0 and 10.')
      return
    }

    setLoading(true)
    setErrorMsg('')
    try {
      const res = await updateSubject({
        semesterNumber,
        subjectId: subject._id || subject.id,
        name: name.trim(),
        credits: subCredits,
        attendance: subAttendance,
        finalGrade: subGrade
      })

      if (res.success) {
        onSuccess(res.data)
        onClose()
      } else {
        setErrorMsg(res.message || 'Failed to update subject.')
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
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col gap-6 animate-scale-up text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-extrabold text-slate-850 dark:text-slate-100 font-sans tracking-tight">
            Edit Subject
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

          {/* Subject Name Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Subject Name
            </label>
            <input
              ref={nameInputRef}
              type="text"
              required
              placeholder="e.g. Algorithms"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Credits Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Credits Load
            </label>
            <input
              type="number"
              min="1"
              max="6"
              required
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Attendance Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Attendance (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="any"
              required
              value={attendance}
              onChange={(e) => setAttendance(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Final Grade Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Final Grade (Scale 10)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              step="any"
              required
              value={finalGrade}
              onChange={(e) => setFinalGrade(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
