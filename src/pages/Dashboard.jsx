import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useStudentProfile } from '../context/StudentProfileContext'
import { useCareer } from '../context/CareerContext'
import { resolveCanonicalCareerGoal } from '../services/careers/careerNormalizer'
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
  
  // Read Unified Student Profile
  const {
    basicProfile,
    academicSummary,
    careerProfile,
    skillsSummary,
    coursesSummary,
    jobsSummary,
    productivitySummary
  } = useStudentProfile()

  const basic = basicProfile?.data || {}
  const academic = academicSummary?.data || {}
  const career = careerProfile?.data || {}
  const skills = skillsSummary?.data || {}
  const courses = coursesSummary?.data || {}
  const jobs = jobsSummary?.data || {}
  const productivity = productivitySummary?.data || {}

  const careerCtx = useCareer()
  const studentProfileCtx = useStudentProfile()
  const targetCareerRole = resolveCanonicalCareerGoal(studentProfileCtx?.profile, careerCtx, career?.selectedCareerGoal || career?.targetCareer)

  const [academics, setAcademics] = useState(null)
  const [tip] = useState(tips[Math.floor(Math.random() * tips.length)])
  const [time, setTime] = useState(new Date())
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  const studentName = basic.name || user?.displayName || 'Student'

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

            {/* Standardized Glassmorphic Profile Snapshot Card */}
            {!isMobile && (
              <div
                style={{
                  zIndex: 2,
                  background: 'rgba(255, 255, 255, 0.16)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.28)',
                  borderRadius: 18,
                  padding: '16px 20px',
                  color: '#FFFFFF',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  width: 230
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: 'rgba(255, 255, 255, 0.85)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <Sparkles size={13} style={{ color: '#FDE047' }} />
                    <span>Active Profile</span>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(255,255,255,0.2)', padding: '2px 7px', borderRadius: 10 }}>
                    Live
                  </span>
                </div>

                <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 800, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {targetCareerRole && targetCareerRole.trim().length > 0 ? targetCareerRole : 'Set Career Goal'}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.18)' }}>
                  <span style={{ fontSize: 11.5, color: 'rgba(255, 255, 255, 0.8)' }}>ZenScore</span>
                  <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 800, color: '#FDE047' }}>
                    {typeof academic?.healthScore === 'number' && academic.healthScore > 0 ? `${academic.healthScore}%` : (academics?.cgpa ? `${Math.min(100, Math.round(academics.cgpa * 10))}%` : '88%')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Metrics Grid */}
          <div id="dashboard-summary-cards" data-testid="dashboard-summary-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: isMobile ? 16 : 24 }}>

            {(() => {
              const hasSemesters = (academics?.semesters?.length > 0) || (academic?.completedSemesters > 0)
              const currentCGPAValue = academics?.cgpa ?? academic?.currentCGPA ?? null
              const totalSemestersCount = academics?.semesters?.length ?? academic?.completedSemesters ?? 0
              const totalCreditsCount = academic?.totalCredits || academics?.totalCredits || (academics?.semesters || []).reduce((acc, sem) => acc + (sem.subjects || []).reduce((sAcc, sub) => sAcc + (Number(sub.credits) || 0), 0), 0) || 0
              const weakCount = academics?.weakSubjects?.length ?? 0
              const predictedValue = (academic?.predictedCGPA && academic.predictedCGPA > 0)
                ? academic.predictedCGPA
                : (academics?.predictedNextGPA && academics.predictedNextGPA > 0
                  ? academics.predictedNextGPA
                  : (currentCGPAValue ? 8.55 : null))

              return [
                { 
                  Icon: GraduationCap, 
                  label: 'Current CGPA', 
                  value: currentCGPAValue ? Number(currentCGPAValue).toFixed(2) : '—', 
                  sub: hasSemesters ? (academic?.academicHealth ? `Health: ${academic.academicHealth}` : 'Overall CGPA') : 'No transcript uploaded', 
                  color: '#2563EB', 
                  bg: 'rgba(37, 99, 235, 0.12)', 
                  trend: 'M0,18 Q25,3 50,12 T100,2' 
                },
                { 
                  Icon: CalendarDays, 
                  label: 'Semesters', 
                  value: totalSemestersCount, 
                  sub: `${totalCreditsCount} Credits Earned`, 
                  color: '#7C3AED', 
                  bg: 'rgba(124, 58, 237, 0.12)', 
                  trend: 'M0,15 L30,15 L60,5 L100,5' 
                },
                { 
                  Icon: AlertCircle, 
                  label: 'Weak Subjects', 
                  value: weakCount, 
                  sub: hasSemesters ? ((weakCount > 0) ? `${weakCount} subjects need attention` : '🎉 All subjects passed cleanly') : 'No backlogs recorded', 
                  color: '#EA580C', 
                  bg: 'rgba(234, 88, 12, 0.12)', 
                  trend: 'M0,12 Q30,5 60,20 T100,8' 
                },
                { 
                  Icon: TrendingUp, 
                  label: 'Predicted CGPA', 
                  value: predictedValue ? Number(predictedValue).toFixed(2) : '—', 
                  sub: hasSemesters ? (targetCareerRole ? `Goal: ${targetCareerRole}` : 'Semester forecast') : 'Upload transcript to unlock', 
                  color: '#10B981', 
                  bg: 'rgba(16, 185, 129, 0.12)', 
                  trend: 'M0,18 Q25,5 50,12 T100,2' 
                },
              ]
            })().map(s => (
              <div key={s.label} style={{ background: 'var(--bg-soft, #fff)', borderRadius: 20, padding: 20, border: '1px solid var(--border, #E2E8F0)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted, #94A3B8)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 26, fontWeight: 800, color: 'var(--text-dark, #1E293B)' }}>{s.value}</div>
                  </div>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                    <s.Icon size={20} strokeWidth={2.5} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted, #94A3B8)', fontWeight: 600 }}>{s.sub}</div>
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
            <div style={{ background: 'var(--bg-soft, #fff)', borderRadius: 24, padding: isMobile ? 20 : 28, border: '1px solid var(--border, #E2E8F0)', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: 'var(--text-dark, #1E293B)', marginBottom: 20 }}>
                🚀 Quick Access
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 12 }}>
                {quickLinks.map(l => (
                  <div 
                    key={l.path} 
                    onClick={() => navigate(l.path)} 
                    style={{ 
                      background: 'var(--bg, #fff)', 
                      borderRadius: 16, 
                      padding: '20px 12px', 
                      cursor: 'pointer', 
                      textAlign: 'center', 
                      border: '1.5px solid var(--border, #F1F5F9)', 
                      transition: 'all 0.2s' 
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = l.accent; e.currentTarget.style.boxShadow = '0 6px 16px rgba(15,23,42,0.04)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border, #F1F5F9)'; e.currentTarget.style.boxShadow = 'none' }}
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
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-dark, #1E293B)', fontFamily: 'Sora, sans-serif' }}>{l.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest Semester List Card */}
            <div style={{ background: 'var(--bg-soft, #fff)', borderRadius: 24, padding: isMobile ? '20px 16px' : '28px', border: '1px solid var(--border, #E2E8F0)', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: 'var(--text-dark, #1E293B)' }}>
                  📊 Latest Semester
                </div>
                {academics?.semesters?.length > 0 && (
                  <span onClick={() => navigate('/academics')} style={{ fontSize: 12, fontWeight: 700, color: '#2563EB', cursor: 'pointer' }}>View All &rarr;</span>
                )}
              </div>

              {academics?.semesters?.length > 0 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {academics.semesters[academics.semesters.length - 1].subjects.slice(0, 5).map((sub, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 4 ? '1px solid var(--border, #F1F5F9)' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%', 
                          background: 'var(--bg, #F8FAFC)', 
                          color: '#6366F1', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontSize: 14
                        }}>
                          📗
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-mid, #334155)' }}>{sub.name}</span>
                      </div>
                      <span style={{ 
                        fontFamily: 'Sora, sans-serif', 
                        fontWeight: 800, 
                        fontSize: 12, 
                        padding: '4px 10px',
                        borderRadius: 8,
                        background: sub.grade >= 8.5 ? 'rgba(5, 150, 105, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: sub.grade >= 8.5 ? '#10B981' : '#3B82F6' 
                      }}>
                        {sub.grade.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', margin: 'auto' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>📝</div>
                  <div style={{ fontSize: 13.5, color: 'var(--text-muted, #94A3B8)', fontWeight: 600, marginBottom: 16 }}>No grades added yet. Add semesters to unlock predictions!</div>
                  <button onClick={() => navigate('/academics')} style={{ height: 40, padding: '0 24px', borderRadius: 12, background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 13, boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}>
                    Add Grades
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Today's Goal Bottom Bar */}
          <div style={{ 
            background: 'var(--bg-soft, #fff)', 
            border: '1px solid var(--border, #E2E8F0)', 
            borderRadius: 20, 
            padding: isMobile ? '16px' : '20px 24px', 
            display: 'flex', 
            flexWrap: 'wrap',
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: 16,
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(244, 63, 94, 0.12)', color: '#F43F5E', flexShrink: 0 }}>
                <Target size={20} strokeWidth={2.5} />
              </div>
              <div style={{ minWidth: 0 }}>
                <span style={{ display: 'block', color: 'var(--text-dark, #1E293B)', fontSize: 13.5, fontWeight: 700 }}>Today's Goal</span>
                <span style={{ display: 'block', color: 'var(--text-muted, #94A3B8)', fontSize: 12.5, fontWeight: 500 }}>
                  {productivity.nextScheduledSession || 'Solve 2 DSA problems and complete DBMS revision'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'space-between' : 'flex-end' }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted, #94A3B8)', whiteSpace: 'nowrap' }}>
                {productivity.completedTasks ?? 1} / {productivity.todayTasks ?? 2} completed
              </span>
              <div style={{ width: 140, background: 'var(--border, #F1F5F9)', borderRadius: 99, height: 8, overflow: 'hidden', position: 'relative' }}>
                <div style={{ 
                  background: '#7C3AED', 
                  height: '100%', 
                  width: `${(productivity.todayTasks ? Math.min(100, Math.round(((productivity.completedTasks ?? 1) / productivity.todayTasks) * 100)) : 50)}%`, 
                  borderRadius: 99 
                }} />
              </div>
            </div>
          </div>

        </div>
    </AppLayout>
  )
}