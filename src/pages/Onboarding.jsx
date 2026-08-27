import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useStudentProfile } from '../context/StudentProfileContext'
import { ONBOARDING_STEPS } from '../components/onboarding/onboardingData'
import OnboardingHeader from '../components/onboarding/OnboardingHeader'
import OnboardingLaptop from '../components/onboarding/OnboardingLaptop'
import OnboardingJourneyMap from '../components/onboarding/OnboardingJourneyMap'
import OnboardingSkipModal from '../components/onboarding/OnboardingSkipModal'
import { setOnboardingCompleted } from '../utils/onboardingUtils'

/**
 * TypewriterText Component
 * Dynamically types out the description text from start to end with an animated cursor for an engaging reading experience.
 */
function TypewriterText({ text, speed = 16, style = {} }) {
  const [displayed, setDisplayed] = useState('')
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setIsDone(false)
    if (!text) return

    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        setIsDone(true)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <p style={{ ...style, minHeight: '3.2em', position: 'relative' }}>
      <span>{displayed}</span>
      {!isDone && (
        <span
          style={{
            display: 'inline-block',
            width: 2,
            height: '1.05em',
            background: '#4F46E5',
            marginLeft: 3,
            verticalAlign: 'text-bottom',
            borderRadius: 1,
            boxShadow: '0 0 6px rgba(79, 70, 229, 0.7)',
            opacity: 0.9
          }}
        />
      )}
    </p>
  )
}

