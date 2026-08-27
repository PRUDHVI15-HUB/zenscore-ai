import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCareer } from '../../../context/CareerContext'
import { executeAIRequest } from '../../../services/ai/baseAIService'
import {
  Bot,
  User,
  Send,
  Paperclip,
  Mic,
  RotateCcw,
  Minus,
  X,
  Copy,
  Check,
  Sparkles,
  MessageSquare,
  Compass,
  ArrowRight
} from 'lucide-react'

// Suggested questions mapping per section
const SECTION_SUGGESTIONS = {
  overview: [
    'Am I ready for placements?',
    'What should I learn next?',
    'Give me a summary of my career progress.'
  ],
  learning: [
    'Explain Docker simply.',
    'Why is React important?',
    'Which project should I build next?'
  ],
  resume: [
    'Why is my ATS score low?',
    'Improve my professional summary.',
    'Suggest stronger project descriptions.'
  ],
  jobs: [
    'Which jobs suit me best?',
    'Why was this job recommended?',
    'What salary should I expect for my target role?'
  ],
  interview: [
    'Ask me 3 technical interview questions.',
    'Conduct a quick HR behavioral interview.',
    'Give me feedback on answering System Design questions.'
  ]
}

const DEFAULT_WELCOME_CHIPS = [
  'How do I become a Backend Developer?',
  'Review my roadmap.',
  'How can I improve my resume?',
  'Prepare me for TCS interviews.',
  'Recommend jobs for me.'
]

