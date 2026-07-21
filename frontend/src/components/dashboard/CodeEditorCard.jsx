import React from 'react';
import { Copy, Trash2, ClipboardPaste, Code2 } from 'lucide-react';

const CodeEditorCard = () => {
  return (
    <div className="bg-[#0c101f] border border-white/5 rounded-3xl p-1 flex flex-col h-full shadow-xl">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#070a13]/50 rounded-t-[22px]">
        <div className="flex items-center space-x-2">
          <Code2 className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-semibold text-gray-300 tracking-wider uppercase">Language: Python</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors tooltip-trigger group relative">
            <ClipboardPaste className="w-4 h-4" />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Paste</span>
          </button>
          <button className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors group relative">
            <Copy className="w-4 h-4" />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Copy</span>
          </button>
          <div className="w-px h-4 bg-white/10 mx-1"></div>
          <button className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors group relative">
            <Trash2 className="w-4 h-4" />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Clear</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 bg-[#05070d] rounded-b-[22px] p-4 relative font-mono text-sm group">
        <textarea
          className="w-full h-full bg-transparent text-gray-300 resize-none focus:outline-none placeholder:text-gray-700 leading-relaxed"
          placeholder="# Paste your Python code here...&#10;&#10;def analyze_code():&#10;    print('Ready for AI review!')"
          spellCheck="false"
        ></textarea>
        
        {/* Decorative line numbers simulation */}
        <div className="absolute left-0 top-0 bottom-0 w-12 border-r border-white/5 bg-[#070a13]/50 rounded-bl-[22px] pointer-events-none flex flex-col items-center py-4 text-xs text-gray-600 select-none">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorCard;
