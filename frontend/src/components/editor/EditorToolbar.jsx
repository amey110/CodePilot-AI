import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Trash2, 
  ClipboardPaste, 
  Maximize2, 
  Minimize2, 
  Lock, 
  Unlock,
  ChevronDown
} from 'lucide-react';
import LanguageSelector from './LanguageSelector';

const EditorToolbar = ({
  fontSize,
  setFontSize,
  theme,
  setTheme,
  readOnly,
  setReadOnly,
  onCopy,
  onClear,
  onPaste,
  isFullscreen,
  onToggleFullscreen
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await onCopy();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 border-b border-white/5 bg-[#0b0f19] rounded-t-2xl">
      {/* Left side: Language and Toggle Options */}
      <div className="flex items-center space-x-3 flex-wrap gap-y-2">
        <LanguageSelector />
        
        {/* Read-Only Toggle */}
        <button
          onClick={() => setReadOnly(!readOnly)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
            readOnly
              ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
              : 'bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
          }`}
          title={readOnly ? 'Locked: Read Only' : 'Editable'}
        >
          {readOnly ? (
            <>
              <Lock className="w-3.5 h-3.5" />
              <span>Read-Only</span>
            </>
          ) : (
            <>
              <Unlock className="w-3.5 h-3.5" />
              <span>Editable</span>
            </>
          )}
        </button>
      </div>

      {/* Right side: Editor Controls */}
      <div className="flex items-center space-x-2 flex-wrap gap-y-2">
        {/* Font Size Selector */}
        <div className="relative flex items-center bg-white/5 border border-white/5 rounded-lg px-2 py-1 text-xs">
          <span className="text-gray-500 mr-2 font-medium">Font:</span>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="bg-transparent text-gray-200 focus:outline-none cursor-pointer pr-1 font-semibold"
          >
            <option value={12} className="bg-[#0b0f19]">12px</option>
            <option value={14} className="bg-[#0b0f19]">14px</option>
            <option value={16} className="bg-[#0b0f19]">16px</option>
            <option value={18} className="bg-[#0b0f19]">18px</option>
            <option value={20} className="bg-[#0b0f19]">20px</option>
          </select>
        </div>

        {/* Theme Selector */}
        <div className="relative flex items-center bg-white/5 border border-white/5 rounded-lg px-2 py-1 text-xs">
          <span className="text-gray-500 mr-2 font-medium">Theme:</span>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="bg-transparent text-gray-200 focus:outline-none cursor-pointer pr-1 font-semibold"
          >
            <option value="vs-dark" className="bg-[#0b0f19]">Dark (vs-dark)</option>
            <option value="light" className="bg-[#0b0f19]">Light (vs-light)</option>
            <option value="hc-black" className="bg-[#0b0f19]">High Contrast</option>
          </select>
        </div>

        <div className="w-px h-5 bg-white/10 mx-1 hidden sm:block"></div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1">
          {/* Paste */}
          <button
            onClick={onPaste}
            className="p-2 text-gray-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all duration-200 group relative"
            title="Paste Code"
          >
            <ClipboardPaste className="w-4 h-4" />
            <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-900 border border-white/10 text-[10px] text-gray-300 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
              Paste
            </span>
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="p-2 text-gray-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all duration-200 group relative"
            title="Copy Code"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-900 border border-white/10 text-[10px] text-gray-300 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
              {copied ? 'Copied!' : 'Copy Code'}
            </span>
          </button>

          {/* Clear */}
          <button
            onClick={onClear}
            className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all duration-200 group relative"
            title="Clear Editor"
          >
            <Trash2 className="w-4 h-4" />
            <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-900 border border-white/10 text-[10px] text-gray-300 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
              Clear
            </span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={onToggleFullscreen}
            className="p-2 text-gray-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all duration-200 group relative"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
            <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-900 border border-white/10 text-[10px] text-gray-300 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
              {isFullscreen ? 'Exit' : 'Fullscreen'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;
