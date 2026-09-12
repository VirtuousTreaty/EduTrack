import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'student' | 'university' | 'company') => Promise<{ success: boolean; error?: string }>;
  signup: (data: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuthStatus() {
      const token = localStorage.getItem('edutrack_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.getMe();
        if (response.success && response.user) {
          setUser(response.user);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('edutrack_token');
        }
      } catch (err) {
        console.error('Failed to verify token:', err);
        localStorage.removeItem('edutrack_token');
      } finally {
        setLoading(false);
      }
    }

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string, role: 'student' | 'university' | 'company'): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await api.login({ email, password, role });
      if (response.success && response.token) {
        localStorage.setItem('edutrack_token', response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: response.error || 'Invalid credentials' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed. Server error.' };
    }
  };

  const signup = async (data: any): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await api.signup(data);
      if (response.success && response.token) {
        localStorage.setItem('edutrack_token', response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: response.error || 'Registration failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Signup failed. Server error.' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('edutrack_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};