// src/services/api.js
import axios from "axios";
import { showError } from "../utils/errorHandler";

const BASE_URL = "/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
  timeout: 30000, // ✅ 30 ثانیه تایم‌اوت
});

// ✅ اینترسپتور برای JWT
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log("🔑 ارسال با JWT:", config.url);
    } else {
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

// ✅ مدیریت 401 و رفرش توکن + خطاهای شبکه
api.interceptors.response.use(
  (response) => {
    const newDraftToken = response.headers["x-draft-token"];
    if (newDraftToken) {
      localStorage.setItem("draft_token", newDraftToken);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // ✅ خطای شبکه (قطع اینترنت)
    if (!error.response) {
      console.log("❌ خطای شبکه:", error.message);
      showError(
        error,
        "ارتباط با سرور برقرار نشد. لطفاً اتصال اینترنت خود را بررسی کنید.",
      );
      // ✅ جلوگیری از نمایش تکراری همین خطا در catch بلاک صفحات
      error.handledByInterceptor = true;
      return Promise.reject(error);
    }

    console.log("❌ خطا:", error.response?.status, error.response?.config?.url);

    // ✅ مدیریت 401 و رفرش توکن
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

      const isOnPublicFlow =
        window.location.pathname.includes("/login") ||
        window.location.pathname.includes("/verify-otp") ||
        window.location.pathname.includes("/register");

      // فقط اگه در صفحات لاگین/ثبت‌نام نباشی، پیام بده و هدایت کن
      if (!isOnPublicFlow) {
        showError(error, "نشست شما منقضی شده است. لطفاً دوباره وارد شوید.");
        error.handledByInterceptor = true;
        window.location.href = "/login";
      }
    }

    // ✅ نمایش خطا برای وضعیت‌های خاص (این‌ها خطاهای عمومی سرور هستن،
    // پس دیگه نباید توی catch خود صفحه دوباره نمایش داده بشن)
    if (error.response?.status === 403) {
      showError(error, "شما دسترسی لازم برای این عملیات را ندارید.");
    }

    if (error.response?.status === 404) {
      showError(error, "اطلاعات مورد نظر یافت نشد.");
    }

    if (error.response?.status === 405) {
      showError(error, "این عملیات در سرور پشتیبانی نمی‌شود.");
    }

    if (error.response?.status === 500) {
      showError(error, "خطای داخلی سرور. لطفاً مجدداً تلاش کنید.");
    }

    if (
      error.response?.status === 502 ||
      error.response?.status === 503 ||
      error.response?.status === 504
    ) {
      showError(error, "سرور در دسترس نیست. لطفاً چند دقیقه دیگر تلاش کنید.");
    }

    // ✅ این وضعیت‌ها بالا پیام‌شون نمایش داده شد؛ فلگ می‌زنیم تا
    // صفحات (فرم‌ها) دوباره برای همون خطا توست جدا نفرستن و پیام قبلی پاک نشه
    if ([403, 404, 405, 500, 502, 503, 504].includes(error.response?.status)) {
      error.handledByInterceptor = true;
    }

    return Promise.reject(error);
  },
);

export default api;
