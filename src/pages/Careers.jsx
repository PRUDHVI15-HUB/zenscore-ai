import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../context/AuthContext'

const tabs = [
  { id: 'paths', label: '🗺️ Career Paths' },
  { id: 'skillgap', label: '📊 Skill Gap' },
  { id: 'salary', label: '💰 Salary Insights' },
  { id: 'companies', label: '🏢 Top Companies' },
  { id: 'roadmap', label: '🛣️ Roadmap Generator' },
  { id: 'resume', label: '📄 Resume Builder' },
  { id: 'internships', label: '🎓 Internships' },
  { id: 'readiness', label: '🎯 Job Readiness' },
  { id: 'mentorship', label: '🤝 Mentorship' },
  { id: 'portfolio', label: '🖥️ Portfolio Builder' },
  { id: 'interview', label: '🎤 Interview Prep' },
]

const careerPaths = [
  { title: 'Software Engineer', icon: '💻', demand: 'Very High', salary: '₹8L - ₹40L', skills: ['DSA', 'System Design', 'JavaScript', 'Python'], companies: ['Google', 'Microsoft', 'Amazon', 'Flipkart'], color: '#EFF6FF', accent: '#2563EB' },
  { title: 'Data Scientist', icon: '📊', demand: 'Very High', salary: '₹10L - ₹45L', skills: ['Python', 'ML', 'Statistics', 'SQL'], companies: ['Google', 'Amazon', 'Walmart', 'PhonePe'], color: '#FDF4FF', accent: '#7C3AED' },
  { title: 'Product Manager', icon: '🎯', demand: 'High', salary: '₹15L - ₹60L', skills: ['Strategy', 'Analytics', 'Communication', 'Agile'], companies: ['Swiggy', 'Zomato', 'CRED', 'Razorpay'], color: '#F0FDF4', accent: '#059669' },
  { title: 'DevOps Engineer', icon: '⚙️', demand: 'High', salary: '₹8L - ₹35L', skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'], companies: ['Infosys', 'TCS', 'Wipro', 'HCL'], color: '#FFF7ED', accent: '#D97706' },
  { title: 'UI/UX Designer', icon: '🎨', demand: 'High', salary: '₹6L - ₹30L', skills: ['Figma', 'User Research', 'Prototyping', 'CSS'], companies: ['Adobe', 'Zoho', 'Freshworks', 'Meesho'], color: '#FFF1F2', accent: '#E11D48' },
  { title: 'Cybersecurity', icon: '🛡️', demand: 'Very High', salary: '₹8L - ₹40L', skills: ['Networking', 'Ethical Hacking', 'SIEM', 'Python'], companies: ['Deloitte', 'KPMG', 'Cisco', 'Palo Alto'], color: '#F0F9FF', accent: '#0284C7' },
]

const salaryData = [
  { role: 'Software Engineer', fresher: '₹5-12L', mid: '₹15-30L', senior: '₹30-60L', icon: '💻' },
  { role: 'Data Scientist', fresher: '₹6-14L', mid: '₹18-35L', senior: '₹35-70L', icon: '📊' },
  { role: 'Product Manager', fresher: '₹8-18L', mid: '₹20-45L', senior: '₹45-90L', icon: '🎯' },
  { role: 'DevOps Engineer', fresher: '₹5-10L', mid: '₹12-25L', senior: '₹25-50L', icon: '⚙️' },
  { role: 'UI/UX Designer', fresher: '₹4-8L', mid: '₹10-20L', senior: '₹20-40L', icon: '🎨' },
  { role: 'Cybersecurity', fresher: '₹5-12L', mid: '₹15-30L', senior: '₹30-60L', icon: '🛡️' },
]

const topCompanies = [
  { name: 'Google', logo: '🔵', domain: 'Tech', package: '₹25-80L', openings: '120+' },
  { name: 'Microsoft', logo: '🟦', domain: 'Tech', package: '₹20-70L', openings: '90+' },
  { name: 'Amazon', logo: '🟠', domain: 'E-Commerce', package: '₹18-60L', openings: '200+' },
  { name: 'Flipkart', logo: '🟡', domain: 'E-Commerce', package: '₹15-50L', openings: '150+' },
  { name: 'Swiggy', logo: '🟠', domain: 'FoodTech', package: '₹12-40L', openings: '80+' },
  { name: 'CRED', logo: '🟣', domain: 'FinTech', package: '₹15-45L', openings: '40+' },
  { name: 'Razorpay', logo: '🔷', domain: 'FinTech', package: '₹14-42L', openings: '60+' },
  { name: 'Zomato', logo: '🔴', domain: 'FoodTech', package: '₹12-38L', openings: '70+' },
]

const internships = [
  { company: 'Google', role: 'SWE Intern', stipend: '₹1.2L/month', duration: '3 months', deadline: 'Mar 30', skills: ['Python', 'DSA'] },
  { company: 'Microsoft', role: 'Product Intern', stipend: '₹80K/month', duration: '2 months', deadline: 'Apr 15', skills: ['Excel', 'Strategy'] },
  { company: 'Amazon', role: 'Data Intern', stipend: '₹90K/month', duration: '3 months', deadline: 'Apr 1', skills: ['SQL', 'Python'] },
  { company: 'Flipkart', role: 'ML Intern', stipend: '₹70K/month', duration: '6 months', deadline: 'Mar 25', skills: ['ML', 'Python'] },
  { company: 'Swiggy', role: 'Backend Intern', stipend: '₹60K/month', duration: '3 months', deadline: 'Apr 10', skills: ['Node.js', 'MongoDB'] },
  { company: 'CRED', role: 'Design Intern', stipend: '₹50K/month', duration: '2 months', deadline: 'Apr 20', skills: ['Figma', 'UI/UX'] },
]

const interviewTopics = [
  { category: 'DSA & Algorithms', icon: '🧮', topics: ['Arrays & Strings', 'Linked Lists', 'Trees & Graphs', 'Dynamic Programming', 'Sorting & Searching'], difficulty: 'Hard' },
  { category: 'System Design', icon: '🏗️', topics: ['Load Balancing', 'Caching', 'Database Design', 'Microservices', 'API Design'], difficulty: 'Hard' },
  { category: 'OS & Networks', icon: '💻', topics: ['Process Management', 'Memory Management', 'TCP/IP', 'HTTP/HTTPS', 'DNS'], difficulty: 'Medium' },
  { category: 'HR & Behavioral', icon: '🤝', topics: ['Tell me about yourself', 'Strengths & Weaknesses', 'Team Conflict', 'Leadership', 'Career Goals'], difficulty: 'Easy' },
  { category: 'DBMS & SQL', icon: '🗄️', topics: ['Normalization', 'Joins', 'Indexing', 'Transactions', 'NoSQL vs SQL'], difficulty: 'Medium' },
  { category: 'OOPs Concepts', icon: '🔷', topics: ['Inheritance', 'Polymorphism', 'Abstraction', 'Encapsulation', 'SOLID Principles'], difficulty: 'Medium' },
]

const mentors = [
  { name: 'Rahul Sharma', role: 'SDE-3 at Google', exp: '8 years', domain: 'Backend', sessions: '200+', rating: '4.9', avatar: '👨‍💻' },
  { name: 'Priya Mehta', role: 'PM at Microsoft', exp: '6 years', domain: 'Product', sessions: '150+', rating: '4.8', avatar: '👩‍💼' },
  { name: 'Arjun Nair', role: 'Data Scientist at Amazon', exp: '5 years', domain: 'Data', sessions: '120+', rating: '4.7', avatar: '👨‍🔬' },
  { name: 'Sneha Patel', role: 'UI Lead at Swiggy', exp: '7 years', domain: 'Design', sessions: '180+', rating: '4.9', avatar: '👩‍🎨' },
]

const btnPrimary = { height: 44, padding: '0 24px', borderRadius: 12, background: 'linear-gradient(135deg, #059669, #0284C7)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Sora,sans-serif', fontWeight: 600, fontSize: 14, boxShadow: '0 4px 12px rgba(5,150,105,0.25)' }
const cardStyle = { background: '#fff', borderRadius: 20, padding: 24, border: '1px solid var(--border)', transition: 'transform 0.2s, box-shadow 0.2s' }
const DemandBadge = ({ level }) => {
  const map = { 'Very High': ['#F0FDF4', '#15803D'], 'High': ['#EFF6FF', '#1D4ED8'], 'Medium': ['#FFF7ED', '#C2410C'] }
  const [bg, color] = map[level] || map['Medium']
  return <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: bg, color }}>{level}</span>
}

