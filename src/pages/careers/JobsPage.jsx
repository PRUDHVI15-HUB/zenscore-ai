import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import { useAuth } from '../../context/AuthContext'
import { useCareer } from '../../context/CareerContext'
import { useStudentProfile } from '../../context/StudentProfileContext'
import { resolveCanonicalCareerGoal } from '../../services/careers/careerNormalizer'
import JobsBridgeHero from '../../components/careers/heroes/JobsBridgeHero'
import JobsIntegrationHub from '../../components/careers/jobs/JobsIntegrationHub'

export default function CareerJobsPage() {
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
      <JobsBridgeHero currentFocus={canonicalRole} />

      <div className="container" style={{ padding: '32px 24px 48px', margin: '0 auto' }}>
        <JobsIntegrationHub
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
