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
  Sparkles,
  AlertTriangle,
  Award,
  ListChecks,
  Shield,
  Layers,
  Copy,
  Check,
  Bug,
  Zap,
  BookOpen
} from 'lucide-react';
import { DiffEditor } from '@monaco-editor/react';
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
  const [activeTab, setActiveTab] = useState('summary');
  const [copied, setCopied] = useState(false);
  const queryClient = useQueryClient();

  const steps = [
    'Parsing abstract syntax tree (AST)...',
    'Running Pylint & Flake8 style analyzers...',
    'Performing Bandit security vulnerability audit...',
    'Computing Radon cyclomatic complexity...',
    'Querying Gemini AI for review & code improvements...'
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
      }, 500);
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

    try {
      const response = await reviewService.analyzeCode(code);
      setAnalysisData(response);
      setAnalysisCompleted(true);
      setActiveTab('summary');

      // Invalidate queries so Dashboard and History update instantly
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      window.dispatchEvent(new Event('reviews-updated'));
      toast.success('Code analysis completed successfully!');
    } catch (error) {
      console.error('Code analysis failed:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Failed to connect to backend server.';
      toast.error(errorMsg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyCode = (textToCopy) => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success('Improved code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Metrics extraction
  const linesOfCode = code ? code.split('\n').length : 0;
  const logicalLines = code ? code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).length : 0;
  
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

  // Analysis object unpacking
  const analysisObj = analysisData?.analysis || {};
  const pylintData = analysisObj.pylint || {};
  const banditData = analysisObj.bandit || {};
  const flake8Data = analysisObj.flake8 || {};
  const radonData = analysisObj.radon || {};
  const parserData = analysisObj.parser || {};
  const aiReview = analysisData?.ai_review || analysisObj.ai_review || null;
  const aiMessage = analysisData?.ai_message || analysisObj.ai_message || null;

  const overallScore = analysisObj.overall_score !== undefined
    ? Math.round(analysisObj.overall_score)
    : (pylintData.score !== undefined ? Math.round(pylintData.score * 10) : null);
  const overallRating = analysisObj.overall_rating || pylintData.rating || 'N/A';
  const allIssues = analysisObj.issues || pylintData.issues || [];

  // Filter security issues specifically
  const securityIssues = allIssues.filter(i => 
    (typeof i === 'object' && i.source === 'bandit') || 
    (typeof i === 'object' && String(i.severity).toLowerCase() === 'high')
  );

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

  const tabs = [
    { id: 'summary', label: 'Summary', icon: Sparkles },
    { id: 'issues', label: 'Issues', icon: ListChecks, badge: allIssues.length },
    { id: 'security', label: 'Security', icon: Shield, badge: securityIssues.length },
    { id: 'complexity', label: 'Complexity', icon: Activity },
    { id: 'ai', label: 'AI Suggestions', icon: Zap },
    { id: 'improved', label: 'Improved Code', icon: Code },
  ];

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
              <span>Run AI Code Review</span>
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

      {/* Analysis Progress / Result Section */}
      <AnimatePresence mode="wait">
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#0b0f19]/80 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4"
          >
            <div className="flex items-center space-x-3 text-violet-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-semibold tracking-wide font-mono">
                {steps[loadingStep]}
              </span>
            </div>
            
            <div className="w-72 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full"
                initial={{ width: 0 }}
                animate={{ width: `${(loadingStep + 1) * 20}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <p className="text-xs text-gray-400">
              Running multi-engine static analyzers (Pylint, Bandit, Flake8, Radon) and Gemini AI...
            </p>
          </motion.div>
        )}

        {analysisCompleted && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className="bg-[#0c1020] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-6"
          >
            {/* Top Score & Status Banner */}
            <div className="bg-[#070a13]/90 border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-2xl text-violet-400">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">
                    Composite Quality Score
                  </span>
                  <div className="flex items-baseline space-x-2 mt-0.5">
                    <span className="text-3xl font-black text-white font-mono">{overallScore ?? 'N/A'}</span>
                    <span className="text-sm text-gray-500 font-mono">/ 100</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border font-mono ${getRatingBadgeClass(overallRating)}`}>
                  {overallRating}
                </div>
                <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300">
                  {allIssues.length} {allIssues.length === 1 ? 'Issue' : 'Issues'} Detected
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-1 border-b border-white/10 overflow-x-auto pb-2 scrollbar-none">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-lg shadow-violet-500/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                        tab.id === 'security' ? 'bg-rose-500/20 text-rose-300' : 'bg-violet-500/20 text-violet-300'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className="pt-2">
              {/* TAB 1: SUMMARY */}
              {activeTab === 'summary' && (
                <div className="space-y-6">
                  {/* Multi-Engine Score Breakdown */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                      Multi-Engine Analysis Breakdown
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-[#070a13]/70 border border-white/5 rounded-2xl p-4 text-center">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold">Pylint</span>
                        <div className="text-xl font-bold text-white font-mono mt-1">
                          {pylintData.score !== undefined ? pylintData.score : 'N/A'}<span className="text-xs text-gray-500">/10</span>
                        </div>
                        <span className="text-[10px] text-gray-400 block mt-1">{pylintData.rating || 'Clean'}</span>
                      </div>

                      <div className="bg-[#070a13]/70 border border-white/5 rounded-2xl p-4 text-center">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold">Bandit (Security)</span>
                        <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
                          {banditData.score !== undefined ? banditData.score : 'N/A'}<span className="text-xs text-gray-500">/100</span>
                        </div>
                        <span className="text-[10px] text-gray-400 block mt-1">{banditData.rating || 'Passed'}</span>
                      </div>

                      <div className="bg-[#070a13]/70 border border-white/5 rounded-2xl p-4 text-center">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold">Flake8 (Style)</span>
                        <div className="text-xl font-bold text-violet-400 font-mono mt-1">
                          {flake8Data.score !== undefined ? flake8Data.score : 'N/A'}<span className="text-xs text-gray-500">/100</span>
                        </div>
                        <span className="text-[10px] text-gray-400 block mt-1">{flake8Data.rating || 'Standard'}</span>
                      </div>

                      <div className="bg-[#070a13]/70 border border-white/5 rounded-2xl p-4 text-center">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold">Radon (MI)</span>
                        <div className="text-xl font-bold text-cyan-400 font-mono mt-1">
                          {radonData.maintainability_index !== undefined ? radonData.maintainability_index : 'N/A'}<span className="text-xs text-gray-500">/100</span>
                        </div>
                        <span className="text-[10px] text-cyan-400 font-mono block mt-1">Rank {radonData.mi_rank || 'A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* File Metadata */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-[#070a13]/60 border border-white/5 rounded-xl p-3 flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] text-gray-500 block">File</span>
                        <span className="text-xs font-bold text-white truncate block" title={displayName}>{displayName}</span>
                      </div>
                    </div>
                    <div className="bg-[#070a13]/60 border border-white/5 rounded-xl p-3 flex items-center space-x-3">
                      <Code className="w-4 h-4 text-violet-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-gray-500 block">Language</span>
                        <span className="text-xs font-bold text-white">Python 3</span>
                      </div>
                    </div>
                    <div className="bg-[#070a13]/60 border border-white/5 rounded-xl p-3 flex items-center space-x-3">
                      <Hash className="w-4 h-4 text-pink-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-gray-500 block">Lines (Logical/Total)</span>
                        <span className="text-xs font-bold text-white font-mono">{logicalLines} / {linesOfCode}</span>
                      </div>
                    </div>
                    <div className="bg-[#070a13]/60 border border-white/5 rounded-xl p-3 flex items-center space-x-3">
                      <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-gray-500 block">Functions / Classes</span>
                        <span className="text-xs font-bold text-white font-mono">
                          {parserData.functions?.length || 0} / {parserData.classes?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* AI Quick Summary (if present) */}
                  {aiReview?.summary && (
                    <div className="bg-gradient-to-r from-violet-950/30 to-indigo-950/30 border border-violet-500/20 rounded-2xl p-5 space-y-2">
                      <div className="flex items-center space-x-2 text-violet-300 font-semibold text-xs">
                        <Sparkles className="w-4 h-4" />
                        <span>Gemini AI Executive Summary</span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {aiReview.summary}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ISSUES */}
              {activeTab === 'issues' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Total static issues discovered across all engines ({allIssues.length})
                    </span>
                  </div>

                  {allIssues.length > 0 ? (
                    <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                      {allIssues.map((issue, idx) => {
                        const isObj = typeof issue === 'object' && issue !== null;
                        const lineNum = isObj ? issue.line : null;
                        const codeTag = isObj ? issue.code : null;
                        const severity = isObj ? (issue.severity || 'warning') : 'warning';
                        const msg = isObj ? (issue.message || '') : String(issue);
                        const source = isObj ? issue.source : null;

                        const sevLower = String(severity).toLowerCase();
                        const isError = ['error', 'fatal', 'high'].includes(sevLower);
                        const isWarning = ['warning', 'medium', 'refactor'].includes(sevLower);

                        return (
                          <div 
                            key={idx} 
                            className={`bg-[#070a13]/80 border rounded-xl p-3.5 flex items-start space-x-3 text-xs ${
                              isError ? 'border-rose-500/30' : isWarning ? 'border-amber-500/20' : 'border-violet-500/20'
                            }`}
                          >
                            <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
                              isError ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-violet-400'
                            }`} />
                            <div className="flex-1 space-y-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                {source && (
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-400 uppercase font-semibold">
                                    {source}
                                  </span>
                                )}
                                {lineNum && (
                                  <span className="text-[10px] font-mono font-semibold text-violet-400">
                                    Line {lineNum}
                                  </span>
                                )}
                                {codeTag && (
                                  <span className="text-[10px] font-mono font-bold text-amber-300">
                                    [{codeTag}]
                                  </span>
                                )}
                                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                                  isError ? 'bg-rose-500/10 text-rose-400' : isWarning ? 'bg-amber-500/10 text-amber-400' : 'bg-violet-500/10 text-violet-400'
                                }`}>
                                  {severity}
                                </span>
                              </div>
                              <span className="text-gray-300 font-mono leading-relaxed block">{msg}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-[#070a13]/80 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-2">
                      <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                      <h4 className="text-sm font-bold text-white">Clean Code!</h4>
                      <p className="text-xs text-gray-400">No static issues detected by Pylint, Flake8, or Radon.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SECURITY */}
              {activeTab === 'security' && (
                <div className="space-y-5">
                  <div className="bg-[#070a13]/80 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">Bandit Security Engine</span>
                      <span className="text-[10px] text-gray-400">AST vulnerability & CVE scanner for Python</span>
                    </div>
                    <div className="text-sm font-bold text-emerald-400 font-mono">
                      Security Score: {banditData.score ?? 100}/100
                    </div>
                  </div>

                  {banditData.issues && banditData.issues.length > 0 ? (
                    <div className="space-y-3">
                      <h5 className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                        Vulnerabilities Detected ({banditData.issues.length})
                      </h5>
                      {banditData.issues.map((sec, i) => (
                        <div key={i} className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 bg-rose-500/20 text-rose-300 rounded uppercase font-bold">
                              {sec.severity || 'HIGH'} SEVERITY
                            </span>
                            {sec.line && <span className="text-xs font-mono text-gray-400">Line {sec.line}</span>}
                            {sec.code && <span className="text-xs font-mono text-amber-400">[{sec.code}]</span>}
                          </div>
                          <p className="text-xs text-gray-200 font-mono">{sec.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-[#070a13]/80 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-2">
                      <Shield className="w-8 h-8 text-emerald-400 mx-auto" />
                      <h4 className="text-sm font-bold text-white">Zero Security Vulnerabilities</h4>
                      <p className="text-xs text-gray-400">Bandit found no hardcoded credentials, SQL injection, or insecure subprocess calls.</p>
                    </div>
                  )}

                  {/* AI Flagged Security Risks */}
                  {aiReview?.security_risks && aiReview.security_risks.length > 0 && (
                    <div className="space-y-2 mt-4 pt-4 border-t border-white/10">
                      <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        AI-Flagged Security Insights
                      </h5>
                      <ul className="space-y-2">
                        {aiReview.security_risks.map((risk, idx) => (
                          <li key={idx} className="bg-[#070a13]/60 border border-amber-500/20 rounded-xl p-3 text-xs text-gray-300 flex items-start space-x-2.5">
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: COMPLEXITY */}
              {activeTab === 'complexity' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#070a13]/80 border border-white/5 rounded-2xl p-4">
                      <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">Maintainability Index (MI)</span>
                      <div className="flex items-baseline space-x-2 mt-1">
                        <span className="text-2xl font-bold text-white font-mono">{radonData.maintainability_index ?? 'N/A'}</span>
                        <span className="text-xs text-emerald-400 font-semibold font-mono">Rank {radonData.mi_rank ?? 'A'}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1">Scores above 65 represent highly maintainable code.</p>
                    </div>

                    <div className="bg-[#070a13]/80 border border-white/5 rounded-2xl p-4">
                      <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">Average Cyclomatic Complexity</span>
                      <div className="text-2xl font-bold text-white font-mono mt-1">
                        {radonData.average_complexity ?? 1.0}
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1">Scores under 5 are simple and easy to unit test.</p>
                    </div>
                  </div>

                  {radonData.complexity_blocks && radonData.complexity_blocks.length > 0 && (
                    <div className="space-y-3">
                      <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Functions & Blocks Complexity
                      </h5>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {radonData.complexity_blocks.map((block, i) => (
                          <div key={i} className="bg-[#070a13]/60 border border-white/5 rounded-xl p-3 flex items-center justify-between text-xs font-mono">
                            <div>
                              <span className="text-white font-bold">{block.name}</span>
                              {block.line && <span className="text-gray-500 ml-2">Line {block.line}</span>}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-400">Complexity: {block.complexity}</span>
                              <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 font-bold">
                                {block.rank || 'A'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: AI SUGGESTIONS */}
              {activeTab === 'ai' && (
                <div className="space-y-5">
                  {aiReview ? (
                    <>
                      {/* Summary */}
                      {aiReview.summary && (
                        <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-4 space-y-1">
                          <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">Analysis Overview</span>
                          <p className="text-xs text-gray-300 leading-relaxed">{aiReview.summary}</p>
                        </div>
                      )}

                      {/* Bugs */}
                      {aiReview.bugs && aiReview.bugs.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                            <Bug className="w-4 h-4" />
                            <span>Bugs & Edge Cases ({aiReview.bugs.length})</span>
                          </div>
                          <div className="space-y-2">
                            {aiReview.bugs.map((b, i) => (
                              <div key={i} className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-3 text-xs text-gray-300">
                                {b}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Performance */}
                      {aiReview.performance_tips && aiReview.performance_tips.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                            <Zap className="w-4 h-4" />
                            <span>Performance Tips ({aiReview.performance_tips.length})</span>
                          </div>
                          <div className="space-y-2">
                            {aiReview.performance_tips.map((p, i) => (
                              <div key={i} className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 text-xs text-gray-300">
                                {p}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Readability */}
                      {aiReview.readability_tips && aiReview.readability_tips.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                            <BookOpen className="w-4 h-4" />
                            <span>Readability & Architecture ({aiReview.readability_tips.length})</span>
                          </div>
                          <div className="space-y-2">
                            {aiReview.readability_tips.map((r, i) => (
                              <div key={i} className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-3 text-xs text-gray-300">
                                {r}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-[#070a13]/80 border border-white/5 rounded-2xl p-6 text-center space-y-2">
                      <Sparkles className="w-8 h-8 text-gray-500 mx-auto" />
                      <h4 className="text-sm font-bold text-white">AI Review Unavailable</h4>
                      <p className="text-xs text-gray-400 max-w-md mx-auto">
                        {aiMessage || 'Gemini AI review was skipped or hit quota limit. Static analyzer findings are still complete above.'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: IMPROVED CODE (DIFF VIEW) */}
              {activeTab === 'improved' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Monaco Diff View: Original vs. Refactored
                      </h4>
                      <p className="text-[10px] text-gray-400">Left: Your original code | Right: Gemini AI optimized code</p>
                    </div>
                    {aiReview?.improved_code && (
                      <button
                        onClick={() => handleCopyCode(aiReview.improved_code)}
                        className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-lg shadow-violet-500/20"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                      </button>
                    )}
                  </div>

                  {aiReview?.improved_code ? (
                    <div className="h-96 rounded-2xl overflow-hidden border border-white/10 bg-[#05070d]">
                      <DiffEditor
                        height="100%"
                        language="python"
                        original={code || '# Original code'}
                        modified={aiReview.improved_code}
                        theme="vs-dark"
                        options={{
                          readOnly: true,
                          minimap: { enabled: false },
                          fontSize: 12,
                          renderSideBySide: true,
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                        }}
                      />
                    </div>
                  ) : (
                    <div className="bg-[#070a13]/80 border border-white/5 rounded-2xl p-8 text-center space-y-2">
                      <Code className="w-8 h-8 text-gray-500 mx-auto" />
                      <h4 className="text-sm font-bold text-white">No Refactored Code Provided</h4>
                      <p className="text-xs text-gray-400 max-w-md mx-auto">
                        {aiMessage || 'The AI review did not produce an alternative implementation for this snippet, or Gemini was offline.'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnalyzePanel;
