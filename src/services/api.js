// src/services/api.js
import axios from "axios";

const BASE_URL = "/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor برای اضافه کردن توکن
api.interceptors.request.use((config) => {
  const draftToken = localStorage.getItem("draft_token");
  const accessToken = localStorage.getItem("access_token");

  if (draftToken) {
    config.headers["X-Draft-Token"] = draftToken;
  }
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

// ✅ Interceptor برای مدیریت خطاها
api.interceptors.response.use(
  (response) => {
    const newDraftToken = response.headers["x-draft-token"];
    if (newDraftToken) {
      localStorage.setItem("draft_token", newDraftToken);
    }
    return response;
  },
  (error) => {
    // ✅ خطاهای 401 - احراز هویت
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
      return Promise.reject({
        message: "نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.",
      });
    }

    // ✅ خطاهای 403 - دسترسی غیرمجاز
    if (error.response?.status === 403) {
      return Promise.reject({
        message: "شما دسترسی لازم برای این عملیات را ندارید.",
      });
    }

    // ✅ خطاهای 404 - پیدا نشد
    if (error.response?.status === 404) {
      return Promise.reject({ message: "اطلاعات مورد نظر یافت نشد." });
    }

    // ✅ خطاهای 502 - سرور در دسترس نیست
    if (
      error.response?.status === 502 ||
      error.message?.includes("Network Error")
    ) {
      return Promise.reject({
        message: "سرور در دسترس نیست. لطفاً چند دقیقه دیگر تلاش کنید.",
      });
    }

    // ✅ خطاهای 500 - خطای داخلی سرور
    if (error.response?.status === 500) {
      return Promise.reject({
        message: "خطای داخلی سرور. لطفاً مجدداً تلاش کنید.",
      });
    }

    // ✅ خطاهای اعتبارسنجی (400)
    if (error.response?.status === 400) {
      const data = error.response?.data;

      // خطاهای فیلدها
      if (data?.errors) {
        const firstError =
          Object.values(data.errors)[0]?.[0] || "اطلاعات وارد شده صحیح نیست.";
        return Promise.reject({ message: firstError });
      }

      // خطای detail
      if (data?.detail) {
        return Promise.reject({ message: data.detail });
      }

      // خطای error
      if (data?.error) {
        return Promise.reject({ message: data.error });
      }
    }

    // ✅ خطاهای شبکه (اتصال)
    if (error.code === "ERR_NETWORK" || error.code === "ECONNABORTED") {
      return Promise.reject({
        message:
          "ارتباط با سرور برقرار نشد. لطفاً اتصال اینترنت خود را بررسی کنید.",
      });
    }

    // ✅ خطای پیش‌فرض
    return Promise.reject({
      message:
        error.response?.data?.detail ||
        error.response?.data?.error ||
        "خطایی رخ داده است. لطفاً مجدداً تلاش کنید.",
    });
  },
);

export default api;
