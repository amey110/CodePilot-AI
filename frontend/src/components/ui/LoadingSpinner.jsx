import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ label = 'Loading...', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center space-y-2.5 p-4 ${className}`}
      role="status"
      aria-live="polite"
    >
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} animate-spin text-violet-500`} />
      {label && <span className="text-xs text-gray-400 font-medium">{label}</span>}
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default LoadingSpinner;
