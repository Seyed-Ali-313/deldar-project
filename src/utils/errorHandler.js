// src/utils/errorHandler.js
import { error as toastError } from "./toast";

// ✅ این پیام‌ها فقط برای زمانی هستن که بک‌اند اصلاً متنی برنگردونده
// (قطعی شبکه، تایم‌اوت، یا وضعیت HTTP بدون بدنه). هرگز جایگزین پیام واقعی بک‌اند نمی‌شن.

const NETWORK_ERROR_MESSAGES = {
  "Network Error":
    "ارتباط با سرور برقرار نشد. لطفاً اتصال اینترنت خود را بررسی کنید.",
  ERR_NETWORK:
    "ارتباط با سرور قطع شده است. لطفاً اتصال اینترنت خود را بررسی کنید.",
  ECONNABORTED: "درخواست شما زمان‌بر بود. لطفاً مجدداً تلاش کنید.",
  ETIMEDOUT: "زمان پاسخگویی سرور به پایان رسید. لطفاً مجدداً تلاش کنید.",
  "timeout of 30000ms exceeded":
    "درخواست شما زمان‌بر بود. لطفاً مجدداً تلاش کنید.",
  ERR_CONNECTION_REFUSED: "سرور پاسخ نمی‌دهد. لطفاً چند دقیقه دیگر تلاش کنید.",
  ERR_INTERNET_DISCONNECTED: "اتصال اینترنت خود را بررسی کنید.",
};

const STATUS_MESSAGES = {
  400: "اطلاعات ارسالی معتبر نیست. لطفاً داده‌ها را بررسی کنید.",
  401: "نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.",
  403: "شما دسترسی لازم برای این عملیات را ندارید.",
  404: "اطلاعات مورد نظر یافت نشد.",
  405: "این عملیات در سرور پشتیبانی نمی‌شود.",
  409: "این اطلاعات قبلاً ثبت شده است.",
  422: "اطلاعات ارسالی معتبر نیست. لطفاً داده‌ها را بررسی کنید.",
  429: "تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً کمی صبر کنید.",
  500: "خطای داخلی سرور. لطفاً مجدداً تلاش کنید.",
  502: "سرور در دسترس نیست. لطفاً چند دقیقه دیگر تلاش کنید.",
  503: "سرور در دسترس نیست. لطفاً چند دقیقه دیگر تلاش کنید.",
  504: "سرور پاسخ نمی‌دهد. لطفاً چند دقیقه دیگر تلاش کنید.",
};

// ✅ پیام دقیق بک‌اند همیشه اولویت اول است؛ دیکشنری بالا فقط fallback آخره
export const getFriendlyErrorMessage = (error) => {
  if (error?.handledByInterceptor) return null;

  // ===== ۱) خطای شبکه (اصلاً پاسخی از سرور نیومده) =====
  if (!error?.response) {
    const msg = error?.message || error?.code || "";
    for (const [key, value] of Object.entries(NETWORK_ERROR_MESSAGES)) {
      if (msg.includes(key) || msg === key) return value;
    }
    return "ارتباط با سرور برقرار نشد. لطفاً اتصال اینترنت خود را بررسی کنید.";
  }

  const data = error.response.data;

  if (data) {
    // ===== ۲) پیام مستقیم بک‌اند - بدون هیچ بازنویسی =====
    // فرمت این بک‌اند: { success:false, error: "..." } یا { success:false, message: "..." }
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }
    if (typeof data.error === "string" && data.error.trim()) {
      return data.error;
    }
    if (typeof data.detail === "string" && data.detail.trim()) {
      return data.detail;
    }

    // ===== ۳) اگر error یه آبجکت باشه (فرمت‌های دیگه احتمالی) =====
    if (data.error && typeof data.error === "object") {
      if (data.error.details && typeof data.error.details === "object") {
        for (const val of Object.values(data.error.details)) {
          const m = Array.isArray(val) ? val[0] : val;
          if (typeof m === "string" && m.trim()) return m;
        }
      }
      if (typeof data.error.message === "string" && data.error.message.trim()) {
        return data.error.message;
      }
    }

    // ===== ۴) خطاهای اعتبارسنجی فیلد به فیلد (سبک DRF) =====
    if (data.errors && typeof data.errors === "object") {
      const fieldErrors = [];
      for (const messages of Object.values(data.errors)) {
        if (Array.isArray(messages) && messages.length > 0) {
          if (!fieldErrors.includes(messages[0])) fieldErrors.push(messages[0]);
        } else if (
          typeof messages === "string" &&
          !fieldErrors.includes(messages)
        ) {
          fieldErrors.push(messages);
        }
      }
      if (fieldErrors.length > 0) return fieldErrors.join(" - ");
    }

    if (data.non_field_errors) {
      const val = data.non_field_errors;
      const m = Array.isArray(val) ? val[0] : val;
      if (m) return m;
    }
  }

  // ===== ۵) بک‌اند هیچ متنی نداد -> بر اساس کد وضعیت HTTP =====
  const status = error.response.status;
  if (STATUS_MESSAGES[status]) return STATUS_MESSAGES[status];

  return "خطایی رخ داده است. لطفاً مجدداً تلاش کنید.";
};

// ✅ نمایش خطا با Toast (پیام بک‌اند در اولویت، در غیر این صورت fallbackMessage)
export const showError = (error, fallbackMessage = "خطایی رخ داده است") => {
  if (error?.handledByInterceptor) return null;
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

// ✅ برای پیام‌های موفقیت: پیام بک‌اند (response.data.message) در اولویت اول،
// و اگر بک‌اند چیزی نفرستاد، از fallback خودمون استفاده می‌شه.
// مثال استفاده: success(getServerMessage(res, "اطلاعات با موفقیت ثبت شد"))
export const getServerMessage = (response, fallback) => {
  const msg = response?.data?.message;
  return typeof msg === "string" && msg.trim() ? msg : fallback;
};
