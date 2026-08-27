/**
 * systemDesignService.js
 * AI System Design Studio Service for ZenScore AI Product 6 (Sprint D).
 * Extended from baseAIService with 24h caching & telemetry under 'zenscore_ai_system_design_v1.1'.
 */

import { executeAIRequest } from './baseAIService'

export const SYSTEM_DESIGN_PROMPT_VERSION = 'v1.1'

/**
 * Generates reliable fallback AI System Design data if backend LLM is unreachable.
 */
export function generateSystemDesignFallback(targetRole = 'Backend Engineer', payload = {}) {
  const { company = 'Google', designType = 'HLD', problemTitle = 'Design YouTube Video Streaming Platform' } = payload

  return {
    question: {
      title: problemTitle,
      type: designType,
      company: company,
      difficulty: 'Hard',
      requirements: {
        functional: ['Upload high-definition video files', 'Transcode to multiple bitrates (1080p, 720p, 480p)', 'Low latency global video playback'],
        nonFunctional: ['High availability (99.99%)', 'Low playback startup latency (< 200ms)', 'Scalable storage for petabytes of data'],
      },
    },
    architectureComponents: [
      { name: 'Client App & Web', layer: 'Client Layer', tech: 'React / HLS Video Player' },
      { name: 'Cloudflare CDN', layer: 'Edge Layer', tech: 'Edge Caching & Dynamic Range Requests' },
      { name: 'API Gateway & Nginx Load Balancer', layer: 'Gateway Layer', tech: 'Rate Limiting & SSL Termination' },
      { name: 'Video Ingestion Microservice', layer: 'Service Layer', tech: 'Spring Boot / Go Chunked Upload' },
      { name: 'Kafka Event Bus', layer: 'Messaging Layer', tech: 'Apache Kafka Video Event Queue' },
      { name: 'Transcoding Workers', layer: 'Compute Layer', tech: 'FFmpeg GPU Cluster Workers' },
      { name: 'AWS S3 / Cloud Storage', layer: 'Storage Layer', tech: 'Blob Storage for HLS Segments' },
      { name: 'PostgreSQL & Cassandra DB', layer: 'Database Layer', tech: 'Video Metadata & Distributed View Counts' },
      { name: 'Redis Distributed Cache', layer: 'Cache Layer', tech: 'Hot Metadata & User Auth Token Cache' },
    ],
    whiteboardExplanation: {
      flowDescription: 'Client uploads video chunks to Ingestion Service via API Gateway. Ingestion posts event to Kafka. Transcoding Workers pull from Kafka, transcode chunks into HLS .m3u8 playlists using FFmpeg, save to S3, and populate CDN.',
      scalabilityNotes: 'HLS chunking allows adaptive bitrate streaming depending on user network speed. S3 + CDN offloads 95% of bandwidth from core microservices.',
      tradeoffs: 'Consistency vs Availability: Used eventual consistency for view counters via Redis HyperLogLog to guarantee ultra-fast response times.',
    },
    designEvaluation: {
      overallDesignScore: 92,
      architectureScore: 94,
      scalabilityScore: 90,
      securityScore: 88,
      optimizationScore: 92,
      communicationScore: 90,
      recommendation: 'Strong Hire',
    },
    improvementSuggestions: [
      'Add explicit rate-limiting at API Gateway to block DDoS video upload spam.',
      'Implement Cassandra distributed counter instead of PostgreSQL single write lock for view counts.',
    ],
  }
}

/**
 * Fetches AI System Design Studio evaluation from backend API with 24h cache and fallback.
 */
export async function getAISystemDesign(targetRole = 'Backend Engineer', payload = {}) {
  const reqPayload = { targetCareer: targetRole, ...payload }
  const fallback = generateSystemDesignFallback(targetRole, payload)
  const subKey = targetRole.replace(/\s+/g, '_')

  const result = await executeAIRequest({
    featureKey: 'system_design',
    cacheSubKey: subKey,
    promptVersion: SYSTEM_DESIGN_PROMPT_VERSION,
    requestPayload: reqPayload,
    endpoint: '/careers/interview/system-design-ai',
    requiredFields: [
      'question',
      'architectureComponents',
      'whiteboardExplanation',
      'designEvaluation',
      'improvementSuggestions',
    ],
    fallbackData: fallback,
  })

  return {
    ...result.data,
    isCached: result.isCached,
    isFallback: result.isFallback,
  }
}

