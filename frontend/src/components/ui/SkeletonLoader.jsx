import React from 'react';

export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 animate-pulse ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div 
        key={i} 
        className="h-3.5 bg-white/5 rounded-lg" 
        style={{ width: `${100 - i * 15}%` }}
      />
    ))}
  </div>
);

export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-[#0c101f] border border-white/5 rounded-3xl p-6 animate-pulse space-y-4 ${className}`}>
    <div className="flex items-center justify-between">
      <div className="w-1/3 h-5 bg-white/10 rounded-lg"></div>
      <div className="w-8 h-8 bg-white/5 rounded-lg"></div>
    </div>
    <div className="w-2/3 h-4 bg-white/5 rounded-lg"></div>
    <div className="w-full h-24 bg-white/5 rounded-2xl"></div>
  </div>
);

export const SkeletonMetric = () => (
  <div className="bg-[#0c101f] border border-white/5 rounded-2xl p-5 animate-pulse flex items-center space-x-4">
    <div className="w-12 h-12 rounded-2xl bg-white/10"></div>
    <div className="flex-1 space-y-2">
      <div className="w-1/2 h-3.5 bg-white/10 rounded-lg"></div>
      <div className="w-3/4 h-6 bg-white/10 rounded-lg"></div>
    </div>
  </div>
);

export const SkeletonPage = () => (
  <div className="min-h-screen bg-[#070a13] p-6 space-y-8 animate-pulse">
    <div className="w-full h-32 bg-[#0c101f] border border-white/5 rounded-3xl"></div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <SkeletonMetric />
      <SkeletonMetric />
      <SkeletonMetric />
      <SkeletonMetric />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 h-96 bg-[#0c101f] border border-white/5 rounded-3xl"></div>
      <div className="h-96 bg-[#0c101f] border border-white/5 rounded-3xl"></div>
    </div>
  </div>
);

export default SkeletonCard;
