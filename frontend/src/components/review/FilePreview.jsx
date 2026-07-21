import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, FileCode, CheckCircle2 } from 'lucide-react';

const FilePreview = ({ file, onRemove }) => {
  if (!file) return null;

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="bg-[#0b0f19]/80 border border-violet-500/10 rounded-3xl p-6 shadow-xl relative overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-violet-500/10 rounded-2xl border border-violet-500/20 text-violet-400">
              <FileCode className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white max-w-[200px] truncate" title={file.name}>
                {file.name}
              </h3>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                {formatBytes(file.size)}
              </p>
            </div>
          </div>

          <button
            onClick={onRemove}
            className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-200"
            title="Remove File"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Ready for Review</span>
          </div>
          <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">
            Python Script
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default FilePreview;
