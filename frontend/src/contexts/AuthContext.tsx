import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api"; // ⚠️ default export use karo

/* =========================================
   TYPES
========================================= */

type User = {
  id: string;
  fullName: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean; // ✅ ADDED
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: {
    fullName: string;
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

/* =========================================
   PROVIDER
========================================= */

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------- load user on refresh ---------- */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        const { data } = await api.get("/api/v1/user/profile");
        setUser(data);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /* ---------- computed role ---------- */
  const isAdmin = user?.role === "admin"; // ✅ ADDED

  /* ---------- LOGIN ---------- */
  const signIn = async (email: string, password: string) => {
    const { data } = await api.post("/api/v1/user/login", {
      email,
      password,
    });

    localStorage.setItem("token", data.accessToken);
    setUser(data.user);
  };

  /* ---------- SIGNUP ---------- */
  const signUp = async (payload: {
    fullName: string;
    username: string;
    email: string;
    password: string;
  }) => {
    const { data } = await api.post("/api/v1/user/signup", payload);

    localStorage.setItem("token", data.accessToken);
    setUser(data.user);
  };

  /* ---------- LOGOUT ---------- */
  const logout = async () => {
    try {
      await api.post("/api/v1/user/logout");
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAdmin, signIn, signUp, logout }} // ✅ PASS
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ========================================= */

export const useAuth = () => useContext(AuthContext);
