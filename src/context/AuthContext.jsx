// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { getProfile } from "../services/dashboardService";
import api from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsLoading(false);
      return false;
    }

    try {
      console.log("🔍 دریافت اطلاعات کاربر با JWT...");
      const res = await getProfile();
      setUser(res.data);
      console.log("✅ اطلاعات کاربر دریافت شد:", res.data);
      return true;
    } catch (err) {
      console.error("❌ خطا در دریافت کاربر:", err.response?.status);
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        return false;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ تابع رفرش اطلاعات کاربر (برای بعد از آپدیت پروفایل)
  const refetchUser = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return false;

      const res = await getProfile();
      setUser(res.data);
      console.log("🔄 اطلاعات کاربر رفرش شد:", res.data);
      return true;
    } catch (err) {
      console.error("❌ خطا در رفرش کاربر:", err);
      return false;
    }
  };

  const login = async (tokens, userData) => {
    try {
      localStorage.setItem("access_token", tokens.access);
      localStorage.setItem("refresh_token", tokens.refresh);
      setUser(userData);
      const success = await fetchUser();
      return success;
    } catch (error) {
      console.error("❌ خطا در لاگین:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("draft_token");
    setUser(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    const path = window.location.pathname;
    if (path !== "/login" && path !== "/verify-otp" && path !== "/register") {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        login,
        logout,
        refetchUser,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
