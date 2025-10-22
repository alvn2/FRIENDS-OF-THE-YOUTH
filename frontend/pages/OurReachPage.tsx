import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface RegionData {
    name: string;
    tagline: string;
    description: string;
    image: string;
    relatedLink: string;
    relatedText: string;
    status: 'Active' | 'Planned';
}

const reachData: RegionData[] = [
    {
        name: 'Nairobi',
        tagline: 'Our Foundation & First Hub',
        status: 'Active',
        description: 'Our journey begins in Nairobi. This will be the heart of our operations, hosting our main administrative offices and the launchpad for our first community programs. We are focused on establishing our initial youth shelter, health clinic, and educational support systems right here in the capital city.',
        image: 'https://picsum.photos/seed/nairobi/800/600',
        relatedLink: '/news/1',
        relatedText: 'Read about our official launch'
    },
    {
        name: 'Mombasa',
        tagline: 'Future Hub for Coastal Empowerment',
        status: 'Planned',
        description: 'We plan to expand our reach to the coastal region. Our future Mombasa hub will focus on digital literacy and entrepreneurship, aiming to equip young people with the skills needed for the modern economy, from coding workshops to e-commerce training.',
        image: 'https://picsum.photos/seed/mombasa/800/600',
        relatedLink: '/contact',
        relatedText: 'Partner with us to launch in Mombasa'
    },
    {
        name: 'Kisumu',
        tagline: 'Vision for Lakeside Talent',
        status: 'Planned',
        description: 'Our long-term vision includes establishing a Skills Center in Kisumu. This future hub will foster creativity and technology, providing hands-on vocational and tech training to connect talented youth from the Lake Victoria region with career opportunities.',
        image: 'https://picsum.photos/seed/kisumu/800/600',
        relatedLink: '/contact',
        relatedText: 'Help us build our vision for Kisumu'
    },
];

const OurReachPage: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<RegionData>(reachData[0]);

  return (
    <div className="bg-white dark:bg-dark-bg">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Our Vision for Kenya</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto">
            Our mission begins in Nairobi with a vision to grow across the nation. Learn about our foundational hub and our future plans.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto bg-gray-50 dark:bg-dark-card shadow-lg rounded-xl overflow-hidden">
          {/* Left Panel: Region Selector */}
          <div className="w-full md:w-1/3 p-4 md:p-6 border-r border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4">Our Hubs</h2>
            <div className="space-y-2">
              {reachData.map((region) => (
                <button
                  key={region.name}
                  onClick={() => setSelectedRegion(region)}
                  className={`w-full text-left p-4 rounded-lg transition-colors duration-200 ${
                    selectedRegion.name === region.name
                      ? 'bg-brand-primary text-white shadow'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                    <div className="flex justify-between items-center">
                        <p className="font-semibold">{region.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${region.status === 'Active' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>{region.status}</span>
                    </div>
                  <p className={`text-sm ${selectedRegion.name === region.name ? 'text-sky-100' : 'text-gray-500 dark:text-gray-400'}`}>{region.tagline}</p>
                </button>
              ))}
            </div>
          </div>
          
          {/* Right Panel: Region Details */}
          <div className="w-full md:w-2/3 p-6 md:p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{selectedRegion.name}</h2>
            <img src={selectedRegion.image} alt={`Activities in ${selectedRegion.name}`} className="w-full h-64 object-cover rounded-lg shadow-md mb-6" />
            
            <p className="text-gray-700 dark:text-gray-300 mb-6">{selectedRegion.description}</p>
            
            <Link to={selectedRegion.relatedLink} className="font-semibold text-brand-primary hover:underline">
              {selectedRegion.relatedText} &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurReachPage;
