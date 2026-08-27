import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import HealthSummaryCards from './HealthSummaryCards'
import HealthScoreGauge from './HealthScoreGauge'
import BurnoutCard from './BurnoutCard'
import ConsistencyCard from './ConsistencyCard'
import RecoveryCard from './RecoveryCard'
import StudyBalanceCard from './StudyBalanceCard'
import HealthTimelineChart from './HealthTimelineChart'
import AchievementsCard from './AchievementsCard'
import RecommendationsCard from './RecommendationsCard'
import FocusEmptyState from '../FocusEmptyState'

import { getFocusHealthData } from '../../../services/productivity/focusHealthService'

export default function FocusHealth({ onStartFirstSession }) {
  const [healthData, setHealthData] = useState(null)

  const loadHealthData = () => {
    const data = getFocusHealthData()
    setHealthData(data)
  }

  useEffect(() => {
    loadHealthData()

    // Auto Update when FOCUS_SESSION_COMPLETED event is fired
    const handleSessionCompletedEvent = () => {
      loadHealthData()
    }

    window.addEventListener('FOCUS_SESSION_COMPLETED', handleSessionCompletedEvent)
    return () => {
      window.removeEventListener('FOCUS_SESSION_COMPLETED', handleSessionCompletedEvent)
    }
  }, [])

  if (!healthData || !healthData.hasData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <FocusEmptyState
          onStartFirstSession={onStartFirstSession}
          icon="💚"
          title="Focus Health: Not enough data"
          subtitle="Start using Focus Sessions for a few days to receive your health analysis."
        />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Page Header */}
      <div style={{ marginBottom: 28 }}>
        <h2
          style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: 24,
            fontWeight: 800,
            color: '#0F172A',
            margin: 0
          }}
        >
          💚 Focus Health
        </h2>
        <p style={{ fontSize: 14, color: '#64748B', marginTop: 4, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
          Maintain healthy study habits while maximizing productivity.
        </p>
      </div>

      {/* 1. Health Summary Cards */}
      <HealthSummaryCards data={healthData} />

      {/* 2. Top Metrics Grid: Health Score Gauge, Burnout Risk, Consistency Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 24 }}>
        <HealthScoreGauge score={healthData.healthScore} tier={healthData.healthTier} color={healthData.healthColor} />
        <BurnoutCard risk={healthData.burnoutRisk} color={healthData.burnoutColor} bg={healthData.burnoutBg} longestSession={healthData.longestSession} />
        <ConsistencyCard
          score={healthData.consistencyScore}
          currentStreak={healthData.currentStreak}
          bestStreak={healthData.bestStreak}
          studyDaysThisWeek={healthData.studyDaysThisWeek}
          completionRate={healthData.completionRate}
        />
      </div>

      {/* 3. Recovery & Study Balance Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 24 }}>
        <RecoveryCard score={healthData.recoveryScore} pausedSessions={healthData.pausedSessions} avgMinutes={healthData.avgMinutes} />
        <StudyBalanceCard studyBalance={healthData.studyBalance} skewedCategory={healthData.skewedCategory} />
      </div>

      {/* 4. Health & Consistency Timeline Chart (Last 30 Days) */}
      <HealthTimelineChart data={healthData.healthTimeline} />

      {/* 5. Achievements & Recommendations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        <AchievementsCard achievements={healthData.achievements} />
        <RecommendationsCard recommendations={healthData.recommendations} />
      </div>
    </motion.div>
  )
}
