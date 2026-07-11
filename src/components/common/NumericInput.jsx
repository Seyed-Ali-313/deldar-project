// src/components/common/NumericInput.jsx
import { useState, useEffect } from "react";
import toPersianNumber from "../../utils/toPersianNumber";

export default function NumericInput({
  placeholder,
  required,
  register,
  name,
  maxLength,
  minLength,
  exactLength,
  label,
  error: serverError,
  validate,
  ...props
}) {
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

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
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text");
    if (!/^[0-9۰-۹]*$/.test(pasted)) {
      e.preventDefault();
    }
  };

  const handleBlur = (e) => {
    setTouched(true);
    const value = e.target.value;
    const cleanValue = value.replace(/[^0-9]/g, "");

    if (validate) {
      const result = validate(value);
      setError(result || "");
    }

    if (
      exactLength &&
      cleanValue.length > 0 &&
      cleanValue.length !== exactLength
    ) {
      setError(`باید دقیقاً ${toPersianNumber(exactLength)} رقم باشد`);
    }
  };

  const handleFocus = () => {
    setError("");
  };

  const handleChange = (e) => {
    const val = e.target.value;
    // ✅ فقط اعداد مجاز
    if (val && !/^[0-9۰-۹]*$/.test(val)) {
      setError("فقط عدد مجاز است");
      setTimeout(() => setError(""), 2500);
    } else {
      setError("");
    }
  };

  // ✅ نمایش خطا
  const displayError = error || serverError || null;

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
    return String(value).replace(/[۰-۹]/g, (d) => persianMap[d] || d);
  };

  // ✅ فقط از register استفاده کن، نه value و onChange جدا
  const regOptions = register
    ? register(name, {
        required: required ? "این فیلد الزامی است" : false,
        pattern: {
          value: /^[0-9۰-۹]*$/,
          message: "فقط عدد مجاز است",
        },
        maxLength:
          maxLength || exactLength
            ? {
                value: maxLength || exactLength,
                message: `حداکثر ${toPersianNumber(maxLength || exactLength)} رقم`,
              }
            : undefined,
        minLength: minLength
          ? {
              value: minLength,
                message: `حداقل ${toPersianNumber(minLength)} رقم`,
            }
          : undefined,
        validate: exactLength
          ? (value) => {
              const cleanValue = value.replace(/[^0-9]/g, "");
              if (cleanValue.length === 0) return true;
              return (
                cleanValue.length === exactLength ||
                `باید دقیقاً ${toPersianNumber(exactLength)} رقم باشد`
              );
            }
          : undefined,
        setValueAs: (value) => convertToEnglishDigits(value),
      })
    : {};

  // ✅ placeholder رو همیشه اصلی نشون بده
  const displayPlaceholder = displayError || placeholder;

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
      <div
        className="pill"
        style={{
          borderColor: displayError ? "#c0392b" : "transparent",
          borderWidth: displayError ? "2px" : "0",
          borderStyle: displayError ? "solid" : "none",
          backgroundColor: displayError
            ? "rgba(192,57,43,0.04)"
            : "var(--pill-bg)",
          transition: "all 0.25s ease",
        }}
      >
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className="register-input"
          placeholder={displayPlaceholder}
          maxLength={maxLength || exactLength || 20}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          style={{
            color: displayError ? "#c0392b" : "#1a1a1a",
            direction: "ltr",
            textAlign: "right",
          }}
          {...regOptions}
          {...props}
        />
        {required && !label && <span className="req">*</span>}
      </div>

      {displayError && (
        <div
          style={{
            color: "#c0392b",
            fontSize: "12px",
            fontWeight: 600,
            marginTop: "6px",
            paddingRight: "14px",
            textAlign: "right",
            fontFamily: "w_Nian, sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span style={{ fontSize: "10px" }}>●</span>
          {displayError}
        </div>
      )}
    </div>
  );
}
