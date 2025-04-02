import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="notfound__page">
      <div className="container mx-auto p-4 flex justify-center min-h-[600px] items-center">
        <div className="w-full max-w-lg p-4 md:p-10 shadow-md">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-extrabold text-brand">404</h1>
            <p className="text-gray-500 text-xl mt-4">
              Oops! The page you are looking for doesn't exist.
            </p>
          </div>
          <div className="text-center">
            <Link to="/" className="bg-brand hover:bg-brand-hover text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Return Home
            </Link>
            <Link to="/login" className="bg-brand hover:bg-brand-hover text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
