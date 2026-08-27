import React, { useState } from 'react'
import { Award, ShieldCheck, Download, Eye, Upload, FileUp, Sparkles, X } from 'lucide-react'

export default function TabCertificates({ certificates = [], onUploadCertificate }) {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [certTitle, setCertTitle] = useState('')
  const [certIssuer, setCertIssuer] = useState('')
  const [certDate, setCertDate] = useState('')
  const [certId, setCertId] = useState('')

  const defaultCertificates = certificates.length > 0 ? certificates : [
    {
      id: 1,
      title: 'Full Stack Web Architecture',
      issuer: 'ZenScore AI Certification',
      issueDate: 'July 2026',
      credentialId: 'ZS-CERT-88492',
      verificationStatus: 'Verified',
      type: 'ZenScore'
    },
    {
      id: 2,
      title: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      issueDate: 'May 2026',
      credentialId: 'AWS-992014-SA',
      verificationStatus: 'Verified',
      type: 'External'
    },
    {
      id: 3,
      title: 'Deep Learning & Neural Networks',
      issuer: 'Coursera / DeepLearning.AI',
      issueDate: 'March 2026',
      credentialId: 'COURSERA-DL-7729',
      verificationStatus: 'Verified',
      type: 'External'
    }
  ]

  const handleUploadSubmit = (e) => {
    e.preventDefault()
    if (!certTitle.trim()) return
    onUploadCertificate && onUploadCertificate({
      id: Date.now(),
      title: certTitle.trim(),
      issuer: certIssuer.trim() || 'Self Uploaded',
      issueDate: certDate || 'Aug 2026',
      credentialId: certId || `CERT-${Math.floor(Math.random()*90000+10000)}`,
      verificationStatus: 'Pending Verification',
      type: 'External'
    })
    setCertTitle('')
    setCertIssuer('')
    setCertDate('')
    setCertId('')
    setShowUploadModal(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
            Verified Certificates & Credentials
          </h3>
          <p style={{ fontSize: 13, color: '#64748B' }}>
            Earned ZenScore platform credentials and uploaded external industry certifications.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          style={{
            padding: '10px 18px',
            borderRadius: 12,
            background: '#6366F1',
            color: '#FFFFFF',
            border: 'none',
            fontFamily: 'Sora, sans-serif',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
          }}
        >
          <Upload size={16} />
          <span>Upload Certificate</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
        {defaultCertificates.map((cert) => (
          <div
            key={cert.id}
            style={{
              background: '#FFFFFF',
              border: cert.type === 'ZenScore' ? '1.5px solid #C7D2FE' : '1px solid #E2E8F0',
              borderRadius: 18,
              padding: '20px 22px',
              boxShadow: cert.type === 'ZenScore' ? '0 4px 20px rgba(99, 102, 241, 0.08)' : '0 2px 10px rgba(15, 23, 42, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 16,
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    padding: '3px 10px',
                    borderRadius: 20,
                    background: cert.type === 'ZenScore' ? '#EEF2FF' : '#F1F5F9',
                    color: cert.type === 'ZenScore' ? '#4338CA' : '#475569',
                    border: cert.type === 'ZenScore' ? '1px solid #C7D2FE' : '1px solid #CBD5E1'
                  }}
                >
                  {cert.type} Certificate
                </span>

                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 11,
                    fontWeight: 700,
                    color: cert.verificationStatus === 'Verified' ? '#059669' : '#D97706'
                  }}
                >
                  <ShieldCheck size={13} /> {cert.verificationStatus}
                </span>
              </div>

              <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#0F172A', marginTop: 4 }}>
                {cert.title}
              </h4>

              <div style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>
                Issued by <strong style={{ color: '#0F172A' }}>{cert.issuer}</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11.5, color: '#64748B', marginTop: 4 }}>
                <span>Issued: <strong>{cert.issueDate}</strong></span>
                <span>ID: <code style={{ background: '#F8FAFC', padding: '2px 6px', borderRadius: 4, color: '#475569' }}>{cert.credentialId}</code></span>
              </div>
            </div>

            {/* Action Buttons: View & Download */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderTop: '1px solid #F1F5F9', paddingTop: 14 }}>
              <button
                onClick={() => alert(`Viewing certificate: ${cert.title}`)}
                style={{
                  flex: 1,
                  height: 36,
                  borderRadius: 10,
                  border: '1px solid #E2E8F0',
                  background: '#F8FAFC',
                  color: '#334155',
                  fontFamily: 'Sora, sans-serif',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                <Eye size={14} /> View
              </button>
              <button
                onClick={() => alert(`Downloading certificate: ${cert.title}`)}
                style={{
                  flex: 1,
                  height: 36,
                  borderRadius: 10,
                  border: 'none',
                  background: '#4F46E5',
                  color: '#FFFFFF',
                  fontFamily: 'Sora, sans-serif',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                <Download size={14} /> Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Certificate Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-extrabold text-slate-800 font-sans">Upload External Certificate</h4>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>

            <form onSubmit={handleUploadSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Certificate Title</label>
                <input
                  type="text"
                  value={certTitle}
                  onChange={e => setCertTitle(e.target.value)}
                  placeholder="e.g. AWS Certified Developer"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Issuing Organization</label>
                <input
                  type="text"
                  value={certIssuer}
                  onChange={e => setCertIssuer(e.target.value)}
                  placeholder="e.g. Amazon Web Services, NPTEL, Coursera"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Issue Date</label>
                  <input
                    type="text"
                    value={certDate}
                    onChange={e => setCertDate(e.target.value)}
                    placeholder="e.g. August 2026"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Credential ID (Optional)</label>
                  <input
                    type="text"
                    value={certId}
                    onChange={e => setCertId(e.target.value)}
                    placeholder="e.g. AWS-99201"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50 flex flex-col items-center gap-1.5 cursor-pointer">
                <FileUp className="text-indigo-500" size={24} />
                <span className="text-xs font-bold text-slate-700">Choose PDF / Image File</span>
                <span className="text-[11px] text-slate-400">PDF, PNG, or JPG supported (Max 10MB)</span>
              </div>

              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md"
                >
                  Upload & Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
