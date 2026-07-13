import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';

// Pages
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

// Guard
import { ProtectedRoute } from './ProtectedRoute';

// Public Route Guard (Redirect authenticated users away from login/register to dashboard)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const AppRoutes = () => {
  return (
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
          <Route path="/profile" element={<Profile />} />
          
          {/* Future Modules Placeholders */}
          <Route path="/reviews" element={<Dashboard mockSection="reviews" />} />
          <Route path="/history" element={<Dashboard mockSection="history" />} />
          <Route path="/settings" element={<Dashboard mockSection="settings" />} />
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
