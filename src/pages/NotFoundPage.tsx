import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-center p-6">
      <h1 className="text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/dashboard"
        className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
