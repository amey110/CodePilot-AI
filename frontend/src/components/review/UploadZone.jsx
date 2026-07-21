import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileCode2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { reviewService } from '../../services';

const UploadZone = ({ onFileLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    if (!file) return;

    // Check extension
    const extension = file.name.split('.').pop().toLowerCase();
    if (extension !== 'py') {
      toast.error('Invalid file type! Only Python (.py) files are allowed.');
      return;
    }

    // Check file size (5MB limit to match backend review_service.py)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large! Max file size allowed is 5MB.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Read local file contents first so editor can show it instantly
    const reader = new FileReader();
    reader.onload = async (e) => {
      const localContent = e.target.result;

      try {
        // Upload the file to the backend
        const apiResponse = await reviewService.uploadFile(file, (progress) => {
          setUploadProgress(progress);
        });

        // Pass results up
        onFileLoaded({
          name: file.name,
          size: file.size,
          content: localContent,
          analysisResults: apiResponse
        });

        toast.success(`Successfully analyzed ${file.name}`);
      } catch (error) {
        console.error('Upload/Analysis error:', error);
        
        // Pass content with error details to show beautiful error card in workspace
        onFileLoaded({
          name: file.name,
          size: file.size,
          content: localContent,
          error: error.message || 'Backend service error. Please check if the server is running.'
        });
        
        toast.error(error.message || 'Server error occurred during code analysis.');
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    };

    reader.onerror = () => {
      toast.error('Failed to read file locally.');
      setIsUploading(false);
      setUploadProgress(0);
    };

    reader.readAsText(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".py"
        className="hidden"
      />

      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!isUploading ? triggerFileSelect : undefined}
        className={`relative flex-1 min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-8 transition-all duration-300 ${
          isUploading ? 'cursor-not-allowed bg-violet-950/5 border-violet-500/20' : 'cursor-pointer'
        } ${
          isDragging 
            ? 'border-violet-500 bg-violet-950/10 shadow-[0_0_20px_rgba(139,92,246,0.15)] scale-[1.01]' 
            : 'border-white/10 hover:border-violet-500/50 hover:bg-white/5'
        }`}
        whileHover={!isUploading ? { scale: 1.005 } : {}}
      >
        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center text-center space-y-4 w-full max-w-xs"
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
                <FileCode2 className="w-6 h-6 text-violet-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white">Ingesting Python Script</h4>
                <p className="text-xs text-gray-500 mt-1">
                  {uploadProgress < 100 
                    ? `Uploading script... ${uploadProgress}%`
                    : 'Running Pylint AST analysis...'}
                </p>
              </div>

              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <span className="text-xs text-violet-400 font-mono font-semibold">{uploadProgress}%</span>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center text-center"
            >
              <div className="p-5 bg-white/5 rounded-2xl mb-5 border border-white/5 hover:border-violet-500/20 hover:bg-violet-500/10 hover:scale-110 transition-all duration-300">
                <UploadCloud className="w-10 h-10 text-gray-400 hover:text-violet-400 transition-colors" />
              </div>
              
              <h3 className="text-base font-bold text-white mb-1.5">
                Drag & drop your Python file
              </h3>
              <p className="text-xs text-gray-400 mb-6 max-w-[200px] leading-relaxed">
                Accepts only <span className="text-violet-400 font-semibold font-mono">.py</span> files up to 5MB
              </p>
              
              <button 
                type="button"
                className="px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-xl transition-all duration-200 shadow-md shadow-violet-900/20 hover:shadow-violet-900/40 active:scale-95"
              >
                Browse Files
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {isDragging && (
          <div className="absolute inset-0 rounded-3xl bg-violet-500/5 blur-xl pointer-events-none -z-10" />
        )}
      </motion.div>
    </div>
  );
};

export default UploadZone;
