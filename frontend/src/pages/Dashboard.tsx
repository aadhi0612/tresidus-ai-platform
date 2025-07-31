import React from 'react';
import Hero from '../components/home/Hero';
// import FoundersSection from '../components/home/FoundersSection'; // Commented out for future use
import ProjectsShowcase from '../components/home/ProjectsShowcase';
import StatsPanel from '../components/home/StatsPanel';
import ActivityFeed from '../components/home/ActivityFeed';
import { stats } from '../utils/data';
import { Stat } from '../types';
import { Layers, Users, Database, Calendar } from 'lucide-react';

interface DashboardProps {
  onNavigateToConsulting?: () => void;
}

const StatCard: React.FC<{stat: Stat}> = ({ stat }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layers':
        return <Layers className="h-6 w-6 text-teal-500" />;
      case 'Users':
        return <Users className="h-6 w-6 text-coral-500" />;
      case 'Database':
        return <Database className="h-6 w-6 text-navy-500" />;
      case 'Calendar':
        return <Calendar className="h-6 w-6 text-teal-500" />;
      default:
        return <Layers className="h-6 w-6 text-teal-500" />;
    }
  };

  return (
    <div className="stat-card">
      {getIcon(stat.icon)}
      <div>
        <div className="text-2xl font-bold">{stat.value}</div>
        <div className="text-sm text-navy-500">{stat.label}</div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ onNavigateToConsulting }) => {
  return (
    <div className="min-h-screen bg-navy-50">
      <Hero onNavigateToConsulting={onNavigateToConsulting} />
      {/* FoundersSection commented out for future use */}
      {/* <FoundersSection /> */}
      
      <div className="container mx-auto px-4 py-16" id="projects">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="w-full lg:w-3/4">
            <ProjectsShowcase />
          </div>
          
          {/* Sidebar - Stats & Activity */}
          <div className="w-full lg:w-1/4 space-y-8 hidden md:block">
            <div className="bg-navy-900 rounded-lg shadow-md p-5 text-white">
              <h3 className="font-semibold mb-4 text-lg">Quick Stats</h3>
              <div className="space-y-4">
                {stats.map((stat) => (
                  <StatCard key={stat.id} stat={stat} />
                ))}
              </div>
            </div>
            
            <ActivityFeed />
          </div>
        </div>
      </div>
      
      {/* Stats panel for mobile */}
      <StatsPanel />
    </div>
  );
};

export default Dashboard;