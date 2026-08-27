/**
 * Onboarding step configurations matching the exact 9-screen reference hierarchy
 */

export const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    stepNumber: 1,
    stepIndex: null,
    moduleName: null,
    title: 'Welcome to',
    titleHighlight: 'ZenScore AI',
    subtitle: 'Your journey from\nstudent to career-ready.',
    description:
      'ZenScore AI brings your academics, career goals, skills, learning, job opportunities, productivity, and AI assistance together in one personalized journey.',
    ctaText: 'See How ZenScore AI Works →',
    subText: 'This takes less than a minute.',
    screenId: 'dashboard',
    activeNav: 'dashboard'
  },
  {
    id: 'academics',
    stepNumber: 2,
    stepIndex: '01',
    moduleName: 'Academics',
    subtitle: 'Understand where\nyou are.',
    description:
      'Connect your academic information and understand your subjects, performance, strengths, and areas that need attention.',
    resultTitle: 'A clearer picture of your academic profile.',
    resultIcon: 'chart',
    ctaText: 'Next →',
    screenId: 'academics',
    activeNav: 'academics'
  },
  {
    id: 'career',
    stepNumber: 3,
    stepIndex: '02',
    moduleName: 'Career',
    subtitle: 'Decide where you\nwant to go.',
    description:
      'Explore career paths and choose a target career that matches your interests and goals.',
    resultTitle: 'A clear career direction.',
    resultIcon: 'compass',
    ctaText: 'Next →',
    screenId: 'career',
    activeNav: 'career'
  },
  {
    id: 'skills',
    stepNumber: 4,
    stepIndex: '03',
    moduleName: 'Skills',
    subtitle: 'Discover what you\nneed to learn.',
    description:
      'Compare your current skills with the skills required for your target career.',
    resultTitle: 'A personalized skill roadmap.',
    resultIcon: 'lightbulb',
    ctaText: 'Next →',
    screenId: 'skills',
    activeNav: 'skills'
  },
  {
    id: 'courses',
    stepNumber: 5,
    stepIndex: '04',
    moduleName: 'Courses',
    subtitle: "Learn what\nyou're missing.",
    description:
      'Follow structured courses with lessons, assessments, coding practice, and projects to build the skills you need.',
    resultTitle: 'Demonstrable learning progress.',
    resultIcon: 'gradCap',
    ctaText: 'Next →',
    screenId: 'courses',
    activeNav: 'courses'
  },
  {
    id: 'jobs',
    stepNumber: 6,
    stepIndex: '05',
    moduleName: 'Jobs',
    subtitle: 'Discover\nopportunities.',
    description:
      'Explore jobs based on your career goal, skills, preferences, and readiness.',
    resultTitle: 'More relevant opportunities.',
    resultIcon: 'briefcase',
    ctaText: 'Next →',
    screenId: 'jobs',
    activeNav: 'jobs'
  },
  {
    id: 'productivity',
    stepNumber: 7,
    stepIndex: '06',
    moduleName: 'Productivity',
    subtitle: 'Stay consistent.',
    description:
      'Track your learning sessions, goals, and progress so you can keep moving forward.',
    resultTitle: 'Consistent progress toward your goal.',
    resultIcon: 'trending',
    ctaText: 'Next →',
    screenId: 'productivity',
    activeNav: 'productivity'
  },
  {
    id: 'ai-tutor',
    stepNumber: 8,
    stepIndex: '07',
    moduleName: 'AI Tutor',
    subtitle: 'Get help whenever\nyou need it.',
    description:
      'Ask questions, understand difficult concepts, and receive contextual guidance throughout your learning journey.',
    resultTitle: 'An AI learning companion that understands your journey.',
    resultIcon: 'bot',
    ctaText: 'Next →',
    screenId: 'aiTutor',
    activeNav: 'aiTutor'
  },
  {
    id: 'journey',
    stepNumber: 9,
    stepIndex: null,
    moduleName: null,
    title: 'Your Journey Starts',
    titleHighlight: 'Here',
    subtitle: 'Everything you need to move from student to career-ready.',
    ctaText: 'Enter ZenScore AI →',
    subText: "Let's build your career-ready future!",
    screenId: 'journey',
    activeNav: null
  }
]
