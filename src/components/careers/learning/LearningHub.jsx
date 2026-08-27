import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCareer } from '../../../context/CareerContext'
import { useStudentProfile } from '../../../context/StudentProfileContext'
import { generatePersonalizedRoadmap } from '../../../services/skills/roadmapGenerator'
import { resolveCanonicalCareerGoal, normalizeCareerTitle } from '../../../services/careers/careerNormalizer'
import { formatSkillId } from '../../../services/careers/careerSkillResolver'
import {
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
  ArrowRight,
  ExternalLink,
  Code,
  Video,
  FileText,
  Compass,
  X,
  Target,
  Award,
  Layers,
  RefreshCw,
  BookOpen
} from 'lucide-react'

export default function LearningHub({ selectedRole, onSelectCareerRole, onNavigateTab }) {
  const navigate = useNavigate()
  const career = useCareer()
  const studentProfileCtx = useStudentProfile()
  const learnData = career?.learningData
  const isLoading = career?.isBackendLoading && !learnData

  // Single Source of Truth Precedence:
  // 1. studentProfile.careerProfile.selectedCareerGoal
  // 2. career.currentCareer
  // 3. selectedRole prop
  // 4. LocalStorage persistence
  const currentCareer = useMemo(() => {
    return resolveCanonicalCareerGoal(studentProfileCtx?.profile, career, selectedRole)
  }, [studentProfileCtx?.profile, career, selectedRole])

  const hasGoal = Boolean(currentCareer)

  // Live Metrics from CareerContext & Backend
  const completedSkillsList = useMemo(() => {
    const fromLearn = learnData?.completedSkills || []
    const fromContext = career?.verifiedSkillsList || []
    const fromProfile = career?.careerProfile?.skillsSummary?.completedSkills || []
    return Array.from(new Set([...fromLearn, ...fromContext, ...fromProfile]))
  }, [learnData?.completedSkills, career?.verifiedSkillsList, career?.careerProfile?.skillsSummary?.completedSkills])

  const inProgressSkillsList = useMemo(() => {
    const fromLearn = (learnData?.skillsTree || []).filter(s => s.status === 'in-progress').map(s => s.name)
    const fromProfile = career?.careerProfile?.skillsSummary?.skillsInProgress || []
    return Array.from(new Set([...fromLearn, ...fromProfile]))
  }, [learnData?.skillsTree, career?.careerProfile?.skillsSummary?.skillsInProgress])

  const completedCount = completedSkillsList.length
  const roadmapProgress = learnData?.learningProgress !== undefined ? learnData.learningProgress : (career?.roadmapProgress || 0)
  const currentRoadmapStage = learnData?.currentStage || (hasGoal ? `Stage 2: Core ${currentCareer} Skill Building` : 'Stage 1: Select Target Career Goal')
  const estimatedCompletion = 'Estimated Ready in 3 Months'

  // Toast Notification
  const [toastMsg, setToastMsg] = useState('')
  const triggerToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3500)
  }

  // Skill Selection Drawer State
  const [selectedSkill, setSelectedSkill] = useState(null)

  // Define skill tree array matching active target career path
  const skillsList = useMemo(() => {
    const setNames = new Set(completedSkillsList)

    // Check if CareerContext has an active roadmap for the current career
    const activeRoadmap = (normalizeCareerTitle(career?.currentRoadmap?.targetCareer) === currentCareer && career.currentRoadmap.phases)
      ? career.currentRoadmap
      : generatePersonalizedRoadmap(currentCareer)

    const phases = activeRoadmap?.phases || []

    return phases.map((p, idx) => {
      const sName = p.skill || p.title?.replace(/^Phase \d+:\s*/, '') || `Skill ${idx + 1}`
      const isCompleted = p.isCompleted || setNames.has(sName) || setNames.has(sName.split(' ')[0])
      const isProgInBackend = inProgressSkillsList.some(ips => ips && (ips.toLowerCase() === sName.toLowerCase() || sName.toLowerCase().includes(ips.toLowerCase())))
      const isInProgress = !isCompleted && (p.status === 'Active' || idx === 0 || isProgInBackend)
      const isRecommended = !isCompleted && !isInProgress && idx < 3
      const isLocked = !isCompleted && !isInProgress && !isRecommended

      let status = 'locked'
      if (isCompleted) status = 'completed'
      else if (isInProgress) status = 'in-progress'
      else if (isRecommended) status = 'recommended'

      const rawProjects = p.projects
        ? typeof p.projects === 'object'
          ? Object.values(p.projects).filter(Boolean)
          : Array.isArray(p.projects) ? p.projects : [p.projects]
        : [`Build proof-of-concept module for ${sName}`]

      const realSkillId = formatSkillId(sName)

      return {
        id: realSkillId,
        skillId: realSkillId,
        name: sName,
        category: `Phase ${p.phase || idx + 1}`,
        difficulty: (p.estimatedDays || 10) > 14 ? 'Advanced' : (p.estimatedDays || 10) > 7 ? 'Intermediate' : 'Beginner',
        estTime: `${p.estimatedDays || (idx + 1) * 3 + 2} Days`,
        whyMatters: p.completionCriteria || `Essential production skill for ${currentCareer || 'Software Engineering'}.`,
        prereqs: idx === 0 ? 'None' : (phases[idx - 1]?.skill || 'Previous Phase'),
        projects: rawProjects.length > 0 ? rawProjects : [`Build enterprise module for ${sName}`],
        courseId: `course-${sName.toLowerCase().replace(/[^a-z]/g, '')}`,
        status
      }
    })
  }, [completedSkillsList, career?.currentRoadmap, currentCareer])

  const totalSkillsCount = skillsList?.length || 10

  // Resolve next unverified skill for the current target career (Stage 2 Focus)
  const nextUnverifiedSkill = useMemo(() => {
    if (!skillsList || skillsList.length === 0) return null
    return skillsList.find(s => s.status !== 'completed') || skillsList[0]
  }, [skillsList])

  // Deep-link query parameter parsing for target skill (?skillId=sk_javascript or ?skill=JavaScript)
  const deepLinkedSkill = useMemo(() => {
    if (!skillsList || skillsList.length === 0) return null
    const urlParams = new URLSearchParams(window.location.search)
    const targetId = urlParams.get('skillId')
    const targetName = urlParams.get('skill')

    if (targetId) {
      const match = skillsList.find(s => s.id === targetId || s.id === formatSkillId(targetId))
      if (match) return match
    }
    if (targetName) {
      const match = skillsList.find(s => s.name.toLowerCase() === targetName.toLowerCase() || formatSkillId(s.name) === formatSkillId(targetName))
      if (match) return match
    }
    return null
  }, [skillsList])

  const activeFocusSkill = deepLinkedSkill || nextUnverifiedSkill

  // Auto-scroll to Skill Roadmap when navigated with focus=skills, stage=2, or skillId query
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('focus') === 'skills' || urlParams.get('stage') === '2' || urlParams.get('skillId') || urlParams.get('skill')) {
      const el = document.getElementById('interactive-skill-roadmap')
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200)
      }
    }
  }, [])

