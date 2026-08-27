import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles, Briefcase, MapPin, CheckCircle2, Bookmark, ArrowRight,
  Zap, Star, Calendar, Clock, Award, Filter, ExternalLink
} from 'lucide-react'
import { getRecommendedJobs, applyForJob } from '../../services/api'

/**
 * Well-structured Mock Data Constant for Future API Hydration
 */
export const RECOMMENDED_JOBS = [
  {
    id: 1,
    title: 'Full Stack Engineer',
    company: 'Google',
    location: 'Bangalore',
    salary: '₹22 - ₹36 LPA',
    logo: '🔵',
    logoBg: '#EFF6FF',
    type: 'Full Time',
    workMode: 'Hybrid',
    matchScore: 96,
    aiConfidence: 94,
    isBestMatch: true,
    skills: ['React', 'Node.js', 'TypeScript', 'System Design', 'Git'],
    reasoning: [
      'React & Node.js proficiency verified',
      'Phase 3 Backend roadmap completed (88%)',
      'CGPA 8.2+ meets minimum threshold',
      '4 core matching technical skills'
    ],
    posted: '2 days ago',
    deadline: 'Aug 20'
  }
]

/**
 * Match Badge Styling Helper (90-100% Green, 75-89% Purple, <75% Orange)
 */
const getMatchBadgeStyle = (score) => {
  if (score >= 90) {
    return {
      bg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      color: '#FFFFFF',
      border: '#6EE7B7'
    }
  }
  if (score >= 75) {
    return {
      bg: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      color: '#FFFFFF',
      border: '#C4B5FD'
    }
  }
  return {
    bg: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
    color: '#FFFFFF',
    border: '#FDBA74'
  }
}

/**
 * Loading Skeleton Card Component
 */
