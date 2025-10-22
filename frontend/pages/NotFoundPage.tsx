import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-extrabold text-brand-primary">404</h1>
      <h2 className="text-3xl font-bold mt-4">Page Not Found</h2>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-8 inline-block px-8 py-3 text-lg font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-primary-dark"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
