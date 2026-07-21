import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';

const WelcomeCard = memo(({ userName = 'Developer' }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-900/40 via-[#101423] to-[#0a0d14] border border-white/5 p-8 sm:p-10"
      role="banner"
    >
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 left-20 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-violet-400 font-medium tracking-wide text-sm">
            {formatDate(currentTime)}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Welcome back, {userName} <span className="inline-block origin-[70%_70%] animate-wave" role="img" aria-label="waving hand">👋</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-xl leading-relaxed">
            Ready to review your Python code today? Drop a file below or paste your script to get started.
          </p>
        </div>
      </div>
    </motion.div>
  );
});

WelcomeCard.displayName = 'WelcomeCard';

export default WelcomeCard;
