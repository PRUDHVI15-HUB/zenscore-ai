import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../context/AuthContext'

const rooms = [
  { id: 1, topic: 'Data Structures & Algorithms', icon: '⚡', members: 24, active: 8, branch: 'CSE', level: 'Intermediate', tags: ['Arrays', 'Trees', 'DP', 'Graphs'], color: '#EFF6FF', accent: '#2563EB', discord: 'https://discord.gg/dsa' },
  { id: 2, topic: 'Signals & Systems', icon: '📡', members: 18, active: 5, branch: 'ECE', level: 'Intermediate', tags: ['Fourier', 'Laplace', 'Modulation'], color: '#FDF4FF', accent: '#7C3AED', discord: 'https://discord.gg/ece' },
  { id: 3, topic: 'Operating Systems', icon: '💻', members: 31, active: 12, branch: 'CSE', level: 'Advanced', tags: ['Scheduling', 'Memory', 'Deadlock'], color: '#F0FDF4', accent: '#059669', discord: 'https://discord.gg/os' },
  { id: 4, topic: 'DBMS & SQL', icon: '🗄️', members: 27, active: 9, branch: 'CSE', level: 'Beginner', tags: ['SQL', 'Normalization', 'ER Model'], color: '#FFF7ED', accent: '#D97706', discord: 'https://discord.gg/dbms' },
  { id: 5, topic: 'DevOps & Cloud', icon: '☁️', members: 15, active: 6, branch: 'CSE/ECE', level: 'Advanced', tags: ['Docker', 'Kubernetes', 'CI/CD'], color: '#F0F9FF', accent: '#0284C7', discord: 'https://discord.gg/devops' },
  { id: 6, topic: 'Electronics & Circuits', icon: '⚙️', members: 20, active: 7, branch: 'ECE', level: 'Intermediate', tags: ['BJT', 'MOSFET', 'Amplifiers'], color: '#FFF1F2', accent: '#DC2626', discord: 'https://discord.gg/ece-circuits' },
  { id: 7, topic: 'Machine Learning', icon: '🤖', members: 35, active: 15, branch: 'CSE', level: 'Advanced', tags: ['Regression', 'Neural Networks', 'Kaggle'], color: '#FDF4FF', accent: '#7C3AED', discord: 'https://discord.gg/ml' },
  { id: 8, topic: 'Computer Networks', icon: '🌐', members: 22, active: 8, branch: 'CSE/ECE', level: 'Intermediate', tags: ['TCP/IP', 'OSI', 'Routing'], color: '#EFF6FF', accent: '#2563EB', discord: 'https://discord.gg/networks' },
  { id: 9, topic: 'Engineering Mathematics', icon: '📐', members: 40, active: 18, branch: 'All', level: 'Beginner', tags: ['Calculus', 'Linear Algebra', 'Probability'], color: '#F0FDF4', accent: '#059669', discord: 'https://discord.gg/math' },
]

const levelColors = { Beginner: ['#F0FDF4', '#15803D'], Intermediate: ['#FFF7ED', '#D97706'], Advanced: ['#FFF1F2', '#DC2626'] }

export default function StudyGroups() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [branchFilter, setBranchFilter] = useState('All')
  const [levelFilter, setLevelFilter] = useState('All')
  const [joinedRooms, setJoinedRooms] = useState([])

  useEffect(() => { if (!user) navigate('/') }, [user])

  const filtered = rooms.filter(r => {
    const matchSearch = r.topic.toLowerCase().includes(search.toLowerCase()) || r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    const matchBranch = branchFilter === 'All' || r.branch.includes(branchFilter)
    const matchLevel = levelFilter === 'All' || r.level === levelFilter
    return matchSearch && matchBranch && matchLevel
  })

  const toggleJoin = (id) => setJoinedRooms(p => p.includes(id) ? p.filter(r => r !== id) : [...p, id])

  const inp = { height: 40, padding: '0 14px', borderRadius: 10, border: '1.5px solid var(--border)', background: '#fff', fontSize: 13.5, outline: 'none', fontFamily: 'DM Sans,sans-serif' }
  const sel = { ...inp, cursor: 'pointer' }

  return (
    <AppLayout>
      <div style={{ background: 'linear-gradient(135deg,#0F172A,#1E3A5F,#059669)', padding: '48px 0 40px' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>👥</div>
              <div>
                <h1 style={{ fontFamily: 'Sora,sans-serif', fontSize: 28, fontWeight: 800, color: '#fff' }}>Study Groups</h1>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>Join topic-based study rooms and learn with peers</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <input placeholder="🔍 Search topics, tags..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, width: 260, background: 'rgba(255,255,255,0.95)' }} />
              <select value={branchFilter} onChange={e => setBranchFilter(e.target.value)} style={{ ...sel, background: 'rgba(255,255,255,0.95)', color: '#1E293B' }}>
                {['All', 'CSE', 'ECE', 'EEE'].map(b => <option key={b}>{b}</option>)}
              </select>
              <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} style={{ ...sel, background: 'rgba(255,255,255,0.95)', color: '#1E293B' }}>
                {['All', 'Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="container" style={{ padding: '40px 24px' }}>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }}>
            {[['👥', 'Total Rooms', rooms.length, '#EFF6FF', '#2563EB'], ['🟢', 'Active Now', rooms.reduce((s, r) => s + r.active, 0), '#F0FDF4', '#059669'], ['✅', 'Joined', joinedRooms.length, '#FDF4FF', '#7C3AED'], ['🎓', 'Students', rooms.reduce((s, r) => s + r.members, 0), '#FFF7ED', '#D97706']].map(([icon, label, val, bg, color]) => (
              <div key={label} style={{ background: bg, borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontSize: 28 }}>{icon}</div>
                <div>
                  <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 24, fontWeight: 800, color }}>{val}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Rooms grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {filtered.map(room => {
              const isJoined = joinedRooms.includes(room.id)
              const [lvlBg, lvlColor] = levelColors[room.level]
              return (
                <div key={room.id} style={{ background: '#fff', borderRadius: 20, padding: 22, border: isJoined ? '2px solid #059669' : '1px solid var(--border)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: room.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{room.icon}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: lvlBg, color: lvlColor, fontWeight: 700 }}>{room.level}</span>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: '#F1F5F9', color: 'var(--text-mid)', fontWeight: 600 }}>{room.branch}</span>
                    </div>
                  </div>

                  <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 15, color: 'var(--text-dark)', marginBottom: 8 }}>{room.topic}</div>

                  <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>👥 {room.members} members</span>
                    <span style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>🟢 {room.active} active</span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 16 }}>
                    {room.tags.map(tag => <span key={tag} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: room.color, color: room.accent, fontWeight: 600 }}>{tag}</span>)}
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => toggleJoin(room.id)} style={{ flex: 1, height: 38, borderRadius: 10, border: 'none', cursor: 'pointer', background: isJoined ? '#F0FDF4' : 'linear-gradient(135deg,#2563EB,#7C3AED)', color: isJoined ? '#059669' : '#fff', fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 13 }}>
                      {isJoined ? '✅ Joined' : '+ Join Room'}
                    </button>
                    <a href={room.discord} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                      <button style={{ height: 38, width: 38, borderRadius: 10, border: '1.5px solid var(--border)', background: '#fff', cursor: 'pointer', fontSize: 16 }}>💬</button>
                    </a>
                  </div>
                </div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 20, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 18 }}>No rooms found</div>
              <div style={{ color: 'var(--text-muted)', marginTop: 8 }}>Try different filters</div>
            </div>
        </div>
    </AppLayout>
  )
}