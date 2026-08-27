import React, { useState } from 'react'
import { Code2, Play, CheckCircle2, Lightbulb, Eye, EyeOff, Check, ArrowRight, Sparkles, RefreshCw, Terminal, AlertTriangle } from 'lucide-react'
import { verifyPracticalTask, completeLesson } from '../../services/skills/skillsService'

/**
 * PracticalProject Component
 * Hands-on project task requiring real server-side execution and verification checks before lesson completion.
 */
export default function PracticalProject({
  lesson,
  skillId = '',
  onCompleteTask,
  completing = false
}) {
  const task = lesson?.practicalTask || lesson?.exercisePlaceholder || {
    title: `${lesson?.title || 'Skill'} Practice Project`,
    difficulty: 'Intermediate',
    problemStatement: `Implement a modular solution demonstrating the core principles of ${lesson?.title || 'this lesson'}.`,
    instructions: 'Write clean, testable code satisfying all listed requirements.',
    requirements: [
      'Implement single-responsibility functions',
      'Include appropriate error handling',
      'Validate input arguments'
    ],
    starterCode: `// TODO: Implement solution for ${lesson?.title || 'this task'}\nfunction solution() {\n  return true;\n}`,
    solutionCode: `// Production-Grade Reference Solution\nfunction solution() {\n  return { status: "success", verified: true };\n}`,
    hints: ['Break the problem into modular helper functions', 'Handle edge cases and zero inputs']
  }

  const [userCode, setUserCode] = useState(task.starterCode || '')
  const [showSolution, setShowSolution] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [verificationResult, setVerificationResult] = useState(null)

  const handleVerify = async () => {
    setVerifying(true)
    setFeedback(null)
    setVerificationResult(null)

    try {
      const rawRes = await verifyPracticalTask(skillId, lesson?.id, userCode).catch(err => ({
        passed: false,
        feedback: err.message || 'Execution failed'
      }))
      const res = rawRes?.data || rawRes

      setVerificationResult(res)
      setVerifying(false)

      if (res?.passed) {
        setVerified(true)
        setFeedback({
          type: 'success',
          message: res.feedback || '🎉 All requirements verified! Automated test suite passed successfully.'
        })

        // Call backend completion endpoint
        if (skillId && lesson?.id) {
          await completeLesson(skillId, lesson.id).catch(() => null)
        }

        // Trigger automatic lesson completion callback
        if (onCompleteTask) {
          await onCompleteTask()
        }
      } else {
        setVerified(false)
        setFeedback({
          type: 'error',
          message: res?.feedback || '❌ Verification failed. Please check the failing requirements below and update your solution.'
        })
      }
    } catch (err) {
      setVerifying(false)
      setFeedback({
        type: 'error',
        message: err.message || 'Server error during execution verification.'
      })
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
              BUILD & PRACTICE
            </span>
            <span className="text-xs font-semibold text-slate-400">
              • {task.difficulty || 'Intermediate'}
            </span>
          </div>
          <h3 className="font-sora text-lg font-extrabold text-slate-900">
            {task.title}
          </h3>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2">
          {task.hints?.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHints(prev => !prev)}
              className="h-8 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>{showHints ? 'Hide Hints' : 'Hints'}</span>
            </button>
          )}

          {task.solutionCode && (
            <button
              type="button"
              onClick={() => setShowSolution(prev => !prev)}
              className="h-8 px-3 rounded-lg border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-purple-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {showSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showSolution ? 'Hide Solution' : 'View Solution'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Problem Statement */}
      <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/60 space-y-2 text-xs leading-relaxed text-slate-700">
        <p className="font-bold text-slate-900">Problem Statement:</p>
        <p>{task.problemStatement}</p>
        {task.instructions && <p className="text-slate-600">{task.instructions}</p>}
      </div>

      {/* Requirements Checklist */}
      {task.requirements?.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-sora text-xs font-bold text-slate-900 uppercase tracking-wider">
            Requirements Checklist
          </h4>
          <ul className="space-y-1.5">
            {task.requirements.map((req, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Hints Card */}
      {showHints && task.hints?.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-2 animate-fade-in">
          <h4 className="font-sora text-xs font-bold text-amber-900 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>Implementation Hints</span>
          </h4>
          <ul className="space-y-1 text-xs text-amber-950">
            {task.hints.map((hint, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span>💡</span>
                <span>{hint}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Interactive Code Workspace */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 font-sora">
            <Terminal className="w-4 h-4 text-purple-600" />
            <span>Interactive Code Editor</span>
          </label>
          <span className="text-[11px] text-slate-400 font-mono">UTF-8 • JavaScript / Python</span>
        </div>

        <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs shadow-inner border border-slate-800">
          <textarea
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            rows={8}
            className="w-full bg-transparent text-emerald-300 font-mono text-xs focus:outline-none resize-none leading-relaxed"
            placeholder="// Write your implementation code here..."
          />
        </div>
      </div>

      {/* Solution Reference Box */}
      {showSolution && task.solutionCode && (
        <div className="bg-slate-900 text-emerald-400 rounded-xl p-4 font-mono text-xs border border-emerald-500/40 space-y-2 animate-fade-in">
          <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800">
            <span className="text-[11px] font-bold text-emerald-300">Reference Solution</span>
            <span className="text-[10px]">Verified Output</span>
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {task.solutionCode}
          </pre>
        </div>
      )}

      {/* Verification Feedback & Detailed Checks */}
      {feedback && (
        <div className={`rounded-xl p-4 border text-xs font-semibold space-y-3 animate-fade-in ${
          feedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}>
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>

          {verificationResult?.checks?.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
              <span className="text-[11px] font-bold uppercase tracking-wider block text-slate-700">Verification Checks Breakdown:</span>
              <ul className="space-y-1 font-mono text-[11px]">
                {verificationResult.checks.map((c, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span>{c.passed ? '✓' : '❌'}</span>
                    <span className={c.passed ? 'text-emerald-800 font-bold' : 'text-rose-800 font-bold'}>{c.name}:</span>
                    <span className="text-slate-600 font-sans">{c.details}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {verificationResult?.stdout && (
            <div className="pt-2 border-t border-slate-200/60">
              <span className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Execution Standard Output (stdout):</span>
              <pre className="p-2 rounded-lg bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                {verificationResult.stdout}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Footer Run & Complete Button */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-slate-500">
          {verified ? '✓ Automatically completing lesson...' : 'Run test verification to satisfy completion criteria.'}
        </span>

        <button
          type="button"
          disabled={verifying || completing || verified}
          onClick={handleVerify}
          className={`w-full sm:w-auto h-11 px-6 font-sora font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
            verified
              ? 'bg-emerald-600 text-white cursor-default shadow-emerald-600/20'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/25 active:scale-[0.98]'
          }`}
        >
          {verifying ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Verifying Test Suite...</span>
            </>
          ) : verified ? (
            <>
              <Check className="w-4 h-4" />
              <span>Task Verified & Completed!</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Verify & Complete Lesson</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