export default function AICareerCopilot() {
  const location = useLocation()
  const career = useCareer()

  // Panel state: closed | open | minimized
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  // Messages state
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(null)

  const chatEndRef = useRef(null)
  const textareaRef = useRef(null)

  // Determine current active section from location path
  const currentSection = useMemo(() => {
    const path = location.pathname
    if (path.includes('/learning')) return 'learning'
    if (path.includes('/resume')) return 'resume'
    if (path.includes('/jobs')) return 'jobs'
    if (path.includes('/interview')) return 'interview'
    return 'overview'
  }, [location.pathname])

  // Context attributes
  const targetCareer = career?.currentCareer || 'Backend Engineer'
  const readinessScore = career?.getCurrentReadiness ? career.getCurrentReadiness() : 68
  const roadmapProgress = career?.getRoadmapProgress ? career.getRoadmapProgress() : 45
  const completedSkills = career?.getCompletedSkillCount ? career.getCompletedSkillCount() : 18
  const atsScore = career?.getATSScore ? career.getATSScore() : 82

  // Contextual suggestions for current section
  const currentSuggestions = SECTION_SUGGESTIONS[currentSection] || SECTION_SUGGESTIONS.overview

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen && !isMinimized) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading, isOpen, isMinimized])

  // Clear chat
  const handleNewChat = () => {
    setMessages([])
    setInputText('')
  }

  // Copy AI response
  const handleCopyResponse = (text, idx) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(idx)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  // Send message handler
  const handleSendMessage = async (customPrompt) => {
    const textToSend = (customPrompt || inputText).trim()
    if (!textToSend || isLoading) return

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    // Add user message
    const userMsg = { sender: 'user', text: textToSend, timestamp }
    setMessages(prev => [...prev, userMsg])

    if (!customPrompt) setInputText('')
    setIsLoading(true)

    // Build context-aware prompt
    const promptWithContext = `
Student Context:
- Target Role: ${targetCareer}
- Career Readiness: ${readinessScore}%
- Roadmap Progress: ${roadmapProgress}%
- Completed Skills: ${completedSkills}/30
- Resume ATS Score: ${atsScore}%
- Active Screen Section: ${currentSection.toUpperCase()}

Student Question: "${textToSend}"

Instructions: Provide a concise, highly actionable, encouraging, and professional career advice response tailored to ZenScore AI students. Use bullet points and code blocks where helpful.
    `.trim()

    try {
      const response = await executeAIRequest({
        featureKey: 'career_copilot',
        cacheSubKey: `q_${textToSend.substring(0, 20)}_${targetCareer}`,
        promptVersion: 'v2.0',
        prompt: promptWithContext,
        requestPayload: { message: textToSend, query: textToSend, targetCareer, readinessScore, currentSection },
        endpoint: '/careers/copilot/chat',
        fallbackData: {
          insight: `Based on your ${targetCareer} goal (${readinessScore}% readiness), here is my guidance:\n\n• **Core Recommendation**: Focus on completing your active roadmap modules and practicing mock technical rounds.\n• **Skills Strategy**: Strengthen your project portfolio with 2 real-world enterprise applications.\n• **ATS Tip**: Optimize key technical skills in your resume to boost your ATS match above 85%.`
        }
      })

      const aiText = response?.data?.reply || response?.data?.insight || response?.data?.advice || response?.data?.recommendation ||
        `Great question regarding ${targetCareer}! To boost your readiness (${readinessScore}%), focus on completing your roadmap projects and reviewing key DSA problem patterns.`

      const aiMsg = { sender: 'ai', text: aiText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      setMessages(prev => [...prev, aiMsg])
    } catch (err) {
      const errorMsg = { sender: 'ai', text: '⚠️ I encountered a temporary connection issue. Please click retry to re-send your message.', isError: true, lastQuery: textToSend, timestamp }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle textarea key down
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Simple Markdown & Code Formatter Component
  const FormattedMessage = ({ text }) => {
    if (!text) return null

    // Split text into paragraphs and code blocks
    const parts = text.split(/(```[\s\S]*?```)/g)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13.5, lineHeight: 1.6, fontFamily: 'DM Sans, sans-serif' }}>
        {parts.map((part, index) => {
          if (part.startsWith('```') && part.endsWith('```')) {
            const codeContent = part.slice(3, -3).replace(/^[a-z]+\n/, '')
            return (
              <div key={index} style={{ background: '#0F172A', color: '#E2E8F0', borderRadius: 12, padding: '12px 14px', margin: '6px 0', fontFamily: 'Consolas, monospace', fontSize: 12.5, position: 'relative', overflowX: 'auto' }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{codeContent}</pre>
              </div>
            )
          }

          // Bullet points and bold text parsing
          const lines = part.split('\n')
          return (
            <div key={index}>
              {lines.map((line, lIdx) => {
                if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                  const content = line.trim().substring(1).trim()
                  return (
                    <div key={lIdx} style={{ display: 'flex', gap: 6, margin: '3px 0' }}>
                      <span style={{ color: '#7C3AED', fontWeight: 800 }}>•</span>
                      <span>{parseBoldText(content)}</span>
                    </div>
                  )
                }
                return <div key={lIdx} style={{ marginBottom: line.trim() ? 4 : 0 }}>{parseBoldText(line)}</div>
              })}
            </div>
          )
        })}
      </div>
    )
  }

  const parseBoldText = (str) => {
    const boldParts = str.split(/(\*\*.*?\*\*)/g)
    return boldParts.map((bPart, idx) => {
      if (bPart.startsWith('**') && bPart.endsWith('**')) {
        return <strong key={idx} style={{ color: '#0F172A', fontWeight: 800 }}>{bPart.slice(2, -2)}</strong>
      }
      return bPart
    })
  }

  return (
    <>
      {/* ── FLOATING TRIGGER BUTTON (Always visible across all Careers pages) ── */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            setIsOpen(true)
            setIsMinimized(false)
          }}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9990,
            height: 54,
            padding: '0 22px',
            borderRadius: 27,
            background: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 50%, #EC4899 100%)',
            color: '#FFFFFF',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 28px rgba(109, 40, 217, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: 'Sora, sans-serif',
            fontWeight: 800,
            fontSize: 14
          }}
        >
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={18} />
          </div>
          <span>Career Copilot</span>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E' }} />
        </motion.button>
      )}

      {/* ── MINIMIZED FLOATING PILL ── */}
      {isOpen && isMinimized && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setIsMinimized(false)}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9990,
            padding: '10px 18px',
            borderRadius: 20,
            background: '#0F172A',
            color: '#FFFFFF',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: 'Sora, sans-serif',
            fontSize: 13,
            fontWeight: 700
          }}
        >
          <Bot size={18} style={{ color: '#7C3AED' }} />
          <span>Copilot Minimized ({messages.length} messages)</span>
          <Sparkles size={14} style={{ color: '#FDE047' }} />
        </motion.div>
      )}

      {/* ── SLIDE-OUT PANEL & MOBILE DRAWER ── */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="copilot-panel-container"
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 9999,
              width: 420,
              maxWidth: 'calc(100vw - 32px)',
              height: 640,
              maxHeight: 'calc(100vh - 48px)',
              background: '#FFFFFF',
              borderRadius: 24,
              border: '1px solid #E2E8F0',
              boxShadow: '0 20px 50px rgba(15, 23, 42, 0.22)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* SECTION 1: HEADER */}
            <div
              style={{
                padding: '16px 20px',
                background: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={20} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                    🤖 ZenScore Career Copilot
                  </h3>
                  <span style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.85)', fontFamily: 'DM Sans, sans-serif' }}>
                    Personal AI Mentor · {targetCareer}
                  </span>
                </div>
              </div>

              {/* Action Buttons: New Chat, Minimize, Close */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button
                  title="New Chat"
                  onClick={handleNewChat}
                  style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', cursor: 'pointer' }}
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  title="Minimize"
                  onClick={() => setIsMinimized(true)}
                  style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', cursor: 'pointer' }}
                >
                  <Minus size={14} />
                </button>
                <button
                  title="Close"
                  onClick={() => setIsOpen(false)}
                  style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* CONTEXT BAR */}
            <div style={{ padding: '8px 16px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: '#64748B', fontFamily: 'Sora, sans-serif' }}>
              <span>Target: <strong style={{ color: '#7C3AED' }}>{targetCareer}</strong></span>
              <span>Readiness: <strong style={{ color: '#2563EB' }}>{readinessScore}%</strong></span>
              <span>ATS: <strong style={{ color: '#059669' }}>{atsScore}%</strong></span>
            </div>

            {/* SECTION 2: CONVERSATION STREAM */}
            <div style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, background: '#FAFAFA' }}>

              {/* EMPTY STATE (If no messages sent yet) */}
              {messages.length === 0 && (
                <div style={{ padding: '24px 12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
                    👋
                  </div>
                  <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 17, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Welcome to Career Copilot
                  </h4>
                  <p style={{ fontSize: 12.5, color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                    I am your persistent AI career mentor. Ask me anything about your placement roadmap, resume ATS score, or job interview practice.
                  </p>

                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase', textAlign: 'left', fontFamily: 'Sora, sans-serif' }}>
                      Try Asking:
                    </span>
                    {DEFAULT_WELCOME_CHIPS.map((chip, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => handleSendMessage(chip)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 10,
                          background: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          color: '#334155',
                          fontSize: 12,
                          fontWeight: 600,
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontFamily: 'DM Sans, sans-serif',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                        }}
                      >
                        <span>{chip}</span>
                        <ArrowRight size={13} style={{ color: '#7C3AED' }} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* MESSAGES LIST */}
              {messages.map((msg, index) => {
                const isUser = msg.sender === 'user'
                return (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isUser ? 'flex-end' : 'flex-start',
                      gap: 4
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 8,
                        flexDirection: isUser ? 'row-reverse' : 'row',
                        maxWidth: '88%'
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: isUser ? '#7C3AED' : '#0F172A',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 800,
                          flexShrink: 0
                        }}
                      >
                        {isUser ? <User size={14} /> : <Bot size={14} />}
                      </div>

                      <div
                        style={{
                          padding: '12px 14px',
                          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          background: isUser ? 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)' : '#FFFFFF',
                          color: isUser ? '#FFFFFF' : '#0F172A',
                          border: isUser ? 'none' : '1px solid #E2E8F0',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                          position: 'relative'
                        }}
                      >
                        <FormattedMessage text={msg.text} />

                        {!isUser && !msg.isError && (
                          <button
                            onClick={() => handleCopyResponse(msg.text, index)}
                            style={{
                              marginTop: 8,
                              background: 'none',
                              border: 'none',
                              color: '#64748B',
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              fontFamily: 'Sora, sans-serif'
                            }}
                          >
                            {copiedIndex === index ? <Check size={12} style={{ color: '#059669' }} /> : <Copy size={12} />}
                            <span>{copiedIndex === index ? 'Copied' : 'Copy'}</span>
                          </button>
                        )}

                        {msg.isError && (
                          <button
                            onClick={() => handleSendMessage(msg.lastQuery)}
                            style={{
                              marginTop: 6,
                              padding: '4px 10px',
                              borderRadius: 6,
                              background: '#EF4444',
                              color: '#FFFFFF',
                              border: 'none',
                              fontSize: 11,
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            Retry Message
                          </button>
                        )}
                      </div>
                    </div>

                    <span style={{ fontSize: 10, color: '#94A3B8', padding: '0 4px', fontFamily: 'DM Sans, sans-serif' }}>
                      {msg.timestamp}
                    </span>
                  </div>
                )
              })}

              {/* TYPING INDICATOR */}
              {isLoading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0F172A', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bot size={14} />
                  </div>
                  <div style={{ background: '#FFFFFF', padding: '10px 14px', borderRadius: 16, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED', animation: 'pulse 1s infinite 0s' }} />
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED', animation: 'pulse 1s infinite 0.2s' }} />
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED', animation: 'pulse 1s infinite 0.4s' }} />
                    <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginLeft: 4, fontFamily: 'DM Sans, sans-serif' }}>Copilot is thinking...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* SECTION 3: SECTION-CONTEXTUAL SUGGESTED QUESTIONS */}
            <div style={{ padding: '8px 16px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase', fontFamily: 'Sora, sans-serif' }}>
                  💡 {currentSection.toUpperCase()} SUGGESTIONS
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
                {currentSuggestions.map((sug, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => handleSendMessage(sug)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 14,
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      color: '#475569',
                      fontSize: 11.5,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      fontFamily: 'DM Sans, sans-serif'
                    }}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* SECTION 4: INPUT BAR */}
            <div style={{ padding: 12, background: '#FFFFFF', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {/* Future-ready placeholders */}
              <button title="Attach Resume" onClick={() => alert('📎 Resume upload attached to Copilot context.')} style={{ background: '#F1F5F9', border: 'none', borderRadius: 10, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', cursor: 'pointer' }}>
                <Paperclip size={16} />
              </button>
              <button title="Voice Input" onClick={() => alert('🎙️ Voice input listening...')} style={{ background: '#F1F5F9', border: 'none', borderRadius: 10, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', cursor: 'pointer' }}>
                <Mic size={16} />
              </button>

              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Career Copilot..."
                rows={1}
                style={{
                  flex: 1,
                  border: '1px solid #CBD5E1',
                  borderRadius: 12,
                  padding: '8px 12px',
                  fontSize: 13,
                  fontFamily: 'DM Sans, sans-serif',
                  outline: 'none',
                  resize: 'none',
                  maxHeight: 80
                }}
              />

              <button
                disabled={!inputText.trim() || isLoading}
                onClick={() => handleSendMessage()}
                style={{
                  height: 36,
                  padding: '0 14px',
                  borderRadius: 10,
                  background: !inputText.trim() || isLoading ? '#CBD5E1' : 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: !inputText.trim() || isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4
                }}
              >
                <Send size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @media (max-width: 640px) {
          .copilot-panel-container {
            bottom: 0 !important;
            right: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: 100vw !important;
            max-height: 100vh !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </>
  )
}
