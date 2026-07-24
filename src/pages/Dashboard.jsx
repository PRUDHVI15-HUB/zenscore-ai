import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAcademicDashboard } from '../services/api'
import AppLayout from '../components/AppLayout'
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
  CalendarDays, 
  AlertCircle, 
  TrendingUp,
  Target,
  Menu
} from 'lucide-react'

const quickLinks = [
  { Icon: GraduationCap, label: 'Academics', path: '/academics', color: '#EFF6FF', accent: '#2563EB', iconBg: '#EFF6FF' },
  { Icon: Briefcase, label: 'Careers', path: '/careers', color: '#F3F0FF', accent: '#7C3AED', iconBg: '#F3F0FF' },
  { Icon: Cpu, label: 'Skills', path: '/skills', color: '#EBFDF5', accent: '#059669', iconBg: '#EBFDF5' },
  { Icon: Building2, label: 'Jobs', path: '/jobs', color: '#FFF7ED', accent: '#D97706', iconBg: '#FFF7ED' },
  { Icon: Clock, label: 'Productivity', path: '/productivity', color: '#FFF1F2', accent: '#DC2626', iconBg: '#FFF1F2' },
  { Icon: GraduationCap, label: 'Courses', path: '/courses', color: '#F0F9FF', accent: '#0284C7', iconBg: '#F0F9FF' },
]

const tips = [
  '💡 Practice DSA daily — even 1 problem a day compounds over time.',
  '🎯 Focus on weak subjects first — small improvements matter most.',
  '📅 Use the Study Plan to stay consistent every week.',
  '🔥 A 7-day study streak boosts retention by 40%.',
  '🤖 Ask AI Tutor anything — it never judges, always helps.',
]

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [academics, setAcademics] = useState(null)
  const [tip] = useState(tips[Math.floor(Math.random() * tips.length)])
  const [time, setTime] = useState(new Date())
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  const studentName = user?.displayName || 'Student'

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => { getAcademicDashboard().then(r => setAcademics(r.data)).catch(() => {}) }, [])
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t) }, [])

  const getGreeting = () => {
    const h = time.getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    if (h < 21) return 'Good evening'
    return 'Good night'
  }

  return (
    <AppLayout>
        {/* Dashboard Content Container */}
        <div style={{ padding: isMobile ? '16px' : '32px', flex: 1, maxWidth: 1140, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: isMobile ? 20 : 32 }}>
          
          {/* Welcome Banner Card */}
          <div style={{ 
            background: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)', 
            borderRadius: 24, 
            padding: isMobile ? '24px 20px' : '36px 40px', 
            boxShadow: '0 10px 30px rgba(79, 70, 229, 0.12)',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            gap: isMobile ? 16 : 0
          }}>
            <div style={{ zIndex: 2 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.75)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {time.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} • {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: isMobile ? 22 : 28, fontWeight: 800, color: '#fff', marginBottom: 8, letterSpacing: '-0.5px' }}>
                {getGreeting()}, {studentName.split(' ')[0]} 👋
              </h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', maxWidth: 460, marginBottom: 20 }}>{tip}</p>
              <button 
                onClick={() => navigate('/ai-tutor')} 
                style={{ height: 40, padding: '0 20px', borderRadius: 12, background: '#fff', border: 'none', color: '#4F46E5', cursor: 'pointer', fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 13, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
              >
                Ask AI Tutor &rarr;
              </button>
            </div>

            {/* Illustration */}
            {!isMobile && (
              <div style={{ zIndex: 2, display: 'flex', alignItems: 'center' }}>
                <img 
                  src="/student-image.png" 
                  alt="Student Illustration" 
                  style={{ height: 140, objectFit: 'contain', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))' }}
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              </div>
            )}
          </div>

          {/* Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: isMobile ? 16 : 24 }}>
            {[
              { Icon: GraduationCap, label: 'Current CGPA', value: academics?.cgpa ? academics.cgpa.toFixed(2) : '—', sub: 'Overall GPA', color: '#2563EB', bg: '#EFF6FF', trend: 'M0,18 Q25,3 50,12 T100,2' },
              { Icon: CalendarDays, label: 'Semesters', value: academics?.semesters?.length || 0, sub: 'Completed', color: '#7C3AED', bg: '#F3F0FF', trend: 'M0,15 L30,15 L60,5 L100,5' },
              { Icon: AlertCircle, label: 'Weak Subjects', value: academics?.weakSubjects?.length || 0, sub: 'Need attention', color: '#EA580C', bg: '#FFF7ED', trend: 'M0,12 Q30,5 60,20 T100,8' },
              { Icon: TrendingUp, label: 'Predicted GPA', value: academics?.predictedNextGPA ? academics.predictedNextGPA.toFixed(2) : '—', sub: 'Next semester', color: '#10B981', bg: '#EBFDF5', trend: 'M0,18 Q25,5 50,12 T100,2' },
            ].map(s => (
              <div key={s.label} style={{ background: '#fff', borderRadius: 20, padding: 20, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 11.5, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 26, fontWeight: 800, color: '#1E293B' }}>{s.value}</div>
                  </div>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                    <s.Icon size={20} strokeWidth={2.5} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>{s.sub}</div>
                  <svg width="80" height="20" viewBox="0 0 100 20" fill="none" style={{ marginLeft: 'auto' }}>
                    <path d={s.trend} stroke={s.color} strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Access & Latest Semester Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: isMobile ? 16 : 24 }}>
            
            {/* Quick Access Grid Card */}
            <div style={{ background: '#fff', borderRadius: 24, padding: isMobile ? 20 : 28, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#1E293B', marginBottom: 20 }}>
                🚀 Quick Access
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 12 }}>
                {quickLinks.map(l => (
                  <div 
                    key={l.path} 
                    onClick={() => navigate(l.path)} 
                    style={{ 
                      background: '#fff', 
                      borderRadius: 16, 
                      padding: '20px 12px', 
                      cursor: 'pointer', 
                      textAlign: 'center', 
                      border: '1.5px solid #F1F5F9', 
                      transition: 'all 0.2s' 
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = l.accent; e.currentTarget.style.boxShadow = '0 6px 16px rgba(15,23,42,0.04)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#F1F5F9'; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    <div style={{ 
                      width: 44, 
                      height: 44, 
                      borderRadius: 12, 
                      background: l.iconBg, 
                      color: l.accent, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      margin: '0 auto 10px'
                    }}>
                      <l.Icon size={20} strokeWidth={2.5} />
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1E293B', fontFamily: 'Sora, sans-serif' }}>{l.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest Semester List Card */}
            <div style={{ background: '#fff', borderRadius: 24, padding: 28, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: 20 }}>
                <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#1E293B' }}>
                  📊 Latest Semester
                </div>
                {academics?.semesters?.length > 0 && (
                  <span onClick={() => navigate('/academics')} style={{ fontSize: 12, fontWeight: 700, color: '#2563EB', cursor: 'pointer' }}>View All &rarr;</span>
                )}
              </div>

              {academics?.semesters?.length > 0 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {academics.semesters[academics.semesters.length - 1].subjects.slice(0, 5).map((sub, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', padding: '12px 0', borderBottom: i < 4 ? '1px solid #F1F5F9' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%', 
                          background: '#F8FAFC', 
                          color: '#6366F1', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontSize: 14
                        }}>
                          📗
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{sub.name}</span>
                      </div>
                      <span style={{ 
                        fontFamily: 'Sora, sans-serif', 
                        fontWeight: 800, 
                        fontSize: 12, 
                        padding: '4px 10px',
                        borderRadius: 8,
                        background: sub.grade >= 8.5 ? '#ECFDF5' : '#EFF6FF',
                        color: sub.grade >= 8.5 ? '#059669' : '#3B82F6' 
                      }}>
                        {sub.grade.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', margin: 'auto' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>📝</div>
                  <div style={{ fontSize: 13.5, color: '#94A3B8', fontWeight: 600, marginBottom: 16 }}>No grades added yet. Add semesters to unlock predictions!</div>
                  <button onClick={() => navigate('/academics')} style={{ height: 40, padding: '0 24px', borderRadius: 12, background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 13, boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}>
                    Add Grades
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Today's Goal Bottom Bar */}
          <div style={{ 
            background: '#fff', 
            border: '1px solid #E2E8F0', 
            borderRadius: 20, 
            padding: '20px 24px', 
            display: 'flex', 
            flexWrap: 'wrap',
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: 16,
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justify: 'center', background: '#FFF1F2', color: '#F43F5E' }}>
                <Target size={20} strokeWidth={2.5} />
              </div>
              <div>
                <span style={{ display: 'block', color: '#1E293B', fontSize: 13.5, fontWeight: 700 }}>Today's Goal</span>
                <span style={{ display: 'block', color: '#94A3B8', fontSize: 12.5, fontWeight: 500 }}>Solve 2 DSA problems and complete DBMS revision</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 'auto' }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: '#94A3B8', whiteSpace: 'nowrap' }}>1 / 2 completed</span>
              <div style={{ width: 140, background: '#F1F5F9', borderRadius: 99, height: 8, overflow: 'hidden', position: 'relative' }}>
                <div style={{ background: '#7C3AED', height: '100%', width: '50%', borderRadius: 99 }} />
              </div>
            </div>
          </div>

        </div>
    </AppLayout>
  )
}