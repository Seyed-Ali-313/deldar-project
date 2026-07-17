// src/services/dashboardService.js
import api from "./api";

// دریافت پروفایل کاربر
export const getProfile = () => api.get("/v1/dashboard/profile/");

// بروزرسانی پروفایل
export const updateProfile = (data) => api.put("/v1/dashboard/profile/", data);

// درخواست تغییر شماره موبایل
export const requestMobileChange = (new_mobile) =>
  api.post("/v1/dashboard/profile/mobile/request/", { new_mobile });

// تایید تغییر شماره موبایل
export const verifyMobileChange = (new_mobile, otp_code) =>
  api.post("/v1/dashboard/profile/mobile/verify/", { new_mobile, otp_code });

// دریافت لیست آثار
export const getWorks = () => api.get("/v1/dashboard/works/");

// ✅ بروزرسانی یک اثر (با پشتیبانی از FormData برای عکس)
export const updateWork = (id, data) => {
  if (data instanceof FormData) {
    return api.patch(`/v1/dashboard/works/${id}/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  return api.patch(`/v1/dashboard/works/${id}/`, data);
};

// حذف یک اثر
export const deleteWork = (id) => api.delete(`/v1/dashboard/works/${id}/`);

// افزودن اثر جدید
export const addWork = (formData) =>
  api.post("/v1/dashboard/works/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
