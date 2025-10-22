import React from 'react';
import { Link } from 'react-router-dom';

const RegisterSuccessPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto bg-white dark:bg-dark-card p-8 rounded-lg shadow-lg">
        <div className="text-green-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Registration Successful!</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Thank you for joining the Friends of the Youth community.
        </p>
        <div className="space-y-4 mb-8">
            <h2 className="font-semibold">Get involved and stay connected:</h2>
            <a href="https://chat.whatsapp.com/IWot79JgMAXEvQKF21mvBX?mode=wwc" target="_blank" rel="noopener noreferrer" className="block w-full text-center px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                Join our WhatsApp Community
            </a>
             <a href="#" target="_blank" rel="noopener noreferrer" className="block w-full text-center px-4 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                Join our Telegram Channel
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="block w-full text-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Like us on Facebook
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="block w-full text-center px-4 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                Follow us on Instagram
            </a>
             <a href="#" target="_blank" rel="noopener noreferrer" className="block w-full text-center px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-black transition-colors">
                Follow us on X (Twitter)
            </a>
        </div>
        <Link to="/dashboard" className="text-brand-primary hover:underline font-medium">
          Go to your Dashboard &rarr;
        </Link>
      </div>
    </div>
  );
};

export default RegisterSuccessPage;
