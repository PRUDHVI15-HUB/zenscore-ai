/**
 * companyInterviewService.js
 * AI Company Interview Hub Service for ZenScore AI Product 6 (Sprint E).
 * Extended from baseAIService with 24h caching & telemetry under 'zenscore_ai_company_interview_v1.1'.
 */

import { executeAIRequest } from './baseAIService'

export const COMPANY_INTERVIEW_PROMPT_VERSION = 'v1.1'

/**
 * Generates reliable fallback AI Company Placement data if backend LLM is unreachable.
 */
export function generateCompanyInterviewFallback(targetRole = 'Backend Engineer', payload = {}) {
  const { company = 'Amazon' } = payload

  return {
    companyProfile: {
      name: company,
      tier: 'MAANG / Tier 1 Product',
      averageSalary: '₹28L - ₹45L CTC',
      hiringFrequency: 'Very High',
      interviewRounds: [
        { step: 1, name: 'Resume Screening', duration: '1 - 2 Days' },
        { step: 2, name: 'Online Assessment (OA)', duration: '90 Mins' },
        { step: 3, name: 'Technical Round 1 (DSA & Spring Boot)', duration: '60 Mins' },
        { step: 4, name: 'Technical Round 2 (System Design & DB)', duration: '60 Mins' },
        { step: 5, name: 'Bar Raiser & Leadership Round', duration: '60 Mins' },
      ],
    },
    questionBank: [
      { category: 'DSA', question: 'LRU Cache Implementation & Double LinkedList' },
      { category: 'Java / Spring Boot', question: 'Spring Bean Lifecycle & Transaction Management' },
      { category: 'SQL / DBMS', question: 'ACID Properties & Database Indexing B-Trees' },
      { category: 'Behavioral STAR', question: 'Tell me about a time you handled a tight deadline project failure.' },
    ],
    interviewExperience: {
      candidateStory: `Cleared ${company} engineering interview after 5 rounds. Focus heavily on STAR leadership principles alongside optimal O(N) space complexity.`,
      difficulty: 'Hard',
      interviewerStyle: 'Professional & Deep Technical Probing',
      commonMistakes: ['Failing to quantify STAR metrics', 'Not handling null edge cases in coding round'],
    },
    prepPlan: {
      plan7Days: [`Day 1-3: Top 25 ${company} tagged DSA`, 'Day 4-5: System design rate limiters', 'Day 6-7: STAR leadership principles'],
      plan30Days: ['Week 1: LeetCode Medium/Hard Graphs', 'Week 2: Low level design', 'Week 3: Microservices HLD', 'Week 4: Mock interviews'],
    },
    recruiterExpectations: {
      resumeExpectation: 'Quantified STAR achievements and production tech stack.',
      codingExpectation: 'Clean code with zero compilation errors and O(N) optimal time complexity.',
      communicationExpectation: 'Structured verbal presentation using STAR framework.',
    },
    offerPrediction: {
      offerProbabilityPct: 78,
      expectedPackage: '₹32.5L CTC',
      priorityImprovements: ['Practice DP 2D questions', 'Elaborate on Redis eviction strategies'],
    },
    strategyChecklist: {
      beforeInterview: [`Review ${company} Core Values & Principles`, 'Verify IDE environment'],
      duringInterview: ['Think out loud while coding', 'Clarify boundary constraints before writing solution'],
      negotiationTips: ['Highlight competing offers and ZenScore AI readiness certification score.'],
    },
  }
}

/**
 * Fetches AI Company Interview Hub data from backend API with 24h cache and fallback.
 */
export async function getAICompanyInterview(targetRole = 'Backend Engineer', payload = {}) {
  const reqPayload = { targetCareer: targetRole, ...payload }
  const fallback = generateCompanyInterviewFallback(targetRole, payload)
  const subKey = targetRole.replace(/\s+/g, '_')

  const result = await executeAIRequest({
    featureKey: 'company_interview',
    cacheSubKey: subKey,
    promptVersion: COMPANY_INTERVIEW_PROMPT_VERSION,
    requestPayload: reqPayload,
    endpoint: '/careers/interview/company-ai',
    requiredFields: [
      'companyProfile',
      'questionBank',
      'interviewExperience',
      'prepPlan',
      'recruiterExpectations',
      'offerPrediction',
      'strategyChecklist',
    ],
    fallbackData: fallback,
  })

  return {
    ...result.data,
    isCached: result.isCached,
    isFallback: result.isFallback,
  }
}

