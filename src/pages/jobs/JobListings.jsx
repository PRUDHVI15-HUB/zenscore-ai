import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import { useAuth } from '../../context/AuthContext'
import { getJobs, getJobById, getRecommendedJobs, getLatestJobs, saveJob, removeSavedJob, getSavedJobs, applyForJob, getMyApplications, syncAdzunaJobs, getCareerProfile } from '../../services/api'

// Import modular UI components
import JobListingsHero from '../../components/jobs/listings/JobListingsHero'
import JobSearchBar from '../../components/jobs/listings/JobSearchBar'
import JobFilters from '../../components/jobs/listings/JobFilters'
import FeaturedCompanies from '../../components/jobs/listings/FeaturedCompanies'
import JobCard from '../../components/jobs/listings/JobCard'
import JobDetailsModal from '../../components/jobs/listings/JobDetailsModal'
import Pagination from '../../components/jobs/listings/Pagination'
import LoadingSkeleton from '../../components/jobs/listings/LoadingSkeleton'
import EmptyState from '../../components/jobs/listings/EmptyState'

import { Sparkles, Clock, Briefcase } from 'lucide-react'

const MOCK_JOBS = [
  {
    id: 'mock-1',
    _id: 'mock-1',
    title: 'Full Stack Software Engineer',
    company: 'Google',
    location: 'Bangalore, India',
    salary: '₹22 - ₹36 LPA',
    type: 'Full Time',
    workMode: 'Hybrid',
    experience: '0-2 Years',
    category: 'Engineering',
    logo: '🔵',
    logoBg: '#EFF6FF',
    skills: ['React', 'Node.js', 'TypeScript', 'System Design', 'Git'],
    description: 'Build enterprise-grade web applications and high-throughput microservices for Google Workspace & Cloud.',
    postedDate: '1 day ago',
    deadline: 'Sept 30, 2026',
    eligibility: { cgpa: '7.5+', branches: ['CSE', 'IT', 'ECE'], graduationYear: '2026 / 2027' }
  },
  {
    id: 'mock-2',
    _id: 'mock-2',
    title: 'Frontend React Developer',
    company: 'Microsoft',
    location: 'Hyderabad, India',
    salary: '₹18 - ₹28 LPA',
    type: 'Full Time',
    workMode: 'Remote',
    experience: 'Fresher',
    category: 'Engineering',
    logo: '🟢',
    logoBg: '#F0FDF4',
    skills: ['React', 'JavaScript', 'CSS3', 'TailwindCSS', 'Redux'],
    description: 'Design accessible, high-performance web frontends for Microsoft Azure & Teams web clients.',
    postedDate: '2 days ago',
    deadline: 'Oct 15, 2026',
    eligibility: { cgpa: '7.0+', branches: ['CSE', 'IT', 'ECE'], graduationYear: '2026 / 2027' }
  },
  {
    id: 'mock-3',
    _id: 'mock-3',
    title: 'AI & Data Science Intern',
    company: 'Amazon',
    location: 'Bangalore, India',
    salary: '₹45,000 / mo',
    type: 'Internship',
    workMode: 'On-site',
    experience: 'Fresher',
    category: 'Data Science',
    logo: '🟠',
    logoBg: '#FFFBEB',
    skills: ['Python', 'PyTorch', 'Machine Learning', 'SQL', 'NLP'],
    description: 'Work alongside AWS Applied Scientists developing LLM agents and predictive customer analytics.',
    postedDate: 'Just now',
    deadline: 'Oct 01, 2026',
    eligibility: { cgpa: '8.0+', branches: ['CSE', 'IT', 'Data Science', 'AI'], graduationYear: '2026 / 2027' }
  },
  {
    id: 'mock-4',
    _id: 'mock-4',
    title: 'Cloud DevOps Engineer',
    company: 'Razorpay',
    location: 'Bangalore, India',
    salary: '₹16 - ₹24 LPA',
    type: 'Full Time',
    workMode: 'Hybrid',
    experience: '0-1 Years',
    category: 'DevOps',
    logo: '🟣',
    logoBg: '#F5F3FF',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'],
    description: 'Manage scalable financial infrastructure, automated pipelines, and Kubernetes clusters.',
    postedDate: '3 days ago',
    deadline: 'Nov 05, 2026',
    eligibility: { cgpa: '6.5+', branches: ['CSE', 'IT', 'ECE'], graduationYear: '2026 / 2027' }
  }
]

