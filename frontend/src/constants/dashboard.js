import { FileCode2, ShieldAlert, BarChart3, History } from 'lucide-react';

export const statDefinitions = [
  { key: 'total_reviews', label: 'Total Reviews', icon: FileCode2, color: 'text-violet-400', bg: 'bg-violet-950/30' },
  { key: 'average_score', label: 'Average Score', icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-950/30', isPercentage: true },
  { key: 'total_issues', label: 'Issues Found', icon: ShieldAlert, color: 'text-rose-400', bg: 'bg-rose-950/30' },
  { key: 'saved_reports', label: 'Saved Reports', icon: History, color: 'text-blue-400', bg: 'bg-blue-950/30' },
];

// Helper to format stats from backend into displayable items
export const formatQuickStats = (statsData) => {
  if (!statsData) {
    return statDefinitions.map((s) => ({
      ...s,
      value: s.isPercentage ? '0%' : '0',
    }));
  }

  const totalReviews = statsData.total_reviews ?? 0;
  const avgScore = statsData.average_score ?? 0;
  const totalIssues = statsData.total_issues ?? 0;

  return [
    { label: 'Total Reviews', value: String(totalReviews), icon: FileCode2, color: 'text-violet-400', bg: 'bg-violet-950/30' },
    { label: 'Average Score', value: `${avgScore}%`, icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-950/30' },
    { label: 'Issues Found', value: String(totalIssues), icon: ShieldAlert, color: 'text-rose-400', bg: 'bg-rose-950/30' },
    { label: 'Saved Reports', value: String(totalReviews), icon: History, color: 'text-blue-400', bg: 'bg-blue-950/30' },
  ];
};
