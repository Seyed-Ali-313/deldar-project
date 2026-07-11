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
  timeout: 30000,
});

// ✅ اینترسپتور برای JWT و مدیریت FormData
api.interceptors.request.use(
  (config) => {
    // ✅ اگر داده FormData است، Content-Type رو حذف کن تا axios خودش تنظیمش کنه
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

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
      error.handledByInterceptor = true;
      return Promise.reject(error);
    }

    console.log("❌ خطا:", error.response?.status, error.response?.config?.url);
    console.log("📋 داده‌های خطا:", error.response?.data);

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

      if (!isOnPublicFlow) {
        showError(error, "نشست شما منقضی شده است. لطفاً دوباره وارد شوید.");
        error.handledByInterceptor = true;
        window.location.href = "/login";
      }
    }

    // ✅ مدیریت خطای 400 (با پیام دقیق)
    if (error.response?.status === 400) {
      const data = error.response.data;
      let message = "اطلاعات ارسالی معتبر نیست. لطفاً داده‌ها را بررسی کنید.";

      console.log("📋 داده‌های خطای 400:", data);

      if (data?.detail) {
        message = data.detail;
      } else if (data?.message) {
        message = data.message;
      } else if (data?.errors) {
        const errorMessages = [];
        for (const [field, msgs] of Object.entries(data.errors)) {
          if (Array.isArray(msgs) && msgs.length > 0) {
            errorMessages.push(`${field}: ${msgs[0]}`);
          } else if (typeof msgs === "string") {
            errorMessages.push(`${field}: ${msgs}`);
          }
        }
        if (errorMessages.length > 0) {
          message = errorMessages.join(" | ");
        }
      }

      // ✅ خطاهای مربوط به عکس
      if (
        message.includes("image") ||
        message.includes("عکس") ||
        message.includes("photo")
      ) {
        if (message.includes("size") || message.includes("حجم")) {
          message = "حجم عکس ارسالی باید کمتر از ۵ مگابایت باشد.";
        } else if (
          message.includes("dimension") ||
          message.includes("ابعاد") ||
          message.includes("width") ||
          message.includes("height")
        ) {
          message = "ابعاد عکس ارسالی باید بین ۱۰۰۰ تا ۱۵۰۰ پیکسل باشد.";
        } else if (
          message.includes("format") ||
          message.includes("فرمت") ||
          message.includes("type")
        ) {
          message =
            "فرمت عکس ارسالی نامعتبر است. لطفاً از فرمت JPG استفاده کنید.";
        } else {
          message =
            "فرمت یا ابعاد عکس ارسالی نامعتبر است. لطفاً عکس را با فرمت JPG و ابعاد ۱۰۰۰ تا ۱۵۰۰ پیکسل ارسال کنید.";
        }
      }

      showError(error, message);
      error.handledByInterceptor = true;
    }

    // ✅ مدیریت سایر خطاها
    if (error.response?.status === 403) {
      showError(error, "شما دسترسی لازم برای این عملیات را ندارید.");
      error.handledByInterceptor = true;
    }

    if (error.response?.status === 404) {
      showError(error, "اطلاعات مورد نظر یافت نشد.");
      error.handledByInterceptor = true;
    }

    if (error.response?.status === 405) {
      showError(error, "این عملیات در سرور پشتیبانی نمی‌شود.");
      error.handledByInterceptor = true;
    }

    if (error.response?.status === 409) {
      showError(error, "این اطلاعات قبلاً ثبت شده است.");
      error.handledByInterceptor = true;
    }

    if (error.response?.status === 422) {
      const data = error.response.data;
      let message = "اطلاعات ارسالی معتبر نیست. لطفاً داده‌ها را بررسی کنید.";
      if (data?.detail) message = data.detail;
      else if (data?.message) message = data.message;
      else if (data?.errors) {
        const firstError = Object.values(data.errors)[0]?.[0];
        if (firstError) message = firstError;
      }
      showError(error, message);
      error.handledByInterceptor = true;
    }

    if (error.response?.status === 429) {
      showError(
        error,
        "تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً کمی صبر کنید.",
      );
      error.handledByInterceptor = true;
    }

    if (error.response?.status === 500) {
      showError(error, "خطای داخلی سرور. لطفاً مجدداً تلاش کنید.");
      error.handledByInterceptor = true;
    }

    if (
      error.response?.status === 502 ||
      error.response?.status === 503 ||
      error.response?.status === 504
    ) {
      showError(error, "سرور در دسترس نیست. لطفاً چند دقیقه دیگر تلاش کنید.");
      error.handledByInterceptor = true;
    }

    return Promise.reject(error);
  },
);

export default api;
