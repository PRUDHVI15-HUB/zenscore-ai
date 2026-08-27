import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Search,
  X,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Briefcase,
  Cpu,
  BookOpen,
  Building2,
  Clock,
  Bot,
  User,
  LayoutDashboard,
  ExternalLink,
  ChevronRight,
  CornerDownLeft,
  FileText,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Compass
} from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { performGlobalSearch } from '../../services/search/searchService'

const MODULE_CONFIG = {
  dashboard: { label: 'Dashboard', icon: LayoutDashboard, color: '#6366F1' },
  academics: { label: 'Academics', icon: GraduationCap, color: '#3B82F6' },
  careers: { label: 'Careers', icon: Briefcase, color: '#8B5CF6' },
  skills: { label: 'Skills', icon: Cpu, color: '#10B981' },
  courses: { label: 'Courses', icon: BookOpen, color: '#F59E0B' },
  jobs: { label: 'Jobs', icon: Building2, color: '#EC4899' },
  productivity: { label: 'Productivity', icon: Clock, color: '#06B6D4' },
  'ai-tutor': { label: 'AI Tutor', icon: Bot, color: '#8B5CF6' },
  profile: { label: 'Profile', icon: User, color: '#64748B' }
}

const CATEGORY_ORDER = [
  'academics',
  'careers',
  'skills',
  'courses',
  'jobs',
  'productivity',
  'ai-tutor',
  'profile',
  'dashboard'
]

const getEntityIcon = (type, module) => {
  switch (type) {
    case 'academic_subject':
    case 'academic_semester':
    case 'academic_metric':
    case 'academic_weak_subject':
      return GraduationCap
    case 'career_goal':
    case 'career_company':
    case 'career_resume':
    case 'career_roadmap':
    case 'career_interview':
      return Briefcase
    case 'skill_item':
    case 'skill_lesson':
      return Cpu
    case 'course_item':
    case 'course_module':
      return BookOpen
    case 'job_listing':
    case 'job_application':
    case 'job_saved':
    case 'company_profile':
      return Building2
    case 'focus_session':
    case 'productivity_hub':
      return Clock
    case 'tutor_conversation':
    case 'tutor_main':
      return Bot
    case 'student_profile':
      return User
    default:
      return MODULE_CONFIG[module]?.icon || Compass
  }
}

