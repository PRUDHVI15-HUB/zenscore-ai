/**
 * careerMarketParser.js
 * Defensive Parser & Sanitizer for Career Market Intelligence.
 */

import { generateCareerMarketFallback } from './careerMarketFallback'

export function parseCareerMarketData(data, careerTitle = 'Backend Engineer') {
  const fallback = generateCareerMarketFallback(careerTitle)

  if (!data || typeof data !== 'object') return fallback

  return {
    careerTitle: data.careerTitle || careerTitle,
    marketDemand: {
      level: data.marketDemand?.level || fallback.marketDemand.level,
      openPositions: data.marketDemand?.openPositions || fallback.marketDemand.openPositions,
      hiringTrend: data.marketDemand?.hiringTrend || fallback.marketDemand.hiringTrend,
    },
    salaryProgression: {
      fresher: data.salaryProgression?.fresher || fallback.salaryProgression.fresher,
      exp1to3: data.salaryProgression?.exp1to3 || fallback.salaryProgression.exp1to3,
      exp3to5: data.salaryProgression?.exp3to5 || fallback.salaryProgression.exp3to5,
      senior: data.salaryProgression?.senior || fallback.salaryProgression.senior,
      architect: data.salaryProgression?.architect || fallback.salaryProgression.architect,
    },
    topRecruiters: Array.isArray(data.topRecruiters) && data.topRecruiters.length > 0
      ? data.topRecruiters
      : fallback.topRecruiters,
    techStack: Array.isArray(data.techStack) && data.techStack.length > 0
      ? data.techStack
      : fallback.techStack,
    certifications: Array.isArray(data.certifications) && data.certifications.length > 0
      ? data.certifications
      : fallback.certifications,
    interviewProcess: Array.isArray(data.interviewProcess) && data.interviewProcess.length > 0
      ? data.interviewProcess
      : fallback.interviewProcess,
    futureOutlook: {
      futureDemand: data.futureOutlook?.futureDemand || fallback.futureOutlook.futureDemand,
      automationRisk: data.futureOutlook?.automationRisk || fallback.futureOutlook.automationRisk,
      remotePct: data.futureOutlook?.remotePct || fallback.futureOutlook.remotePct,
      globalDemand: data.futureOutlook?.globalDemand || fallback.futureOutlook.globalDemand,
      stability: data.futureOutlook?.stability || fallback.futureOutlook.stability,
    },
    industryNews: Array.isArray(data.industryNews) && data.industryNews.length > 0
      ? data.industryNews
      : fallback.industryNews,
  }
}
