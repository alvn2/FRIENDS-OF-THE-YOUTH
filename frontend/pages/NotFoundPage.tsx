import React from 'react';
// Fix: Use namespace import for 'react-router-dom' to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-extrabold text-brand-red">404</h1>
      <h2 className="text-3xl font-bold mt-4">Page Not Found</h2>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
        Sorry, the page you are looking for does not exist.
      </p>
      <ReactRouterDOM.Link
        to="/"
        className="mt-8 inline-block px-8 py-3 text-lg font-semibold text-white bg-brand-red rounded-lg hover:bg-brand-red-dark"
      >
        Go to Homepage
      </ReactRouterDOM.Link>
    </div>
  );
};

export default NotFoundPage;