import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCareer } from '../../context/CareerContext'
import { CAREER_ROLES, POPULAR_COMPANIES, DEGREE_OPTIONS, YEAR_OPTIONS, BRANCH_OPTIONS } from '../../data/careerRoles'
import {
  ChevronRight, ChevronLeft, Check, Sparkles,
  Search, X, CheckCircle2, Loader2, AlertCircle, Zap
} from 'lucide-react'

// ── STEP IDs ──
const STEPS = { WELCOME: 0, ROLE: 1, INFO: 2, REVIEW: 3, CREATING: 4 }

// ── CREATION CHECKLIST ITEMS ──
const INIT_STEPS = [
  { label: 'Creating Career Profile', delay: 300 },
  { label: 'Generating Learning Roadmap', delay: 900 },
  { label: 'Building Skill Gap Analysis', delay: 1500 },
  { label: 'Preparing Resume Recommendations', delay: 2100 },
  { label: 'Finding Recommended Jobs', delay: 2700 },
  { label: 'Building Interview Plan', delay: 3300 },
  { label: 'Initializing AI Career Coach', delay: 3900 },
  { label: 'Preparing Career Dashboard', delay: 4500 },
]

// ── SKILL LEVELS ──
const SKILL_LEVELS = [
  { id: 'Beginner', label: 'Beginner', desc: 'Just starting out', icon: '🌱' },
  { id: 'Intermediate', label: 'Intermediate', desc: 'Built projects, know the basics', icon: '⚡' },
  { id: 'Advanced', label: 'Advanced', desc: 'Production experience', icon: '🚀' },
]

// ── ANIMATION VARIANTS ──
const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: (dir) => ({ x: dir < 0 ? 40 : -40, opacity: 0, transition: { duration: 0.15 } }),
}

// ─────────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────────
function ProgressBar({ step, total }) {
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          height: 4, flex: 1, borderRadius: 4,
          background: i < step ? '#7C3AED' : '#E9D5FF',
          transition: 'background 0.4s ease',
        }} />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────
