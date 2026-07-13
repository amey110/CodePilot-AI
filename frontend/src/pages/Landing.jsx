import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Terminal, Shield, Cpu, FileText, ArrowRight, Zap, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Cpu,
      title: 'Generative AI Reviewer',
      description: 'Leverages Google Gemini API to analyze files for design patterns, maintainability, and architectural bugs.'
    },
    {
      icon: Shield,
      title: 'Automated Security Scans',
      description: 'Run deep security checks for vulnerable patterns, memory leaks, and dependency risks.'
    },
    {
      icon: Zap,
      title: 'Static Analysis Linting',
      description: 'Integrates Radon complexity checks, Pylint errors, Flake8 structure, and Bandit vulnerabilities.'
    },
    {
      icon: FileText,
      title: 'Professional PDF Reports',
      description: 'Generate and download comprehensive PDF summary files detailing linter findings and AI recommendations.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#070a13] text-gray-100 flex flex-col relative overflow-hidden">
      {/* Decorative glows */}
      <div className="bg-glow-purple top-[-100px] right-[-100px] opacity-40"></div>
      <div className="bg-glow-blue bottom-[-150px] left-[-150px] opacity-40"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-800/80 bg-[#070a13]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-violet-600 rounded-lg">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            AI Code Reviewer
          </span>
        </div>

        <div>
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button size="sm">Go to Dashboard</Button>
            </Link>
          ) : (
            <div className="space-x-3">
              <Link to="/login">
                <Button size="sm" variant="outline">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-grow flex flex-col items-center justify-center text-center px-6 py-20 md:py-32 max-w-5xl mx-auto z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-violet-500/25 bg-violet-950/20 text-violet-400 text-xs font-semibold tracking-wider uppercase mb-2 animate-pulse">
            <Zap className="w-3.5 h-3.5" />
            <span>Now in Open Beta</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none text-white max-w-4xl">
            Automate Your Code Reviews <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
              With Generative AI.
            </span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
            Upload files or paste scripts into Monaco Editor. Receive structural analysis, maintainability scores, and refactoring guidelines in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <Button size="lg" className="w-full sm:w-auto" icon={ArrowRight}>
                Get Started for Free
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Explore Features
              </Button>
            </a>
          </div>

          {/* Value props banner */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 pt-16 max-w-3xl mx-auto text-gray-500 text-sm">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-4 h-4 text-violet-500" />
              <span>Python, JS, Java Support</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-4 h-4 text-violet-500" />
              <span>Static Analysis Linter</span>
            </div>
            <div className="flex items-center justify-center space-x-2 col-span-2 md:col-span-1">
              <CheckCircle className="w-4 h-4 text-violet-500" />
              <span>Docker compose ready</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="px-6 py-20 bg-gray-950/20 border-t border-gray-900 z-10 relative">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              SaaS Level Architecture
            </h2>
            <p className="text-gray-400 max-w-md mx-auto text-sm">
              Built using industry-standard engineering guidelines for performance, security, and extensibility.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card hover className="h-full flex flex-col items-start text-left border-gray-800/80 bg-gray-900/10">
                    <div className="p-3 bg-violet-950/40 rounded-xl border border-violet-500/20 text-violet-400 mb-5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-100 mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-xs leading-relaxed font-light">{feature.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-gray-500 border-t border-gray-900 bg-gray-950/40 z-10 relative">
        &copy; {new Date().getFullYear()} AI Code Reviewer. Designed and developed with best practices.
      </footer>
    </div>
  );
};

export default Landing;
