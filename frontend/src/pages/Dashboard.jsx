import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { stats } from '../constants';
import {
  WelcomeCard,
  QuickStats,
  RecentReviews,
  ActivityTimeline,
  EmptyState
} from '../components/dashboard';
import ReviewWorkspace from '../components/review/ReviewWorkspace';

const Dashboard = ({ mockSection }) => {
  const { user } = useAuth();
  const userName = user?.full_name ? user.full_name.split(' ')[0] : 'Developer';

  // Demonstrating the premium state; in a real app this would be state-driven
  const hasReviews = true; 

  if (mockSection) {
    // Keeping the original mockSection logic intact as requested for routing functionality
    const titles = {
      reviews: 'New Code Review',
      history: 'Review History Archive',
      settings: 'System & Account Settings'
    };
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{titles[mockSection]}</h1>
          <p className="text-sm text-gray-400 mt-1">This module is part of Phase 2.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <WelcomeCard userName={userName} />
      <QuickStats stats={stats} />
      
      {hasReviews ? (
        <div className="space-y-8">
          {/* Professional AI Code Review Workspace */}
          <ReviewWorkspace />
          
          {/* Recent Reviews & Timeline */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
            <div className="xl:col-span-2">
              <RecentReviews />
            </div>
            <div className="flex flex-col space-y-6 md:space-y-8">
              <ActivityTimeline />
            </div>
          </div>
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default Dashboard;

