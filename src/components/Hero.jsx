import { useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Hero() {
  const { loginWithGoogle, user } = useAuth()
  const ref = useRef()
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    setTimeout(() => el.classList.add('visible'), 100)
  }, [])

  return (
    <section className="hero-section" style={{
      minHeight: 'calc(100vh - 72px)',
      background: 'linear-gradient(135deg, #F0F6FF 0%, #FAF5FF 50%, #F0FDFB 100%)',
      display: 'flex', alignItems: 'center', padding: isMobile ? '40px 0' : '80px 0'
    }}>
      <div ref={ref} className="fade-up container hero-grid" style={{
        display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '52% 48%', gap: isMobile ? 32 : 48, alignItems: 'center',
        width: '100%'
      }}>
        {/* LEFT */}
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#EFF6FF', color: 'var(--primary)',
            fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 20,
            marginBottom: 20, fontFamily: 'Sora, sans-serif'
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
            AI-Powered Platform
          </div>

          <h1 className="hero-title" style={{
            fontFamily: 'Sora, sans-serif', fontSize: isMobile ? 32 : 48, fontWeight: 800,
            lineHeight: 1.15, color: 'var(--text-dark)', maxWidth: 540,
            marginBottom: 20, letterSpacing: '-1px'
          }}>
            Your Complete{' '}
            <span style={{ color: 'var(--primary)' }}>AI-Powered</span>{' '}
            Student Ecosystem
          </h1>

          <p className="hero-subtitle" style={{ fontSize: 18, color: 'var(--text-mid)', maxWidth: 500, lineHeight: 1.65, marginBottom: 32 }}>
            Predict performance. Prepare smarter. Get placed faster.
          </p>

          <button
            onClick={user ? () => window.location.href='/dashboard' : loginWithGoogle}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--primary)', color: '#fff',
              fontFamily: 'Sora, sans-serif', fontWeight: 600, fontSize: 15,
              height: 48, padding: '0 28px', borderRadius: 14,
              border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(37,99,235,0.25)',
              transition: 'background 0.2s, transform 0.15s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background='var(--primary-dark)'; e.currentTarget.style.transform='translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background='var(--primary)'; e.currentTarget.style.transform='translateY(0)' }}
          >
            Explore Platform
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>

          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['AI Academic Predictions', 'Placement Intelligence', 'Skill Roadmaps', 'Job Alerts'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: 'var(--text-mid)', fontWeight: 500 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', background: '#DCFCE7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#16A34A', fontSize: 11, fontWeight: 700, flexShrink: 0
                }}>✓</div>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Dashboard Mockup */}
        <div style={{ position: 'relative' }}>
          <div className="hero-mockup-wrapper" style={{
            width: '100%', minHeight: 420, borderRadius: 24,
            background: 'linear-gradient(145deg, #1E40AF 0%, #2563EB 40%, #7C3AED 100%)',
            padding: 24, position: 'relative', overflow: 'visible',
            boxShadow: '0 24px 64px rgba(37,99,235,0.22)'
          }}>
            <div className="hero-mockup-card" style={{
              background: 'rgba(255,255,255,0.1)', borderRadius: 16,
              padding: 20, height: 360,
              display: 'flex', flexDirection: 'column', gap: 14,
              border: '1px solid rgba(255,255,255,0.15)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Sora,sans-serif', fontSize: 16, fontWeight: 700, color: '#fff' }}>Student Dashboard</span>
                <span style={{ background: 'rgba(6,182,212,0.25)', color: '#67E8F9', fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 8 }}>Live</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {[['94%','Score'],['12','Courses'],['8','Offers']].map(([v,l]) => (
                  <div key={l} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 22, fontWeight: 800, color: '#fff' }}>{v}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[['Aptitude',87],['Coding',72],['Placement',93],['Skills',65]].map(([label, pct]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', width: 70, flexShrink: 0 }}>{label}</span>
                    <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, borderRadius: 4, background: 'linear-gradient(90deg, #06B6D4, #7C3AED)' }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {['A','B','C'].map((l,i) => (
                  <div key={l} style={{
                    width: 28, height: 28, borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.4)',
                    background: i===0 ? 'linear-gradient(135deg,#06B6D4,#2563EB)' : i===1 ? 'linear-gradient(135deg,#7C3AED,#06B6D4)' : 'linear-gradient(135deg,#059669,#06B6D4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, color: '#fff', fontWeight: 700
                  }}>{l}</div>
                ))}
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>+1,240 students active</span>
              </div>
            </div>
          </div>

          {/* Floating card */}
          <div style={{
            position: 'absolute', bottom: -20, right: -20,
            width: 220, background: '#fff', borderRadius: 16,
            boxShadow: '0 16px 48px rgba(15,23,42,0.18)',
            padding: 16, zIndex: 10,
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 110
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <div>
                <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--text-dark)' }}>Placement Score</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Powered by ZenScore AI</div>
              </div>
            </div>
            <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>
              96.4% <span style={{ fontSize: 12, color: '#16A34A', fontWeight: 600 }}>↑ 12%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
