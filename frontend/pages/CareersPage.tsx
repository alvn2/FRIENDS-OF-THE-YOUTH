import React, { useState } from 'react';
import { JOBS_DATA } from '../constants';
import { JobOpening } from '../types';

const JobItem: React.FC<{ job: JobOpening }> = ({ job }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-brand-red">{job.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {job.location} &bull; {job.type}
            </p>
          </div>
          <svg
            className={`w-6 h-6 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-300 mb-6">{job.description}</p>
          <a
            href="#/contact"
            className="inline-block text-white bg-brand-red hover:bg-brand-red-dark font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Apply Now
          </a>
        </div>
      )}
    </div>
  );
};


const CareersPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-dark-bg">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Join Our Team</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">
            We are looking for passionate and dedicated individuals to help us empower the youth of Kenya. If you are driven by a desire to make a real impact, explore our current openings.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white dark:bg-dark-card rounded-lg shadow-lg overflow-hidden">
            {JOBS_DATA.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {JOBS_DATA.map(job => (
                       <JobItem key={job.id} job={job} />
                    ))}
                </div>
            ) : (
                <div className="p-12 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">No Openings Currently</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Please check back later for new opportunities to join our team.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CareersPage;
