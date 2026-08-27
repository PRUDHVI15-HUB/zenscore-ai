/**
 * Jobs → Student Profile Synchronizer
 * =====================================
 * Transforms data from the Jobs module (API responses / stats) into the
 * jobsSummary section of the Unified Student Profile.
 *
 * Design Principles:
 *   - FIRE AND FORGET: Never blocks UI or API calls
 *   - SILENT ERRORS:   Jobs module must always keep working
 *   - MERGE STRATEGY:  updateSection() deep-merges, never overwrites
 *   - SINGLE WRITE:    Only writes to 'jobsSummary' — nothing else
 *   - NO READS:        Jobs does not read from Student Profile
 *
 * Trigger events:
 *   ✓ Initial page load
 *   ✓ Search / filter jobs
 *   ✓ Save / remove saved job
 *   ✓ Apply to job
 *   ✓ Recommendation refresh
 *   ✓ Provider synchronization
 *   ✓ Manual refresh
 */

import { updateProfileSection } from '../studentProfileService'
import { PROFILE_SOURCES } from '../../models/StudentProfile'
import { registerAutomation, AUTOMATION_EVENTS } from '../automationEngine'

/**
 * extractJobsSummary()
 * --------------------
 * Extracts and normalizes summary information for the jobsSummary profile section.
 *
 * @param {Object} responseData - Data returned by jobs API endpoints (stats, recommendations, etc.)
 * @returns {Object} Normalized jobsSummary data payload
 */
export function extractJobsSummary(responseData = {}) {
  const data = responseData || {}
  const stats = data.stats || data

  // Applications metrics
  const totalApplications = data.totalApplications ?? stats.applicationsCount ?? stats.totalApplications ?? 0
  const appliedJobsCount = data.appliedJobsCount ?? stats.applicationsCount ?? totalApplications
  const pendingApplications = data.pendingApplications ?? 0
  const shortlistedJobs = data.shortlistedJobs ?? 0
  const interviewInvitations = data.interviewInvitations ?? stats.interviewInvitations ?? 0
  const rejectedApplications = data.rejectedApplications ?? 0

  // Saved Jobs
  const savedJobsCount = data.savedJobsCount ?? stats.savedJobsCount ?? 0
  const favoriteJobs = Array.isArray(data.favoriteJobs) ? data.favoriteJobs : []
  const recentlyViewedJobs = Array.isArray(data.recentlyViewedJobs) ? data.recentlyViewedJobs : []

  // Recommendations
  const recommendedJobsCount = data.recommendedJobsCount ?? (Array.isArray(data.jobs) ? data.jobs.length : (stats.recommendedJobsCount ?? 0))
  const bestMatchedRole = data.bestMatchedRole ?? (data.jobs && data.jobs[0]?.title) ?? stats.targetRole ?? ''
  const averageMatchScore = data.averageMatchScore ?? stats.averageMatchScore ?? 0
  const highestMatchScore = data.highestMatchScore ?? (data.jobs && data.jobs[0]?.aiMatch) ?? 0

  // Career Pipeline
  const interviewScheduled = data.interviewScheduled ?? stats.interviews ?? 0
  const offersReceived = data.offersReceived ?? stats.offers ?? 0
  const offerAccepted = data.offerAccepted ?? false
  const placementStatus = data.placementStatus ?? (totalApplications > 0 ? 'Active Candidate' : 'Exploring Opportunities')

  // Activity
  const lastAppliedJob = data.lastAppliedJob ?? null
  const lastJobActivity = data.lastJobActivity ?? new Date().toISOString()
  const latestApplicationDate = data.latestApplicationDate ?? null

  // Analytics
  const applicationSuccessRate = data.applicationSuccessRate ?? (totalApplications > 0 ? Math.round((offersReceived / totalApplications) * 100) : 0)
  const interviewConversionRate = data.interviewConversionRate ?? (interviewScheduled > 0 ? Math.round((offersReceived / interviewScheduled) * 100) : 0)
  const averageApplicationScore = data.averageApplicationScore ?? (stats.averageMatchScore ?? 0)

  // Provider Statistics
  const providerCoverage = data.providerCoverage ?? 'Adzuna, Jooble, Greenhouse'
  const adzunaJobs = data.adzunaJobs ?? stats.totalJobs ?? 0
  const joobleJobs = data.joobleJobs ?? 0
  const greenhouseJobs = data.greenhouseJobs ?? 0

  // Market Snapshot
  const preferredLocation = data.preferredLocation ?? ''
  const preferredWorkMode = data.preferredWorkMode ?? ''
  const preferredSalaryRange = data.preferredSalaryRange ?? ''

  return {
    totalApplications,
    appliedJobsCount,
    pendingApplications,
    shortlistedJobs,
    interviewInvitations,
    rejectedApplications,

    savedJobsCount,
    favoriteJobs,
    recentlyViewedJobs,

    recommendedJobsCount,
    bestMatchedRole,
    averageMatchScore,
    highestMatchScore,

    interviewScheduled,
    offersReceived,
    offerAccepted,
    placementStatus,

    lastAppliedJob,
    lastJobActivity,
    latestApplicationDate,

    applicationSuccessRate,
    interviewConversionRate,
    averageApplicationScore,

    providerCoverage,
    adzunaJobs,
    joobleJobs,
    greenhouseJobs,

    preferredLocation,
    preferredWorkMode,
    preferredSalaryRange,
  }
}

/**
 * syncJobsToProfile()
 * -------------------
 * Fire-and-forget synchronization into StudentProfile for jobsSummary.
 *
 * @param {Object} jobResponses - API response or aggregated job data
 */
export function syncJobsToProfile(jobResponses = {}) {
  try {
    const payload = extractJobsSummary(jobResponses)
    updateProfileSection('jobsSummary', payload, PROFILE_SOURCES.JOBS)
      .then(() => {
        registerAutomation(AUTOMATION_EVENTS.JOB_APPLIED, payload)
        console.info('[JobsProfileSync] Synchronized jobsSummary to Student Profile (status: live)')
      })
      .catch((err) => {
        console.info('[JobsProfileSync] Silent background sync notice:', err?.message || err)
      })
  } catch (err) {
    console.info('[JobsProfileSync] Non-blocking sync exception caught:', err?.message || err)
  }
}
