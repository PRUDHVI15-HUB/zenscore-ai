import React from 'react'
import { motion } from 'framer-motion'
import { Award, Eye, Download, Share2, ShieldCheck, Clock } from 'lucide-react'

/**
 * CertificateCard Component
 * Individual Certificate Card with Preview, Download, and Share action buttons.
 *
 * Props:
 * - certificate: CertificateItem object
 * - onPreview: function(certificate)
 * - onDownload: function(certificate)
 * - onShare: function(certificate)
 */

export default React.memo(function CertificateCard({
  certificate,
  onPreview,
  onDownload,
  onShare,
  onCopyId
}) {
  if (!certificate) return null

  const {
    certificateId = 'ZSC-2026-8849',
    title = 'Full Stack Web Development',
    skillName = 'Web Development',
    issueDate = 'July 28, 2026',
    issuedBy = 'ZenScore AI Academy',
    score = 94,
    status = 'Completed',
    downloadable = true,
    shareable = true
  } = certificate

  const isCompleted = status === 'Completed'
  const isInProgress = status === 'In Progress'
  const isExpired = status === 'Expired'

  const statusBadgeStyles = {
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    'In Progress': 'bg-purple-50 text-purple-700 border-purple-200/60',
    Expired: 'bg-rose-50 text-rose-700 border-rose-200/60'
  }
  const badgeStyle = statusBadgeStyles[status] || 'bg-slate-50 text-slate-700 border-slate-200'

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 12px 28px -5px rgba(15, 23, 42, 0.08)' }}
      transition={{ duration: 0.2 }}
      style={{ background: 'var(--bg-soft, #FFFFFF)', borderColor: 'var(--border, #E2E8F0)' }}
      className="rounded-2xl p-6 border shadow-sm flex flex-col justify-between h-full transition-all group"
    >
      <div>
        {/* Top Header Row: Icon & Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div style={{ background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }} className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
            <Award className="w-6 h-6 stroke-[2]" />
          </div>

          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badgeStyle} flex-shrink-0`}>
            {status === 'Completed' ? 'Verified ✓' : status}
          </span>
        </div>

        {/* Certificate Title & Skill Name */}
        <span className="text-[11px] font-semibold text-purple-600 uppercase tracking-wider block mb-1">
          {skillName}
        </span>
        <h3 style={{ color: 'var(--text-dark, #0F172A)' }} className="font-sora text-base font-bold group-hover:text-purple-600 transition-colors mb-3 leading-snug">
          {title}
        </h3>

        {/* Certificate Meta Box */}
        <div style={{ background: 'var(--bg, #F8FAFC)', borderColor: 'var(--border, #E2E8F0)', color: 'var(--text-muted, #64748B)' }} className="space-y-1.5 py-3 px-3.5 rounded-xl border mb-5 text-xs">
          <div className="flex items-center justify-between">
            <span>Certificate ID:</span>
            <button
              type="button"
              onClick={() => onCopyId && onCopyId(certificateId)}
              className="font-mono font-bold text-slate-800 hover:text-purple-600 cursor-pointer transition-colors"
              title="Click to copy verification ID"
            >
              {certificateId}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span>Issued Date:</span>
            <span className="font-semibold text-slate-800">{issueDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Issued By:</span>
            <span className="font-semibold text-slate-800">{issuedBy}</span>
          </div>
          {score && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 text-emerald-600 font-semibold">
              <span>Grade Score:</span>
              <span>{score}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onPreview && onPreview(certificate)}
          className="h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-sora font-semibold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview</span>
        </button>

        <button
          type="button"
          disabled={!isCompleted || downloadable === false}
          onClick={() => onDownload && onDownload(certificate)}
          className={`h-9 rounded-xl font-sora font-semibold text-xs transition-all flex items-center justify-center gap-1 ${
            isCompleted && downloadable !== false
              ? 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shadow-sm'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>PDF</span>
        </button>

        <button
          type="button"
          disabled={!isCompleted || shareable === false}
          onClick={() => onShare && onShare(certificate)}
          className={`h-9 rounded-xl font-sora font-semibold text-xs transition-all flex items-center justify-center gap-1 ${
            isCompleted && shareable !== false
              ? 'bg-slate-900 hover:bg-purple-600 text-white cursor-pointer shadow-sm'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>
    </motion.div>
  )
})
