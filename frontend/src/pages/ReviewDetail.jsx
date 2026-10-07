import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Download, 
  Trash2, 
  Loader2, 
  FileCode2, 
  Calendar, 
  Award, 
  AlertTriangle,
  Code
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { reviewService, reportService } from '../services';
import MonacoEditor from '../components/editor/MonacoEditor';
import AnalyzePanel from '../components/review/AnalyzePanel';

const ReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(false);

  const { data: review, isLoading, isError, error } = useQuery({
    queryKey: ['review', id],
    queryFn: () => reviewService.getReviewById(id),
    staleTime: 1000 * 60 * 5,
  });

  const handleDownload = async () => {
    try {
      toast.loading('Generating report download...', { id: `dl-${id}` });
      await reportService.downloadReport(id, review?.filename);
      toast.success('Report downloaded successfully!', { id: `dl-${id}` });
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Failed to download report.', { id: `dl-${id}` });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete review #${id}?`)) return;
    setDeleting(true);
    try {
      await reviewService.deleteReview(id);
      toast.success(`Review #${id} deleted.`);
      queryClient.invalidateQueries({ queryKey: ['reviewHistory'] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      navigate('/history');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err.response?.data?.detail || 'Failed to delete review.');
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
        <span className="text-sm text-gray-400">Loading review inspection report #{id}...</span>
      </div>
    );
  }

  if (isError || !review) {
    return (
      <div className="py-24 text-center space-y-4 bg-[#0c101f] border border-white/5 rounded-3xl p-8 max-w-lg mx-auto">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Review Not Found</h3>
        <p className="text-xs text-gray-400">
          {error?.message || `Review #${id} does not exist or you do not have permission to view it.`}
        </p>
        <Link
          to="/history"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to History</span>
        </Link>
      </div>
    );
  }

  const score = Math.round(review.score || 0);
  const rating = review.rating || 'Completed';
  const filename = review.filename || 'pasted_code.py';
  const code = review.code || '';
  const analysisPayload = {
    analysis: review.analysis,
    ai_review: review.ai_review,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">
      {/* Top Navigation & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/history')}
            className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-white transition-colors cursor-pointer"
            title="Back to Archive"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-violet-400 font-mono font-semibold">Review #{review.id}</span>
              <span className="text-xs text-gray-600">&bull;</span>
              <span className="text-xs text-gray-400 flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {review.created_at ? new Date(review.created_at).toLocaleString() : 'Recent'}
                </span>
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight truncate max-w-md sm:max-w-xl">
              {filename}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownload}
            className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-violet-500/20 flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl text-rose-400 transition-colors cursor-pointer"
            title="Delete this review"
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Code Snapshot Viewer (Collapsible or Standard) */}
      <div className="bg-[#0c101f] border border-white/5 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-300">
            <Code className="w-4 h-4 text-violet-400" />
            <span>Inspected Python Source Code</span>
          </div>
          <span className="text-[10px] font-mono text-gray-500">
            {code.split('\n').length} Lines
          </span>
        </div>

        <div className="h-64 rounded-2xl overflow-hidden border border-white/5 bg-[#05070d]">
          <MonacoEditor
            value={code}
            readOnly={true}
            fontSize={13}
            theme="vs-dark"
          />
        </div>
      </div>

      {/* Full Analysis Breakdown & Tabs */}
      <AnalyzePanel
        code={code}
        file={{ name: filename, size: new Blob([code]).size }}
        isAnalyzing={false}
        setIsAnalyzing={() => {}}
        analysisCompleted={true}
        setAnalysisCompleted={() => {}}
        analysisData={analysisPayload}
        setAnalysisData={() => {}}
      />
    </div>
  );
};

export default ReviewDetail;
