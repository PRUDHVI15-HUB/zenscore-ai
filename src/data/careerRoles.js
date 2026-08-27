/**
 * careerRoles.js — ZenScore AI Career Roles Registry
 * Single source of truth for all career paths across the platform.
 * Used by: Career Onboarding, Jobs, Roadmap, Resume ATS, Interview, Learning, Dashboard, Skill Gap, Career Intelligence
 */

export const CAREER_ROLES = [
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    description: 'Build beautiful, responsive web UIs with React, Vue, and modern CSS.',
    icon: '🎨',
    category: 'Web Development',
    difficulty: 'Beginner Friendly',
    futureScope: 'High',
    demandLevel: '★★★★★',
    avgSalary: '₹12L – ₹28L LPA',
    topSkills: ['React', 'TypeScript', 'CSS/Tailwind', 'Next.js', 'Testing'],
    hiringTrend: 'Rising',
    openings: '38,000+'
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer',
    description: 'Build scalable APIs, databases, and server-side systems.',
    icon: '⚙️',
    category: 'Web Development',
    difficulty: 'Intermediate',
    futureScope: 'Very High',
    demandLevel: '★★★★★',
    avgSalary: '₹18L – ₹30L LPA',
    topSkills: ['Node.js', 'Python', 'MongoDB', 'PostgreSQL', 'Docker'],
    hiringTrend: 'Rising',
    openings: '42,000+'
  },
  {
    id: 'fullstack-developer',
    title: 'Full Stack Developer',
    description: 'Master both frontend and backend to build complete web applications.',
    icon: '🔗',
    category: 'Web Development',
    difficulty: 'Intermediate',
    futureScope: 'Very High',
    demandLevel: '★★★★★',
    avgSalary: '₹20L – ₹35L LPA',
    topSkills: ['React', 'Node.js', 'MongoDB', 'Docker', 'System Design'],
    hiringTrend: 'Rising',
    openings: '50,000+'
  },
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    description: 'Design and build robust software systems with engineering best practices.',
    icon: '💻',
    category: 'Software Engineering',
    difficulty: 'Intermediate',
    futureScope: 'Very High',
    demandLevel: '★★★★★',
    avgSalary: '₹18L – ₹40L LPA',
    topSkills: ['DSA', 'System Design', 'OOP', 'Git', 'Cloud'],
    hiringTrend: 'Rising',
    openings: '65,000+'
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    description: 'Bridge development and operations with CI/CD, containers, and automation.',
    icon: '🔄',
    category: 'Infrastructure',
    difficulty: 'Advanced',
    futureScope: 'Very High',
    demandLevel: '★★★★★',
    avgSalary: '₹18L – ₹32L LPA',
    topSkills: ['Kubernetes', 'Docker', 'Jenkins', 'Terraform', 'Linux'],
    hiringTrend: 'Rising',
    openings: '34,000+'
  },
  {
    id: 'cloud-engineer',
    title: 'Cloud Engineer',
    description: 'Design and manage cloud infrastructure on AWS, Azure, or GCP.',
    icon: '☁️',
    category: 'Infrastructure',
    difficulty: 'Advanced',
    futureScope: 'Very High',
    demandLevel: '★★★★☆',
    avgSalary: '₹16L – ₹30L LPA',
    topSkills: ['AWS', 'Azure', 'GCP', 'Terraform', 'Kubernetes'],
    hiringTrend: 'Rising',
    openings: '35,000+'
  },
  {
    id: 'ai-engineer',
    title: 'AI Engineer',
    description: 'Build intelligent AI systems, LLM applications, and production AI pipelines.',
    icon: '🤖',
    category: 'Artificial Intelligence',
    difficulty: 'Advanced',
    futureScope: 'Extremely High',
    demandLevel: '★★★★★',
    avgSalary: '₹22L – ₹45L LPA',
    topSkills: ['Python', 'LLMs', 'RAG', 'Vector DBs', 'MLOps'],
    hiringTrend: 'Rising Fast',
    openings: '28,000+'
  },
  {
    id: 'ml-engineer',
    title: 'Machine Learning Engineer',
    description: 'Develop and deploy ML models that power real-world intelligent products.',
    icon: '🧠',
    category: 'Artificial Intelligence',
    difficulty: 'Advanced',
    futureScope: 'Extremely High',
    demandLevel: '★★★★★',
    avgSalary: '₹20L – ₹42L LPA',
    topSkills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'MLflow'],
    hiringTrend: 'Rising Fast',
    openings: '22,000+'
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    description: 'Extract insights from data using statistics, ML, and visualization.',
    icon: '📊',
    category: 'Data & Analytics',
    difficulty: 'Intermediate',
    futureScope: 'High',
    demandLevel: '★★★★☆',
    avgSalary: '₹18L – ₹32L LPA',
    topSkills: ['Python', 'SQL', 'Pandas', 'ML', 'Tableau'],
    hiringTrend: 'Steady',
    openings: '32,000+'
  },
  {
    id: 'cybersecurity-engineer',
    title: 'Cybersecurity Engineer',
    description: 'Protect systems, networks, and data from cyber threats and attacks.',
    icon: '🛡️',
    category: 'Security',
    difficulty: 'Advanced',
    futureScope: 'Very High',
    demandLevel: '★★★★☆',
    avgSalary: '₹16L – ₹30L LPA',
    topSkills: ['Network Security', 'SIEM', 'Penetration Testing', 'Python', 'CompTIA'],
    hiringTrend: 'Steady',
    openings: '25,000+'
  },
  {
    id: 'mobile-developer',
    title: 'Mobile App Developer',
    description: 'Build native and cross-platform apps for iOS and Android.',
    icon: '📱',
    category: 'Mobile Development',
    difficulty: 'Intermediate',
    futureScope: 'High',
    demandLevel: '★★★★☆',
    avgSalary: '₹14L – ₹28L LPA',
    topSkills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
    hiringTrend: 'Steady',
    openings: '26,000+'
  },
  {
    id: 'uiux-designer',
    title: 'UI/UX Designer',
    description: 'Design intuitive, beautiful user experiences for web and mobile products.',
    icon: '✏️',
    category: 'Design',
    difficulty: 'Beginner Friendly',
    futureScope: 'High',
    demandLevel: '★★★★☆',
    avgSalary: '₹12L – ₹25L LPA',
    topSkills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Accessibility'],
    hiringTrend: 'Steady',
    openings: '20,000+'
  },
  {
    id: 'qa-engineer',
    title: 'QA Engineer',
    description: 'Ensure software quality through manual and automated testing strategies.',
    icon: '🔍',
    category: 'Quality Assurance',
    difficulty: 'Beginner Friendly',
    futureScope: 'Moderate',
    demandLevel: '★★★☆☆',
    avgSalary: '₹10L – ₹22L LPA',
    topSkills: ['Selenium', 'Jest', 'Cypress', 'API Testing', 'JIRA'],
    hiringTrend: 'Stable',
    openings: '18,000+'
  },
  {
    id: 'game-developer',
    title: 'Game Developer',
    description: 'Create interactive games for PC, console, mobile, and VR platforms.',
    icon: '🎮',
    category: 'Game Development',
    difficulty: 'Advanced',
    futureScope: 'Moderate',
    demandLevel: '★★★☆☆',
    avgSalary: '₹12L – ₹28L LPA',
    topSkills: ['Unity', 'Unreal Engine', 'C#', 'C++', '3D Math'],
    hiringTrend: 'Niche',
    openings: '8,000+'
  },
  {
    id: 'blockchain-developer',
    title: 'Blockchain Developer',
    description: 'Build decentralized applications and smart contracts on blockchain platforms.',
    icon: '⛓️',
    category: 'Blockchain',
    difficulty: 'Advanced',
    futureScope: 'Moderate',
    demandLevel: '★★★☆☆',
    avgSalary: '₹18L – ₹40L LPA',
    topSkills: ['Solidity', 'Web3.js', 'Ethereum', 'Smart Contracts', 'DeFi'],
    hiringTrend: 'Niche',
    openings: '6,000+'
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    description: 'Define product vision, roadmap, and strategy to drive business outcomes.',
    icon: '📋',
    category: 'Product Management',
    difficulty: 'Intermediate',
    futureScope: 'High',
    demandLevel: '★★★★☆',
    avgSalary: '₹20L – ₹45L LPA',
    topSkills: ['Product Strategy', 'Agile', 'Data Analysis', 'User Research', 'Roadmapping'],
    hiringTrend: 'Rising',
    openings: '15,000+'
  },
  {
    id: 'other',
    title: 'Other',
    description: 'I have a specific role in mind not listed here.',
    icon: '🎯',
    category: 'Other',
    difficulty: 'Varies',
    futureScope: 'Varies',
    demandLevel: '★★★☆☆',
    avgSalary: 'Varies',
    topSkills: [],
    hiringTrend: 'Varies',
    openings: 'Varies'
  }
]

