import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  Menu, 
  Search, 
  Bell, 
  ChevronDown, 
  User as UserIcon, 
  LogOut, 
  Settings,
  HelpCircle
} from 'lucide-react';

const Navbar = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#070a13]/80 backdrop-blur-md border-b border-gray-800/80 px-6 py-4 flex items-center justify-between">
      {/* Mobile Toggle & Search */}
      <div className="flex items-center space-x-4 flex-1">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search bar */}
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reviews, reports, or files..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg glass-input text-gray-200 placeholder-gray-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Right Navbar Tools */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg relative transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full ring-2 ring-[#070a13]"></span>
        </button>

        {/* Divider */}
        <span className="h-6 w-px bg-gray-800 hidden sm:block"></span>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-3 p-1.5 hover:bg-gray-800/50 rounded-lg transition text-left"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>

            {/* Name/Info */}
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-gray-200 leading-tight">
                {user?.full_name || 'Developer'}
              </p>
              <p className="text-[10px] text-gray-400 leading-none mt-0.5">
                {user?.email || 'user@example.com'}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-800 bg-[#0c101f] shadow-2xl p-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2.5 border-b border-gray-800">
                <p className="text-xs text-gray-400">Signed in as</p>
                <p className="text-sm font-semibold text-gray-200 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>My Profile</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition"
                >
                  <Settings className="w-4 h-4" />
                  <span>Account Settings</span>
                </Link>
                <a
                  href="#support"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Help & Support</span>
                </a>
              </div>

              <div className="border-t border-gray-800 p-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
