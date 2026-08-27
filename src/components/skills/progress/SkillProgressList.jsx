import React from 'react'
import { Play, ArrowRight, CheckCircle2, Clock, Layers } from 'lucide-react'
import SkillIcon from '../SkillIcon'

/**
 * SkillProgressList Component
 * Renders active skills list with progress bars, current module, and continuation action buttons.
 *
 * Props:
 * - skills: Array of ActiveSkillItem objects
 * - onContinueSkill: function(skill)
 */

export default React.memo(function SkillProgressList({ skills = [], onContinueSkill }) {
  const skillItems = Array.isArray(skills) ? skills : []

  if (skillItems.length === 0) {
    return (
      <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderColor: 'var(--border, #E2E8F0)' }} className="rounded-2xl p-8 border shadow-sm text-center">
        <div style={{ background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }} className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Layers className="w-6 h-6 stroke-[2]" />
        </div>
        <h4 style={{ color: 'var(--text-dark, #0F172A)' }} className="font-sora text-base font-bold mb-1">
          No Active Skills in Progress
        </h4>
        <p style={{ color: 'var(--text-muted, #64748B)' }} className="text-xs max-w-sm mx-auto">
          Enroll in any skill from the Explore tab to track your step-by-step progress and lesson milestones here.
        </p>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderColor: 'var(--border, #E2E8F0)' }} className="rounded-2xl p-6 sm:p-7 border shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div style={{ background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }} className="w-8 h-8 rounded-lg flex items-center justify-center">
            <Layers className="w-4.5 h-4.5 stroke-[2.2]" />
          </div>
          <h3 style={{ color: 'var(--text-dark, #0F172A)' }} className="font-sora text-lg font-bold">
            Active Skill Progress
          </h3>
        </div>
        <span style={{ color: 'var(--text-muted, #94A3B8)' }} className="text-xs font-semibold uppercase tracking-wider">
          {skillItems.length} In Progress
        </span>
      </div>

      <div className="space-y-4">
        {skillItems.map((skill) => (
          <div
            key={skill.id || skill.name}
            style={{ background: 'var(--bg, #F8FAFC)', borderColor: 'var(--border, #E2E8F0)' }}
            className="rounded-2xl p-5 border hover:border-purple-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
          >
            {/* Left: Icon & Skill Details */}
            <div className="flex items-center gap-3.5 min-w-[240px]">
              <SkillIcon name={skill.name} category={skill.category} icon={skill.icon} size="md" />
              <div>
                <span className="text-[11px] font-semibold text-purple-600 uppercase tracking-wider block">
                  {skill.category || 'General'}
                </span>
                <h4 className="font-sora text-base font-bold text-slate-900 leading-snug group-hover:text-purple-600 transition-colors">
                  {skill.name}
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  📍 {skill.currentModule}
                </p>
              </div>
            </div>

            {/* Middle: Progress Bar */}
            <div className="flex-1 max-w-xs w-full">
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-slate-500">Completion</span>
                <span className="text-purple-600 font-bold">{skill.progress}%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-200/70 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${skill.progress}%` }}
                />
              </div>
            </div>

            {/* Right: Continue Action Button */}
            <button
              type="button"
              onClick={() => onContinueSkill && onContinueSkill(skill)}
              className="h-10 px-5 rounded-xl bg-slate-900 hover:bg-purple-600 text-white font-sora font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm group-hover:shadow-md self-start md:self-auto flex-shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
})
