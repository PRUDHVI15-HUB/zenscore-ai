import React from 'react'
import {
  LayoutDashboard,
  GraduationCap,
  Target,
  Lightbulb,
  BookOpen,
  Briefcase,
  TrendingUp,
  Bot,
  Settings,
  FileText,
  BookMarked,
  BarChart3,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  Circle,
  Send,
  Code2,
  Layers,
  ChevronRight,
  Award,
  ArrowRight
} from 'lucide-react'

export default function OnboardingLaptop({ screen = 'dashboard', activeNav = 'dashboard' }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'academics', label: 'Academics', icon: GraduationCap },
    { id: 'career', label: 'Career', icon: Target },
    { id: 'skills', label: 'Skills', icon: Lightbulb },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'productivity', label: 'Productivity', icon: TrendingUp },
    { id: 'aiTutor', label: 'AI Tutor', icon: Bot }
  ]

  return (
    <div style={{
      width: '100%',
      maxWidth: 580,
      margin: '0 auto',
      position: 'relative',
      filter: 'drop-shadow(0 18px 36px rgba(15, 23, 42, 0.12))'
    }}>
      {/* ── Laptop Top Display Bezel ── */}
      <div style={{
        background: '#0B0F17',
        borderRadius: '14px 14px 3px 3px',
        padding: '10px 10px 12px 10px',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18), 0 10px 30px rgba(0,0,0,0.25)',
        position: 'relative'
      }}>
        {/* Top Camera Notch */}
        <div style={{
          position: 'absolute',
          top: 3.5,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: '#334155',
          boxShadow: 'inset 0 0 2px #000'
        }} />

        {/* ── Screen Canvas ── */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 6,
          overflow: 'hidden',
          aspectRatio: '16 / 10.2',
          display: 'flex',
          fontSize: 11,
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          color: '#1E293B',
          userSelect: 'none'
        }}>
          {/* Mini Sidebar */}
          <div style={{
            width: 104,
            background: '#FAFAFA',
            borderRight: '1px solid #F1F5F9',
            padding: '12px 8px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flexShrink: 0
          }}>
            <div>
              {/* Official Brand Logo in Sidebar */}
              <div style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                background: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                marginBottom: 10,
                boxShadow: '0 2px 6px rgba(79, 70, 229, 0.25)'
              }}>
                <GraduationCap size={15} strokeWidth={2.2} />
              </div>

              {/* Nav items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeNav === item.id || screen === item.id
                  return (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '4.5px 7px',
                        borderRadius: 5,
                        fontSize: 8.5,
                        fontWeight: isActive ? 800 : 500,
                        background: isActive ? '#EFF6FF' : 'transparent',
                        color: isActive ? '#4F46E5' : '#64748B',
                        border: isActive ? '1px solid #DBEAFE' : '1px solid transparent',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Icon size={11} strokeWidth={isActive ? 2.5 : 2} />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Bottom Settings Icon */}
            <div style={{ padding: '2px 6px', color: '#94A3B8' }}>
              <Settings size={12} strokeWidth={1.8} />
            </div>
          </div>

          {/* Main Display Area (Full Height & Evenly Distributed) */}
          <div style={{
            flex: 1,
            background: '#FFFFFF',
            padding: '14px 16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {screen === 'dashboard' && <ScreenDashboard />}
            {screen === 'academics' && <ScreenAcademics />}
            {screen === 'career' && <ScreenCareer />}
            {screen === 'skills' && <ScreenSkills />}
            {screen === 'courses' && <ScreenCourses />}
            {screen === 'jobs' && <ScreenJobs />}
            {screen === 'productivity' && <ScreenProductivity />}
            {screen === 'aiTutor' && <ScreenAITutor />}
          </div>
        </div>
      </div>

      {/* ── Laptop Bottom Base / Trackpad ── */}
      <div style={{
        position: 'relative',
        height: 11,
        background: 'linear-gradient(to bottom, #E2E8F0 0%, #94A3B8 100%)',
        borderRadius: '0 0 14px 14px',
        margin: '0 auto',
        width: '106%',
        left: '-3%',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        {/* Notch Opening Indent */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 64,
          height: 3.5,
          background: '#64748B',
          borderRadius: '0 0 3px 3px'
        }} />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
 * SCREEN 1: DASHBOARD
 * ───────────────────────────────────────────────────────────── */
function ScreenDashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', fontFamily: 'Sora, sans-serif' }}>
          Hello, Priya 👋
        </div>
        <div style={{ fontSize: 8, color: '#64748B', marginTop: 1 }}>Let's continue your journey</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 6px', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: 8, color: '#64748B', fontWeight: 700 }}>Career Progress</div>
          <div style={{ position: 'relative', width: 46, height: 46, margin: '4px auto' }}>
            <svg width="46" height="46" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="#EFF6FF" stroke="#F1F5F9" strokeWidth="3.2" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#4F46E5" strokeWidth="3.2" strokeDasharray="75, 100" strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10.5, fontWeight: 800, color: '#0F172A', fontFamily: 'Sora, sans-serif' }}>
              75%
            </div>
          </div>
          <div style={{ fontSize: 7.5, color: '#334155', fontWeight: 700 }}>On Track</div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 6px', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: 8, color: '#64748B', fontWeight: 700 }}>Skills Progress</div>
          <div style={{ position: 'relative', width: 46, height: 46, margin: '4px auto' }}>
            <svg width="46" height="46" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="#F0FDF4" stroke="#F1F5F9" strokeWidth="3.2" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10B981" strokeWidth="3.2" strokeDasharray="64, 100" strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10.5, fontWeight: 800, color: '#0F172A', fontFamily: 'Sora, sans-serif' }}>
              64%
            </div>
          </div>
          <div style={{ fontSize: 7.5, color: '#16A34A', fontWeight: 700 }}>On Track</div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 6px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: 8, color: '#64748B', fontWeight: 700 }}>Courses Completed</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, margin: '4px 0' }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', fontFamily: 'Sora, sans-serif' }}>12</span>
            <ChevronRight size={14} color="#94A3B8" />
          </div>
          <div style={{ fontSize: 7.5, color: '#94A3B8', fontWeight: 600 }}>In Progress</div>
        </div>
      </div>

      {/* Bottom Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 8 }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 10px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: 8, fontWeight: 800, color: '#64748B' }}>Next Step</div>
          <div style={{ fontSize: 9, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>Complete React Assessment</div>
          <div style={{ fontSize: 7.5, color: '#94A3B8', marginTop: 1, display: 'flex', alignItems: 'center', gap: 3 }}>
            <Clock size={9} /> 15 min
          </div>
          <button style={{
            marginTop: 6,
            background: '#4F46E5',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 5,
            padding: '4px 14px',
            fontSize: 8,
            fontWeight: 800,
            cursor: 'default',
            boxShadow: '0 2px 6px rgba(79, 70, 229, 0.25)'
          }}>
            Continue
          </button>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 10px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: 8, fontWeight: 800, color: '#64748B' }}>Recommended for You</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 15, height: 15, borderRadius: 4, background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Code2 size={9} strokeWidth={2.4} />
                </div>
                <div>
                  <div style={{ fontSize: 8, fontWeight: 700, color: '#1E293B' }}>JavaScript Basics</div>
                  <div style={{ fontSize: 7, color: '#94A3B8' }}>In Progress</div>
                </div>
              </div>
              <Sparkles size={10} color="#4F46E5" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 15, height: 15, borderRadius: 4, background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Layers size={9} strokeWidth={2.4} />
                </div>
                <div>
                  <div style={{ fontSize: 8, fontWeight: 700, color: '#1E293B' }}>React Fundamentals</div>
                  <div style={{ fontSize: 7, color: '#94A3B8' }}>Not Started</div>
                </div>
              </div>
              <Circle size={9} color="#CBD5E1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
 * SCREEN 2: ACADEMICS (FULL HEIGHT & BALANCED)
 * ───────────────────────────────────────────────────────────── */
function ScreenAcademics() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', fontFamily: 'Sora, sans-serif' }}>
            Academics
          </div>
          <div style={{ fontSize: 8, color: '#64748B', marginTop: 1 }}>Semester 5 • B.Tech Computer Science</div>
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          <span style={{ fontSize: 7.5, fontWeight: 800, background: '#EFF6FF', color: '#4F46E5', padding: '3px 8px', borderRadius: 5, border: '1px solid #DBEAFE' }}>
            8.4 CGPA
          </span>
          <span style={{ fontSize: 7.5, fontWeight: 800, background: '#ECFDF5', color: '#059669', padding: '3px 8px', borderRadius: 5 }}>
            Top 10%
          </span>
        </div>
      </div>

      {/* 4 Cards Grid - Filling Upper Space */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, flex: 1 }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 22, height: 22, borderRadius: 6, background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={12} strokeWidth={2.2} />
            </span>
            <span style={{ fontSize: 9.5, fontWeight: 800, color: '#0F172A' }}>My Memos</span>
          </div>
          <div style={{ fontSize: 8, color: '#64748B', marginTop: 5, lineHeight: 1.35 }}>
            View your academic semester memos and records
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 22, height: 22, borderRadius: 6, background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookMarked size={12} strokeWidth={2.2} />
            </span>
            <span style={{ fontSize: 9.5, fontWeight: 800, color: '#0F172A' }}>My Subjects</span>
          </div>
          <div style={{ fontSize: 8, color: '#64748B', marginTop: 5, lineHeight: 1.35 }}>
            Explore your subjects and grades
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 22, height: 22, borderRadius: 6, background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart3 size={12} strokeWidth={2.2} />
            </span>
            <span style={{ fontSize: 9.5, fontWeight: 800, color: '#0F172A' }}>Performance</span>
          </div>
          <div style={{ fontSize: 8, color: '#64748B', marginTop: 5, lineHeight: 1.35 }}>
            Analyze your performance and progress
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 22, height: 22, borderRadius: 6, background: '#EFF6FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={12} strokeWidth={2.2} />
            </span>
            <span style={{ fontSize: 9.5, fontWeight: 800, color: '#0F172A' }}>AI Academic Assistant</span>
          </div>
          <div style={{ fontSize: 8, color: '#64748B', marginTop: 5, lineHeight: 1.35 }}>
            Ask any academic related questions
          </div>
        </div>
      </div>

      {/* Bottom Performance Card */}
      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '10px 12px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
          <span style={{ fontSize: 8.5, fontWeight: 800, color: '#334155' }}>Overall Academic Performance</span>
          <span style={{ fontSize: 11, fontWeight: 900, color: '#16A34A', fontFamily: 'Sora, sans-serif' }}>78%</span>
        </div>
        <div style={{ height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: '78%', height: '100%', background: 'linear-gradient(90deg, #10B981, #059669)', borderRadius: 3 }} />
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
 * SCREEN 3: CAREER (FULL HEIGHT & BALANCED)
 * ───────────────────────────────────────────────────────────── */
function ScreenCareer() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', fontFamily: 'Sora, sans-serif' }}>
            Career Explorer & Roadmap
          </div>
          <div style={{ fontSize: 8, color: '#64748B', marginTop: 1 }}>Target Career Track • High Market Demand</div>
        </div>
        <span style={{ fontSize: 7.5, fontWeight: 800, background: '#ECFDF5', color: '#059669', padding: '3px 8px', borderRadius: 5 }}>
          84% Match
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 10, flex: 1, alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            <div style={{ fontSize: 8, color: '#64748B', fontWeight: 700, marginBottom: 3 }}>Your Target Career</div>
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: 6,
              padding: '6px 10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 9,
              fontWeight: 800,
              color: '#0F172A'
            }}>
              <span>Full Stack Developer</span>
              <span style={{ fontSize: 7.5, color: '#4F46E5', fontWeight: 800 }}>₹10 - 16 LPA</span>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 7.5, marginBottom: 3 }}>
              <span style={{ fontWeight: 700, color: '#64748B' }}>Role Readiness</span>
              <span style={{ fontWeight: 900, color: '#16A34A' }}>84% Ready</span>
            </div>
            <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: '84%', height: '100%', background: 'linear-gradient(90deg, #10B981, #059669)', borderRadius: 3 }} />
            </div>
          </div>

          <div>
            <div style={{ fontSize: 8, fontWeight: 800, color: '#475569', marginBottom: 3 }}>Alternative Roles</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[
                { role: 'Software Engineer', match: '90%' },
                { role: 'Backend Developer', match: '85%' },
                { role: 'Frontend Developer', match: '88%' }
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 7.5, color: '#334155', fontWeight: 600 }}>
                  <span>• {r.role}</span>
                  <span style={{ color: '#4F46E5', fontWeight: 800 }}>{r.match}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Milestone Pathway Art */}
        <div style={{
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: 8,
          padding: '8px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg width="105" height="90" viewBox="0 0 120 110" fill="none">
            <path d="M 10 100 L 40 75 L 70 50 L 100 20" stroke="#CBD5E1" strokeWidth="2.5" strokeDasharray="3 3" />
            <path d="M 40 75 L 40 100" stroke="#E2E8F0" strokeWidth="1.5" />
            <path d="M 70 50 L 70 100" stroke="#E2E8F0" strokeWidth="1.5" />
            <path d="M 100 20 L 100 100" stroke="#E2E8F0" strokeWidth="1.5" />
            <path d="M 100 20 L 100 8 M 100 8 L 114 13 L 100 18" fill="#4F46E5" stroke="#4F46E5" strokeWidth="1.5" />
            <circle cx="68" cy="38" r="4.5" fill="#0F172A" />
            <path d="M 68 43 L 64 56 L 56 62 M 64 56 L 72 65 M 68 47 L 76 43 M 68 47 L 59 49" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          <div style={{ fontSize: 7.5, fontWeight: 800, color: '#4F46E5', marginTop: 3 }}>Target Ready by 2026</div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
 * SCREEN 4: SKILLS (FULL HEIGHT & BALANCED)
 * ───────────────────────────────────────────────────────────── */
function ScreenSkills() {
  const skillList = [
    { name: 'JavaScript / ES6', level: 'Expert', bg: '#DCFCE7', color: '#15803D' },
    { name: 'React.js & Hooks', level: 'Intermediate', bg: '#EFF6FF', color: '#2563EB' },
    { name: 'Node.js & Express', level: 'Intermediate', bg: '#EFF6FF', color: '#2563EB' },
    { name: 'MongoDB / SQL', level: 'Beginner', bg: '#F5F3FF', color: '#7C3AED' },
    { name: 'Docker & DevOps', level: 'Not Started', bg: '#F1F5F9', color: '#64748B' },
    { name: 'System Design', level: 'Not Started', bg: '#F1F5F9', color: '#64748B' }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', fontFamily: 'Sora, sans-serif' }}>
            Skills & Competency Hub
          </div>
          <div style={{ fontSize: 8, color: '#64748B', marginTop: 1 }}>14 Skills Evaluated • AI Verified</div>
        </div>
        <span style={{ fontSize: 7.5, fontWeight: 800, background: '#EFF6FF', color: '#4F46E5', padding: '3px 8px', borderRadius: 5 }}>
          64% Overall
        </span>
      </div>

      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: 8, fontWeight: 700, color: '#475569' }}>Target Role Requirement Fulfillment</span>
          <span style={{ fontSize: 8.5, fontWeight: 900, color: '#16A34A' }}>4 / 6 Core Skills Met</span>
        </div>
        <div style={{ height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: '64%', height: '100%', background: 'linear-gradient(90deg, #10B981, #059669)', borderRadius: 3 }} />
        </div>
      </div>

      {/* 2-Column Skills Grid Filling Space */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6, flex: 1 }}>
        {skillList.map((s, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#FFFFFF',
              border: '1px solid #F1F5F9',
              borderRadius: 6,
              padding: '6px 10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}
          >
            <span style={{ fontSize: 8, fontWeight: 700, color: '#1E293B' }}>{s.name}</span>
            <span style={{
              fontSize: 6.5,
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: 4,
              background: s.bg,
              color: s.color
            }}>
              {s.level}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
 * SCREEN 5: COURSES (FULL HEIGHT & BALANCED)
 * ───────────────────────────────────────────────────────────── */
function ScreenCourses() {
  const steps = [
    { label: 'Core Concepts & Video Modules', status: 'Completed', icon: CheckCircle2, tagBg: '#DCFCE7', tagColor: '#15803D' },
    { label: 'Weekly Quizzes & Assessments', status: 'Completed', icon: CheckCircle2, tagBg: '#DCFCE7', tagColor: '#15803D' },
    { label: 'Hands-on Coding Labs', status: 'In Progress', icon: Circle, tagBg: '#EFF6FF', tagColor: '#2563EB' },
    { label: 'Full-Stack Capstone Project', status: 'In Progress', icon: Circle, tagBg: '#EFF6FF', tagColor: '#2563EB' },
    { label: 'AI Code Review & Mentor Feedback', status: 'Upcoming', icon: Circle, tagBg: '#F1F5F9', tagColor: '#64748B' }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', fontFamily: 'Sora, sans-serif' }}>
            Structured Learning Track
          </div>
          <div style={{ fontSize: 8, color: '#64748B', marginTop: 1 }}>Full Stack Web Development • 5 Modules</div>
        </div>
        <span style={{ fontSize: 7.5, fontWeight: 800, background: '#ECFDF5', color: '#059669', padding: '3px 8px', borderRadius: 5 }}>
          72% Completed
        </span>
      </div>

      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '7px 10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
          <span style={{ fontSize: 8, fontWeight: 800, color: '#0F172A' }}>Module 3: Server Architecture & APIs</span>
          <span style={{ fontSize: 8, fontWeight: 800, color: '#4F46E5' }}>6 / 8 Lessons</span>
        </div>
        <div style={{ height: 5, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: '72%', height: '100%', background: 'linear-gradient(90deg, #10B981, #059669)', borderRadius: 3 }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {steps.map((st, i) => {
          const Icon = st.icon
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#FFFFFF',
                border: '1px solid #F1F5F9',
                borderRadius: 6,
                padding: '5px 10px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon size={11} color={st.tagColor} strokeWidth={2.2} />
                <span style={{ fontSize: 8, fontWeight: 700, color: '#1E293B' }}>{st.label}</span>
              </div>
              <span style={{
                fontSize: 6.5,
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: 4,
                background: st.tagBg,
                color: st.tagColor
              }}>
                {st.status}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
 * SCREEN 6: JOBS (FULL HEIGHT & BALANCED)
 * ───────────────────────────────────────────────────────────── */
function ScreenJobs() {
  const jobs = [
    { role: 'Software Engineer', company: 'Accenture', location: 'Bangalore, India', ctc: '₹8.5 - 12 LPA', match: '87%' },
    { role: 'Backend Developer', company: 'TCS Digital', location: 'Hyderabad, India', ctc: '₹7.5 - 11 LPA', match: '81%' },
    { role: 'Full Stack Engineer', company: 'Infosys SP', location: 'Pune, India', ctc: '₹9.5 - 13 LPA', match: '76%' }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', fontFamily: 'Sora, sans-serif' }}>
            Placement & Job Matching
          </div>
          <div style={{ fontSize: 8, color: '#64748B', marginTop: 1 }}>18 Matched Openings Based on Your Target Career</div>
        </div>
        <span style={{ fontSize: 7.5, fontWeight: 800, background: '#ECFDF5', color: '#059669', padding: '3px 8px', borderRadius: 5 }}>
          3 High Matches
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        {jobs.map((j, idx) => (
          <div
            key={idx}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 7,
              padding: '7px 10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
          >
            <div>
              <div style={{ fontSize: 9, fontWeight: 800, color: '#0F172A' }}>{j.role}</div>
              <div style={{ fontSize: 7.5, color: '#64748B', display: 'flex', gap: 4, marginTop: 2 }}>
                <span>{j.company}</span> • <span>{j.location}</span> • <span style={{ fontWeight: 700, color: '#4F46E5' }}>{j.ctc}</span>
              </div>
            </div>
            <div style={{
              background: '#DCFCE7',
              color: '#15803D',
              padding: '3px 8px',
              borderRadius: 5,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 6, fontWeight: 700 }}>MATCH</div>
              <div style={{ fontSize: 9, fontWeight: 900, fontFamily: 'Sora, sans-serif' }}>{j.match}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', padding: '5px 10px', borderRadius: 6 }}>
        <span style={{ fontSize: 7.5, color: '#64748B' }}>Resume ATS Score: <strong style={{ color: '#059669' }}>88/100</strong></span>
        <span style={{ fontSize: 7.5, fontWeight: 800, color: '#4F46E5' }}>View All 18 Opportunities →</span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
 * SCREEN 7: PRODUCTIVITY (FULL HEIGHT & BALANCED)
 * ───────────────────────────────────────────────────────────── */
function ScreenProductivity() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', fontFamily: 'Sora, sans-serif' }}>
            Productivity & Habit Tracker
          </div>
          <div style={{ fontSize: 8, color: '#64748B', marginTop: 1 }}>Daily Focus Time • Goal Consistency</div>
        </div>
        <span style={{ fontSize: 7.5, fontWeight: 800, background: '#EFF6FF', color: '#4F46E5', padding: '3px 8px', borderRadius: 5 }}>
          Level 4 Focused
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 8 }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: 7.5, color: '#64748B', fontWeight: 700 }}>Today's Focus Time</div>
          <div style={{ fontSize: 14, fontWeight: 900, color: '#0F172A', marginTop: 2, fontFamily: 'Sora, sans-serif' }}>02h 35m</div>
          <div style={{ fontSize: 7, color: '#64748B' }}>65% of 4h Daily Goal</div>
          <div style={{ height: 4, background: '#F1F5F9', borderRadius: 2, marginTop: 3, overflow: 'hidden' }}>
            <div style={{ width: '65%', height: '100%', background: '#4F46E5', borderRadius: 2 }} />
          </div>
        </div>

        <div style={{ background: '#EFF6FF', border: '1px solid #DBEAFE', borderRadius: 8, padding: '8px 10px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 7.5, color: '#1E40AF', fontWeight: 700 }}>Current Streak</div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#4F46E5', marginTop: 2, fontFamily: 'Sora, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
            <Flame size={13} color="#4F46E5" fill="#4F46E5" /> 12 Days
          </div>
          <div style={{ fontSize: 7, color: '#2563EB', fontWeight: 700 }}>Best Streak: 18 Days</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, padding: '6px 8px', textAlign: 'center' }}>
          <div style={{ fontSize: 6.5, color: '#64748B' }}>Weekly Hours</div>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A' }}>18.5 hrs</div>
        </div>
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, padding: '6px 8px', textAlign: 'center' }}>
          <div style={{ fontSize: 6.5, color: '#64748B' }}>Tasks Done</div>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A' }}>16 / 20</div>
        </div>
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, padding: '6px 8px', textAlign: 'center' }}>
          <div style={{ fontSize: 6.5, color: '#64748B' }}>Consistency</div>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#16A34A' }}>94%</div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
 * SCREEN 8: AI TUTOR (FULL HEIGHT & BALANCED)
 * ───────────────────────────────────────────────────────────── */
function ScreenAITutor() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, height: '100%', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', fontFamily: 'Sora, sans-serif' }}>
            ZenScore AI Tutor
          </div>
          <div style={{ fontSize: 8, color: '#64748B', marginTop: 1 }}>Context: Full Stack Web Development</div>
        </div>
        <span style={{ fontSize: 7.5, fontWeight: 800, background: '#ECFDF5', color: '#059669', padding: '3px 8px', borderRadius: 5 }}>
          ● Online
        </span>
      </div>

      {/* User message */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{
          background: '#0F172A',
          color: '#FFFFFF',
          padding: '6px 10px',
          borderRadius: '10px 10px 2px 10px',
          fontSize: 8.5,
          fontWeight: 700,
          maxWidth: '82%'
        }}>
          How does useEffect hook cleanup work in React?
        </div>
      </div>

      {/* AI Assistant response */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', flex: 1 }}>
        <div style={{
          width: 20,
          height: 20,
          borderRadius: 5,
          background: '#EFF6FF',
          border: '1px solid #DBEAFE',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#4F46E5',
          flexShrink: 0
        }}>
          <Bot size={12} strokeWidth={2.2} />
        </div>

        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '2px 10px 10px 10px',
          padding: '7px 10px',
          fontSize: 8,
          color: '#1E293B',
          lineHeight: 1.4,
          maxWidth: '92%',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
        }}>
          <div>The return function in `useEffect` executes before unmount or before re-running:</div>
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: 5,
            padding: '4px 8px',
            fontFamily: 'monospace',
            fontSize: 7.5,
            color: '#4F46E5',
            marginTop: 4
          }}>
            return () =&gt; clearInterval(timerId);
          </div>
          <div style={{ color: '#059669', fontWeight: 700, marginTop: 4 }}>
            ✓ Essential for preventing memory leaks!
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div style={{
        marginTop: 'auto',
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: 6,
        padding: '5px 10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 8,
        color: '#94A3B8'
      }}>
        <span>Ask any technical or exam question...</span>
        <Send size={11} color="#4F46E5" strokeWidth={2.2} />
      </div>
    </div>
  )
}
