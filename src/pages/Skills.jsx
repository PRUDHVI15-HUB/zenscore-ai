import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../context/AuthContext'

const tabs = [
  { id: 'explore', label: '🔍 Explore Skills' },
  { id: 'roadmap', label: '🛣️ Skill Roadmap' },
  { id: 'tracker', label: '📊 Progress Tracker' },
  { id: 'trending', label: '🔥 Trending Skills' },
  { id: 'certifications', label: '🎓 Certifications' },
  { id: 'resources', label: '📚 Free Resources' },
]

const skillCategories = [
  {
    id: 'webdev', icon: '🌐', title: 'Web Development', color: '#EFF6FF', accent: '#2563EB',
    beginner: [
      { name: 'HTML & CSS', resource: 'https://www.w3schools.com' },
      { name: 'JavaScript Basics', resource: 'https://javascript.info' },
      { name: 'Responsive Design', resource: 'https://css-tricks.com' },
    ],
    intermediate: [
      { name: 'React.js', resource: 'https://react.dev' },
      { name: 'Node.js & Express', resource: 'https://nodejs.org' },
      { name: 'REST APIs', resource: 'https://restfulapi.net' },
    ],
    advanced: [
      { name: 'System Design', resource: 'https://systemdesign.one' },
      { name: 'Microservices', resource: 'https://microservices.io' },
      { name: 'DevOps & CI/CD', resource: 'https://roadmap.sh/devops' },
    ],
    timeline: '6-9 months', platforms: ['freeCodeCamp', 'The Odin Project', 'Udemy', 'YouTube'],
    jobs: ['Frontend Dev', 'Backend Dev', 'Full Stack Dev'], salary: '₹5L - ₹25L'
  },
  {
    id: 'datascience', icon: '📊', title: 'Data Science', color: '#FDF4FF', accent: '#7C3AED',
    beginner: [
      { name: 'Python Basics', resource: 'https://python.org' },
      { name: 'Statistics & Math', resource: 'https://khanacademy.org' },
      { name: 'Pandas & NumPy', resource: 'https://pandas.pydata.org' },
    ],
    intermediate: [
      { name: 'Machine Learning', resource: 'https://scikit-learn.org' },
      { name: 'Data Visualization', resource: 'https://matplotlib.org' },
      { name: 'SQL & Databases', resource: 'https://sqlzoo.net' },
    ],
    advanced: [
      { name: 'Deep Learning', resource: 'https://deeplearning.ai' },
      { name: 'NLP & LLMs', resource: 'https://huggingface.co' },
      { name: 'MLOps', resource: 'https://mlops.community' },
    ],
    timeline: '8-12 months', platforms: ['Kaggle', 'Coursera', 'fast.ai', 'DataCamp'],
    jobs: ['Data Analyst', 'ML Engineer', 'Data Scientist'], salary: '₹6L - ₹30L'
  },
  {
    id: 'dsa', icon: '⚡', title: 'DSA & Competitive', color: '#F0FDF4', accent: '#059669',
    beginner: [
      { name: 'Arrays & Strings', resource: 'https://leetcode.com' },
      { name: 'Linked Lists', resource: 'https://visualgo.net' },
      { name: 'Basic Recursion', resource: 'https://recursion.wtf' },
    ],
    intermediate: [
      { name: 'Trees & Graphs', resource: 'https://leetcode.com' },
      { name: 'Dynamic Programming', resource: 'https://dp.neetcode.io' },
      { name: 'Sorting Algorithms', resource: 'https://sorting.at' },
    ],
    advanced: [
      { name: 'Advanced Graphs', resource: 'https://codeforces.com' },
      { name: 'Segment Trees', resource: 'https://cp-algorithms.com' },
      { name: 'Competitive Programming', resource: 'https://codeforces.com' },
    ],
    timeline: '4-8 months', platforms: ['LeetCode', 'Codeforces', 'HackerRank', 'GeeksforGeeks'],
    jobs: ['SDE', 'Backend Engineer', 'Quant Dev'], salary: '₹8L - ₹40L'
  },
  {
    id: 'cloud', icon: '☁️', title: 'Cloud & DevOps', color: '#F0F9FF', accent: '#0284C7',
    beginner: [
      { name: 'Linux Basics', resource: 'https://linuxcommand.org' },
      { name: 'Git & GitHub', resource: 'https://git-scm.com' },
      { name: 'Networking Basics', resource: 'https://networkchuck.com' },
    ],
    intermediate: [
      { name: 'Docker', resource: 'https://docs.docker.com' },
      { name: 'AWS/GCP Basics', resource: 'https://aws.amazon.com/training' },
      { name: 'CI/CD Pipelines', resource: 'https://github.com/features/actions' },
    ],
    advanced: [
      { name: 'Kubernetes', resource: 'https://kubernetes.io' },
      { name: 'Terraform', resource: 'https://terraform.io' },
      { name: 'Cloud Architecture', resource: 'https://aws.amazon.com/architecture' },
    ],
    timeline: '6-10 months', platforms: ['A Cloud Guru', 'Linux Foundation', 'AWS Training', 'KodeKloud'],
    jobs: ['DevOps Engineer', 'Cloud Architect', 'SRE'], salary: '₹7L - ₹28L'
  },
  {
    id: 'aiml', icon: '🤖', title: 'AI & Machine Learning', color: '#FFF7ED', accent: '#D97706',
    beginner: [
      { name: 'Python for AI', resource: 'https://python.org' },
      { name: 'Linear Algebra', resource: 'https://khanacademy.org' },
      { name: 'Intro to ML', resource: 'https://coursera.org' },
    ],
    intermediate: [
      { name: 'Neural Networks', resource: 'https://deeplearning.ai' },
      { name: 'TensorFlow/PyTorch', resource: 'https://pytorch.org' },
      { name: 'Computer Vision', resource: 'https://opencv.org' },
    ],
    advanced: [
      { name: 'LLMs & Transformers', resource: 'https://huggingface.co' },
      { name: 'Reinforcement Learning', resource: 'https://spinningup.openai.com' },
      { name: 'AI Research Papers', resource: 'https://arxiv.org' },
    ],
    timeline: '9-14 months', platforms: ['fast.ai', 'deeplearning.ai', 'Hugging Face', 'Papers with Code'],
    jobs: ['AI Engineer', 'ML Researcher', 'NLP Engineer'], salary: '₹10L - ₹50L'
  },
  {
    id: 'mobile', icon: '📱', title: 'Mobile Development', color: '#FFF1F2', accent: '#DC2626',
    beginner: [
      { name: 'React Native Basics', resource: 'https://reactnative.dev' },
      { name: 'JavaScript ES6+', resource: 'https://javascript.info' },
      { name: 'UI/UX for Mobile', resource: 'https://material.io' },
    ],
    intermediate: [
      { name: 'Navigation & State', resource: 'https://reactnavigation.org' },
      { name: 'Native APIs', resource: 'https://docs.expo.dev' },
      { name: 'Firebase Integration', resource: 'https://firebase.google.com' },
    ],
    advanced: [
      { name: 'Performance Optimization', resource: 'https://reactnative.dev/docs/performance' },
      { name: 'App Store Deployment', resource: 'https://developer.apple.com' },
      { name: 'Flutter (Cross Platform)', resource: 'https://flutter.dev' },
    ],
    timeline: '5-8 months', platforms: ['Expo', 'React Native Docs', 'Udemy', 'YouTube'],
    jobs: ['Mobile Dev', 'React Native Dev', 'Flutter Dev'], salary: '₹5L - ₹20L'
  },
]

