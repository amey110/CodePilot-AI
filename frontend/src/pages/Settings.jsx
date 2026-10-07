import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings as SettingsIcon, 
  User, 
  Sliders, 
  Sparkles, 
  ShieldCheck, 
  Server, 
  Check, 
  Moon, 
  Cpu
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const Settings = () => {
  const { user } = useAuth();
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [autoScroll, setAutoScroll] = useState(true);
  const [aiModel, setAiModel] = useState('gemini-3.8-flash');

  const handleSavePreferences = (e) => {
    e.preventDefault();
    localStorage.setItem('codepilot_settings', JSON.stringify({
      editorTheme,
      fontSize,
      autoScroll,
      aiModel
    }));
    toast.success('Workspace preferences saved successfully!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Page Header */}
      <div>
        <div className="flex items-center space-x-2 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <SettingsIcon className="w-4 h-4" />
          <span>Configuration</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">System & Account Settings</h1>
        <p className="text-sm text-gray-400 mt-1">
          Customize your code review workspace, editor behavior, and account preferences.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column: Quick Profile Card */}
        <div className="space-y-6">
          <div className="bg-[#0c101f] border border-white/5 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-white truncate">{user?.full_name || 'Developer'}</h3>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-3">
              <Link
                to="/profile"
                className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold flex items-center justify-between transition-colors"
              >
                <span className="flex items-center space-x-2">
                  <User className="w-3.5 h-3.5 text-violet-400" />
                  <span>Edit Profile & Password</span>
                </span>
                <span className="text-gray-500">&rarr;</span>
              </Link>
            </div>
          </div>

          {/* System Services Status */}
          <div className="bg-[#0c101f] border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Connected Services
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center space-x-2 text-gray-300">
                  <Server className="w-4 h-4 text-emerald-400" />
                  <span>FastAPI Backend</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">ONLINE</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center space-x-2 text-gray-300">
                  <Cpu className="w-4 h-4 text-violet-400" />
                  <span>Google Gemini 3.8</span>
                </div>
                <span className="text-[10px] font-mono text-violet-400 font-bold">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center space-x-2 text-gray-300">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Bandit & Flake8</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">READY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Preferences Form */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSavePreferences} className="bg-[#0c101f] border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
            <div className="flex items-center space-x-2.5 border-b border-white/5 pb-4">
              <Sliders className="w-5 h-5 text-violet-400" />
              <h3 className="text-base font-bold text-white">Editor & Analysis Preferences</h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-2">Editor Theme</label>
                <select
                  value={editorTheme}
                  onChange={(e) => setEditorTheme(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#070a13] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="vs-dark">CodePilot Dark (Default)</option>
                  <option value="vs-light">Light Mode</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-2">Font Size (px)</label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#070a13] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                >
                  <option value={12}>12 px</option>
                  <option value={14}>14 px (Default)</option>
                  <option value={16}>16 px</option>
                  <option value={18}>18 px</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-2">Preferred AI Model</label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#070a13] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="gemini-3.8-flash">Gemini 3.8 Flash (Recommended)</option>
                  <option value="gemini-flash-latest">Gemini Flash Latest</option>
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center space-x-3 cursor-pointer py-2.5">
                  <input
                    type="checkbox"
                    checked={autoScroll}
                    onChange={(e) => setAutoScroll(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-violet-600 focus:ring-violet-500"
                  />
                  <span className="text-xs font-medium text-gray-300">Auto-focus results tab on analysis</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/5">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-violet-500/20 transition-all cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
