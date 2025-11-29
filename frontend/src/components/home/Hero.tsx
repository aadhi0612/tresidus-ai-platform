import React, { useEffect, useRef } from 'react';
import { BrainCircuit } from 'lucide-react';

interface HeroProps {
  onNavigateToConsulting?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigateToConsulting }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create particles
    const particleCount = 30;
    const particles: HTMLDivElement[] = [];

    const createParticle = () => {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      // Random position
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      // Random size between 2px and 8px
      const size = Math.random() * 6 + 2;
      
      // Random opacity between 0.1 and 0.3
      const opacity = Math.random() * 0.2 + 0.1;
      
      // Random animation duration between 10s and 30s
      const duration = Math.random() * 20 + 10;
      
      particle.style.left = `${x}%`;
      particle.style.top = `${y}%`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.opacity = opacity.toString();
      particle.style.animationDuration = `${duration}s`;
      
      container.appendChild(particle);
      particles.push(particle);
    };

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      createParticle();
    }

    // Cleanup
    return () => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    };
  }, []);

  return (
    <div className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden gradient-bg">
      {/* Particle background */}
      <div ref={containerRef} className="particles-container"></div>
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="animate-float">
          <div className="bg-white rounded-full p-6 mx-auto w-fit mb-8 shadow-lg">
            <img 
              src="/tresidus-logo.png" 
              alt="Tresidus Logo" 
              className="h-32 w-32 mx-auto"
            />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white tracking-tight">
          Welcome to <span className="text-teal-500">TRESIDUS</span>
        </h1>
        <p className="text-xl md:text-2xl text-navy-100 mb-8 max-w-3xl mx-auto">
          Your partner in data-driven innovation. We build intelligent AI solutions that transform businesses.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            className="btn btn-primary px-6 py-3 text-base"
            onClick={() => {
              const projectsSection = document.querySelector('#projects');
              if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            View Active Projects
          </button>
          <button 
            className="btn btn-outline bg-navy-800/30 text-white border-navy-600 hover:bg-navy-700/50 px-6 py-3 text-base"
            onClick={onNavigateToConsulting}
          >
            Schedule a Consultation
          </button>
        </div>
      </div>
      
      {/* Gradient overlay at bottom for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-navy-50 to-transparent"></div>
    </div>
  );
};

export default Hero;