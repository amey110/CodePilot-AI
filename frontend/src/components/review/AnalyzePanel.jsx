import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Loader2, 
  CheckCircle, 
  Code, 
  FileText, 
  Activity, 
  Hash, 
  Info,
  Sparkles,
  AlertTriangle,
  Award,
  ListChecks
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../../services';

const AnalyzePanel = ({
  code,
  file,
  isAnalyzing,
  setIsAnalyzing,
  analysisCompleted,
  setAnalysisCompleted,
  analysisData,
  setAnalysisData
}) => {
  const [loadingStep, setLoadingStep] = useState(0);
  const queryClient = useQueryClient();

  const steps = [
    'Parsing abstract syntax tree (AST)...',
    'Performing static Pylint analysis...',
    'Checking cyclomatic complexity...',
    'Generating review recommendations...'
  ];

  useEffect(() => {
    let interval;
    if (isAnalyzing) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev >= steps.length - 1) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleAnalyze = async () => {
    if (!code || !code.trim()) {
      toast.error('Code cannot be empty! Paste or write Python code first.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisCompleted(false);
    const startTime = Date.now();

    try {
      const response = await reviewService.analyzeCode(code);
      const durationMs = Date.now() - startTime;

      setAnalysisData(response);
      setAnalysisCompleted(true);

      const pylint = response.analysis?.pylint || response.analysis || {};
      const score = pylint.score !== undefined ? pylint.score : 0;
      const rating = pylint.rating || 'Completed';
      const issues = pylint.issues || [];
      const codeSize = new Blob([code]).size;
      const fileName = file ? file.name : 'pasted_code.py';

      // Save to review history and invalidate cache
      reviewService.saveReviewToHistory(
        fileName,
        score,
        codeSize,
        rating,
        issues.length,
        durationMs
      );

      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Code analysis completed successfully!');
    } catch (error) {
      console.error('Code analysis failed:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Failed to connect to FastAPI backend server.';
      toast.error(errorMsg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Heuristic calculations for code metrics
  const linesOfCode = code ? code.split('\n').length : 0;
  const logicalLines = code ? code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).length : 0;
  
  // Dynamic complexity estimation based on branching keywords
  const calculateComplexity = (sourceCode) => {
    if (!sourceCode) return 1;
    const branches = sourceCode.match(/\b(if|elif|for|while|except|and|or)\b/g) || [];
    const functions = sourceCode.match(/\b(def)\b/g) || [];
    return branches.length + functions.length + 1;
  };
  const complexityScore = calculateComplexity(code);
  
  const getComplexityClass = (score) => {
    if (score <= 5) return { label: 'Low (Simple)', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' };
    if (score <= 12) return { label: 'Medium (Moderate)', color: 'text-amber-400 border-amber-500/20 bg-amber-500/5' };
    return { label: 'High (Complex)', color: 'text-rose-400 border-rose-500/20 bg-rose-500/5' };
  };
  const complexityInfo = getComplexityClass(complexityScore);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCodeSize = () => {
    if (file) return file.size;
    if (!code) return 0;
    return new Blob([code]).size;
  };

  const displayName = file ? file.name : 'pasted_code.py';
  const displaySize = formatBytes(getCodeSize());
  const isDisabled = !code || !code.trim() || isAnalyzing;

  // Extract Pylint analysis data from response
  const pylintData = analysisData?.analysis?.pylint || {};
  const pylintScore = pylintData.score !== undefined ? pylintData.score : null;
  const pylintRating = pylintData.rating || 'N/A';
  const pylintIssues = pylintData.issues || [];

  const getRatingBadgeClass = (rating) => {
    switch (rating) {
      case 'Excellent':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'Good':
        return 'text-violet-400 border-violet-500/30 bg-violet-500/10';
      case 'Average':
        return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'Needs Improvement':
      case 'Poor':
        return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      default:
        return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
    }
  };

  return (
    <div className="w-full mt-6 space-y-6">
      {/* Analyze Trigger Button */}
      <div className="flex justify-center">
        <motion.button
          onClick={handleAnalyze}
          disabled={isDisabled}
          className={`w-full max-w-md py-4 px-6 rounded-2xl font-bold text-sm tracking-wider uppercase transition-all duration-300 relative overflow-hidden flex items-center justify-center space-x-2 select-none border border-violet-500/30 ${
            isDisabled
              ? 'bg-gray-800/40 text-gray-500 cursor-not-allowed border-white/5'
              : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white cursor-pointer hover:from-violet-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(139,92,246,0.25)] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] active:scale-98'
          }`}
          whileHover={!isDisabled ? { scale: 1.02 } : {}}
          whileTap={!isDisabled ? { scale: 0.98 } : {}}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Analyzing Workspace Code...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 text-violet-200 fill-current" />
              <span>Analyze Code</span>
            </>
          )}

          {!isDisabled && (
            <motion.div
              className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
              animate={{
                left: ['-50%', '150%'],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.2,
                ease: 'easeInOut',
              }}
            />
          )}
        </motion.button>
      </div>

      {/* Analysis Output Section */}
      <AnimatePresence mode="wait">
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#0b0f19]/60 border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-4"
          >
            <div className="flex items-center space-x-3 text-violet-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-semibold tracking-wide font-mono">
                {steps[loadingStep]}
              </span>
            </div>
            
            <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full"
                initial={{ width: 0 }}
                animate={{ width: `${(loadingStep + 1) * 25}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </motion.div>
        )}

        {analysisCompleted && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className="space-y-6"
          >
            {/* Success Message Banner */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 flex items-start space-x-3.5">
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 mt-0.5">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white">Analysis Complete</h4>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                  Real backend analysis completed using FastAPI & Pylint static code inspection engine.
                </p>
              </div>
            </div>

            {/* Review Summary Card */}
            <div className="bg-[#0c1020] border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-5 border-b border-white/5 pb-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                    Review Summary
                  </h3>
                </div>
                <div className="text-[10px] font-bold text-violet-400 uppercase tracking-widest bg-violet-500/10 px-2.5 py-1 rounded-lg border border-violet-500/20">
                  FastAPI Engine
                </div>
              </div>

              {/* Top Score Banner */}
              {pylintScore !== null && (
                <div className="mb-5 bg-[#070a13]/80 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-400">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">Pylint Quality Score</span>
                      <div className="flex items-baseline space-x-1 mt-0.5">
                        <span className="text-2xl font-black text-white font-mono">{pylintScore}</span>
                        <span className="text-xs text-gray-500 font-mono">/ 10</span>
                      </div>
                    </div>
                  </div>
                  <div className={`text-xs font-bold px-3 py-1.5 rounded-xl border font-mono ${getRatingBadgeClass(pylintRating)}`}>
                    {pylintRating}
                  </div>
                </div>
              )}

              {/* Grid of details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#070a13]/60 border border-white/5 rounded-xl p-3.5 flex items-center space-x-3.5">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-gray-500 font-medium block">File Name</span>
                    <span className="text-xs font-bold text-white truncate block max-w-[150px]" title={displayName}>
                      {displayName}
                    </span>
                  </div>
                </div>

                <div className="bg-[#070a13]/60 border border-white/5 rounded-xl p-3.5 flex items-center space-x-3.5">
                  <div className="p-2 bg-violet-500/10 rounded-lg text-violet-400">
                    <Code className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-medium block">Language</span>
                    <span className="text-xs font-bold text-white block">Python</span>
                  </div>
                </div>

                <div className="bg-[#070a13]/60 border border-white/5 rounded-xl p-3.5 flex items-center space-x-3.5">
                  <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
                    <Hash className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-medium block">Lines (Logical/Total)</span>
                    <span className="text-xs font-bold text-white block font-mono">
                      {logicalLines} / {linesOfCode}
                    </span>
                  </div>
                </div>

                <div className="bg-[#070a13]/60 border border-white/5 rounded-xl p-3.5 flex items-center space-x-3.5">
                  <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-medium block">File Size</span>
                    <span className="text-xs font-bold text-white block font-mono">
                      {displaySize}
                    </span>
                  </div>
                </div>
              </div>

              {/* Complexity Banner */}
              <div className="mt-4 bg-[#070a13]/60 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-medium block">Estimated Complexity</span>
                    <span className="text-xs font-bold text-white">
                      Score: {complexityScore}
                    </span>
                  </div>
                </div>
                <div className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border font-mono ${complexityInfo.color}`}>
                  {complexityInfo.label}
                </div>
              </div>

              {/* Pylint Diagnostics & Issues Section */}
              <div className="mt-6 border-t border-white/5 pt-5">
                <div className="flex items-center space-x-2 mb-3">
                  <ListChecks className="w-4 h-4 text-violet-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Pylint Diagnostics & Code Issues ({pylintIssues.length})
                  </h4>
                </div>

                {pylintIssues.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {pylintIssues.map((issue, idx) => (
                      <div 
                        key={idx} 
                        className="bg-[#070a13]/80 border border-amber-500/20 rounded-xl p-3 flex items-start space-x-3 text-xs"
                      >
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span className="text-gray-300 font-mono leading-relaxed">{issue}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#070a13]/80 border border-emerald-500/20 rounded-xl p-4 flex items-center space-x-3 text-xs text-emerald-400">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>No static analysis issues detected! Code adheres to PEP 8 standards.</span>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnalyzePanel;
