import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Bot, Sparkles, AlertTriangle } from 'lucide-react'

import CoachAssessmentCard from './CoachAssessmentCard'
import StrengthCard from './StrengthCard'
import WeaknessCard from './WeaknessCard'
import AdviceCard from './AdviceCard'
import WeeklyGoalCard from './WeeklyGoalCard'
import BurnoutCoachCard from './BurnoutCoachCard'
import CareerCoachCard from './CareerCoachCard'
import MotivationCard from './MotivationCard'
import NextMissionCard from './NextMissionCard'
import FocusEmptyState from '../FocusEmptyState'

import {
  getAIProductivityCoachData,
  invalidateCoachCache
} from '../../../services/productivity/productivityCoachService'

export default function AIProductivityCoach({ onStartFirstSession }) {
  const [coachResult, setCoachResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchCoachData = async (forceRefresh = false) => {
    if (forceRefresh) setRefreshing(true)
    else setLoading(true)

    const res = await getAIProductivityCoachData(forceRefresh)
    setCoachResult(res)
    setLoading(false)
    setRefreshing(false)
  }

  useEffect(() => {
    fetchCoachData(false)

    // Auto-update when FOCUS_SESSION_COMPLETED fires
    const handleSessionCompletedEvent = () => {
      invalidateCoachCache()
      fetchCoachData(true)
    }

    window.addEventListener('FOCUS_SESSION_COMPLETED', handleSessionCompletedEvent)
    return () => {
      window.removeEventListener('FOCUS_SESSION_COMPLETED', handleSessionCompletedEvent)
    }
  }, [])

  const handleManualRefresh = () => {
    invalidateCoachCache()
    fetchCoachData(true)
  }

  // 1. Loading Skeleton State
  if (loading) {
    return (
      <div style={{ padding: '20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: '#E2E8F0', animation: 'pulse 1.5s infinite' }} />
          <div>
            <div style={{ width: 220, height: 24, background: '#E2E8F0', borderRadius: 6, marginBottom: 6 }} />
            <div style={{ width: 300, height: 16, background: '#F1F5F9', borderRadius: 4 }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          <div style={{ height: 180, background: '#FFFFFF', borderRadius: 20, border: '1px solid #E2E8F0', padding: 20 }}>
            <div style={{ width: '60%', height: 20, background: '#F1F5F9', borderRadius: 6, marginBottom: 16 }} />
            <div style={{ width: '100%', height: 14, background: '#F8FAFC', borderRadius: 4, marginBottom: 8 }} />
            <div style={{ width: '90%', height: 14, background: '#F8FAFC', borderRadius: 4 }} />
          </div>
          <div style={{ height: 180, background: '#FFFFFF', borderRadius: 20, border: '1px solid #E2E8F0', padding: 20 }}>
            <div style={{ width: '50%', height: 20, background: '#F1F5F9', borderRadius: 6, marginBottom: 16 }} />
            <div style={{ width: '100%', height: 14, background: '#F8FAFC', borderRadius: 4, marginBottom: 8 }} />
            <div style={{ width: '80%', height: 14, background: '#F8FAFC', borderRadius: 4 }} />
          </div>
        </div>
      </div>
    )
  }

  // 2. Empty State
  if (!coachResult || !coachResult.hasData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <FocusEmptyState
          onStartFirstSession={onStartFirstSession}
          icon="👋"
          title="Welcome!"
          subtitle="I don't have enough activity to coach you yet. Complete 3 focus sessions and I'll start giving personalized study recommendations."
        />
      </motion.div>
    )
  }

  const coach = coachResult.data || {}

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: 24,
              fontWeight: 800,
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              margin: 0
            }}
          >
            <span>🤖 AI Productivity Coach</span>
            {coachResult.isFallback && (
              <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 12, background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A', fontWeight: 700 }}>
                Deterministic Mode
              </span>
            )}
          </h2>
          <p style={{ fontSize: 14, color: '#64748B', marginTop: 4, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
            Your personal productivity mentor.
          </p>
        </div>

        <button
          onClick={handleManualRefresh}
          disabled={refreshing}
          style={{
            height: 40,
            padding: '0 18px',
            borderRadius: 12,
            border: '1.5px solid #CBD5E1',
            background: '#FFFFFF',
            color: '#475569',
            cursor: refreshing ? 'not-allowed' : 'pointer',
            fontFamily: 'Sora, sans-serif',
            fontWeight: 700,
            fontSize: 13,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            opacity: refreshing ? 0.6 : 1
          }}
        >
          <RefreshCw size={15} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          <span>{refreshing ? 'Analyzing...' : 'Regenerate Coaching'}</span>
        </button>
      </div>

      {/* SECTION 9: Next Mission Task CTA */}
      <NextMissionCard nextMission={coach.nextMission} onStartMission={onStartFirstSession} />

      {/* SECTION 8: Progress-aware Motivation Banner */}
      <MotivationCard motivation={coach.motivation} />

      {/* SECTION 1: Overall Assessment */}
      <CoachAssessmentCard assessment={coach.overallAssessment} />

      {/* SECTIONS 2 & 3: Strengths & Weaknesses Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 24 }}>
        <StrengthCard strengths={coach.strengths || []} />
        <WeaknessCard weaknesses={coach.weaknesses || []} />
      </div>

      {/* SECTIONS 4 & 5: Today's Advice & Weekly Goal Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 24 }}>
        <AdviceCard advice={coach.dailyAdvice} />
        <WeeklyGoalCard goal={coach.weeklyGoal} />
      </div>

      {/* SECTIONS 6 & 7: Burnout Coach & Career Recommendation Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        <BurnoutCoachCard advice={coach.burnoutAdvice} risk={coach.burnoutRisk || 'Low'} />
        <CareerCoachCard careerSuggestion={coach.careerSuggestion} career={coach.career || 'Backend Engineer'} />
      </div>
    </motion.div>
  )
}
