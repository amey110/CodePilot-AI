import React from 'react';
import { FileSearch } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyState = ({
  icon: Icon = FileSearch,
  title = 'No reviews found yet',
  description = 'Your workspace looks empty. Upload or paste a Python script to run an AI-powered code review.',
  actionText = 'Start Reviewing',
  onAction,
  className = ''
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center py-16 px-6 text-center bg-[#0c101f] border border-white/5 rounded-3xl ${className}`}
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-violet-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-white/10 flex items-center justify-center shadow-2xl">
          <Icon className="w-9 h-9 text-violet-400" />
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{title}</h3>
      <p className="text-xs text-gray-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionText && (
        <button 
          onClick={onAction}
          className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-violet-500/20 transition-all hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        >
          {actionText}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
