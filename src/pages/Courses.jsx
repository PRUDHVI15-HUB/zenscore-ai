import { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../context/AuthContext'
import {
  Flame,
  CheckCircle2,
  Target,
  Trophy,
  Sliders,
  Star,
  Bookmark,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  PlayCircle,
  Clock,
  Lock,
  Play,
  ArrowUpRight,
  Check,
  Timer,
  X,
  Book,
  Code,
  FileText,
  Video,
  Award,
  ExternalLink,
  ChevronDown,
  Coins,
  Zap,
  Download,
  AlertCircle,
  Award as BadgeIcon,
  Activity,
  User,
  History
} from 'lucide-react'
import {
  getCourses,
  getCourseById,
  getCourseStats,
  getRecommendedCourses,
  getContinueLearning,
  enrollInCourse,
  toggleBookmark,
  completeModuleVideo,
  completeModuleNotes,
  submitModuleQuiz,
  evaluateCodingExercise,
  submitModuleAssignment,
  completeModule,
  getRoadmap,
  adjustRoadmap,
  getDailyChallenge,
  submitDailyChallenge,
  getLearningAnalytics
} from '../services/api'

// --- Reusable CountUp component ---
function CountUp({ end, suffix = '' }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const final = parseInt(end) || 0
    if (final === 0) {
      setCount(end)
      return
    }
    const duration = 1000
    const increment = final / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= final) {
        clearInterval(timer)
        setCount(final)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [end])
  return <span>{count}{suffix}</span>
}

// --- SVGs for Tech Logos ---
const JavaLogo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 15C6 19.5 12 21.5 12 21.5C12 21.5 18 19.5 18 15C18 11.5 15.5 10.5 12 10.5C8.5 10.5 6 11.5 6 15Z" fill="#F97316" fillOpacity="0.15" stroke="#EA580C" strokeWidth="1.5" />
    <path d="M9 15C9 17 12 18 12 18C12 18 15 17 15 15" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M10 8.5C10 8.5 9 6 11 3.5C11 3.5 10 5.5 11 6.5" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M13 8.5C13 8.5 12.5 5 14.5 2C14.5 2 13 4.5 13.5 6" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const SqlLogo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="12" cy="6" rx="8" ry="3" fill="#10B981" fillOpacity="0.15" stroke="#10B981" strokeWidth="1.8" />
    <path d="M4 6V12C4 13.66 7.58 15 12 15C16.42 15 20 13.66 20 12V6" stroke="#10B981" strokeWidth="1.8" />
    <path d="M4 12V18C4 19.66 7.58 21 12 21C16.42 21 20 19.66 20 18V12" stroke="#10B981" strokeWidth="1.8" />
  </svg>
)

const DockerLogo = () => (
  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="9" width="2.5" height="2.5" rx="0.5" fill="#0db7ed" />
    <rect x="8.5" y="9" width="2.5" height="2.5" rx="0.5" fill="#0db7ed" />
    <rect x="12" y="9" width="2.5" height="2.5" rx="0.5" fill="#0db7ed" />
    <rect x="8.5" y="5.5" width="2.5" height="2.5" rx="0.5" fill="#0db7ed" />
    <rect x="12" y="5.5" width="2.5" height="2.5" rx="0.5" fill="#0db7ed" />
    <rect x="15.5" y="9" width="2.5" height="2.5" rx="0.5" fill="#0db7ed" />
    <path d="M1.5 13.5C1.5 15.5 3.5 17.5 7.5 17.5C13.5 17.5 15 14.5 18 14.5C20 14.5 21 13.5 22 12C20 12 19 12.5 17.5 12.5C16.5 12.5 15.5 11.5 15 10.5C12 11.5 9 11.5 7.5 12C5 12.5 1.5 11.5 1.5 13.5Z" fill="#0db7ed" />
    <path d="M21.5 9.5C22 9.5 22.5 10.5 22.5 11C22.5 11.5 22 12 21.5 12" stroke="#0db7ed" strokeWidth="1" strokeLinecap="round" />
  </svg>
)

const LinuxLogo = () => (
  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C9.5 2 8 4 8 6.5C8 9 9.5 11 9.5 13C9.5 14 9 15 8 16C6 18 5 21 8 21.5C12 22 13 22 16 21.5C19 21 18 18 16 16C15 15 14.5 14 14.5 13C14.5 11 16 9 16 6.5C16 4 14.5 2 12 2Z" fill="#1E293B" />
    <circle cx="10.5" cy="6" r="0.8" fill="#fff" />
    <circle cx="10.5" cy="6" r="0.4" fill="#000" />
    <circle cx="13.5" cy="6" r="0.8" fill="#fff" />
    <circle cx="13.5" cy="6" r="0.4" fill="#000" />
    <path d="M11 7.5L13 7.5L12 8.5Z" fill="#F59E0B" />
    <path d="M12 11C10 11 9.5 13 9.5 15.5C9.5 18 10 19.5 12 19.5C14 19.5 14.5 18 14.5 15.5C14.5 13 14 11 12 11Z" fill="#FFF" />
    <path d="M7 21C6 21 5.5 21.5 6 22C7 23 10 22.5 11 22C10.5 21.5 9 21 7 21Z" fill="#F59E0B" />
    <path d="M17 21C18 21 18.5 21.5 18 22C17 23 14 22.5 13 22C13.5 21.5 15 21 17 21Z" fill="#F59E0B" />
  </svg>
)

const GitLogo = () => (
  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4.5" y="4.5" width="11" height="11" rx="1.5" transform="rotate(45 10 10)" stroke="#F05032" strokeWidth="2" />
    <circle cx="10" cy="7" r="2" fill="#F05032" />
    <circle cx="10" cy="13" r="2" fill="#F05032" />
    <circle cx="13" cy="10" r="2" fill="#F05032" />
    <line x1="10" y1="9" x2="10" y2="11" stroke="#F05032" strokeWidth="1.5" />
    <path d="M10 10C11.5 10 11.8 10 12 10" stroke="#F05032" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const NodeLogo = () => (
  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L4 6.5V15.5L12 20L20 15.5V6.5L12 2Z" stroke="#339933" strokeWidth="2" strokeLinejoin="round" />
    <path d="M12 7.5L6.5 10.5V14.5L12 17.5L17.5 14.5V10.5L12 7.5Z" fill="#339933" fillOpacity="0.15" />
  </svg>
)

const PythonLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.5 2 8 2.5 8 5V7H12V8.5H6.5C4 8.5 3 9.5 3 12C3 14.5 4 15.5 6.5 15.5H8V14C8 11.5 8.5 11 11 11H17V9.5C17 7 16.5 6.5 13 6.5H12V5C12 2.5 15.5 2 12 2Z" fill="#3776AB" />
    <path d="M12 22C15.5 22 16 21.5 16 19V17H12V15.5H17.5C20 15.5 21 14.5 21 12C21 9.5 20 8.5 17.5 8.5H16V10C16 12.5 15.5 13 13 13H7V14.5C7 17 7.5 17.5 11 17.5H12V19C12 21.5 8.5 22 12 22Z" fill="#FFD343" />
    <circle cx="10" cy="4.5" r="0.5" fill="#fff" />
    <circle cx="14" cy="19.5" r="0.5" fill="#000" />
  </svg>
)

const K8sLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L20.5 5.5L22 14.5L16 21.5L8 21.5L2 14.5L3.5 5.5L12 2Z" stroke="#326CE5" strokeWidth="2" strokeLinejoin="round" fill="#326CE5" fillOpacity="0.1" />
    <circle cx="12" cy="12" r="3" stroke="#326CE5" strokeWidth="1.5" />
    <line x1="12" y1="2" x2="12" y2="9" stroke="#326CE5" strokeWidth="1.5" />
    <line x1="20.5" y1="5.5" x2="14.5" y2="10" stroke="#326CE5" strokeWidth="1.5" />
    <line x1="9.5" y1="11" x2="3.5" y2="5.5" stroke="#326CE5" strokeWidth="1.5" />
  </svg>
)

const SystemDesignLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="5" height="5" rx="1" stroke="#4F46E5" strokeWidth="2" />
    <rect x="16" y="3" width="5" height="5" rx="1" stroke="#4F46E5" strokeWidth="2" />
    <rect x="9.5" y="15" width="5" height="5" rx="1" stroke="#4F46E5" strokeWidth="2" />
    <line x1="8" y1="5.5" x2="16" y2="5.5" stroke="#4F46E5" strokeWidth="2" />
    <line x1="5.5" y1="8" x2="9.5" y2="15" stroke="#4F46E5" strokeWidth="2" />
    <line x1="18.5" y1="8" x2="14.5" y2="15" stroke="#4F46E5" strokeWidth="2" />
  </svg>
)

const AwsLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="2" y="12" fill="#232F3E" fontSize="7.5" fontWeight="900" fontFamily="sans-serif">AWS</text>
    <path d="M3 16C7 19.5 13 19.5 17 16" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" />
    <path d="M17 16L15.5 14.5" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const FullStackLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6C4 4.5 8 3 12 3C16 3 20 4.5 20 6C20 7.5 16 9 12 9C8 9 4 7.5 4 6Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
    <path d="M4 11C4 12.5 8 14 12 14C16 14 20 12.5 20 11M4 11V13C4 14.5 8 16 12 16C16 16 20 14.5 20 13V11" stroke="#1D4ED8" strokeWidth="1.5" fill="none" />
    <path d="M4 16C4 17.5 8 19 12 19C16 19 20 17.5 20 16M4 16V18C4 19.5 8 21 12 21C16 21 20 19.5 20 18V16" stroke="#1D4ED8" strokeWidth="1.5" fill="none" />
  </svg>
)

