import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Fetch current user details
  const fetchCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      const data = await authService.getCurrentUser();
      setUser(data);
    } catch (error) {
      // Token is invalid/expired
      logout(false); // Logout silently on init load failure
    } finally {
      setLoading(false);
    }
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      setLoading(true);
      const data = await authService.login(email, password);
      const { access_token } = data;
      
      localStorage.setItem('token', access_token);
      setToken(access_token);
      
      // Fetch user profile after setting token
      const userResponse = await authService.getCurrentUser();
      setUser(userResponse);
      toast.success('Successfully logged in!');
      return userResponse;
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (fullName, email, password, confirmPassword) => {
    try {
      setLoading(true);
      await authService.register(fullName, email, password, confirmPassword);
      toast.success('Registration successful! Please login.');
    } catch (error) {
      toast.error(error.message || 'Registration failed.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = useCallback((showToast = true) => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    if (showToast) {
      toast.success('Logged out successfully.');
    }
  }, []);

  // Check user status on mount
  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token, fetchCurrentUser]);

  // Handle global JWT expiration events from Axios interceptor
  useEffect(() => {
    const handleAuthExpired = () => {
      logout(false);
      toast.error('Session expired. Please log in again.');
    };
    
    window.addEventListener('auth-expired', handleAuthExpired);
    return () => {
      window.removeEventListener('auth-expired', handleAuthExpired);
    };
  }, [logout]);

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
