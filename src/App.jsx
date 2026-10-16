import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CareerProvider } from './context/CareerContext'
import { StudentProfileProvider } from './context/StudentProfileContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import RouteSEOManager from './components/common/RouteSEOManager'

const Home = lazy(() => import('./pages/Home'))
const Register = lazy(() => import('./pages/Register'))
const Login = lazy(() => import('./pages/Login'))
const Onboarding = lazy(() => import('./pages/Onboarding'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Academics = lazy(() => import('./pages/Academics'))
const MyTranscriptPage = lazy(() => import('./pages/academics/MyTranscript'))
const MySubjectsPage = lazy(() => import('./pages/academics/MySubjects'))
const PerformancePage = lazy(() => import('./pages/academics/Performance'))
const AIAssistantPage = lazy(() => import('./pages/academics/AIAssistant'))
const Careers = lazy(() => import('./pages/Careers'))
const CareerLearningPage = lazy(() => import('./pages/careers/LearningPage'))
const CareerResumePage = lazy(() => import('./pages/careers/ResumePage'))
const CareerJobsPage = lazy(() => import('./pages/careers/JobsPage'))
const CareerInterviewPage = lazy(() => import('./pages/careers/InterviewPage'))
const Skills = lazy(() => import('./pages/Skills'))
const SkillDetail = lazy(() => import('./pages/skills/SkillDetail'))
const SkillsAdmin = lazy(() => import('./pages/admin/SkillsAdmin'))
const Jobs = lazy(() => import('./pages/Jobs'))
const JobListingsPage = lazy(() => import('./pages/jobs/JobListings'))
const SavedJobsPage = lazy(() => import('./pages/jobs/SavedJobs'))
const MyApplicationsPage = lazy(() => import('./pages/jobs/MyApplications'))
const JobAlertsPage = lazy(() => import('./pages/jobs/JobAlerts'))
const ApplicationAnalyticsPage = lazy(() => import('./pages/jobs/ApplicationAnalytics'))
const FollowedCompaniesPage = lazy(() => import('./pages/jobs/FollowedCompanies'))
const CompanyProfilePage = lazy(() => import('./pages/jobs/CompanyProfile'))
const JobsComingSoon = lazy(() => import('./pages/jobs/JobsComingSoon'))
const Productivity = lazy(() => import('./pages/Productivity'))
const Courses = lazy(() => import('./pages/Courses'))
const CourseDetail = lazy(() => import('./pages/courses/CourseDetail'))
const AITutor = lazy(() => import('./pages/AITutor'))
const Profile = lazy(() => import('./pages/Profile'))
const StudyGroups = lazy(() => import('./pages/StudyGroups'))
const FeedbackPage = lazy(() => import('./pages/Feedback'))
const NotFound = lazy(() => import('./pages/NotFound'))

const PageLoader = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Sora, sans-serif', background: '#F8FAFC', color: '#64748B' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 36, marginBottom: 10 }}>⚡</div>
      <div style={{ fontWeight: 700, fontSize: 14 }}>Loading ZenScore AI...</div>
    </div>
  </div>
)

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <RouteSEOManager />
      <ThemeProvider>
        <AuthProvider>
        <StudentProfileProvider>
          <CareerProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />

              {/* Public routes */}
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />

              {/* Onboarding route */}
              <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />

              {/* Protected routes — require login */}
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

              {/* Academics module dedicated pages */}
              <Route path="/academics" element={<ProtectedRoute><Academics /></ProtectedRoute>} />
              <Route path="/academics/transcript" element={<ProtectedRoute><MyTranscriptPage /></ProtectedRoute>} />
              <Route path="/academics/subjects" element={<ProtectedRoute><MySubjectsPage /></ProtectedRoute>} />
              <Route path="/academics/performance" element={<ProtectedRoute><PerformancePage /></ProtectedRoute>} />
              <Route path="/academics/ai" element={<ProtectedRoute><AIAssistantPage /></ProtectedRoute>} />

              {/* Careers module dedicated pages */}
              <Route path="/careers" element={<ProtectedRoute><Careers /></ProtectedRoute>} />
              <Route path="/careers/setup" element={<ProtectedRoute><Careers forcedStep="setup" /></ProtectedRoute>} />
              <Route path="/careers/onboarding" element={<ProtectedRoute><Careers forcedStep="setup" /></ProtectedRoute>} />
              <Route path="/careers/overview" element={<ProtectedRoute><Careers /></ProtectedRoute>} />
              <Route path="/careers/learning" element={<ProtectedRoute><CareerLearningPage /></ProtectedRoute>} />
              <Route path="/careers/resume" element={<ProtectedRoute><CareerResumePage /></ProtectedRoute>} />
              <Route path="/careers/jobs" element={<ProtectedRoute><CareerJobsPage /></ProtectedRoute>} />
              <Route path="/careers/interview" element={<ProtectedRoute><CareerInterviewPage /></ProtectedRoute>} />

              {/* Skills module */}
              <Route path="/skills" element={<ProtectedRoute><Skills /></ProtectedRoute>} />
              <Route path="/skills/:skillId" element={<ProtectedRoute><SkillDetail /></ProtectedRoute>} />
              <Route path="/admin/skills" element={<ProtectedRoute><SkillsAdmin /></ProtectedRoute>} />

              {/* Jobs module dedicated pages */}
              <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
              <Route path="/jobs/listings" element={<ProtectedRoute><JobListingsPage /></ProtectedRoute>} />
              <Route path="/jobs/saved" element={<ProtectedRoute><SavedJobsPage /></ProtectedRoute>} />
              <Route path="/jobs/applications" element={<ProtectedRoute><MyApplicationsPage /></ProtectedRoute>} />
              <Route path="/jobs/alerts" element={<ProtectedRoute><JobAlertsPage /></ProtectedRoute>} />
              <Route path="/jobs/analytics" element={<ProtectedRoute><ApplicationAnalyticsPage /></ProtectedRoute>} />
              <Route path="/jobs/following" element={<ProtectedRoute><FollowedCompaniesPage /></ProtectedRoute>} />
              <Route path="/companies/:companyName" element={<ProtectedRoute><CompanyProfilePage /></ProtectedRoute>} />
              <Route path="/jobs/companies/:companyName" element={<ProtectedRoute><CompanyProfilePage /></ProtectedRoute>} />
              <Route path="/jobs/readiness" element={<ProtectedRoute><JobsComingSoon title="Placement Readiness Assessment" description="Evaluate your ATS score, resume match, and technical skill gaps." /></ProtectedRoute>} />
              <Route path="/jobs/drives" element={<ProtectedRoute><JobsComingSoon title="Campus Placement Drives" description="Monitor upcoming campus drives, eligibility criteria, and interview schedules." /></ProtectedRoute>} />

              <Route path="/productivity" element={<ProtectedRoute><Productivity /></ProtectedRoute>} />
              <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
              <Route path="/courses/:courseId" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
              <Route path="/ai-tutor" element={<ProtectedRoute><AITutor /></ProtectedRoute>} />
              <Route path="/study-groups" element={<ProtectedRoute><StudyGroups /></ProtectedRoute>} />
              <Route path="/feedback" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </CareerProvider>
        </StudentProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  </Router>
  )
}