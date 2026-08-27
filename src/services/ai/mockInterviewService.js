/**
 * mockInterviewService.js
 * AI Mock Interview Engine Service for ZenScore AI.
 * Role-aware AI questions, scoring, evaluation, and fallback generation.
 */

import { executeAIRequest } from './baseAIService'
import { normalizeCareerTitle } from '../careers/careerNormalizer'

export const MOCK_INTERVIEW_PROMPT_VERSION = 'v1.2'

const ROLE_INTERVIEW_TEMPLATES = {
  'AI Engineer': {
    interviewerName: 'Dr. Alex Rivera',
    interviewerTitle: 'Lead AI & LLM Systems Architect',
    greeting: (user, company, type) => `Hello ${user}! I'm Dr. Alex Rivera from ${company}'s Applied AI Research Team. Today we'll evaluate your readiness in ${type}, focusing on PyTorch deep learning models, RAG orchestration, vector databases, and LLM fine-tuning.`,
    questions: [
      {
        id: 'q1',
        question: 'How do you design a Retrieval-Augmented Generation (RAG) pipeline to handle hybrid semantic search and BM25 keyword matching with high precision and sub-100ms latency?',
        category: 'Technical AI',
        expectedKeyPoints: ['Vector database indexing (Qdrant/Pinecone)', 'Re-ranking with Cross-Encoders', 'Chunking strategy & metadata filtering']
      },
      {
        id: 'q2',
        question: 'Describe a situation where an LLM fine-tuning or quantization pipeline degraded model output quality. How did you diagnose memory bottlenecks and fix loss divergence?',
        category: 'Behavioral STAR',
        expectedKeyPoints: ['Quantization (LoRA / QLoRA)', 'Gradient accumulation & learning rate warm-up', 'Measurable evaluation benchmarks']
      }
    ],
    strongPoints: ['Articulated vector embeddings and semantic search mechanics clearly', 'Solid understanding of RAG chunking and re-ranking trade-offs'],
    weakPoints: ['Elaborate more on GPU memory optimization (FP16 vs INT8)', 'Quantify latency gains under heavy query concurrency'],
    idealAnswerSnippet: 'When building enterprise RAG pipelines, combine dense vector embeddings (cosine similarity) with sparse BM25 keyword search using reciprocal rank fusion (RRF) and re-rank top candidates via a cross-encoder model.'
  },
  'Machine Learning Engineer': {
    interviewerName: 'Dr. Sarah Chen',
    interviewerTitle: 'Principal ML Systems Engineer',
    greeting: (user, company, type) => `Hello ${user}! I'm Dr. Sarah Chen from ${company}'s Machine Learning Engineering Team. Today we'll evaluate your readiness in ${type}, focusing on PyTorch model architectures, feature engineering, MLOps deployment, and model monitoring.`,
    questions: [
      {
        id: 'q1',
        question: 'How do you structure an end-to-end ML pipeline with PyTorch and MLflow from raw feature ingestion to model serving and latency optimization?',
        category: 'Technical ML',
        expectedKeyPoints: ['Data preprocessing & feature store', 'Hyperparameter tuning & tracking', 'ONNX / TensorRT export for sub-20ms inference']
      },
      {
        id: 'q2',
        question: 'Describe how you handle data drift and concept drift in a live production machine learning service.',
        category: 'MLOps & Systems',
        expectedKeyPoints: ['Evidently AI monitoring', 'Automated retrain triggers', 'A/B testing & shadow deployment']
      }
    ],
    strongPoints: ['Strong understanding of feature stores and model tracking', 'Solid grasp of model optimization and serving'],
    weakPoints: ['Deeper detail on handling live data drift monitoring', 'Quantify latency improvements using quantization'],
    idealAnswerSnippet: 'Production ML pipelines require decoupled feature engineering, automated experiment tracking with MLflow, ONNX runtime conversion for low-latency inference, and continuous drift monitoring with automated re-training triggers.'
  },
  'Frontend Engineer': {
    interviewerName: 'Marcus Vance',
    interviewerTitle: 'Staff Frontend Architect',
    greeting: (user, company, type) => `Hello ${user}! I'm Marcus Vance from ${company}'s Design & UI Platform Team. Today's ${type} will focus on React virtual DOM reconciliation, Next.js App Router performance, and state management.`,
    questions: [
      {
        id: 'q1',
        question: 'How do you optimize React component rendering and eliminate unnecessary re-renders in a complex high-frequency data dashboard?',
        category: 'Technical Frontend',
        expectedKeyPoints: ['useMemo & useCallback optimization', 'State colocation & Context splitting', 'Virtualization (react-window/tanstack-virtual)']
      },
      {
        id: 'q2',
        question: 'Tell me about a time when a critical UI bug or Core Web Vitals regression hit production. How did you debug and optimize LCP/CLS metric scores?',
        category: 'Behavioral STAR',
        expectedKeyPoints: ['LCP & CLS identification', 'Image optimization & font preloading', 'Measurable lighthouse score improvement']
      }
    ],
    strongPoints: ['Clear explanation of React fiber reconciliation and memoization', 'Good grasp of Core Web Vitals optimization techniques'],
    weakPoints: ['Elaborate on server components vs client boundaries in Next.js', 'Discuss web worker offloading for heavy UI calculations'],
    idealAnswerSnippet: 'To prevent dashboard lag, colocate local state, split global contexts into discrete selectors, and virtualize large tables to render only visible DOM nodes.'
  },
  'Cloud Engineer': {
    interviewerName: 'Elena Rostova',
    interviewerTitle: 'Principal Cloud & Infrastructure Architect',
    greeting: (user, company, type) => `Hello ${user}! I'm Elena Rostova from ${company}'s Cloud Systems Team. Today we will evaluate your readiness in ${type}, focusing on AWS VPC networking, Infrastructure as Code (Terraform), and Kubernetes deployment.`,
    questions: [
      {
        id: 'q1',
        question: 'How do you design a multi-region highly available AWS VPC architecture with automated failover and secure IAM role delegation?',
        category: 'Cloud Systems',
        expectedKeyPoints: ['VPC Peering & Transit Gateway', 'Route53 latency/failover routing', 'Terraform state locking with S3/DynamoDB']
      },
      {
        id: 'q2',
        question: 'Describe an outage where a Terraform infrastructure apply command produced unintended resource destructions. How did you recover and lock down state drifts?',
        category: 'Behavioral STAR',
        expectedKeyPoints: ['Impact assessment & immediate rollback', 'State file recovery & locks', 'CI/CD terraform plan validation gates']
      }
    ],
    strongPoints: ['Strong understanding of AWS VPC subnets and NAT gateways', 'Clear execution plan for Terraform automated deployment'],
    weakPoints: ['Include details on KMS encryption key rotation', 'Elaborate on multi-cloud failover strategies'],
    idealAnswerSnippet: 'Design multi-AZ VPCs with public/private subnet isolation, delegate cross-account access via IAM roles with ABAC, and manage infrastructure strictly through version-controlled Terraform modules with DynamoDB state locks.'
  },
  'DevOps Engineer': {
    interviewerName: 'David Chen',
    interviewerTitle: 'Head of Site Reliability Engineering',
    greeting: (user, company, type) => `Hello ${user}! I'm David Chen from ${company}'s SRE & DevOps Team. Today's ${type} will focus on Docker container security, Kubernetes Helm deployments, and CI/CD pipelines.`,
    questions: [
      {
        id: 'q1',
        question: 'How do you build a zero-downtime Canary deployment pipeline in Kubernetes using ArgoCD and Prometheus alerting metrics?',
        category: 'DevOps & SRE',
        expectedKeyPoints: ['Argo Rollouts canary steps', 'Prometheus SLA/SLO metric checks', 'Automated rollback on error threshold']
      },
      {
        id: 'q2',
        question: 'Tell me about a high-severity production incident where a container image vulnerability or memory leak caused pod crash loops. How did you resolve it?',
        category: 'Behavioral STAR',
        expectedKeyPoints: ['Root cause analysis via kubectl logs/describe', 'OOMKilled tuning & resource limits', 'Post-mortem preventive actions']
      }
    ],
    strongPoints: ['Solid knowledge of Kubernetes pod resource requests and limits', 'Good understanding of GitOps continuous delivery'],
    weakPoints: ['Elaborate on eBPF network observability', 'Elaborate on container security scanning with Trivy/Grype'],
    idealAnswerSnippet: 'Implement GitOps using ArgoCD to track declarative state in Git, utilize Argo Rollouts with Prometheus metric analysis for canary deployments, and enforce distroless container images with non-root execution.'
  },
  'Full Stack Developer': {
    interviewerName: 'Samantha Wu',
    interviewerTitle: 'Engineering Manager & Full Stack Architect',
    greeting: (user, company, type) => `Hello ${user}! I'm Samantha Wu from ${company}'s Product Platform Team. Today's ${type} will focus on end-to-end full stack architecture, Node.js REST APIs, and React frontend synchronization.`,
    questions: [
      {
        id: 'q1',
        question: 'How do you design a real-time full stack notification system connecting a Node.js WebSocket backend with a React client while ensuring idempotency?',
        category: 'Full Stack Systems',
        expectedKeyPoints: ['WebSocket / SSE fallback', 'Redis Pub/Sub message broker', 'Client state reconciliation & message deduplication']
      },
      {
        id: 'q2',
        question: 'Describe a project where database query latency bottlenecked user response times across the full stack. How did you optimize queries and caching?',
        category: 'Behavioral STAR',
        expectedKeyPoints: ['Profiling DB queries (EXPLAIN ANALYZE)', 'Redis cache layer integration', 'End-to-end latency reduction']
      }
    ],
    strongPoints: ['Clear understanding of full stack data flow from DB to UI', 'Solid knowledge of RESTful API design standards'],
    weakPoints: ['Detail optimistic UI updates vs server confirmation', 'Discuss database index selection for complex multi-join queries'],
    idealAnswerSnippet: 'Connect React clients to Node.js backend using WebSockets backed by Redis Pub/Sub for horizontal scaling, store unread counters in Redis, and persist events in PostgreSQL with unique idempotency keys.'
  },
  'Data Scientist': {
    interviewerName: 'Dr. Rahul Sharma',
    interviewerTitle: 'Lead Data Scientist & Analytics Director',
    greeting: (user, company, type) => `Hello ${user}! I'm Dr. Rahul Sharma from ${company}'s Data & Intelligence Group. Today's ${type} will focus on feature engineering, model evaluation metrics, and statistical machine learning.`,
    questions: [
      {
        id: 'q1',
        question: 'How do you address severe class imbalance when training an XGBoost fraud detection model, and why is accuracy a misleading metric?',
        category: 'Data Science & ML',
        expectedKeyPoints: ['Precision-Recall AUC vs ROC AUC', 'SMOTE & class weight adjustment', 'Confusion matrix trade-offs (False Positives vs False Negatives)']
      },
      {
        id: 'q2',
        question: 'Tell me about a machine learning project where feature drift degraded production model predictions. How did you detect drift and retrain the model?',
        category: 'Behavioral STAR',
        expectedKeyPoints: ['KS-test & PSI (Population Stability Index)', 'Automated retraining pipeline', 'Business metric impact']
      }
    ],
    strongPoints: ['Strong grasp of feature selection and scaling methods', 'Solid explanation of precision-recall curves'],
    weakPoints: ['Elaborate on SHAP / LIME model interpretability', 'Discuss data pipeline orchestration with Apache Airflow'],
    idealAnswerSnippet: 'Evaluate imbalanced models using PR-AUC and F1-score rather than accuracy, apply cost-sensitive learning via scale_pos_weight in XGBoost, and monitor Population Stability Index (PSI) in production.'
  },
  'Cybersecurity Engineer': {
    interviewerName: 'Vikram Mehta',
    interviewerTitle: 'Chief Information Security Officer (CISO)',
    greeting: (user, company, type) => `Hello ${user}! I'm Vikram Mehta from ${company}'s Information Security Division. Today's ${type} will cover OWASP Top 10 vulnerabilities, OAuth2/JWT security, and zero-trust architecture.`,
    questions: [
      {
        id: 'q1',
        question: 'How do you secure a distributed microservice network against Broken Object Level Authorization (BOLA) and JWT token hijacking?',
        category: 'Cybersecurity',
        expectedKeyPoints: ['Short-lived JWTs with HttpOnly refresh cookies', 'RBAC & ABAC authorization checks', 'Token revocation lists via Redis']
      },
      {
        id: 'q2',
        question: 'Describe a situation where you discovered an unpatched zero-day vulnerability in production infrastructure. How did you coordinate patch management under risk?',
        category: 'Behavioral STAR',
        expectedKeyPoints: ['Threat modeling & impact isolation', 'Emergency patch deployment', 'Post-incident security audit']
      }
    ],
    strongPoints: ['Excellent knowledge of OWASP Top 10 remediation steps', 'Solid understanding of cryptographic token signing'],
    weakPoints: ['Elaborate on automated SAST/DAST pipeline integration', 'Discuss SIEM log aggregation and anomaly detection'],
    idealAnswerSnippet: 'Enforce Zero-Trust network policies with mTLS between services, store JWT refresh tokens in secure HttpOnly SameSite cookies, and execute fine-grained ABAC checks on every data layer request.'
  },
  'Backend Engineer': {
    interviewerName: 'Sarah Jenkins',
    interviewerTitle: 'Principal Backend Architect',
    greeting: (user, company, type) => `Hello ${user}! I am Sarah Jenkins from ${company}'s Core Engineering Team. Today we will conduct a ${type} focused on backend system design, Spring Boot/Node.js APIs, database pooling, and caching.`,
    questions: [
      {
        id: 'q1',
        question: 'In your backend microservices project, how did you configure database connection pooling and transaction isolation levels to handle concurrent API requests?',
        category: 'Technical Backend',
        expectedKeyPoints: ['HikariCP connection pool tuning', 'Transactional boundaries', 'Database ACID isolation levels']
      },
      {
        id: 'q2',
        question: 'Tell me about a situation where a multi-stage Docker build pipeline or database lock bottlenecked throughput. How did you diagnose and resolve it?',
        category: 'Behavioral STAR',
        expectedKeyPoints: ['Profiling DB queries & locks', 'Redis cache layer optimization', 'Measurable throughput gains']
      }
    ],
    strongPoints: ['Articulated transactional boundaries clearly', 'Demonstrated solid grasp of connection pool optimization'],
    weakPoints: ['Elaborate more on Redis cache eviction strategies (LRU vs LFU)', 'Quantify exact throughput gains in STAR response'],
    idealAnswerSnippet: 'Tune database connection pool limits to match server CPU thread capacity, isolate write operations in discrete transactions, and cache read-heavy queries in Redis.'
  }
}

