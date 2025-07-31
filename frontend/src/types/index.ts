export interface Founder {
  id: number;
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  industry: string;
  status: 'Live' | 'In Development' | 'Completed';
  metrics: {
    roi: string;
    modelsDeployed: number;
  };
  thumbnailUrl: string;
  redirectUrl?: string;
}

export interface Activity {
  id: number;
  message: string;
  timestamp: string;
  isNew: boolean;
  user?: {
    name: string;
    avatarUrl?: string;
  };
}

export interface Stat {
  id: string;
  label: string;
  value: string | number;
  icon: string;
}