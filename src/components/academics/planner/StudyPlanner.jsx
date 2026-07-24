/**
 * StudyPlanner.jsx
 *
 * Orchestrator for the AI Study Planner & Academic Workspace (Phase 4 UI Revamp).
 * Manages daily task completion state, weekly hours, and coordinates all sub-components.
 *
 * Spacing and visual design align perfectly with the ZenScore premium dashboard.
 */
import React, { useState } from 'react'
import DailyTimeline from './DailyTimeline'
import WeeklyProgress from './WeeklyProgress'
import UpcomingExams from './UpcomingExams'
import AISuggestions from './AISuggestions'
import ProductivitySummary from './ProductivitySummary'

// ─── Mock Data ──────────────────────────────────────────────────────────────

const INITIAL_TASKS = [
  { id: 1, time: '09:00 - 10:00', subject: 'Database Systems', duration: 'DBMS Indexing & B-Trees', priority: 'High', icon: '💾', completed: false },
  { id: 2, time: '10:30 - 11:30', subject: 'Data Structures & Algorithms', duration: 'Graph Traversals (BFS/DFS)', priority: 'High', icon: '🧠', completed: true },
  { id: 3, time: '14:00 - 15:00', subject: 'Operating Systems', duration: 'CPU Scheduling Algorithms', priority: 'Medium', icon: '💻', completed: false },
  { id: 4, time: '17:00 - 18:00', subject: 'Artificial Intelligence', duration: 'AI Mock Quiz Practice', priority: 'Low', icon: '✨', completed: false },
]

const INITIAL_EXAMS = [
  { subject: 'Database Systems', date: 'Oct 24, 2026', daysLeft: 3, status: 'Critical', icon: '💾', action: 'Start Revision' },
  { subject: 'Operating Systems', date: 'Oct 28, 2026', daysLeft: 7, status: 'Average', icon: '💻', action: 'Continue' },
  { subject: 'Data Structures', date: 'Nov 04, 2026', daysLeft: 14, status: 'Good', icon: '🧠', action: 'View Plan' },
  { subject: 'Web Technologies', date: 'Nov 12, 2026', daysLeft: 22, status: 'Excellent', icon: '🌐', action: 'View Plan' },
]

const INITIAL_SUGGESTIONS = [
  { icon: '💾', title: 'Revise DBMS Today', explanation: 'Your DB mock grades are 15% below target. Review normalization principles.', priority: 'High' },
  { icon: '📝', title: 'Practice Previous Papers', explanation: 'OS exam pattern has shifted. Solve 2024 and 2025 question sheets.', priority: 'Medium' },
  { icon: '📅', title: 'Increase Attendance', explanation: 'Graph Theory attendance is currently at 68%. Attend next two classes to avoid penalty.', priority: 'High' },
  { icon: '🧠', title: 'Complete DSA Assignment', explanation: 'Heap Trees lab submission deadline is in 24 hours.', priority: 'High' },
]

const INITIAL_WEEKLY_HOURS = [
  { day: 'Mon', hours: 3.5 },
  { day: 'Tue', hours: 4.2 },
  { day: 'Wed', hours: 2.8 },
  { day: 'Thu', hours: 4.0 },
  { day: 'Fri', hours: 1.5 },
  { day: 'Sat', hours: 0 },
  { day: 'Sun', hours: 0 },
]

