/**
 * roadmapTaskEngine.js
 * Roadmap Task Engine for ZenScore AI (Phase 7 - Sprint 3).
 * Manages task dependency resolution, activity completion evaluation, and task status transitions.
 */

import { isSkillVerified } from '../skills/skillRegistryService'

export const TASK_STATUS = {
  LOCKED: 'LOCKED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
}

// Canonical Roadmap Task Blueprints for Career Roles
export const ROLE_ROADMAP_TASKS = {
  'Backend Engineer': [
    // Phase 1: Foundations
    {
      taskId: 'task_be_p1_1',
      phase: 1,
      title: 'Java 17 OOP & Syntax Fundamentals',
      skillName: 'Java',
      lessonIds: ['java_101'],
      requiredQuiz: true,
      requiredCodingLab: true,
      requiredProject: false,
      estimatedTime: '45 Mins',
      difficulty: 'Beginner',
      rewardXP: 150,
    },
    {
      taskId: 'task_be_p1_2',
      phase: 1,
      title: 'Git Version Control & GitHub Workflows',
      skillName: 'Git & GitHub',
      lessonIds: ['git_101'],
      requiredQuiz: true,
      requiredCodingLab: false,
      requiredProject: false,
      estimatedTime: '30 Mins',
      difficulty: 'Beginner',
      rewardXP: 150,
    },
    {
      taskId: 'task_be_p1_3',
      phase: 1,
      title: 'Phase 1 Capstone: Java CLI Utility Application',
      skillName: 'Java',
      lessonIds: ['java_project_1'],
      requiredQuiz: true,
      requiredCodingLab: true,
      requiredProject: true,
      estimatedTime: '90 Mins',
      difficulty: 'Medium',
      rewardXP: 300,
    },

    // Phase 2: Core Engineering
    {
      taskId: 'task_be_p2_1',
      phase: 2,
      title: 'SQL Relational Queries & Database Indexing',
      skillName: 'SQL & PostgreSQL',
      lessonIds: ['sql_101'],
      requiredQuiz: true,
      requiredCodingLab: true,
      requiredProject: false,
      estimatedTime: '50 Mins',
      difficulty: 'Medium',
      rewardXP: 200,
    },
    {
      taskId: 'task_be_p2_2',
      phase: 2,
      title: 'Node.js & Express REST API Architecture',
      skillName: 'Node.js / Express',
      lessonIds: ['node_101'],
      requiredQuiz: true,
      requiredCodingLab: true,
      requiredProject: false,
      estimatedTime: '60 Mins',
      difficulty: 'Medium',
      rewardXP: 200,
    },
    {
      taskId: 'task_be_p2_3',
      phase: 2,
      title: 'Phase 2 Capstone: E-Commerce REST Microservice',
      skillName: 'Node.js / Express',
      lessonIds: ['node_project_1'],
      requiredQuiz: true,
      requiredCodingLab: true,
      requiredProject: true,
      estimatedTime: '120 Mins',
      difficulty: 'Hard',
      rewardXP: 350,
    },

    // Phase 3: Advanced Architecture
    {
      taskId: 'task_be_p3_1',
      phase: 3,
      title: 'Spring Boot REST Microservices & Dependency Injection',
      skillName: 'Spring Boot',
      lessonIds: ['spring_101'],
      requiredQuiz: true,
      requiredCodingLab: true,
      requiredProject: false,
      estimatedTime: '60 Mins',
      difficulty: 'Hard',
      rewardXP: 250,
    },
    {
      taskId: 'task_be_p3_2',
      phase: 3,
      title: 'Docker Containerization & Multi-Stage Builds',
      skillName: 'Docker',
      lessonIds: ['docker_101'],
      requiredQuiz: true,
      requiredCodingLab: true,
      requiredProject: false,
      estimatedTime: '45 Mins',
      difficulty: 'Medium',
      rewardXP: 250,
    },
    {
      taskId: 'task_be_p3_3',
      phase: 3,
      title: 'Phase 3 Capstone: Containerized Distributed Banking API',
      skillName: 'Microservices',
      lessonIds: ['spring_project_1'],
      requiredQuiz: true,
      requiredCodingLab: true,
      requiredProject: true,
      estimatedTime: '150 Mins',
      difficulty: 'Hard',
      rewardXP: 400,
    },

    // Phase 4: Mastery & Placement
    {
      taskId: 'task_be_p4_1',
      phase: 4,
      title: 'High-Scale Distributed System Design & Caching',
      skillName: 'System Design',
      lessonIds: ['sd_101'],
      requiredQuiz: true,
      requiredCodingLab: true,
      requiredProject: false,
      estimatedTime: '75 Mins',
      difficulty: 'Hard',
      rewardXP: 300,
    },
    {
      taskId: 'task_be_p4_2',
      phase: 4,
      title: 'AWS Infrastructure Deployment & Terraform IaC',
      skillName: 'AWS Cloud Services',
      lessonIds: ['aws_101'],
      requiredQuiz: true,
      requiredCodingLab: true,
      requiredProject: false,
      estimatedTime: '60 Mins',
      difficulty: 'Hard',
      rewardXP: 300,
    },
    {
      taskId: 'task_be_p4_3',
      phase: 4,
      title: 'Phase 4 Capstone: Enterprise System Placement Simulation',
      skillName: 'System Design',
      lessonIds: ['final_capstone'],
      requiredQuiz: true,
      requiredCodingLab: true,
      requiredProject: true,
      estimatedTime: '180 Mins',
      difficulty: 'Hard',
      rewardXP: 500,
    },
  ],
}

/**
 * Gets initial task blueprints for a given career role.
 */
export function getInitialTasksForRole(role = 'Backend Engineer') {
  return ROLE_ROADMAP_TASKS[role] || ROLE_ROADMAP_TASKS['Backend Engineer']
}

/**
 * Evaluates whether a task's dependencies (skill verification, lessons, quizzes, labs, projects) are satisfied.
 */
export function isTaskDependenciesSatisfied(task, activityState = {}) {
  if (!task) return false

  // 1. Skill Verification Requirement
  const skillVerified = isSkillVerified(task.skillName)

  // 2. Completed Lessons
  const completedLessons = activityState.completedLessons || []
  const lessonsSatisfied = (task.lessonIds || []).every(id => completedLessons.includes(id))

  // 3. Quiz Requirement
  const completedQuizzes = activityState.completedQuizzes || []
  const quizSatisfied = !task.requiredQuiz || completedQuizzes.includes(task.taskId) || completedQuizzes.includes(task.skillName)

  // 4. Coding Lab Requirement
  const completedLabs = activityState.completedCodingLabs || []
  const labSatisfied = !task.requiredCodingLab || completedLabs.includes(task.taskId) || completedLabs.includes(task.skillName)

  // 5. Project Requirement
  const completedProjects = activityState.completedProjects || []
  const projectSatisfied = !task.requiredProject || completedProjects.includes(task.taskId) || completedProjects.includes(task.skillName)

  return skillVerified || (lessonsSatisfied && quizSatisfied && labSatisfied && projectSatisfied)
}
