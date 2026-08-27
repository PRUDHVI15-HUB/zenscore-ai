import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../context/AuthContext'
import ProductivityHero, { DEFAULT_PRODUCTIVITY_TABS } from '../components/productivity/ProductivityHero'
import FocusSessionEngine from '../components/productivity/FocusSessionEngine'
import { getStoredSessions } from '../utils/focusSessionStorage'

export default function Productivity() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('sessions')
  const [sessionStats, setSessionStats] = useState({ todayHours: '0.0 hrs', count: 0, streakDays: 0 })

  useEffect(() => {
    if (!user) navigate('/')
  }, [user, navigate])

  // Sync session stats for Hero snapshot card strictly from productivity_focus_v1
  useEffect(() => {
    const updateStats = () => {
      const stored = getStoredSessions()
      const todayStr = new Date().toISOString().split('T')[0]
      const todaySessions = stored.filter((s) => (s.date || s.startTime || '').startsWith(todayStr))
      const totalMinutesToday = todaySessions.reduce((sum, s) => sum + (Number(s.actualMinutes) || 0), 0)
      const hours = (totalMinutesToday / 60).toFixed(1)

      // Calculate streak
      const uniqueDates = Array.from(
        new Set(stored.map((s) => (s.date || s.startTime || '').split('T')[0]))
      ).sort()

      let streak = 0
      if (uniqueDates.length > 0) {
        let checkDate = new Date()
        while (true) {
          const dStr = checkDate.toISOString().split('T')[0]
          if (uniqueDates.includes(dStr)) {
            streak++
            checkDate.setDate(checkDate.getDate() - 1)
          } else {
            break
          }
        }
      }

      setSessionStats({
        todayHours: `${hours} hrs`,
        count: todaySessions.length,
        streakDays: streak
      })
    }

    updateStats()

    // Listen for FOCUS_SESSION_COMPLETED event to update stats in real-time
    const handleEvent = () => updateStats()
    window.addEventListener('FOCUS_SESSION_COMPLETED', handleEvent)
    return () => window.removeEventListener('FOCUS_SESSION_COMPLETED', handleEvent)
  }, [])

  return (
    <AppLayout>
      {/* Hero Header Section */}
      <ProductivityHero
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={DEFAULT_PRODUCTIVITY_TABS}
        todayFocusTime={sessionStats.todayHours}
        pomodorosCompleted={sessionStats.count}
        currentStreak={`${sessionStats.streakDays} ${sessionStats.streakDays === 1 ? 'Day' : 'Days'}`}
      />

      {/* Main Focus Session Engine Content Container */}
      <div id="productivity-content-section" className="container" style={{ padding: '32px 24px 60px', margin: '0 auto' }}>
        <FocusSessionEngine activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </AppLayout>
  )
}