/**
 * Production Skill Normalizer & Dynamic Curriculum Engine
 * Normalizes backend API responses from /api/skills/:skillId into a consistent,
 * strictly-typed skill workspace structure for SkillDetail and LessonViewer.
 * Generates domain-aware lessons and practical exercises for any engineering skill.
 */

function isObjectId(val) {
  if (!val) return false
  const str = val.toString()
  return /^[0-9a-fA-F]{24}$/.test(str) || /^sk_[0-9a-fA-F]{24}$/.test(str)
}

function cleanTitle(rawTitle, fallbackSlug = '') {
  if (!rawTitle || isObjectId(rawTitle)) {
    if (fallbackSlug && !isObjectId(fallbackSlug)) {
      return fallbackSlug
        .replace(/^sk_/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
    }
    return 'Engineering Skill'
  }
  return rawTitle.toString().replace(/^sk_/, '').replace(/[-_]/g, ' ')
}

/**
 * Generates high-yield domain specific lessons for any engineering skill
 */
function generateDomainLessons(skillName, skillId) {
  const name = cleanTitle(skillName, skillId)
  const lower = name.toLowerCase()

  let codeLang = 'javascript'
  let sampleSnippet = `// 1. Core Architecture Pattern for ${name}\nfunction init${name.replace(/[^a-zA-Z0-9]/g, '')}() {\n  console.log('⚡ Initializing production ${name} service');\n  return { status: 'healthy', timestamp: Date.now() };\n}\n\nconst service = init${name.replace(/[^a-zA-Z0-9]/g, '')}();\nconsole.log(service);`

  if (lower.includes('python') || lower.includes('ai') || lower.includes('machine learning') || lower.includes('data') || lower.includes('fastapi') || lower.includes('django') || lower.includes('pytorch')) {
    codeLang = 'python'
    sampleSnippet = `# 1. Production Implementation for ${name}\nfrom typing import Dict, Any\nimport time\n\ndef execute_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_pipeline(config: Dict[str, Any]) -> Dict[str, Any]:\n    """Execute high-performance ${name} pipeline."""\n    print(f"🚀 Executing {config.get('task', 'main')} task...")\n    return {"status": "success", "latency_ms": 14.2, "timestamp": time.time()}\n\nresult = execute_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_pipeline({"task": "data_process"})\nprint(result)`
  } else if (lower.includes('sql') || lower.includes('database') || lower.includes('postgres') || lower.includes('mongo')) {
    codeLang = 'sql'
    sampleSnippet = `-- 1. Optimized Query for ${name}\nSELECT \n  e.id,\n  e.name,\n  COUNT(t.id) AS total_tasks,\n  AVG(t.score) AS average_metric\nFROM ${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_records e\nLEFT JOIN task_evaluations t ON e.id = t.record_id\nWHERE e.is_active = TRUE\nGROUP BY e.id, e.name\nHAVING AVG(t.score) >= 80.0\nORDER BY average_metric DESC\nLIMIT 25;`
  } else if (lower.includes('docker') || lower.includes('kubernetes') || lower.includes('linux') || lower.includes('devops') || lower.includes('cloud') || lower.includes('bash') || lower.includes('ci/cd')) {
    codeLang = 'bash'
    sampleSnippet = `#!/usr/bin/env bash\n# Production deployment script for ${name}\nset -euo pipefail\n\necho "📦 Packaging ${name} container image..."\nVERSION="v1.4.0"\nIMAGE_NAME="zenscore/${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}:$VERSION"\n\necho "Running health checks on $IMAGE_NAME..."\necho "✓ Health check passed with 0 errors"`
  }

  const lessonTemplates = [
    {
      num: 1,
      title: `${name} Architecture & Core Foundations`,
      desc: `Understand the fundamental architecture, operational lifecycle, and core mental models behind ${name}.`,
      objectives: [`Understand why ${name} is used in modern production systems`, `Master core terminology and architectural workflow`, `Set up and verify a clean local environment`],
      syntax: `// Import & initialize ${name}\nconst ${name.replace(/[^a-zA-Z0-9]/g, '')} = require('./${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}');`,
      question: `What is the primary architectural purpose of ${name}?`,
      options: [`Providing scalable, predictable engineering execution`, `Replacing all hardware layers`, `Manual code formatting only`, `Deprecated legacy functionality`],
      correctAnswer: 0,
      explanation: `${name} is designed to provide high-throughput, predictable execution across scalable software architectures.`
    },
    {
      num: 2,
      title: `${name} Data Flow, State & API Patterns`,
      desc: `Explore data pipelines, structured state handling, and communication interfaces for ${name}.`,
      objectives: [`Implement robust data transformation flows`, `Prevent race conditions and memory leaks`, `Construct type-safe interface contracts`],
      syntax: `// Configure data handlers\nconst config = { mode: 'production', timeout: 5000 };`,
      question: `Which strategy best prevents performance bottlenecks in ${name}?`,
      options: [`Asynchronous non-blocking workflows and proper caching`, `Running all operations sequentially in memory`, `Disabling all error logging`, `Hardcoding credentials`],
      correctAnswer: 0,
      explanation: `Asynchronous pipelines and caching reduce latency and protect CPU cores from thread starvation.`
    },
    {
      num: 3,
      title: `Hands-On Practical Implementation with ${name}`,
      desc: `Build a production-grade functional component incorporating standard industry patterns for ${name}.`,
      objectives: [`Build an end-to-end working module`, `Structure files according to clean architecture rules`, `Implement real-time error handling`],
      syntax: sampleSnippet,
      question: `How should production errors be managed within ${name}?`,
      options: [`Structured try/catch blocks with logged error telemetry`, `Silently suppressing all thrown exceptions`, `Terminating the server process immediately`, `Ignoring input validation`],
      correctAnswer: 0,
      explanation: `Structured error handling combined with telemetry gives instant observability without crashing critical processes.`
    },
    {
      num: 4,
      title: `Performance Tuning & Memory Optimization in ${name}`,
      desc: `Profile latency, identify memory leaks, and optimize computational complexity in ${name}.`,
      objectives: [`Analyze runtime execution bottlenecks`, `Optimize algorithm time and space complexity`, `Implement multi-tier caching`],
      syntax: `// Benchmark latency\nconst start = performance.now();\n// execution logic\nconsole.log('Elapsed:', performance.now() - start);`,
      question: `What is the best way to profile performance in ${name}?`,
      options: [`Using dedicated benchmarking tools and execution metrics`, `Guessing based on file size`, `Removing all comments`, `Increasing system fan speed`],
      correctAnswer: 0,
      explanation: `Empirical profiling and telemetry instrumentation pinpoint true algorithmic and I/O bottlenecks.`
    },
    {
      num: 5,
      title: `Security Best Practices & OWASP Hardening for ${name}`,
      desc: `Defend against injection attacks, sanitize untrusted inputs, and secure secrets in ${name}.`,
      objectives: [`Sanitize untrusted external inputs`, `Implement least-privilege security roles`, `Protect environment variables and API tokens`],
      syntax: `// Secure configuration\nconst token = process.env.API_SECRET_KEY;`,
      question: `Why must secrets never be hardcoded into ${name} source code?`,
      options: [`Hardcoded secrets are exposed in version control and client builds`, `They make code files too heavy`, `Compilers will refuse to run`, `It prevents dark mode from working`],
      correctAnswer: 0,
      explanation: `Hardcoded secrets in repositories allow malicious actors to compromise databases and cloud infrastructure.`
    },
    {
      num: 6,
      title: `Production Deployment, Testing & Verification for ${name}`,
      desc: `Package, write automated unit tests, and deploy your ${name} solution with confidence.`,
      objectives: [`Write automated test suites`, `Configure automated CI/CD pipeline triggers`, `Achieve verified competency certification`],
      syntax: `// Run verification test suite\nnpm test -- --coverage`,
      question: `What constitutes a production-ready ${name} deployment?`,
      options: [`Passing test suite, automated health checks, and active monitoring`, `Deploying uncommitted local files without testing`, `Running on a single local laptop`, `Disabling all firewall rules`],
      correctAnswer: 0,
      explanation: `Automated test suites and telemetry monitoring ensure continuous reliability and zero downtime in production.`
    }
  ]

  return lessonTemplates.map((t) => ({
    id: `${skillId}-les-${t.num}`,
    lessonNumber: t.num,
    title: t.title,
    description: t.desc,
    duration: '25 mins',
    estimatedMinutes: 25,
    learningObjectives: t.objectives,
    introduction: `Welcome to Lesson ${t.num} of ${name}. In this chapter, we explore production patterns and architectural workflows essential for top-tier software engineering teams.`,
    deepDiveSections: [
      {
        title: `1. Understanding ${name} in Production`,
        content: `${name} is critical for robust, scalable applications. By mastering its core abstractions, you will be able to build high-performance services that adhere to modern engineering best practices.`
      },
      {
        title: `2. Architectural Patterns & Implementation`,
        content: `When designing systems using ${name}, always ensure strict separation of concerns, modular interfaces, and declarative data flows to maximize maintainability.`
      }
    ],
    syntax: t.syntax,
    codeExamples: [
      {
        title: `Production ${name} Implementation`,
        language: codeLang,
        code: sampleSnippet,
        explanation: `This code illustrates the standard design pattern used in high-throughput production environments.`
      }
    ],
    commonMistakes: [
      `Neglecting input validation and edge cases`,
      `Failing to clean up event listeners or database connections`
    ],
    bestPractices: [
      `Maintain clean, modular separation of concerns`,
      `Write unit tests with comprehensive branch coverage`
    ],
    summary: `You have mastered the core concepts of Lesson ${t.num}. Next, complete the assessment quiz and verify your knowledge with the practical task.`,
    assessment: {
      id: `quiz-${skillId}-${t.num}`,
      questions: [
        {
          id: `q1-${t.num}`,
          question: t.question,
          options: t.options,
          correctAnswer: t.correctAnswer,
          explanation: t.explanation
        },
        {
          id: `q2-${t.num}`,
          question: `In modern engineering teams, how is ${name} integrated into the development lifecycle?`,
          options: [`Through automated CI/CD pipelines and code review standards`, `Manual copy-pasting to production servers`, `Unchecked manual updates`, `Without version control`],
          correctAnswer: 0,
          explanation: `Automated CI/CD pipelines guarantee reproducible builds and automated regression testing.`
        },
        {
          id: `q3-${t.num}`,
          question: `What is the primary indicator of high code quality in ${name}?`,
          options: [`Readable architecture, high test coverage, and clear documentation`, `The number of lines of code`, `Using complex nested loops`, `Avoiding variable names`],
          correctAnswer: 0,
          explanation: `Clean architecture, test coverage, and documentation enable team scalability and maintainability.`
        }
      ]
    },
    practicalTask: {
      id: `task-${skillId}-${t.num}`,
      title: `Build & Verify ${name} Module`,
      instructions: `Implement a working ${name} component that handles configuration initialization and returns a structured status object.`,
      initialCode: sampleSnippet,
      solutionSnippet: sampleSnippet,
      verificationCriteria: [
        `Component exports valid execution handler`,
        `Returns status 'healthy' or 'success'`,
        `Handles edge cases gracefully`
      ]
    },
    isCompleted: false,
    learnCompleted: false,
    assessmentPassed: false,
    assessmentScore: 0,
    buildPassed: false,
    isLocked: t.num !== 1,
    isBookmarked: false,
    userNote: ''
  }))
}

export function normalizeSkillDetail(rawData, skillIdParam = '') {
  if (!rawData && !skillIdParam) return null

  const data = rawData?.data || rawData || {}
  const rawSkill = data.skill || data || {}

  const id = rawSkill._id || rawSkill.id || skillIdParam || 'sk_engineering'
  const slug = rawSkill.slug || (typeof skillIdParam === 'string' ? skillIdParam.toLowerCase() : '')
  const name = cleanTitle(rawSkill.name || rawSkill.title || rawSkill.skillName, slug)
  const category = (typeof rawSkill.category === 'object' ? rawSkill.category?.name : rawSkill.category) || 'Engineering'
  const level = rawSkill.difficulty || rawSkill.level || 'Intermediate'
  const description = rawSkill.description || `Master production-grade ${name} concepts, best practices, and hands-on exercises.`
  const estimatedHours = rawSkill.estimatedHours || 20

  const userProgress = data.userProgress || rawSkill.userProgress || null
  const completedSet = new Set((userProgress?.completedLessons || []).map(id => id.toString()))
  const lessonStates = Array.isArray(userProgress?.lessonStates) ? userProgress.lessonStates : []

  // Extract lessons from backend response or generate dynamic domain curriculum
  const sourceLessons = (Array.isArray(data.lessons) && data.lessons.length > 0)
    ? data.lessons
    : (Array.isArray(rawSkill.lessons) && rawSkill.lessons.length > 0 ? rawSkill.lessons : generateDomainLessons(name, id))

  const normalizedLessons = sourceLessons.map((l, idx) => {
    const lId = l._id || l.id || `${id}-les-${l.lessonNumber || idx + 1}`
    const lessonNum = l.lessonNumber || idx + 1
    const lTitle = l.title || l.lessonTitle || l.name || `Lesson ${lessonNum}`

    const isDone = Boolean(l.isCompleted) ||
                   completedSet.has(lId.toString()) ||
                   completedSet.has(lessonNum.toString()) ||
                   lessonStates.some(ls =>
                     (ls.isCompleted || ls.buildPassed || (ls.assessmentPassed && ls.learnCompleted)) &&
                     (ls.lesson?.toString() === lId.toString() || ls.lesson?.toString() === lessonNum.toString())
                   )

    return {
      id: lId,
      lessonNumber: lessonNum,
      title: lTitle,
      description: l.description || `Core principles and practical usage of ${name}.`,
      duration: l.duration || `${l.estimatedMinutes || 25} mins`,
      estimatedMinutes: l.estimatedMinutes || 25,
      learningObjectives: Array.isArray(l.learningObjectives) && l.learningObjectives.length > 0
        ? l.learningObjectives
        : [`Understand ${name} principles`, `Implement practical solutions`],
      introduction: l.introduction || l.description || '',
      deepDiveSections: Array.isArray(l.deepDiveSections) ? l.deepDiveSections : [],
      coreConcepts: Array.isArray(l.coreConcepts) ? l.coreConcepts : [],
      syntax: l.syntax || '',
      codeExamples: Array.isArray(l.codeExamples) ? l.codeExamples : [],
      commonMistakes: Array.isArray(l.commonMistakes) ? l.commonMistakes : [],
      bestPractices: Array.isArray(l.bestPractices) ? l.bestPractices : [],
      summary: l.summary || '',
      assessment: l.assessment || null,
      practicalTask: l.practicalTask || null,
      isCompleted: isDone,
      learnCompleted: isDone || Boolean(l.learnCompleted),
      assessmentPassed: isDone || Boolean(l.assessmentPassed),
      assessmentScore: l.assessmentScore || 0,
      buildPassed: isDone || Boolean(l.buildPassed),
      isLocked: l.isLocked !== undefined ? l.isLocked : false,
      isBookmarked: Boolean(l.isBookmarked),
      userNote: l.userNote || ''
    }
  })

  // Enforce strict sequential lesson locks (Lesson N requires Lesson N-1 completion)
  normalizedLessons.forEach((fl, idx) => {
    if (idx === 0) {
      fl.isLocked = false
    } else {
      const prev = normalizedLessons[idx - 1]
      fl.isLocked = !prev.isCompleted
    }
  })

  // Group into 3 clean curriculum modules
  const normalizedModules = [
    {
      id: `mod-1-${id}`,
      title: `Phase 1: Foundations & Architecture`,
      order: 1,
      isLocked: false,
      lessons: normalizedLessons.filter(l => l.lessonNumber <= 2)
    },
    {
      id: `mod-2-${id}`,
      title: `Phase 2: Core Patterns & Real-World Building`,
      order: 2,
      isLocked: !normalizedLessons.filter(l => l.lessonNumber <= 2).every(l => l.isCompleted),
      lessons: normalizedLessons.filter(l => l.lessonNumber > 2 && l.lessonNumber <= 4)
    },
    {
      id: `mod-3-${id}`,
      title: `Phase 3: Optimization, Security & Deployment`,
      order: 3,
      isLocked: !normalizedLessons.filter(l => l.lessonNumber <= 4).every(l => l.isCompleted),
      lessons: normalizedLessons.filter(l => l.lessonNumber > 4)
    }
  ].filter(m => m.lessons.length > 0)

  const completedCount = normalizedLessons.filter(l => l.isCompleted).length
  const totalCount = normalizedLessons.length
  const calcPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const activeProgress = userProgress ? {
    ...userProgress,
    completionPercentage: Math.max(userProgress.completionPercentage || 0, calcPercentage)
  } : {
    completionPercentage: calcPercentage,
    completedLessons: normalizedLessons.filter(l => l.isCompleted).map(l => l.id)
  }

  return {
    id,
    name,
    title: name,
    slug,
    category,
    level,
    difficulty: level,
    description,
    estimatedHours,
    lessons: normalizedLessons,
    modules: normalizedModules,
    lessonCount: normalizedLessons.length,
    userProgress: activeProgress,
    certificate: data.certificate || null
  }
}
