import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

import ZenScoreIcon from './common/ZenScoreIcon'
import AICareerCopilot from './careers/copilot/AICareerCopilot'
import GlobalSearchModal from './common/GlobalSearchModal'
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
  Menu,
  X,
  Sun,
  Moon,
  User as UserIcon,
  Settings,
  LogOut,
  CheckCheck,
  ArrowRight,
  MessageSquareHeart
} from 'lucide-react'


const allPages = [
  { label: 'Dashboard',    path: '/dashboard',    icon: '🏠' },
  { label: 'Academics',    path: '/academics',    icon: '🎓' },
  { label: 'Careers',      path: '/careers',      icon: '💼' },
  { label: 'Skills',       path: '/skills',       icon: '⚡' },
  { label: 'Courses',      path: '/courses',      icon: '📚' },
  { label: 'Jobs',         path: '/jobs',         icon: '🏢' },
  { label: 'Productivity', path: '/productivity', icon: '⏱️' },
  { label: 'AI Tutor',     path: '/ai-tutor',     icon: '🤖' },
  { label: 'Feedback',     path: '/feedback',     icon: '📝' },
]

import {
  getGlobalNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '../services/api'

export default function AppLayout({ children, title, searchVal, onSearchChange }) {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  const [isTablet, setIsTablet] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 && window.innerWidth < 1024 : false)
  const [sidebarOpen, setSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true)

  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('zenscore_sidebar_collapsed')
      if (stored !== null) return stored === 'true'
    }
    return false
  })
  const [activeTooltip, setActiveTooltip] = useState(null)

  const [showDropdown,     setShowDropdown]     = useState(false)
  const [showNotifications,setShowNotifications]= useState(false)
  const [showProfileMenu,  setShowProfileMenu]  = useState(false)
  const profileMenuRef = useRef(null)

  // Live Notification System State
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)
  const [notificationsError, setNotificationsError] = useState(null)
  const notificationsRef = useRef(null)

  // Real relative timestamp calculation
  const formatRelativeTime = (dateInput) => {
    if (!dateInput) return ''
    const date = new Date(dateInput)
    const now = new Date()
    const diffMs = now - date
    const diffSec = Math.floor(diffMs / 1000)
    if (diffSec < 60) return 'Just now'
    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) return `${diffMin}m ago`
    const diffHrs = Math.floor(diffMin / 60)
    if (diffHrs < 24) return `${diffHrs}h ago`
    const diffDays = Math.floor(diffHrs / 24)
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!user) return
    try {
      const count = await getUnreadNotificationCount()
      setUnreadCount(typeof count === 'number' ? count : 0)
    } catch (_) {}
  }, [user])

  // Fetch notifications list
  const fetchNotificationsList = useCallback(async () => {
    if (!user) return
    setIsLoadingNotifications(true)
    setNotificationsError(null)
    try {
      const res = await getGlobalNotifications({ limit: 20 })
      if (res?.success) {
        setNotifications(res.notifications || [])
        if (typeof res.unreadCount === 'number') {
          setUnreadCount(res.unreadCount)
        }
      } else {
        setNotificationsError('Unable to load')
      }
    } catch (err) {
      setNotificationsError('Temporarily unavailable')
    } finally {
      setIsLoadingNotifications(false)
    }
  }, [user])

  // Periodic unread count fetch (60s)
  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 60000)
    return () => clearInterval(interval)
  }, [fetchUnreadCount])

  // Fetch on drawer open
  useEffect(() => {
    if (showNotifications) {
      fetchNotificationsList()
    }
  }, [showNotifications, fetchNotificationsList])

  // Click outside to close notification dropdown & profile menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setShowNotifications(false)
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false)
      }
    }
    if (showNotifications || showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showNotifications, showProfileMenu])

  // Handle clicking a notification
  const handleNotificationClick = async (n) => {
    if (!n.isRead) {
      setNotifications(prev => prev.map(item => item._id === n._id ? { ...item, isRead: true } : item))
      setUnreadCount(prev => Math.max(0, prev - 1))
      try {
        await markNotificationAsRead(n._id)
      } catch (_) {}
    }
    setShowNotifications(false)
    if (n.route) {
      navigate(n.route)
    }
  }

  // Handle mark all read
  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(item => ({ ...item, isRead: true })))
    setUnreadCount(0)
    try {
      await markAllNotificationsAsRead()
    } catch (_) {}
  }


  // Global Contextual Search Modal State
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [searchModalQuery, setSearchModalQuery] = useState('')

  // Global Keyboard Shortcut: ⌘K or Ctrl+K
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsSearchModalOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth
      const mobile = w < 768
      const tablet = w >= 768 && w < 1024
      setIsMobile(mobile)
      setIsTablet(tablet)
      if (w < 1024) setSidebarOpen(false)
      else setSidebarOpen(true)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleToggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(prev => !prev)
    } else {
      setIsCollapsed(prev => {
        const next = !prev
        if (typeof window !== 'undefined') {
          localStorage.setItem('zenscore_sidebar_collapsed', String(next))
        }
        return next
      })
    }
  }

  // Dynamic header title from pathname
  const getHeaderTitle = () => {
    if (title) return title
    const p = location.pathname
    if (p.startsWith('/dashboard')) return 'Dashboard'
    if (p.startsWith('/academics')) return 'Academics'
    if (p.startsWith('/careers'))   return 'Careers'
    if (p.startsWith('/skills'))    return 'Skills'
    if (p.startsWith('/jobs'))      return 'Jobs'
    if (p.startsWith('/productivity')) return 'Productivity'
    if (p.startsWith('/courses'))   return 'Courses'
    if (p.startsWith('/ai-tutor'))   return 'AI Tutor'
    if (p.startsWith('/feedback'))  return 'Feedback Survey'
    if (p.startsWith('/profile'))   return 'Profile'
    if (p.startsWith('/study-groups')) return 'Study Groups'
    return 'ZenScore AI'
  }

  const activePageLabel = getHeaderTitle()

  const navLinks = [
    { to: '/dashboard',    Icon: LayoutDashboard,    label: 'Dashboard'    },
    { to: '/academics',    Icon: GraduationCap,      label: 'Academics'    },
    { to: '/careers',      Icon: Briefcase,          label: 'Careers'      },
    { to: '/skills',       Icon: Cpu,                label: 'Skills'       },
    { to: '/courses',      Icon: BookOpen,           label: 'Courses'      },
    { to: '/jobs',         Icon: Building2,          label: 'Jobs'         },
    { to: '/productivity', Icon: Clock,              label: 'Productivity' },
    { to: '/ai-tutor',     Icon: Bot,                label: 'AI Tutor'     },
    { to: '/feedback',     Icon: MessageSquareHeart, label: 'Feedback'     },
  ]

  const userInitial = user?.displayName
    ? user.displayName[0].toUpperCase()
    : user?.email
      ? user.email[0].toUpperCase()
      : 'U'

  const resolveUserAvatar = () => {
    try {
      if (typeof window === 'undefined') return null
      const uid = user?.uid || user?.id || null
      if (!uid) return user?.photoURL || null

      const uidStored = localStorage.getItem(`zs_user_avatar_${uid}`)
      if (uidStored) return uidStored

      const personal = localStorage.getItem(`zs_personal_data_${uid}`)
      if (personal) {
        try {
          const parsed = JSON.parse(personal)
          if (parsed.photoUrl) return parsed.photoUrl
        } catch {}
      }

      return user?.photoURL || null
    } catch {
      return user?.photoURL || null
    }
  }

  const [avatarUrl, setAvatarUrl] = useState(() => resolveUserAvatar())

  useEffect(() => {
    const resolved = resolveUserAvatar()
    if (resolved) {
      setAvatarUrl(resolved)
    } else if (user?.photoURL) {
      setAvatarUrl(user.photoURL)
    }
  }, [user])

  useEffect(() => {
    const handleAvatarUpdate = (e) => {
      if (e?.detail?.photoUrl) {
        setAvatarUrl(e.detail.photoUrl)
      } else {
        const resolved = resolveUserAvatar()
        if (resolved) setAvatarUrl(resolved)
      }
    }
    window.addEventListener('zenscore:avatar_updated', handleAvatarUpdate)
    return () => window.removeEventListener('zenscore:avatar_updated', handleAvatarUpdate)
  }, [user])


  const currentSidebarWidth = isMobile ? (sidebarOpen ? 250 : 0) : (isCollapsed ? 72 : 250)

  // Dark Theme Palette Tokens (Neutral Dark Charcoal)
  const themeStyles = {
    bgApp: isDark ? '#0B0B0E' : '#F8FAFC',
    bgSidebar: isDark ? '#121216' : '#FFFFFF',
    borderSidebar: isDark ? '#2A2A32' : '#E2E8F0',
    bgHeader: isDark ? '#121216' : '#FFFFFF',
    borderHeader: isDark ? '#2A2A32' : '#E2E8F0',
    textPrimary: isDark ? '#F4F4F6' : '#0F172A',
    textSecondary: isDark ? '#A1A1AA' : '#64748B',
    navInactiveBg: 'transparent',
    navInactiveText: isDark ? '#A1A1AA' : '#64748B',
    navHoverBg: isDark ? '#18181D' : '#F8FAFC',
    navHoverText: isDark ? '#F4F4F6' : '#1E293B',
    cardBg: isDark ? '#18181D' : '#FFFFFF',
    cardBorder: isDark ? '#2A2A32' : '#E2E8F0',
    inputBg: isDark ? '#18181D' : '#F8FAFC',
    inputBorder: isDark ? '#2A2A32' : '#E2E8F0',
    dropdownBg: isDark ? '#18181D' : '#FFFFFF',
    dropdownBorder: isDark ? '#2A2A32' : '#E2E8F0',
    tooltipBg: isDark ? '#26262E' : '#0F172A',
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: themeStyles.bgApp, color: themeStyles.textPrimary, fontFamily: 'DM Sans, sans-serif', overflow: 'hidden', transition: 'background-color 0.25s ease, color 0.25s ease' }}>

      {/* ── BACKDROP FOR MOBILE SIDEBAR ── */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            zIndex: 1050,
            transition: 'opacity 0.25s ease'
          }}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: isMobile ? 270 : (isCollapsed ? 72 : 250),
        minWidth: isMobile ? 270 : (isCollapsed ? 72 : 250),
        maxWidth: isMobile ? '80vw' : (isCollapsed ? 72 : 250),
        background: themeStyles.bgSidebar,
        borderRight: `1px solid ${themeStyles.borderSidebar}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: isMobile
          ? '18px 16px'
          : (isCollapsed ? '20px 10px 16px' : '20px 16px 16px'),
        position: isMobile ? 'fixed' : 'relative',
        top: 0, bottom: 0, left: 0,
        zIndex: isMobile ? 1100 : (isCollapsed ? 120 : 20),
        transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
        transition: 'transform 0.28s cubic-bezier(0.33, 1, 0.68, 1), width 0.25s ease, background-color 0.25s ease',
        boxShadow: isMobile && sidebarOpen ? '8px 0 36px rgba(0,0,0,0.35)' : 'none',
        overflow: isCollapsed && !isMobile ? 'visible' : 'auto',
        overflowX: isCollapsed && !isMobile ? 'visible' : 'hidden',
        overflowY: isCollapsed && !isMobile ? 'visible' : 'auto'
      }}>
        <div>
          {/* LOGO & Mobile Close Button */}
          <div style={{
            padding: isCollapsed && !isMobile ? '0' : '0 6px',
            marginBottom: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Link
              to="/dashboard"
              onClick={() => { if (isMobile) setSidebarOpen(false) }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
            >
              <ZenScoreIcon size={isCollapsed && !isMobile ? 34 : 36} />
              {(!isCollapsed || isMobile) && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 17, background: 'linear-gradient(135deg, #6366F1 0%, #A78BFA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
                    ZenScore AI
                  </span>
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: themeStyles.textSecondary, letterSpacing: '0.6px', textTransform: 'uppercase', marginTop: 2 }}>
                    Student Ecosystem
                  </span>
                </div>
              )}
            </Link>

            {/* Close button inside mobile drawer */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close navigation drawer"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: `1px solid ${themeStyles.inputBorder}`,
                  background: themeStyles.inputBg,
                  color: themeStyles.textSecondary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* MAIN NAV LINKS */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', overflow: 'visible' }}>
            {navLinks.map(({ to, Icon, label }) => {
              const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to))
              const showText = !isCollapsed || isMobile
              const isHovered = isCollapsed && activeTooltip === to
              return (
                <div
                  key={to}
                  style={{ position: 'relative', zIndex: isHovered ? 99999 : 1 }}
                  onMouseEnter={() => isCollapsed && !isMobile && setActiveTooltip(to)}
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  <Link
                    to={to}
                    onClick={() => { if (isMobile) setSidebarOpen(false) }}
                    aria-label={label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: isCollapsed && !isMobile ? 'center' : 'flex-start',
                      gap: isCollapsed && !isMobile ? 0 : 11,
                      padding: isCollapsed && !isMobile ? '10px 0' : '10px 14px',
                      width: isCollapsed && !isMobile ? 48 : 'auto',
                      height: isCollapsed && !isMobile ? 44 : 'auto',
                      margin: isCollapsed && !isMobile ? '0 auto' : 0,
                      borderRadius: 12,
                      fontSize: 13.5,
                      fontWeight: isActive ? 700 : 500,
                      background: isActive ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' : themeStyles.navInactiveBg,
                      color: isActive ? '#ffffff' : themeStyles.navInactiveText,
                      textDecoration: 'none',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: isActive ? '0 4px 14px rgba(79,70,229,0.35)' : 'none',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = themeStyles.navHoverBg
                        e.currentTarget.style.color = themeStyles.navHoverText
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = themeStyles.navInactiveBg
                        e.currentTarget.style.color = themeStyles.navInactiveText
                      }
                    }}
                  >
                    <Icon size={19} strokeWidth={isActive ? 2.5 : 2} />
                    {showText && <span>{label}</span>}
                  </Link>

                  {/* FLOATING HOVER TOOLTIP IN COLLAPSED MODE */}
                  {isHovered && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 'calc(100% + 14px)',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: '#0F172A',
                        color: '#FFFFFF',
                        fontFamily: 'Sora, sans-serif',
                        fontSize: 12,
                        fontWeight: 700,
                        padding: '7px 14px',
                        borderRadius: 8,
                        whiteSpace: 'nowrap',
                        zIndex: 999999,
                        pointerEvents: 'none',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid rgba(255,255,255,0.18)'
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          left: -6,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 0,
                          height: 0,
                          borderTop: '6px solid transparent',
                          borderBottom: '6px solid transparent',
                          borderRight: '6px solid #0F172A'
                        }}
                      />
                      {label}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </div>

        {/* BOTTOM: Profile */}
        <div style={{ marginTop: 24 }}>
          {/* User Profile Bar */}
          {!isCollapsed ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderRadius: 14,
                background: isDark ? '#18181D' : '#F8FAFC',
                border: `1px solid ${isDark ? '#2A2A32' : '#E2E8F0'}`,
                transition: 'all 0.18s ease'
              }}
            >
              <div
                onClick={() => { if (isMobile) setSidebarOpen(false); navigate('/profile'); }}
                title="Go to Student Profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  flex: 1,
                  minWidth: 0,
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                  color: '#fff', fontSize: 14, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  overflow: 'hidden'
                }}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={user?.displayName || 'Student'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    userInitial
                  )}
                </div>
                <div style={{ overflow: 'hidden', flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: themeStyles.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.displayName || 'Student'}
                  </div>
                  <div style={{ fontSize: 10.5, color: themeStyles.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.email || 'student@zenscore.ai'}
                  </div>
                </div>
              </div>

              {/* Interactive Quick Logout Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (isMobile) setSidebarOpen(false)
                  logout()
                }}
                title="Logout"
                aria-label="Logout"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  border: 'none',
                  background: 'transparent',
                  color: '#EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'background 0.15s, transform 0.15s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = isDark ? '#311213' : '#FEE2E2'
                  e.currentTarget.style.transform = 'scale(1.1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div
              style={{ position: 'relative', display: 'flex', justifyContent: 'center', zIndex: activeTooltip === 'profile' ? 99999 : 1 }}
              onMouseEnter={() => setActiveTooltip('profile')}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <div
                onClick={() => navigate('/profile')}
                title="Profile & Settings"
                style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                  color: '#fff', fontSize: 14, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(79,70,229,0.3)',
                  overflow: 'hidden',
                  flexShrink: 0
                }}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user?.displayName || 'Student'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  userInitial
                )}
              </div>
              {activeTooltip === 'profile' && (
                <div
                  style={{
                    position: 'absolute',
                    left: 'calc(100% + 14px)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: '#0F172A',
                    color: '#FFFFFF',
                    fontFamily: 'Sora, sans-serif',
                    padding: '8px 12px',
                    borderRadius: 10,
                    whiteSpace: 'nowrap',
                    zIndex: 999999,
                    pointerEvents: 'auto',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    border: '1px solid rgba(255,255,255,0.18)'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: -6,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 0,
                      height: 0,
                      borderTop: '6px solid transparent',
                      borderBottom: '6px solid transparent',
                      borderRight: '6px solid #0F172A'
                    }}
                  />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#FFFFFF' }}>
                      {user?.displayName || 'Student Profile'}
                    </div>
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>
                      {user?.email || 'student@zenscore.ai'}
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 5, display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span
                      onClick={() => navigate('/profile')}
                      style={{ fontSize: 11, color: '#818CF8', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Profile
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); logout(); }}
                      style={{
                        background: 'none', border: 'none', padding: 0,
                        fontSize: 11, color: '#F87171', fontWeight: 700,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
                      }}
                    >
                      <LogOut size={12} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>



      {/* ── MAIN WRAPPER ── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', position: 'relative', background: themeStyles.bgApp, transition: 'background-color 0.25s ease' }}>

        {/* ── TOP HEADER ── */}
        <header style={{
          height: isMobile ? 56 : 64, minHeight: isMobile ? 56 : 64,
          background: themeStyles.bgHeader,
          borderBottom: `1px solid ${themeStyles.borderHeader}`,
          padding: isMobile ? '0 12px' : '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: isMobile ? 8 : 16, zIndex: 10,
          transition: 'background-color 0.25s ease, border-color 0.25s ease'
        }}>
          {/* LEFT: Sidebar Toggle + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 14, minWidth: 0 }}>
            <button
              onClick={handleToggleSidebar}
              aria-label="Toggle Navigation Menu"
              style={{
                background: themeStyles.inputBg,
                border: `1px solid ${themeStyles.inputBorder}`,
                borderRadius: 9, width: 34, height: 34,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: themeStyles.textSecondary,
                flexShrink: 0
              }}
            >
              <Menu size={18} />
            </button>

            <h1 style={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 800,
              fontSize: isMobile ? 16 : 20,
              color: themeStyles.textPrimary,
              margin: 0,
              letterSpacing: '-0.3px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {activePageLabel}
            </h1>
          </div>

          {/* CENTER: Quick Search / Contextual Global Search Modal Trigger (Desktop & Tablet only) */}
          {!isMobile && (
            <div
              onClick={() => {
                setSearchModalQuery(searchVal || '')
                setIsSearchModalOpen(true)
              }}
              style={{
                position: 'relative',
                flex: '0 1 360px',
                cursor: 'pointer'
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: 9,
                background: themeStyles.inputBg,
                border: `1px solid ${themeStyles.inputBorder}`,
                borderRadius: 12, padding: '7px 14px',
                fontSize: 13, color: themeStyles.textSecondary,
                transition: 'border-color 0.15s ease'
              }}>
                <Search size={15} style={{ color: themeStyles.textSecondary }} />
                <span style={{
                  flex: 1,
                  fontSize: 13,
                  color: searchVal ? themeStyles.textPrimary : themeStyles.textSecondary,
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {searchVal || 'Search anything...'}
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, background: isDark ? '#334155' : '#E2E8F0', color: themeStyles.textSecondary, padding: '1px 5px', borderRadius: 4 }}>⌘K</span>
              </div>
            </div>
          )}

          {/* RIGHT: Search (Mobile) + Theme Toggle + Notifications + User Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12, flexShrink: 0 }}>

            {/* Mobile Search Button */}
            {isMobile && (
              <button
                onClick={() => {
                  setSearchModalQuery(searchVal || '')
                  setIsSearchModalOpen(true)
                }}
                aria-label="Open Search"
                style={{
                  background: isDark ? '#18181D' : '#F8FAFC',
                  border: `1px solid ${isDark ? '#2A2A32' : '#E2E8F0'}`,
                  borderRadius: 10, width: 36, height: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: themeStyles.textSecondary
                }}
              >
                <Search size={17} />
              </button>
            )}


            {/* Feedback Survey Button */}
            <Link
              to="/feedback"
              aria-label="Feedback Survey"
              title="Share feedback on ZenScore AI"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: location.pathname === '/feedback'
                  ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)'
                  : (isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.08)'),
                border: `1px solid ${location.pathname === '/feedback' ? '#4F46E5' : (isDark ? 'rgba(99, 102, 241, 0.35)' : 'rgba(99, 102, 241, 0.25)')}`,
                color: location.pathname === '/feedback' ? '#FFFFFF' : (isDark ? '#A5B4FC' : '#4F46E5'),
                padding: isMobile ? '6px 10px' : '6px 12px',
                borderRadius: 10,
                fontSize: 12.5,
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
                boxShadow: location.pathname === '/feedback' ? '0 2px 8px rgba(79,70,229,0.35)' : 'none'
              }}
            >
              <MessageSquareHeart size={16} />
              {!isMobile && <span>Feedback</span>}
            </Link>

            {/* Global Light / Dark Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              style={{
                background: isDark ? '#18181D' : '#F8FAFC',
                border: `1px solid ${isDark ? '#2A2A32' : '#E2E8F0'}`,
                borderRadius: 10,
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: isDark ? '#F59E0B' : '#64748B',
                transition: 'all 0.2s ease',
                boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : 'none'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = isDark ? '#2A2A32' : '#F1F5F9'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = isDark ? '#18181D' : '#F8FAFC'
              }}
            >
              {isDark ? (
                <Sun size={18} strokeWidth={2.2} style={{ color: '#F59E0B' }} />
              ) : (
                <Moon size={18} strokeWidth={2.2} style={{ color: '#64748B' }} />
              )}
            </button>

            {/* Live Notifications */}
            <div ref={notificationsRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(prev => !prev)}
                aria-label="Notifications"
                title="Notifications"
                style={{
                  background: themeStyles.inputBg,
                  border: `1px solid ${themeStyles.inputBorder}`,
                  borderRadius: 10, width: 36, height: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: themeStyles.textSecondary, position: 'relative',
                  transition: 'background 0.15s ease, border-color 0.15s ease'
                }}
              >
                <Bell size={17} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: -3, right: -3,
                    minWidth: 16, height: 16, padding: '0 4px',
                    borderRadius: 8, background: '#EF4444',
                    color: '#FFFFFF', fontSize: 9.5, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1.5px solid ${themeStyles.bgHeader}`,
                    boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)'
                  }}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Drawer Dropdown */}
              {showNotifications && (
                <div style={{
                  position: 'absolute', top: '115%', right: 0, width: 350,
                  maxWidth: 'calc(100vw - 32px)',
                  background: themeStyles.dropdownBg,
                  border: `1px solid ${themeStyles.dropdownBorder}`,
                  borderRadius: 16,
                  boxShadow: '0 16px 40px rgba(0,0,0,0.35)', zIndex: 100, overflow: 'hidden',
                  display: 'flex', flexDirection: 'column'
                }}>
                  {/* Top Header */}
                  <div style={{
                    padding: '12px 16px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderBottom: `1px solid ${themeStyles.dropdownBorder}`,
                    background: isDark ? '#14141A' : '#FAFAFC'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 13.5, color: themeStyles.textPrimary }}>Notifications</span>
                      {unreadCount > 0 ? (
                        <span style={{
                          fontSize: 10.5, fontWeight: 700, padding: '2px 7px',
                          borderRadius: 6, background: '#6366F120', color: '#6366F1'
                        }}>
                          {unreadCount} new
                        </span>
                      ) : (
                        <span style={{
                          fontSize: 10.5, fontWeight: 600, padding: '2px 7px',
                          borderRadius: 6, background: isDark ? '#232238' : '#F1F5F9', color: themeStyles.textSecondary
                        }}>
                          Live
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 ? (
                      <button
                        onClick={handleMarkAllRead}
                        style={{
                          background: 'none', border: 'none', padding: '4px 8px', borderRadius: 6,
                          fontSize: 11.5, color: '#6366F1', fontWeight: 700,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                          transition: 'background 0.15s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = isDark ? '#232238' : '#EEF0FF'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <CheckCheck size={13} />
                        Mark all read
                      </button>
                    ) : (
                      <button
                        onClick={() => { fetchNotificationsList(); fetchUnreadCount(); }}
                        title="Refresh notifications"
                        style={{
                          background: 'none', border: 'none', padding: '2px 6px',
                          fontSize: 11, color: themeStyles.textSecondary, fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Refresh
                      </button>
                    )}
                  </div>

                  {/* Notification List */}
                  <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                    {isLoadingNotifications ? (
                      <div style={{ padding: '28px 16px', textAlign: 'center', fontSize: 12.5, color: themeStyles.textSecondary }}>
                        Loading notifications...
                      </div>
                    ) : notificationsError ? (
                      <div style={{ padding: '28px 16px', textAlign: 'center', fontSize: 12.5, color: themeStyles.textSecondary }}>
                        Notifications temporarily unavailable
                      </div>
                    ) : notifications.length === 0 ? (
                      <div style={{ padding: '36px 20px', textAlign: 'center' }}>
                        <div style={{ fontSize: 26, marginBottom: 6 }}>📭</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: themeStyles.textPrimary, marginBottom: 4 }}>
                          No new notifications
                        </div>
                        <div style={{ fontSize: 11.5, color: themeStyles.textSecondary, lineHeight: 1.4 }}>
                          You're up to date! Real-time alerts for your academics, jobs, and courses will appear here.
                        </div>
                      </div>
                    ) : (
                      notifications.map(n => {
                        const isUnread = !n.isRead
                        return (
                          <div
                            key={n._id || n.id}
                            onClick={() => handleNotificationClick(n)}
                            style={{
                              padding: '12px 16px',
                              borderBottom: `1px solid ${themeStyles.dropdownBorder}`,
                              display: 'flex', gap: 11,
                              background: isUnread ? (isDark ? '#1C1A2E' : '#F4F5FF') : 'transparent',
                              cursor: 'pointer',
                              transition: 'background 0.15s ease'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = isDark ? '#232238' : '#EEF0FF'}
                            onMouseLeave={e => e.currentTarget.style.background = isUnread ? (isDark ? '#1C1A2E' : '#F4F5FF') : 'transparent'}
                          >
                            <span style={{ fontSize: 18, flexShrink: 0, marginTop: 2 }}>
                              {n.icon || '🔔'}
                            </span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{
                                fontSize: 12.5,
                                fontWeight: isUnread ? 700 : 600,
                                color: themeStyles.textPrimary,
                                display: 'flex', alignItems: 'center', gap: 6
                              }}>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {n.title}
                                </span>
                                {isUnread && (
                                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366F1', flexShrink: 0 }} />
                                )}
                              </div>
                              <div style={{
                                fontSize: 11.5,
                                color: themeStyles.textSecondary,
                                marginTop: 2,
                                lineHeight: 1.35,
                                display: '-webkit-box',
                                WebKitLineClamp: 2,
                                WebKitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}>
                                {n.message || n.desc}
                              </div>
                              <div style={{ fontSize: 10, color: themeStyles.textSecondary, marginTop: 4, opacity: 0.85 }}>
                                {formatRelativeTime(n.createdAt || n.time)}
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>

                  {/* Bottom Footer Actions Bar */}
                  <div style={{
                    padding: '10px 16px',
                    borderTop: `1px solid ${themeStyles.dropdownBorder}`,
                    background: isDark ? '#14141A' : '#FAFAFC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ fontSize: 11, color: themeStyles.textSecondary, fontWeight: 600 }}>
                      {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          style={{
                            background: 'none', border: 'none', padding: 0,
                            fontSize: 11.5, color: '#6366F1', fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Mark all read
                        </button>
                      )}
                      <button
                        onClick={() => { setShowNotifications(false); navigate('/academics'); }}
                        style={{
                          background: 'none', border: 'none', padding: 0,
                          fontSize: 11.5, color: '#6366F1', fontWeight: 700,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3
                        }}
                      >
                        View all <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>


            {/* User Profile Menu Dropdown */}
            <div ref={profileMenuRef} style={{ position: 'relative' }}>
              <div
                onClick={() => setShowProfileMenu(prev => !prev)}
                style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                  color: '#fff', fontSize: 14, fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(79,70,229,0.3)',
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={user?.displayName || 'Student'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    userInitial
                  )}
                </div>
                <ChevronDown size={14} style={{ color: themeStyles.textSecondary, transition: 'transform 0.2s', transform: showProfileMenu ? 'rotate(180deg)' : 'none' }} />
              </div>

              {showProfileMenu && (
                <div style={{
                  position: 'absolute', top: '115%', right: 0, width: 220,
                  background: themeStyles.dropdownBg,
                  border: `1px solid ${themeStyles.dropdownBorder}`,
                  borderRadius: 14,
                  boxShadow: '0 16px 40px rgba(0,0,0,0.35)', zIndex: 100, overflow: 'hidden', padding: '6px 0'
                }}>
                  <div style={{ padding: '10px 16px 12px', borderBottom: `1px solid ${themeStyles.dropdownBorder}` }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: themeStyles.textPrimary }}>{user?.displayName || 'Student User'}</div>
                    <div style={{ fontSize: 11, color: themeStyles.textSecondary, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || 'student@zenscore.ai'}</div>
                  </div>
                  {[
                    { label: 'Student Profile',  path: '/profile', icon: <UserIcon size={16} style={{ color: '#6366F1' }} /> },
                    { label: 'Account Settings', path: '/profile?tab=settings', icon: <Settings size={16} style={{ color: '#8B5CF6' }} /> },
                  ].map(item => (
                    <div
                      key={item.path}
                      onClick={() => { navigate(item.path); setShowProfileMenu(false) }}
                      style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: themeStyles.textPrimary, transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = themeStyles.navHoverBg}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: `1px solid ${themeStyles.dropdownBorder}`, margin: '4px 0' }} />
                  <div
                    onClick={() => { logout(); setShowProfileMenu(false) }}
                    style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#EF4444', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = isDark ? '#311213' : '#FFF5F5'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LogOut size={16} style={{ color: '#EF4444' }} /></span>
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

        {/* Global Careers Copilot (Phase 7 Persistent Assistant) */}
        {location.pathname.startsWith('/careers') && <AICareerCopilot />}

        {/* Global Contextual Search Modal */}
        <GlobalSearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          initialQuery={searchModalQuery}
        />

      </main>
    </div>
  )
}

