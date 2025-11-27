import React, { useState } from 'react';
import { Search, Layers, Mail, Star } from 'lucide-react';
import { mainProject, communityProjects } from '../../utils/data';
import { Project } from '../../types';

const ProjectCard: React.FC<{ project: Project; isMain?: boolean }> = ({ project, isMain = false }) => {
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
      className={`project-card overflow-hidden flex flex-col h-full ${project.redirectUrl ? 'cursor-pointer hover:shadow-lg transition-shadow duration-300' : ''} ${isMain ? 'border-2 border-teal-200' : ''}`}
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
        {isMain && (
          <div className="absolute bottom-2 left-2">
            <span className="bg-teal-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center">
              <Star className="h-3 w-3 mr-1" />
              Main Project
            </span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
        <p className="text-navy-600 text-sm flex-grow">{project.description}</p>
      </div>
    </div>
  );
};

const ContactSection: React.FC = () => {
  const handleContactClick = () => {
    window.location.href = 'mailto:support@tresidus.com';
  };

  return (
    <div className="bg-teal-50 rounded-lg p-6 text-center">
      <Mail className="h-12 w-12 text-teal-500 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-navy-900 mb-2">Get in Touch</h3>
      <p className="text-navy-600 mb-4">
        Have questions about our projects or need custom AI solutions?
      </p>
      <button
        onClick={handleContactClick}
        className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600 transition-colors"
      >
        Contact Us
      </button>
    </div>
  );
};

const ProjectsShowcase: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filterProjects = (projects: Project[]) => {
    return projects.filter(project => {
      if (searchQuery && !project.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !project.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });
  };

  const filteredCommunityProjects = filterProjects(communityProjects);
  const showMainProject = !searchQuery || 
    mainProject.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    mainProject.description.toLowerCase().includes(searchQuery.toLowerCase());

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Main Project */}
          <div>
            <h3 className="text-2xl font-semibold text-navy-900 mb-6 flex items-center">
              <Star className="h-6 w-6 text-teal-500 mr-2" />
              Main Project
            </h3>
            <div className="space-y-6">
              {showMainProject ? (
                <ProjectCard project={mainProject} isMain={true} />
              ) : (
                <div className="text-center py-8">
                  <Layers className="h-12 w-12 text-navy-300 mx-auto mb-4" />
                  <p className="text-navy-500">No main project found</p>
                </div>
              )}
              <ContactSection />
            </div>
          </div>

          {/* Community Projects */}
          <div>
            <h3 className="text-2xl font-semibold text-navy-900 mb-6 flex items-center">
              <Layers className="h-6 w-6 text-coral-500 mr-2" />
              Community Projects
            </h3>
            <div className="space-y-6">
              {filteredCommunityProjects.length > 0 ? (
                filteredCommunityProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))
              ) : (
                <div className="text-center py-8">
                  <Layers className="h-12 w-12 text-navy-300 mx-auto mb-4" />
                  <p className="text-navy-500">No community projects found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsShowcase;