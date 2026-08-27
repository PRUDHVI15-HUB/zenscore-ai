import React from 'react'
import { FileText, Sparkles, Upload, Download, Eye, CheckCircle2, Clock } from 'lucide-react'

export default function TabResume({ resumeData = {}, onUploadResume, onGenerateResume, onDownloadResume, onPreviewResume }) {
  const atsScore = resumeData.atsScore || 92
  const resumeStatus = resumeData.status || 'ATS Optimized & Verified'
  const lastUpdated = resumeData.lastUpdated || 'August 2, 2026'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
          Resume & ATS Optimization
        </h3>
        <p style={{ fontSize: 13, color: '#64748B' }}>
          Manage your master resume document, run AI ATS scoring, and generate tailored tech resumes.
        </p>
      </div>

      {/* Hero Resume Status Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
          border: '1.5px solid #C7D2FE',
          borderRadius: 20,
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Circular ATS Meter */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '4px solid #6366F1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.2)'
            }}
          >
            <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, color: '#4338CA', lineHeight: 1 }}>
              {atsScore}
            </span>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#64748B', uppercase: true }}>ATS SCORE</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 20, background: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={12} /> {resumeStatus}
              </span>
            </div>
            <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#1E1B4B' }}>
              Master Engineering Resume
            </h4>
            <div style={{ fontSize: 12, color: '#475569', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={13} /> Last Updated: <strong>{lastUpdated}</strong>
            </div>
          </div>
        </div>

        {/* 4 Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(130px, 1fr))', gap: 10 }}>
          <button
            onClick={onUploadResume}
            style={{
              height: 40,
              padding: '0 16px',
              borderRadius: 12,
              border: '1px solid #C7D2FE',
              background: '#FFFFFF',
              color: '#4338CA',
              fontFamily: 'Sora, sans-serif',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            <Upload size={14} /> Upload Resume
          </button>

          <button
            onClick={onGenerateResume}
            style={{
              height: 40,
              padding: '0 16px',
              borderRadius: 12,
              border: 'none',
              background: '#6366F1',
              color: '#FFFFFF',
              fontFamily: 'Sora, sans-serif',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
            }}
          >
            <Sparkles size={14} /> Generate AI Resume
          </button>

          <button
            onClick={onPreviewResume}
            style={{
              height: 40,
              padding: '0 16px',
              borderRadius: 12,
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#334155',
              fontFamily: 'Sora, sans-serif',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            <Eye size={14} /> Preview Resume
          </button>

          <button
            onClick={onDownloadResume}
            style={{
              height: 40,
              padding: '0 16px',
              borderRadius: 12,
              border: '1px solid #CBD5E1',
              background: '#F8FAFC',
              color: '#0F172A',
              fontFamily: 'Sora, sans-serif',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            <Download size={14} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  )
}
