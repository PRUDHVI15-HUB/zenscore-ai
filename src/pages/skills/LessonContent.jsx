import React, { useState } from 'react'
import {
  CheckCircle,
  Target,
  Clock,
  Lightbulb,
  Copy,
  Check,
  AlertTriangle,
  ShieldCheck,
  Bookmark,
  Sparkles,
  ArrowRight,
  ExternalLink,
  BookOpen,
  FileText,
  Bot,
  Layers,
  Terminal,
  Table,
  HelpCircle,
  Compass
} from 'lucide-react'

/**
 * LessonContent Component
 * High-depth, educational reading workspace inspired by GeeksforGeeks, MDN, and official docs.
 * Structure:
 * 1. Lesson Header + Tools
 * 2. What You Will Learn (Objectives)
 * 3. In-Depth Overview & Architectural Background
 * 4. Deep-Dive Conceptual Chapters (Detailed explanations, analogies, diagrams)
 * 5. Comparison Matrix / Concept Breakdown Table
 * 6. Annotated Syntax Reference & CLI/API Cheat Sheet
 * 7. Practical Code Walkthroughs (with line explanations and output)
 * 8. Pitfalls & Best Practices
 * 9. Key Takeaways
 * 10. Curated Documentation & Guides
 * 11. [Start Skill Assessment] CTA
 */
