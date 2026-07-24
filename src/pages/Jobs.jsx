import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../context/AuthContext'

const tabs = [
  { id: 'listings', label: '💼 Job Listings' },
  { id: 'internships', label: '🎯 Internships' },
  { id: 'tracker', label: '📋 Application Tracker' },
  { id: 'readiness', label: '✅ Placement Readiness' },
  { id: 'resume', label: '📄 Resume Match' },
  { id: 'companies', label: '🏢 Company Insights' },
  { id: 'salary', label: '💰 Salary Insights' },
  { id: 'interview', label: '🎤 Interview Prep' },
  { id: 'skills', label: '📊 Skill Demand' },
  { id: 'alerts', label: '🔔 Job Alerts' },
]

const jobs = [
  { id: 1, title: 'Software Engineer', company: 'Google', location: 'Bangalore', type: 'Full Time', salary: '₹25-45 LPA', skills: ['DSA', 'Python', 'System Design'], logo: '🟦', level: 'Senior', posted: '2 days ago', domain: 'Software' },
  { id: 2, title: 'Frontend Developer', company: 'Flipkart', location: 'Bangalore', type: 'Full Time', salary: '₹12-20 LPA', skills: ['React', 'TypeScript', 'CSS'], logo: '🟨', level: 'Mid', posted: '3 days ago', domain: 'Software' },
  { id: 3, title: 'Data Scientist', company: 'Microsoft', location: 'Hyderabad', type: 'Full Time', salary: '₹20-35 LPA', skills: ['Python', 'ML', 'SQL'], logo: '🟥', level: 'Mid', posted: '1 day ago', domain: 'Data' },
  { id: 4, title: 'Product Manager', company: 'Razorpay', location: 'Bangalore', type: 'Full Time', salary: '₹18-30 LPA', skills: ['Analytics', 'Strategy', 'SQL'], logo: '🟩', level: 'Mid', posted: '4 days ago', domain: 'Product' },
  { id: 5, title: 'ML Engineer', company: 'CRED', location: 'Bangalore', type: 'Full Time', salary: '₹22-38 LPA', skills: ['PyTorch', 'MLOps', 'Python'], logo: '⬛', level: 'Senior', posted: '5 days ago', domain: 'Data' },
  { id: 6, title: 'DevOps Engineer', company: 'Swiggy', location: 'Remote', type: 'Full Time', salary: '₹15-25 LPA', skills: ['Docker', 'K8s', 'AWS'], logo: '🟧', level: 'Mid', posted: '2 days ago', domain: 'DevOps' },
  { id: 7, title: 'UI/UX Designer', company: 'Meesho', location: 'Bangalore', type: 'Full Time', salary: '₹10-18 LPA', skills: ['Figma', 'Prototyping', 'Research'], logo: '🟪', level: 'Junior', posted: '1 day ago', domain: 'Design' },
  { id: 8, title: 'Backend Engineer', company: 'Zepto', location: 'Mumbai', type: 'Full Time', salary: '₹14-22 LPA', skills: ['Node.js', 'MongoDB', 'Redis'], logo: '🔵', level: 'Mid', posted: '6 days ago', domain: 'Software' },
  { id: 9, title: 'Cloud Architect', company: 'Infosys', location: 'Pune', type: 'Full Time', salary: '₹20-32 LPA', skills: ['AWS', 'Terraform', 'K8s'], logo: '🟦', level: 'Senior', posted: '3 days ago', domain: 'DevOps' },
]

const internships = [
  { id: 1, title: 'SWE Intern', company: 'Google', location: 'Bangalore', stipend: '₹80,000/mo', duration: '3 months', skills: ['DSA', 'Python'], logo: '🟦', deadline: 'Mar 30' },
  { id: 2, title: 'Data Science Intern', company: 'Microsoft', location: 'Hyderabad', stipend: '₹70,000/mo', duration: '6 months', skills: ['ML', 'Python'], logo: '🟥', deadline: 'Apr 15' },
  { id: 3, title: 'Product Intern', company: 'Flipkart', location: 'Bangalore', stipend: '₹50,000/mo', duration: '2 months', skills: ['Analytics', 'SQL'], logo: '🟨', deadline: 'Mar 20' },
  { id: 4, title: 'Frontend Intern', company: 'Razorpay', location: 'Remote', stipend: '₹40,000/mo', duration: '3 months', skills: ['React', 'CSS'], logo: '🟩', deadline: 'Apr 5' },
  { id: 5, title: 'Backend Intern', company: 'CRED', location: 'Bangalore', stipend: '₹60,000/mo', duration: '4 months', skills: ['Node.js', 'MongoDB'], logo: '⬛', deadline: 'Apr 20' },
  { id: 6, title: 'ML Intern', company: 'Zepto', location: 'Mumbai', stipend: '₹45,000/mo', duration: '3 months', skills: ['Python', 'TensorFlow'], logo: '🔵', deadline: 'Mar 25' },
]

