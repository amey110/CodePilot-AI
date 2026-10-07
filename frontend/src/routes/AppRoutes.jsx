import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { SkeletonPage } from '../components/ui/SkeletonLoader';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';

// Lazy Loaded Pages for performance and code splitting
const Landing = lazy(() => import('../pages/Landing'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Reviews = lazy(() => import('../pages/Reviews'));
const History = lazy(() => import('../pages/History'));
const ReviewDetail = lazy(() => import('../pages/ReviewDetail'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Guard
import { ProtectedRoute } from './ProtectedRoute';

// Public Route Guard (Redirect authenticated users away from login/register to dashboard)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<SkeletonPage />}>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Landing />} />
        
        {/* Auth Pages wrapped in AuthLayout */}
        <Route element={<AuthLayout />}>
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
        </Route>

        {/* Protected Pages wrapped in DashboardLayout & ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/reviews/:id" element={<ReviewDetail />} />
            <Route path="/history" element={<History />} />
            <Route path="/reports" element={<Navigate to="/history" replace />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
