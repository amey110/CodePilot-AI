import React from 'react';
import { Code2, Sparkles } from 'lucide-react';
import ReviewWorkspace from '../components/review/ReviewWorkspace';

const Reviews = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Code2 className="w-4 h-4" />
            <span>Workspace</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">New Code Review</h1>
          <p className="text-sm text-gray-400 mt-1">
            Upload Python source files or paste code into the editor to run multi-engine static analysis & Gemini AI review.
          </p>
        </div>
      </div>

      {/* Review Workspace */}
      <ReviewWorkspace />
    </div>
  );
};

export default Reviews;
