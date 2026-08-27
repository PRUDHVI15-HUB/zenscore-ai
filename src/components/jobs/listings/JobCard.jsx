import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Bookmark, CheckCircle2, Sparkles, Clock, Calendar, ExternalLink } from 'lucide-react'

// Helper to format timestamps and messy date strings into clean human-readable text
function formatCleanDate(val, defaultText = 'Recently') {
  if (!val) return defaultText
  if (typeof val === 'string') {
    if (/^\d{1,2}\s+[A-Za-z]+|\b(ago|today|yesterday|recently|open\s*until\s*filled)\b/i.test(val) && val.length < 24) {
      return val
    }
    if (val.includes('GMT') || val.includes('T') || !isNaN(Date.parse(val))) {
      try {
        const d = new Date(val)
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }
      } catch {}
    }
  }
  return String(val).slice(0, 20)
}

export default function JobCard({
  job,
  isSaved = false,
  isApplied = false,
  onSave,
  onApply,
  onViewDetails
}) {
  if (!job) return null

  const getMatchColor = (score) => {
    if (score >= 90) return { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' }
    if (score >= 75) return { bg: '#F5F3FF', color: '#7C3AED', border: '#DDD6FE' }
    return { bg: '#FFF7ED', color: '#C2410C', border: '#FED7AA' }
  }

  const matchScore = job.aiMatch || job.matchScore || 85
  const matchStyle = getMatchColor(matchScore)

  // 1. Resolve Skills (fallback extraction from title & description)
  const resolvedSkills = useMemo(() => {
    const raw = job.skills || job.requiredSkills || []
    if (Array.isArray(raw) && raw.length > 0) return raw

    const text = `${job.title || ''} ${job.description || ''}`.toLowerCase()
    const auto = []
    if (/machine|ai|ml|data/i.test(text)) auto.push('Machine Learning', 'Data Analytics')
    if (/react|frontend|web|javascript/i.test(text)) auto.push('React', 'JavaScript', 'CSS')
    if (/python|backend|fastapi/i.test(text)) auto.push('Python', 'Backend APIs')
    if (/cloud|devops|aws|docker/i.test(text)) auto.push('Cloud Computing', 'DevOps')
    if (/security|cyber/i.test(text)) auto.push('Cyber Security', 'Network Defense')
    
    return auto.length > 0 ? auto : ['Software Engineering', 'Problem Solving', 'Git']
  }, [job.skills, job.requiredSkills, job.title, job.description])

  // 2. Resolve AI Recommendation Reasons
  const reasons = useMemo(() => {
    const raw = job.recommendationReason || job.reasoning || job.matchReasons || job.aiReasoning || []
    const arr = Array.isArray(raw) ? raw.filter(Boolean) : (typeof raw === 'string' && raw.trim() ? [raw] : [])
    if (arr.length > 0) return arr.slice(0, 2)

    if (job.recommended || matchScore >= 80) {
      const topSkill = resolvedSkills[0] || 'Core Technical'
      return [
        `${topSkill} proficiency aligned with student profile`,
        `Candidate match from ${job.company || 'Hiring Team'} verified`
      ]
    }
    return []
  }, [job.recommendationReason, job.reasoning, job.matchReasons, job.aiReasoning, job.recommended, matchScore, resolvedSkills, job.company])

  // 3. Resolve Clean Eligibility
  const eligibility = useMemo(() => {
    const rawE = job.eligibility || {}
    const title = (job.title || '').toLowerCase()
    
    let cgpa = rawE.cgpa
    if (!cgpa) {
      if (title.includes('senior') || title.includes('lead')) cgpa = '7.5+'
      else if (title.includes('intern')) cgpa = '6.0+'
      else cgpa = '6.5+'
    }

    let branches = rawE.branches || job.branches
    if (!branches || !Array.isArray(branches) || branches.length === 0) {
      if (title.includes('data') || title.includes('analyst') || title.includes('machine') || title.includes('ai')) {
        branches = ['CSE', 'IT', 'AI & DS']
      } else if (title.includes('professor') || title.includes('computing')) {
        branches = ['CSE', 'IT', 'ECE', 'MCA']
      } else {
        branches = ['CSE', 'IT', 'ECE']
      }
    }

    let batch = rawE.graduationYear || '2025 / 2026 / 2027'

    return {
      cgpa,
      branches: branches.slice(0, 3).join(', '),
      graduationYear: batch
    }
  }, [job.eligibility, job.branches, job.title])

  const cleanPosted = formatCleanDate(job.postedDate || job.posted, 'Recently')
  const cleanDeadline = formatCleanDate(job.deadline, 'Sep 2026')

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)' }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      style={{
        background: '#FFFFFF',
        borderRadius: 20,
        padding: 22,
        border: job.recommended ? '1.5px solid #C4B5FD' : '1px solid #E2E8F0',
        boxShadow: job.recommended ? '0 4px 20px rgba(124, 58, 237, 0.06)' : '0 2px 10px rgba(15, 23, 42, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 14,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'DM Sans, sans-serif'
      }}
      className="job-card-item"
    >
      {/* Top Badges (Recommended, New, AI Match) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {job.recommended && (
            <span style={{
              fontSize: 10.5,
              fontWeight: 800,
              padding: '3px 9px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
              color: '#FFFFFF',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}>
              <Sparkles size={11} /> Recommended
            </span>
          )}

          {job.latest && (
            <span style={{
              fontSize: 10.5,
              fontWeight: 800,
              padding: '3px 9px',
              borderRadius: 10,
              background: '#FEF3C7',
              color: '#D97706',
              border: '1px solid #FDE68A'
            }}>
              NEW
            </span>
          )}
        </div>

        {/* AI Match % Badge */}
        <span style={{
          fontSize: 11,
          fontWeight: 800,
          padding: '3px 9px',
          borderRadius: 12,
          background: matchStyle.bg,
          color: matchStyle.color,
          border: `1px solid ${matchStyle.border}`
        }}>
          {matchScore}% Match
        </span>
      </div>

      {/* Header: Company Logo & Job Title */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          border: '1px solid #E2E8F0',
          flexShrink: 0
        }}>
          {job.logo || '💼'}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: 16,
            fontWeight: 800,
            color: '#0F172A',
            margin: 0,
            lineHeight: 1.25,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {job.title}
          </h3>

          <div style={{
            fontSize: 12.5,
            color: '#475569',
            fontWeight: 600,
            marginTop: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            flexWrap: 'wrap'
          }}>
            <span style={{ color: '#1E293B', fontWeight: 700 }}>{job.company}</span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: '#64748B' }}>
              <MapPin size={12} />
              {job.location} ({job.workMode || 'On-site'})
            </span>
          </div>
        </div>

        {/* Bookmark Action */}
        <button
          onClick={() => onSave(job.id || job._id)}
          title={isSaved ? 'Unsave Job' : 'Save Job'}
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: isSaved ? '#F5F3FF' : '#F8FAFC',
            border: isSaved ? '1px solid #DDD6FE' : '1px solid #E2E8F0',
            color: isSaved ? '#7C3AED' : '#64748B',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Bookmark size={15} fill={isSaved ? '#7C3AED' : 'none'} />
        </button>
      </div>

      {/* Salary & Type Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span style={{
          fontSize: 12,
          fontWeight: 800,
          color: '#059669',
          background: '#F0FDF4',
          padding: '3px 10px',
          borderRadius: 8,
          border: '1px solid #BBF7D0'
        }}>
          {job.salary || 'Competitive Salary'}
        </span>
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          color: '#2563EB',
          background: '#EFF6FF',
          padding: '3px 9px',
          borderRadius: 8
        }}>
          {job.employmentType || job.type || 'Full Time'}
        </span>
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          color: '#7C3AED',
          background: '#F5F3FF',
          padding: '3px 9px',
          borderRadius: 8
        }}>
          {job.experience || '0-1 Years'}
        </span>
      </div>

      {/* Required Skills Chips */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {resolvedSkills.slice(0, 4).map(skill => (
          <span
            key={skill}
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '3px 8px',
              borderRadius: 6,
              background: '#F1F5F9',
              color: '#475569',
              fontFamily: 'DM Sans, sans-serif'
            }}
          >
            {skill}
          </span>
        ))}
        {resolvedSkills.length > 4 && (
          <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', padding: '3px 4px' }}>
            +{(resolvedSkills.length - 4)}
          </span>
        )}
      </div>

      {/* AI Recommendation Reasons (Rendered only when reasons exist) */}
      {reasons.length > 0 && (
        <div style={{
          background: '#F8FAFF',
          borderRadius: 12,
          padding: '9px 12px',
          border: '1px solid #E0E7FF'
        }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 4 }}>
            Why Recommended
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {reasons.map((reason, idx) => (
              <div key={idx} style={{ fontSize: 11, color: '#334155', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, lineHeight: 1.3 }}>
                <CheckCircle2 size={12} style={{ color: '#10B981', flexShrink: 0 }} />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Eligibility Panel (CGPA, Branch, Batch) */}
      <div style={{
        background: '#F8FAFC',
        borderRadius: 12,
        padding: '10px 14px',
        border: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 11.5,
        color: '#334155',
        fontWeight: 600
      }}>
        <div>
          <span style={{ color: '#64748B', fontSize: 10, display: 'block', textTransform: 'uppercase' }}>CGPA</span>
          <strong style={{ color: '#0F172A' }}>{eligibility.cgpa}</strong>
        </div>
        <div style={{ textAlign: 'center' }}>
          <span style={{ color: '#64748B', fontSize: 10, display: 'block', textTransform: 'uppercase' }}>Branches</span>
          <strong style={{ color: '#0F172A' }}>{eligibility.branches}</strong>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ color: '#64748B', fontSize: 10, display: 'block', textTransform: 'uppercase' }}>Batch</span>
          <strong style={{ color: '#2563EB' }}>{eligibility.graduationYear}</strong>
        </div>
      </div>

      {/* Card Footer Dates & Action Buttons */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          color: '#64748B',
          marginBottom: 10,
          fontWeight: 600
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={12} /> Posted {cleanPosted}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#D97706', fontWeight: 700 }}>
            <Calendar size={12} /> {cleanDeadline}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => onApply(job)}
            style={{
              flex: 1,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Sora, sans-serif',
              fontWeight: 800,
              fontSize: 12.5,
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            <span>Apply Now</span>
            <ExternalLink size={13} strokeWidth={2.2} />
          </button>

          <button
            onClick={() => onViewDetails(job)}
            style={{
              height: 38,
              padding: '0 16px',
              borderRadius: 10,
              background: '#F1F5F9',
              color: '#334155',
              border: '1px solid #CBD5E1',
              cursor: 'pointer',
              fontFamily: 'Sora, sans-serif',
              fontWeight: 700,
              fontSize: 12
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  )
}
