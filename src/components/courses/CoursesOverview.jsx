import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, CheckCircle2, Clock, Award, TrendingUp } from 'lucide-react'

/**
 * CoursesOverview Component
 * 4-card overview metrics matching SkillsOverview style.
 */
export default function CoursesOverview({ stats = null }) {
  const data = stats || {
    startedCount: 0,
    completedCount: 0,
    weeklyHours: 0,
    weeklyTarget: 10,
    certificatesCount: 0,
    startedTrend: '0 active courses',
    completedTrend: '0% completion rate'
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* 1. Courses Started */}
      <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderColor: 'var(--border, #E2E8F0)' }} className="rounded-2xl p-6 border shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span style={{ color: 'var(--text-muted, #94A3B8)' }} className="text-xs font-bold uppercase tracking-wider">Courses Started</span>
          <div style={{ background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }} className="w-10 h-10 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 stroke-[2]" />
          </div>
        </div>
        <div className="my-2">
          <span style={{ color: 'var(--text-dark, #0F172A)' }} className="font-sora text-3xl font-extrabold">{data.startedCount}</span>
          <span style={{ color: 'var(--text-muted, #64748B)' }} className="text-xs ml-1 font-semibold">courses</span>
        </div>
        <div style={{ borderColor: 'var(--border, #E2E8F0)' }} className="pt-3 border-t flex items-center gap-1.5 text-xs text-purple-600 font-semibold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{data.startedTrend}</span>
        </div>
      </div>

      {/* 2. Courses Completed */}
      <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderColor: 'var(--border, #E2E8F0)' }} className="rounded-2xl p-6 border shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span style={{ color: 'var(--text-muted, #94A3B8)' }} className="text-xs font-bold uppercase tracking-wider">Courses Completed</span>
          <div style={{ background: 'rgba(5, 150, 105, 0.12)', color: '#059669' }} className="w-10 h-10 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 stroke-[2]" />
          </div>
        </div>
        <div className="my-2">
          <span style={{ color: 'var(--text-dark, #0F172A)' }} className="font-sora text-3xl font-extrabold">{data.completedCount}</span>
          <span style={{ color: 'var(--text-muted, #64748B)' }} className="text-xs ml-1 font-semibold">completed</span>
        </div>
        <div style={{ borderColor: 'var(--border, #E2E8F0)' }} className="pt-3 border-t flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
          <span>{data.completedTrend}</span>
        </div>
      </div>

      {/* 3. Weekly Hours */}
      <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderColor: 'var(--border, #E2E8F0)' }} className="rounded-2xl p-6 border shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span style={{ color: 'var(--text-muted, #94A3B8)' }} className="text-xs font-bold uppercase tracking-wider">Weekly Learning</span>
          <div style={{ background: 'rgba(217, 119, 6, 0.12)', color: '#D97706' }} className="w-10 h-10 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5 stroke-[2]" />
          </div>
        </div>
        <div className="my-2">
          <span style={{ color: 'var(--text-dark, #0F172A)' }} className="font-sora text-3xl font-extrabold">{data.weeklyHours}</span>
          <span style={{ color: 'var(--text-muted, #64748B)' }} className="text-xs ml-1 font-semibold">/ {data.weeklyTarget} hrs</span>
        </div>
        <div style={{ borderColor: 'var(--border, #E2E8F0)' }} className="pt-3 border-t flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
          <span>{Math.round((data.weeklyHours / (data.weeklyTarget || 1)) * 100)}% weekly target</span>
        </div>
      </div>

      {/* 4. Certificates Earned */}
      <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderColor: 'var(--border, #E2E8F0)' }} className="rounded-2xl p-6 border shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span style={{ color: 'var(--text-muted, #94A3B8)' }} className="text-xs font-bold uppercase tracking-wider">Certifications</span>
          <div style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#6366F1' }} className="w-10 h-10 rounded-xl flex items-center justify-center">
            <Award className="w-5 h-5 stroke-[2]" />
          </div>
        </div>
        <div className="my-2">
          <span style={{ color: 'var(--text-dark, #0F172A)' }} className="font-sora text-3xl font-extrabold">{data.certificatesCount}</span>
          <span style={{ color: 'var(--text-muted, #64748B)' }} className="text-xs ml-1 font-semibold">certificates</span>
        </div>
        <div style={{ borderColor: 'var(--border, #E2E8F0)' }} className="pt-3 border-t flex items-center gap-1.5 text-xs text-indigo-600 font-semibold">
          <span>Verifiable Credentials</span>
        </div>
      </div>
    </div>
  )
}
