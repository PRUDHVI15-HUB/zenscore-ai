import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import { useAuth } from '../../context/AuthContext'
import { useCareer } from '../../context/CareerContext'
import { useStudentProfile } from '../../context/StudentProfileContext'
import { resolveCanonicalCareerGoal } from '../../services/careers/careerNormalizer'
import InterviewCenter from '../../components/careers/interview/InterviewCenter'

export default function CareerInterviewPage() {
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
      <div className="container" style={{ padding: '24px 24px 48px', margin: '0 auto' }}>
        <InterviewCenter
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
