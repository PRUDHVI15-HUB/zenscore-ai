import { getStoredSessions } from '../../utils/focusSessionStorage'

/**
 * Focus Health Service reading strictly from productivity_focus_v1
 */
export const getFocusHealthData = () => {
  const sessions = getStoredSessions()
  return calculateFocusHealthMetrics(sessions)
}

export const calculateFocusHealthMetrics = (sessions = []) => {
  const totalSessions = sessions.length
  if (totalSessions === 0) {
    return { hasData: false }
  }

  const completedSessions = sessions.filter((s) => s.completed).length
  const pausedSessions = sessions.filter((s) => s.paused).length
  const totalMinutes = sessions.reduce((sum, s) => sum + (Number(s.actualMinutes) || 0), 0)
  const avgMinutes = Math.round(totalMinutes / totalSessions)
  const longestSession = Math.max(...sessions.map((s) => Number(s.actualMinutes) || 0))

  const deepWorkSessions = sessions.filter((s) => Number(s.actualMinutes) >= 45).length
  const deepWorkPct = Math.round((deepWorkSessions / totalSessions) * 100)
  const completionRate = Math.round((completedSessions / totalSessions) * 100)

  // Dates & Streak Calculation
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  const uniqueDates = Array.from(
    new Set(sessions.map((s) => (s.date || s.startTime || '').split('T')[0]))
  ).sort()

  let currentStreak = 0
  let bestStreak = 0
  let tempStreak = 0

  if (uniqueDates.length > 0) {
    let checkDate = new Date(today)
    while (true) {
      const dStr = checkDate.toISOString().split('T')[0]
      if (uniqueDates.includes(dStr)) {
        currentStreak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }

    // Best Streak
    for (let i = 0; i < uniqueDates.length; i++) {
      if (i === 0) {
        tempStreak = 1
      } else {
        const prev = new Date(uniqueDates[i - 1])
        const curr = new Date(uniqueDates[i])
        const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24))
        if (diffDays === 1) {
          tempStreak++
        } else {
          tempStreak = 1
        }
      }
      if (tempStreak > bestStreak) bestStreak = tempStreak
    }
  }

  if (currentStreak > bestStreak) bestStreak = currentStreak

  // Start of current week (Monday)
  const dayOfWeek = (today.getDay() + 6) % 7
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - dayOfWeek)
  startOfWeek.setHours(0, 0, 0, 0)

  const weekSessions = sessions.filter((s) => new Date(s.date || s.startTime) >= startOfWeek)
  const weekMinutes = weekSessions.reduce((sum, s) => sum + (Number(s.actualMinutes) || 0), 0)
  const weeklyHours = weekMinutes / 60
  const studyDaysThisWeek = new Set(weekSessions.map((s) => (s.date || s.startTime || '').split('T')[0])).size

  // 1. CONSISTENCY SCORE (0 - 100)
  const daysScore = (studyDaysThisWeek / 7) * 60
  const compScore = (completionRate / 100) * 40
  const consistencyScore = Math.min(100, Math.round(daysScore + compScore))

  // 2. BURNOUT RISK
  const activeDaysCount = Math.max(1, uniqueDates.length)
  const avgDailyHours = totalMinutes / activeDaysCount / 60
  const marathonCount = sessions.filter((s) => Number(s.actualMinutes) >= 90).length

  let burnoutRisk = 'Low'
  let burnoutColor = '#059669' // Green
  let burnoutBg = '#F0FDF4'

  if (avgDailyHours > 7 || longestSession > 120 || (currentStreak > 14 && avgDailyHours > 5)) {
    burnoutRisk = 'Critical'
    burnoutColor = '#DC2626' // Red
    burnoutBg = '#FEF2F2'
  } else if (avgDailyHours >= 5 || longestSession >= 90 || marathonCount >= 3) {
    burnoutRisk = 'High'
    burnoutColor = '#F97316' // Orange
    burnoutBg = '#FFF7ED'
  } else if (avgDailyHours >= 3 || longestSession >= 75) {
    burnoutRisk = 'Medium'
    burnoutColor = '#D97706' // Yellow/Amber
    burnoutBg = '#FFFBEB'
  }

  // 3. RECOVERY SCORE (0 - 100)
  const moderateCount = sessions.filter((s) => {
    const m = Number(s.actualMinutes)
    return m >= 25 && m <= 50
  }).length

  let recoveryPenalty = marathonCount * 15
  if (burnoutRisk === 'Critical') recoveryPenalty += 40
  else if (burnoutRisk === 'High') recoveryPenalty += 25
  else if (burnoutRisk === 'Medium') recoveryPenalty += 10

  const recoveryBonus = Math.min(30, moderateCount * 5)
  const recoveryScore = Math.max(0, Math.min(100, Math.round(100 - recoveryPenalty + recoveryBonus)))

  // 4. FOCUS HEALTH SCORE (0 - 100)
  const cWeight = (consistencyScore / 100) * 30
  const wWeight = Math.min(20, (weeklyHours / 10) * 20)
  const dWeight = Math.min(20, (avgMinutes / 60) * 20)
  const rWeight = (recoveryScore / 100) * 15
  const fWeight = Math.min(15, (totalSessions / 10) * 15)

  const healthScore = Math.min(100, Math.round(cWeight + wWeight + dWeight + rWeight + fWeight))

  let healthTier = 'Needs Improvement'
  let healthColor = '#DC2626'
  if (healthScore >= 85) {
    healthTier = 'Excellent'
    healthColor = '#059669'
  } else if (healthScore >= 70) {
    healthTier = 'Good'
    healthColor = '#2563EB'
  } else if (healthScore >= 50) {
    healthTier = 'Average'
    healthColor = '#D97706'
  }

  // 5. STUDY BALANCE & CATEGORY SKEW ALERT
  const MODULE_CATEGORIES = ['Courses', 'DSA', 'Roadmap', 'Resume', 'Interview', 'Academics', 'Project', 'Other']
  const categoryTotals = {}
  MODULE_CATEGORIES.forEach((cat) => (categoryTotals[cat] = 0))

  sessions.forEach((s) => {
    const cat = s.category || 'Other'
    categoryTotals[cat] = (categoryTotals[cat] || 0) + (Number(s.actualMinutes) || 0)
  })

  const studyBalance = MODULE_CATEGORIES.map((cat) => {
    const mins = categoryTotals[cat] || 0
    const pct = totalMinutes > 0 ? Math.round((mins / totalMinutes) * 100) : 0
    return { category: cat, minutes: mins, percentage: pct }
  })

  let skewedCategory = null
  studyBalance.forEach((sb) => {
    if (sb.percentage >= 70 && totalMinutes > 60) {
      skewedCategory = sb.category
    }
  })

  // 6. HEALTH TIMELINE (LAST 30 DAYS LINE CHART)
  const healthTimeline = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const dStr = d.toISOString().split('T')[0]
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

    const daySessions = sessions.filter((s) => (s.date || s.startTime || '').startsWith(dStr))
    const dayMins = daySessions.reduce((sum, s) => sum + (Number(s.actualMinutes) || 0), 0)

    // Daily health proxy score
    const dayScore = dayMins > 0 ? Math.min(100, Math.round(50 + (dayMins / 90) * 50)) : 30
    const dayConsistency = daySessions.length > 0 ? 100 : 0

    healthTimeline.push({
      date: label,
      fullDate: dStr,
      healthScore: dayScore,
      consistency: dayConsistency,
      minutes: dayMins
    })
  }

  // 7. DETERMINISTIC RECOMMENDATIONS
  const recommendations = []
  if (longestSession >= 90) {
    recommendations.push('Take a 15-minute break after long sessions.')
  }
  if (marathonCount >= 2) {
    recommendations.push('Reduce consecutive 90-minute sessions to maintain cognitive clarity.')
  }
  if (studyDaysThisWeek < 4) {
    recommendations.push('Increase study consistency across more days of the week.')
  }
  if ((categoryTotals['Roadmap'] || 0) / (totalMinutes || 1) < 0.1) {
    recommendations.push('Study more Roadmap topics to ensure well-rounded skill progression.')
  }
  if (burnoutRisk === 'High' || burnoutRisk === 'Critical') {
    recommendations.push('Schedule a light recovery day to prevent mental burnout.')
  }
  if (recommendations.length === 0) {
    recommendations.push('Maintain your current focus rhythm and regular break schedule!')
  }

  // 8. ACHIEVEMENTS UNLOCK SYSTEM
  const uniqueCategoriesCount = Object.keys(categoryTotals).filter((cat) => categoryTotals[cat] > 0).length

  const achievements = [
    {
      id: 'beginner',
      title: 'Focus Beginner',
      desc: 'Complete 5 Sessions',
      unlocked: totalSessions >= 5,
      icon: '🌱',
      progress: `${Math.min(5, totalSessions)} / 5`
    },
    {
      id: 'consistent',
      title: 'Consistent Learner',
      desc: 'Study 7 Consecutive Days',
      unlocked: bestStreak >= 7,
      icon: '🔥',
      progress: `${Math.min(7, bestStreak)} / 7 Days`
    },
    {
      id: 'deepwork',
      title: 'Deep Worker',
      desc: 'Complete 10 Deep Work Sessions',
      unlocked: deepWorkSessions >= 10,
      icon: '⚡',
      progress: `${Math.min(10, deepWorkSessions)} / 10`
    },
    {
      id: 'balanced',
      title: 'Balanced Learner',
      desc: 'Study 5 Different Modules',
      unlocked: uniqueCategoriesCount >= 5,
      icon: '🎯',
      progress: `${Math.min(5, uniqueCategoriesCount)} / 5`
    },
    {
      id: 'master',
      title: 'Health Master',
      desc: 'Maintain 90+ Health Score for 30 Days',
      unlocked: healthScore >= 90 && totalSessions >= 15,
      icon: '🏆',
      progress: healthScore >= 90 ? `${totalSessions} / 15 Sessions` : `${healthScore} / 90 Score`
    }
  ]

  return {
    hasData: true,
    healthScore,
    healthTier,
    healthColor,
    consistencyScore,
    burnoutRisk,
    burnoutColor,
    burnoutBg,
    recoveryScore,
    currentStreak,
    bestStreak,
    studyDaysThisWeek,
    completionRate,
    avgMinutes,
    longestSession,
    pausedSessions,
    deepWorkPct,
    studyBalance,
    skewedCategory,
    healthTimeline,
    recommendations,
    achievements
  }
}