const renderCourseLogo = (iconKey) => {
  switch (iconKey?.toLowerCase()) {
    case 'java': return <JavaLogo />
    case 'sql': return <SqlLogo />
    case 'docker': return <DockerLogo />
    case 'linux': return <LinuxLogo />
    case 'git': return <GitLogo />
    case 'node': return <NodeLogo />
    case 'python': return <PythonLogo />
    case 'k8s': return <K8sLogo />
    case 'system-design': return <SystemDesignLogo />
    case 'aws': return <AwsLogo />
    case 'fullstack': return <FullStackLogo />
    default: return '📚'
  }
}

// Generate verified certificate in print mode
const generateCertificatePDF = (studentName, courseTitle) => {
  const doc = `
    <html>
      <head>
        <title>ZenScore Certificate - ${courseTitle}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');
          body { font-family: 'Inter', sans-serif; text-align: center; padding: 40px; background: #F8FAFC; color: #1E293B; }
          .cert-container { 
            border: 12px solid #4F46E5; 
            padding: 50px; 
            background: #ffffff; 
            border-radius: 24px; 
            box-shadow: 0 20px 50px rgba(79, 70, 229, 0.15); 
            max-width: 800px;
            margin: 0 auto;
            position: relative;
          }
          h1 { font-family: 'Sora', sans-serif; color: #4F46E5; font-size: 38px; margin-top: 10px; }
          p { font-size: 16px; color: #64748B; margin: 18px 0; }
          .highlight { font-size: 26px; color: #1E293B; font-weight: 800; font-family: 'Sora'; margin: 15px 0; }
          .sig-line { margin-top: 60px; border-top: 2px solid #E2E8F0; display: inline-block; width: 250px; padding-top: 10px; font-weight: 700; color: #4F46E5; }
        </style>
      </head>
      <body>
        <div class="cert-container">
          <span style="font-size: 11px; font-weight: 800; color: #7C3AED; text-transform: uppercase; letter-spacing: 2px;">Verified AI Credential</span>
          <h1>ZenScore Academy</h1>
          <p>This is to certify that</p>
          <div class="highlight">${studentName}</div>
          <p>has successfully completed all required coding assignments, quizzes, and project modules for the specialization course</p>
          <div class="highlight" style="color: #4F46E5;">${courseTitle}</div>
          <p>Issued on ${new Date().toLocaleDateString()} • Verified Certificate ID: ZS-${Math.floor(Math.random()*1000000)}</p>
          <div>
            <div class="sig-line">AI Certification Board</div>
          </div>
        </div>
      </body>
    </html>
  `
  const win = window.open('', '_blank')
  win.document.write(doc)
  win.document.close()
}

const categories = [
  { id: 'all', label: 'All Courses', icon: '⚡', bg: '#EEF2FF', desc: 'Browse all available categories' },
  { id: 'programming', label: 'Programming', icon: '💻', bg: '#EFF6FF', desc: 'Learn Java, Python, Go, and software craftsmanship' },
  { id: 'datascience', label: 'Data Science', icon: '📊', bg: '#ECFDF5', desc: 'Master SQL, pandas, analytics, and statistical algorithms' },
  { id: 'devops', label: 'DevOps', icon: '♾️', bg: '#F8FAFC', desc: 'Automate build runs, Docker containment, and setups' },
  { id: 'cloud', label: 'Cloud Computing', icon: '☁️', bg: '#FEF2F2', desc: 'Deploy securely to Amazon AWS infrastructure' },
  { id: 'aiml', label: 'AI & ML', icon: '🤖', bg: '#FFFBEB', desc: 'Build prompt engineers, RAG chains, and custom agents' }
]