export default function Onboarding() {
  const navigate = useNavigate()
  const { user } = useAuth() || {}
  const profileCtx = useStudentProfile()

  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isSkipModalOpen, setIsSkipModalOpen] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 900 : false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const currentStep = ONBOARDING_STEPS[currentStepIndex]
  const totalSteps = ONBOARDING_STEPS.length

  // Completion handler
  const finishOnboarding = useCallback(async () => {
    if (user?.uid) {
      setOnboardingCompleted(user.uid, true)
    }
    
    if (profileCtx?.updateSection) {
      try {
        await profileCtx.updateSection('basicProfile', { onboardingCompleted: true }, 'Auth')
      } catch (err) {
        console.warn('Profile sync notice during onboarding completion:', err)
      }
    }

    navigate('/dashboard', { replace: true })
  }, [user, profileCtx, navigate])

  // Step advancement
  const handleNext = useCallback(() => {
    if (currentStepIndex < totalSteps - 1) {
      setIsExiting(true)
      setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1)
        setIsExiting(false)
      }, 150)
    } else {
      finishOnboarding()
    }
  }, [currentStepIndex, totalSteps, finishOnboarding])

  // Step backtracking
  const handleBack = useCallback(() => {
    if (currentStepIndex > 0) {
      setIsExiting(true)
      setTimeout(() => {
        setCurrentStepIndex((prev) => prev - 1)
        setIsExiting(false)
      }, 150)
    }
  }, [currentStepIndex])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isSkipModalOpen) return
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        handleBack()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handleBack, isSkipModalOpen])

  // Exact vector icon matching the screenshot for Result Cards
  const renderResultCardIcon = (iconType) => {
    switch (iconType) {
      case 'chart':
        return (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="5" y="18" width="5" height="9" rx="2" stroke="#4F46E5" strokeWidth="2.4" />
            <rect x="13.5" y="13" width="5" height="14" rx="2" stroke="#4F46E5" strokeWidth="2.4" />
            <rect x="22" y="8" width="5" height="19" rx="2" stroke="#4F46E5" strokeWidth="2.4" />
            <path
              d="M 4 14 Q 10 7, 16 10 T 28 4"
              stroke="#4F46E5"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        )
      case 'compass':
        return (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="12" stroke="#4F46E5" strokeWidth="2.4" />
            <polygon points="16,7 20,16 16,14 12,16" fill="#4F46E5" />
            <polygon points="16,25 20,16 16,18 12,16" fill="#94A3B8" />
          </svg>
        )
      case 'lightbulb':
        return (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M 10 13 C 10 9.7 12.7 7 16 7 C 19.3 7 22 9.7 22 13 C 22 15.5 20 17.5 19 20 L 13 20 C 12 17.5 10 15.5 10 13 Z"
              stroke="#4F46E5"
              strokeWidth="2.4"
              fill="none"
            />
            <line x1="13" y1="23" x2="19" y2="23" stroke="#4F46E5" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="14" y1="26" x2="18" y2="26" stroke="#4F46E5" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        )
      case 'gradCap':
        return (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <polygon points="16,7 27,13 16,19 5,13" stroke="#4F46E5" strokeWidth="2.4" fill="none" strokeLinejoin="round" />
            <path d="M 9 15.5 L 9 22 C 9 24.5 23 24.5 23 22 L 23 15.5" stroke="#4F46E5" strokeWidth="2.4" fill="none" />
            <line x1="27" y1="13" x2="27" y2="21" stroke="#4F46E5" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        )
      case 'briefcase':
        return (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="5" y="11" width="22" height="15" rx="3" stroke="#4F46E5" strokeWidth="2.4" />
            <path d="M 11 11 L 11 8 C 11 6.9 11.9 6 13 6 L 19 6 C 20.1 6 21 6.9 21 8 L 21 11" stroke="#4F46E5" strokeWidth="2.4" />
            <line x1="5" y1="17" x2="27" y2="17" stroke="#4F46E5" strokeWidth="2" />
          </svg>
        )
      case 'trending':
        return (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <polyline points="5,23 12,15 18,20 27,9" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="21,9 27,9 27,15" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      case 'bot':
        return (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="6" y="9" width="20" height="16" rx="4" stroke="#4F46E5" strokeWidth="2.4" />
            <circle cx="12" cy="16" r="2" fill="#4F46E5" />
            <circle cx="20" cy="16" r="2" fill="#4F46E5" />
            <line x1="16" y1="5" x2="16" y2="9" stroke="#4F46E5" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="12" y1="21" x2="20" y2="21" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )
      default:
        return (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <polygon points="16,5 19,12 26,14 21,19 22,26 16,22 10,26 11,19 6,14 13,12" stroke="#4F46E5" strokeWidth="2" />
          </svg>
        )
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      height: isMobile ? 'auto' : '100vh',
      background: '#FFFFFF',
      backgroundImage: `
        radial-gradient(circle at 10% 85%, #EFF6FF 0%, transparent 40%),
        radial-gradient(circle at 92% 35%, #F0F9FF 0%, transparent 45%)
      `,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'DM Sans, sans-serif',
      color: '#0F172A',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* ── Top Header ── */}
      <OnboardingHeader
        currentStep={currentStepIndex + 1}
        totalSteps={totalSteps}
        onSkip={() => setIsSkipModalOpen(true)}
      />

      {/* ── Main Canvas ── */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile 
          ? '12px 16px 90px 16px' 
          : (currentStep.id === 'welcome' || currentStep.id === 'journey') 
            ? '0 48px 16px 48px' 
            : '0 48px 80px 48px',
        maxWidth: 1320,
        margin: '0 auto',
        width: '100%'
      }}>
        {currentStep.id === 'journey' ? (
          /* Step 9: Connected Journey Map */
          <div style={{
            opacity: isExiting ? 0 : 1,
            transform: isExiting ? 'scale(0.98)' : 'scale(1)',
            transition: 'all 0.18s ease',
            width: '100%'
          }}>
            <OnboardingJourneyMap onFinish={finishOnboarding} />
          </div>
        ) : (
          /* Steps 1 to 8: 2-Column Desktop / 1-Column Mobile Layout */
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1.3fr',
            alignItems: 'center',
            gap: isMobile ? '24px' : 'clamp(28px, 4vw, 56px)',
            width: '100%',
            opacity: isExiting ? 0 : 1,
            transform: isExiting ? 'translateY(4px)' : 'translateY(0)',
            transition: 'all 0.18s ease'
          }}>
            {/* ── Left Content Column ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: isMobile ? '100%' : 440 }}>
              {/* Step Index Badge (01, 02, etc.) */}
              {currentStep.stepIndex && (
                <div style={{ display: 'flex' }}>
                  <div style={{
                    background: '#EFF6FF',
                    color: '#4F46E5',
                    border: '1px solid #DBEAFE',
                    borderRadius: 7,
                    padding: '4px 14px',
                    fontWeight: 800,
                    fontSize: 16,
                    fontFamily: 'Sora, sans-serif',
                    display: 'inline-block',
                    boxShadow: '0 2px 6px rgba(79, 70, 229, 0.08)'
                  }}>
                    {currentStep.stepIndex}
                  </div>
                </div>
              )}

              {/* Module Name / Headline */}
              {currentStep.id === 'welcome' ? (
                <h1 style={{
                  fontSize: 'clamp(30px, 3.4vw, 42px)',
                  fontWeight: 800,
                  color: '#0F172A',
                  fontFamily: 'Sora, sans-serif',
                  letterSpacing: '-0.6px',
                  lineHeight: 1.15,
                  margin: '2px 0 0 0'
                }}>
                  Welcome to <br />
                  ZenScore <span style={{ color: '#4F46E5' }}>AI</span>
                </h1>
              ) : (
                <h1 style={{
                  fontSize: 'clamp(28px, 3.2vw, 38px)',
                  fontWeight: 800,
                  color: '#0F172A',
                  fontFamily: 'Sora, sans-serif',
                  letterSpacing: '-0.5px',
                  lineHeight: 1.1,
                  margin: '2px 0 0 0'
                }}>
                  {currentStep.moduleName}
                </h1>
              )}

              {/* Subtitle */}
              {currentStep.subtitle && (
                <div style={{
                  fontSize: 'clamp(16px, 1.8vw, 20px)',
                  fontWeight: 800,
                  color: '#1E293B',
                  fontFamily: 'Sora, sans-serif',
                  letterSpacing: '-0.3px',
                  lineHeight: 1.25,
                  whiteSpace: 'pre-line'
                }}>
                  {currentStep.subtitle}
                </div>
              )}

              {/* Dynamic Typewriter Description */}
              <TypewriterText
                key={currentStep.id}
                text={currentStep.description}
                speed={16}
                style={{
                  fontSize: 'clamp(13.5px, 1.3vw, 14.5px)',
                  color: '#475569',
                  lineHeight: 1.55,
                  margin: 0
                }}
              />

              {/* Result Card */}
              {currentStep.resultTitle && (
                <div style={{
                  background: '#F0F7FF',
                  border: '1px solid #DBEAFE',
                  borderRadius: 12,
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  marginTop: 4,
                  maxWidth: 360
                }}>
                  <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {renderResultCardIcon(currentStep.resultIcon)}
                  </div>

                  <div>
                    <div style={{
                      fontSize: 13.5,
                      fontWeight: 800,
                      color: '#0F172A',
                      fontFamily: 'Sora, sans-serif'
                    }}>
                      Result
                    </div>
                    <div style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#334155',
                      marginTop: 2,
                      lineHeight: 1.3
                    }}>
                      {currentStep.resultTitle}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right Laptop Preview Column ── */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <OnboardingLaptop
                screen={currentStep.screenId}
                activeNav={currentStep.activeNav}
              />
            </div>
          </div>
        )}

        {/* ── Screen 1 Bottom Centered CTA & Dots ── */}
        {currentStep.id === 'welcome' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 18,
            gap: 8
          }}>
            {/* 4 dots above button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <div style={{ width: 14, height: 5, borderRadius: 3, background: '#4F46E5' }} />
              <div style={{ width: 5, height: 5, borderRadius: 3, background: '#E2E8F0' }} />
              <div style={{ width: 5, height: 5, borderRadius: 3, background: '#E2E8F0' }} />
              <div style={{ width: 5, height: 5, borderRadius: 3, background: '#E2E8F0' }} />
            </div>

            {/* Wide Pill Button */}
            <button
              onClick={handleNext}
              style={{
                background: '#4F46E5',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 26,
                padding: '12px 38px',
                fontSize: 14.5,
                fontWeight: 700,
                fontFamily: 'Sora, sans-serif',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(79, 70, 229, 0.35)',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#4338CA'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 10px 24px rgba(79, 70, 229, 0.45)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#4F46E5'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(79, 70, 229, 0.35)'
              }}
            >
              See How ZenScore AI Works →
            </button>

            {/* Subtext */}
            <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>
              This takes less than a minute.
            </div>
          </div>
        )}
      </main>

      {/* ── Fixed Bottom Navigation Footer (Screens 2 to 8) ── */}
      {currentStep.id !== 'welcome' && currentStep.id !== 'journey' && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 64,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderTop: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 48px',
          maxWidth: 1360,
          margin: '0 auto',
          zIndex: 50
        }}>
          {/* Left Back Button */}
          <div>
            {currentStepIndex > 0 ? (
              <button
                onClick={handleBack}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '6px 12px',
                  borderRadius: 16,
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#0F172A')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
              >
                ← Back
              </button>
            ) : (
              <div style={{ width: 60 }} />
            )}
          </div>

          {/* Center Dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {Array.from({ length: 4 }).map((_, i) => {
              const activeDotIndex = (currentStepIndex - 1) % 4
              const isActive = i === activeDotIndex

              return (
                <div
                  key={i}
                  style={{
                    width: isActive ? 14 : 5,
                    height: 5,
                    borderRadius: 3,
                    background: isActive ? '#4F46E5' : '#E2E8F0',
                    transition: 'all 0.25s ease'
                  }}
                />
              )
            })}
          </div>

          {/* Right Next Button */}
          <div>
            <button
              onClick={handleNext}
              style={{
                background: '#4F46E5',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 24,
                padding: '10px 26px',
                fontSize: 14,
                fontWeight: 700,
                fontFamily: 'Sora, sans-serif',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(79, 70, 229, 0.3)',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#4338CA'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#4F46E5'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* ── Skip Confirmation Modal ── */}
      <OnboardingSkipModal
        isOpen={isSkipModalOpen}
        onCancel={() => setIsSkipModalOpen(false)}
        onConfirm={() => {
          setIsSkipModalOpen(false)
          finishOnboarding()
        }}
      />
    </div>
  )
}
