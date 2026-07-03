// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { getProfile } from "../services/dashboardService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    // ✅ اگه توکن تستی هست، نیازی به درخواست سرور نیست
    if (token === "test_token_123") {
      setUser({
        first_name: "کاربر",
        last_name: "تستی",
        mobile: "09123456789",
        national_code: "1234567890",
      });
      setIsLoading(false);
      return;
    }

    // 🔴 API واقعی - وقتی بک‌اند وصل شد
    /*
    getProfile()
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      })
      .finally(() => setIsLoading(false));
    */
  }, []);

  const login = (accessToken, refreshToken, userData) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    setUser(userData || {});
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        login,
        logout,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
