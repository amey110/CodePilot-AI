import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

import { reviewService } from "../../services/reviewService";
import { useReview } from "../../context/ReviewContext";

import UploadZone from "./UploadZone";
import FilePreview from "./FilePreview";
import MonacoEditor from "../editor/MonacoEditor";
import EditorToolbar from "../editor/EditorToolbar";
import AnalyzePanel from "./AnalyzePanel";

const ReviewWorkspace = () => {

  const { code, setCode } = useReview();

  // Core states
  const [file, setFile] = useState(null);
  
  // Analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  // Editor configuration states
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState('vs-dark');
  const [readOnly, setReadOnly] = useState(false);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorWrapperRef = useRef(null);

  // Synchronize fullscreen mode status
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === editorWrapperRef.current);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleFileLoaded = (loadedFile) => {
    setFile({
      name: loadedFile.name,
      size: loadedFile.size
    });
    setCode(loadedFile.content);
    
    if (loadedFile.analysisResults) {
      setAnalysisData(loadedFile.analysisResults);
      setAnalysisCompleted(true);
      
      const pylint = loadedFile.analysisResults.analysis?.pylint;
      if (pylint) {
        reviewService.saveReviewToHistory(
          loadedFile.name,
          pylint.score,
          loadedFile.size,
          pylint.rating,
          pylint.issues ? pylint.issues.length : 0
        );
      }
    } else {
      setAnalysisData(null);
      setAnalysisCompleted(false);
    }
    setIsAnalyzing(false);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setCode('');
    setAnalysisData(null);
    setIsAnalyzing(false);
    setAnalysisCompleted(false);
    toast.success('File removed from workspace');
  };

  const handleCodeChange = (newVal) => {
    setCode(newVal || '');
    if (analysisCompleted) {
      setAnalysisCompleted(false);
      setAnalysisData(null);
    }
  };

  // Toolbar action helpers
  const handleCopy = async () => {
    if (!code) {
      toast.error('Editor is empty! Nothing to copy.');
      return false;
    }
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Code copied to clipboard');
      return true;
    } catch (err) {
      toast.error('Failed to copy code. Please select and copy manually.');
      return false;
    }
  };

  const handlePaste = async () => {
    if (readOnly) {
      toast.error('Editor is in read-only mode!');
      return;
    }
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setCode(text);
        setFile(null); // Clear file tag if they pasted over it
        setIsAnalyzing(false);
        setAnalysisCompleted(false);
        toast.success('Pasted clipboard contents into editor');
      } else {
        toast.error('Clipboard is empty or contains non-text elements');
      }
    } catch (err) {
      toast.error('Browser blocked clipboard access. Press Ctrl+V (or Cmd+V) directly inside the editor.');
    }
  };

  const handleClear = () => {
    if (!code && !file) return;
    setCode('');
    setFile(null);
    setAnalysisData(null);
    setIsAnalyzing(false);
    setAnalysisCompleted(false);
    toast.success('Workspace cleared');
  };

  const handleToggleFullscreen = () => {
    if (!editorWrapperRef.current) return;

    if (!isFullscreen) {
      if (editorWrapperRef.current.requestFullscreen) {
        editorWrapperRef.current.requestFullscreen();
      } else if (editorWrapperRef.current.webkitRequestFullscreen) { /* Safari */
        editorWrapperRef.current.webkitRequestFullscreen();
      } else if (editorWrapperRef.current.msRequestFullscreen) { /* IE11 */
        editorWrapperRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 md:gap-8 h-auto">
      
      {/* LEFT COLUMN: Upload & File management (40% width on xl screens) */}
      <div className="xl:col-span-2 flex flex-col space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#0c101f] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col h-full relative"
        >
          <div className="flex items-center space-x-2.5 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse"></span>
            <h3 className="text-base font-bold text-white tracking-wide uppercase">
              Python File Ingestion
            </h3>
          </div>
          
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            Upload your python script directly to load it into the review console. Or edit code directly on the editor board.
          </p>

          <div className="flex-grow">
            <AnimatePresence mode="wait">
              {file ? (
                <FilePreview 
                  key="preview" 
                  file={file} 
                  onRemove={handleRemoveFile} 
                />
              ) : (
                <UploadZone 
                  key="upload" 
                  onFileLoaded={handleFileLoaded} 
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* RIGHT COLUMN: Code Editor and Analyze Panel (60% width on xl screens) */}
      <div className="xl:col-span-3 flex flex-col min-w-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          ref={editorWrapperRef}
          className={`bg-[#0c101f] border border-white/5 rounded-3xl p-1 flex flex-col shadow-xl overflow-hidden transition-all duration-300 ${
            isFullscreen ? 'fixed inset-0 z-50 w-screen h-screen rounded-none border-none p-2 bg-[#070a13]' : 'h-full min-h-[500px]'
          }`}
        >
          {/* Editor Controls Toolbar */}
          <EditorToolbar
            fontSize={fontSize}
            setFontSize={setFontSize}
            theme={theme}
            setTheme={setTheme}
            readOnly={readOnly}
            setReadOnly={setReadOnly}
            onCopy={handleCopy}
            onClear={handleClear}
            onPaste={handlePaste}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
          />

          {/* Monaco Editor Container */}
          <div className="flex-1 flex flex-col min-h-0 bg-[#05070d]">
            <MonacoEditor
              value={code}
              onChange={handleCodeChange}
              fontSize={fontSize}
              theme={theme}
              readOnly={readOnly || isAnalyzing}
            />
          </div>
        </motion.div>

        {/* Analyze Panel & review summary results */}
        <AnalyzePanel
          code={code}
          file={file}
          isAnalyzing={isAnalyzing}
          setIsAnalyzing={setIsAnalyzing}
          analysisCompleted={analysisCompleted}
          setAnalysisCompleted={setAnalysisCompleted}
          analysisData={analysisData}
          setAnalysisData={setAnalysisData}
        />
      </div>

      </div>
);
};

export default ReviewWorkspace;
