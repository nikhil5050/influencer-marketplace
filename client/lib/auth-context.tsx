"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { api } from "./api";
import Cookies from "js-cookie";

interface User {
  id: string;
  name: string;
  email: string;
  role: "BRAND" | "INFLUENCER" | "ADMIN";
  profile?: Record<string, unknown>;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = Cookies.get("auth_token");
    if (savedToken) {
      setToken(savedToken);
      fetchUser(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (t: string) => {
    try {
      const res = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${t}` },
      });
      setUser(res.data);
    } catch {
      Cookies.remove("auth_token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    const { token: t, user: u } = res.data;
    Cookies.set("auth_token", t, { expires: 1 });
    setToken(t);
    setUser(u);
  };

  const logout = () => {
    Cookies.remove("auth_token");
    setToken(null);
    setUser(null);
    window.location.href = "/";
  };

  const refreshUser = async () => {
    if (token) await fetchUser(token);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
