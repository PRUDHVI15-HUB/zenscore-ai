import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const courses = [
  { title: 'Data Structures & Algorithms', duration: '48 Hours', badge: 'New', badgeBg: '#DBEAFE', badgeColor: '#1D4ED8', thumbBg: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)', icon: '🖥️' },
  { title: 'AI & Machine Learning Basics', duration: '36 Hours', badge: 'Trending', badgeBg: '#EDE9FE', badgeColor: '#7C3AED', thumbBg: 'linear-gradient(135deg,#FDF4FF,#EDE9FE)', icon: '🤖' },
  { title: 'Aptitude & Reasoning Mastery', duration: '28 Hours', badge: 'Popular', badgeBg: '#DCFCE7', badgeColor: '#15803D', thumbBg: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)', icon: '📊' },
  { title: 'Full Stack Web Development', duration: '60 Hours', badge: 'Hot', badgeBg: '#FED7AA', badgeColor: '#C2410C', thumbBg: 'linear-gradient(135deg,#FFF7ED,#FED7AA)', icon: '🌐' },
  { title: 'Communication & Soft Skills', duration: '20 Hours', badge: 'Beginner', badgeBg: '#BAE6FD', badgeColor: '#0369A1', thumbBg: 'linear-gradient(135deg,#F0F9FF,#BAE6FD)', icon: '🗣️' },
  { title: 'Campus Placement Bootcamp', duration: '52 Hours', badge: 'Premium', badgeBg: '#FECDD3', badgeColor: '#BE123C', thumbBg: 'linear-gradient(135deg,#FFF1F2,#FECDD3)', icon: '🏢' },
]

export default function CoursesGrid() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleClick = () => {
    if (user) {
      navigate('/courses')
    } else {
      navigate('/login')
    }
  }

  return (
    <section style={{ padding: '96px 0' }} id="careers">
      <div className="container">
        <span style={{ display: 'inline-block', fontSize: 12.5, fontWeight: 700, fontFamily: 'Sora,sans-serif', textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--primary)', marginBottom: 12 }}>Top Picks</span>
        <h2 style={{ fontFamily: 'Sora,sans-serif', fontSize: 34, fontWeight: 800, color: 'var(--text-dark)', marginBottom: 12, letterSpacing: '-0.8px' }}>Popular Student Courses</h2>
        <p style={{ fontSize: 17, color: 'var(--text-muted)', maxWidth: 560, lineHeight: 1.65, marginBottom: 48 }}>
          Curated programs aligned to top company hiring patterns and skill requirements.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {courses.map(c => (
            <div key={c.title}
              onClick={handleClick}
              style={{
                background: '#fff', borderRadius: 20,
                border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
                overflow: 'hidden', display: 'flex', flexDirection: 'column',
                height: 260, transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='var(--shadow-lg)' }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='var(--shadow-sm)' }}
            >
              <div style={{ height: 110, background: c.thumbBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, position: 'relative' }}>
                {c.icon}
                <span style={{ position: 'absolute', top: 10, right: 10, fontSize: 11, fontWeight: 700, fontFamily: 'Sora,sans-serif', padding: '3px 9px', borderRadius: 7, background: c.badgeBg, color: c.badgeColor }}>{c.badge}</span>
              </div>
              <div style={{ flex: 1, padding: '16px 16px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 15, fontWeight: 700, color: 'var(--text-dark)', marginBottom: 6 }}>{c.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 10 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {c.duration}
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); handleClick() }}
                  style={{
                    height: 36, padding: '0 18px', borderRadius: 10,
                    border: '1.5px solid var(--primary)', background: 'transparent',
                    color: 'var(--primary)', fontSize: 13, fontWeight: 600,
                    fontFamily: 'Sora,sans-serif', cursor: 'pointer', alignSelf: 'flex-start',
                    transition: 'background 0.18s, color 0.18s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background='var(--primary)'; e.currentTarget.style.color='#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--primary)' }}
                >{user ? 'Enroll Now' : '🔒 Login to Enroll'}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}