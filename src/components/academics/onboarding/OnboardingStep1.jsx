import React, { useState } from 'react'

const BRANCHES = [
  'Computer Science', 'Information Technology', 'Electronics & Communication',
  'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
  'Chemical Engineering', 'Biotechnology', 'Data Science', 'Artificial Intelligence', 'Other'
]

const DEFAULT_SUBJECTS = ['Java', 'DBMS', 'OS', 'CN', 'AI']

export default function OnboardingStep1({ onContinue }) {
  const [form, setForm] = useState({
    university: '',
    college: '',
    branch: '',
    semester: '',
    currentCGPA: '',
    targetCGPA: '',
  })
  const [subjects, setSubjects] = useState([...DEFAULT_SUBJECTS])
  const [newSubject, setNewSubject] = useState('')
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const addSubject = () => {
    const trimmed = newSubject.trim()
    if (!trimmed) return
    if (subjects.includes(trimmed)) return
    setSubjects(prev => [...prev, trimmed])
    setNewSubject('')
  }

  const removeSubject = (name) => {
    setSubjects(prev => prev.filter(s => s !== name))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSubject()
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!form.university.trim()) newErrors.university = 'Required'
    if (!form.college.trim()) newErrors.college = 'Required'
    if (!form.branch) newErrors.branch = 'Required'
    if (!form.semester) newErrors.semester = 'Required'
    if (!form.currentCGPA || isNaN(form.currentCGPA) || form.currentCGPA < 0 || form.currentCGPA > 10)
      newErrors.currentCGPA = 'Enter a valid CGPA (0–10)'
    if (!form.targetCGPA || isNaN(form.targetCGPA) || form.targetCGPA < 0 || form.targetCGPA > 10)
      newErrors.targetCGPA = 'Enter a valid target (0–10)'
    return newErrors
  }

  const handleContinue = () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onContinue({ ...form, subjects })
  }

  const inputClass = (field) =>
    `w-full px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100 bg-white/70 dark:bg-slate-900/70 border rounded-xl outline-none transition-all duration-150 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 dark:focus:border-indigo-500 backdrop-blur-sm ${
      errors[field]
        ? 'border-rose-400 dark:border-rose-600'
        : 'border-slate-200/70 dark:border-slate-700/60'
    }`

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="text-center flex flex-col gap-2">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg mb-2">
          🎓
        </div>
        <h1 className="text-3xl font-black text-slate-850 dark:text-white font-sans tracking-tight">
          Academics
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Let's set up your academic profile.
        </p>
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="w-8 h-1.5 rounded-full bg-indigo-500" />
          <span className="w-8 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
          <span className="w-8 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step 1 of 3 — Profile Setup</p>
      </div>

      {/* Form Card */}
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-[24px] p-8 shadow-sm flex flex-col gap-6">

        {/* Row 1: University + College */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              University
            </label>
            <input
              name="university"
              value={form.university}
              onChange={handleChange}
              placeholder="e.g. Anna University"
              className={inputClass('university')}
            />
            {errors.university && <span className="text-[10px] text-rose-500 font-bold">{errors.university}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              College
            </label>
            <input
              name="college"
              value={form.college}
              onChange={handleChange}
              placeholder="e.g. PSG College of Technology"
              className={inputClass('college')}
            />
            {errors.college && <span className="text-[10px] text-rose-500 font-bold">{errors.college}</span>}
          </div>
        </div>

        {/* Row 2: Branch + Semester */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Branch / Degree
            </label>
            <select
              name="branch"
              value={form.branch}
              onChange={handleChange}
              className={inputClass('branch')}
            >
              <option value="">Select Branch</option>
              {BRANCHES.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            {errors.branch && <span className="text-[10px] text-rose-500 font-bold">{errors.branch}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Current Semester
            </label>
            <select
              name="semester"
              value={form.semester}
              onChange={handleChange}
              className={inputClass('semester')}
            >
              <option value="">Select Semester</option>
              {[1,2,3,4,5,6,7,8].map(n => (
                <option key={n} value={n}>Semester {n}</option>
              ))}
            </select>
            {errors.semester && <span className="text-[10px] text-rose-500 font-bold">{errors.semester}</span>}
          </div>
        </div>

        {/* Row 3: Current CGPA + Target CGPA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Current CGPA
            </label>
            <input
              name="currentCGPA"
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={form.currentCGPA}
              onChange={handleChange}
              placeholder="e.g. 7.85"
              className={inputClass('currentCGPA')}
            />
            {errors.currentCGPA && <span className="text-[10px] text-rose-500 font-bold">{errors.currentCGPA}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Target CGPA
            </label>
            <input
              name="targetCGPA"
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={form.targetCGPA}
              onChange={handleChange}
              placeholder="e.g. 9.00"
              className={inputClass('targetCGPA')}
            />
            {errors.targetCGPA && <span className="text-[10px] text-rose-500 font-bold">{errors.targetCGPA}</span>}
          </div>
        </div>

        {/* Subjects Chips */}
        <div className="flex flex-col gap-3">
          <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Subjects this Semester
          </label>

          {/* Chips Container */}
          <div className="flex flex-wrap gap-2 min-h-[40px]">
            {subjects.map(sub => (
              <span
                key={sub}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-800/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full group transition-all hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
              >
                {sub}
                <button
                  type="button"
                  onClick={() => removeSubject(sub)}
                  className="text-indigo-400 hover:text-rose-500 transition-colors leading-none"
                  aria-label={`Remove ${sub}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {/* Add Subject Input */}
          <div className="flex gap-2">
            <input
              value={newSubject}
              onChange={e => setNewSubject(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type subject name..."
              className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-100 bg-white/70 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-700/60 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 backdrop-blur-sm placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={addSubject}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all hover:-translate-y-0.5 select-none flex-shrink-0"
            >
              + Add Subject
            </button>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <button
        type="button"
        onClick={handleContinue}
        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-sm rounded-2xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5 select-none flex items-center justify-center gap-2"
      >
        Continue
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </button>
    </div>
  )
}
