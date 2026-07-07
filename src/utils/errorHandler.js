// src/utils/errorHandler.js
import { error as toastError } from "./toast";

// ✅ پیام‌های خطای فارسی
const ERROR_MESSAGES = {
  // شبکه
  "Network Error":
    "ارتباط با سرور برقرار نشد. لطفاً اتصال اینترنت خود را بررسی کنید.",
  ERR_NETWORK: "ارتباط با سرور قطع شده است.",
  ECONNABORTED: "درخواست شما زمان‌بر بود. لطفاً مجدداً تلاش کنید.",
  ETIMEDOUT: "زمان پاسخگویی سرور به پایان رسید. لطفاً مجدداً تلاش کنید.",
  ERR_CONNECTION_REFUSED: "سرور پاسخ نمی‌دهد. لطفاً چند دقیقه دیگر تلاش کنید.",
  ERR_INTERNET_DISCONNECTED: "اتصال اینترنت خود را بررسی کنید.",

  // احراز هویت
  401: "نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.",
  403: "شما دسترسی لازم برای این عملیات را ندارید.",

  // سرور
  404: "اطلاعات مورد نظر یافت نشد.",
  405: "این عملیات در سرور پشتیبانی نمی‌شود.",
  500: "خطای داخلی سرور. لطفاً مجدداً تلاش کنید.",
  502: "سرور در دسترس نیست. لطفاً چند دقیقه دیگر تلاش کنید.",
  503: "سرور در حال تعمیرات است. لطفاً بعداً تلاش کنید.",
  504: "زمان پاسخگویی سرور به پایان رسید.",

  // ثبت‌نام
  "کاربری با این تلفن همراه یا کد ملی ثبت نشده است":
    "کاربری با این مشخصات یافت نشد.",
  "کد وارد شده صحیح نیست": "کد وارد شده اشتباه است. مجدداً تلاش کنید.",
  "کد منقضی شده است": "کد منقضی شده است. درخواست مجدد کنید.",
  "شماره موبایل باید ۱۱ رقم باشد": "شماره موبایل باید ۱۱ رقم باشد.",
  "کد ملی باید ۱۰ رقم باشد": "کد ملی باید ۱۰ رقم باشد.",
  "کدپستی باید ۱۰ رقم باشد": "کدپستی باید ۱۰ رقم باشد.",
  "این فیلد الزامی است": "لطفاً تمام فیلدهای الزامی را پر کنید.",
};

// ✅ تبدیل خطا به پیام فارسی
export const getFriendlyErrorMessage = (error) => {
  // خطا از interceptor
  if (error?.message && typeof error.message === "string") {
    for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
      if (error.message.includes(key) || error.message === key) {
        return value;
      }
    }
    return error.message;
  }

  // خطا از axios
  if (error?.response?.data) {
    const data = error.response.data;

    if (data.detail) {
      for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
        if (data.detail.includes(key) || data.detail === key) {
          return value;
        }
      }
      return data.detail;
    }

    if (data.error) {
      for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
        if (data.error.includes(key) || data.error === key) {
          return value;
        }
      }
      return data.error;
    }

    if (data.errors) {
      const firstError = Object.values(data.errors)[0]?.[0];
      if (firstError) {
        for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
          if (firstError.includes(key) || firstError === key) {
            return value;
          }
        }
        return firstError;
      }
    }
  }

  // خطای کد
  if (error?.code) {
    for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
      if (error.code === key || error.code.includes(key)) {
        return value;
      }
    }
  }

  // خطای HTTP status
  if (error?.response?.status) {
    const status = error.response.status;
    for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
      if (String(key) === String(status)) {
        return value;
      }
    }
  }

  return "خطایی رخ داده است. لطفاً مجدداً تلاش کنید.";
};

// ✅ نمایش خطا با Toast (بدون ایموجی)
export const showError = (error, fallbackMessage = "خطایی رخ داده است") => {
  const message = getFriendlyErrorMessage(error) || fallbackMessage;
  toastError(message);
  return message;
};

// ✅ نمایش خطا در UI (برای فرم‌ها)
export const getFieldError = (error, fieldName) => {
  if (error?.response?.data?.errors) {
    const fieldErrors = error.response.data.errors[fieldName];
    if (fieldErrors && fieldErrors.length > 0) {
      return fieldErrors[0];
    }
  }
  return null;
};
