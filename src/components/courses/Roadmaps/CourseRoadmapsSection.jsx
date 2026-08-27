import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  Map as MapIcon, 
  Layers, 
  CheckCircle2, 
  Lock, 
  PlayCircle, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  ChevronRight
} from 'lucide-react'

// Canonical Specialization Pathways mapped directly to real 21 MongoDB courses
const CAREER_PATHWAYS_CONFIG = [
  {
    id: 'fullstack-path',
    title: 'Full Stack Engineering Specialization',
    description: 'Master modern frontend architectures, scalable backend APIs, relational & document databases, and system design.',
    icon: '⚡',
    category: 'Web & Systems',
    courseSlugs: [
      { slug: 'git-fundamentals', title: 'Version Control with Git', hours: 8, level: 'Foundational' },
      { slug: 'react-frontend', title: 'React Frontend Framework', hours: 14, level: 'Core Frontend' },
      { slug: 'nodejs-api-dev', title: 'Node.js API Programming', hours: 12, level: 'Core Backend' },
      { slug: 'mongodb-developer', title: 'MongoDB Data Modeling', hours: 10, level: 'Database' },
      { slug: 'system-design-mastery', title: 'High Scale System Design', hours: 16, level: 'Architecture' }
    ]
  },
  {
    id: 'ai-ml-path',
    title: 'AI & Machine Learning Engineering Pathway',
    description: 'Comprehensive specialization covering Python, algorithms, machine learning models, LLMs, and RAG systems.',
    icon: '🧠',
    category: 'Artificial Intelligence',
    courseSlugs: [
      { slug: 'python-scripting', title: 'Python Scripting & Automation', hours: 10, level: 'Foundations' },
      { slug: 'data-structures', title: 'Core Data Structures', hours: 14, level: 'CS Fundamentals' },
      { slug: 'machine-learning-core', title: 'Applied Machine Learning', hours: 16, level: 'Modeling' },
      { slug: 'prompt-engineering', title: 'LLM Prompt Engineering & RAG', hours: 8, level: 'Applied AI' },
      { slug: 'ai-architecture', title: 'Modern AI Systems Architecture', hours: 14, level: 'Capstone' }
    ]
  },
  {
    id: 'cloud-devops-path',
    title: 'Cloud Architecture & DevOps Master Pathway',
    description: 'Master Linux administration, Docker containers, CI/CD automated pipelines, AWS cloud, and production Kubernetes.',
    icon: '☁️',
    category: 'Cloud & Infrastructure',
    courseSlugs: [
      { slug: 'linux-bash', title: 'Linux Shell & System Administration', hours: 10, level: 'Foundations' },
      { slug: 'docker-guide', title: 'Containerization with Docker', hours: 10, level: 'Containers' },
      { slug: 'devops-pipelines', title: 'CI/CD DevOps Pipelines', hours: 12, level: 'Automation' },
      { slug: 'aws-cloud-practitioner', title: 'AWS Cloud Architecture', hours: 14, level: 'Cloud Platforms' },
      { slug: 'kubernetes-mastery', title: 'Production Kubernetes Clusters', hours: 16, level: 'Orchestration' }
    ]
  },
  {
    id: 'backend-data-path',
    title: 'Backend & Data Systems Engineering Pathway',
    description: 'Enterprise backend services, SQL query optimization, data structures, and distributed database engineering.',
    icon: '🗄️',
    category: 'Backend & Data',
    courseSlugs: [
      { slug: 'java-masterclass', title: 'Enterprise Java & Spring', hours: 16, level: 'OOP & Enterprise' },
      { slug: 'nodejs-api-dev', title: 'Node.js API Programming', hours: 12, level: 'Microservices' },
      { slug: 'sql-masterclass', title: 'Advanced SQL Queries', hours: 10, level: 'Relational DB' },
      { slug: 'mongodb-developer', title: 'MongoDB Data Modeling', hours: 10, level: 'NoSQL DB' },
      { slug: 'system-design-mastery', title: 'High Scale System Design', hours: 16, level: 'Scale & Reliability' }
    ]
  }
]

