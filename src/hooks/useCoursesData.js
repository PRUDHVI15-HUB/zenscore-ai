import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  getCourses,
  getCourseStats,
  getRecommendedCourses,
  getContinueLearning,
  enrollInCourse,
  toggleCourseBookmark,
  getRoadmap,
  getDailyChallenge,
  getCertificates,
  getLearningAnalytics
} from '../services/courses/coursesService'
import { getMe } from '../services/api'
import { syncCoursesToProfile } from '../services/profileSync/coursesProfileSync'

/**
 * Production useCoursesData Hook
 * Single source of truth for the entire Courses page.
 * Safely handles network errors, null responses, and 401 unauthenticated states.
 */
export function useCoursesData(activeTab = 'explore', initialFilters = {}) {
  const [userInfo, setUserInfo] = useState(null)
  const [courses, setCourses] = useState([])
  const [stats, setStats] = useState(null)
  const [recommended, setRecommended] = useState([])
  const [continueLearning, setContinueLearningState] = useState([])
  const [roadmap, setRoadmapState] = useState(null)
  const [dailyChallenge, setDailyChallengeState] = useState(null)
  const [certificatesList, setCertificatesList] = useState([])
  const [analytics, setAnalyticsState] = useState(null)

  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    difficulty: 'all',
    sort: 'newest',
    ...initialFilters
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 3500)
  }, [])

  const fetchAllData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true)
    setError(null)

    try {
      const [
        meRes,
        coursesRes,
        statsRes,
        recRes,
        contRes,
        roadmapRes,
        challengeRes,
        certsRes,
        analyticsRes
      ] = await Promise.allSettled([
        getMe(),
        getCourses(filters),
        getCourseStats(),
        getRecommendedCourses(),
        getContinueLearning(),
        getRoadmap(),
        getDailyChallenge(),
        getCertificates(),
        getLearningAnalytics()
      ])

      if (meRes.status === 'fulfilled' && meRes.value?.success) {
        setUserInfo(meRes.value.user || null)
      }

      if (coursesRes.status === 'fulfilled' && coursesRes.value?.success) {
        setCourses(Array.isArray(coursesRes.value.data) ? coursesRes.value.data : [])
      }

      if (statsRes.status === 'fulfilled' && statsRes.value?.success) {
        setStats(statsRes.value.data || null)
      }

      if (recRes.status === 'fulfilled' && recRes.value?.success) {
        setRecommended(Array.isArray(recRes.value.data) ? recRes.value.data : [])
      }

      if (contRes.status === 'fulfilled' && contRes.value?.success) {
        setContinueLearningState(Array.isArray(contRes.value.data) ? contRes.value.data : [])
      }

      if (roadmapRes.status === 'fulfilled' && roadmapRes.value?.success) {
        setRoadmapState(roadmapRes.value.data || null)
      }

      if (challengeRes.status === 'fulfilled' && challengeRes.value?.success) {
        setDailyChallengeState(challengeRes.value.data || null)
      }

      if (certsRes.status === 'fulfilled' && certsRes.value?.success) {
        setCertificatesList(Array.isArray(certsRes.value.data) ? certsRes.value.data : [])
      }

      if (analyticsRes.status === 'fulfilled' && analyticsRes.value?.success) {
        setAnalyticsState(analyticsRes.value.data || null)
      }

      // ── STUDENT PROFILE SYNC ──────────────────────────────────────
      // Fire-and-forget: never blocks UI, never throws, silent on error
      // Reads directly from settled results — no React state lag
      syncCoursesToProfile({
        courses:          coursesRes.status   === 'fulfilled' && coursesRes.value?.success   ? coursesRes.value.data   : [],
        stats:            statsRes.status     === 'fulfilled' && statsRes.value?.success     ? statsRes.value.data     : null,
        recommended:      recRes.status       === 'fulfilled' && recRes.value?.success       ? recRes.value.data       : [],
        continueLearning: contRes.status      === 'fulfilled' && contRes.value?.success      ? contRes.value.data      : [],
        roadmap:          roadmapRes.status   === 'fulfilled' && roadmapRes.value?.success   ? roadmapRes.value.data   : null,
        certificatesList: certsRes.status     === 'fulfilled' && certsRes.value?.success     ? certsRes.value.data     : [],
        analytics:        analyticsRes.status === 'fulfilled' && analyticsRes.value?.success ? analyticsRes.value.data : null,
      })
      // ─────────────────────────────────────────────────────────────
    } catch (err) {
      console.warn('Production Courses fetch warning:', err)
      setError(err?.message || 'Failed to load live courses data.')
    } finally {
      if (!isSilent) setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  const handleEnroll = useCallback(async (courseId) => {
    try {
      const res = await enrollInCourse(courseId)
      if (res.success) {
        showToast('✓ Enrolled in course successfully!', 'success')
        fetchAllData(true)
      }
    } catch (err) {
      showToast(err?.message || 'Failed to enroll in course', 'error')
    }
  }, [showToast, fetchAllData])

  const handleBookmarkToggle = useCallback(async (courseId) => {
    try {
      const res = await toggleCourseBookmark(courseId)
      if (res.success) {
        showToast(res.isBookmarked ? '★ Added to bookmarks' : 'Removed from bookmarks', 'info')
        setCourses(prev => prev.map(c => c._id === courseId ? { ...c, isBookmarked: res.isBookmarked } : c))
      }
    } catch (err) {
      showToast(err?.message || 'Failed to update bookmark', 'error')
    }
  }, [showToast])

  const overviewStats = useMemo(() => ({
    startedCount: continueLearning.length || stats?.startedCount || 0,
    completedCount: stats?.completedCount || 0,
    weeklyHours: analytics?.weeklyHours || stats?.weeklyHours || 0,
    weeklyTarget: stats?.weeklyGoal || 10,
    certificatesCount: certificatesList.length || stats?.certificatesCount || 0,
    startedTrend: `${continueLearning.length} active courses`,
    completedTrend: `${stats?.completedCount || 0} completed`
  }), [continueLearning, stats, analytics, certificatesList])

  const progressSummary = useMemo(() => ({
    totalHours: analytics?.weeklyHours || stats?.weeklyHours || 0,
    weeklyTrend: `+${analytics?.weeklyHours || 0} hrs this week`,
    skillsCompleted: stats?.completedCount || 0,
    completionRate: analytics?.completionRate || 0,
    streakDays: stats?.streak || 0,
    bestStreak: stats?.streak || 0,
    overallProgress: analytics?.completionRate || 0
  }), [analytics, stats])

  const activeCoursesProgress = useMemo(() => {
    if (!Array.isArray(continueLearning) || continueLearning.length === 0) return []
    return continueLearning.map(item => ({
      id: item.course?._id || item._id,
      name: item.course?.title || item.name || 'Course',
      progress: item.completionPercentage || item.completedPercent || 0,
      currentModule: `Module ${item.lastOpenedModuleIndex ? item.lastOpenedModuleIndex + 1 : 1}`,
      category: item.course?.category || 'Programming',
      icon: item.course?.icon || '📚'
    }))
  }, [continueLearning])

  const learningActivity = useMemo(() => {
    if (!Array.isArray(continueLearning) || continueLearning.length === 0) return []
    return continueLearning.map(item => ({
      id: `act-course-${item.course?._id || item._id}`,
      timestamp: item.lastStudiedAt ? new Date(item.lastStudiedAt).toLocaleDateString() : 'Recently',
      title: `Learning ${item.course?.title || 'Course'}`,
      skillName: item.course?.title || 'Course',
      type: item.isCompleted ? 'project' : 'exercise'
    }))
  }, [continueLearning])

  const achievementsData = useMemo(() => {
    const totalCompleted = stats?.completedCount || 0
    const certsCount = certificatesList.length || 0

    return [
      {
        id: 'ach-c1',
        title: 'First Specialization Started',
        description: 'Enrolled and started your first course specialization.',
        icon: '🏅',
        earnedAt: continueLearning.length > 0 ? 'Unlocked' : 'Locked',
        unlocked: continueLearning.length > 0
      },
      {
        id: 'ach-c2',
        title: 'Daily Study Streak',
        description: 'Maintained active daily study consistency.',
        icon: '🔥',
        earnedAt: (stats?.streak || 0) > 0 ? 'Unlocked' : 'Locked',
        unlocked: (stats?.streak || 0) > 0
      },
      {
        id: 'ach-c3',
        title: 'Verified Course Certificate',
        description: 'Earned an official verifiable ZenScore Academy certificate.',
        icon: '📜',
        earnedAt: certsCount > 0 ? 'Unlocked' : 'Locked',
        unlocked: certsCount > 0
      },
      {
        id: 'ach-c4',
        title: 'Course Master',
        description: 'Completed 100% of all required modules in a course.',
        icon: '🎯',
        earnedAt: totalCompleted > 0 ? 'Unlocked' : 'Locked',
        unlocked: totalCompleted > 0
      }
    ]
  }, [stats, continueLearning, certificatesList])

  return {
    userInfo,
    courses,
    stats,
    recommended,
    continueLearning,
    roadmap,
    dailyChallenge,
    certificatesList,
    analytics,
    filters,
    setFilters,
    loading,
    error,
    toast,
    showToast,
    refetch: fetchAllData,
    handleEnroll,
    handleBookmarkToggle,
    overviewStats,
    progressSummary,
    activeCoursesProgress,
    learningActivity,
    achievementsData
  }
}
