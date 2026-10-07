import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, FileCode2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { reviewService } from '../../services';

const ActivityTimeline = () => {
  const navigate = useNavigate();

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews'],
    queryFn: () => reviewService.getReviews(1, 5),
    staleTime: 1000 * 60 * 2,
  });

  return (
    <div className="bg-[#0c101f] border border-white/5 rounded-3xl p-6 shadow-xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Recent Activity</h3>
      </div>

      <div className="flex-1 relative">
        {reviews.length > 0 ? (
          <>
            {/* Vertical line connecting timeline items */}
            <div className="absolute top-4 bottom-4 left-[21px] w-px bg-white/5"></div>

            <div className="space-y-6">
              {reviews.map((review, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={review.id} 
                  onClick={() => navigate(`/reviews/${review.id}`)}
                  className="flex relative group cursor-pointer"
                >
                  <div className="relative z-10 flex items-center justify-center w-11 h-11 rounded-full bg-violet-500/10 text-violet-400 ring-4 ring-[#0c101f] shrink-0 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="ml-4 pt-1 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate group-hover:text-violet-300 transition-colors">
                      Analyzed {review.filename}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-400">{review.date}</span>
                      <span className="text-[10px] text-gray-600">&bull;</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        Score {review.score}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500 space-y-2">
            <Clock className="w-8 h-8 text-gray-600" />
            <span className="text-xs">No activity yet. Run your first review!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;
