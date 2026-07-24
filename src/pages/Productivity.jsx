import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../context/AuthContext'

const tabs = [
  { id: 'timer', label: '⏱️ Focus Timer' },
  { id: 'tasks', label: '✅ Daily Tasks' },
  { id: 'weekly', label: '📅 Weekly Planner' },
  { id: 'logger', label: '📝 Session Logger' },
  { id: 'analytics', label: '📊 Analytics' },
  { id: 'goals', label: '🎯 Goals & Habits' },
  { id: 'streak', label: '🔥 Streak Tracker' },
  { id: 'ai', label: '🤖 AI Suggestions' },
  { id: 'distraction', label: '🚫 Distraction Tracker' },
  { id: 'leaderboard', label: '🏆 Leaderboard' },
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

export default function Productivity() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('timer')

  // ── TIMER ──
  const [timerMode, setTimerMode] = useState('pomodoro')
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerSubject, setTimerSubject] = useState('')
  const [pomodoroCount, setPomodoroCount] = useState(0)
  const timerRef = useRef(null)
  const timerModes = { pomodoro: 25 * 60, short: 5 * 60, long: 15 * 60 }

  // ── TASKS ──
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Complete DSA assignment', done: false, priority: 'High' },
    { id: 2, text: 'Watch React lecture', done: false, priority: 'Medium' },
    { id: 3, text: 'Solve 3 LeetCode problems', done: true, priority: 'High' },
  ])
  const [newTask, setNewTask] = useState('')
  const [taskPriority, setTaskPriority] = useState('Medium')

  // ── SESSIONS ──
  const [sessions, setSessions] = useState([
    { id: 1, subject: 'DSA', hours: 2, date: '2026-03-05', notes: 'Trees & Graphs' },
    { id: 2, subject: 'React', hours: 1.5, date: '2026-03-04', notes: 'Hooks practice' },
    { id: 3, subject: 'ML', hours: 3, date: '2026-03-03', notes: 'Supervised learning' },
    { id: 4, subject: 'DSA', hours: 2.5, date: '2026-03-02', notes: 'DP problems' },
  ])
  const [newSession, setNewSession] = useState({ subject: '', hours: '', notes: '' })

  // ── GOALS ──
  const [goals, setGoals] = useState([
    { id: 1, text: 'Study 4 hours daily', progress: 75, target: 30, current: 22 },
    { id: 2, text: 'Solve 100 LeetCode problems', progress: 45, target: 100, current: 45 },
    { id: 3, text: 'Complete ML course', progress: 60, target: 10, current: 6 },
  ])
  const [habits, setHabits] = useState([
    { id: 1, name: 'Morning revision', days: [true, true, false, true, true, false, false] },
    { id: 2, name: 'Evening coding', days: [true, false, true, true, false, true, false] },
    { id: 3, name: 'Read tech articles', days: [false, true, true, false, true, true, false] },
  ])

  // ── WEEKLY ──
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const [weeklyPlan, setWeeklyPlan] = useState({
    Mon: ['DSA - 2hrs', 'React - 1hr'],
    Tue: ['ML - 2hrs'],
    Wed: ['System Design - 1.5hrs', 'DSA - 1hr'],
    Thu: ['Projects - 3hrs'],
    Fri: ['DSA - 2hrs', 'Mock Interview'],
    Sat: ['Open Source - 2hrs', 'Reading'],
    Sun: ['Rest / Revision'],
  })
  const [weeklyInput, setWeeklyInput] = useState({ day: 'Mon', task: '' })

  // ── DISTRACTIONS ──
  const [distractions, setDistractions] = useState([
    { name: 'Instagram', minutes: 45, date: '2026-03-05' },
    { name: 'YouTube', minutes: 30, date: '2026-03-05' },
    { name: 'WhatsApp', minutes: 20, date: '2026-03-04' },
  ])
  const [newDistraction, setNewDistraction] = useState({ name: '', minutes: '' })

  // ── LEADERBOARD ──
  const leaderboard = [
    { rank: 1, name: 'Arjun K', hours: 42, streak: 14, avatar: '👨‍💻', college: 'IIT Hyderabad' },
    { rank: 2, name: 'Priya S', hours: 38, streak: 10, avatar: '👩‍🔬', college: 'NIT Warangal' },
    { rank: 3, name: user?.displayName || 'You', hours: 31, streak: 7, avatar: '🎓', college: 'Your College', isUser: true },
    { rank: 4, name: 'Rahul M', hours: 28, streak: 5, avatar: '👨‍🎓', college: 'BITS Pilani' },
    { rank: 5, name: 'Sneha R', hours: 25, streak: 4, avatar: '👩‍💻', college: 'VIT Vellore' },
  ]

  useEffect(() => { if (!user) navigate('/') }, [user])

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current)
            setTimerRunning(false)
            if (timerMode === 'pomodoro') setPomodoroCount(c => c + 1)
            return timerModes[timerMode]
          }
          return t - 1
        })
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [timerRunning])

  const switchMode = (mode) => { setTimerMode(mode); setTimeLeft(timerModes[mode]); setTimerRunning(false) }
  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  const timerProgress = ((timerModes[timerMode] - timeLeft) / timerModes[timerMode]) * 100

  const addTask = () => { if (!newTask) return; setTasks(p => [...p, { id: Date.now(), text: newTask, done: false, priority: taskPriority }]); setNewTask('') }
  const toggleTask = (id) => setTasks(p => p.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const deleteTask = (id) => setTasks(p => p.filter(t => t.id !== id))

  const addSession = () => {
    if (!newSession.subject || !newSession.hours) return
    setSessions(p => [...p, { ...newSession, id: Date.now(), date: new Date().toISOString().split('T')[0] }])
    setNewSession({ subject: '', hours: '', notes: '' })
  }

  const totalHours = sessions.reduce((sum, s) => sum + parseFloat(s.hours || 0), 0)
  const subjectHours = sessions.reduce((acc, s) => { acc[s.subject] = (acc[s.subject] || 0) + parseFloat(s.hours); return acc }, {})

  const addWeeklyTask = () => {
    if (!weeklyInput.task) return
    setWeeklyPlan(p => ({ ...p, [weeklyInput.day]: [...(p[weeklyInput.day] || []), weeklyInput.task] }))
    setWeeklyInput(p => ({ ...p, task: '' }))
  }

  const toggleHabit = (habitId, dayIdx) => {
    setHabits(p => p.map(h => h.id === habitId ? { ...h, days: h.days.map((d, i) => i === dayIdx ? !d : d) } : h))
  }

  const aiSuggestions = [
    { icon: '⏰', title: 'Peak Hours Detected', desc: 'You study best between 9-11 AM. Schedule your hardest topics in this window.', color: '#EFF6FF', accent: '#2563EB' },
    { icon: '📚', title: 'DSA Focus Needed', desc: 'You\'ve spent 60% of time on theory. Increase hands-on practice to 70%.', color: '#FDF4FF', accent: '#7C3AED' },
    { icon: '🔄', title: 'Break Pattern', desc: 'Take a 5-min break every 25 mins. Your last 3 sessions had no breaks.', color: '#F0FDF4', accent: '#059669' },
    { icon: '🎯', title: 'Weekly Goal Alert', desc: 'You\'re 4 hours behind your weekly goal. Add 2 sessions this weekend.', color: '#FFF7ED', accent: '#D97706' },
    { icon: '💤', title: 'Sleep & Study', desc: 'Sessions after 11 PM show 40% lower retention. Try to sleep by 11 PM.', color: '#FFF1F2', accent: '#DC2626' },
    { icon: '🏆', title: 'Streak Achievement', desc: 'You\'re 3 days away from a 10-day streak! Keep going strong.', color: '#F0FDF4', accent: '#059669' },
  ]

  const card = { background: '#fff', borderRadius: 20, padding: 24, border: '1px solid var(--border)', transition: 'transform 0.2s, box-shadow 0.2s' }
  const btn = { height: 44, padding: '0 24px', borderRadius: 12, background: 'linear-gradient(135deg,#2563EB,#7C3AED)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Sora,sans-serif', fontWeight: 600, fontSize: 14 }
  const inp = { height: 40, padding: '0 12px', borderRadius: 10, border: '1.5px solid var(--border)', background: '#fff', fontSize: 13.5, outline: 'none', fontFamily: 'DM Sans,sans-serif', width: '100%' }
  const priorityColors = { High: ['#FFF1F2', '#DC2626'], Medium: ['#FFF7ED', '#D97706'], Low: ['#F0FDF4', '#15803D'] }

  return (
    <AppLayout>
      <div style={{ background: 'linear-gradient(135deg,#0F172A,#1E3A5F,#059669)', padding: '48px 0 0' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🧠</div>
              <div>
                <h1 style={{ fontFamily: 'Sora,sans-serif', fontSize: 28, fontWeight: 800, color: '#fff' }}>Productivity</h1>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>Focus deeper, track smarter, achieve more every day</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ height: 38, padding: '0 14px', borderRadius: '10px 10px 0 0', border: 'none', cursor: 'pointer', background: activeTab === t.id ? '#F8FAFF' : 'rgba(255,255,255,0.15)', color: activeTab === t.id ? '#059669' : 'rgba(255,255,255,0.85)', fontFamily: 'Sora,sans-serif', fontWeight: 600, fontSize: 12.5 }}>{t.label}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="container" style={{ padding: '40px 24px' }}>

          {/* FOCUS TIMER */}
          {activeTab === 'timer' && (
            <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
              <SectionHeader icon="⏱️" title="Focus Timer" desc="Pomodoro technique for deep work sessions" />
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 32 }}>
                {[['pomodoro', '🍅 Pomodoro (25m)'], ['short', '☕ Short Break (5m)'], ['long', '🌿 Long Break (15m)']].map(([mode, label]) => (
                  <button key={mode} onClick={() => switchMode(mode)} style={{ height: 36, padding: '0 14px', borderRadius: 20, cursor: 'pointer', background: timerMode === mode ? 'linear-gradient(135deg,#2563EB,#7C3AED)' : '#fff', color: timerMode === mode ? '#fff' : 'var(--text-mid)', border: timerMode === mode ? 'none' : '1.5px solid var(--border)', fontFamily: 'Sora,sans-serif', fontWeight: 600, fontSize: 12.5 }}>{label}</button>
                ))}
              </div>

              {/* Circle Timer */}
              <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto 32px' }}>
                <svg width="220" height="220" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="110" cy="110" r="100" fill="none" stroke="#F1F5F9" strokeWidth="10" />
                  <circle cx="110" cy="110" r="100" fill="none" stroke="url(#grad)" strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 100}`}
                    strokeDashoffset={`${2 * Math.PI * 100 * (1 - timerProgress / 100)}`}
                    strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2563EB" />
                      <stop offset="100%" stopColor="#7C3AED" />
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 42, fontWeight: 800, color: 'var(--text-dark)', letterSpacing: '-2px' }}>{formatTime(timeLeft)}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{timerMode === 'pomodoro' ? 'Focus' : 'Break'}</div>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <input placeholder="What are you working on? (e.g. DSA - Trees)" value={timerSubject} onChange={e => setTimerSubject(e.target.value)} style={{ ...inp, textAlign: 'center', marginBottom: 16 }} />
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 24 }}>
                <button onClick={() => setTimerRunning(r => !r)} style={{ ...btn, minWidth: 140 }}>
                  {timerRunning ? '⏸ Pause' : '▶ Start Focus'}
                </button>
                <button onClick={() => { setTimerRunning(false); setTimeLeft(timerModes[timerMode]) }} style={{ height: 44, padding: '0 20px', borderRadius: 12, border: '1.5px solid var(--border)', background: '#fff', cursor: 'pointer', fontSize: 14, fontFamily: 'Sora,sans-serif', fontWeight: 600 }}>↺ Reset</button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{ width: 16, height: 16, borderRadius: '50%', background: i < pomodoroCount % 4 ? '#2563EB' : '#E2E8F0' }} />
                ))}
              </div>

              <div style={{ background: 'linear-gradient(135deg,#0F172A,#059669)', borderRadius: 16, padding: '14px 20px', display: 'inline-flex', gap: 24 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 22, fontWeight: 800, color: '#fff' }}>{pomodoroCount}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Pomodoros Today</div>
                </div>
                <div style={{ width: 1, background: 'rgba(255,255,255,0.2)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 22, fontWeight: 800, color: '#fff' }}>{Math.round(pomodoroCount * 25 / 60 * 10) / 10}h</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Focus Time</div>
                </div>
              </div>
            </div>
          )}

          {/* DAILY TASKS */}
          {activeTab === 'tasks' && (
            <div style={{ maxWidth: 680 }}>
              <SectionHeader icon="✅" title="Daily Task Planner" desc="Plan and complete your tasks for today" />
              <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                <input placeholder="Add a new task..." value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()} style={{ ...inp, flex: 1 }} />
                <select value={taskPriority} onChange={e => setTaskPriority(e.target.value)} style={{ ...inp, width: 110, cursor: 'pointer' }}>
                  {['High', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}
                </select>
                <button onClick={addTask} style={{ ...btn, height: 40, padding: '0 16px' }}>+ Add</button>
              </div>

              <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                {[['Total', tasks.length, '#EFF6FF', '#2563EB'], ['Done', tasks.filter(t => t.done).length, '#F0FDF4', '#15803D'], ['Pending', tasks.filter(t => !t.done).length, '#FFF7ED', '#D97706']].map(([label, val, bg, color]) => (
                  <div key={label} style={{ flex: 1, background: bg, borderRadius: 14, padding: '12px 16px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 24, fontWeight: 800, color }}>{val}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['High', 'Medium', 'Low'].map(priority => {
                  const filtered = tasks.filter(t => t.priority === priority)
                  if (!filtered.length) return null
                  const [bg, color] = priorityColors[priority]
                  return (
                    <div key={priority}>
                      <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 8, fontFamily: 'Sora,sans-serif' }}>{priority.toUpperCase()} PRIORITY</div>
                      {filtered.map(task => (
                        <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#fff', borderRadius: 12, border: `1px solid ${task.done ? '#E2E8F0' : 'var(--border)'}`, marginBottom: 8, opacity: task.done ? 0.6 : 1 }}>
                          <div onClick={() => toggleTask(task.id)} style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${task.done ? '#15803D' : 'var(--border)'}`, background: task.done ? '#15803D' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                            {task.done && <span style={{ color: '#fff', fontSize: 12 }}>✓</span>}
                          </div>
                          <span style={{ flex: 1, fontSize: 14, textDecoration: task.done ? 'line-through' : 'none', color: task.done ? 'var(--text-muted)' : 'var(--text-dark)' }}>{task.text}</span>
                          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: bg, color, fontWeight: 600 }}>{priority}</span>
                          <button onClick={() => deleteTask(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#94A3B8' }}>×</button>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* WEEKLY PLANNER */}
          {activeTab === 'weekly' && (
            <div>
              <SectionHeader icon="📅" title="Weekly Study Planner" desc="Plan your study schedule for the entire week" />
              <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                <select value={weeklyInput.day} onChange={e => setWeeklyInput(p => ({ ...p, day: e.target.value }))} style={{ ...inp, width: 100, cursor: 'pointer' }}>
                  {days.map(d => <option key={d}>{d}</option>)}
                </select>
                <input placeholder="Add task (e.g. DSA - 2hrs)" value={weeklyInput.task} onChange={e => setWeeklyInput(p => ({ ...p, task: e.target.value }))} onKeyDown={e => e.key === 'Enter' && addWeeklyTask()} style={{ ...inp, flex: 1 }} />
                <button onClick={addWeeklyTask} style={{ ...btn, height: 40, padding: '0 16px' }}>+ Add</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
                {days.map(day => (
                  <div key={day} style={{ background: '#fff', borderRadius: 16, padding: 16, border: '1px solid var(--border)', minHeight: 180 }}>
                    <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 14, marginBottom: 12, color: 'var(--primary)', textAlign: 'center' }}>{day}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {(weeklyPlan[day] || []).map((task, i) => (
                        <div key={i} style={{ fontSize: 12, padding: '6px 10px', background: '#F8FAFF', borderRadius: 8, color: 'var(--text-mid)', lineHeight: 1.4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{task}</span>
                          <button onClick={() => setWeeklyPlan(p => ({ ...p, [day]: p[day].filter((_, idx) => idx !== i) }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: 14, padding: 0 }}>×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SESSION LOGGER */}
          {activeTab === 'logger' && (
            <div style={{ maxWidth: 680 }}>
              <SectionHeader icon="📝" title="Study Session Logger" desc="Log your study sessions to track your progress" />
              <div style={{ ...card, marginBottom: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 12 }}>
                  <input placeholder="Subject (e.g. DSA)" value={newSession.subject} onChange={e => setNewSession(p => ({ ...p, subject: e.target.value }))} style={inp} />
                  <input type="number" placeholder="Hours" value={newSession.hours} onChange={e => setNewSession(p => ({ ...p, hours: e.target.value }))} style={inp} />
                  <input placeholder="Notes (optional)" value={newSession.notes} onChange={e => setNewSession(p => ({ ...p, notes: e.target.value }))} style={inp} />
                </div>
                <button onClick={addSession} style={{ ...btn, height: 40 }}>Log Session</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginBottom: 24 }}>
                {[['⏱️', 'Total Hours', `${totalHours.toFixed(1)}h`], ['📚', 'Sessions', sessions.length], ['📅', 'Days Active', new Set(sessions.map(s => s.date)).size]].map(([icon, label, val]) => (
                  <div key={label} style={{ ...card, textAlign: 'center', padding: 16 }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
                    <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>{val}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {sessions.map(s => (
                  <div key={s.id} style={{ ...card, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 14 }}>{s.subject}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>{s.date} {s.notes && `• ${s.notes}`}</div>
                    </div>
                    <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>{s.hours}h</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          {activeTab === 'analytics' && (
            <div>
              <SectionHeader icon="📊" title="Focus Analytics" desc="Visualize your study patterns and performance" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 32 }}>
                {[['⏱️', 'Total Hours', `${totalHours.toFixed(1)}h`, '#EFF6FF', '#2563EB'], ['🔥', 'Current Streak', '7 days', '#FFF7ED', '#D97706'], ['🏆', 'Pomodoros', pomodoroCount, '#FDF4FF', '#7C3AED'], ['📅', 'Active Days', new Set(sessions.map(s => s.date)).size, '#F0FDF4', '#059669']].map(([icon, label, val, bg, color]) => (
                  <div key={label} style={{ ...card, textAlign: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, margin: '0 auto 10px' }}>{icon}</div>
                    <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 26, fontWeight: 800, color }}>{val}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div style={card}>
                  <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 20 }}>📚 Hours by Subject</div>
                  {Object.entries(subjectHours).map(([subject, hours]) => {
                    const maxH = Math.max(...Object.values(subjectHours))
                    return (
                      <div key={subject} style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                          <span style={{ fontWeight: 600 }}>{subject}</span>
                          <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{hours}h</span>
                        </div>
                        <div style={{ height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${(hours / maxH) * 100}%`, background: 'linear-gradient(90deg,#2563EB,#7C3AED)', borderRadius: 4 }} />
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div style={card}>
                  <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 20 }}>📅 Last 7 Days</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 120 }}>
                    {days.map((day, i) => {
                      const dayHours = sessions.filter(s => {
                        const d = new Date(s.date)
                        return d.getDay() === (i + 1) % 7
                      }).reduce((sum, s) => sum + parseFloat(s.hours), 0)
                      const maxH = 4
                      return (
                        <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                          <div style={{ width: '100%', background: dayHours > 0 ? 'linear-gradient(180deg,#7C3AED,#2563EB)' : '#F1F5F9', borderRadius: '4px 4px 0 0', height: `${Math.max((dayHours / maxH) * 100, 4)}px` }} />
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{day}</div>
                          <div style={{ fontSize: 10, color: 'var(--primary)', fontWeight: 700 }}>{dayHours > 0 ? `${dayHours}h` : ''}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GOALS & HABITS */}
          {activeTab === 'goals' && (
            <div>
              <SectionHeader icon="🎯" title="Goals & Habits" desc="Set goals and build daily habits for consistent progress" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 16, color: 'var(--text-dark)' }}>🎯 Goals</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {goals.map(goal => (
                      <div key={goal.id} style={card}>
                        <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{goal.text}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                          <span>Progress</span><span style={{ fontWeight: 700, color: 'var(--primary)' }}>{goal.current}/{goal.target}</span>
                        </div>
                        <div style={{ height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${goal.progress}%`, background: 'linear-gradient(90deg,#2563EB,#7C3AED)', borderRadius: 4 }} />
                        </div>
                        <div style={{ fontSize: 12, color: '#7C3AED', fontWeight: 700, marginTop: 6 }}>{goal.progress}% complete</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 16, color: 'var(--text-dark)' }}>🔄 Daily Habits</div>
                  <div style={card}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr repeat(7,1fr)', gap: 4, marginBottom: 8 }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Habit</div>
                      {days.map(d => <div key={d} style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>{d}</div>)}
                    </div>
                    {habits.map(habit => (
                      <div key={habit.id} style={{ display: 'grid', gridTemplateColumns: '2fr repeat(7,1fr)', gap: 4, marginBottom: 10, alignItems: 'center' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dark)' }}>{habit.name}</div>
                        {habit.days.map((done, i) => (
                          <div key={i} onClick={() => toggleHabit(habit.id, i)} style={{ width: 24, height: 24, borderRadius: 6, background: done ? '#2563EB' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', margin: '0 auto' }}>
                            {done && <span style={{ color: '#fff', fontSize: 12 }}>✓</span>}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STREAK TRACKER */}
          {activeTab === 'streak' && (
            <div style={{ maxWidth: 680 }}>
              <SectionHeader icon="🔥" title="Streak Tracker" desc="Keep your study streak alive every day" />
              <div style={{ background: 'linear-gradient(135deg,#0F172A,#D97706)', borderRadius: 20, padding: 32, textAlign: 'center', marginBottom: 28, color: '#fff' }}>
                <div style={{ fontSize: 64 }}>🔥</div>
                <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 52, fontWeight: 800, color: '#fff', lineHeight: 1 }}>7</div>
                <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Day Streak</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>Best streak: 14 days 🏆</div>
              </div>

              <div style={{ ...card, marginBottom: 20 }}>
                <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>This Month</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6 }}>
                  {Array.from({ length: 31 }).map((_, i) => {
                    const studied = [1,2,3,5,6,7,8,10,11,12,13,14,15,17,18,19,20,21,22,24,25,26,27,28].includes(i + 1)
                    return (
                      <div key={i} style={{ aspectRatio: '1', borderRadius: 8, background: studied ? 'linear-gradient(135deg,#2563EB,#7C3AED)' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: studied ? '#fff' : 'var(--text-muted)' }}>
                        {i + 1}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                {[['🔥', '7', 'Current Streak', '#FFF7ED', '#D97706'], ['🏆', '14', 'Best Streak', '#FDF4FF', '#7C3AED'], ['📅', '24', 'Days Studied', '#F0FDF4', '#059669']].map(([icon, val, label, bg, color]) => (
                  <div key={label} style={{ ...card, textAlign: 'center' }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{icon}</div>
                    <div style={{ fontFamily: 'Sora,sans-serif', fontSize: 28, fontWeight: 800, color }}>{val}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI SUGGESTIONS */}
          {activeTab === 'ai' && (
            <div>
              <SectionHeader icon="🤖" title="AI Study Suggestions" desc="Personalized insights based on your study patterns" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
                {aiSuggestions.map((s, i) => (
                  <div key={i} style={{ ...card }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 14 }}>{s.icon}</div>
                    <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 14, marginBottom: 8, color: 'var(--text-dark)' }}>{s.title}</div>
                    <div style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DISTRACTION TRACKER */}
          {activeTab === 'distraction' && (
            <div style={{ maxWidth: 620 }}>
              <SectionHeader icon="🚫" title="Distraction Tracker" desc="Track and reduce your daily distractions" />
              <div style={{ ...card, marginBottom: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 12 }}>
                  <input placeholder="Distraction (e.g. Instagram)" value={newDistraction.name} onChange={e => setNewDistraction(p => ({ ...p, name: e.target.value }))} style={inp} />
                  <input type="number" placeholder="Minutes" value={newDistraction.minutes} onChange={e => setNewDistraction(p => ({ ...p, minutes: e.target.value }))} style={inp} />
                </div>
                <button onClick={() => { if (!newDistraction.name || !newDistraction.minutes) return; setDistractions(p => [...p, { ...newDistraction, date: new Date().toISOString().split('T')[0], id: Date.now() }]); setNewDistraction({ name: '', minutes: '' }) }} style={{ ...btn, height: 40 }}>Log Distraction</button>
              </div>

              <div style={{ ...card, marginBottom: 20 }}>
                <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 14, marginBottom: 14 }}>📊 Total Distraction Time</div>
                {Object.entries(distractions.reduce((acc, d) => { acc[d.name] = (acc[d.name] || 0) + parseInt(d.minutes); return acc }, {})).map(([name, mins]) => (
                  <div key={name} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600 }}>{name}</span>
                      <span style={{ color: '#DC2626', fontWeight: 700 }}>{mins} mins</span>
                    </div>
                    <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min(mins / 60 * 100, 100)}%`, background: '#DC2626', borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: 'linear-gradient(135deg,#0F172A,#DC2626)', borderRadius: 16, padding: 20, color: '#fff' }}>
                <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 14, marginBottom: 8 }}>💡 Reduce Distractions</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.8 }}>
                  • Use app blockers during study sessions<br/>
                  • Put phone in another room while studying<br/>
                  • Use website blockers like Cold Turkey<br/>
                  • Schedule social media time (30 min/day)
                </div>
              </div>
            </div>
          )}

          {/* LEADERBOARD */}
          {activeTab === 'leaderboard' && (
            <div style={{ maxWidth: 680 }}>
              <SectionHeader icon="🏆" title="Study Leaderboard" desc="See how you rank among your peers this week" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {leaderboard.map((entry, i) => (
                  <div key={i} style={{ ...card, padding: '16px 20px', border: entry.isUser ? '2px solid #2563EB' : '1px solid var(--border)', background: entry.isUser ? '#EFF6FF' : '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: entry.rank <= 3 ? 'linear-gradient(135deg,#D97706,#FCD34D)' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 14, color: entry.rank <= 3 ? '#fff' : 'var(--text-mid)', flexShrink: 0 }}>
                        {entry.rank <= 3 ? ['🥇','🥈','🥉'][entry.rank - 1] : entry.rank}
                      </div>
                      <div style={{ fontSize: 24 }}>{entry.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 14 }}>{entry.name} {entry.isUser && <span style={{ fontSize: 11, color: '#2563EB', fontWeight: 700 }}>(You)</span>}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{entry.college}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 16, color: 'var(--primary)' }}>{entry.hours}h</div>
                        <div style={{ fontSize: 11, color: '#D97706', fontWeight: 600 }}>🔥 {entry.streak} day streak</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
    </AppLayout>
  )
}