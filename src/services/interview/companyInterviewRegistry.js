/**
 * companyInterviewRegistry.js
 * Company-Specific Interview Metadata Registry for ZenScore AI (Product 6 - Sprint A).
 * Maintained for 15+ top tech, product, and consulting enterprise employers.
 */

export const COMPANY_INTERVIEW_REGISTRY = {
  Google: {
    name: 'Google',
    tier: 'MAANG',
    rounds: ['Online Assessment', 'Phone Screen', '3x Onsite Technical (DSA)', 'Googleyness & Leadership'],
    focusTopics: ['Hard Graphs', 'Dynamic Programming', 'System Design (Scale)', 'Clean Code'],
    difficulty: 'Hard',
    prepDaysNeeded: 60,
  },
  Microsoft: {
    name: 'Microsoft',
    tier: 'MAANG',
    rounds: ['Codility OA', 'Technical Round 1 (Trees & Graphs)', 'Technical Round 2 (Design & SQL)', 'AA Round (Executive)'],
    focusTopics: ['Binary Trees', 'System Design', 'OOP Principles', 'Behavioral Leadership'],
    difficulty: 'Hard',
    prepDaysNeeded: 45,
  },
  Amazon: {
    name: 'Amazon',
    tier: 'MAANG',
    rounds: ['Online Work Simulation', '2x Coding Round (DSA)', 'System Design', 'Bar Raiser Round'],
    focusTopics: ['Leadership Principles (STAR)', 'Data Structures', 'Microservices', 'AWS Basics'],
    difficulty: 'Hard',
    prepDaysNeeded: 50,
  },
  Atlassian: {
    name: 'Atlassian',
    tier: 'Tier 1 Product',
    rounds: ['Karat OA', 'Data Structures & Algorithms', 'Code Design (Craft)', 'System Design', 'Values Round'],
    focusTopics: ['Code Design & Refactoring', 'Concurrency', 'Distributed Caching', 'Atlassian Values'],
    difficulty: 'Hard',
    prepDaysNeeded: 45,
  },
  Swiggy: {
    name: 'Swiggy',
    tier: 'Unicorn Product',
    rounds: ['Machine Coding Round', 'Problem Solving & DSA', 'HLD & System Architecture', 'HR Culture Fit'],
    focusTopics: ['Machine Coding (LSD)', 'Rate Limiting', 'Low-Level Design', 'PostgreSQL'],
    difficulty: 'Hard',
    prepDaysNeeded: 30,
  },
  PhonePe: {
    name: 'PhonePe',
    tier: 'Unicorn Product',
    rounds: ['Machine Coding (2.5 Hrs)', 'Problem Solving & DSA', 'System Architecture & Database', 'Engineering Manager'],
    focusTopics: ['Concurrency & Mutex', 'Payment Gateway LLD', 'Redis Caching', 'Java 17'],
    difficulty: 'Hard',
    prepDaysNeeded: 35,
  },
  Flipkart: {
    name: 'Flipkart',
    tier: 'Tier 1 Product',
    rounds: ['Machine Coding Round', 'Problem Solving (DSA)', 'System Design (HLD)', 'HM Round'],
    focusTopics: ['Machine Coding (Clean Code)', 'Graphs & Trees', 'Distributed Queues', 'Kafka'],
    difficulty: 'Hard',
    prepDaysNeeded: 40,
  },
  TCS: {
    name: 'TCS',
    tier: 'IT Services',
    rounds: ['TCS NQT Assessment', 'Technical Interview', 'HR Round'],
    focusTopics: ['C / Java Fundamentals', 'SQL Basics', 'OOP Concepts', 'Academic Projects'],
    difficulty: 'Medium',
    prepDaysNeeded: 15,
  },
  Infosys: {
    name: 'Infosys',
    tier: 'IT Services',
    rounds: ['HackWithInfy / Infytq', 'Technical Round', 'HR Interview'],
    focusTopics: ['Java 17', 'DBMS & SQL Joins', 'Basic Data Structures', 'Communication'],
    difficulty: 'Medium',
    prepDaysNeeded: 15,
  },
  Accenture: {
    name: 'Accenture',
    tier: 'IT Services',
    rounds: ['Cognitive & Technical Assessment', 'Coding Test', 'Communication Assessment', 'Technical HR'],
    focusTopics: ['Pseudocode', 'Python / Java Basics', 'SQL Queries', 'Verbal Ability'],
    difficulty: 'Medium',
    prepDaysNeeded: 14,
  },
  Wipro: {
    name: 'Wipro',
    tier: 'IT Services',
    rounds: ['Wipro NLTH', 'Technical Interview', 'HR Interview'],
    focusTopics: ['C++ / Java Basics', 'Data Structures', 'OS Basics', 'Aptitude'],
    difficulty: 'Medium',
    prepDaysNeeded: 14,
  },
  Capgemini: {
    name: 'Capgemini',
    tier: 'IT Services',
    rounds: ['Pseudocode Round', 'English & Coding', 'Spoken English Test', 'Technical & HR'],
    focusTopics: ['Data Structures', 'OOP Basics', 'Project Walkthrough', 'Communication'],
    difficulty: 'Medium',
    prepDaysNeeded: 14,
  },
  Deloitte: {
    name: 'Deloitte',
    tier: 'Consulting',
    rounds: ['Aptitude & Technical Test', 'Case Study Round', 'Technical Interview', 'HR Round'],
    focusTopics: ['SQL & Analytics', 'Python / Java', 'Business Communication', 'Case Studies'],
    difficulty: 'Medium',
    prepDaysNeeded: 20,
  },
  PwC: {
    name: 'PwC',
    tier: 'Consulting',
    rounds: ['Technical Online Assessment', 'Technical Round 1', 'Partner Round'],
    focusTopics: ['SQL', 'Data Analytics', 'Cloud Fundamentals', 'Problem Solving'],
    difficulty: 'Medium',
    prepDaysNeeded: 20,
  },
  Cognizant: {
    name: 'Cognizant',
    tier: 'IT Services',
    rounds: ['GenC / GenC Elevate Assessment', 'Technical Interview', 'HR Round'],
    focusTopics: ['Java / Python', 'SQL Queries', 'Debugging', 'Basic DSA'],
    difficulty: 'Medium',
    prepDaysNeeded: 15,
  },
}

export function getCompanyInterviewInfo(companyName = 'Amazon') {
  return COMPANY_INTERVIEW_REGISTRY[companyName] || COMPANY_INTERVIEW_REGISTRY['Amazon']
}
