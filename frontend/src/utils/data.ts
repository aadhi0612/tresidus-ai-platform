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

export const mainProject: Project = {
  id: 1,
  name: 'AgentIQ Alerts',
  description: 'Receive personalized WhatsApp notifications about market trends, AI updates, and tech insights. Your AI agent learns what matters to you and delivers intelligence when you need it.',
  industry: 'Technology',
  status: 'Live',
  metrics: {
    roi: '',
    modelsDeployed: 0,
  },
  thumbnailUrl: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  redirectUrl: 'https://www.agentiqalerts.com/',
};

export const communityProjects: Project[] = [
  {
    id: 2,
    name: 'Prompt Viewer',
    description: 'Advanced prompt generator for GenAI use cases, helping users create optimized prompts for various AI applications.',
    industry: 'Technology',
    status: 'Live',
    metrics: {
      roi: '',
      modelsDeployed: 0,
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
      roi: '',
      modelsDeployed: 0,
    },
    thumbnailUrl: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    redirectUrl: 'https://socials.dataopslabs.com/',
  },
];

export const otherProjects: Project[] = [];

// Legacy projects array for backward compatibility
export const projects: Project[] = [mainProject, ...communityProjects];

export const activities: Activity[] = [
  {
    id: 1,
    message: 'New AgentIQ Alerts model deployed with improved accuracy',
    timestamp: '2 hours ago',
    isNew: true,
    user: {
      name: 'System',
      avatarUrl: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
  },
  {
    id: 2,
    message: 'New open-source NLP API release published',
    timestamp: 'Yesterday',
    isNew: true,
    user: {
      name: 'Development Team',
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