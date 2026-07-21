import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, TopNavbar } from '../components/dashboard';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#070a13] text-gray-100 flex overflow-hidden selection:bg-violet-500/30">
      
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative z-10 scroll-smooth">
        
        {/* Top Navigation Bar */}
        <TopNavbar setSidebarOpen={setSidebarOpen} />

        {/* Viewport content */}
        <main className="flex-grow p-4 md:p-6 lg:p-8 max-w-[1600px] w-full mx-auto relative">
          {/* Subtle decoration background glows for overall layout */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-violet-900/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none -z-10"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none -z-10"></div>

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
