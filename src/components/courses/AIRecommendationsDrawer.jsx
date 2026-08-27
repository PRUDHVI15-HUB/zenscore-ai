import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, ArrowRight, BookOpen, Clock, Star, Target, CheckCircle2, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

/**
 * AIRecommendationsDrawer Component
 * Right slide-over panel opening half-page when "AI Recommendations" CTA is clicked in CoursesHero.
 */
export default function AIRecommendationsDrawer({
  isOpen,
  onClose,
  recommended = [],
  userInfo = null,
  onEnroll
}) {
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const targetRole = userInfo?.targetRole || 'Full Stack Engineer'
  const currentFocus = userInfo?.skills?.[0] || 'React & Web Dev'

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] overflow-hidden">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            {/* Drawer Container (Occupies ~half page on desktop: w-full md:w-[560px] lg:w-[640px]) */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200"
            >
              {/* Header Bar */}
              <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 relative shrink-0">
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-bold mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>AI Career Assistant</span>
                </div>

                <h2 className="font-sora text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2">
                  AI Course Recommendations
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Tailored specialization pathways analyzed and recommended based on your target profile.
                </p>

                {/* Profile Snapshot Pills */}
                <div className="flex flex-wrap items-center gap-2.5 mt-4 text-xs">
                  <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10 text-slate-200 font-medium">
                    Focus: <strong className="text-purple-300 font-bold">{currentFocus}</strong>
                  </span>
                  <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10 text-slate-200 font-medium flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-indigo-300" />
                    Target: <strong className="text-indigo-200 font-bold">{targetRole}</strong>
                  </span>
                </div>
              </div>

              {/* Scrollable Course Cards List */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Recommended Specializations ({recommended.length})
                  </span>
                  <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                    High Relevance Match
                  </span>
                </div>

                {recommended.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
                    <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Loading AI recommendations...</p>
                  </div>
                ) : (
                  recommended.map((course, idx) => {
                    const courseId = course._id || course.id
                    return (
                      <motion.div
                        key={courseId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.06 }}
                        className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-4 group relative"
                      >
                        {/* Match Reason Tag */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-purple-600" /> Matches {targetRole}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {course.difficulty || 'Intermediate'}
                          </span>
                        </div>

                        <div>
                          <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                            {course.category || 'Specialization'}
                          </span>
                          <h3 className="font-sora text-base font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors">
                            {course.title || course.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                            {course.description || course.learningOutcomes?.[0] || 'Master real-world concepts, modules, and coding exercises.'}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {course.estimatedHours || '12 hrs'}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                            {course.modules?.length || 6} Modules
                          </span>
                          <span className="flex items-center gap-1 text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {course.rating || 4.8}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            if (onEnroll) onEnroll(courseId)
                            onClose()
                            navigate(`/courses/${courseId}`)
                          }}
                          className="w-full h-11 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-sora font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm group-hover:shadow-md"
                        >
                          <span>Start Course Specialization</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )
                  })
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 bg-white border-t border-slate-200 text-center shrink-0">
                <button
                  onClick={onClose}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-sora font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Close Recommendations
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
