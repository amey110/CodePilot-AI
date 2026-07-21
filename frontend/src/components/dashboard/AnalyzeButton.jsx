import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';

const AnalyzeButton = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate UI loading state for demonstration
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="flex justify-center my-8">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAnalyze}
        disabled={isAnalyzing}
        className="relative group overflow-hidden rounded-2xl p-[1px] w-full max-w-sm disabled:opacity-80 disabled:cursor-not-allowed"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-500 to-violet-600 rounded-2xl opacity-70 group-hover:opacity-100 animate-gradient-xy transition-opacity duration-300"></span>
        
        <div className="relative flex items-center justify-center space-x-3 bg-[#0c101f] px-8 py-4 rounded-2xl transition-all duration-300 group-hover:bg-opacity-80">
          {isAnalyzing ? (
            <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5 text-violet-400 group-hover:text-white transition-colors" />
          )}
          <span className="font-bold text-lg text-gray-100 group-hover:text-white transition-colors">
            {isAnalyzing ? 'Analyzing Code...' : 'Analyze Code'}
          </span>
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 bg-violet-600 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 -z-10"></div>
      </motion.button>
    </div>
  );
};

export default AnalyzeButton;
