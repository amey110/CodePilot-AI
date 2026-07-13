import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow animations */}
      <div className="bg-glow-purple top-10 left-10 animate-pulse duration-5000"></div>
      <div className="bg-glow-blue bottom-10 right-10 animate-pulse duration-8000"></div>

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 md:gap-0 glass-panel rounded-2xl overflow-hidden shadow-2xl z-10 border border-gray-800/80">
        
        {/* Branding Info Column */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-violet-950/20 to-blue-950/20 border-r border-gray-800/50">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-violet-600 rounded-lg shadow-lg shadow-violet-500/30">
              <Terminal className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              AI Code Reviewer
            </span>
          </div>

          <div className="space-y-6 my-auto">
            <h2 className="text-4xl font-extrabold tracking-tight leading-tight text-white">
              Supercharge Your <br />
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Code Quality.
              </span>
            </h2>
            <p className="text-gray-400 leading-relaxed text-sm max-w-md">
              Secure, lightning-fast static analysis and AI reviews built into a unified developer dashboard. Run quality checks on Python, JavaScript, and Java instantly.
            </p>
          </div>

          <div className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} AI Code Reviewer. All rights reserved.
          </div>
        </div>

        {/* Form Container Column */}
        <div className="flex flex-col justify-center p-8 sm:p-12 bg-gray-950/40">
          {/* Logo visible on Mobile only */}
          <div className="flex items-center space-x-2 md:hidden mb-8 justify-center">
            <div className="p-1.5 bg-violet-600 rounded-md">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white">AI Code Reviewer</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
