import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft, Video, FileText, Book, Code, Trophy, Sparkles, Award, Lock, Zap, Coins, Check,
  AlertCircle, CheckCircle2, Compass, ArrowRight, Copy, ExternalLink, Bot, MessageSquare,
  Save, RefreshCw, X, Lightbulb, BookOpen, Layers, Send, User, ChevronRight, CornerDownRight,
  ChevronDown, RotateCcw, CheckSquare, XCircle, BarChart3, HelpCircle, History, Play, Terminal, Trash2
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getCourseById,
  completeModuleVideo,
  completeModuleNotes,
  submitModuleQuiz,
  getModuleQuiz,
  getQuizResults,
  getModuleCoding,
  evaluateCodingExercise,
  saveModuleCodingDraft,
  getModuleProject,
  runModuleProjectTests,
  submitModuleProject,
  saveModuleProjectDraft,
  submitModuleAssignment,
  completeModule,
  enrollInCourse,
  getCourseStats,
  getModuleStudyNote,
  saveModuleStudyNote,
  askCourseModuleAITutor
} from '../../services/api'
import { updateLastOpenedModule, getCourses } from '../../services/courses/coursesService'

const extractYtId = (str) => {
  if (!str) return null
  const m = String(str).match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
  if (m && m[1]) return m[1]
  if (typeof str === 'string' && str.length === 11 && str !== 'Ke90Tje7VS0') return str
  return null
}

const COURSE_TOPIC_VIDEO_MAP = {
  cybersecurity: [
    'inWWhr5tnEA', // Cybersecurity Full Course
    '3Kq1MIfTWCE', // Cryptography & SHA-256
    'z5nc9MDxHgU', // Network Security & Firewalls
    'bPVaOlJ6ln0', // Ethical Hacking & Kali
    '2_lswM1S264', // Web Application Security (OWASP)
    'U_P23dqP9gw', // Penetration Testing
    '6mkmL4bTszM', // Cloud Security Architecture
    'hXSFdwIOfnE'  // Security Operations & Incident Response
  ],
  web: [
    'nu_pCVPKzTk', // Full Stack Web Development
    'w7ejDZ8SWv8', // React JS Deep Dive
    'Oe421EPjeBE', // Node.js & Express REST APIs
    'PkZNo7MFNFg', // JavaScript Architecture & Event Loop
    'c9tGq7V73oQ', // TypeScript Mastery
    'Law7wfdg_ls', // CSS Grid & Modern UI
    'G3e-cpL7ofc'  // Full Stack Deployment
  ],
  python: [
    'rfscVS0vtbw', // Python Full Course
    '_uQrJ0TkZlc', // Python Data Structures & OOP
    'HGOBQPFzWKo', // FastAPI & Modern Backend
    'kqtD5dpn9C8', // Python for Automation
    'WGJDN4Tk9V0'  // Python Algorithms
  ],
  machine_learning: [
    'i_LwzRVP7bg', // Machine Learning for Beginners
    'Gv9_4yMHFhI', // Neural Networks from Scratch
    'JcI5Vnw0b2c', // Deep Learning & PyTorch
    'aircAruvnKk', // Large Language Models
    'ukzFI9rgwfU'  // MLOps & Production Pipelines
  ],
  cloud_devops: [
    '3hLmDS179YE', // AWS Certified Solutions Architect
    'ulprqHHWlng', // Docker & Containerization
    'fqMOX6JJhGo', // Kubernetes in 100 Seconds & Deep Dive
    'hQcFE0RD0cQ', // CI/CD Pipelines & GitHub Actions
    'j5Zsa_eOXJg', // Terraform & Infrastructure as Code
    'Wf2eSG3owoA'  // Linux System Administration
  ],
  system_design: [
    'bUHFg8CZFws', // System Design Interview Preparation
    'i53Gi_K3o7I', // Distributed Caching & Redis
    'UzLMhqg3_Wc', // Message Queues & Apache Kafka
    'xpDnVSmDvn0', // Database Sharding & Replication
    'M8p6g2H4v7g'  // High Availability & Load Balancing
  ],
  database: [
    'HXV3zeRR3h4', // SQL Tutorial - Full Database Course
    '7S_tz1z_5bA', // PostgreSQL Database Design
    'p3qvj9hO_Bo', // MongoDB Aggregations
    'KlWOr2kgLBg'  // Indexing & Query Optimization
  ]
}

const resolveYouTubeId = (moduleItem, courseData, moduleIdx = 0) => {
  if (moduleItem?.video?.youtubeId) {
    const id = extractYtId(moduleItem.video.youtubeId)
    if (id) return id
  }
  if (moduleItem?.videoUrl) {
    const id = extractYtId(moduleItem.videoUrl)
    if (id) return id
  }

  const text = `${courseData?.title || ''} ${courseData?.category || ''} ${courseData?.technology || ''} ${moduleItem?.title || ''}`.toLowerCase()
  let pool = COURSE_TOPIC_VIDEO_MAP.web

  if (text.includes('cyber') || text.includes('security') || text.includes('crypto') || text.includes('rsa') || text.includes('hash') || text.includes('hack') || text.includes('networkchuck')) {
    pool = COURSE_TOPIC_VIDEO_MAP.cybersecurity
  } else if (text.includes('machine') || text.includes('ai') || text.includes('learning') || text.includes('data') || text.includes('neural')) {
    pool = COURSE_TOPIC_VIDEO_MAP.machine_learning
  } else if (text.includes('python') || text.includes('django') || text.includes('fastapi')) {
    pool = COURSE_TOPIC_VIDEO_MAP.python
  } else if (text.includes('cloud') || text.includes('devops') || text.includes('docker') || text.includes('kubernetes') || text.includes('aws')) {
    pool = COURSE_TOPIC_VIDEO_MAP.cloud_devops
  } else if (text.includes('system') || text.includes('architect') || text.includes('distributed')) {
    pool = COURSE_TOPIC_VIDEO_MAP.system_design
  } else if (text.includes('sql') || text.includes('database') || text.includes('mongo') || text.includes('postgres')) {
    pool = COURSE_TOPIC_VIDEO_MAP.database
  }

  const idx = typeof moduleIdx === 'number' ? moduleIdx : 0
  return pool[idx % pool.length]
}

