// src/services/api.js
import axios from "axios";

const BASE_URL = "/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // ❌ withCredentials رو غیرفعال کن
  withCredentials: false,
});

// ✅ اینترسپتور برای JWT
api.interceptors.request.use(
  (config) => {
    // 1️⃣ اولویت با JWT
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log("🔑 ارسال با JWT:", config.url);
    } else {
      // 2️⃣ اگر JWT نبود، از Draft Token استفاده کن (برای ثبت‌نام)
      const draftToken = localStorage.getItem("draft_token");
      if (draftToken) {
        config.headers["X-Draft-Token"] = draftToken;
        console.log("📝 ارسال با Draft Token:", config.url);
      } else {
        console.log("❌ بدون توکن:", config.url);
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ✅ مدیریت 401 و رفرش توکن
api.interceptors.response.use(
  (response) => {
    // ذخیره Draft Token اگر از سرور برگشت
    const newDraftToken = response.headers["x-draft-token"];
    if (newDraftToken) {
      localStorage.setItem("draft_token", newDraftToken);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.log("❌ خطا:", error.response?.status, error.response?.config?.url);

    // اگر 401 بود و JWT داشتیم، سعی کن رفرش کنی
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        originalRequest._retry = true;
        try {
          const response = await axios.post(
            `${BASE_URL}/auth/token/refresh/`,
            { refresh: refreshToken },
            { headers: { "Content-Type": "application/json" } },
          );

          const newAccessToken = response.data.access;
          localStorage.setItem("access_token", newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error("❌ رفرش توکن ناموفق");
        }
      }

      // اگر رفرش نشد، توکن‌ها رو پاک کن
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("draft_token");

      // فقط اگه در صفحات لاگین نباشی، هدایت کن
      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/verify-otp") &&
        !window.location.pathname.includes("/register")
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
