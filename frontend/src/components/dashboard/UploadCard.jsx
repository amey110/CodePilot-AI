import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FileType2 } from 'lucide-react';

const UploadCard = () => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="bg-[#0c101f] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col h-full relative overflow-hidden">
      <div className="flex items-center space-x-2 mb-4">
        <FileType2 className="w-5 h-5 text-violet-400" />
        <h3 className="text-lg font-bold text-white">Upload File</h3>
      </div>
      
      <p className="text-sm text-gray-400 mb-6">
        Drag and drop your Python scripts to run instant static analysis and AI reviews.
      </p>

      <motion.div
        animate={{ 
          borderColor: isDragging ? 'rgba(139, 92, 246, 0.8)' : 'rgba(255, 255, 255, 0.1)',
          backgroundColor: isDragging ? 'rgba(139, 92, 246, 0.05)' : 'rgba(0, 0, 0, 0.2)'
        }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
        className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 transition-colors cursor-pointer group"
      >
        <div className="p-4 bg-white/5 rounded-full mb-4 group-hover:bg-violet-500/20 group-hover:scale-110 transition-all duration-300">
          <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-violet-400" />
        </div>
        <p className="text-sm font-semibold text-gray-200 mb-1">Drag & drop your file here</p>
        <p className="text-xs text-gray-500 mb-6">Supports .py files up to 10MB</p>
        
        <button className="px-6 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-xl transition-colors ring-1 ring-inset ring-white/10">
          Browse Files
        </button>
      </motion.div>
    </div>
  );
};

export default UploadCard;
