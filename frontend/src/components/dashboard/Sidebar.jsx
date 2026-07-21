import React, { useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { 
  X, 
  Terminal, 
  LayoutDashboard, 
  Code2, 
  History,
  FileText, 
  User, 
  Settings, 
  LogOut 
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();
  const sidebarRef = useRef(null);

  // Close sidebar on click outside on mobile/tablet
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'New Review', path: '/reviews', icon: Code2 },
    { name: 'Review History', path: '/history', icon: History },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        ref={sidebarRef}
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#0a0d14]/95 backdrop-blur-md border-r border-white/5 flex flex-col justify-between transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="p-6 flex items-center justify-between border-b border-white/5">
            <Link to="/dashboard" className="flex items-center space-x-3 group" onClick={() => setIsOpen(false)}>
              <div className="p-2 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                CodePilot AI
              </span>
            </Link>
            
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-4 flex flex-col gap-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                      isActive
                        ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                        : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10 transition-all duration-200 group"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
