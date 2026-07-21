import React, { useEffect, useState, memo } from 'react';
import { motion } from 'framer-motion';

const Counter = memo(({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseFloat(String(value).replace(/[^0-9.]/g, ''));
    if (isNaN(end)) return;
    
    if (start === end) return;

    let totalDuration = 1000;
    let incrementTime = Math.abs(Math.floor(totalDuration / end));
    if (incrementTime < 10) incrementTime = 10;

    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= Math.floor(end)) {
        clearInterval(timer);
        setCount(end);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  const isPercentage = String(value).includes('%');
  return <span>{count}{isPercentage ? '%' : ''}</span>;
});

Counter.displayName = 'Counter';

const QuickStats = memo(({ stats = [] }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      role="region"
      aria-label="Quick Application Metrics"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div 
            key={index}
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-[#0c101f] border border-white/5 rounded-2xl p-5 shadow-lg flex items-center space-x-4 relative overflow-hidden group cursor-default"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000 ease-in-out pointer-events-none"></div>
            
            <div className={`p-3 rounded-xl bg-opacity-20 ${stat.bg} ${stat.color} ring-1 ring-inset ring-white/10 group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white mt-0.5 tracking-tight">
                <Counter value={stat.value} />
              </h3>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
});

QuickStats.displayName = 'QuickStats';

export default QuickStats;
