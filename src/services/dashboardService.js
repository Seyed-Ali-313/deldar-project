// src/services/dashboardService.js
import api from "./api";

// دریافت پروفایل کاربر
export const getProfile = () => api.get("/dashboard/profile/");

// بروزرسانی پروفایل
export const updateProfile = (data) => api.put("/dashboard/profile/", data);

// درخواست تغییر شماره موبایل
export const requestMobileChange = (new_mobile) =>
  api.post("/dashboard/profile/mobile/request/", { new_mobile });

// تایید تغییر شماره موبایل
export const verifyMobileChange = (new_mobile, otp_code) =>
  api.post("/dashboard/profile/mobile/verify/", { new_mobile, otp_code });

// دریافت لیست آثار
export const getWorks = () => api.get("/dashboard/works/");

// بروزرسانی یک اثر (کپشن یا عکس)
export const updateWork = (id, data) =>
  api.patch(`/dashboard/works/${id}/`, data);

// حذف یک اثر
export const deleteWork = (id) => api.delete(`/dashboard/works/${id}/`);

// افزودن اثر جدید
export const addWork = (formData) =>
  api.post("/dashboard/works/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
