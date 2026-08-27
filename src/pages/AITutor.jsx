import { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ZenScoreIcon from '../components/common/ZenScoreIcon'
import ZenScoreLogo from '../components/common/ZenScoreLogo'
import AppLayout from '../components/AppLayout'
import { useTheme } from '../context/ThemeContext'
import {
  Sparkles,
  Plus,
  Search,
  MoreVertical,
  Settings as SettingsIcon,
  Sun,
  Moon,
  LogOut,
  LayoutDashboard,
  FileText,
  Paperclip,
  Mic,
  Send,
  Copy,
  RotateCcw,
  Volume2,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  PanelRightOpen,
  PanelRightClose,
  Trash2,
  Edit2,
  Pin,
  Check,
  X,
  MessageSquare,
  FileCode,
  Image as ImageIcon
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { parseAIActions } from '../services/aiTutorProfilePrompt'
import { dispatchAIAction } from '../services/aiActionRouter'
import { getToken } from '../services/api'

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const cleanBase = rawBase.replace(/\/+$/, '')
const API_URL = cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`

const PROJECT_COLORS = ['#7C3AED', '#2563EB', '#059669', '#D97706', '#DC2626', '#0891B2', '#DB2777']

const getGreeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  if (h < 21) return 'Good Evening'
  return 'Good Evening'
}

const getTimeGroup = (timestamp) => {
  const now = new Date()
  const date = new Date(timestamp)
  const diffDays = (now - date) / (1000 * 60 * 60 * 24)
  if (diffDays < 1 && now.getDate() === date.getDate()) return 'Today'
  if (diffDays < 2) return 'Yesterday'
  if (diffDays < 7) return 'Last 7 Days'
  if (diffDays < 30) return 'Last 30 Days'
  return 'Older'
}

const defaultSettings = {
  aiName: 'ZenScore Tutor',
  responseStyle: 'balanced',
  subjectFocus: 'all',
  showYouTube: true
}

// ─── localStorage helpers (User-Scoped with Safe Migration) ──
function getUserStorageKey(prefix, userId) {
  const safeId = userId || 'guest'
  return `${prefix}_${safeId}`
}

function loadUserScopedData(key, fallback = []) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback))
  } catch {
    return fallback
  }
}

function saveUserScopedData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (err) {
    console.warn('[AITutorStorage] Cache save notice:', err?.message)
  }
}

export default function AITutor() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  const userId = user?._id || user?.id || user?.uid || 'guest'
  const chatStorageKey = useMemo(() => getUserStorageKey('zt_chats', userId), [userId])
  const projectStorageKey = useMemo(() => getUserStorageKey('zt_projects', userId), [userId])
  const settingsStorageKey = useMemo(() => getUserStorageKey('zt_settings', userId), [userId])

  // One-time safe migration from legacy global keys to user-scoped keys
  useEffect(() => {
    if (userId && userId !== 'guest') {
      try {
        const legacyChats = localStorage.getItem('zt_chats')
        if (legacyChats && !localStorage.getItem(chatStorageKey)) {
          localStorage.setItem(chatStorageKey, legacyChats)
        }
        const legacyProjects = localStorage.getItem('zt_projects')
        if (legacyProjects && !localStorage.getItem(projectStorageKey)) {
          localStorage.setItem(projectStorageKey, legacyProjects)
        }
        const legacySettings = localStorage.getItem('zt_settings')
        if (legacySettings && !localStorage.getItem(settingsStorageKey)) {
          localStorage.setItem(settingsStorageKey, legacySettings)
        }
      } catch (e) {
        console.warn('[AITutorMigration] Legacy migration notice:', e?.message)
      }
    }
  }, [userId, chatStorageKey, projectStorageKey, settingsStorageKey])

  // Chat State initialized from user-scoped localStorage
  const [chats, setChats] = useState(() => loadUserScopedData(chatStorageKey, []))
  const [activeChatId, setActiveChatId] = useState(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [videos, setVideos] = useState([])
  const [showVideos, setShowVideos] = useState(false)

  // Attachments & Voice Input State
  const [attachedFiles, setAttachedFiles] = useState([])
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef(null)
  const fileInputRef = useRef(null)

  // UI Drawer / Sidebar State (collapsed by default on mobile)
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth > 768 : true)
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { isDark, toggleTheme } = useTheme()
  const isDarkMode = isDark
  const [copiedId, setCopiedId] = useState(null)

  const t = useMemo(() => ({
    bgMain: isDark ? '#0B0B0E' : '#F8FAFC',
    bgSidebar: isDark ? '#121216' : '#FFFFFF',
    bgHeader: isDark ? '#121216' : '#FFFFFF',
    bgCard: isDark ? '#18181D' : '#FFFFFF',
    bgInput: isDark ? '#222228' : '#F8FAFC',
    border: isDark ? '#2A2A32' : '#E2E8F0',
    textPrimary: isDark ? '#F4F4F6' : '#0F172A',
    textSecondary: isDark ? '#A1A1AA' : '#334155',
    textMuted: isDark ? '#71717A' : '#64748B',
    assistantCardBg: isDark ? '#18181D' : '#FFFFFF',
    assistantCardBorder: isDark ? '#2A2A32' : '#E2E8F0',
    userCardBg: isDark ? '#7C3AED' : '#6366F1',
    inputBorder: isDark ? '#2A2A32' : '#CBD5E1',
    hoverBg: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
    activeChatBg: isDark ? 'rgba(124, 58, 237, 0.22)' : 'rgba(99, 102, 241, 0.12)',
    activeChatBorder: isDark ? 'rgba(124, 58, 237, 0.35)' : 'rgba(99, 102, 241, 0.3)',
    codeBg: isDark ? '#121216' : '#1E293B',
    codeHeaderBg: isDark ? '#18181D' : '#0F172A',
    dropdownBg: isDark ? '#18181D' : '#FFFFFF',
    dropdownBorder: isDark ? '#2A2A32' : '#E2E8F0',
    shadow: isDark ? '0 8px 30px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.06)',
  }), [isDark])

  // Projects State
  const [projects, setProjects] = useState(() => loadUserScopedData(projectStorageKey, []))
  const [projectsExpanded, setProjectsExpanded] = useState(false)
  const [showNewProject, setShowNewProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')

  // Settings State
  const [settings, setSettings] = useState(() => ({
    ...defaultSettings,
    ...loadUserScopedData(settingsStorageKey, {})
  }))
  const [showSettings, setShowSettings] = useState(false)

  // Profile Dropdown
  const [profileOpen, setProfileOpen] = useState(false)

  // Edit / Delete / Pin Chat State & Context Menu
  const [editingChatId, setEditingChatId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [contextMenu, setContextMenu] = useState(null)

  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const profileRef = useRef(null)
  const contextMenuRef = useRef(null)

  const activeChat = useMemo(() => chats.find((c) => c.id === activeChatId), [chats, activeChatId])
  const messages = activeChat?.messages || []

  // Persist State to User-Scoped localStorage
  useEffect(() => {
    saveUserScopedData(chatStorageKey, chats)
  }, [chats, chatStorageKey])
  useEffect(() => {
    saveUserScopedData(projectStorageKey, projects)
  }, [projects, projectStorageKey])
  useEffect(() => {
    saveUserScopedData(settingsStorageKey, settings)
  }, [settings, settingsStorageKey])

  // Cloud Conversation Sync on mount / login
  useEffect(() => {
    if (!user) return
    const token = getToken()
    if (!token) return

    let isMounted = true

    const syncCloudConversations = async () => {
      try {
        const response = await fetch(`${API_URL}/ai-tutor/conversations`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!response.ok) return
        const resData = await response.json()
        if (isMounted && resData.success && Array.isArray(resData.data)) {
          const cloudList = resData.data
          setChats((prevLocal) => {
            const localMap = new Map(prevLocal.map((c) => [c.id, c]))
            // Merge cloud conversations
            cloudList.forEach((cloudItem) => {
              const existing = localMap.get(cloudItem.id)
              if (!existing) {
                localMap.set(cloudItem.id, cloudItem)
              } else {
                // If local has unsynced messages or newer timestamp, preserve local messages
                localMap.set(cloudItem.id, {
                  ...cloudItem,
                  title: existing.title || cloudItem.title,
                  pinned: existing.pinned !== undefined ? existing.pinned : cloudItem.pinned,
                  isPinned: existing.isPinned !== undefined ? existing.isPinned : cloudItem.isPinned,
                  projectId: existing.projectId || cloudItem.projectId,
                  messages: existing.messages?.length >= (cloudItem.messages?.length || 0)
                    ? existing.messages
                    : cloudItem.messages
                })
              }
            })
            return Array.from(localMap.values())
          })
        }
      } catch (syncErr) {
        console.warn('[AITutorSync] Background cloud sync notice (offline mode active):', syncErr?.message)
      }
    }

    syncCloudConversations()
    return () => { isMounted = false }
  }, [user, chatStorageKey])

  useEffect(() => {
    if (!user) navigate('/')
  }, [user, navigate])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Close context menu / profile on click outside
  useEffect(() => {
    const handler = (e) => {
      if (contextMenuRef.current && contextMenuRef.current.contains(e.target)) {
        return
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
      setContextMenu(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ─── Chat Actions with Cloud Sync ─────────────────
  const createNewChat = async () => {
    const localId = Date.now().toString()
    const chat = {
      id: localId,
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      projectId: null,
      pinned: false
    }
    setChats((prev) => [chat, ...prev])
    setActiveChatId(localId)
    setInput('')
    setAttachedFiles([])
    setVideos([])
    setShowVideos(false)

    // Asynchronously create on backend if authenticated
    try {
      const token = getToken()
      if (token) {
        const res = await fetch(`${API_URL}/ai-tutor/conversations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ title: 'New Chat', messages: [], isPinned: false })
        })
        const data = await res.json()
        if (data.success && data.data?.id) {
          const cloudId = data.data.id
          setChats((prev) => prev.map((c) => (c.id === localId ? { ...c, id: cloudId, _id: cloudId } : c)))
          setActiveChatId(cloudId)
        }
      }
    } catch (e) {
      console.warn('[AITutor] Cloud conversation create notice:', e?.message)
    }
  }

  const deleteChat = (id) => {
    setChats((prev) => prev.filter((c) => c.id !== id))
    if (activeChatId === id) setActiveChatId(null)
    setContextMenu(null)

    // Asynchronously delete on backend if 24-char ObjectId
    if (typeof id === 'string' && id.length === 24) {
      const token = getToken()
      if (token) {
        fetch(`${API_URL}/ai-tutor/conversations/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }).catch((err) => console.warn('[AITutor] Cloud delete notice:', err?.message))
      }
    }
  }

  const renameChat = (id) => {
    if (!editTitle.trim()) {
      setEditingChatId(null)
      return
    }
    const cleanTitle = editTitle.trim()
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, title: cleanTitle } : c)))
    setEditingChatId(null)
    setEditTitle('')

    // Asynchronously update on backend if 24-char ObjectId
    if (typeof id === 'string' && id.length === 24) {
      const token = getToken()
      if (token) {
        fetch(`${API_URL}/ai-tutor/conversations/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ title: cleanTitle })
        }).catch((err) => console.warn('[AITutor] Cloud rename notice:', err?.message))
      }
    }
  }

  const togglePinChat = (id) => {
    let nextPinned = false
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          nextPinned = !c.pinned
          return { ...c, pinned: nextPinned }
        }
        return c
      })
    )
    setContextMenu(null)

    // Asynchronously update on backend if 24-char ObjectId
    if (typeof id === 'string' && id.length === 24) {
      const token = getToken()
      if (token) {
        fetch(`${API_URL}/ai-tutor/conversations/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ isPinned: nextPinned })
        }).catch((err) => console.warn('[AITutor] Cloud pin notice:', err?.message))
      }
    }
  }

  const clearCurrentChat = () => {
    if (!activeChatId) return
    setChats((prev) => prev.map((c) => (c.id === activeChatId ? { ...c, messages: [] } : c)))
    if (typeof activeChatId === 'string' && activeChatId.length === 24) {
      const token = getToken()
      if (token) {
        fetch(`${API_URL}/ai-tutor/conversations/${activeChatId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ messages: [] })
        }).catch((err) => console.warn('[AITutor] Cloud clear notice:', err?.message))
      }
    }
  }

  // ─── Projects Handlers ───────────────────────────
  const addProject = () => {
    if (!newProjectName.trim()) return
    const project = {
      id: Date.now().toString(),
      name: newProjectName.trim(),
      color: PROJECT_COLORS[projects.length % PROJECT_COLORS.length]
    }
    setProjects((prev) => [...prev, project])
    setNewProjectName('')
    setShowNewProject(false)
  }

  const deleteProject = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
    setChats((prev) => prev.map((c) => (c.projectId === id ? { ...c, projectId: null } : c)))
  }

  // ─── Attachments Handlers ─────────────────────────
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    files.forEach((file) => {
      const reader = new FileReader()
      const isImage = file.type.startsWith('image/')

      if (isImage) {
        reader.onload = (evt) => {
          setAttachedFiles((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              name: file.name,
              size: (file.size / 1024).toFixed(1) + ' KB',
              type: file.type,
              isImage: true,
              dataUrl: evt.target.result
            }
          ])
        }
        reader.readAsDataURL(file)
      } else {
        reader.onload = (evt) => {
          let rawText = evt.target.result || ''
          // Clean binary noise from PDF or binary files so backend/Groq never crashes
          let cleanText = typeof rawText === 'string'
            ? rawText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').trim()
            : ''

          if (cleanText.length > 3500) {
            cleanText = cleanText.slice(0, 3500) + '\n...[Document excerpt truncated]'
          }

          setAttachedFiles((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              name: file.name,
              size: (file.size / 1024).toFixed(1) + ' KB',
              type: file.type || 'document',
              isImage: false,
              content: cleanText || `[Attached Document: ${file.name}]`
            }
          ])
        }
        reader.readAsText(file)
      }
    })
    e.target.value = ''
  }

  const removeAttachment = (id) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  // ─── Voice Input Handler (Speech-to-Text) ─────────
  const toggleVoiceInput = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRec) {
      alert('Speech Recognition is not supported in this browser. Please try Chrome, Edge, or Safari.')
      return
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop()
      setIsListening(false)
      return
    }

    try {
      const rec = new SpeechRec()
      rec.continuous = true
      rec.interimResults = true
      rec.lang = 'en-US'

      rec.onresult = (event) => {
        let transcript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript
        }
        setInput(transcript)
      }

      rec.onerror = (e) => {
        console.warn('Speech recognition error:', e)
        setIsListening(false)
      }

      rec.onend = () => {
        setIsListening(false)
      }

      rec.start()
      recognitionRef.current = rec
      setIsListening(true)
    } catch (err) {
      console.error('Failed to start speech recognition:', err)
      setIsListening(false)
    }
  }

  // ─── Text-to-Speech Handler ───────────────────────
  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const clean = text.replace(/[*#`[\]]/g, '')
      const utterance = new SpeechSynthesisUtterance(clean)
      utterance.rate = 1.0
      utterance.pitch = 1.0
      window.speechSynthesis.speak(utterance)
    } else {
      alert('Text-to-speech is not supported in this browser.')
    }
  }

  // ─── YouTube Fetch ────────────────────────────────
  const fetchYouTube = async (query) => {
    if (!settings.showYouTube || !YOUTUBE_API_KEY) return
    try {
      const r = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          query + ' engineering tutorial'
        )}&type=video&maxResults=3&key=${YOUTUBE_API_KEY}`
      )
      const data = await r.json()
      if (!data.error && data.items?.length) {
        setVideos(data.items)
        setShowVideos(true)
      }
    } catch (e) {
      console.warn('YouTube fetch error:', e)
    }
  }

  // ─── Smooth Streaming Engine ──────────────────────
  const triggerTypewriterStream = (chatId, cleanReply, updatedMessages) => {
    let currentLength = 0
    const totalLength = cleanReply.length
    const msgTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    // Add empty assistant message with isStreaming: true
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              messages: [
                ...updatedMessages,
                {
                  role: 'assistant',
                  content: '',
                  isStreaming: true,
                  timestamp: msgTimestamp
                }
              ]
            }
          : c
      )
    )

    const timer = setInterval(() => {
      currentLength += Math.floor(Math.random() * 4) + 2
      const chunk = cleanReply.slice(0, currentLength)
      const isDone = currentLength >= totalLength

      setChats((prev) =>
        prev.map((c) => {
          if (c.id !== chatId) return c
          const msgs = [...c.messages]
          if (msgs.length > 0) {
            msgs[msgs.length - 1] = {
              role: 'assistant',
              content: isDone ? cleanReply : chunk,
              isStreaming: !isDone,
              timestamp: msgTimestamp
            }
          }
          return { ...c, messages: msgs }
        })
      )

      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })

      if (isDone) {
        clearInterval(timer)
      }
    }, 18)
  }

  // ─── Send Message ─────────────────────────────────
  const sendMessage = async (text) => {
    const userMsgText = (text || input).trim()
    if ((!userMsgText && attachedFiles.length === 0) || loading) return

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }

    const currentFiles = [...attachedFiles]
    setInput('')
    setAttachedFiles([])
    if (textareaRef.current) textareaRef.current.style.height = '28px'

    let chatId = activeChatId
    let currentChats = chats

    // Clean title for new chat
    const autoTitle = userMsgText.length > 35 ? userMsgText.slice(0, 32) + '...' : userMsgText || 'Document Chat'
    const formattedTitle = autoTitle.charAt(0).toUpperCase() + autoTitle.slice(1)

    if (!chatId) {
      chatId = Date.now().toString()
      const newChat = {
        id: chatId,
        title: formattedTitle,
        messages: [],
        createdAt: Date.now(),
        projectId: null,
        pinned: false
      }
      currentChats = [newChat, ...chats]
      setChats(currentChats)
      setActiveChatId(chatId)
    }

    const userMessageObj = {
      role: 'user',
      content: userMsgText || '(Attached File)',
      attachments: currentFiles,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const updatedMessages = [
      ...(currentChats.find((c) => c.id === chatId)?.messages || []),
      userMessageObj
    ]

    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              messages: updatedMessages,
              title: c.title === 'New Chat' || c.messages.length === 0 ? formattedTitle : c.title
            }
          : c
      )
    )

    setLoading(true)
    setShowVideos(false)

    try {
      const token = getToken()

      const messagesToSend = updatedMessages.map((m) => {
        if (m.attachments && m.attachments.length > 0) {
          const fileCtx = m.attachments
            .map((f) => (f.isImage ? `[Attached Image: ${f.name}]` : `[Attached Document: ${f.name}]\n${f.content || ''}`))
            .join('\n\n')
          return { role: m.role, content: `${fileCtx}\n\nUser Question: ${m.content}`.trim() }
        }
        return { role: m.role, content: m.content }
      })

      // Send clean conversation messages with persistent conversationId (no redundant client system prompt)
      const response = await fetch(`${API_URL}/ai-tutor/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          messages: messagesToSend,
          conversationId: typeof chatId === 'string' && chatId.length === 24 ? chatId : null
        })
      })

      const data = await response.json()
      if (response.status === 429) {
        throw new Error(data.error || `Rate limit reached. Please wait ${data.retryAfter || 60}s before sending more messages.`)
      }
      if (!response.ok) throw new Error(data.error || 'Failed to generate response')

      const rawReply = data.reply || ''
      const ytMatch = rawReply.match(/\[YT:(.+?)\]/)
      let textWithoutYT = rawReply.replace(/\[YT:.+?\]/g, '').trim()

      // Parse AI Action Tags [ACTION: {...}]
      const { cleanReply, actions } = parseAIActions(textWithoutYT)

      triggerTypewriterStream(chatId, cleanReply, updatedMessages)

      // Asynchronously sync new message turn to MongoDB if valid 24-char ObjectId
      if (typeof chatId === 'string' && chatId.length === 24 && token) {
        const assistantMsgObj = {
          role: 'assistant',
          content: cleanReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        fetch(`${API_URL}/ai-tutor/conversations/${chatId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            title: updatedMessages.length === 1 ? formattedTitle : undefined,
            messages: [...updatedMessages, assistantMsgObj]
          })
        }).catch((err) => console.warn('[AITutor] Cloud message sync notice:', err?.message))
      }

      // Execute AI Actions asynchronously via central AIActionRouter
      if (Array.isArray(actions) && actions.length > 0) {
        actions.forEach((act) => {
          dispatchAIAction(act)
            .then((res) => {
              console.info(`[AIActionExecutor] Executed ${act.type}:`, res)
              if (act.type === 'NAVIGATE_PAGE' && act.payload?.path) {
                setTimeout(() => navigate(act.payload.path), 1200)
              }
            })
            .catch((err) => {
              console.info(`[AIActionExecutor] Action ${act.type} failed:`, err?.message || err)
            })
        })
      }

      if (ytMatch) {
        fetchYouTube(ytMatch[1])
      }
    } catch (err) {
      console.error(err)
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? {
                ...c,
                messages: [
                  ...updatedMessages,
                  {
                    role: 'assistant',
                    content: `⚠️ ${err.message}`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                ]
              }
            : c
        )
      )
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleInput = (e) => {
    setInput(e.target.value)
    e.target.style.height = '28px'
    e.target.style.height = Math.min(e.target.scrollHeight, 180) + 'px'
  }

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // ─── Format Inline Elements (Bold, Italic, Inline Code) ──
  const formatInline = (text, key) => {
    if (!text) return ''
    // Split on inline code first
    const codeParts = text.split(/(`[^`]+`)/g)
    return codeParts.map((cp, cIdx) => {
      if (cp.startsWith('`') && cp.endsWith('`')) {
        return (
          <code
            key={`${key}-c-${cIdx}`}
            style={{
              background: isDark ? 'rgba(124, 58, 237, 0.22)' : 'rgba(124, 58, 237, 0.1)',
              border: `1px solid ${isDark ? 'rgba(124, 58, 237, 0.35)' : 'rgba(124, 58, 237, 0.2)'}`,
              borderRadius: 5,
              padding: '2px 6px',
              fontSize: 13,
              fontFamily: "'Fira Code', monospace",
              color: isDark ? '#DDD6FE' : '#6D28D9',
              fontWeight: 600
            }}
          >
            {cp.slice(1, -1)}
          </code>
        )
      }

      // Split on bold (**text**)
      const boldParts = cp.split(/(\*\*.*?\*\*)/g)
      return boldParts.map((bp, bIdx) => {
        if (bp.startsWith('**') && bp.endsWith('**')) {
          return (
            <strong
              key={`${key}-b-${cIdx}-${bIdx}`}
              style={{
                color: t.textPrimary,
                fontWeight: 700
              }}
            >
              {bp.slice(2, -2)}
            </strong>
          )
        }
        return bp
      })
    })
  }

  // ─── Format Message Markdown (Headings, Tables, Lists, Code Blocks, Divider) ──
  const formatText = (text) => {
    if (!text) return ''
    const blocks = text.split(/(```[\s\S]*?```)/g)

    return blocks.map((block, bi) => {
      // 1. Fenced Code Block
      if (block.startsWith('```') && block.endsWith('```')) {
        const firstLine = block.slice(3).split('\n')[0].trim()
        const lang = firstLine || 'code'
        const code = block.slice(3 + firstLine.length).replace(/\n$/, '').replace(/```$/, '').trim()
        return (
          <div
            key={bi}
            style={{
              margin: '14px 0',
              borderRadius: 12,
              overflow: 'hidden',
              border: `1px solid ${isDark ? '#2A2A32' : '#E2E8F0'}`,
              background: '#0F172A',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 16px',
                background: '#1E293B',
                borderBottom: '1px solid #334155'
              }}
            >
              <span style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'monospace', fontWeight: 600 }}>{lang}</span>
              <button
                onClick={() => handleCopy(code, `code-${bi}`)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 6,
                  padding: '4px 10px',
                  color: '#D1D5DB',
                  fontSize: 11.5,
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  transition: 'all 0.15s'
                }}
              >
                {copiedId === `code-${bi}` ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
                <span>{copiedId === `code-${bi}` ? 'Copied!' : 'Copy code'}</span>
              </button>
            </div>
            <pre
              style={{
                padding: '16px',
                margin: 0,
                background: '#0F172A',
                overflowX: 'auto',
                fontSize: 13.5,
                lineHeight: 1.65,
                color: '#F8FAFC',
                fontFamily: "'Fira Code', 'Cascadia Code', monospace"
              }}
            >
              <code>{code}</code>
            </pre>
          </div>
        )
      }

      // 2. Process Lines (Group table rows together)
      const lines = block.split('\n')
      const renderedElements = []
      let tableRows = []

      const flushTable = (tblKey) => {
        if (tableRows.length === 0) return
        const headerRow = tableRows[0]
        const dataRows = tableRows.slice(1).filter(r => !r.every(cell => /^[-:\s]+$/.test(cell)))

        renderedElements.push(
          <div key={`table-${tblKey}`} style={{ margin: '14px 0', overflowX: 'auto', borderRadius: 12, border: `1px solid ${t.border}` }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5, textAlign: 'left', fontFamily: 'DM Sans, sans-serif' }}>
              <thead>
                <tr style={{ background: isDark ? '#1C1C22' : '#F1F5F9', borderBottom: `1px solid ${t.border}` }}>
                  {headerRow.map((cell, cIdx) => (
                    <th key={cIdx} style={{ padding: '10px 14px', fontWeight: 700, color: t.textPrimary, borderRight: cIdx < headerRow.length - 1 ? `1px solid ${t.border}` : 'none' }}>
                      {formatInline(cell.trim(), `th-${tblKey}-${cIdx}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataRows.map((row, rIdx) => (
                  <tr key={rIdx} style={{ borderBottom: rIdx < dataRows.length - 1 ? `1px solid ${t.border}` : 'none', background: rIdx % 2 === 1 ? (isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC') : 'transparent' }}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} style={{ padding: '10px 14px', color: t.textSecondary, lineHeight: 1.6, borderRight: cIdx < row.length - 1 ? `1px solid ${t.border}` : 'none' }}>
                        {formatInline(cell.trim(), `td-${tblKey}-${rIdx}-${cIdx}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        tableRows = []
      }

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const trimmed = line.trim()

        // Check for table row: e.g. | col1 | col2 |
        if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length > 2) {
          const cells = trimmed.slice(1, -1).split('|')
          tableRows.push(cells)
          continue
        } else if (tableRows.length > 0) {
          flushTable(`${bi}-${i}`)
        }

        // Horizontal Rule
        if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
          renderedElements.push(
            <hr key={`${bi}-${i}`} style={{ border: 'none', borderTop: `1px solid ${t.border}`, margin: '18px 0' }} />
          )
          continue
        }

        // Headings
        if (line.startsWith('### ')) {
          renderedElements.push(
            <div key={`${bi}-${i}`} style={{ fontSize: 16, fontWeight: 700, color: t.textPrimary, marginTop: 18, marginBottom: 8, fontFamily: 'Sora, sans-serif' }}>
              {formatInline(line.slice(4), `${bi}-${i}-h3`)}
            </div>
          )
          continue
        }
        if (line.startsWith('## ')) {
          renderedElements.push(
            <div key={`${bi}-${i}`} style={{ fontSize: 18, fontWeight: 800, color: t.textPrimary, marginTop: 22, marginBottom: 10, fontFamily: 'Sora, sans-serif' }}>
              {formatInline(line.slice(3), `${bi}-${i}-h2`)}
            </div>
          )
          continue
        }
        if (line.startsWith('# ')) {
          renderedElements.push(
            <div key={`${bi}-${i}`} style={{ fontSize: 20, fontWeight: 800, color: t.textPrimary, marginTop: 24, marginBottom: 12, fontFamily: 'Sora, sans-serif' }}>
              {formatInline(line.slice(2), `${bi}-${i}-h1`)}
            </div>
          )
          continue
        }

        // Bullet Lists
        if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')) {
          renderedElements.push(
            <div key={`${bi}-${i}`} style={{ display: 'flex', gap: 10, marginBottom: 6, lineHeight: 1.7, color: t.textSecondary }}>
              <span style={{ color: '#8B5CF6', flexShrink: 0, fontWeight: 700 }}>•</span>
              <span>{formatInline(line.replace(/^[-•*]\s+/, ''), `${bi}-${i}-li`)}</span>
            </div>
          )
          continue
        }

        // Numbered Lists
        if (/^\d+\./.test(line)) {
          const numMatch = line.match(/^(\d+\.)\s*(.*)$/)
          renderedElements.push(
            <div key={`${bi}-${i}`} style={{ display: 'flex', gap: 10, marginBottom: 6, lineHeight: 1.7, color: t.textSecondary }}>
              <span style={{ color: '#8B5CF6', fontWeight: 700, flexShrink: 0 }}>{numMatch ? numMatch[1] : ''}</span>
              <span>{formatInline(numMatch ? numMatch[2] : line, `${bi}-${i}-num`)}</span>
            </div>
          )
          continue
        }

        // Empty Line
        if (trimmed === '') {
          renderedElements.push(<div key={`${bi}-${i}`} style={{ height: 8 }} />)
          continue
        }

        // Regular Paragraph
        renderedElements.push(
          <div key={`${bi}-${i}`} style={{ marginBottom: 6, lineHeight: 1.75, color: t.textSecondary }}>
            {formatInline(line, `${bi}-${i}-p`)}
          </div>
        )
      }

      if (tableRows.length > 0) {
        flushTable(`${bi}-end`)
      }

      return renderedElements
    })
  }

  // Filtered chats based on search
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats
    return chats.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [chats, searchQuery])

  // Grouped chats
  const pinnedChats = useMemo(() => filteredChats.filter((c) => c.pinned || c.isPinned), [filteredChats])
  const projectChats = useMemo(() => {
    const map = {}
    filteredChats.forEach((c) => {
      if (c.projectId) {
        if (!map[c.projectId]) map[c.projectId] = []
        map[c.projectId].push(c)
      }
    })
    return map
  }, [filteredChats])

  const groupedChats = useMemo(() => {
    const unpinned = filteredChats.filter((c) => !c.pinned && !c.isPinned && !c.projectId)
    const groups = { Today: [], Yesterday: [], 'Last 7 Days': [], 'Last 30 Days': [], Older: [] }
    unpinned.forEach((c) => {
      const g = getTimeGroup(c.createdAt || Date.now())
      if (groups[g]) groups[g].push(c)
      else groups.Older.push(c)
    })
    return groups
  }, [filteredChats])

  // ─── Render Chat Item in Sidebar ─────────────────────
  const renderChatItem = (c) => {
    const isThisEditing = editingChatId === c.id || (c._id && editingChatId === c._id)
    const isActive = activeChatId === c.id || (c._id && activeChatId === c._id)
    return (
      <div key={c.id || c._id} style={{ position: 'relative', marginBottom: 2 }}>
        {isThisEditing ? (
          <div style={{ padding: '4px 6px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') renameChat(c.id || c._id)
                if (e.key === 'Escape') setEditingChatId(null)
              }}
              autoFocus
              style={{
                flex: 1,
                height: 30,
                padding: '0 8px',
                borderRadius: 6,
                border: '1.5px solid #8B5CF6',
                background: t.bgInput,
                color: t.textPrimary,
                fontSize: 12.5,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <button
              onClick={() => renameChat(c.id || c._id)}
              style={{ background: '#7C3AED', border: 'none', borderRadius: 6, width: 26, height: 26, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Check size={14} />
            </button>
            <button
              onClick={() => setEditingChatId(null)}
              style={{ background: t.border, border: 'none', borderRadius: 6, width: 26, height: 26, color: t.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div
            onClick={() => {
              setActiveChatId(c.id || c._id)
              if (window.innerWidth < 768) setSidebarOpen(false)
            }}
            onContextMenu={(e) => {
              e.preventDefault()
              setContextMenu({ id: c.id || c._id, x: e.clientX, y: e.clientY })
            }}
            style={{
              padding: '8px 10px',
              borderRadius: 10,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? t.textPrimary : t.textSecondary,
              background: isActive ? t.activeChatBg : 'transparent',
              border: isActive ? `1px solid ${t.activeChatBorder}` : '1px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.15s'
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.background = t.hoverBg
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.background = 'transparent'
            }}
          >
            <MessageSquare size={14} style={{ color: isActive ? '#A78BFA' : t.textMuted, flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{c.title}</span>

            {/* Clean Single Three-Dots Menu Button */}
            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation()
                const rect = e.currentTarget.getBoundingClientRect()
                setContextMenu({ id: c.id || c._id, x: rect.left, y: rect.bottom + 4 })
              }}
              title="Chat Options"
              style={{
                background: 'none',
                border: 'none',
                color: t.textMuted,
                cursor: 'pointer',
                padding: 4,
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = t.textPrimary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = t.textMuted)}
            >
              <MoreVertical size={14} />
            </button>
          </div>
        )}
      </div>
    )
  }

  // ─── Render Input Box Card ────────────────────────
  const renderInputCard = () => (
    <div
      style={{
        background: t.assistantCardBg,
        border: isListening ? '1.5px solid #8B5CF6' : `1.5px solid ${t.assistantCardBorder}`,
        borderRadius: 20,
        padding: '14px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        boxShadow: isListening ? '0 0 20px rgba(139, 92, 246, 0.35)' : t.shadow,
        transition: 'all 0.2s',
        width: '100%',
        maxWidth: 780,
        boxSizing: 'border-box'
      }}
    >
      {/* Attached Files Preview Chips */}
      {attachedFiles.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 6, borderBottom: `1px solid ${t.border}`, paddingBottom: 8 }}>
          {attachedFiles.map((file) => (
            <div
              key={file.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: t.bgMain,
                border: `1px solid ${t.border}`,
                borderRadius: 8,
                padding: '4px 8px',
                fontSize: 12,
                color: t.textSecondary
              }}
            >
              {file.isImage ? (
                <img src={file.dataUrl} alt="" style={{ width: 22, height: 22, borderRadius: 4, objectFit: 'cover' }} />
              ) : (
                <FileCode size={14} style={{ color: '#8B5CF6' }} />
              )}
              <span style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
              <span style={{ fontSize: 10, color: t.textMuted }}>({file.size})</span>
              <button
                onClick={() => removeAttachment(file.id)}
                style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', padding: '0 2px', fontSize: 12 }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Textarea Input */}
      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={isListening ? '🎙️ Listening to your voice... Speak now' : 'Ask anything about engineering, coding, placements or your career...'}
        rows={1}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          resize: 'none',
          fontSize: 15,
          color: t.textPrimary,
          fontFamily: 'DM Sans, sans-serif',
          lineHeight: 1.6,
          minHeight: 28,
          maxHeight: 180
        }}
      />

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*,.pdf,.txt,.js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.json,.md,.html,.css"
        multiple
        style={{ display: 'none' }}
      />

      {/* Input Action Controls Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              height: 32,
              padding: '0 12px',
              borderRadius: 8,
              border: attachedFiles.length > 0 ? '1px solid #8B5CF6' : `1px solid ${t.inputBorder}`,
              background: attachedFiles.length > 0 ? 'rgba(139, 92, 246, 0.15)' : t.bgMain,
              color: attachedFiles.length > 0 ? '#C4B5FD' : t.textMuted,
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Paperclip size={14} />
            <span>Attach</span>
          </button>

          <button
            type="button"
            onClick={toggleVoiceInput}
            style={{
              height: 32,
              padding: '0 12px',
              borderRadius: 8,
              border: isListening ? '1px solid #EF4444' : `1px solid ${t.inputBorder}`,
              background: isListening ? 'rgba(239, 68, 68, 0.2)' : t.bgMain,
              color: isListening ? '#FCA5A5' : t.textMuted,
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              animation: isListening ? 'pulse 1.5s infinite' : 'none'
            }}
          >
            <Mic size={14} style={{ color: isListening ? '#EF4444' : 'inherit' }} />
            <span>{isListening ? 'Listening...' : 'Voice'}</span>
          </button>

          <span className="ai-tutor-shortcut-hint" style={{ fontSize: 11.5, color: t.textMuted, marginLeft: 8 }}>
            Shift + Enter for new line • Enter to send
          </span>
        </div>

        <motion.button
          whileHover={{ scale: (input.trim() || attachedFiles.length > 0) && !loading ? 1.05 : 1 }}
          whileTap={{ scale: (input.trim() || attachedFiles.length > 0) && !loading ? 0.95 : 1 }}
          onClick={() => sendMessage()}
          disabled={loading || (!input.trim() && attachedFiles.length === 0)}
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: (input.trim() || attachedFiles.length > 0) && !loading ? 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)' : (isDark ? '#334155' : '#CBD5E1'),
            border: 'none',
            cursor: (input.trim() || attachedFiles.length > 0) && !loading ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: (input.trim() || attachedFiles.length > 0) && !loading ? '0 4px 14px rgba(124, 58, 237, 0.35)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          <Send size={16} />
        </motion.button>
      </div>
    </div>
  )

  const isEmptyChat = messages.length === 0

  return (
    <AppLayout>
      <div
        style={{
          height: 'calc(100vh - 64px)',
          display: 'flex',
          background: t.bgMain,
          color: t.textPrimary,
          fontFamily: 'DM Sans, sans-serif',
          overflow: 'hidden'
        }}
      >
        {/* ════════════════════════════════════════════════════════════ */}
        {/* 1. INNER CHAT HISTORY DRAWER                                */}
        {/* ════════════════════════════════════════════════════════════ */}
        <motion.div
          animate={{ width: sidebarOpen ? 300 : 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{
            minWidth: sidebarOpen ? 300 : 0,
            background: t.bgSidebar,
            borderRight: `1px solid ${t.border}`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 20
          }}
        >
          {/* Sidebar Top: Header + New Chat */}
          <div style={{ padding: '16px 16px 12px', flexShrink: 0 }}>
            {/* Header Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MessageSquare size={18} style={{ color: '#8B5CF6' }} />
                <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 800, color: t.textPrimary }}>
                  Conversations
                </span>
              </div>
            </div>

            {/* New Chat Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={createNewChat}
              style={{
                width: '100%',
                height: 42,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                border: 'none',
                color: '#FFFFFF',
                fontFamily: 'Sora, sans-serif',
                fontSize: 13.5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 16px rgba(124, 58, 237, 0.25)',
                transition: 'all 0.2s'
              }}
            >
              <Plus size={18} strokeWidth={2.5} />
              <span>New Chat</span>
            </motion.button>

            {/* Search Conversations */}
            <div style={{ position: 'relative', marginTop: 12 }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: t.textMuted }} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                style={{
                  width: '100%',
                  height: 36,
                  padding: '0 12px 0 36px',
                  borderRadius: 10,
                  border: `1px solid ${t.inputBorder}`,
                  background: t.bgInput,
                  color: t.textPrimary,
                  fontSize: 12.5,
                  fontFamily: 'DM Sans, sans-serif',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => (e.target.style.borderColor = '#8B5CF6')}
                onBlur={(e) => (e.target.style.borderColor = t.inputBorder)}
              />
            </div>
          </div>

          {/* Sidebar Scrollable Recent Chats List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 12px', overflowX: 'hidden' }}>
            {/* Projects Section */}
            <div style={{ marginBottom: 12 }}>
              <div
                onClick={() => setProjectsExpanded((p) => !p)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 8px',
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: 800,
                  color: t.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  userSelect: 'none'
                }}
              >
                <ChevronRight
                  size={12}
                  style={{ transform: projectsExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}
                />
                <span>Projects</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowNewProject((p) => !p)
                  }}
                  style={{
                    marginLeft: 'auto',
                    background: 'none',
                    border: 'none',
                    color: t.textMuted,
                    fontSize: 14,
                    cursor: 'pointer',
                    padding: '0 4px'
                  }}
                >
                  +
                </button>
              </div>

              {showNewProject && (
                <div style={{ padding: '4px 8px 8px', display: 'flex', gap: 6 }}>
                  <input
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addProject()}
                    placeholder="Project name"
                    autoFocus
                    style={{
                      flex: 1,
                      height: 30,
                      padding: '0 8px',
                      borderRadius: 6,
                      border: `1px solid ${t.inputBorder}`,
                      background: t.bgInput,
                      color: t.textPrimary,
                      fontSize: 12,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    onClick={addProject}
                    style={{
                      height: 30,
                      padding: '0 10px',
                      borderRadius: 6,
                      border: 'none',
                      background: '#7C3AED',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Add
                  </button>
                </div>
              )}

              {projectsExpanded &&
                projects.map((p) => (
                  <div key={p.id} style={{ marginBottom: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: t.textSecondary, fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.name}
                      </span>
                      <button
                        onClick={() => deleteProject(p.id)}
                        style={{ background: 'none', border: 'none', color: t.textMuted, fontSize: 12, cursor: 'pointer', opacity: 0.6 }}
                      >
                        ✕
                      </button>
                    </div>
                    {(projectChats[p.id] || []).map((c) => renderChatItem(c))}
                  </div>
                ))}
            </div>

            {/* Pinned Section */}
            {pinnedChats.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ padding: '6px 8px', fontSize: 10.5, fontWeight: 800, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Pin size={11} fill="#8B5CF6" /> Pinned
                </div>
                {pinnedChats.map((c) => renderChatItem(c))}
              </div>
            )}

            {/* Grouped Recent Chats */}
            {Object.entries(groupedChats).map(([group, groupChats]) => {
              if (groupChats.length === 0) return null
              return (
                <div key={group} style={{ marginBottom: 12 }}>
                  <div style={{ padding: '6px 8px 4px', fontSize: 10.5, fontWeight: 800, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {group}
                  </div>
                  {groupChats.map((c) => renderChatItem(c))}
                </div>
              )
            })}

            {chats.length === 0 && (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: t.textMuted, fontSize: 13 }}>
                <MessageSquare size={24} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                <div>No conversations yet.</div>
                <div style={{ fontSize: 11.5, marginTop: 4 }}>Start a new chat to begin learning!</div>
              </div>
            )}
          </div>

          {/* Sidebar Bottom Footer: Settings Button */}
          <div style={{ borderTop: `1px solid ${t.border}`, padding: '10px 12px', flexShrink: 0, background: t.bgSidebar }}>
            <button
              onClick={() => setShowSettings(true)}
              style={{
                width: '100%',
                height: 36,
                borderRadius: 8,
                border: `1px solid ${t.inputBorder}`,
                background: t.bgInput,
                color: t.textSecondary,
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <SettingsIcon size={14} />
              <span>Tutor Settings</span>
            </button>
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════ */}
        {/* 2. CENTER CHAT AREA                                         */}
        {/* ════════════════════════════════════════════════════════════ */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative' }}>
          {/* Header */}
          <header
            style={{
              height: 56,
              borderBottom: `1px solid ${t.border}`,
              background: t.bgHeader,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 20px',
              flexShrink: 0,
              zIndex: 10
            }}
          >
            {/* Left: Sidebar Toggle + Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={() => setSidebarOpen((p) => !p)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: t.textSecondary,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title={sidebarOpen ? "Hide History" : "Show History"}
              >
                <PanelRightClose size={20} style={{ transform: sidebarOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: t.textPrimary }}>
                  {activeChat?.title || 'New Chat'}
                </span>
              </div>
            </div>

            {/* Right Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {messages.length > 0 && (
                <button
                  onClick={clearCurrentChat}
                  style={{
                    height: 30,
                    padding: '0 12px',
                    borderRadius: 8,
                    border: `1px solid ${t.inputBorder}`,
                    background: t.bgInput,
                    color: t.textSecondary,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Clear Chat
                </button>
              )}

              <button
                onClick={() => setRightDrawerOpen((p) => !p)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: rightDrawerOpen ? '#8B5CF6' : t.textSecondary,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Toggle Assistant Info"
              >
                <PanelRightOpen size={19} />
              </button>
            </div>
          </header>

          {/* Messages / Welcome Container */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {/* EMPTY CHAT WELCOME */}
            {isEmptyChat && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center', maxWidth: 840, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
                <div style={{ width: 64, height: 64, borderRadius: 22, background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 30px rgba(124, 58, 237, 0.35)', marginBottom: 20 }}>
                  <Sparkles size={32} color="#fff" />
                </div>

                <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: t.textPrimary, margin: '0 0 10px', letterSpacing: '-0.5px' }}>
                  {getGreeting()}, {user?.displayName ? user.displayName.split(' ')[0] : 'Student'}
                </h1>
                <p style={{ fontSize: 15, color: t.textSecondary, maxWidth: 520, margin: 0, lineHeight: 1.6 }}>
                  What engineering topic, coding problem, or career goal would you like to master today?
                </p>
              </div>
            )}

            {/* MESSAGES LIST */}
            {!isEmptyChat && (
              <div style={{ padding: '32px 0 20px', flex: 1 }}>
                <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
                  {messages.map((msg, i) => (
                    <div key={i} style={{ marginBottom: 32 }}>
                      {msg.role === 'user' ? (
                        /* USER MESSAGE */
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, alignItems: 'flex-start' }}>
                          <div
                            style={{
                              maxWidth: '80%',
                              background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                              color: '#FFFFFF',
                              padding: '14px 20px',
                              borderRadius: '20px 20px 4px 20px',
                              fontSize: 14.5,
                              lineHeight: 1.6,
                              boxShadow: '0 4px 16px rgba(124, 58, 237, 0.2)'
                            }}
                          >
                            {/* Attached Files inside Message Bubble */}
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                                {msg.attachments.map((f, idx) => (
                                  <div key={idx} style={{ background: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: 6, fontSize: 11.5, display: 'flex', alignItems: 'center', gap: 6 }}>
                                    {f.isImage ? <ImageIcon size={13} /> : <FileCode size={13} />}
                                    <span>{f.name}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div>{msg.content}</div>

                            {msg.timestamp && (
                              <div style={{ fontSize: 10, color: 'rgba(255, 255, 255, 0.65)', marginTop: 6, textAlign: 'right' }}>
                                {msg.timestamp}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* ASSISTANT MESSAGE */
                        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 12,
                              background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#FFFFFF',
                              flexShrink: 0,
                              marginTop: 2,
                              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
                            }}
                          >
                            <Sparkles size={18} />
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                background: t.assistantCardBg,
                                border: `1px solid ${t.assistantCardBorder}`,
                                borderRadius: '4px 20px 20px 20px',
                                padding: '18px 22px',
                                fontSize: 14.5,
                                lineHeight: 1.75,
                                color: t.textSecondary,
                                boxShadow: t.shadow
                              }}
                            >
                              {formatText(msg.content)}

                              {/* Blinking Cursor during Typewriter Stream */}
                              {msg.isStreaming && (
                                <span
                                  style={{
                                    display: 'inline-block',
                                    width: 8,
                                    height: 16,
                                    background: '#8B5CF6',
                                    marginLeft: 4,
                                    borderRadius: 2,
                                    animation: 'blink 0.8s infinite'
                                  }}
                                />
                              )}

                              {/* Related Videos */}
                              {i === messages.length - 1 && showVideos && videos.length > 0 && (
                                <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${t.border}` }}>
                                  <div style={{ fontSize: 11, fontWeight: 800, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>
                                    📺 Related Tutorials
                                  </div>
                                  <div style={{ display: 'flex', gap: 12 }}>
                                    {videos.map((video) => {
                                      const vid = video.id?.videoId
                                      if (!vid) return null
                                      return (
                                        <a
                                          key={vid}
                                          href={`https://youtube.com/watch?v=${vid}`}
                                          target="_blank"
                                          rel="noreferrer"
                                          style={{ textDecoration: 'none', flex: 1 }}
                                        >
                                          <div style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${t.border}`, background: t.bgMain }}>
                                            <img src={video.snippet?.thumbnails?.medium?.url} alt="" style={{ width: '100%', height: 95, objectFit: 'cover' }} />
                                            <div style={{ padding: '8px 10px' }}>
                                              <div style={{ fontSize: 11.5, fontWeight: 600, color: t.textPrimary, lineHeight: 1.4, marginBottom: 4 }}>
                                                {video.snippet?.title}
                                              </div>
                                              <div style={{ fontSize: 10, color: '#EF4444', fontWeight: 700 }}>▶ {video.snippet?.channelTitle}</div>
                                            </div>
                                          </div>
                                        </a>
                                      )
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Action Toolbar Below Assistant Message */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, paddingLeft: 4 }}>
                              <button
                                onClick={() => handleCopy(msg.content, `msg-${i}`)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: copiedId === `msg-${i}` ? '#10B981' : t.textMuted,
                                  fontSize: 12,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4
                                }}
                              >
                                {copiedId === `msg-${i}` ? <Check size={13} /> : <Copy size={13} />}
                                <span>{copiedId === `msg-${i}` ? 'Copied' : 'Copy'}</span>
                              </button>

                              <button
                                onClick={() => sendMessage(messages[i - 1]?.content || '')}
                                style={{ background: 'none', border: 'none', color: t.textMuted, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                              >
                                <RotateCcw size={13} />
                                <span>Regenerate</span>
                              </button>

                              <button
                                onClick={() => handleSpeak(msg.content)}
                                style={{ background: 'none', border: 'none', color: t.textMuted, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                              >
                                <Volume2 size={13} />
                                <span>Speak</span>
                              </button>

                              <button
                                onClick={() => alert('Feedback submitted! Thank you.')}
                                style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', padding: 2 }}
                              >
                                <ThumbsUp size={13} />
                              </button>

                              <button
                                onClick={() => alert('Feedback submitted!')}
                                style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', padding: 2 }}
                              >
                                <ThumbsDown size={13} />
                              </button>

                              {msg.timestamp && <span style={{ fontSize: 11, color: t.textMuted, marginLeft: 'auto' }}>{msg.timestamp}</span>}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Loading Indicator */}
                  {loading && (
                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 32 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 12,
                          background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          flexShrink: 0
                        }}
                      >
                        <Sparkles size={18} />
                      </div>
                      <div
                        style={{
                          background: t.assistantCardBg,
                          border: `1px solid ${t.assistantCardBorder}`,
                          borderRadius: '4px 20px 20px 20px',
                          padding: '14px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        <span style={{ fontSize: 13, color: t.textMuted, fontWeight: 600 }}>ZenScore AI is thinking</span>
                        <div style={{ display: 'flex', gap: 4, marginLeft: 4 }}>
                          {[0, 1, 2].map((dot) => (
                            <div
                              key={dot}
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: '#8B5CF6',
                                animation: `blink 1.2s ${dot * 0.2}s ease-in-out infinite`
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            )}

            {/* Bottom Sticky Input Container */}
            <div style={{ padding: '16px 20px 24px', background: isDark ? 'linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, #0F172A 40%)' : 'linear-gradient(180deg, rgba(248, 250, 252, 0) 0%, #F8FAFC 40%)', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {renderInputCard()}
              <div style={{ fontSize: 11, color: t.textMuted, marginTop: 10, textAlign: 'center' }}>
                ZenScore Tutor can make mistakes. Verify important engineering info.
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════ */}
        {/* 3. RIGHT DRAWER (Assistant Info & Tools)                     */}
        {/* ════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {rightDrawerOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                background: t.bgSidebar,
                borderLeft: `1px solid ${t.border}`,
                padding: 20,
                overflowY: 'auto',
                flexShrink: 0,
                zIndex: 20
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: t.textPrimary, fontFamily: 'Sora, sans-serif' }}>
                  Tutor Overview
                </span>
                <button
                  onClick={() => setRightDrawerOpen(false)}
                  style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* AI Assistant Badge */}
              <div style={{ background: t.bgMain, border: `1px solid ${t.border}`, borderRadius: 14, padding: 14, marginBottom: 20, textAlign: 'center' }}>
                <ZenScoreIcon size={42} style={{ margin: '0 auto 10px' }} />
                <div style={{ fontSize: 15, fontWeight: 800, color: t.textPrimary, fontFamily: 'Sora, sans-serif' }}>
                  {settings.aiName}
                </div>
                <div style={{ fontSize: 11, color: '#8B5CF6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 2 }}>
                  Engineering Copilot v2.4
                </div>
              </div>

              {/* Stats */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 }}>
                  Session Stats
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ background: t.bgMain, padding: 10, borderRadius: 10, border: `1px solid ${t.border}`, textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#8B5CF6' }}>{chats.length}</div>
                    <div style={{ fontSize: 10.5, color: t.textMuted, fontWeight: 600 }}>Total Chats</div>
                  </div>
                  <div style={{ background: t.bgMain, padding: 10, borderRadius: 10, border: `1px solid ${t.border}`, textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#10B981' }}>{messages.length}</div>
                    <div style={{ fontSize: 10.5, color: t.textMuted, fontWeight: 600 }}>Messages</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ════════════════════════════════════════════════════════════ */}
        {/* 4. THREE-DOTS CONTEXT MENU POPUP                            */}
        {/* ════════════════════════════════════════════════════════════ */}
        {contextMenu && (
          <div
            ref={contextMenuRef}
            style={{
              position: 'fixed',
              top: Math.min(contextMenu.y, window.innerHeight - 160),
              left: Math.min(contextMenu.x, window.innerWidth - 190),
              zIndex: 1000,
              background: t.dropdownBg,
              border: `1px solid ${t.dropdownBorder}`,
              borderRadius: 12,
              padding: '6px',
              boxShadow: t.shadow,
              width: 170
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                togglePinChat(contextMenu.id)
                setContextMenu(null)
              }}
              style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', color: t.textPrimary, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', borderRadius: 8, textAlign: 'left' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = t.hoverBg)}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              <Pin size={14} fill={chats.find((c) => c.id === contextMenu.id || c._id === contextMenu.id)?.pinned || chats.find((c) => c.id === contextMenu.id || c._id === contextMenu.id)?.isPinned ? '#8B5CF6' : 'none'} color="#8B5CF6" />
              <span>{chats.find((c) => c.id === contextMenu.id || c._id === contextMenu.id)?.pinned || chats.find((c) => c.id === contextMenu.id || c._id === contextMenu.id)?.isPinned ? 'Unpin Chat' : 'Pin Chat'}</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                const targetChat = chats.find((c) => c.id === contextMenu.id || c._id === contextMenu.id)
                if (targetChat) {
                  setEditingChatId(targetChat.id || targetChat._id)
                  setEditTitle(targetChat.title)
                }
                setContextMenu(null)
              }}
              style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', color: t.textPrimary, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', borderRadius: 8, textAlign: 'left' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = t.hoverBg)}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              <Edit2 size={14} color="#38BDF8" /> <span>Rename</span>
            </button>

            <div style={{ height: 1, background: t.dropdownBorder, margin: '4px 0' }} />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                deleteChat(contextMenu.id)
                setContextMenu(null)
              }}
              style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', color: '#EF4444', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', borderRadius: 8, textAlign: 'left' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              <Trash2 size={14} color="#EF4444" /> <span>Delete</span>
            </button>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════ */}
        {/* 5. SETTINGS MODAL                                            */}
        {/* ════════════════════════════════════════════════════════════ */}
        {showSettings && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: isDark ? 'rgba(15, 23, 42, 0.75)' : 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20
            }}
            onClick={() => setShowSettings(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: t.bgCard,
                border: `1px solid ${t.assistantCardBorder}`,
                borderRadius: 20,
                padding: 24,
                width: '100%',
                maxWidth: 480,
                boxShadow: t.shadow
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: t.textPrimary, margin: 0 }}>
                  Customize ZenScore AI
                </h2>
                <button
                  onClick={() => setShowSettings(false)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    border: `1px solid ${t.inputBorder}`,
                    background: t.bgInput,
                    color: t.textMuted,
                    fontSize: 16,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: t.textMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    AI Assistant Name
                  </label>
                  <input
                    value={settings.aiName}
                    onChange={(e) => setSettings((p) => ({ ...p, aiName: e.target.value }))}
                    style={{
                      width: '100%',
                      height: 42,
                      padding: '0 14px',
                      borderRadius: 10,
                      border: `1px solid ${t.inputBorder}`,
                      background: t.bgInput,
                      color: t.textPrimary,
                      fontSize: 14,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: t.textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Response Explanation Style
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['concise', 'balanced', 'detailed'].map((style) => (
                      <button
                        key={style}
                        onClick={() => setSettings((p) => ({ ...p, responseStyle: style }))}
                        style={{
                          flex: 1,
                          height: 38,
                          borderRadius: 10,
                          border: settings.responseStyle === style ? '1.5px solid #8B5CF6' : `1px solid ${t.inputBorder}`,
                          background: settings.responseStyle === style ? 'rgba(124, 58, 237, 0.2)' : t.bgInput,
                          color: settings.responseStyle === style ? '#C4B5FD' : t.textMuted,
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: 'pointer',
                          textTransform: 'capitalize'
                        }}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes blink { 0%, 100% { opacity: 0.2; transform: scale(0.85); } 50% { opacity: 1; transform: scale(1); } }
          @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
          @media (max-width: 640px) {
            .ai-tutor-shortcut-hint {
              display: none !important;
            }
          }
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: ${isDark ? '#0F172A' : '#F8FAFC'}; }
          ::-webkit-scrollbar-thumb { background: ${isDark ? '#334155' : '#CBD5E1'}; border-radius: 3px; }
          ::-webkit-scrollbar-thumb:hover { background: ${isDark ? '#475569' : '#94A3B8'}; }
        `}</style>
      </div>
    </AppLayout>
  )
}