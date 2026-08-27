import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCareer } from '../../../context/CareerContext'
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Download,
  Trash2,
  RefreshCw,
  Eye,
  RotateCcw,
  Check,
  Zap,
  Target,
  Clock,
  Layers,
  FileCheck,
  X,
  FileUp,
  BookOpen,
  GraduationCap,
  Search,
  Sliders,
  CheckCircle,
  XCircle,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react'
import { calculateResumeATSMetadata } from '../../../services/resume/resumeATSMetadata'
import { useStudentProfile } from '../../../context/StudentProfileContext'
import { resolveCanonicalCareerGoal } from '../../../services/careers/careerNormalizer'
import { getSynchronizedResumeProfile } from '../../../services/resume/resumeSyncService'
import { triggerPDFExport } from '../../../services/resume/resumeExportEngine'
import { uploadResumeApi, getResumesApi, deleteResumeApi, matchJobDescriptionApi, createResumeDraftApi, getResumeDraftApi, updateResumeDraftApi, improveResumeSectionApi, finalizeResumeDraftApi, discardResumeDraftApi, getResumeVersionsApi } from '../../../services/resume/resumeApiService'
import { getPrioritizedSkillGaps } from '../../../services/resume/resumeCareerLearningResolver'
import ResumePreview from './ResumePreview'

