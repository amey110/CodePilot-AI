import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  FileCode2, 
  ShieldAlert, 
  BarChart3, 
  History, 
  Plus, 
  UploadCloud, 
  Code,
  AlertCircle
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Dashboard = ({ mockSection }) => {
  const { user } = useAuth();

  // If a mock section was clicked from the sidebar, render its details page layout
  if (mockSection) {
    const titles = {
      reviews: 'New Code Review',
      history: 'Review History Archive',
      settings: 'System & Account Settings'
    };

    const descriptions = {
      reviews: 'Upload Python, JavaScript, or Java source files or paste scripts into Monaco Editor to run AI-powered static analysis scans.',
      history: 'Review past reports, inspect score metrics, search file names, and download offline PDF summary copies.',
      settings: 'Manage connection strings, toggle theme presets, update API keys, and edit account profile details.'
    };

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{titles[mockSection]}</h1>
          <p className="text-sm text-gray-400 mt-1">{descriptions[mockSection]}</p>
        </div>

        <Card className="border border-violet-500/20 bg-gradient-to-br from-violet-950/10 to-indigo-950/10 py-12 text-center max-w-4xl">
          <div className="p-4 bg-violet-600/10 rounded-full border border-violet-500/30 text-violet-400 w-fit mx-auto mb-4">
            <Code className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-100">Phase 2 Integration Ready</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto mt-2 leading-relaxed">
            This module has been structurally declared and is connected to the router guard. In Phase 2, we will integrate Gemini API, Monaco Editor, static linters, and PDF generation services.
          </p>
          <Button size="md" className="mt-6" disabled>
            Module Locked
          </Button>
        </Card>
      </div>
    );
  }

  // Sample data to make the SaaS dashboard look alive and commercial
  const stats = [
    { label: 'Total Reviews', value: '28', icon: FileCode2, color: 'text-violet-400', bg: 'bg-violet-950/30' },
    { label: 'Average Score', value: '84.5%', icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-950/30' },
    { label: 'Security Alerts', value: '3', icon: ShieldAlert, color: 'text-rose-400', bg: 'bg-rose-950/30' },
    { label: 'Saved Reports', value: '15', icon: History, color: 'text-blue-400', bg: 'bg-blue-950/30' },
  ];

  const recentReviews = [
    { id: 1, filename: 'auth_middleware.py', language: 'Python', score: 92, status: 'Completed', date: '2026-07-13' },
    { id: 2, filename: 'UserProfile.jsx', language: 'JavaScript', score: 78, status: 'Completed', date: '2026-07-12' },
    { id: 3, filename: 'PaymentGateway.java', language: 'Java', score: 83, status: 'Completed', date: '2026-07-10' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.full_name ? user.full_name.split(' ')[0] : 'Developer'}!
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Here is the current state of your code review and quality audits.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="md">
            View Analytics
          </Button>
          <Button size="md" icon={Plus}>
            New Review
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} hover className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} border border-white/5`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold">{stat.label}</p>
                <p className="text-xl md:text-2xl font-bold text-white mt-0.5">{stat.value}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Layout Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Columns - New Review Mockup Box */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="h-full flex flex-col justify-between">
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-white">Create New Code Audit</h2>
              <p className="text-xs text-gray-400">
                Upload raw source files or copy code into our Monaco Editor block below.
              </p>
            </div>

            {/* Mock drag & drop upload container */}
            <div className="border-2 border-dashed border-gray-800 hover:border-violet-500/50 rounded-xl p-8 text-center bg-gray-900/10 transition cursor-pointer my-6">
              <UploadCloud className="w-10 h-10 text-gray-500 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-300">Drag & drop files here</p>
              <p className="text-xs text-gray-500 mt-1">Accepts .py, .js, and .java files (Max 5MB)</p>
            </div>

            {/* Language Selection & Submit Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-800/50">
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <span className="text-xs font-semibold text-gray-400">Language:</span>
                <select className="bg-gray-950/60 border border-gray-800 text-sm text-gray-200 py-1.5 px-3 rounded-lg focus:outline-none focus:border-violet-500/50 cursor-pointer">
                  <option>Python (.py)</option>
                  <option>JavaScript (.js)</option>
                  <option>Java (.java)</option>
                </select>
              </div>
              <Button size="md" className="w-full sm:w-auto" disabled>
                Run AI Review
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column - Recent Reviews Card */}
        <div className="space-y-6">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Recent Audits</h2>
                <a href="#history" className="text-xs text-violet-400 hover:text-violet-300 font-bold transition">
                  View All
                </a>
              </div>

              {/* Reviews List */}
              <div className="space-y-3.5">
                {recentReviews.map((rev) => (
                  <div 
                    key={rev.id} 
                    className="flex items-center justify-between p-3.5 rounded-xl bg-gray-950/30 border border-gray-800/40 hover:border-gray-800 transition"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-200 truncate">{rev.filename}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[10px] bg-gray-800 text-gray-400 py-0.5 px-1.5 rounded">
                          {rev.language}
                        </span>
                        <span className="text-[10px] text-gray-500">{rev.date}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-sm font-bold ${
                        rev.score >= 90 ? 'text-emerald-400' : rev.score >= 80 ? 'text-violet-400' : 'text-amber-400'
                      }`}>
                        {rev.score}/100
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Informational Hint Banner */}
            <div className="mt-6 flex items-start space-x-3 p-3 bg-violet-950/15 border border-violet-800/20 rounded-xl text-violet-300">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <p className="text-[11px] leading-relaxed">
                Mock statistics and reviews shown above. Real-time Gemini reviews and local linter scans will be unlocked in Phase 2.
              </p>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
