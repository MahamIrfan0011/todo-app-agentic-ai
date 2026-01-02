"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsAuthenticated(auth.isAuthenticated());
    if (!auth.isAuthenticated() && pathname !== "/auth/login" && pathname !== "/auth/register") {
      router.push("/auth/login");
    } else if (auth.isAuthenticated() && (pathname === "/auth/login" || pathname === "/auth/register")) {
      router.push("/");
    }
  }, [pathname, router]);

  const login = async (username: string, password: string) => {
    const success = await auth.login(username, password);
    if (success) {
      setIsAuthenticated(true);
      router.push("/");
    }
    return success;
  };

  const register = async (username: string, password: string) => {
    const response = await auth.register(username, password);
    return response;
  };

  const logout = () => {
    auth.logout();
    setIsAuthenticated(false);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
