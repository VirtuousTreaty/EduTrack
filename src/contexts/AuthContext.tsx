import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { currentUser } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'student' | 'university' | 'company') => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
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

  useEffect(() => {
    const savedUser = localStorage.getItem('edutrack_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string, role: 'student' | 'university' | 'company'): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in real app, this would validate against backend
    const mockUsers = {
      student: { ...currentUser.student, role: 'student' as const },
      university: currentUser.university,
      company: currentUser.company
    };

    const userData = mockUsers[role];
    if (userData && (email === userData.email || email.endsWith(`@${role}.edu`) || email.endsWith(`@${role}.com`))) {
      setUser(userData as User);
      setIsAuthenticated(true);
      localStorage.setItem('edutrack_user', JSON.stringify(userData));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('edutrack_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};