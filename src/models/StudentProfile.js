/**
 * StudentProfile — Canonical Shape Definition
 * ============================================
 * SINGLE SOURCE OF TRUTH schema for the entire ZenScore AI platform.
 *
 * Architecture v1.1.0 — Section Metadata Envelope
 * ─────────────────────────────────────────────────
 * Every section is wrapped in a standard metadata envelope:
 *
 *   {
 *     status:      'pending' | 'live' | 'stale'
 *     source:      null | 'Academics' | 'Careers' | 'Skills' | ...
 *     lastUpdated: null | ISO timestamp string
 *     version:     1 (increments on every write)
 *     data:        { ...actual section payload }
 *   }
 *
 * Why?
 *   - Know whether a section has EVER been synchronized
 *   - Know WHICH module last wrote the data
 *   - Know WHEN the data was last refreshed
 *   - Detect STALE data (e.g., "Skills not updated in 3 weeks")
 *   - Enable AI Tutor to give time-aware insights
 *
 * Module write example:
 *   academicSummary = {
 *     status:      'live',
 *     source:      'Academics',
 *     lastUpdated: '2026-08-06T10:30:00.000Z',
 *     version:     3,
 *     data:        { currentCGPA: 8.54, totalCredits: 82 }
 *   }
 *
 * IMPORTANT:
 *   This file defines shape only.
 *   No business logic. No calculations. No AI.
 */

// ─────────────────────────────────────────────────────────────
// ENVELOPE FACTORY
// Creates the standard metadata wrapper for any section
// ─────────────────────────────────────────────────────────────

/**
 * Creates a section envelope with standard metadata + data payload.
 * @param {Object} defaultData - The default data fields for this section
 * @returns {SectionEnvelope}
 */
export function createSectionEnvelope(defaultData = {}) {
  return {
    status:      'pending',   // 'pending' | 'live' | 'stale'
    source:      null,        // Which module last wrote this section
    lastUpdated: null,        // ISO timestamp of last write
    version:     1,           // Increments on every write from a module
    data:        { ...defaultData },
  }
}

// ─────────────────────────────────────────────────────────────
// SECTION DATA DEFAULTS
// Raw payload fields for each section (no metadata here)
// ─────────────────────────────────────────────────────────────

export const DEFAULT_BASIC_PROFILE_DATA = {
  userId:             null,
  name:               null,
  email:              null,
  college:            null,
  degree:             null,
  branch:             null,
  currentSemester:    null,
  graduationYear:     null,
  avatarUrl:          null,
  profileCompletePct: 0,
}

export const DEFAULT_ACADEMIC_SUMMARY_DATA = {
  currentCGPA:        null,
  targetCGPA:         null,
  predictedCGPA:      null,
  totalCredits:       null,
  completedSemesters: 0,
  academicHealth:     null,   // 'Excellent' | 'Good' | 'At Risk' | null
  uploadedMemos:      [],
  semesterHistory:    [],
}

export const DEFAULT_CAREER_PROFILE_DATA = {
  selectedCareerGoal:  null,
  experienceLevel:     null,   // 'Beginner' | 'Intermediate' | 'Advanced' | null
  dreamCompanies:      [],
  preferredLocations:  [],
  preferredJobType:    null,   // 'Full-time' | 'Internship' | 'Remote' | null
  onboardingCompleted: false,
}

export const DEFAULT_SKILLS_SUMMARY_DATA = {
  learnedSkills:    [],     // [{ name, level, verifiedAt }]
  skillLevels:      {},     // { 'React': 'Intermediate', ... }
  skillProgress:    {},     // { 'React': 75, ... }  (0–100)
  skillGapSummary:  null,   // human-readable summary string
  totalVerified:    0,
  targetSkillCount: 0,
}

export const DEFAULT_COURSES_SUMMARY_DATA = {
  completedCourses:   [],   // [{ id, title, completedAt, certificateUrl }]
  activeCourses:      [],   // [{ id, title, progress, enrolledAt }]
  certificates:       [],
  totalLearningHours: 0,
  learningProgress:   0,    // 0–100
}

export const DEFAULT_JOBS_SUMMARY_DATA = {
  savedJobs:    [],   // [{ jobId, title, company, savedAt }]
  appliedJobs:  [],   // [{ jobId, title, company, appliedAt, status }]
  interviews:   [],   // [{ jobId, date, type, outcome }]
  offers:       [],
  rejections:   [],
  savedCount:   0,
  appliedCount: 0,
  offersCount:  0,
}