export default function StudyPlanner() {
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [exams] = useState(INITIAL_EXAMS)
  const [suggestions] = useState(INITIAL_SUGGESTIONS)
  const [weekData, setWeekData] = useState(INITIAL_WEEKLY_HOURS)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Toggle Task Completion State & Update Productivity Summary Stats
  const handleToggleTask = (taskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const nextCompleted = !task.completed
          // Dynamically adjust today's hours on completion to show reactive interface
          if (nextCompleted) {
            adjustTodayHours(1)
          } else {
            adjustTodayHours(-1)
          }
          return { ...task, completed: nextCompleted }
        }
        return task
      })
    )
  }

  const adjustTodayHours = (delta) => {
    // Current day Mon-Sun index
    const d = new Date().getDay()
    const todayIdx = d === 0 ? 6 : d - 1
    setWeekData(prev =>
      prev.map((day, idx) => {
        if (idx === todayIdx) {
          return { ...day, hours: Math.max(0, parseFloat((day.hours + delta * 0.75).toFixed(1))) }
        }
        return day
      })
    )
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 800)
  }

  // Calculate dynamic stats
  const completedCount = tasks.filter(t => t.completed).length
  const pendingCount = tasks.filter(t => !t.completed).length
  const todayHours = weekData[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]?.hours ?? 0

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      {/* ─── Header ─── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginTop: 8,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>📖</span>
            <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 800, color: '#1E293B', margin: 0 }}>
              AI Study Planner
            </h3>
          </div>
          <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500, marginTop: 4 }}>
            Your personalized roadmap generated from your academic performance.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              border: '1px solid #E2E8F0',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(15,23,42,0.03)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#C7D2FE'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748B"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transition: 'transform 0.5s ease',
                transform: isRefreshing ? 'rotate(360deg)' : 'none',
              }}
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
          </button>

          {/* Generate Button */}
          <button
            onClick={handleRefresh}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'Sora, sans-serif',
              boxShadow: '0 4px 12px rgba(124,58,237,0.15)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.95'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Generate New Plan
          </button>
        </div>
      </div>

      {/* ─── Productivity KPI Cards ─── */}
      <ProductivitySummary
        data={{
          studyHours: todayHours,
          completedTasks: completedCount,
          pendingTasks: pendingCount,
          weeklyProductivity: Math.round(((completedCount + 2) / (tasks.length + 2)) * 100),
        }}
      />

      {/* ─── Middle Section: Split Column Grid (Desktop timeline/exams, Tablet/Mobile stack) ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 24,
        }}
      >
        {/* Today's Study Plan (Timeline) */}
        <div
          style={{
            background: '#fff',
            borderRadius: 24,
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
            padding: '24px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1E293B', fontFamily: 'Sora, sans-serif' }}>
              Today's Study Plan
            </div>
            <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, marginTop: 2 }}>
              Hourly milestones tailored to target core improvement subjects.
            </div>
          </div>

          <DailyTimeline tasks={tasks} onToggleTask={handleToggleTask} />
        </div>

        {/* Upcoming Exams + Weekly tracker stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Weekly Progress Tracker Card */}
          <div
            style={{
              background: '#fff',
              borderRadius: 24,
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
              padding: '24px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#1E293B', fontFamily: 'Sora, sans-serif' }}>
                Weekly Progress
              </div>
              <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, marginTop: 2 }}>
                Monitor your daily performance versus targeted study milestones.
              </div>
            </div>

            <WeeklyProgress weekData={weekData} />
          </div>

          {/* Upcoming Exams Card */}
          <div
            style={{
              background: '#fff',
              borderRadius: 24,
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
              padding: '24px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              flex: 1,
            }}
          >
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#1E293B', fontFamily: 'Sora, sans-serif' }}>
                Upcoming Exams
              </div>
              <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, marginTop: 2 }}>
                Track evaluation dates and preparation quality standings.
              </div>
            </div>

            <UpcomingExams exams={exams} />
          </div>
        </div>
      </div>

      {/* ─── Bottom: AI Suggestions Recommendation Grid ─── */}
      <div
        style={{
          background: '#fff',
          borderRadius: 24,
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#1E293B', fontFamily: 'Sora, sans-serif' }}>
            AI Planner Suggestions
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, marginTop: 2 }}>
            Smart suggestions to optimize learning efficiency and boost target standing scores.
          </div>
        </div>

        <AISuggestions suggestions={suggestions} />
      </div>
    </div>
  )
}
