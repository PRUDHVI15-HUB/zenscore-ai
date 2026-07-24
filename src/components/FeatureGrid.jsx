import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const features = [
  { icon: '📚', title: 'Academics', desc: 'Track CGPA, predict semester scores, and get personalized study plans powered by AI.', bg: '#EFF6FF', path: '/academics' },
  { icon: '💼', title: 'Careers', desc: 'Explore career paths, match your profile to industry roles, and get AI-driven guidance.', bg: '#FDF4FF', path: '/careers' },
  { icon: '⚡', title: 'Skills', desc: 'Follow structured skill roadmaps in coding, communication, and domain expertise.', bg: '#F0FDF4', path: '/skills' },
  { icon: '🔔', title: 'Jobs', desc: 'Receive smart job alerts filtered by your skills, location, and placement readiness score.', bg: '#FFF7ED', path: '/jobs' },
  { icon: '🧠', title: 'Productivity', desc: 'AI-powered focus tools, time-blocking, and performance analytics to keep you on track.', bg: '#F0F9FF', path: '/productivity' },
]

export default function FeatureGrid() {
  const ref = useRef()
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) e.target.classList.add('visible') }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const handleClick = (path) => {
    if (user) {
      navigate(path)
    } else {
      navigate('/login')
    }
  }

  return (
    <section style={{ background: 'var(--bg-soft)', padding: '96px 0' }} id="features">
      <div className="container">
        <div className="fade-up" ref={ref} style={{ textAlign: 'center' }}>
          <span style={{ display: 'inline-block', fontSize: 12.5, fontWeight: 700, fontFamily: 'Sora,sans-serif', textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--primary)', marginBottom: 12 }}>
            Explore Ecosystem
          </span>
          <h2 style={{ fontFamily: 'Sora,sans-serif', fontSize: 34, fontWeight: 800, color: 'var(--text-dark)', marginBottom: 12, letterSpacing: '-0.8px' }}>
            Everything You Need, in One Place
          </h2>
          <p style={{ fontSize: 17, color: 'var(--text-muted)', maxWidth: 560, lineHeight: 1.65, marginBottom: 48, margin: '0 auto 48px' }}>
            From academics to placement — ZenScore AI maps your entire student journey intelligently.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {features.map(f => (
            <div key={f.title}
              onClick={() => handleClick(f.path)}
              style={{
                background: '#fff', borderRadius: 20, padding: '28px 24px', minHeight: 190,
                border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer',
                position: 'relative'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='var(--shadow-lg)' }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='var(--shadow-sm)' }}
            >
              {!user && (
                <div style={{
                  position: 'absolute', top: 10, right: 10,
                  fontSize: 10, fontWeight: 700, fontFamily: 'Sora,sans-serif',
                  padding: '3px 8px', borderRadius: 6,
                  background: '#FEF3C7', color: '#B45309',
                  display: 'flex', alignItems: 'center', gap: 4
                }}>
                  🔒 Login to access
                </div>
              )}
              <div style={{ width: 48, height: 48, borderRadius: 14, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>{f.icon}</div>
              <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--text-dark)', marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</div>
              <div style={{ marginTop: 14, fontSize: 13, fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                Explore {f.title} <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}