const trendingSkills = [
  { name: 'Generative AI', growth: '+340%', demand: 'Explosive', color: '#FFF7ED', accent: '#D97706', icon: '🤖' },
  { name: 'Rust Programming', growth: '+180%', demand: 'Very High', color: '#EFF6FF', accent: '#2563EB', icon: '⚙️' },
  { name: 'Kubernetes', growth: '+150%', demand: 'Very High', color: '#F0F9FF', accent: '#0284C7', icon: '☁️' },
  { name: 'Web3 & Blockchain', growth: '+120%', demand: 'High', color: '#FDF4FF', accent: '#7C3AED', icon: '🔗' },
  { name: 'Prompt Engineering', growth: '+280%', demand: 'Explosive', color: '#F0FDF4', accent: '#059669', icon: '✨' },
  { name: 'Cybersecurity', growth: '+200%', demand: 'Very High', color: '#FFF1F2', accent: '#DC2626', icon: '🔒' },
]

const certifications = [
  { name: 'AWS Solutions Architect', provider: 'Amazon', level: 'Associate', cost: 'Free training + $150 exam', icon: '🟧', color: '#FFF7ED', accent: '#D97706' },
  { name: 'Google Cloud Professional', provider: 'Google', level: 'Professional', cost: 'Free training + $200 exam', icon: '🟦', color: '#EFF6FF', accent: '#2563EB' },
  { name: 'TensorFlow Developer', provider: 'Google', level: 'Professional', cost: 'Free training + $100 exam', icon: '🤖', color: '#FDF4FF', accent: '#7C3AED' },
  { name: 'Meta Frontend Developer', provider: 'Meta/Coursera', level: 'Professional', cost: '~₹2,000/month', icon: '🟦', color: '#F0FDF4', accent: '#059669' },
  { name: 'IBM Data Science', provider: 'IBM/Coursera', level: 'Professional', cost: '~₹2,000/month', icon: '🔵', color: '#F0F9FF', accent: '#0284C7' },
  { name: 'GitHub Actions', provider: 'GitHub', level: 'Intermediate', cost: 'Free', icon: '🐙', color: '#FFF1F2', accent: '#DC2626' },
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

export default function Skills() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('explore')
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [userProgress, setUserProgress] = useState({})
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => { if (!user) navigate('/') }, [user])

  const toggleProgress = (skillId, level, item) => {
    const key = `${skillId}-${level}-${item}`
    setUserProgress(p => ({ ...p, [key]: !p[key] }))
  }

  const getProgress = (skillId) => {
    const skill = skillCategories.find(s => s.id === skillId)
    if (!skill) return 0
    const total = skill.beginner.length + skill.intermediate.length + skill.advanced.length
    const completed = Object.keys(userProgress).filter(k => k.startsWith(skillId) && userProgress[k]).length
    return Math.round((completed / total) * 100)
  }

  const filtered = skillCategories.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    [...s.beginner, ...s.intermediate, ...s.advanced].some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const card = { background: '#fff', borderRadius: 20, padding: 24, border: '1px solid var(--border)', transition: 'transform 0.2s, box-shadow 0.2s' }
  const btn = { height: 44, padding: '0 24px', borderRadius: 12, background: 'linear-gradient(135deg,#2563EB,#7C3AED)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Sora,sans-serif', fontWeight: 600, fontSize: 14 }

  return (
    <AppLayout>
      <div style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7,#EC4899)', padding: '48px 0 0' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>⚡</div>
              <div>
                <h1 style={{ fontFamily: 'Sora,sans-serif', fontSize: 28, fontWeight: 800, color: '#fff' }}>Skills</h1>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>Master in-demand skills with structured roadmaps and free resources</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ height: 38, padding: '0 14px', borderRadius: '10px 10px 0 0', border: 'none', cursor: 'pointer', background: activeTab === t.id ? '#F8FAFF' : 'rgba(255,255,255,0.15)', color: activeTab === t.id ? '#7C3AED' : 'rgba(255,255,255,0.85)', fontFamily: 'Sora,sans-serif', fontWeight: 600, fontSize: 12.5 }}>{t.label}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="container" style={{ padding: '40px 24px' }}>

          {/* EXPLORE */}
          {activeTab === 'explore' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
                <SectionHeader icon="🔍" title="Explore Skill Categories" desc="Click a category to view the full roadmap" />
                <input placeholder="Search skills..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ height: 40, padding: '0 14px 0 14px', borderRadius: 20, border: '1.5px solid var(--border)', fontSize: 13.5, outline: 'none', width: '100%', maxWidth: 220 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                {filtered.map(skill => {
                  const progress = getProgress(skill.id)
                  return (
                    <div key={skill.id} onClick={() => { setSelectedSkill(skill); setActiveTab('roadmap') }} style={{ ...card, cursor: 'pointer', border: selectedSkill?.id === skill.id ? `2px solid ${skill.accent}` : '1px solid var(--border)' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                        <div style={{ width: 52, height: 52, borderRadius: 14, background: skill.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{skill.icon}</div>
                        <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: skill.color, color: skill.accent }}>{skill.timeline}</span>
                      </div>
                      <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 16, fontWeight: 800, color: 'var(--text-dark)', marginBottom: 4 }}>{skill.title}</div>
                      <div style={{ fontSize: 13, color: skill.accent, fontWeight: 600, marginBottom: 10 }}>{skill.salary}</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                        {skill.jobs.map(j => <span key={j} style={{ fontSize: 11.5, padding: '3px 10px', borderRadius: 20, background: skill.color, color: skill.accent, fontWeight: 600 }}>{j}</span>)}
                      </div>
                      {/* Progress bar */}
                      {progress > 0 && (
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                            <span>Progress</span><span style={{ fontWeight: 700, color: skill.accent }}>{progress}%</span>
                          </div>
                          <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg,${skill.accent},${skill.accent}99)`, borderRadius: 3 }} />
                          </div>
                        </div>
                      )}
                      <div style={{ marginTop: 12, fontSize: 13, color: skill.accent, fontWeight: 600 }}>View Roadmap →</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ROADMAP */}
          {activeTab === 'roadmap' && (
            <div>
              <SectionHeader icon="🛣️" title="Skill Roadmap" desc="Structured learning path from beginner to advanced" />
              {!selectedSkill ? (
                <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 14, padding: 20, fontSize: 14, color: '#92400E', marginBottom: 24 }}>
                  ⚠️ Go to <strong>Explore Skills</strong> and select a skill category first.
                </div>
              ) : (
                <div>
                  <div style={{ background: `linear-gradient(135deg,${selectedSkill.accent},${selectedSkill.accent}99)`, borderRadius: 20, padding: 28, marginBottom: 32, color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{selectedSkill.icon} {selectedSkill.title} Roadmap</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>Timeline: {selectedSkill.timeline} • {selectedSkill.salary}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 32, fontWeight: 800 }}>{getProgress(selectedSkill.id)}%</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>completed</div>
                    </div>
                  </div>

                  {[['🟢 Beginner', 'beginner', '#F0FDF4', '#15803D'], ['🟡 Intermediate', 'intermediate', '#FFF7ED', '#B45309'], ['🔴 Advanced', 'advanced', '#FFF1F2', '#DC2626']].map(([title, level, bg, color]) => (
                    <div key={level} style={{ ...card, marginBottom: 20 }}>
                      <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 16, marginBottom: 16, color: 'var(--text-dark)' }}>{title}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {selectedSkill[level].map((item, i) => {
                          const key = `${selectedSkill.id}-${level}-${item.name}`
                          const done = userProgress[key]
                          return (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 12, background: done ? bg : '#F8FAFF', border: `1px solid ${done ? color + '44' : 'var(--border)'}` }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div onClick={() => toggleProgress(selectedSkill.id, level, item.name)} style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${done ? color : 'var(--border)'}`, background: done ? color : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                                  {done && <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>✓</span>}
                                </div>
                                <span style={{ fontSize: 14, fontWeight: done ? 600 : 400, color: done ? color : 'var(--text-dark)', textDecoration: done ? 'line-through' : 'none' }}>{item.name}</span>
                              </div>
                              <a href={item.resource} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>Learn →</a>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}

                  <div style={card}>
                    <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>🎯 Best Platforms</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {selectedSkill.platforms.map(p => <span key={p} style={{ padding: '6px 16px', borderRadius: 20, background: selectedSkill.color, color: selectedSkill.accent, fontWeight: 600, fontSize: 13 }}>{p}</span>)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PROGRESS TRACKER */}
          {activeTab === 'tracker' && (
            <div>
              <SectionHeader icon="📊" title="Progress Tracker" desc="Track your learning progress across all skill categories" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
                {skillCategories.map(skill => {
                  const progress = getProgress(skill.id)
                  const total = skill.beginner.length + skill.intermediate.length + skill.advanced.length
                  const completed = Object.keys(userProgress).filter(k => k.startsWith(skill.id) && userProgress[k]).length
                  return (
                    <div key={skill.id} style={card}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: skill.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{skill.icon}</div>
                        <div>
                          <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 14 }}>{skill.title}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{completed}/{total} topics</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                        <span style={{ color: 'var(--text-muted)' }}>Progress</span>
                        <span style={{ fontWeight: 700, color: skill.accent }}>{progress}%</span>
                      </div>
                      <div style={{ height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
                        <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg,${skill.accent},${skill.accent}88)`, borderRadius: 4, transition: 'width 0.5s' }} />
                      </div>
                      <div style={{ fontSize: 12, padding: '4px 10px', borderRadius: 20, background: progress === 0 ? '#F1F5F9' : progress < 50 ? '#FFF7ED' : progress < 100 ? '#EFF6FF' : '#F0FDF4', color: progress === 0 ? 'var(--text-muted)' : progress < 50 ? '#B45309' : progress < 100 ? '#1D4ED8' : '#15803D', fontWeight: 600, display: 'inline-block' }}>
                        {progress === 0 ? 'Not started' : progress < 50 ? 'In progress' : progress < 100 ? 'Almost there!' : '✅ Completed!'}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* TRENDING */}
          {activeTab === 'trending' && (
            <div>
              <SectionHeader icon="🔥" title="Trending Skills 2026" desc="Most in-demand skills in the job market right now" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginBottom: 32 }}>
                {trendingSkills.map((skill, i) => (
                  <div key={i} style={{ ...card }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: skill.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{skill.icon}</div>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#15803D', background: '#F0FDF4', padding: '4px 10px', borderRadius: 20 }}>{skill.growth}</span>
                    </div>
                    <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{skill.name}</div>
                    <span style={{ fontSize: 11.5, padding: '3px 10px', borderRadius: 20, background: skill.color, color: skill.accent, fontWeight: 600 }}>{skill.demand} Demand</span>
                  </div>
                ))}
              </div>
              <div style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)', borderRadius: 20, padding: 28, color: '#fff' }}>
                <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 18, fontWeight: 800, marginBottom: 8 }}>💡 Why Learn These?</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.8 }}>
                  These skills are seeing the highest growth in job postings in 2026. Companies are hiring aggressively for these roles with premium salaries. Start learning today to get ahead of the curve!
                </div>
              </div>
            </div>
          )}

          {/* CERTIFICATIONS */}
          {activeTab === 'certifications' && (
            <div>
              <SectionHeader icon="🎓" title="Top Certifications" desc="Industry-recognized certifications to boost your resume" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 24 }}>
                {certifications.map((cert, i) => (
                  <div key={i} style={{ ...card }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
                      <div style={{ fontSize: 32 }}>{cert.icon}</div>
                      <div>
                        <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 15, marginBottom: 2 }}>{cert.name}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>by {cert.provider}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                      <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: cert.color, color: cert.accent, fontWeight: 600 }}>{cert.level}</span>
                      <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: '#F1F5F9', color: 'var(--text-mid)', fontWeight: 600 }}>💰 {cert.cost}</span>
                    </div>
                    <button style={{ ...btn, height: 38, fontSize: 13, width: '100%', background: `linear-gradient(135deg,${cert.accent},${cert.accent}99)` }}>Start Learning →</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FREE RESOURCES */}
          {activeTab === 'resources' && (
            <div>
              <SectionHeader icon="📚" title="Free Learning Resources" desc="Best free platforms and resources to learn any skill" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
                {[
                  { icon: '🎥', name: 'YouTube', desc: 'Best free video tutorials for any tech topic', link: 'https://youtube.com', color: '#FFF1F2', accent: '#DC2626' },
                  { icon: '💻', name: 'freeCodeCamp', desc: 'Free full-stack web development curriculum', link: 'https://freecodecamp.org', color: '#F0FDF4', accent: '#15803D' },
                  { icon: '🏆', name: 'LeetCode', desc: 'DSA practice with 2500+ coding problems', link: 'https://leetcode.com', color: '#FFF7ED', accent: '#D97706' },
                  { icon: '📖', name: 'MDN Web Docs', desc: 'Official web development documentation', link: 'https://developer.mozilla.org', color: '#EFF6FF', accent: '#2563EB' },
                  { icon: '🐍', name: 'Python.org', desc: 'Official Python tutorials and documentation', link: 'https://python.org', color: '#FDF4FF', accent: '#7C3AED' },
                  { icon: '⚛️', name: 'React Docs', desc: 'Official React.js documentation', link: 'https://react.dev', color: '#F0F9FF', accent: '#0284C7' },
                  { icon: '🗄️', name: 'SQL Zoo', desc: 'Interactive SQL learning platform', link: 'https://sqlzoo.net', color: '#F0FDF4', accent: '#059669' },
                  { icon: '🤗', name: 'Hugging Face', desc: 'Free AI/ML models and datasets', link: 'https://huggingface.co', color: '#FFF7ED', accent: '#D97706' },
                  { icon: '🗺️', name: 'roadmap.sh', desc: 'Developer roadmaps for any career path', link: 'https://roadmap.sh', color: '#FFF1F2', accent: '#DC2626' },
                ].map(r => (
                  <a key={r.name} href={r.link} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                    <div style={{ ...card, cursor: 'pointer' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 12 }}>{r.icon}</div>
                      <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{r.name}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 10 }}>{r.desc}</div>
                      <span style={{ fontSize: 12, color: r.accent, fontWeight: 600 }}>Visit →</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>
    </AppLayout>
  )
}