export const DEFAULT_PRODUCTIVITY_SUMMARY_DATA = {
  dailyGoals:       [],
  studyHoursToday:  0,
  studyHoursWeek:   0,
  completedTasks:   0,
  pendingTasks:     0,
  currentStreak:    0,   // days
  longestStreak:    0,
  calendarProgress: 0,   // 0–100
}

export const DEFAULT_AI_SUMMARY_DATA = {
  // Reserved — populated by AI Tutor in future integration
  lastInsight:         null,
  careerInsight:       null,
  academicInsight:     null,
  studyPlanSuggestion: null,
  generatedAt:         null,
}

// ─────────────────────────────────────────────────────────────
// FULL STUDENT PROFILE SHAPE
// Each section is wrapped in createSectionEnvelope()
// ─────────────────────────────────────────────────────────────

export function createEmptyStudentProfile() {
  return {
    // Profile-level metadata (not per-section)
    _meta: {
      version:         '1.1.0',
      createdAt:       null,
      updatedAt:       null,
      lastRefreshedAt: null,
    },

    // ── SECTIONS (each carries its own status/source/lastUpdated/version/data) ──
    basicProfile:        createSectionEnvelope(DEFAULT_BASIC_PROFILE_DATA),
    academicSummary:     createSectionEnvelope(DEFAULT_ACADEMIC_SUMMARY_DATA),
    careerProfile:       createSectionEnvelope(DEFAULT_CAREER_PROFILE_DATA),
    skillsSummary:       createSectionEnvelope(DEFAULT_SKILLS_SUMMARY_DATA),
    coursesSummary:      createSectionEnvelope(DEFAULT_COURSES_SUMMARY_DATA),
    jobsSummary:         createSectionEnvelope(DEFAULT_JOBS_SUMMARY_DATA),
    productivitySummary: createSectionEnvelope(DEFAULT_PRODUCTIVITY_SUMMARY_DATA),
    aiSummary:           createSectionEnvelope(DEFAULT_AI_SUMMARY_DATA),
  }
}

// ─────────────────────────────────────────────────────────────
// VALID SECTION NAMES
// Used for validation in the service layer
// ─────────────────────────────────────────────────────────────

export const PROFILE_SECTIONS = [
  'basicProfile',
  'academicSummary',
  'careerProfile',
  'skillsSummary',
  'coursesSummary',
  'jobsSummary',
  'productivitySummary',
  'aiSummary',
]

// ─────────────────────────────────────────────────────────────
// SOURCE NAMES
// Canonical source identifiers for each module
// ─────────────────────────────────────────────────────────────

export const PROFILE_SOURCES = {
  AUTH:         'Auth',
  ACADEMICS:    'Academics',
  CAREERS:      'Careers',
  SKILLS:       'Skills',
  COURSES:      'Courses',
  JOBS:         'Jobs',
  PRODUCTIVITY: 'Productivity',
  AI_TUTOR:     'AI Tutor',
  PROFILE:      'Profile',
  SYSTEM:       'System',
}

// ─────────────────────────────────────────────────────────────
// SECTION STATUS VALUES
// ─────────────────────────────────────────────────────────────

export const SECTION_STATUS = {
  PENDING: 'pending',   // Never written by its module
  LIVE:    'live',      // Actively being updated
  STALE:   'stale',     // Was live but hasn't been updated recently
}

// ─────────────────────────────────────────────────────────────
// TYPE DOCUMENTATION (JSDoc — future TypeScript migration)
// ─────────────────────────────────────────────────────────────

/**
 * @typedef {Object} SectionEnvelope
 * @property {'pending'|'live'|'stale'} status   - Integration status
 * @property {string|null} source                 - Module that wrote this
 * @property {string|null} lastUpdated            - ISO timestamp of last write
 * @property {number} version                     - Write counter
 * @property {Object} data                        - Actual section payload
 */

/**
 * @typedef {Object} StudentProfile
 * @property {Object} _meta                       - Profile-level metadata
 * @property {SectionEnvelope} basicProfile       - User identity
 * @property {SectionEnvelope} academicSummary    - CGPA, credits, semesters
 * @property {SectionEnvelope} careerProfile      - Career goal, preferences
 * @property {SectionEnvelope} skillsSummary      - Verified skills, gaps
 * @property {SectionEnvelope} coursesSummary     - Courses, certificates
 * @property {SectionEnvelope} jobsSummary        - Applications, offers
 * @property {SectionEnvelope} productivitySummary - Goals, streaks
 * @property {SectionEnvelope} aiSummary          - AI-generated insights
 */
