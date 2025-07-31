import React from 'react';
import { Layers, Users, Database, Calendar } from 'lucide-react';
import { stats } from '../../utils/data';
import { Stat } from '../../types';

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

const StatsPanel: React.FC = () => {
  return (
    <section className="py-8 px-4 md:py-0 bg-navy-50 md:bg-transparent md:px-0">
      <div className="container mx-auto md:hidden">
        <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsPanel;