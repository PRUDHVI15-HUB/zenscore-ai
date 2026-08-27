import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Share2, CheckCircle2, Award, ShieldCheck } from 'lucide-react'

/**
 * CertificatePreviewModal Component
 * Interactive portfolio-ready certificate preview modal.
 *
 * Props:
 * - certificate: CertificateItem object
 * - isOpen: boolean
 * - onClose: function()
 * - onDownload: function(certificate)
 * - onShare: function(certificate)
 */

export default React.memo(function CertificatePreviewModal({
  certificate,
  isOpen = false,
  onClose,
  onDownload,
  onShare
}) {
  if (!isOpen || !certificate) return null

  const {
    certificateId = 'ZSC-2026-8849',
    title = 'Full Stack Web Development Mastery',
    skillName = 'Web Development',
    issueDate = 'July 28, 2026',
    issuedBy = 'ZenScore AI Academy',
    recipientName = 'Student Ecosystem User',
    score = 94,
    status = 'Completed'
  } = certificate

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm">
        {/* Modal Backdrop click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        {/* Modal Content Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-2xl w-full overflow-hidden z-10"
        >
          {/* Top Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-2 text-purple-600">
              <Award className="w-5 h-5 stroke-[2.2]" />
              <span className="font-sora font-bold text-sm text-slate-900">
                Official Certificate Preview
              </span>
            </div>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Certificate Body Render */}
          <div className="p-8 text-center bg-gradient-to-b from-purple-50/40 via-white to-slate-50/50 border-b border-slate-100 relative">
            {/* Top Seal / Verified Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70 text-xs font-bold mb-4 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Certificate ✓</span>
            </div>

            {/* Title & Recipient */}
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">
              THIS IS PROUDLY PRESENTED TO
            </p>
            <h2 className="font-sora text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
              {recipientName}
            </h2>

            <p className="text-xs text-slate-500 max-w-md mx-auto mb-2">
              For successfully completing all roadmap modules, practical exercises, and final assessments in
            </p>
            <h3 className="font-sora text-lg sm:text-xl font-bold text-purple-600 mb-6">
              {title}
            </h3>

            {/* Score & Issuing Meta Box */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm max-w-lg mx-auto text-left mb-6">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  ISSUED DATE
                </span>
                <span className="text-xs font-bold text-slate-800">{issueDate}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  CERTIFICATE ID
                </span>
                <span className="text-xs font-mono font-bold text-purple-600">{certificateId}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  SCORE
                </span>
                <span className="text-xs font-bold text-emerald-600">{score ? `${score}% Distinction` : 'Pass'}</span>
              </div>
            </div>

            {/* Issuer Signature */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200/60 max-w-md mx-auto text-left text-xs text-slate-500">
              <div>
                <span className="font-bold text-slate-800 block">{issuedBy}</span>
                <span className="text-[11px]">Authorized Provider</span>
              </div>
              <div className="w-20 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-serif italic text-purple-600 font-bold border border-slate-200/60">
                ZenScore
              </div>
            </div>
          </div>

          {/* Modal Action Buttons Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 px-6 py-4 bg-white">
            <button
              onClick={() => onShare && onShare(certificate)}
              className="w-full sm:w-auto h-10 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-sora font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Certificate</span>
            </button>

            <button
              onClick={() => onDownload && onDownload(certificate)}
              className="w-full sm:w-auto h-10 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-sora font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-purple-600/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
})
