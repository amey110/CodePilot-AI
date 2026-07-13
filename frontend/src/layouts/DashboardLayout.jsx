import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#070a13] text-gray-100 flex overflow-hidden">
      
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative z-10">
        
        {/* Top Navigation Bar */}
        <Navbar setSidebarOpen={setSidebarOpen} />

        {/* Viewport content */}
        <main className="flex-grow p-6 md:p-8 max-w-7xl w-full mx-auto relative">
          {/* Subtle decoration background glows */}
          <div className="bg-glow-purple top-1/4 right-1/4 animate-pulse duration-5000"></div>
          <div className="bg-glow-blue bottom-1/4 left-1/4 animate-pulse duration-8000"></div>

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