export default function GlobalSearchModal({ isOpen, onClose, initialQuery = '' }) {
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState([])
  const [totalResults, setTotalResults] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const inputRef = useRef(null)
  const abortControllerRef = useRef(null)
  const debounceTimerRef = useRef(null)
  const listContainerRef = useRef(null)

  // Detect current active module context from path
  const currentContext = useMemo(() => {
    const p = location.pathname.toLowerCase().replace(/^\//, '')
    if (p.startsWith('academics')) return 'academics'
    if (p.startsWith('careers')) return 'careers'
    if (p.startsWith('skills')) return 'skills'
    if (p.startsWith('courses')) return 'courses'
    if (p.startsWith('jobs') || p.startsWith('companies')) return 'jobs'
    if (p.startsWith('productivity')) return 'productivity'
    if (p.startsWith('ai-tutor')) return 'ai-tutor'
    if (p.startsWith('profile')) return 'profile'
    return 'dashboard'
  }, [location.pathname])

  const contextMeta = MODULE_CONFIG[currentContext] || MODULE_CONFIG.dashboard
  const ContextIcon = contextMeta.icon

  // Sync initial query when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery)
      setSelectedIndex(0)
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
          inputRef.current.select()
        }
      }, 50)
    }
  }, [isOpen, initialQuery])

  // Live search with debouncing & cancellation
  const doSearch = useCallback(async (searchQuery, contextName) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    if (!searchQuery || searchQuery.trim().length < 2) {
      setResults([])
      setTotalResults(0)
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      const response = await performGlobalSearch(searchQuery.trim(), contextName, controller.signal)
      if (response && response.success) {
        setResults(response.results || [])
        setTotalResults(response.totalResults || 0)
        setSelectedIndex(0)
      } else {
        setResults([])
        setTotalResults(0)
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Search query failed:', err)
        setError(err.message || 'Search service temporarily unavailable')
        setResults([])
        setTotalResults(0)
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [])

  // Trigger search on query change
  useEffect(() => {
    if (!isOpen) return

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      doSearch(query, currentContext)
    }, 280)

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    }
  }, [query, currentContext, isOpen, doSearch])

  // Flattened results array for keyboard navigation
  const flattenedResults = useMemo(() => {
    return results
  }, [results])

  // Group results by module/category
  const groupedResults = useMemo(() => {
    const groups = {}
    results.forEach(item => {
      const mod = item.module || 'other'
      if (!groups[mod]) groups[mod] = []
      groups[mod].push(item)
    })

    // Sort groups placing current module first
    const sortedGroupKeys = Object.keys(groups).sort((a, b) => {
      if (a === currentContext) return -1
      if (b === currentContext) return 1
      const orderA = CATEGORY_ORDER.indexOf(a)
      const orderB = CATEGORY_ORDER.indexOf(b)
      if (orderA !== -1 && orderB !== -1) return orderA - orderB
      return a.localeCompare(b)
    })

    return sortedGroupKeys.map(key => ({
      module: key,
      meta: MODULE_CONFIG[key] || { label: key.toUpperCase(), color: '#64748B', icon: Compass },
      items: groups[key]
    }))
  }, [results, currentContext])

  const handleSelectResult = useCallback((item) => {
    if (!item) return
    onClose()
    if (item.route) {
      navigate(item.route)
    }
  }, [navigate, onClose])

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (flattenedResults.length > 0) {
        setSelectedIndex(prev => (prev + 1) % flattenedResults.length)
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (flattenedResults.length > 0) {
        setSelectedIndex(prev => (prev - 1 + flattenedResults.length) % flattenedResults.length)
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (flattenedResults.length > 0 && flattenedResults[selectedIndex]) {
        handleSelectResult(flattenedResults[selectedIndex])
      }
    }
  }

  // Scroll active item into view
  useEffect(() => {
    if (listContainerRef.current) {
      const activeEl = listContainerRef.current.querySelector('[data-active="true"]')
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [selectedIndex])

  if (!isOpen) return null

  const themeTokens = {
    overlayBg: 'rgba(11, 11, 14, 0.75)',
    modalBg: isDark ? '#121216' : '#FFFFFF',
    modalBorder: isDark ? '#2A2A32' : '#E2E8F0',
    headerBg: isDark ? '#18181D' : '#F8FAFC',
    inputColor: isDark ? '#F4F4F6' : '#0F172A',
    placeholderColor: isDark ? '#71717A' : '#94A3B8',
    textPrimary: isDark ? '#F4F4F6' : '#0F172A',
    textSecondary: isDark ? '#A1A1AA' : '#64748B',
    groupBg: isDark ? '#18181D' : '#F1F5F9',
    itemHoverBg: isDark ? '#1E1E24' : '#F8FAFC',
    itemActiveBg: isDark ? '#272730' : '#EEF2FF',
    itemActiveBorder: isDark ? '#4F46E5' : '#6366F1',
    footerBg: isDark ? '#18181D' : '#F8FAFC',
    footerBorder: isDark ? '#2A2A32' : '#E2E8F0',
    badgeBg: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)',
    badgeText: isDark ? '#A78BFA' : '#4F46E5',
  }

  let runningItemIndex = -1

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: themeTokens.overlayBg,
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '60px 16px 20px',
        animation: 'fadeIn 0.15s ease-out'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        style={{
          width: '100%',
          maxWidth: 680,
          background: themeTokens.modalBg,
          border: `1px solid ${themeTokens.modalBorder}`,
          borderRadius: 20,
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.45)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '82vh',
          animation: 'slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Top Input Bar */}
        <div style={{
          padding: '16px 20px',
          background: themeTokens.headerBg,
          borderBottom: `1px solid ${themeTokens.modalBorder}`,
          display: 'flex',
          alignItems: 'center',
          gap: 14
        }}>
          <Search size={20} style={{ color: loading ? '#6366F1' : themeTokens.textSecondary, flexShrink: 0, transition: 'color 0.2s' }} />

          <input
            ref={inputRef}
            type="text"
            placeholder={`Search ${contextMeta.label}, skills, courses, jobs, or academics...`}
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: 16,
              fontWeight: 600,
              fontFamily: 'Sora, sans-serif',
              color: themeTokens.inputColor,
              outline: 'none',
              minWidth: 0
            }}
          />

          {/* Context Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 8,
            background: themeTokens.badgeBg,
            color: themeTokens.badgeText,
            fontSize: 11.5,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}>
            <ContextIcon size={13} style={{ color: contextMeta.color }} />
            <span>{contextMeta.label}</span>
          </div>

          {/* Clear / Close Button */}
          {query ? (
            <button
              onClick={() => { setQuery(''); inputRef.current?.focus() }}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: themeTokens.textSecondary,
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 6
              }}
            >
              <X size={18} />
            </button>
          ) : (
            <kbd style={{
              fontSize: 11,
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: 6,
              background: isDark ? '#2A2A32' : '#E2E8F0',
              color: themeTokens.textSecondary,
              fontFamily: 'inherit'
            }}>
              ESC
            </kbd>
          )}
        </div>

        {/* Results / Content Area */}
        <div
          ref={listContainerRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 14px',
            minHeight: 180,
            maxHeight: '56vh'
          }}
        >
          {/* Loading Indicator */}
          {loading && (
            <div style={{
              padding: '28px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12
            }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: `3px solid ${isDark ? '#2A2A32' : '#E2E8F0'}`,
                borderTopColor: '#6366F1',
                animation: 'spin 0.8s linear infinite'
              }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: themeTokens.textSecondary }}>
                Searching across {contextMeta.label} & ZenScore ecosystem...
              </div>
            </div>
          )}

          {/* Error Message */}
          {!loading && error && (
            <div style={{
              padding: '28px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10
            }}>
              <AlertCircle size={28} style={{ color: '#EF4444' }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: themeTokens.textPrimary }}>
                {error}
              </div>
              <button
                onClick={() => doSearch(query, currentContext)}
                style={{
                  marginTop: 6,
                  padding: '6px 16px',
                  borderRadius: 8,
                  background: '#6366F1',
                  color: '#fff',
                  border: 'none',
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Retry Search
              </button>
            </div>
          )}

          {/* Idle / Prompt State */}
          {!loading && !error && !query && (
            <div style={{ padding: '16px 12px' }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: themeTokens.textSecondary, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 12 }}>
                Quick Suggestions in {contextMeta.label}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                {currentContext === 'academics' && [
                  { label: 'My Subjects', q: 'subjects', icon: '📚' },
                  { label: 'CGPA & Analytics', q: 'CGPA', icon: '📈' },
                  { label: 'Weak Subjects', q: 'weak subjects', icon: '⚠️' },
                  { label: 'Transcript Memos', q: 'transcript', icon: '📄' }
                ].map(s => (
                  <button
                    key={s.q}
                    onClick={() => setQuery(s.q)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 9,
                      padding: '10px 14px', borderRadius: 10,
                      background: themeTokens.headerBg, border: `1px solid ${themeTokens.modalBorder}`,
                      color: themeTokens.textPrimary, fontSize: 13, fontWeight: 600,
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s'
                    }}
                  >
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </button>
                ))}

                {currentContext === 'jobs' && [
                  { label: 'Explore Openings', q: 'software engineer', icon: '💼' },
                  { label: 'My Applications', q: 'applied jobs', icon: '📬' },
                  { label: 'Saved Bookmarks', q: 'saved', icon: '⭐' },
                  { label: 'Google Jobs', q: 'Google', icon: '🏢' }
                ].map(s => (
                  <button
                    key={s.q}
                    onClick={() => setQuery(s.q)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 9,
                      padding: '10px 14px', borderRadius: 10,
                      background: themeTokens.headerBg, border: `1px solid ${themeTokens.modalBorder}`,
                      color: themeTokens.textPrimary, fontSize: 13, fontWeight: 600,
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s'
                    }}
                  >
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </button>
                ))}

                {currentContext === 'skills' && [
                  { label: 'React Skill', q: 'React', icon: '⚡' },
                  { label: 'Docker Mastery', q: 'Docker', icon: '🐳' },
                  { label: 'Python Lab', q: 'Python', icon: '🐍' },
                  { label: 'All Lessons', q: 'lesson', icon: '📖' }
                ].map(s => (
                  <button
                    key={s.q}
                    onClick={() => setQuery(s.q)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 9,
                      padding: '10px 14px', borderRadius: 10,
                      background: themeTokens.headerBg, border: `1px solid ${themeTokens.modalBorder}`,
                      color: themeTokens.textPrimary, fontSize: 13, fontWeight: 600,
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s'
                    }}
                  >
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </button>
                ))}

                {currentContext === 'courses' && [
                  { label: 'Enrolled Courses', q: 'enrolled', icon: '📚' },
                  { label: 'Cloud & DevOps', q: 'Docker', icon: '☁️' },
                  { label: 'Modules & Quizzes', q: 'Module', icon: '📝' },
                  { label: 'Certifications', q: 'certificate', icon: '🏆' }
                ].map(s => (
                  <button
                    key={s.q}
                    onClick={() => setQuery(s.q)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 9,
                      padding: '10px 14px', borderRadius: 10,
                      background: themeTokens.headerBg, border: `1px solid ${themeTokens.modalBorder}`,
                      color: themeTokens.textPrimary, fontSize: 13, fontWeight: 600,
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s'
                    }}
                  >
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </button>
                ))}

                {currentContext === 'careers' && [
                  { label: 'Career Goal', q: 'career goal', icon: '🎯' },
                  { label: 'Resume ATS Score', q: 'resume', icon: '📝' },
                  { label: 'Learning Roadmap', q: 'roadmap', icon: '🗺️' },
                  { label: 'Mock Interviews', q: 'interview', icon: '🎙️' }
                ].map(s => (
                  <button
                    key={s.q}
                    onClick={() => setQuery(s.q)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 9,
                      padding: '10px 14px', borderRadius: 10,
                      background: themeTokens.headerBg, border: `1px solid ${themeTokens.modalBorder}`,
                      color: themeTokens.textPrimary, fontSize: 13, fontWeight: 600,
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s'
                    }}
                  >
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </button>
                ))}

                {(currentContext === 'dashboard' || currentContext === 'productivity' || currentContext === 'ai-tutor' || currentContext === 'profile') && [
                  { label: 'Academic Performance', q: 'CGPA', icon: '🎓' },
                  { label: 'Career Roadmap', q: 'roadmap', icon: '💼' },
                  { label: 'Skills & Lessons', q: 'skills', icon: '⚡' },
                  { label: 'Job Openings', q: 'jobs', icon: '🏢' },
                  { label: 'Focus & Timer', q: 'focus session', icon: '⏱️' },
                  { label: 'AI Tutor Chat', q: 'ai tutor', icon: '🤖' }
                ].map(s => (
                  <button
                    key={s.q}
                    onClick={() => setQuery(s.q)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 9,
                      padding: '10px 14px', borderRadius: 10,
                      background: themeTokens.headerBg, border: `1px solid ${themeTokens.modalBorder}`,
                      color: themeTokens.textPrimary, fontSize: 13, fontWeight: 600,
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s'
                    }}
                  >
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Honest Empty State */}
          {!loading && !error && query && query.length >= 2 && results.length === 0 && (
            <div style={{
              padding: '36px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10
            }}>
              <div style={{ fontSize: 32 }}>🔍</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: themeTokens.textPrimary }}>
                No matching records found for "{query}"
              </div>
              <div style={{ fontSize: 13, color: themeTokens.textSecondary, maxWidth: 360 }}>
                We searched your active student records, courses, skills, and job opportunities. Try another keyword or switch context.
              </div>
            </div>
          )}

          {/* Grouped Results Display */}
          {!loading && !error && groupedResults.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {groupedResults.map(group => {
                const GroupIcon = group.meta.icon || Compass
                const isCurrentModuleGroup = group.module === currentContext

                return (
                  <div key={group.module} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {/* Category Header */}
                    <div style={{
                      padding: '4px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 7,
                      fontSize: 11,
                      fontWeight: 800,
                      color: group.meta.color || themeTokens.textSecondary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px'
                    }}>
                      <GroupIcon size={13} style={{ color: group.meta.color }} />
                      <span>{group.meta.label}</span>
                      {isCurrentModuleGroup && (
                        <span style={{
                          fontSize: 9.5,
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: 4,
                          background: themeTokens.badgeBg,
                          color: themeTokens.badgeText,
                          marginLeft: 4
                        }}>
                          Current Module
                        </span>
                      )}
                    </div>

                    {/* Result Items */}
                    {group.items.map(item => {
                      runningItemIndex += 1
                      const itemIdx = runningItemIndex
                      const isSelected = itemIdx === selectedIndex
                      const ItemIcon = getEntityIcon(item.type, item.module)

                      return (
                        <div
                          key={item.id}
                          data-active={isSelected ? 'true' : 'false'}
                          onClick={() => handleSelectResult(item)}
                          onMouseEnter={() => setSelectedIndex(itemIdx)}
                          style={{
                            padding: '10px 14px',
                            borderRadius: 12,
                            background: isSelected ? themeTokens.itemActiveBg : 'transparent',
                            border: `1px solid ${isSelected ? themeTokens.itemActiveBorder : 'transparent'}`,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            transition: 'all 0.12s ease'
                          }}
                        >
                          {/* Item Icon */}
                          <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: isSelected ? 'rgba(99, 102, 241, 0.2)' : themeTokens.headerBg,
                            border: `1px solid ${themeTokens.modalBorder}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: group.meta.color || themeTokens.textSecondary,
                            flexShrink: 0
                          }}>
                            <ItemIcon size={16} />
                          </div>

                          {/* Item Content */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: 13.5,
                              fontWeight: 700,
                              color: isSelected ? (isDark ? '#FFFFFF' : '#312E81') : themeTokens.textPrimary,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {item.title}
                            </div>
                            {item.subtitle && (
                              <div style={{
                                fontSize: 11.5,
                                color: isSelected ? (isDark ? '#C7D2FE' : '#4338CA') : themeTokens.textSecondary,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                marginTop: 1
                              }}>
                                {item.subtitle}
                              </div>
                            )}
                          </div>

                          {/* Navigation Indicator / Enter Prompt */}
                          {isSelected ? (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              fontSize: 11,
                              fontWeight: 700,
                              color: isDark ? '#A78BFA' : '#4F46E5',
                              flexShrink: 0
                            }}>
                              <span>Go</span>
                              <CornerDownLeft size={13} />
                            </div>
                          ) : (
                            <ChevronRight size={15} style={{ color: themeTokens.textSecondary, flexShrink: 0, opacity: 0.5 }} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Bottom Shortcut Footer */}
        <div style={{
          padding: '10px 20px',
          background: themeTokens.footerBg,
          borderTop: `1px solid ${themeTokens.footerBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 11.5,
          color: themeTokens.textSecondary,
          gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <kbd style={{ background: isDark ? '#2A2A32' : '#E2E8F0', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>↑</kbd>
              <kbd style={{ background: isDark ? '#2A2A32' : '#E2E8F0', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>↓</kbd>
              <span>to navigate</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <kbd style={{ background: isDark ? '#2A2A32' : '#E2E8F0', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>↵</kbd>
              <span>to select</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <kbd style={{ background: isDark ? '#2A2A32' : '#E2E8F0', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>ESC</kbd>
              <span>to close</span>
            </span>
          </div>

          <div style={{ fontSize: 11, fontWeight: 600 }}>
            {totalResults > 0 ? `${totalResults} live matches` : 'Live Contextual Search'}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
