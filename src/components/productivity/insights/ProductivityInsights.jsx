import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, BarChart3, TrendingUp, Sparkles } from 'lucide-react'

import InsightsSummaryCards from './InsightsSummaryCards'
import WeeklyFocusChart from './WeeklyFocusChart'
import FocusTrendChart from './FocusTrendChart'
import ModuleDistributionChart from './ModuleDistributionChart'
import DurationDistributionChart from './DurationDistributionChart'
import StudyHeatmap from './StudyHeatmap'
import TimeAnalysisCard from './TimeAnalysisCard'
import MonthlyComparisonCard from './MonthlyComparisonCard'
import PersonalInsightsCard from './PersonalInsightsCard'
import ProductivityScoreCard from './ProductivityScoreCard'
import FocusEmptyState from '../FocusEmptyState'

import {
  getAnalyticsData,
  exportAnalyticsCSV
} from '../../../services/productivity/productivityAnalyticsService'

export default function ProductivityInsights({ onStartFirstSession }) {
  const [analytics, setAnalytics] = useState(null)

  const loadAnalytics = () => {
    const data = getAnalyticsData()
    setAnalytics(data)
  }

  useEffect(() => {
    loadAnalytics()

    // Auto Update when FOCUS_SESSION_COMPLETED is published
    const handleSessionCompletedEvent = () => {
      loadAnalytics()
    }

    window.addEventListener('FOCUS_SESSION_COMPLETED', handleSessionCompletedEvent)
    return () => {
      window.removeEventListener('FOCUS_SESSION_COMPLETED', handleSessionCompletedEvent)
    }
  }, [])

  if (!analytics || !analytics.hasData || analytics.summaryMetrics?.totalSessions === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <FocusEmptyState
          onStartFirstSession={onStartFirstSession}
          icon="📈"
          title="No Productivity Data Yet"
          subtitle="Complete a few focus sessions to unlock personalized productivity insights."
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
            <span>📈 Productivity Insights</span>
          </h2>
          <p style={{ fontSize: 14, color: '#64748B', marginTop: 4, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
            Analyze your study habits and improve your productivity.
          </p>
        </div>

        {/* CSV Export Button */}
        <button
          onClick={() => exportAnalyticsCSV(analytics)}
          style={{
            height: 40,
            padding: '0 18px',
            borderRadius: 12,
            border: '1.5px solid #CBD5E1',
            background: '#FFFFFF',
            color: '#475569',
            cursor: 'pointer',
            fontFamily: 'Sora, sans-serif',
            fontWeight: 700,
            fontSize: 13,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
          }}
        >
          <Download size={16} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* 1. Summary Cards */}
      <InsightsSummaryCards metrics={analytics.summaryMetrics} />

      {/* 2. Charts Row 1: Weekly Focus Bar Chart & Daily Focus Trend Line Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 24 }}>
        <WeeklyFocusChart data={analytics.weeklyFocusChart} />
        <FocusTrendChart data={analytics.dailyFocusTrend} />
      </div>

      {/* 3. Charts Row 2: Module Distribution Pie Chart & Duration Distribution Horizontal Bar Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 24 }}>
        <ModuleDistributionChart data={analytics.moduleDistribution} />
        <DurationDistributionChart data={analytics.durationDistribution} />
      </div>

      {/* 4. GitHub-style Study Activity Heatmap */}
      <StudyHeatmap heatmapData={analytics.studyHeatmap} />

      {/* 5. Score, Time, Monthly & Personal Takeaways Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
        <ProductivityScoreCard score={analytics.productivityScore} tier={analytics.scoreTier} />
        <TimeAnalysisCard timeAnalysis={analytics.timeAnalysis} />
        <MonthlyComparisonCard monthlyComparison={analytics.monthlyComparison} />
        <PersonalInsightsCard insights={analytics.personalInsights} />
      </div>
    </motion.div>
  )
}
