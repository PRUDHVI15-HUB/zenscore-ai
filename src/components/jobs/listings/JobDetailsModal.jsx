import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  CheckCircle2,
  MapPin,
  Bookmark,
  Calendar,
  Building2,
  Briefcase,
  Award,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  GraduationCap,
  Layers,
  Clock,
  DollarSign
} from 'lucide-react'

// Known technical domains & skills dictionary for automatic enrichment
const SKILL_KEYWORDS_MAP = [
  { match: /(?:machine\s*learning|ai\/ml|artificial\s*intelligence)/i, label: 'Machine Learning (AI/ML)' },
  { match: /(?:deep\s*learning|pytorch|tensorflow)/i, label: 'Deep Learning' },
  { match: /(?:data\s*science|big\s*data|analytics)/i, label: 'Data Science & Analytics' },
  { match: /(?:cyber\s*security|digital\s*forensics|security)/i, label: 'Cyber Security & Forensics' },
  { match: /(?:cloud\s*computing|aws|azure|gcp)/i, label: 'Cloud Computing' },
  { match: /(?:devops|docker|kubernetes|ci\/cd)/i, label: 'DevOps & Containers' },
  { match: /(?:full\s*stack|software\s*engineering|web\s*development)/i, label: 'Full Stack Development' },
  { match: /(?:react|next\.js|frontend|vue|angular)/i, label: 'React / Modern Frontend' },
  { match: /(?:node\.js|express|backend|fastapi|django)/i, label: 'Backend Architecture' },
  { match: /(?:sql|database|postgresql|mongodb|mysql)/i, label: 'Databases & SQL' },
  { match: /(?:robotics|iot|drone\s*technology)/i, label: 'Robotics, IoT & Drones' },
  { match: /(?:ios|swift|mobile|android|kotlin)/i, label: 'Mobile & iOS Development' },
  { match: /(?:python)/i, label: 'Python' },
  { match: /(?:java|spring\s*boot)/i, label: 'Java & Spring' },
  { match: /(?:system\s*design|distributed\s*systems)/i, label: 'System Design' }
]

/**
 * Intelligent Parser to convert raw job descriptions into structured sections
 */
function parseJobDescription(rawText) {
  if (!rawText) {
    return {
      overview: 'Comprehensive role at an industry-leading organization with high-growth potential and engineering excellence.',
      sections: []
    }
  }

  // Clean trailing ellipses and normalize spaces
  let text = rawText.replace(/\.\.\.$/, '').trim()

  // Standard headings to look out for in raw external descriptions
  const headingKeywords = [
    'Open Positions',
    'Specializations Required',
    'Key Responsibilities',
    'Responsibilities',
    'Key Requirements',
    'Requirements',
    'Eligibility Criteria',
    'Qualifications',
    'Preferred Qualifications',
    'About the Role',
    'What You Will Do',
    'What We Look For'
  ]

  const regex = new RegExp(`(?:^|\\n|\\.\\s+)(${headingKeywords.join('|')}):?`, 'gi')
  const parts = text.split(regex).filter(p => p && p.trim().length > 0)

  // If no standard headers found, structure by sentences or bullet points
  if (parts.length <= 1) {
    const rawBullets = text.split(/(?:•|\*|-|\d+\.\s+)/).map(b => b.trim()).filter(b => b.length > 5)
    if (rawBullets.length > 1) {
      return {
        overview: rawBullets[0],
        sections: [
          {
            title: 'Role Highlights & Scope',
            items: rawBullets.slice(1)
          }
        ]
      }
    }
    return {
      overview: text,
      sections: []
    }
  }

  let overview = ''
  const sections = []

  for (let i = 0; i < parts.length; i++) {
    const candidate = parts[i].trim()
    const matchedHeading = headingKeywords.find(h => h.toLowerCase() === candidate.toLowerCase())

    if (matchedHeading && i + 1 < parts.length) {
      const content = parts[i + 1].trim()
      // Extract sub-items if available
      const items = content
        .split(/(?:•|\*|-|\d+\.\s+|;\s+|\n+)/)
        .map(s => s.trim())
        .filter(s => s.length > 3 && !headingKeywords.some(h => s.toLowerCase().startsWith(h.toLowerCase())))

      sections.push({
        title: matchedHeading,
        items: items.length > 0 ? items : [content]
      })
      i++ // Skip next since it was consumed
    } else if (!overview) {
      overview = candidate
    }
  }

  return {
    overview: overview || text.slice(0, 280),
    sections
  }
}

