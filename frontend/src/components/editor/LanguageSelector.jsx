import React from 'react';
import { Terminal } from 'lucide-react';

const LanguageSelector = () => {
  return (
    <div className="flex items-center space-x-2 bg-violet-950/40 border border-violet-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold text-violet-300 tracking-wide select-none">
      <Terminal className="w-3.5 h-3.5 text-violet-400" />
      <span>Python 3.x</span>
    </div>
  );
};

export default LanguageSelector;
