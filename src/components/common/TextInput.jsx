import { useState } from "react";

export default function TextInput({
  placeholder,
  required,
  register,
  name,
  maxLength,
  minLength,
  label,
  allowSpaces = true,
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
    if (e.key === " " && allowSpaces) return;

    // فقط حروف فارسی و انگلیسی
    const isPersianLetter = /^[\u0600-\u06FF\s]$/.test(e.key);
    const isEnglishLetter = /^[a-zA-Z]$/.test(e.key);

    if (!isPersianLetter && !isEnglishLetter) {
      e.preventDefault();
      setError("فقط حروف مجاز است");
      setTimeout(() => setError(""), 2500);
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text");
    const pattern = allowSpaces
      ? /^[\u0600-\u06FFa-zA-Z\s]*$/
      : /^[\u0600-\u06FFa-zA-Z]*$/;

    if (!pattern.test(pasted)) {
      e.preventDefault();
      setError("فقط حروف مجاز است");
      setTimeout(() => setError(""), 2500);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    const pattern = allowSpaces
      ? /^[\u0600-\u06FFa-zA-Z\s]*$/
      : /^[\u0600-\u06FFa-zA-Z]*$/;

    if (val && !pattern.test(val)) {
      setError("فقط حروف مجاز است");
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
          value: allowSpaces
            ? /^[\u0600-\u06FFa-zA-Z\s]*$/
            : /^[\u0600-\u06FFa-zA-Z]*$/,
          message: "فقط حروف مجاز است",
        },
        maxLength: maxLength
          ? {
              value: maxLength,
              message: `حداکثر ${maxLength} کاراکتر`,
            }
          : undefined,
        minLength: minLength
          ? {
              value: minLength,
              message: `حداقل ${minLength} کاراکتر`,
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
