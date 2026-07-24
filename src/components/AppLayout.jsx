import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Briefcase,
  Cpu,
  Building2,
  Clock,
  Bot,
  Search,
  Bell,
  ChevronDown,
  Sparkles,
  Menu,
  Flame
} from 'lucide-react'

const allPages = [
  { label: 'Dashboard',    path: '/dashboard',   icon: '🏠' },
  { label: 'Academics',    path: '/academics',    icon: '🎓' },
  { label: 'Careers',      path: '/careers',      icon: '💼' },
  { label: 'Skills',       path: '/skills',       icon: '⚡' },
  { label: 'Jobs',         path: '/jobs',         icon: '🏢' },
  { label: 'Courses',      path: '/courses',      icon: '📚' },
  { label: 'Productivity', path: '/productivity', icon: '⏱️' },
  { label: 'AI Tutor',     path: '/ai-tutor',     icon: '🤖' },
]

const sampleNotifications = [
  { id: 1, icon: '🎯', title: 'Goal Reminder',  desc: 'You have 2 DSA problems pending today',    time: '5m ago',  unread: true  },
  { id: 2, icon: '📈', title: 'GPA Updated',    desc: 'Your CGPA has been recalculated to 8.4',   time: '1h ago',  unread: true  },
  { id: 3, icon: '🤖', title: 'AI Tutor',       desc: 'New study plan is ready for review',       time: '3h ago',  unread: false },
]

