// src/utils/validators.js

// ============================================
// ✅ اعتبارسنجی شماره موبایل
// ============================================
export const validateMobile = (value) => {
  if (!value) return "شماره موبایل الزامی است";
  const clean = String(value).replace(/\s/g, "");
  if (!/^09\d{9}$/.test(clean)) {
    return "شماره موبایل باید با ۰۹ شروع و ۱۱ رقم باشد";
  }
  return null;
};

// ============================================
// ✅ اعتبارسنجی کد ملی (با الگوریتم کامل)
// ============================================
export const validateNationalCode = (value) => {
  if (!value) return "کد ملی الزامی است";
  const clean = String(value).replace(/\s/g, "");
  if (!/^\d{10}$/.test(clean)) {
    return "کد ملی باید ۱۰ رقم باشد";
  }

  // الگوریتم اعتبارسنجی کد ملی
  const code = clean;
  const check = parseInt(code[9]);
  const sum = code
    .split("")
    .slice(0, 9)
    .reduce((acc, digit, i) => acc + parseInt(digit) * (10 - i), 0);
  const remainder = sum % 11;

  if (remainder < 2 && check !== remainder) return "کد ملی معتبر نیست";
  if (remainder >= 2 && check !== 11 - remainder) return "کد ملی معتبر نیست";

  return null;
};

// ============================================
// ✅ اعتبارسنجی کدپستی
// ============================================
export const validatePostalCode = (value) => {
  if (!value) return "کدپستی الزامی است";
  const clean = String(value).replace(/\s/g, "");
  if (!/^\d{10}$/.test(clean)) {
    return "کدپستی باید ۱۰ رقم باشد";
  }
  return null;
};

// ============================================
// ✅ اعتبارسنجی تاریخ تولد
// ============================================
export const validateBirthDate = (value) => {
  if (!value) return "تاریخ تولد الزامی است";

  // پشتیبانی از دو فرمت: YYYY-MM-DD یا YYYY/MM/DD
  const parts = value.split(/[-/]/);
  if (parts.length !== 3) return "فرمت تاریخ صحیح نیست (YYYY-MM-DD)";

  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return "تاریخ تولد باید شامل اعداد باشد";
  }

  if (year < 1300 || year > 1410) {
    return "سال تولد باید بین ۱۳۰۰ تا ۱۴۱۰ باشد";
  }

  if (month < 1 || month > 12) {
    return "ماه تولد باید بین ۱ تا ۱۲ باشد";
  }

  // بررسی روزهای هر ماه
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return `روز تولد باید بین ۱ تا ${daysInMonth} باشد`;
  }

  return null;
};

// ============================================
// ✅ اعتبارسنجی فیلدهای اجباری
// ============================================
export const validateRequired = (value, fieldName = "فیلد") => {
  if (!value || String(value).trim() === "") {
    return `${fieldName} الزامی است`;
  }
  return null; // ✅ حتماً null برگردونه
};

// ============================================
// ✅ اعتبارسنجی طول متن
// ============================================
export const validateMinLength = (value, min, fieldName = "فیلد") => {
  if (!value) return null;
  if (String(value).length < min) {
    return `${fieldName} باید حداقل ${min} کاراکتر باشد`;
  }
  return null;
};

export const validateMaxLength = (value, max, fieldName = "فیلد") => {
  if (!value) return null;
  if (String(value).length > max) {
    return `${fieldName} باید حداکثر ${max} کاراکتر باشد`;
  }
  return null;
};

// ============================================
// ✅ اعتبارسنجی ایمیل
// ============================================
export const validateEmail = (value) => {
  if (!value) return null; // اختیاری
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return "ایمیل معتبر نیست";
  }
  return null;
};

// ============================================
// ✅ تبدیل خطاهای سرور به پیام کاربرپسند
// ============================================
export const getServerFieldError = (errorData, fieldMap) => {
  if (!errorData?.errors) return null;

  const errors = errorData.errors;
  const errorList = [];

  for (const [field, messages] of Object.entries(errors)) {
    if (messages && messages.length > 0) {
      const mappedField = fieldMap[field] || field;
      errorList.push({
        field: mappedField,
        message: messages[0],
        rawField: field,
      });
    }
  }

  return errorList;
};

// ============================================
// ✅ مپ کردن فیلدهای سرور به نام‌های فارسی
// ============================================
export const fieldNameMap = {
  first_name: "نام",
  last_name: "نام خانوادگی",
  job: "شغل",
  birth_date: "تاریخ تولد",
  national_code: "کد ملی",
  mobile: "شماره موبایل",
  province: "استان",
  city: "شهر",
  address: "آدرس",
  postal_code: "کدپستی",
  telegram_id: "شناسه تلگرام",
  bale_id: "شناسه بله",
  email: "ایمیل",
  password: "رمز عبور",
};

// ============================================
// ✅ تابع کمکی برای تبدیل خطا به پیام
// ============================================
export const getErrorMessage = (err, fallback = "خطا در ارتباط با سرور") => {
  if (!err) return fallback;

  const errorData = err.response?.data;

  if (errorData?.detail) {
    return errorData.detail;
  }

  if (errorData?.error?.message) {
    return errorData.error.message;
  }

  if (errorData?.message) {
    return errorData.message;
  }

  if (errorData?.errors) {
    const firstError = Object.values(errorData.errors)[0]?.[0];
    if (firstError) return firstError;
  }

  return fallback;
};
