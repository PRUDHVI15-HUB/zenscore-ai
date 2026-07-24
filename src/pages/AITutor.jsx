import { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getToken } from '../services/api'

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const suggestions = [
  { icon: '⚡', label: 'DSA', text: 'Explain Binary Search Tree with examples' },
  { icon: '📡', label: 'Networks', text: 'What is the difference between TCP and UDP?' },
  { icon: '💻', label: 'OS', text: 'How does CPU scheduling work in Operating Systems?' },
  { icon: '🗄️', label: 'DBMS', text: 'Explain DBMS normalization with examples' },
  { icon: '📊', label: 'Signals', text: 'What is Fourier Transform and its applications?' },
  { icon: '☁️', label: 'DevOps', text: 'Explain CI/CD pipeline in DevOps' },
]

const PROJECT_COLORS = ['#7C3AED', '#2563EB', '#059669', '#D97706', '#DC2626', '#0891B2', '#DB2777']

const getGreeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  if (h < 21) return 'Good evening'
  return 'Evening'
}

const getTimeGroup = (timestamp) => {
  const now = new Date()
  const date = new Date(timestamp)
  const diff = (now - date) / (1000 * 60 * 60 * 24)
  if (diff < 1 && now.getDate() === date.getDate()) return 'Today'
  if (diff < 2) return 'Yesterday'
  if (diff < 7) return 'Previous 7 Days'
  if (diff < 30) return 'Previous 30 Days'
  return 'Older'
}

const defaultSettings = {
  aiName: 'ZenScore Tutor',
  responseStyle: 'balanced',
  subjectFocus: 'all',
  showYouTube: true,
}

// ─── localStorage helpers ────────────────────────────────────
function loadChats() {
  try { return JSON.parse(localStorage.getItem('zt_chats') || '[]') } catch { return [] }
}
function saveChats(chats) { localStorage.setItem('zt_chats', JSON.stringify(chats)) }
function loadProjects() {
  try { return JSON.parse(localStorage.getItem('zt_projects') || '[]') } catch { return [] }
}
function saveProjects(projects) { localStorage.setItem('zt_projects', JSON.stringify(projects)) }
function loadSettings() {
  try { return { ...defaultSettings, ...JSON.parse(localStorage.getItem('zt_settings') || '{}') } } catch { return { ...defaultSettings } }
}
function saveSettings(s) { localStorage.setItem('zt_settings', JSON.stringify(s)) }