// STEP 0: WELCOME
// ─────────────────────────────────────────────
function WelcomeStep({ onNext }) {
  return (
    <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        style={{
          width: 80, height: 80, borderRadius: 24, margin: '0 auto 24px',
          background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(124,58,237,0.25)',
          fontSize: 36,
        }}
      >
        💼
      </motion.div>

      {/* Tag */}
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '4px 12px', borderRadius: 20, marginBottom: 16,
        background: '#F3E8FF', border: '1px solid #E9D5FF',
        fontSize: 11, fontWeight: 700, color: '#7C3AED',
        fontFamily: 'Sora, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em'
      }}>
        <Sparkles size={11} />
        Personalized Career Journey
      </span>

      <h1 style={{
        fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800,
        color: '#0F172A', lineHeight: 1.25, marginBottom: 12,
      }}>
        Welcome to Your<br />Career Journey
      </h1>

      <p style={{
        fontSize: 15, color: '#64748B', lineHeight: 1.65,
        maxWidth: 440, margin: '0 auto 28px',
      }}>
        Let's personalize ZenScore AI so every roadmap, interview, job recommendation,
        and learning plan matches <strong style={{ color: '#0F172A' }}>your</strong> career goals.
      </p>

      {/* Feature chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 32 }}>
        {['🗺️ Personalized Roadmap', '💼 Matched Jobs', '🎯 Interview Prep', '📄 ATS Resume', '🤖 AI Career Coach'].map(f => (
          <span key={f} style={{
            padding: '5px 14px', borderRadius: 20, fontSize: 12.5, fontWeight: 600,
            background: '#F8FAFF', border: '1px solid #E2E8F0', color: '#334155',
          }}>{f}</span>
        ))}
      </div>

      <button
        id="career-onboarding-get-started"
        onClick={onNext}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '12px 28px', borderRadius: 12,
          background: '#7C3AED', color: '#FFFFFF', border: 'none',
          cursor: 'pointer', fontFamily: 'Sora, sans-serif',
          fontWeight: 700, fontSize: 14.5,
          boxShadow: '0 4px 14px rgba(124,58,237,0.3)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#6D28D9'; e.currentTarget.style.transform = 'translateY(-1px)' }}
        onMouseLeave={e => { e.currentTarget.style.background = '#7C3AED'; e.currentTarget.style.transform = 'translateY(0)' }}
      >
        Get Started <ChevronRight size={16} />
      </button>

      <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 14 }}>
        Takes about 2 minutes · Only asked once
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────
// STEP 1: CAREER GOAL
// ─────────────────────────────────────────────
function RoleStep({ selected, onSelect }) {
  const [search, setSearch] = useState('')
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return CAREER_ROLES.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    )
  }, [search])

  return (
    <div>
      <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
        Choose Your Career Goal
      </h2>
      <p style={{ fontSize: 14, color: '#64748B', marginBottom: 20, lineHeight: 1.6 }}>
        Select the role you want to land. This drives your roadmap, jobs, and interview prep.
      </p>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search roles..."
          style={{
            width: '100%', padding: '9px 12px 9px 34px', borderRadius: 10, boxSizing: 'border-box',
            border: '1.5px solid #E2E8F0', background: '#F8FAFF', fontSize: 13.5,
            color: '#0F172A', outline: 'none', fontFamily: 'DM Sans, sans-serif',
          }}
        />
      </div>

      {/* Role Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 8, maxHeight: 360, overflowY: 'auto', paddingRight: 2,
      }}>
        {filtered.map(role => {
          const isSelected = selected?.id === role.id
          return (
            <motion.div
              key={role.id}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(role)}
              style={{
                padding: '12px 14px', borderRadius: 12, cursor: 'pointer',
                background: isSelected ? '#F3E8FF' : '#FFFFFF',
                border: isSelected ? '1.5px solid #7C3AED' : '1.5px solid #E2E8F0',
                display: 'flex', alignItems: 'flex-start', gap: 10,
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 2px 8px rgba(124,58,237,0.15)' : '0 1px 3px rgba(15,23,42,0.05)',
                position: 'relative',
              }}
            >
              <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>{role.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 700,
                  color: isSelected ? '#6D28D9' : '#0F172A', marginBottom: 2
                }}>
                  {role.title}
                </div>
                <div style={{ fontSize: 11.5, color: '#94A3B8', lineHeight: 1.4 }}>
                  {role.description.length > 52 ? role.description.slice(0, 49) + '...' : role.description}
                </div>
              </div>
              {isSelected && (
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 18, height: 18, borderRadius: '50%',
                  background: '#7C3AED',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Check size={10} color="#FFF" strokeWidth={3} />
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px 0', color: '#94A3B8', fontSize: 14 }}>
          No roles found for "{search}"
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// STEP 2: BASIC INFO
// ─────────────────────────────────────────────
const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: 10, boxSizing: 'border-box',
  border: '1.5px solid #E2E8F0', background: '#FFFFFF', fontSize: 13.5,
  color: '#0F172A', outline: 'none', fontFamily: 'DM Sans, sans-serif',
  transition: 'border-color 0.2s',
}
const selectStyle = {
  ...inputStyle,
  appearance: 'none', cursor: 'pointer',
  background: '#FFFFFF url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\' viewBox=\'0 0 10 6\'%3E%3Cpath d=\'M1 1l4 4 4-4\' stroke=\'%2394A3B8\' stroke-width=\'1.5\' fill=\'none\' stroke-linecap=\'round\'/%3E%3C/svg%3E") no-repeat right 12px center',
}
const labelStyle = {
  display: 'block', fontSize: 11.5, fontWeight: 700, color: '#475569',
  textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6,
}

function InfoStep({ data, onChange }) {
  const [companySearch, setCompanySearch] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const suggestions = useMemo(() => {
    if (!companySearch) return []
    return POPULAR_COMPANIES.filter(c =>
      c.toLowerCase().includes(companySearch.toLowerCase()) &&
      !data.dreamCompanies.includes(c)
    ).slice(0, 6)
  }, [companySearch, data.dreamCompanies])

  const addCompany = (name) => {
    const trimmed = name.trim()
    if (!trimmed || data.dreamCompanies.length >= 5 || data.dreamCompanies.includes(trimmed)) return
    onChange('dreamCompanies', [...data.dreamCompanies, trimmed])
    setCompanySearch('')
    setShowSuggestions(false)
  }

  const removeCompany = (name) => onChange('dreamCompanies', data.dreamCompanies.filter(c => c !== name))

  return (
    <div>
      <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
        Tell Us About You
      </h2>
      <p style={{ fontSize: 14, color: '#64748B', marginBottom: 20 }}>
        Just a few essentials — helps calibrate your roadmap and timelines.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Year */}
        <div>
          <label style={labelStyle}>Current Year</label>
          <select style={selectStyle} value={data.year} onChange={e => onChange('year', e.target.value)}>
            <option value="">Select year</option>
            {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* Degree */}
        <div>
          <label style={labelStyle}>Degree</label>
          <select style={selectStyle} value={data.degree} onChange={e => onChange('degree', e.target.value)}>
            <option value="">Select degree</option>
            {DEGREE_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Branch */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Branch / Specialization</label>
          <select style={selectStyle} value={data.branch} onChange={e => onChange('branch', e.target.value)}>
            <option value="">Select branch</option>
            {BRANCH_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {/* CGPA */}
        <div>
          <label style={labelStyle}>CGPA <span style={{ color: '#94A3B8', textTransform: 'none', fontWeight: 500 }}>(optional)</span></label>
          <input
            type="number" step="0.1" min="0" max="10" placeholder="e.g. 8.5"
            value={data.cgpa}
            onChange={e => onChange('cgpa', e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Skill Level */}
        <div>
          <label style={labelStyle}>Skill Level</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {SKILL_LEVELS.map(sl => (
              <div
                key={sl.id}
                onClick={() => onChange('skillLevel', sl.id)}
                style={{
                  padding: '9px 12px', borderRadius: 10, cursor: 'pointer',
                  background: data.skillLevel === sl.id ? '#F3E8FF' : '#FFFFFF',
                  border: data.skillLevel === sl.id ? '1.5px solid #7C3AED' : '1.5px solid #E2E8F0',
                  display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: 15 }}>{sl.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: data.skillLevel === sl.id ? '#6D28D9' : '#0F172A' }}>{sl.label}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>{sl.desc}</div>
                </div>
                {data.skillLevel === sl.id && <Check size={13} style={{ color: '#7C3AED', flexShrink: 0 }} strokeWidth={3} />}
              </div>
            ))}
          </div>
        </div>

        {/* Dream Companies */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>
            Dream Companies
            <span style={{ color: '#94A3B8', textTransform: 'none', fontWeight: 500 }}> (optional, max 5)</span>
          </label>

          {data.dreamCompanies.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              {data.dreamCompanies.map(c => (
                <span key={c} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '4px 10px', borderRadius: 20, fontSize: 12.5, fontWeight: 600,
                  background: '#F3E8FF', border: '1px solid #E9D5FF', color: '#6D28D9',
                }}>
                  {c}
                  <X size={11} onClick={() => removeCompany(c)} style={{ cursor: 'pointer', opacity: 0.7 }} />
                </span>
              ))}
            </div>
          )}

          {data.dreamCompanies.length < 5 && (
            <div style={{ position: 'relative' }}>
              <input
                placeholder="Search and add company..."
                value={companySearch}
                onChange={e => { setCompanySearch(e.target.value); setShowSuggestions(true) }}
                onKeyDown={e => { if (e.key === 'Enter' && companySearch) addCompany(companySearch) }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 180)}
                style={inputStyle}
              />
              {showSuggestions && suggestions.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 99,
                  background: '#FFFFFF', border: '1.5px solid #E2E8F0',
                  borderRadius: 10, padding: 4, marginTop: 4,
                  boxShadow: '0 8px 24px rgba(15,23,42,0.12)',
                }}>
                  {suggestions.map(c => (
                    <div
                      key={c}
                      onMouseDown={() => addCompany(c)}
                      style={{
                        padding: '8px 10px', borderRadius: 7, cursor: 'pointer', fontSize: 13,
                        color: '#334155', transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F3E8FF'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// STEP 3: REVIEW
// ─────────────────────────────────────────────
function ReviewStep({ role, info, onEdit }) {
  const rows = [
    { label: 'Career Goal', value: role?.title, icon: role?.icon, highlight: true },
    { label: 'Degree', value: info.degree || '—', icon: '🎓' },
    { label: 'Year', value: info.year || '—', icon: '📅' },
    { label: 'Branch', value: info.branch || '—', icon: '🏫' },
    { label: 'CGPA', value: info.cgpa ? `${info.cgpa} / 10` : 'Not provided', icon: '📊' },
    { label: 'Skill Level', value: info.skillLevel || '—', icon: info.skillLevel === 'Beginner' ? '🌱' : info.skillLevel === 'Intermediate' ? '⚡' : '🚀' },
    { label: 'Dream Companies', value: info.dreamCompanies.length ? info.dreamCompanies.join(', ') : 'Not specified', icon: '🏢' },
  ]

  return (
    <div>
      <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
        Review Your Profile
      </h2>
      <p style={{ fontSize: 14, color: '#64748B', marginBottom: 20 }}>
        Everything look right? Go back to edit anything.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {rows.map((row, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 16px', borderRadius: 12,
            background: row.highlight ? '#F3E8FF' : '#F8FAFF',
            border: row.highlight ? '1.5px solid #E9D5FF' : '1.5px solid #E2E8F0',
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{row.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{row.label}</div>
              <div style={{
                fontSize: 14, fontWeight: row.highlight ? 800 : 600,
                color: row.highlight ? '#6D28D9' : '#0F172A',
                marginTop: 1, fontFamily: row.highlight ? 'Sora, sans-serif' : 'DM Sans, sans-serif'
              }}>
                {row.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onEdit}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          width: '100%', padding: '10px', borderRadius: 10,
          background: '#F8FAFF', border: '1.5px solid #E2E8F0', color: '#475569',
          cursor: 'pointer', fontSize: 13.5, fontWeight: 600,
          fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
        onMouseLeave={e => e.currentTarget.style.background = '#F8FAFF'}
      >
        <ChevronLeft size={14} /> Edit Information
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────
// STEP 4: CREATING WORKSPACE
// ─────────────────────────────────────────────
function CreatingStep({ role, progress }) {
  return (
    <div style={{ textAlign: 'center', padding: '8px 0' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
        style={{
          width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px',
          background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(124,58,237,0.3)',
        }}
      >
        <Sparkles size={24} color="#FFF" />
      </motion.div>

      <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
        Creating Your Career Workspace
      </h2>
      <p style={{ fontSize: 14, color: '#64748B', marginBottom: 24 }}>
        Personalizing everything for <strong style={{ color: '#6D28D9' }}>{role?.title}</strong>...
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 340, margin: '0 auto' }}>
        {INIT_STEPS.map((step, i) => {
          const isDone = progress > i
          const isActive = progress === i
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 14px', borderRadius: 10, textAlign: 'left',
                background: isDone ? '#F0FDF4' : isActive ? '#F3E8FF' : '#F8FAFF',
                border: isDone ? '1px solid #BBF7D0' : isActive ? '1px solid #E9D5FF' : '1px solid #E2E8F0',
                transition: 'all 0.3s ease',
              }}
            >
              {isDone ? (
                <CheckCircle2 size={16} style={{ color: '#16A34A', flexShrink: 0 }} />
              ) : isActive ? (
                <Loader2 size={16} style={{ color: '#7C3AED', flexShrink: 0, animation: 'spin 1s linear infinite' }} />
              ) : (
                <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1.5px solid #CBD5E1', flexShrink: 0 }} />
              )}
              <span style={{
                fontSize: 13, fontWeight: 600,
                color: isDone ? '#15803D' : isActive ? '#6D28D9' : '#94A3B8'
              }}>
                {step.label}
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function CareerOnboarding() {
  const { finishOnboarding } = useCareer()

  const [step, setStep] = useState(STEPS.WELCOME)
  const [direction, setDirection] = useState(1)
  const [selectedRole, setSelectedRole] = useState(null)
  const [info, setInfo] = useState({
    year: '', degree: '', branch: '', cgpa: '',
    skillLevel: 'Beginner', dreamCompanies: [],
  })
  const [creationProgress, setCreationProgress] = useState(-1)
  const [error, setError] = useState(null)

  const navigate = (nextStep) => {
    setDirection(nextStep > step ? 1 : -1)
    setStep(nextStep)
  }

  const updateInfo = useCallback((key, val) => {
    setInfo(prev => ({ ...prev, [key]: val }))
  }, [])

  const canProceed = useMemo(() => {
    if (step === STEPS.ROLE) return Boolean(selectedRole)
    if (step === STEPS.INFO) return Boolean(info.year && info.degree && info.branch && info.skillLevel)
    return true
  }, [step, selectedRole, info])

  const handleCreate = useCallback(async () => {
    setError(null)
    navigate(STEPS.CREATING)
    setCreationProgress(0)

    for (let i = 0; i < INIT_STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 600))
      setCreationProgress(i + 1)
    }

    try {
      await finishOnboarding({
        careerGoal: { targetCareer: selectedRole.title },
        education: { year: info.year, degree: info.degree, branch: info.branch, cgpa: info.cgpa || null },
        skillLevel: info.skillLevel,
        dreamCompanies: info.dreamCompanies,
      })
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.')
      setStep(STEPS.REVIEW)
    }
  }, [finishOnboarding, selectedRole, info])

  const isCreating = step === STEPS.CREATING

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      background: '#F8FAFF',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: '32px 24px 48px',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: step === STEPS.WELCOME ? 520 : 760 }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              padding: '3px 10px', borderRadius: 8,
              background: '#F3E8FF', border: '1px solid #E9D5FF',
              fontSize: 11, fontWeight: 700, color: '#7C3AED',
              fontFamily: 'Sora, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              <Sparkles size={11} /> Career Onboarding
            </span>
          </div>
          {!isCreating && step > STEPS.WELCOME && (
            <p style={{ fontSize: 12.5, color: '#94A3B8', fontWeight: 500 }}>
              Step {step} of 3
            </p>
          )}
        </div>

        {/* ── CARD ── */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 20,
          boxShadow: '0 4px 16px rgba(15,23,42,0.08)',
          padding: step === STEPS.WELCOME ? '36px 36px 32px' : '32px 32px 28px',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Purple top accent bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: 'linear-gradient(90deg, #7C3AED, #A855F7)',
            borderRadius: '20px 20px 0 0',
          }} />

          {/* Progress bar */}
          {step > STEPS.WELCOME && !isCreating && (
            <ProgressBar step={step} total={3} />
          )}

          {/* Error */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 14px', borderRadius: 10, marginBottom: 16,
              background: '#FEF2F2', border: '1px solid #FECACA',
              color: '#DC2626', fontSize: 13,
            }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          {/* Step Content */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {step === STEPS.WELCOME && <WelcomeStep onNext={() => navigate(STEPS.ROLE)} />}
              {step === STEPS.ROLE && <RoleStep selected={selectedRole} onSelect={setSelectedRole} />}
              {step === STEPS.INFO && <InfoStep data={info} onChange={updateInfo} />}
              {step === STEPS.REVIEW && (
                <ReviewStep role={selectedRole} info={info} onEdit={() => navigate(STEPS.INFO)} />
              )}
              {step === STEPS.CREATING && <CreatingStep role={selectedRole} progress={creationProgress} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── NAVIGATION FOOTER ── */}
        {!isCreating && step !== STEPS.WELCOME && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: 16, gap: 12,
          }}>
            <button
              onClick={() => navigate(step - 1)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '10px 20px', borderRadius: 10,
                background: '#FFFFFF', border: '1.5px solid #E2E8F0',
                color: '#475569', cursor: 'pointer', fontSize: 13.5, fontWeight: 600,
                fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#F8FAFF'}
              onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
            >
              <ChevronLeft size={15} /> Back
            </button>

            {step < STEPS.REVIEW ? (
              <button
                id={`onboarding-next-step-${step}`}
                onClick={() => navigate(step + 1)}
                disabled={!canProceed}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '10px 24px', borderRadius: 10,
                  background: canProceed ? '#7C3AED' : '#E9D5FF',
                  color: canProceed ? '#FFFFFF' : '#A78BFA',
                  border: 'none', cursor: canProceed ? 'pointer' : 'not-allowed',
                  fontSize: 13.5, fontWeight: 700,
                  fontFamily: 'Sora, sans-serif',
                  boxShadow: canProceed ? '0 4px 12px rgba(124,58,237,0.25)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                Continue <ChevronRight size={15} />
              </button>
            ) : (
              <button
                id="onboarding-create-profile"
                onClick={handleCreate}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '10px 24px', borderRadius: 10,
                  background: '#7C3AED', color: '#FFFFFF',
                  border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 700,
                  fontFamily: 'Sora, sans-serif',
                  boxShadow: '0 4px 12px rgba(124,58,237,0.25)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#6D28D9'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#7C3AED'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <Zap size={15} /> Create My Career Workspace
              </button>
            )}
          </div>
        )}
      </div>

      {/* Spin keyframe for the loader icon */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