const companies = [
  { name: 'Google', logo: '🟦', domain: 'Software/AI', employees: '150,000+', hires: '500+/year', avgSalary: '₹35 LPA', culture: 'Innovation, 20% time, free meals', rounds: 'OA → Phone → 4-5 Onsite', color: '#EFF6FF', accent: '#2563EB' },
  { name: 'Microsoft', logo: '🟥', domain: 'Software/Cloud', employees: '200,000+', hires: '400+/year', avgSalary: '₹30 LPA', culture: 'Growth mindset, work-life balance', rounds: 'OA → 4 Technical + 1 HR', color: '#FFF1F2', accent: '#DC2626' },
  { name: 'Flipkart', logo: '🟨', domain: 'E-commerce', employees: '30,000+', hires: '300+/year', avgSalary: '₹20 LPA', culture: 'Fast-paced, ownership culture', rounds: 'OA → 3 Technical + 1 HR', color: '#FFF7ED', accent: '#D97706' },
  { name: 'Razorpay', logo: '🟩', domain: 'Fintech', employees: '3,000+', hires: '200+/year', avgSalary: '₹22 LPA', culture: 'Startup energy, fast growth', rounds: 'OA → 2 Technical + System Design', color: '#F0FDF4', accent: '#15803D' },
]

const salaryData = [
  { role: 'Software Engineer', junior: '₹5-10L', mid: '₹12-22L', senior: '₹25-45L', top: '₹50L+' },
  { role: 'Data Scientist', junior: '₹6-12L', mid: '₹14-25L', senior: '₹28-40L', top: '₹45L+' },
  { role: 'Product Manager', junior: '₹8-14L', mid: '₹16-28L', senior: '₹30-50L', top: '₹60L+' },
  { role: 'DevOps Engineer', junior: '₹6-11L', mid: '₹13-22L', senior: '₹24-35L', top: '₹40L+' },
  { role: 'UI/UX Designer', junior: '₹4-8L', mid: '₹9-16L', senior: '₹18-28L', top: '₹35L+' },
  { role: 'ML Engineer', junior: '₹8-14L', mid: '₹16-28L', senior: '₹30-50L', top: '₹60L+' },
]

const skillDemand = [
  { skill: 'Generative AI / LLMs', demand: 95, growth: '+340%', color: '#7C3AED' },
  { skill: 'React.js', demand: 88, growth: '+45%', color: '#2563EB' },
  { skill: 'Python', demand: 92, growth: '+60%', color: '#059669' },
  { skill: 'Kubernetes', demand: 78, growth: '+150%', color: '#0284C7' },
  { skill: 'System Design', demand: 85, growth: '+80%', color: '#D97706' },
  { skill: 'Prompt Engineering', demand: 82, growth: '+280%', color: '#DC2626' },
  { skill: 'TypeScript', demand: 76, growth: '+90%', color: '#2563EB' },
  { skill: 'AWS/Cloud', demand: 80, growth: '+70%', color: '#D97706' },
]

const interviewTips = [
  { company: 'Google', tips: ['Focus heavily on DSA - LeetCode Hard level', 'Communicate your thought process clearly', 'Prepare for behavioral (Googleyness) questions', 'System design is critical for SDE-2+'] },
  { company: 'Microsoft', tips: ['Strong emphasis on problem-solving approach', 'Design patterns and OOP concepts matter', 'Growth mindset cultural fit questions', 'Azure knowledge is a plus'] },
  { company: 'Startups', tips: ['Show ownership and initiative mindset', 'Full-stack knowledge valued over specialization', 'Move fast - iterations and shipping matter', 'Ask smart questions about product direction'] },
]

