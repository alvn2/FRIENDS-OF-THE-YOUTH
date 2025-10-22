import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { VOLUNTEER_OPPORTUNITIES } from '../constants';
import { useAuth } from '../context/AuthContext';

const VolunteerPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const applyButton = (isAuthenticated: boolean) => {
    if (isAuthenticated) {
        return (
            <Link 
                to="/contact"
                className="mt-auto text-center text-white bg-brand-primary hover:bg-brand-primary-dark focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-300"
            >
                Apply Now
            </Link>
        );
    }
    return (
        <Link 
            to="/login"
            state={{ from: location }}
            className="mt-auto text-center text-white bg-brand-primary hover:bg-brand-primary-dark focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-300"
        >
            Login to Apply
        </Link>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Volunteer With Us</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto">
          Your time and skills can make a profound difference. Join our team of dedicated volunteers and help us create a better future for Kenya's youth.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {VOLUNTEER_OPPORTUNITIES.map((opp) => (
          <div key={opp.id} className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-6 flex flex-col">
            <h3 className="text-2xl font-bold mb-2">{opp.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{opp.description}</p>
            <div className="mb-4">
              <span className="font-semibold">Commitment:</span> {opp.commitment}
            </div>
            <div className="mb-6">
              <span className="font-semibold">Skills Needed:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {opp.skills.map(skill => (
                  <span key={skill} className="bg-brand-primary/10 text-brand-primary text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            {applyButton(isAuthenticated)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VolunteerPage;
