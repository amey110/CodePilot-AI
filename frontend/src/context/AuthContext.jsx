import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services';
import { queryClient } from '../lib/queryClient';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const isLoggingOutRef = useRef(false);
  const navigate = useNavigate();

  // Comprehensive Logout handler: cleans up tokens, storage, cookies, caches, and global state
  const logout = useCallback((showToast = true) => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;

    // 1. Dismiss any previous session-expired toast
    toast.dismiss('session-expired');

    // 2. Clear token & user from storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('codepilot_settings');
    sessionStorage.clear();

    // 3. Clear any accessible document cookies
    try {
      document.cookie.split(';').forEach((cookie) => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
      });
    } catch {
      // Safe fallback if cookies restricted
    }

    // 4. Reset React Query cache completely so no previous user queries linger
    queryClient.clear();

    // 5. Notify all context providers and workspaces (e.g. ReviewContext, Monaco)
    window.dispatchEvent(new Event('auth-logout'));

    // 6. Reset local state
    setToken(null);
    setUser(null);

    // 7. Toast feedback
    if (showToast) {
      toast.success('Logged out successfully.', { id: 'logout-success' });
    }

    // 8. Redirect cleanly to login page
    navigate('/login', { replace: true });

    // 9. Inform backend (fire and forget, silently ignore any response)
    authService.logout().catch(() => {}).finally(() => {
      isLoggingOutRef.current = false;
    });
  }, [navigate]);

  // Fetch current user details
  const fetchCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      const data = await authService.getCurrentUser();
      setUser(data);
    } catch {
      // Token is invalid/expired
      logout(false); // Logout silently on init load failure
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // Login handler
  const login = async (email, password) => {
    try {
      setLoading(true);
      // Purge any existing query cache before logging in with a new user
      queryClient.clear();
      window.dispatchEvent(new Event('auth-logout'));

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
      // Ensure no residual token or cache
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      queryClient.clear();
      await authService.register(fullName, email, password, confirmPassword);
      toast.success('Registration successful! Please login.');
    } catch (error) {
      toast.error(error.message || 'Registration failed.');
      throw error;
    }
  };

  // Check user status on mount
  useEffect(() => {
    if (token && !user) {
      fetchCurrentUser();
    } else if (!token) {
      setLoading(false);
    }
  }, [token, user, fetchCurrentUser]);

  // Handle global JWT expiration events from Axios interceptor
  useEffect(() => {
    const handleAuthExpired = () => {
      // If already logged out or in the process of logging out, ignore
      if (isLoggingOutRef.current || !localStorage.getItem('token')) {
        return;
      }
      logout(false);
      // Deduplicate with specific toast ID so it can never stack multiple times
      toast.error('Session expired. Please log in again.', { id: 'session-expired' });
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
    refreshUser: fetchCurrentUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
