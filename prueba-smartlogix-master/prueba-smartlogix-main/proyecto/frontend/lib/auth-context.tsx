'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  token: string | null;
  login: (email: string, contrasena: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('token');
    if (saved) setToken(saved);
  }, []);

  const login = async (email: string, contrasena: string) => {
    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, contrasena }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      setToken(data.token);
      sessionStorage.setItem('token', data.token);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    sessionStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};