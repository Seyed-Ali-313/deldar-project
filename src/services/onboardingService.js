// src/services/onboardingService.js
import api from "./api";

// مرحله اول - اطلاعات شخصی
export const submitStep1 = (data) => api.post("/onboarding/step-1/", data);

// مرحله دوم - اطلاعات تکمیلی
export const submitStep2 = (data) => api.post("/onboarding/step-2/", data);

// آپلود عکس در مرحله ثبت‌نام
export const uploadWork = (formData) =>
  api.post("/onboarding/works/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// حذف عکس از پیش‌نویس
export const deleteWork = (workId) =>
  api.delete(`/onboarding/works/${workId}/`);

// ارسال نهایی و درخواست OTP
export const submitAllWorks = () => api.post("/onboarding/submit/");

// دریافت وضعیت پیش‌نویس
export const getDraft = () => api.get("/onboarding/draft/");

// تایید OTP و ساخت اکانت
export const verifyOtp = (otp_code) =>
  api.post("/onboarding/verify/", { otp_code });

// ✅ ارسال مجدد OTP
export const resendOtp = (mobile) =>
  api.post("/onboarding/resend-otp/", { mobile });
