import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorCard = ({ 
  title = 'Something went wrong', 
  message = 'An unexpected error occurred. Please try again.', 
  onRetry,
  className = '' 
}) => {
  return (
    <div 
      className={`bg-rose-500/5 border border-rose-500/20 rounded-3xl p-6 text-center flex flex-col items-center justify-center space-y-4 ${className}`}
      role="alert"
    >
      <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-400">
        <AlertCircle className="w-8 h-8" />
      </div>
      <div>
        <h4 className="text-base font-bold text-white mb-1">{title}</h4>
        <p className="text-xs text-gray-400 max-w-sm leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          aria-label="Retry operation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorCard;
