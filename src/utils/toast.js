// src/utils/toast.js
import { toast as toastify } from "react-toastify";

// تنظیمات پیش‌فرض
const defaultOptions = {
  position: "top-center",
  autoClose: 3500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  style: {
    fontFamily: "w_Nian, sans-serif",
    borderRadius: "14px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
    padding: "14px 20px",
    fontSize: "14px",
    fontWeight: "600",
    lineHeight: "1.6",
  },
};

// ✅ Toast موفقیت
export const success = (message, options = {}) => {
  toastify.success(message, {
    ...defaultOptions,
    ...options,
    style: {
      ...defaultOptions.style,
      background: "#f0faf5",
      color: "#034120",
      border: "1px solid rgba(3, 65, 32, 0.12)",
    },
    icon: false,
  });
};

// ✅ Toast خطا
export const error = (message, options = {}) => {
  toastify.error(message, {
    ...defaultOptions,
    ...options,
    style: {
      ...defaultOptions.style,
      background: "#fdf0ed",
      color: "#c0392b",
      border: "1px solid rgba(192, 57, 43, 0.12)",
    },
    icon: false,
  });
};

// ✅ Toast هشدار / اطلاع
export const info = (message, options = {}) => {
  toastify.info(message, {
    ...defaultOptions,
    ...options,
    style: {
      ...defaultOptions.style,
      background: "#faf8f0",
      color: "#A4874D",
      border: "1px solid rgba(164, 135, 77, 0.15)",
    },
    icon: false,
  });
};

// ✅ Toast هشدار (Warning)
export const warn = (message, options = {}) => {
  toastify.warning(message, {
    ...defaultOptions,
    ...options,
    style: {
      ...defaultOptions.style,
      background: "#fdf6e8",
      color: "#b8860b",
      border: "1px solid rgba(184, 134, 11, 0.15)",
    },
    icon: false,
  });
};

// ✅ نمایش خطاهای چندگانه در یک toast
export const showErrors = (errors) => {
  if (!errors || errors.length === 0) return;

  const message =
    errors.length === 1
      ? errors[0]
      : errors.map((e, i) => `${i + 1}. ${e}`).join(" • ");

  error(message);
};

// ✅ حذف همه toast ها
export const dismissAll = () => {
  toastify.dismiss();
};

// ✅ Toast عمومی
export const show = (message, type = "info", options = {}) => {
  const types = { success, error, info, warn };
  const fn = types[type] || info;
  fn(message, options);
};
