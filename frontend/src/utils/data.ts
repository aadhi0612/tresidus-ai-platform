import { Founder, Project, Activity, Stat } from '../types';

// Founders section commented out for future use
// export const founders: Founder[] = [
//   {
//     id: 2,
//     name: 'Raj',
//     role: 'Co-Founder & CTO',
//     bio: 'Deep learning expert specializing in NLP and computer vision applications.',
//     avatarUrl: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   },
//   {
//     id: 4,
//     name: 'Venkatesh',
//     role: 'Co-Founder & Chief Data Scientist',
//     bio: 'Former research scientist with 30+ publications in reinforcement learning and AI ethics.',
//     avatarUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   },
// ];

export const founders: Founder[] = [];

export const projects: Project[] = [
  {
    id: 1,
    name: 'StockAgentIQ',
    description: 'AI-powered stock suggestion bot that analyzes market trends and provides intelligent investment recommendations.',
    industry: 'Finance',
    status: 'Live',
    metrics: {
      roi: '+58%',
      modelsDeployed: 6,
    },
    thumbnailUrl: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    redirectUrl: 'https://stockagentiq.com',
  },
  {
    id: 2,
    name: 'Prompt Viewer',
    description: 'Advanced prompt generator for GenAI use cases, helping users create optimized prompts for various AI applications.',
    industry: 'Technology',
    status: 'Live',
    metrics: {
      roi: '+42%',
      modelsDeployed: 3,
    },
    thumbnailUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    redirectUrl: 'https://promptweaver.dataopslabs.com/',
  },
  {
    id: 3,
    name: 'Socials',
    description: 'Multi-platform social media management tool that enables content generation and direct scheduling across multiple social platforms with zero effort.',
    industry: 'Marketing',
    status: 'Live',
    metrics: {
      roi: '+67%',
      modelsDeployed: 4,
    },
    thumbnailUrl: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    redirectUrl: 'https://socials.dataopslabs.com/',
  },
  {
    id: 4,
    name: 'Healthcare Diagnostic Assistant',
    description: 'AI-powered diagnostic tool for radiologists using computer vision.',
    industry: 'Healthcare',
    status: 'Live',
    metrics: {
      roi: '+32%',
      modelsDeployed: 4,
    },
    thumbnailUrl: 'https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 5,
    name: 'Financial Fraud Detection',
    description: 'Real-time fraud detection system using anomaly detection algorithms.',
    industry: 'Finance',
    status: 'Live',
    metrics: {
      roi: '+45%',
      modelsDeployed: 3,
    },
    thumbnailUrl: 'https://images.pexels.com/photos/7567434/pexels-photo-7567434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 6,
    name: 'Retail Demand Forecasting',
    description: 'Predictive analytics platform for inventory optimization.',
    industry: 'Retail',
    status: 'In Development',
    metrics: {
      roi: 'N/A',
      modelsDeployed: 1,
    },
    thumbnailUrl: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 7,
    name: 'Natural Language Processing API',
    description: 'Enterprise-grade NLP API for sentiment analysis and entity extraction.',
    industry: 'Technology',
    status: 'Completed',
    metrics: {
      roi: '+28%',
      modelsDeployed: 2,
    },
    thumbnailUrl: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 8,
    name: 'Autonomous Vehicle Vision',
    description: 'Computer vision systems for self-driving vehicle navigation.',
    industry: 'Automotive',
    status: 'In Development',
    metrics: {
      roi: 'N/A',
      modelsDeployed: 0,
    },
    thumbnailUrl: 'https://images.pexels.com/photos/3972755/pexels-photo-3972755.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 9,
    name: 'Manufacturing Defect Detection',
    description: 'AI quality control system for production lines using computer vision.',
    industry: 'Manufacturing',
    status: 'Live',
    metrics: {
      roi: '+62%',
      modelsDeployed: 5,
    },
    thumbnailUrl: 'https://images.pexels.com/photos/6147360/pexels-photo-6147360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
];

export const activities: Activity[] = [
  {
    id: 1,
    message: 'New StockAgentIQ model deployed with improved accuracy',
    timestamp: '2 hours ago',
    isNew: true,
    user: {
      name: 'System',
      avatarUrl: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
  },
  {
    id: 2,
    message: 'Raj uploaded new dataset for Healthcare Diagnostic Assistant',
    timestamp: 'Yesterday',
    isNew: true,
    user: {
      name: 'Raj',
      avatarUrl: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
  },
  {
    id: 3,
    message: 'Prompt Viewer received 1000+ new user registrations',
    timestamp: 'May 22, 2025',
    isNew: false,
    user: {
      name: 'Analytics',
      avatarUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
  },
  {
    id: 4,
    message: 'Venkatesh published research paper on reinforcement learning',
    timestamp: 'May 20, 2025',
    isNew: false,
    user: {
      name: 'Venkatesh',
      avatarUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
  },
  {
    id: 5,
    message: 'Socials platform integrated with 5 new social media APIs',
    timestamp: 'May 18, 2025',
    isNew: false,
    user: {
      name: 'Development Team',
      avatarUrl: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
  },
];

export const stats: Stat[] = [
  {
    id: 'total-projects',
    label: 'Total Projects',
    value: 24,
    icon: 'Layers',
  },
  {
    id: 'active-clients',
    label: 'Active Clients',
    value: 12,
    icon: 'Users',
  },
  {
    id: 'models-in-production',
    label: 'Models in Production',
    value: 8,
    icon: 'Database',
  },
  {
    id: 'upcoming-demos',
    label: 'Upcoming Demos',
    value: '3 this week',
    icon: 'Calendar',
  },
];

export const industries = [
  'All Industries',
  'Healthcare',
  'Finance',
  'Retail',
  'Technology',
  'Marketing',
  'Automotive',
  'Manufacturing',
];

export const statuses = ['All Statuses', 'Live', 'In Development', 'Completed'];