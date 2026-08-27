import React, { useState, useEffect } from 'react'
import { Sparkles, Send, Bot, User, RefreshCw, X, HelpCircle, Code2, MessageSquare, AlertCircle } from 'lucide-react'

/**
 * AITutorDrawer Component
 * Compact slide-over drawer for ZenScore AI Tutor with rich skill & lesson context,
 * conversational session history, and practical task protection.
 */
export default function AITutorDrawer({
  isOpen,
  onClose,
  lessonId = '',
  lessonTitle = '',
  skillTitle = '',
  learningObjectives = [],
  coreConcepts = [],
  onAskAI
}) {
  const coachDomain = skillTitle || (lessonTitle?.toLowerCase().includes('python') ? 'Python' : (lessonTitle?.toLowerCase().includes('docker') ? 'DevOps & Docker' : (lessonTitle?.toLowerCase().includes('react') ? 'React' : 'Engineering')))

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I am your **${coachDomain} AI Coach** for **${lessonTitle || 'this lesson'}**. How can I help you master these concepts today?`
    }
  ])
  const [inputPrompt, setInputPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [lastFailedPrompt, setLastFailedPrompt] = useState(null)

  // Reset conversation context when switching lessons
  useEffect(() => {
    setMessages([
      {
        sender: 'ai',
        text: `Hello! I am your **${coachDomain} AI Coach** for **${lessonTitle || 'this lesson'}**. How can I help you master these concepts today?`
      }
    ])
    setErrorMsg(null)
    setLastFailedPrompt(null)
  }, [lessonId, coachDomain, lessonTitle])

  if (!isOpen) return null

  const quickPrompts = lessonTitle?.toLowerCase().includes('python')
    ? ['Explain Python syntax', 'Give another Python example', 'Ask a Python interview question', 'Explain list comprehensions']
    : lessonTitle?.toLowerCase().includes('docker')
    ? ['Explain Dockerfile instructions', 'Give a Docker Compose example', 'Ask a DevOps interview question', 'Explain container networking']
    : lessonTitle?.toLowerCase().includes('react')
    ? ['Explain React hooks', 'Give another JSX example', 'Ask a React interview question', 'Explain component lifecycle']
    : lessonTitle?.toLowerCase().includes('node')
    ? ['Explain Node.js event loop', 'Give an Express middleware example', 'Ask a Backend interview question', 'Explain JWT security']
    : [
        'Explain this concept simply',
        'Give another practical example',
        'What are real-world use cases?',
        'Top interview questions'
      ]

  const handleSendPrompt = async (textToSend) => {
    const prompt = textToSend || inputPrompt
    if (!prompt.trim() || loading) return

    setErrorMsg(null)
    setLastFailedPrompt(null)

    const updatedMessages = [...messages, { sender: 'user', text: prompt }]
    setMessages(updatedMessages)
    setInputPrompt('')
    setLoading(true)

    try {
      if (onAskAI) {
        // Pass session chat history (excluding default welcome message) for conversational context
        const chatHistory = updatedMessages.slice(1).map(m => ({ sender: m.sender, text: m.text }))
        const res = await onAskAI(prompt, chatHistory)
        if (res?.answer) {
          setMessages(prev => [...prev, { sender: 'ai', text: res.answer }])
          return
        }
      }
      setMessages(prev => [...prev, { sender: 'ai', text: `Key concept of ${lessonTitle}: software patterns ensure maintainable, high-performance architecture.` }])
    } catch (err) {
      setLastFailedPrompt(prompt)
      setErrorMsg("ZenScore AI couldn't respond right now. Retry.")
      setMessages(prev => [...prev, { sender: 'ai', text: `⚠️ ${err.message || "ZenScore AI couldn't respond right now. Retry."}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      {/* Click outside to close backdrop */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Content */}
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-slide-left">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-sora text-sm font-bold text-slate-900">
                ZenScore AI Tutor
              </h3>
              <p className="text-[11px] text-slate-500 font-medium truncate max-w-[240px]">
                {skillTitle} • {lessonTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Question Chips */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-100 bg-white">
          <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Quick Prompts
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendPrompt(qp)}
                className="px-2.5 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200/70 text-[11px] font-semibold transition-all cursor-pointer"
              >
                + {qp}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-slate-50/30">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 text-xs ${
                msg.sender === 'user' ? 'justify-end' : ''
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white font-medium rounded-tr-none shadow-sm'
                    : 'bg-white text-slate-800 rounded-tl-none font-normal border border-slate-200/80 shadow-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-purple-600 font-semibold p-2 bg-purple-50 rounded-xl w-fit">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>ZenScore AI is thinking...</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </span>
              {lastFailedPrompt && (
                <button
                  type="button"
                  onClick={() => handleSendPrompt(lastFailedPrompt)}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10.5px] hover:bg-rose-700 cursor-pointer"
                >
                  Retry
                </button>
              )}
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendPrompt()
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={`Ask about ${lessonTitle || 'this lesson'}...`}
              className="flex-1 h-10 px-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 text-slate-900 placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || loading}
              className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-sm shadow-purple-600/25"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
