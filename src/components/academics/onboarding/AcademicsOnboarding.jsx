/**
 * AcademicsOnboarding
 * 
 * 3-step onboarding flow that appears when a student opens Academics for the first time.
 * Persists completion in localStorage under key `zenscore_academics_onboarded`.
 * 
 * Steps:
 *   1. OnboardingStep1 — Profile setup (university, branch, semester, CGPA, subjects)
 *   2. OnboardingStep2 — Data entry method selection
 *   3. OnboardingStep3 — Actual data entry (manual / upload / paste)
 * 
 * Once Step 3 is complete, calls `onComplete` prop and marks localStorage.
 */

import React, { useState } from 'react'
import OnboardingStep1 from './OnboardingStep1'
import OnboardingStep2 from './OnboardingStep2'
import OnboardingStep3 from './OnboardingStep3'

export const ONBOARDING_KEY = 'zenscore_academics_onboarded'

export function isOnboardingComplete() {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === 'true'
  } catch {
    return false
  }
}

export function markOnboardingComplete() {
  try {
    localStorage.setItem(ONBOARDING_KEY, 'true')
  } catch {
    // Silently fail in environments without localStorage
  }
}

export default function AcademicsOnboarding({ onComplete }) {
  const [step, setStep] = useState(1)
  const [profileData, setProfileData] = useState(null)
  const [methodData, setMethodData] = useState(null)

  // Step 1 → 2
  const handleStep1Continue = (data) => {
    setProfileData(data)
    setStep(2)
  }

  // Step 2 → 3
  const handleStep2Continue = (data) => {
    setMethodData(data)
    setStep(3)
  }

  // Step 3 → Dashboard
  const handleStep3Finish = (entryData) => {
    markOnboardingComplete()
    // Persist profile in localStorage for optional future use
    try {
      localStorage.setItem('zenscore_academics_profile', JSON.stringify({
        ...profileData,
        entryData,
        completedAt: new Date().toISOString()
      }))
    } catch {
      // Silently fail
    }
    onComplete()
  }

  // Back navigation
  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1))
  }

  return (
    <div
      className="min-h-screen w-full relative flex items-center justify-center px-4 py-12 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #f0f0ff 0%, #fafaff 40%, #f5f0ff 100%)',
      }}
    >
      {/* Dark mode overlay */}
      <div className="absolute inset-0 dark:bg-slate-950/95" />

      {/* Background decorative blobs */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-20 w-[400px] h-[400px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full">
        {step === 1 && (
          <OnboardingStep1 onContinue={handleStep1Continue} />
        )}
        {step === 2 && (
          <OnboardingStep2
            profileData={profileData}
            onContinue={handleStep2Continue}
            onBack={handleBack}
          />
        )}
        {step === 3 && (
          <OnboardingStep3
            profileData={profileData}
            methodData={methodData}
            onFinish={handleStep3Finish}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  )
}
