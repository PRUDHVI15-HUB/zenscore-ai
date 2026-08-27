/**
 * interviewReportService.js
 * Dynamic Activity-Earned Placement Readiness & Improvement Report Service for ZenScore AI (Phase 7 - Sprint 6).
 */

export function generatePlacementReport(targetRole = 'Backend Engineer', readinessScore = 0) {
  const isZero = readinessScore === 0

  return {
    targetRole,
    placementReadyPct: readinessScore,
    breakdown: {
      dreamCompanyPct: Math.round(readinessScore * 0.85),
      serviceCompanyPct: Math.min(100, Math.round(readinessScore * 1.05)),
      startupPct: Math.round(readinessScore * 0.9),
      productCompanyPct: Math.round(readinessScore * 0.88),
    },
    skillMatrix: {
      technicalAccuracy: `${readinessScore} / 100`,
      dsaProblemSolving: `${readinessScore} / 100`,
      systemDesign: `${readinessScore} / 100`,
      behavioralSTAR: `${readinessScore} / 100`,
      communicationClarity: `${readinessScore} / 100`,
    },
    finalMentorAdvice: isZero
      ? `Complete roadmap lessons, coding labs, and mock interviews to evaluate your ${targetRole} placement readiness.`
      : `Your current placement readiness is ${readinessScore}%. Continue completing mock interviews to increase company match scores.`,
  }
}
