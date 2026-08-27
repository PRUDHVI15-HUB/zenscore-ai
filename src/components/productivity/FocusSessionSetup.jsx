import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Sparkles, BookOpen, Clock, Target, Layers } from 'lucide-react'

const MODULE_OPTIONS = [
  'Courses',
  'DSA',
  'Roadmap',
  'Resume',
  'Interview',
  'Academics',
  'Project',
  'Other'
]

const DURATION_PRESETS = [
  { label: '25 Min', minutes: 25 },
  { label: '45 Min', minutes: 45 },
  { label: '60 Min', minutes: 60 },
  { label: '90 Min', minutes: 90 },
  { label: 'Custom', minutes: 'custom' }
]

const EXAMPLE_TOPICS = [
  'Spring Boot REST APIs',
  'DSA Arrays',
  'Operating Systems',
  'Computer Networks',
  'Resume Building',
  'Interview Preparation',
  'Project Development'
]

const EXAMPLE_GOALS = [
  'Finish Lesson 4',
  'Solve 5 Problems',
  'Revise Unit 2',
  'Complete Assignment'
]

export default function FocusSessionSetup({ onStartSession, isFirstSession = false }) {
  const [topic, setTopic] = useState('')
  const [moduleCategory, setModuleCategory] = useState('Courses')
  const [selectedDurationOption, setSelectedDurationOption] = useState(25)
  const [customMinutes, setCustomMinutes] = useState(30)
  const [goal, setGoal] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handlePresetSelect = (preset) => {
    setSelectedDurationOption(preset.minutes)
    if (preset.minutes !== 'custom') {
      setErrorMsg('')
    }
  }

  const getEffectiveMinutes = () => {
    if (selectedDurationOption === 'custom') {
      const parsed = parseInt(customMinutes, 10)
      if (isNaN(parsed)) return 25
      return Math.max(10, Math.min(180, parsed))
    }
    return selectedDurationOption
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!topic.trim()) {
      setErrorMsg('Please enter a study topic to begin your session.')
      return
    }

    const minutes = getEffectiveMinutes()
    if (selectedDurationOption === 'custom' && (customMinutes < 10 || customMinutes > 180)) {
      setErrorMsg('Custom duration must be between 10 and 180 minutes.')
      return
    }

    setErrorMsg('')
    onStartSession({
      topic: topic.trim(),
      category: moduleCategory,
      plannedMinutes: minutes,
      goal: goal.trim()
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="focus-setup-card"
      style={{
        background: '#FFFFFF',
        borderRadius: 24,
        padding: '36px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 8px 30px rgba(15, 23, 42, 0.04)',
        maxWidth: 720,
        margin: '0 auto'
      }}
    >
      {/* Brand New Student Empty State Banner */}
      {isFirstSession && (
        <div style={{ background: '#F8FAFC', borderRadius: 16, padding: '16px 20px', border: '1px solid #E2E8F0', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
            🧠
          </div>
          <div>
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 800, color: '#0F172A' }}>
              No focus sessions yet
            </div>
            <div style={{ fontSize: 12.5, color: '#64748B', fontFamily: 'DM Sans, sans-serif', marginTop: 2 }}>
              Start your first study session to begin tracking your productivity.
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 6px 16px rgba(124, 58, 237, 0.25)'
          }}
        >
          <BookOpen size={22} strokeWidth={2.2} />
        </div>
        <div>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Focus Session Setup
          </h2>
          <p style={{ fontSize: 13.5, color: '#64748B', marginTop: 3, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
            Configure your target topic, module, and duration to launch a distraction-free study sprint
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* 1. STUDY TOPIC */}
        <div>
          <label style={{ display: 'block', fontFamily: 'Sora, sans-serif', fontSize: 13.5, fontWeight: 700, color: '#1E293B', marginBottom: 8 }}>
            Study Topic <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <input
            type="text"
            placeholder="What are you studying today?"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value)
              if (errorMsg) setErrorMsg('')
            }}
            style={{
              width: '100%',
              height: 46,
              padding: '0 16px',
              borderRadius: 12,
              border: errorMsg ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
              background: '#F8FAFC',
              fontSize: 14,
              fontFamily: 'DM Sans, sans-serif',
              color: '#0F172A',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
          />

          {/* Topic Suggestion Quick Pills */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
            <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600, alignSelf: 'center', marginRight: 4 }}>
              Examples:
            </span>
            {EXAMPLE_TOPICS.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => {
                  setTopic(ex)
                  if (errorMsg) setErrorMsg('')
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: 16,
                  border: '1px solid #E2E8F0',
                  background: topic === ex ? '#F3E8FF' : '#F1F5F9',
                  color: topic === ex ? '#7C3AED' : '#475569',
                  fontSize: 11.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'all 0.15s ease'
                }}
              >
                + {ex}
              </button>
            ))}
          </div>
        </div>

        {/* 2. STUDY MODULE (DROPDOWN) */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Sora, sans-serif', fontSize: 13.5, fontWeight: 700, color: '#1E293B', marginBottom: 8 }}>
            <Layers size={15} style={{ color: '#7C3AED' }} />
            <span>Study Module</span>
          </label>
          <select
            value={moduleCategory}
            onChange={(e) => setModuleCategory(e.target.value)}
            style={{
              width: '100%',
              height: 46,
              padding: '0 16px',
              borderRadius: 12,
              border: '1.5px solid #CBD5E1',
              background: '#F8FAFC',
              fontSize: 14,
              fontFamily: 'DM Sans, sans-serif',
              color: '#0F172A',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {MODULE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* 3. STUDY DURATION */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Sora, sans-serif', fontSize: 13.5, fontWeight: 700, color: '#1E293B', marginBottom: 10 }}>
            <Clock size={15} style={{ color: '#7C3AED' }} />
            <span>Study Duration</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 10 }}>
            {DURATION_PRESETS.map((preset) => {
              const isSelected = selectedDurationOption === preset.minutes
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  style={{
                    height: 44,
                    padding: '0 12px',
                    borderRadius: 12,
                    border: isSelected ? '2px solid #7C3AED' : '1px solid #E2E8F0',
                    background: isSelected ? '#F3E8FF' : '#F8FAFC',
                    color: isSelected ? '#7C3AED' : '#475569',
                    fontFamily: 'Sora, sans-serif',
                    fontWeight: isSelected ? 700 : 600,
                    fontSize: 13,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 2px 8px rgba(124, 58, 237, 0.15)' : 'none'
                  }}
                >
                  {preset.label}
                </button>
              )
            })}
          </div>

          {/* Custom Duration Range / Input */}
          {selectedDurationOption === 'custom' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{ marginTop: 14, background: '#F5F3FF', padding: 16, borderRadius: 14, border: '1px solid #DDD6FE' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: '#6D28D9', fontFamily: 'Sora, sans-serif' }}>
                  Custom Duration (Minutes):
                </span>
                <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#7C3AED' }}>
                  {customMinutes} Mins
                </span>
              </div>
              <input
                type="number"
                min="10"
                max="180"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                style={{
                  width: '100%',
                  height: 42,
                  padding: '0 14px',
                  borderRadius: 10,
                  border: '1.5px solid #C7D2FE',
                  background: '#FFFFFF',
                  fontSize: 14,
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: 700,
                  outline: 'none'
                }}
              />
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
                <span>Min: 10 mins</span>
                <span>Max: 180 mins</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* 4. OPTIONAL GOAL */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Sora, sans-serif', fontSize: 13.5, fontWeight: 700, color: '#1E293B', marginBottom: 8 }}>
            <Target size={15} style={{ color: '#7C3AED' }} />
            <span>Optional Goal</span>
          </label>
          <textarea
            placeholder="Set an optional goal for this session..."
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows={2}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 12,
              border: '1.5px solid #CBD5E1',
              background: '#F8FAFC',
              fontSize: 13.5,
              fontFamily: 'DM Sans, sans-serif',
              color: '#0F172A',
              outline: 'none',
              resize: 'vertical'
            }}
          />

          {/* Goal Examples */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
            <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600, alignSelf: 'center', marginRight: 4 }}>
              Examples:
            </span>
            {EXAMPLE_GOALS.map((eg) => (
              <button
                key={eg}
                type="button"
                onClick={() => setGoal(eg)}
                style={{
                  padding: '3px 8px',
                  borderRadius: 14,
                  border: '1px solid #E2E8F0',
                  background: '#F1F5F9',
                  color: '#475569',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {eg}
              </button>
            ))}
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {errorMsg && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#DC2626',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'DM Sans, sans-serif'
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        {/* 5. PRIMARY BUTTON */}
        <motion.button
          whileHover={{ scale: 1.01, translateY: -1 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          style={{
            height: 48,
            width: '100%',
            borderRadius: 14,
            background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
            color: '#FFFFFF',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Sora, sans-serif',
            fontWeight: 800,
            fontSize: 15,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            boxShadow: '0 6px 20px rgba(124, 58, 237, 0.3)',
            marginTop: 8
          }}
        >
          <Play size={18} fill="#FFFFFF" />
          <span>Start Focus Session ({getEffectiveMinutes()} Mins)</span>
        </motion.button>
      </form>

      <style>{`
        @media (max-width: 640px) {
          .focus-setup-card {
            padding: 20px 16px !important;
            border-radius: 18px !important;
          }
        }
      `}</style>
    </motion.div>
  )
}
