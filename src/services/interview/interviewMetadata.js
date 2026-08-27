/**
 * interviewMetadata.js
 * Interview Difficulty Prediction & Topic Metadata Service for ZenScore AI (Product 6 - Sprint A).
 * Predicts interview difficulty and evaluates company-specific interview parameters.
 */

import { getCompanyInterviewInfo } from './companyInterviewRegistry'

/**
 * Predicts interview difficulty for a target company and student readiness level.
 */
export function predictInterviewDifficulty(companyName = 'Amazon', readinessPct = 78) {
  const companyInfo = getCompanyInterviewInfo(companyName)

  let predictedDifficulty = companyInfo.difficulty
  let passProbabilityPct = Math.min(96, Math.max(30, readinessPct - 5))

  if (companyInfo.tier === 'MAANG' && readinessPct < 75) {
    predictedDifficulty = 'Hard (Challenging)'
    passProbabilityPct = Math.min(passProbabilityPct, 55)
  } else if (companyInfo.tier === 'IT Services' && readinessPct >= 70) {
    predictedDifficulty = 'Easy / Medium (High Pass Chance)'
    passProbabilityPct = Math.max(passProbabilityPct, 88)
  }

  return {
    company: companyInfo.name,
    tier: companyInfo.tier,
    predictedDifficulty,
    passProbabilityPct,
    prepDaysNeeded: companyInfo.prepDaysNeeded,
    focusTopics: companyInfo.focusTopics,
    rounds: companyInfo.rounds,
  }
}
