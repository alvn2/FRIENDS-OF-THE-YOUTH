import React from 'react';
import { PARTNERS_DATA } from '../constants';

const PartnershipsPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-dark-bg">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Our Partners</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">
            Our mission is ambitious, and we cannot achieve it alone. We are actively seeking founding partners to join us in building a brighter future for the youth of Kenya.
          </p>
        </div>

        {PARTNERS_DATA.length > 0 ? (
          <div className="text-center">
             <h2 className="text-2xl font-bold text-center mb-6">Our Founding Partners</h2>
             <div className="flex justify-center flex-wrap gap-8 items-center">
                {PARTNERS_DATA.map(partner => (
                <div key={partner.id} className="p-4">
                    <img src={partner.logoUrl} alt={partner.name} className="h-16 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto text-center bg-gray-50 dark:bg-dark-card p-10 rounded-lg shadow-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Become a Founding Partner</h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                  This is a unique opportunity to make a foundational impact. Partnering with FOTY from the start means shaping the future of youth empowerment in Kenya and demonstrating a profound commitment to corporate social responsibility. Let's build this legacy together.
              </p>
              <a href="#/contact" className="mt-6 inline-block text-white bg-brand-red hover:bg-brand-red-dark font-medium rounded-lg text-lg px-8 py-3 transition-colors">
                  Contact Us About Partnership
              </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnershipsPage;
