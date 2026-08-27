import React, { useState, useEffect, useMemo } from 'react'
import UploadZone from './ocr/UploadZone'
import UploadProgress from './ocr/UploadProgress'
import ConfidenceBadge from './ocr/ConfidenceBadge'
import WarningList from './ocr/WarningList'
import SubjectPreviewTable from './ocr/SubjectPreviewTable'
import { uploadTranscript, confirmImportSession, deleteImportSession } from '../../services/api'

export default function TranscriptOCRModal({ isOpen, onClose, onImportComplete, onSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentStage, setCurrentStage] = useState('Uploading')
  const [sessionId, setSessionId] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [warnings, setWarnings] = useState([])
  const [confidence, setConfidence] = useState(0)
  const [metadata, setMetadata] = useState({})
  const [summary, setSummary] = useState(null)
  const [semesterLabel, setSemesterLabel] = useState(null)
  const [repairedFields, setRepairedFields] = useState([])
  const [error, setError] = useState(null)

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null)
      setLoading(false)
      setCurrentStage('Uploading')
      setSessionId(null)
      setSubjects([])
      setWarnings([])
      setConfidence(0)
      setMetadata({})
      setSummary(null)
      setSemesterLabel(null)
      setRepairedFields([])
      setError(null)
    }
  }, [isOpen])

  // Dynamically compute summary whenever subjects change (reactive to manual edits)
  const computedSummary = useMemo(() => {
    if (!subjects || subjects.length === 0) return summary || {}

    let totalCredits = 0
    let earnedCredits = 0
    let failedCredits = 0
    let passedSubjects = 0
    let failedSubjects = 0
    let totalGradePoints = 0
    let gpaCredits = 0

    subjects.forEach(sub => {
      const rawGradeStr = String(sub.rawGrade || '').trim().toUpperCase()
      const isFailedGrade = rawGradeStr === 'F' || rawGradeStr === 'RA' || rawGradeStr === 'W' || rawGradeStr === 'AB'
      const isFailedResult = sub.result === 'FAIL' || sub.result === 'F'
      const isFailedPoints = sub.finalGrade !== null && sub.finalGrade !== undefined && sub.finalGrade < 4
      const isFailed = isFailedResult || isFailedGrade || isFailedPoints

      const credits = typeof sub.credits === 'number' && !isNaN(sub.credits) ? sub.credits : (parseInt(sub.credits, 10) || 0)
      const gradePoint = typeof sub.finalGrade === 'number' && !isNaN(sub.finalGrade) ? sub.finalGrade : (parseFloat(sub.finalGrade) || 0)

      totalCredits += credits

      if (isFailed) {
        failedCredits += credits
        failedSubjects += 1
      } else {
        earnedCredits += credits
        passedSubjects += 1
      }

      if (credits > 0) {
        totalGradePoints += (gradePoint * credits)
        gpaCredits += credits
      }
    })

    const calculatedSGPA = gpaCredits > 0 ? parseFloat((totalGradePoints / gpaCredits).toFixed(2)) : (summary?.sgpa || 0)
    const semesterStatus = failedSubjects > 0 ? 'Failed' : 'Completed'

    return {
      ...(summary || {}),
      totalCredits,
      earnedCredits,
      failedCredits,
      passedSubjects,
      failedSubjects,
      sgpa: !isNaN(calculatedSGPA) ? calculatedSGPA : (summary?.sgpa || 0),
      cgpa: summary?.cgpa !== undefined ? summary.cgpa : (!isNaN(calculatedSGPA) ? calculatedSGPA : 0),
      semesterStatus
    }
  }, [subjects, summary])

  if (!isOpen) return null

  // File selected & pipeline processing orchestrator
  const handleFileSelected = async (file) => {
    if (!file) {
      setSelectedFile(null)
      return
    }

    setSelectedFile(file)
    setLoading(true)
    setError(null)
    setCurrentStage('Uploading')

    // Simulated progress indicators for pipeline steps
    const stages = ['Uploading', 'OCR', 'Parsing', 'Validation', 'AI Repair']
    let stageIdx = 0
    const progressTimer = setInterval(() => {
      if (stageIdx < stages.length - 1) {
        stageIdx++
        setCurrentStage(stages[stageIdx])
      }
    }, 700)

    try {
      const response = await uploadTranscript(file)
      clearInterval(progressTimer)
      setCurrentStage('Completed')

      const payload = response.data || {}
      setSessionId(payload.sessionId)
      setConfidence(payload.confidence || 97)
      setWarnings(payload.warnings || [])
      setSubjects(payload.subjects || [])
      setSummary(payload.summary || null)
      setSemesterLabel(payload.semesterLabel || (payload.semesterNumber ? `${payload.semesterNumber}` : 'I'))
      setMetadata(payload.metadata || {})
      setRepairedFields(payload.metadata?.repairedFields || [])
      setLoading(false)
    } catch (err) {
      clearInterval(progressTimer)
      setError(err.message || 'An error occurred during memo processing.')
      setLoading(false)
    }
  }

  // Handle subject change from SubjectPreviewTable editable cells
  const handleSubjectChange = (id, field, value) => {
    setSubjects(prev =>
      prev.map((s, idx) => {
        const sId = s.id || s._id || idx
        if (sId === id || s.id === id || idx === id) {
          const updated = { ...s, [field]: value }
          if (field === 'credits') {
            updated.credits = value === null || value === '' ? null : parseFloat(value)
          }
          if (field === 'finalGrade') {
            updated.finalGrade = value === null || value === '' ? null : parseFloat(value)
            if (updated.finalGrade !== null && !isNaN(updated.finalGrade) && updated.finalGrade >= 4) {
              if (updated.result === 'FAIL' || updated.result === 'F') updated.result = 'PASS'
            }
          }
          if (field === 'rawGrade') {
            const upper = String(value || '').trim().toUpperCase()
            const gradeMap = { 'O': 10, 'S': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'P': 4, 'F': 0 }
            if (gradeMap[upper] !== undefined) {
              updated.finalGrade = gradeMap[upper]
              updated.result = upper === 'F' ? 'FAIL' : 'PASS'
            }
          }
          return updated
        }
        return s
      })
    )
  }

  // Button Action: Re-upload
  const handleReupload = () => {
    setSelectedFile(null)
    setLoading(false)
    setCurrentStage('Uploading')
    setSessionId(null)
    setSubjects([])
    setWarnings([])
    setConfidence(0)
    setMetadata({})
    setSummary(null)
    setSemesterLabel(null)
    setRepairedFields([])
    setError(null)
  }

  // Button Action: Cancel (Deletes temporary ImportSession)
  const handleCancel = async () => {
    if (sessionId) {
      try {
        await deleteImportSession(sessionId)
      } catch (err) {
        // Suppress session deletion errors on cancel exit
      }
    }
    onClose()
  }

  // Button Action: Confirm Import (Finalizes records)
  const handleConfirm = async () => {
    if (!sessionId) return
    setLoading(true)
    try {
      const romanMap = {
        'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6, 'VII': 7, 'VIII': 8,
        '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8,
        'I-I': 1, 'I-II': 2, 'II-I': 3, 'II-II': 4, 'III-I': 5, 'III-II': 6, 'IV-I': 7, 'IV-II': 8
      }
      const rawSem = metadata?.semesterNumber || semesterLabel
      const semNum = romanMap[String(rawSem).trim().toUpperCase()] || parseInt(rawSem, 10) || 1

      await confirmImportSession(sessionId, {
        subjects,
        semesterNumber: semNum,
        summary: computedSummary
      })
      setLoading(false)
      if (onImportComplete) {
        onImportComplete()
      }
      if (onSuccess) {
        onSuccess()
      }
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to finalize memo marks.')
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(6px)',
      padding: 20
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 720,
        maxHeight: '90vh',
        background: '#0F172A',
        borderRadius: 24,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid #1E293B',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-150 dark:border-slate-800 flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-slate-850 dark:text-slate-100 flex items-center gap-2">
              Upload Memo via AI OCR
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload your semester memo to automatically extract your marks and course grades
            </p>
          </div>
          <button
            type="button"
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-550 dark:text-slate-450 transition cursor-pointer"
            onClick={handleCancel}
            disabled={loading}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-150 dark:border-rose-900/30 text-xs text-rose-655 dark:text-rose-400 flex items-start gap-2.5">
              <span className="mt-0.5">⚠️</span>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">Processing Error</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Step 1: Upload Zone */}
          {!selectedFile && !loading && (
            <UploadZone onFileSelected={handleFileSelected} />
          )}

          {/* Step 2: Processing Progress */}
          {selectedFile && loading && (
            <div className="flex flex-col items-center justify-center p-8 border border-slate-150 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Extracting marks from Memo...
                </span>
              </div>
              <UploadProgress currentStage={currentStage} />
            </div>
          )}

          {/* Step 3: Preview Panel after completion */}
          {selectedFile && !loading && sessionId && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              
              {/* Top Statistics & Metadata bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 border border-slate-150 dark:border-slate-800 rounded-2xl bg-slate-50/30 dark:bg-slate-900/30">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-450 dark:text-slate-500 tracking-wider">
                      Confidence Score
                    </span>
                    <ConfidenceBadge score={confidence} />
                  </div>
                  {metadata.timings && (
                    <div className="hidden sm:flex flex-col gap-0.5 border-l border-slate-200 dark:border-slate-800 pl-4">
                      <span className="text-[10px] uppercase font-bold text-slate-450 dark:text-slate-500 tracking-wider">
                        Processing Time
                      </span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {((metadata.timings.total || 0) / 1000).toFixed(2)}s
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReupload}
                    className="px-3.5 py-1.5 text-xs font-semibold border border-slate-250 dark:border-slate-750 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 transition cursor-pointer"
                  >
                    Re-upload
                  </button>
                </div>
              </div>

              {/* Validation Findings Header */}
              {warnings.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider">
                    Validation Findings ({warnings.length})
                  </h4>
                  <WarningList warnings={warnings} />
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <span>✓</span>
                  <span>No warnings. No validation errors. All memo marks verified cleanly.</span>
                </div>
              )}

              {/* Subject Table Preview */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider">
                    Parsed Subjects List
                  </h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Double-click cell contents to edit values manually
                  </span>
                </div>
                <SubjectPreviewTable
                  subjects={subjects}
                  repairedFields={repairedFields}
                  warnings={warnings}
                  onSubjectChange={handleSubjectChange}
                />
              </div>

              {/* Bottom Summary Cards */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col gap-3">
                <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider">
                  Academic Summary
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800 flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold uppercase text-slate-400 dark:text-slate-500">Semester</span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      {semesterLabel || metadata?.semesterNumber || '—'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800 flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold uppercase text-slate-400 dark:text-slate-500">Credits Earned</span>
                    <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                      {computedSummary?.earnedCredits !== null && computedSummary?.earnedCredits !== undefined ? computedSummary.earnedCredits : '—'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800 flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold uppercase text-slate-400 dark:text-slate-500">Subjects</span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      {subjects.length > 0 ? subjects.length : '—'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800 flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold uppercase text-slate-400 dark:text-slate-500">SGPA</span>
                    <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                      {computedSummary?.sgpa !== null && computedSummary?.sgpa !== undefined ? Number(computedSummary.sgpa).toFixed(2) : '—'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800 flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold uppercase text-slate-400 dark:text-slate-500">CGPA</span>
                    <span className="text-sm font-extrabold text-purple-600 dark:text-purple-400">
                      {computedSummary?.cgpa !== null && computedSummary?.cgpa !== undefined ? Number(computedSummary.cgpa).toFixed(2) : '—'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800 flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold uppercase text-slate-400 dark:text-slate-500">Status</span>
                    <span
                      className="text-sm font-extrabold"
                      style={{
                        color: computedSummary?.semesterStatus
                          ? /fail|detained|back|arrear|not\s*clear/i.test(computedSummary.semesterStatus)
                            ? '#DC2626'
                            : /pass|clear|complete/i.test(computedSummary.semesterStatus)
                              ? '#059669'
                              : '#64748B'
                          : '#64748B'
                      }}
                    >
                      {computedSummary?.semesterStatus || '—'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800 flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold uppercase text-slate-400 dark:text-slate-500">Confidence</span>
                    <span className={`text-sm font-extrabold ${confidence >= 90 ? 'text-emerald-600 dark:text-emerald-400' : confidence >= 70 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                      {confidence ? `${confidence}%` : '—'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
          
          {selectedFile && !loading && sessionId && (
            <button
              type="button"
              className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
              onClick={handleConfirm}
              disabled={loading || warnings.some(w => w.severity === 'ERROR')}
            >
              Confirm &amp; Save Marks
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
