import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Square, Sparkles, BookOpen, Layers, Target, CheckCircle2 } from 'lucide-react'

export default function FocusTimer({ sessionSetup, onCompleteSession, onCancelSession }) {
  const { topic, category, plannedMinutes, goal } = sessionSetup
  const totalSeconds = plannedMinutes * 60

  const [timeLeft, setTimeLeft] = useState(totalSeconds)
  const [sessionState, setSessionState] = useState('running') // 'idle' | 'running' | 'paused' | 'completed'
  const [startTime] = useState(new Date().toISOString())
  const [totalPausedSeconds, setTotalPausedSeconds] = useState(0)

  const timerRef = useRef(null)

  // Timer countdown effect
  useEffect(() => {
    if (sessionState === 'running') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            setSessionState('completed')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }

    return () => clearInterval(timerRef.current)
  }, [sessionState])

  // Automatically trigger completion handler when timer reaches 0
  useEffect(() => {
    if (sessionState === 'completed') {
      const elapsedSeconds = totalSeconds - timeLeft
      const actualMins = Math.max(1, Math.round((elapsedSeconds / 60) * 10) / 10)
      onCompleteSession({
        topic,
        category,
        goal,
        plannedMinutes,
        actualMinutes: actualMins,
        startTime,
        endTime: new Date().toISOString(),
        completed: true,
        paused: totalPausedSeconds > 0
      })
    }
  }, [sessionState])

  const togglePauseResume = () => {
    if (sessionState === 'running') {
      setSessionState('paused')
    } else if (sessionState === 'paused' || sessionState === 'idle') {
      setSessionState('running')
    }
  }

  const handleReset = () => {
    setSessionState('idle')
    setTimeLeft(totalSeconds)
  }

  const handleEndSessionEarly = () => {
    const elapsedSeconds = totalSeconds - timeLeft
    const actualMins = Math.max(1, Math.round((elapsedSeconds / 60) * 10) / 10)

    setSessionState('completed')
    onCompleteSession({
      topic,
      category,
      goal,
      plannedMinutes,
      actualMinutes: actualMins,
      startTime,
      endTime: new Date().toISOString(),
      completed: elapsedSeconds >= totalSeconds,
      paused: totalPausedSeconds > 0
    })
  }

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const progressPct = ((totalSeconds - timeLeft) / totalSeconds) * 100

  // Status Badge Label & Color Map
  const statusStyles = {
    running: { label: 'RUNNING', bg: '#F0FDF4', color: '#166534', border: '#BBF7D0' },
    paused: { label: 'PAUSED', bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
    idle: { label: 'IDLE', bg: '#F1F5F9', color: '#475569', border: '#CBD5E1' },
    completed: { label: 'COMPLETED', bg: '#F3E8FF', color: '#7C3AED', border: '#DDD6FE' }
  }

  const currentStatus = statusStyles[sessionState] || statusStyles.running

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: '#FFFFFF',
        borderRadius: 24,
        padding: '36px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 8px 30px rgba(15, 23, 42, 0.04)',
        maxWidth: 720,
        margin: '0 auto',
        textAlign: 'center'
      }}
    >
      {/* Session Header Badges */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ padding: '5px 12px', borderRadius: 20, background: '#F3E8FF', color: '#7C3AED', fontSize: 12, fontWeight: 700, fontFamily: 'Sora, sans-serif' }}>
            {category}
          </span>
          <span style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>
            {plannedMinutes} Mins Session
          </span>
        </div>

        {/* State Indicator Badge */}
        <span
          style={{
            padding: '5px 14px',
            borderRadius: 20,
            background: currentStatus.bg,
            color: currentStatus.color,
            border: `1px solid ${currentStatus.border}`,
            fontSize: 11.5,
            fontWeight: 800,
            letterSpacing: '0.05em',
            fontFamily: 'Sora, sans-serif'
          }}
        >
          ● {currentStatus.label}
        </span>
      </div>

      {/* Topic Title & Optional Goal */}
      <h2
        style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: 'clamp(20px, 2.5vw, 26px)',
          fontWeight: 800,
          color: '#0F172A',
          marginBottom: 8,
          lineHeight: 1.3
        }}
      >
        {topic}
      </h2>

      {goal && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 16px',
            borderRadius: 20,
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            color: '#475569',
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 24,
            maxWidth: 500
          }}
        >
          <Target size={14} style={{ color: '#7C3AED' }} />
          <span>Goal: {goal}</span>
        </div>
      )}

      {/* Radial Countdown Timer */}
      <div style={{ position: 'relative', width: 250, height: 250, margin: '20px auto 32px' }}>
        <svg width="250" height="250" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="125" cy="125" r="110" fill="none" stroke="#F1F5F9" strokeWidth="12" />
          <circle
            cx="125"
            cy="125"
            r="110"
            fill="none"
            stroke="url(#focusTimerGradient)"
            strokeWidth="12"
            strokeDasharray={`${2 * Math.PI * 110}`}
            strokeDashoffset={`${2 * Math.PI * 110 * (1 - progressPct / 100)}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
          <defs>
            <linearGradient id="focusTimerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>

        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
          <div
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: plannedMinutes > 60 ? 40 : 46,
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-1.5px',
              lineHeight: 1
            }}
          >
            {formatTime(timeLeft)}
          </div>
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {sessionState === 'paused' ? 'Paused' : sessionState === 'idle' ? 'Ready' : 'Remaining'}
          </div>
        </div>
      </div>

      {/* Action Buttons: Pause / Resume, End Session, Reset */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        {/* Pause / Resume */}
        <button
          onClick={togglePauseResume}
          style={{
            height: 46,
            padding: '0 24px',
            borderRadius: 12,
            background: sessionState === 'paused' ? '#059669' : 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
            color: '#FFFFFF',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Sora, sans-serif',
            fontWeight: 700,
            fontSize: 14,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 14px rgba(124, 58, 237, 0.25)'
          }}
        >
          {sessionState === 'paused' ? (
            <>
              <Play size={18} fill="#FFFFFF" />
              <span>Resume Session</span>
            </>
          ) : (
            <>
              <Pause size={18} />
              <span>Pause</span>
            </>
          )}
        </button>

        {/* End Session */}
        <button
          onClick={handleEndSessionEarly}
          style={{
            height: 46,
            padding: '0 20px',
            borderRadius: 12,
            background: '#FEF2F2',
            color: '#DC2626',
            border: '1.5px solid #FCA5A5',
            cursor: 'pointer',
            fontFamily: 'Sora, sans-serif',
            fontWeight: 700,
            fontSize: 13.5,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <Square size={16} fill="#DC2626" />
          <span>End Session</span>
        </button>

        {/* Reset */}
        <button
          onClick={handleReset}
          style={{
            height: 46,
            padding: '0 18px',
            borderRadius: 12,
            background: '#FFFFFF',
            color: '#475569',
            border: '1.5px solid #CBD5E1',
            cursor: 'pointer',
            fontFamily: 'Sora, sans-serif',
            fontWeight: 600,
            fontSize: 13.5,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>
      </div>
    </motion.div>
  )
}
