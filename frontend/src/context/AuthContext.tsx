import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { auth as authApi } from '../api/client';

interface User {
  username: string;
  role: string;
  userId: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });

  const login = useCallback(async (username: string, password: string) => {
    const res = await authApi.login(username, password);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify({ username: res.username, role: res.role, userId: res.userId }));
    setToken(res.token);
    setUser({ username: res.username, role: res.role, userId: res.userId });
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const res = await authApi.register(username, email, password);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify({ username: res.username, role: res.role, userId: res.userId }));
    setToken(res.token);
    setUser({ username: res.username, role: res.role, userId: res.userId });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