export default function LessonContent({
  lesson,
  skillTitle = '',
  isBookmarked = false,
  onToggleBookmark,
  onOpenAI,
  onOpenNotes,
  onStartAssessment
}) {
  const [bookmarking, setBookmarking] = useState(false)
  const [copiedCodeIdx, setCopiedCodeIdx] = useState(null)

  const handleCopyCode = (code, idx) => {
    navigator.clipboard.writeText(code)
    setCopiedCodeIdx(idx)
    setTimeout(() => setCopiedCodeIdx(null), 2500)
  }

  const handleBookmarkClick = async () => {
    if (bookmarking || !onToggleBookmark) return
    setBookmarking(true)
    try {
      await onToggleBookmark()
    } finally {
      setBookmarking(false)
    }
  }

  const hasNote = Boolean(lesson.userNote && lesson.userNote.trim().length > 0)

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-8 animate-fade-in">
      {/* ─────────────────────────────────────────────────────────────
          1. LESSON HEADER & COMPACT UTILITY BAR
      ───────────────────────────────────────────────────────────── */}
      <div className="pb-6 border-b border-slate-100 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 mb-1.5 uppercase tracking-wide">
            <span>Lesson {lesson.lessonNumber}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-500 font-normal normal-case">
              <Clock className="w-3.5 h-3.5" />
              <span>{lesson.estimatedMinutes || 30} mins</span>
            </span>
            <span>•</span>
            <span className="text-slate-500 font-normal normal-case">
              {lesson.difficulty || 'Intermediate'}
            </span>
          </div>

          <h1 className="font-sora text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            {lesson.title}
          </h1>

          {lesson.description && (
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              "{lesson.description}"
            </p>
          )}
        </div>

        {/* Compact Utility Actions: Bookmark, Notes Drawer, AI Tutor Drawer */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleBookmarkClick}
            disabled={bookmarking}
            className={`h-9 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            } disabled:opacity-60`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>
              {bookmarking
                ? (isBookmarked ? 'Removing...' : 'Saving...')
                : (isBookmarked ? 'Bookmarked' : 'Bookmark')}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenNotes}
            className={`h-9 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer relative ${
              hasNote
                ? 'bg-amber-100/80 border-amber-300 text-amber-900 shadow-xs font-bold'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            <span>{hasNote ? 'Notes (Saved)' : 'Notes'}</span>
            {hasNote && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenAI}
            className="h-9 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-sora text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-purple-600/25"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask ZenScore AI</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. WHAT YOU WILL LEARN (OBJECTIVES)
      ───────────────────────────────────────────────────────────── */}
      {lesson.learningObjectives?.length > 0 && (
        <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-5">
          <h3 className="font-sora text-xs font-bold text-purple-900 mb-3 flex items-center gap-2 uppercase tracking-wider">
            <Target className="w-4 h-4 text-purple-600" />
            <span>What You Will Learn</span>
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {lesson.learningObjectives.map((obj, idx) => (
              <li key={idx} className="text-xs text-purple-950 flex items-start gap-2.5 leading-relaxed font-medium bg-white/70 p-2.5 rounded-xl border border-purple-100/60 shadow-2xs">
                <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. IN-DEPTH OVERVIEW & CONTEXT
      ───────────────────────────────────────────────────────────── */}
      {lesson.introduction && (
        <div className="space-y-3">
          <h3 className="font-sora text-sm font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-4 h-4 text-purple-600" />
            <span>Conceptual Overview & Motivation</span>
          </h3>
          <div className="text-xs md:text-sm text-slate-700 leading-relaxed bg-slate-50/80 p-5 rounded-2xl border border-slate-200/70 space-y-3">
            <p className="whitespace-pre-line">{lesson.introduction}</p>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. DEEP-DIVE CONCEPTUAL CHAPTERS
      ───────────────────────────────────────────────────────────── */}
      {lesson.deepDiveSections?.length > 0 && (
        <div className="space-y-5">
          <h3 className="font-sora text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" />
            <span>Detailed Conceptual Deep Dive</span>
          </h3>
          <div className="space-y-4">
            {lesson.deepDiveSections.map((section, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-purple-200 transition-all space-y-2.5 shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h4 className="font-sora text-sm font-bold text-slate-900">
                    {section.title}
                  </h4>
                </div>

                <div className="text-xs text-slate-700 leading-relaxed space-y-2 pt-1 pl-8">
                  <p className="whitespace-pre-line">{section.explanation}</p>
                  {section.keyPoint && (
                    <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-100 text-purple-950 font-medium">
                      💡 <strong>Key Principle:</strong> {section.keyPoint}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. CORE ARCHITECTURAL CONCEPTS GRID
      ───────────────────────────────────────────────────────────── */}
      {lesson.coreConcepts?.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-sora text-sm font-bold text-slate-900 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Core Pillars & Mechanics</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {lesson.coreConcepts.map((concept, idx) => (
              <div key={idx} className="p-4 bg-slate-50/80 border border-slate-200/70 rounded-xl text-xs text-slate-800 leading-relaxed shadow-2xs">
                <span className="font-bold text-purple-600 block mb-1">0{idx + 1}.</span>
                {concept}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. COMPARISON MATRIX / CHEAT SHEET TABLE (IF AVAILABLE)
      ───────────────────────────────────────────────────────────── */}
      {lesson.comparisonTable && (
        <div className="space-y-3">
          <h3 className="font-sora text-sm font-bold text-slate-900 flex items-center gap-2">
            <Table className="w-4 h-4 text-purple-600" />
            <span>{lesson.comparisonTable.title || 'Architectural Comparison'}</span>
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-sora font-bold border-b border-slate-200">
                <tr>
                  {lesson.comparisonTable.headers?.map((h, hIdx) => (
                    <th key={hIdx} className="p-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {lesson.comparisonTable.rows?.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className={`p-3 ${cIdx === 0 ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          7. SYNTAX & STANDARD IMPLEMENTATION
      ───────────────────────────────────────────────────────────── */}
      {lesson.syntax && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-sora text-sm font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-600" />
              <span>Syntax Reference & Command Cheat Sheet</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Reference</span>
          </div>

          <div className="bg-slate-900 rounded-2xl p-5 shadow-inner border border-slate-800 relative group">
            <pre className="font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {lesson.syntax}
            </pre>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          8. PRACTICAL CODE WALKTHROUGHS
      ───────────────────────────────────────────────────────────── */}
      {lesson.codeExamples?.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-sora text-sm font-bold text-slate-900">
            Practical Implementation & Step-by-Step Code
          </h3>
          <div className="space-y-4">
            {lesson.codeExamples.map((ex, idx) => (
              <div key={idx} className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-md">
                <div className="px-4 py-2.5 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-300 uppercase tracking-wider">
                    {ex.language || 'code'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(ex.code, idx)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedCodeIdx === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-5 font-mono text-xs text-slate-100 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {ex.code}
                </pre>
                {ex.explanation && (
                  <div className="px-5 py-3.5 bg-slate-800/50 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
                    💡 <strong>Breakdown:</strong> {ex.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          9. PITFALLS & BEST PRACTICES
      ───────────────────────────────────────────────────────────── */}
      {(lesson.commonMistakes?.length > 0 || lesson.bestPractices?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lesson.commonMistakes?.length > 0 && (
            <div className="bg-rose-50/60 border border-rose-100 rounded-2xl p-5 space-y-2.5">
              <h4 className="font-sora text-xs font-bold text-rose-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Common Pitfalls & Mistakes</span>
              </h4>
              <ul className="space-y-2">
                {lesson.commonMistakes.map((item, idx) => (
                  <li key={idx} className="text-xs text-rose-950 flex items-start gap-2 leading-relaxed">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {lesson.bestPractices?.length > 0 && (
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5 space-y-2.5">
              <h4 className="font-sora text-xs font-bold text-emerald-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Industry Best Practices</span>
              </h4>
              <ul className="space-y-2">
                {lesson.bestPractices.map((item, idx) => (
                  <li key={idx} className="text-xs text-emerald-950 flex items-start gap-2 leading-relaxed">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          10. KEY TAKEAWAYS (SUMMARY)
      ───────────────────────────────────────────────────────────── */}
      {lesson.summary && (
        <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-5 space-y-2">
          <h3 className="font-sora text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>Key Takeaways</span>
          </h3>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {lesson.summary}
          </p>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          11. RECOMMENDED RESOURCES (LESSON SPECIFIC)
      ───────────────────────────────────────────────────────────── */}
      {lesson.resources?.length > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="font-sora text-xs font-bold text-slate-900 uppercase tracking-wider">
            Curated Documentation & External Guides
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lesson.resources.map((res, idx) => (
              <a
                key={idx}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-purple-50/60 hover:border-purple-200 transition-all flex items-start justify-between gap-3 group shadow-2xs"
              >
                <div>
                  <span className="text-[10.5px] font-bold text-purple-600 uppercase tracking-wider block mb-1">
                    {res.provider || 'Docs'}
                  </span>
                  <h4 className="font-sora text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-1">
                    {res.title}
                  </h4>
                  <span className="text-[10.5px] text-slate-400 mt-0.5 block">
                    {res.estimatedMinutes || 20} min read
                  </span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 shrink-0 mt-1 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          12. READY TO TEST YOUR KNOWLEDGE? (CTA)
      ───────────────────────────────────────────────────────────── */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-purple-900/20">
        <div>
          <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider block mb-1">
            Ready to test your knowledge?
          </span>
          <h3 className="font-sora text-base font-extrabold text-white">
            You've completed the learning material. Now test your understanding with real assessment questions.
          </h3>
        </div>

        <button
          type="button"
          onClick={onStartAssessment}
          className="w-full sm:w-auto h-11 px-6 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-sora font-bold text-xs shadow-md shadow-purple-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0 active:scale-[0.98]"
        >
          <span>Start Skill Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
