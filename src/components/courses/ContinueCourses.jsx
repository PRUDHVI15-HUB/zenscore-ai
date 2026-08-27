import React from 'react'
import { motion } from 'framer-motion'
import { Play, Clock, ArrowRight, BookOpen } from 'lucide-react'

/**
 * ContinueCourses Component
 * Active courses cards matching ContinueLearning style in Skills module.
 */
export default function ContinueCourses({
  courses = [],
  loading = false,
  onContinue,
  onExplore
}) {
  if (!Array.isArray(courses) || courses.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 mb-8 border border-slate-200/80 shadow-sm text-center">
        <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mx-auto mb-3">
          <BookOpen className="w-6 h-6 stroke-[2]" />
        </div>
        <h4 className="font-sora text-base font-bold text-slate-900 mb-1">No Active Courses Yet</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
          Enroll in any course specialization from the Explore section to track your progress and resume learning.
        </p>
        <button
          onClick={onExplore}
          className="px-4 py-2 bg-purple-600 text-white font-sora font-bold text-xs rounded-xl shadow-md hover:bg-purple-700 transition-all cursor-pointer"
        >
          Explore Courses
        </button>
      </div>
    )
  }

  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-sora text-lg font-bold text-slate-900 flex items-center gap-2">
          <Play className="w-4 h-4 text-purple-600 fill-current" />
          <span>Continue Learning</span>
        </h3>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {courses.length} Active Courses
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((item) => {
          const course = item.course || item
          const progress = item.completionPercentage || item.completedPercent || 0
          const courseId = course._id || course.id

          return (
            <motion.div
              key={courseId}
              whileHover={{ y: -3 }}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-2xl shrink-0 shadow-sm">
                      {course.icon || '📚'}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-400 block mb-0.5">
                        {course.category || 'Specialization'}
                      </span>
                      <h4 className="font-sora text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                        {course.title || course.name}
                      </h4>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 shrink-0">
                    {course.difficulty || 'Intermediate'}
                  </span>
                </div>

                <div className="mt-4 mb-4">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-500">Progress</span>
                    <span className="text-purple-600 font-bold">{progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {item.lastStudiedAt ? new Date(item.lastStudiedAt).toLocaleDateString() : 'Recently'}
                  </span>
                  <span className="font-medium text-slate-600">
                    ⏱️ {course.estimatedHours || '12 hrs'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onContinue && onContinue(courseId)}
                className="w-full h-10 rounded-xl bg-slate-900 hover:bg-purple-600 text-white font-sora font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm group-hover:shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Continue Learning</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