const CAREER_RESOURCES_DATABASE = {
  'Frontend Engineer': [
    { id: 'course-fe-1', title: 'React & Next.js Enterprise Architecture', type: 'Course', duration: '14h 30m', level: 'Intermediate', technology: 'React & Next.js' },
    { id: 'course-fe-2', title: 'Modern TypeScript & Frontend State Management', type: 'Interactive Lab', duration: '10h', level: 'Intermediate', technology: 'TypeScript & Redux' },
    { id: 'course-fe-3', title: 'Tailwind CSS & Responsive UI Systems', type: 'Course', duration: '8h 15m', level: 'Beginner', technology: 'Tailwind & Design Systems' },
    { id: 'course-fe-4', title: 'Core Web Vitals & Web Performance Optimization', type: 'Masterclass', duration: '6h 45m', level: 'Advanced', technology: 'Performance & Lighthouse' },
    { id: 'course-fe-5', title: 'Testing React Apps with Jest & RTL', type: 'Interactive Lab', duration: '7h 30m', level: 'Intermediate', technology: 'Jest & RTL' },
    { id: 'course-fe-6', title: 'GraphQL & REST API Integration for Frontend', type: 'Course', duration: '9h', level: 'Intermediate', technology: 'GraphQL & Axios' },
  ],
  'Backend Engineer': [
    { id: 'course-be-1', title: 'Microservices Architecture with Spring Boot & Node.js', type: 'Course', duration: '16h', level: 'Advanced', technology: 'Node.js & Java' },
    { id: 'course-be-2', title: 'High-Scalability System Design & Load Balancing', type: 'Masterclass', duration: '12h', level: 'Advanced', technology: 'Distributed Systems' },
    { id: 'course-be-3', title: 'PostgreSQL & MongoDB Database Indexing & Performance', type: 'Course', duration: '10h 30m', level: 'Intermediate', technology: 'SQL & NoSQL' },
    { id: 'course-be-4', title: 'Docker Containers & Kubernetes Orchestration', type: 'Interactive Lab', duration: '11h 15m', level: 'Intermediate', technology: 'Docker & K8s' },
    { id: 'course-be-5', title: 'Redis Caching & Event-Driven Architecture', type: 'Interactive Lab', duration: '8h', level: 'Intermediate', technology: 'Redis & RabbitMQ' },
    { id: 'course-be-6', title: 'AWS Cloud Deployment & Infrastructure', type: 'Course', duration: '14h 45m', level: 'Advanced', technology: 'AWS & Terraform' },
  ],
  'Full Stack Developer': [
    { id: 'course-fs-1', title: 'MERN Stack Web Development Masterclass', type: 'Course', duration: '20h', level: 'Intermediate', technology: 'MongoDB, Express, React, Node' },
    { id: 'course-fs-2', title: 'Full Stack TypeScript & Next.js Application', type: 'Interactive Lab', duration: '14h', level: 'Intermediate', technology: 'Next.js & Prisma' },
    { id: 'course-fs-3', title: 'RESTful API & GraphQL Backend Integration', type: 'Course', duration: '9h 30m', level: 'Intermediate', technology: 'Node & Express' },
    { id: 'course-fs-4', title: 'Docker Containerization for Full Stack Apps', type: 'Interactive Lab', duration: '7h 45m', level: 'Intermediate', technology: 'Docker' },
    { id: 'course-fs-5', title: 'PostgreSQL Relational DB Design & Deployment', type: 'Course', duration: '11h', level: 'Intermediate', technology: 'PostgreSQL' },
  ],
  'AI Engineer': [
    { id: 'course-ai-1', title: 'RAG Architecture & LLM Orchestration with LangChain', type: 'Masterclass', duration: '15h', level: 'Advanced', technology: 'LangChain & Python' },
    { id: 'course-ai-2', title: 'PyTorch Deep Learning & Model Fine-Tuning', type: 'Course', duration: '18h 30m', level: 'Advanced', technology: 'PyTorch & Transformers' },
    { id: 'course-ai-3', title: 'Vector Databases (Qdrant / Pinecone) & Embeddings', type: 'Interactive Lab', duration: '8h 45m', level: 'Intermediate', technology: 'Qdrant & OpenAI' },
    { id: 'course-ai-4', title: 'FastAPI Production Model Deployment & APIs', type: 'Course', duration: '9h 15m', level: 'Intermediate', technology: 'FastAPI & Docker' },
    { id: 'course-ai-5', title: 'Prompt Engineering & Fine-tuning LLMs', type: 'Interactive Lab', duration: '6h 30m', level: 'Intermediate', technology: 'LLMs & HuggingFace' },
  ],
  'Machine Learning Engineer': [
    { id: 'course-ml-1', title: 'Machine Learning Specialization: Scikit-Learn & PyTorch', type: 'Masterclass', duration: '22h', level: 'Advanced', technology: 'PyTorch & Python' },
    { id: 'course-ml-2', title: 'MLOps: Production Model Deployment & MLflow Tracking', type: 'Course', duration: '14h 30m', level: 'Advanced', technology: 'MLflow & Docker' },
    { id: 'course-ml-3', title: 'TensorFlow & Deep Neural Networks in Production', type: 'Interactive Lab', duration: '12h', level: 'Advanced', technology: 'TensorFlow & Keras' },
    { id: 'course-ml-4', title: 'FastAPI High-Performance Inference Services', type: 'Course', duration: '9h 15m', level: 'Intermediate', technology: 'FastAPI & Docker' },
    { id: 'course-ml-5', title: 'Applied Mathematics, Linear Algebra & Probability for ML', type: 'Course', duration: '10h 45m', level: 'Intermediate', technology: 'NumPy & SciPy' },
  ],
  'DevOps Engineer': [
    { id: 'course-do-1', title: 'Docker Containerization & Multi-Stage Builds', type: 'Course', duration: '10h', level: 'Intermediate', technology: 'Docker' },
    { id: 'course-do-2', title: 'Kubernetes Cluster Management & Helm Charts', type: 'Masterclass', duration: '16h', level: 'Advanced', technology: 'Kubernetes & Helm' },
    { id: 'course-do-3', title: 'CI/CD Pipelines with GitHub Actions & GitLab', type: 'Interactive Lab', duration: '9h 30m', level: 'Intermediate', technology: 'CI/CD & Git' },
    { id: 'course-do-4', title: 'Terraform Infrastructure as Code (IaC) on AWS', type: 'Course', duration: '12h 15m', level: 'Advanced', technology: 'Terraform & AWS' },
    { id: 'course-do-5', title: 'Linux System Administration & Shell Scripting', type: 'Course', duration: '11h 45m', level: 'Beginner', technology: 'Linux & Bash' },
  ],
  'Data Scientist': [
    { id: 'course-ds-1', title: 'Python for Data Analysis with Pandas & NumPy', type: 'Course', duration: '14h', level: 'Intermediate', technology: 'Pandas & NumPy' },
    { id: 'course-ds-2', title: 'Machine Learning Algorithms & Scikit-Learn', type: 'Masterclass', duration: '18h 30m', level: 'Advanced', technology: 'Scikit-Learn & ML' },
    { id: 'course-ds-3', title: 'Exploratory Data Analysis & Data Visualization', type: 'Interactive Lab', duration: '9h', level: 'Intermediate', technology: 'Matplotlib & Seaborn' },
    { id: 'course-ds-4', title: 'SQL for Complex Data Analytics & Window Functions', type: 'Course', duration: '10h 15m', level: 'Intermediate', technology: 'SQL & PostgreSQL' },
  ],
  'Cloud Engineer': [
    { id: 'course-ce-1', title: 'AWS Cloud Practitioner & Solutions Architect', type: 'Course', duration: '16h', level: 'Intermediate', technology: 'AWS Services' },
    { id: 'course-ce-2', title: 'Cloud Networking, VPC & Security Groups', type: 'Interactive Lab', duration: '10h 30m', level: 'Advanced', technology: 'AWS VPC & Cloud Security' },
    { id: 'course-ce-3', title: 'Docker Containers & Cloud Microservices', type: 'Course', duration: '11h', level: 'Intermediate', technology: 'Docker & ECS' },
  ],
  'Cybersecurity Engineer': [
    { id: 'course-cy-1', title: 'Ethical Hacking & Penetration Testing Mastery', type: 'Masterclass', duration: '18h', level: 'Advanced', technology: 'Kali Linux & Metasploit' },
    { id: 'course-cy-2', title: 'SIEM & Threat Detection with Splunk / Elastic', type: 'Interactive Lab', duration: '12h 30m', level: 'Intermediate', technology: 'SIEM & Log Analysis' },
    { id: 'course-cy-3', title: 'Network Security Protocols & Cryptography', type: 'Course', duration: '11h', level: 'Intermediate', technology: 'TLS, WireShark, RSA' },
  ]
}

  // Real Courses & Resources list from database / courses portal
  const learningResources = useMemo(() => {
    if (learnData?.learningResources && learnData.learningResources.length > 0) {
      return learnData.learningResources.map(r => ({
        id: r.id || r._id,
        title: r.title || 'Web Architecture',
        type: r.type || 'Course',
        duration: r.duration || '10h',
        level: r.level || 'Intermediate',
        technology: r.technology || 'Web Engineering'
      }))
    }

    return CAREER_RESOURCES_DATABASE[currentCareer] || CAREER_RESOURCES_DATABASE['Backend Engineer']
  }, [learnData, currentCareer])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '16px 0 48px', fontFamily: 'DM Sans, sans-serif' }}>

      {/* SKELETON LOADER */}
      {isLoading && (
        <div style={{ padding: 20, borderRadius: 16, background: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <RefreshCw size={18} className="animate-spin" style={{ color: '#2563EB' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#64748B' }}>Syncing Learning Hub with live MongoDB collections...</span>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: 24,
              right: 24,
              zIndex: 99999,
              background: '#0F172A',
              color: '#FFFFFF',
              padding: '12px 20px',
              borderRadius: 14,
              boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: 'Sora, sans-serif',
              fontSize: 13,
              fontWeight: 700
            }}
          >
            <Sparkles size={16} style={{ color: '#FDE047' }} />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ── CARD 1: ACTIVE CAREER GOAL BANNER ── */}
      {!hasGoal ? (
        <div style={{ background: '#FFFBEB', borderRadius: 24, padding: '24px 28px', border: '1px solid #FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: '#FEF3C7', border: '1px solid #FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
              <Compass size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#B45309', fontFamily: 'Sora, sans-serif' }}>
                  Action Required
                </span>
              </div>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 800, color: '#92400E', margin: '4px 0 0' }}>
                Select Your Target Career Goal
              </h2>
              <span style={{ fontSize: 12.5, color: '#B45309', fontWeight: 600 }}>
                Select a target placement role in Careers Overview to generate your dynamic skill roadmap and learning path.
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab && onNavigateTab('overview')}
            style={{ background: '#D97706', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: 14, fontSize: 12.5, fontWeight: 800, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}
          >
            Select Career Goal →
          </button>
        </div>
      ) : (
        <div style={{ background: '#FFFFFF', borderRadius: 24, padding: '24px 28px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: '#EFF6FF', border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
              <Target size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#2563EB', fontFamily: 'Sora, sans-serif' }}>
                  Canonical Career Goal
                </span>
                <span style={{ fontSize: 10.5, fontWeight: 800, padding: '2px 8px', borderRadius: 10, background: '#F0FDF4', color: '#059669', border: '1px solid #BBF7D0' }}>
                  Active Synchronized
                </span>
              </div>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, color: '#0F172A', margin: '4px 0 0' }}>
                Learning Hub: {currentCareer}
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: '8px 16px', borderRadius: 14, background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: 12, fontWeight: 700, color: '#475569' }}>
              Stage: <span style={{ color: '#0F172A', fontWeight: 800 }}>{currentRoadmapStage}</span>
            </div>
            <div style={{ padding: '8px 16px', borderRadius: 14, background: '#F5F3FF', border: '1px solid #DDD6FE', fontSize: 12, fontWeight: 700, color: '#6D28D9' }}>
              Roadmap Progress: <span style={{ fontWeight: 800 }}>{roadmapProgress}%</span>
            </div>
          </div>
        </div>
      )}

      {/* ── CARD 2: INTERACTIVE SKILL ROADMAP & TREE ── */}
      <div id="interactive-skill-roadmap" style={{ background: '#FFFFFF', borderRadius: 24, padding: '24px 28px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                ⚡ Interactive Skill Roadmap & Tree ({currentCareer})
              </h3>
              {activeFocusSkill && (
                <span style={{ fontSize: 10.5, fontWeight: 800, padding: '3px 10px', borderRadius: 10, background: '#F5F3FF', color: '#7C3AED', border: '1px solid #DDD6FE', fontFamily: 'Sora, sans-serif' }}>
                  Stage 2 Focus: {activeFocusSkill.name}
                </span>
              )}
            </div>
            <span style={{ fontSize: 12.5, color: '#64748B' }}>Click any skill node to view detailed projects, learning resources & verify competency</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#2563EB', background: '#EFF6FF', padding: '6px 14px', borderRadius: 20, border: '1px solid #BFDBFE' }}>
            {completedCount} Verified Skills
          </span>
        </div>

        {/* SKILLS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {skillsList.map((skill, idx) => {
            const isDone = skill.status === 'completed'
            const isInProgress = skill.status === 'in-progress'
            const isRec = skill.status === 'recommended'
            const isLocked = skill.status === 'locked'
            const isTargetFocus = activeFocusSkill && (activeFocusSkill.id === skill.id || activeFocusSkill.name === skill.name) && !isDone

            return (
              <div
                key={idx}
                onClick={() => setSelectedSkill(skill)}
                style={{
                  padding: 18,
                  borderRadius: 18,
                  background: isDone ? '#ECFDF5' : isTargetFocus ? '#F5F3FF' : isInProgress ? '#EFF6FF' : isRec ? '#FFFBEB' : '#F8FAFC',
                  border: isDone ? '1.5px solid #A7F3D0' : isTargetFocus ? '2px solid #7C3AED' : isInProgress ? '2px solid #2563EB' : isRec ? '1.5px solid #FDE68A' : '1px dashed #CBD5E1',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isTargetFocus ? '0 4px 20px rgba(124, 58, 237, 0.2)' : isDone || isInProgress ? '0 4px 14px rgba(0,0,0,0.04)' : 'none',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(124, 58, 237, 0.18)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = isTargetFocus ? '0 4px 20px rgba(124, 58, 237, 0.2)' : isDone || isInProgress ? '0 4px 14px rgba(0,0,0,0.04)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', color: isDone ? '#047857' : isTargetFocus ? '#6D28D9' : isInProgress ? '#1D4ED8' : isRec ? '#B45309' : '#64748B' }}>
                      {skill.category}
                    </span>
                    {isTargetFocus && (
                      <span style={{ fontSize: 9.5, fontWeight: 800, padding: '2px 6px', borderRadius: 8, background: '#7C3AED', color: '#FFFFFF', fontFamily: 'Sora, sans-serif' }}>
                        🎯 STAGE 2 FOCUS
                      </span>
                    )}
                  </div>
                  {isDone && <CheckCircle2 size={16} style={{ color: '#059669' }} />}
                  {isTargetFocus && <Zap size={16} style={{ color: '#7C3AED' }} />}
                  {!isTargetFocus && isInProgress && <Sparkles size={16} style={{ color: '#2563EB' }} />}
                  {!isTargetFocus && isRec && <Zap size={16} style={{ color: '#D97706' }} />}
                  {!isTargetFocus && isLocked && <Lock size={15} style={{ color: '#94A3B8' }} />}
                </div>

                <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 14.5, fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>
                  {skill.name}
                </h4>
                <p style={{ fontSize: 11.5, color: '#64748B', margin: '0 0 12px', lineHeight: 1.35, height: 32, overflow: 'hidden' }}>
                  {skill.whyMatters}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, fontWeight: 800, color: '#475569' }}>
                  <span>{skill.difficulty}</span>
                  <span style={{ color: isTargetFocus ? '#7C3AED' : '#2563EB', display: 'flex', alignItems: 'center', gap: 4 }}>
                    View & Practice →
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── CARD 3: RECOMMENDED LEARNING RESOURCES & COURSES ── */}
      <div style={{ background: '#FFFFFF', borderRadius: 24, padding: '24px 28px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 17, fontWeight: 800, color: '#0F172A', margin: 0 }}>
              📚 Recommended Learning Resources & Courses
            </h3>
            <span style={{ fontSize: 12, color: '#64748B' }}>Access verified courses and interactive practice labs</span>
          </div>
          <button
            onClick={() => navigate('/courses')}
            style={{ background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', padding: '6px 14px', borderRadius: 12, fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}
          >
            Explore Courses Hub →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {learningResources.map((res, rIdx) => {
            const skillTargetId = formatSkillId(res.technology || res.title)
            const handleOpenResource = (e) => {
              if (e) e.stopPropagation()
              try {
                const existing = JSON.parse(localStorage.getItem('zs_active_career_skills') || '[]')
                const updated = [
                  {
                    id: skillTargetId,
                    skillId: skillTargetId,
                    skillName: res.title,
                    name: res.title,
                    category: res.technology || 'Career Track',
                    difficulty: res.level || 'Intermediate',
                    completionPercentage: 0,
                    estimatedTimeRemaining: res.duration || 'In Progress',
                    icon: '📚',
                    lastStudied: 'Active Now'
                  },
                  ...existing.filter(item => {
                    const iId = (item.id || item.skillId || '').toString()
                    const iName = (item.name || item.skillName || '').toLowerCase().replace(/[^a-z0-9]/gi, '')
                    const targetName = (res.title || '').toLowerCase().replace(/[^a-z0-9]/gi, '')
                    return iId !== skillTargetId && iName !== targetName
                  })
                ]
                localStorage.setItem('zs_active_career_skills', JSON.stringify(updated.slice(0, 10)))
              } catch (err) {
                console.warn('[LearningHub] Sync notice:', err)
              }
              triggerToast(`🚀 Opening ${res.title} Module in Skills Hub...`)
              navigate(`/skills/${skillTargetId}?from=career&skill=${encodeURIComponent(res.title)}`)
            }

            return (
              <div
                key={rIdx}
                onClick={handleOpenResource}
                style={{
                  padding: 18,
                  borderRadius: 18,
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.borderColor = '#BFDBFE'
                  e.currentTarget.style.boxShadow = '0 6px 18px rgba(37, 99, 235, 0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = '#E2E8F0'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: '#2563EB', background: '#EFF6FF', padding: '3px 10px', borderRadius: 10, border: '1px solid #BFDBFE' }}>
                    {res.type}
                  </span>
                  <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 700 }}>{res.duration}</span>
                </div>
                <h5 style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.35 }}>
                  {res.title}
                </h5>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>Level: {res.level}</span>
                  <button
                    onClick={handleOpenResource}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #BFDBFE',
                      color: '#2563EB',
                      fontSize: 12,
                      fontWeight: 800,
                      padding: '4px 12px',
                      borderRadius: 10,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontFamily: 'Sora, sans-serif'
                    }}
                  >
                    <span>Start Module</span>
                    <ExternalLink size={13} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── SKILL DETAIL & VERIFICATION DRAWER MODAL ── */}
      <AnimatePresence>
        {selectedSkill && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(6px)', zIndex: 99999, display: 'flex', justifyContent: 'flex-end' }}>
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              style={{ width: 460, maxWidth: '100vw', height: '100vh', background: '#FFFFFF', padding: 32, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 22 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 18 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {selectedSkill.category} • {selectedSkill.difficulty}
                  </span>
                  <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, color: '#0F172A', margin: '4px 0 0' }}>
                    {selectedSkill.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedSkill(null)}
                  style={{ background: '#F1F5F9', border: 'none', borderRadius: 12, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div>
                <h5 style={{ fontSize: 12, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', margin: '0 0 6px', letterSpacing: '0.4px' }}>Why This Skill Matters</h5>
                <p style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.55, margin: 0, fontWeight: 500 }}>{selectedSkill.whyMatters}</p>
              </div>

              <div>
                <h5 style={{ fontSize: 12, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', margin: '0 0 10px', letterSpacing: '0.4px' }}>Recommended Practice Projects</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedSkill.projects.map((proj, pIdx) => (
                    <div key={pIdx} style={{ padding: 12, borderRadius: 12, background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: 13, fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Code size={16} style={{ color: '#2563EB' }} />
                      <span>{proj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTION BUTTONS & GENUINE PROGRESS INFO */}
              <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 12, paddingTop: 16, borderTop: "1px solid #E2E8F0" }}>
                {selectedSkill.status === "completed" ? (
                  <div style={{ padding: "14px 20px", borderRadius: 14, background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#047857", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 13.5, fontWeight: 800, fontFamily: "Sora, sans-serif" }}>
                    <CheckCircle2 size={18} />
                    <span>Competency Verified & Synced ✓</span>
                  </div>
                ) : (
                  <div style={{ padding: "12px 14px", borderRadius: 12, background: "#F8FAFC", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "#475569", fontWeight: 600 }}>
                    <Sparkles size={16} style={{ color: "#7C3AED", flexShrink: 0 }} />
                    <span>Complete curriculum lessons in the Skills module to automatically verify this skill on your career roadmap.</span>
                  </div>
                )}

                <button
                  onClick={() => {
                    const targetSkillId = selectedSkill.id || selectedSkill.skillId || formatSkillId(selectedSkill.name)
                    try {
                      const existing = JSON.parse(localStorage.getItem('zs_active_career_skills') || '[]')
                      const updated = [
                        {
                          id: targetSkillId,
                          skillId: targetSkillId,
                          skillName: selectedSkill.name,
                          name: selectedSkill.name,
                          category: selectedSkill.category || 'Career Track',
                          difficulty: selectedSkill.difficulty || 'Intermediate',
                          completionPercentage: 0,
                          estimatedTimeRemaining: 'In Progress',
                          icon: '⚡',
                          lastStudied: 'Active Now'
                        },
                        ...existing.filter(item => {
                          const iId = (item.id || item.skillId || '').toString()
                          const iName = (item.name || item.skillName || '').toLowerCase().replace(/[^a-z0-9]/gi, '')
                          const targetName = (selectedSkill.name || '').toLowerCase().replace(/[^a-z0-9]/gi, '')
                          return iId !== targetSkillId && iName !== targetName
                        })
                      ]
                      localStorage.setItem('zs_active_career_skills', JSON.stringify(updated.slice(0, 10)))
                    } catch (err) {
                      console.warn('[LearningHub] Skill storage sync notice:', err)
                    }
                    setSelectedSkill(null)
                    triggerToast(`🚀 Opening ${selectedSkill.name} Workspace in Skills Module...`)
                    navigate(`/skills/${targetSkillId}?from=career&skill=${encodeURIComponent(selectedSkill.name)}`)
                  }}
                  style={{
                    padding: "14px 20px",
                    borderRadius: 14,
                    background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                    color: "#FFFFFF",
                    border: "none",
                    fontFamily: "Sora, sans-serif",
                    fontWeight: 800,
                    fontSize: 13.5,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: "0 4px 14px rgba(124, 58, 237, 0.25)",
                    transition: "all 0.15s"
                  }}
                >
                  <BookOpen size={17} />
                  <span>Practice & Learn in Skills Module →</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
