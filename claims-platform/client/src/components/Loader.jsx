import React from 'react';

const Loader = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'h-5 w-5 border-2',
    medium: 'h-10 w-10 border-4',
    large: 'h-16 w-16 border-4'
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-slate-200 border-t-blue-600`}
        role="status"
        aria-label="loading"
      />
    </div>
  );
};

export default Loader;
