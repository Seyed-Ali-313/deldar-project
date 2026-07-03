// src/components/common/NumericInput.jsx
import { useState } from "react";

export default function NumericInput({
  placeholder,
  required,
  register,
  name,
  maxLength,
  minLength,
  exactLength,
  label,
  ...props
}) {
  const [error, setError] = useState("");

  const handleKeyDown = (e) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Home",
      "End",
    ];
    if (allowedKeys.includes(e.key)) return;

    const isEnglishDigit = /^[0-9]$/.test(e.key);
    const isPersianDigit = /^[۰-۹]$/.test(e.key);

    if (!isEnglishDigit && !isPersianDigit) {
      e.preventDefault();
      setError("❌ لطفاً فقط از اعداد استفاده کنید");
      setTimeout(() => setError(""), 2500);
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text");
    if (!/^[0-9۰-۹]*$/.test(pasted)) {
      e.preventDefault();
      setError("❌ لطفاً فقط از اعداد استفاده کنید");
      setTimeout(() => setError(""), 2500);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    // فقط اعداد مجاز
    if (val && !/^[0-9۰-۹]*$/.test(val)) {
      setError("❌ لطفاً فقط از اعداد استفاده کنید");
      setTimeout(() => setError(""), 2500);
    } else {
      setError("");
    }

    // ✅ اعتبارسنجی دقیق طول
    if (exactLength && val.length > 0 && val.length === exactLength) {
      setError("");
    }
  };

  const handleBlur = (e) => {
    const val = e.target.value;
    // ✅ بررسی دقیق طول در هنگام خروج از فیلد
    if (exactLength && val.length > 0 && val.length !== exactLength) {
      setError(`❌ باید دقیقاً ${exactLength} رقم باشد`);
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleFocus = () => setError("");

  // ✅ تبدیل اعداد فارسی به انگلیسی برای ارسال به سرور
  const convertToEnglishDigits = (value) => {
    const persianMap = {
      "۰": "0",
      "۱": "1",
      "۲": "2",
      "۳": "3",
      "۴": "4",
      "۵": "5",
      "۶": "6",
      "۷": "7",
      "۸": "8",
      "۹": "9",
    };
    return String(value).replace(/[۰-۹]/g, (d) => persianMap[d]);
  };

  const regOptions = register
    ? register(name, {
        required: required ? "این فیلد الزامی است" : false,
        pattern: {
          value: /^[0-9۰-۹]*$/,
          message: "❌ لطفاً فقط از اعداد استفاده کنید",
        },
        maxLength: maxLength
          ? {
              value: maxLength,
              message: `❌ حداکثر ${maxLength} رقم`,
            }
          : undefined,
        minLength: minLength
          ? {
              value: minLength,
              message: `❌ حداقل ${minLength} رقم`,
            }
          : undefined,
        validate: exactLength
          ? (value) => {
              const cleanValue = value.replace(/[^0-9]/g, "");
              return (
                cleanValue.length === exactLength ||
                `❌ باید دقیقاً ${exactLength} رقم باشد`
              );
            }
          : undefined,
        setValueAs: (value) => convertToEnglishDigits(value),
      })
    : {};

  return (
    <div style={{ width: "100%" }}>
      {label && (
        <label
          className="input-label"
          style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}
        >
          {label}
          {required && <span style={{ color: "#B00101" }}> *</span>}
        </label>
      )}
      <div className="pill">
        <input
          type="text"
          inputMode="numeric"
          className="register-input"
          placeholder={placeholder}
          maxLength={maxLength}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          {...regOptions}
          {...props}
        />
        {required && !label && <span className="req">*</span>}
      </div>

      {error && (
        <div
          style={{
            color: "#E8746A",
            fontSize: "13px",
            fontWeight: 600,
            marginTop: "6px",
            paddingRight: "14px",
            textAlign: "right",
            fontFamily: "w_Lotus, sans-serif",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
