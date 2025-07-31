import React from 'react';
import { Activity } from '../../types';
import { activities } from '../../utils/data';
import { Clock } from 'lucide-react';

const ActivityItem: React.FC<{ activity: Activity }> = ({ activity }) => {
  return (
    <div className="activity-item">
      {activity.user?.avatarUrl ? (
        <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
          <img 
            src={activity.user.avatarUrl} 
            alt={activity.user.name} 
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="h-8 w-8 rounded-full bg-navy-200 flex items-center justify-center flex-shrink-0">
          <Clock className="h-4 w-4 text-navy-600" />
        </div>
      )}
      
      <div className="flex-grow">
        <div className="flex items-center">
          <p className="text-sm text-navy-800">
            {activity.message}
          </p>
          {activity.isNew && (
            <span className="ml-2 inline-block w-2 h-2 bg-coral-500 rounded-full"></span>
          )}
        </div>
        <p className="text-xs text-navy-500 mt-1">{activity.timestamp}</p>
      </div>
    </div>
  );
};

const ActivityFeed: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-5 py-4 border-b border-navy-100">
        <h3 className="font-semibold">Recent Activity</h3>
      </div>
      <div className="p-5 max-h-[400px] overflow-y-auto">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
      <div className="px-5 py-3 bg-navy-50 text-center">
        <button className="text-sm text-teal-500 font-medium hover:text-teal-600 transition-colors">
          View All Activity
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;