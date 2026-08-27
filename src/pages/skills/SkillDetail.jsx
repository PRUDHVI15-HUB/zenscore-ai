import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom'
import { ArrowLeft, RefreshCw, AlertCircle, Search, Award, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck, X, BookOpen, Layers } from 'lucide-react'
import AppLayout from '../../components/AppLayout'
import ProgressCard from './ProgressCard'
import ModuleSidebar from './ModuleSidebar'
import LessonViewer from './LessonViewer'
import { getSkill, enrollSkill, completeLesson, saveLessonNote, toggleLessonBookmark, askLessonAI } from '../../services/skills/skillsService'
import { normalizeSkillDetail } from '../../services/skills/skillsNormalizer'
import { useCareer } from '../../context/CareerContext'
import { useStudentProfile } from '../../context/StudentProfileContext'

/**
 * SkillDetail Page Component
 * Master Production Skill Learning Workspace with search, keyboard navigation, interactive engine, and automatic certification.
 */
export default function SkillDetail() {
  const { skillId } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const career = useCareer()
  const studentProfileCtx = useStudentProfile()

  const isFromCareer = searchParams.get('from') === 'career' || searchParams.get('source') === 'career'

  const [skillData, setSkillData] = useState(null)
  const [activeLesson, setActiveLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [completing, setCompleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState(null)
  const [showCertModal, setShowCertModal] = useState(false)
  const [mobileWorkspaceTab, setMobileWorkspaceTab] = useState('lesson') // 'lesson' | 'outline'

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  const loadSkillWorkspace = useCallback(async () => {
    if (!skillId) return
    setLoading(true)
    setError(null)

    try {
      await enrollSkill(skillId).catch(() => null)
      const res = await getSkill(skillId)
      const normalized = normalizeSkillDetail(res, skillId)
      if (!normalized) {
        throw new Error('Skill not found in database.')
      }
      setSkillData(normalized)

      const allLessons = normalized.lessons || []
      const userCompleted = normalized.userProgress?.completedLessons || []
      
      const urlParams = new URLSearchParams(window.location.search)
      const lessonParam = urlParams.get('lesson') || urlParams.get('lessonId')

      let targetLesson = null
      if (lessonParam) {
        targetLesson = allLessons.find(l => 
          l.id?.toString() === lessonParam ||
          l.lessonNumber?.toString() === lessonParam ||
          l.title?.toLowerCase().replace(/[^a-z0-9]/g, '-').includes(lessonParam.toLowerCase())
        )
      }

      if (!targetLesson) {
        targetLesson = allLessons.find(l => !userCompleted.some(id => id.toString() === l.id?.toString())) || allLessons[0] || null
      }

      setActiveLesson(targetLesson)
    } catch (err) {
      console.warn('[SkillDetail] Failed to load workspace:', err)
      setError(err?.message || 'Failed to load skill learning workspace. Please retry.')
    } finally {
      setLoading(false)
    }
  }, [skillId])

  useEffect(() => {
    loadSkillWorkspace()
  }, [loadSkillWorkspace])

  // Filter lessons based on search query
  const filteredLessons = useMemo(() => {
    if (!skillData?.lessons) return []
    if (!searchQuery.trim()) return skillData.lessons

    const q = searchQuery.toLowerCase().trim()
    return skillData.lessons.filter(l =>
      l.title?.toLowerCase().includes(q) ||
      l.description?.toLowerCase().includes(q) ||
      l.learningObjectives?.some(obj => obj.toLowerCase().includes(q))
    )
  }, [skillData?.lessons, searchQuery])

  // Get current lesson index for prev / next navigation
  const currentIndex = useMemo(() => {
    if (!skillData?.lessons || !activeLesson) return -1
    return skillData.lessons.findIndex(l => l.id.toString() === activeLesson.id.toString())
  }, [skillData?.lessons, activeLesson])

  const handlePrevLesson = useCallback(() => {
    if (currentIndex > 0 && skillData?.lessons) {
      setActiveLesson(skillData.lessons[currentIndex - 1])
    }
  }, [currentIndex, skillData?.lessons])

  const handleNextLesson = useCallback(() => {
    if (skillData?.lessons && currentIndex >= 0 && currentIndex < skillData.lessons.length - 1) {
      const currentLesson = skillData.lessons[currentIndex]
      if (!currentLesson?.isCompleted) {
        showToast('🔒 Please complete and verify the current lesson to unlock the next lesson.', 'error')
        return
      }
      const nextLesson = skillData.lessons[currentIndex + 1]
      if (nextLesson && !nextLesson.isLocked) {
        setActiveLesson(nextLesson)
      } else {
        showToast('🔒 The next lesson is locked. Complete all previous lesson tasks to unlock.', 'error')
      }
    }
  }, [currentIndex, skillData?.lessons, showToast])

  // Keyboard navigation listener (Left/Right arrow)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === 'ArrowLeft') handlePrevLesson()
      if (e.key === 'ArrowRight') handleNextLesson()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlePrevLesson, handleNextLesson])

  // Handle Mark Lesson Complete
  const handleCompleteActiveLesson = async () => {
    if (!activeLesson || completing || activeLesson.isCompleted) return
    setCompleting(true)

    try {
      const res = await completeLesson(skillId, activeLesson.id)
      if (res.success) {
        showToast(`✓ Lesson completed! Skill Progress: ${res.data?.completionPercentage || 0}%`, 'success')

        setActiveLesson(prev => prev ? { ...prev, isCompleted: true } : null)

        // Real-time synchronization to Career Roadmap & Student Profile
        try {
          if (career?.fetchDashboard) career.fetchDashboard()
          if (studentProfileCtx?.refreshProfile) studentProfileCtx.refreshProfile()
        } catch (syncErr) {
          console.info('[SkillDetail] Live context refresh notice:', syncErr)
        }

        const updatedRes = await getSkill(skillId)
        if (updatedRes) {
          const normalized = normalizeSkillDetail(updatedRes, skillId)
          setSkillData(normalized)

          if (normalized.userProgress?.completionPercentage === 100) {
            setShowCertModal(true)
          }

          if (res.data?.nextLesson) {
            const nextL = normalized.lessons?.find(l => l.id.toString() === res.data.nextLesson.id.toString())
            if (nextL) setActiveLesson(nextL)
          }
        }
      }
    } catch (err) {
      showToast(err?.message || 'Failed to mark lesson complete', 'error')
    } finally {
      setCompleting(false)
    }
  }

  return (
    <AppLayout>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          background: toast.type === 'error' ? '#EF4444' : 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
          color: '#ffffff',
          padding: '14px 22px',
          borderRadius: '14px',
          fontFamily: 'Sora, sans-serif',
          fontSize: '14px',
          fontWeight: 600,
          boxShadow: '0 12px 30px -5px rgba(124, 58, 237, 0.45)',
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          {toast.message}
        </div>
      )}

      {/* Certificate Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-purple-100 text-center relative overflow-hidden">
            <button
              type="button"
              onClick={() => setShowCertModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg text-white">
              <Award className="w-9 h-9" />
            </div>

            <span className="text-[11px] font-bold tracking-widest uppercase text-purple-600 block mb-1">
              Skill Mastery Certification
            </span>
            <h2 className="font-sora text-xl font-extrabold text-slate-900 mb-2">
              Congratulations! 🎉
            </h2>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              You have completed 100% of <strong>{skillData?.skill?.name}</strong>! Your verifiable digital certificate has been issued and saved to your account.
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Verification ID:</span>
                <span className="font-mono font-bold text-purple-700">{skillData?.certificate?.certificateId || 'Verified & Stored on Profile'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Issued By:</span>
                <span className="font-semibold text-slate-800">ZenScore AI Academy</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Status:</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowCertModal(false)}
              className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-sora font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 cursor-pointer"
            >
              Continue Learning
            </button>
          </div>
        </div>
      )}

      <div className="container" style={{ padding: '16px 24px 40px' }}>
        {/* Top Header Row with Back Button & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          {isFromCareer ? (
            <Link
              to="/careers/learning?focus=skills"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200 transition-all shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Career Roadmap</span>
            </Link>
          ) : (
            <Link
              to="/skills"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Skills Hub</span>
            </Link>
          )}

          {/* Instant Search Bar inside Workspace */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lessons & objectives..."
              className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 text-slate-800 placeholder-slate-400 shadow-2xs"
            />
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm space-y-4">
            <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
            <p className="font-sora text-sm font-bold text-slate-800">Loading Skill Learning Workspace...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl p-8 border border-rose-200 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <h3 className="font-sora text-base font-bold text-slate-900">{error}</h3>
            <button
              type="button"
              onClick={loadSkillWorkspace}
              className="h-9 px-4 rounded-xl bg-purple-600 text-white font-sora font-semibold text-xs inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Loading</span>
            </button>
          </div>
        ) : (
          <div>
            {/* Top Banner Progress Card */}
            <ProgressCard
              skill={skillData}
              userProgress={skillData?.userProgress}
              activeLesson={activeLesson}
              onCompleteLesson={handleCompleteActiveLesson}
              completing={completing}
            />

            {/* Mobile & Tablet Mode Switcher (Lesson View vs Curriculum Outline) */}
            <div className="lg:hidden flex items-center p-1 bg-slate-100/90 rounded-2xl mb-4 border border-slate-200/80 shadow-2xs">
              <button
                type="button"
                onClick={() => setMobileWorkspaceTab('lesson')}
                className={`flex-1 py-2.5 px-3 rounded-xl font-sora text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mobileWorkspaceTab === 'lesson'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="truncate">Active Lesson</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileWorkspaceTab('outline')}
                className={`flex-1 py-2.5 px-3 rounded-xl font-sora text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mobileWorkspaceTab === 'outline'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="truncate">Curriculum Outline ({skillData?.lessons?.filter(l => l.isCompleted)?.length || 0}/{skillData?.lessons?.length || 0})</span>
              </button>
            </div>

            {/* Workspace Layout */}
            <div className="flex flex-col lg:flex-row items-start gap-6">
              {/* Left Module Outline Sidebar */}
              <div className={`w-full lg:w-80 shrink-0 ${mobileWorkspaceTab === 'outline' ? 'block' : 'hidden lg:block'}`}>
                <ModuleSidebar
                  skill={skillData}
                  modules={skillData?.modules || []}
                  activeLessonId={activeLesson?.id}
                  onSelectLesson={(lesson) => {
                    if (lesson?.isLocked) {
                      showToast('🔒 Lesson Locked: Complete previous lessons to unlock', 'error')
                      return
                    }
                    setActiveLesson(lesson)
                    setMobileWorkspaceTab('lesson')
                    if (lesson?.id) {
                      setSearchParams({ lesson: lesson.id }, { replace: true })
                    }
                  }}
                />
              </div>

              {/* Center & Right Main Lesson Viewer */}
              <div className={`flex-1 w-full min-w-0 space-y-6 ${mobileWorkspaceTab === 'lesson' ? 'block' : 'hidden lg:block'}`}>
                <LessonViewer
                  lesson={activeLesson ? { ...activeLesson, skillTitle: skillData?.name || skillData?.title } : null}
                  skillId={skillId}
                  skillTitle={skillData?.name || skillData?.title}
                  isBookmarked={activeLesson?.isBookmarked}
                  onToggleBookmark={async () => {
                    if (!activeLesson) return
                    try {
                      const res = await toggleLessonBookmark(activeLesson.id)
                      if (res.success) {
                        const isB = Boolean(res.data?.isBookmarked)
                        showToast(isB ? '★ Lesson bookmarked' : 'Bookmark removed', 'success')
                        setActiveLesson(prev => prev ? { ...prev, isBookmarked: isB } : null)
                        setSkillData(prev => {
                          if (!prev?.lessons) return prev
                          return {
                            ...prev,
                            lessons: prev.lessons.map(l => l.id === activeLesson.id ? { ...l, isBookmarked: isB } : l)
                          }
                        })
                      }
                    } catch (err) {
                      showToast(err?.message || 'Unable to save bookmark. Retry.', 'error')
                      throw err
                    }
                  }}
                  onSaveNote={async (noteText) => {
                    if (!activeLesson) return
                    try {
                      const res = await saveLessonNote(activeLesson.id, noteText)
                      if (res.success) {
                        showToast('✓ Note saved to MongoDB', 'success')
                        setActiveLesson(prev => prev ? { ...prev, userNote: noteText } : null)
                        setSkillData(prev => {
                          if (!prev?.lessons) return prev
                          return {
                            ...prev,
                            lessons: prev.lessons.map(l => l.id === activeLesson.id ? { ...l, userNote: noteText } : l)
                          }
                        })
                      }
                    } catch (err) {
                      showToast(err?.message || 'Unable to save notes. Retry.', 'error')
                      throw err
                    }
                  }}
                  onAskAI={async (promptText, history = []) => {
                    if (!activeLesson) return null
                    try {
                      const res = await askLessonAI(activeLesson.id, promptText, history)
                      if (res && res.data) {
                        return res.data
                      }
                      throw new Error("ZenScore AI couldn't respond right now. Retry.")
                    } catch (err) {
                      showToast(err?.message || "ZenScore AI couldn't respond right now. Retry.", 'error')
                      throw err
                    }
                  }}
                  onCompleteActiveLesson={handleCompleteActiveLesson}
                  onNextLesson={handleNextLesson}
                  hasNextLesson={currentIndex < (skillData?.lessons?.length || 0) - 1}
                />

                {/* Lesson Navigation Controls (Prev / Next & Shortcuts) */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between gap-2">
                  <button
                    type="button"
                    disabled={currentIndex <= 0}
                    onClick={handlePrevLesson}
                    className="h-9 px-3 sm:px-4 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-xs font-semibold text-slate-700 flex items-center gap-1 sm:gap-1.5 cursor-pointer transition-all shrink-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">
                    Use ← → Arrow keys to navigate
                  </span>

                  <button
                    type="button"
                    disabled={!skillData?.lessons || currentIndex >= skillData.lessons.length - 1}
                    onClick={handleNextLesson}
                    className="h-9 px-3 sm:px-4 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-xs font-bold text-white flex items-center gap-1 sm:gap-1.5 cursor-pointer transition-all shadow-sm shadow-purple-600/20 shrink-0"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
