import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, Sparkles, Target, Check, ArrowRight, TrendingUp, Briefcase, Zap, AlertTriangle } from 'lucide-react'
import { CAREER_ROLES } from '../../data/careerRoles'
import { useCareer } from '../../context/CareerContext'
import { useStudentProfile } from '../../context/StudentProfileContext'

export default function ChangeCareerRoleModal({ isOpen, onClose, currentRole, onRoleChanged }) {
  const career = useCareer()
  const studentProfileCtx = useStudentProfile()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedRoleTitle, setSelectedRoleTitle] = useState('')

  const categories = useMemo(() => {
    const cats = ['All']
    CAREER_ROLES.forEach(r => {
      if (r.category && !cats.includes(r.category)) cats.push(r.category)
    })
    return cats
  }, [])

  const filteredRoles = useMemo(() => {
    return CAREER_ROLES.filter(role => {
      const matchesCat = selectedCategory === 'All' || role.category === selectedCategory
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch = !q ||
        role.title.toLowerCase().includes(q) ||
        role.description?.toLowerCase().includes(q) ||
        (role.topSkills || []).some(s => s.toLowerCase().includes(q))
      return matchesCat && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  const handleSelectRole = async (role) => {
    if (isUpdating) return
    setIsUpdating(true)
    setSelectedRoleTitle(role.title)

    try {
      // 1. Update CareerContext (which generates fresh roadmap and refreshes all career submodules)
      if (career?.selectCareerGoal) {
        await career.selectCareerGoal(role.title)
      }

      // 2. Persist to student profile
      if (studentProfileCtx?.updateSection) {
        await studentProfileCtx.updateSection('careerProfile', {
          selectedCareerGoal: role.title,
          currentRoadmapId: role.id || role.title,
          currentPhaseTitle: 'Phase 1: Foundations',
          onboardingCompleted: true,
          careerLastActivity: new Date().toISOString()
        }, 'Careers').catch(() => null)
      }

      if (onRoleChanged) {
        onRoleChanged(role.title)
      }

      setTimeout(() => {
        setIsUpdating(false)
        if (onClose) onClose()
      }, 400)
    } catch (err) {
      console.warn('Role switch error:', err)
      setIsUpdating(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget && !isUpdating) onClose()
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: 'var(--bg-soft, #FFFFFF)',
            border: '1px solid var(--border, #E2E8F0)',
            borderRadius: 24,
            width: '100%',
            maxWidth: 820,
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.35)',
            overflow: 'hidden'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* MODAL HEADER */}
          <div
            style={{
              padding: '24px 28px 18px',
              borderBottom: '1px solid var(--border, #E2E8F0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              background: 'var(--bg-soft, #FFFFFF)'
            }}
          >
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 12, background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED', fontSize: 11, fontWeight: 800, fontFamily: 'Sora, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                <Target size={13} />
                <span>CAREER PIVOT ENGINE</span>
              </div>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 800, color: 'var(--text-dark, #0F172A)', margin: 0 }}>
                Select Your Target Career Goal 🎯
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted, #64748B)', margin: '4px 0 0', fontWeight: 500 }}>
                Choose a new target role to generate fresh personalized roadmaps, skill milestones, and job matches.
              </p>
            </div>

            <button
              onClick={onClose}
              disabled={isUpdating}
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                border: '1px solid var(--border, #E2E8F0)',
                background: 'var(--bg, #F8FAFC)',
                color: 'var(--text-muted, #64748B)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-dark, #0F172A)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted, #64748B)'}
            >
              <X size={18} />
            </button>
          </div>

          {/* SEARCH & CATEGORY CHIPS */}
          <div style={{ padding: '16px 28px', borderBottom: '1px solid var(--border, #E2E8F0)', background: 'var(--bg, #F8FAFC)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted, #94A3B8)' }} />
              <input
                type="text"
                placeholder="Search by role name, skills, or domain (e.g. React, Python, Cloud)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  height: 42,
                  padding: '0 16px 0 40px',
                  borderRadius: 14,
                  border: '1px solid var(--border, #E2E8F0)',
                  background: 'var(--bg-soft, #FFFFFF)',
                  color: 'var(--text-dark, #0F172A)',
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: 'DM Sans, sans-serif',
                  outline: 'none'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted, #94A3B8)', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
              {categories.map(cat => {
                const isActive = selectedCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '5px 14px',
                      borderRadius: 12,
                      border: isActive ? '1px solid #7C3AED' : '1px solid var(--border, #E2E8F0)',
                      background: isActive ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' : 'var(--bg-soft, #FFFFFF)',
                      color: isActive ? '#FFFFFF' : 'var(--text-mid, #475569)',
                      fontSize: 12,
                      fontWeight: isActive ? 700 : 600,
                      fontFamily: 'Sora, sans-serif',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s'
                    }}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ROLES GRID CONTAINER */}
          <div
            style={{
              padding: '20px 28px',
              overflowY: 'auto',
              flex: 1,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
              gap: 14
            }}
          >
            {filteredRoles.map(role => {
              const isCurrent = currentRole === role.title
              const isBeingSelected = isUpdating && selectedRoleTitle === role.title

              return (
                <motion.div
                  key={role.id}
                  whileHover={{ y: -3 }}
                  onClick={() => handleSelectRole(role)}
                  style={{
                    padding: 16,
                    borderRadius: 18,
                    background: isCurrent ? 'rgba(124, 58, 237, 0.08)' : 'var(--bg-soft, #FFFFFF)',
                    border: isCurrent ? '2px solid #7C3AED' : '1px solid var(--border, #E2E8F0)',
                    cursor: isUpdating ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 12,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    position: 'relative',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                >
                  {isCurrent && (
                    <div style={{ position: 'absolute', top: 12, right: 12, display: 'inline-flex', alignItems: 'center', gap: 4, background: '#7C3AED', color: '#FFFFFF', padding: '2px 8px', borderRadius: 8, fontSize: 10, fontWeight: 800, fontFamily: 'Sora, sans-serif' }}>
                      <Check size={11} strokeWidth={3} />
                      <span>ACTIVE</span>
                    </div>
                  )}

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(124, 58, 237, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                        {role.icon || '🚀'}
                      </div>
                      <div style={{ flex: 1, paddingRight: isCurrent ? 50 : 0 }}>
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block' }}>
                          {role.category}
                        </span>
                        <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 800, color: 'var(--text-dark, #0F172A)', margin: 0 }}>
                          {role.title}
                        </h4>
                      </div>
                    </div>

                    <p style={{ fontSize: 12, color: 'var(--text-muted, #64748B)', margin: '0 0 10px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {role.description}
                    </p>

                    {/* Top Skills Pills */}
                    {role.topSkills && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                        {role.topSkills.slice(0, 3).map(skill => (
                          <span key={skill} style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 6, background: 'var(--bg, #F1F5F9)', color: 'var(--text-mid, #475569)', border: '1px solid var(--border, #E2E8F0)' }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ borderTop: '1px solid var(--border, #E2E8F0)', paddingTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#059669' }}>
                      {role.avgSalary || 'Competitive LPA'}
                    </span>

                    <span style={{ fontSize: 11, fontWeight: 800, color: '#7C3AED', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      {isBeingSelected ? 'Selecting...' : isCurrent ? 'Active Goal' : 'Choose Role →'}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* FOOTER NOTICE */}
          <div
            style={{
              padding: '14px 28px',
              borderTop: '1px solid var(--border, #E2E8F0)',
              background: 'var(--bg-soft, #FFFFFF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted, #64748B)' }}>
              <Sparkles size={14} style={{ color: '#7C3AED' }} />
              <span>Selecting a new role instantly generates a fresh roadmap and career milestones.</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => {
                  onClose()
                  window.location.href = '/careers/setup'
                }}
                style={{
                  padding: '8px 14px',
                  borderRadius: 12,
                  border: '1px solid #E9D5FF',
                  background: '#F5F3FF',
                  color: '#7C3AED',
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5
                }}
              >
                <Sparkles size={12} />
                <span>Full Setup Wizard</span>
              </button>

              <button
                onClick={onClose}
                style={{
                  padding: '8px 16px',
                  borderRadius: 12,
                  border: '1px solid var(--border, #E2E8F0)',
                  background: 'var(--bg, #F8FAFC)',
                  color: 'var(--text-dark, #0F172A)',
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: 700,
                  fontSize: 12.5,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
