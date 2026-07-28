import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiClient } from "./api-client";
import Cookies from "js-cookie";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: "user" | "admin") => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshProfile() {
    try {
      const res = await apiClient.get("/users/me");
      setUser(res.data.data);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    refreshProfile().finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const res = await apiClient.post("/auth/login", { email, password });
    Cookies.set("accessToken", res.data.data.accessToken);
    setUser(res.data.data.user);
  }

  async function register(name: string, email: string, password: string, role?: "user" | "admin") {
    const res = await apiClient.post("/auth/register", { name, email, password, role });
    Cookies.set("accessToken", res.data.data.accessToken);
    setUser(res.data.data.user);
  }

  async function logout() {
    await apiClient.post("/auth/logout");
    Cookies.remove("accessToken");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
