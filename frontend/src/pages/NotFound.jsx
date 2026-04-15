import React from 'react';
import { Link } from 'react-router-dom';
import { Home, SearchX } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="card text-center max-w-md">
        <div className="p-6 bg-deep rounded-full shadow-inner inline-flex mb-6 text-green-primary">
          <SearchX size={48} />
        </div>
        <h1 className="text-4xl font-bold font-display mb-2 text-text-primary">404</h1>
        <p className="text-lg font-body text-text-secondary mb-8">
          The code block you're looking for doesn't exist in this repository.
        </p>
        <Link to="/" className="btn-primary w-full">
          <Home size={18} />
          Return to Base
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
