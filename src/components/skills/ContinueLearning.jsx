import React from 'react'
import { motion } from 'framer-motion'
import { Play, Clock, Sparkles, AlertCircle, ArrowRight, BookOpen, Layers } from 'lucide-react'
import SkillIcon from './SkillIcon'

/**
 * ContinueLearning Component
 *
 * Displays a list of in-progress learning items directly below SkillsOverview.
 *
 * Props:
 * - courses: Array of course objects
 * - loading: boolean
 * - error: boolean | string | null
 * - onContinue: function (callback when "Continue Learning" clicked)
 * - onExplore: function (callback when "Explore Skills" clicked in empty state)
 */
export default function ContinueLearning({
  courses = null,
  loading = false,
  error = null,
  onContinue,
  onExplore
}) {
  // Sensible default fallback courses if courses prop is empty/null
  const defaultCourses = [
    {
      id: 'webdev-react',
      name: 'React.js & Modern Web Dev',
      category: 'Web Development',
      icon: '🌐',
      progress: 65,
      difficulty: 'Intermediate',
      lastStudied: '2 hours ago',
      timeRemaining: '4 hrs remaining',
      color: '#EFF6FF',
      accent: '#2563EB'
    },
    {
      id: 'datascience-python',
      name: 'Python & Data Science',
      category: 'Data Science',
      icon: '📊',
      progress: 40,
      difficulty: 'Beginner',
      lastStudied: 'Yesterday',
      timeRemaining: '6.5 hrs remaining',
      color: '#FDF4FF',
      accent: '#7C3AED'
    },
    {
      id: 'dsa-algo',
      name: 'Data Structures & Algorithms',
      category: 'DSA & Competitive',
      icon: '⚡',
      progress: 80,
      difficulty: 'Advanced',
      lastStudied: '3 days ago',
      timeRemaining: '2 hrs remaining',
      color: '#F0FDF4',
      accent: '#059669'
    }
  ]

  const courseList = courses !== null ? courses : defaultCourses

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    }
  }

  // 1. Loading State
  if (loading) {
    return (
      <div className="container mx-auto px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm animate-pulse flex flex-col justify-between h-56"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 w-20 bg-slate-200 rounded" />
                  <div className="h-4 w-36 bg-slate-200 rounded" />
                </div>
              </div>
              <div className="space-y-2 my-4">
                <div className="h-3 w-full bg-slate-200 rounded" />
                <div className="h-2 w-full bg-slate-200 rounded-full" />
              </div>
              <div className="h-10 w-full bg-slate-200 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 2. Error State
  if (error) {
    const errorMsg = typeof error === 'string' ? error : 'Unable to load active learning courses.'
    return (
      <div className="container mx-auto px-6 mb-8">
        <div className="bg-rose-50 border border-rose-200/80 text-rose-800 rounded-2xl p-5 flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span className="font-medium">{errorMsg}</span>
          </div>
          <span className="text-xs text-rose-600 font-semibold uppercase tracking-wider">
            Fallback Active
          </span>
        </div>
      </div>
    )
  }

  // 3. Empty State
  if (Array.isArray(courseList) && courseList.length === 0) {
    return (
      <div className="container mx-auto px-6 mb-8">
        <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderColor: 'var(--border, #E2E8F0)' }} className="rounded-2xl p-8 border shadow-sm text-center flex flex-col items-center justify-center min-h-[220px]">
          <div style={{ background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }} className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3">
            <BookOpen className="w-7 h-7 stroke-[2]" />
          </div>
          <h3 style={{ color: 'var(--text-dark, #0F172A)' }} className="font-sora text-lg font-bold mb-1">
            You haven't started learning any skills yet.
          </h3>
          <p style={{ color: 'var(--text-muted, #64748B)' }} className="text-sm max-w-md mb-5">
            Explore our curated skill categories and roadmaps to kickstart your learning journey today.
          </p>
          <button
            onClick={() => onExplore && onExplore()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-sora font-semibold text-sm transition-all shadow-md shadow-purple-600/20 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Explore Skills</span>
          </button>
        </div>
      </div>
    )
  }

  // 4. Success State
  return (
    <div className="container mx-auto px-6 mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div style={{ background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }} className="w-8 h-8 rounded-lg flex items-center justify-center">
            <Layers className="w-4.5 h-4.5 stroke-[2.2]" />
          </div>
          <h2 style={{ color: 'var(--text-dark, #0F172A)' }} className="font-sora text-lg font-bold">
            Continue Learning
          </h2>
        </div>
        <span style={{ color: 'var(--text-muted, #64748B)' }} className="text-xs font-semibold uppercase tracking-wider">
          {courseList.length} Active {courseList.length === 1 ? 'Skill' : 'Skills'}
        </span>
      </div>

      {/* Course Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {courseList.map((course) => {
          // Difficulty badge color helper
          const difficultyColors = {
            Beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
            Intermediate: 'bg-blue-50 text-blue-700 border-blue-200/60',
            Advanced: 'bg-purple-50 text-purple-700 border-purple-200/60'
          }
          const diffStyle = difficultyColors[course.difficulty] || 'bg-slate-50 text-slate-700 border-slate-200'

          return (
            <motion.div
              key={course.id || course.name}
              variants={itemVariants}
              whileHover={{ y: -4, boxShadow: '0 12px 28px -5px rgba(15, 23, 42, 0.08)' }}
              transition={{ duration: 0.2 }}
              style={{ background: 'var(--bg-soft, #FFFFFF)', borderColor: 'var(--border, #E2E8F0)' }}
              className="rounded-2xl p-6 border shadow-sm flex flex-col justify-between transition-all group"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <SkillIcon name={course.name} category={course.category} icon={course.icon} size="md" />
                    <div>
                      <span style={{ color: 'var(--text-muted, #94A3B8)' }} className="text-xs font-semibold block mb-0.5">
                        {course.category || 'General'}
                      </span>
                      <h3 style={{ color: 'var(--text-dark, #0F172A)' }} className="font-sora text-base font-bold leading-snug group-hover:text-purple-600 transition-colors">
                        {course.name}
                      </h3>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${diffStyle} flex-shrink-0`}
                  >
                    {course.difficulty || 'All Levels'}
                  </span>
                </div>

                {/* Progress Bar & Status */}
                <div className="mt-4 mb-4">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-500">Overall Progress</span>
                    <span className="text-purple-600 font-bold">{course.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${course.progress}%`,
                        background: course.accent
                          ? `linear-gradient(90deg, ${course.accent}, ${course.accent}DD)`
                          : 'linear-gradient(90deg, #7C3AED, #A855F7)'
                      }}
                    />
                  </div>
                </div>

                {/* Meta details (Last studied & Time remaining) */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 mb-5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {course.lastStudied || 'Recently'}
                  </span>
                  <span className="font-medium text-slate-600">
                    ⏱️ {course.timeRemaining || 'In Progress'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onContinue && onContinue(course)}
                className="w-full h-10 rounded-xl bg-slate-900 hover:bg-purple-600 text-white font-sora font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm group-hover:shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Continue Learning</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
