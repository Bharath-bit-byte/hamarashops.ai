import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthApi } from '../services/api';
import { API_BASE_URL } from '../services/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const userData = await AuthApi.getMe();
      if (userData && userData.id) {
        setUser(userData);
        setIsAuthenticated(true);
        setAuthError(null);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      // Status 401 is normal when visitor is unauthenticated
      if (err.status && err.status !== 401) {
        setAuthError(err.message || 'Authentication check failed.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // If arriving from backend OAuth redirect with ?auth=success
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth') === 'success') {
      urlParams.delete('auth');
      const newQuery = urlParams.toString();
      const newPath = window.location.pathname + (newQuery ? `?${newQuery}` : '') + window.location.hash;
      window.history.replaceState({}, document.title, newPath);
    }

    checkAuth();
  }, [checkAuth]);

  const login = (redirectUrl = window.location.pathname) => {
    const targetUrl = `${API_BASE_URL}/auth/linkedin/authorize?redirect=${encodeURIComponent(redirectUrl || '/')}`;
    window.location.href = targetUrl;
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AuthApi.logout();
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      setAuthError(null);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    authError,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