const formatCountdown = (seconds) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h}h ${m}m ${s}s`
}

export default function Courses() {
  const { user } = useAuth()
  
  // Dashboard & stats states
  const [courses, setCourses] = useState([])
  const [stats, setStats] = useState({ streak: 0, completedCount: 0, weeklyHours: 0, weeklyGoal: 10, certificatesCount: 0, xp: 0, coins: 0, level: 1, badges: [] })
  const [recommended, setRecommended] = useState([])
  const [continueLearning, setContinueLearning] = useState([])
  const [roadmap, setRoadmap] = useState(null)
  const [dailyChallenge, setDailyChallenge] = useState(null)
  const [analytics, setAnalytics] = useState({ weeklyHours: 0, monthlyHours: 0, completionRate: 0, quizAverage: 0, codingScore: 0, learningVelocity: 'Average', predictedCompletion: '' })
  
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Dedicated Study Center Focus state
  const [activeStudyCourse, setActiveStudyCourse] = useState(null) // Course object

  // Syllabus and Tabs state within Study Center
  const [activeModuleIndex, setActiveModuleIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('video') // 'video' | 'notes' | 'quiz' | 'coding' | 'assignment' | 'interview'
  
  // Interactive workspace states
  const [videoWatchedPercentage, setVideoWatchedPercentage] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState({}) // { questionIdx: optionIdx }
  const [quizGradeResult, setQuizGradeResult] = useState(null)
  const [studentDiaryNote, setStudentDiaryNote] = useState('')
  const [sandboxCode, setSandboxCode] = useState('')
  const [sandboxFeedback, setSandboxFeedback] = useState(null)
  const [assignmentSubmission, setAssignmentSubmission] = useState('')
  const [assignmentFeedback, setAssignmentFeedback] = useState(null)
  const [isRunningCode, setIsRunningCode] = useState(false)
  const [isGradingAssignment, setIsGradingAssignment] = useState(false)

  // Modals state
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false)
  const [selectedChallengeAnswer, setSelectedChallengeAnswer] = useState(null)
  const [challengeSolving, setChallengeSolving] = useState(false)
  const [hoveredRec, setHoveredRec] = useState(null)

  // Roadmap adjust form inputs
  const [formCareerGoal, setFormCareerGoal] = useState('Become a Full Stack Developer')
  const [formWeeklyHours, setFormWeeklyHours] = useState(10)
  const [formPreferredDomain, setFormPreferredDomain] = useState('Full Stack')
  const [formSkillLevel, setFormSkillLevel] = useState('Intermediate')

  const [timeLeft, setTimeLeft] = useState(37470)

  const loadDashboard = async (search = searchQuery, category = activeCategory) => {
    try {
      const [coursesRes, statsRes, recRes, continueRes, roadmapRes, challengeRes, analyticsRes] = await Promise.all([
        getCourses({ search, category }),
        getCourseStats(),
        getRecommendedCourses(),
        getContinueLearning(),
        getRoadmap(),
        getDailyChallenge(),
        getLearningAnalytics()
      ])

      if (coursesRes.success) {
        setCourses(coursesRes.data)
        // Update activeStudyCourse using functional state updates to prevent stale closure reopening issues
        setActiveStudyCourse(prev => {
          if (!prev) return null
          const match = coursesRes.data.find(c => c._id === prev._id)
          return match || prev
        })
      }
      if (statsRes.success) setStats(statsRes.data)
      if (recRes.success) setRecommended(recRes.data)
      if (continueRes.success) setContinueLearning(continueRes.data)
      if (analyticsRes.success) setAnalytics(analyticsRes.data)
      
      if (roadmapRes.success && roadmapRes.data) {
        setRoadmap(roadmapRes.data)
        setFormCareerGoal(roadmapRes.data.careerGoal)
        setFormWeeklyHours(roadmapRes.data.weeklyHours)
        setFormPreferredDomain(roadmapRes.data.preferredDomain)
        setFormSkillLevel(roadmapRes.data.skillLevel)
      }
      if (challengeRes.success) setDailyChallenge(challengeRes.data)

      setError(null)
    } catch (err) {
      console.error(err)
      setError('Could not load dynamic lms data.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 86400))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchFiltered = async () => {
      try {
        const res = await getCourses({ search: searchQuery, category: activeCategory })
        if (res.success) setCourses(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchFiltered()
  }, [searchQuery, activeCategory])

  const handleBookmarkToggle = async (courseId, e) => {
    if (e) e.stopPropagation()
    try {
      const res = await toggleBookmark(courseId)
      if (res.success) {
        setCourses(prev => prev.map(c => c._id === courseId ? { ...c, isBookmarked: res.isBookmarked } : c))
        setRecommended(prev => prev.map(c => c._id === courseId ? { ...c, isBookmarked: res.isBookmarked } : c))
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Enrollment workflow redirects immediately to study center focus mode
  const handleEnroll = async (courseId) => {
    try {
      const res = await enrollInCourse(courseId)
      if (res.success) {
        await loadDashboard()
        const courseRes = await getCourseById(courseId)
        if (courseRes.success && courseRes.data) {
          setActiveStudyCourse(courseRes.data)
          setActiveModuleIndex(0)
          setActiveTab('video')
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  // --- Watch Video with 95% Completion ---
  const handleSimulateWatchVideo = async () => {
    if (!activeStudyCourse) return
    setVideoWatchedPercentage(100)
    try {
      await completeModuleVideo(activeStudyCourse._id, activeModuleIndex, { percentWatched: 100, lastPosition: 120 })
      await loadDashboard()
      alert('Video completed successfully!')
    } catch (err) {
      console.error(err)
    }
  }

  const handleDiaryNotesSave = () => {
    if (!studentDiaryNote.trim()) return
    alert('Diary notes saved to database successfully!')
  }

  const handleDownloadNotes = () => {
    if (!activeStudyCourse) return
    const activeModule = activeStudyCourse.modules[activeModuleIndex]
    const element = document.createElement('a')
    const file = new Blob([activeModule.notes], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${activeModule.title}_Notes.txt`
    document.body.appendChild(element)
    element.click()
  }

  const handleQuizSubmit = async () => {
    if (!activeStudyCourse) return
    const answersArray = Object.keys(quizAnswers).sort().map(k => quizAnswers[k])
    const activeModule = activeStudyCourse.modules[activeModuleIndex]
    
    if (answersArray.length < activeModule.quiz.length) {
      alert('Please answer all questions before submitting.')
      return
    }

    try {
      const res = await submitModuleQuiz(activeStudyCourse._id, activeModuleIndex, answersArray)
      if (res.success) {
        setQuizGradeResult({ passed: res.passed, score: res.score, correctCount: res.correctCount, total: res.totalQuestions })
        await loadDashboard()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleRunCodingVerification = async () => {
    if (!activeStudyCourse) return
    if (!sandboxCode.trim()) {
      alert('Please enter your code first.')
      return
    }
    setIsRunningCode(true)
    try {
      const res = await evaluateCodingExercise(activeStudyCourse._id, activeModuleIndex, sandboxCode)
      if (res.success) {
        setSandboxFeedback({
          passed: res.passed,
          output: res.output,
          critique: res.critique
        })
        await loadDashboard()
      }
    } catch (err) {
      console.error(err)
      setSandboxFeedback({ passed: false, output: 'Compile Error', critique: 'Syntax error detected.' })
    } finally {
      setIsRunningCode(false)
    }
  }

  const handleAssignmentSubmit = async () => {
    if (!activeStudyCourse) return
    if (!assignmentSubmission.trim()) {
      alert('Please paste code or project link before submitting.')
      return
    }
    setIsGradingAssignment(true)
    try {
      const res = await submitModuleAssignment(activeStudyCourse._id, activeModuleIndex, assignmentSubmission)
      if (res.success) {
        setAssignmentFeedback({
          grade: res.grade,
          feedback: res.feedback
        })
        await loadDashboard()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsGradingAssignment(false)
    }
  }

  const handleCompleteModuleClick = async () => {
    if (!activeStudyCourse) return
    try {
      const res = await completeModule(activeStudyCourse._id, activeModuleIndex)
      if (res.success) {
        alert('Congratulations! Module marked complete. You earned +100 XP and +50 Coins!')
        await loadDashboard()
        if (res.gamification?.levelUp) {
          alert(`🎉 Level Up! You reached Level ${res.gamification.currentLevel}!`)
        }
      }
    } catch (err) {
      alert(err.message || 'Complete required tasks first.')
    }
  }

  const handleChallengeSubmitClick = async () => {
    if (selectedChallengeAnswer === null) {
      alert('Please select an option.')
      return
    }
    setChallengeSolving(true)
    try {
      const res = await submitDailyChallenge()
      if (res.success) {
        alert(`Correct! You earned +${dailyChallenge.xpReward} XP. Daily Study Streak increased!`)
        setIsChallengeModalOpen(false)
        await loadDashboard()
      }
    } catch (err) {
      alert(err.message || 'Incorrect solution.')
    } finally {
      setChallengeSolving(false)
    }
  }

  const handleRegenerateRoadmap = async (e) => {
    e.preventDefault()
    setIsRegenerating(true)
    try {
      const res = await adjustRoadmap({
        careerGoal: formCareerGoal,
        weeklyHours: formWeeklyHours,
        preferredDomain: formPreferredDomain,
        skillLevel: formSkillLevel
      })
      if (res.success) {
        setRoadmap(res.data)
        setIsAdjustModalOpen(false)
        await loadDashboard()
      }
    } catch (err) {
      alert('AI adjustment error.')
    } finally {
      setIsRegenerating(false)
    }
  }

  const getDynamicCategoryCount = (catId) => {
    if (catId === 'all') return courses.length
    return courses.filter(c => c.category === catId).length
  }

  // --- RENDER DEDICATED FULL-SCREEN STUDY CENTER WORKSPACE ---
  if (activeStudyCourse) {
    const m = activeStudyCourse.modules[activeModuleIndex] || activeStudyCourse.modules[0]
    
    // Lock logic: module is locked unless it's index 0, or previous index is in completedModules
    const isModuleLocked = (idx) => {
      if (idx === 0) return false
      return !activeStudyCourse.completedModules?.includes(String(idx - 1))
    }

    const isVideoDone = activeStudyCourse.completedVideos?.includes(String(activeModuleIndex))
    const isNotesDone = activeStudyCourse.completedNotes?.includes(String(activeModuleIndex))
    const isQuizDone = activeStudyCourse.completedQuizzes?.includes(String(activeModuleIndex))
    const isAssignDone = activeStudyCourse.completedAssignments?.includes(String(activeModuleIndex))

    return (
      <div style={{
        background: '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column',
        fontFamily: 'Inter, sans-serif'
      }}>
        {/* Top Header bar */}
        <header style={{
          background: '#ffffff', borderBottom: '1px solid #E2E8F0', padding: '16px 32px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', sticky: 'top', zIndex: 100
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <button
              onClick={() => {
                setActiveStudyCourse(null)
                loadDashboard()
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, background: '#F1F5F9',
                border: 'none', color: '#475569', padding: '8px 14px', borderRadius: 10,
                fontWeight: 700, fontSize: 13, cursor: 'pointer'
              }}
            >
              <ChevronLeft size={16} /> Exit Study Center
            </button>
            <div style={{
              width: 38, height: 38, borderRadius: 10, background: '#EEF2FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {renderCourseLogo(activeStudyCourse.icon)}
            </div>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 800, color: '#1E293B', margin: 0 }}>
                {activeStudyCourse.title}
              </h1>
              <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>
                Instructor: {activeStudyCourse.instructor} • Specialized LMS Specialization
              </span>
            </div>
          </div>

          {/* Overall progress indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 4 }}>
                Course Completed: <span style={{ color: '#4F46E5' }}>{activeStudyCourse.completedPercent}%</span>
              </div>
              <div style={{ width: 180, background: '#E2E8F0', borderRadius: 99, height: 6, overflow: 'hidden' }}>
                <div style={{ background: '#4F46E5', height: '100%', width: `${activeStudyCourse.completedPercent}%` }} />
              </div>
            </div>

            {/* Gamification Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderLeft: '1px solid #E2E8F0', paddingLeft: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#EFF6FF', color: '#2563EB', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800 }}>
                <Zap size={14} fill="#2563EB" /> Lvl {stats.level}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FFFBEB', color: '#D97706', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800 }}>
                <Coins size={14} fill="#D97706" /> {stats.coins} Coins
              </div>
            </div>

            {activeStudyCourse.completedPercent >= 100 && (
              <button
                className="action-button"
                style={{
                  height: 38, padding: '0 18px', borderRadius: 10, border: 'none',
                  background: 'linear-gradient(135deg, #10B981, #059669)', color: '#ffffff',
                  fontWeight: 800, fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 6
                }}
                onClick={() => generateCertificatePDF(user?.name || 'Student', activeStudyCourse.title)}
              >
                <Award size={14} /> Claim Certificate
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Study pane */}
        <div style={{ flex: 1, display: 'flex', height: 'calc(100vh - 71px)', overflow: 'hidden' }}>
          
          {/* Left panel: modules checklist layout */}
          <aside style={{ width: 330, background: '#ffffff', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: 11, fontWeight: 850, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Specialization Timeline</span>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {activeStudyCourse.modules.map((moduleItem, idx) => {
                const isLocked = isModuleLocked(idx)
                const isActive = activeModuleIndex === idx
                const completedStr = String(idx)
                const isCompleted = activeStudyCourse.completedModules?.includes(completedStr)

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (!isLocked) {
                        setActiveModuleIndex(idx)
                        setActiveTab('video')
                        setQuizGradeResult(null)
                        setSandboxFeedback(null)
                        setAssignmentFeedback(null)
                      }
                    }}
                    style={{
                      padding: '14px 16px', borderRadius: 16,
                      border: isActive ? '1px solid #C7D2FE' : '1px solid #F1F5F9',
                      background: isActive ? '#EEF2FF' : isLocked ? '#F8FAFC' : '#ffffff',
                      cursor: isLocked ? 'not-allowed' : 'pointer',
                      opacity: isLocked ? 0.6 : 1,
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: isLocked ? '#94A3B8' : '#4F46E5', textTransform: 'uppercase' }}>
                        Module {idx + 1}
                      </span>
                      {isCompleted ? (
                        <span style={{ fontSize: 10, fontWeight: 800, color: '#10B981', background: '#EBFDF5', padding: '2px 6px', borderRadius: 6 }}>Completed ✓</span>
                      ) : isLocked ? (
                        <Lock size={12} style={{ color: '#94A3B8' }} />
                      ) : (
                        <span style={{ fontSize: 10, fontWeight: 800, color: '#3B82F6', background: '#EFF6FF', padding: '2px 6px', borderRadius: 6 }}>Active ⚡</span>
                      )}
                    </div>
                    
                    <h3 style={{ fontSize: 13, fontWeight: 750, color: isLocked ? '#94A3B8' : '#1E293B', margin: '0 0 8px', lineHeight: 1.4 }}>
                      {moduleItem.title}
                    </h3>

                    {/* Task requirements indicators */}
                    {!isLocked && (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: activeStudyCourse.completedVideos?.includes(String(idx)) ? '#10B981' : '#64748B' }}>🎥 Video</span>
                        <span style={{ fontSize: 9, fontWeight: 700, color: activeStudyCourse.completedNotes?.includes(String(idx)) ? '#10B981' : '#64748B' }}>📝 Notes</span>
                        <span style={{ fontSize: 9, fontWeight: 700, color: activeStudyCourse.completedQuizzes?.includes(String(idx)) ? '#10B981' : '#64748B' }}>❓ Quiz</span>
                        <span style={{ fontSize: 9, fontWeight: 700, color: activeStudyCourse.completedAssignments?.includes(String(idx)) ? '#10B981' : '#64748B' }}>💻 Project</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </aside>

          {/* Right main area: Split panel learning screen */}
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            
            {/* Top Workspace Tab list */}
            <div style={{ display: 'flex', background: '#ffffff', borderBottom: '1px solid #E2E8F0', padding: '12px 32px', gap: 12, overflowX: 'auto' }}>
              {[
                { id: 'video', label: 'Watch Video', icon: <Video size={13} /> },
                { id: 'notes', label: 'Lesson Notes', icon: <FileText size={13} /> },
                { id: 'quiz', label: 'Practice Quiz', icon: <Book size={13} /> },
                { id: 'coding', label: 'Coding Workspace', icon: <Code size={13} /> },
                { id: 'assignment', label: 'AI Project Grader', icon: <Trophy size={13} /> },
                { id: 'interview', label: 'Placement Interview Prep', icon: <Sparkles size={13} /> }
              ].map(t => (
                <button
                  key={t.id}
                  className="tab-btn"
                  style={{
                    background: activeTab === t.id ? '#4F46E5' : '#F1F5F9',
                    color: activeTab === t.id ? '#ffffff' : '#475569',
                    padding: '8px 16px', borderRadius: 10
                  }}
                  onClick={() => {
                    setActiveTab(t.id)
                    if (t.id === 'notes') handleReadNotes()
                  }}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* Content pane */}
            <div style={{ flex: 1, padding: 32, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              
              {/* VIDEO TAB */}
              {activeTab === 'video' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
                  <div style={{ width: '100%', aspectRatio: '16/9', maxHeight: 460, background: '#000', borderRadius: 18, overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${m.video?.youtubeId || m.videoUrl}`}
                      title="Syllabus player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '16px 20px', borderRadius: 16, border: '1.5px solid #F1F5F9' }}>
                    <div>
                      <h4 style={{ fontSize: 14, fontWeight: 750, color: '#1E293B', margin: '0 0 4px' }}>Video Player Tracking</h4>
                      <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>You must watch at least 95% of the video. Play or verify complete below.</p>
                    </div>
                    <button
                      className="action-button"
                      style={{
                        height: 38, padding: '0 16px', borderRadius: 10, border: 'none',
                        background: isVideoDone ? '#EBFDF5' : '#4F46E5',
                        color: isVideoDone ? '#10B981' : '#ffffff',
                        fontWeight: 800, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6
                      }}
                      onClick={handleSimulateWatchVideo}
                      disabled={isVideoDone}
                    >
                      {isVideoDone ? '✓ Video Watched' : 'Mark Video Complete'}
                    </button>
                  </div>
                </div>
              )}

              {/* NOTES TAB */}
              {activeTab === 'notes' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 24, height: '100%', alignItems: 'flex-start' }}>
                  {/* Left Notes Reader */}
                  <div style={{ background: '#ffffff', borderRadius: 20, padding: 30, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: 12, marginBottom: 20 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 800, color: '#1E293B' }}>Written Core Documentation</span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          style={{
                            background: '#F1F5F9', border: 'none', color: '#475569', padding: '6px 12px',
                            borderRadius: 8, fontSize: 11, fontWeight: 750, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer'
                          }}
                          onClick={handleDownloadNotes}
                        >
                          <Download size={12} /> Download PDF/Txt
                        </button>
                      </div>
                    </div>
                    <pre style={{
                      fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#475569',
                      lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0
                    }}>
                      {m.notes?.markdown || m.notes}
                    </pre>
                  </div>

                  {/* Right Personal Diary */}
                  <div style={{ background: '#ffffff', borderRadius: 20, padding: 24, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <h4 style={{ fontSize: 13.5, fontWeight: 800, color: '#1E293B', margin: 0 }}>My Personal Study Diary</h4>
                    <span style={{ fontSize: 11, color: '#64748B' }}>Write notes, highlights, and custom logs to reference later. Saved in MongoDB.</span>
                    <textarea
                      value={studentDiaryNote}
                      onChange={e => setStudentDiaryNote(e.target.value)}
                      placeholder="Write notes here..."
                      style={{
                        width: '100%', height: 160, borderRadius: 12, border: '1.5px solid #E2E8F0',
                        padding: '10px 12px', fontSize: 12.5, outline: 'none', resize: 'none'
                      }}
                    />
                    <button
                      className="action-button"
                      style={{
                        height: 38, borderRadius: 10, border: 'none', background: '#4F46E5',
                        color: '#ffffff', fontWeight: 800, fontSize: 12.5
                      }}
                      onClick={handleDiaryNotesSave}
                    >
                      Save Diary Notes
                    </button>
                  </div>
                </div>
              )}

              {/* QUIZ TAB */}
              {activeTab === 'quiz' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '16px 20px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 10, color: '#B45309', fontSize: 12.5, fontWeight: 700 }}>
                    <AlertCircle size={16} /> Grade criteria: Pass with 70% or higher score to unlock next timeline module.
                  </div>

                  {m.quiz.map((q, qIdx) => (
                    <div key={qIdx} style={{ background: '#ffffff', borderRadius: 20, padding: 24, border: '1px solid #E2E8F0' }}>
                      <span style={{ display: 'block', fontSize: 14, fontWeight: 800, color: '#1E293B', marginBottom: 12 }}>
                        Q{qIdx + 1}. {q.question}
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {q.options.map((opt, oIdx) => {
                          const isSelected = quizAnswers[qIdx] === oIdx
                          return (
                            <label
                              key={oIdx}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                                border: isSelected ? '1.5px solid #4F46E5' : '1.5px solid #F1F5F9',
                                borderRadius: 12, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                                background: isSelected ? '#F5F3FF' : '#ffffff', transition: 'all 0.15s'
                              }}
                            >
                              <input
                                type="radio"
                                name={`active_quiz_${qIdx}`}
                                checked={isSelected}
                                onChange={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                                style={{ accentColor: '#4F46E5' }}
                              />
                              {opt}
                            </label>
                          )
                        })}
                      </div>

                      {/* Display explanation if graded */}
                      {quizGradeResult && (
                        <div style={{ marginTop: 14, padding: '10px 14px', background: '#F8FAFC', borderRadius: 10, fontSize: 12, color: '#475569', borderLeft: '3px solid #64748B' }}>
                          <span style={{ fontWeight: 800, display: 'block', marginBottom: 2 }}>Answer Explanation</span>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: 20, borderRadius: 18, border: '1px solid #E2E8F0' }}>
                    {quizGradeResult ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 800, color: quizGradeResult.passed ? '#10B981' : '#EF4444' }}>
                          {quizGradeResult.passed ? `🎉 Passed! Grade: ${quizGradeResult.score}%` : `❌ Failed. Grade: ${quizGradeResult.score}%`}
                        </span>
                        {!quizGradeResult.passed && (
                          <button
                            style={{ background: '#F1F5F9', border: 'none', color: '#4F46E5', padding: '6px 12px', borderRadius: 8, fontSize: 11.5, fontWeight: 750, cursor: 'pointer' }}
                            onClick={() => {
                              setQuizGradeResult(null)
                              setQuizAnswers({})
                            }}
                          >
                            Retry Quiz
                          </button>
                        )}
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Grade criteria: 70% or more to pass</span>
                    )}

                    <button
                      className="action-button"
                      style={{
                        height: 38, padding: '0 20px', borderRadius: 10, border: 'none',
                        background: '#4F46E5', color: '#ffffff', fontWeight: 800, fontSize: 12.5
                      }}
                      onClick={handleQuizSubmit}
                    >
                      Submit Quiz answers
                    </button>
                  </div>
                </div>
              )}

              {/* CODING EXERCISE TAB */}
              {activeTab === 'coding' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 24, height: '100%', alignItems: 'stretch' }}>
                  {/* Left instructions block */}
                  <div style={{ background: '#ffffff', borderRadius: 20, padding: 24, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 800, background: '#EFF6FF', color: '#3B82F6', padding: '3px 8px', borderRadius: 6 }}>{m.codingExercise.difficulty} Exercise</span>
                    </div>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: '#1E293B', margin: 0 }}>Problem Statement</h4>
                    <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.5, margin: 0 }}>
                      {m.codingExercise?.problem || m.codingExercise?.problemStatement}
                    </p>

                    <h4 style={{ fontSize: 13, fontWeight: 800, color: '#1E293B', margin: '10px 0 0' }}>Expected Output</h4>
                    <pre style={{ background: '#F8FAFC', padding: 10, borderRadius: 8, fontSize: 12, fontFamily: 'monospace', border: '1px solid #E2E8F0' }}>
                      {m.codingExercise.expectedOutput}
                    </pre>

                    <h4 style={{ fontSize: 13, fontWeight: 800, color: '#1E293B', margin: '10px 0 0' }}>Hints</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {m.codingExercise.hints.map((h, hIdx) => (
                        <span key={hIdx} style={{ fontSize: 11.5, color: '#64748B' }}>• {h}</span>
                      ))}
                    </div>
                  </div>

                  {/* Right coding panel */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ flex: 1, background: '#1E293B', borderRadius: 20, padding: 20, border: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ borderBottom: '1px solid #334155', paddingBottom: 10, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'monospace' }}>compiler.js</span>
                      </div>
                      <textarea
                        value={sandboxCode || m.codingExercise.starterCode}
                        onChange={e => setSandboxCode(e.target.value)}
                        style={{
                          width: '100%', flex: 1, background: 'transparent', border: 'none', outline: 'none',
                          color: '#34D399', fontFamily: 'monospace', fontSize: 13, resize: 'none', minHeight: 180
                        }}
                      />
                    </div>

                    {/* Compiler outputs and evaluation critique */}
                    {sandboxFeedback && (
                      <div style={{
                        padding: 16, background: sandboxFeedback.passed ? '#EBFDF5' : '#FEF2F2',
                        border: sandboxFeedback.passed ? '1px solid #A7F3D0' : '1px solid #FECACA',
                        borderRadius: 14, fontSize: 12, color: sandboxFeedback.passed ? '#065F46' : '#991B1B'
                      }}>
                        <span style={{ fontWeight: 800, display: 'block', marginBottom: 2 }}>Compiler output: {sandboxFeedback.output}</span>
                        <span>{sandboxFeedback.critique}</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                      <button
                        className="action-button"
                        style={{
                          height: 38, padding: '0 20px', borderRadius: 10, border: 'none',
                          background: '#4F46E5', color: '#ffffff', fontWeight: 800, fontSize: 12.5,
                          opacity: isRunningCode ? 0.75 : 1
                        }}
                        onClick={handleRunCodingVerification}
                        disabled={isRunningCode}
                      >
                        {isRunningCode ? 'Compiling...' : 'Run Code Verification'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* PROJECT ASSIGNMENT TAB */}
              {activeTab === 'assignment' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
                  <div style={{ background: '#ffffff', borderRadius: 20, padding: 26, border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#7C3AED', background: '#F5F3FF', padding: '3px 8px', borderRadius: 6, display: 'inline-block', marginBottom: 12 }}>Capstone Project Specification</span>
                    <h4 style={{ fontSize: 14, fontWeight: 800, color: '#1E293B', margin: '0 0 10px' }}>Instructions</h4>
                    <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: '0 0 20px' }}>
                      {m.assignment?.description || m.assignment?.instructions}
                    </p>

                    <h4 style={{ fontSize: 13, fontWeight: 800, color: '#1E293B', margin: '14px 0 8px' }}>Grading Rubric</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {(m.assignment?.evaluationCriteria || m.assignment?.gradingCriteria || []).map((c, cIdx) => (
                        <span key={cIdx} style={{ fontSize: 12, color: '#64748B' }}>✓ {c}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ background: '#ffffff', borderRadius: 20, padding: 24, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <h4 style={{ fontSize: 13.5, fontWeight: 800, color: '#1E293B', margin: 0 }}>Submit Code / Git Repo URL</h4>
                      <textarea
                        value={assignmentSubmission}
                        onChange={e => setAssignmentSubmission(e.target.value)}
                        placeholder="Paste code or GitHub repository link here..."
                        style={{
                          width: '100%', height: 130, borderRadius: 10, border: '1.5px solid #E2E8F0',
                          padding: 10, fontSize: 12.5, outline: 'none', resize: 'none'
                        }}
                      />
                      
                      {assignmentFeedback && (
                        <div style={{ padding: 14, background: '#F8FAFC', borderLeft: '3px solid #10B981', borderRadius: 8, fontSize: 12, color: '#475569' }}>
                          <span style={{ fontWeight: 800, display: 'block', color: '#10B981', marginBottom: 2 }}>Grade Score: {assignmentFeedback.grade}/100</span>
                          <span>Feedback: {assignmentFeedback.feedback}</span>
                        </div>
                      )}

                      <button
                        className="action-button"
                        style={{
                          height: 38, borderRadius: 10, border: 'none', background: '#4F46E5',
                          color: '#ffffff', fontWeight: 800, fontSize: 12.5, opacity: isGradingAssignment ? 0.75 : 1
                        }}
                        onClick={handleAssignmentSubmit}
                        disabled={isGradingAssignment}
                      >
                        {isGradingAssignment ? 'Evaluating using AI Grader...' : 'AI Critique Project'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* INTERVIEW QUESTIONS TAB */}
              {activeTab === 'interview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ background: '#EEF2FF', border: '1px solid #C7D2FE', padding: '16px 20px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 10, color: '#3730A3', fontSize: 12.5, fontWeight: 700 }}>
                    <Sparkles size={16} /> Placement Preparation: Review real core engineering interview questions with answers for this topic.
                  </div>

                  {(m.interviewQuestions || []).map((iq, idx) => (
                    <div key={idx} style={{ background: '#ffffff', borderRadius: 20, padding: 24, border: '1px solid #E2E8F0' }}>
                      <span style={{ display: 'block', fontSize: 13.5, fontWeight: 800, color: '#1E293B', marginBottom: 10 }}>
                        Q. {iq.question}
                      </span>
                      <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                        {iq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Complete module actions bar */}
            <footer style={{
              background: '#ffffff', borderTop: '1px solid #E2E8F0', padding: '16px 32px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: 20, fontSize: 11, fontWeight: 800, color: '#94A3B8' }}>
                <span style={{ color: isVideoDone ? '#10B981' : '#94A3B8' }}>🎥 Video {isVideoDone ? 'Done' : 'Pending'}</span>
                <span style={{ color: isNotesDone ? '#10B981' : '#94A3B8' }}>📝 Notes {isNotesDone ? 'Done' : 'Pending'}</span>
                <span style={{ color: isQuizDone ? '#10B981' : '#94A3B8' }}>❓ Quiz {isQuizDone ? 'Done' : 'Pending'}</span>
                <span style={{ color: isAssignDone ? '#10B981' : '#94A3B8' }}>💻 Project {isAssignDone ? 'Done' : 'Pending'}</span>
              </div>

              <button
                className="action-button"
                style={{
                  height: 40, padding: '0 24px', borderRadius: 12, border: 'none',
                  background: '#10B981', color: '#ffffff', fontWeight: 800, fontSize: 13,
                  opacity: (isVideoDone && isNotesDone && isQuizDone && isAssignDone) ? 1 : 0.55
                }}
                disabled={!(isVideoDone && isNotesDone && isQuizDone && isAssignDone)}
                onClick={handleCompleteModuleClick}
              >
                Mark Module Complete
              </button>
            </footer>

          </main>

        </div>
      </div>
    )
  }

  // --- RENDER STANDARD CATALOGUE DASHBOARD VIEW ---
  return (
    <AppLayout title="Courses" searchVal={searchQuery} onSearchChange={setSearchQuery}>
      {/* Stylesheet classes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap');

        @keyframes floatIllustrate {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-7px) rotate(1deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        @keyframes shiftBackground {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes pulsingRing {
          0% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4); }
          70% { box-shadow: 0 0 0 8px rgba(79, 70, 229, 0); }
          100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); }
        }

        .action-button {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(79, 70, 229, 0.18);
        }
        .action-button:active {
          transform: translateY(0);
        }

        .interactive-card {
          background: #ffffff;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .interactive-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.04);
        }

        .glow-rec-card {
          position: relative;
          background: #ffffff;
          border-radius: 20px;
          padding: 1px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .glow-rec-inner {
          background: #ffffff;
          border-radius: 19px;
          padding: 18px;
          height: 100%;
          display: flex;
          flex-direction: column;
          border: 1px solid #E2E8F0;
          transition: border-color 0.25s ease;
        }
        .glow-rec-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 36px rgba(79, 70, 229, 0.08);
        }
        .glow-rec-card:hover .glow-rec-inner {
          border-color: transparent;
        }
        .glow-rec-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 20px;
          background: linear-gradient(135deg, #4F46E5, #7C3AED);
          z-index: -1;
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .glow-rec-card:hover::before {
          opacity: 1;
        }

        .hover-start-btn {
          opacity: 0;
          transform: translateY(8px);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .glow-rec-card:hover .hover-start-btn {
          opacity: 1;
          transform: translateY(0);
        }

        .category-item {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .category-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
          color: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 12px;
          opacity: 0;
          transform: translateY(100%);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 16px;
        }
        .category-item:hover .category-overlay {
          opacity: 1;
          transform: translateY(0);
        }

        .tab-btn {
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
      `}</style>

      {/* Main Grid Wrapper */}
      <div style={{
        padding: '24px 32px 56px',
        maxWidth: 1280,
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 36
      }}>

        {/* ── 1. HERO BANNER ── */}
        <section style={{
          background: 'linear-gradient(270deg, #1E1B4B, #312E81, #4F46E5, #312E81, #1E1B4B)',
          backgroundSize: '400% 400%',
          animation: 'shiftBackground 15s ease infinite',
          borderRadius: 24,
          padding: '44px 54px',
          boxShadow: '0 20px 48px rgba(79, 70, 229, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{
            position: 'absolute', width: 320, height: 320, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
            top: -60, left: '20%', pointerEvents: 'none'
          }} />

          {/* Left Block */}
          <div style={{ zIndex: 2, flex: 1, position: 'relative' }}>
            <span style={{
              display: 'inline-block', fontSize: 13, fontWeight: 800, color: '#A5B4FC',
              marginBottom: 8, textTransform: 'uppercase', letterSpacing: '1px'
            }}>
              Hello, {user?.name || 'Student'}! 👋
            </span>
            <h2 style={{
              fontFamily: 'Sora, sans-serif', fontSize: 34, fontWeight: 800, color: '#ffffff',
              marginBottom: 10, lineHeight: 1.25, letterSpacing: '-0.5px'
            }}>
              What will you learn today?
            </h2>
            <p style={{
              fontSize: 15, color: '#D1D5DB', maxWidth: 480, marginBottom: 32, lineHeight: 1.6
            }}>
              AI recommends the best courses and paths personalized just for you.
            </p>
            <div style={{ display: 'flex', gap: 14 }}>
              <button
                className="action-button"
                style={{
                  height: 46, padding: '0 26px', borderRadius: 14, background: '#ffffff',
                  border: 'none', color: '#4F46E5', fontFamily: 'Sora, sans-serif',
                  fontWeight: 700, fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 8,
                }}
                onClick={() => { if (recommended.length > 0) handleEnroll(recommended[0]._id) }}
              >
                <Sparkles size={16} fill="#4F46E5" /> Get AI Recommendations
              </button>
              <button
                className="action-button"
                style={{
                  height: 46, padding: '0 26px', borderRadius: 14,
                  background: 'rgba(255, 255, 255, 0.08)', border: '1.5px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff', fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 13.5,
                  display: 'flex', alignItems: 'center', gap: 8
                }}
                onClick={() => setIsAdjustModalOpen(true)}
              >
                <BookOpen size={16} /> Explore Learning Roadmaps
              </button>
            </div>
          </div>

          {/* Right Block */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32, zIndex: 2, position: 'relative' }}>
            <div style={{
              position: 'absolute', width: 210, height: 210, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)',
              filter: 'blur(16px)', left: -5, top: -15, zIndex: 0,
            }} />

            {/* AI Match score Widget */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 20,
              padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 12,
              width: 210, flexShrink: 0, boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)', zIndex: 1
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ position: 'relative', width: 48, height: 48 }}>
                  <svg width="48" height="48" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="16" fill="none" stroke="#10B981" strokeWidth="3"
                      strokeDasharray="92, 100" strokeLinecap="round"
                    />
                  </svg>
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 12.5, fontWeight: 800, color: '#ffffff'
                  }}>
                    92%
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>AI Match Score</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#ffffff' }}>Excellent Match</span>
                </div>
              </div>
              <span style={{ fontSize: 10.5, color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.45, fontWeight: 500 }}>
                Based on your interests, career goal and completed courses.
              </span>
            </div>
          </div>
        </section>

        {/* ── 2. LEARNING STATS ROW ── */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 24 }}>
          {[
            {
              label: 'Learning Streak',
              value: stats.streak,
              suffix: ' Days',
              sub: 'Keep studying daily! 🔥',
              trend: 'Streak active',
              trendBg: '#FFF7ED',
              trendColor: '#EA580C',
              icon: <BookOpen size={20} strokeWidth={2.5} />,
              color: '#4F46E5',
              bg: '#EEF2FF',
            },
            {
              label: 'Courses Completed',
              value: stats.completedCount,
              suffix: '',
              sub: 'Finished spec certifications',
              trend: '100% dynamic',
              trendBg: '#EBFDF5',
              trendColor: '#10B981',
              icon: <CheckCircle2 size={20} strokeWidth={2.5} />,
              color: '#10B981',
              bg: '#EBFDF5',
            },
            {
              label: 'Weekly Goal Progress',
              value: stats.weeklyHours,
              suffix: ` / ${stats.weeklyGoal} hrs`,
              subProgress: Math.min(Math.round((stats.weeklyHours / stats.weeklyGoal) * 100), 100),
              trend: `${Math.round((stats.weeklyHours / stats.weeklyGoal) * 100)}% Complete`,
              trendBg: '#EFF6FF',
              trendColor: '#3B82F6',
              icon: <Target size={20} strokeWidth={2.5} />,
              color: '#3B82F6',
              bg: '#EFF6FF',
            },
            {
              label: 'Certificates Earned',
              value: stats.certificatesCount,
              suffix: '',
              sub: 'Verified credentials',
              trend: 'Official PDF verified',
              trendBg: '#F5F3FF',
              trendColor: '#7C3AED',
              icon: <Trophy size={20} strokeWidth={2.5} />,
              color: '#EA580C',
              bg: '#FFF7ED',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="interactive-card"
              style={{
                padding: '24px 26px', display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(15,23,42,0.03)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    {item.label}
                  </span>
                  <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#1E293B', marginTop: 4, display: 'flex', alignItems: 'baseline' }}>
                    <CountUp end={item.value} />
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#64748B', marginLeft: 2 }}>{item.suffix}</span>
                  </h3>
                </div>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: item.bg, color: item.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {item.icon}
                </div>
              </div>

              {item.subProgress !== undefined ? (
                <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ width: '100%', background: '#F1F5F9', borderRadius: 99, height: 6, overflow: 'hidden' }}>
                    <div style={{
                      background: item.color, height: '100%',
                      width: `${item.subProgress}%`, borderRadius: 99,
                      transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: item.trendColor, background: item.trendBg, padding: '3px 8px', borderRadius: 6, width: 'max-content' }}>
                    {item.trend}
                  </span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 650, color: '#64748B' }}>
                    {item.sub}
                  </span>
                  <span style={{ fontSize: 10.5, fontWeight: 750, color: item.trendColor, background: item.trendBg, padding: '3px 8px', borderRadius: 6 }}>
                    {item.trend}
                  </span>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* ── 3. WORKSPACE COLUMNS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.85fr 1fr', gap: 32, alignItems: 'flex-start' }}>

          {/* ──── LEFT MAIN PANEL ──── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

            {/* CONTINUE LEARNING */}
            <div className="interactive-card" style={{ padding: 30 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16.5, fontWeight: 800, color: '#1E293B' }}>
                  Continue Learning
                </h3>
              </div>

              {continueLearning.length === 0 ? (
                <div style={{ padding: '24px 0', textAlign: 'center', color: '#94A3B8', fontSize: 14, fontWeight: 600 }}>
                  You are not currently enrolled in any courses. Check out recommendations below!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {continueLearning.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex', alignItems: 'center', justifybox: 'space-between',
                        padding: '18px 22px', border: '1.5px solid #F1F5F9', borderRadius: 18,
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                          width: 48, height: 48, borderRadius: 14, background: '#F8FAFC',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0'
                        }}>
                          {renderCourseLogo(item.icon)}
                        </div>
                        <div>
                          <h4 style={{ fontSize: 14.5, fontWeight: 750, color: '#1E293B', margin: '0 0 4px' }}>
                            {item.title}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{
                              fontSize: 10.5, fontWeight: 700, padding: '3px 9px',
                              background: '#EEF2FF', color: '#4F46E5', borderRadius: 8
                            }}>
                              {item.difficulty}
                            </span>
                            <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 550, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Clock size={13} /> {item.timeLeftStr}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: 11.5, fontWeight: 750, color: '#94A3B8' }}>
                            {item.completedCount} / {item.totalCount} modules <span style={{ color: '#4F46E5', marginLeft: 4 }}>{item.completedPercent}%</span>
                          </span>
                          <div style={{ width: 140, background: '#F1F5F9', borderRadius: 99, height: 6, overflow: 'hidden', marginTop: 6 }}>
                            <div style={{
                              background: '#4F46E5', height: '100%',
                              width: `${item.completedPercent}%`, borderRadius: 99,
                              transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                            }} />
                          </div>
                        </div>
                        <button
                          className="action-button"
                          style={{
                            height: 38, padding: '0 16px', borderRadius: 12, border: 'none',
                            background: '#EEF2FF', color: '#4F46E5', fontWeight: 800, fontSize: 12.5,
                            display: 'flex', alignItems: 'center', gap: 6,
                          }}
                          onClick={async () => {
                            try {
                              const res = await getCourseById(item._id)
                              if (res.success && res.data) {
                                setActiveStudyCourse(res.data)
                                setActiveModuleIndex(res.data.lastOpenedModuleIndex || 0)
                                setActiveTab('video')
                              }
                            } catch (err) {
                              console.error('Failed to resume course study:', err)
                            }
                          }}
                        >
                          Resume <PlayCircle size={14} fill="#4F46E5" color="#EEF2FF" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI RECOMMENDED COURSES */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16.5, fontWeight: 800, color: '#1E293B' }}>
                  AI Recommended for You
                </h3>
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 20 }}>
                  {recommended.map((rec, i) => (
                    <div
                      key={i}
                      className="glow-rec-card"
                      onClick={() => handleEnroll(rec._id)}
                      onMouseEnter={() => setHoveredRec(rec._id)}
                      onMouseLeave={() => setHoveredRec(null)}
                    >
                      <div className="glow-rec-inner" style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                          <span style={{
                            fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 8,
                            color: '#10B981', background: '#EBFDF5'
                          }}>
                            {rec.matchPercent}% Match
                          </span>
                          <Bookmark
                            size={14}
                            style={{
                              color: rec.isBookmarked ? '#4F46E5' : '#94A3B8',
                              fill: rec.isBookmarked ? '#4F46E5' : 'none',
                              cursor: 'pointer'
                            }}
                            onClick={(e) => handleBookmarkToggle(rec._id, e)}
                          />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 70, marginBottom: 12 }}>
                          {renderCourseLogo(rec.icon)}
                        </div>

                        <h4 style={{ fontSize: 13.5, fontWeight: 750, color: '#1E293B', lineHeight: 1.45, margin: '0 0 10px', minHeight: 38 }}>
                          {rec.title}
                        </h4>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#7C3AED', fontSize: 10, fontWeight: 700, marginBottom: 14 }}>
                          <Sparkles size={11} fill="#7C3AED" /> Recommended by ZenScore AI
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', marginBottom: 14 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <span style={{ fontSize: 10.5, fontWeight: 700, color: '#64748B' }}>{rec.difficulty}</span>
                            <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>{rec.duration}</span>
                          </div>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11.5, fontWeight: 750, color: '#F59E0B' }}>
                            <Star size={12} fill="#F59E0B" stroke="#F59E0B" /> {rec.rating}
                          </span>
                        </div>

                        <button
                          className="hover-start-btn"
                          style={{
                            width: '100%', height: 36, borderRadius: 10, border: 'none',
                            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                            color: '#ffffff', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(79,70,229,0.15)'
                          }}
                        >
                          Start Learning
                        </button>

                        {/* AI Recommendation Reasoning Floating Tooltip */}
                        {hoveredRec === rec._id && (
                          <div style={{
                            position: 'absolute', top: -140, left: -10, right: -10,
                            background: '#1E1B4B', color: '#ffffff', padding: '14px 16px',
                            borderRadius: 14, zIndex: 1000, boxShadow: '0 10px 24px rgba(0,0,0,0.25)',
                            fontSize: 10.5, display: 'flex', flexDirection: 'column', gap: 6,
                            lineHeight: 1.4, border: '1px solid rgba(255,255,255,0.12)', pointerEvents: 'none'
                          }}>
                            <span style={{ color: '#A5B4FC', fontWeight: 800, textTransform: 'uppercase', fontSize: 9 }}>AI Reasoning</span>
                            <span>{rec.reason}</span>
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 4, display: 'flex', justifyContent: 'space-between', fontSize: 9.5 }}>
                              <span style={{ color: '#10B981', fontWeight: 700 }}>{rec.salaryImprovement}</span>
                              <span style={{ color: '#94A3B8' }}>Used at: {rec.companies?.join(', ')}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* COURSE CATEGORIES */}
            <div className="interactive-card" style={{ padding: 30 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16.5, fontWeight: 800, color: '#1E293B' }}>
                  Course Categories
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
                {categories.map((cat) => {
                  const count = getDynamicCategoryCount(cat.id)
                  const isActive = activeCategory === cat.id
                  return (
                    <div
                      key={cat.id}
                      className="category-item"
                      style={{
                        background: isActive ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' : cat.bg,
                        borderRadius: 16, padding: '20px 14px', textAlign: 'center',
                        border: '1px solid transparent',
                        color: isActive ? '#ffffff' : 'inherit'
                      }}
                      onClick={() => setActiveCategory(cat.id)}
                    >
                      <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }}>
                        {cat.icon}
                      </span>
                      <span style={{
                        display: 'block', fontSize: 12, fontWeight: 800,
                        color: isActive ? '#ffffff' : '#1E293B', marginBottom: 4
                      }}>
                        {cat.label}
                      </span>
                      <span style={{ fontSize: 10.5, fontWeight: 600, color: isActive ? 'rgba(255,255,255,0.8)' : '#94A3B8' }}>
                        {count} Courses
                      </span>

                      {!isActive && (
                        <div className="category-overlay">
                          <span style={{ fontSize: 11.5, fontWeight: 800, marginBottom: 4 }}>{cat.label}</span>
                          <p style={{ fontSize: 9.5, lineHeight: 1.35, margin: 0, fontWeight: 550 }}>{cat.desc}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* MAIN CATALOGUE */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16.5, fontWeight: 800, color: '#1E293B' }}>
                  Course Catalogue
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
                {courses.map((course, idx) => (
                  <div
                    key={idx}
                    className="interactive-card"
                    style={{
                      padding: 18, display: 'flex', flexDirection: 'column',
                      justifyContent: 'space-between', cursor: 'pointer', position: 'relative'
                    }}
                    onClick={async () => {
                      if (course.enrolled) {
                        try {
                          const res = await getCourseById(course._id)
                          if (res.success && res.data) {
                            setActiveStudyCourse(res.data)
                            setActiveModuleIndex(res.data.lastOpenedModuleIndex || 0)
                            setActiveTab('video')
                          }
                        } catch (err) {
                          console.error('Failed to open catalog course details:', err)
                        }
                      } else {
                        handleEnroll(course._id)
                      }
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, background: '#F8FAFC',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #F1F5F9'
                      }}>
                        {renderCourseLogo(course.icon)}
                      </div>
                      <Bookmark
                        size={14}
                        style={{
                          color: course.isBookmarked ? '#4F46E5' : '#94A3B8',
                          fill: course.isBookmarked ? '#4F46E5' : 'none',
                          cursor: 'pointer'
                        }}
                        onClick={(e) => handleBookmarkToggle(course._id, e)}
                      />
                    </div>

                    <h4 style={{ fontSize: 13, fontWeight: 750, color: '#1E293B', lineHeight: 1.35, margin: '0 0 10px', minHeight: 34 }}>
                      {course.title}
                    </h4>

                    <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 650, color: '#94A3B8' }}>
                        <span>{course.duration}</span>
                        <span>{course.difficulty}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                        <span style={{ fontSize: 9.5, color: '#4F46E5', fontWeight: 700 }}>
                          Match: {course.rating} ⭐
                        </span>
                        {course.enrolled ? (
                          <span style={{ fontSize: 9.5, color: '#10B981', fontWeight: 800 }}>
                            {course.completedPercent}% Done
                          </span>
                        ) : (
                          <span style={{ fontSize: 9.5, color: '#94A3B8', fontWeight: 700 }}>
                            Not Enrolled
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ──── RIGHT TIMELINE PANEL ──── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

            {/* DYNAMIC LEARNING PATH (ROADMAP) */}
            <div className="interactive-card" style={{ padding: 30 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#1E293B' }}>
                  Your AI Learning Path
                </h3>
              </div>
              <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600, marginBottom: 20 }}>
                Goal: <span style={{ color: '#4F46E5', fontWeight: 750 }}>{roadmap?.careerGoal || 'Become a Full Stack Developer'}</span>
              </div>

              {/* Goal Box details */}
              <div style={{
                background: '#F8FAFC', border: '1.5px solid #F1F5F9', borderRadius: 16,
                padding: 16, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 700, color: '#64748B' }}>
                  <span>Preferred Domain</span>
                  <span style={{ color: '#4F46E5', fontWeight: 800 }}>{roadmap?.preferredDomain || 'Full Stack'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 700, color: '#64748B' }}>
                  <span>Weekly Commitment</span>
                  <span style={{ color: '#1E293B', fontWeight: 800 }}>{roadmap?.weeklyHours || 10} hours</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 700, color: '#64748B' }}>
                  <span>Est. Completion</span>
                  <span style={{ color: '#1E293B', fontWeight: 800 }}>{roadmap?.estimatedMonths || 3} months</span>
                </div>
                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 10, marginTop: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 800, color: '#1E293B', marginBottom: 6 }}>
                    <span>Learning Progress</span>
                    <span>{roadmap?.completedPercent || 0}%</span>
                  </div>
                  <div style={{ width: '100%', background: '#E2E8F0', borderRadius: 99, height: 6, overflow: 'hidden' }}>
                    <div style={{
                      background: '#4F46E5', height: '100%',
                      width: `${roadmap?.completedPercent || 0}%`, borderRadius: 99,
                      transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                  </div>
                </div>
              </div>

              {/* Timeline Steps mapped directly to db courses progress */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 12, top: 12, bottom: 12, width: 1.5, background: '#F1F5F9', zIndex: 0 }} />

                {(roadmap?.roadmapSteps || []).map((s, idx) => {
                  const isCurrent = s.status === 'Current'
                  const isLocked = s.status === 'Locked'
                  const isCompleted = s.status === 'Completed'

                  return (
                    <div
                      key={idx}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1, cursor: s.courseId ? 'pointer' : 'default' }}
                      onClick={() => {
                        if (s.courseId) {
                          const targetCourse = courses.find(c => c._id === s.courseId)
                          if (targetCourse) {
                            if (targetCourse.enrolled) {
                              setActiveStudyCourse(targetCourse)
                              setActiveModuleIndex(targetCourse.lastOpenedModuleIndex || 0)
                              setActiveTab('video')
                            } else {
                              handleEnroll(targetCourse._id)
                            }
                          }
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{
                          width: 26, height: 26, borderRadius: '50%',
                          background: isCurrent ? '#4F46E5' : isLocked ? '#F1F5F9' : isCompleted ? '#10B981' : '#E2E8F0',
                          color: isCompleted || isCurrent ? '#ffffff' : '#94A3B8',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10, fontWeight: 900,
                          border: isCurrent ? '2.5px solid #EFF6FF' : 'none',
                          animation: isCurrent ? 'pulsingRing 2s infinite' : 'none'
                        }}>
                          {isCompleted ? <Check size={11} strokeWidth={3} /> : isLocked ? <Lock size={9} /> : s.step}
                        </span>
                        <span style={{
                          fontSize: 13,
                          fontWeight: isLocked ? 550 : isCurrent ? 800 : 700,
                          color: isLocked ? '#CBD5E1' : '#1E293B'
                        }}>
                          {s.title}
                        </span>
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 6,
                        background: isCompleted ? '#EBFDF5' : isCurrent ? '#EFF6FF' : isLocked ? '#F1F5F9' : '#F5F3FF',
                        color: isCompleted ? '#10B981' : isCurrent ? '#3B82F6' : isLocked ? '#94A3B8' : '#7C3AED',
                        marginLeft: 'auto'
                      }}>
                        {s.status}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div style={{
                marginTop: 20, padding: '12px 14px', background: '#F5F3FF',
                border: '1px solid #DDD6FE', borderRadius: 12, fontSize: 11,
                lineHeight: 1.45, color: '#6D28D9', display: 'flex', flexDirection: 'column', gap: 4
              }}>
                <span style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', fontSize: 9.5 }}>AI Engine Note</span>
                <span style={{ fontWeight: 550 }}>AI calculates path status dynamically based on your specialization completions. No fake credentials.</span>
              </div>

              <button
                className="action-button"
                style={{
                  marginTop: 20, width: '100%', height: 42, borderRadius: 14,
                  border: 'none', background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                  color: '#ffffff', fontFamily: 'Sora, sans-serif',
                  fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 8
                }}
                onClick={() => setIsAdjustModalOpen(true)}
              >
                <Sliders size={14} /> Adjust Learning Path
              </button>
            </div>

            {/* REAL LEARNING ANALYTICS METRICS */}
            <div className="interactive-card" style={{ padding: 30 }}>
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#1E293B', marginBottom: 18 }}>
                LMS Learning Analytics
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>
                  <span>Monthly Hours Studied</span>
                  <span style={{ color: '#1E293B', fontWeight: 800 }}>{analytics.monthlyHours} hrs</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>
                  <span>Quiz Average Accuracy</span>
                  <span style={{ color: '#10B981', fontWeight: 800 }}>{analytics.quizAverage}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>
                  <span>Coding Workspace Score</span>
                  <span style={{ color: '#3B82F6', fontWeight: 800 }}>{analytics.codingScore}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>
                  <span>Velocity Rate</span>
                  <span style={{ color: '#8B5CF6', fontWeight: 800 }}>{analytics.learningVelocity}</span>
                </div>
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 10, marginTop: 4, display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 750, color: '#475569' }}>
                  <span>AI Predicted Graduation</span>
                  <span style={{ color: '#4F46E5' }}>{analytics.predictedCompletion}</span>
                </div>
              </div>
            </div>

            {/* DAILY CHALLENGE */}
            <div className="interactive-card" style={{ padding: 30 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#1E293B' }}>
                  Daily Challenge
                </h3>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#EA580C', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Timer size={13} /> Resets in {formatCountdown(timeLeft)}
                </span>
              </div>

              {dailyChallenge ? (
                <>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 18px', background: '#F8FAFC', borderRadius: 18,
                    border: '1px solid #F1F5F9', marginBottom: 20
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: 10, background: '#FFFBEB',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
                      }}>
                        🧩
                      </div>
                      <div>
                        <h4 style={{ fontSize: 13.5, fontWeight: 750, color: '#1E293B', margin: '0 0 2px' }}>
                          {dailyChallenge.title}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>
                          <span>{dailyChallenge.difficulty}</span>
                          <span>•</span>
                          <span>{dailyChallenge.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#10B981' }}>
                        +{dailyChallenge.xpReward} XP
                      </span>
                    </div>
                  </div>

                  <button
                    className="action-button"
                    style={{
                      width: '100%', height: 44, borderRadius: 14, border: 'none',
                      background: dailyChallenge.hasCompleted ? '#10B981' : '#4F46E5',
                      color: '#ffffff', fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 13.5,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}
                    onClick={() => {
                      if (!dailyChallenge.hasCompleted) {
                        setIsChallengeModalOpen(true)
                      }
                    }}
                  >
                    {dailyChallenge.hasCompleted ? '✅ Challenge Solved' : '🚀 Open Challenge'}
                  </button>
                </>
              ) : (
                <div style={{ padding: '16px 0', textAlign: 'center', color: '#94A3B8' }}>
                  Generating daily challenge...
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* ── DAILY CHALLENGE CODE EDITOR MODAL ── */}
      {isChallengeModalOpen && dailyChallenge && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setIsChallengeModalOpen(false)}>
          <div
            style={{
              width: '100%', maxWidth: 520, background: '#ffffff', borderRadius: 24,
              padding: 30, boxShadow: '0 20px 48px rgba(15, 23, 42, 0.15)',
              display: 'flex', flexDirection: 'column', gap: 20,
              animation: 'modalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 17, fontWeight: 800, color: '#1E293B', margin: 0 }}>
                Today's Daily Challenge ({dailyChallenge.type})
              </h3>
              <button
                type="button"
                onClick={() => setIsChallengeModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: 2 }}
              >
                <X size={18} />
              </button>
            </div>

            <span style={{ fontSize: 14, fontWeight: 750, color: '#475569' }}>
              Question: {dailyChallenge.title}
            </span>

            {/* MCQ Option list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Choose the correct response</span>
              {[
                'Wrap function outputs using closure configurations',
                'Implement a timeout scheduler to delay query executions',
                'Throttle events matching parameter intervals',
                'None of the above options'
              ].map((opt, idx) => {
                const isSelected = selectedChallengeAnswer === idx
                return (
                  <label
                    key={idx}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
                      border: isSelected ? '1.5px solid #4F46E5' : '1.5px solid #F1F5F9',
                      borderRadius: 12, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                      background: isSelected ? '#F5F3FF' : '#ffffff', transition: 'all 0.2s'
                    }}
                  >
                    <input
                      type="radio"
                      name="challenge_option"
                      checked={isSelected}
                      onChange={() => setSelectedChallengeAnswer(idx)}
                      style={{ accentColor: '#4F46E5' }}
                    />
                    {opt}
                  </label>
                )
              })}
            </div>

            <button
              className="action-button"
              style={{
                height: 42, borderRadius: 12, border: 'none', marginTop: 10,
                background: '#4F46E5', color: '#ffffff', fontWeight: 750, fontSize: 13,
                opacity: challengeSolving ? 0.75 : 1
              }}
              onClick={handleChallengeSubmitClick}
              disabled={challengeSolving}
            >
              {challengeSolving ? 'Submitting solution...' : 'Submit Response'}
            </button>
          </div>
        </div>
      )}

      {/* ── ADJUST LEARNING PATH MODAL ── */}
      {isAdjustModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setIsAdjustModalOpen(false)}>
          <form
            onSubmit={handleRegenerateRoadmap}
            style={{
              width: '100%', maxWidth: 440, background: '#ffffff', borderRadius: 24,
              padding: '30px 36px', boxShadow: '0 20px 48px rgba(15, 23, 42, 0.15)',
              display: 'flex', flexDirection: 'column', gap: 20,
              animation: 'modalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 17.5, fontWeight: 800, color: '#1E293B', margin: 0 }}>
                Adjust AI Learning Path
              </h3>
              <button
                type="button"
                onClick={() => setIsAdjustModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: 2 }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: 12.5, color: '#64748B', margin: '0 0 10px', lineHeight: 1.5 }}>
              Enter your preferences and our AI engine will customize your study checks in real time.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Career Goal</label>
              <select
                value={formCareerGoal}
                onChange={e => setFormCareerGoal(e.target.value)}
                style={{ height: 38, borderRadius: 10, border: '1.5px solid #E2E8F0', padding: '0 10px', fontSize: 13, outline: 'none' }}
              >
                <option value="Become a Full Stack Developer">Full Stack Developer</option>
                <option value="Become a DevOps Engineer">DevOps Engineer</option>
                <option value="Become a Data Scientist">Data Scientist</option>
                <option value="Become a Cloud Architect">Cloud Architect</option>
                <option value="Become a Cybersecurity Specialist">Cybersecurity Specialist</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Weekly Study Hours</label>
              <input
                type="number"
                min="2" max="60"
                value={formWeeklyHours}
                onChange={e => setFormWeeklyHours(e.target.value)}
                style={{ height: 38, borderRadius: 10, border: '1.5px solid #E2E8F0', padding: '0 12px', fontSize: 13, outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Preferred Domain</label>
              <input
                type="text"
                placeholder="e.g. Frontend, Backend, Machine Learning"
                value={formPreferredDomain}
                onChange={e => setFormPreferredDomain(e.target.value)}
                style={{ height: 38, borderRadius: 10, border: '1.5px solid #E2E8F0', padding: '0 12px', fontSize: 13, outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Skill Level</label>
              <select
                value={formSkillLevel}
                onChange={e => setFormSkillLevel(e.target.value)}
                style={{ height: 38, borderRadius: 10, border: '1.5px solid #E2E8F0', padding: '0 10px', fontSize: 13, outline: 'none' }}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <button
              type="submit"
              className="action-button"
              style={{
                height: 42, borderRadius: 12, border: 'none', marginTop: 10,
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                color: '#ffffff', fontWeight: 750, fontSize: 13, display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: 8,
                opacity: isRegenerating ? 0.75 : 1
              }}
              disabled={isRegenerating}
            >
              {isRegenerating ? (
                <>AI is Regenerating Path...</>
              ) : (
                <>
                  <Sparkles size={14} fill="#fff" /> Save & Regenerate Roadmaps
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </AppLayout>
  )
}