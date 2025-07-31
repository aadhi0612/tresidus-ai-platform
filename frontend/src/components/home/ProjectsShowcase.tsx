import React, { useState } from 'react';
import { Search, BarChart2, Layers, Cpu } from 'lucide-react';
import { projects, industries, statuses } from '../../utils/data';
import { Project } from '../../types';

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live':
        return 'bg-teal-500';
      case 'In Development':
        return 'bg-coral-500';
      case 'Completed':
        return 'bg-navy-500';
      default:
        return 'bg-navy-300';
    }
  };

  const handleCardClick = () => {
    if (project.redirectUrl) {
      window.open(project.redirectUrl, '_blank');
    }
  };

  return (
    <div 
      className={`project-card overflow-hidden flex flex-col h-full ${project.redirectUrl ? 'cursor-pointer hover:shadow-lg transition-shadow duration-300' : ''}`}
      onClick={handleCardClick}
    >
      {/* Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={project.thumbnailUrl}
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-2 right-2">
          <span className={`${getStatusColor(project.status)} text-white text-xs px-2 py-1 rounded-full font-medium`}>
            {project.status}
          </span>
        </div>
        {project.redirectUrl && (
          <div className="absolute top-2 left-2">
            <span className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full font-medium">
              Live Demo
            </span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
        <p className="text-navy-600 text-sm mb-4 flex-grow">{project.description}</p>
        <div className="flex items-center justify-between text-xs border-t border-navy-100 pt-3">
          <div className="flex items-center">
            <BarChart2 className="h-4 w-4 text-teal-500 mr-1" />
            <span>ROI {project.metrics.roi}</span>
          </div>
          <div className="flex items-center">
            <Cpu className="h-4 w-4 text-navy-500 mr-1" />
            <span>Models: {project.metrics.modelsDeployed}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectsShowcase: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(project => {
    // Filter by industry
    if (selectedIndustry !== 'All Industries' && project.industry !== selectedIndustry) {
      return false;
    }
    
    // Filter by status
    if (selectedStatus !== 'All Statuses' && project.status !== selectedStatus) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !project.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !project.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h2 className="text-3xl font-bold mb-4 md:mb-0">
            Our <span className="text-teal-500">AI Projects</span>
          </h2>
          
          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full rounded-md border-navy-200 pl-10 pr-4 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-400 h-4 w-4" />
          </div>
        </div>
        
        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          {/* Industry filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-navy-600 self-center mr-2">Industry:</span>
            {industries.map(industry => (
              <button
                key={industry}
                className={`filter-pill ${selectedIndustry === industry ? 'active' : ''}`}
                onClick={() => setSelectedIndustry(industry)}
              >
                {industry}
              </button>
            ))}
          </div>
          
          {/* Status filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-navy-600 self-center mr-2">Status:</span>
            {statuses.map(status => (
              <button
                key={status}
                className={`filter-pill ${selectedStatus === status ? 'active' : ''}`}
                onClick={() => setSelectedStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
        
        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Layers className="h-12 w-12 text-navy-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-navy-700 mb-2">No projects found</h3>
              <p className="text-navy-500">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsShowcase;