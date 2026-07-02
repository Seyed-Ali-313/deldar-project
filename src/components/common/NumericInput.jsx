import { useState } from "react";

export default function NumericInput({
  placeholder,
  required,
  register,
  name,
  maxLength,
  minLength,
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
      setError("فقط عدد مجاز است");
      setTimeout(() => setError(""), 2500);
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text");
    if (!/^[0-9۰-۹]*$/.test(pasted)) {
      e.preventDefault();
      setError("فقط عدد مجاز است");
      setTimeout(() => setError(""), 2500);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    if (val && !/^[0-9۰-۹]*$/.test(val)) {
      setError("فقط عدد مجاز است");
      setTimeout(() => setError(""), 2500);
    } else {
      setError("");
    }
  };

  const handleFocus = () => setError("");

  const regOptions = register
    ? register(name, {
        required: required ? "این فیلد الزامی است" : false,
        pattern: {
          value: /^[0-9۰-۹]*$/,
          message: "فقط عدد مجاز است",
        },
        maxLength: maxLength
          ? {
              value: maxLength,
              message: `حداکثر ${maxLength} رقم`,
            }
          : undefined,
        minLength: minLength
          ? {
              value: minLength,
              message: `حداقل ${minLength} رقم`,
            }
          : undefined,
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
          onFocus={handleFocus}
          {...regOptions}
          {...props}
        />
        {required && !label && <span className="req">*</span>}
      </div>

      {error && <div className="input-error-message">{error}</div>}
    </div>
  );
}
