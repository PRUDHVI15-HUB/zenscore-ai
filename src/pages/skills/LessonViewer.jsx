import React, { useState, useEffect } from 'react'
import LessonContent from './LessonContent'
import LessonAssessment from './LessonAssessment'
import PracticalProject from './PracticalProject'
import AITutorDrawer from './AITutorDrawer'
import NotesDrawer from './NotesDrawer'
import { recordLearnComplete } from '../../services/skills/skillsService'
import { CheckCircle2, ArrowRight, BookOpen, Award, Sparkles, ChevronRight, Lock, Check } from 'lucide-react'

/**
 * LessonViewer Component
 * Single clean vertical learning workspace implementing the strict 3-stage pipeline:
 * LEARN -> ASSESS (≥70%) -> BUILD (Real Verification) -> AUTO COMPLETE -> NEXT LESSON
 */
export default function LessonViewer({
  lesson,
  skillId = '',
  skillTitle = '',
  isBookmarked = false,
  onToggleBookmark,
  onSaveNote,
  onAskAI,
  onCompleteActiveLesson,
  onNextLesson,
  hasNextLesson = false
}) {
  const [stage, setStage] = useState('learn') // 'learn' | 'assess' | 'build' | 'completed'
  const [showAIDrawer, setShowAIDrawer] = useState(false)
  const [showNotesDrawer, setShowNotesDrawer] = useState(false)
  const [localLearnDone, setLocalLearnDone] = useState(false)
  const [localAssessPassed, setLocalAssessPassed] = useState(false)

  // Sync stage and unlock flags when active lesson changes
  useEffect(() => {
    setLocalLearnDone(Boolean(lesson?.learnCompleted || lesson?.isCompleted))
    setLocalAssessPassed(Boolean(lesson?.assessmentPassed || lesson?.isCompleted))

    if (lesson?.isCompleted) {
      setStage('completed')
    } else {
      setStage('learn')
    }
  }, [lesson?.id, lesson?.isCompleted, lesson?.learnCompleted, lesson?.assessmentPassed])

  if (!lesson) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm text-center">
        <p className="text-xs text-slate-500">Select a lesson from the curriculum sidebar to load content.</p>
      </div>
    )
  }

  const handleStartAssessment = async () => {
    try {
      if (skillId && lesson.id) {
        await recordLearnComplete(skillId, lesson.id).catch(() => null)
      }
    } catch (e) {
      console.warn('[LessonViewer] Failed to record learn complete:', e)
    }
    setLocalLearnDone(true)
    setStage('assess')
  }

  const handleAssessmentPassed = () => {
    setLocalAssessPassed(true)
    setStage('build')
  }

  const handleTaskCompleted = async () => {
    if (onCompleteActiveLesson) {
      await onCompleteActiveLesson(lesson)
    }
    setStage('completed')
  }

  const isLearnUnlocked = true
  const isAssessUnlocked = lesson?.isCompleted || localLearnDone || lesson?.learnCompleted
  const isBuildUnlocked = lesson?.isCompleted || localAssessPassed || lesson?.assessmentPassed

  return (
    <div className="w-full space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          LEARNING WORKSPACE STEP PROGRESS BAR (LEARN -> ASSESS -> BUILD)
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-3 min-w-max">
          {/* Step 1: Learn */}
          <button
            type="button"
            onClick={() => setStage('learn')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              stage === 'learn'
                ? 'bg-purple-50 text-purple-700 font-bold border border-purple-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10.5px] font-bold ${
              localLearnDone ? 'bg-emerald-500 text-white' : (stage === 'learn' ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600')
            }`}>
              {localLearnDone ? <Check className="w-3 h-3 stroke-[3]" /> : '1'}
            </span>
            <span>1. Learn & Concepts</span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />

          {/* Step 2: Assess */}
          <button
            type="button"
            disabled={!isAssessUnlocked}
            onClick={() => isAssessUnlocked && setStage('assess')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              !isAssessUnlocked
                ? 'text-slate-300 bg-slate-50 cursor-not-allowed border border-transparent'
                : (stage === 'assess'
                  ? 'bg-purple-50 text-purple-700 font-bold border border-purple-200 shadow-xs cursor-pointer'
                  : 'text-slate-600 hover:text-slate-900 cursor-pointer')
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10.5px] font-bold ${
              !isAssessUnlocked
                ? 'bg-slate-200 text-slate-400'
                : (localAssessPassed ? 'bg-emerald-500 text-white' : (stage === 'assess' ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'))
            }`}>
              {!isAssessUnlocked ? <Lock className="w-2.5 h-2.5" /> : (localAssessPassed ? <Check className="w-3 h-3 stroke-[3]" /> : '2')}
            </span>
            <span>2. Skill Assessment</span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />

          {/* Step 3: Build */}
          <button
            type="button"
            disabled={!isBuildUnlocked}
            onClick={() => isBuildUnlocked && setStage('build')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              !isBuildUnlocked
                ? 'text-slate-300 bg-slate-50 cursor-not-allowed border border-transparent'
                : (stage === 'build'
                  ? 'bg-purple-50 text-purple-700 font-bold border border-purple-200 shadow-xs cursor-pointer'
                  : 'text-slate-600 hover:text-slate-900 cursor-pointer')
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10.5px] font-bold ${
              !isBuildUnlocked
                ? 'bg-slate-200 text-slate-400'
                : (lesson.isCompleted ? 'bg-emerald-500 text-white' : (stage === 'build' ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'))
            }`}>
              {!isBuildUnlocked ? <Lock className="w-2.5 h-2.5" /> : (lesson.isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : '3')}
            </span>
            <span>3. Build & Practice</span>
          </button>
        </div>

        {lesson.isCompleted && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Completed</span>
          </span>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ACTIVE STAGE VIEW
      ───────────────────────────────────────────────────────────── */}
      {stage === 'learn' && (
        <LessonContent
          lesson={lesson}
          skillTitle={skillTitle}
          isBookmarked={isBookmarked}
          onToggleBookmark={onToggleBookmark}
          onOpenAI={() => setShowAIDrawer(true)}
          onOpenNotes={() => setShowNotesDrawer(true)}
          onStartAssessment={handleStartAssessment}
        />
      )}

      {stage === 'assess' && (
        <LessonAssessment
          lesson={lesson}
          skillId={skillId}
          onPassAssessment={handleAssessmentPassed}
          onReviewLesson={() => setStage('learn')}
        />
      )}

      {stage === 'build' && (
        <PracticalProject
          lesson={lesson}
          skillId={skillId}
          onCompleteTask={handleTaskCompleted}
        />
      )}

      {stage === 'completed' && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center shadow-md">
            <Award className="w-8 h-8 stroke-[2.2]" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              ✓ Lesson Completed & Verified
            </span>
            <h2 className="font-sora text-2xl font-extrabold text-slate-900 mt-3 mb-1">
              Great work! You've mastered this concept.
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your assessment and practical project have been verified. Your skill roadmap and profile progress have updated.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setStage('learn')}
              className="h-10 px-5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Review Learning Material
            </button>

            {hasNextLesson && (
              <button
                type="button"
                onClick={onNextLesson}
                className="h-10 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-sora font-bold text-xs shadow-md shadow-purple-600/25 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Next Lesson</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          AI TUTOR & NOTES SLIDE-OVER DRAWERS
      ───────────────────────────────────────────────────────────── */}
      <AITutorDrawer
        isOpen={showAIDrawer}
        onClose={() => setShowAIDrawer(false)}
        lessonId={lesson.id}
        skillTitle={skillTitle}
        lessonTitle={lesson.title}
        learningObjectives={lesson.learningObjectives}
        coreConcepts={lesson.coreConcepts}
        onAskAI={onAskAI}
      />

      <NotesDrawer
        isOpen={showNotesDrawer}
        onClose={() => setShowNotesDrawer(false)}
        lessonId={lesson.id}
        lessonTitle={lesson.title}
        noteContent={lesson.userNote || ''}
        onSaveNote={onSaveNote}
      />
    </div>
  )
}
