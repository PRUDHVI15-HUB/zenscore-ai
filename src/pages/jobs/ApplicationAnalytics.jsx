import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AppLayout from '../../components/AppLayout'
import { useAuth } from '../../context/AuthContext'
import { getApplicationAnalytics } from '../../services/api'
import LoadingSkeleton from '../../components/jobs/listings/LoadingSkeleton'

import {
  TrendingUp, BarChart3, PieChart, Sparkles, Award, Mic, FileText, CheckCircle2,
  Brain, ArrowRight, Zap, Target, BookOpen, Layers, Building2, ShieldCheck
} from 'lucide-react'

import JobsSubNavHeader from '../../components/jobs/navigation/JobsSubNavHeader'

export default function ApplicationAnalyticsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  useEffect(() => {
    if (user) {
      setLoading(true)
      getApplicationAnalytics()
        .then(data => {
          if (data) setAnalytics(data)
        })
        .catch(err => {
          if (err?.name === 'AbortError' || err?.message?.includes('aborted')) return
          console.warn('Could not load application analytics:', err)
        })
        .finally(() => setLoading(false))
    }
  }, [user])

  const overview = analytics?.overview || {
    totalApplications: 0,
    activeApplications: 0,
    interviews: 0,
    offers: 0,
    rejected: 0,
    withdrawn: 0,
    savedJobs: 0
  }

  const successRate = analytics?.successRate || 0
  const averageMatchScore = analytics?.averageMatchScore || 82
  const monthlyData = analytics?.monthlyApplications || []
  const statusBreakdown = analytics?.statusBreakdown || []
  const topCategories = analytics?.topCategories || []
  const topCompanies = analytics?.topCompanies || []
  const recommendedSkills = analytics?.recommendedSkills || ['Docker', 'Kubernetes', 'AWS', 'System Design']
  const aiInsights = analytics?.aiInsights || []
  const placementReadiness = analytics?.placementReadiness || { overall: 84, technical: 86, projects: 78, communication: 72, interview: 75 }

  const maxMonthlyCount = Math.max(...monthlyData.map(m => m.count), 1)

  return (
    <AppLayout>
      {/* Unified Sub Navigation Header with Back Button & 6-Pill Bar */}
      <JobsSubNavHeader
        activeTab="analytics"
        title="Application Analytics & Insights"
        subtitle="Personalized data metrics, application conversion trends, AI skill gap analysis, and placement readiness."
        badge="PLACEMENT INSIGHTS ENGINE"
      />

      <div className="container" style={{ margin: '24px auto 60px', padding: '0 24px' }}>

        {loading && <LoadingSkeleton count={4} />}

        {!loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* 1. OVERVIEW METRICS CARDS */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: 16
            }}>
              {[
                { label: 'Total Applications', val: overview.totalApplications, icon: FileText, color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
                { label: 'Active Interviews', val: overview.interviews, icon: Mic, color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
                { label: 'Offers Received', val: overview.offers, icon: Award, color: '#059669', bg: '#F0FDF4', border: '#BBF7D0' },
                { label: 'Placement Success Rate', val: `${successRate}%`, icon: TrendingUp, color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' }
              ].map(s => {
                const Icon = s.icon
                return (
                  <div key={s.label} style={{
                    background: '#FFFFFF',
                    borderRadius: 18,
                    padding: '20px 22px',
                    border: `1px solid ${s.border}`,
                    boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14
                  }}>
                    <div style={{
                      width: 46,
                      height: 46,
                      borderRadius: 14,
                      background: s.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: s.color,
                      flexShrink: 0
                    }}>
                      <Icon size={22} strokeWidth={2.2} />
                    </div>
                    <div>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748B', display: 'block' }}>
                        {s.label}
                      </span>
                      <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 800, color: '#0F172A', lineHeight: 1.1, marginTop: 2 }}>
                        {s.val}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 2. MAIN GRID: APPLICATION TRENDS & STATUS BREAKDOWN */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: 20
            }}>
              
              {/* Application Activity Trend Chart */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: 20,
                padding: 24,
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      Application Activity Trend
                    </h3>
                    <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Monthly Applications (Last 12 Months)</span>
                  </div>
                  <BarChart3 size={20} style={{ color: '#2563EB' }} />
                </div>

                {/* Monthly Bar Chart */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 8,
                  height: 160,
                  paddingTop: 20,
                  borderBottom: '1px solid #E2E8F0'
                }}>
                  {monthlyData.map((m, idx) => {
                    const barHeightPct = Math.max(12, Math.round((m.count / maxMonthlyCount) * 100))
                    return (
                      <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: m.count > 0 ? '#2563EB' : '#94A3B8', marginBottom: 4 }}>
                          {m.count}
                        </span>
                        <div style={{
                          width: '100%',
                          maxWidth: 24,
                          height: `${barHeightPct}%`,
                          borderRadius: '6px 6px 0 0',
                          background: m.count > 0 ? 'linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%)' : '#F1F5F9',
                          transition: 'height 0.4s ease-out'
                        }} />
                        <span style={{ fontSize: 10.5, fontWeight: 600, color: '#64748B', marginTop: 6 }}>
                          {m.month}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Status Ratios Breakdown */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: 20,
                padding: 24,
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                  <div>
                    <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      Recruitment Stage Ratios
                    </h3>
                    <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Application Progression Pipeline</span>
                  </div>
                  <PieChart size={20} style={{ color: '#7C3AED' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {statusBreakdown.slice(0, 5).map(st => (
                    <div key={st.status}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                        <span>{st.status}</span>
                        <span>{st.count} ({st.percentage}%)</span>
                      </div>
                      <div style={{ width: '100%', height: 8, borderRadius: 4, background: '#F1F5F9', overflow: 'hidden' }}>
                        <div style={{
                          width: `${st.percentage}%`,
                          height: '100%',
                          borderRadius: 4,
                          background: st.status === 'Offer' ? '#10B981' : (st.status.includes('Interview') ? '#D97706' : '#2563EB')
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* 3. AI INSIGHTS & READINESS RECOMMENDATIONS */}
            <div style={{
              background: 'linear-gradient(135deg, #F5F3FF 0%, #EFF6FF 100%)',
              borderRadius: 24,
              padding: 28,
              border: '1px solid #DDD6FE',
              boxShadow: '0 4px 20px rgba(124, 58, 237, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#7C3AED', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Brain size={20} />
                </div>
                <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  AI Career Insights & Recommendations
                </h3>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 14
              }}>
                {aiInsights.map((insight, idx) => (
                  <div key={idx} style={{
                    background: '#FFFFFF',
                    borderRadius: 14,
                    padding: 16,
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    fontSize: 13,
                    color: '#334155',
                    fontWeight: 600,
                    lineHeight: 1.45
                  }}>
                    <Sparkles size={16} style={{ color: '#7C3AED', flexShrink: 0, marginTop: 2 }} />
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. SKILL GAP RECOMMENDATIONS SECTION */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: 24,
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Recommended Skills to Boost AI Match Score
                  </h3>
                  <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>High-demand skills found in your target job listings</span>
                </div>
                <Zap size={20} style={{ color: '#F59E0B' }} />
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {recommendedSkills.map((sk, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigate('/skills')}
                    style={{
                      height: 42,
                      padding: '0 18px',
                      borderRadius: 12,
                      background: '#F8FAFC',
                      color: '#2563EB',
                      border: '1px solid #BFDBFE',
                      cursor: 'pointer',
                      fontFamily: 'Sora, sans-serif',
                      fontWeight: 700,
                      fontSize: 13,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    <span>Learn {sk}</span>
                    <ArrowRight size={14} />
                  </button>
                ))}
              </div>
            </div>

            {/* 5. TOP TARGET COMPANIES & CATEGORIES */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 20
            }}>
              
              {/* Top Companies */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: 20,
                padding: 24,
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)'
              }}>
                <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#0F172A', margin: '0 0 16px' }}>
                  Top Applied Companies
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {topCompanies.map((c, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: '#F8FAFC',
                      borderRadius: 12,
                      border: '1px solid #E2E8F0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 20 }}>{c.logo}</span>
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A' }}>{c.company}</div>
                          <div style={{ fontSize: 11, color: '#64748B' }}>Highest Status: {c.highestStatus}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#2563EB', background: '#EFF6FF', padding: '3px 8px', borderRadius: 8 }}>
                        {c.count} App{c.count > 1 ? 's' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Placement Readiness Breakdown */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: 20,
                padding: 24,
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)'
              }}>
                <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#0F172A', margin: '0 0 16px' }}>
                  Placement Readiness Assessment
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { label: 'Technical Core', val: placementReadiness.technical },
                    { label: 'Project Portfolio', val: placementReadiness.projects },
                    { label: 'Communication Skills', val: placementReadiness.communication },
                    { label: 'Mock Interview Performance', val: placementReadiness.interview }
                  ].map(r => (
                    <div key={r.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                        <span>{r.label}</span>
                        <span>{r.val}%</span>
                      </div>
                      <div style={{ width: '100%', height: 8, borderRadius: 4, background: '#F1F5F9', overflow: 'hidden' }}>
                        <div style={{ width: `${r.val}%`, height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}
      </div>
    </AppLayout>
  )
}
