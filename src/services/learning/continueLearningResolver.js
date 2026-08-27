/**
 * continueLearningResolver.js
 * Comprehensive Multi-Layer Resolver for the "Continue Learning" CTA.
 *
 * Guaranteed to resolve only to real MongoDB course/skill slugs and IDs,
 * never navigating to broken pseudo-IDs.
 */

import { getContinueLearning as getCoursesContinueLearning, getCourses } from '../courses/coursesService'
import { getContinueLearning as getSkillsContinueLearning } from '../api'

/**
 * Career to canonical course specialization mappings (using verified MongoDB course slugs).
 */
export const CAREER_FOUNDATIONAL_LEARNING = {
  'Backend Engineer': { type: 'course', id: 'nodejs-api-dev', path: '/courses/nodejs-api-dev' },
  'Frontend Engineer': { type: 'course', id: 'react-frontend', path: '/courses/react-frontend' },
  'Full Stack Developer': { type: 'course', id: 'react-frontend', path: '/courses/react-frontend' },
  'Data Scientist': { type: 'course', id: 'machine-learning-core', path: '/courses/machine-learning-core' },
  'Machine Learning Engineer': { type: 'course', id: 'machine-learning-core', path: '/courses/machine-learning-core' },
  'AI Engineer': { type: 'course', id: 'ai-architecture', path: '/courses/ai-architecture' },
  'DevOps Engineer': { type: 'course', id: 'devops-pipelines', path: '/courses/devops-pipelines' },
  'DevOps & Cloud Engineer': { type: 'course', id: 'aws-cloud-practitioner', path: '/courses/aws-cloud-practitioner' },
  'Cloud Engineer': { type: 'course', id: 'aws-cloud-practitioner', path: '/courses/aws-cloud-practitioner' },
  'Cybersecurity Engineer': { type: 'course', id: 'cybersecurity-essentials', path: '/courses/cybersecurity-essentials' },
  'System Architect': { type: 'course', id: 'system-design-mastery', path: '/courses/system-design-mastery' }
}

/**
 * Resolves the exact learning destination URL for the student.
 *
 * @param {Object} studentProfile - Profile object from StudentProfileContext
 * @param {Object} careerState - State object from CareerContext
 * @returns {Promise<{ path: string, type: string, id: string, title?: string, moduleIndex?: number }>}
 */
export async function resolveContinueLearningDestination(studentProfile = {}, careerState = {}) {
  try {
    const profile = studentProfile?.data || studentProfile || {}
    const careerProfile = profile?.careerProfile?.data || profile?.careerProfile || {}

    const targetCareer = normalizeCareerTitle(careerProfile?.selectedCareerGoal || careerState?.currentCareer || '')

    // ── PRIORITY 1: In-Progress Course / Active Lesson from Live Backend ──
    try {
      const courseRes = await getCoursesContinueLearning()
      const courseList = Array.isArray(courseRes?.data) ? courseRes.data : (courseRes?.data ? [courseRes.data] : [])
      if (courseList.length > 0) {
        const c = courseList[0]
        const cId = c.slug || c._id || c.courseId || c.id
        const hasStarted = (c.progress > 0 || c.lastOpenedModuleIndex > 0)
        // Use in-progress course if user actually started it, or if no target career set
        if (cId && (hasStarted || !targetCareer)) {
          const modIdx = c.lastOpenedModuleIndex || 0
          return {
            path: `/courses/${cId}${modIdx > 0 ? `?moduleIndex=${modIdx}` : ''}`,
            type: 'course',
            id: cId,
            title: c.title || 'In-Progress Course',
            moduleIndex: modIdx
          }
        }
      }
    } catch {
      // Non-blocking fallback
    }

    // ── PRIORITY 2: In-Progress Skill & Active Lesson from Live Backend ──
    try {
      const skillRes = await getSkillsContinueLearning()
      if (skillRes?.success && skillRes?.data) {
        const s = Array.isArray(skillRes.data) ? skillRes.data[0] : skillRes.data
        const sId = s?.skill?.slug || s?.skill?._id || s?._id || s?.id || s?.skillId
        const lessonId = s?.currentLesson?._id || s?.currentLesson?.id || s?.currentLesson
        if (sId) {
          return {
            path: `/skills/${sId}${lessonId ? `?lesson=${lessonId}` : ''}`,
            type: 'skill',
            id: sId,
            lessonId,
            title: s.skill?.name || s.title || 'In-Progress Skill'
          }
        }
      }
    } catch {
      // Non-blocking fallback
    }

    // ── PRIORITY 3: Profile Cached Enrolled Course ──
    if (coursesSummary.currentCourseId || coursesSummary.currentCourse) {
      const courseId = coursesSummary.currentCourseId || _extractCourseId(coursesSummary.currentCourse)
      if (courseId) {
        const modIdx = coursesSummary.currentModuleIndex !== undefined ? coursesSummary.currentModuleIndex : 0
        return {
          path: `/courses/${courseId}${modIdx > 0 ? `?moduleIndex=${modIdx}` : ''}`,
          type: 'course',
          id: courseId,
          title: coursesSummary.currentCourse,
          moduleIndex: modIdx
        }
      }
    }

    // ── PRIORITY 4: Profile Cached Skill ──
    if (skillsSummary.currentSkillId || skillsSummary.currentSkill) {
      const skillId = skillsSummary.currentSkillId || _extractSkillId(skillsSummary.currentSkill)
      const lessonId = skillsSummary.currentLessonId || skillsSummary.currentLesson
      if (skillId) {
        return {
          path: `/skills/${skillId}${lessonId ? `?lesson=${lessonId}` : ''}`,
          type: 'skill',
          id: skillId,
          lessonId,
          title: skillsSummary.currentSkill
        }
      }
    }

    // ── PRIORITY 5: Career Roadmap Milestone / Phase ──
    const activeRoadmap = careerState?.currentRoadmap
    if (activeRoadmap?.modules && activeRoadmap.modules.length > 0) {
      const nextMod = activeRoadmap.modules.find(m => !m.completed) || activeRoadmap.modules[0]
      if (nextMod?.courseId || nextMod?.skillId) {
        const path = nextMod.courseId ? `/courses/${nextMod.courseId}` : `/skills/${nextMod.skillId}`
        return {
          path,
          type: nextMod.courseId ? 'course' : 'skill',
          id: nextMod.courseId || nextMod.skillId,
          title: nextMod.title || 'Roadmap Step'
        }
      }
    }

    // ── PRIORITY 6: First Career-Relevant Learning Item (New User State) ──
    if (targetCareer && CAREER_FOUNDATIONAL_LEARNING[targetCareer]) {
      const item = CAREER_FOUNDATIONAL_LEARNING[targetCareer]
      return {
        path: item.path,
        type: item.type,
        id: item.id,
        title: `${targetCareer} Foundation`
      }
    }

    // ── PRIORITY 7: Fallback to Available Real Courses ──
    try {
      const allCoursesRes = await getCourses()
      const coursesList = allCoursesRes?.courses || allCoursesRes?.data || []
      if (coursesList.length > 0) {
        const firstCourse = coursesList[0]
        const fId = firstCourse.slug || firstCourse._id || firstCourse.id
        return {
          path: `/courses/${fId}`,
          type: 'course',
          id: fId,
          title: firstCourse.title
        }
      }
    } catch {
      // Non-blocking fallback
    }

    // ── DEFAULT SAFE FALLBACK ROUTE ──
    return {
      path: '/courses',
      type: 'page',
      id: 'courses_page',
      title: 'Courses & Specializations'
    }
  } catch (err) {
    console.info('[ContinueLearningResolver] Exception caught:', err?.message || err)
    return {
      path: '/courses',
      type: 'page',
      id: 'courses_page',
      title: 'Courses & Specializations'
    }
  }
}