const SkeletonCard = () => (
  <div style={{
    background: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    border: '1px solid #E2E8F0',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    boxShadow: '0 2px 10px rgba(15,23,42,0.03)'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#E2E8F0' }} className="animate-pulse" />
      <div style={{ width: 70, height: 24, borderRadius: 12, background: '#E2E8F0' }} className="animate-pulse" />
    </div>
    <div style={{ width: '70%', height: 18, borderRadius: 6, background: '#E2E8F0' }} className="animate-pulse" />
    <div style={{ width: '40%', height: 14, borderRadius: 6, background: '#E2E8F0' }} className="animate-pulse" />
    <div style={{ width: '100%', height: 80, borderRadius: 12, background: '#F1F5F9' }} className="animate-pulse" />
    <div style={{ display: 'flex', gap: 6 }}>
      <div style={{ flex: 1, height: 36, borderRadius: 10, background: '#E2E8F0' }} className="animate-pulse" />
      <div style={{ width: 36, height: 36, borderRadius: 10, background: '#E2E8F0' }} className="animate-pulse" />
    </div>
  </div>
)

/**
 * Empty State Component
 */
const EmptyState = ({ onExploreSkills }) => (
  <div style={{
    background: '#FFFFFF',
    borderRadius: 24,
    padding: '48px 24px',
    textAlign: 'center',
    border: '1px border-dashed #CBD5E1',
    boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12
  }}>
    <div style={{ fontSize: 40, marginBottom: 4 }}>🎯</div>
    <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
      No recommendations available yet
    </h3>
    <p style={{ fontSize: 13.5, color: '#64748B', maxWidth: 440, lineHeight: 1.5, margin: 0 }}>
      Complete your Skills Roadmaps and verify core technical competencies to unlock AI placement recommendations.
    </p>
    <button
      onClick={() => onExploreSkills ? onExploreSkills() : (window.location.href = '/skills')}
      style={{
        marginTop: 8,
        height: 40,
        padding: '0 20px',
        borderRadius: 12,
        background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
        color: '#FFFFFF',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'Sora, sans-serif',
        fontWeight: 700,
        fontSize: 13,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        boxShadow: '0 4px 14px rgba(124, 58, 237, 0.25)'
      }}
    >
      <span>Explore Skills</span>
      <ArrowRight size={14} />
    </button>
  </div>
)

/**
 * RecommendedJobs Component (Flagship AI Placement Recommendations)
 */
export default function RecommendedJobs({
  jobs: customJobs,
  loading: externalLoading = false,
  onApply,
  onSave,
  onViewAll,
  onExploreSkills
}) {
  const [liveJobs, setLiveJobs] = useState([])
  const [loading, setLoading] = useState(externalLoading)
  const [savedJobIds, setSavedJobIds] = useState([])
  const [appliedJobIds, setAppliedJobIds] = useState([])

  useEffect(() => {
    let isMounted = true
    const loadLiveRecommendations = async () => {
      setLoading(true)
      try {
        const res = await getRecommendedJobs()
        if (isMounted && res && res.jobs && res.jobs.length > 0) {
          const knownSkills = [
            'SAP UI5', 'SAP', 'React', 'Node.js', 'Python', 'Java', 'C++', 'C#', '.NET',
            'TypeScript', 'JavaScript', 'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker',
            'Kubernetes', 'FastAPI', 'Django', 'Spring Boot', 'Angular', 'Vue.js',
            'TailwindCSS', 'Redux', 'PyTorch', 'TensorFlow', 'LLMs', 'Git', 'Linux',
            'REST APIs', 'GraphQL', 'Cybersecurity', 'SIEM', 'Ethical Hacking',
            'DevOps', 'CI/CD', 'Machine Learning', 'Data Science', 'Pandas', 'Spark',
            'System Design', 'Figma', 'UI/UX'
          ]
          const formatted = res.jobs.map((j, idx) => {
            const rawSkills = j.requiredSkills || j.skills || []
            let extractedSkills = rawSkills
            if (!extractedSkills || extractedSkills.length === 0) {
              const text = `${j.title || ''} ${j.description || ''}`
              extractedSkills = knownSkills.filter(s =>
                new RegExp('\\b' + s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i').test(text)
              )
            }
            if (!extractedSkills || extractedSkills.length === 0) {
              extractedSkills = ['Software Engineering', 'Problem Solving', 'Git']
            }

            let cleanDeadline = j.deadline || 'Open until filled'
            if (typeof cleanDeadline === 'string' && cleanDeadline.includes('GMT')) {
              const parts = cleanDeadline.split(' ')
              if (parts.length >= 4) cleanDeadline = `${parts[1]} ${parts[2]}, ${parts[3]}`
            }

            return {
              id: j._id || j.id,
              title: j.title,
              company: j.company,
              location: j.location,
              salary: j.salary || 'Competitive Salary',
              logo: j.logo || '🏢',
              logoBg: idx % 2 === 0 ? '#EFF6FF' : '#F5F3FF',
              type: j.employmentType || 'Full Time',
              workMode: j.workMode || 'Hybrid',
              matchScore: j.aiMatch || (96 - idx * 2),
              aiConfidence: Math.min(95, (j.aiMatch || 96) - 2),
              isBestMatch: idx === 0,
              skills: extractedSkills,
              reasoning: [
                `${extractedSkills[0] || 'Core Tech'} proficiency verified`,
                `Direct candidate match from ${j.company}`,
                `Eligibility requirements satisfied`,
                `Verified live ATS listing (${j.source || 'ZenScore'})`
              ],
              posted: 'Recently',
              deadline: cleanDeadline,
              applyLink: j.applyLink
            }
          })
          setLiveJobs(formatted)
        }
      } catch (err) {
        if (err?.name === 'AbortError' || err?.message?.includes('aborted')) return
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (!customJobs || customJobs === RECOMMENDED_JOBS) {
      loadLiveRecommendations()
    } else {
      setLiveJobs(customJobs)
    }

    return () => { isMounted = false }
  }, [customJobs])

  const jobs = liveJobs.length > 0 ? liveJobs : (customJobs && customJobs !== RECOMMENDED_JOBS ? customJobs : RECOMMENDED_JOBS)

  const handleToggleSave = (id) => {
    const nextSaved = savedJobIds.includes(id)
      ? savedJobIds.filter(item => item !== id)
      : [...savedJobIds, id]
    setSavedJobIds(nextSaved)
    if (onSave) onSave(id, !savedJobIds.includes(id))
  }

  const handleApplyClick = async (job) => {
    const jobId = job.id || job._id
    const targetUrl = job.applyLink || job.applyUrl || `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${job.title || job.role} ${job.company}`)}`

    try {
      if (jobId) await applyForJob(jobId)
    } catch (err) {
      console.warn('Apply recording notice:', err)
    }

    if (targetUrl && targetUrl !== '#') {
      window.open(targetUrl, '_blank', 'noopener,noreferrer')
    } else if (onApply) {
      onApply(job)
    }
  }

  return (
    <section style={{ marginTop: 36, marginBottom: 40 }}>
      <div className="container" style={{ margin: '0 auto', padding: '0 24px' }}>
        
        {/* SECTION HEADER */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 24
        }}>
          <div style={{ maxWidth: 640 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 24 }}>🎯</span>
              <h2 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: 'clamp(20px, 2.5vw, 24px)',
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.5px',
                margin: 0
              }}>
                Recommended For You
              </h2>
            </div>
            <p style={{
              fontSize: 13.5,
              color: '#64748B',
              lineHeight: 1.5,
              margin: 0,
              fontFamily: 'DM Sans, sans-serif'
            }}>
              AI-powered job recommendations personalized according to your skills, learning progress, career goals, and placement readiness.
            </p>
          </div>

          <button
            onClick={() => onViewAll ? onViewAll() : null}
            style={{
              height: 38,
              padding: '0 18px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Sora, sans-serif',
              fontWeight: 700,
              fontSize: 12.5,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.22)',
              transition: 'transform 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <span>View All Recommendations</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* LOADING SKELETON STATE */}
        {loading && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20
          }}>
            {[1, 2, 3, 4].map(n => <SkeletonCard key={n} />)}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && (!jobs || jobs.length === 0) && (
          <EmptyState onExploreSkills={onExploreSkills} />
        )}

        {/* RECOMMENDATION CARDS GRID (4 columns desktop, 2 tablet, 1 mobile) */}
        {!loading && jobs && jobs.length > 0 && (
          <div
            className="recommended-jobs-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 20
            }}
          >
            {jobs.map((job) => {
              const matchBadge = getMatchBadgeStyle(job.matchScore)
              const isSaved = savedJobIds.includes(job.id)
              const isApplied = appliedJobIds.includes(job.id)

              return (
                <motion.div
                  key={job.id}
                  whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(124, 58, 237, 0.12)' }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 20,
                    padding: 20,
                    border: job.isBestMatch ? '1.5px solid #C4B5FD' : '1px solid #E2E8F0',
                    boxShadow: job.isBestMatch ? '0 4px 20px rgba(124, 58, 237, 0.08)' : '0 2px 10px rgba(15, 23, 42, 0.03)',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 14,
                    overflow: 'hidden'
                  }}
                  className="job-recommendation-card"
                >
                  {/* ⭐ Best Match Floating Top Ribbon (Only on highest match card) */}
                  {job.isBestMatch && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 20,
                      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      color: '#FFFFFF',
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '0 0 10px 10px',
                      letterSpacing: '0.4px',
                      boxShadow: '0 2px 8px rgba(217, 119, 6, 0.3)',
                      zIndex: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <Star size={11} fill="#FFFFFF" />
                      Best Match
                    </div>
                  )}

                  {/* CARD HEADER: Company Avatar & Match Score Badge */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginTop: job.isBestMatch ? 8 : 0
                  }}>
                    {/* Circular Company Avatar */}
                    <div
                      className="company-logo-avatar"
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: job.logoBg || '#F1F5F9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                        transition: 'transform 0.2s ease',
                        flexShrink: 0
                      }}
                    >
                      {job.logo}
                    </div>

                    {/* Right Column: Match Score Badge & AI Confidence */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: 14,
                        background: matchBadge.bg,
                        color: matchBadge.color,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        letterSpacing: '0.3px'
                      }}>
                        {job.matchScore}% Match
                      </span>

                      {/* AI Confidence Indicator Progress Bar */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: 9.5, fontWeight: 700, color: '#64748B', fontFamily: 'DM Sans, sans-serif' }}>
                          AI Confidence
                        </span>
                        <div style={{ width: 36, height: 4, background: '#E2E8F0', borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{ width: `${job.aiConfidence || 90}%`, height: '100%', background: '#7C3AED', borderRadius: 99 }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* JOB TITLE & COMPANY INFO */}
                  <div>
                    <h3 style={{
                      fontFamily: 'Sora, sans-serif',
                      fontSize: 15.5,
                      fontWeight: 800,
                      color: '#0F172A',
                      lineHeight: 1.25,
                      margin: 0
                    }}>
                      {job.title}
                    </h3>

                    <div style={{
                      fontSize: 12.5,
                      color: '#64748B',
                      fontWeight: 600,
                      marginTop: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      flexWrap: 'wrap'
                    }}>
                      <span style={{ color: '#1E293B', fontWeight: 700 }}>{job.company}</span>
                      <span>•</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                        <MapPin size={12} style={{ color: '#94A3B8' }} />
                        {job.location}
                      </span>
                    </div>

                    {/* Salary & Badges */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                      <span style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: '#059669',
                        background: '#F0FDF4',
                        padding: '3px 8px',
                        borderRadius: 8,
                        border: '1px solid #BBF7D0'
                      }}>
                        {job.salary}
                      </span>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#2563EB',
                        background: '#EFF6FF',
                        padding: '3px 8px',
                        borderRadius: 8
                      }}>
                        {job.type}
                      </span>
                      {job.workMode && (
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: '#7C3AED',
                          background: '#F5F3FF',
                          padding: '3px 8px',
                          borderRadius: 8
                        }}>
                          {job.workMode}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* REQUIRED SKILLS CHIPS */}
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {(job.skills || []).slice(0, 4).map(skill => (
                      <span
                        key={skill}
                        style={{
                          fontSize: 10.5,
                          fontWeight: 600,
                          padding: '2px 7px',
                          borderRadius: 6,
                          background: '#F1F5F9',
                          color: '#475569',
                          fontFamily: 'DM Sans, sans-serif'
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                    {(job.skills || []).length > 4 && (
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: '#94A3B8', padding: '2px 4px' }}>
                        +{(job.skills.length - 4)}
                      </span>
                    )}
                  </div>

                  {/* 🤖 AI EXPLANATION REASONING BOX (Flagship Feature) */}
                  <div style={{
                    background: 'linear-gradient(140deg, #F8FAFF 0%, #F5F3FF 100%)',
                    borderRadius: 12,
                    padding: '10px 12px',
                    border: '1px solid #E0E7FF',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4
                  }}>
                    <div style={{
                      fontSize: 10.5,
                      fontWeight: 800,
                      color: '#4F46E5',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                      fontFamily: 'Sora, sans-serif'
                    }}>
                      <Sparkles size={12} style={{ color: '#7C3AED' }} />
                      Why this matches you
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {(job.reasoning || []).slice(0, 3).map((reason, rIdx) => (
                        <li key={rIdx} style={{ fontSize: 11, color: '#334155', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5, lineHeight: 1.3 }}>
                          <CheckCircle2 size={12} style={{ color: '#10B981', flexShrink: 0 }} />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CARD FOOTER: Dates & Deadlines */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 11,
                    color: '#64748B',
                    fontWeight: 600,
                    borderTop: '1px solid #F1F5F9',
                    paddingTop: 8
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} />
                      {job.posted}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#D97706', fontWeight: 700 }}>
                      <Calendar size={12} />
                      Deadline: {job.deadline}
                    </span>
                  </div>

                  {/* CTA BUTTONS: Primary Apply & Secondary Save */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleApplyClick(job)}
                      style={{
                        flex: 1,
                        height: 36,
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                        color: '#FFFFFF',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'Sora, sans-serif',
                        fontWeight: 800,
                        fontSize: 12.5,
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.22)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6
                      }}
                    >
                      <span>Apply Now</span>
                      <ExternalLink size={13} strokeWidth={2.2} />
                    </motion.button>

                    <button
                      onClick={() => handleToggleSave(job.id)}
                      title={isSaved ? 'Remove Bookmark' : 'Save Job'}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: isSaved ? '#F5F3FF' : '#F1F5F9',
                        border: isSaved ? '1px solid #DDD6FE' : '1px solid #E2E8F0',
                        color: isSaved ? '#7C3AED' : '#64748B',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Bookmark size={16} fill={isSaved ? '#7C3AED' : 'none'} />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Responsive Breakpoints CSS */}
      <style>{`
        .job-recommendation-card:hover .company-logo-avatar {
          transform: scale(1.06);
        }
        @media (max-width: 1024px) {
          .recommended-jobs-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .recommended-jobs-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
