import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  getCategories,
  getSkills,
  getSkill,
  enrollSkill,
  completeLesson,
  getContinueLearning,
  getProgress,
  getRecommendedSkills,
  getSkillsAIRecommendations,
  getUserRoadmaps
} from '../services/skills/skillsService'
import { getMe, getCertificates, toggleBookmark } from '../services/api'
import { syncSkillsToProfile } from '../services/skillsProfileSync'

/**
 * Production useSkillsData Hook
 * Single source of truth for the entire Skills page.
 * Safely handles network errors, null responses, and 401 unauthenticated states.
 */
export function useSkillsData(activeTab = 'explore', initialFilters = {}) {
  const [userInfo, setUserInfo] = useState(null)
  const [categories, setCategories] = useState([])
  const [skills, setSkills] = useState([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, pages: 1 })
  const [continueLearning, setContinueLearningState] = useState([])
  const [progress, setProgressState] = useState(null)
  const [roadmapsState, setRoadmapsState] = useState([])
  const [recommendedSkills, setRecommendedSkillsState] = useState([])
  const [aiRecommendations, setAiRecommendations] = useState(null)
  const [certificatesList, setCertificatesList] = useState([])
  const [selectedSkillDetails, setSelectedSkillDetails] = useState(null)

  // Filters state for Explore search & category selection
  const [filters, setFilters] = useState({
    category: initialFilters.category || '',
    difficulty: initialFilters.difficulty || '',
    search: initialFilters.search || '',
    page: 1,
    limit: 12,
    sort: 'name'
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 3500)
  }, [])

  // Single source of truth fetcher calling production backend endpoints in parallel
  const fetchAllData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true)
    setError(null)

    try {
      const [
        meRes,
        catsRes,
        skillsRes,
        contRes,
        progRes,
        recsRes,
        aiRes,
        certsRes,
        roadmapsRes
      ] = await Promise.allSettled([
        getMe(),
        getCategories(),
        getSkills(filters),
        getContinueLearning(),
        getProgress(),
        getRecommendedSkills(),
        getSkillsAIRecommendations(),
        getCertificates(),
        getUserRoadmaps()
      ])

      // 1. Profile
      if (meRes.status === 'fulfilled' && meRes.value?.success) {
        setUserInfo(meRes.value.user || null)
      }

      // 2. Categories
      if (catsRes.status === 'fulfilled' && catsRes.value?.success) {
        setCategories(Array.isArray(catsRes.value.data) ? catsRes.value.data : [])
      }

      // 3. Skills List & Pagination
      if (skillsRes.status === 'fulfilled' && skillsRes.value?.success) {
        setSkills(Array.isArray(skillsRes.value.data) ? skillsRes.value.data : [])
        if (skillsRes.value.pagination) {
          setPagination(skillsRes.value.pagination)
        }
      }

      // 4. Continue Learning
      if (contRes.status === 'fulfilled' && contRes.value?.success) {
        setContinueLearningState(Array.isArray(contRes.value.data) ? contRes.value.data : [])
      }

      // 5. User Progress Analytics
      if (progRes.status === 'fulfilled' && progRes.value?.success) {
        setProgressState(progRes.value.data || null)
      }

      // 6. User Roadmaps
      if (roadmapsRes.status === 'fulfilled' && roadmapsRes.value?.success) {
        setRoadmapsState(Array.isArray(roadmapsRes.value.data) ? roadmapsRes.value.data : [])
      }

      // 6. Recommended Skills
      if (recsRes.status === 'fulfilled' && recsRes.value?.success) {
        setRecommendedSkillsState(Array.isArray(recsRes.value.data) ? recsRes.value.data : [])
      }

      // 7. AI Recommendations
      if (aiRes.status === 'fulfilled' && aiRes.value?.success) {
        setAiRecommendations(aiRes.value.data || null)
      }

      // 8. Certificates
      if (certsRes.status === 'fulfilled' && certsRes.value?.success) {
        setCertificatesList(Array.isArray(certsRes.value.data) ? certsRes.value.data : [])
      }

      // ── STUDENT PROFILE SYNC ──────────────────────────────────────
      // Fire-and-forget: never blocks UI, never throws, silent on error
      // Resolves values directly from settled results (no state lag)
      syncSkillsToProfile({
        progress:         progRes.status  === 'fulfilled' && progRes.value?.success  ? progRes.value.data  : null,
        categories:       catsRes.status  === 'fulfilled' && catsRes.value?.success  ? catsRes.value.data  : [],
        continueLearning: contRes.status  === 'fulfilled' && contRes.value?.success  ? contRes.value.data  : [],
        certificatesList: certsRes.status === 'fulfilled' && certsRes.value?.success ? certsRes.value.data : [],
        aiRecommendations: aiRes.status   === 'fulfilled' && aiRes.value?.success    ? aiRes.value.data    : null,
        roadmapsData:     roadmapsRes.status === 'fulfilled' && roadmapsRes.value?.success ? roadmapsRes.value.data : [],
        recommendedSkills: recsRes.status === 'fulfilled' && recsRes.value?.success  ? recsRes.value.data  : [],
      })
      // ─────────────────────────────────────────────────────────────
    } catch (err) {
      console.warn('Production Skills fetch warning:', err)
      setError(err?.message || 'Failed to load live skills data.')
    } finally {
      if (!isSilent) setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  // --- Interactive Production Actions ---

  const handleEnroll = useCallback(async (skillId) => {
    try {
      const res = await enrollSkill(skillId)
      if (res.success) {
        showToast('✓ Enrolled in skill successfully!', 'success')
        fetchAllData(true)
      }
    } catch (err) {
      showToast(err?.message || 'Failed to enroll in skill', 'error')
    }
  }, [showToast, fetchAllData])

  const handleCompleteLesson = useCallback(async (skillId, lessonId) => {
    try {
      const res = await completeLesson(skillId, lessonId)
      if (res.success) {
        showToast(`✓ Lesson completed! Progress updated to ${res.data?.completionPercentage || 0}%`, 'success')
        fetchAllData(true)
      }
    } catch (err) {
      showToast(err?.message || 'Failed to mark lesson as complete', 'error')
    }
  }, [showToast, fetchAllData])

  const handleFetchSkillDetails = useCallback(async (skillId) => {
    try {
      const res = await getSkill(skillId)
      if (res.success) {
        setSelectedSkillDetails(res.data)
        return res.data
      }
    } catch (err) {
      showToast(err?.message || 'Failed to fetch skill details', 'error')
    }
    return null
  }, [showToast])

  const handleBookmarkToggle = useCallback(async (courseId) => {
    try {
      await toggleBookmark(courseId)
      showToast('✓ Bookmark status updated!', 'success')
      fetchAllData(true)
    } catch (err) {
      showToast(err?.message || 'Failed to update bookmark', 'error')
    }
  }, [showToast, fetchAllData])

  const copyCertificateVerification = useCallback((certificateId) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(certificateId)
      showToast(`✓ Certificate ID ${certificateId} copied to clipboard!`, 'success')
    } else {
      showToast(`Certificate ID: ${certificateId}`, 'info')
    }
  }, [showToast])

  // --- Safe Backwards-Compatible Computed Adapters ---

  const overviewStats = useMemo(() => {
    const contCount = Array.isArray(continueLearning) ? continueLearning.length : 0
    const certCount = Array.isArray(certificatesList) ? certificatesList.length : 0

    return {
      startedCount: progress?.enrolledSkills ?? contCount ?? 0,
      completedCount: progress?.completedSkills ?? 0,
      weeklyHours: progress?.totalHours ?? progress?.weeklyHours ?? 0,
      weeklyTarget: 10,
      certificatesCount: certCount,
      startedTrend: `+${progress?.activeSkills ?? contCount ?? 0} active`,
      completedTrend: `${progress?.overallCompletion ?? 0}% completion rate`,
      aiNextCourse: aiRecommendations?.recommendedNextCourse || 'Select a track to start',
      aiNextLesson: aiRecommendations?.recommendedNextLesson || 'Explore foundational lessons',
      skillsToImprove: aiRecommendations?.skillsToImprove || []
    }
  }, [progress, continueLearning, certificatesList, aiRecommendations])

  const continueCourses = useMemo(() => {
    const safeContinue = Array.isArray(continueLearning) ? continueLearning : []
    let localCareerSkills = []
    try {
      const uid = userInfo?._id || userInfo?.id || null
      if (uid) {
        localCareerSkills = JSON.parse(localStorage.getItem(`zs_active_career_skills_${uid}`) || '[]')
      } else {
        localCareerSkills = []
      }
    } catch (e) {
      localCareerSkills = []
    }

    const normalizeKey = (str = '') => String(str || '').toLowerCase().replace(/[^a-z0-9]/gi, '')

    const merged = [...safeContinue]
    localCareerSkills.forEach(locSkill => {
      const locId = (locSkill.skillId || locSkill.id || '').toString()
      const locNormName = normalizeKey(locSkill.skillName || locSkill.name)

      const exists = merged.some(s => {
        const sId = (s.skillId || s.id || '').toString()
        const sNormName = normalizeKey(s.skillName || s.name || s.title)
        return (sId && locId && sId === locId) || (sNormName && locNormName && sNormName === locNormName)
      })

      if (!exists) {
        merged.push({
          ...locSkill,
          completionPercentage: (locSkill.completionPercentage && locSkill.completionPercentage !== 15) ? locSkill.completionPercentage : 0
        })
      }
    })

    return merged.map(item => ({
      id: item.skillId || item.id,
      name: item.skillName || item.name,
      category: item.category || 'Career Track',
      icon: item.icon || '⚡',
      progress: typeof item.completionPercentage === 'number' ? item.completionPercentage : 0,
      difficulty: item.difficulty || 'Intermediate',
      lastStudied: 'Active Now',
      timeRemaining: item.estimatedTimeRemaining || 'In Progress',
      color: item.color || '#EFF6FF',
      accent: '#2563EB',
      currentLesson: item.currentLesson || { lessonNumber: 1, title: 'Foundations & Architecture' }
    }))
  }, [continueLearning])

  const exploreSkills = useMemo(() => {
    const safeSkills = Array.isArray(skills) ? skills : []
    return safeSkills.map(skill => ({
      id: skill.id,
      title: skill.name,
      category: skill.category?.name || 'Engineering',
      difficulty: skill.difficulty,
      shortDescription: skill.description,
      icon: skill.category?.icon || '🌐',
      color: '#EFF6FF',
      accent: '#2563EB',
      durationWeeks: Math.ceil((skill.estimatedHours || 10) / 3),
      lessons: skill.lessonCount || 10,
      projects: 2,
      progress: 0,
      completed: false,
      bookmarked: false
    }))
  }, [skills])

  const roadmapsData = useMemo(() => {
    return roadmapsState
  }, [roadmapsState])

  const progressSummary = useMemo(() => ({
    totalHours: progress?.totalHours || 0,
    weeklyTrend: progress?.weeklyTrend || '+0 hrs this week',
    skillsCompleted: progress?.skillsCompleted || 0,
    completionRate: progress?.completionRate || 0,
    streakDays: progress?.streakDays || 0,
    bestStreak: progress?.bestStreak || 0,
    overallProgress: progress?.overallProgress || 0,
    roleReadiness: aiRecommendations?.roleReadiness || 0,
    insights: aiRecommendations?.progressInsights || [
      `You have completed ${progress?.totalCompletedLessons || 0} lessons so far.`,
      `Your average completion rate across active skills is ${progress?.completionRate || 0}%.`
    ]
  }), [progress, aiRecommendations])

  const activeSkillsProgress = useMemo(() => {
    if (!Array.isArray(continueCourses) || continueCourses.length === 0) return []
    return continueCourses.map(item => ({
      id: item.id,
      skillId: item.id,
      name: item.name,
      progress: item.progress || 20,
      currentModule: item.currentLesson ? `Lesson ${item.currentLesson.lessonNumber}: ${item.currentLesson.title}` : 'Module 1: Foundations',
      category: item.category || 'Career Track',
      icon: item.icon || '⚡'
    }))
  }, [continueCourses])

  const learningActivity = useMemo(() => {
    if (progress?.activityHistory && Array.isArray(progress.activityHistory) && progress.activityHistory.length > 0) {
      return progress.activityHistory.map(item => ({
        id: item.id || item._id || Math.random().toString(),
        timestamp: item.timestamp ? new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently',
        title: item.title || `Active Learning on ${item.skillName || 'Engineering'}`,
        skillName: item.skillName || item.description || '',
        type: item.type || 'lesson'
      }))
    }
    if (!Array.isArray(continueLearning) || continueLearning.length === 0) return []
    return continueLearning.map(item => ({
      id: `act-${item.skillId}`,
      timestamp: item.lastActivity ? new Date(item.lastActivity).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently',
      title: `Active Learning on ${item.skillName}`,
      skillName: item.skillName,
      type: item.completionPercentage === 100 ? 'project' : 'exercise'
    }))
  }, [progress, continueLearning])

  const achievementsData = useMemo(() => {
    const totalCompleted = progress?.skillsCompleted || 0
    const totalLessons = progress?.totalCompletedLessons || 0
    const certsCount = Array.isArray(certificatesList) ? certificatesList.length : 0

    return [
      {
        id: 'ach-1',
        title: 'First Skill Completed',
        description: 'Successfully completed your first full skill roadmap.',
        icon: '🏅',
        earnedAt: totalCompleted > 0 ? 'Unlocked' : 'Locked',
        unlocked: totalCompleted > 0
      },
      {
        id: 'ach-2',
        title: 'Dedicated Learner',
        description: 'Completed 5+ interactive lessons in ZenScore AI.',
        icon: '🔥',
        earnedAt: totalLessons >= 5 ? 'Unlocked' : 'Locked',
        unlocked: totalLessons >= 5
      },
      {
        id: 'ach-3',
        title: 'Verified Digital Certificate',
        description: 'Earned an official verifiable ZenScore AI certificate.',
        icon: '📜',
        earnedAt: certsCount > 0 ? 'Unlocked' : 'Locked',
        unlocked: certsCount > 0
      },
      {
        id: 'ach-4',
        title: 'Skill Master',
        description: 'Achieved 100% mastery on a core technology track.',
        icon: '🎯',
        earnedAt: totalCompleted > 0 ? 'Unlocked' : 'Locked',
        unlocked: totalCompleted > 0
      }
    ]
  }, [progress, certificatesList])

  return {
    userInfo,
    categories,
    skills,
    pagination,
    continueLearning,
    progress,
    recommendedSkills,
    aiRecommendations,
    certificatesList,
    selectedSkillDetails,
    filters,
    setFilters,
    loading,
    error,
    toast,
    showToast,
    refetch: fetchAllData,
    handleEnroll,
    handleCompleteLesson,
    handleFetchSkillDetails,
    handleBookmarkToggle,
    copyCertificateVerification,

    // Backwards compatibility props for section rendering
    overviewStats,
    continueCourses,
    exploreSkills,
    roadmapsData,
    progressSummary,
    activeSkillsProgress,
    learningActivity,
    achievementsData
  }
}
