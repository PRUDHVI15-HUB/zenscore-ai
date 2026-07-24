import React, { useState, useRef } from 'react'

function ManualEntry({ subjects, onFinish, onBack }) {
  const [grades, setGrades] = useState(
    Object.fromEntries((subjects || []).map(s => [s, { marks: '', grade: '', credits: '' }]))
  )

  const handleChange = (subject, field, value) => {
    setGrades(prev => ({
      ...prev,
      [subject]: { ...prev[subject], [field]: value }
    }))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {(subjects || []).map(sub => (
          <div
            key={sub}
            className="bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3"
          >
            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 sm:w-40 flex-shrink-0">
              {sub}
            </span>
            <div className="flex gap-2 flex-1">
              <input
                type="number"
                placeholder="Marks"
                min="0"
                max="100"
                value={grades[sub]?.marks || ''}
                onChange={e => handleChange(sub, 'marks', e.target.value)}
                className="flex-1 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 placeholder:text-slate-400"
              />
              <input
                type="text"
                placeholder="Grade"
                value={grades[sub]?.grade || ''}
                onChange={e => handleChange(sub, 'grade', e.target.value)}
                className="w-20 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 placeholder:text-slate-400"
              />
              <input
                type="number"
                placeholder="Credits"
                min="1"
                max="6"
                value={grades[sub]?.credits || ''}
                onChange={e => handleChange(sub, 'credits', e.target.value)}
                className="w-24 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 placeholder:text-slate-400"
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center leading-relaxed">
        You can add more detailed records from the dashboard later.
      </p>

      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3.5 bg-white/70 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 text-sm font-bold rounded-2xl transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 backdrop-blur-sm"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => onFinish(grades)}
          className="flex-1 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-sm rounded-2xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          🚀 Launch Dashboard
        </button>
      </div>
    </div>
  )
}

function UploadPanel({ method, onFinish, onBack }) {
  const [file, setFile] = useState(null)
  const [text, setText] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef(null)

  const isPDF = method === 'pdf'

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) setFile(dropped)
  }

  const handleFileChange = (e) => {
    const picked = e.target.files[0]
    if (picked) setFile(picked)
  }

  return (
    <div className="flex flex-col gap-5">
      {isPDF ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`relative cursor-pointer border-2 border-dashed rounded-[20px] p-10 text-center transition-all duration-200 flex flex-col items-center gap-3
            ${dragOver
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
              : 'border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20'
            }
          `}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
            onChange={handleFileChange}
          />

          {file ? (
            <>
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-3xl">
                {file.type.includes('pdf') ? '📄' : '🖼️'}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{file.name}</span>
                <span className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB</span>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">✓ File selected — AI extraction ready</span>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl">
                📤
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Drag & drop your marksheet here
                </span>
                <span className="text-xs text-slate-400">or click to browse — PDF, PNG, JPG supported</span>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Paste Your Results Text
          </label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={`Paste your academic results here...\n\nExample:\nSubject: Data Structures\nMarks: 87/100\nGrade: A\nCredits: 4`}
            rows={8}
            className="w-full px-4 py-3 text-sm text-slate-800 dark:text-slate-100 bg-white/70 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-700/60 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 resize-none placeholder:text-slate-400 backdrop-blur-sm leading-relaxed font-mono"
          />
        </div>
      )}

      {/* Info notice */}
      <div className="flex items-start gap-2.5 px-4 py-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 rounded-xl">
        <span className="text-base mt-0.5">⚠️</span>
        <p className="text-xs text-amber-700 dark:text-amber-400 leading-snug">
          <strong>Preview Mode:</strong> AI extraction coming soon. Your file is saved locally for now. You can review and edit everything from the dashboard.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3.5 bg-white/70 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 text-sm font-bold rounded-2xl transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 backdrop-blur-sm"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => onFinish({ file, text })}
          className="flex-1 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-sm rounded-2xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          🚀 Launch Dashboard
        </button>
      </div>
    </div>
  )
}

export default function OnboardingStep3({ profileData, methodData, onFinish, onBack }) {
  const method = methodData?.method

  const headingMap = {
    manual: { icon: '✏️', title: 'Enter Your Grades', sub: 'Add marks, grade letters, and credits for each subject', gradient: 'from-indigo-500 to-purple-500' },
    pdf: { icon: '📄', title: 'Upload Marksheet', sub: 'Upload a PDF or image — AI will extract your results', gradient: 'from-violet-500 to-pink-500' },
    paste: { icon: '📋', title: 'Paste Results Text', sub: 'Paste copied text from your university portal', gradient: 'from-emerald-500 to-teal-500' },
  }
  const info = headingMap[method] || headingMap.manual

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="text-center flex flex-col gap-2">
        <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${info.gradient} flex items-center justify-center text-3xl shadow-lg mb-2`}>
          {info.icon}
        </div>
        <h1 className="text-3xl font-black text-slate-850 dark:text-white font-sans tracking-tight">
          {info.title}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{info.sub}</p>
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="w-8 h-1.5 rounded-full bg-indigo-300 dark:bg-indigo-700" />
          <span className="w-8 h-1.5 rounded-full bg-indigo-300 dark:bg-indigo-700" />
          <span className="w-8 h-1.5 rounded-full bg-indigo-500" />
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step 3 of 3 — Data Entry</p>
      </div>

      {/* Content based on method */}
      {method === 'manual' ? (
        <ManualEntry
          subjects={profileData?.subjects || []}
          onFinish={onFinish}
          onBack={onBack}
        />
      ) : (
        <UploadPanel
          method={method}
          onFinish={onFinish}
          onBack={onBack}
        />
      )}
    </div>
  )
}
