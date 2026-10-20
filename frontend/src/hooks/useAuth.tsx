import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';
import { authService } from '../services/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (u: string, p: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_ADMIN: User = {
  id: 1,
  username: 'admin',
  full_name: 'Vardhman NOC Admin',
  email: 'admin@vardhman.com',
  roles: ['super_admin'],
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('smp_user');
      return saved ? JSON.parse(saved) : DEFAULT_ADMIN;
    } catch {
      return DEFAULT_ADMIN;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('smp_token') || 'demo_live_token');
  const [isLoading, setIsLoading] = useState(false);

  const login = async (u: string, p: string) => {
    setIsLoading(true);
    try {
      const data = await authService.login(u, p);
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem('smp_token', data.access_token);
      localStorage.setItem('smp_user', JSON.stringify(data.user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('smp_token');
    localStorage.removeItem('smp_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