export default function Careers() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('paths')
  const [selectedPath, setSelectedPath] = useState('')
  const [userSkills, setUserSkills] = useState('')
  const [skillGapResult, setSkillGapResult] = useState(null)
  const [roadmapRole, setRoadmapRole] = useState('')
  const [roadmapResult, setRoadmapResult] = useState(null)
  const [readinessScore, setReadinessScore] = useState(null)
  const [resumeForm, setResumeForm] = useState({ name: '', email: '', phone: '', skills: '', education: '', projects: '' })

  useEffect(() => { if (!user) navigate('/') }, [user])

  const handleSkillGap = () => {
    if (!selectedPath || !userSkills) return
    const path = careerPaths.find(p => p.title === selectedPath)
    const userArr = userSkills.split(',').map(s => s.trim().toLowerCase())
    const required = path.skills.map(s => s.toLowerCase())
    const missing = required.filter(s => !userArr.includes(s))
    const matched = required.filter(s => userArr.includes(s))
    const pct = Math.round((matched.length / required.length) * 100)
    setSkillGapResult({ role: path.title, missing, matched, pct, roadmap: missing.map((s, i) => ({ week: i + 1, skill: s })) })
  }

  const handleRoadmap = () => {
    if (!roadmapRole) return
    const path = careerPaths.find(p => p.title === roadmapRole) || careerPaths[0]
    setRoadmapResult({
      role: path.title,
      phases: [
        { phase: 'Phase 1 — Foundation', duration: '0-3 months', tasks: [`Learn ${path.skills[0]} fundamentals`, 'Build 2 beginner projects', 'Complete online certification'] },
        { phase: 'Phase 2 — Intermediate', duration: '3-6 months', tasks: [`Master ${path.skills[1]}`, 'Contribute to open source', 'Build portfolio project'] },
        { phase: 'Phase 3 — Advanced', duration: '6-9 months', tasks: [`Deep dive into ${path.skills[2]}`, 'Mock interviews', 'Apply to companies'] },
        { phase: 'Phase 4 — Job Ready', duration: '9-12 months', tasks: ['Crack coding rounds', 'System design prep', 'Negotiate offers'] },
      ]
    })
  }

  const handleReadiness = () => {
    const skills = userSkills.split(',').map(s => s.trim()).filter(Boolean)
    const score = Math.min(Math.round((skills.length / 8) * 50 + 35), 95)
    setReadinessScore({
      score,
      level: score >= 80 ? 'Job Ready 🎉' : score >= 60 ? 'Almost Ready 💪' : 'Needs Work 📚',
      suggestions: [
        skills.length < 4 && 'Add more technical skills to your profile',
        score < 70 && 'Work on DSA and problem solving skills',
        score < 80 && 'Build at least 3 portfolio projects',
        'Practice mock interviews regularly',
      ].filter(Boolean)
    })
  }

  return (
    <AppLayout>
      <div style={{ background: 'linear-gradient(135deg, #059669, #0284C7, #7C3AED)', padding: '48px 0 0' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>💼</div>
              <div>
                <h1 style={{ fontFamily: 'Sora,sans-serif', fontSize: 28, fontWeight: 800, color: '#fff' }}>Careers</h1>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>Explore paths, close skill gaps, and land your dream job</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 0 }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                  height: 38, padding: '0 14px', borderRadius: '12px 12px 0 0', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                  background: activeTab === t.id ? '#fff' : 'rgba(255,255,255,0.15)',
                  color: activeTab === t.id ? '#059669' : 'rgba(255,255,255,0.85)',
                  fontFamily: 'Sora,sans-serif', fontWeight: 600, fontSize: 12.5
                }}>{t.label}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="container" style={{ padding: '40px 24px' }}>

          {/* CAREER PATHS */}
          {activeTab === 'paths' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              {careerPaths.map(p => (
                <div key={p.title} style={{ ...cardStyle, cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{p.icon}</div>
                    <DemandBadge level={p.demand} />
                  </div>
                  <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 16, fontWeight: 800, color: 'var(--text-dark)', marginBottom: 4 }}>{p.title}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: p.accent, marginBottom: 12 }}>{p.salary}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                    {p.skills.map(s => <span key={s} style={{ fontSize: 11.5, padding: '3px 10px', borderRadius: 20, background: p.color, color: p.accent, fontWeight: 600 }}>{s}</span>)}
                  </div>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginBottom: 14 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Top Companies</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {p.companies.map(c => <span key={c} style={{ fontSize: 11.5, padding: '2px 8px', borderRadius: 6, background: 'var(--bg-soft)', color: 'var(--text-mid)', fontWeight: 500 }}>{c}</span>)}
                    </div>
                  </div>
                  <button onClick={() => { setSelectedPath(p.title); setActiveTab('skillgap') }} style={{ ...btnPrimary, width: '100%', height: 38, fontSize: 13 }}>Check Skill Gap →</button>
                </div>
              ))}
            </div>
          )}

          {/* SKILL GAP */}
          {activeTab === 'skillgap' && (
            <div style={{ maxWidth: 720 }}>
              <div style={cardStyle}>
                <h2 style={{ fontFamily: 'Sora,sans-serif', fontSize: 20, fontWeight: 800, marginBottom: 6 }}>📊 Skill Gap Analyzer</h2>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Compare your skills against your target role</p>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-mid)', marginBottom: 6, fontFamily: 'Sora,sans-serif' }}>Target Role</label>
                  <select value={selectedPath} onChange={e => setSelectedPath(e.target.value)} style={{ width: '100%', height: 44, padding: '0 14px', borderRadius: 12, border: '1.5px solid var(--border)', fontSize: 14, outline: 'none' }}>
                    <option value="">Select a career path</option>
                    {careerPaths.map(p => <option key={p.title} value={p.title}>{p.title}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-mid)', marginBottom: 6, fontFamily: 'Sora,sans-serif' }}>Your Current Skills (comma separated)</label>
                  <input placeholder="e.g. Python, SQL, React, Git" value={userSkills} onChange={e => setUserSkills(e.target.value)} style={{ width: '100%', height: 44, padding: '0 14px', borderRadius: 12, border: '1.5px solid var(--border)', fontSize: 14, outline: 'none' }} />
                </div>
                <button onClick={handleSkillGap} style={btnPrimary}>Analyze Skill Gap</button>
                {skillGapResult && (
                  <div style={{ marginTop: 28 }}>
                    <div style={{ background: '#F8FAFF', borderRadius: 14, padding: 20, marginBottom: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 14 }}>Completion for {skillGapResult.role}</span>
                        <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 18, color: skillGapResult.pct >= 70 ? '#059669' : '#D97706' }}>{skillGapResult.pct}%</span>
                      </div>
                      <div style={{ height: 10, background: '#E2E8F0', borderRadius: 5, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${skillGapResult.pct}%`, background: 'linear-gradient(90deg,#059669,#0284C7)', borderRadius: 5 }} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 20 }}>
                      <div style={{ background: '#F0FDF4', borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#15803D', marginBottom: 10 }}>✅ Skills You Have</div>
                        {skillGapResult.matched.length ? skillGapResult.matched.map(s => <div key={s} style={{ fontSize: 13, color: '#166534', padding: '4px 0' }}>• {s}</div>) : <div style={{ fontSize: 13, color: '#16A34A' }}>None matched yet</div>}
                      </div>
                      <div style={{ background: '#FEF2F2', borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#DC2626', marginBottom: 10 }}>❌ Skills to Learn</div>
                        {skillGapResult.missing.length ? skillGapResult.missing.map(s => <div key={s} style={{ fontSize: 13, color: '#991B1B', padding: '4px 0' }}>• {s}</div>) : <div style={{ fontSize: 13, color: '#16A34A' }}>You have all skills! 🎉</div>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SALARY */}
          {activeTab === 'salary' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              {salaryData.map(s => (
                <div key={s.role} style={cardStyle}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div style={{ fontSize: 32 }}>{s.icon}</div>
                    <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 16, fontWeight: 800 }}>{s.role}</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: 8 }}>
                    {[['Fresher', s.fresher, '#EFF6FF', '#2563EB'], ['Mid Level', s.mid, '#FDF4FF', '#7C3AED'], ['Senior', s.senior, '#F0FDF4', '#059669']].map(([level, salary, bg, color]) => (
                      <div key={level} style={{ background: bg, borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
                        <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>{level}</div>
                        <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 12, fontWeight: 800, color }}>{salary}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TOP COMPANIES */}
          {activeTab === 'companies' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
              {topCompanies.map(c => (
                <div key={c.name} style={{ ...cardStyle, textAlign: 'center' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div style={{ fontSize: 40, marginBottom: 10 }}>{c.logo}</div>
                  <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 15, fontWeight: 800, marginBottom: 4 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{c.domain}</div>
                  <div style={{ background: '#EFF6FF', borderRadius: 8, padding: '6px 10px', fontSize: 12, fontWeight: 700, color: '#2563EB', marginBottom: 6 }}>{c.package}</div>
                  <div style={{ background: '#F0FDF4', borderRadius: 8, padding: '6px 10px', fontSize: 12, fontWeight: 700, color: '#059669' }}>{c.openings} openings</div>
                </div>
              ))}
            </div>
          )}

          {/* ROADMAP */}
          {activeTab === 'roadmap' && (
            <div style={{ maxWidth: 720 }}>
              <div style={cardStyle}>
                <h2 style={{ fontFamily: 'Sora,sans-serif', fontSize: 20, fontWeight: 800, marginBottom: 6 }}>🛣️ Career Roadmap Generator</h2>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Get a personalized 12-month roadmap for your target role</p>
                <select value={roadmapRole} onChange={e => setRoadmapRole(e.target.value)} style={{ width: '100%', height: 44, padding: '0 14px', borderRadius: 12, border: '1.5px solid var(--border)', fontSize: 14, outline: 'none', marginBottom: 16 }}>
                  <option value="">Select a role</option>
                  {careerPaths.map(p => <option key={p.title} value={p.title}>{p.title}</option>)}
                </select>
                <button onClick={handleRoadmap} style={btnPrimary}>Generate Roadmap</button>
                {roadmapResult && (
                  <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 16, fontWeight: 800, marginBottom: 4 }}>12-Month Roadmap for {roadmapResult.role}</div>
                    {roadmapResult.phases.map((phase, i) => (
                      <div key={i} style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
                        <div style={{ background: 'linear-gradient(135deg,#059669,#0284C7)', padding: '12px 18px', display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 14, color: '#fff' }}>{phase.phase}</span>
                          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>{phase.duration}</span>
                        </div>
                        <div style={{ padding: '14px 18px' }}>
                          {phase.tasks.map((task, j) => (
                            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: j < phase.tasks.length - 1 ? '1px solid var(--border)' : 'none' }}>
                              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669', flexShrink: 0 }} />
                              <span style={{ fontSize: 13.5, color: 'var(--text-mid)' }}>{task}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* RESUME */}
          {activeTab === 'resume' && (
            <div style={{ maxWidth: 720 }}>
              <div style={cardStyle}>
                <h2 style={{ fontFamily: 'Sora,sans-serif', fontSize: 20, fontWeight: 800, marginBottom: 6 }}>📄 Resume Builder</h2>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Fill in your details to generate a professional resume</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[['Full Name', 'name', 'e.g. Prudhvi Kumar', false], ['Email', 'email', 'you@example.com', false], ['Phone', 'phone', '+91 9999999999', false], ['Skills (comma separated)', 'skills', 'Python, React, SQL...', false], ['Education', 'education', 'B.Tech CSE, JNTU 2025, CGPA: 8.2', false], ['Projects', 'projects', 'ZenScore AI — Full stack student platform...', true]].map(([label, field, placeholder, isTextarea]) => (
                    <div key={field}>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-mid)', marginBottom: 6, fontFamily: 'Sora,sans-serif' }}>{label}</label>
                      {isTextarea
                        ? <textarea rows={3} placeholder={placeholder} value={resumeForm[field]} onChange={e => setResumeForm(p => ({ ...p, [field]: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid var(--border)', fontSize: 14, outline: 'none', resize: 'vertical' }} />
                        : <input placeholder={placeholder} value={resumeForm[field]} onChange={e => setResumeForm(p => ({ ...p, [field]: e.target.value }))} style={{ width: '100%', height: 44, padding: '0 14px', borderRadius: 12, border: '1.5px solid var(--border)', fontSize: 14, outline: 'none' }} />
                      }
                    </div>
                  ))}
                  <button style={btnPrimary}>Generate Resume</button>
                  <div style={{ background: '#FFF7ED', borderRadius: 12, padding: 14, fontSize: 13, color: '#92400E' }}>⚠️ Resume PDF export coming soon!</div>
                </div>
              </div>
            </div>
          )}

          {/* INTERNSHIPS */}
          {activeTab === 'internships' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {internships.map((intern, i) => (
                <div key={i} style={{ ...cardStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 18, color: '#2563EB', flexShrink: 0 }}>{intern.company[0]}</div>
                    <div>
                      <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 15 }}>{intern.role}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{intern.company} • {intern.duration}</div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                        {intern.skills.map(s => <span key={s} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: '#EFF6FF', color: '#2563EB', fontWeight: 600 }}>{s}</span>)}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 15, color: '#059669' }}>{intern.stipend}</div>
                    <div style={{ fontSize: 12, color: '#DC2626', marginTop: 2 }}>Deadline: {intern.deadline}</div>
                    <button style={{ ...btnPrimary, height: 34, fontSize: 12, marginTop: 8, padding: '0 16px' }}>Apply Now</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* JOB READINESS */}
          {activeTab === 'readiness' && (
            <div style={{ maxWidth: 600 }}>
              <div style={cardStyle}>
                <h2 style={{ fontFamily: 'Sora,sans-serif', fontSize: 20, fontWeight: 800, marginBottom: 6 }}>🎯 Job Readiness Score</h2>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Check how ready you are to apply for jobs</p>
                <input placeholder="Your skills: Python, React, SQL, Git..." value={userSkills} onChange={e => setUserSkills(e.target.value)} style={{ width: '100%', height: 44, padding: '0 14px', borderRadius: 12, border: '1.5px solid var(--border)', fontSize: 14, outline: 'none', marginBottom: 16 }} />
                <button onClick={handleReadiness} style={btnPrimary}>Calculate Score</button>
                {readinessScore && (
                  <div style={{ marginTop: 28 }}>
                    <div style={{ background: 'linear-gradient(135deg,#059669,#0284C7)', borderRadius: 16, padding: 28, textAlign: 'center', marginBottom: 20 }}>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 8 }}>Your Job Readiness Score</div>
                      <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 64, fontWeight: 800, color: '#fff' }}>{readinessScore.score}%</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginTop: 4 }}>{readinessScore.level}</div>
                    </div>
                    <div style={{ background: '#FFF7ED', borderRadius: 12, padding: 16 }}>
                      <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>💡 Suggestions</div>
                      {readinessScore.suggestions.map((s, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, padding: '6px 0' }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#D97706', flexShrink: 0, marginTop: 6 }} />
                          <span style={{ fontSize: 13.5, color: '#92400E' }}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MENTORSHIP */}
          {activeTab === 'mentorship' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 24 }}>
              {mentors.map(m => (
                <div key={m.name} style={cardStyle}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{m.avatar}</div>
                    <div>
                      <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 15 }}>{m.name}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{m.role}</div>
                      <div style={{ fontSize: 12, color: '#D97706', fontWeight: 600 }}>⭐ {m.rating}</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
                    {[['Domain', m.domain], ['Experience', m.exp], ['Sessions', m.sessions]].map(([label, val]) => (
                      <div key={label} style={{ background: 'var(--bg-soft)', borderRadius: 10, padding: '8px 10px', textAlign: 'center' }}>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{val}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</div>
                      </div>
                    ))}
                  </div>
                  <button style={{ ...btnPrimary, width: '100%', height: 38, fontSize: 13 }}>Book Session</button>
                </div>
              ))}
            </div>
          )}

          {/* PORTFOLIO */}
          {activeTab === 'portfolio' && (
            <div style={{ maxWidth: 720 }}>
              <div style={cardStyle}>
                <h2 style={{ fontFamily: 'Sora,sans-serif', fontSize: 20, fontWeight: 800, marginBottom: 6 }}>🖥️ Portfolio Builder</h2>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Build a stunning portfolio to showcase your work</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
                  {[['📝', 'About Me', 'Write a compelling bio'], ['💻', 'Projects', 'Showcase your best work'], ['🛠️', 'Skills', 'Display your tech stack'], ['🎓', 'Education', 'Add your achievements'], ['🏆', 'Achievements', 'Certifications & awards'], ['📬', 'Contact', 'Let recruiters reach you']].map(([icon, title, desc]) => (
                    <div key={title} style={{ background: '#F8FAFF', borderRadius: 14, padding: 16, textAlign: 'center', cursor: 'pointer', border: '1.5px dashed var(--border)' }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                      <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{desc}</div>
                    </div>
                  ))}
                </div>
                <button style={btnPrimary}>Start Building Portfolio</button>
                <div style={{ marginTop: 16, background: '#EFF6FF', borderRadius: 12, padding: 14, fontSize: 13, color: '#1E40AF' }}>🚀 Portfolio generator coming soon at <strong>zenscore.ai/u/yourname</strong></div>
              </div>
            </div>
          )}

          {/* INTERVIEW PREP */}
          {activeTab === 'interview' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 24 }}>
              {interviewTopics.map(t => (
                <div key={t.category} style={cardStyle}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 26 }}>{t.icon}</span>
                      <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 15 }}>{t.category}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: t.difficulty === 'Hard' ? '#FEF2F2' : t.difficulty === 'Medium' ? '#FFF7ED' : '#F0FDF4', color: t.difficulty === 'Hard' ? '#DC2626' : t.difficulty === 'Medium' ? '#D97706' : '#059669' }}>{t.difficulty}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                    {t.topics.map((topic, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-soft)', borderRadius: 10 }}>
                        <span style={{ fontSize: 13.5, color: 'var(--text-mid)' }}>{topic}</span>
                        <button style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>Practice →</button>
                      </div>
                    ))}
                  </div>
                  <button style={{ ...btnPrimary, width: '100%', height: 38, fontSize: 13 }}>Start Practice</button>
                </div>
              ))}
            </div>
          )}

        </div>
    </AppLayout>
  )
}