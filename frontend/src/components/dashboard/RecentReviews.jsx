import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FileCode2, ExternalLink, Loader2, RefreshCw, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../../services';

const RecentReviews = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: reviews = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ['reviews'],
    queryFn: () => reviewService.getReviews(1, 5),
    staleTime: 1000 * 60 * 2, // 2 minutes cache
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
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-bold text-white">Recent Reviews</h3>
          <Link 
            to="/history" 
            className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
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
              <th className="pb-3 font-medium px-2 hidden md:table-cell">Rating</th>
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
                  onClick={() => navigate(`/reviews/${review.id}`)}
                  className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group cursor-pointer"
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
                      <span className={`text-sm font-bold font-mono ${
                        review.score >= 90 ? 'text-emerald-400' : review.score >= 70 ? 'text-violet-400' : 'text-amber-400'
                      }`}>
                        {review.score}%
                      </span>
                      <div className="w-12 h-1.5 bg-gray-800 rounded-full overflow-hidden hidden sm:block">
                        <div 
                          className={`h-full rounded-full ${review.score >= 90 ? 'bg-emerald-400' : review.score >= 70 ? 'bg-violet-400' : 'bg-amber-400'}`}
                          style={{ width: `${Math.min(100, Math.max(0, review.score))}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2 hidden md:table-cell text-xs font-semibold text-gray-400">
                    <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10">
                      {review.rating}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/reviews/${review.id}`);
                      }}
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                      title="Open Review Details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {!isLoading && reviews.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileCode2 className="w-8 h-8 text-gray-600" />
                    <span>No review history available yet.</span>
                    <Link to="/reviews" className="text-xs text-violet-400 hover:underline font-semibold">
                      Run your first code review &rarr;
                    </Link>
                  </div>
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