export default function AITutor() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Chat state
  const [chats, setChats] = useState(loadChats)
  const [activeChatId, setActiveChatId] = useState(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [videos, setVideos] = useState([])
  const [showVideos, setShowVideos] = useState(false)

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [projectsExpanded, setProjectsExpanded] = useState(false)

  // Projects
  const [projects, setProjects] = useState(loadProjects)
  const [showNewProject, setShowNewProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')

  // Settings
  const [settings, setSettings] = useState(loadSettings)
  const [showSettings, setShowSettings] = useState(false)
  const [codeMode, setCodeMode] = useState(false)

  // Profile dropdown
  const [profileOpen, setProfileOpen] = useState(false)

  // Edit/delete chat
  const [editingChatId, setEditingChatId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [contextMenu, setContextMenu] = useState(null)

  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const profileRef = useRef(null)

  const activeChat = useMemo(() => chats.find(c => c.id === activeChatId), [chats, activeChatId])
  const messages = activeChat?.messages || []

  // Persist chats/projects/settings
  useEffect(() => { saveChats(chats) }, [chats])
  useEffect(() => { saveProjects(projects) }, [projects])
  useEffect(() => { saveSettings(settings) }, [settings])

  useEffect(() => { if (!user) navigate('/') }, [user])
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  // Close context menu / profile on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
      setContextMenu(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ─── Chat actions ────────────────────────────────
  const createNewChat = () => {
    const id = Date.now().toString()
    const chat = { id, title: 'New Chat', messages: [], createdAt: Date.now(), projectId: null }
    setChats(prev => [chat, ...prev])
    setActiveChatId(id)
    setInput('')
    setVideos([])
    setShowVideos(false)
  }

  const deleteChat = (id) => {
    setChats(prev => prev.filter(c => c.id !== id))
    if (activeChatId === id) setActiveChatId(null)
    setContextMenu(null)
  }

  const renameChat = (id) => {
    if (!editTitle.trim()) return
    setChats(prev => prev.map(c => c.id === id ? { ...c, title: editTitle.trim() } : c))
    setEditingChatId(null)
    setEditTitle('')
  }

  const moveToProject = (chatId, projectId) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, projectId } : c))
    setContextMenu(null)
  }

  // ─── Projects ────────────────────────────────────
  const addProject = () => {
    if (!newProjectName.trim()) return
    const project = { id: Date.now().toString(), name: newProjectName.trim(), color: PROJECT_COLORS[projects.length % PROJECT_COLORS.length] }
    setProjects(prev => [...prev, project])
    setNewProjectName('')
    setShowNewProject(false)
  }

  const deleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id))
    setChats(prev => prev.map(c => c.projectId === id ? { ...c, projectId: null } : c))
  }

  // ─── YouTube ─────────────────────────────────────
  const fetchYouTube = async (query) => {
    if (!settings.showYouTube) return
    try {
      const r = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query + ' engineering tutorial')}&type=video&maxResults=3&key=${YOUTUBE_API_KEY}`)
      const data = await r.json()
      if (!data.error && data.items?.length) { setVideos(data.items); setShowVideos(true) }
    } catch (e) {}
  }

  // ─── Send message ────────────────────────────────
  const sendMessage = async (text) => {
    const userMsg = (text || input).trim()
    if (!userMsg || loading) return
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = '24px'

    let chatId = activeChatId
    let currentChats = chats

    // Create new chat if none active
    if (!chatId) {
      chatId = Date.now().toString()
      const newChat = { id: chatId, title: userMsg.slice(0, 50), messages: [], createdAt: Date.now(), projectId: null }
      currentChats = [newChat, ...chats]
      setChats(currentChats)
      setActiveChatId(chatId)
    }

    // Add user message
    const updatedMessages = [...(currentChats.find(c => c.id === chatId)?.messages || []), { role: 'user', content: userMsg }]

    // Auto-title from first message
    setChats(prev => prev.map(c => c.id === chatId ? {
      ...c,
      messages: updatedMessages,
      title: c.messages.length === 0 ? userMsg.slice(0, 50) : c.title
    } : c))

    setLoading(true)
    setShowVideos(false)

    try {
      const token = getToken()

      // Build system prompt based on settings
      let systemNote = ''
      if (codeMode) systemNote += 'Focus on providing code examples, code snippets, and technical implementations. Use code blocks with language tags. '
      if (settings.responseStyle === 'concise') systemNote += 'Be concise and brief. '
      else if (settings.responseStyle === 'detailed') systemNote += 'Be very detailed and thorough in your explanations. '
      if (settings.subjectFocus !== 'all') systemNote += `Focus on ${settings.subjectFocus} related topics. `

      const messagesToSend = updatedMessages.map(m => ({ role: m.role, content: m.content }))
      if (systemNote) messagesToSend.unshift({ role: 'user', content: `[System: ${systemNote}]` })

      const response = await fetch(`${API_URL}/ai-tutor/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ messages: messagesToSend })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed')

      const reply = data.reply
      const ytMatch = reply.match(/\[YT:(.+?)\]/)
      const cleanReply = reply.replace(/\[YT:.+?\]/g, '').trim()

      setChats(prev => prev.map(c => c.id === chatId ? {
        ...c,
        messages: [...updatedMessages, { role: 'assistant', content: cleanReply }]
      } : c))

      if (ytMatch) fetchYouTube(ytMatch[1])
      else fetchYouTube(userMsg)

    } catch (err) {
      console.error(err)
      setChats(prev => prev.map(c => c.id === chatId ? {
        ...c,
        messages: [...updatedMessages, { role: 'assistant', content: `❌ Error: ${err.message}. Make sure your backend is running and ANTHROPIC_API_KEY is set in .env` }]
      } : c))
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const handleInput = (e) => {
    setInput(e.target.value)
    e.target.style.height = '24px'
    e.target.style.height = Math.min(e.target.scrollHeight, 180) + 'px'
  }

  // ─── Format message text ────────────────────────
  const formatText = (text) => {
    const blocks = text.split(/(```[\s\S]*?```)/g)
    return blocks.map((block, bi) => {
      if (block.startsWith('```') && block.endsWith('```')) {
        const firstLine = block.slice(3).split('\n')[0].trim()
        const lang = firstLine || 'code'
        const code = block.slice(3 + firstLine.length).replace(/\n$/, '').replace(/```$/, '').trim()
        return (
          <div key={bi} style={{ margin: '12px 0', borderRadius: 10, overflow: 'hidden', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 14px', background: '#2a2a2a', borderBottom: '1px solid #333' }}>
              <span style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'monospace', fontWeight: 600 }}>{lang}</span>
              <button
                onClick={() => navigator.clipboard.writeText(code)}
                style={{ background: 'none', border: '1px solid #444', borderRadius: 6, padding: '3px 10px', color: '#94A3B8', fontSize: 11, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', fontWeight: 600, transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#7C3AED'; e.currentTarget.style.color = '#E2E8F0' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#94A3B8' }}
              >Copy</button>
            </div>
            <pre style={{ padding: '14px 16px', margin: 0, background: '#1e1e1e', overflowX: 'auto', fontSize: 13.5, lineHeight: 1.65, color: '#E2E8F0', fontFamily: "'Fira Code', 'Cascadia Code', monospace" }}>
              <code>{code}</code>
            </pre>
          </div>
        )
      }
      // Regular text
      return block.split('\n').map((line, i) => {
        // Inline code
        const parts = line.split(/(`[^`]+`)/g).map((p, j) =>
          p.startsWith('`') && p.endsWith('`')
            ? <code key={j} style={{ background: '#2D2D2D', borderRadius: 4, padding: '1px 5px', fontSize: 13, fontFamily: "'Fira Code', monospace", color: '#A78BFA' }}>{p.slice(1, -1)}</code>
            : formatInline(p, j)
        )
        if (line.startsWith('### '))
          return <div key={`${bi}-${i}`} style={{ fontSize: 16, fontWeight: 700, color: '#E2E8F0', marginTop: 16, marginBottom: 6, fontFamily: 'Sora,sans-serif' }}>{line.slice(4)}</div>
        if (line.startsWith('## '))
          return <div key={`${bi}-${i}`} style={{ fontSize: 18, fontWeight: 700, color: '#E2E8F0', marginTop: 20, marginBottom: 8, fontFamily: 'Sora,sans-serif' }}>{line.slice(3)}</div>
        if (line.startsWith('# '))
          return <div key={`${bi}-${i}`} style={{ fontSize: 20, fontWeight: 800, color: '#E2E8F0', marginTop: 20, marginBottom: 8, fontFamily: 'Sora,sans-serif' }}>{line.slice(2)}</div>
        if (line.startsWith('- ') || line.startsWith('• '))
          return <div key={`${bi}-${i}`} style={{ display: 'flex', gap: 10, marginBottom: 4 }}><span style={{ color: '#94A3B8', flexShrink: 0 }}>•</span><span>{parts}</span></div>
        if (/^\d+\./.test(line))
          return <div key={`${bi}-${i}`} style={{ display: 'flex', gap: 10, marginBottom: 4 }}><span style={{ color: '#7C3AED', fontWeight: 700, flexShrink: 0 }}>{line.match(/^\d+\./)[0]}</span><span>{parts}</span></div>
        if (line.trim() === '') return <div key={`${bi}-${i}`} style={{ height: 10 }} />
        return <div key={`${bi}-${i}`} style={{ marginBottom: 2, lineHeight: 1.75 }}>{parts}</div>
      })
    })
  }

  const formatInline = (text, key) => {
    return text.split(/(\*\*.*?\*\*)/g).map((p, j) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={`${key}-${j}`} style={{ color: '#E2E8F0' }}>{p.slice(2, -2)}</strong>
        : p
    )
  }

  // ─── Filtered + grouped chats ────────────────────
  const filteredChats = useMemo(() => {
    let filtered = chats.filter(c => !c.projectId)
    if (searchQuery) filtered = chats.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    const groups = {}
    filtered.forEach(c => {
      const group = getTimeGroup(c.createdAt)
      if (!groups[group]) groups[group] = []
      groups[group].push(c)
    })
    return groups
  }, [chats, searchQuery])

  const projectChats = useMemo(() => {
    const map = {}
    projects.forEach(p => { map[p.id] = chats.filter(c => c.projectId === p.id) })
    return map
  }, [chats, projects])

  const isEmptyChat = messages.length === 0

  // ─── RENDER ──────────────────────────────────────
  return (
    <div style={{ height: '100vh', display: 'flex', background: '#1a1a1a', color: '#E2E8F0', fontFamily: 'DM Sans, sans-serif' }}>

      {/* ═══ SIDEBAR ═══ */}
      <div style={{
        width: sidebarOpen ? 280 : 0, minWidth: sidebarOpen ? 280 : 0,
        background: '#141414', borderRight: '1px solid #2D2D2D',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)'
      }}>

        {/* Sidebar top */}
        <div style={{ padding: '14px 14px 10px', flexShrink: 0 }}>
          {/* New Chat */}
          <button onClick={createNewChat} style={{
            width: '100%', height: 40, borderRadius: 10,
            border: '1px solid #333', background: 'transparent',
            color: '#E2E8F0', fontFamily: 'DM Sans,sans-serif', fontSize: 13.5, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.15s'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#222' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            <span style={{ fontSize: 16 }}>+</span> New Chat
          </button>

          {/* Search */}
          <div style={{ position: 'relative', marginTop: 10 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#555' }}>🔍</span>
            <input
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
              style={{
                width: '100%', height: 34, padding: '0 12px 0 32px', borderRadius: 8,
                border: '1px solid #2D2D2D', background: '#1a1a1a', color: '#CBD5E1',
                fontSize: 12.5, fontFamily: 'DM Sans,sans-serif', outline: 'none',
                transition: 'border-color 0.15s', boxSizing: 'border-box'
              }}
              onFocus={e => e.target.style.borderColor = '#7C3AED'}
              onBlur={e => e.target.style.borderColor = '#2D2D2D'}
            />
          </div>
        </div>

        {/* Sidebar scroll area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px', overflowX: 'hidden' }}>

          {/* Projects section */}
          <div style={{ marginBottom: 8 }}>
            <div
              onClick={() => setProjectsExpanded(p => !p)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 8px', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1.2, userSelect: 'none' }}
            >
              <span style={{ transform: projectsExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s', fontSize: 9 }}>▶</span>
              Projects
              <button onClick={e => { e.stopPropagation(); setShowNewProject(p => !p) }}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#64748B', fontSize: 14, cursor: 'pointer', lineHeight: 1, padding: '0 2px' }}
              >+</button>
            </div>

            {showNewProject && (
              <div style={{ padding: '0 8px 8px', display: 'flex', gap: 6 }}>
                <input value={newProjectName} onChange={e => setNewProjectName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addProject()}
                  placeholder="Project name"
                  autoFocus
                  style={{ flex: 1, height: 28, padding: '0 8px', borderRadius: 6, border: '1px solid #333', background: '#1a1a1a', color: '#E2E8F0', fontSize: 12, fontFamily: 'DM Sans,sans-serif', outline: 'none', boxSizing: 'border-box' }}
                />
                <button onClick={addProject} style={{ height: 28, padding: '0 10px', borderRadius: 6, border: 'none', background: '#7C3AED', color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Add</button>
              </div>
            )}

            {projectsExpanded && projects.map(p => (
              <div key={p.id} style={{ marginBottom: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 8, cursor: 'default' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#CBD5E1', fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                  <button onClick={() => deleteProject(p.id)}
                    style={{ background: 'none', border: 'none', color: '#475569', fontSize: 12, cursor: 'pointer', padding: '0 2px', opacity: 0.6 }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
                  >✕</button>
                </div>
                {(projectChats[p.id] || []).map(c => (
                  <div key={c.id}
                    onClick={() => setActiveChatId(c.id)}
                    onContextMenu={e => { e.preventDefault(); setContextMenu({ id: c.id, x: e.clientX, y: e.clientY }) }}
                    style={{
                      padding: '7px 8px 7px 24px', borderRadius: 8, cursor: 'pointer', fontSize: 13,
                      color: activeChatId === c.id ? '#E2E8F0' : '#94A3B8',
                      background: activeChatId === c.id ? '#2D2D2D' : 'transparent',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      transition: 'background 0.1s'
                    }}
                    onMouseEnter={e => { if (activeChatId !== c.id) e.currentTarget.style.background = '#222' }}
                    onMouseLeave={e => { if (activeChatId !== c.id) e.currentTarget.style.background = 'transparent' }}
                  >{c.title}</div>
                ))}
              </div>
            ))}
          </div>

          {/* Chat history grouped */}
          {Object.entries(filteredChats).map(([group, groupChats]) => (
            <div key={group} style={{ marginBottom: 8 }}>
              <div style={{ padding: '8px 8px 4px', fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 1 }}>{group}</div>
              {groupChats.map(c => (
                <div key={c.id} style={{ position: 'relative' }}>
                  {editingChatId === c.id ? (
                    <div style={{ padding: '4px 6px' }}>
                      <input value={editTitle} onChange={e => setEditTitle(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') renameChat(c.id); if (e.key === 'Escape') setEditingChatId(null) }}
                        onBlur={() => renameChat(c.id)}
                        autoFocus
                        style={{ width: '100%', height: 28, padding: '0 8px', borderRadius: 6, border: '1px solid #7C3AED', background: '#1a1a1a', color: '#E2E8F0', fontSize: 12.5, fontFamily: 'DM Sans,sans-serif', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => setActiveChatId(c.id)}
                      onContextMenu={e => { e.preventDefault(); setContextMenu({ id: c.id, x: e.clientX, y: e.clientY }) }}
                      style={{
                        padding: '8px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 13,
                        color: activeChatId === c.id ? '#E2E8F0' : '#94A3B8',
                        background: activeChatId === c.id ? '#2D2D2D' : 'transparent',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        transition: 'background 0.1s', display: 'flex', alignItems: 'center', gap: 6
                      }}
                      onMouseEnter={e => { if (activeChatId !== c.id) e.currentTarget.style.background = '#222' }}
                      onMouseLeave={e => { if (activeChatId !== c.id) e.currentTarget.style.background = 'transparent' }}
                    >
                      <span style={{ fontSize: 12, opacity: 0.5 }}>💬</span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}

          {chats.length === 0 && (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: '#475569', fontSize: 13 }}>
              No chats yet. Start a new conversation!
            </div>
          )}
        </div>

        {/* Sidebar bottom — Customize + Profile */}
        <div style={{ borderTop: '1px solid #2D2D2D', padding: '8px', flexShrink: 0 }}>
          {/* Customize */}
          <div
            onClick={() => setShowSettings(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: '#94A3B8', transition: 'background 0.1s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#222'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ fontSize: 15 }}>⚙️</span> Customize
          </div>

          {/* Profile */}
          <div ref={profileRef} style={{ position: 'relative' }}>
            <div
              onClick={() => setProfileOpen(p => !p)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, cursor: 'pointer', transition: 'background 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#222'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {user?.photoURL
                ? <img src={user.photoURL} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                : <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 12, color: '#fff' }}>{user?.displayName?.[0]}</div>
              }
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.displayName || 'User'}</div>
                <div style={{ fontSize: 11, color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
              </div>
              <span style={{ fontSize: 10, color: '#475569' }}>⋮</span>
            </div>

            {/* Profile dropdown */}
            {profileOpen && (
              <div style={{
                position: 'absolute', bottom: '100%', left: 0, right: 0, marginBottom: 4,
                background: '#222', border: '1px solid #333', borderRadius: 12, overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 500
              }}>
                <div onClick={() => { navigate('/profile'); }} style={{ padding: '10px 14px', cursor: 'pointer', fontSize: 13, color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#2D2D2D'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >👤 Profile</div>
                <div onClick={() => { navigate('/dashboard'); }} style={{ padding: '10px 14px', cursor: 'pointer', fontSize: 13, color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#2D2D2D'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >📊 Dashboard</div>
                <div style={{ borderTop: '1px solid #333' }}>
                  <div onClick={() => { logout(); navigate('/') }} style={{ padding: '10px 14px', cursor: 'pointer', fontSize: 13, color: '#EF4444', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#2D1515'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >🚪 Log out</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ MAIN AREA ═══ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar */}
        <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: '1px solid #2D2D2D', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Sidebar toggle */}
            <button onClick={() => setSidebarOpen(p => !p)}
              style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #333', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: 16, transition: 'all 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#222'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >☰</button>

            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#7C3AED', display: 'inline-block' }} />
              <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 15, color: '#E2E8F0' }}>ZenScore <span style={{ color: '#7C3AED' }}>AI</span></span>
            </Link>

            <span style={{ fontSize: 13, color: '#475569', marginLeft: 4 }}>{settings.aiName}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Code mode toggle */}
            <button onClick={() => setCodeMode(p => !p)}
              style={{
                height: 32, padding: '0 12px', borderRadius: 8,
                border: codeMode ? '1px solid #7C3AED' : '1px solid #333',
                background: codeMode ? 'rgba(124,58,237,0.15)' : 'transparent',
                color: codeMode ? '#A78BFA' : '#94A3B8', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 6,
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => { if (!codeMode) { e.currentTarget.style.background = '#222'; e.currentTarget.style.borderColor = '#444' } }}
              onMouseLeave={e => { if (!codeMode) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#333' } }}
            >&lt;/&gt; Code</button>

            {/* New chat button */}
            <button onClick={createNewChat}
              style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #333', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: 16, transition: 'all 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#222'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              title="New Chat"
            >+</button>
          </div>
        </div>

        {/* Chat area */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

          {/* Empty state */}
          {isEmptyChat && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px 120px' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #7C3AED, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 24, boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }}>✳️</div>
              <h1 style={{ fontFamily: 'Sora,sans-serif', fontSize: 30, fontWeight: 700, color: '#E2E8F0', marginBottom: 8, textAlign: 'center', letterSpacing: '-0.5px' }}>
                {getGreeting()}, {user?.displayName?.split(' ')[0] || 'there'}
              </h1>
              <p style={{ fontSize: 15, color: '#64748B', marginBottom: 36 }}>How can I help you today?</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, maxWidth: 580 }}>
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s.text)}
                    style={{
                      padding: '14px 16px', borderRadius: 12, border: '1px solid #2D2D2D',
                      background: '#1e1e1e', cursor: 'pointer', color: '#CBD5E1',
                      fontFamily: 'DM Sans,sans-serif', fontSize: 13, textAlign: 'left',
                      display: 'flex', flexDirection: 'column', gap: 6, transition: 'all 0.15s',
                      minHeight: 72
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#252525'; e.currentTarget.style.borderColor = '#444' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#1e1e1e'; e.currentTarget.style.borderColor = '#2D2D2D' }}
                  >
                    <span style={{ fontSize: 18 }}>{s.icon}</span>
                    <span style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.4 }}>{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {!isEmptyChat && (
            <div style={{ padding: '32px 0 20px' }}>
              <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{ marginBottom: 32 }}>
                    {msg.role === 'user' ? (
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ maxWidth: '78%', background: '#2D2D2D', color: '#E2E8F0', padding: '12px 18px', borderRadius: '20px 20px 4px 20px', fontSize: 15, lineHeight: 1.6 }}>
                          {msg.content}
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #7C3AED, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0, marginTop: 3 }}>✳️</div>
                        <div style={{ flex: 1, fontSize: 15, lineHeight: 1.75, color: '#CBD5E1', minWidth: 0, overflow: 'hidden' }}>
                          {formatText(msg.content)}
                          {i === messages.length - 1 && showVideos && videos.length > 0 && (
                            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #2D2D2D' }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>Related Videos</div>
                              <div style={{ display: 'flex', gap: 12 }}>
                                {videos.map(video => {
                                  const vid = video.id?.videoId
                                  if (!vid) return null
                                  return (
                                    <a key={vid} href={`https://youtube.com/watch?v=${vid}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', flex: 1 }}>
                                      <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #2D2D2D', transition: 'border-color 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = '#7C3AED'}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = '#2D2D2D'}>
                                        <img src={video.snippet?.thumbnails?.medium?.url} alt="" style={{ width: '100%', height: 100, objectFit: 'cover' }} />
                                        <div style={{ padding: '8px 10px', background: '#242424' }}>
                                          <div style={{ fontSize: 11.5, fontWeight: 600, color: '#CBD5E1', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4, marginBottom: 4 }}>{video.snippet?.title}</div>
                                          <div style={{ fontSize: 10, color: '#EF4444', fontWeight: 600 }}>▶ {video.snippet?.channelTitle}</div>
                                        </div>
                                      </div>
                                    </a>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 32 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #7C3AED, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>✳️</div>
                    <div style={{ paddingTop: 10, display: 'flex', gap: 5 }}>
                      {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#475569', animation: `blink 1.2s ${i*0.2}s ease-in-out infinite` }} />)}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ padding: '12px 24px 24px', background: '#1a1a1a', flexShrink: 0 }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ background: '#242424', border: '1px solid #2D2D2D', borderRadius: 16, padding: '12px 14px', display: 'flex', alignItems: 'flex-end', gap: 10, transition: 'border-color 0.15s' }}
              onFocus={() => {}}
            >
              <textarea ref={textareaRef} value={input} onChange={handleInput} onKeyDown={handleKeyDown}
                placeholder="How can I help you today?"
                rows={1}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', resize: 'none', fontSize: 15, color: '#E2E8F0', fontFamily: 'DM Sans,sans-serif', lineHeight: 1.6, minHeight: 24, maxHeight: 180, paddingTop: 2 }} />
              <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
                style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: input.trim() && !loading ? '#fff' : '#2D2D2D',
                  border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  transition: 'all 0.2s'
                }}>
                <span style={{ color: input.trim() && !loading ? '#000' : '#475569', fontSize: 14, fontWeight: 700 }}>↑</span>
              </button>
            </div>
            <div style={{ textAlign: 'center', fontSize: 11, color: '#334155', marginTop: 8 }}>{settings.aiName} can make mistakes. Verify important information.</div>
          </div>
        </div>
      </div>

      {/* ═══ CONTEXT MENU ═══ */}
      {contextMenu && (
        <div style={{
          position: 'fixed', left: contextMenu.x, top: contextMenu.y, zIndex: 1000,
          background: '#222', border: '1px solid #333', borderRadius: 10,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)', overflow: 'hidden', minWidth: 160
        }}>
          <div onClick={() => { setEditingChatId(contextMenu.id); setEditTitle(chats.find(c => c.id === contextMenu.id)?.title || ''); setContextMenu(null) }}
            style={{ padding: '8px 14px', fontSize: 13, color: '#CBD5E1', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = '#2D2D2D'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >✏️ Rename</div>
          {projects.length > 0 && (
            <>
              <div style={{ borderTop: '1px solid #333', padding: '4px 14px 2px', fontSize: 10, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Move to</div>
              {projects.map(p => (
                <div key={p.id} onClick={() => moveToProject(contextMenu.id, p.id)}
                  style={{ padding: '6px 14px', fontSize: 13, color: '#CBD5E1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                  onMouseEnter={e => e.currentTarget.style.background = '#2D2D2D'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                ><div style={{ width: 6, height: 6, borderRadius: '50%', background: p.color }} />{p.name}</div>
              ))}
              <div onClick={() => moveToProject(contextMenu.id, null)}
                style={{ padding: '6px 14px', fontSize: 13, color: '#94A3B8', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = '#2D2D2D'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >Remove from project</div>
            </>
          )}
          <div style={{ borderTop: '1px solid #333' }}>
            <div onClick={() => deleteChat(contextMenu.id)}
              style={{ padding: '8px 14px', fontSize: 13, color: '#EF4444', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = '#2D1515'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >🗑️ Delete</div>
          </div>
        </div>
      )}

      {/* ═══ SETTINGS MODAL ═══ */}
      {showSettings && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowSettings(false) }}
        >
          <div style={{ width: 460, background: '#1e1e1e', border: '1px solid #333', borderRadius: 20, padding: '28px 32px', boxShadow: '0 16px 64px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h2 style={{ fontFamily: 'Sora,sans-serif', fontSize: 20, fontWeight: 700, color: '#E2E8F0' }}>Customize AI Tutor</h2>
              <button onClick={() => setShowSettings(false)}
                style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #333', background: 'transparent', color: '#94A3B8', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              {/* AI Name */}
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#94A3B8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'DM Sans,sans-serif' }}>AI Name</label>
                <input value={settings.aiName} onChange={e => setSettings(p => ({ ...p, aiName: e.target.value }))}
                  style={{ width: '100%', height: 40, padding: '0 14px', borderRadius: 10, border: '1px solid #333', background: '#141414', color: '#E2E8F0', fontSize: 14, fontFamily: 'DM Sans,sans-serif', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#7C3AED'}
                  onBlur={e => e.target.style.borderColor = '#333'}
                />
              </div>

              {/* Response Style */}
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'DM Sans,sans-serif' }}>Response Style</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['concise', 'balanced', 'detailed'].map(style => (
                    <button key={style} onClick={() => setSettings(p => ({ ...p, responseStyle: style }))}
                      style={{
                        flex: 1, height: 38, borderRadius: 10, border: settings.responseStyle === style ? '1.5px solid #7C3AED' : '1px solid #333',
                        background: settings.responseStyle === style ? 'rgba(124,58,237,0.15)' : '#141414',
                        color: settings.responseStyle === style ? '#A78BFA' : '#94A3B8',
                        fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif',
                        textTransform: 'capitalize', transition: 'all 0.15s'
                      }}
                    >{style}</button>
                  ))}
                </div>
              </div>

              {/* Subject Focus */}
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'DM Sans,sans-serif' }}>Subject Focus</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['all', 'DSA', 'Networks', 'OS', 'DBMS', 'Web Dev', 'AI/ML'].map(subject => (
                    <button key={subject} onClick={() => setSettings(p => ({ ...p, subjectFocus: subject }))}
                      style={{
                        height: 34, padding: '0 14px', borderRadius: 8,
                        border: settings.subjectFocus === subject ? '1.5px solid #7C3AED' : '1px solid #333',
                        background: settings.subjectFocus === subject ? 'rgba(124,58,237,0.15)' : '#141414',
                        color: settings.subjectFocus === subject ? '#A78BFA' : '#94A3B8',
                        fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif',
                        transition: 'all 0.15s'
                      }}
                    >{subject === 'all' ? '🌐 All Subjects' : subject}</button>
                  ))}
                </div>
              </div>

              {/* YouTube toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#E2E8F0' }}>YouTube Suggestions</div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Show related videos after responses</div>
                </div>
                <div onClick={() => setSettings(p => ({ ...p, showYouTube: !p.showYouTube }))}
                  style={{
                    width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
                    background: settings.showYouTube ? '#7C3AED' : '#333',
                    display: 'flex', alignItems: 'center', padding: '0 3px',
                    transition: 'background 0.2s'
                  }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', background: '#fff',
                    transform: settings.showYouTube ? 'translateX(20px)' : 'translateX(0)',
                    transition: 'transform 0.2s'
                  }} />
                </div>
              </div>

              {/* Reset */}
              <button onClick={() => setSettings({ ...defaultSettings })}
                style={{
                  height: 38, borderRadius: 10, border: '1px solid #333',
                  background: 'transparent', color: '#94A3B8', fontSize: 13,
                  fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#222'; e.currentTarget.style.color = '#E2E8F0' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94A3B8' }}
              >Reset to Defaults</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes blink { 0%,100%{opacity:0.2;transform:scale(0.85)} 50%{opacity:1;transform:scale(1)} }
        ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:#141414} ::-webkit-scrollbar-thumb{background:#2D2D2D;border-radius:3px}
        ::-webkit-scrollbar-thumb:hover{background:#444}
      `}</style>
    </div>
  )
}