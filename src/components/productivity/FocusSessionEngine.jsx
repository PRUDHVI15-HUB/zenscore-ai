import React, { useState, useEffect } from 'react'
import FocusSessionSetup from './FocusSessionSetup'
import FocusTimer from './FocusTimer'
import FocusCompletionCard from './FocusCompletionCard'
import SessionHistory from './history/SessionHistory'
import ProductivityInsights from './insights/ProductivityInsights'
import FocusHealth from './health/FocusHealth'
import AIProductivityCoach from './coach/AIProductivityCoach'
import { getStoredSessions } from '../../utils/focusSessionStorage'

export default function FocusSessionEngine({ activeTab = 'sessions', setActiveTab }) {
  // Step state for Focus Sessions tab: 'setup' | 'active' | 'completion'
  const [engineStep, setEngineStep] = useState('setup')
  const [currentSessionSetup, setCurrentSessionSetup] = useState(null)
  const [completedSessionData, setCompletedSessionData] = useState(null)
  const [allSessions, setAllSessions] = useState([])

  // Load existing sessions on mount
  useEffect(() => {
    const loaded = getStoredSessions()
    setAllSessions(loaded)
  }, [])

  // STEP 1 -> STEP 2 Transition
  const handleStartSession = (setupData) => {
    setCurrentSessionSetup(setupData)
    setEngineStep('active')
  }

  // STEP 2 -> STEP 3 Transition
  const handleCompleteSession = (sessionData) => {
    setCompletedSessionData(sessionData)
    setEngineStep('completion')
  }

  // STEP 3 -> Save & Reset to STEP 1
  const handleSessionSaved = ({ session, allSessions: updatedList }) => {
    setAllSessions(updatedList)
    setEngineStep('setup')
    setCurrentSessionSetup(null)
    setCompletedSessionData(null)
  }

  // Navigating to Focus Session Setup handler
  const handleNavigateToSetup = () => {
    if (setActiveTab) setActiveTab('sessions')
    setEngineStep('setup')
  }

  // Sprint 2: Session History Tab
  if (activeTab === 'history') {
    return <SessionHistory onStartFirstSession={handleNavigateToSetup} />
  }

  // Sprint 3: Productivity Insights Tab
  if (activeTab === 'insights') {
    return <ProductivityInsights onStartFirstSession={handleNavigateToSetup} />
  }

  // Sprint 4: AI Productivity Coach Tab
  if (activeTab === 'coach' || activeTab === 'aicoach') {
    return <AIProductivityCoach onStartFirstSession={handleNavigateToSetup} />
  }

  // Sprint 5: Focus Health Tab
  if (activeTab === 'health' || activeTab === 'focushealth') {
    return <FocusHealth onStartFirstSession={handleNavigateToSetup} />
  }

  // Active Tab is 'sessions': Render current step of Focus Session Engine
  return (
    <div>
      {engineStep === 'setup' && (
        <FocusSessionSetup
          onStartSession={handleStartSession}
          isFirstSession={allSessions.length === 0}
        />
      )}

      {engineStep === 'active' && currentSessionSetup && (
        <FocusTimer
          sessionSetup={currentSessionSetup}
          onCompleteSession={handleCompleteSession}
          onCancelSession={() => {
            setEngineStep('setup')
            setCurrentSessionSetup(null)
          }}
        />
      )}

      {engineStep === 'completion' && completedSessionData && (
        <FocusCompletionCard
          completedData={completedSessionData}
          onSessionSaved={handleSessionSaved}
        />
      )}
    </div>
  )
}
