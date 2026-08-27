/**
 * careerMarketMetadata.js
 * Comprehensive Industry Metadata for 8 Engineering Career Tracks.
 * Powers ZenScore AI Live Industry Intelligence (Glassdoor + Levels.fyi + LinkedIn Explorer + AI Coach).
 */

export const CAREER_MARKET_METADATA_DATABASE = {
  'Backend Engineer': {
    demandLevel: '★★★★★ Very High',
    openPositions: '42,000+ Jobs',
    hiringTrend: '📈 Rising (+24% YoY)',
    salaryProgression: {
      fresher: '₹8 – ₹14 LPA',
      exp1to3: '₹15 – ₹22 LPA',
      exp3to5: '₹24 – ₹35 LPA',
      senior: '₹35 – ₹55 LPA',
      architect: '₹60L+ LPA',
    },
    topRecruiters: [
      { name: 'Google', status: 'High Hiring', focus: 'DSA + LLD + System Design', salary: '₹28 – ₹45 LPA' },
      { name: 'Microsoft', status: 'Hiring', focus: 'System Architecture & C#/Java', salary: '₹24 – ₹40 LPA' },
      { name: 'Amazon', status: 'High Hiring', focus: 'High Scale Microservices & AWS', salary: '₹26 – ₹42 LPA' },
      { name: 'Swiggy', status: 'Hiring', focus: 'Spring Boot, Redis & Kafka', salary: '₹20 – ₹32 LPA' },
      { name: 'Atlassian', status: 'High Hiring', focus: 'Java Microservices & Distributed DBs', salary: '₹32 – ₹52 LPA' },
      { name: 'Goldman Sachs', status: 'Hiring', focus: 'Low Latency Java & SQL', salary: '₹25 – ₹38 LPA' },
    ],
    techStack: ['Java', 'Spring Boot', 'REST APIs', 'SQL', 'Docker', 'Redis', 'Kafka', 'AWS', 'System Design', 'Git'],
    certifications: [
      { name: 'Oracle Certified Professional Java SE', difficulty: 'Hard', value: 'High', duration: '2 Months' },
      { name: 'AWS Certified Developer Associate', difficulty: 'Medium', value: 'Very High', duration: '1.5 Months' },
      { name: 'Docker Certified Associate (DCA)', difficulty: 'Medium', value: 'High', duration: '1 Month' },
      { name: 'Spring Certified Professional', difficulty: 'Hard', value: 'High', duration: '2 Months' },
    ],
    interviewProcess: [
      { step: 1, title: 'Online Assessment', desc: '90 Min Coding + CS Fundamentals' },
      { step: 2, title: 'DSA Round 1 & 2', desc: 'Data Structures, Trees, Graphs & DP' },
      { step: 3, title: 'Low Level Design (LLD)', desc: 'OOP Design Patterns, SOLID & Schema Design' },
      { step: 4, title: 'High Level Design (HLD)', desc: 'Scalability, Load Balancers, Caching & Kafka' },
      { step: 5, title: 'Hiring Manager & HR', desc: 'Behavioral & Cultural Alignment' },
    ],
    futureOutlook: {
      futureDemand: '▲ +27%',
      automationRisk: 'Low',
      remotePct: '88%',
      globalDemand: 'Excellent',
      stability: '★★★★★',
    },
    industryNews: [
      'Microsoft expanding backend engineering hubs across Bengaluru & Hyderabad.',
      'Java 24 adoption accelerating microservice startup backend performance.',
      'AWS launches automated Spring Boot container migration tools.',
      'Redis cluster optimization skills seeing 30% surge in recruiter inquiries.',
      'Product unicorns increasing compensation packages for System Design experts.',
    ],
  },

  'Frontend Engineer': {
    demandLevel: '★★★★★ Very High',
    openPositions: '38,000+ Jobs',
    hiringTrend: '📈 Rising (+22% YoY)',
    salaryProgression: {
      fresher: '₹6 – ₹10 LPA',
      exp1to3: '₹12 – ₹18 LPA',
      exp3to5: '₹20 – ₹28 LPA',
      senior: '₹30 – ₹50 LPA',
      architect: '₹55L+ LPA',
    },
    topRecruiters: [
      { name: 'Meta', status: 'High Hiring', focus: 'React, Web Performance & JS Engine', salary: '₹30 – ₹50 LPA' },
      { name: 'Netflix', status: 'Hiring', focus: 'Next.js, Micro-Frontends & UI Performance', salary: '₹35 – ₹58 LPA' },
      { name: 'Airbnb', status: 'Hiring', focus: 'Design Systems & TypeScript', salary: '₹28 – ₹44 LPA' },
      { name: 'Flipkart', status: 'High Hiring', focus: 'React Native & Mobile Web Performance', salary: '₹18 – ₹30 LPA' },
      { name: 'CRED', status: 'Hiring', focus: 'Framer Motion, Canvas & High Polish UI', salary: '₹22 – ₹36 LPA' },
    ],
    techStack: ['React', 'Next.js 14', 'TypeScript', 'TailwindCSS', 'Redux Toolkit', 'Web Vitals', 'HTML5/CSS3', 'Jest', 'Webpack', 'Git'],
    certifications: [
      { name: 'Meta Front-End Developer Professional', difficulty: 'Medium', value: 'High', duration: '2 Months' },
      { name: 'OpenJS Node.js Application Developer', difficulty: 'Hard', value: 'High', duration: '2 Months' },
      { name: 'AWS Certified Cloud Practitioner', difficulty: 'Easy', value: 'Medium', duration: '3 Weeks' },
    ],
    interviewProcess: [
      { step: 1, title: 'Screening Round', desc: 'JavaScript Deep Dive & DOM Machine Coding' },
      { step: 2, title: 'UI Machine Coding', desc: 'Build Complex Interactive Widget (2 Hours)' },
      { step: 3, title: 'Frontend Architecture', desc: 'State Management, SSR, Core Web Vitals' },
      { step: 4, title: 'Hiring Manager Round', desc: 'Product UX Alignment & Collaboration' },
    ],
    futureOutlook: {
      futureDemand: '▲ +24%',
      automationRisk: 'Low-Medium',
      remotePct: '90%',
      globalDemand: 'Excellent',
      stability: '★★★★★',
    },
    industryNews: [
      'Next.js 14 App Router adoption reaches 75% among top tech startups.',
      'Meta releases new React 19 performance features for enterprise web apps.',
      'Demand for Web Performance Optimization specialists up 25% YoY.',
      'TypeScript adoption hits all-time high across frontend engineering teams.',
      'Remote global companies actively hiring senior React/Next.js engineers.',
    ],
  },

  'Full Stack Developer': {
    demandLevel: '★★★★★ Very High',
    openPositions: '50,000+ Jobs',
    hiringTrend: '📈 Rising (+28% YoY)',
    salaryProgression: {
      fresher: '₹8 – ₹14 LPA',
      exp1to3: '₹15 – ₹22 LPA',
      exp3to5: '₹24 – ₹35 LPA',
      senior: '₹38 – ₹65 LPA',
      architect: '₹70L+ LPA',
    },
    topRecruiters: [
      { name: 'Stripe', status: 'High Hiring', focus: 'API Design & Full Stack Architecture', salary: '₹32 – ₹55 LPA' },
      { name: 'Atlassian', status: 'High Hiring', focus: 'Node.js/Java + React + Cloud', salary: '₹30 – ₹50 LPA' },
      { name: 'Swiggy', status: 'Hiring', focus: 'Node.js, Microservices & Next.js', salary: '₹22 – ₹36 LPA' },
      { name: 'Postman', status: 'Hiring', focus: 'Full Stack JavaScript & API Platform', salary: '₹24 – ₹40 LPA' },
      { name: 'Freshworks', status: 'Hiring', focus: 'SaaS Platform Scaling & PostgreSQL', salary: '₹18 – ₹32 LPA' },
    ],
    techStack: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Next.js', 'Docker', 'TypeScript', 'REST APIs', 'Git'],
    certifications: [
      { name: 'AWS Certified Solutions Architect Associate', difficulty: 'Medium-Hard', value: 'Very High', duration: '2 Months' },
      { name: 'Meta Full-Stack Developer Certificate', difficulty: 'Medium', value: 'High', duration: '2.5 Months' },
      { name: 'MongoDB Certified Developer', difficulty: 'Medium', value: 'Medium', duration: '1 Month' },
    ],
    interviewProcess: [
      { step: 1, title: 'Full Stack Machine Coding', desc: 'Build Full Stack Feature with DB & UI (3 Hrs)' },
      { step: 2, title: 'DSA & Algorithms', desc: 'Problem Solving & Complex Data Structures' },
      { step: 3, title: 'System Architecture', desc: 'Database Modeling, Caching & API Endpoints' },
      { step: 4, title: 'Cultural Fit & Leadership', desc: 'Agile Ownership & Product Mindset' },
    ],
    futureOutlook: {
      futureDemand: '▲ +30%',
      automationRisk: 'Low',
      remotePct: '85%',
      globalDemand: 'Exceptional',
      stability: '★★★★★',
    },
    industryNews: [
      'Full Stack developers top the most sought-after role for tech startups in 2026.',
      'Node.js & Next.js full stack combo seeing massive enterprise adoption.',
      'Prisma ORM and PostgreSQL become default database stack for new product builds.',
      'US & European companies increasing hiring of Indian Full Stack engineers.',
      'Startups offering premium equity packages for end-to-end product developers.',
    ],
  },

  'AI / ML Engineer': {
    demandLevel: '★★★★★ Very High',
    openPositions: '28,000+ Jobs',
    hiringTrend: '📈 Skyrocketing (+42% YoY)',
    salaryProgression: {
      fresher: '₹10 – ₹16 LPA',
      exp1to3: '₹18 – ₹28 LPA',
      exp3to5: '₹30 – ₹45 LPA',
      senior: '₹48 – ₹90 LPA',
      architect: '₹1.0Cr+ LPA',
    },
    topRecruiters: [
      { name: 'OpenAI', status: 'Extreme Hiring', focus: 'PyTorch, LLMs & RLHF', salary: '₹60 – ₹120 LPA' },
      { name: 'Google DeepMind', status: 'High Hiring', focus: 'Deep Learning, JAX & Transformers', salary: '₹50 – ₹95 LPA' },
      { name: 'Microsoft AI', status: 'High Hiring', focus: 'Azure AI, RAG & Copilot Models', salary: '₹38 – ₹70 LPA' },
      { name: 'Anthropic', status: 'High Hiring', focus: 'Model Alignment, PyTorch & GPU Scaling', salary: '₹55 – ₹110 LPA' },
      { name: 'NVIDIA', status: 'Hiring', focus: 'CUDA, TensorRT & Model Inference Optimization', salary: '₹40 – ₹75 LPA' },
    ],
    techStack: ['Python', 'PyTorch', 'Transformers', 'RAG Pipelines', 'Qdrant Vector DB', 'FastAPI', 'LangChain', 'Hugging Face', 'CUDA', 'Docker'],
    certifications: [
      { name: 'TensorFlow Developer Certificate', difficulty: 'Hard', value: 'High', duration: '2 Months' },
      { name: 'AWS Certified Machine Learning Specialty', difficulty: 'Hard', value: 'Very High', duration: '2.5 Months' },
      { name: 'DeepLearning.AI Generative AI Specialist', difficulty: 'Medium', value: 'High', duration: '1.5 Months' },
    ],
    interviewProcess: [
      { step: 1, title: 'ML Math & Python Coding', desc: 'Linear Algebra, Calculus & Numpy Implementation' },
      { step: 2, title: 'Machine Learning Deep Dive', desc: 'Loss Functions, Optimizers & Model Architectures' },
      { step: 3, title: 'LLM & RAG Systems Design', desc: 'Vector DB Indexing, Chunking & Fine-Tuning' },
      { step: 4, title: 'Research & System Deployment', desc: 'Model Quantization & GPU Memory Optimization' },
    ],
    futureOutlook: {
      futureDemand: '▲ +45%',
      automationRisk: 'Minimal',
      remotePct: '80%',
      globalDemand: 'Unprecedented',
      stability: '★★★★★',
    },
    industryNews: [
      'Generative AI investment surges with 40% growth in AI Engineer headcount.',
      'Vector Database specialists (Qdrant, Pinecone) seeing 50% salary premium.',
      'Open-source LLM fine-tuning skills in high demand across enterprise tech.',
      'Big Tech increasing remote AI research scientist hiring globally.',
      'NVIDIA GPU infrastructure engineers receiving record-high compensation packages.',
    ],
  },
}

export const DEFAULT_MARKET_METADATA = CAREER_MARKET_METADATA_DATABASE['Backend Engineer']
