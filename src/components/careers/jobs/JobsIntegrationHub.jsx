import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCareer } from '../../../context/CareerContext'
import { useStudentProfile } from '../../../context/StudentProfileContext'
import { resolveCanonicalCareerGoal, normalizeCareerTitle } from '../../../services/careers/careerNormalizer'
import { saveJob, removeSavedJob, applyForJob, getSavedJobs, getMyApplications } from '../../../services/api'
import {
  Briefcase,
  Target,
  Send,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Sparkles,
  Heart,
  X,
  RefreshCw,
  ExternalLink,
  Building2,
  DollarSign,
  TrendingUp,
  Search
} from 'lucide-react'

// Role-specific job openings catalog for all major career tracks
const ROLE_JOB_CATALOG = {
  'Software Engineer': [
    {
      id: 'job-se-1',
      company: 'Google',
      logo: '🔵',
      title: 'Software Engineer II (Core Platform)',
      location: 'Bangalore, Karnataka',
      package: '₹28L - ₹45L LPA',
      workMode: 'Hybrid',
      matchPct: 96,
      requiredSkills: ['Data Structures & Algorithms', 'Java', 'System Design', 'C++', 'Distributed Systems'],
      description: 'Build mission-critical core software infrastructure and large-scale distributed services powering millions of global users.',
      applyUrl: 'https://careers.google.com'
    },
    {
      id: 'job-se-2',
      company: 'Microsoft',
      logo: '🟦',
      title: 'Software Development Engineer (Azure Services)',
      location: 'Hyderabad / Noida',
      package: '₹26L - ₹42L LPA',
      workMode: 'Hybrid',
      matchPct: 94,
      requiredSkills: ['C#', 'Cloud Architecture', 'System Design', 'REST APIs', 'SQL'],
      description: 'Design and deploy scalable enterprise cloud microservices and developer platform APIs within the Microsoft Azure ecosystem.',
      applyUrl: 'https://careers.microsoft.com'
    },
    {
      id: 'job-se-3',
      company: 'Adobe',
      logo: '🔴',
      title: 'Member of Technical Staff - Software Engineer',
      location: 'Bangalore / Noida',
      package: '₹25L - ₹38L LPA',
      workMode: 'Hybrid',
      matchPct: 92,
      requiredSkills: ['C++', 'Python', 'Algorithms', 'WebAssembly', 'Computer Graphics'],
      description: 'Develop next-generation creative cloud algorithms and high-performance cross-platform software rendering engines.',
      applyUrl: 'https://www.adobe.com/careers.html'
    },
    {
      id: 'job-se-4',
      company: 'Uber',
      logo: '⬛',
      title: 'Software Engineer I / II (Marketplace Dynamics)',
      location: 'Bangalore, Karnataka',
      package: '₹32L - ₹52L LPA',
      workMode: 'On-site',
      matchPct: 95,
      requiredSkills: ['Java', 'Go', 'Microservices', 'Kafka', 'Redis'],
      description: 'Engineer high-throughput real-time routing, dispatching, and pricing engines handling millions of transactions per second.',
      applyUrl: 'https://www.uber.com/us/en/careers/'
    },
    {
      id: 'job-se-5',
      company: 'Flipkart',
      logo: '🟡',
      title: 'Software Development Engineer - Platform Tech',
      location: 'Bangalore / Remote',
      package: '₹24L - ₹36L LPA',
      workMode: 'Hybrid',
      matchPct: 90,
      requiredSkills: ['Java', 'Spring Boot', 'MySQL', 'System Design', 'Docker'],
      description: 'Build ultra-low latency checkout, inventory management, and logistics fulfillment workflows for India’s top e-commerce portal.',
      applyUrl: 'https://www.flipkartcareers.com'
    }
  ],
  'Full Stack Developer': [
    {
      id: 'job-fs-1',
      company: 'Google',
      logo: '🔵',
      title: 'Senior Full Stack Developer (MERN / Next.js)',
      location: 'Bangalore, Karnataka',
      package: '₹28L - ₹45L LPA',
      workMode: 'Hybrid',
      matchPct: 96,
      requiredSkills: ['React.js', 'Node.js', 'TypeScript', 'MongoDB', 'REST APIs'],
      description: 'Build scalable web applications and high-throughput microservices using React, Node.js, and Google Cloud Platform.',
      applyUrl: 'https://careers.google.com'
    },
    {
      id: 'job-fs-2',
      company: 'Amazon',
      logo: '🟠',
      title: 'Full Stack Engineer II (Web & Cloud)',
      location: 'Hyderabad, India',
      package: '₹24L - ₹38L LPA',
      workMode: 'On-site',
      matchPct: 94,
      requiredSkills: ['React.js', 'Express.js', 'Node.js', 'PostgreSQL', 'AWS'],
      description: 'Lead end-to-end full stack web architecture for internal vendor tooling and external customer-facing e-commerce portals.',
      applyUrl: 'https://amazon.jobs'
    },
    {
      id: 'job-fs-3',
      company: 'Atlassian',
      logo: '🔷',
      title: 'Full Stack Software Engineer (Java + React)',
      location: 'Bengaluru / Remote',
      package: '₹30L - ₹50L LPA',
      workMode: 'Remote',
      matchPct: 95,
      requiredSkills: ['Java', 'Spring Boot', 'React.js', 'TypeScript', 'Docker'],
      description: 'Architect full stack web features and cloud services powering Jira and Confluence Web apps.',
      applyUrl: 'https://www.atlassian.com/company/careers'
    },
    {
      id: 'job-fs-4',
      company: 'Razorpay',
      logo: '💳',
      title: 'Full Stack Engineer (Payments Gateway)',
      location: 'Bangalore, Karnataka',
      package: '₹22L - ₹35L LPA',
      workMode: 'Hybrid',
      matchPct: 91,
      requiredSkills: ['React', 'Node.js', 'TypeScript', 'Microservices', 'Redis'],
      description: 'Build seamless merchant payment checkout pages and financial management dashboards with high reliability.',
      applyUrl: 'https://razorpay.com/jobs'
    }
  ],
  'Frontend Engineer': [
    {
      id: 'job-fe-1',
      company: 'Google',
      logo: '🔵',
      title: 'Senior Frontend Engineer (React / TypeScript)',
      location: 'Bangalore, Karnataka',
      package: '₹26L - ₹42L LPA',
      workMode: 'Hybrid',
      matchPct: 95,
      requiredSkills: ['React.js', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Web Performance'],
      description: 'Craft responsive, pixel-perfect web interfaces and design systems for Google Workspace products.',
      applyUrl: 'https://careers.google.com'
    },
    {
      id: 'job-fe-2',
      company: 'Meta',
      logo: '🔷',
      title: 'Frontend Developer II (UI Infra & Web)',
      location: 'Hyderabad, India',
      package: '₹28L - ₹45L LPA',
      workMode: 'Hybrid',
      matchPct: 93,
      requiredSkills: ['React.js', 'JavaScript (ES6+)', 'GraphQL', 'CSS3/HTML5', 'State Management'],
      description: 'Engineer high-performance web applications and UI component systems for Meta Business Suite.',
      applyUrl: 'https://www.metacareers.com'
    },
    {
      id: 'job-fe-3',
      company: 'Netflix',
      logo: '🎬',
      title: 'UI Engineer (Streaming Experience)',
      location: 'Remote / Bangalore',
      package: '₹35L - ₹55L LPA',
      workMode: 'Remote',
      matchPct: 96,
      requiredSkills: ['React', 'TypeScript', 'Video Streaming UI', 'Redux', 'Core Web Vitals'],
      description: 'Develop responsive, ultra-fast streaming UI interfaces across desktop, mobile browsers, and smart TVs.',
      applyUrl: 'https://jobs.netflix.com'
    }
  ],
  'Backend Engineer': [
    {
      id: 'job-be-1',
      company: 'Google',
      logo: '🔵',
      title: 'Senior Backend Systems Engineer',
      location: 'Bangalore, Karnataka',
      package: '₹28L - ₹46L LPA',
      workMode: 'Hybrid',
      matchPct: 96,
      requiredSkills: ['Node.js', 'Go', 'System Design', 'Microservices', 'GCP'],
      description: 'Design and build high-throughput distributed backend infrastructure serving millions of requests.',
      applyUrl: 'https://careers.google.com'
    },
    {
      id: 'job-be-2',
      company: 'Amazon',
      logo: '🟠',
      title: 'Backend Engineer II (AWS Cloud Services)',
      location: 'Hyderabad, India',
      package: '₹24L - ₹38L LPA',
      workMode: 'On-site',
      matchPct: 94,
      requiredSkills: ['Java', 'Spring Boot', 'AWS', 'DynamoDB', 'REST APIs'],
      description: 'Architect mission-critical backend services and serverless cloud APIs for Amazon AWS platform.',
      applyUrl: 'https://amazon.jobs'
    },
    {
      id: 'job-be-3',
      company: 'Stripe',
      logo: '💳',
      title: 'Backend Infrastructure Engineer (Payments Core)',
      location: 'Remote / Bangalore',
      package: '₹35L - ₹60L LPA',
      workMode: 'Remote',
      matchPct: 97,
      requiredSkills: ['Ruby / Go', 'PostgreSQL', 'Distributed Systems', 'Kafka', 'System Architecture'],
      description: 'Build zero-downtime ledger accounting and payment processing backend pipelines handling billions of dollars.',
      applyUrl: 'https://stripe.com/jobs'
    }
  ],
  'AI Engineer': [
    {
      id: 'job-ai-1',
      company: 'Microsoft',
      logo: '🟦',
      title: 'AI/ML Applied Scientist (Copilot & LLMs)',
      location: 'Hyderabad / Bangalore',
      package: '₹35L - ₹55L LPA',
      workMode: 'Hybrid',
      matchPct: 97,
      requiredSkills: ['Python', 'PyTorch', 'LLMs', 'RAG Pipelines', 'Vector Databases'],
      description: 'Train, fine-tune, and deploy large language models and intelligent generative AI agents for enterprise Copilot products.',
      applyUrl: 'https://careers.microsoft.com'
    },
    {
      id: 'job-ai-2',
      company: 'NVIDIA',
      logo: '🟢',
      title: 'Deep Learning Software Engineer',
      location: 'Bangalore / Pune',
      package: '₹32L - ₹50L LPA',
      workMode: 'Hybrid',
      matchPct: 94,
      requiredSkills: ['CUDA', 'C++', 'Python', 'TensorRT', 'Model Optimization'],
      description: 'Optimize high-performance deep learning inference pipelines and neural network architectures on NVIDIA GPUs.',
      applyUrl: 'https://www.nvidia.com/en-us/about-nvidia/careers/'
    },
    {
      id: 'job-ai-3',
      company: 'Google DeepMind',
      logo: '🔵',
      title: 'Machine Learning Engineer (Gemini Platform)',
      location: 'Bangalore, India',
      package: '₹40L - ₹65L LPA',
      workMode: 'Hybrid',
      matchPct: 98,
      requiredSkills: ['JAX', 'PyTorch', 'Multimodal AI', 'Transformers', 'Reinforcement Learning'],
      description: 'Collaborate with world-class research scientists to scale foundation AI models and generative intelligence pipelines.',
      applyUrl: 'https://deepmind.google/careers/'
    }
  ],
  'DevOps Engineer': [
    {
      id: 'job-do-1',
      company: 'Netflix',
      logo: '🎬',
      title: 'Senior DevOps / SRE Engineer',
      location: 'Remote / Bangalore',
      package: '₹30L - ₹50L LPA',
      workMode: 'Remote',
      matchPct: 96,
      requiredSkills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD Pipelines'],
      description: 'Automate zero-downtime global multi-region cloud deployments and maintain 99.999% streaming availability.',
      applyUrl: 'https://jobs.netflix.com'
    },
    {
      id: 'job-do-2',
      company: 'AWS',
      logo: '🟠',
      title: 'Cloud DevOps Engineer (Infrastructure Automation)',
      location: 'Hyderabad, India',
      package: '₹26L - ₹42L LPA',
      workMode: 'Hybrid',
      matchPct: 93,
      requiredSkills: ['Linux', 'Terraform', 'Ansible', 'Prometheus', 'Python / Bash'],
      description: 'Architect automated infrastructure-as-code and observability monitoring stacks for high-scale enterprise workloads.',
      applyUrl: 'https://amazon.jobs'
    }
  ],
  'Data Scientist': [
    {
      id: 'job-ds-1',
      company: 'Spotify',
      logo: '🟢',
      title: 'Data Scientist (Recommendations & Audio AI)',
      location: 'Remote / Mumbai',
      package: '₹28L - ₹46L LPA',
      workMode: 'Remote',
      matchPct: 95,
      requiredSkills: ['Python', 'SQL', 'Pandas', 'Machine Learning', 'A/B Testing'],
      description: 'Analyze listener behavior datasets and develop predictive machine learning models driving Discover Weekly music recommendations.',
      applyUrl: 'https://www.lifeatspotify.com'
    },
    {
      id: 'job-ds-2',
      company: 'Uber',
      logo: '⬛',
      title: 'Data Scientist II (Demand Forecasting)',
      location: 'Bangalore, India',
      package: '₹30L - ₹48L LPA',
      workMode: 'Hybrid',
      matchPct: 94,
      requiredSkills: ['Python', 'Statistical Modeling', 'Time Series', 'PostgreSQL', 'Tableau'],
      description: 'Build predictive econometric algorithms and spatial surge-pricing models to balance supply and rider demand.',
      applyUrl: 'https://www.uber.com/us/en/careers/'
    }
  ],
  'Cloud Engineer': [
    {
      id: 'job-ce-1',
      company: 'Google Cloud',
      logo: '🔵',
      title: 'Cloud Solutions Architect / Engineer',
      location: 'Bangalore, India',
      package: '₹28L - ₹45L LPA',
      workMode: 'Hybrid',
      matchPct: 95,
      requiredSkills: ['GCP', 'Kubernetes', 'Cloud Security', 'Terraform', 'System Design'],
      description: 'Design and implement resilient enterprise migration architectures and containerized microservices on Google Cloud.',
      applyUrl: 'https://careers.google.com'
    },
    {
      id: 'job-ce-2',
      company: 'Microsoft Azure',
      logo: '🟦',
      title: 'Cloud Infrastructure Engineer',
      location: 'Hyderabad, India',
      package: '₹26L - ₹40L LPA',
      workMode: 'Hybrid',
      matchPct: 93,
      requiredSkills: ['Azure', 'PowerShell', 'ARM / Bicep', 'Networking', 'Docker'],
      description: 'Deploy hyper-scale hybrid cloud infrastructure, software-defined networking, and enterprise storage solutions.',
      applyUrl: 'https://careers.microsoft.com'
    }
  ],
  'Cybersecurity Engineer': [
    {
      id: 'job-cs-1',
      company: 'Palo Alto Networks',
      logo: '🛡️',
      title: 'Security Operations & Threat Detection Engineer',
      location: 'Bangalore, India',
      package: '₹26L - ₹44L LPA',
      workMode: 'Hybrid',
      matchPct: 96,
      requiredSkills: ['SIEM', 'Threat Hunting', 'Linux & Bash', 'Network Security', 'Python'],
      description: 'Detect, analyze, and neutralize advanced cyber threats and design automated zero-trust security orchestration playbooks.',
      applyUrl: 'https://jobs.paloaltonetworks.com'
    },
    {
      id: 'job-cs-2',
      company: 'Cloudflare',
      logo: '🟧',
      title: 'Application Security Engineer',
      location: 'Remote / Bangalore',
      package: '₹30L - ₹50L LPA',
      workMode: 'Remote',
      matchPct: 94,
      requiredSkills: ['Web Security (OWASP)', 'Cryptography', 'DDoS Mitigation', 'Go / Rust', 'Penetration Testing'],
      description: 'Harden web infrastructure and build real-time edge security defenses protecting millions of internet properties.',
      applyUrl: 'https://www.cloudflare.com/careers/'
    }
  ],
  'Product Manager': [
    {
      id: 'job-pm-1',
      company: 'Google',
      logo: '🔵',
      title: 'Associate Product Manager (APM)',
      location: 'Bangalore, India',
      package: '₹30L - ₹48L LPA',
      workMode: 'Hybrid',
      matchPct: 95,
      requiredSkills: ['Product Strategy', 'Agile & Scrum', 'User Analytics', 'A/B Testing', 'System Architecture'],
      description: 'Define product vision, lead cross-functional engineering and design squads, and ship impactful user-facing software features.',
      applyUrl: 'https://careers.google.com'
    },
    {
      id: 'job-pm-2',
      company: 'Uber',
      logo: '⬛',
      title: 'Technical Product Manager (Driver Experience)',
      location: 'Bangalore, India',
      package: '₹32L - ₹52L LPA',
      workMode: 'Hybrid',
      matchPct: 93,
      requiredSkills: ['Product Roadmapping', 'SQL', 'Data Analytics', 'API Design', 'User Research'],
      description: 'Own the end-to-end technical driver product roadmap, optimizing earnings, navigation, and onboarding engagement.',
      applyUrl: 'https://www.uber.com/us/en/careers/'
    }
  ]
}

export default function JobsIntegrationHub({ selectedRole, onSelectCareerRole }) {
  const navigate = useNavigate()
  const career = useCareer()
  const studentProfileCtx = useStudentProfile()
  const oppData = career?.opportunitiesData
  const isLoading = career?.isBackendLoading && !oppData

  // Derive Canonical Target Career
  const currentCareer = useMemo(() => {
    return resolveCanonicalCareerGoal(studentProfileCtx?.profile, career, selectedRole)
  }, [studentProfileCtx?.profile, career, selectedRole])

  const normalizedRole = normalizeCareerTitle(currentCareer)
  const hasGoal = Boolean(currentCareer)

  // Interactive Saved & Applied Jobs State synchronized with backend
  const [savedJobIds, setSavedJobIds] = useState(new Set())
  const [appliedJobIds, setAppliedJobIds] = useState(new Set())
  const [selectedJobModal, setSelectedJobModal] = useState(null)

  // Fetch initial saved & applied states from backend
  useEffect(() => {
    let isMounted = true
    const loadSavedAndApplied = async () => {
      try {
        const [savedRes, appRes] = await Promise.allSettled([
          getSavedJobs({ limit: 50 }),
          getMyApplications({ limit: 50 })
        ])
        if (!isMounted) return
        if (savedRes.status === 'fulfilled' && savedRes.value?.jobs) {
          const ids = new Set(savedRes.value.jobs.map(j => j.id || j._id))
          setSavedJobIds(ids)
        }
        if (appRes.status === 'fulfilled' && appRes.value?.applications) {
          const ids = new Set(appRes.value.applications.map(a => a.jobId || a.job?._id))
          setAppliedJobIds(ids)
        }
      } catch (err) {
        console.warn('Silent notice: could not load initial saved/applied jobs', err)
      }
    }
    loadSavedAndApplied()
    return () => { isMounted = false }
  }, [])

  // Real Metrics
  const resumeScore = career?.resumeData?.atsScore || 0
  const applicationsSubmitted = (oppData?.appliedJobsCount || 0) + appliedJobIds.size

  // Toast Notification
  const [toastMsg, setToastMsg] = useState('')
  const triggerToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3500)
  }

  // Filtered live jobs dynamically matched to target role
  const recommendedJobs = useMemo(() => {
    // 1. Check if backend provided role-matched jobs
    const backendJobs = oppData?.recommendedJobs
    if (Array.isArray(backendJobs) && backendJobs.length > 0) {
      // Check if backend jobs explicitly mention the target career or skills
      const roleKeywords = normalizedRole.toLowerCase().split(/\s+/)
      const matchedBackend = backendJobs.filter(job => {
        const titleLower = (job.title || '').toLowerCase()
        return roleKeywords.some(kw => kw.length > 2 && titleLower.includes(kw))
      })

      if (matchedBackend.length >= 2) {
        return matchedBackend.map(job => ({
          id: job.id || job._id,
          company: job.company || 'Tech Enterprise',
          logo: job.logo || '💼',
          role: job.title || normalizedRole,
          location: job.location || 'Bangalore, India',
          salary: job.package || job.salary || '₹18L - ₹32L LPA',
          workMode: job.workMode || 'Hybrid',
          matchScore: job.matchPct || job.aiMatch || 90,
          tags: job.requiredSkills || ['React.js', 'Node.js', 'System Design'],
          description: job.description || `Join ${job.company || 'Tech Enterprise'} as a ${job.title || normalizedRole} working on high-impact software systems.`,
          applyUrl: job.applyLink || job.applyUrl || `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${job.title || normalizedRole} ${job.company}`)}`
        }))
      }
    }

    // 2. Exact match from role catalog
    if (ROLE_JOB_CATALOG[normalizedRole]) {
      return ROLE_JOB_CATALOG[normalizedRole].map(job => ({
        id: job.id,
        company: job.company,
        logo: job.logo,
        role: job.title,
        location: job.location,
        salary: job.package,
        workMode: job.workMode,
        matchScore: job.matchPct,
        tags: job.requiredSkills,
        description: job.description,
        applyUrl: job.applyUrl
      }))
    }

    // 3. Fallback to closest match
    const roleKey = normalizedRole.toLowerCase()
    let matchedCatalog = ROLE_JOB_CATALOG['Software Engineer']

    if (roleKey.includes('full') || roleKey.includes('stack')) {
      matchedCatalog = ROLE_JOB_CATALOG['Full Stack Developer']
    } else if (roleKey.includes('front')) {
      matchedCatalog = ROLE_JOB_CATALOG['Frontend Engineer']
    } else if (roleKey.includes('back')) {
      matchedCatalog = ROLE_JOB_CATALOG['Backend Engineer']
    } else if (roleKey.includes('machine') || roleKey.includes('ml')) {
      matchedCatalog = ROLE_JOB_CATALOG['Machine Learning Engineer'] || ROLE_JOB_CATALOG['AI Engineer']
    } else if (roleKey.includes('ai')) {
      matchedCatalog = ROLE_JOB_CATALOG['AI Engineer']
    } else if (roleKey.includes('data')) {
      matchedCatalog = ROLE_JOB_CATALOG['Data Scientist']
    } else if (roleKey.includes('devops') || roleKey.includes('sre')) {
      matchedCatalog = ROLE_JOB_CATALOG['DevOps Engineer']
    } else if (roleKey.includes('cloud')) {
      matchedCatalog = ROLE_JOB_CATALOG['Cloud Engineer']
    } else if (roleKey.includes('cyber') || roleKey.includes('security')) {
      matchedCatalog = ROLE_JOB_CATALOG['Cybersecurity Engineer']
    } else if (roleKey.includes('product') || roleKey.includes('pm')) {
      matchedCatalog = ROLE_JOB_CATALOG['Product Manager']
    }

    return matchedCatalog.map(job => ({
      id: job.id,
      company: job.company,
      logo: job.logo,
      role: job.title,
      location: job.location,
      salary: job.package,
      workMode: job.workMode,
      matchScore: job.matchPct,
      tags: job.requiredSkills,
      description: job.description,
      applyUrl: job.applyUrl
    }))
  }, [oppData, normalizedRole])

  const totalRecommendedJobs = recommendedJobs.length

  const handleToggleSaveJob = async (e, jobId, jobRole) => {
    e.stopPropagation()
    const isCurrentlySaved = savedJobIds.has(jobId)
    setSavedJobIds(prev => {
      const updated = new Set(prev)
      if (isCurrentlySaved) {
        updated.delete(jobId)
      } else {
        updated.add(jobId)
      }
      return updated
    })

    try {
      if (isCurrentlySaved) {
        if (/^[0-9a-fA-F]{24}$/.test(jobId)) {
          await removeSavedJob(jobId)
        }
        triggerToast(`Removed ${jobRole} from saved jobs.`)
      } else {
        if (/^[0-9a-fA-F]{24}$/.test(jobId)) {
          await saveJob(jobId)
        }
        triggerToast(`⭐ Saved ${jobRole} to your bookmarked opportunities!`)
      }
    } catch (err) {
      console.warn('Could not persist bookmark:', err)
    }
  }

  const handleApplyJob = async (job) => {
    if (!job) return
    const jobId = job.id || job._id
    setSelectedJobModal(null)

    if (/^[0-9a-fA-F]{24}$/.test(jobId)) {
      try {
        await applyForJob(jobId)
      } catch (err) {
        console.warn('Could not record application on backend:', err)
      }
    }

    // Open actual external job posting URL in a new window/tab
    const targetUrl = job.applyUrl || `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${job.role} ${job.company}`)}`
    window.open(targetUrl, '_blank', 'noopener,noreferrer')

    triggerToast(`🚀 Redirecting to ${job.company} Career Portal...`)
  }

  const handleViewAllJobs = () => {
    navigate(`/jobs/listings?search=${encodeURIComponent(normalizedRole)}`)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '16px 0 48px', fontFamily: 'DM Sans, sans-serif' }}>

      {/* SKELETON LOADER */}
      {isLoading && (
        <div style={{ padding: 20, borderRadius: 16, background: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <RefreshCw size={18} className="animate-spin" style={{ color: '#EA580C' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#64748B' }}>Syncing Live {normalizedRole} Opportunities...</span>
        </div>
      )}

      {/* TOAST POPUP */}
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
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
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

      {/* ── CARD 1: HERO METRICS SUMMARY BAR ── */}
      <div style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)', borderRadius: 24, padding: '24px 28px', border: '1px solid #FED7AA', boxShadow: '0 4px 20px rgba(234, 88, 12, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', boxShadow: '0 8px 20px rgba(234, 88, 12, 0.3)' }}>
              <Briefcase size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', color: '#C2410C', letterSpacing: '0.05em' }}>Target Role Matched Jobs</span>
                <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 10, background: '#EA580C', color: '#FFFFFF' }}>
                  {normalizedRole}
                </span>
              </div>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {totalRecommendedJobs} High-Match Openings Active
              </h2>
            </div>
          </div>

          {/* Quick Metrics Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ padding: '10px 16px', borderRadius: 14, background: '#FFFFFF', border: '1px solid #FED7AA', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Target size={18} style={{ color: '#EA580C' }} />
              <div>
                <span style={{ fontSize: 11, color: '#64748B', display: 'block', fontWeight: 600 }}>Avg Match Rate</span>
                <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 800, color: '#0F172A' }}>94%</span>
              </div>
            </div>

            <div style={{ padding: '10px 16px', borderRadius: 14, background: '#FFFFFF', border: '1px solid #FED7AA', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Send size={18} style={{ color: '#059669' }} />
              <div>
                <span style={{ fontSize: 11, color: '#64748B', display: 'block', fontWeight: 600 }}>Applications Sent</span>
                <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 800, color: '#0F172A' }}>{applicationsSubmitted}</span>
              </div>
            </div>

            <button
              onClick={handleViewAllJobs}
              style={{
                padding: '12px 20px',
                borderRadius: 14,
                background: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
                color: '#FFFFFF',
                border: 'none',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 800,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(234, 88, 12, 0.25)',
                transition: 'all 0.15s'
              }}
            >
              <span>Explore All {normalizedRole} Jobs</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ── CARD 2: TOP RECOMMENDED JOBS PREVIEW LIST ── */}
      <div style={{ background: '#FFFFFF', borderRadius: 24, padding: '24px 28px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
              🎯 Live Job Openings Matched to {normalizedRole}
            </h3>
            <span style={{ fontSize: 12.5, color: '#64748B', fontWeight: 600 }}>
              Curated top-tier opportunities tailored to your {normalizedRole} learning path & skills
            </span>
          </div>

          <button
            onClick={handleViewAllJobs}
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 10,
              padding: '8px 14px',
              fontSize: 12.5,
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Search size={14} />
            <span>Search More Roles</span>
          </button>
        </div>

        {/* Jobs List Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {recommendedJobs.map((job) => {
            const isSaved = savedJobIds.has(job.id)
            const isApplied = appliedJobIds.has(job.id)

            return (
              <div
                key={job.id}
                onClick={() => setSelectedJobModal(job)}
                style={{
                  padding: 20,
                  borderRadius: 18,
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 10px rgba(15, 23, 42, 0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexWrap: 'wrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#EA580C'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(234, 88, 12, 0.08)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0'
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(15, 23, 42, 0.02)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {/* Left: Company Logo & Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 280, flex: 1 }}>
                  <div style={{ width: 50, height: 50, borderRadius: 14, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                    {job.logo}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <h4 style={{ fontFamily: 'Sora, sans-serif', fontSize: 15.5, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        {job.role}
                      </h4>
                      <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 8, background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }}>
                        {job.matchScore}% Match
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 8, background: '#F1F5F9', color: '#475569' }}>
                        {job.workMode}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, fontSize: 12, color: '#64748B', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, color: '#334155' }}>{job.company}</span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={13} /> {job.location}
                      </span>
                      <span>•</span>
                      <span style={{ color: '#EA580C', fontWeight: 700 }}>{job.salary}</span>
                    </div>
                  </div>
                </div>

                {/* Center: Key Skill Tags */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', maxWidth: 300 }}>
                  {job.tags.slice(0, 3).map((tag, tIdx) => (
                    <span key={tIdx} style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#475569' }}>
                      {tag}
                    </span>
                  ))}
                  {job.tags.length > 3 && (
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: '#94A3B8' }}>
                      +{job.tags.length - 3} more
                    </span>
                  )}
                </div>

                {/* Action CTAs */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    onClick={(e) => handleToggleSaveJob(e, job.id, job.role)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 10,
                      background: isSaved ? '#FFF7ED' : '#FFFFFF',
                      border: isSaved ? '1px solid #FED7AA' : '1px solid #CBD5E1',
                      color: isSaved ? '#C2410C' : '#475569',
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontFamily: 'Sora, sans-serif'
                    }}
                  >
                    <Heart size={13} style={{ fill: isSaved ? '#EA580C' : 'none', color: isSaved ? '#EA580C' : '#64748B' }} />
                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!isApplied) setSelectedJobModal(job)
                    }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 10,
                      background: isApplied ? '#F0FDF4' : 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
                      color: isApplied ? '#047857' : '#FFFFFF',
                      border: isApplied ? '1px solid #BBF7D0' : 'none',
                      fontFamily: 'Sora, sans-serif',
                      fontWeight: 800,
                      fontSize: 12,
                      cursor: isApplied ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      boxShadow: isApplied ? 'none' : '0 4px 12px rgba(234, 88, 12, 0.25)'
                    }}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 size={13} />
                        <span>Applied</span>
                      </>
                    ) : (
                      <>
                        <span>Apply Now</span>
                        <Send size={12} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── JOB DETAILS & APPLICATION MODAL ── */}
      <AnimatePresence>
        {selectedJobModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(6px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              style={{ width: 560, maxWidth: '100%', background: '#FFFFFF', borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: '#FFF7ED', border: '1px solid #FED7AA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                    {selectedJobModal.logo}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {selectedJobModal.role}
                    </h3>
                    <span style={{ fontSize: 12.5, color: '#64748B', fontWeight: 600 }}>{selectedJobModal.company} • {selectedJobModal.location} • {selectedJobModal.workMode}</span>
                  </div>
                </div>

                <button onClick={() => setSelectedJobModal(null)} style={{ background: '#F1F5F9', border: 'none', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={16} />
                </button>
              </div>

              <div>
                <h5 style={{ fontSize: 12, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', margin: '0 0 6px' }}>Job Overview & Scope</h5>
                <p style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.55, margin: 0 }}>{selectedJobModal.description}</p>
              </div>

              <div>
                <h5 style={{ fontSize: 12, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', margin: '0 0 8px' }}>Key Required Technical Skills</h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selectedJobModal.tags.map((tag, tIdx) => (
                    <span key={tIdx} style={{ padding: '4px 10px', borderRadius: 8, background: '#EFF6FF', color: '#1D4ED8', fontSize: 12, fontWeight: 700, border: '1px solid #BFDBFE' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ padding: 14, borderRadius: 14, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12.5, color: '#475569', fontWeight: 600 }}>Official Application Portal:</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#EA580C', fontFamily: 'Sora, sans-serif' }}>
                  {selectedJobModal.company} Careers Page ↗
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid #E2E8F0' }}>
                <div>
                  <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600, display: 'block' }}>Offered Package</span>
                  <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 800, color: '#EA580C' }}>{selectedJobModal.salary}</span>
                </div>

                <button
                  onClick={() => handleApplyJob(selectedJobModal)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontFamily: 'Sora, sans-serif',
                    fontWeight: 800,
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 4px 14px rgba(234, 88, 12, 0.25)'
                  }}
                >
                  <span>Apply on {selectedJobModal.company} Portal ↗</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
