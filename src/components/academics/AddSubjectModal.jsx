import React, { useState, useEffect, useRef } from 'react'
import { createSubject } from '../../services/api'

export default function AddSubjectModal({
  isOpen,
  onClose,
  semesters = [],
  onSuccess
}) {
  const [semesterNumber, setSemesterNumber] = useState('')
  const [name, setName] = useState('')
  const [credits, setCredits] = useState('3')
  const [attendance, setAttendance] = useState('100')
  const [finalGrade, setFinalGrade] = useState('0')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const nameInputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setName('')
      setCredits('3')
      setAttendance('100')
      setFinalGrade('0')
      setErrorMsg('')

      // Set default semester to the first one available, or empty
      if (semesters.length > 0) {
        setSemesterNumber(semesters[0].semesterNumber.toString())
      } else {
        setSemesterNumber('')
      }

      setTimeout(() => nameInputRef.current?.focus(), 100)
    }
  }, [isOpen, semesters])

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
    if (isNaN(semNum)) {
      setErrorMsg('Please select a semester.')
      return
    }

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
      const res = await createSubject({
        semesterNumber: semNum,
        name: name.trim(),
        credits: subCredits,
        attendance: subAttendance,
        finalGrade: subGrade
      })

      if (res.success) {
        onSuccess(res.data)
        onClose()
      } else {
        setErrorMsg(res.message || 'Failed to add subject.')
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-955/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col gap-5 animate-scale-up text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-extrabold text-slate-850 dark:text-slate-100 font-sans tracking-tight">
            Add Subject
          </h3>
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 font-bold text-xl select-none"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-150 text-red-650 text-xs font-semibold rounded-xl dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400">
              ⚠️ {errorMsg}
            </div>
          )}

          {semesters.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No semesters created yet. Please add a semester first before adding subjects.
              </p>
            </div>
          ) : (
            <>
              {/* Semester Dropdown Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Target Semester
                </label>
                <select
                  value={semesterNumber}
                  onChange={(e) => setSemesterNumber(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {semesters.map((s) => (
                    <option key={s.semesterNumber} value={s.semesterNumber}>
                      Semester {s.semesterNumber} ({s.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject Name Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Subject Name
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  required
                  placeholder="e.g. Operating Systems"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Credits, Attendance, and Grade - Grid */}
              <div className="grid grid-cols-3 gap-3">
                {/* Credits */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Credits
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    required
                    placeholder="3"
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Attendance */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Attendance (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    required
                    placeholder="100"
                    value={attendance}
                    onChange={(e) => setAttendance(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Grade */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Grade (0-10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.01"
                    placeholder="0"
                    value={finalGrade}
                    onChange={(e) => setFinalGrade(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-855 rounded-xl transition-all select-none disabled:opacity-50"
            >
              Cancel
            </button>
            {semesters.length > 0 && (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md transition-all select-none disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {loading ? 'Adding...' : 'Add Subject'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