/**
 * Generates reliable fallback AI Mock Interview data if backend LLM is unreachable.
 */
export function generateMockInterviewFallback(targetRole = 'Backend Engineer', payload = {}) {
  const normalized = normalizeCareerTitle(targetRole)
  const template = ROLE_INTERVIEW_TEMPLATES[normalized] || ROLE_INTERVIEW_TEMPLATES['Backend Engineer']
  const { company = 'Amazon', interviewType = 'Technical Interview', userName = 'Student' } = payload

  return {
    interviewer: {
      name: template.interviewerName,
      role: template.interviewerTitle,
      company: company,
      difficulty: 'Hard',
      interviewStyle: 'Technical Deep Dive & STAR Method',
      greeting: template.greeting(userName, company, interviewType),
    },
    adaptiveQuestions: template.questions,
    liveEvaluation: {
      technicalAccuracyScore: 88,
      communicationScore: 85,
      confidenceScore: 86,
      problemSolvingScore: 90,
      depthScore: 85,
      completenessScore: 88,
    },
    aiFeedback: {
      strongPoints: template.strongPoints,
      weakPoints: template.weakPoints,
      idealAnswerSnippet: template.idealAnswerSnippet,
      improvementTips: ['Structure behavioral responses strictly using Situation -> Task -> Action -> Result (STAR).'],
    },
    scorecard: {
      overallScore: 87,
      technicalScore: 88,
      behavioralScore: 85,
      communicationScore: 85,
      confidenceScore: 86,
      recommendation: 'Strong Hire',
      summaryVerdict: `Candidate demonstrated strong engineering competence in ${normalized} systems and clean technical communication.`,
    },
  }
}

/**
 * Fetches AI Mock Interview Session evaluation from backend API with cache and fallback.
 */
export async function getAIMockInterview(targetRole = 'Backend Engineer', payload = {}) {
  const normalized = normalizeCareerTitle(targetRole)
  const reqPayload = { targetCareer: normalized, ...payload }
  const fallback = generateMockInterviewFallback(normalized, payload)
  const subKey = normalized.replace(/\s+/g, '_')

  const result = await executeAIRequest({
    featureKey: 'mock_interview',
    cacheSubKey: subKey,
    promptVersion: MOCK_INTERVIEW_PROMPT_VERSION,
    requestPayload: reqPayload,
    endpoint: '/careers/interview/mock-ai',
    requiredFields: [
      'interviewer',
      'adaptiveQuestions',
      'liveEvaluation',
      'aiFeedback',
      'scorecard',
    ],
    fallbackData: fallback,
  })

  return {
    ...result.data,
    isCached: result.isCached,
    isFallback: result.isFallback,
  }
}
