import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import { useAuth } from '../../context/AuthContext'
import { useCareer } from '../../context/CareerContext'
import { useStudentProfile } from '../../context/StudentProfileContext'
import { resolveCanonicalCareerGoal } from '../../services/careers/careerNormalizer'
import ResumeHero from '../../components/careers/heroes/ResumeHero'
import ResumeCenter from '../../components/careers/resume/ResumeCenter'

export default function CareerResumePage() {
  const { user } = useAuth()
  const career = useCareer()
  const studentProfileCtx = useStudentProfile()
  const [selectedPath, setSelectedPath] = useState('')

  const canonicalRole = resolveCanonicalCareerGoal(studentProfileCtx?.profile, career, selectedPath)

  if (!career?.isCheckingProfile && career?.onboardingCompleted === false) {
    return <Navigate to="/careers" replace />
  }

  return (
    <AppLayout>
      <ResumeHero currentFocus={canonicalRole} />

      <div className="container" style={{ padding: '32px 24px 48px', margin: '0 auto' }}>
        <ResumeCenter
          selectedRole={canonicalRole}
          onSelectCareerRole={(roleTitle) => {
            setSelectedPath(roleTitle)
            if (career?.selectCareerGoal) career.selectCareerGoal(roleTitle)
          }}
        />
      </div>
    </AppLayout>
  )
}
