/**
 * interviewRegistry.js
 * Centralized Interview Topics & Categories Registry for ZenScore AI (Product 6 - Sprint A).
 * Defines categories, DSA topics, Core CS topics, and interview mapping schemas.
 */

export const INTERVIEW_CATEGORIES = {
  TECHNICAL: 'Technical Interview',
  HR: 'HR & Cultural Fit',
  BEHAVIORAL: 'Behavioral & Leadership',
  RESUME: 'Resume & Project Deep-Dive',
  CODING: 'DSA & Live Coding',
  SYSTEM_DESIGN: 'System Design & Architecture',
  DATABASE: 'DBMS & SQL Querying',
  NETWORKING: 'Computer Networks & Protocols',
  CLOUD: 'Cloud Services & AWS',
  DEVOPS: 'DevOps, Docker & CI/CD',
}

export const DSA_TOPICS = [
  'Arrays & Hashing',
  'Two Pointers & Sliding Window',
  'Linked Lists',
  'Stacks & Queues',
  'Binary Trees & Binary Search Trees',
  'Graphs & Graph Traversals (BFS/DFS)',
  'Dynamic Programming (1D & 2D)',
  'Greedy Algorithms',
  'Backtracking',
]

export const CORE_CS_TOPICS = [
  'Operating Systems & Process Management',
  'DBMS, Normalization & Indexing',
  'Computer Networks & TCP/IP Stack',
  'Object-Oriented Programming (OOP) & SOLID',
  'Java 17 Concurrency & Memory Model',
  'SQL Query Optimization',
  'System Design & Microservices',
]

export function getInterviewTopicDictionary() {
  return {
    categories: INTERVIEW_CATEGORIES,
    dsaTopics: DSA_TOPICS,
    coreCsTopics: CORE_CS_TOPICS,
  }
}