export default function ResumeCenter({ selectedRole, onSelectCareerRole }) {
  const navigate = useNavigate()
  const career = useCareer()
  const studentProfileCtx = useStudentProfile()
  const activeTargetRole = resolveCanonicalCareerGoal(studentProfileCtx?.profile, career, selectedRole)

  const fileInputRef = useRef(null)

  // Upload Modal & Real API States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatusMsg, setUploadStatusMsg] = useState('')
  const [toastMsg, setToastMsg] = useState('')
  const [ocrWarning, setOcrWarning] = useState(null)

  // Job Description Matcher States
  const [jobDescText, setJobDescText] = useState('')
  const [isMatchingJob, setIsMatchingJob] = useState(false)
  const [jobMatchResult, setJobMatchResult] = useState(null)

  // Version Comparison Modal States
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false)
  const [compareResume, setCompareResume] = useState(null)

  // Phase 7 Resume Builder & Editor States
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [activeDraft, setActiveDraft] = useState(null)
  const [activeBuilderTab, setActiveBuilderTab] = useState('summary')
  const [aiSuggestion, setAiSuggestion] = useState(null)
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false)
  const [isFinalizing, setIsFinalizing] = useState(false)

  // Real Backend Resumes Array
  const [resumesList, setResumesList] = useState([])
  const [activeResume, setActiveResume] = useState(null)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)

  const triggerToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3500)
  }

  // Load real resume history from backend
  const loadResumeHistory = useCallback(async () => {
    setIsLoadingHistory(true)
    try {
      const list = await getResumesApi()
      setResumesList(list || [])

      if (list && list.length > 0) {
        const current = list.find(r => r.isCurrent) || list[0]
        setActiveResume(current)
      } else {
        setActiveResume(null)
      }
    } catch (err) {
      console.warn('[ResumeCenter] Failed to load resume history:', err?.message)
    } finally {
      setIsLoadingHistory(false)
    }
  }, [])

  useEffect(() => {
    loadResumeHistory()
  }, [loadResumeHistory])

  const [uploadError, setUploadError] = useState(null)

  // Handle real file upload to backend POST /api/resume/upload
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setOcrWarning(null)
    setUploadError(null)
    setUploadStatusMsg('Uploading resume to secure backend pipeline...')

    try {
      setUploadStatusMsg('Extracting resume content (PDF / DOCX)...')
      const res = await uploadResumeApi(file, activeTargetRole)

      if (res?.status === 'ocr_required' || res?.success === false && res?.message?.includes('scanned')) {
        setOcrWarning(res.message || 'This PDF appears to contain scanned/image-based content and requires OCR.')
        setUploadError(res.message || 'Scanned PDF detected.')
        triggerToast('⚠️ Scanned PDF detected: requires OCR.')
        setIsUploading(false)
        return
      }

      if (res?.success && res?.resume) {
        setUploadStatusMsg('Analyzing ATS & Career Match score...')
        await loadResumeHistory()
        triggerToast('📄 Resume parsed & analyzed successfully!')
        setIsUploadModalOpen(false)
      } else {
        const errMsg = res?.message || 'Failed to parse resume.'
        setUploadError(errMsg)
        triggerToast(`❌ ${errMsg}`)
      }
    } catch (err) {
      console.error('[ResumeCenter] Upload error:', err)
      const errMsg = err?.message || 'Error processing resume file.'
      setUploadError(errMsg)
      triggerToast(`❌ ${errMsg}`)
    } finally {
      setIsUploading(false)
      setUploadStatusMsg('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Handle real delete action
  const handleDeleteResume = async (id) => {
    const targetId = id || activeResume?._id
    if (!targetId) return

    try {
      const ok = await deleteResumeApi(targetId)
      if (ok) {
        triggerToast('🗑️ Resume deleted successfully.')
        await loadResumeHistory()
      } else {
        triggerToast('❌ Failed to delete resume.')
      }
    } catch (err) {
      triggerToast(`❌ ${err?.message || 'Error deleting resume.'}`)
    }
  }

  const handleJobMatch = async () => {
    if (!jobDescText || jobDescText.trim().length === 0) {
      triggerToast('⚠️ Please paste a job description first.')
      return
    }
    setIsMatchingJob(true)
    try {
      const result = await matchJobDescriptionApi(jobDescText, activeResume?._id, activeTargetRole)
      setJobMatchResult(result)
      triggerToast('🎯 Job Description Match completed!')
    } catch (err) {
      triggerToast(`❌ ${err?.message || 'Job match failed.'}`)
    } finally {
      setIsMatchingJob(false)
    }
  }

  const handleOpenCompare = (pastResume) => {
    setCompareResume(pastResume)
    setIsCompareModalOpen(true)
  }

  // Phase 7 Builder Handlers
  const handleOpenBuilder = async () => {
    if (!activeResume) {
      triggerToast('⚠️ Please upload a resume first to open the Resume Builder.')
      return
    }
    setIsBuilderOpen(true)
    try {
      let draft = await getResumeDraftApi(activeResume._id)
      if (!draft) {
        draft = await createResumeDraftApi(activeResume._id)
      }
      setActiveDraft(draft || activeResume)
    } catch (err) {
      console.warn('[ResumeCenter] Draft load notice:', err?.message)
      setActiveDraft(activeResume)
    }
  }

  const handleGenerateSuggestion = async (sectionKey) => {
    if (!activeDraft) return
    setIsGeneratingSuggestion(true)
    try {
      let content = ''
      if (sectionKey === 'summary') content = activeDraft.summary
      else if (sectionKey === 'skills') content = activeDraft.skills
      else if (sectionKey === 'experience') content = (activeDraft.experience?.[0]?.highlights || []).join(' ') || activeDraft.experience?.[0]?.role
      else if (sectionKey === 'projects') content = activeDraft.projects?.[0]?.description || activeDraft.projects?.[0]?.title

      const result = await improveResumeSectionApi(sectionKey, content, activeTargetRole)
      setAiSuggestion(result)
      triggerToast('💡 AI Improvement suggestion ready!')
    } catch (err) {
      triggerToast(`❌ ${err?.message || 'Failed to generate AI suggestion.'}`)
    } finally {
      setIsGeneratingSuggestion(false)
    }
  }

  const handleAcceptSuggestion = async () => {
    if (!aiSuggestion || !activeDraft) return
    const section = aiSuggestion.section
    const newText = aiSuggestion.improvedText

    const updated = { ...activeDraft }
    if (section === 'summary') updated.summary = newText
    else if (section === 'skills' && aiSuggestion.keywordsAdded) {
      const setSkills = new Set([...(updated.skills || []), ...aiSuggestion.keywordsAdded])
      updated.skills = Array.from(setSkills)
    } else if (section === 'bullet' || section === 'experience') {
      if (updated.experience?.[0]) {
        updated.experience[0].highlights = [newText, ...(updated.experience[0].highlights || []).slice(1)]
      }
    }

    setActiveDraft(updated)
    setAiSuggestion(null)
    triggerToast('✅ AI Suggestion applied to draft!')
    await updateResumeDraftApi(activeDraft._id, updated).catch(() => null)
  }

  const handleFinalizeDraft = async () => {
    if (!activeDraft?._id) return
    setIsFinalizing(true)
    try {
      const finalized = await finalizeResumeDraftApi(activeDraft._id, activeTargetRole)
      triggerToast('🎉 Resume ATS Optimized & Finalized as New Version!')
      setIsBuilderOpen(false)
      setActiveDraft(null)
      await loadResumeHistory()
    } catch (err) {
      triggerToast(`❌ ${err?.message || 'Failed to finalize version.'}`)
    } finally {
      setIsFinalizing(false)
    }
  }

  const handleDownloadPDF = () => {
    const sections = activeResume ? [
      { name: 'Summary', content: activeResume.summary },
      { name: 'Skills', content: (activeResume.skills || []).join(', ') },
      { name: 'Education', content: (activeResume.education || []).map(e => `${e.degree} - ${e.institution}`).join('\n') },
      { name: 'Experience', content: (activeResume.experience || []).map(e => `${e.title} at ${e.company}`).join('\n') }
    ] : []

    triggerPDFExport(sections, { name: activeResume?.candidate?.name || 'Modern Tech' }, activeResume?.analysis?.atsScore || 0)
    triggerToast('📄 Downloading PDF Resume...')
  }

  // Active Resume ATS metadata & Career Match
  const currentAtsScore = activeResume?.analysis?.atsScore || 0
  const currentCompleteness = activeResume?.analysis?.completeness || 0
  const currentCareerMatch = activeResume?.analysis?.careerMatch || null

  const prioritizedSkillGaps = useMemo(() => {
    const resumeSkills = activeResume?.skills || []
    const verifiedSkills = studentProfileCtx?.profile?.skillsSummary?.data?.verifiedSkills || []
    return getPrioritizedSkillGaps(resumeSkills, verifiedSkills, activeTargetRole)
  }, [activeResume, activeTargetRole, studentProfileCtx])

  const sectionScores = useMemo(() => {
    if (!activeResume) return []
    const scoringReasons = activeResume.analysis?.scoringReasons || []
    return [
      { section: 'Professional Summary', score: activeResume.summary ? 90 : 0, desc: activeResume.summary ? 'Professional summary verified.' : 'Summary missing.' },
      { section: 'Technical Skills', score: (activeResume.skills?.length || 0) >= 5 ? 90 : (activeResume.skills?.length || 0) * 15, desc: `${activeResume.skills?.length || 0} skills detected.` },
      { section: 'Projects', score: (activeResume.projects?.length || 0) > 0 ? 85 : 0, desc: `${activeResume.projects?.length || 0} project entries listed.` },
      { section: 'Work Experience', score: (activeResume.experience?.length || 0) > 0 ? 85 : 0, desc: `${activeResume.experience?.length || 0} experience entries listed.` },
      { section: 'Education', score: (activeResume.education?.length || 0) > 0 ? 90 : 0, desc: `${activeResume.education?.length || 0} education entries listed.` },
      { section: 'Career Match', score: currentCareerMatch?.matchScore || 0, desc: `Target: ${currentCareerMatch?.targetCareer || activeTargetRole}` }
    ]
  }, [activeResume, currentCareerMatch, activeTargetRole])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1140, margin: '0 auto', fontFamily: 'DM Sans, sans-serif' }}>

      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 99999,
          background: '#0F172A',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: 14,
          fontFamily: 'Sora, sans-serif',
          fontSize: 13,
          fontWeight: 700,
          boxShadow: '0 12px 30px rgba(0,0,0,0.2)'
        }}>
          {toastMsg}
        </div>
      )}

      {/* ── SECTION 1: HEADER ── */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 24,
        padding: '24px 28px',
        boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            background: '#F5F3FF',
            color: '#7C3AED',
            border: '1px solid #DDD6FE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            flexShrink: 0
          }}>
            📄
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.05em', color: '#7C3AED', textTransform: 'uppercase', background: '#F5F3FF', padding: '2px 8px', borderRadius: 6, width: 'fit-content' }}>
              RESUME & ATS WORKSPACE
            </span>
            <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.4px' }}>
              Resume Center
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <span style={{ fontSize: 12.5, color: '#64748B', fontWeight: 600 }}>Target Role:</span>
              <select
                value={activeTargetRole || selectedRole || 'Full Stack Developer'}
                onChange={async (e) => {
                  const newRole = e.target.value
                  if (onSelectCareerRole) onSelectCareerRole(newRole)
                  if (career?.selectCareerGoal) await career.selectCareerGoal(newRole)
                  else if (career?.selectCareerRole) await career.selectCareerRole(newRole)
                  if (studentProfileCtx?.updateSection) {
                    await studentProfileCtx.updateSection('careerProfile', { selectedCareerGoal: newRole }, 'Careers').catch(() => null)
                  }
                  triggerToast(`🎯 Target career updated to ${newRole}`)
                }}
                style={{
                  padding: '4px 10px',
                  fontSize: 12,
                  fontWeight: 800,
                  color: '#7C3AED',
                  background: '#F5F3FF',
                  border: '1px solid #DDD6FE',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontFamily: 'Sora, sans-serif',
                  outline: 'none'
                }}
              >
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Frontend Engineer">Frontend Engineer</option>
                <option value="Backend Engineer">Backend Engineer</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Mobile App Developer">Mobile App Developer</option>
                <option value="Game Developer">Game Developer</option>
                <option value="AI / ML Engineer">AI / ML Engineer</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            style={{
              padding: '10px 20px',
              fontSize: 13,
              fontWeight: 800,
              color: '#FFFFFF',
              background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.22)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'Sora, sans-serif'
            }}
          >
            <Upload size={15} />
            <span>Upload Resume</span>
          </button>

          <button
            onClick={handleOpenBuilder}
            style={{
              padding: '10px 20px',
              fontSize: 13,
              fontWeight: 800,
              color: '#7C3AED',
              background: '#F5F3FF',
              border: '1px solid #DDD6FE',
              borderRadius: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'Sora, sans-serif'
            }}
          >
            <Sparkles size={15} style={{ color: '#7C3AED' }} />
            <span>Resume Builder & AI Editor</span>
          </button>

          <button
            onClick={() => {
              const atsEl = document.getElementById('ats-analysis-section')
              if (atsEl) atsEl.scrollIntoView({ behavior: 'smooth' })
            }}
            style={{
              padding: '10px 18px',
              fontSize: 13,
              fontWeight: 800,
              color: '#334155',
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
              borderRadius: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'Sora, sans-serif'
            }}
          >
            <Sparkles size={15} style={{ color: '#7C3AED' }} />
            <span>Analyze Resume</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* OCR Warning Alert */}
      {ocrWarning && (
        <div style={{ padding: 16, borderRadius: 16, background: '#FFFBEB', border: '1px solid #FCD34D', color: '#B45309', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlertCircle size={18} />
          <span>{ocrWarning}</span>
        </div>
      )}

      {/* ── SECTION 2: RESUME SUMMARY (4 STAT CARDS) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {/* Card 1: Resume Status */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, padding: 20, boxShadow: '0 4px 20px rgba(15,23,42,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B', fontFamily: 'Sora, sans-serif' }}>Resume Status</span>
            <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 19, fontWeight: 800, color: activeResume ? '#059669' : '#D97706' }}>
              {activeResume ? 'Uploaded' : 'No File'}
            </span>
            <span style={{ fontSize: 11, color: '#94A3B8' }}>{activeResume ? 'Primary Active Resume' : 'Upload Required'}</span>
          </div>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: activeResume ? '#F0FDF4' : '#FFFBEB', color: activeResume ? '#059669' : '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileCheck size={20} />
          </div>
        </div>

        {/* Card 2: ATS Score */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, padding: 20, boxShadow: '0 4px 20px rgba(15,23,42,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B', fontFamily: 'Sora, sans-serif' }}>ATS Score</span>
            <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 800, color: activeResume ? '#4F46E5' : '#94A3B8' }}>
              {activeResume ? `${currentAtsScore}%` : '0%'}
            </span>
            <span style={{ fontSize: 11, color: '#94A3B8' }}>{activeResume ? 'Target Alignment Match' : 'Unstarted'}</span>
          </div>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={20} />
          </div>
        </div>

        {/* Card 3: Last Updated */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, padding: 20, boxShadow: '0 4px 20px rgba(15,23,42,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B', fontFamily: 'Sora, sans-serif' }}>Last Updated</span>
            <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 800, color: '#0F172A' }}>
              {activeResume?.uploadedAt ? new Date(activeResume.uploadedAt).toLocaleDateString() : 'Not Uploaded'}
            </span>
            <span style={{ fontSize: 11, color: '#94A3B8' }}>Latest Revision</span>
          </div>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: '#F8FAFC', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={20} />
          </div>
        </div>

        {/* Card 4: Resume Readiness */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, padding: 20, boxShadow: '0 4px 20px rgba(15,23,42,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B', fontFamily: 'Sora, sans-serif' }}>Resume Readiness</span>
            <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 800, color: activeResume ? '#7C3AED' : '#64748B' }}>
              {activeResume ? (currentAtsScore >= 80 ? 'Placement Ready' : 'Needs Optimization') : 'Pending Upload'}
            </span>
            <span style={{ fontSize: 11, color: '#94A3B8' }}>Recruiter Screening Grade</span>
          </div>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={20} />
          </div>
        </div>
      </div>

      {/* COMPACT ACTIVE RESUME STRIP (IF FILE EXISTS) */}
      {activeResume && (
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 20,
          padding: '16px 24px',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 14
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
              📄
            </div>
            <div>
              <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 14.5, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {activeResume.fileName}
              </h4>
              <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
                {activeResume.fileSize ? `${(activeResume.fileSize / 1024).toFixed(0)} KB` : 'PDF/DOCX'} • Uploaded {new Date(activeResume.uploadedAt).toLocaleDateString()} • ATS Score: <span style={{ color: '#059669', fontWeight: 800 }}>{currentAtsScore}%</span>
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              style={{ padding: '8px 16px', fontSize: 12.5, fontWeight: 800, color: '#334155', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Sora, sans-serif' }}
            >
              <RefreshCw size={13} />
              <span>Replace Resume</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              style={{ padding: '8px 16px', fontSize: 12.5, fontWeight: 800, color: '#7C3AED', background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Sora, sans-serif' }}
            >
              <Download size={13} />
              <span>Download PDF</span>
            </button>

            <button
              onClick={() => handleDeleteResume(activeResume._id)}
              style={{ padding: '8px 10px', fontSize: 12, color: '#EF4444', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Delete Resume"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── SECTION 3: ATS DETAILED SCORE BREAKDOWN ── */}
      <div id="ats-analysis-section" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 24, padding: 28, boxShadow: '0 4px 20px rgba(15,23,42,0.03)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* ATS Provider Header & Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                📊 ATS Score Breakdown ({activeTargetRole || 'Target Goal'})
              </h2>
              {activeResume?.analysis?.provider && (
                <span style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: 10,
                  background: activeResume.analysis.provider === 'external' ? '#F5F3FF' : '#F1F5F9',
                  color: activeResume.analysis.provider === 'external' ? '#7C3AED' : '#475569',
                  border: activeResume.analysis.provider === 'external' ? '1px solid #DDD6FE' : '1px solid #CBD5E1',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  {activeResume.analysis.provider === 'external' ? '⚡ External ATS Provider' : '🛠️ ZenScore Internal Engine'}
                </span>
              )}
            </div>
            <span style={{ fontSize: 12.5, color: '#64748B' }}>Recruiter screening algorithm compatibility criteria</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: activeResume ? '#4F46E5' : '#64748B', background: activeResume ? '#EEF2FF' : '#F1F5F9', padding: '6px 14px', borderRadius: 20, border: '1px solid #C7D2FE' }}>
              Overall Match: {activeResume ? `${currentAtsScore}%` : '0%'}
            </span>
          </div>
        </div>

        {/* Fallback Notice Alert */}
        {activeResume?.analysis?.fallbackNotice && (
          <div style={{ padding: '10px 16px', borderRadius: 12, background: '#FFFBEB', border: '1px solid #FCD34D', color: '#B45309', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={15} />
            <span>{activeResume.analysis.fallbackNotice}</span>
          </div>
        )}

        {/* Real Breakdown if file uploaded */}
        {activeResume ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            {sectionScores.map((sec, idx) => (
              <div key={idx} style={{ padding: 16, borderRadius: 16, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 13.5, fontWeight: 800, color: '#0F172A' }}>{sec.section}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: sec.score >= 80 ? '#059669' : '#D97706' }}>{sec.score}%</span>
                </div>
                <p style={{ fontSize: 12, color: '#64748B', margin: 0, lineHeight: 1.4 }}>{sec.desc}</p>
                <div style={{ width: '100%', height: 6, background: '#E2E8F0', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: `${sec.score}%`, height: '100%', background: sec.score >= 80 ? '#10B981' : '#F59E0B', borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ZERO START STATE (UNUPLOADED RESUME) */
          <div style={{ padding: '36px 24px', borderRadius: 20, background: '#F8FAFC', border: '1.5px dashed #CBD5E1', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: '#F5F3FF', color: '#7C3AED', border: '1px solid #DDD6FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileUp size={24} />
            </div>
            <div style={{ maxWidth: 460 }}>
              <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>
                No Resume Uploaded Yet
              </h4>
              <p style={{ fontSize: 13, color: '#64748B', margin: 0, lineHeight: 1.45 }}>
                Upload your resume (PDF, DOCX) to generate a real ATS readability score, section-by-section breakdown, and AI recommendations tailored for {activeTargetRole || 'your target role'}.
              </p>
            </div>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              style={{ padding: '10px 22px', fontSize: 13, fontWeight: 800, color: '#FFFFFF', background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)', border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: 'Sora, sans-serif', boxShadow: '0 4px 14px rgba(124, 58, 237, 0.25)' }}
            >
              Upload Your Resume Now →
            </button>
          </div>
        )}
      </div>

      {/* ── SECTION 3.5: CAREER SKILL GAPS & DIRECT ROADMAP LEARNING ── */}
      {activeResume && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 24, padding: 24, boxShadow: '0 4px 20px rgba(15,23,42,0.03)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                🎯 Target Career Skill Gaps & Actionable Roadmap
              </h3>
              <span style={{ fontSize: 12, color: '#64748B' }}>Direct connection from real resume gaps to Skills Roadmap & Courses</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#059669', background: '#ECFDF5', padding: '4px 10px', borderRadius: 10 }}>
              {prioritizedSkillGaps.length} Actionable Gaps Identified
            </span>
          </div>

          {prioritizedSkillGaps.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
              {prioritizedSkillGaps.slice(0, 4).map((gap, idx) => (
                <div key={idx} style={{ padding: 16, borderRadius: 16, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 800, color: '#0F172A', margin: 0 }}>{gap.skill}</h4>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: 6,
                        background: gap.priority === 'CRITICAL' ? '#FEE2E2' : '#FEF3C7',
                        color: gap.priority === 'CRITICAL' ? '#991B1B' : '#92400E'
                      }}>
                        {gap.priority}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: '#64748B', margin: 0, lineHeight: 1.4 }}>{gap.reason}</p>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', display: 'block', marginTop: 4 }}>{gap.careerImpact}</span>
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                    <button
                      onClick={() => navigate(gap.learningPath)}
                      style={{ flex: 1, padding: '7px 12px', fontSize: 11.5, fontWeight: 800, color: '#FFFFFF', background: '#7C3AED', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'Sora, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                    >
                      <BookOpen size={13} />
                      <span>Learn Skill</span>
                    </button>

                    <button
                      onClick={() => navigate(gap.coursePath)}
                      style={{ flex: 1, padding: '7px 12px', fontSize: 11.5, fontWeight: 800, color: '#334155', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 8, cursor: 'pointer', fontFamily: 'Sora, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                    >
                      <GraduationCap size={13} />
                      <span>Take Course</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: 20, borderRadius: 16, background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>
              🎉 Excellent — your uploaded resume covers the core skill requirements for {activeTargetRole}!
            </div>
          )}
        </div>
      )}

      {/* ── SECTION 4: AI IMPROVEMENT SUGGESTIONS & REVISION HISTORY ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        
        {/* PRIORITIZED RECOMMENDATIONS & AI SUGGESTIONS */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 24, padding: 24, boxShadow: '0 4px 20px rgba(15,23,42,0.03)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>
              💡 Prioritized Actionable Recommendations
            </h3>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#7C3AED', background: '#F5F3FF', padding: '4px 10px', borderRadius: 10 }}>Live Intelligence</span>
          </div>

          {activeResume?.analysis?.recommendations?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {activeResume.analysis.recommendations.map((rec, idx) => (
                <div key={idx} style={{ padding: 14, borderRadius: 14, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 13.5, fontWeight: 800, color: '#0F172A' }}>{rec.issue}</span>
                    <span style={{
                      fontSize: 10.5,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 8,
                      background: rec.priority === 'CRITICAL' ? '#FEE2E2' : rec.priority === 'HIGH' ? '#FFEDD5' : '#FEF3C7',
                      color: rec.priority === 'CRITICAL' ? '#991B1B' : rec.priority === 'HIGH' ? '#C2410C' : '#92400E'
                    }}>
                      {rec.priority}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: '#64748B', margin: 0, lineHeight: 1.4 }}>{rec.whyItMatters}</p>
                  <div style={{ padding: '8px 12px', background: '#FFFFFF', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12, fontWeight: 700, color: '#334155', marginTop: 2 }}>
                    👉 Action: {rec.recommendedAction}
                  </div>
                </div>
              ))}
            </div>
          ) : activeResume?.analysis?.scoringReasons?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {activeResume.analysis.scoringReasons.map((reason, idx) => (
                <div key={idx} style={{ padding: 12, borderRadius: 12, background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: 12.5, color: '#334155', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={16} style={{ color: '#059669', flexShrink: 0 }} />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: 24, borderRadius: 16, background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: 12.5, color: '#64748B', textAlign: 'center' }}>
              Upload your resume to receive prioritized ATS formatting & keyword recommendations.
            </div>
          )}
        </div>

        {/* VERSION HISTORY & SIDE-BY-SIDE COMPARISON */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 24, padding: 24, boxShadow: '0 4px 20px rgba(15,23,42,0.03)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>
              📜 Resume Revision History & Version Comparison
            </h3>
            <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>{resumesList.length} Saved Revisions</span>
          </div>

          {resumesList.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {resumesList.map((ver) => (
                <div key={ver._id} style={{ padding: 14, borderRadius: 14, background: ver.isCurrent ? '#F5F3FF' : '#F8FAFC', border: ver.isCurrent ? '1.5px solid #7C3AED' : '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h5 style={{ fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 800, color: '#0F172A', margin: 0 }}>{ver.fileName}</h5>
                      {ver.isCurrent && <span style={{ fontSize: 10, fontWeight: 800, padding: '1px 6px', borderRadius: 6, background: '#7C3AED', color: '#FFFFFF' }}>Active</span>}
                    </div>
                    <span style={{ fontSize: 11, color: '#64748B' }}>{new Date(ver.uploadedAt).toLocaleDateString()} • ATS: {ver.analysis?.atsScore || 0}% • Match: {ver.analysis?.careerMatch?.matchScore || 0}%</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {!ver.isCurrent && (
                      <button
                        onClick={() => handleOpenCompare(ver)}
                        style={{ padding: '4px 10px', fontSize: 11, fontWeight: 800, color: '#0284C7', background: '#E0F2FE', border: '1px solid #BAE6FD', borderRadius: 8, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}
                      >
                        Compare
                      </button>
                    )}
                    {!ver.isCurrent && (
                      <button
                        onClick={() => setActiveResume(ver)}
                        style={{ padding: '4px 10px', fontSize: 11, fontWeight: 800, color: '#7C3AED', background: '#FFFFFF', border: '1px solid #DDD6FE', borderRadius: 8, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}
                      >
                        View
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteResume(ver._id)}
                      style={{ padding: '4px 6px', fontSize: 11, color: '#EF4444', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 8, cursor: 'pointer' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: 24, borderRadius: 16, background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: 12.5, color: '#64748B', textAlign: 'center' }}>
              No previous resume revisions recorded.
            </div>
          )}
        </div>

      </div>

      {/* ── SECTION 5: JOB DESCRIPTION MATCHING PANEL ── */}
      {activeResume && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 24, padding: 24, boxShadow: '0 4px 20px rgba(15,23,42,0.03)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                🎯 Match Resume Against Specific Job Description
              </h3>
              <span style={{ fontSize: 12, color: '#64748B' }}>Paste a target job posting text to extract matching & missing keywords for {activeTargetRole}</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#0284C7', background: '#E0F2FE', padding: '4px 10px', borderRadius: 10 }}>Job Matcher</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <textarea
              rows={4}
              value={jobDescText}
              onChange={(e) => setJobDescText(e.target.value)}
              placeholder="Paste job posting description text here (e.g., Seeking Frontend Engineer with React, TypeScript, Next.js, REST APIs, CI/CD experience...)"
              style={{ width: '100%', padding: 14, borderRadius: 14, border: '1px solid #CBD5E1', fontSize: 13, fontFamily: 'DM Sans, sans-serif', color: '#0F172A', outline: 'none', resize: 'vertical' }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleJobMatch}
                disabled={isMatchingJob}
                style={{ padding: '10px 22px', fontSize: 13, fontWeight: 800, color: '#FFFFFF', background: isMatchingJob ? '#94A3B8' : 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', border: 'none', borderRadius: 12, cursor: isMatchingJob ? 'not-allowed' : 'pointer', fontFamily: 'Sora, sans-serif', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)' }}
              >
                {isMatchingJob ? <RefreshCw size={15} className="spin" /> : <Search size={15} />}
                <span>{isMatchingJob ? 'Matching Keywords...' : 'Match Resume to Job Posting →'}</span>
              </button>
            </div>
          </div>

          {/* Job Match Results Card */}
          {jobMatchResult && (
            <div style={{ marginTop: 12, padding: 20, borderRadius: 18, background: '#F8FAFC', border: '1px solid #BAE6FD', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Job Description Match Analysis Result ({jobMatchResult.targetCareer})
                </h4>
                <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: jobMatchResult.matchScore >= 80 ? '#059669' : '#D97706', background: jobMatchResult.matchScore >= 80 ? '#ECFDF5' : '#FEF3C7', padding: '4px 12px', borderRadius: 12 }}>
                  {jobMatchResult.matchScore}% Match
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                {/* Matching Keywords */}
                <div style={{ padding: 14, borderRadius: 14, background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#059669', display: 'block', marginBottom: 8 }}>✅ Matching Keywords Detected ({jobMatchResult.matchingKeywords?.length || 0})</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {jobMatchResult.matchingKeywords?.length > 0 ? (
                      jobMatchResult.matchingKeywords.map((kw, i) => (
                        <span key={i} style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: '#ECFDF5', color: '#047857' }}>{kw}</span>
                      ))
                    ) : <span style={{ fontSize: 12, color: '#94A3B8' }}>No exact keyword matches found</span>}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div style={{ padding: 14, borderRadius: 14, background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#DC2626', display: 'block', marginBottom: 8 }}>⚠️ Missing Job Keywords ({jobMatchResult.missingKeywords?.length || 0})</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {jobMatchResult.missingKeywords?.length > 0 ? (
                      jobMatchResult.missingKeywords.map((kw, i) => (
                        <span key={i} style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: '#FEE2E2', color: '#B91C1C' }}>{kw}</span>
                      ))
                    ) : <span style={{ fontSize: 12, color: '#059669' }}>All target keywords present!</span>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── RESUME VERSION COMPARISON POPUP MODAL ── */}
      <AnimatePresence>
        {isCompareModalOpen && compareResume && activeResume && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(6px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              style={{
                width: 680,
                maxWidth: '100%',
                background: '#FFFFFF',
                borderRadius: 24,
                padding: 28,
                boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <TrendingUp size={20} style={{ color: '#7C3AED' }} />
                  <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 17, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Resume Revision Comparison (Side-by-Side)
                  </h3>
                </div>
                <button
                  onClick={() => setIsCompareModalOpen(false)}
                  style={{ width: 32, height: 32, borderRadius: 10, background: '#F1F5F9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Past Revision (V1) */}
                <div style={{ padding: 16, borderRadius: 16, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Past Revision</span>
                  <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 800, color: '#0F172A', margin: 0 }}>{compareResume.fileName}</h4>
                  <span style={{ fontSize: 11, color: '#64748B' }}>{new Date(compareResume.uploadedAt).toLocaleDateString()}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700 }}>
                      <span>ATS Score:</span>
                      <span style={{ color: '#4F46E5' }}>{compareResume.analysis?.atsScore || 0}%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700 }}>
                      <span>Career Match:</span>
                      <span style={{ color: '#059669' }}>{compareResume.analysis?.careerMatch?.matchScore || 0}%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700 }}>
                      <span>Skills Detected:</span>
                      <span>{compareResume.skills?.length || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Current Revision (V2) */}
                <div style={{ padding: 16, borderRadius: 16, background: '#F5F3FF', border: '1.5px solid #7C3AED', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase' }}>Active Revision</span>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 6, background: '#7C3AED', color: '#FFFFFF' }}>Current</span>
                  </div>
                  <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 800, color: '#0F172A', margin: 0 }}>{activeResume.fileName}</h4>
                  <span style={{ fontSize: 11, color: '#64748B' }}>{new Date(activeResume.uploadedAt).toLocaleDateString()}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700 }}>
                      <span>ATS Score:</span>
                      <span style={{ color: '#4F46E5' }}>{activeResume.analysis?.atsScore || 0}%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700 }}>
                      <span>Career Match:</span>
                      <span style={{ color: '#059669' }}>{activeResume.analysis?.careerMatch?.matchScore || 0}%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700 }}>
                      <span>Skills Detected:</span>
                      <span>{activeResume.skills?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress & Delta Badge */}
              {(() => {
                const atsDelta = (activeResume.analysis?.atsScore || 0) - (compareResume.analysis?.atsScore || 0)
                const matchDelta = (activeResume.analysis?.careerMatch?.matchScore || 0) - (compareResume.analysis?.careerMatch?.matchScore || 0)
                return (
                  <div style={{ padding: 14, borderRadius: 14, background: '#ECFDF5', border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#065F46' }}>
                      📈 ATS Score Change: <strong style={{ color: atsDelta >= 0 ? '#059669' : '#DC2626' }}>{atsDelta >= 0 ? `+${atsDelta}% Improvement` : `${atsDelta}% Decrease`}</strong>
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#065F46' }}>
                      🎯 Career Match Change: <strong style={{ color: matchDelta >= 0 ? '#059669' : '#DC2626' }}>{matchDelta >= 0 ? `+${matchDelta}%` : `${matchDelta}%`}</strong>
                    </span>
                  </div>
                )
              })()}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                <button
                  onClick={() => setIsCompareModalOpen(false)}
                  style={{ padding: '8px 20px', fontSize: 13, fontWeight: 800, color: '#FFFFFF', background: '#7C3AED', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}
                >
                  Close Comparison
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── PHASE 7: RESUME BUILDER & AI EDITOR POPUP MODAL ── */}
      <AnimatePresence>
        {isBuilderOpen && activeDraft && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              style={{
                width: 900,
                maxWidth: '100%',
                maxHeight: '90vh',
                background: '#FFFFFF',
                borderRadius: 24,
                padding: 32,
                boxShadow: '0 20px 60px rgba(15, 23, 42, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                overflowY: 'auto',
                position: 'relative'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Sparkles size={20} style={{ color: '#7C3AED' }} />
                    <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      Resume Builder & AI Section Optimizer
                    </h3>
                    <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 8, background: '#F5F3FF', color: '#7C3AED', border: '1px solid #DDD6FE' }}>
                      Draft v{activeDraft.version || 2}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: '#64748B' }}>Edit sections, generate AI suggestions, and finalize for real ATS re-scoring ({activeTargetRole})</span>
                </div>
                <button
                  onClick={() => setIsBuilderOpen(false)}
                  style={{ width: 34, height: 34, borderRadius: 10, background: '#F1F5F9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Section Tabs */}
              <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #E2E8F0', paddingBottom: 12, overflowX: 'auto' }}>
                {['summary', 'skills', 'experience', 'projects', 'preview'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveBuilderTab(tab)}
                    style={{
                      padding: '8px 16px',
                      fontSize: 13,
                      fontWeight: 800,
                      borderRadius: 10,
                      border: 'none',
                      cursor: 'pointer',
                      background: activeBuilderTab === tab ? '#7C3AED' : '#F1F5F9',
                      color: activeBuilderTab === tab ? '#FFFFFF' : '#475569',
                      fontFamily: 'Sora, sans-serif',
                      textTransform: 'capitalize'
                    }}
                  >
                    {tab === 'preview' ? '👁️ Live Preview & Export' : tab}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              {activeBuilderTab === 'summary' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <label style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>Professional Summary</label>
                  <textarea
                    rows={4}
                    value={activeDraft.summary || ''}
                    onChange={(e) => setActiveDraft({ ...activeDraft, summary: e.target.value })}
                    placeholder="Enter your targeted professional summary..."
                    style={{ width: '100%', padding: 14, borderRadius: 12, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <button
                      onClick={() => handleGenerateSuggestion('summary')}
                      disabled={isGeneratingSuggestion}
                      style={{ padding: '8px 16px', fontSize: 12.5, fontWeight: 800, color: '#7C3AED', background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <Sparkles size={14} />
                      <span>{isGeneratingSuggestion ? 'Generating AI Suggestion...' : '💡 AI Improve Summary'}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeBuilderTab === 'skills' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <label style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>Technical Skills (Comma separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(activeDraft.skills) ? activeDraft.skills.join(', ') : ''}
                    onChange={(e) => setActiveDraft({ ...activeDraft, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    placeholder="React, JavaScript, Node.js, SQL, Git..."
                    style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <button
                      onClick={() => handleGenerateSuggestion('skills')}
                      disabled={isGeneratingSuggestion}
                      style={{ padding: '8px 16px', fontSize: 12.5, fontWeight: 800, color: '#7C3AED', background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <Sparkles size={14} />
                      <span>{isGeneratingSuggestion ? 'Checking Target Skills...' : '💡 Check Role Skill Gaps'}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeBuilderTab === 'experience' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <label style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>Primary Experience Bullet Point</label>
                  <textarea
                    rows={3}
                    value={activeDraft.experience?.[0]?.highlights?.[0] || activeDraft.experience?.[0]?.role || ''}
                    onChange={(e) => {
                      const expCopy = [...(activeDraft.experience || [])]
                      if (!expCopy[0]) expCopy[0] = { role: 'Software Engineer', company: 'Tech Company' }
                      expCopy[0].highlights = [e.target.value, ...(expCopy[0].highlights || []).slice(1)]
                      setActiveDraft({ ...activeDraft, experience: expCopy })
                    }}
                    placeholder="Describe your achievement using strong action verbs..."
                    style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <button
                      onClick={() => handleGenerateSuggestion('experience')}
                      disabled={isGeneratingSuggestion}
                      style={{ padding: '8px 16px', fontSize: 12.5, fontWeight: 800, color: '#7C3AED', background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <Sparkles size={14} />
                      <span>{isGeneratingSuggestion ? 'Improving Action Verbs...' : '💡 AI Improve Action Verbs'}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeBuilderTab === 'preview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <ResumePreview resumeData={activeDraft} />
                </div>
              )}

              {/* AI Suggestion Display Panel */}
              {aiSuggestion && (
                <div style={{ padding: 16, borderRadius: 16, background: '#F5F3FF', border: '1px solid #DDD6FE', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#7C3AED', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Sparkles size={14} /> AI Improvement Suggestion ({aiSuggestion.section})
                    </span>
                    <span style={{ fontSize: 10.5, fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: '#7C3AED', color: '#FFFFFF' }}>
                      {aiSuggestion.impact} IMPACT
                    </span>
                  </div>

                  <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>{aiSuggestion.suggestion}</p>

                  {aiSuggestion.improvedText && (
                    <div style={{ padding: 12, background: '#FFFFFF', borderRadius: 10, border: '1px solid #CBD5E1', fontSize: 12.5, color: '#0F172A', fontWeight: 600 }}>
                      "{aiSuggestion.improvedText}"
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
                    <button
                      onClick={() => setAiSuggestion(null)}
                      style={{ padding: '6px 12px', fontSize: 11.5, fontWeight: 700, color: '#64748B', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 8, cursor: 'pointer' }}
                    >
                      Reject
                    </button>
                    <button
                      onClick={handleAcceptSuggestion}
                      style={{ padding: '6px 16px', fontSize: 11.5, fontWeight: 800, color: '#FFFFFF', background: '#7C3AED', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}
                    >
                      ✅ Accept Suggestion
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: 16, marginTop: 10 }}>
                <button
                  onClick={() => setIsBuilderOpen(false)}
                  style={{ padding: '10px 18px', fontSize: 12.5, fontWeight: 800, color: '#475569', background: '#F1F5F9', border: 'none', borderRadius: 10, cursor: 'pointer' }}
                >
                  Close Draft
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    onClick={handleDownloadPDF}
                    style={{ padding: '10px 18px', fontSize: 12.5, fontWeight: 800, color: '#0284C7', background: '#E0F2FE', border: '1px solid #BAE6FD', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Download size={14} />
                    <span>Download Draft PDF</span>
                  </button>

                  <button
                    onClick={handleFinalizeDraft}
                    disabled={isFinalizing}
                    style={{ padding: '10px 22px', fontSize: 13, fontWeight: 800, color: '#FFFFFF', background: isFinalizing ? '#94A3B8' : 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)', border: 'none', borderRadius: 12, cursor: isFinalizing ? 'not-allowed' : 'pointer', fontFamily: 'Sora, sans-serif', boxShadow: '0 4px 14px rgba(124, 58, 237, 0.25)' }}
                  >
                    {isFinalizing ? 'Re-analyzing ATS Score...' : '🎉 Finalize & Re-analyze ATS Score →'}
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── UPLOAD RESUME POPUP DIALOG MODAL ── */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(6px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                width: 580,
                maxWidth: '100%',
                background: '#FFFFFF',
                borderRadius: 24,
                padding: 32,
                boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                position: 'relative'
              }}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: '#F5F3FF', color: '#7C3AED', border: '1px solid #DDD6FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    📤
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      Upload or Replace Resume
                    </h3>
                    <span style={{ fontSize: 12, color: '#64748B' }}>Supports PDF and DOCX up to 5MB</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  style={{ background: '#F1F5F9', border: 'none', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drag & Drop Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed #7C3AED',
                  borderRadius: 20,
                  padding: 36,
                  textAlign: 'center',
                  background: '#F5F3FF',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 16, background: '#FFFFFF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: '0 4px 14px rgba(124,58,237,0.15)' }}>
                  <Upload size={24} />
                </div>
                <div>
                  <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 800, color: '#0F172A', display: 'block' }}>
                    Drag & drop your resume file here
                  </span>
                  <span style={{ fontSize: 12.5, color: '#64748B', fontWeight: 600 }}>or click to browse from files (PDF, DOCX)</span>
                </div>
              </div>

              {/* Upload Status / Progress Indicator */}
              {isUploading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 16, background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, fontWeight: 800, color: '#7C3AED' }}>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>{uploadStatusMsg || 'Uploading & Analyzing Resume...'}</span>
                  </div>
                </div>
              )}

              {/* Upload Error Banner */}
              {uploadError && (
                <div style={{ padding: 16, borderRadius: 16, background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <AlertCircle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 800 }}>
                      Resume Processing Notice
                    </span>
                    <span style={{ fontSize: 12, lineHeight: 1.4, color: '#991B1B' }}>
                      {uploadError}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 12, borderTop: '1px solid #E2E8F0' }}>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  style={{ padding: '10px 18px', fontSize: 13, fontWeight: 700, color: '#64748B', background: '#F1F5F9', border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{ padding: '10px 20px', fontSize: 13, fontWeight: 800, color: '#FFFFFF', background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)', border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: 'Sora, sans-serif', boxShadow: '0 4px 14px rgba(124, 58, 237, 0.22)' }}
                >
                  Browse Files
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