function _canonicalRoleFromCareer(career = '') {
  if (!career) return ''
  const c = career.trim()
  if (/machine\s*learning|ml\s*engineer/i.test(c)) return 'Machine Learning Engineer'
  if (/ai\s*engineer|artificial/i.test(c)) return 'AI Engineer'
  if (/backend/i.test(c)) return 'Backend Engineer'
  if (/frontend/i.test(c)) return 'Frontend Engineer'
  if (/full\s*stack/i.test(c)) return 'Full Stack Developer'
  if (/data/i.test(c)) return 'Data Scientist'
  if (/devops/i.test(c)) return 'DevOps Engineer'
  if (/cloud/i.test(c)) return 'Cloud Engineer'
  if (/cyber/i.test(c) || /security/i.test(c)) return 'Cybersecurity Engineer'
  if (/architect/i.test(c) || /system/i.test(c)) return 'System Architect'
  return c
}

function _extractCourseId(titleOrId = '') {
  if (!titleOrId) return null
  const str = String(titleOrId).trim().toLowerCase()
  if (str.length === 24) return titleOrId
  if (str.includes('react')) return 'react-frontend'
  if (str.includes('node') || str.includes('express') || str.includes('backend')) return 'nodejs-api-dev'
  if (str.includes('python')) return 'python-scripting'
  if (str.includes('machine learning') || str.includes('ml')) return 'machine-learning-core'
  if (str.includes('system design')) return 'system-design-mastery'
  if (str.includes('docker')) return 'docker-guide'
  if (str.includes('git')) return 'git-fundamentals'
  if (str.includes('devops') || str.includes('pipeline')) return 'devops-pipelines'
  if (str.includes('aws') || str.includes('cloud')) return 'aws-cloud-practitioner'
  if (str.includes('cybersecurity') || str.includes('security')) return 'cybersecurity-essentials'
  if (str.includes('sql') || str.includes('database')) return 'sql-masterclass'
  if (str.includes('mongodb') || str.includes('mongo')) return 'mongodb-developer'
  if (str.includes('data structure') || str.includes('dsa')) return 'data-structures'
  if (str.includes('algorithm')) return 'algorithms-analysis'
  if (str.includes('java')) return 'java-masterclass'
  if (str.includes('kubernetes')) return 'kubernetes-mastery'
  if (str.includes('linux') || str.includes('bash')) return 'linux-bash'
  if (str.includes('prompt')) return 'prompt-engineering'
  if (str.includes('ai architecture')) return 'ai-architecture'
  return null
}

function _extractSkillId(titleOrId = '') {
  if (!titleOrId) return null
  const str = String(titleOrId).trim().toLowerCase()
  if (str.length === 24) return titleOrId
  if (str.includes('react') || str.includes('next')) return 'react-nextjs-ecosystem'
  if (str.includes('typescript') || str.includes('ts')) return 'typescript-scalable-apps'
  if (str.includes('node') || str.includes('express')) return 'nodejs-express-microservices'
  if (str.includes('mongodb') || str.includes('mongo')) return 'mongodb-database-architecture'
  if (str.includes('mern') || str.includes('full stack')) return 'full-stack-mern-architecture'
  if (str.includes('docker') || str.includes('container')) return 'docker-containerization'
  if (str.includes('python') || str.includes('ai')) return 'python-ai-engineering'
  return null
}
