import { Sparkles, GraduationCap, TrendingUp, Rocket } from 'lucide-react'

const blocks = [
  { 
    Icon: Sparkles, 
    bg: '#EFF6FF', 
    color: '#2563EB',
    title: 'AI Driven', 
    desc: 'Every recommendation, prediction, and roadmap is powered by our proprietary AI engine trained on millions of student outcomes.' 
  },
  { 
    Icon: GraduationCap, 
    bg: '#F0FDF4', 
    color: '#16A34A',
    title: 'Student Focused', 
    desc: 'Designed from the ground up for students — from first year to final placement, every feature serves your journey.' 
  },
  { 
    Icon: TrendingUp, 
    bg: '#FAF5FF', 
    color: '#9333EA',
    title: 'Data Backed', 
    desc: 'Insights derived from real hiring data, academic patterns, and industry skill demand — not guesswork.' 
  },
  { 
    Icon: Rocket, 
    bg: '#FFF7ED', 
    color: '#EA580C',
    title: 'Career Oriented', 
    desc: 'Everything connects back to your career outcome — scores, skills, and completions all feed your placement profile.' 
  },
]

export default function WhyUs() {
  return (
    <section id="why-zenscore" style={{ background: 'var(--bg-soft)', padding: '96px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center' }}>
          <span style={{ display: 'inline-block', fontSize: 12.5, fontWeight: 700, fontFamily: 'Sora,sans-serif', textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--primary)', marginBottom: 12 }}>Why ZenScore AI</span>
          <h2 style={{ fontFamily: 'Sora,sans-serif', fontSize: 34, fontWeight: 800, color: 'var(--text-dark)', marginBottom: 12, letterSpacing: '-0.8px' }}>Built for the Modern Student</h2>
          <p style={{ fontSize: 17, color: 'var(--text-muted)', maxWidth: 560, lineHeight: 1.65, marginBottom: 48, margin: '0 auto 48px' }}>Four pillars that set ZenScore AI apart from every other student platform.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
          {blocks.map(b => {
            const Icon = b.Icon
            return (
              <div key={b.title} style={{ textAlign: 'center', padding: 8 }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: 20,
                  background: b.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: b.color,
                  margin: '0 auto 16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}>
                  <Icon size={30} strokeWidth={2.2} />
                </div>
                <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--text-dark)', marginBottom: 12 }}>{b.title}</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65 }}>{b.desc}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
