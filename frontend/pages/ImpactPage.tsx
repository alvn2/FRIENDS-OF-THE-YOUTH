import React from 'react';

interface ImpactCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ImpactCard: React.FC<ImpactCardProps> = ({ title, description, icon }) => (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-brand-red text-white mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
);

const ImpactPage: React.FC = () => {
  return (
    <>
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Our Causes</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto">
            We focus on three critical pillars to ensure a holistic development for the youth we serve. Each program is designed to create lasting change and open doors to new opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ImpactCard 
            title="Education"
            description="Providing scholarships, school supplies, and tutoring to ensure every child has access to quality education and a brighter future."
            icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 14l9-5-9-5-9 5 9 5z"></path><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-9.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-9.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M1 12v7a2 2 0 002 2h18a2 2 0 002-2v-7"></path></svg>}
          />
          <ImpactCard 
            title="Healthcare"
            description="Offering free medical check-ups, health education, and access to essential healthcare services to keep our youth healthy and thriving."
            icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>}
          />
          <ImpactCard 
            title="Shelter"
            description="Creating safe, supportive housing environments for homeless and at-risk youth, providing them with stability and a place to call home."
            icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>}
          />
        </div>
      </div>
    </>
  );
};

export default ImpactPage;
