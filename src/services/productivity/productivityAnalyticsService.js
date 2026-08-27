import { getStoredSessions } from '../../utils/focusSessionStorage'
import { syncProductivityToProfile } from '../profileSync/productivityProfileSync'

/**
 * Main analytics service reading strictly from productivity_focus_v1
 */
export const getAnalyticsData = () => {
  const sessions = getStoredSessions()
  const data = calculateAllAnalytics(sessions)
  syncProductivityToProfile(data)
  return data
}

/**
 * Calculate complete analytics payload from session array
 */
export const calculateAllAnalytics = (sessions = []) => {
  const totalSessions = sessions.length
  const completedSessions = sessions.filter((s) => s.completed).length

  // Total Focus Minutes & Hours
  const totalMinutes = sessions.reduce((sum, s) => sum + (Number(s.actualMinutes) || 0), 0)
  const totalFocusHoursNum = totalMinutes / 60
  const totalFocusTime = totalSessions > 0 ? `${totalFocusHoursNum.toFixed(1)} hrs` : '0 min'

  // Average & Longest Session Duration
  const avgSessionDurationNum = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0
  const avgSessionDuration = totalSessions > 0 ? `${avgSessionDurationNum} mins` : '0 min'
  const longestSessionNum = totalSessions > 0 ? Math.max(...sessions.map((s) => Number(s.actualMinutes) || 0)) : 0
  const longestSession = totalSessions > 0 ? `${longestSessionNum} mins` : '0 min'

  // Date Parsing Helpers
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  // Start of current week (Monday)
  const dayOfWeek = (today.getDay() + 6) % 7 // 0 = Mon, 6 = Sun
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - dayOfWeek)
  startOfWeek.setHours(0, 0, 0, 0)

  // Current Month & Prev Month
  const currentMonthYear = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  const prevMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  const prevMonthYear = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`

  // Current Week Focus Time
  const weekSessions = sessions.filter((s) => {
    const sDate = new Date(s.date || s.startTime)
    return sDate >= startOfWeek
  })
  const weekMinutes = weekSessions.reduce((sum, s) => sum + (Number(s.actualMinutes) || 0), 0)
  const currentWeekFocusTime = `${(weekMinutes / 60).toFixed(1)} hrs`

  // Current Month Focus Time
  const monthSessions = sessions.filter((s) => (s.date || s.startTime || '').startsWith(currentMonthYear))
  const monthMinutes = monthSessions.reduce((sum, s) => sum + (Number(s.actualMinutes) || 0), 0)
  const currentMonthFocusTime = `${(monthMinutes / 60).toFixed(1)} hrs`

  // Previous Month Focus Time
  const prevMonthSessions = sessions.filter((s) => (s.date || s.startTime || '').startsWith(prevMonthYear))
  const prevMonthMinutes = prevMonthSessions.reduce((sum, s) => sum + (Number(s.actualMinutes) || 0), 0)

  // Most Productive Day of Week
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayTotals = { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0 }

  sessions.forEach((s) => {
    try {
      const d = new Date(s.date || s.startTime)
      const dayName = dayNames[d.getDay()]
      dayTotals[dayName] += Number(s.actualMinutes) || 0
    } catch (e) {}
  })

  let mostProductiveDay = 'N/A'
  let maxDayMins = 0
  Object.entries(dayTotals).forEach(([day, mins]) => {
    if (mins > maxDayMins) {
      maxDayMins = mins
      mostProductiveDay = day
    }
  })

  // Most Studied Module (Category)
  const moduleTotals = {}
  sessions.forEach((s) => {
    const cat = s.category || 'Other'
    moduleTotals[cat] = (moduleTotals[cat] || 0) + (Number(s.actualMinutes) || 0)
  })

  let mostStudiedModule = 'N/A'
  let maxModuleMins = 0
  Object.entries(moduleTotals).forEach(([cat, mins]) => {
    if (mins > maxModuleMins) {
      maxModuleMins = mins
      mostStudiedModule = cat
    }
  })

  // ── CHART 1: WEEKLY FOCUS TIME (BAR CHART) ──
  const weekDaysShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const weeklyFocusChart = weekDaysShort.map((dayLabel, idx) => {
    const targetDate = new Date(startOfWeek)
    targetDate.setDate(startOfWeek.getDate() + idx)
    const targetDateStr = targetDate.toISOString().split('T')[0]

    const dayMins = sessions
      .filter((s) => (s.date || s.startTime || '').startsWith(targetDateStr))
      .reduce((sum, s) => sum + (Number(s.actualMinutes) || 0), 0)

    return {
      day: dayLabel,
      minutes: dayMins
    }
  })

  // ── CHART 2: DAILY FOCUS TREND (LAST 30 DAYS LINE CHART) ──
  const dailyFocusTrend = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const dStr = d.toISOString().split('T')[0]
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

    const dayMins = sessions
      .filter((s) => (s.date || s.startTime || '').startsWith(dStr))
      .reduce((sum, s) => sum + (Number(s.actualMinutes) || 0), 0)

    dailyFocusTrend.push({
      date: label,
      fullDate: dStr,
      minutes: dayMins
    })
  }

  // ── CHART 3: STUDY MODULE DISTRIBUTION (PIE CHART) ──
  const MODULE_CATEGORIES = ['Courses', 'DSA', 'Roadmap', 'Resume', 'Interview', 'Academics', 'Project', 'Other']
  const moduleDistribution = MODULE_CATEGORIES.map((cat) => {
    const catMins = sessions
      .filter((s) => (s.category || 'Other') === cat)
      .reduce((sum, s) => sum + (Number(s.actualMinutes) || 0), 0)

    const pct = totalMinutes > 0 ? Math.round((catMins / totalMinutes) * 100) : 0
    return {
      name: cat,
      minutes: catMins,
      percentage: pct
    }
  }).filter((m) => m.minutes > 0)

  // ── CHART 4: STUDY DURATION DISTRIBUTION (HORIZONTAL BAR CHART) ──
  const durationBuckets = {
    '25 min': 0,
    '45 min': 0,
    '60 min': 0,
    '90 min': 0,
    Custom: 0
  }

  sessions.forEach((s) => {
    const p = Number(s.plannedMinutes)
    if (p === 25) durationBuckets['25 min']++
    else if (p === 45) durationBuckets['45 min']++
    else if (p === 60) durationBuckets['60 min']++
    else if (p === 90) durationBuckets['90 min']++
    else durationBuckets['Custom']++
  })

  const durationDistribution = Object.entries(durationBuckets).map(([label, count]) => ({
    label,
    count
  }))

  // ── HEATMAP (LAST 90 DAYS) ──
  const studyHeatmap = []
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const dStr = d.toISOString().split('T')[0]

    const dayMins = sessions
      .filter((s) => (s.date || s.startTime || '').startsWith(dStr))
      .reduce((sum, s) => sum + (Number(s.actualMinutes) || 0), 0)

    let intensity = 0
    if (dayMins > 0 && dayMins <= 25) intensity = 1
    else if (dayMins > 25 && dayMins <= 50) intensity = 2
    else if (dayMins > 50 && dayMins <= 89) intensity = 3
    else if (dayMins >= 90) intensity = 4

    studyHeatmap.push({
      date: dStr,
      displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      minutes: dayMins,
      intensity
    })
  }

  // ── TIME OF DAY ANALYSIS ──
  const timeBlocks = {
    Morning: 0, // 5 AM - 12 PM
    Afternoon: 0, // 12 PM - 5 PM
    Evening: 0, // 5 PM - 9 PM
    Night: 0 // 9 PM - 5 AM
  }

  sessions.forEach((s) => {
    try {
      const sDate = new Date(s.startTime || s.date)
      const hr = sDate.getHours()
      const mins = Number(s.actualMinutes) || 0

      if (hr >= 5 && hr < 12) timeBlocks.Morning += mins
      else if (hr >= 12 && hr < 17) timeBlocks.Afternoon += mins
      else if (hr >= 17 && hr < 21) timeBlocks.Evening += mins
      else timeBlocks.Night += mins
    } catch (e) {}
  })

  const timeAnalysis = Object.entries(timeBlocks).map(([block, mins]) => ({
    block,
    hours: (mins / 60).toFixed(1),
    percentage: totalMinutes > 0 ? Math.round((mins / totalMinutes) * 100) : 0
  }))

  // ── MONTHLY COMPARISON ──
  const currentMonthHoursNum = monthMinutes / 60
  const prevMonthHoursNum = prevMonthMinutes / 60

  const monthlyComparison = {
    currentMonth: {
      name: today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      hours: currentMonthHoursNum.toFixed(1),
      sessions: monthSessions.length,
      avgDuration: monthSessions.length > 0 ? Math.round(monthMinutes / monthSessions.length) : 0
    },
    prevMonth: {
      name: prevMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      hours: prevMonthHoursNum.toFixed(1),
      sessions: prevMonthSessions.length,
      avgDuration: prevMonthSessions.length > 0 ? Math.round(prevMonthMinutes / prevMonthSessions.length) : 0
    },
    improvementPct:
      prevMonthHoursNum > 0
        ? (((currentMonthHoursNum - prevMonthHoursNum) / prevMonthHoursNum) * 100).toFixed(1)
        : '0.0'
  }

  // ── PRODUCTIVITY SCORE (0 - 100) ──
  // 40% Consistency (Study days this week / 7)
  const studyDaysThisWeek = new Set(weekSessions.map((s) => (s.date || s.startTime || '').split('T')[0])).size
  const consistencyScore = (studyDaysThisWeek / 7) * 40

  // 30% Completion Rate
  const completionScore = totalSessions > 0 ? (completedSessions / totalSessions) * 30 : 0

  // 20% Avg Duration (capped at 60 mins)
  const durationScore = Math.min(20, (avgSessionDurationNum / 60) * 20)

  // 10% Weekly Hours (capped at 10 hours)
  const weeklyHoursNum = weekMinutes / 60
  const weeklyHoursScore = Math.min(10, (weeklyHoursNum / 10) * 10)

  const productivityScore = totalSessions > 0
    ? Math.min(100, Math.round(consistencyScore + completionScore + durationScore + weeklyHoursScore))
    : '--'

  let scoreTier = 'Beginner'
  if (productivityScore >= 80) scoreTier = 'Elite'
  else if (productivityScore >= 60) scoreTier = 'Consistent'
  else if (productivityScore >= 40) scoreTier = 'Focused'

  // ── DYNAMIC PERSONAL INSIGHTS ──
  const personalInsights = []
  if (mostProductiveDay !== 'N/A') {
    personalInsights.push(`Your most productive day is ${mostProductiveDay}.`)
  }
  if (mostStudiedModule !== 'N/A') {
    personalInsights.push(`You spend most of your time studying ${mostStudiedModule}.`)
  }
  if (avgSessionDurationNum > 0) {
    personalInsights.push(`Your average session length is ${avgSessionDurationNum} minutes.`)
  }
  if (longestSessionNum > 0) {
    personalInsights.push(`Your longest focus session lasted ${longestSessionNum} minutes.`)
  }

  return {
    hasData: totalSessions > 0,
    summaryMetrics: {
      totalFocusTime,
      totalSessions,
      avgSessionDuration,
      longestSession,
      mostProductiveDay,
      mostStudiedModule,
      currentWeekFocusTime,
      currentMonthFocusTime
    },
    weeklyFocusChart,
    dailyFocusTrend,
    moduleDistribution,
    durationDistribution,
    studyHeatmap,
    timeAnalysis,
    monthlyComparison,
    productivityScore,
    scoreTier,
    personalInsights
  }
}

/**
 * Export Analytics to CSV File
 */
export const exportAnalyticsCSV = (analyticsData) => {
  const sessions = getStoredSessions()
  if (!sessions.length) return

  let csvContent = 'data:text/csv;charset=utf-8,'
  csvContent += 'ID,Topic,Category,Goal,Planned_Minutes,Actual_Minutes,XP_Earned,Date,Completed\n'

  sessions.forEach((s) => {
    const row = [
      s.id,
      `"${(s.topic || '').replace(/"/g, '""')}"`,
      `"${(s.category || '').replace(/"/g, '""')}"`,
      `"${(s.goal || '').replace(/"/g, '""')}"`,
      s.plannedMinutes,
      s.actualMinutes,
      s.xpEarned || s.actualMinutes,
      s.date || s.startTime,
      s.completed ? 'YES' : 'NO'
    ].join(',')
    csvContent += row + '\n'
  })

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `zenscore_productivity_analytics_${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