export default function CourseDetail() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [course, setCourse] = useState(null)
  const [stats, setStats] = useState({ level: 1, coins: 0 })
  const [loading, setLoading] = useState(true)
  const [activeModuleIndex, setActiveModuleIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('video')
  const [mobileWorkspaceTab, setMobileWorkspaceTab] = useState('lesson') // 'lesson' | 'syllabus'
  const [actionLoading, setActionLoading] = useState(false)

  // Learning Checkpoint State (Phase 2)
  const [selectedCheckpointOption, setSelectedCheckpointOption] = useState(null)
  const [checkpointSubmitted, setCheckpointSubmitted] = useState(false)
  const [checkpointPassed, setCheckpointPassed] = useState(false)

  // AI Tutor Drawer State
  const [isTutorOpen, setIsTutorOpen] = useState(false)
  const [tutorMessages, setTutorMessages] = useState([])
  const [tutorInput, setTutorInput] = useState('')
  const [tutorLoading, setTutorLoading] = useState(false)

  // Personal Study Notes Drawer State
  const [isNotesDrawerOpen, setIsNotesDrawerOpen] = useState(false)
  const [studyNoteText, setStudyNoteText] = useState('')
  const [noteSaving, setNoteSaving] = useState(false)
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false)

  // Phase 3 Practice Quiz State
  const [quizQuestions, setQuizQuestions] = useState([])
  const [activeQuizQuestionIdx, setActiveQuizQuestionIdx] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizGradeResult, setQuizGradeResult] = useState(null)
  const [quizAttemptHistory, setQuizAttemptHistory] = useState([])
  const [bestQuizScore, setBestQuizScore] = useState(0)
  const [showReviewMode, setShowReviewMode] = useState(false)

  // ── PHASE 4 REAL CODING WORKSPACE STATE ──
  const [codingExercise, setCodingExercise] = useState(null)
  const [codeSnippet, setCodeSnippet] = useState('')
  const [originalStarterCode, setOriginalStarterCode] = useState('')
  const [codeExecutionRunning, setCodeExecutionRunning] = useState(false)
  const [codingFeedback, setCodingFeedback] = useState(null)
  const [testResults, setTestResults] = useState([])
  const [stdoutOutput, setStdoutOutput] = useState('')
  const [stderrOutput, setStderrOutput] = useState('')
  const [executionTime, setExecutionTime] = useState(null)
  const [revealedHints, setRevealedHints] = useState([])
  const [showResetModal, setShowResetModal] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)

  // ── PHASE 5 REAL AI PROJECT GRADER & VALIDATION STATE ──
  const [projectSpec, setProjectSpec] = useState(null)
  const [projectCode, setProjectCode] = useState('')
  const [projectOriginalStarter, setProjectOriginalStarter] = useState('')
  const [projectTestingRunning, setProjectTestingRunning] = useState(false)
  const [projectGradingRunning, setProjectGradingRunning] = useState(false)
  const [projectTestResults, setProjectTestResults] = useState([])
  const [projectStdout, setProjectStdout] = useState('')
  const [projectStderr, setProjectStderr] = useState('')
  const [projectExecutionTime, setProjectExecutionTime] = useState(null)
  const [projectGradingResult, setProjectGradingResult] = useState(null)
  const [projectBestScore, setProjectBestScore] = useState(0)
  const [projectPassed, setProjectPassed] = useState(false)
  const [showProjectResetModal, setShowProjectResetModal] = useState(false)
  const [projectCopied, setProjectCopied] = useState(false)

  // Legacy fallback
  const [assignmentSubmission, setAssignmentSubmission] = useState('')
  const [assignmentFeedback, setAssignmentFeedback] = useState(null)
  const [resumedBanner, setResumedBanner] = useState(null)

  const lessonContentRef = useRef(null)

  const loadCourseData = useCallback(async (isInitial = true) => {
    if (isInitial) setLoading(true)
    try {
      let cData = null

      const [resCourse, resStats] = await Promise.all([
        getCourseById(courseId).catch((err) => {
          console.error("getCourseById error:", err)
          return null
        }),
        getCourseStats().catch(() => ({ stats: { level: 1, coins: 0 } }))
      ])

      if (resCourse) {
        cData = resCourse.data || resCourse.course || (resCourse._id ? resCourse : null)
      }

      if (!cData) {
        const allCoursesRes = await getCourses().catch(() => null)
        const allCourses = allCoursesRes?.data || []
        const matched = allCourses.find(c => String(c._id) === String(courseId) || String(c.id) === String(courseId))
        if (matched) {
          cData = matched
        } else {
          cData = {
            _id: courseId || 'cs101',
            title: courseId ? (courseId.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())) : 'CS101: Full Stack Web Architecture',
            instructor: 'Dr. Sarah Chen',
            category: 'Computer Science',
            technology: 'JavaScript',
            enrolled: true,
            completedPercent: 25,
            completedModules: ['0'],
            modules: [
              {
                id: 'mod-1',
                title: 'Module 1: Client-Server Protocols & HTTP/3',
                description: 'Deep dive into asynchronous event loops, TLS handshakes, and modern HTTP/3 multiplexing.',
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                studyNotes: '# Core Networking & Architecture\n\nHTTP/3 uses QUIC over UDP for zero-RTT connection resumption.',
                quiz: [
                  {
                    id: 'q1',
                    question: 'What underlying transport protocol does HTTP/3 utilize?',
                    options: ['TCP', 'UDP (QUIC)', 'WebSockets', 'SCTP'],
                    correctAnswer: 1,
                    explanation: 'HTTP/3 is built on top of QUIC which operates over UDP to prevent head-of-line blocking.'
                  }
                ],
                codingExercise: {
                  title: 'High-Throughput Connection Pooler',
                  instruction: 'Write a connection pooling throttle function that executes promises with a maximum concurrency limit.',
                  starterCode: 'function createPooler(limit) {\n  // Implement concurrent pooler\n  return {\n    exec: async (fn) => {}\n  };\n}',
                  testCases: [{ description: 'Executes within concurrency bound', passed: true }]
                }
              },
              {
                id: 'mod-2',
                title: 'Module 2: Microservices & Distributed Data Consistency',
                description: 'Event-driven architecture with Apache Kafka and 2-phase commit patterns.'
              },
              {
                id: 'mod-3',
                title: 'Module 3: Cloud Native Deployment & Kubernetes Clusters',
                description: 'Horizontal Pod Autoscalers, ingress controllers, and service meshes.'
              },
              {
                id: 'mod-4',
                title: 'Module 4: Real-time Data Streaming with WebSockets & gRPC',
                description: 'Bi-directional streaming RPCs and Protocol Buffers serialization.'
              }
            ]
          }
        }
      }

      if (cData) {
        setCourse(cData)

        // Auto-enroll if not enrolled
        if (!cData.enrolled) {
          enrollInCourse(cData._id || courseId).catch(() => {})
        }

        if (isInitial) {
          const urlParams = new URLSearchParams(window.location.search)
          const queryModIdx = urlParams.get('moduleIndex')
          const parsedQueryIdx = queryModIdx !== null ? parseInt(queryModIdx, 10) : NaN
          const requestedIdx = !isNaN(parsedQueryIdx) ? parsedQueryIdx : (cData.lastOpenedModuleIndex !== undefined ? cData.lastOpenedModuleIndex : 0)

          // ── MODULE URL GATING ──
          let safeModuleIdx = Math.min(Math.max(0, requestedIdx), (cData.modules?.length || 1) - 1)
          while (safeModuleIdx > 0 && !cData.completedModules?.includes(String(safeModuleIdx - 1))) {
            safeModuleIdx--
          }

          setActiveModuleIndex(safeModuleIdx)
          if (safeModuleIdx !== requestedIdx && requestedIdx > 0) {
            setResumedBanner(`🔒 Module ${requestedIdx + 1} is locked. Resuming from Module ${safeModuleIdx + 1}.`)
          } else if (cData.modules?.[safeModuleIdx]?.title) {
            setResumedBanner(cData.modules[safeModuleIdx].title)
          }

          const urlStage = urlParams.get('stage')
          if (urlStage && ['video', 'notes', 'quiz', 'coding', 'assignment'].includes(urlStage)) {
            setActiveTab(urlStage)
          }
        }
      }

      if (resStats && resStats.stats) {
        setStats(resStats.stats)
      }
    } catch (err) {
      console.error(err)
    } finally {
      if (isInitial) setLoading(false)
    }
  }, [courseId])

  useEffect(() => {
    if (!user) navigate('/')
    else loadCourseData(true)
  }, [user, navigate, loadCourseData])

  // Load module data (study notes, quiz, coding exercise) when active module changes
  useEffect(() => {
    if (!course?._id) return

    // 1. Fetch study notes
    getModuleStudyNote(course._id, activeModuleIndex)
      .then(res => {
        if (res?.data?.content !== undefined) {
          setStudyNoteText(res.data.content)
        }
      })
      .catch(() => setStudyNoteText(''))

    // 2. Fetch secured quiz questions and past attempts
    getModuleQuiz(course._id, activeModuleIndex)
      .then(res => {
        if (res?.data?.questions) {
          setQuizQuestions(res.data.questions)
          setQuizAttemptHistory(res.data.attemptHistory || [])
          setBestQuizScore(res.data.bestScore || 0)
        }
      })
      .catch(() => {
        const localQuiz = course.modules?.[activeModuleIndex]?.quiz || []
        setQuizQuestions(localQuiz)
      })

    // 3. Fetch Phase 4 Real Coding Workspace Data
    getModuleCoding(course._id, activeModuleIndex)
      .then(res => {
        if (res?.data) {
          const ex = res.data
          setCodingExercise(ex)
          setOriginalStarterCode(ex.originalStarterCode || ex.starterCode || '')
          setCodeSnippet(ex.savedCode || ex.starterCode || '')
          setTestResults(ex.testCases?.map((tc, idx) => ({
            testIndex: idx + 1,
            description: tc.description || `Test Case #${idx + 1}`,
            input: tc.input,
            expected: tc.expected,
            actual: ex.isPassed ? tc.expected : '',
            passed: ex.isPassed
          })) || [])
          if (ex.isPassed) {
            setCodingFeedback({ passed: true, message: '🎉 Coding Challenge Passed! All required test cases passed.' })
          } else {
            setCodingFeedback(null)
          }
        }
      })
      .catch(() => {
        const localEx = course.modules?.[activeModuleIndex]?.codingExercise
        if (localEx) {
          setCodingExercise(localEx)
          setOriginalStarterCode(localEx.starterCode || '')
          setCodeSnippet(localEx.starterCode || '')
        }
      })

    // 4. Fetch Phase 5 Real AI Project Grader Data
    getModuleProject(course._id, activeModuleIndex)
      .then(res => {
        if (res?.data) {
          const p = res.data
          setProjectSpec(p)
          setProjectOriginalStarter(p.defaultStarterCode || p.starterCode || '')
          setProjectCode(p.starterCode || '')
          setProjectBestScore(p.bestScore || 0)
          setProjectPassed(p.passed || false)
          if (p.latestAttempt) {
            setProjectGradingResult(p.latestAttempt)
            setProjectTestResults(p.latestAttempt.testResults || [])
          } else {
            setProjectGradingResult(null)
            setProjectTestResults(p.testCases?.map((tc, i) => ({
              testIndex: i + 1,
              description: tc.description || `Project Requirement #${i + 1}`,
              passed: p.passed,
              expected: tc.input || 'Validation Check'
            })) || [])
          }
        }
      })
      .catch(() => {
        const localP = course.modules?.[activeModuleIndex]?.assignment
        if (localP) {
          setProjectSpec(localP)
          setProjectOriginalStarter(localP.starterCode || '')
          setProjectCode(localP.starterCode || '')
        }
      })

    // Reset module UI states
    setSelectedCheckpointOption(null)
    setCheckpointSubmitted(false)
    setCheckpointPassed(false)
    setActiveQuizQuestionIdx(0)
    setQuizAnswers({})
    setQuizSubmitted(false)
    setQuizGradeResult(null)
    setShowReviewMode(false)
    setStdoutOutput('')
    setStderrOutput('')
    setRevealedHints([])
    setProjectStdout('')
    setProjectStderr('')
  }, [course?._id, activeModuleIndex])

  const handleModuleSelect = (idx) => {
    setActiveModuleIndex(idx)
    setActiveTab('video')
    setMobileWorkspaceTab('lesson')
    setQuizAnswers({})
    setQuizSubmitted(false)
    setQuizGradeResult(null)
    setActiveQuizQuestionIdx(0)
    setShowReviewMode(false)
    setCodingFeedback(null)
    setTestResults([])
    setStdoutOutput('')
    setStderrOutput('')
    setProjectGradingResult(null)
    setProjectStdout('')
    setProjectStderr('')
    setAssignmentSubmission('')
    setAssignmentFeedback(null)
    setSelectedCheckpointOption(null)
    setCheckpointSubmitted(false)
    setCheckpointPassed(false)
    updateLastOpenedModule(courseId, idx).catch(() => {})
  }

  const isModuleLocked = (idx) => {
    if (idx === 0) return false
    return !course?.completedModules?.includes(String(idx - 1))
  }

  // ── CORE MODULE COMPLETION & ADVANCEMENT ──
  const handleCompleteCurrentModule = useCallback(async () => {
    if (!course) return
    setActionLoading(true)
    try {
      const res = await completeModule(course._id, activeModuleIndex)
      if (res.success || res.data) {
        const nextIdx = Math.min(activeModuleIndex + 1, (course.modules?.length || 1) - 1)
        setResumedBanner(`Module ${activeModuleIndex + 1} Completed! 🎉 Module ${nextIdx + 1} is now unlocked! (+100 XP, +50 Coins)`)
        setActiveModuleIndex(nextIdx)
        setActiveTab('video')
        setQuizAnswers({})
        setQuizSubmitted(false)
        setQuizGradeResult(null)
        setCodingFeedback(null)
        setAssignmentSubmission('')
        setAssignmentFeedback(null)
        setProjectGradingResult(null)
        setProjectTestResults([])
        if (lessonContentRef.current) lessonContentRef.current.scrollTop = 0
        await loadCourseData(false)
      } else if (res.stage) {
        setResumedBanner(`🔒 ${res.message || 'Complete required stages first.'}`)
      }
    } catch (err) {
      console.error("Complete module error:", err)
      if (err?.stage) {
        setResumedBanner(`🔒 ${err.message}`)
      }
    } finally {
      setActionLoading(false)
    }
  }, [course, activeModuleIndex, loadCourseData])

  const handleAdvanceToNextModule = useCallback(async () => {
    if (!course) return
    const totalMods = course.modules?.length || 1
    if (activeModuleIndex < totalMods - 1) {
      const nextIdx = activeModuleIndex + 1
      setActiveModuleIndex(nextIdx)
      setActiveTab('video')
      setQuizAnswers({})
      setQuizSubmitted(false)
      setQuizGradeResult(null)
      setActiveQuizQuestionIdx(0)
      setShowReviewMode(false)
      setCodingFeedback(null)
      setTestResults([])
      setStdoutOutput('')
      setStderrOutput('')
      setProjectGradingResult(null)
      setProjectTestResults([])
      setProjectStdout('')
      setProjectStderr('')
      setSelectedCheckpointOption(null)
      setCheckpointSubmitted(false)
      setCheckpointPassed(false)
      setResumedBanner(`🎯 Starting Module ${nextIdx + 1}: ${course.modules[nextIdx]?.title || ''}`)
      updateLastOpenedModule(courseId, nextIdx).catch(() => {})
      if (lessonContentRef.current) {
        lessonContentRef.current.scrollTop = 0
      }
      await loadCourseData(false)
    } else {
      navigate('/courses?tab=certificates')
    }
  }, [course, activeModuleIndex, courseId, loadCourseData, navigate])

  // ── STAGE HANDLERS ──
  const handleSimulateWatchVideo = async () => {
    setActionLoading(true)
    try {
      await completeModuleVideo(course._id, activeModuleIndex)
      await loadCourseData(false)
      setActiveTab('notes')
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleVerifyCheckpoint = async () => {
    if (selectedCheckpointOption === null) return
    const currentCheckpoint = course?.modules?.[activeModuleIndex]?.checkpoint
    const isCorrect = Number(selectedCheckpointOption) === Number(currentCheckpoint?.correctAnswer || 1)

    setCheckpointSubmitted(true)
    setCheckpointPassed(isCorrect)

    if (isCorrect) {
      setActionLoading(true)
      try {
        await completeModuleNotes(course._id, activeModuleIndex)
        await loadCourseData(false)
      } catch (err) {
        console.error('Failed to complete module notes:', err)
      } finally {
        setActionLoading(false)
      }
    }
  }

  // ── PHASE 3 PRACTICE QUIZ SUBMISSION ──
  const handleQuizSubmit = async () => {
    const answeredCount = Object.keys(quizAnswers).length
    const totalQ = quizQuestions.length || (course.modules?.[activeModuleIndex]?.quiz?.length || 0)

    if (answeredCount < totalQ) {
      const confirmSubmit = window.confirm(`You have answered ${answeredCount} of ${totalQ} questions. Are you sure you want to submit?`)
      if (!confirmSubmit) return
    }

    setActionLoading(true)
    try {
      const res = await submitModuleQuiz(course._id, activeModuleIndex, quizAnswers)
      if (res.success && res.data) {
        const gradeData = res.data
        setQuizGradeResult(gradeData)
        setQuizSubmitted(true)
        setBestQuizScore(gradeData.bestScore || gradeData.score)
        setQuizAttemptHistory(prev => [
          ...prev,
          {
            moduleIndex: activeModuleIndex,
            score: gradeData.score,
            correctCount: gradeData.correctCount,
            totalQuestions: gradeData.totalQuestions,
            passed: gradeData.passed,
            date: new Date(),
            attemptNumber: gradeData.attemptNumber
          }
        ])

        await loadCourseData(false)

        if (gradeData.passed) {
          const hasCoding = !!(course.modules?.[activeModuleIndex]?.codingExercise?.problem)
          const hasAssignment = !!(course.modules?.[activeModuleIndex]?.assignment?.title)

          // Auto-advance to Coding Workspace if passed!
          if (hasCoding) {
            setActiveTab('coding')
          } else if (hasAssignment) {
            setActiveTab('assignment')
          } else {
            await handleCompleteCurrentModule()
          }
        }
      }
    } catch (err) {
      console.error('Quiz submission error:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleRetryQuiz = () => {
    setQuizAnswers({})
    setActiveQuizQuestionIdx(0)
    setQuizSubmitted(false)
    setQuizGradeResult(null)
    setShowReviewMode(false)
  }

  // ── PHASE 4 REAL CODE EXECUTION & TEST VALIDATION ──
  const handleRunCode = async () => {
    if (!codeSnippet || !codeSnippet.trim()) {
      alert('Please write your solution code before running.')
      return
    }

    setCodeExecutionRunning(true)
    setStdoutOutput('')
    setStderrOutput('')
    setCodingFeedback(null)

    try {
      const lang = codingExercise?.language || 'javascript'
      const res = await evaluateCodingExercise(course._id, activeModuleIndex, codeSnippet, lang)

      if (res) {
        setTestResults(res.results || [])
        setStdoutOutput(res.stdout || '')
        setStderrOutput(res.stderr || '')
        setExecutionTime(res.executionTime || null)

        if (res.passed) {
          setCodingFeedback({
            passed: true,
            message: '🎉 Coding Challenge Passed! All required test cases passed. AI Project Grader unlocked.'
          })
          await loadCourseData(false)
        } else {
          setCodingFeedback({
            passed: false,
            message: `❌ ${res.testsPassed || 0} / ${res.testsTotal || (res.results?.length || 1)} test cases passed. Review failing test assertions and retry.`
          })
        }
      }
    } catch (err) {
      setStderrOutput(err.message || 'Execution failed')
      setCodingFeedback({
        passed: false,
        message: '❌ Error: Failed to execute code in sandbox environment.'
      })
    } finally {
      setCodeExecutionRunning(false)
    }
  }

  const handleResetStarterCode = () => {
    setCodeSnippet(originalStarterCode)
    setShowResetModal(false)
    setCodingFeedback(null)
    setStdoutOutput('')
    setStderrOutput('')
    saveModuleCodingDraft(course._id, activeModuleIndex, originalStarterCode).catch(() => {})
  }

  const handleCopyCode = () => {
    if (!codeSnippet) return
    navigator.clipboard.writeText(codeSnippet)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  const toggleHint = (idx) => {
    setRevealedHints(prev => prev.includes(idx) ? prev.filter(h => h !== idx) : [...prev, idx])
  }

  // ── PHASE 5 REAL AI PROJECT GRADER & VALIDATION ACTIONS ──
  const handleRunProjectTests = async () => {
    if (!projectCode || !projectCode.trim()) {
      alert('Please implement your project code before running test cases.')
      return
    }

    setProjectTestingRunning(true)
    setProjectStdout('')
    setProjectStderr('')

    try {
      const lang = projectSpec?.allowedLanguages?.[0] || 'javascript'
      const res = await runModuleProjectTests(course._id, activeModuleIndex, projectCode, lang)
      if (res?.data) {
        setProjectTestResults(res.data.testResults || [])
        setProjectStdout(res.data.stdout || '')
        setProjectStderr(res.data.stderr || '')
        setProjectExecutionTime(res.data.executionTime || null)
      }
    } catch (err) {
      setProjectStderr(err.message || 'Execution error')
    } finally {
      setProjectTestingRunning(false)
    }
  }

  const handleSubmitProject = async () => {
    if (!projectCode || !projectCode.trim()) {
      alert('Please implement your project code before submitting for AI grading.')
      return
    }

    setProjectGradingRunning(true)
    setProjectStdout('')
    setProjectStderr('')

    try {
      const lang = projectSpec?.allowedLanguages?.[0] || 'javascript'
      const res = await submitModuleProject(course._id, activeModuleIndex, projectCode, lang)
      if (res?.data) {
        const { result, attempt } = res.data
        setProjectGradingResult(attempt || result)
        setProjectTestResults(result?.testResults || attempt?.testResults || [])
        setProjectBestScore(prev => Math.max(prev, result?.finalScore || 0))
        const didPass = !!(result?.passed || attempt?.passed || (result?.finalScore >= 70))
        setProjectPassed(didPass)

        if (didPass) {
          setResumedBanner(`🎉 Capstone Project Graded & Passed (${result?.finalScore || 85}%)! Module ${activeModuleIndex + 1} Mastered! +100 XP, +50 Coins earned!`)
          await completeModule(course._id, activeModuleIndex).catch(() => {})
        }

        await loadCourseData(false)
      }
    } catch (err) {
      setProjectStderr(err.message || 'Grading failed')
      alert(`Grading Error: ${err.message || 'Unable to complete evaluation'}`)
    } finally {
      setProjectGradingRunning(false)
    }
  }

  const handleResetProjectStarter = () => {
    setProjectCode(projectOriginalStarter)
    setShowProjectResetModal(false)
    setProjectStdout('')
    setProjectStderr('')
    saveModuleProjectDraft(course._id, activeModuleIndex, projectOriginalStarter).catch(() => {})
  }

  const handleCopyProjectCode = () => {
    if (!projectCode) return
    navigator.clipboard.writeText(projectCode)
    setProjectCopied(true)
    setTimeout(() => setProjectCopied(false), 2000)
  }

  // ── LEGACY ASSIGNMENT SUBMISSION FALLBACK ──
  const handleAssignmentSubmit = async () => {
    if (!assignmentSubmission.trim()) {
      alert('Please paste code or repository link.')
      return
    }
    setActionLoading(true)
    try {
      const res = await submitModuleAssignment(course._id, activeModuleIndex, assignmentSubmission)
      if (res.success) {
        setAssignmentFeedback({ grade: res.grade, feedback: res.feedback })
        await loadCourseData(false)
        if (res.grade >= 70) {
          await handleCompleteCurrentModule()
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  // Personal Study Note Save Handler
  const handleSaveStudyNote = async () => {
    if (!course?._id) return
    setNoteSaving(true)
    try {
      await saveModuleStudyNote(course._id, activeModuleIndex, studyNoteText)
      setNoteSavedFeedback(true)
      setTimeout(() => setNoteSavedFeedback(false), 2500)
    } catch (err) {
      console.error('Failed to save study note:', err)
    } finally {
      setNoteSaving(false)
    }
  }

  // AI Tutor Send Message Handler
  const handleSendTutorMessage = async () => {
    if (!tutorInput.trim() || !course?._id || tutorLoading) return
    const userMsg = tutorInput.trim()
    setTutorInput('')

    const newHistory = [...tutorMessages, { sender: 'user', content: userMsg }]
    setTutorMessages(newHistory)
    setTutorLoading(true)

    try {
      const res = await askCourseModuleAITutor(course._id, activeModuleIndex, userMsg, newHistory)
      if (res?.data?.answer) {
        setTutorMessages([...newHistory, { sender: 'assistant', content: res.data.answer }])
      } else {
        setTutorMessages([...newHistory, { sender: 'assistant', content: 'Review the current lesson notes and code examples to master this concept.' }])
      }
    } catch (err) {
      setTutorMessages([...newHistory, { sender: 'assistant', content: 'AI Tutor is temporarily offline. Please study the lesson notes and examples.' }])
    } finally {
      setTutorLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', color: '#64748B', fontFamily: 'Sora, sans-serif' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, border: '3px solid #7C3AED', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <div style={{ fontWeight: 800, fontSize: 15, color: '#0F172A' }}>Loading Course Workspace...</div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', color: '#64748B', fontFamily: 'Sora, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>Course Not Found</h2>
          <button onClick={() => navigate('/courses')} style={{ marginTop: 16, padding: '10px 20px', background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>
            Return to Courses
          </button>
        </div>
      </div>
    )
  }

  const m = course.modules?.[activeModuleIndex] || {}
  const currentYouTubeId = resolveYouTubeId(m, course, activeModuleIndex)

  // ── STAGE STATUS COMPUTATION ──
  const modKey = String(activeModuleIndex)
  const isCurrentCompleted = course.completedModules?.includes(modKey)
  const videoComplete = course.completedVideos?.includes(modKey) || isCurrentCompleted
  const notesComplete = course.completedNotes?.includes(modKey) || checkpointPassed || isCurrentCompleted
  const quizPassedForModule = course.completedQuizzes?.includes(modKey) || isCurrentCompleted
  const codingPassedForModule = (course.completedCoding?.includes(modKey)) || (course.codingProgress || []).find(c => c.moduleIndex === activeModuleIndex)?.passed || isCurrentCompleted || false
  const assignmentPassedForModule = course.completedAssignments?.includes(modKey) || projectPassed || isCurrentCompleted

  const activeQuestionsList = quizQuestions.length > 0 ? quizQuestions : (m.quiz || [])
  const hasQuiz = activeQuestionsList.length > 0
  const hasAssignment = !!(m.assignment?.title)
  const hasCoding = !!(m.codingExercise?.problem || codingExercise?.problem)

  const notesAvailable = videoComplete || isCurrentCompleted
  const quizAvailable = (notesComplete && hasQuiz) || isCurrentCompleted
  const codingAvailable = ((quizPassedForModule || (notesComplete && !hasQuiz)) && hasCoding) || isCurrentCompleted
  const assignmentAvailable = codingPassedForModule || (quizPassedForModule && !hasCoding) || isCurrentCompleted

  const tabDefs = [
    { id: 'video', label: 'Watch Video', icon: <Video size={14} />, locked: false, complete: videoComplete },
    { id: 'notes', label: 'Learn & Concepts', icon: <FileText size={14} />, locked: !isCurrentCompleted && !videoComplete, complete: notesComplete, lockMsg: 'Watch the video lesson first.' },
    { id: 'quiz', label: 'Practice Quiz', icon: <Book size={14} />, locked: !isCurrentCompleted && (!notesComplete || !hasQuiz), complete: quizPassedForModule, lockMsg: hasQuiz ? 'Complete Learn & Concepts checkpoint first.' : 'No quiz for this module.' },
    { id: 'coding', label: 'Coding Workspace', icon: <Code size={14} />, locked: !isCurrentCompleted && !codingAvailable, complete: codingPassedForModule, lockMsg: hasCoding ? 'Pass the Practice Quiz (>= 70%) first to unlock coding.' : 'No coding exercise for this module.' },
    { id: 'assignment', label: 'AI Project Grader', icon: <Trophy size={14} />, locked: !isCurrentCompleted && (!assignmentAvailable || !hasAssignment), complete: assignmentPassedForModule, lockMsg: hasAssignment ? 'Complete the Coding Challenge first to unlock the project.' : 'No project for this module.' }
  ]

  const currentQ = activeQuestionsList[activeQuizQuestionIdx] || {}
  const totalQuestions = activeQuestionsList.length
  const answeredCount = Object.keys(quizAnswers).length
  const quizProgressPercent = totalQuestions > 0 ? Math.round(((activeQuizQuestionIdx + 1) / totalQuestions) * 100) : 0

  // Code editor lines computation
  const editorLineNumbers = codeSnippet.split('\n').map((_, i) => i + 1)
  const langDisplay = (codingExercise?.language || course.technology || 'javascript').toUpperCase()

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'DM Sans, sans-serif' }}>
      {/* ── TOP WORKSPACE HEADER ── */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shadow-2xs">
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => navigate('/courses')}
              className="flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1.5 rounded-xl font-sora font-bold text-xs cursor-pointer hover:bg-slate-200 transition-all shrink-0"
            >
              <ChevronLeft size={16} /> Exit
            </button>

            <div className="min-w-0">
              <h1 className="font-sora text-sm sm:text-base font-extrabold text-slate-900 m-0 tracking-tight truncate">
                {course.title}
              </h1>
              <span className="text-[11px] text-slate-500 font-semibold truncate block">
                {course.instructor || 'ZenScore AI Staff'} • {course.category || 'Computer Science'}
              </span>
            </div>
          </div>

          <div className="flex md:hidden items-center gap-1.5 shrink-0">
            <div className="flex items-center gap-1 bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded-lg font-sora text-xs font-bold">
              <Zap size={12} /> Lvl {stats.level}
            </div>
            <div className="flex items-center gap-1 bg-amber-50 text-amber-600 border border-amber-200 px-2 py-1 rounded-lg font-sora text-xs font-bold">
              <Coins size={12} /> {stats.coins}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-2 sm:gap-3 w-full md:w-auto flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTutorOpen(true)}
              className="flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1.5 rounded-xl font-sora text-xs font-bold cursor-pointer shadow-xs hover:bg-purple-100 transition-all"
            >
              <Bot size={14} /> AI Tutor
            </button>

            <button
              onClick={() => setIsNotesDrawerOpen(true)}
              className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl font-sora text-xs font-bold cursor-pointer hover:bg-emerald-100 transition-all"
            >
              <BookOpen size={14} /> My Notes
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <div className="font-sora text-[11px] font-bold text-slate-700 mb-0.5">
                Completed: <span className="text-purple-600">{course.completedPercent || 0}%</span>
              </div>
              <div className="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: `${course.completedPercent || 0}%` }} />
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded-lg font-sora text-xs font-bold">
                <Zap size={12} /> Lvl {stats.level}
              </div>
              <div className="flex items-center gap-1 bg-amber-50 text-amber-600 border border-amber-200 px-2 py-1 rounded-lg font-sora text-xs font-bold">
                <Coins size={12} /> {stats.coins}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Resumed Learning / Feedback Banner */}
      {resumedBanner && (
        <div style={{ background: '#F5F3FF', borderBottom: '1px solid #DDD6FE', padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: '#6D28D9', fontFamily: 'Sora, sans-serif' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <Compass size={15} style={{ color: '#7C3AED', shrink: 0 }} />
            <span className="truncate">🎯 <strong>{resumedBanner}</strong></span>
          </div>
          <button onClick={() => setResumedBanner(null)} style={{ background: 'none', border: 'none', color: '#7C3AED', cursor: 'pointer', fontSize: 11.5, fontWeight: 800, shrink: 0, marginLeft: 8 }}>Dismiss</button>
        </div>
      )}

      {/* Mobile / Tablet Mode Switcher (Lesson View vs Syllabus) */}
      <div className="lg:hidden flex items-center p-1 bg-slate-100/90 rounded-2xl mx-4 my-2 border border-slate-200/80 shadow-2xs">
        <button
          type="button"
          onClick={() => setMobileWorkspaceTab('lesson')}
          className={`flex-1 py-2 px-3 rounded-xl font-sora text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-w-0 ${
            mobileWorkspaceTab === 'lesson'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen size={14} className="shrink-0" />
          <span className="truncate">{m.title?.startsWith('Module') ? m.title : `Module ${activeModuleIndex + 1}: ${m.title || 'Lesson'}`}</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileWorkspaceTab('syllabus')}
          className={`flex-1 py-2 px-3 rounded-xl font-sora text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-w-0 ${
            mobileWorkspaceTab === 'syllabus'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers size={14} className="shrink-0" />
          <span className="truncate">Syllabus ({course.completedModules?.length || 0}/{course.modules?.length || 0})</span>
        </button>
      </div>

      {/* Main Split Screen */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden" style={{ height: 'calc(100vh - 115px)' }}>
        {/* ── MODULE SIDEBAR ── */}
        <aside className={`w-full lg:w-80 bg-white border-r border-slate-200 flex flex-col h-full shrink-0 ${mobileWorkspaceTab === 'syllabus' ? 'flex' : 'hidden lg:flex'}`}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
            <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 11, fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Syllabus & Modules ({course.completedModules?.length || 0}/{course.modules?.length || 0} Done)
            </span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {course.modules?.map((mod, idx) => {
              const isLocked = isModuleLocked(idx)
              const isActive = activeModuleIndex === idx
              const isCompleted = course.completedModules?.includes(String(idx))

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (isLocked) {
                      setResumedBanner(`🔒 Module ${idx + 1} is locked. Complete Module ${idx} first to unlock it.`)
                    } else {
                      handleModuleSelect(idx)
                    }
                  }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 14,
                    border: isActive ? '1.5px solid #7C3AED' : isLocked ? '1px dashed #CBD5E1' : '1px solid #E2E8F0',
                    background: isActive ? '#EEF2FF' : isLocked ? '#F8FAFC' : '#FFFFFF',
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    boxShadow: isActive ? '0 4px 14px rgba(124,58,237,0.12)' : '0 1px 3px rgba(15,23,42,0.02)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 11, fontWeight: 800, color: isActive ? '#7C3AED' : isLocked ? '#64748B' : '#4F46E5' }}>
                      Module {idx + 1}
                    </span>

                    {isCompleted ? (
                      <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 10, fontWeight: 800, color: '#059669', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '2px 6px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <CheckCircle2 size={11} /> Done
                      </span>
                    ) : isLocked ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#F1F5F9', border: '1px solid #E2E8F0', padding: '2px 6px', borderRadius: 6 }}>
                        <Lock size={10} style={{ color: '#64748B' }} />
                        <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 10, fontWeight: 800, color: '#64748B' }}>Locked</span>
                      </div>
                    ) : (
                      <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 10, fontWeight: 800, color: '#2563EB', background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '2px 6px', borderRadius: 6 }}>
                        Active ⚡
                      </span>
                    )}
                  </div>

                  <h3 style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: 12.5,
                    fontWeight: 800,
                    color: isLocked ? '#64748B' : '#0F172A',
                    margin: 0,
                    lineHeight: 1.4
                  }}>
                    {mod.title}
                  </h3>
                </div>
              )
            })}
          </div>
        </aside>

        {/* ── LEARNING WORKSPACE MAIN ── */}
        <main className={`flex-1 flex flex-col h-full overflow-hidden ${mobileWorkspaceTab === 'lesson' ? 'flex' : 'hidden lg:flex'}`}>
          {/* ── Stage-Gated Workspace Tab Bar ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 gap-2.5">
            <div className="flex items-center gap-2 overflow-x-auto py-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {tabDefs.map((t) => {
                const isActive = activeTab === t.id
                return (
                  <button
                    key={t.id}
                    title={t.locked ? t.lockMsg : undefined}
                    style={{
                      background: isActive ? '#7C3AED' : t.complete ? '#F0FDF4' : t.locked ? '#F8FAFC' : '#F1F5F9',
                      color: isActive ? '#FFFFFF' : t.complete ? '#059669' : t.locked ? '#9CA3AF' : '#475569',
                      padding: '8px 12px',
                      borderRadius: 12,
                      border: isActive ? 'none' : t.locked ? '1px dashed #CBD5E1' : t.complete ? '1px solid #A7F3D0' : 'none',
                      fontFamily: 'Sora, sans-serif',
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: t.locked ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      opacity: t.locked ? 0.7 : 1,
                      boxShadow: isActive ? '0 4px 12px rgba(124, 58, 237, 0.25)' : 'none',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}
                    onClick={() => {
                      if (t.locked) {
                        setResumedBanner(`🔒 Stage Locked: ${t.lockMsg}`)
                        return
                      }
                      setActiveTab(t.id)
                    }}
                  >
                    {t.locked ? <Lock size={13} /> : t.complete ? <CheckCircle2 size={13} /> : t.icon}
                    {t.label}
                    {t.complete && !isActive && <span style={{ fontSize: 10, background: '#DCFCE7', color: '#15803D', padding: '1px 5px', borderRadius: 4, fontWeight: 800 }}>✓</span>}
                  </button>
                )
              })}
            </div>

            {/* Stage Progress Indicator */}
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
              {isCurrentCompleted ? (
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-xl font-sora text-xs font-bold">
                  <CheckCircle2 size={14} /> Module Done ✓
                </div>
              ) : (
                <div className="flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-xl font-sora text-xs font-bold whitespace-nowrap">
                  <Sparkles size={13} />
                  {!videoComplete ? 'Stage 1: Watch Video'
                    : !notesComplete ? 'Stage 2: Learn & Checkpoint'
                      : hasQuiz && !quizPassedForModule ? 'Stage 3: Practice Assessment'
                        : hasCoding && !codingPassedForModule ? 'Stage 4: Coding Workspace'
                          : hasAssignment && !assignmentPassedForModule ? 'Stage 5: Submit Project'
                            : 'In Progress...'}
                </div>
              )}
            </div>
          </div>

          <div style={{ flex: 1, padding: 24, overflowY: 'auto' }} ref={lessonContentRef}>
            {/* ── 1. WATCH VIDEO STAGE ── */}
            {activeTab === 'video' && (
              <div className="flex flex-col gap-4">
                <div className="w-full aspect-video max-h-[440px] bg-black rounded-2xl overflow-hidden shadow-lg border border-slate-800">
                  <iframe
                    key={`${activeModuleIndex}-${currentYouTubeId}`}
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${currentYouTubeId}?autoplay=0&rel=0`}
                    title={`${course.title} - ${m.title}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* Video Controls & Fast-Track Learn Concepts Fallback Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="font-sora text-sm sm:text-base font-extrabold text-slate-900 truncate">{m.title}</span>
                    <span className="text-xs text-slate-500 font-medium">{course.title} • {course.technology || 'Core'}</span>
                    {videoComplete && (
                      <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                        <CheckCircle2 size={12} /> Video watched — Proceed to structured Learn & Concepts notes
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap shrink-0 w-full sm:w-auto justify-end">
                    {/* Direct Learn Concepts Button */}
                    <button
                      onClick={() => {
                        completeModuleVideo(course._id, activeModuleIndex).catch(() => {})
                        setActiveTab('notes')
                      }}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-200 px-3.5 py-2 rounded-xl font-sora font-bold text-xs cursor-pointer hover:bg-purple-100 transition-all shadow-2xs"
                    >
                      <BookOpen size={14} /> Learn Concepts
                    </button>

                    {videoComplete ? (
                      <button
                        onClick={() => setActiveTab('notes')}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-xl font-sora font-bold text-xs cursor-pointer hover:bg-emerald-700 transition-all shadow-xs"
                      >
                        Next: Concepts <ArrowRight size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={handleSimulateWatchVideo}
                        disabled={actionLoading}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-purple-600 text-white px-4 py-2 rounded-xl font-sora font-bold text-xs cursor-pointer hover:bg-purple-700 transition-all shadow-md shadow-purple-600/20"
                      >
                        <CheckCircle2 size={14} /> Mark Video Watched →
                      </button>
                    )}
                  </div>
                </div>

                {/* Video Fallback Helper Banner */}
                <div className="flex items-center justify-between p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 text-amber-800 text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <Lightbulb size={15} className="text-amber-600 shrink-0" />
                    <span>💡 Video not loading or prefer reading? Jump straight into interactive theory & architectural diagrams.</span>
                  </div>
                  <button
                    onClick={() => {
                      completeModuleVideo(course._id, activeModuleIndex).catch(() => {})
                      setActiveTab('notes')
                    }}
                    className="font-bold underline text-amber-900 cursor-pointer ml-2 whitespace-nowrap hover:text-amber-950"
                  >
                    Open Notes →
                  </button>
                </div>
              </div>
            )}

            {/* ── 2. LEARN & CONCEPTS STAGE ── */}
            {activeTab === 'notes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 960, margin: '0 auto' }}>
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-2xs">
                  <div className="min-w-0">
                    <div className="font-sora text-xs sm:text-sm font-extrabold text-slate-900">
                      Learning Stage Progress: {notesComplete ? '100% Completed' : 'In Progress (Review lesson & pass checkpoint)'}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-slate-500 font-semibold">
                      <span className="text-emerald-600">✓ Core Concepts</span>
                      <span className="text-emerald-600">✓ Architecture Diagram</span>
                      <span className="text-emerald-600">✓ Code Examples</span>
                      <span className={notesComplete ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                        {notesComplete ? '✓ Checkpoint Passed' : '○ Learning Checkpoint'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => setIsTutorOpen(true)}
                      className="flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1.5 rounded-xl font-sora text-xs font-bold cursor-pointer hover:bg-purple-100 transition-all shadow-2xs"
                    >
                      <Bot size={14} /> Ask AI Tutor
                    </button>
                    <button
                      onClick={() => setIsNotesDrawerOpen(true)}
                      className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl font-sora text-xs font-bold cursor-pointer hover:bg-emerald-100 transition-all shadow-2xs"
                    >
                      <BookOpen size={14} /> Notes
                    </button>
                  </div>
                </div>

                <article style={{ background: '#FFFFFF', padding: '32px 36px', borderRadius: 24, border: '1px solid #E2E8F0', boxShadow: '0 2px 12px rgba(15,23,42,0.03)', color: '#1E293B', lineHeight: 1.75 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 800, fontFamily: 'Sora, sans-serif' }}>
                      {course.technology || course.category || 'Engineering'}
                    </span>
                    <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Module {activeModuleIndex + 1} of {course.modules?.length}</span>
                  </div>

                  <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 800, color: '#0F172A', marginTop: 0, marginBottom: 16 }}>
                    {m.title}
                  </h2>

                  <div style={{ whiteSpace: 'pre-line', fontSize: 14, color: '#334155' }}>
                    {m.notes?.markdown || m.description}
                  </div>
                </article>

                {/* ── LEARNING CHECKPOINT (INTERACTIVE COMPLETION GATE) ── */}
                <section style={{
                  background: notesComplete ? '#F0FDF4' : '#FFFFFF',
                  padding: '28px 32px',
                  borderRadius: 24,
                  border: notesComplete ? '1.5px solid #A7F3D0' : '1.5px solid #DDD6FE',
                  boxShadow: '0 4px 16px rgba(124,58,237,0.06)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Lightbulb size={20} style={{ color: notesComplete ? '#059669' : '#7C3AED' }} />
                    <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 17, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      Learning Checkpoint — Verify Understanding
                    </h3>
                  </div>
                  <p style={{ fontSize: 12.5, color: '#64748B', margin: '0 0 16px' }}>
                    Answer this checkpoint question correctly to complete the Learn & Concepts stage and unlock the Practice Quiz.
                  </p>

                  <div style={{ padding: 16, background: notesComplete ? '#FFFFFF' : '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 16, marginBottom: 16 }}>
                    <p style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 800, color: '#0F172A', margin: '0 0 12px' }}>
                      {m.checkpoint?.question || `What is the core architectural principle behind ${m.title}?`}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {(m.checkpoint?.options || [
                        "It allows uncontrolled state mutations without tracking.",
                        "It ensures deterministic execution, system resilience, and clean separation of concerns.",
                        "It bypasses all network security validations.",
                        "It disables compiling for production bundles."
                      ]).map((opt, oIdx) => {
                        const isSelected = selectedCheckpointOption === oIdx
                        return (
                          <label
                            key={oIdx}
                            onClick={() => setSelectedCheckpointOption(oIdx)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              padding: '10px 14px',
                              borderRadius: 12,
                              background: isSelected ? '#EEF2FF' : '#FFFFFF',
                              border: isSelected ? '1.5px solid #7C3AED' : '1px solid #E2E8F0',
                              fontSize: 13,
                              color: '#1E293B',
                              cursor: 'pointer',
                              fontWeight: isSelected ? 700 : 500,
                              transition: 'all 0.15s'
                            }}
                          >
                            <input
                              type="radio"
                              name="checkpoint-radio"
                              checked={isSelected}
                              onChange={() => setSelectedCheckpointOption(oIdx)}
                              style={{ accentColor: '#7C3AED' }}
                            />
                            {opt}
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  {checkpointSubmitted && (
                    <div style={{
                      padding: 14,
                      borderRadius: 14,
                      marginBottom: 16,
                      background: checkpointPassed ? '#ECFDF5' : '#FEF2F2',
                      border: checkpointPassed ? '1px solid #A7F3D0' : '1px solid #FCA5A5',
                      color: checkpointPassed ? '#065F46' : '#991B1B',
                      fontSize: 13,
                      lineHeight: 1.5
                    }}>
                      <div style={{ fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {checkpointPassed ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        {checkpointPassed ? '🎉 Correct Understanding Verified!' : '❌ Incorrect Selection'}
                      </div>
                      <div>
                        {checkpointPassed ? (m.checkpoint?.explanation || 'Proper software architecture establishes predictable state transitions.') : (m.checkpoint?.hint || 'Review the core concepts above and try again.')}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {!notesComplete ? (
                      <button
                        onClick={handleVerifyCheckpoint}
                        disabled={selectedCheckpointOption === null || actionLoading}
                        style={{
                          background: selectedCheckpointOption !== null ? '#7C3AED' : '#CBD5E1',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '11px 24px',
                          borderRadius: 12,
                          fontFamily: 'Sora, sans-serif',
                          fontWeight: 700,
                          fontSize: 13,
                          cursor: selectedCheckpointOption !== null ? 'pointer' : 'not-allowed',
                          boxShadow: selectedCheckpointOption !== null ? '0 4px 12px rgba(124,58,237,0.25)' : 'none'
                        }}
                      >
                        {actionLoading ? 'Verifying...' : 'Verify Understanding →'}
                      </button>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ color: '#059669', fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <CheckCircle2 size={16} /> Learn & Concepts Stage Complete
                        </span>
                        <button
                          onClick={() => setActiveTab('quiz')}
                          style={{
                            background: '#059669',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '10px 22px',
                            borderRadius: 12,
                            fontFamily: 'Sora, sans-serif',
                            fontWeight: 700,
                            fontSize: 13,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            boxShadow: '0 4px 12px rgba(5,150,105,0.25)'
                          }}
                        >
                          Start Practice Quiz <ArrowRight size={15} />
                        </button>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}

            {/* ── 3. PHASE 3 PRACTICE QUIZ & ASSESSMENT ENGINE ── */}
            {activeTab === 'quiz' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 960, margin: '0 auto' }}>
                {(quizSubmitted || (quizPassedForModule && !showReviewMode && quizGradeResult)) ? (
                  <div style={{ background: '#FFFFFF', padding: '32px 36px', borderRadius: 24, border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(15,23,42,0.03)', display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: 10,
                            fontFamily: 'Sora, sans-serif',
                            fontSize: 12,
                            fontWeight: 800,
                            background: (quizGradeResult?.passed || quizPassedForModule) ? '#ECFDF5' : '#FEF2F2',
                            color: (quizGradeResult?.passed || quizPassedForModule) ? '#059669' : '#DC2626',
                            border: (quizGradeResult?.passed || quizPassedForModule) ? '1px solid #A7F3D0' : '1px solid #FCA5A5',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5
                          }}>
                            {(quizGradeResult?.passed || quizPassedForModule) ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                            {(quizGradeResult?.passed || quizPassedForModule) ? 'PASSED (>= 70%)' : 'NOT PASSED (< 70%)'}
                          </span>
                          <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
                            Attempt #{quizGradeResult?.attemptNumber || quizAttemptHistory.length || 1} • Best: {Math.max(bestQuizScore, quizGradeResult?.score || 0)}%
                          </span>
                        </div>
                        <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                          Assessment Evaluation: {m.title}
                        </h2>
                      </div>

                      <div style={{
                        background: (quizGradeResult?.passed || quizPassedForModule) ? '#F0FDF4' : '#FEF2F2',
                        border: (quizGradeResult?.passed || quizPassedForModule) ? '2px solid #059669' : '2px solid #DC2626',
                        borderRadius: 20,
                        padding: '12px 24px',
                        textAlign: 'center',
                        minWidth: 110
                      }}>
                        <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 32, fontWeight: 900, color: (quizGradeResult?.passed || quizPassedForModule) ? '#059669' : '#DC2626', lineHeight: 1 }}>
                          {quizGradeResult?.score ?? (quizPassedForModule ? 100 : 0)}%
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#64748B', marginTop: 4 }}>
                          Passing: 70%
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                      <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 16, border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Correct Answers</div>
                        <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#0F172A', marginTop: 4 }}>
                          {quizGradeResult?.correctCount ?? (quizPassedForModule ? totalQuestions : 0)} / {quizGradeResult?.totalQuestions || totalQuestions}
                        </div>
                      </div>

                      <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 16, border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Stage Unlocked</div>
                        <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: (quizGradeResult?.passed || quizPassedForModule) ? '#059669' : '#94A3B8', marginTop: 4 }}>
                          {(quizGradeResult?.passed || quizPassedForModule) ? 'Coding Workspace ✓' : 'Locked (Requires 70%)'}
                        </div>
                      </div>

                      <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 16, border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Total Attempts</div>
                        <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#0F172A', marginTop: 4 }}>
                          {quizAttemptHistory.length || 1}
                        </div>
                      </div>
                    </div>

                    {quizGradeResult?.feedback && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 18, background: '#F8FAFC', borderRadius: 16, border: '1px solid #E2E8F0' }}>
                        {quizGradeResult.feedback.strengths?.length > 0 && (
                          <div>
                            <span style={{ fontSize: 12, fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                              <CheckCircle2 size={14} /> What you demonstrated well:
                            </span>
                            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12.5, color: '#334155', lineHeight: 1.5 }}>
                              {quizGradeResult.feedback.strengths.map((s, idx) => <li key={idx}>{s}</li>)}
                            </ul>
                          </div>
                        )}

                        {quizGradeResult.feedback.improvements?.length > 0 && (
                          <div style={{ marginTop: 6 }}>
                            <span style={{ fontSize: 12, fontWeight: 800, color: '#DC2626', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                              <AlertCircle size={14} /> Recommended Focus Areas:
                            </span>
                            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12.5, color: '#334155', lineHeight: 1.5 }}>
                              {quizGradeResult.feedback.improvements.map((im, idx) => <li key={idx}>{im}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: 18 }}>
                      <button
                        onClick={handleRetryQuiz}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          background: '#F1F5F9',
                          color: '#334155',
                          border: '1px solid #E2E8F0',
                          padding: '10px 18px',
                          borderRadius: 12,
                          fontFamily: 'Sora, sans-serif',
                          fontWeight: 700,
                          fontSize: 12.5,
                          cursor: 'pointer'
                        }}
                      >
                        <RotateCcw size={14} /> Retake Assessment
                      </button>

                      {(quizGradeResult?.passed || quizPassedForModule) ? (
                        <button
                          onClick={() => setActiveTab('coding')}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            background: '#059669',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '11px 24px',
                            borderRadius: 12,
                            fontFamily: 'Sora, sans-serif',
                            fontWeight: 800,
                            fontSize: 13,
                            cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(5,150,105,0.3)'
                          }}
                        >
                          Continue to Coding Workspace <ArrowRight size={15} />
                        </button>
                      ) : (
                        <button
                          onClick={handleRetryQuiz}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            background: '#7C3AED',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '11px 24px',
                            borderRadius: 12,
                            fontFamily: 'Sora, sans-serif',
                            fontWeight: 800,
                            fontSize: 13,
                            cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(124,58,237,0.3)'
                          }}
                        >
                          Retry Assessment to Unlock Next Stage <RotateCcw size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ background: '#FFFFFF', padding: '32px 36px', borderRadius: 24, border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(15,23,42,0.03)', display: 'flex', flexDirection: 'column', gap: 22 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: 16 }}>
                      <div>
                        <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 11, fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Module {activeModuleIndex + 1} Assessment
                        </span>
                        <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 19, fontWeight: 800, color: '#0F172A', margin: '2px 0 0' }}>
                          {m.title}
                        </h2>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Answered:</span>{' '}
                          <strong style={{ color: answeredCount === totalQuestions ? '#059669' : '#7C3AED', fontFamily: 'Sora, sans-serif' }}>
                            {answeredCount} / {totalQuestions}
                          </strong>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 800, background: '#EEF2FF', color: '#4F46E5', padding: '4px 10px', borderRadius: 8 }}>
                          Passing: 70%
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#64748B', fontWeight: 700 }}>
                        <span>Question {activeQuizQuestionIdx + 1} of {totalQuestions}</span>
                        <span>{quizProgressPercent}% Complete</span>
                      </div>
                      <div style={{ width: '100%', background: '#E2E8F0', borderRadius: 99, height: 6, overflow: 'hidden' }}>
                        <div style={{ background: '#7C3AED', height: '100%', width: `${quizProgressPercent}%`, borderRadius: 99, transition: 'width 0.2s ease' }} />
                      </div>

                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                        {activeQuestionsList.map((_, qIdx) => {
                          const isAnswered = quizAnswers[qIdx] !== undefined
                          const isCurrent = activeQuizQuestionIdx === qIdx
                          return (
                            <button
                              key={qIdx}
                              onClick={() => setActiveQuizQuestionIdx(qIdx)}
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: 8,
                                border: isCurrent ? '2px solid #7C3AED' : isAnswered ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                                background: isCurrent ? '#EEF2FF' : isAnswered ? '#ECFDF5' : '#F8FAFC',
                                color: isCurrent ? '#7C3AED' : isAnswered ? '#059669' : '#64748B',
                                fontSize: 11,
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.15s'
                              }}
                            >
                              {qIdx + 1}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {currentQ && (
                      <div style={{ padding: 22, background: '#F8FAFC', borderRadius: 18, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <span style={{ fontSize: 10.5, fontWeight: 800, background: '#F1F5F9', color: '#475569', padding: '3px 8px', borderRadius: 6, textTransform: 'capitalize' }}>
                              {currentQ.type?.replace('_', ' ') || 'Multiple Choice'}
                            </span>
                            <span style={{
                              fontSize: 10.5,
                              fontWeight: 800,
                              padding: '3px 8px',
                              borderRadius: 6,
                              background: currentQ.difficulty === 'Easy' ? '#ECFDF5' : currentQ.difficulty === 'Medium' ? '#EFF6FF' : '#FEF2F2',
                              color: currentQ.difficulty === 'Easy' ? '#059669' : currentQ.difficulty === 'Medium' ? '#2563EB' : '#DC2626'
                            }}>
                              {currentQ.difficulty || 'Medium'}
                            </span>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>10 Points</span>
                        </div>

                        <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 15.5, fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.5 }}>
                          {currentQ.question}
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {(currentQ.options || []).map((opt, optIdx) => {
                            const isSelected = quizAnswers[activeQuizQuestionIdx] === optIdx
                            const optLetter = String.fromCharCode(65 + optIdx)
                            return (
                              <label
                                key={optIdx}
                                onClick={() => setQuizAnswers({ ...quizAnswers, [activeQuizQuestionIdx]: optIdx })}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 12,
                                  padding: '12px 16px',
                                  borderRadius: 14,
                                  background: isSelected ? '#EEF2FF' : '#FFFFFF',
                                  border: isSelected ? '2px solid #7C3AED' : '1px solid #E2E8F0',
                                  cursor: 'pointer',
                                  boxShadow: isSelected ? '0 2px 8px rgba(124,58,237,0.1)' : '0 1px 2px rgba(15,23,42,0.02)',
                                  transition: 'all 0.15s ease'
                                }}
                              >
                                <span style={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                  background: isSelected ? '#7C3AED' : '#F1F5F9',
                                  color: isSelected ? '#FFFFFF' : '#64748B',
                                  fontSize: 11,
                                  fontWeight: 800,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0
                                }}>
                                  {optLetter}
                                </span>
                                <span style={{ fontSize: 13, color: '#1E293B', fontWeight: isSelected ? 700 : 500, lineHeight: 1.4 }}>
                                  {opt}
                                </span>
                              </label>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: 18 }}>
                      <button
                        onClick={() => setActiveQuizQuestionIdx(prev => Math.max(0, prev - 1))}
                        disabled={activeQuizQuestionIdx === 0}
                        style={{
                          background: '#F1F5F9',
                          color: '#475569',
                          border: '1px solid #E2E8F0',
                          padding: '10px 18px',
                          borderRadius: 12,
                          fontFamily: 'Sora, sans-serif',
                          fontWeight: 700,
                          fontSize: 12.5,
                          cursor: activeQuizQuestionIdx === 0 ? 'not-allowed' : 'pointer',
                          opacity: activeQuizQuestionIdx === 0 ? 0.5 : 1
                        }}
                      >
                        ← Previous
                      </button>

                      <div style={{ display: 'flex', gap: 10 }}>
                        {activeQuizQuestionIdx < totalQuestions - 1 ? (
                          <button
                            onClick={() => setActiveQuizQuestionIdx(prev => Math.min(totalQuestions - 1, prev + 1))}
                            style={{
                              background: '#7C3AED',
                              color: '#FFFFFF',
                              border: 'none',
                              padding: '10px 22px',
                              borderRadius: 12,
                              fontFamily: 'Sora, sans-serif',
                              fontWeight: 700,
                              fontSize: 12.5,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6
                            }}
                          >
                            Next Question →
                          </button>
                        ) : (
                          <button
                            onClick={handleQuizSubmit}
                            disabled={actionLoading || answeredCount === 0}
                            style={{
                              background: '#059669',
                              color: '#FFFFFF',
                              border: 'none',
                              padding: '11px 24px',
                              borderRadius: 12,
                              fontFamily: 'Sora, sans-serif',
                              fontWeight: 800,
                              fontSize: 13,
                              cursor: (actionLoading || answeredCount === 0) ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              boxShadow: '0 4px 14px rgba(5,150,105,0.3)'
                            }}
                          >
                            {actionLoading ? 'Evaluating Assessment...' : 'Submit Assessment →'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── 4. PHASE 4 REAL CODING WORKSPACE STAGE ── */}
            {activeTab === 'coding' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1100, margin: '0 auto' }}>
                {/* Header Challenge Banner */}
                <div style={{ background: '#FFFFFF', padding: '22px 28px', borderRadius: 20, border: '1px solid #E2E8F0', boxShadow: '0 2px 10px rgba(15,23,42,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '3px 10px', borderRadius: 8, fontSize: 11, fontWeight: 800, fontFamily: 'Sora, sans-serif' }}>
                        {langDisplay}
                      </span>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: 6,
                        background: codingExercise?.difficulty === 'Easy' ? '#ECFDF5' : codingExercise?.difficulty === 'Hard' ? '#FEF2F2' : '#EFF6FF',
                        color: codingExercise?.difficulty === 'Easy' ? '#059669' : codingExercise?.difficulty === 'Hard' ? '#DC2626' : '#2563EB'
                      }}>
                        {codingExercise?.difficulty || 'Intermediate'}
                      </span>
                      <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
                        Module {activeModuleIndex + 1} Practical Engineering Challenge
                      </span>
                    </div>

                    <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {codingExercise?.title || `${m.title} Challenge`}
                    </h2>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {codingPassedForModule ? (
                      <span style={{ background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CheckCircle2 size={15} /> Challenge Passed ✓
                      </span>
                    ) : (
                      <span style={{ background: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0', padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700 }}>
                        Tests: {codingExercise?.testCases?.length || 3} Required
                      </span>
                    )}
                  </div>
                </div>

                {/* Problem Details / Specifications Card */}
                <div style={{ background: '#FFFFFF', padding: '24px 28px', borderRadius: 20, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>
                      Problem Objective
                    </h3>
                    <p style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.6, margin: 0 }}>
                      {codingExercise?.problem || 'Implement the solution according to specifications.'}
                    </p>
                  </div>

                  {/* Requirements & Constraints Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                    {codingExercise?.requirements?.length > 0 && (
                      <div style={{ padding: 14, background: '#F8FAFC', borderRadius: 14, border: '1px solid #E2E8F0' }}>
                        <strong style={{ fontSize: 12, color: '#0F172A', display: 'block', marginBottom: 6 }}>📋 Requirements:</strong>
                        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: '#475569', lineHeight: 1.5 }}>
                          {codingExercise.requirements.map((req, rIdx) => <li key={rIdx}>{req}</li>)}
                        </ul>
                      </div>
                    )}

                    {codingExercise?.exampleInput && (
                      <div style={{ padding: 14, background: '#F8FAFC', borderRadius: 14, border: '1px solid #E2E8F0' }}>
                        <strong style={{ fontSize: 12, color: '#0F172A', display: 'block', marginBottom: 6 }}>💡 Example Behavior:</strong>
                        <div style={{ fontSize: 12, color: '#334155', fontFamily: 'monospace', lineHeight: 1.4 }}>
                          <div><strong>Input:</strong> {codingExercise.exampleInput}</div>
                          <div><strong>Expected:</strong> {codingExercise.expectedOutput}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 💡 Hints Accordion */}
                  {codingExercise?.hints?.length > 0 && (
                    <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#6D28D9', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <Lightbulb size={14} /> Need guidance? Reveal progressive hints:
                      </span>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {codingExercise.hints.map((hint, hIdx) => {
                          const isRevealed = revealedHints.includes(hIdx)
                          return (
                            <div key={hIdx} style={{ flex: '1 1 200px' }}>
                              <button
                                onClick={() => toggleHint(hIdx)}
                                style={{
                                  width: '100%',
                                  textAlign: 'left',
                                  padding: '8px 12px',
                                  borderRadius: 10,
                                  border: isRevealed ? '1px solid #DDD6FE' : '1px dashed #CBD5E1',
                                  background: isRevealed ? '#F5F3FF' : '#FFFFFF',
                                  color: isRevealed ? '#6D28D9' : '#64748B',
                                  fontSize: 12,
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                                }}
                              >
                                <span>Hint {hIdx + 1}</span>
                                <ChevronDown size={14} style={{ transform: isRevealed ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                              </button>
                              {isRevealed && (
                                <div style={{ padding: '8px 12px', fontSize: 12, color: '#334155', background: '#F8FAFC', borderRadius: '0 0 10px 10px', border: '1px solid #E2E8F0', borderTop: 'none', lineHeight: 1.45 }}>
                                  {hint}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── SPLIT EDITOR & TEST CONSOLE ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: 16, alignItems: 'start' }}>
                  {/* Left Column: Code Editor */}
                  <div style={{ background: '#0F172A', borderRadius: 20, overflow: 'hidden', border: '1px solid #1E293B', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                    {/* Editor Toolbar */}
                    <div style={{ padding: '10px 16px', background: '#1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                        </div>
                        <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#94A3B8', fontWeight: 600, marginLeft: 6 }}>
                          solution.{codingExercise?.language === 'python' ? 'py' : codingExercise?.language === 'sql' ? 'sql' : codingExercise?.language === 'dockerfile' ? 'Dockerfile' : codingExercise?.language === 'yaml' ? 'yaml' : 'js'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                          onClick={handleCopyCode}
                          title="Copy Code"
                          style={{ background: '#334155', border: 'none', color: '#E2E8F0', padding: '5px 10px', borderRadius: 8, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          <Copy size={12} /> {codeCopied ? 'Copied ✓' : 'Copy'}
                        </button>
                        <button
                          onClick={() => setShowResetModal(true)}
                          title="Reset Code"
                          style={{ background: '#334155', border: 'none', color: '#E2E8F0', padding: '5px 10px', borderRadius: 8, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          <RotateCcw size={12} /> Reset
                        </button>
                      </div>
                    </div>

                    {/* Editor Textarea with Line Numbers */}
                    <div style={{ display: 'flex', flex: 1, minHeight: 320, background: '#0F172A' }}>
                      <div style={{ padding: '16px 10px', background: '#090D16', color: '#475569', fontFamily: 'JetBrains Mono, monospace', fontSize: 12.5, lineHeight: '21px', textAlign: 'right', userSelect: 'none', borderRight: '1px solid #1E293B', minWidth: 32 }}>
                        {editorLineNumbers.map(n => <div key={n}>{n}</div>)}
                      </div>

                      <textarea
                        value={codeSnippet}
                        onChange={e => {
                          setCodeSnippet(e.target.value)
                          saveModuleCodingDraft(course._id, activeModuleIndex, e.target.value).catch(() => {})
                        }}
                        placeholder="// Enter your solution code here..."
                        spellCheck={false}
                        style={{
                          flex: 1,
                          padding: 16,
                          fontFamily: 'JetBrains Mono, Menlo, monospace',
                          fontSize: 13,
                          lineHeight: '21px',
                          color: '#34D399',
                          background: 'transparent',
                          border: 'none',
                          outline: 'none',
                          resize: 'vertical',
                          minHeight: 320,
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    {/* Editor Footer Action Bar */}
                    <div style={{ padding: '12px 18px', background: '#1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #334155' }}>
                      <span style={{ fontSize: 11.5, color: '#94A3B8' }}>
                        Press Run Code to execute in isolated sandbox
                      </span>

                      <button
                        onClick={handleRunCode}
                        disabled={codeExecutionRunning}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '9px 20px',
                          background: codeExecutionRunning ? '#6D28D9' : '#7C3AED',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: 10,
                          fontFamily: 'Sora, sans-serif',
                          fontWeight: 800,
                          fontSize: 12.5,
                          cursor: codeExecutionRunning ? 'not-allowed' : 'pointer',
                          boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
                          transition: 'all 0.15s'
                        }}
                      >
                        {codeExecutionRunning ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Play size={14} />}
                        {codeExecutionRunning ? 'Running Tests...' : 'Run Code ⚡'}
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Test Results & Terminal Output Console */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Test Results Header Box */}
                    <div style={{ background: '#FFFFFF', padding: 18, borderRadius: 18, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                          Test Results
                        </h4>
                        <span style={{ fontSize: 11.5, fontWeight: 800, color: codingFeedback?.passed ? '#059669' : '#64748B' }}>
                          {testResults.filter(t => t.passed).length} / {testResults.length} Passed
                        </span>
                      </div>

                      {/* Test Case Cards */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {testResults.length === 0 ? (
                          <div style={{ padding: 14, background: '#F8FAFC', borderRadius: 12, textAlign: 'center', color: '#64748B', fontSize: 12 }}>
                            Click <strong>Run Code ⚡</strong> to execute tests against your solution.
                          </div>
                        ) : (
                          testResults.map((tr, idx) => (
                            <div
                              key={idx}
                              style={{
                                padding: '10px 14px',
                                borderRadius: 12,
                                border: tr.passed ? '1px solid #A7F3D0' : '1px solid #FCA5A5',
                                background: tr.passed ? '#F0FDF4' : '#FEF2F2',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 4
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 12, fontWeight: 800, color: tr.passed ? '#065F46' : '#991B1B', display: 'flex', alignItems: 'center', gap: 5 }}>
                                  {tr.passed ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                  {tr.description || `Test Case #${idx + 1}`}
                                </span>
                                <span style={{ fontSize: 10, fontWeight: 800, padding: '1px 6px', borderRadius: 4, background: tr.passed ? '#DCFCE7' : '#FEE2E2', color: tr.passed ? '#15803D' : '#991B1B' }}>
                                  {tr.passed ? 'PASSED' : 'FAILED'}
                                </span>
                              </div>

                              {!tr.passed && tr.expected && (
                                <div style={{ fontSize: 11, color: '#7F1D1D', marginTop: 2, fontFamily: 'monospace' }}>
                                  <div>Expected: {tr.expected}</div>
                                  <div>Received: {tr.actual || 'undefined'}</div>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>

                      {/* Execution feedback banner */}
                      {codingFeedback && (
                        <div style={{
                          padding: 12,
                          borderRadius: 12,
                          background: codingFeedback.passed ? '#ECFDF5' : '#FEF2F2',
                          border: codingFeedback.passed ? '1px solid #A7F3D0' : '1px solid #FCA5A5',
                          color: codingFeedback.passed ? '#065F46' : '#991B1B',
                          fontSize: 12,
                          fontWeight: 700,
                          lineHeight: 1.4
                        }}>
                          {codingFeedback.message}
                        </div>
                      )}
                    </div>

                    {/* Stdout / Stderr Terminal Console */}
                    <div style={{ background: '#0F172A', padding: 14, borderRadius: 16, border: '1px solid #1E293B', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1E293B', paddingBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94A3B8', fontSize: 11, fontWeight: 700 }}>
                          <Terminal size={13} /> Console Output
                        </div>
                        {executionTime && (
                          <span style={{ fontSize: 10, color: '#64748B' }}>{executionTime}ms</span>
                        )}
                      </div>

                      <div style={{ fontFamily: 'monospace', fontSize: 11.5, color: stderrOutput ? '#F87171' : '#34D399', minHeight: 60, maxHeight: 120, overflowY: 'auto', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
                        {stderrOutput ? stderrOutput : stdoutOutput ? stdoutOutput : '> Ready to execute.'}
                      </div>
                    </div>

                    {/* Continue Action Button when passed */}
                    {codingPassedForModule && (
                      <button
                        onClick={() => {
                          const hasAssignment = !!(course.modules?.[activeModuleIndex]?.assignment?.title)
                          if (hasAssignment) setActiveTab('assignment')
                          else handleCompleteCurrentModule()
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          padding: '12px 20px',
                          background: '#059669',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: 14,
                          fontFamily: 'Sora, sans-serif',
                          fontWeight: 800,
                          fontSize: 13,
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(5,150,105,0.3)'
                        }}
                      >
                        Continue to AI Project Grader <ArrowRight size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── 5. REAL AI PROJECT GRADER & CAPSTONE VALIDATION STAGE ── */}
            {activeTab === 'assignment' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1400, margin: '0 auto', width: '100%' }}>
                {/* Project Header Banner */}
                <div style={{
                  background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
                  padding: '24px 28px',
                  borderRadius: 20,
                  boxShadow: '0 8px 30px rgba(49, 46, 129, 0.25)',
                  color: '#FFFFFF',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 16
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 750 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ padding: '3px 10px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Module {activeModuleIndex + 1} Capstone
                      </span>
                      <span style={{ padding: '3px 10px', background: '#F59E0B', color: '#78350F', borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>
                        {projectSpec?.difficulty || 'Intermediate'}
                      </span>
                      <span style={{ padding: '3px 10px', background: 'rgba(255,255,255,0.15)', borderRadius: 20, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                        ⏱️ {projectSpec?.timeEstimate || '25-35 mins'}
                      </span>
                      <span style={{ padding: '3px 10px', background: 'rgba(255,255,255,0.15)', borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>
                        {projectSpec?.allowedLanguages?.[0] || 'JAVASCRIPT'}
                      </span>
                    </div>
                    <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, margin: '4px 0 0', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                      {projectSpec?.title || m.assignment?.title || `${m.title} — Capstone Project`}
                    </h2>
                    <p style={{ fontSize: 13, color: '#E0E7FF', margin: 0, lineHeight: 1.5 }}>
                      {projectSpec?.objective || m.assignment?.description || 'Implement the required project solution and validate via automated test suite and AI Code Review.'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', padding: '12px 18px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.2)' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 800, letterSpacing: 0.6, color: '#C7D2FE' }}>
                        Best Grader Score
                      </div>
                      <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 900, color: projectBestScore >= 70 ? '#34D399' : projectBestScore > 0 ? '#FBBF24' : '#FFFFFF' }}>
                        {projectBestScore > 0 ? `${projectBestScore}%` : 'Not Submitted'}
                      </div>
                    </div>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: projectPassed ? '#10B981' : 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF'
                    }}>
                      {projectPassed ? <CheckCircle2 size={24} /> : <Award size={24} />}
                    </div>
                  </div>
                </div>

                {/* 2-Column Responsive Workspace */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
                  gap: 20,
                  alignItems: 'start'
                }}>
                  {/* Left Column: Requirements, Rubric & AI Evaluation */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Project Objective & Brief */}
                    <div style={{ background: '#FFFFFF', padding: 20, borderRadius: 18, border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(15,23,42,0.03)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4338CA', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: 'Sora, sans-serif' }}>
                        <Compass size={16} /> Project Objective
                      </div>
                      <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, margin: 0 }}>
                        {projectSpec?.description || projectSpec?.objective || 'Solve the capstone problem following clean code principles and module best practices.'}
                      </p>
                    </div>

                    {/* Technical Requirements Checklist */}
                    <div style={{ background: '#FFFFFF', padding: 20, borderRadius: 18, border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(15,23,42,0.03)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0F172A', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: 'Sora, sans-serif' }}>
                        <CheckSquare size={16} style={{ color: '#6366F1' }} /> Implementation Requirements
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {(projectSpec?.requirements?.length ? projectSpec.requirements : [
                          'Implement core function logic matching exact requirements',
                          'Handle edge cases and invalid parameters safely',
                          'Format output according to specification',
                          'Pass all automated deterministic test assertions'
                        ]).map((req, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12.5, color: '#334155', lineHeight: 1.5 }}>
                            <span style={{ minWidth: 16, height: 16, borderRadius: '50%', background: '#EEF2FF', color: '#4F46E5', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                              {i + 1}
                            </span>
                            <span>{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Grading Rubric */}
                    <div style={{ background: '#FAF5FF', padding: 18, borderRadius: 18, border: '1px solid #E9D5FF', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#7E22CE', fontWeight: 800, fontSize: 12.5, textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: 'Sora, sans-serif' }}>
                        <BarChart3 size={15} /> 4-Factor AI Grading Rubric
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <div style={{ background: '#FFFFFF', padding: '8px 12px', borderRadius: 10, border: '1px solid #F3E8FF', fontSize: 11.5 }}>
                          <span style={{ color: '#6B21A8', fontWeight: 800 }}>⚡ Test Suite: 50%</span>
                          <div style={{ color: '#7E22CE', fontSize: 10.5 }}>Deterministic assertions</div>
                        </div>
                        <div style={{ background: '#FFFFFF', padding: '8px 12px', borderRadius: 10, border: '1px solid #F3E8FF', fontSize: 11.5 }}>
                          <span style={{ color: '#6B21A8', fontWeight: 800 }}>📋 Requirements: 20%</span>
                          <div style={{ color: '#7E22CE', fontSize: 10.5 }}>Feature completeness</div>
                        </div>
                        <div style={{ background: '#FFFFFF', padding: '8px 12px', borderRadius: 10, border: '1px solid #F3E8FF', fontSize: 11.5 }}>
                          <span style={{ color: '#6B21A8', fontWeight: 800 }}>✨ Code Quality: 15%</span>
                          <div style={{ color: '#7E22CE', fontSize: 10.5 }}>Readability & styling</div>
                        </div>
                        <div style={{ background: '#FFFFFF', padding: '8px 12px', borderRadius: 10, border: '1px solid #F3E8FF', fontSize: 11.5 }}>
                          <span style={{ color: '#6B21A8', fontWeight: 800 }}>🏗️ Architecture: 15%</span>
                          <div style={{ color: '#7E22CE', fontSize: 10.5 }}>Design & resilience</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: '#6B21A8', fontWeight: 700, textAlign: 'center', marginTop: 2 }}>
                        Passing Threshold: ≥ 70% Overall Score
                      </div>
                    </div>

                    {/* AI Feedback & Review Panel (when graded) */}
                    {projectGradingResult && (
                      <div style={{
                        background: '#FFFFFF',
                        padding: 20,
                        borderRadius: 18,
                        border: projectGradingResult.passed ? '2px solid #10B981' : '2px solid #F59E0B',
                        boxShadow: '0 4px 16px rgba(15,23,42,0.06)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 14
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 800, color: '#0F172A' }}>
                            <Bot size={18} style={{ color: '#4F46E5' }} /> AI Grader Evaluation
                          </div>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 800,
                            background: projectGradingResult.passed ? '#ECFDF5' : '#FEF2F2',
                            color: projectGradingResult.passed ? '#065F46' : '#991B1B'
                          }}>
                            {projectGradingResult.passed ? 'PASSED (≥70%)' : 'NEEDS REVISION (<70%)'}
                          </span>
                        </div>

                        {/* Score Overview */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#F8FAFC', padding: 12, borderRadius: 14 }}>
                          <div style={{
                            width: 54,
                            height: 54,
                            borderRadius: '50%',
                            background: projectGradingResult.passed ? '#10B981' : '#F59E0B',
                            color: '#FFFFFF',
                            fontFamily: 'Sora, sans-serif',
                            fontSize: 18,
                            fontWeight: 900,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {projectGradingResult.finalScore || projectGradingResult.score || 0}%
                          </div>
                          <div style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.45 }}>
                            <strong>Evaluation Summary:</strong> {projectGradingResult.aiFeedback?.summary || 'Project evaluation completed across all criteria.'}
                          </div>
                        </div>

                        {/* Breakdown Metrics */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11.5, color: '#475569' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                            <span>Deterministic Tests (50%):</span>
                            <span>{projectGradingResult.testScore ?? 100}%</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                            <span>Requirements Coverage (20%):</span>
                            <span>{projectGradingResult.requirementsScore ?? 85}%</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                            <span>Code Quality & Style (15%):</span>
                            <span>{projectGradingResult.qualityScore ?? 80}%</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                            <span>Architecture & Resilience (15%):</span>
                            <span>{projectGradingResult.architectureScore ?? 80}%</span>
                          </div>
                        </div>

                        {/* Strengths */}
                        {projectGradingResult.aiFeedback?.strengths?.length > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#065F46' }}>
                              🌟 Strengths
                            </span>
                            {projectGradingResult.aiFeedback.strengths.map((str, i) => (
                              <div key={i} style={{ fontSize: 12, color: '#166534', background: '#F0FDF4', padding: '4px 8px', borderRadius: 6 }}>
                                • {str}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Weaknesses / Suggestions */}
                        {projectGradingResult.aiFeedback?.suggestions?.length > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#9A3412' }}>
                              💡 Actionable Suggestions
                            </span>
                            {projectGradingResult.aiFeedback.suggestions.map((sug, i) => (
                              <div key={i} style={{ fontSize: 12, color: '#9A3412', background: '#FFF7ED', padding: '4px 8px', borderRadius: 6 }}>
                                • {sug}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Code Editor, Test Console & Submission */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Code Editor Box */}
                    <div style={{
                      background: '#0F172A',
                      borderRadius: 18,
                      overflow: 'hidden',
                      border: '1px solid #1E293B',
                      boxShadow: '0 8px 32px rgba(15,23,42,0.15)'
                    }}>
                      {/* Editor Toolbar */}
                      <div style={{
                        padding: '12px 18px',
                        background: '#1E293B',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid #334155'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                          <span style={{ marginLeft: 8, fontFamily: 'monospace', fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>
                            solution.{projectSpec?.allowedLanguages?.[0] === 'python' ? 'py' : projectSpec?.allowedLanguages?.[0] === 'sql' ? 'sql' : 'js'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button
                            onClick={handleCopyProjectCode}
                            title="Copy Code"
                            style={{ background: 'rgba(255,255,255,0.08)', color: '#CBD5E1', border: '1px solid #334155', borderRadius: 8, padding: '5px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                          >
                            <Copy size={13} /> {projectCopied ? 'Copied!' : 'Copy'}
                          </button>
                          <button
                            onClick={() => setShowProjectResetModal(true)}
                            title="Reset Starter Code"
                            style={{ background: 'rgba(255,255,255,0.08)', color: '#CBD5E1', border: '1px solid #334155', borderRadius: 8, padding: '5px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                          >
                            <RotateCcw size={13} /> Reset
                          </button>
                        </div>
                      </div>

                      {/* Code Textarea with Line Numbers */}
                      <div style={{ display: 'flex', minHeight: 340, maxHeight: 520, position: 'relative' }}>
                        <div style={{
                          padding: '16px 8px 16px 14px',
                          background: '#0B1120',
                          color: '#475569',
                          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                          fontSize: 12.5,
                          lineHeight: '22px',
                          textAlign: 'right',
                          userSelect: 'none',
                          borderRight: '1px solid #1E293B',
                          minWidth: 36
                        }}>
                          {(projectCode || '').split('\n').map((_, i) => (
                            <div key={i}>{i + 1}</div>
                          ))}
                        </div>

                        <textarea
                          value={projectCode}
                          onChange={(e) => {
                            setProjectCode(e.target.value)
                            saveModuleProjectDraft(course._id, activeModuleIndex, e.target.value).catch(() => {})
                          }}
                          placeholder="// Write and implement your capstone project solution here..."
                          spellCheck={false}
                          style={{
                            flex: 1,
                            padding: '16px 18px',
                            background: '#0F172A',
                            color: '#E2E8F0',
                            border: 'none',
                            outline: 'none',
                            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                            fontSize: 12.5,
                            lineHeight: '22px',
                            resize: 'vertical',
                            tabSize: 2,
                            whiteSpace: 'pre',
                            overflowX: 'auto',
                            minHeight: 340
                          }}
                        />
                      </div>

                      {/* Editor Action Buttons Footer */}
                      <div style={{ padding: '12px 18px', background: '#1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #334155' }}>
                        <span style={{ fontSize: 11, color: '#94A3B8' }}>
                          Draft autosaved to your profile
                        </span>

                        <div style={{ display: 'flex', gap: 10 }}>
                          <button
                            onClick={handleRunProjectTests}
                            disabled={projectTestingRunning || projectGradingRunning}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '9px 16px',
                              background: '#334155',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: 10,
                              fontFamily: 'Sora, sans-serif',
                              fontWeight: 700,
                              fontSize: 12,
                              cursor: 'pointer'
                            }}
                          >
                            <Play size={13} fill="#FFFFFF" /> {projectTestingRunning ? 'Testing...' : 'Run Test Suite'}
                          </button>

                          <button
                            onClick={handleSubmitProject}
                            disabled={projectGradingRunning || projectTestingRunning}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '9px 20px',
                              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: 10,
                              fontFamily: 'Sora, sans-serif',
                              fontWeight: 800,
                              fontSize: 12.5,
                              cursor: 'pointer',
                              boxShadow: '0 4px 14px rgba(79,70,229,0.4)'
                            }}
                          >
                            <Sparkles size={14} /> {projectGradingRunning ? 'AI Grader Evaluating...' : 'Submit to AI Project Grader'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Test Suite Assertions Panel */}
                    <div style={{ background: '#FFFFFF', padding: 18, borderRadius: 16, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Zap size={14} style={{ color: '#F59E0B' }} /> Deterministic Test Suite
                        </span>
                        {projectTestResults.length > 0 && (
                          <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: '#F1F5F9', color: '#475569' }}>
                            {projectTestResults.filter(t => t.passed).length} / {projectTestResults.length} Tests Passed
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {projectTestResults.length === 0 ? (
                          <div style={{ padding: 12, background: '#F8FAFC', borderRadius: 10, fontSize: 12, color: '#64748B', textAlign: 'center' }}>
                            Click <strong>Run Test Suite</strong> or <strong>Submit to AI Project Grader</strong> to evaluate your solution against test cases.
                          </div>
                        ) : (
                          projectTestResults.map((tr, idx) => (
                            <div
                              key={idx}
                              style={{
                                padding: '8px 12px',
                                borderRadius: 10,
                                border: tr.passed ? '1px solid #A7F3D0' : '1px solid #FCA5A5',
                                background: tr.passed ? '#F0FDF4' : '#FEF2F2',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 12, fontWeight: 800, color: tr.passed ? '#065F46' : '#991B1B', display: 'flex', alignItems: 'center', gap: 5 }}>
                                  {tr.passed ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                                  {tr.description || `Test Case #${idx + 1}`}
                                </span>
                                <span style={{ fontSize: 10, fontWeight: 800, padding: '1px 6px', borderRadius: 4, background: tr.passed ? '#DCFCE7' : '#FEE2E2', color: tr.passed ? '#15803D' : '#991B1B' }}>
                                  {tr.passed ? 'PASSED' : 'FAILED'}
                                </span>
                              </div>
                              {!tr.passed && tr.expected && (
                                <div style={{ fontSize: 11, color: '#7F1D1D', fontFamily: 'monospace' }}>
                                  Expected: {tr.expected} | Received: {tr.actual || 'undefined'}
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Stdout / Stderr Terminal Console */}
                    <div style={{ background: '#0F172A', padding: 14, borderRadius: 16, border: '1px solid #1E293B', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1E293B', paddingBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94A3B8', fontSize: 11, fontWeight: 700 }}>
                          <Terminal size={13} /> Execution Console Output
                        </div>
                        {projectExecutionTime && (
                          <span style={{ fontSize: 10, color: '#64748B' }}>{projectExecutionTime}ms</span>
                        )}
                      </div>

                      <div style={{ fontFamily: 'monospace', fontSize: 11.5, color: projectStderr ? '#F87171' : '#34D399', minHeight: 50, maxHeight: 100, overflowY: 'auto', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
                        {projectStderr ? projectStderr : projectStdout ? projectStdout : '> Ready for project execution.'}
                      </div>
                    </div>

                    {/* Final Completion Action Banner */}
                    {(projectPassed || assignmentPassedForModule || isCurrentCompleted) && (
                      <div style={{
                        background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                        padding: 18,
                        borderRadius: 16,
                        border: '1px solid #A7F3D0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 14
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#065F46' }}>
                          <Trophy size={24} style={{ color: '#059669' }} />
                          <div>
                            <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 14 }}>
                              Module {activeModuleIndex + 1} Fully Mastered & Completed!
                            </div>
                            <div style={{ fontSize: 12, color: '#047857' }}>
                              All 5 stages completed. You earned 100 XP and 50 Coins.
                            </div>
                          </div>
                        </div>

                        {activeModuleIndex < (course.modules?.length || 1) - 1 ? (
                          <button
                            onClick={handleAdvanceToNextModule}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '10px 18px',
                              background: '#059669',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: 12,
                              fontFamily: 'Sora, sans-serif',
                              fontWeight: 800,
                              fontSize: 13,
                              cursor: 'pointer',
                              boxShadow: '0 4px 12px rgba(5,150,105,0.3)'
                            }}
                          >
                            Next Module <ArrowRight size={15} />
                          </button>
                        ) : (
                          <div style={{ padding: '8px 14px', background: '#059669', color: '#FFFFFF', borderRadius: 10, fontWeight: 800, fontSize: 12 }}>
                            🎓 Course Completed!
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ── RESET PROJECT STARTER MODAL ── */}
      {showProjectResetModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#FFFFFF', padding: 24, borderRadius: 20, maxWidth: 400, width: '100%', boxShadow: '0 12px 36px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>
              Reset Capstone Code?
            </h3>
            <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5, margin: '0 0 20px' }}>
              Are you sure you want to reset your project solution code back to the starter scaffold? Any unsaved changes will be discarded.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => setShowProjectResetModal(false)}
                style={{ padding: '8px 16px', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 12, fontWeight: 700, color: '#475569', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleResetProjectStarter}
                style={{ padding: '8px 18px', background: '#DC2626', color: '#FFFFFF', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}
              >
                Reset Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── RESET CODE CONFIRMATION MODAL ── */}
      {showResetModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#FFFFFF', padding: 24, borderRadius: 20, maxWidth: 400, width: '100%', boxShadow: '0 12px 36px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>
              Reset Starter Code?
            </h3>
            <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5, margin: '0 0 20px' }}>
              Are you sure you want to reset your editor code back to the original starter template? Any unsaved edits will be discarded.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => setShowResetModal(false)}
                style={{ padding: '8px 16px', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 12, fontWeight: 700, color: '#475569', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleResetStarterCode}
                style={{ padding: '8px 18px', background: '#DC2626', color: '#FFFFFF', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}
              >
                Reset Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CONTEXTUAL AI TUTOR DRAWER ── */}
      {isTutorOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: 420, maxWidth: '90vw', background: '#FFFFFF', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 24px rgba(0,0,0,0.15)' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bot size={18} style={{ color: '#7C3AED' }} />
                <div>
                  <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 800, color: '#0F172A', margin: 0 }}>ZenScore AI Tutor</h3>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Module {activeModuleIndex + 1}: {m.title}</span>
                </div>
              </div>
              <button onClick={() => setIsTutorOpen(false)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ flex: 1, padding: 18, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {tutorMessages.length === 0 && (
                <div style={{ padding: 16, background: '#F5F3FF', borderRadius: 14, border: '1px solid #DDD6FE', fontSize: 12.5, color: '#6D28D9', lineHeight: 1.6 }}>
                  👋 Hi {user?.name || 'there'}! I am your AI coach for <strong>{course.title}</strong>. Ask me to clarify concepts, explain diagrams, or debug code for <em>{m.title}</em>.
                </div>
              )}

              {tutorMessages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: 14,
                    maxWidth: '85%',
                    fontSize: 12.5,
                    lineHeight: 1.55,
                    background: msg.sender === 'user' ? '#7C3AED' : '#F1F5F9',
                    color: msg.sender === 'user' ? '#FFFFFF' : '#0F172A',
                    whiteSpace: 'pre-line'
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {tutorLoading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#7C3AED', fontSize: 12, fontWeight: 700 }}>
                  <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> AI Tutor is thinking...
                </div>
              )}
            </div>

            <div style={{ padding: 16, borderTop: '1px solid #E2E8F0', display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="Ask about this module..."
                value={tutorInput}
                onChange={e => setTutorInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendTutorMessage()}
                style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 12.5, outline: 'none' }}
              />
              <button
                onClick={handleSendTutorMessage}
                disabled={tutorLoading || !tutorInput.trim()}
                style={{ background: '#7C3AED', color: '#FFFFFF', border: 'none', padding: '10px 14px', borderRadius: 10, cursor: 'pointer' }}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PERSONAL STUDY NOTES DRAWER ── */}
      {isNotesDrawerOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: 420, maxWidth: '90vw', background: '#FFFFFF', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 24px rgba(0,0,0,0.15)' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BookOpen size={18} style={{ color: '#059669' }} />
                <div>
                  <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 800, color: '#0F172A', margin: 0 }}>My Study Notes</h3>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Module {activeModuleIndex + 1}: {m.title}</span>
                </div>
              </div>
              <button onClick={() => setIsNotesDrawerOpen(false)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ flex: 1, padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>
                Personal notes written here are automatically saved and associated with this module in MongoDB.
              </p>

              <textarea
                value={studyNoteText}
                onChange={e => setStudyNoteText(e.target.value)}
                placeholder="Write your personal insights, code reminders, and key takeaways here..."
                style={{ flex: 1, padding: 14, borderRadius: 12, border: '1px solid #CBD5E1', fontSize: 13, lineHeight: 1.6, outline: 'none', resize: 'none', fontFamily: 'DM Sans, sans-serif' }}
              />

              {noteSavedFeedback && (
                <div style={{ color: '#059669', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Check size={14} /> Notes saved to your cloud profile!
                </div>
              )}
            </div>

            <div style={{ padding: 16, borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => setIsNotesDrawerOpen(false)}
                style={{ padding: '9px 16px', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 12, fontWeight: 700, color: '#475569', cursor: 'pointer' }}
              >
                Close
              </button>
              <button
                onClick={handleSaveStudyNote}
                disabled={noteSaving}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#059669', color: '#FFFFFF', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}
              >
                <Save size={14} /> {noteSaving ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
