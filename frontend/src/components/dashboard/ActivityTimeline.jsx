import React from 'react';
import { Upload, Sparkles, FileText, Lightbulb, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const activities = [
  { id: 1, type: 'upload', title: 'Uploaded authentication.py', time: '2 mins ago', icon: Upload, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 2, type: 'analyze', title: 'Analysis completed', time: '5 mins ago', icon: Sparkles, color: 'text-violet-400', bg: 'bg-violet-400/10' },
  { id: 3, type: 'report', title: 'Report generated for utils.py', time: '1 hour ago', icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { id: 4, type: 'suggestion', title: 'AI suggestions viewed', time: '3 hours ago', icon: Lightbulb, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { id: 5, type: 'fix', title: 'Fixed 3 security issues', time: 'Yesterday', icon: CheckCircle2, color: 'text-rose-400', bg: 'bg-rose-400/10' },
];

const ActivityTimeline = () => {
  return (
    <div className="bg-[#0c101f] border border-white/5 rounded-3xl p-6 shadow-xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Activity</h3>
      </div>

      <div className="flex-1 relative">
        {/* Vertical line connecting timeline items */}
        <div className="absolute top-4 bottom-4 left-[21px] w-px bg-white/5"></div>

        <div className="space-y-6">
          {activities.map((activity, i) => {
            const Icon = activity.icon;
            return (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={activity.id} 
                className="flex relative group"
              >
                <div className={`relative z-10 flex items-center justify-center w-11 h-11 rounded-full ${activity.bg} ${activity.color} ring-4 ring-[#0c101f] shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="ml-4 pt-1 flex-1">
                  <p className="text-sm font-medium text-gray-200">{activity.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActivityTimeline;
