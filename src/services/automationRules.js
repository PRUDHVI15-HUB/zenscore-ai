/**
 * Automation Rules Registry
 * =========================
 * Pure declarative map of EVENT -> ACTION(S) for the ZenScore AI Automation Engine.
 * Defines cross-module automation triggers without embedded business logic.
 */

export const AUTOMATION_EVENTS = {
  // Academics
  CGPA_UPDATED: 'CGPA_UPDATED',
  SEMESTER_COMPLETED: 'SEMESTER_COMPLETED',

  // Careers
  CAREER_GOAL_CHANGED: 'CAREER_GOAL_CHANGED',
  ROADMAP_PHASE_COMPLETED: 'ROADMAP_PHASE_COMPLETED',

  // Skills
  SKILL_COMPLETED: 'SKILL_COMPLETED',
  ASSESSMENT_COMPLETED: 'ASSESSMENT_COMPLETED',

  // Courses
  COURSE_COMPLETED: 'COURSE_COMPLETED',

  // Jobs
  JOB_APPLIED: 'JOB_APPLIED',
  INTERVIEW_INVITATION_RECEIVED: 'INTERVIEW_INVITATION_RECEIVED',

  // Productivity
  FOCUS_SESSION_COMPLETED: 'FOCUS_SESSION_COMPLETED',
  STREAK_INCREASED: 'STREAK_INCREASED',

  // AI Tutor
  AI_ACTION_COMPLETED: 'AI_ACTION_COMPLETED',
}

export const AUTOMATION_RULES = {
  [AUTOMATION_EVENTS.CGPA_UPDATED]: [
    { targetModule: 'Careers', actionType: 'REFRESH_CAREER_READINESS' },
    { targetModule: 'Dashboard', actionType: 'REFRESH_DASHBOARD' },
    { targetModule: 'AITutor', actionType: 'UPDATE_AI_CONTEXT' },
  ],
  [AUTOMATION_EVENTS.SEMESTER_COMPLETED]: [
    { targetModule: 'Courses', actionType: 'REFRESH_COURSES_RECOMMENDATIONS' },
    { targetModule: 'Skills', actionType: 'REFRESH_SKILLS_RECOMMENDATIONS' },
    { targetModule: 'Jobs', actionType: 'REFRESH_JOBS_RECOMMENDATIONS' },
  ],
  [AUTOMATION_EVENTS.CAREER_GOAL_CHANGED]: [
    { targetModule: 'Skills', actionType: 'REFRESH_SKILLS_ROADMAP' },
    { targetModule: 'Courses', actionType: 'REFRESH_COURSES_ROADMAP' },
    { targetModule: 'Jobs', actionType: 'REFRESH_JOBS_RECOMMENDATIONS' },
    { targetModule: 'AITutor', actionType: 'UPDATE_AI_CONTEXT' },
    { targetModule: 'Dashboard', actionType: 'REFRESH_DASHBOARD' },
  ],
  [AUTOMATION_EVENTS.ROADMAP_PHASE_COMPLETED]: [
    { targetModule: 'Careers', actionType: 'UNLOCK_NEXT_PHASE' },
    { targetModule: 'Skills', actionType: 'REFRESH_SKILLS' },
    { targetModule: 'Courses', actionType: 'REFRESH_COURSES' },
  ],
  [AUTOMATION_EVENTS.SKILL_COMPLETED]: [
    { targetModule: 'Careers', actionType: 'REFRESH_CAREER_READINESS' },
    { targetModule: 'Jobs', actionType: 'REFRESH_JOBS_RECOMMENDATIONS' },
    { targetModule: 'Dashboard', actionType: 'REFRESH_DASHBOARD' },
  ],
  [AUTOMATION_EVENTS.ASSESSMENT_COMPLETED]: [
    { targetModule: 'Skills', actionType: 'UPDATE_VERIFIED_SKILLS' },
    { targetModule: 'Careers', actionType: 'REFRESH_ATS_SCORE' },
    { targetModule: 'Careers', actionType: 'REFRESH_CAREER_DASHBOARD' },
  ],
  [AUTOMATION_EVENTS.COURSE_COMPLETED]: [
    { targetModule: 'Courses', actionType: 'AWARD_CERTIFICATE' },
    { targetModule: 'Skills', actionType: 'UPDATE_SKILLS_PROGRESS' },
    { targetModule: 'Careers', actionType: 'REFRESH_CAREER_PROGRESS' },
  ],
  [AUTOMATION_EVENTS.JOB_APPLIED]: [
    { targetModule: 'Dashboard', actionType: 'REFRESH_DASHBOARD' },
    { targetModule: 'Careers', actionType: 'REFRESH_CAREER_PROGRESS' },
    { targetModule: 'AITutor', actionType: 'RECORD_JOB_APPLICATION' },
  ],
  [AUTOMATION_EVENTS.INTERVIEW_INVITATION_RECEIVED]: [
    { targetModule: 'Careers', actionType: 'GENERATE_INTERVIEW_PREP' },
    { targetModule: 'Productivity', actionType: 'CREATE_STUDY_SCHEDULE' },
    { targetModule: 'Dashboard', actionType: 'NOTIFY_DASHBOARD' },
  ],
  [AUTOMATION_EVENTS.FOCUS_SESSION_COMPLETED]: [
    { targetModule: 'Productivity', actionType: 'UPDATE_PRODUCTIVITY_SCORE' },
    { targetModule: 'Dashboard', actionType: 'REFRESH_DASHBOARD' },
    { targetModule: 'AITutor', actionType: 'ADAPT_AI_RECOMMENDATIONS' },
  ],
  [AUTOMATION_EVENTS.STREAK_INCREASED]: [
    { targetModule: 'Productivity', actionType: 'UNLOCK_ACHIEVEMENT' },
    { targetModule: 'Dashboard', actionType: 'REFRESH_DASHBOARD' },
  ],
  [AUTOMATION_EVENTS.AI_ACTION_COMPLETED]: [
    { targetModule: 'System', actionType: 'REFRESH_AFFECTED_MODULE' },
    { targetModule: 'StudentProfile', actionType: 'REFRESH_STUDENT_PROFILE' },
    { targetModule: 'AITutor', actionType: 'REFRESH_AI_MEMORY' },
  ],
}
