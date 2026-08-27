/**
 * overviewAIService.js
 * Dedicated AI Coach Service for ZenScore AI Overview Dashboard.
 * Inherits from secure, cached, versioned, telemetry-backed baseAIService.
 */

import { executeAIRequest, getAIMetricsSummary } from './baseAIService'

export const OVERVIEW_PROMPT_VERSION = 'v1.1'

/**
 * Generates structured AI Career Coach insights for Overview.
 *
 * @param {Object} careerContext - Live state from CareerContext
 * @param {boolean} forceRefresh - If true, bypasses cache
 * @returns {Promise<Object>} { careerSummary, todayMission, missionTime, marketInsight, nextAction, isCached, isFallback }
 */
export async function generateOverviewAIInsights(careerContext = {}, forceRefresh = false) {
  const {
    userName = 'Student',
    CGPA = '8.2',
    currentCareer = 'Backend Engineer',
    careerReadiness = 0,
    roadmapProgress = 0,
    currentRoadmapPhase = 'Phase 1: Foundations',
    completedSkills = 0,
    remainingSkills = 0,
    todayMission = { title: 'Complete Initial Orientation & Skill Assessment', time: '15 Minutes' },
    projectsBuilt = 0,
    resumeScore = 0,
    interviewReadiness = 0,
    marketMetadata = { demand: '★★★★★ Very High', salary: '₹18L – ₹30L LPA', recruiters: ['Google', 'Microsoft', 'Amazon', 'Swiggy'] }
  } = careerContext

  const subKey = `${currentCareer.replace(/\s+/g, '_')}_${roadmapProgress}_${completedSkills}`

  const prompt = `You are the personal AI Career Coach for ${userName} on ZenScore AI.
Analyze the following student profile and generate structured career coaching insights for target role "${currentCareer}":

[Student Profile]
- Name: ${userName}
- Target Career: ${currentCareer}
- Career Readiness: ${careerReadiness}%
- Roadmap Progress: ${roadmapProgress}% (${completedSkills} completed skills, ${remainingSkills} missing)
- Current Roadmap Phase: ${currentRoadmapPhase}
- Active Today Mission: ${todayMission?.title || 'Core Competency Building'}
- Verified Projects Built: ${projectsBuilt}
- Resume ATS Score: ${resumeScore ? `${resumeScore}%` : 'Not Uploaded'}
- Interview Readiness: ${interviewReadiness ? `${interviewReadiness}%` : 'Not Started'}
- Industry Demand: ${marketMetadata?.demand || 'Very High'}
- Average Salary: ${marketMetadata?.salary || '₹18–30 LPA'}

Return ONLY a valid JSON object with these exact keys:
{
  "careerSummary": "Motivational, positive, professional 40-60 word career summary tailored to ${userName}'s progress in ${currentCareer}.",
  "todayMission": "Concise single-sentence learning objective for today.",
  "missionTime": "Estimated time (e.g. '45 mins')",
  "marketInsight": "Concise hiring market insight max 45 words for ${currentCareer}.",
  "nextAction": "One clear, high-priority next recommendation."
}`

  const fallbackData = {
    careerSummary: `Welcome ${userName}! Select your target career goal and complete your initial skill assessment to build your personalized learning roadmap for ${currentCareer}.`,
    todayMission: todayMission?.title || `Complete initial ${currentCareer} orientation`,
    missionTime: todayMission?.time || '15 mins',
    marketInsight: `${currentCareer}s remain among the highest-demand engineering roles across top product companies, with average salaries around ${marketMetadata?.salary || '₹18–30 LPA'}.`,
    nextAction: `Complete Phase 1 orientation before advancing to core engineering topics.`,
  }

  const result = await executeAIRequest({
    featureKey: 'overview',
    cacheSubKey: subKey,
    promptVersion: OVERVIEW_PROMPT_VERSION,
    prompt,
    requestPayload: {
      userName,
      currentCareer,
      careerReadiness,
      roadmapProgress,
      currentRoadmapPhase,
      completedSkills,
      remainingSkills,
    },
    endpoint: '/careers/overview/ai-coaching',
    requiredFields: ['careerSummary', 'todayMission', 'marketInsight', 'nextAction'],
    fallbackData,
    forceRefresh,
  })

  return {
    ...result.data,
    isCached: result.isCached,
    isFallback: result.isFallback,
  }
}

export { getAIMetricsSummary }
