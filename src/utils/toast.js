// src/utils/toast.js
import { toast as toastify } from "react-toastify";

// ✅ Toast موفقیت - با رنگ‌های سایت (سبز تیره + طلایی)
export const success = (message, options = {}) => {
  toastify.success(message, {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: {
      background: "#034120",
      color: "#C9A84C",
      border: "1px solid rgba(201, 168, 76, 0.3)",
      borderRadius: "14px",
      padding: "12px 20px",
      fontFamily: "w_Nian, sans-serif",
      fontSize: "14px",
      fontWeight: "700",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      letterSpacing: "0.3px",
    },
    progressStyle: {
      background: "linear-gradient(90deg, #A4874D, #C9A84C)",
      height: "3px",
      borderRadius: "0 0 14px 14px",
    },
    icon: false,
    ...options,
  });
};

// ✅ Toast خطا - با رنگ‌های سایت (قرمز + سفید)
export const error = (message, options = {}) => {
  toastify.error(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: {
      background: "#2a0a0a",
      color: "#ffffff",
      border: "1px solid rgba(176, 1, 1, 0.3)",
      borderRadius: "14px",
      padding: "12px 20px",
      fontFamily: "w_Nian, sans-serif",
      fontSize: "14px",
      fontWeight: "700",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      letterSpacing: "0.3px",
    },
    progressStyle: {
      background: "linear-gradient(90deg, #B00101, #ff4444)",
      height: "3px",
      borderRadius: "0 0 14px 14px",
    },
    icon: false,
    ...options,
  });
};

// ✅ Toast اطلاع‌رسانی - با رنگ‌های سایت
export const info = (message, options = {}) => {
  toastify.info(message, {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: {
      background: "#0a1a12",
      color: "#E8D5A3",
      border: "1px solid rgba(201, 168, 76, 0.2)",
      borderRadius: "14px",
      padding: "12px 20px",
      fontFamily: "w_Nian, sans-serif",
      fontSize: "14px",
      fontWeight: "700",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      letterSpacing: "0.3px",
    },
    progressStyle: {
      background: "linear-gradient(90deg, #A4874D, #C9A84C)",
      height: "3px",
      borderRadius: "0 0 14px 14px",
    },
    icon: false,
    ...options,
  });
};

// ✅ Toast هشدار
export const warning = (message, options = {}) => {
  toastify.warning(message, {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: {
      background: "#1a0e00",
      color: "#FFD54F",
      border: "1px solid rgba(255, 152, 0, 0.3)",
      borderRadius: "14px",
      padding: "12px 20px",
      fontFamily: "w_Nian, sans-serif",
      fontSize: "14px",
      fontWeight: "700",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      letterSpacing: "0.3px",
    },
    progressStyle: {
      background: "linear-gradient(90deg, #ff9800, #ff5722)",
      height: "3px",
      borderRadius: "0 0 14px 14px",
    },
    icon: false,
    ...options,
  });
};

// ✅ نمایش خطاهای چندگانه
export const showErrors = (errors) => {
  if (!errors || errors.length === 0) return;

  if (errors.length === 1) {
    error(`⚠️ ${errors[0]}`);
    return;
  }

  const errorList = errors.map((e, i) => `${i + 1}. ${e}`).join(" • ");
  error(`⚠️ ${errors.length} خطا: ${errorList}`);
};

// ✅ حذف همه toast ها
export const dismissAll = () => {
  toastify.dismiss();
};

// ✅ Toast عمومی
export const show = (message, type = "info", options = {}) => {
  const types = { success, error, info, warning };
  const fn = types[type] || info;
  fn(message, options);
};

// ✅ Alias برای سازگاری با کدهای قبلی
export const warn = warning;
