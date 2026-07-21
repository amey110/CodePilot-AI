import { FileCode2, ShieldAlert, BarChart3, History } from 'lucide-react';

export const stats = [
  { label: 'Total Reviews', value: '28', icon: FileCode2, color: 'text-violet-400', bg: 'bg-violet-950/30' },
  { label: 'Average Score', value: '84.5%', icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-950/30' },
  { label: 'Security Alerts', value: '3', icon: ShieldAlert, color: 'text-rose-400', bg: 'bg-rose-950/30' },
  { label: 'Saved Reports', value: '15', icon: History, color: 'text-blue-400', bg: 'bg-blue-950/30' },
];

export const recentReviews = [
  { id: 1, filename: 'auth_middleware.py', language: 'Python', score: 92, status: 'Completed', date: '2026-07-13' },
  { id: 2, filename: 'UserProfile.jsx', language: 'JavaScript', score: 78, status: 'Completed', date: '2026-07-12' },
  { id: 3, filename: 'PaymentGateway.java', language: 'Java', score: 83, status: 'Completed', date: '2026-07-10' },
];
