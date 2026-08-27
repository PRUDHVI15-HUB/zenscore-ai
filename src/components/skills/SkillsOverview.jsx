import React from 'react'
import { motion } from 'framer-motion'
import { Rocket, CheckCircle2, Clock, Award, ArrowUpRight, AlertCircle } from 'lucide-react'

/**
 * SkillsOverview Component
 *
 * Displays a 4-card overview of student learning progress directly below the Hero section.
 *
 * Props:
 * - stats: Object containing overview metrics
 *     - startedCount: number
 *     - completedCount: number
 *     - weeklyHours: number
 *     - weeklyTarget: number
 *     - certificatesCount: number
 *     - startedTrend: string
 *     - completedTrend: string
 * - loading: boolean
 * - error: boolean | string | null
 * - onViewCertificates: function (callback when "View Certificates" clicked)
 */
export default function SkillsOverview({
  stats = null,
  loading = false,
  error = null,
  onViewCertificates
}) {
  // Sensible fallback placeholders if stats prop is not provided or empty
  const defaultStats = {
    startedCount: 4,
    completedCount: 2,
    weeklyHours: 6,
    weeklyTarget: 10,
    certificatesCount: 1,
    startedTrend: '+2 this month',
    completedTrend: '50% completion rate'
  }

  const currentStats = stats ? { ...defaultStats, ...stats } : defaultStats

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
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
      <div className="container mx-auto px-6 mt-6 mb-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm animate-pulse flex flex-col justify-between h-36"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-slate-200 rounded" />
                  <div className="h-7 w-16 bg-slate-200 rounded-md" />
                </div>
                <div className="w-11 h-11 rounded-full bg-slate-200" />
              </div>
              <div className="h-3 w-32 bg-slate-150 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 2. Error State
  if (error) {
    const errorMsg = typeof error === 'string' ? error : 'Unable to load skills overview metrics.'
    return (
      <div className="container mx-auto px-6 mt-6 mb-2">
        <div className="bg-rose-50 border border-rose-200/80 text-rose-800 rounded-2xl p-4 flex items-center justify-between gap-3 text-sm">
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

  // Calculate goal percentage for card 3
  const weeklyHours = currentStats.weeklyHours ?? 0
  const weeklyTarget = currentStats.weeklyTarget || 10
  const goalPercentage = Math.min(Math.round((weeklyHours / weeklyTarget) * 100), 100)

  // 3. Success / Default State (4 Overview Cards)
  return (
    <div className="container mx-auto px-6 my-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* CARD 1: Skills Started */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, boxShadow: '0 12px 28px -5px rgba(15, 23, 42, 0.08)' }}
          transition={{ duration: 0.2 }}
          style={{ background: 'var(--bg-soft, #FFFFFF)', borderColor: 'var(--border, #E2E8F0)' }}
          className="rounded-2xl p-6 border shadow-sm flex flex-col justify-between h-40 transition-all"
        >
          <div className="flex items-start justify-between">
            <div>
              <span style={{ color: 'var(--text-muted, #94A3B8)' }} className="text-[11px] font-bold uppercase tracking-wider block mb-1.5">
                Skills Started
              </span>
              <div style={{ color: 'var(--text-dark, #0F172A)' }} className="font-sora text-3xl font-extrabold tracking-tight">
                {currentStats.startedCount !== undefined ? currentStats.startedCount : '--'}
              </div>
            </div>
            <div style={{ background: 'rgba(37, 99, 235, 0.12)', color: '#2563EB' }} className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <Rocket className="w-5.5 h-5.5 stroke-[2.2]" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <span style={{ background: 'rgba(37, 99, 235, 0.12)', color: '#2563EB' }} className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full">
              {currentStats.startedTrend || 'Active learning'}
            </span>
          </div>
        </motion.div>

        {/* CARD 2: Skills Completed */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, boxShadow: '0 12px 28px -5px rgba(15, 23, 42, 0.08)' }}
          transition={{ duration: 0.2 }}
          style={{ background: 'var(--bg-soft, #FFFFFF)', borderColor: 'var(--border, #E2E8F0)' }}
          className="rounded-2xl p-6 border shadow-sm flex flex-col justify-between h-40 transition-all"
        >
          <div className="flex items-start justify-between">
            <div>
              <span style={{ color: 'var(--text-muted, #94A3B8)' }} className="text-[11px] font-bold uppercase tracking-wider block mb-1.5">
                Skills Completed
              </span>
              <div style={{ color: 'var(--text-dark, #0F172A)' }} className="font-sora text-3xl font-extrabold tracking-tight">
                {currentStats.completedCount !== undefined ? currentStats.completedCount : '--'}
              </div>
            </div>
            <div style={{ background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }} className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5.5 h-5.5 stroke-[2.2]" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <span style={{ background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }} className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full">
              {currentStats.completedTrend || 'Mastered'}
            </span>
          </div>
        </motion.div>

        {/* CARD 3: Weekly Learning Goal */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, boxShadow: '0 12px 28px -5px rgba(15, 23, 42, 0.08)' }}
          transition={{ duration: 0.2 }}
          style={{ background: 'var(--bg-soft, #FFFFFF)', borderColor: 'var(--border, #E2E8F0)' }}
          className="rounded-2xl p-6 border shadow-sm flex flex-col justify-between h-40 transition-all"
        >
          <div className="flex items-start justify-between">
            <div>
              <span style={{ color: 'var(--text-muted, #94A3B8)' }} className="text-[11px] font-bold uppercase tracking-wider block mb-1.5">
                Weekly Goal
              </span>
              <div style={{ color: 'var(--text-dark, #0F172A)' }} className="font-sora text-3xl font-extrabold tracking-tight">
                {weeklyHours} <span style={{ color: 'var(--text-muted, #94A3B8)' }} className="text-sm font-semibold">/ {weeklyTarget} hrs</span>
              </div>
            </div>
            <div style={{ background: 'rgba(217, 119, 6, 0.12)', color: '#D97706' }} className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-5.5 h-5.5 stroke-[2.2]" />
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-auto space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium" style={{ color: 'var(--text-muted, #64748B)' }}>
              <span>Progress</span>
              <span className="font-bold text-amber-600">{goalPercentage}%</span>
            </div>
            <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'var(--border, #E2E8F0)' }}>
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${goalPercentage}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* CARD 4: Certificates Earned */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, boxShadow: '0 12px 28px -5px rgba(15, 23, 42, 0.08)' }}
          transition={{ duration: 0.2 }}
          style={{ background: 'var(--bg-soft, #FFFFFF)', borderColor: 'var(--border, #E2E8F0)' }}
          className="rounded-2xl p-6 border shadow-sm flex flex-col justify-between h-40 transition-all"
        >
          <div className="flex items-start justify-between">
            <div>
              <span style={{ color: 'var(--text-muted, #94A3B8)' }} className="text-[11px] font-bold uppercase tracking-wider block mb-1.5">
                Certificates
              </span>
              <div style={{ color: 'var(--text-dark, #0F172A)' }} className="font-sora text-3xl font-extrabold tracking-tight">
                {currentStats.certificatesCount !== undefined ? currentStats.certificatesCount : '--'}
              </div>
            </div>
            <div style={{ background: 'rgba(5, 150, 105, 0.12)', color: '#059669' }} className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <Award className="w-5.5 h-5.5 stroke-[2.2]" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <button
              onClick={() => onViewCertificates && onViewCertificates()}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors group cursor-pointer"
            >
              <span>View Certificates</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
