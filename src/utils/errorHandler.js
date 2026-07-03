// src/utils/errorHandler.js
import { toast } from "react-toastify";

// ✅ پیام‌های خطای فارسی
const ERROR_MESSAGES = {
  // شبکه
  "Network Error":
    "ارتباط با سرور برقرار نشد. لطفاً اتصال اینترنت خود را بررسی کنید.",
  ERR_NETWORK: "ارتباط با سرور قطع شده است.",
  ECONNABORTED: "درخواست شما زمان‌بر بود. لطفاً مجدداً تلاش کنید.",

  // احراز هویت
  401: "نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.",
  403: "شما دسترسی لازم برای این عملیات را ندارید.",

  // سرور
  404: "اطلاعات مورد نظر یافت نشد.",
  500: "خطای داخلی سرور. لطفاً مجدداً تلاش کنید.",
  502: "سرور در دسترس نیست. لطفاً چند دقیقه دیگر تلاش کنید.",

  // ثبت‌نام
  "کاربری با این تلفن همراه یا کد ملی ثبت نشده است":
    "کاربری با این مشخصات یافت نشد.",
  "کد وارد شده صحیح نیست": "کد وارد شده اشتباه است. مجدداً تلاش کنید.",
  "کد منقضی شده است": "کد منقضی شده است. درخواست مجدد کنید.",
  "شماره موبایل باید ۱۱ رقم باشد": "شماره موبایل باید ۱۱ رقم باشد.",
  "کد ملی باید ۱۰ رقم باشد": "کد ملی باید ۱۰ رقم باشد.",
  "این فیلد الزامی است": "لطفاً تمام فیلدهای الزامی را پر کنید.",
};

// ✅ تبدیل خطا به پیام فارسی
export const getFriendlyErrorMessage = (error) => {
  // خطا از interceptor
  if (error?.message && typeof error.message === "string") {
    // چک کردن در ERROR_MESSAGES
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

    // detail
    if (data.detail) {
      for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
        if (data.detail.includes(key) || data.detail === key) {
          return value;
        }
      }
      return data.detail;
    }

    // error
    if (data.error) {
      for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
        if (data.error.includes(key) || data.error === key) {
          return value;
        }
      }
      return data.error;
    }

    // errors (اعتبارسنجی فیلدها)
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

  // خطای شبکه
  if (error?.code) {
    for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
      if (error.code === key || error.code.includes(key)) {
        return value;
      }
    }
  }

  // خطای پیش‌فرض
  return "خطایی رخ داده است. لطفاً مجدداً تلاش کنید.";
};

// ✅ نمایش خطا با Toast
export const showError = (error, fallbackMessage = "خطایی رخ داده است") => {
  const message = getFriendlyErrorMessage(error) || fallbackMessage;

  toast.error(message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: {
      background: "#2a0a0a",
      color: "#ffffff",
      borderRadius: "16px",
      padding: "16px 24px",
      boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
      border: "1px solid rgba(176,1,1,0.3)",
      fontFamily: "w_Lotus, sans-serif",
      fontSize: "15px",
      fontWeight: 500,
      direction: "rtl",
    },
    progressStyle: {
      background: "linear-gradient(90deg, #B00101, #ff4444)",
      height: "3px",
    },
  });

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
