import React from 'react';
import { Achievement } from '../types';

interface BadgeListProps {
  achievements: Achievement[];
}

const BadgeList: React.FC<BadgeListProps> = ({ achievements }) => {
  if (achievements.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-gray-600 dark:text-gray-400">You haven't earned any badges yet. Make a donation or participate in the community to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {achievements.map(ach => (
        <div key={ach.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center shadow-sm" title={ach.description}>
          <div className="text-4xl mb-2">{ach.icon}</div>
          <h3 className="font-semibold text-sm">{ach.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default BadgeList;
