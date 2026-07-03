// src/services/api.js
import axios from "axios";

// ✅ آدرس واقعی بک‌اند
const BASE_URL = "http://ipcphotos.com:8081/api/v1";

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

// Interceptor برای ذخیره Draft Token از هدر پاسخ
api.interceptors.response.use(
  (response) => {
    const newDraftToken = response.headers["x-draft-token"];
    if (newDraftToken) {
      localStorage.setItem("draft_token", newDraftToken);
    }
    return response;
  },
  (error) => {
    // اگر توکن منقضی شده بود، به لاگین بفرست
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
