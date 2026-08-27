import React, { useState, useMemo, useCallback } from 'react'
import CertificateGrid from './CertificateGrid'
import CertificatePreviewModal from './CertificatePreviewModal'
import CertificateFilters from './CertificateFilters'
import CertificateSkeleton from './CertificateSkeleton'
import EmptyCertificates from './EmptyCertificates'
import ErrorCertificates from './ErrorCertificates'
import { Award, ShieldCheck, Share2, Calendar, Sparkles } from 'lucide-react'

/**
 * CertificatesSection Component
 * Master Certificates & Portfolio verification dashboard.
 *
 * Prepared for:
 * GET /api/v1/users/me/certificates
 * GET /api/v1/certificates/:id
 * GET /api/v1/certificates/:id/download
 *
 * Props:
 * - certificates: Array of CertificateItem objects
 * - summaryData: object
 * - loading: boolean
 * - error: boolean | string | null
 * - onDownload: function(certificate)
 * - onShare: function(certificate)
 * - onExplore: function()
 * - onRetry: function()
 */

export default function CertificatesSection({
  certificates = null,
  summaryData = null,
  userInfo = null,
  loading = false,
  error = null,
  onDownload,
  onShare,
  onCopyId,
  onExplore,
  onRetry
}) {
  const defaultCertificates = [
    {
      id: 'cert-1',
      certificateId: 'ZSC-2026-8849',
      title: 'React.js & Modern Web Architecture',
      skillName: 'Web Development',
      issueDate: 'July 28, 2026',
      issuedBy: 'ZenScore AI Academy',
      score: 94,
      status: 'Completed',
      downloadable: true,
      shareable: true
    },
    {
      id: 'cert-2',
      certificateId: 'ZSC-2026-7732',
      title: 'Python for Data Science & Analytics',
      skillName: 'Data Science',
      issueDate: 'June 15, 2026',
      issuedBy: 'ZenScore AI Academy',
      score: 88,
      status: 'Completed',
      downloadable: true,
      shareable: true
    }
  ]

  const itemsList = (Array.isArray(certificates) && certificates.length > 0) ? certificates : (certificates !== null ? certificates : defaultCertificates)

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortBy, setSortBy] = useState('Newest')

  // Preview Modal state
  const [previewCert, setPreviewCert] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenPreview = useCallback((cert) => {
    setPreviewCert({
      ...cert,
      recipientName: cert.recipientName || userInfo?.name || userInfo?.fullName || 'ZenScore Student'
    })
    setIsModalOpen(true)
  }, [userInfo])

  const handleClosePreview = useCallback(() => {
    setIsModalOpen(false)
    setPreviewCert(null)
  }, [])

  const handleDefaultDownload = useCallback((cert) => {
    if (onDownload) {
      onDownload(cert)
      return
    }
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      window.print()
      return
    }
    const certHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${cert.title || 'ZenScore AI Certificate'}</title>
          <style>
            @page { size: landscape; margin: 0; }
            body { font-family: 'Segoe UI', Roboto, sans-serif; background: #f8fafc; margin: 0; padding: 40px; display: flex; align-items: center; justify-content: center; min-height: 100vh; box-sizing: border-box; }
            .cert-card { background: #ffffff; border: 8px solid #6366f1; border-radius: 24px; padding: 60px 80px; text-align: center; max-width: 900px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.08); position: relative; }
            .badge { display: inline-block; background: #ecfdf5; color: #059669; font-weight: bold; padding: 6px 16px; border-radius: 999px; font-size: 14px; border: 1px solid #a7f3d0; margin-bottom: 24px; }
            .subtitle { font-size: 14px; color: #94a3b8; letter-spacing: 3px; font-weight: 800; text-transform: uppercase; margin-bottom: 8px; }
            .name { font-size: 38px; color: #0f172a; font-weight: 800; margin: 12px 0 20px; font-family: serif; }
            .desc { font-size: 16px; color: #64748b; line-height: 1.6; max-width: 650px; margin: 0 auto 20px; }
            .track { font-size: 26px; color: #6366f1; font-weight: 700; margin-bottom: 30px; }
            .meta-grid { display: flex; justify-content: space-around; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 18px 24px; margin: 30px auto; max-width: 600px; text-align: left; }
            .meta-item { display: flex; flex-direction: column; }
            .meta-label { font-size: 11px; color: #94a3b8; font-weight: 800; text-transform: uppercase; }
            .meta-val { font-size: 14px; color: #1e293b; font-weight: 700; margin-top: 4px; }
            .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
            .auth { font-size: 13px; color: #475569; text-align: left; font-weight: 600; }
            .logo { font-size: 22px; font-weight: 800; color: #6366f1; font-family: serif; font-style: italic; }
          </style>
        </head>
        <body>
          <div class="cert-card">
            <div class="badge">Official Verified Credential ✓</div>
            <div class="subtitle">This is proudly presented to</div>
            <div class="name">${cert.recipientName || userInfo?.name || userInfo?.fullName || 'Student Ecosystem Learner'}</div>
            <div class="desc">For demonstrated mastery, hands-on architectural design, and completion of all rigorous curriculum phases in</div>
            <div class="track">${cert.title || cert.skillName}</div>
            <div class="meta-grid">
              <div class="meta-item">
                <span class="meta-label">Issue Date</span>
                <span class="meta-val">${cert.issueDate || 'Verified'}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Certificate ID</span>
                <span class="meta-val" style="color: #6366f1; font-family: monospace;">${cert.certificateId}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Mastery Score</span>
                <span class="meta-val" style="color: #059669;">${cert.score || 95}% Distinction</span>
              </div>
            </div>
            <div class="footer">
              <div class="auth">
                <strong>${cert.issuedBy || 'ZenScore AI Academy'}</strong><br/>
                <span style="font-size: 11px; color: #94a3b8;">Industry-Recognized Technology Accreditation</span>
              </div>
              <div class="logo">ZenScore AI</div>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `
    printWindow.document.write(certHtml)
    printWindow.document.close()
  }, [onDownload, userInfo])

  const handleDefaultShare = useCallback((cert) => {
    if (onShare) {
      onShare(cert)
      return
    }
    if (navigator.share) {
      navigator.share({
        title: cert.title,
        text: `I just earned my official ${cert.title} certificate on ZenScore AI! Certificate ID: ${cert.certificateId}`,
        url: window.location.origin + `/skills?tab=certifications&cert=${cert.certificateId}`
      }).catch(() => null)
    } else {
      navigator.clipboard?.writeText?.(
        `I just earned my official ${cert.title} certificate on ZenScore AI! Verification ID: ${cert.certificateId}`
      )
      if (onCopyId) onCopyId(cert.certificateId)
    }
  }, [onShare, onCopyId])

  // Derived Summary Metrics from Props or computed list
  const metrics = useMemo(() => {
    if (summaryData) return summaryData

    const completed = itemsList.filter((c) => c.status === 'Completed')
    const skillsCount = new Set(completed.map((c) => c.skillName)).size
    const latestDate = completed.length > 0 ? completed[0].issueDate : 'None'

    return {
      earned: completed.length,
      skillsCertified: skillsCount,
      latestDate: latestDate,
      shareable: completed.filter((c) => c.shareable !== false).length
    }
  }, [summaryData, itemsList])

  // Filter & Sort Logic
  const filteredCertificates = useMemo(() => {
    if (!Array.isArray(itemsList)) return []

    return itemsList
      .filter((cert) => {
        // Status filter
        if (statusFilter !== 'All' && cert.status !== statusFilter) {
          return false
        }
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim()
          const titleMatch = cert.title?.toLowerCase().includes(q)
          const skillMatch = cert.skillName?.toLowerCase().includes(q)
          const idMatch = cert.certificateId?.toLowerCase().includes(q)
          return titleMatch || skillMatch || idMatch
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'Alphabetical') {
          return a.title.localeCompare(b.title)
        }
        if (sortBy === 'Oldest') {
          return a.id.localeCompare(b.id)
        }
        // Default: Newest
        return b.id.localeCompare(a.id)
      })
  }, [itemsList, statusFilter, searchQuery, sortBy])

  // 1. Loading State
  if (loading) {
    return <CertificateSkeleton />
  }

  // 2. Error State
  if (error) {
    return (
      <ErrorCertificates
        onRetry={onRetry}
        message={typeof error === 'string' ? error : 'Unable to load certificates.'}
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h2 className="font-sora text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-5.5 h-5.5 text-purple-600" />
            <span>My Verified Certificates</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Download, preview, and share your official industry-recognized course completion certificates.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/60 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          {metrics.earned} Certificates Earned
        </span>
      </div>

      {/* Section 1: Summary Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderColor: 'var(--border, #E2E8F0)' }} className="rounded-2xl p-6 border shadow-sm flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-2">
            <span style={{ color: 'var(--text-muted, #94A3B8)' }} className="text-xs font-bold uppercase tracking-wider">
              Certificates Earned
            </span>
            <div style={{ background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }} className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
              <Award className="w-5 h-5 stroke-[2]" />
            </div>
          </div>
          <span style={{ color: 'var(--text-dark, #0F172A)' }} className="font-sora text-3xl font-extrabold my-1">
            {metrics.earned}
          </span>
          <span className="text-xs text-purple-600 font-semibold">Verified Credentials</span>
        </div>

        <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderColor: 'var(--border, #E2E8F0)' }} className="rounded-2xl p-6 border shadow-sm flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-2">
            <span style={{ color: 'var(--text-muted, #94A3B8)' }} className="text-xs font-bold uppercase tracking-wider">
              Skills Certified
            </span>
            <div style={{ background: 'rgba(5, 150, 105, 0.12)', color: '#059669' }} className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5 stroke-[2]" />
            </div>
          </div>
          <span style={{ color: 'var(--text-dark, #0F172A)' }} className="font-sora text-3xl font-extrabold my-1">
            {metrics.skillsCertified}
          </span>
          <span className="text-xs text-emerald-600 font-semibold">Skill Domains</span>
        </div>

        <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderColor: 'var(--border, #E2E8F0)' }} className="rounded-2xl p-6 border shadow-sm flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-2">
            <span style={{ color: 'var(--text-muted, #94A3B8)' }} className="text-xs font-bold uppercase tracking-wider">
              Latest Certificate
            </span>
            <div style={{ background: 'rgba(37, 99, 235, 0.12)', color: '#2563EB' }} className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
              <Calendar className="w-5 h-5 stroke-[2]" />
            </div>
          </div>
          <span style={{ color: 'var(--text-dark, #0F172A)' }} className="font-sora text-lg font-bold my-1 truncate">
            {metrics.latestDate}
          </span>
          <span className="text-xs text-blue-600 font-semibold">Most Recent</span>
        </div>

        <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderColor: 'var(--border, #E2E8F0)' }} className="rounded-2xl p-6 border shadow-sm flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-2">
            <span style={{ color: 'var(--text-muted, #94A3B8)' }} className="text-xs font-bold uppercase tracking-wider">
              Shareable Links
            </span>
            <div style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#6366F1' }} className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
              <Share2 className="w-5 h-5 stroke-[2]" />
            </div>
          </div>
          <span className="font-sora text-3xl font-extrabold text-slate-900 my-1">
            {metrics.shareable}
          </span>
          <span className="text-xs text-indigo-600 font-semibold">LinkedIn / Portfolio Ready</span>
        </div>
      </div>

      {/* Section 2: Search & Filters */}
      <CertificateFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {/* Section 3: Certificate Grid or Empty State */}
      {filteredCertificates.length === 0 ? (
        <EmptyCertificates onExplore={onExplore} />
      ) : (
        <CertificateGrid
          certificates={filteredCertificates}
          onPreview={handleOpenPreview}
          onDownload={handleDefaultDownload}
          onShare={handleDefaultShare}
          onCopyId={onCopyId}
        />
      )}

      {/* Section 4: Certificate Preview Modal */}
      <CertificatePreviewModal
        certificate={previewCert}
        isOpen={isModalOpen}
        onClose={handleClosePreview}
        onDownload={handleDefaultDownload}
        onShare={handleDefaultShare}
      />
    </div>
  )
}
