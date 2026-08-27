import React from 'react'
import { Award, ShieldCheck, Copy, Check, ExternalLink, Sparkles } from 'lucide-react'

export default function CourseCertificatesSection({
  certificates = [],
  loading = false,
  onCopyId,
  onExplore
}) {
  const [copiedId, setCopiedId] = React.useState(null)

  const handleCopy = (id) => {
    setCopiedId(id)
    if (onCopyId) onCopyId(id)
    setTimeout(() => setCopiedId(null), 2500)
  }

  if (certificates.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mx-auto mb-4 shadow-sm">
          <Award className="w-8 h-8 stroke-[2]" />
        </div>
        <h3 className="font-sora text-lg font-extrabold text-slate-900 mb-2">No Certificates Issued Yet</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
          Complete 100% of all required modules, practice quizzes, and AI projects in any course specialization to earn your verified digital credential.
        </p>
        <button
          onClick={onExplore}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-sora font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
        >
          Explore Course Specializations
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
        <div>
          <h2 className="font-sora text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Verified Specialization Certificates</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Shareable digital credentials backed by ZenScore AI Academy.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((cert) => {
          const certId = cert.certificateId || cert.id || `ZS-${cert._id}`
          const isCopied = copiedId === certId

          return (
            <div key={certId} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden group">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold text-xl shrink-0">
                  🏆
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Credential
                </span>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block mb-1">
                ZenScore Academy
              </span>
              <h3 className="font-sora text-base font-extrabold text-slate-900 mb-2">
                {cert.title || cert.courseName || 'Course Specialization Mastery'}
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Issued on {cert.earnedAt ? new Date(cert.earnedAt).toLocaleDateString() : 'Recently'}
              </p>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="font-mono text-[11px] text-slate-600 font-semibold">{certId}</span>
                <button
                  onClick={() => handleCopy(certId)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied' : 'Copy Verification ID'}</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