export default function AppLayout({ children, title, searchVal, onSearchChange }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [sidebarOpen,      setSidebarOpen]      = useState(true)
  const [showDropdown,     setShowDropdown]     = useState(false)
  const [showNotifications,setShowNotifications]= useState(false)
  const [showProfileMenu,  setShowProfileMenu]  = useState(false)
  const [localSearch,      setLocalSearch]      = useState('')
  const searchQuery = searchVal !== undefined ? searchVal : localSearch
  const setSearchQuery = onSearchChange !== undefined ? onSearchChange : setLocalSearch
  const [showSearch,       setShowSearch]       = useState(false)
  const [recentSearches,   setRecentSearches]   = useState(['React', 'Docker', 'DSA', 'SQL'])
  const popularSuggestions = [
    { label: 'Become a Full Stack Developer', path: '/courses' },
    { label: 'Practice Data Structures (Daily Challenge)', path: '/courses' },
    { label: 'Track productivity & streak goals', path: '/productivity' }
  ]

  // Redirect if not logged in
  useEffect(() => { if (!user) navigate('/') }, [user])

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = () => {
      setShowNotifications(false)
      setShowProfileMenu(false)
      setShowSearch(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  const studentName  = user?.displayName || 'Student'
  const userInitials = studentName.charAt(0).toUpperCase()

  const currentPage = allPages.find(p => p.path === location.pathname)
  const headerTitle = title || currentPage?.label || ''

  const filteredPages = searchQuery.trim()
    ? allPages.filter(p => p.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : allPages

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>

      {/* ── LEFT SIDEBAR ── */}
      <aside style={{
        width: 260,
        background: '#fff',
        borderRight: '1px solid #E2E8F0',
        display: sidebarOpen ? 'flex' : 'none',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'fixed',
        top: 0, bottom: 0, left: 0,
        zIndex: 50,
        padding: '20px 14px',
        transition: 'all 0.25s ease-in-out',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}>

        {/* TOP: Logo + Nav */}
        <div>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 6px 20px', borderBottom: '1px solid #F1F5F9', marginBottom: 8 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: 'linear-gradient(135deg, #6366F1, #7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 19, fontWeight: 900, flexShrink: 0,
              boxShadow: '0 4px 10px rgba(99,102,241,0.2)'
            }}>Z</div>
            <div>
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 15.5, fontWeight: 800, color: '#1E293B', display: 'block', lineHeight: 1.2 }}>
                ZenScore <span style={{ color: '#7C3AED' }}>AI</span>
              </span>
              <span style={{ fontSize: 9.5, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Student Ecosystem</span>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { to: '/dashboard',    Icon: LayoutDashboard, label: 'Dashboard'   },
              { to: '/courses',      Icon: BookOpen,        label: 'Courses'     },
              { to: '/academics',    Icon: GraduationCap,   label: 'Academics'   },
              { to: '/careers',      Icon: Briefcase,       label: 'Careers'     },
              { to: '/skills',       Icon: Cpu,             label: 'Skills'      },
              { to: '/jobs',         Icon: Building2,       label: 'Jobs'        },
              { to: '/productivity', Icon: Clock,           label: 'Productivity'},
              { to: '/ai-tutor',     Icon: Bot,             label: 'AI Tutor'    },
            ].map(({ to, Icon, label }) => {
              const isActive = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 11,
                    padding: '10px 14px', borderRadius: 11,
                    fontSize: 13.5,
                    fontWeight: isActive ? 700 : 500,
                    background: isActive ? '#4F46E5' : 'transparent',
                    color: isActive ? '#fff' : '#64748B',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                    boxShadow: isActive ? '0 4px 12px rgba(79,70,229,0.15)' : 'none',
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = '#1E293B' } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B' } }}
                >
                  <Icon size={17} strokeWidth={isActive ? 2.5 : 2} />
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* BOTTOM: Upgrade + Profile */}
        <div style={{ marginTop: 24 }}>
          {/* Upgrade Card */}
          <div style={{
            background: 'linear-gradient(135deg, #EDE9FE 0%, #F3F0FF 100%)',
            borderRadius: 16, padding: '16px 14px', marginBottom: 14,
            textAlign: 'center', border: '1px solid #DDD6FE'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 5 }}>
              <Sparkles size={13} style={{ color: '#7C3AED' }} />
              <span style={{ fontSize: 11.5, fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Upgrade to Pro</span>
            </div>
            <p style={{ fontSize: 11, color: '#64748B', lineHeight: 1.55, margin: '0 0 12px' }}>
              Unlock advanced analytics, AI insights and more.
            </p>
            <button style={{
              width: '100%', height: 34, borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg, #6366F1, #7C3AED)',
              color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 3px 10px rgba(99,102,241,0.3)', transition: 'opacity 0.15s'
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >Upgrade Now</button>
          </div>

          {/* Profile Card */}
          <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 14, position: 'relative' }}>
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', background: '#F8FAFC', borderRadius: 14,
                padding: '10px 12px', border: '1px solid #F1F5F9', transition: 'background 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
              onMouseLeave={e => e.currentTarget.style.background = '#F8FAFC'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #EC4899, #F43F5E)',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 14, flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(236,72,153,0.2)'
                }}>{userInitials}</span>
                <div style={{ textAlign: 'left' }}>
                  <span style={{ display: 'block', fontSize: 13, fontFamily: 'Sora, sans-serif', fontWeight: 700, color: '#1E293B', lineHeight: 1.2 }}>
                    {studentName.split(' ')[0]}
                  </span>
                  <span style={{ display: 'block', fontSize: 10.5, color: '#94A3B8', fontWeight: 500 }}>View Profile</span>
                </div>
              </div>
              <ChevronDown size={14} style={{
                color: '#94A3B8',
                transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s'
              }} />
            </div>

            {showDropdown && (
              <div style={{
                position: 'absolute', bottom: 58, left: 0, right: 0,
                background: '#fff', border: '1px solid #E2E8F0',
                borderRadius: 12, padding: 6,
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 60
              }}>
                <button
                  onClick={logout}
                  style={{ width: '100%', height: 36, background: 'none', border: 'none', borderRadius: 8, color: '#EF4444', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px' }}
                >
                  🚪 Switch Account / Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <main style={{
        flex: 1,
        paddingLeft: sidebarOpen ? 260 : 0,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        transition: 'padding-left 0.25s ease-in-out'
      }}>

        {/* ── TOP HEADER ── */}
        <header style={{
          height: 72, background: '#fff', borderBottom: '1px solid #E2E8F0',
          padding: '0 32px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 40
        }}>
          {/* Left: Hamburger + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', padding: 0 }}
            >
              <Menu size={20} strokeWidth={2.5} />
            </button>
            {headerTitle && (
              <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 800, color: '#1E293B', margin: 0, letterSpacing: '-0.5px' }}>
                {headerTitle}
              </h1>
            )}
          </div>

          {/* Center: Search */}
          <div style={{ position: 'relative', flex: '0 1 380px' }} onClick={e => e.stopPropagation()}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder={headerTitle === "Courses" ? "Search courses, topics or skills..." : "Search anything..."}
                value={searchQuery}
                onFocus={() => setShowSearch(true)}
                onChange={e => { setSearchQuery(e.target.value); setShowSearch(true) }}
                style={{
                  width: '100%', height: 42,
                  padding: searchQuery ? '0 44px 0 44px' : '0 40px 0 44px',
                  background: '#F1F5F9',
                  border: showSearch ? '1.5px solid #4F46E5' : '1.5px solid transparent',
                  borderRadius: 12, fontSize: 13.5, outline: 'none',
                  fontWeight: 500, color: '#1E293B', transition: 'all 0.2s'
                }}
              />
              <Search
                size={15}
                style={{
                  color: showSearch ? '#4F46E5' : '#94A3B8',
                  position: 'absolute',
                  left: 16,
                  top: 13,
                  pointerEvents: 'none',
                  transform: showSearch ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.2s, color 0.2s'
                }}
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute', right: 12, top: 10,
                    width: 22, height: 22, borderRadius: '50%',
                    background: '#E2E8F0', color: '#64748B',
                    border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', fontSize: 11, fontWeight: 700
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#CBD5E1'}
                  onMouseLeave={e => e.currentTarget.style.background = '#E2E8F0'}
                >
                  ✕
                </button>
              ) : (
                <span style={{ position: 'absolute', right: 12, top: 11, padding: '2px 6px', fontSize: 9.5, fontWeight: 700, color: '#94A3B8', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 4 }}>⌘ K</span>
              )}
            </div>

            {showSearch && (
              <div style={{
                position: 'absolute', top: 48, left: 0, right: 0,
                background: '#fff', border: '1px solid #E2E8F0',
                borderRadius: 16, boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
                zIndex: 100, overflow: 'hidden'
              }}>
                {searchQuery ? (
                  <>
                    <div style={{ padding: '10px 14px 6px', fontSize: 10.5, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Results
                    </div>
                    {filteredPages.length === 0
                      ? <div style={{ padding: '16px 14px', fontSize: 13, color: '#94A3B8', textAlign: 'center' }}>No results found</div>
                      : filteredPages.map(p => (
                        <div
                          key={p.path}
                          onClick={() => { navigate(p.path); setShowSearch(false); setSearchQuery('') }}
                          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', cursor: 'pointer', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <span style={{ fontSize: 18 }}>{p.icon}</span>
                          <span style={{ fontSize: 13.5, fontWeight: 600, color: '#1E293B' }}>{p.label}</span>
                          <span style={{ marginLeft: 'auto', fontSize: 11, color: '#CBD5E1' }}>→</span>
                        </div>
                      ))
                    }
                  </>
                ) : (
                  <>
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                        <div style={{ padding: '10px 14px 6px', fontSize: 10.5, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Recent Searches
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '4px 14px 10px' }}>
                          {recentSearches.map(term => (
                            <span
                              key={term}
                              onClick={() => setSearchQuery(term)}
                              style={{
                                fontSize: 11.5, fontWeight: 600, color: '#4F46E5',
                                background: '#EEF2FF', padding: '4px 10px', borderRadius: 8,
                                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
                                transition: 'background 0.15s'
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = '#E0E7FF'}
                              onMouseLeave={e => e.currentTarget.style.background = '#EEF2FF'}
                            >
                              🔍 {term}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Popular Suggestions */}
                    <div>
                      <div style={{ padding: '10px 14px 6px', fontSize: 10.5, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Popular Suggestions
                      </div>
                      {popularSuggestions.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => { navigate(item.path); setShowSearch(false) }}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <span style={{ fontSize: 14.5, color: '#7C3AED' }}>⚡</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{item.label}</span>
                          <span style={{ marginLeft: 'auto', fontSize: 10.5, color: '#CBD5E1' }}>Navigate</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div style={{ borderTop: '1px solid #F1F5F9', padding: '8px 14px', display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 10.5, color: '#94A3B8' }}>Press</span>
                  <kbd style={{ fontSize: 10, background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 4, padding: '1px 5px', color: '#64748B', fontFamily: 'monospace' }}>Enter</kbd>
                  <span style={{ fontSize: 10.5, color: '#94A3B8' }}>to navigate</span>
                </div>
              </div>
            )}
          </div>

          {/* Right actions: Streak + Bell + Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* Streak Counter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Flame size={20} style={{ color: '#EA580C' }} fill="#EA580C" />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#1E293B' }}>12</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#64748B' }}>Day Streak</span>
              </div>
            </div>

            {/* Bell */}
            <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
              <div
                onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false) }}
                style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: showNotifications ? '#EEF2FF' : '#F8FAFC',
                  border: '1.5px solid #E2E8F0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', position: 'relative', transition: 'all 0.15s'
                }}
              >
                <Bell size={18} style={{ color: showNotifications ? '#6366F1' : '#64748B' }} />
                <span style={{
                  position: 'absolute', top: -3, right: -3,
                  width: 16, height: 16, background: '#EF4444', color: '#fff',
                  borderRadius: '50%', fontSize: 9, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid #fff'
                }}>3</span>
              </div>

              {showNotifications && (
                <div style={{
                  position: 'absolute', top: 50, right: 0, width: 340,
                  background: '#fff', border: '1px solid #E2E8F0',
                  borderRadius: 18, boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
                  zIndex: 100, overflow: 'hidden'
                }}>
                  <div style={{ padding: '16px 18px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9' }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#1E293B', fontFamily: 'Sora, sans-serif' }}>Notifications</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#6366F1', cursor: 'pointer' }}>Mark all read</span>
                  </div>
                  {sampleNotifications.map(n => (
                    <div
                      key={n.id}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                        padding: '13px 18px',
                        background: n.unread ? '#FAFBFF' : '#fff',
                        borderBottom: '1px solid #F8FAFC', cursor: 'pointer', transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
                      onMouseLeave={e => e.currentTarget.style.background = n.unread ? '#FAFBFF' : '#fff'}
                    >
                      <span style={{ fontSize: 22, flexShrink: 0 }}>{n.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: 2 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>{n.title}</span>
                          {n.unread && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#6366F1', flexShrink: 0 }} />}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748B', marginBottom: 3 }}>{n.desc}</div>
                        <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ padding: '12px 18px', textAlign: 'center' }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: '#6366F1', cursor: 'pointer' }}>View all notifications →</span>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
              <div
                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false) }}
                style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: '#6366F1',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 15, cursor: 'pointer', flexShrink: 0,
                  boxShadow: showProfileMenu ? '0 0 0 3px rgba(99,102,241,0.25)' : '0 2px 8px rgba(79,70,229,0.2)',
                  transition: 'box-shadow 0.2s'
                }}
              >{userInitials}</div>

              {showProfileMenu && (
                <div style={{
                  position: 'absolute', top: 50, right: 0, width: 220,
                  background: '#fff', border: '1px solid #E2E8F0',
                  borderRadius: 16, boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
                  zIndex: 100, overflow: 'hidden'
                }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 14, flexShrink: 0
                    }}>{userInitials}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B', fontFamily: 'Sora, sans-serif' }}>{studentName}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>{user?.email}</div>
                    </div>
                  </div>
                  {[
                    { icon: '🏠', label: 'Dashboard', action: () => navigate('/dashboard') },
                    { icon: '👤', label: 'My Profile', action: () => navigate('/profile') },
                    { icon: '⚙️', label: 'Settings',   action: () => navigate('/settings')  },
                  ].map(item => (
                    <div
                      key={item.label}
                      onClick={() => { item.action(); setShowProfileMenu(false) }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', cursor: 'pointer', fontSize: 13.5, fontWeight: 500, color: '#334155', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ fontSize: 16 }}>{item.icon}</span>
                      {item.label}
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid #FEE2E2', margin: '4px 0' }} />
                  <div
                    onClick={() => { logout(); setShowProfileMenu(false) }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, color: '#EF4444', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FFF5F5'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontSize: 16 }}>🚪</span>
                    Logout
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </div>

      </main>
    </div>
  )
}
