import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Map, BarChart3, Award } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../context/AuthContext'
import { useCareer } from '../context/CareerContext'
import { useStudentProfile } from '../context/StudentProfileContext'
import { resolveCanonicalCareerGoal } from '../services/careers/careerNormalizer'
import { useCoursesData } from '../hooks/useCoursesData'
import { SectionErrorBoundary } from '../components/common/SectionErrorBoundary'

import CoursesHero from '../components/courses/CoursesHero'
import CoursesOverview from '../components/courses/CoursesOverview'
import ContinueCourses from '../components/courses/ContinueCourses'
import ExploreCoursesSection from '../components/courses/Explore/ExploreCoursesSection'
import CourseRoadmapsSection from '../components/courses/Roadmaps/CourseRoadmapsSection'
import CourseProgressDashboard from '../components/courses/Progress/CourseProgressDashboard'
import CourseCertificatesSection from '../components/courses/Certificates/CourseCertificatesSection'
import AIRecommendationsDrawer from '../components/courses/AIRecommendationsDrawer'

const tabs = [
  { id: 'explore', label: 'Explore', Icon: Search },
  { id: 'roadmap', label: 'Roadmaps', Icon: Map },
  { id: 'tracker', label: 'My Progress', Icon: BarChart3 },
  { id: 'certifications', label: 'Certificates', Icon: Award },
]

export default function Courses() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('explore')
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false)

  const {
    userInfo,
    courses,
    stats,
    recommended,
    continueLearning,
    roadmap,
    certificatesList,
    loading,
    error,
    toast,
    refetch,
    handleEnroll,
    handleBookmarkToggle,
    overviewStats,
    progressSummary,
    activeCoursesProgress,
    learningActivity,
    achievementsData
  } = useCoursesData(activeTab)

  const careerCtx = useCareer()
  const studentProfileCtx = useStudentProfile()
  const targetRole = resolveCanonicalCareerGoal(studentProfileCtx?.profile, careerCtx, userInfo?.targetRole)

  useEffect(() => {
    if (!user) navigate('/')
  }, [user, navigate])

  return (
    <AppLayout>
      <CoursesHero
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
        currentFocus={userInfo?.skills?.[0] || (targetRole?.toLowerCase().includes('frontend') ? "React & Web Dev" : "Computer Science")}
        careerGoal={targetRole}
        onExplore={() => setActiveTab('explore')}
        onTakeAssessment={() => setIsAiDrawerOpen(true)}
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
          boxShadow: '0 12px 30px -5px rgba(124, 58, 237, 0.45)'
        }}>
          {toast.message}
        </div>
      )}

      {/* Right Slide-over AI Recommendations Panel */}
      <AIRecommendationsDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        recommended={recommended.length > 0 ? recommended : courses.slice(0, 4)}
        userInfo={userInfo}
        onEnroll={handleEnroll}
      />

      <div id="courses-content-section" className="container" style={{ padding: '12px 24px 40px', margin: '0 auto' }}>

        {/* EXPLORE TAB */}
        {activeTab === 'explore' && (
          <SectionErrorBoundary onReset={refetch}>
            <CoursesOverview stats={overviewStats} />

            <ContinueCourses
              courses={continueLearning}
              loading={loading}
              onContinue={(courseId) => navigate(`/courses/${courseId}`)}
              onExplore={() => setActiveTab('explore')}
            />

            <ExploreCoursesSection
              courses={courses}
              loading={loading}
              error={error}
              onCourseClick={(course) => navigate(`/courses/${course._id || course.id}`)}
              onBookmark={(courseId) => handleBookmarkToggle(courseId)}
              onEnroll={(courseId) => {
                handleEnroll(courseId)
                navigate(`/courses/${courseId}`)
              }}
              onRetry={refetch}
            />
          </SectionErrorBoundary>
        )}

        {/* ROADMAP TAB */}
        {activeTab === 'roadmap' && (
          <SectionErrorBoundary onReset={refetch}>
            <CourseRoadmapsSection
              roadmap={roadmap}
              courses={courses}
              onSelectCourse={(courseId) => navigate(`/courses/${courseId}`)}
            />
          </SectionErrorBoundary>
        )}

        {/* MY PROGRESS TAB */}
        {activeTab === 'tracker' && (
          <SectionErrorBoundary onReset={refetch}>
            <CourseProgressDashboard
              progressSummary={progressSummary}
              activeCourses={activeCoursesProgress}
              learningActivity={learningActivity}
              achievements={achievementsData}
              onContinueCourse={(c) => navigate(`/courses/${c.id}`)}
            />
          </SectionErrorBoundary>
        )}

        {/* CERTIFICATIONS TAB */}
        {activeTab === 'certifications' && (
          <SectionErrorBoundary onReset={refetch}>
            <CourseCertificatesSection
              certificates={certificatesList}
              loading={loading}
              error={error}
              onCopyId={(certId) => {
                navigator.clipboard.writeText(certId)
              }}
              onExplore={() => setActiveTab('explore')}
            />
          </SectionErrorBoundary>
        )}
      </div>
    </AppLayout>
  )
}