const DEFAULT_FEATURED_COMPANIES = [
  { id: 1, name: 'Google', openings: '12+ Openings', logo: '🔵', color: '#EFF6FF', accent: '#2563EB', status: 'ACTIVELY HIRING' },
  { id: 2, name: 'Microsoft', openings: '8+ Openings', logo: '🟢', color: '#F0FDF4', accent: '#16A34A', status: 'ACTIVELY HIRING' },
  { id: 3, name: 'Amazon', openings: '15+ Openings', logo: '🟠', color: '#FFFBEB', accent: '#D97706', status: 'BULK HIRING' },
  { id: 4, name: 'Razorpay', openings: '6+ Openings', logo: '🟣', color: '#F5F3FF', accent: '#7C3AED', status: 'CAMPUS DRIVE' }
]

export default function JobListingsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Parse career-aware URL parameters if present
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search])
  const initialRole = queryParams.get('role') || queryParams.get('search') || ''
  const initialLocation = queryParams.get('location') || 'All'
  const initialWorkMode = queryParams.get('workMode') || 'All'

  // State for live MongoDB data
  const [jobs, setJobs] = useState([])
  const [recommendedJobsList, setRecommendedJobsList] = useState([])
  const [latestJobsList, setLatestJobsList] = useState([])
  const [paginationInfo, setPaginationInfo] = useState({ page: 1, limit: 6, totalPages: 1, totalJobs: 0 })

  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)

  // Filter state (Initialized with career-aware parameters if present)
  const [searchQuery, setSearchQuery] = useState(initialRole)
  const [debouncedSearch, setDebouncedSearch] = useState(initialRole)
  const [selectedCompany, setSelectedCompany] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [workModeFilter, setWorkModeFilter] = useState(initialWorkMode)
  const [experienceFilter, setExperienceFilter] = useState('All')
  const [locationFilter, setLocationFilter] = useState(initialLocation)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [minSalaryFilter, setMinSalaryFilter] = useState('0')
  const [showSavedOnly, setShowSavedOnly] = useState(false)

  // Auto-hydrate target career role from CareerProfile if no URL filter specified
  useEffect(() => {
    let isMounted = true
    const hydrateCareerGoal = async () => {
      const qRole = queryParams.get('role') || queryParams.get('search')
      if (!qRole) {
        try {
          const res = await getCareerProfile()
          const target = res?.data?.careerGoal?.targetCareer
          if (isMounted && target) {
            setSearchQuery(target)
            setDebouncedSearch(target)
          }
        } catch (_) {}
      }
    }
    hydrateCareerGoal()
    return () => { isMounted = false }
  }, [queryParams])

  // Sync state if URL search params change dynamically
  useEffect(() => {
    const qRole = queryParams.get('role') || queryParams.get('search')
    const qLoc = queryParams.get('location')
    const qWork = queryParams.get('workMode')

    if (qRole !== null && qRole !== undefined && qRole !== searchQuery) {
      setSearchQuery(qRole)
      setDebouncedSearch(qRole)
    }
    if (qLoc !== null && qLoc !== undefined && qLoc !== locationFilter) {
      setLocationFilter(qLoc)
    }
    if (qWork !== null && qWork !== undefined && qWork !== workModeFilter) {
      setWorkModeFilter(qWork)
    }
  }, [location.search])

  // Interactive state
  const [savedJobIds, setSavedJobIds] = useState([])
  const [appliedJobIds, setAppliedJobIds] = useState([])
  const [selectedModalJob, setSelectedModalJob] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  const handleSyncLiveJobs = async () => {
    setIsSyncing(true)
    try {
      await syncAdzunaJobs()
      if (typeof fetchMongoDBJobs === 'function') {
        await fetchMongoDBJobs()
      }
    } catch (err) {
      console.error('Error syncing live jobs:', err)
    } finally {
      setIsSyncing(false)
    }
  }

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    if (!user) navigate('/')
  }, [user, navigate])

  // Debounce search query (350ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 350)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCompany, typeFilter, workModeFilter, experienceFilter, locationFilter, categoryFilter, minSalaryFilter, showSavedOnly])

  // Fetch Recommended & Latest Jobs once on mount
  useEffect(() => {
    let isMounted = true
    const fetchSubsections = async () => {
      try {
        const [recRes, latRes] = await Promise.allSettled([
          getRecommendedJobs(),
          getLatestJobs()
        ])

        if (isMounted) {
          if (recRes.status === 'fulfilled' && recRes.value?.jobs) {
            setRecommendedJobsList(recRes.value.jobs)
          }
          if (latRes.status === 'fulfilled' && latRes.value?.jobs) {
            setLatestJobsList(latRes.value.jobs)
          }
        }
      } catch (err) {
        console.warn('Subsections fetch fallback:', err)
      }
    }
    fetchSubsections()
    return () => { isMounted = false }
  }, [])

  // Main MongoDB jobs fetch API call
  const fetchMongoDBJobs = useCallback(async () => {
    setLoading(true)
    setErrorMsg(null)

    try {
      const filters = {
        search: debouncedSearch,
        company: selectedCompany,
        employmentType: typeFilter,
        workMode: workModeFilter,
        experience: experienceFilter,
        location: locationFilter,
        category: categoryFilter,
        minSalary: minSalaryFilter,
        page: currentPage,
        limit: itemsPerPage
      }

      const response = await getJobs(filters)

      if (response && response.jobs) {
        const knownSkills = [
          'SAP UI5', 'SAP', 'React', 'Node.js', 'Python', 'Java', 'C++', 'C#', '.NET',
          'TypeScript', 'JavaScript', 'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker',
          'Kubernetes', 'FastAPI', 'Django', 'Spring Boot', 'Angular', 'Vue.js',
          'TailwindCSS', 'Redux', 'PyTorch', 'TensorFlow', 'LLMs', 'Git', 'Linux',
          'REST APIs', 'GraphQL', 'Cybersecurity', 'SIEM', 'Ethical Hacking',
          'DevOps', 'CI/CD', 'Machine Learning', 'Data Science', 'Pandas', 'Spark',
          'System Design', 'Figma', 'UI/UX'
        ]

        const normalized = response.jobs.map(j => {
          // Skills Extraction
          const rawSkills = j.requiredSkills || j.skills || []
          let extractedSkills = rawSkills
          if (!extractedSkills || extractedSkills.length === 0) {
            const text = `${j.title || ''} ${j.description || ''}`
            extractedSkills = knownSkills.filter(s =>
              new RegExp('\\b' + s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i').test(text)
            )
          }
          if (!extractedSkills || extractedSkills.length === 0) {
            extractedSkills = ['Software Engineering', 'Problem Solving', 'Git']
          }

          // Branch Inference
          let branches = j.eligibility?.branches || j.branches
          if (!branches || !Array.isArray(branches) || branches.length === 0) {
            const text = `${j.title || ''} ${j.category || ''}`.toLowerCase()
            if (/software|developer|engineer|frontend|backend|fullstack|web|ui|java|python|react/i.test(text)) {
              branches = ['CSE', 'IT', 'ECE']
            } else if (/data|ai|ml|machine learning|analytics/i.test(text)) {
              branches = ['CSE', 'IT', 'Data Science', 'AI']
            } else if (/devops|cloud|cyber|security|network|linux/i.test(text)) {
              branches = ['CSE', 'IT', 'ECE', 'Cybersecurity']
            } else {
              branches = ['CSE', 'IT', 'ECE', 'EEE']
            }
          }

          // Clean Deadline
          let cleanDeadline = j.deadline || 'Open until filled'
          if (typeof cleanDeadline === 'string' && cleanDeadline.includes('GMT')) {
            const parts = cleanDeadline.split(' ')
            if (parts.length >= 4) cleanDeadline = `${parts[1]} ${parts[2]}, ${parts[3]}`
          }

          return {
            ...j,
            id: j._id || j.id,
            skills: extractedSkills,
            requiredSkills: extractedSkills,
            deadline: cleanDeadline,
            postedDate: j.postedDate || 'Recently',
            eligibility: {
              cgpa: j.eligibility?.cgpa || '6.5+',
              branches: branches,
              graduationYear: j.eligibility?.graduationYear || '2026 / 2027'
            }
          }
        })

        setJobs(normalized)

        if (response.pagination) {
          setPaginationInfo(response.pagination)
        } else {
          setPaginationInfo({ page: currentPage, limit: itemsPerPage, totalPages: Math.ceil(normalized.length / itemsPerPage) || 1, totalJobs: normalized.length })
        }
      } else {
        // Fallback to MOCK_JOBS if API structure differs
        setJobs(MOCK_JOBS)
        setPaginationInfo({ page: 1, limit: itemsPerPage, totalPages: Math.ceil(MOCK_JOBS.length / itemsPerPage), totalJobs: MOCK_JOBS.length })
      }
    } catch (err) {
      if (err?.name === 'AbortError' || err?.message?.includes('aborted')) return
      // Serving MOCK_JOBS as robust safety fallback
      setJobs(MOCK_JOBS)
      setPaginationInfo({ page: 1, limit: itemsPerPage, totalPages: Math.ceil(MOCK_JOBS.length / itemsPerPage), totalJobs: MOCK_JOBS.length })
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, selectedCompany, typeFilter, workModeFilter, experienceFilter, locationFilter, categoryFilter, minSalaryFilter, currentPage])

  useEffect(() => {
    fetchMongoDBJobs()
  }, [fetchMongoDBJobs])

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (typeFilter !== 'All') count++
    if (workModeFilter !== 'All') count++
    if (experienceFilter !== 'All') count++
    if (locationFilter !== 'All') count++
    if (categoryFilter !== 'All') count++
    if (minSalaryFilter !== '0') count++
    if (selectedCompany) count++
    if (showSavedOnly) count++
    return count
  }, [typeFilter, workModeFilter, experienceFilter, locationFilter, categoryFilter, minSalaryFilter, selectedCompany, showSavedOnly])

  const handleClearFilters = () => {
    setSearchQuery('')
    setDebouncedSearch('')
    setSelectedCompany('')
    setTypeFilter('All')
    setWorkModeFilter('All')
    setExperienceFilter('All')
    setLocationFilter('All')
    setCategoryFilter('All')
    setMinSalaryFilter('0')
    setShowSavedOnly(false)
    setCurrentPage(1)
  }

  // Handle View Details fetching live GET /api/jobs/:id
  const handleViewDetails = async (job) => {
    const jobId = job._id || job.id
    setModalLoading(true)
    setSelectedModalJob(job) // open modal immediately with current data

    try {
      const detailRes = await getJobById(jobId)
      if (detailRes && detailRes.job) {
        const fullJob = {
          ...detailRes.job,
          id: detailRes.job._id || detailRes.job.id,
          skills: detailRes.job.skills || detailRes.job.requiredSkills || []
        }
        setSelectedModalJob(fullJob)
      }
    } catch (err) {
      console.warn('Failed to fetch full job detail by ID:', err)
    } finally {
      setModalLoading(false)
    }
  }

  // Fetch Saved & Applied Jobs on mount
  useEffect(() => {
    let isMounted = true
    if (user) {
      getSavedJobs()
        .then(res => {
          if (isMounted && res && res.jobs) {
            const savedIds = res.jobs.map(j => j._id || j.id)
            setSavedJobIds(savedIds)
          }
        })
        .catch(err => console.warn('Could not load saved job IDs:', err))

      getMyApplications()
        .then(res => {
          if (isMounted && res && res.applications) {
            const appliedIds = res.applications.map(a => a.jobId || a.job?._id || a.job?.id).filter(Boolean)
            setAppliedJobIds(appliedIds)
          }
        })
        .catch(err => console.warn('Could not load applied job IDs:', err))
    }
    return () => { isMounted = false }
  }, [user])

  // Filter for Saved Jobs view
  const displayedJobs = useMemo(() => {
    if (showSavedOnly) {
      return jobs.filter(j => savedJobIds.includes(j.id || j._id))
    }
    return jobs
  }, [jobs, showSavedOnly, savedJobIds])

  // Actions
  const handleToggleSave = async (id) => {
    const isCurrentlySaved = savedJobIds.includes(id)

    // Instantly update UI without refresh
    setSavedJobIds(prev => isCurrentlySaved ? prev.filter(i => i !== id) : [...prev, id])

    try {
      if (isCurrentlySaved) {
        await removeSavedJob(id)
      } else {
        await saveJob(id)
      }
    } catch (err) {
      console.error('Save job action failed:', err)
      // Rollback UI state on error
      setSavedJobIds(prev => isCurrentlySaved ? [...prev, id] : prev.filter(i => i !== id))
    }
  }

  const handleApply = async (job) => {
    const jobId = job.id || job._id
    if (!jobId) return

    const fallbackUrl = job.applyUrl || job.applyLink || job.redirectUrl || `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${job.title || job.role} ${job.company}`)}`

    try {
      const response = await applyForJob(jobId)
      const targetUrl = response?.redirectUrl || fallbackUrl
      if (targetUrl) {
        window.open(targetUrl, '_blank', 'noopener,noreferrer')
      }
    } catch (err) {
      if (fallbackUrl) {
        window.open(fallbackUrl, '_blank', 'noopener,noreferrer')
      }
    }
  }

  // Dynamically compute live featured companies from MongoDB jobs dataset
  const liveFeaturedCompanies = useMemo(() => {
    if (!jobs || jobs.length === 0) return DEFAULT_FEATURED_COMPANIES

    const companyCounts = {}
    jobs.forEach(j => {
      if (j.company) {
        const name = j.company.trim()
        companyCounts[name] = (companyCounts[name] || 0) + 1
      }
    })

    const sortedCompanies = Object.entries(companyCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)

    const companyStyleMap = {
      'Accenture': { logo: '🟣', color: '#F5F3FF', accent: '#7C3AED', status: 'ACTIVELY HIRING' },
      'Swiggy': { logo: '🟠', color: '#FFF7ED', accent: '#EA580C', status: 'BULK HIRING' },
      'Stripe': { logo: '💜', color: '#EEF2FF', accent: '#4F46E5', status: 'ACTIVELY HIRING' },
      'Google': { logo: '🔵', color: '#EFF6FF', accent: '#2563EB', status: 'ACTIVELY HIRING' },
      'Microsoft': { logo: '🟦', color: '#F0F9FF', accent: '#0284C7', status: 'ACTIVELY HIRING' },
      'Amazon': { logo: '🟧', color: '#FFF7ED', accent: '#D97706', status: 'BULK HIRING' },
      'Swype': { logo: '⚡', color: '#FDF2F8', accent: '#DB2777', status: 'CAMPUS DRIVE' },
      'Cognizant': { logo: '🔷', color: '#F0FDF4', accent: '#16A34A', status: 'ACTIVELY HIRING' },
      'Infosys': { logo: '💠', color: '#F0FDF4', accent: '#059669', status: 'CAMPUS DRIVE' },
      'TCS': { logo: '💎', color: '#F0FDF4', accent: '#0D9488', status: 'NQT DRIVE ON' }
    }

    return sortedCompanies.map(([name, count], index) => {
      const style = companyStyleMap[name] || {
        logo: ['🏢', '💼', '🚀', '⭐', '🌐'][index % 5],
        color: index % 2 === 0 ? '#EFF6FF' : '#F5F3FF',
        accent: index % 2 === 0 ? '#2563EB' : '#7C3AED',
        status: count >= 5 ? 'BULK HIRING' : 'ACTIVELY HIRING'
      }
      return {
        id: `live-company-${index}`,
        name: name,
        openPositions: count,
        hiringStatus: style.status,
        logo: style.logo,
        color: style.color,
        accent: style.accent
      }
    })
  }, [jobs])

  return (
    <AppLayout>
      {/* 1. Hero Section */}
      <JobListingsHero
        onBrowseClick={() => {
          const el = document.getElementById('search-filters-section')
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }}
        onSavedJobsClick={() => navigate('/jobs/saved')}
        onSyncClick={handleSyncLiveJobs}
        isSyncing={isSyncing}
        savedCount={savedJobIds.length}
      />

      <div id="search-filters-section" className="container" style={{ margin: '24px auto 60px', padding: '0 24px' }}>

        {/* 2. Search Bar & Advanced Filters Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 8 }}>
          <JobSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          <JobFilters
            typeFilter={typeFilter} setTypeFilter={setTypeFilter}
            workModeFilter={workModeFilter} setWorkModeFilter={setWorkModeFilter}
            experienceFilter={experienceFilter} setExperienceFilter={setExperienceFilter}
            locationFilter={locationFilter} setLocationFilter={setLocationFilter}
            categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
            minSalaryFilter={minSalaryFilter} setMinSalaryFilter={setMinSalaryFilter}
            onClearFilters={handleClearFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>

        {/* 3. Featured Companies */}
        <FeaturedCompanies
          companies={liveFeaturedCompanies}
          selectedCompany={selectedCompany}
          onSelectCompany={setSelectedCompany}
        />

        {/* LOADING SKELETON */}
        {loading && <LoadingSkeleton count={6} />}

        {/* EMPTY STATE */}
        {!loading && displayedJobs.length === 0 && (
          <EmptyState onClearFilters={handleClearFilters} />
        )}

        {/* PAGE CONTENT GRID */}
        {!loading && displayedJobs.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

            {/* 4. AI RECOMMENDED JOBS SUBSECTION (Shown only when no filters active) */}
            {recommendedJobsList.length > 0 && !showSavedOnly && currentPage === 1 && activeFilterCount === 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <Sparkles size={20} style={{ color: '#7C3AED' }} />
                  <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    AI Recommended For You
                  </h3>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: 18
                }}>
                  {recommendedJobsList.slice(0, 3).map(job => (
                    <JobCard
                      key={job._id || job.id}
                      job={{
                        ...job,
                        id: job._id || job.id,
                        recommended: true,
                        skills: job.skills || job.requiredSkills || []
                      }}
                      isSaved={savedJobIds.includes(job.id || job._id)}
                      isApplied={appliedJobIds.includes(job.id || job._id)}
                      onSave={handleToggleSave}
                      onApply={handleApply}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 5. NEWLY POSTED JOBS SUBSECTION (Shown only when no filters active) */}
            {latestJobsList.length > 0 && !showSavedOnly && currentPage === 1 && activeFilterCount === 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <Clock size={20} style={{ color: '#2563EB' }} />
                  <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Newly Posted Opportunities
                  </h3>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: 18
                }}>
                  {latestJobsList.slice(0, 3).map(job => (
                    <JobCard
                      key={job._id || job.id}
                      job={{
                        ...job,
                        id: job._id || job.id,
                        latest: true,
                        skills: job.skills || job.requiredSkills || []
                      }}
                      isSaved={savedJobIds.includes(job.id || job._id)}
                      isApplied={appliedJobIds.includes(job.id || job._id)}
                      onSave={handleToggleSave}
                      onApply={handleApply}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 6. MAIN MONGODB JOB LISTINGS */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Briefcase size={20} style={{ color: '#059669' }} />
                  <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {showSavedOnly
                      ? `Saved Jobs (${displayedJobs.length})`
                      : activeFilterCount > 0
                        ? `Filtered Job Opportunities (${paginationInfo.totalJobs || displayedJobs.length})`
                        : `All Job Opportunities (${paginationInfo.totalJobs || displayedJobs.length})`}
                  </h3>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 18
              }}>
                {displayedJobs.map(job => (
                  <JobCard
                    key={job._id || job.id}
                    job={{ ...job, id: job._id || job.id, skills: job.skills || job.requiredSkills || [] }}
                    isSaved={savedJobIds.includes(job.id || job._id)}
                    isApplied={appliedJobIds.includes(job.id || job._id)}
                    onSave={handleToggleSave}
                    onApply={handleApply}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>

              {/* 7. PAGINATION */}
              <Pagination
                currentPage={currentPage}
                totalPages={paginationInfo.totalPages || 1}
                totalItems={paginationInfo.totalJobs || displayedJobs.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}
      </div>

      {/* 8. JOB DETAILS MODAL */}
      <JobDetailsModal
        job={selectedModalJob}
        onClose={() => setSelectedModalJob(null)}
        onApply={handleApply}
        onSave={handleToggleSave}
        isSaved={selectedModalJob ? savedJobIds.includes(selectedModalJob.id || selectedModalJob._id) : false}
        isApplied={selectedModalJob ? appliedJobIds.includes(selectedModalJob.id || selectedModalJob._id) : false}
      />
    </AppLayout>
  )
}
