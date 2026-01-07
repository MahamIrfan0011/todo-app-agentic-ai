"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface User {
  email: string;
  // add other user properties here
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
      if (tokenCookie) {
        try {
          const token = tokenCookie.split('=')[1];
          const decodedToken: any = jwtDecode(token);
          if (decodedToken.exp * 1000 > Date.now()) {
            setUser({ email: decodedToken.email });
          } else {
            logout();
          }
        } catch (error) {
          console.error("Invalid token", error);
          logout();
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = (token: string) => {
    document.cookie = `token=${token}; path=/; max-age=3600;`;
    try {
      const decodedToken: any = jwtDecode(token);
      setUser({ email: decodedToken.email });
      router.push('/');
    } catch (error) {
      console.error("Invalid token", error);
    }
  };

  const logout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}