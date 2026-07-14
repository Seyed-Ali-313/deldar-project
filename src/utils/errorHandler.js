// src/utils/errorHandler.js
import { error as toastError } from "./toast";

// ✅ پیام‌های خطای فارسی دقیق و بدون ایموجی
const ERROR_MESSAGES = {
  // ===== خطاهای شبکه =====
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

  // ===== خطاهای احراز هویت =====
  401: "نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.",
  403: "شما دسترسی لازم برای این عملیات را ندارید.",

  // ===== خطاهای سرور =====
  400: "اطلاعات ارسالی معتبر نیست. لطفاً داده‌ها را بررسی کنید.",
  404: "اطلاعات مورد نظر یافت نشد.",
  405: "این عملیات در سرور پشتیبانی نمی‌شود.",
  409: "این اطلاعات قبلاً ثبت شده است.",
  422: "اطلاعات ارسالی معتبر نیست. لطفاً داده‌ها را بررسی کنید.",
  429: "تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً کمی صبر کنید.",
  500: "خطای داخلی سرور. لطفاً مجدداً تلاش کنید.",
  502: "سرور در دسترس نیست. لطفاً چند دقیقه دیگر تلاش کنید.",
  503: "سرور در دسترس نیست. لطفاً چند دقیقه دیگر تلاش کنید.",
  504: "سرور پاسخ نمی‌دهد. لطفاً چند دقیقه دیگر تلاش کنید.",

  // ===== خطاهای ثبت‌نام و ورود =====
  "کاربری با این تلفن همراه یا کد ملی ثبت نشده است":
    "کاربری با این مشخصات یافت نشد. لطفاً ثبت‌نام کنید.",
  "کاربری با این شماره موبایل ثبت نشده است":
    "کاربری با این شماره یافت نشد. لطفاً ثبت‌نام کنید.",
  "کد وارد شده صحیح نیست": "کد تأیید اشتباه است. مجدداً تلاش کنید.",
  "کد منقضی شده است": "کد تأیید منقضی شده است. درخواست مجدد کنید.",
  "شماره موبایل باید ۱۱ رقم باشد": "شماره موبایل باید ۱۱ رقم باشد.",
  "کد ملی باید ۱۰ رقم باشد": "کد ملی باید ۱۰ رقم باشد.",
  "این فیلد الزامی است": "لطفاً تمام فیلدهای الزامی را پر کنید.",
  "کدپستی باید ۱۰ رقم باشد": "کدپستی باید ۱۰ رقم باشد.",
  "تاریخ تولد نامعتبر است": "تاریخ تولد وارد شده معتبر نیست.",

  // ===== خطاهای عکس =====
  image: "فرمت عکس ارسالی نامعتبر است. لطفاً عکس را با فرمت JPG ارسال کنید.",
  "image size": "حجم عکس ارسالی باید کمتر از ۵ مگابایت باشد.",
  "image format":
    "فرمت عکس ارسالی نامعتبر است. لطفاً از فرمت JPG استفاده کنید.",
  "image dimension": "ابعاد عکس ارسالی باید بین ۱۰۰۰ تا ۱۵۰۰ پیکسل باشد.",
  "image width": "عرض عکس ارسالی باید بین ۱۰۰۰ تا ۱۵۰۰ پیکسل باشد.",
  "image height": "ارتفاع عکس ارسالی باید بین ۱۰۰۰ تا ۱۵۰۰ پیکسل باشد.",
  عکس: "فرمت یا ابعاد عکس ارسالی نامعتبر است. لطفاً عکس را با فرمت JPG و ابعاد ۱۰۰۰ تا ۱۵۰۰ پیکسل ارسال کنید.",
  photo:
    "فرمت یا ابعاد عکس ارسالی نامعتبر است. لطفاً عکس را با فرمت JPG و ابعاد ۱۰۰۰ تا ۱۵۰۰ پیکسل ارسال کنید.",

  // ===== خطاهای آثار =====
  "ارسال آثار با موفقیت انجام شد": "آثار شما با موفقیت ارسال شد.",
  "حداکثر ۵۰ اثر مجاز است": "حداکثر ۵۰ اثر مجاز است.",
  "فرمت فایل پشتیبانی نمی‌شود":
    "فرمت فایل پشتیبانی نمی‌شود. فقط تصاویر مجاز هستند.",
  "حجم فایل بیشتر از حد مجاز است": "حجم فایل باید کمتر از ۵ مگابایت باشد.",
  "لطفاً حداقل یک عکس انتخاب کنید": "لطفاً حداقل یک عکس انتخاب کنید.",
  "No image": "هیچ عکسی انتخاب نشده است. لطفاً عکس را انتخاب کنید.",
};

// ✅ تبدیل خطا به پیام فارسی
export const getFriendlyErrorMessage = (error) => {
  // اگر خطا از قبل در interceptor هندل شده بود
  if (error?.handledByInterceptor) {
    return null;
  }

  // خطای شبکه (بدون پاسخ از سرور)
  if (error?.message && typeof error.message === "string") {
    for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
      if (error.message.includes(key) || error.message === key) {
        return value;
      }
    }
  }

  // خطای axios (با پاسخ از سرور)
  if (error?.response?.data) {
    const data = error.response.data;

    // 1️⃣ بررسی detail
    if (data.detail && typeof data.detail === "string") {
      for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
        if (data.detail.includes(key) || data.detail === key) {
          return value;
        }
      }
      return data.detail;
    }

    // 2️⃣ بررسی message
    if (data.message && typeof data.message === "string") {
      for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
        if (data.message.includes(key) || data.message === key) {
          return value;
        }
      }
      return data.message;
    }

    // 3️⃣ بررسی error
    if (data.error && typeof data.error === "string") {
      for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
        if (data.error.includes(key) || data.error === key) {
          return value;
        }
      }
      return data.error;
    }

    // 4️⃣ بررسی errors (اعتبارسنجی فیلدها)
    if (data.errors && typeof data.errors === "object") {
      const fieldErrors = [];
      for (const [field, messages] of Object.entries(data.errors)) {
        if (Array.isArray(messages) && messages.length > 0) {
          const msg = messages[0];
          if (!fieldErrors.includes(msg)) {
            fieldErrors.push(msg);
          }
        } else if (typeof messages === "string") {
          if (!fieldErrors.includes(messages)) {
            fieldErrors.push(messages);
          }
        }
      }
      if (fieldErrors.length > 0) {
        return fieldErrors.join(" - ");
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

  // خطای کد
  if (error?.code) {
    for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
      if (error.code === key || error.code.includes(key)) {
        return value;
      }
    }
  }

  return "خطایی رخ داده است. لطفاً مجدداً تلاش کنید.";
};

// ✅ نمایش خطا با Toast (بدون ایموجی)
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
