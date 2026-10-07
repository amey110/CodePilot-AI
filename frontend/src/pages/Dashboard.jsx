import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { reviewService } from '../services';
import { formatQuickStats } from '../constants';
import {
  WelcomeCard,
  QuickStats,
  RecentReviews,
  ActivityTimeline,
  EmptyState
} from '../components/dashboard';
import ReviewWorkspace from '../components/review/ReviewWorkspace';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userName = user?.full_name ? user.full_name.split(' ')[0] : 'Developer';

  // Fetch real stats from backend API
  const { data: statsData } = useQuery({
    queryKey: ['stats'],
    queryFn: reviewService.getStats,
    staleTime: 1000 * 60 * 2,
  });

  // Fetch real reviews from backend API
  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews'],
    queryFn: () => reviewService.getReviews(1, 5),
    staleTime: 1000 * 60 * 2,
  });

  const formattedStats = formatQuickStats(statsData);
  const hasReviews = reviews.length > 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <WelcomeCard userName={userName} />
      <QuickStats stats={formattedStats} />

      {/* Code Review Workspace */}
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
  );
};

export default Dashboard;
