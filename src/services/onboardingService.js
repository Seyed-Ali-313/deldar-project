// src/services/onboardingService.js
import api from "./api";

// مرحله اول - اطلاعات شخصی
export const submitStep1 = (data) => api.post("/v1/onboarding/step-1/", data);

// مرحله دوم - اطلاعات تکمیلی
export const submitStep2 = (data) => api.post("/v1/onboarding/step-2/", data);

// آپلود عکس در مرحله ثبت‌نام
export const uploadWork = (formData) =>
  api.post("/v1/onboarding/works/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// حذف عکس از پیش‌نویس
export const deleteWork = (workId) =>
  api.delete(`/v1/onboarding/works/${workId}/`);

// ارسال نهایی و درخواست OTP
export const submitAllWorks = () => api.post("/v1/onboarding/submit/");

// دریافت وضعیت پیش‌نویس
export const getDraft = () => api.get("/v1/onboarding/draft/");

// تایید OTP و ساخت اکانت
export const verifyOtp = (otp_code) =>
  api.post("/v1/onboarding/verify/", { otp_code });

// ✅ ارسال مجدد OTP
export const resendOtp = (mobile) =>
  api.post("/v1/onboarding/resend-otp/", { mobile });
