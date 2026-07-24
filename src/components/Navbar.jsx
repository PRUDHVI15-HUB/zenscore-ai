import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'Dashboard', path: '/dashboard', icon: '📊' },
  { label: 'Courses', path: '/courses', icon: '🎓' },
  { label: 'Academics', path: '/academics', icon: '📚' },
  { label: 'Careers', path: '/careers', icon: '💼' },
  { label: 'Skills', path: '/skills', icon: '⚡' },
  { label: 'Jobs', path: '/jobs', icon: '🏢' },
  { label: 'Productivity', path: '/productivity', icon: '⏱️' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const profileRef = useRef(null)
  const searchRef = useRef(null)

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [location.pathname])

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === '/' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault(); setSearchOpen(true)
      }
      if (e.key === 'Escape') { setSearchOpen(false); setSidebarOpen(false) }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const filtered = navLinks.filter(l => l.label.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <>
      {/* Top Navbar */}
      <nav style={{ height: 64, background: '#fff', borderBottom: '1px solid #E8ECF4', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>

        {/* Hamburger + Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setSidebarOpen(p => !p)} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #E8ECF4', background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: 18, height: 2, background: '#334155', borderRadius: 2, transition: 'all 0.3s',
                transform: sidebarOpen ? (i === 0 ? 'rotate(45deg) translate(5px,5px)' : i === 2 ? 'rotate(-45deg) translate(5px,-5px)' : 'scaleX(0)') : 'none' }} />
            ))}
          </button>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#7C3AED', display: 'inline-block' }} />
            <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 17, color: '#0F172A' }}>ZenScore <span style={{ color: '#7C3AED' }}>AI</span></span>
          </Link>
        </div>

        {/* Center nav links */}
        <div style={{ display: 'flex', gap: 2, flex: 1, justifyContent: 'center' }}>
          {navLinks.slice(0, 6).map(link => {
            const active = location.pathname === link.path
            return (
              <span key={link.path}
                onClick={() => user ? navigate(link.path) : navigate('/login')}
                style={{ textDecoration: 'none', padding: '6px 14px', borderRadius: 10, fontSize: 13.5, fontFamily: 'DM Sans,sans-serif', fontWeight: active ? 700 : 500, color: active ? '#7C3AED' : '#94A3B8', background: active ? '#F3F0FF' : 'transparent', borderBottom: active ? '2px solid #7C3AED' : '2px solid transparent', transition: 'all 0.15s', cursor: 'pointer' }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#334155'; e.currentTarget.style.background = '#F8FAFF' }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'transparent' }}}>
                {link.label}
              </span>
            )
          })}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

          {/* Search */}
          <div ref={searchRef} style={{ position: 'relative' }}>
            <button onClick={() => setSearchOpen(p => !p)} style={{ height: 36, padding: '0 14px', borderRadius: 10, border: '1px solid #E8ECF4', background: '#F8FAFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: '#94A3B8', fontSize: 13, fontFamily: 'DM Sans,sans-serif' }}>
              🔍 <span>Search</span> <span style={{ fontSize: 11, background: '#E8ECF4', padding: '1px 6px', borderRadius: 5 }}>/</span>
            </button>
            {searchOpen && (
              <div style={{ position: 'absolute', top: 44, right: 0, width: 280, background: '#fff', border: '1px solid #E8ECF4', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', overflow: 'hidden', zIndex: 200 }}>
                <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search pages..." style={{ width: '100%', padding: '12px 16px', border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: '#0F172A', fontFamily: 'DM Sans,sans-serif', borderBottom: '1px solid #E8ECF4', boxSizing: 'border-box' }} />
                {filtered.map(l => (
                  <div key={l.path} onClick={() => { navigate(l.path); setSearchOpen(false); setSearchQuery('') }} style={{ padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, color: '#334155', fontSize: 14, fontFamily: 'DM Sans,sans-serif' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F8FAFF'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <span>{l.icon}</span> {l.label}
                  </div>
                ))}
                {filtered.length === 0 && <div style={{ padding: 16, color: '#94A3B8', fontSize: 13, textAlign: 'center' }}>No results</div>}
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          {!user ? (
  <div style={{ display: 'flex', gap: 8 }}>
    <button onClick={() => navigate('/login')} style={{ height: 36, padding: '0 18px', borderRadius: 10, border: '1.5px solid #E8ECF4', background: 'transparent', color: '#334155', cursor: 'pointer', fontFamily: 'Sora,sans-serif', fontWeight: 600, fontSize: 13 }}>
      Login
    </button>
    <button onClick={() => navigate('/register')} style={{ height: 36, padding: '0 18px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#2563EB,#7C3AED)', color: '#fff', cursor: 'pointer', fontFamily: 'Sora,sans-serif', fontWeight: 600, fontSize: 13 }}>
      Sign Up
    </button>
  </div>
) : (
  <div ref={profileRef} style={{ position: 'relative' }}>
              <button onClick={() => setProfileOpen(p => !p)} style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #E8ECF4', cursor: 'pointer', overflow: 'hidden', background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {user.photoURL
                  ? <img src={user.photoURL} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 14, color: '#fff' }}>{user.displayName?.[0]}</span>}
              </button>
              {profileOpen && (
                <div style={{ position: 'absolute', top: 44, right: 0, width: 220, background: '#fff', border: '1px solid #E8ECF4', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', overflow: 'hidden', zIndex: 200 }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #E8ECF4' }}>
                    <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{user.displayName}</div>
                    <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{user.email}</div>
                  </div>
                  {[['📊', 'Dashboard', '/dashboard'], ['👤', 'Profile', '/profile']].map(([icon, label, path]) => (
                    <div key={path} onClick={() => { navigate(path); setProfileOpen(false) }} style={{ padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, color: '#334155', fontSize: 14, fontFamily: 'DM Sans,sans-serif' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F8FAFF'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      {icon} {label}
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid #E8ECF4' }}>
                    <div onClick={() => { logout(); setProfileOpen(false) }} style={{ padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, color: '#DC2626', fontSize: 14, fontFamily: 'DM Sans,sans-serif' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      🚪 Logout
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

      {/* Sidebar */}
      <div style={{ position: 'fixed', top: 64, left: 0, height: 'calc(100vh - 64px)', width: 260, background: '#fff', borderRight: '1px solid #E8ECF4', zIndex: 99, transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)', display: 'flex', flexDirection: 'column', padding: '16px 12px', boxShadow: '4px 0 24px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.2, padding: '4px 8px', marginBottom: 8 }}>Navigation</div>
        {navLinks.map(link => {
          const active = location.pathname === link.path
          return (
            <span key={link.path}
              onClick={() => { setSidebarOpen(false); user ? navigate(link.path) : navigate('/login') }}
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 12, marginBottom: 2, background: active ? '#F3F0FF' : 'transparent', color: active ? '#7C3AED' : '#334155', fontFamily: 'DM Sans,sans-serif', fontSize: 14, fontWeight: active ? 700 : 500, transition: 'all 0.15s', cursor: 'pointer' }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#F8FAFF' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}>
              <span style={{ fontSize: 18 }}>{link.icon}</span>
              {link.label}
              {active && <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#7C3AED' }} />}
            </span>
          )
        })}
        <div style={{ marginTop: 'auto', borderTop: '1px solid #E8ECF4', paddingTop: 16 }}>
          <span onClick={() => { setSidebarOpen(false); user ? navigate('/ai-tutor') : navigate('/login') }} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 12, background: 'linear-gradient(135deg,rgba(37,99,235,0.1),rgba(124,58,237,0.1))', border: '1px solid rgba(124,58,237,0.2)', color: '#7C3AED', fontFamily: 'DM Sans,sans-serif', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            <span style={{ fontSize: 18 }}>✳️</span> AI Tutor
          </span>
        </div>
      </div>
    </>
  )
}