export default function CourseRoadmapsSection({ roadmap = null, courses = [], onSelectCourse }) {
  const [selectedPathId, setSelectedPathId] = useState(CAREER_PATHWAYS_CONFIG[0].id)

  // Map courses array by slug and id using plain object to avoid any identifier conflict
  const courseLookup = useMemo(() => {
    const lookup = {}
    if (Array.isArray(courses)) {
      courses.forEach(c => {
        if (c.slug) lookup[c.slug] = c
        if (c._id) lookup[c._id.toString()] = c
      })
    }
    return lookup
  }, [courses])

  // Build dynamic pathways enriched with live student progress
  const enrichedPathways = useMemo(() => {
    return CAREER_PATHWAYS_CONFIG.map(pathway => {
      let totalHours = 0
      let completedCount = 0
      let inProgressCount = 0

      const nodes = pathway.courseSlugs.map((item, idx) => {
        totalHours += item.hours
        const realCourse = courseLookup[item.slug]
        const enrolled = !!realCourse?.enrolled
        const percent = realCourse?.completedPercent || 0
        const isCompleted = percent >= 100 || (realCourse?.completedModules?.length >= (realCourse?.modules?.length || 8))

        if (isCompleted) completedCount++
        else if (enrolled || percent > 0) inProgressCount++

        return {
          id: item.slug,
          step: idx + 1,
          slug: item.slug,
          courseId: realCourse?._id || item.slug,
          title: realCourse?.title || item.title,
          technology: realCourse?.technology || item.title,
          level: item.level,
          hours: item.hours,
          enrolled,
          progress: percent,
          isCompleted,
          icon: realCourse?.icon || '📚',
          description: realCourse?.description || 'Comprehensive curriculum module covering essential engineering principles.'
        }
      })

      // Determine prerequisite unlock status
      const evaluatedNodes = nodes.map((node, idx) => {
        let status = 'Locked'
        if (node.isCompleted) {
          status = 'Completed'
        } else if (node.enrolled || node.progress > 0) {
          status = 'In Progress'
        } else if (idx === 0) {
          status = 'Unlocked'
        } else {
          const prevNode = nodes[idx - 1]
          if (prevNode.isCompleted || prevNode.enrolled) {
            status = 'Unlocked'
          } else {
            status = 'Locked'
          }
        }
        return { ...node, status }
      })

      const overallProgress = Math.round((completedCount / nodes.length) * 100)

      return {
        ...pathway,
        estimatedHours: totalHours,
        completedCount,
        inProgressCount,
        overallProgress,
        nodes: evaluatedNodes
      }
    })
  }, [courseLookup])

  const activeRoadmap = enrichedPathways.find(r => r.id === selectedPathId) || enrichedPathways[0]

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/70">
        <div>
          <h2 className="font-sora text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-100/80 text-purple-700">
              <MapIcon className="w-5 h-5" />
            </div>
            <span>Career Specialization Roadmaps</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Structured step-by-step career pathways. Complete prerequisite courses to unlock advanced engineering nodes.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>{enrichedPathways.length} Specialization Tracks Active</span>
        </div>
      </div>

      {/* Pathway Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {enrichedPathways.map((pathway) => {
          const isSelected = pathway.id === selectedPathId
          return (
            <motion.div
              key={pathway.id}
              whileHover={{ y: -2 }}
              onClick={() => setSelectedPathId(pathway.id)}
              className={`relative rounded-2xl p-6 border transition-all cursor-pointer overflow-hidden bg-white ${
                isSelected
                  ? 'border-purple-600 shadow-md ring-2 ring-purple-600/15 bg-gradient-to-br from-purple-50/40 via-white to-white'
                  : 'border-slate-200/90 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
              )}
              
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 bg-purple-100/70 px-2.5 py-0.5 rounded-full">
                  {pathway.category}
                </span>
                <span className="text-xl">{pathway.icon}</span>
              </div>

              <h3 className="font-sora text-base font-extrabold text-slate-900 mb-1.5">
                {pathway.title}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                {pathway.description}
              </p>

              {/* Progress bar inside card */}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-[11px] font-bold text-slate-600">
                  <span>Pathway Progress</span>
                  <span className="text-purple-700">{pathway.completedCount}/{pathway.nodes.length} Completed ({pathway.overallProgress}%)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-500" 
                    style={{ width: `${pathway.overallProgress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 pt-3 border-t border-slate-100">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{pathway.estimatedHours} Total Hours</span>
                </span>
                <span className="flex items-center gap-1 text-purple-600 font-bold">
                  <span>{pathway.nodes.length} Structured Nodes</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Prerequisite Node Timeline */}
      {activeRoadmap && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sora text-lg font-bold text-slate-900">
                  {activeRoadmap.title}
                </h3>
                <span className="text-xs text-slate-500">
                  Step-by-Step Prerequisite Progression Timeline
                </span>
              </div>
            </div>
            <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200/60 self-start sm:self-auto">
              Track Status: {activeRoadmap.completedCount === activeRoadmap.nodes.length ? 'Mastered 🏆' : `${activeRoadmap.overallProgress}% Complete`}
            </div>
          </div>

          <div className="relative space-y-4">
            {activeRoadmap.nodes.map((node, idx) => {
              const isLocked = node.status === 'Locked'
              const isCompleted = node.status === 'Completed'
              const isInProgress = node.status === 'In Progress'

              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`relative p-5 rounded-2xl border transition-all ${
                    isCompleted
                      ? 'bg-emerald-50/30 border-emerald-200/80'
                      : isInProgress
                      ? 'bg-purple-50/40 border-purple-300 ring-2 ring-purple-500/10'
                      : isLocked
                      ? 'bg-slate-50/80 border-slate-200/60 opacity-80'
                      : 'bg-white border-slate-200/90 hover:border-purple-300 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left: Step Indicator & Course Info */}
                    <div className="flex items-start sm:items-center gap-4">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                          : isInProgress
                          ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                          : isLocked
                          ? 'bg-slate-200 text-slate-400'
                          : 'bg-purple-100 text-purple-700 border border-purple-200'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        ) : isLocked ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          node.step
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {node.level}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {node.hours} hrs
                          </span>
                        </div>
                        <h4 className="font-sora text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                          <span>{node.title}</span>
                          <span className="text-base">{node.icon}</span>
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1 max-w-xl">
                          {node.description}
                        </p>
                      </div>
                    </div>

                    {/* Right: Action Button & Status Badge */}
                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      {isCompleted ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>100% Mastered</span>
                          </span>
                          <button
                            onClick={() => onSelectCourse && onSelectCourse(node.slug)}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
                          >
                            Review
                          </button>
                        </div>
                      ) : isInProgress ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1.5 rounded-xl">
                            {node.progress}% Complete
                          </span>
                          <button
                            onClick={() => onSelectCourse && onSelectCourse(node.slug)}
                            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-sm flex items-center gap-1.5 transition-all"
                          >
                            <span>Resume</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : isLocked ? (
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200/60">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Prerequisite Required</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => onSelectCourse && onSelectCourse(node.slug)}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-sm flex items-center gap-1.5 transition-all"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>Start Course</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
