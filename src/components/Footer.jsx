import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background: '#0F172A', color: 'rgba(255,255,255,0.75)', padding: '80px 0 60px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 60 }}>
          <div>
            <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 12 }}>
              ZenScore <span style={{ color: '#06B6D4' }}>AI</span>
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
            {['Documentation', 'Placement Guide', 'Skill Roadmaps', 'Interview Prep', 'Student Forum'].map(l => (
              <a key={l} href="#" style={{ display: 'block', color: 'rgba(255,255,255,0.65)', fontSize: 14, textDecoration: 'none', marginBottom: 8, transition: 'color 0.15s' }}
                onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.65)'}>{l}</a>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Contact</div>
            <a href="mailto:hello@zenscoreai.com" style={{ display: 'block', color: 'rgba(255,255,255,0.65)', fontSize: 14, textDecoration: 'none', marginBottom: 8 }}>zenscoreai@gmail.com</a>
            <a href="#" style={{ display: 'block', color: 'rgba(255,255,255,0.65)', fontSize: 14, textDecoration: 'none', marginBottom: 8 }}>Support Center</a>
            <a href="#" style={{ display: 'block', color: 'rgba(255,255,255,0.65)', fontSize: 14, textDecoration: 'none', marginBottom: 20 }}>Feedback</a>
            <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Follow Us</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {['𝕏','in','yt','ig'].map(s => (
                <a key={s} href="#" style={{
                  width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.7)', fontSize: 13, textDecoration: 'none',
                  transition: 'background 0.18s, color 0.18s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background='#2563EB'; e.currentTarget.style.color='#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='rgba(255,255,255,0.7)' }}
                >{s}</a>
              ))}
            </div>
          </div>
        </div>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '40px 0 24px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
          <span>© 2025 ZenScore AI. All rights reserved.</span>
          <span>Privacy Policy · Terms of Service</span>
        </div>
      </div>
    </footer>
  )
}
