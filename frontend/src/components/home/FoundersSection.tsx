import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { founders } from '../../utils/data';

const FounderCard: React.FC<{
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
}> = ({ name, role, bio, avatarUrl }) => {
  return (
    <div className="founder-card w-full">
      <div className="relative mx-auto w-28 h-28 rounded-full overflow-hidden mb-4 border-2 border-teal-500">
        <img 
          src={avatarUrl} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-lg font-semibold text-center mb-1">{name}</h3>
      <p className="text-sm text-navy-600 text-center mb-3">{role}</p>
      <p className="text-sm text-navy-700 text-center">{bio}</p>
    </div>
  );
};

const FoundersSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300; // Adjust as needed
      
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="py-16 bg-navy-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Meet Our <span className="text-teal-500">Founders</span>
        </h2>
        
        <div className="relative">
          {/* Scroll buttons for desktop */}
          <div className="hidden md:block">
            <button 
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-navy-50 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6 text-navy-900" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-navy-50 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6 text-navy-900" />
            </button>
          </div>
          
          {/* Scrollable container */}
          <div 
            ref={scrollRef}
            className="flex space-x-6 overflow-x-auto py-4 px-2 -mx-2 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {founders.map((founder) => (
              <div key={founder.id} className="w-full min-w-[250px] max-w-xs flex-shrink-0">
                <FounderCard
                  name={founder.name}
                  role={founder.role}
                  bio={founder.bio}
                  avatarUrl={founder.avatarUrl}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoundersSection;