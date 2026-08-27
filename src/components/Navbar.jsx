import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ZenScoreLogo from './common/ZenScoreLogo'
import { 
  ArrowRight, 
  Home, 
  Layers, 
  ShieldCheck, 
  MessageSquare, 
  LayoutDashboard, 
  User, 
  LogOut 
} from 'lucide-react'

const landingNavLinks = [
  { label: 'Home',              id: 'home',               Icon: Home },
  { label: 'Explore Ecosystem', id: 'explore-ecosystem',  Icon: Layers },
  { label: 'Why ZenScore AI',   id: 'why-zenscore',       Icon: ShieldCheck },
  { label: 'Contact Us',        id: 'contact-us',         Icon: MessageSquare },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [location.pathname])

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) setSidebarOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') { setSidebarOpen(false); setProfileOpen(false) }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const handleNavClick = (targetId) => {
    setSidebarOpen(false)
    if (location.pathname !== '/') {
      navigate(`/#${targetId}`)
      setTimeout(() => {
        const el = document.getElementById(targetId)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
      return
    }

    if (targetId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const el = document.getElementById(targetId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Top Navbar */}
      <nav style={{
        height: 64,
        background: '#FFFFFF',
        borderBottom: '1px solid #E8ECF4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '0 14px' : '0 28px',
        gap: 16,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
      }}>

        {/* Hamburger + Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setSidebarOpen(p => !p)}
            aria-label="Toggle navigation menu"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: '1px solid #E8ECF4',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5
            }}
          >
            {[0,1,2].map(i => (
              <div
                key={i}
                style={{
                  width: 18,
                  height: 2,
                  background: '#334155',
                  borderRadius: 2,
                  transition: 'all 0.3s',
                  transform: sidebarOpen
                    ? (i === 0 ? 'rotate(45deg) translate(5px,5px)' : i === 2 ? 'rotate(-45deg) translate(5px,-5px)' : 'scaleX(0)')
                    : 'none'
                }}
              />
            ))}
          </button>
          <ZenScoreLogo size={32} to="/" />
        </div>

        {/* Center landing nav links (Hidden on mobile) */}
        <div className="desktop-nav-links" style={{ display: isMobile ? 'none' : 'flex', gap: 8, flex: 1, justifyContent: 'center' }}>
          {landingNavLinks.map(link => {
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                  color: '#475569',
                  transition: 'all 0.15s ease',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#7C3AED'
                  e.currentTarget.style.background = '#F8FAFF'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = '#475569'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {link.label}
              </button>
            )
          })}
        </div>

        {/* Right side CTA: Get Started or Profile Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {!user ? (
            <button
              onClick={() => navigate('/login')}
              style={{
                height: 40,
                padding: isMobile ? '0 16px' : '0 22px',
                borderRadius: 12,
                border: 'none',
                background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 800,
                fontSize: 13,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.28)',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.38)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(124, 58, 237, 0.28)'
              }}
            >
              <span>Get Started</span>
              <ArrowRight size={15} strokeWidth={2.4} />
            </button>
          ) : (
            <div ref={profileRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileOpen(p => !p)}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  border: '2px solid #E8ECF4',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  background: '#7C3AED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {user.photoURL
                  ? <img src={user.photoURL} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Profile" />
                  : <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 14, color: '#FFFFFF' }}>{user.displayName?.[0] || 'U'}</span>}
              </button>
              {profileOpen && (
                <div style={{
                  position: 'absolute',
                  top: 48,
                  right: 0,
                  width: 220,
                  background: '#FFFFFF',
                  border: '1px solid #E8ECF4',
                  borderRadius: 16,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  overflow: 'hidden',
                  zIndex: 200
                }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #E8ECF4' }}>
                    <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{user.displayName || 'Student'}</div>
                    <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                  </div>
                  {[
                    { label: 'Dashboard', path: '/dashboard', Icon: LayoutDashboard },
                    { label: 'Profile',   path: '/profile',   Icon: User }
                  ].map(item => {
                    const ItemIcon = item.Icon
                    return (
                      <div
                        key={item.path}
                        onClick={() => { navigate(item.path); setProfileOpen(false) }}
                        style={{ padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, color: '#334155', fontSize: 14, fontFamily: 'DM Sans, sans-serif' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F8FAFF'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <ItemIcon size={16} strokeWidth={2.2} color="#7C3AED" />
                        <span>{item.label}</span>
                      </div>
                    )
                  })}
                  <div style={{ borderTop: '1px solid #E8ECF4' }}>
                    <div
                      onClick={() => { logout(); setProfileOpen(false) }}
                      style={{ padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, color: '#DC2626', fontSize: 14, fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={16} strokeWidth={2.2} />
                      <span>Logout</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Sidebar backdrop */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 98, backdropFilter: 'blur(2px)' }} />}

      {/* Sidebar Drawer */}
      <div style={{
        position: 'fixed',
        top: 64,
        left: 0,
        height: 'calc(100vh - 64px)',
        width: 260,
        background: '#FFFFFF',
        borderRight: '1px solid #E8ECF4',
        zIndex: 99,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 12px',
        boxShadow: '4px 0 24px rgba(0,0,0,0.08)'
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.2, padding: '4px 8px', marginBottom: 8 }}>Landing Navigation</div>
        {landingNavLinks.map(link => {
          const LinkIcon = link.Icon
          return (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              style={{
                background: 'transparent',
                border: 'none',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 12,
                marginBottom: 2,
                color: '#334155',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 14,
                fontWeight: 600,
                transition: 'all 0.15s',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#F8FAFF'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <LinkIcon size={18} strokeWidth={2.2} color="#7C3AED" />
              <span>{link.label}</span>
            </button>
          )
        })}
        <div style={{ marginTop: 'auto', borderTop: '1px solid #E8ECF4', paddingTop: 16 }}>
          <button
            onClick={() => { setSidebarOpen(false); navigate('/login') }}
            style={{
              width: '100%',
              height: 40,
              borderRadius: 12,
              border: 'none',
              background: 'linear-gradient(135deg,#2563EB,#7C3AED)',
              color: '#FFFFFF',
              fontFamily: 'Sora, sans-serif',
              fontSize: 13.5,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            <span>Get Started</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </>
  )
}