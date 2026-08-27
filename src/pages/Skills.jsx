import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Map, BarChart3, Award } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../context/AuthContext'
import { useStudentProfile } from '../context/StudentProfileContext'
import { useCareer } from '../context/CareerContext'
import { resolveCanonicalCareerGoal } from '../services/careers/careerNormalizer'
import { useSkillsData } from '../hooks/useSkillsData'
import { SectionErrorBoundary } from '../components/common/SectionErrorBoundary'
import SkillsHero from '../components/skills/SkillsHero'
import SkillsOverview from '../components/skills/SkillsOverview'
import ContinueLearning from '../components/skills/ContinueLearning'
import ExploreSection from '../components/skills/Explore/ExploreSection'
import RoadmapsSection from '../components/skills/roadmaps/RoadmapsSection'
import ProgressDashboard from '../components/skills/progress/ProgressDashboard'
import CertificatesSection from '../components/skills/certificates/CertificatesSection'

const tabs = [
  { id: 'explore', label: 'Explore', Icon: Search },
  { id: 'roadmap', label: 'Roadmaps', Icon: Map },
  { id: 'tracker', label: 'My Progress', Icon: BarChart3 },
  { id: 'certifications', label: 'Certificates', Icon: Award },
]

export default function Skills() {
  const { user } = useAuth()
  const studentProfileCtx = useStudentProfile()
  const careerCtx = useCareer()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('explore')
  const [selectedSkill, setSelectedSkill] = useState(null)

  const {
    userInfo,
    categories,
    overviewStats,
    aiRecommendations,
    continueCourses,
    exploreSkills,
    roadmapsData,
    progressSummary,
    learningActivity,
    activeSkillsProgress,
    achievementsData,
    certificatesList,
    loading,
    error,
    toast,
    refetch,
    handleBookmarkToggle,
    handleEnroll,
    handleStepAdjustment,
    handleLessonCompletion,
    copyCertificateVerification
  } = useSkillsData(activeTab)

  const targetRole = resolveCanonicalCareerGoal(studentProfileCtx?.profile, careerCtx, userInfo?.targetRole)

  useEffect(() => { if (!user) navigate('/') }, [user, navigate])

  return (
    <AppLayout>
      <SkillsHero
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
        currentFocus={userInfo?.skills?.[0] || (targetRole?.toLowerCase().includes('machine') ? "Python & PyTorch" : (targetRole?.toLowerCase().includes('frontend') ? "React & Web Dev" : "Core Engineering"))}
        careerGoal={targetRole}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          background: toast.type === 'error' ? '#EF4444' : 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
          color: '#ffffff',
          padding: '14px 22px',
          borderRadius: '14px',
          fontFamily: 'Sora, sans-serif',
          fontSize: '14px',
          fontWeight: 600,
          boxShadow: '0 12px 30px -5px rgba(124, 58, 237, 0.45)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          transition: 'all 0.3s ease'
        }}>
          {toast.message}
        </div>
      )}

      <div id="skills-content-section" className="container" style={{ padding: '12px 24px 40px' }}>

          {/* EXPLORE */}
          {activeTab === 'explore' && (
            <SectionErrorBoundary onReset={refetch}>
              <SkillsOverview
                stats={overviewStats}
                loading={loading}
                error={error}
                onViewCertificates={() => setActiveTab('certifications')}
              />

              <ContinueLearning
                courses={continueCourses}
                loading={loading}
                error={error}
                onContinue={(course) => {
                  navigate(`/skills/${course.id || course._id || course.skillId}`)
                }}
                onExplore={() => setActiveTab('explore')}
              />

              <ExploreSection
                skills={exploreSkills}
                categories={categories}
                loading={loading}
                error={error}
                onSkillClick={(skill) => {
                  handleEnroll(skill.id || skill._id)
                  navigate(`/skills/${skill.id || skill._id}`)
                }}
                onBookmark={(courseId) => handleBookmarkToggle(courseId)}
                onEnroll={(courseId) => {
                  handleEnroll(courseId)
                  navigate(`/skills/${courseId}`)
                }}
                onRetry={refetch}
              />
            </SectionErrorBoundary>
          )}

          {/* ROADMAP */}
          {activeTab === 'roadmap' && (
            <SectionErrorBoundary onReset={refetch}>
              <RoadmapsSection
                roadmaps={roadmapsData}
                selectedRoadmapId={selectedSkill?.id}
                loading={loading}
                error={error}
                onExplore={() => setActiveTab('explore')}
                onSelectRoadmap={(roadmap) => {
                  setSelectedSkill(roadmap)
                }}
                onModuleAction={(module, roadmap) => {
                  const linkedObj = module?.linkedSkill
                  let targetId = null
                  
                  if (linkedObj) {
                    if (typeof linkedObj === 'object') {
                      targetId = linkedObj.slug || linkedObj._id || linkedObj.id
                    } else if (typeof linkedObj === 'string') {
                      targetId = linkedObj
                    }
                  }

                  if (!targetId || targetId === 'fullstack-web-dev' || targetId === 'full-stack-mern-architecture') {
                    const title = (module?.title || '').toLowerCase()
                    if (title.includes('html') || title.includes('semantic')) targetId = 'html'
                    else if (title.includes('css') || title.includes('flexbox') || title.includes('grid')) targetId = 'css'
                    else if (title.includes('javascript') || title.includes('js es6') || title.includes('es6')) targetId = 'javascript'
                    else if (title.includes('react') || title.includes('jsx')) targetId = 'react'
                    else if (title.includes('node') || title.includes('express')) targetId = 'nodejs'
                    else if (title.includes('mongo') || title.includes('bson')) targetId = 'mongodb'
                    else if (title.includes('linux') || title.includes('system administration')) targetId = 'linux'
                    else if (title.includes('docker') || title.includes('container')) targetId = 'docker'
                    else if (title.includes('ci/cd') || title.includes('github actions')) targetId = 'github-actions'
                    else if (title.includes('kubernetes') || title.includes('k8s')) targetId = 'kubernetes'
                    else if (title.includes('cloud') || title.includes('aws')) targetId = 'aws'
                    else if (title.includes('python')) targetId = 'python'
                    else if (title.includes('numpy')) targetId = 'numpy'
                    else if (title.includes('pandas')) targetId = 'pandas'
                    else if (title.includes('scikit') || title.includes('ml classifiers')) targetId = 'scikit-learn'
                    else if (title.includes('llm') || title.includes('prompt') || title.includes('rag')) targetId = 'prompt-engineering'
                    else if (title.includes('express') || title.includes('restful')) targetId = 'expressjs'
                    else if (title.includes('redis') || title.includes('microservices')) targetId = 'redis'
                    else if (title.includes('tailwind')) targetId = 'tailwind-css'
                    else if (title.includes('next.js') || title.includes('nextjs') || title.includes('app router')) targetId = 'nextjs'
                  }

                  targetId = targetId || module?.skillId || 'html'

                  if (targetId) {
                    handleEnroll(targetId)
                    const lessonQuery = module?.lessonNumber ? `?lesson=${module.lessonNumber}` : ''
                    navigate(`/skills/${targetId}${lessonQuery}`)
                  }
                }}
                onRetry={refetch}
              />
            </SectionErrorBoundary>
          )}

          {/* PROGRESS TRACKER */}
          {activeTab === 'tracker' && (
            <SectionErrorBoundary onReset={refetch}>
              <ProgressDashboard
                progressSummary={progressSummary}
                learningActivity={learningActivity}
                activeSkills={activeSkillsProgress}
                achievements={achievementsData}
                loading={loading}
                error={error}
                onContinueSkill={(skill) => {
                  const targetId = skill?.skillId || skill?.id || skill?._id
                  if (targetId) navigate(`/skills/${targetId}`)
                }}
                onExplore={() => setActiveTab('explore')}
                onRetry={refetch}
              />
            </SectionErrorBoundary>
          )}

          {/* CERTIFICATIONS */}
          {activeTab === 'certifications' && (
            <SectionErrorBoundary onReset={refetch}>
              <CertificatesSection
                certificates={certificatesList}
                userInfo={userInfo}
                loading={loading}
                error={error}
                onCopyId={(certId) => copyCertificateVerification(certId)}
                onExplore={() => setActiveTab('explore')}
                onRetry={refetch}
              />
            </SectionErrorBoundary>
          )}

        </div>
    </AppLayout>
  )
}