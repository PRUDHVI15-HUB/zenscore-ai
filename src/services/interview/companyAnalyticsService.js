/**
 * companyAnalyticsService.js
 * Dynamic Company Offer Prediction Helper for ZenScore AI (Phase 7 - Sprint 6).
 * Computes offer probabilities strictly from live readiness metrics.
 */

export function calculateCompanyOfferPrediction(companyName = 'Amazon', readinessPct = 0) {
  const offerProbabilityPct = readinessPct === 0 ? 0 : Math.min(95, Math.round(readinessPct * 0.9))

  return {
    company: companyName,
    readinessPct,
    offerProbabilityPct,
    expectedPackage: '₹28L - ₹42L CTC',
    priorityImprovements: readinessPct === 0
      ? ['Complete Phase 1 Roadmap for core concepts', 'Complete Coding Labs']
      : ['Practice DP 2D questions', 'Elaborate on Redis eviction strategies'],
  }
}
