import React from 'react';
import Hero from '../components/home/Hero';
import ProjectsShowcase from '../components/home/ProjectsShowcase';

interface DashboardProps {
  onNavigateToConsulting?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigateToConsulting }) => {
  return (
    <div className="min-h-screen bg-navy-50">
      <Hero onNavigateToConsulting={onNavigateToConsulting} />
      
      <div className="container mx-auto px-4 py-16" id="projects">
        <ProjectsShowcase />
      </div>
    </div>
  );
};

export default Dashboard;