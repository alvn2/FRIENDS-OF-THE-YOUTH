import React from 'react';
import { TEAM_DATA } from '../constants';

const OurTeamPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Meet Our Team</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto">
          We are a passionate team of professionals dedicated to making a difference in the lives of Kenya's youth.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {TEAM_DATA.map((member) => (
          <div key={member.id} className="text-center bg-white dark:bg-dark-card p-6 rounded-lg shadow-lg">
            <img 
              className="mx-auto h-32 w-32 rounded-full object-cover mb-4" 
              src={member.image} 
              alt={`Photo of ${member.name}`}
            />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
            <p className="text-sm font-semibold text-brand-red mb-2">{member.title}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurTeamPage;