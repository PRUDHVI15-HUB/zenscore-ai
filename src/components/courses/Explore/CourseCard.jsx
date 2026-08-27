import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Star, Clock, ArrowRight, Bookmark } from 'lucide-react'

/**
 * CourseCard Component
 * Reusable course card matching SkillCard design system.
 */
export default React.memo(function CourseCard({
  course,
  onCourseClick,
  onBookmark,
  onEnroll
}) {
  const courseId = course._id || course.id
  const isEnrolled = course.isEnrolled || course.progress > 0

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between p-6 group relative overflow-hidden"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-2xl shrink-0 shadow-xs">
            {course.icon || '📚'}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {course.difficulty || 'Intermediate'}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onBookmark && onBookmark(courseId)
              }}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                course.isBookmarked ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-400 hover:text-slate-600'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${course.isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 mb-1 block">
          {course.category || 'Specialization'}
        </span>

        <h3 className="font-sora text-base font-extrabold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-1">
          {course.title || course.name}
        </h3>

        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {course.description || course.learningOutcomes?.[0] || 'Master real-world concepts, modules, and coding exercises.'}
        </p>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-5">
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
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        {isEnrolled ? (
          <button
            onClick={() => onCourseClick && onCourseClick(course)}
            className="w-full h-10 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-sora font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <span>Continue Course</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={() => onEnroll && onEnroll(courseId)}
            className="w-full h-10 rounded-xl bg-slate-900 hover:bg-purple-600 text-white font-sora font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <span>Start Course</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  )
})
