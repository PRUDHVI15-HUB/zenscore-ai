import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../context/AuthContext'
import JobsHero, { DEFAULT_JOBS_TABS } from '../components/jobs/JobsHero'
import RecommendedJobs from '../components/jobs/RecommendedJobs'
import { CheckCircle2 } from 'lucide-react'

/**
 * Jobs Dashboard Page (ZenScore AI Placement Portal)
 * Clean layout with Curved Hero Banner, 4 Quick Stats Cards, 4 Pill Navigation Tabs, AI Recommended Jobs, and Job Listings.
 */
export default function Jobs() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('listings')

  useEffect(() => {
    if (!user) {
      navigate('/')
    } else if (location.search) {
      navigate(`/jobs/listings${location.search}`, { replace: true })
    }
  }, [user, navigate, location.search])

  return (
    <AppLayout>
      {/* 1. Jobs Hero Banner + 4 Small Stats Cards + 4 Pill Navigation Tabs Bar */}
      <JobsHero
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={DEFAULT_JOBS_TABS}
        onExplore={() => {
          setActiveTab('listings')
          const targetEl = document.getElementById('jobs-main-content')
          if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' })
        }}
      />

      {/* Main Content Anchor Section */}
      <div id="jobs-main-content">
        <RecommendedJobs
          onExploreSkills={() => navigate('/skills')}
        />
      </div>
    </AppLayout>
  )
}