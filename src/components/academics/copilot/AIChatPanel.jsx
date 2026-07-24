/**
 * AIChatPanel.jsx — Premium Academic Copilot Panel (Phase 5)
 *
 * Root dashboard container orchestrating the chat header, messages log viewport, suggested prompts, and inputs.
 * All props/callbacks/session memory logic untouched.
 */
import React, { useState, useRef, useEffect, useCallback } from 'react'
import ChatHeader from './ChatHeader'
import ChatInput from './ChatInput'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import EmptyConversation from './EmptyConversation'
import { apiFetch } from '../../../services/copilotApi'

let msgIdCounter = 0
const nextId = () => `msg-${++msgIdCounter}-${Date.now()}`

export default function AIChatPanel({ className = '', style = {} }) {
  const [messages, setMessages]         = useState([])
  const [inputValue, setInputValue]   = useState('')
  const [loading, setLoading]         = useState(false)
  const [isOnline, setIsOnline]       = useState(true)
  const [streamingActive, setStreamingActive] = useState(false)
  const [isAtBottom, setIsAtBottom]   = useState(true)
  const [sessionMemory, setSessionMemory] = useState({
    lastSubject: '',
    lastSemester: '',
    lastTopic: '',
    lastRecommendation: ''
  })

  const messagesEndRef = useRef(null)
  const scrollContainerRef = useRef(null)

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const threshold = 150
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold
    setIsAtBottom(nearBottom)
  }, [])

  const scrollToBottom = useCallback((force = false) => {
    if (force || isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [isAtBottom])

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading, scrollToBottom])

  useEffect(() => {
    const el = scrollContainerRef.current
    if (el) {
      el.addEventListener('scroll', handleScroll, { passive: true })
    }
    return () => {
      if (el) {
        el.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll])

  const buildHistory = useCallback((msgs) => {
    return msgs
      .filter(m => !m.isError)
      .map(m => ({ role: m.role, content: m.content }))
  }, [])

  const resolvePronouns = useCallback((q) => {
    let resolved = q
    const lower = q.toLowerCase()
    
    const hasIt = /\bit\b/.test(lower)
    const hasIts = /\bits\b/.test(lower)
    const hasThatSem = lower.includes('that semester')
    const hasThoseSubs = lower.includes('those subjects')
    const hasItsAtt = lower.includes('its attendance')

    if (hasItsAtt && sessionMemory.lastSubject) {
      resolved = resolved.replace(/its attendance/i, `attendance for ${sessionMemory.lastSubject}`)
    } else if (hasIt && sessionMemory.lastSubject) {
      resolved = resolved.replace(/\bit\b/gi, sessionMemory.lastSubject)
    } else if (hasIts && sessionMemory.lastSubject) {
      resolved = resolved.replace(/\bits\b/gi, `${sessionMemory.lastSubject}'s`)
    }

    if (hasThatSem && sessionMemory.lastSemester) {
      resolved = resolved.replace(/that semester/i, sessionMemory.lastSemester)
    }

    if (hasThoseSubs && sessionMemory.lastSubject) {
      resolved = resolved.replace(/those subjects/i, `subjects like ${sessionMemory.lastSubject}`)
    }

    return resolved
  }, [sessionMemory])

  const updateMemory = useCallback((question, answer, classification) => {
    const combined = `${question} ${answer}`.toLowerCase()
    let updated = {}

    const semMatch = combined.match(/(semester\s*[1-8]|sem\s*[1-8]|first semester|second semester|third semester|fourth semester|fifth semester|sixth semester|seventh semester|eighth semester)/i)
    if (semMatch) {
      const numMatch = semMatch[0].match(/[1-8]/)
      if (numMatch) {
        updated.lastSemester = `Semester ${numMatch[0]}`
      } else if (semMatch[0].includes('first')) updated.lastSemester = 'Semester 1'
      else if (semMatch[0].includes('second')) updated.lastSemester = 'Semester 2'
      else if (semMatch[0].includes('third')) updated.lastSemester = 'Semester 3'
      else if (semMatch[0].includes('fourth')) updated.lastSemester = 'Semester 4'
      else if (semMatch[0].includes('fifth')) updated.lastSemester = 'Semester 5'
      else if (semMatch[0].includes('sixth')) updated.lastSemester = 'Semester 6'
      else if (semMatch[0].includes('seventh')) updated.lastSemester = 'Semester 7'
      else if (semMatch[0].includes('eighth')) updated.lastSemester = 'Semester 8'
    }

    const subjects = [
      'Operating Systems', 'DBMS', 'Database', 'Computer Networks', 'Software Engineering',
      'Algorithms', 'Data Structures', 'Mathematics', 'Discrete Mathematics', 'Automata',
      'Compiler Design', 'Machine Learning', 'Artificial Intelligence', 'Physics', 'Chemistry',
      'English'
    ]
    for (const sub of subjects) {
      if (combined.includes(sub.toLowerCase())) {
        updated.lastSubject = sub
        break
      }
    }

    const topics = ['cgpa', 'gpa', 'credits', 'assignment', 'exam', 'quiz', 'project', 'attendance', 'health score']
    for (const top of topics) {
      if (combined.includes(top)) {
        updated.lastTopic = top
        break
      }
    }

    if (classification === 'Recommendation') {
      updated.lastRecommendation = 'academic improvement'
    } else if (combined.includes('recommendation') || combined.includes('advice') || combined.includes('tip')) {
      updated.lastRecommendation = 'general strategy'
    }

    if (Object.keys(updated).length > 0) {
      setSessionMemory(prev => ({ ...prev, ...updated }))
    }
  }, [])

  const sendMessage = useCallback(async (questionOverride, customHistory = null) => {
    const rawQuestion = (questionOverride ?? inputValue).trim()
    if (!rawQuestion || loading || streamingActive) return

    const question = resolvePronouns(rawQuestion)

    let updatedMsgs = [...messages]
    if (!questionOverride || !customHistory) {
      const userMsg = {
        id: nextId(),
        role: 'user',
        content: rawQuestion,
        timestamp: new Date().toISOString(),
      }
      updatedMsgs = [...messages, userMsg]
      setMessages(updatedMsgs)
      setInputValue('')
    }

    setLoading(true)
    setIsOnline(true)
    setIsAtBottom(true)

    try {
      const history = customHistory ?? buildHistory(updatedMsgs)
      const res = await apiFetch('/academics/copilot/chat', {
        method: 'POST',
        body: JSON.stringify({
          question,
          conversationHistory: history.slice(0, -1)
        })
      })

      if (res.success && res.data) {
        updateMemory(question, res.data.answer, res.data.classification)

        const assistantMsg = {
          id: nextId(),
          role: 'assistant',
          content: res.data.answer,
          suggestions: res.data.suggestions || [],
          classification: res.data.classification || 'General Academic',
          timestamp: res.data.timestamp || new Date().toISOString(),
          isError: false,
          isStreaming: true,
        }
        setStreamingActive(true)
        setMessages(prev => [...prev, assistantMsg])
      } else {
        appendError('503', new Date().toISOString())
        setIsOnline(false)
      }
    } catch (err) {
      const msg = err?.message || ''
      let errorType = '503'
      if (msg.includes('Academic record not found') || err?.status === 404) errorType = '404'
      else if (msg.includes('Too many') || err?.status === 429) errorType = '429'
      else if (msg.includes('Invalid') || err?.status === 400) errorType = '400'

      if (errorType === '503') setIsOnline(false)
      appendError(errorType, new Date().toISOString())
    } finally {
      setLoading(false)
    }
  }, [inputValue, loading, streamingActive, messages, buildHistory, resolvePronouns, updateMemory])

  const appendError = (errorType, timestamp) => {
    setMessages(prev => [...prev, {
      id: nextId(),
      role: 'assistant',
      content: '',
      suggestions: [],
      classification: null,
      timestamp,
      isError: true,
      errorType,
    }])
  }

  const handleRegenerate = useCallback((index) => {
    if (loading || streamingActive) return
    const precedingUserMsg = messages[index - 1]
    if (!precedingUserMsg || precedingUserMsg.role !== 'user') return

    const sliceHistory = buildHistory(messages.slice(0, index - 1))
    setMessages(prev => prev.slice(0, index))
    sendMessage(precedingUserMsg.content, sliceHistory)
  }, [messages, loading, streamingActive, buildHistory, sendMessage])

  const handleRetry = useCallback((index) => {
    handleRegenerate(index)
  }, [handleRegenerate])

  const handleClear = useCallback(() => {
    setMessages([])
    setInputValue('')
    setLoading(false)
    setStreamingActive(false)
    setIsOnline(true)
    setSessionMemory({
      lastSubject: '',
      lastSemester: '',
      lastTopic: '',
      lastRecommendation: ''
    })
  }, [])

  const handleNew = useCallback(() => {
    handleClear()
    msgIdCounter = 0
  }, [handleClear])

  const handleExport = useCallback(() => {
    if (messages.length === 0 || streamingActive) return

    const formatMessage = (m) => {
      const role = m.role === 'user' ? 'YOU' : 'AI COPILOT'
      const time = new Date(m.timestamp).toLocaleString()
      const header = `[${time}] ${role}:`
      if (m.isError) {
        return `${header}\n[Error: Academic AI Copilot is temporarily unavailable (Status: ${m.errorType})]\n`
      }
      let body = m.content
      if (m.suggestions && m.suggestions.length > 0) {
        body += `\n\nRecommended Actions:\n` + m.suggestions.map(s => ` - ${s}`).join('\n')
      }
      return `${header}\n${body}\n`
    }

    const docText = messages.map(formatMessage).join('\n========================================\n\n')
    const finalContent = `ZenScore AI Academic Copilot Chat Export\nGenerated: ${new Date().toLocaleString()}\n\n========================================\n\n${docText}`

    const blob = new Blob([finalContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `academic-copilot-chat-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [messages, streamingActive])

  const handleStreamingComplete = useCallback((msgId) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, isStreaming: false } : m))
    setStreamingActive(false)
  }, [])

  const hasMessages = messages.length > 0
  const isInputDisabled = loading || streamingActive

  return (
    <section
      className={`ai-chat-panel ${className}`}
      aria-label="AI Academic Copilot chat interface"
      role="region"
      style={{
        background: '#fff',
        borderRadius: 24,
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 4px rgba(15,23,42,0.04)',
        display: 'flex',
        flexDirection: 'column',
        height: '600px',
        overflow: 'hidden',
        ...style
      }}
    >
      {/* Header */}
      <ChatHeader
        onClear={handleClear}
        onNew={handleNew}
        onExport={handleExport}
        isOnline={isOnline}
        hasMessages={hasMessages}
        disabled={isInputDisabled}
      />

      {/* Messages Scroll Area */}
      <div
        ref={scrollContainerRef}
        role="log"
        aria-live="polite"
        aria-atomic="false"
        aria-label="Conversation messages"
        tabIndex={0}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '20px 24px',
          scrollBehavior: 'smooth',
        }}
      >
        {!hasMessages ? (
          <EmptyConversation
            onSelectQuestion={(q) => sendMessage(q)}
            disabled={isInputDisabled}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} role="list" aria-label="Chat messages">
            {messages.map((msg, index) => (
              <MessageBubble
                key={msg.id}
                role={msg.role}
                content={msg.content}
                suggestions={msg.suggestions}
                classification={msg.classification}
                timestamp={msg.timestamp}
                isError={msg.isError}
                errorType={msg.errorType}
                onRegenerate={msg.role === 'assistant' ? () => handleRegenerate(index) : null}
                onSelectFollowup={(q) => sendMessage(q)}
                onRetry={msg.isError ? () => handleRetry(index) : null}
                isLoading={loading}
                isStreaming={msg.isStreaming}
                onStreamingComplete={() => handleStreamingComplete(msg.id)}
              />
            ))}

            {loading && <TypingIndicator />}

            <div ref={messagesEndRef} aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Footer input */}
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={() => sendMessage()}
        loading={isInputDisabled}
      />
    </section>
  )
}
