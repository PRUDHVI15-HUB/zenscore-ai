import React, { useState } from 'react'
import { CheckCircle2, XCircle, Award, AlertCircle, ArrowRight, RefreshCw, BookOpen, Sparkles, Check, HelpCircle } from 'lucide-react'
import { submitLessonAssessment } from '../../services/skills/skillsService'

/**
 * LessonAssessment Component
 * Skill-specific interactive assessment engine with instant scoring, strengths/weaknesses, and pass/retry logic.
 */
export default function LessonAssessment({
  lesson,
  skillId = '',
  onPassAssessment,
  onReviewLesson
}) {
  // Generate domain-specific questions if lesson.assessment is not already an array
  const defaultQuestions = [
    {
      id: 'q1',
      question: `What is the primary architectural purpose of ${lesson?.title || 'this technology'}?`,
      options: [
        `To encapsulate modular, maintainable, and testable code patterns`,
        `To bypass data validation and security protocols`,
        `To execute synchronous blocking loops indefinitely`,
        `To replace database query indexing entirely`
      ],
      correctIndex: 0,
      topic: 'Core Architecture',
      explanation: 'Modular design patterns enable scalable, testable, and maintainable software systems.'
    },
    {
      id: 'q2',
      question: `Which practice is considered an industry anti-pattern when working with ${lesson?.title || 'this topic'}?`,
      options: [
        `Directly mutating state/data in-place without pure transformations`,
        `Using structured error boundaries and type checks`,
        `Implementing single-responsibility functions`,
        `Writing unit and integration tests`
      ],
      correctIndex: 0,
      topic: 'Best Practices',
      explanation: 'In-place state mutation causes unpredictable side-effects and breaks reconciliation.'
    },
    {
      id: 'q3',
      question: `When deploying production services for ${lesson?.title || 'this module'}, how should performance be optimized?`,
      options: [
        `By profiling execution paths, utilizing caching, and applying proper indexing/memoization`,
        `By removing all logging and health checks`,
        `By increasing CPU usage with busy-waiting loops`,
        `By hardcoding credentials into client bundles`
      ],
      correctIndex: 0,
      topic: 'Optimization & Security',
      explanation: 'Profiling, memoization, and database indexing are the cornerstones of production performance.'
    }
  ]

  const rawQuestions = lesson?.assessment?.questions || lesson?.quizPlaceholder?.questions || defaultQuestions
  const questions = rawQuestions.length > 0 ? rawQuestions : defaultQuestions

  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const currentQ = questions[currentIdx]

  const handleSelectOption = (optIdx) => {
    if (isSubmitted) return
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIdx]: optIdx
    }))
  }

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setIsSubmitted(true)
    if (skillId && lesson?.id) {
      try {
        const answersArray = questions.map((_, idx) => (selectedAnswers[idx] !== undefined ? selectedAnswers[idx] : -1))
        await submitLessonAssessment(skillId, lesson.id, answersArray).catch(() => null)
      } catch (err) {
        console.warn('[LessonAssessment] Failed to submit score to backend:', err)
      } finally {
        setSubmitting(false)
      }
    }
  }

  const handleRetake = () => {
    setSelectedAnswers({})
    setIsSubmitted(false)
    setCurrentIdx(0)
  }

  // Calculate Score
  const correctCount = questions.reduce((acc, q, idx) => {
    return selectedAnswers[idx] === q.correctIndex ? acc + 1 : acc
  }, 0)

  const scorePercentage = Math.round((correctCount / questions.length) * 100)
  const isPassed = scorePercentage >= 70

  const answeredCount = Object.keys(selectedAnswers).length

  // Results Screen
  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 animate-fade-in">
        {/* Results Header */}
        <div className="text-center pb-6 border-b border-slate-100">
          <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-md ${
            isPassed ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
          }`}>
            {isPassed ? <Award className="w-8 h-8 stroke-[2.2]" /> : <AlertCircle className="w-8 h-8 stroke-[2.2]" />}
          </div>

          <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
            isPassed ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            {isPassed ? 'Assessment Passed' : 'Needs Practice'}
          </span>

          <h2 className="font-sora text-2xl font-extrabold text-slate-900 mt-2 mb-1">
            Score: {scorePercentage}%
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Correct: {correctCount} of {questions.length} questions
          </p>
        </div>

        {/* Strengths & Weaknesses Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-100">
            <h4 className="font-sora text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Strengths Identified</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-emerald-950">
              {questions.map((q, idx) => {
                if (selectedAnswers[idx] === q.correctIndex) {
                  return (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600">✓</span>
                      <span>{q.topic || `Question ${idx + 1}`}</span>
                    </li>
                  )
                }
                return null
              })}
              {correctCount === 0 && <li className="text-slate-400 italic">No strengths logged yet.</li>}
            </ul>
          </div>

          <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-100">
            <h4 className="font-sora text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Topics for Review</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-amber-950">
              {questions.map((q, idx) => {
                if (selectedAnswers[idx] !== q.correctIndex) {
                  return (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-600">•</span>
                      <span>{q.topic || `Question ${idx + 1}`}</span>
                    </li>
                  )
                }
                return null
              })}
              {correctCount === questions.length && <li className="text-emerald-700 font-semibold">Flawless score! All concepts mastered.</li>}
            </ul>
          </div>
        </div>

        {/* Detailed Question Review */}
        <div className="space-y-3 pt-2">
          <h4 className="font-sora text-xs font-bold text-slate-800 uppercase tracking-wider">
            Detailed Review
          </h4>
          {questions.map((q, idx) => {
            const userChoice = selectedAnswers[idx]
            const isRight = userChoice === q.correctIndex
            return (
              <div key={idx} className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                isRight ? 'bg-slate-50/80 border-slate-200' : 'bg-rose-50/60 border-rose-200'
              }`}>
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-slate-900">
                    {idx + 1}. {q.question}
                  </p>
                  <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${
                    isRight ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {isRight ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                <p className="text-slate-600">
                  <strong>Correct Answer:</strong> {q.options[q.correctIndex]}
                </p>
                {q.explanation && (
                  <p className="text-slate-500 italic bg-white/70 p-2 rounded-lg border border-slate-100 mt-1">
                    💡 {q.explanation}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* Next Step Action */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          {isPassed ? (
            <>
              <div className="text-xs text-slate-600">
                <span className="font-semibold text-emerald-700">✓ Assessment Passed!</span> Next: Build the practical task to complete this lesson.
              </div>
              <button
                type="button"
                onClick={onPassAssessment}
                className="w-full sm:w-auto h-11 px-6 bg-purple-600 hover:bg-purple-700 text-white font-sora font-bold text-xs rounded-xl shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Start Practice Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onReviewLesson}
                className="w-full sm:w-auto h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-sora font-semibold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>Review Lesson Content</span>
              </button>
              <button
                type="button"
                onClick={handleRetake}
                className="w-full sm:w-auto h-10 px-5 bg-purple-600 hover:bg-purple-700 text-white font-sora font-bold text-xs rounded-xl shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retake Assessment</span>
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  // Active Assessment Question View
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 animate-fade-in">
      {/* Assessment Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block mb-0.5">
            Lesson Assessment • Pass Mark 70%
          </span>
          <h3 className="font-sora text-base font-bold text-slate-900">
            {lesson?.title || 'Knowledge Check'}
          </h3>
        </div>

        {/* Question Counter Pill */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Question {currentIdx + 1} of {questions.length}
          </span>
          <button
            type="button"
            onClick={onReviewLesson}
            className="text-xs text-slate-500 hover:text-purple-600 font-medium px-2 py-1 transition-colors"
          >
            Exit Assessment
          </button>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center gap-1.5">
        {questions.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full flex-1 transition-all ${
              idx === currentIdx
                ? 'bg-purple-600'
                : selectedAnswers[idx] !== undefined
                ? 'bg-purple-300'
                : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      {/* Question Card */}
      <div className="space-y-4">
        <h4 className="font-sora text-sm md:text-base font-bold text-slate-900 leading-snug">
          {currentQ.question}
        </h4>

        {/* Options List */}
        <div className="space-y-2.5">
          {currentQ.options.map((opt, optIdx) => {
            const isSelected = selectedAnswers[currentIdx] === optIdx
            const optionLetters = ['A', 'B', 'C', 'D']

            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full p-4 rounded-xl border text-left text-xs transition-all flex items-start gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-purple-50/90 border-purple-500 text-purple-950 font-semibold shadow-xs'
                    : 'bg-slate-50/50 hover:bg-slate-100/70 border-slate-200 text-slate-700'
                }`}
              >
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-purple-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600'
                }`}>
                  {optionLetters[optIdx]}
                </span>
                <span className="flex-1 mt-0.5 leading-relaxed">
                  {opt}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <button
          type="button"
          disabled={currentIdx === 0}
          onClick={handlePrev}
          className="h-9 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
        >
          Previous
        </button>

        {currentIdx < questions.length - 1 ? (
          <button
            type="button"
            disabled={selectedAnswers[currentIdx] === undefined}
            onClick={handleNext}
            className="h-9 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-sora font-semibold text-xs shadow-sm transition-all cursor-pointer"
          >
            Next Question
          </button>
        ) : (
          <button
            type="button"
            disabled={answeredCount < questions.length}
            onClick={handleSubmit}
            className="h-10 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white font-sora font-bold text-xs shadow-md shadow-purple-600/25 transition-all cursor-pointer"
          >
            Submit Assessment
          </button>
        )}
      </div>
    </div>
  )
}