// Lookup helpers
export const getRoleById = (id) => CAREER_ROLES.find(r => r.id === id) || null
export const getRoleByTitle = (title) => CAREER_ROLES.find(r => r.title === title) || null
export const getRolesByCategory = (category) => CAREER_ROLES.filter(r => r.category === category)

export const ROLE_CATEGORIES = [...new Set(CAREER_ROLES.map(r => r.category))]

export const POPULAR_COMPANIES = [
  'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Uber', 'Airbnb',
  'Flipkart', 'Swiggy', 'Zomato', 'CRED', 'Razorpay', 'PhonePe', 'Paytm',
  'Atlassian', 'Freshworks', 'Zoho', 'Infosys', 'TCS', 'Wipro', 'HCL',
  'Deloitte', 'Accenture', 'Cognizant', 'IBM', 'Salesforce', 'Adobe', 'Oracle',
  'Goldman Sachs', 'Morgan Stanley', 'JPMorgan', 'Deutsche Bank', 'Barclays',
  'OpenAI', 'NVIDIA', 'Anthropic', 'Cohere', 'Databricks', 'Snowflake'
]

export const DEGREE_OPTIONS = [
  'B.Tech / B.E.',
  'B.Sc (Computer Science)',
  'B.Sc (IT)',
  'BCA',
  'M.Tech / M.E.',
  'MCA',
  'MBA (Tech)',
  'B.Sc (Data Science)',
  'Diploma (Engineering)',
  'Other'
]

export const YEAR_OPTIONS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  'Final Year',
  'Recent Graduate',
  'Post Graduate'
]

export const BRANCH_OPTIONS = [
  'Computer Science & Engineering (CSE)',
  'Information Technology (IT)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering',
  'Civil Engineering',
  'Artificial Intelligence & Machine Learning (AIML)',
  'Data Science',
  'Cybersecurity',
  'Biomedical Engineering',
  'Other'
]

export default CAREER_ROLES
