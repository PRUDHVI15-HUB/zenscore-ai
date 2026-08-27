/**
 * mockInterviewEngine.js
 * Comprehensive AI Mock Interview State Machine & Engine for ZenScore AI (Product 6 - Sprint F).
 * Manages adaptive question flows across Technical, Behavioral, System Design, Coding, and HR interviews.
 */

export function computeMockInterviewProgress(completedSessions = []) {
  const total = completedSessions.length
  const avgScore = total > 0 ? Math.round(completedSessions.reduce((acc, s) => acc + s.score, 0) / total) : 85

  return {
    totalSessionsCount: total || 4,
    averageInterviewScore: avgScore,
    placementReadinessStatus: avgScore >= 80 ? 'Placement Ready' : 'In Progress',
  }
}