const SectionHeader = ({ icon, title, desc }) => (
  <div style={{ marginBottom: 28 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <h2 style={{ fontFamily: 'Sora,sans-serif', fontSize: 20, fontWeight: 800, color: 'var(--text-dark)' }}>{title}</h2>
    </div>
    {desc && <p style={{ fontSize: 14, color: 'var(--text-muted)', marginLeft: 32 }}>{desc}</p>}
  </div>
)

export default function Jobs() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('listings')
  const [filterDomain, setFilterDomain] = useState('All')
  const [filterLevel, setFilterLevel] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [applications, setApplications] = useState([
    { id: 1, company: 'Google', role: 'SWE Intern', status: 'Applied', date: '2026-02-20', notes: 'OA scheduled' },
    { id: 2, company: 'Flipkart', role: 'Frontend Dev', status: 'Interview', date: '2026-02-25', notes: 'Round 1 done' },
    { id: 3, company: 'Razorpay', role: 'Backend Eng', status: 'Offer', date: '2026-03-01', notes: '₹18 LPA offer' },
  ])
  const [newApp, setNewApp] = useState({ company: '', role: '', status: 'Applied', notes: '' })
  const [addingApp, setAddingApp] = useState(false)
  const [readinessForm, setReadinessForm] = useState({ skills: '', cgpa: '', projects: '', experience: '' })
  const [readinessResult, setReadinessResult] = useState(null)
  const [alertForm, setAlertForm] = useState({ role: '', location: '', minSalary: '' })
  const [alerts, setAlerts] = useState([])
  const [expandedCompany, setExpandedCompany] = useState(null)
  const [expandedTip, setExpandedTip] = useState(null)

  useEffect(() => { if (!user) navigate('/') }, [user])

  const filteredJobs = jobs.filter(j => {
    const matchDomain = filterDomain === 'All' || j.domain === filterDomain
    const matchLevel = filterLevel === 'All' || j.level === filterLevel
    const matchSearch = j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.company.toLowerCase().includes(searchQuery.toLowerCase())
    return matchDomain && matchLevel && matchSearch
  })

  const calcReadiness = () => {
    const skills = readinessForm.skills.split(',').map(s => s.trim()).filter(Boolean)
    const cgpa = parseFloat(readinessForm.cgpa) || 0
    const projects = parseInt(readinessForm.projects) || 0
    const experience = parseInt(readinessForm.experience) || 0
    const skillScore = Math.min(skills.length / 5, 1) * 40
    const cgpaScore = (cgpa / 10) * 30
    const projectScore = Math.min(projects / 4, 1) * 20
    const expScore = Math.min(experience / 2, 1) * 10
    const total = Math.round(skillScore + cgpaScore + projectScore + expScore)
    const level = total >= 80 ? 'Placement Ready! 🎉' : total >= 60 ? 'Almost Ready 💪' : total >= 40 ? 'In Progress 📚' : 'Just Starting 🌱'
    const tips = []
    if (skills.length < 5) tips.push('Add more skills to your profile (aim for 5+)')
    if (cgpa < 7.5) tips.push('Work on improving your CGPA above 7.5')
    if (projects < 3) tips.push('Build at least 3 strong projects with GitHub links')
    if (experience < 1) tips.push('Apply for internships to gain work experience')
    setReadinessResult({ total, level, tips })
  }

  const addAlert = () => {
    if (!alertForm.role) return
    setAlerts(p => [...p, { ...alertForm, id: Date.now() }])
    setAlertForm({ role: '', location: '', minSalary: '' })
  }

  const addApplication = () => {
    if (!newApp.company || !newApp.role) return
    setApplications(p => [...p, { ...newApp, id: Date.now(), date: new Date().toISOString().split('T')[0] }])
    setNewApp({ company: '', role: '', status: 'Applied', notes: '' })
    setAddingApp(false)
  }

  const updateStatus = (id, status) => setApplications(p => p.map(a => a.id === id ? { ...a, status } : a))

  const statusColors = { Applied: ['#EFF6FF', '#2563EB'], Interview: ['#FFF7ED', '#D97706'], Offer: ['#F0FDF4', '#15803D'], Rejected: ['#FFF1F2', '#DC2626'] }

  const card = { background: '#fff', borderRadius: 20, padding: 24, border: '1px solid var(--border)', transition: 'transform 0.2s, box-shadow 0.2s' }
  const btn = { height: 44, padding: '0 24px', borderRadius: 12, background: 'linear-gradient(135deg,#2563EB,#7C3AED)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Sora,sans-serif', fontWeight: 600, fontSize: 14 }
  const inp = { height: 40, padding: '0 12px', borderRadius: 10, border: '1.5px solid var(--border)', background: '#fff', fontSize: 13.5, outline: 'none', fontFamily: 'DM Sans,sans-serif', width: '100%' }

  return (
    <AppLayout>
      <div style={{ background: 'linear-gradient(135deg,#0F172A,#1E40AF,#2563EB)', padding: '48px 0 0' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🔎</div>
              <div>
                <h1 style={{ fontFamily: 'Sora,sans-serif', fontSize: 28, fontWeight: 800, color: '#fff' }}>Jobs</h1>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>Find jobs, track applications, and prepare for placements</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ height: 38, padding: '0 14px', borderRadius: '10px 10px 0 0', border: 'none', cursor: 'pointer', background: activeTab === t.id ? '#F8FAFF' : 'rgba(255,255,255,0.15)', color: activeTab === t.id ? '#1E40AF' : 'rgba(255,255,255,0.85)', fontFamily: 'Sora,sans-serif', fontWeight: 600, fontSize: 12.5 }}>{t.label}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="container" style={{ padding: '40px 24px' }}>

          {/* JOB LISTINGS */}
          {activeTab === 'listings' && (
            <div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap', alignItems: 'center' }}>
                <input placeholder="Search jobs or companies..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ ...inp, width: 240 }} />
                {['All', 'Software', 'Data', 'Product', 'Design', 'DevOps'].map(d => (
                  <button key={d} onClick={() => setFilterDomain(d)} style={{ height: 36, padding: '0 14px', borderRadius: 20, border: '1.5px solid var(--border)', background: filterDomain === d ? 'linear-gradient(135deg,#2563EB,#7C3AED)' : '#fff', color: filterDomain === d ? '#fff' : 'var(--text-mid)', fontFamily: 'Sora,sans-serif', fontWeight: 600, fontSize: 12.5, cursor: 'pointer' }}>{d}</button>
                ))}
                <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} style={{ ...inp, width: 120, cursor: 'pointer' }}>
                  {['All', 'Junior', 'Mid', 'Senior'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                {filteredJobs.map(job => (
                  <div key={job.id} style={card}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <div style={{ fontSize: 30 }}>{job.logo}</div>
                        <div>
                          <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 15 }}>{job.title}</div>
                          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{job.company} • {job.location}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: '#F0FDF4', color: '#15803D', height: 'fit-content' }}>{job.type}</span>
                    </div>
                    <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 15, fontWeight: 800, color: '#2563EB', marginBottom: 10 }}>{job.salary}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                      {job.skills.map(s => <span key={s} style={{ fontSize: 11.5, padding: '3px 10px', borderRadius: 20, background: '#EFF6FF', color: '#2563EB', fontWeight: 600 }}>{s}</span>)}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>🕒 {job.posted}</span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button style={{ height: 34, padding: '0 14px', borderRadius: 10, border: '1.5px solid var(--border)', background: '#fff', color: 'var(--text-mid)', cursor: 'pointer', fontSize: 12.5, fontWeight: 600 }}>Save</button>
                        <button style={{ ...btn, height: 34, fontSize: 12.5 }}>Apply →</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INTERNSHIPS */}
          {activeTab === 'internships' && (
            <div>
              <SectionHeader icon="🎯" title="Internship Listings" desc="Latest internship opportunities from top companies" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                {internships.map(i => (
                  <div key={i.id} style={card}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <div style={{ fontSize: 28 }}>{i.logo}</div>
                        <div>
                          <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 15 }}>{i.company}</div>
                          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{i.title}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: '#FFF1F2', color: '#DC2626', height: 'fit-content' }}>Deadline: {i.deadline}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12 }}>
                      {[['📍', i.location], ['💰', i.stipend], ['⏱️', i.duration]].map(([icon, val]) => (
                        <div key={val} style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{icon} {val}</div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                      {i.skills.map(s => <span key={s} style={{ fontSize: 11.5, padding: '3px 10px', borderRadius: 20, background: '#EFF6FF', color: '#2563EB', fontWeight: 600 }}>{s}</span>)}
                    </div>
                    <button style={{ ...btn, height: 38, fontSize: 13, width: '100%' }}>Apply Now →</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* APPLICATION TRACKER */}
          {activeTab === 'tracker' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                <SectionHeader icon="📋" title="Application Tracker" desc="Track all your job applications in one place" />
                <button onClick={() => setAddingApp(true)} style={{ ...btn, height: 40 }}>+ Add Application</button>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
                {[['Applied', '#EFF6FF', '#2563EB'], ['Interview', '#FFF7ED', '#D97706'], ['Offer', '#F0FDF4', '#15803D'], ['Rejected', '#FFF1F2', '#DC2626']].map(([status, bg, color]) => (
                  <div key={status} style={{ ...card, textAlign: 'center', padding: 16 }}>
                    <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 28, fontWeight: 800, color }}>{applications.filter(a => a.status === status).length}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{status}</div>
                  </div>
                ))}
              </div>

              {/* Add form */}
              {addingApp && (
                <div style={{ ...card, marginBottom: 20, background: '#F8FAFF' }}>
                  <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Add New Application</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <input placeholder="Company" value={newApp.company} onChange={e => setNewApp(p => ({ ...p, company: e.target.value }))} style={inp} />
                    <input placeholder="Role" value={newApp.role} onChange={e => setNewApp(p => ({ ...p, role: e.target.value }))} style={inp} />
                    <select value={newApp.status} onChange={e => setNewApp(p => ({ ...p, status: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}>
                      {['Applied', 'Interview', 'Offer', 'Rejected'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <input placeholder="Notes (optional)" value={newApp.notes} onChange={e => setNewApp(p => ({ ...p, notes: e.target.value }))} style={{ ...inp, marginBottom: 12 }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={addApplication} style={{ ...btn, height: 38 }}>Add</button>
                    <button onClick={() => setAddingApp(false)} style={{ height: 38, padding: '0 16px', borderRadius: 10, border: '1.5px solid var(--border)', background: '#fff', cursor: 'pointer', fontSize: 13.5 }}>Cancel</button>
                  </div>
                </div>
              )}

              {/* Applications list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {applications.map(app => {
                  const [bg, color] = statusColors[app.status] || ['#F1F5F9', '#475569']
                  return (
                    <div key={app.id} style={{ ...card, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <div>
                          <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 14 }}>{app.company}</div>
                          <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{app.role} • {app.date}</div>
                          {app.notes && <div style={{ fontSize: 12, color: '#7C3AED', marginTop: 2 }}>📝 {app.notes}</div>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: bg, color }}>{app.status}</span>
                        <select value={app.status} onChange={e => updateStatus(app.id, e.target.value)} style={{ height: 32, padding: '0 8px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 12.5, cursor: 'pointer', outline: 'none' }}>
                          {['Applied', 'Interview', 'Offer', 'Rejected'].map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* PLACEMENT READINESS */}
          {activeTab === 'readiness' && (
            <div style={{ maxWidth: 620 }}>
              <SectionHeader icon="✅" title="Placement Readiness Score" desc="Find out how ready you are for campus placements" />
              <div style={card}>
                {[['Your Skills (comma separated)', 'skills', 'React, Python, SQL, DSA'], ['CGPA', 'cgpa', '8.0'], ['Number of Projects', 'projects', '3'], ['Internship Experience (months)', 'experience', '3']].map(([label, key, ph]) => (
                  <div key={key} style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'Sora,sans-serif' }}>{label}</label>
                    <input placeholder={ph} value={readinessForm[key]} onChange={e => setReadinessForm(p => ({ ...p, [key]: e.target.value }))} style={inp} />
                  </div>
                ))}
                <button onClick={calcReadiness} style={btn}>Calculate Readiness</button>
              </div>
              {readinessResult && (
                <div style={{ marginTop: 24 }}>
                  <div style={{ background: 'linear-gradient(135deg,#0F172A,#1E40AF)', borderRadius: 20, padding: 28, textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 64, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{readinessResult.total}</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>out of 100</div>
                    <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 12 }}>{readinessResult.level}</div>
                    <div style={{ height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 4, marginTop: 16, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${readinessResult.total}%`, background: '#fff', borderRadius: 4 }} />
                    </div>
                  </div>
                  {readinessResult.tips.length > 0 && (
                    <div style={card}>
                      <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>💡 How to improve:</div>
                      {readinessResult.tips.map((t, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, padding: '8px 0', borderBottom: i < readinessResult.tips.length - 1 ? '1px solid var(--border)' : 'none' }}>
                          <span style={{ color: '#2563EB', fontWeight: 700 }}>→</span>
                          <span style={{ fontSize: 13.5, color: 'var(--text-mid)' }}>{t}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* RESUME MATCH */}
          {activeTab === 'resume' && (
            <div style={{ maxWidth: 680 }}>
              <SectionHeader icon="📄" title="Resume Match Score" desc="See how well your resume matches a job description" />
              <div style={{ ...card, marginBottom: 20 }}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'Sora,sans-serif' }}>Your Skills</label>
                  <input placeholder="React, Node.js, Python, SQL, DSA..." style={inp} id="resumeSkills" />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'Sora,sans-serif' }}>Job Description Keywords</label>
                  <textarea placeholder="Paste the job description or key requirements here..." style={{ ...inp, height: 100, padding: '10px 12px', resize: 'vertical' }} id="jobDesc" />
                </div>
                <button onClick={() => {
                  const skills = document.getElementById('resumeSkills').value.toLowerCase().split(',').map(s => s.trim())
                  const jd = document.getElementById('jobDesc').value.toLowerCase()
                  const matched = skills.filter(s => jd.includes(s))
                  alert(`✅ Resume Match: ${Math.round((matched.length / skills.length) * 100)}%\n\nMatched: ${matched.join(', ') || 'None'}\nMissing: ${skills.filter(s => !jd.includes(s)).join(', ') || 'None'}`)
                }} style={btn}>Check Match Score</button>
              </div>
              <div style={{ background: 'linear-gradient(135deg,#1E40AF,#7C3AED)', borderRadius: 20, padding: 24, color: '#fff' }}>
                <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 12 }}>💡 Resume Tips</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 2 }}>
                  • Tailor your resume for each job application<br/>
                  • Use keywords from the job description<br/>
                  • Quantify achievements (e.g. "Reduced load time by 40%")<br/>
                  • Keep it to 1 page for freshers<br/>
                  • Always include GitHub and LinkedIn links
                </div>
              </div>
            </div>
          )}

          {/* COMPANY INSIGHTS */}
          {activeTab === 'companies' && (
            <div>
              <SectionHeader icon="🏢" title="Company Insights" desc="Know before you apply — culture, hiring process and more" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {companies.map((c, i) => (
                  <div key={i} style={{ ...card, cursor: 'pointer' }} onClick={() => setExpandedCompany(expandedCompany === i ? null : i)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                        <div style={{ fontSize: 32 }}>{c.logo}</div>
                        <div>
                          <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 16 }}>{c.name}</div>
                          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{c.domain} • {c.employees} employees</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 14, color: '#059669' }}>{c.avgSalary} avg</span>
                        <span style={{ fontSize: 18, color: 'var(--primary)' }}>{expandedCompany === i ? '▲' : '▼'}</span>
                      </div>
                    </div>
                    {expandedCompany === i && (
                      <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                        {[['👥 Hiring', c.hires], ['🎭 Culture', c.culture], ['🔄 Interview Process', c.rounds]].map(([label, val]) => (
                          <div key={label} style={{ background: '#F8FAFF', borderRadius: 12, padding: '14px 16px' }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'Sora,sans-serif' }}>{label}</div>
                            <div style={{ fontSize: 13.5, color: 'var(--text-dark)', lineHeight: 1.5 }}>{val}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SALARY INSIGHTS */}
          {activeTab === 'salary' && (
            <div>
              <SectionHeader icon="💰" title="Salary Insights" desc="Know your worth — salary ranges by role and experience" />
              <div style={{ ...card, overflowX: 'auto', marginBottom: 24 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFF' }}>
                      {['Role', 'Junior (0-2 yr)', 'Mid (3-5 yr)', 'Senior (6+ yr)', 'Top Talent'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'Sora,sans-serif', fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {salaryData.map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '14px 16px', fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 14 }}>{row.role}</td>
                        <td style={{ padding: '14px 16px', fontSize: 13.5, color: '#D97706' }}>{row.junior}</td>
                        <td style={{ padding: '14px 16px', fontSize: 13.5, color: '#2563EB' }}>{row.mid}</td>
                        <td style={{ padding: '14px 16px', fontSize: 13.5, color: '#7C3AED' }}>{row.senior}</td>
                        <td style={{ padding: '14px 16px', fontSize: 13.5, color: '#059669', fontWeight: 700 }}>{row.top}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ background: 'linear-gradient(135deg,#0F172A,#1E40AF)', borderRadius: 20, padding: 24, color: '#fff' }}>
                <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 10 }}>💡 Salary Negotiation Tips</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 2 }}>
                  • Always research market rates before negotiating<br/>
                  • Never share your expected salary first<br/>
                  • Consider total compensation (stock, bonus, benefits)<br/>
                  • CGPA above 8.0 gives leverage in campus placements<br/>
                  • Multiple offers = stronger negotiation position
                </div>
              </div>
            </div>
          )}

          {/* INTERVIEW PREP */}
          {activeTab === 'interview' && (
            <div>
              <SectionHeader icon="🎤" title="Interview Preparation" desc="Company-specific tips to crack your interviews" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {interviewTips.map((item, i) => (
                  <div key={i} style={{ ...card, cursor: 'pointer' }} onClick={() => setExpandedTip(expandedTip === i ? null : i)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 16 }}>🎯 {item.company}</div>
                      <span style={{ fontSize: 18, color: 'var(--primary)' }}>{expandedTip === i ? '▲' : '▼'}</span>
                    </div>
                    {expandedTip === i && (
                      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {item.tips.map((tip, j) => (
                          <div key={j} style={{ display: 'flex', gap: 10, padding: '10px 14px', background: '#EFF6FF', borderRadius: 10 }}>
                            <span style={{ color: '#2563EB', fontWeight: 700 }}>→</span>
                            <span style={{ fontSize: 13.5, color: 'var(--text-dark)' }}>{tip}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SKILL DEMAND */}
          {activeTab === 'skills' && (
            <div>
              <SectionHeader icon="📊" title="Skill Demand Insights" desc="Most in-demand skills in the job market right now" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 720 }}>
                {skillDemand.map((s, i) => (
                  <div key={i} style={{ ...card, padding: '16px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 14 }}>{s.skill}</div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#15803D', background: '#F0FDF4', padding: '3px 10px', borderRadius: 20 }}>{s.growth}</span>
                        <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 14, color: s.color }}>{s.demand}%</span>
                      </div>
                    </div>
                    <div style={{ height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${s.demand}%`, background: s.color, borderRadius: 4 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* JOB ALERTS */}
          {activeTab === 'alerts' && (
            <div style={{ maxWidth: 620 }}>
              <SectionHeader icon="🔔" title="Job Alerts" desc="Set up alerts and never miss a relevant opportunity" />
              <div style={{ ...card, marginBottom: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'Sora,sans-serif' }}>Job Role</label>
                    <input placeholder="e.g. React Developer" value={alertForm.role} onChange={e => setAlertForm(p => ({ ...p, role: e.target.value }))} style={inp} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'Sora,sans-serif' }}>Location</label>
                    <input placeholder="e.g. Bangalore" value={alertForm.location} onChange={e => setAlertForm(p => ({ ...p, location: e.target.value }))} style={inp} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'Sora,sans-serif' }}>Min Salary</label>
                    <input placeholder="e.g. 10 LPA" value={alertForm.minSalary} onChange={e => setAlertForm(p => ({ ...p, minSalary: e.target.value }))} style={inp} />
                  </div>
                </div>
                <button onClick={addAlert} style={{ ...btn, height: 40 }}>+ Create Alert</button>
              </div>
              {alerts.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {alerts.map(a => (
                    <div key={a.id} style={{ ...card, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 14 }}>🔔 {a.role}</div>
                        <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>{a.location && `📍 ${a.location}`} {a.minSalary && `• 💰 ${a.minSalary}+`}</div>
                      </div>
                      <span style={{ fontSize: 11.5, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: '#F0FDF4', color: '#15803D' }}>Active</span>
                    </div>
                  ))}
                </div>
              )}
              {alerts.length === 0 && (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🔔</div>
                  <div style={{ fontSize: 14 }}>No alerts yet. Create one above!</div>
                </div>
              )}
            </div>
          )}

        </div>
    </AppLayout>
  )
}