export default function JobDetailsModal({
  job,
  onClose,
  onApply,
  onSave,
  isSaved = false,
  isApplied = false,
  children
}) {
  if (!job) return null

  // Extract structured description sections
  const parsedDesc = useMemo(() => {
    return parseJobDescription(job.description || job.fullDescription || job.jobOverview)
  }, [job.description, job.fullDescription, job.jobOverview])

  // Extract & Enrich Technical Skills
  const resolvedSkills = useMemo(() => {
    const existing = Array.isArray(job.skills) ? job.skills : (job.requiredSkills || [])
    const combinedSet = new Set(existing)

    const fullSourceText = `${job.title || ''} ${job.description || ''} ${job.company || ''} ${(job.responsibilities || []).join(' ')}`
    
    SKILL_KEYWORDS_MAP.forEach(item => {
      if (item.match.test(fullSourceText)) {
        combinedSet.add(item.label)
      }
    })

    const finalArr = Array.from(combinedSet).filter(Boolean)
    return finalArr.length > 0 ? finalArr : ['Engineering Core', 'Problem Solving', 'Technical Communication']
  }, [job.skills, job.requiredSkills, job.title, job.description, job.company, job.responsibilities])

  const officialApplyUrl = job.applyUrl || job.applyLink || job.redirectUrl || `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${job.title || job.role} ${job.company}`)}`

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{
            background: '#FFFFFF',
            borderRadius: 24,
            width: '100%',
            maxWidth: 780,
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: '32px 36px',
            boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
            position: 'relative',
            fontFamily: 'DM Sans, sans-serif'
          }}
        >
          {/* Top Close Button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              position: 'absolute',
              top: 22,
              right: 22,
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748B',
              transition: 'background 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#E2E8F0'}
            onMouseLeave={e => e.currentTarget.style.background = '#F1F5F9'}
          >
            <X size={18} />
          </button>

          {/* ── MODAL HEADER: BRAND + ROLE DETAILS ── */}
          <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', paddingRight: 40 }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              border: '1.5px solid #E2E8F0',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)'
            }}>
              {job.logo || '💼'}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#2563EB', background: '#EFF6FF', padding: '3px 10px', borderRadius: 8, border: '1px solid #BFDBFE' }}>
                  {job.company}
                </span>
                {job.aiMatch && (
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#15803D', background: '#F0FDF4', padding: '3px 10px', borderRadius: 8, border: '1px solid #BBF7D0', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Sparkles size={13} /> {job.aiMatch}% Match
                  </span>
                )}
              </div>

              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 23, fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.25 }}>
                {job.title}
              </h2>

              <div style={{ fontSize: 13.5, color: '#475569', fontWeight: 600, marginTop: 6, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={14} style={{ color: '#64748B' }} />
                  {job.location} ({job.workMode || 'On-site'})
                </span>
                <span>•</span>
                <span style={{ color: '#059669', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                  <DollarSign size={14} /> {job.salary || 'Competitive Salary'}
                </span>
                <span>•</span>
                <span style={{ color: '#64748B', fontWeight: 700 }}>
                  {job.type || 'Full Time'}
                </span>
              </div>
            </div>
          </div>

          {/* ── SECTION: OVERVIEW & RICH INTRO ── */}
          <div style={{ background: '#F8FAFC', borderRadius: 16, padding: '18px 20px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 14.5, fontWeight: 800, color: '#0F172A', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Briefcase size={16} style={{ color: '#2563EB' }} />
              <span>Job Overview</span>
            </h4>
            <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
              {parsedDesc.overview}
            </p>
          </div>

          {/* ── PARSED SECTIONS (OPEN POSITIONS, SPECIALIZATIONS, REQUIREMENTS) ── */}
          {parsedDesc.sections.map((sec, sIdx) => (
            <div key={sIdx}>
              <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 800, color: '#0F172A', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Layers size={16} style={{ color: '#7C3AED' }} />
                <span>{sec.title}</span>
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {sec.items.map((item, iIdx) => (
                  <div key={iIdx} style={{ fontSize: 13.5, color: '#334155', display: 'flex', alignItems: 'flex-start', gap: 10, lineHeight: 1.5, background: '#FAFAFA', padding: '10px 14px', borderRadius: 12, border: '1px solid #F1F5F9' }}>
                    <CheckCircle2 size={16} style={{ color: '#2563EB', flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontWeight: 600 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* ── REQUIRED TECHNICAL SKILLS ── */}
          <div>
            <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 800, color: '#0F172A', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Award size={16} style={{ color: '#2563EB' }} />
              <span>Required Technical Skills & Domains</span>
            </h4>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {resolvedSkills.map((skill, skIdx) => (
                <span
                  key={skIdx}
                  style={{
                    fontSize: 12.5,
                    fontWeight: 700,
                    padding: '6px 14px',
                    borderRadius: 10,
                    background: '#EFF6FF',
                    color: '#1D4ED8',
                    border: '1px solid #BFDBFE',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Sparkles size={12} style={{ color: '#3B82F6' }} />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>

          {/* ── ELIGIBILITY & ACADEMIC CRITERIA ── */}
          <div style={{
            background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
            borderRadius: 18,
            padding: '18px 22px',
            border: '1px solid #DBEAFE',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            textAlign: 'center'
          }}>
            <div>
              <span style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block' }}>
                MINIMUM CGPA
              </span>
              <strong style={{ fontFamily: 'Sora, sans-serif', fontSize: 17, color: '#0F172A', display: 'block', marginTop: 3 }}>
                {job.eligibility?.cgpa || '6.0+'}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block' }}>
                ELIGIBLE BRANCHES
              </span>
              <strong style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, color: '#0F172A', display: 'block', marginTop: 3 }}>
                {(job.eligibility?.branches && job.eligibility.branches.length > 0 ? job.eligibility.branches : (job.branches && job.branches.length > 0 ? job.branches : ['CSE', 'IT', 'ECE', 'All Disciplines'])).join(', ')}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block' }}>
                PASSOUT BATCH
              </span>
              <strong style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, color: '#2563EB', display: 'block', marginTop: 3 }}>
                {job.eligibility?.graduationYear || '2025 / 2026 / 2027'}
              </strong>
            </div>
          </div>

          {/* ── KEY RESPONSIBILITIES (IF PRESET) ── */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 800, color: '#0F172A', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={16} style={{ color: '#059669' }} />
                <span>Key Responsibilities</span>
              </h4>
              <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} style={{ fontSize: 13.5, color: '#334155', display: 'flex', alignItems: 'flex-start', gap: 10, lineHeight: 1.5 }}>
                    <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0, marginTop: 2 }} />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── APPLICATION / RECRUITMENT TIMELINE (CHILDREN) ── */}
          {children}

          {/* ── MODAL FOOTER ACTION BAR ── */}
          <div style={{ display: 'flex', gap: 12, marginTop: 8, paddingTop: 16, borderTop: '1px solid #E2E8F0', flexWrap: 'wrap' }}>
            <button
              onClick={() => onApply(job)}
              style={{
                flex: '1 1 220px',
                height: 46,
                borderRadius: 14,
                background: isApplied ? '#10B981' : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 800,
                fontSize: 14,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: isApplied ? 'none' : '0 4px 14px rgba(37, 99, 235, 0.25)',
                transition: 'all 0.15s'
              }}
            >
              <span>{isApplied ? 'Applied ✓' : 'Apply on Official Portal'}</span>
              <ExternalLink size={16} />
            </button>

            <button
              onClick={() => onSave(job.id || job._id)}
              style={{
                height: 46,
                padding: '0 20px',
                borderRadius: 14,
                background: isSaved ? '#F5F3FF' : '#F8FAFC',
                color: isSaved ? '#7C3AED' : '#475569',
                border: isSaved ? '1.5px solid #DDD6FE' : '1px solid #CBD5E1',
                cursor: 'pointer',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 700,
                fontSize: 13.5,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Bookmark size={16} fill={isSaved ? '#7C3AED' : 'none'} />
              <span>{isSaved ? 'Saved' : 'Save Job'}</span>
            </button>

            <button
              onClick={onClose}
              style={{
                height: 46,
                padding: '0 20px',
                borderRadius: 14,
                background: '#F1F5F9',
                color: '#475569',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 700,
                fontSize: 13.5
              }}
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
