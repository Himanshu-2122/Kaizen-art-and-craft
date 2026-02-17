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
  sendOTP: (phone: string, purpose: "signup" | "login") => Promise<void>;
  verifyLoginOTP: (phone: string, code: string) => Promise<void>;
  verifySignupOTP: (data: {
    phone: string;
    code: string;
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
        const { data } = await api.get("/user/profile");
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
    const { data } = await api.post("/user/login", {
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
    const { data } = await api.post("/user/signup", payload);

    localStorage.setItem("token", data.accessToken);
    setUser(data.user);
  };

  /* ---------- SEND OTP ---------- */
  const sendOTP = async (phone: string, purpose: "signup" | "login") => {
    await api.post("/otp/send", { phone, purpose });
  };

  /* ---------- VERIFY LOGIN OTP ---------- */
  const verifyLoginOTP = async (phone: string, code: string) => {
    const { data } = await api.post("/otp/verify-login", { phone, code });
    localStorage.setItem("token", data.accessToken);
    setUser(data.user);
  };

  /* ---------- VERIFY SIGNUP OTP ---------- */
  const verifySignupOTP = async (payload: {
    phone: string;
    code: string;
    fullName: string;
    username: string;
    email: string;
    password: string;
  }) => {
    const { data } = await api.post("/otp/verify-signup", payload);
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
      value={{ user, loading, isAdmin, signIn, signUp, sendOTP, verifyLoginOTP, verifySignupOTP, logout }} // ✅ PASS
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ========================================= */

export const useAuth = () => useContext(AuthContext);
