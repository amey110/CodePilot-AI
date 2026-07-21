import React, { useEffect } from 'react';
import { FileCode2, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../../services';

const RecentReviews = () => {
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ['reviews'],
    queryFn: reviewService.getReviews,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  useEffect(() => {
    const handleUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    };
    window.addEventListener('reviews-updated', handleUpdate);
    return () => window.removeEventListener('reviews-updated', handleUpdate);
  }, [queryClient]);

  return (
    <div className="bg-[#0c101f] border border-white/5 rounded-3xl p-6 shadow-xl h-full flex flex-col min-h-[300px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Recent Reviews</h3>
        <button 
          onClick={() => refetch()}
          disabled={isFetching}
          className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors cursor-pointer flex items-center space-x-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="overflow-x-auto flex-1 relative">
        {isLoading && reviews.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0c101f]/80 z-10">
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
              <span className="text-xs text-gray-500">Loading history...</span>
            </div>
          </div>
        ) : null}

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-xs text-gray-500 uppercase tracking-wider">
              <th className="pb-3 font-medium px-2">Filename</th>
              <th className="pb-3 font-medium px-2 hidden sm:table-cell">Date</th>
              <th className="pb-3 font-medium px-2">Score</th>
              <th className="pb-3 font-medium px-2 hidden md:table-cell">Time</th>
              <th className="pb-3 font-medium px-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {reviews.map((review, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: Math.min(i * 0.05, 0.3) }}
                  key={review.id} 
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-800/50 rounded-lg group-hover:bg-violet-500/20 transition-colors">
                        <FileCode2 className="w-4 h-4 text-gray-400 group-hover:text-violet-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-200 truncate max-w-[150px] sm:max-w-[200px]" title={review.filename}>
                        {review.filename}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-2 hidden sm:table-cell text-sm text-gray-400">
                    {review.date}
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-bold ${
                        review.score >= 90 ? 'text-emerald-400' : review.score >= 80 ? 'text-violet-400' : 'text-amber-400'
                      }`}>
                        {review.score}%
                      </span>
                      <div className="w-12 h-1.5 bg-gray-800 rounded-full overflow-hidden hidden sm:block">
                        <div 
                          className={`h-full rounded-full ${review.score >= 90 ? 'bg-emerald-400' : review.score >= 80 ? 'bg-violet-400' : 'bg-amber-400'}`}
                          style={{ width: `${review.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2 hidden md:table-cell text-sm text-gray-500">
                    {review.time}
                  </td>
                  <td className="py-4 px-2 text-right">
                    <button className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {!isLoading && reviews.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-gray-500">
                  No review history available. Run an analysis to start.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentReviews;
