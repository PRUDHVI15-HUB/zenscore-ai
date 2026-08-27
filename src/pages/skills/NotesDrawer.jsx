import React, { useState, useEffect } from 'react'
import { FileText, Save, Check, X, AlertCircle, RefreshCw } from 'lucide-react'
import { getLessonNote } from '../../services/skills/skillsService'

/**
 * NotesDrawer Component
 * Slide-over drawer for student personal study notes with MongoDB persistence per lesson.
 */
export default function NotesDrawer({
  isOpen,
  onClose,
  lessonId = '',
  lessonTitle = '',
  noteContent = '',
  onSaveNote
}) {
  const [content, setContent] = useState(noteContent)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loadingNote, setLoadingNote] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    if (!isOpen || !lessonId) return
    setContent(noteContent || '')
    setErrorMsg(null)

    // Fetch note from backend for current lesson if not passed directly
    let isMounted = true
    const fetchNote = async () => {
      setLoadingNote(true)
      try {
        const res = await getLessonNote(lessonId)
        if (isMounted && res?.data?.content !== undefined) {
          setContent(res.data.content)
        }
      } catch (err) {
        // Fallback to noteContent if available
        if (isMounted && noteContent) {
          setContent(noteContent)
        }
      } finally {
        if (isMounted) setLoadingNote(false)
      }
    }

    fetchNote()
    return () => { isMounted = false }
  }, [isOpen, lessonId, noteContent])

  if (!isOpen) return null

  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    setErrorMsg(null)

    try {
      if (onSaveNote) {
        await onSaveNote(content)
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setErrorMsg(err.message || 'Unable to save notes. Retry.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="flex-1" onClick={onClose} />

      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-slide-left">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-sora text-sm font-bold text-slate-900">
                Personal Study Notes
              </h3>
              <p className="text-[11px] text-slate-500 font-medium truncate max-w-[240px]">
                {lessonTitle || 'Lesson Notes'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Note Body */}
        <div className="flex-1 p-5 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-600">
              Notes & Key Insights for this Lesson
            </label>
            {loadingNote && (
              <span className="text-[10px] text-amber-600 font-medium flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" /> Loading note...
              </span>
            )}
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loadingNote}
            placeholder="Write personal key takeaways, syntax reminders, code snippets, or questions to review later..."
            className="w-full flex-1 p-4 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-slate-800 placeholder-slate-400 resize-none leading-relaxed disabled:opacity-60"
          />

          {errorMsg && (
            <div className="mt-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </span>
              <button
                type="button"
                onClick={handleSave}
                className="text-[11px] font-bold underline hover:text-rose-950 cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400">
            {saved ? '✓ Saved to your account' : 'Saved per authenticated user + lesson'}
          </span>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loadingNote}
            className={`h-9 px-4 rounded-xl text-xs font-sora font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              saved
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20 disabled:opacity-50'
            }`}
          >
            {saved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Notes'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
