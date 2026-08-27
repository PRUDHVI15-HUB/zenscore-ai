import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ROUTE_METADATA = {
  '/': {
    title: 'ZenScore AI — AI-Powered Academic & Career Intelligence Platform',
    description: 'ZenScore AI is the premier student ecosystem uniting predictive academic analytics, AI career coaching, skill roadmaps, verified job drives, and masterclass courses.'
  },
  '/login': {
    title: 'Student Login | ZenScore AI',
    description: 'Log in to your ZenScore student account to access your personalized academic dashboard, AI career tools, and skill roadmaps.'
  },
  '/register': {
    title: 'Create Student Account | ZenScore AI',
    description: 'Join ZenScore AI today. Predict grades, master computer science skills, build ATS-ready resumes, and secure top tier placements.'
  },
  '/onboarding': {
    title: 'Student Onboarding & Setup | ZenScore AI',
    description: 'Configure your degree, branch, target career paths, and technical preferences to personalize your AI student ecosystem.'
  },
  '/dashboard': {
    title: 'Student Command Dashboard | ZenScore AI',
    description: 'Unified command center for real-time CGPA tracking, active skill roadmaps, focus timers, and upcoming campus placement drives.'
  },
  '/academics': {
    title: 'Academic Performance & CGPA Tracker | ZenScore AI',
    description: 'Track semester grades, subject-wise attendance, upload transcripts with OCR, and forecast your academic performance with AI.'
  },
  '/careers': {
    title: 'AI Career Readiness & Placement Command Center | ZenScore AI',
    description: 'Comprehensive placement intelligence platform featuring AI Resume Builder, ATS analyzer, role roadmaps, and mock interview center.'
  },
  '/careers/resume': {
    title: 'AI Resume Builder & ATS Scanner | ZenScore AI',
    description: 'Create high-impact, ATS-optimized engineering resumes with real-time scoring and job keyword matching.'
  },
  '/careers/interview': {
    title: 'AI Technical Interview Simulator | ZenScore AI',
    description: 'Practice simulated coding and behavioral technical interviews with instant AI audio feedback and rubric grading.'
  },
  '/skills': {
    title: 'Skill Matrix, Interactive Roadmaps & Verification | ZenScore AI',
    description: 'Explore 30+ engineering skill roadmaps, take interactive quizzes, practice in cloud coding playgrounds, and earn verified certificates.'
  },
  '/courses': {
    title: 'Courses & Masterclass Learning Hub | ZenScore AI',
    description: 'Interactive educational masterclasses with curated video lectures, chapter quizzes, coding workspaces, and project evaluators.'
  },
  '/jobs': {
    title: 'Find Your Job — Campus Drives & Verified Openings | ZenScore AI',
    description: 'Discover curated software engineering, AI, and data science job openings matching your verified student skill score.'
  },
  '/productivity': {
    title: 'Focus Sessions, Pomodoro & Productivity Coach | ZenScore AI',
    description: 'Elevate your daily study discipline with customizable focus sessions, ambient sounds, streak tracking, and AI health coaching.'
  },
  '/ai-tutor': {
    title: '24/7 AI Engineering Tutor & Coding Mentor | ZenScore AI',
    description: 'Instant technical answers, code explanations, algorithmic debugging, and interactive curriculum support powered by ZenScore AI.'
  },
  '/profile': {
    title: 'Student Master Profile & Preferences | ZenScore AI',
    description: 'Manage your verified academic records, career goals, coding handles (GitHub, LeetCode), and personalized account settings.'
  }
}

export default function RouteSEOManager() {
  const location = useLocation()

  useEffect(() => {
    const pathname = location.pathname
    // Check exact match or prefix match
    let meta = ROUTE_METADATA[pathname]

    if (!meta) {
      if (pathname.startsWith('/skills/')) {
        meta = {
          title: 'Skill Learning Workspace | ZenScore AI',
          description: 'Master engineering competencies with step-by-step curricula, practice quizzes, and interactive code exercises.'
        }
      } else if (pathname.startsWith('/courses/')) {
        meta = {
          title: 'Course Lesson Workspace | ZenScore AI',
          description: 'Watch video masterclasses, read comprehensive study notes, and evaluate projects with AI grading.'
        }
      } else if (pathname.startsWith('/companies/') || pathname.startsWith('/jobs/companies/')) {
        meta = {
          title: 'Company Profile & Placement Openings | ZenScore AI',
          description: 'Explore hiring trends, interview question banks, salary expectations, and live openings.'
        }
      } else {
        meta = {
          title: 'ZenScore AI — Student Academic & Career Platform',
          description: 'Predict academic performance, master engineering skills, and achieve your dream career with ZenScore AI.'
        }
      }
    }

    // Update Document Title
    document.title = meta.title

    // Update Meta Description
    let descTag = document.querySelector('meta[name="description"]')
    if (descTag) {
      descTag.setAttribute('content', meta.description)
    }

    // Update OpenGraph Title & Description
    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', meta.title)

    let ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc) ogDesc.setAttribute('content', meta.description)

    // Update Twitter Title & Description
    let twTitle = document.querySelector('meta[name="twitter:title"]')
    if (twTitle) twTitle.setAttribute('content', meta.title)

    let twDesc = document.querySelector('meta[name="twitter:description"]')
    if (twDesc) twDesc.setAttribute('content', meta.description)

  }, [location.pathname])

  return null
}
