import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#070a13] text-gray-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Glow backgrounds */}
      <div className="bg-glow-purple top-1/3 left-1/3 animate-pulse duration-5000"></div>
      <div className="bg-glow-blue bottom-1/3 right-1/3 animate-pulse duration-8000"></div>

      <div className="text-center space-y-6 max-w-md z-10">
        {/* Decorative graphic icon */}
        <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl w-fit mx-auto text-rose-500 shadow-lg shadow-rose-500/5">
          <Terminal className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <h1 className="text-8xl font-black tracking-tight text-white select-none">404</h1>
          <h2 className="text-xl font-bold text-gray-200">Page Not Found</h2>
          <p className="text-xs text-gray-400 leading-relaxed font-light">
            The page you are looking for does not exist, has been removed, or is under construction for Phase 2.
          </p>
        </div>

        <div className="pt-4">
          <Link to="/dashboard">
            <Button size="md" icon={ArrowLeft}>
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
