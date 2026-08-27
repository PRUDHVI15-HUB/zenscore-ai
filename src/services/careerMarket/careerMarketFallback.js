/**
 * careerMarketFallback.js
 * Verified Fallback Generator for Career Market Intelligence.
 * Ensures zero React crashes if AI backend is unavailable or rate limited.
 */

import { CAREER_MARKET_METADATA_DATABASE, DEFAULT_MARKET_METADATA } from './careerMarketMetadata'

export function generateCareerMarketFallback(careerTitle = 'Backend Engineer') {
  const meta = CAREER_MARKET_METADATA_DATABASE[careerTitle] || DEFAULT_MARKET_METADATA

  return {
    careerTitle,
    marketDemand: {
      level: meta.demandLevel || '★★★★★ Very High',
      openPositions: meta.openPositions || '40,000+ Jobs',
      hiringTrend: meta.hiringTrend || '📈 Rising (+24% YoY)',
    },
    salaryProgression: meta.salaryProgression || {
      fresher: '₹8 – ₹14 LPA',
      exp1to3: '₹15 – ₹22 LPA',
      exp3to5: '₹24 – ₹35 LPA',
      senior: '₹35 – ₹55 LPA',
      architect: '₹60L+ LPA',
    },
    topRecruiters: meta.topRecruiters || [
      { name: 'Google', status: 'High Hiring', focus: 'DSA + LLD + System Design', salary: '₹28 – ₹45 LPA' },
      { name: 'Microsoft', status: 'Hiring', focus: 'System Architecture & Core Engineering', salary: '₹24 – ₹40 LPA' },
      { name: 'Amazon', status: 'High Hiring', focus: 'Cloud Microservices & High Concurrency', salary: '₹26 – ₹42 LPA' },
      { name: 'Swiggy', status: 'Hiring', focus: 'Backend Systems & Distributed Databases', salary: '₹20 – ₹32 LPA' },
    ],
    techStack: meta.techStack || ['Java', 'Spring Boot', 'REST APIs', 'SQL', 'Docker', 'Redis', 'Kafka', 'AWS', 'System Design', 'Git'],
    certifications: meta.certifications || [
      { name: 'AWS Certified Developer Associate', difficulty: 'Medium', value: 'Very High', duration: '1.5 Months' },
      { name: 'Oracle Certified Professional Java SE', difficulty: 'Hard', value: 'High', duration: '2 Months' },
      { name: 'Docker Certified Associate', difficulty: 'Medium', value: 'High', duration: '1 Month' },
    ],
    interviewProcess: meta.interviewProcess || [
      { step: 1, title: 'Online Assessment', desc: '90 Min Coding + CS Fundamentals' },
      { step: 2, title: 'DSA Round 1 & 2', desc: 'Data Structures & Algorithmic Optimization' },
      { step: 3, title: 'Low Level Design (LLD)', desc: 'OOP Design Patterns & Schema Architecture' },
      { step: 4, title: 'High Level Design (HLD)', desc: 'Scalability, Load Balancers & Caching' },
      { step: 5, title: 'Hiring Manager & HR', desc: 'Behavioral & Culture Fit' },
    ],
    futureOutlook: meta.futureOutlook || {
      futureDemand: '▲ +27%',
      automationRisk: 'Low',
      remotePct: '88%',
      globalDemand: 'Excellent',
      stability: '★★★★★',
    },
    industryNews: meta.industryNews || [
      `Top product companies expanding hiring for ${careerTitle} roles in India & remotely.`,
      `Microservices and cloud infrastructure skills seeing 30% surge in recruiter interest.`,
      `Product unicorns offering premium compensation packages for verified engineering skills.`,
      `Remote global tech companies actively hiring senior engineering talent.`,
      `Framework performance optimizations driving new hiring initiatives across startups.`,
    ],
  }
}
