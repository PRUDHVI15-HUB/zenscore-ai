import { Link } from 'react-router-dom'
import ZenScoreLogo from './common/ZenScoreLogo'

export default function Footer() {
  return (
    <footer id="contact-us" style={{ background: '#0F172A', color: 'rgba(255,255,255,0.75)', padding: '80px 0 60px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
          <div>
            <div style={{ marginBottom: 14 }}>
              <ZenScoreLogo size={36} light={true} to="/" />
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>
              Your complete AI-powered student ecosystem. Predict. Prepare. Get Placed.
            </p>
          </div>
          <div>
            <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 20 }}>About</div>
            {['Our Mission', 'How It Works', 'Team', 'Blog', 'Press'].map(l => (
              <a key={l} href="#" style={{ display: 'block', color: 'rgba(255,255,255,0.65)', fontSize: 14, textDecoration: 'none', marginBottom: 8, transition: 'color 0.15s' }}
                onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.65)'}>{l}</a>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Resources</div>
            {[
              { name: 'Skill Roadmaps', path: '/skills' },
              { name: 'Interview Prep', path: '/careers' },
              { name: 'Placement Guide', path: '/jobs' },
              { name: 'Courses & Masterclasses', path: '/courses' },
              { name: 'AI Tutor', path: '/ai-tutor' }
            ].map(l => (
              <Link key={l.name} to={l.path} style={{ display: 'block', color: 'rgba(255,255,255,0.65)', fontSize: 14, textDecoration: 'none', marginBottom: 8, transition: 'color 0.15s' }}
                onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.65)'}>{l.name}</Link>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Contact</div>
            <a href="mailto:zenscoreai@gmail.com" style={{ display: 'block', color: 'rgba(255,255,255,0.65)', fontSize: 14, textDecoration: 'none', marginBottom: 8 }}>zenscoreai@gmail.com</a>
            <Link to="/ai-tutor" style={{ display: 'block', color: 'rgba(255,255,255,0.65)', fontSize: 14, textDecoration: 'none', marginBottom: 8 }}>24/7 AI Assistant</Link>
            <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 15, fontWeight: 700, color: '#fff', marginTop: 16, marginBottom: 12 }}>Ecosystem</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { label: '🎓', path: '/academics', title: 'Academics' },
                { label: '💼', path: '/careers', title: 'Careers' },
                { label: '⚡', path: '/skills', title: 'Skills' },
                { label: '⏱️', path: '/productivity', title: 'Productivity' }
              ].map(s => (
                <Link key={s.label} to={s.path} title={s.title} style={{
                  width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.7)', fontSize: 16, textDecoration: 'none',
                  transition: 'background 0.18s, color 0.18s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background='#4F46E5'; e.currentTarget.style.color='#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='rgba(255,255,255,0.7)' }}
                >{s.label}</Link>
              ))}
            </div>
          </div>
        </div>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '40px 0 24px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
          <span>© 2026 ZenScore AI. All rights reserved.</span>
          <span>Privacy Policy · Terms of Service · Student Ecosystem</span>
        </div>
      </div>
    </footer>
  )
}
