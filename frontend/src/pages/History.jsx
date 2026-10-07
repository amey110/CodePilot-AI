import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  History as HistoryIcon, 
  Search, 
  FileCode2, 
  ExternalLink, 
  Download, 
  Trash2, 
  Loader2, 
  RefreshCw, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Code2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { reviewService, reportService } from '../services';

const History = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const pageSize = 10;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['reviewHistory', page],
    queryFn: () => reviewService.getHistory(page, pageSize),
    staleTime: 1000 * 60 * 2,
  });

  const reviews = data?.reviews || [];
  const total = data?.total || 0;
  const totalPages = data?.total_pages || 1;

  // Filter reviews by search query on the client side for the current page
  const filteredReviews = reviews.filter((r) =>
    (r.filename || 'pasted_code.py').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete review #${id}?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await reviewService.deleteReview(id);
      toast.success(`Review #${id} deleted successfully.`);
      queryClient.invalidateQueries({ queryKey: ['reviewHistory'] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    } catch (err) {
      console.error('Delete review failed:', err);
      toast.error(err.response?.data?.detail || 'Failed to delete review.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (review, e) => {
    e.stopPropagation();
    try {
      toast.loading('Downloading report...', { id: `dl-${review.id}` });
      await reportService.downloadReport(review.id, review.filename);
      toast.success('Report downloaded!', { id: `dl-${review.id}` });
    } catch (err) {
      console.error('Download report failed:', err);
      toast.error('Failed to download report.', { id: `dl-${review.id}` });
    }
  };

  const getScoreBadge = (score) => {
    const s = Math.round(score || 0);
    if (s >= 90) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (s >= 70) return 'text-violet-400 bg-violet-500/10 border-violet-500/20';
    if (s >= 50) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <HistoryIcon className="w-4 h-4" />
            <span>Archive</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Review History</h1>
          <p className="text-sm text-gray-400 mt-1">
            Browse and manage all previous code inspections, audit scores, and saved reports.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/reviews"
            className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-violet-500/20 flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>New Review</span>
          </Link>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-white transition-colors cursor-pointer"
            title="Refresh history"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="bg-[#0c101f] border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#070a13] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
        <div className="text-xs text-gray-400 font-medium">
          Showing <span className="text-white font-bold">{filteredReviews.length}</span> of <span className="text-white font-bold">{total}</span> total reviews
        </div>
      </div>

      {/* History Table Card */}
      <div className="bg-[#0c101f] border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        {isLoading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            <span className="text-xs text-gray-500">Loading your review archive...</span>
          </div>
        )}

        {isError && (
          <div className="py-16 text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">Error Loading History</h4>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              {error?.message || 'Could not fetch review history from backend server.'}
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl"
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-xs text-gray-500 uppercase tracking-wider">
                    <th className="pb-3 font-medium px-3">Filename</th>
                    <th className="pb-3 font-medium px-3 hidden sm:table-cell">Date</th>
                    <th className="pb-3 font-medium px-3">Score</th>
                    <th className="pb-3 font-medium px-3 hidden md:table-cell">Rating</th>
                    <th className="pb-3 font-medium px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filteredReviews.map((review) => (
                      <motion.tr
                        key={review.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={() => navigate(`/reviews/${review.id}`)}
                        className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group cursor-pointer"
                      >
                        <td className="py-4 px-3">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-800/50 rounded-lg group-hover:bg-violet-500/20 transition-colors">
                              <FileCode2 className="w-4 h-4 text-gray-400 group-hover:text-violet-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-200 truncate max-w-[180px] sm:max-w-[260px]" title={review.filename}>
                              {review.filename || 'pasted_code.py'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-3 hidden sm:table-cell text-xs text-gray-400">
                          {review.created_at ? new Date(review.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          }) : 'N/A'}
                        </td>
                        <td className="py-4 px-3">
                          <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${getScoreBadge(review.score)}`}>
                            {Math.round(review.score || 0)}%
                          </span>
                        </td>
                        <td className="py-4 px-3 hidden md:table-cell text-xs font-semibold text-gray-300">
                          <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10">
                            {review.rating || 'Completed'}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-right">
                          <div className="flex items-center justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => navigate(`/reviews/${review.id}`)}
                              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                              title="View Details"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => handleDownload(review, e)}
                              className="p-2 text-gray-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg transition-colors cursor-pointer"
                              title="Download JSON Report"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => handleDelete(review.id, e)}
                              disabled={deletingId === review.id}
                              className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                              title="Delete Review"
                            >
                              {deletingId === review.id ? (
                                <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>

                  {filteredReviews.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-sm text-gray-500">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <FileCode2 className="w-10 h-10 text-gray-600 mb-1" />
                          <span className="font-semibold text-gray-400">No matching reviews found</span>
                          <p className="text-xs text-gray-500 max-w-sm">
                            {searchQuery ? `No files matching "${searchQuery}" on this page.` : 'You haven\'t completed any code reviews yet.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-gray-300 flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                <span className="text-xs text-gray-400">
                  Page <span className="text-white font-bold">{page}</span> of <span className="text-white font-bold">{totalPages}</span>
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-gray-300 flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default History;
