import React from 'react'
import { motion } from 'framer-motion'
import { Clock, BookOpen, FolderGit2, Play, CheckCircle2, Star } from 'lucide-react'
import SkillIcon from '../SkillIcon'

/**
 * SkillCard Component
 * Individual Skill Card displaying metadata, progress bar, difficulty badge, and CTA button.
 *
 * Props:
 * - skill: Skill object
 * - onClick: function(skill)
 */

export default React.memo(function SkillCard({ skill, onClick }) {
  if (!skill) return null

  const {
    title,
    category,
    difficulty = 'Beginner',
    shortDescription,
    thumbnail,
    icon = '🌐',
    durationWeeks = 4,
    lessons = 12,
    projects = 3,
    progress = 0,
    completed = false,
    recommended = false,
    color = '#EFF6FF',
    accent = '#2563EB'
  } = skill

  // Difficulty badge colors
  const difficultyStyles = {
    Beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    Intermediate: 'bg-blue-50 text-blue-700 border-blue-200/60',
    Advanced: 'bg-purple-50 text-purple-700 border-purple-200/60'
  }
  const diffBadgeStyle = difficultyStyles[difficulty] || 'bg-slate-50 text-slate-700 border-slate-200'

  const isCompleted = completed || progress === 100

  const handleCardClick = () => {
    if (onClick) {
      onClick(skill)
    }
  }

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 16px 32px -8px rgba(15, 23, 42, 0.12)' }}
      transition={{ duration: 0.2 }}
      style={{ background: 'var(--bg-soft, #FFFFFF)', borderColor: 'var(--border, #E2E8F0)' }}
      className="rounded-2xl p-6 border shadow-sm flex flex-col justify-between h-full transition-all group border-hover"
    >
      <div>
        {/* Top Header Row: Thumbnail/Icon + Difficulty Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={title}
                className="w-12 h-12 rounded-xl object-cover shadow-sm flex-shrink-0"
              />
            ) : (
              <SkillIcon name={title} category={category} icon={icon} size="md" />
            )}
            <div>
              <span className="text-[11.5px] font-semibold text-purple-600 uppercase tracking-wider block">
                {category}
              </span>
              {recommended && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 mt-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Recommended
                </span>
              )}
            </div>
          </div>

          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${diffBadgeStyle} flex-shrink-0`}>
            {difficulty}
          </span>
        </div>

        {/* Middle Section: Title & Short Description */}
        <h3 style={{ color: 'var(--text-dark, #0F172A)' }} className="font-sora text-base font-bold group-hover:text-purple-600 transition-colors mb-1.5 leading-snug">
          {title}
        </h3>
        <p style={{ color: 'var(--text-muted, #64748B)' }} className="text-xs line-clamp-2 leading-relaxed mb-4">
          {shortDescription || 'Master key principles and build hands-on projects with industry-aligned roadmaps.'}
        </p>

        {/* Information Row: Duration, Lessons, Projects */}
        <div style={{ background: 'var(--bg, #F8FAFC)', borderColor: 'var(--border, #E2E8F0)', color: 'var(--text-mid, #475569)' }} className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl border mb-4 text-xs">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate font-medium">{durationWeeks} wks</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-hidden">
            <BookOpen className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate font-medium">{lessons} lessons</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-hidden">
            <FolderGit2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate font-medium">{projects} proj</span>
          </div>
        </div>

        {/* Progress Bar (Only when progress > 0) */}
        {progress > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-500">Progress</span>
              <span className="text-purple-600 font-bold">{progress}% Complete</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA Button */}
      <div className="mt-2">
        {isCompleted ? (
          <button
            type="button"
            onClick={handleCardClick}
            className="w-full h-10 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 font-sora font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Completed ✓</span>
          </button>
        ) : progress > 0 ? (
          <button
            type="button"
            onClick={handleCardClick}
            className="w-full h-10 rounded-xl bg-slate-900 hover:bg-purple-600 text-white font-sora font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm group-hover:shadow-md"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Continue Learning</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCardClick}
            className="w-full h-10 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-sora font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-purple-600/20"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Learning</span>
          </button>
        )}
      </div>
    </motion.div>
  )
})
