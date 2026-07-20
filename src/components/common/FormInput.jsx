// src/components/common/FormInput.jsx
import { useState, useEffect } from "react";

export default function FormInput({
  placeholder,
  required,
  register,
  name,
  type = "text",
  error,
  onBlur,
  validate,
  inputMode,
  pattern,
  ...props
}) {
  const [touched, setTouched] = useState(false);
  const [clientError, setClientError] = useState(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (error) {
      setTouched(true);
    }
  }, [error]);

  const handleBlur = (e) => {
    setTouched(true);

    if (validate) {
      const result = validate(e.target.value);
      setClientError(result);
    }

    if (onBlur) onBlur(e);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);

    // اگر pattern عددی هست، اعداد فارسی رو به انگلیسی تبدیل کن
    if (pattern === "[0-9]*" && val) {
      const converted = String(val).replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
      if (converted !== val) {
        e.target.value = converted;
        setValue(converted);
        if (register && name) {
          register(name).onChange(e);
        }
        return;
      }
      if (!/^[0-9]*$/.test(val)) {
        const cleaned = val.replace(/[^0-9]/g, "");
        e.target.value = cleaned;
        setValue(cleaned);
        if (register && name) {
          register(name).onChange(e);
        }
        return;
      }
    }

    if (register && name) {
      register(name).onChange(e);
    }
  };

  const displayError = clientError || error || null;
  const displayPlaceholder = displayError || placeholder;

  return (
    <div style={{ width: "100%", position: "relative" }}>
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
          type={type}
          className="register-input"
          placeholder={displayPlaceholder}
          style={{
            color: displayError ? "#c0392b" : "#1a1a1a",
          }}
          inputMode={inputMode}
          pattern={pattern}
          {...(register
            ? register(name, {
                required: required ? "این فیلد الزامی است" : false,
              })
            : {})}
          onBlur={(e) => {
            setTouched(true);
            if (validate) {
              const result = validate(e.target.value);
              setClientError(result);
            }
            if (onBlur) onBlur(e);
            if (register && name) register(name).onBlur(e);
          }}
          onChange={(e) => {
            const val = e.target.value;
            setValue(val);
            if (pattern === "[0-9]*" && val) {
              const converted = String(val).replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
              if (converted !== val) {
                e.target.value = converted;
                setValue(converted);
                if (register && name) register(name).onChange(e);
                return;
              }
              if (!/^[0-9]*$/.test(val)) {
                const cleaned = val.replace(/[^0-9]/g, "");
                e.target.value = cleaned;
                setValue(cleaned);
                if (register && name) register(name).onChange(e);
                return;
              }
            }
            if (register && name) register(name).onChange(e);
          }}
          {...props}
        />
        {required && <span className="req">*</span>}
      </div>

      {displayError && (
        <div
          style={{
            color: "#c0392b",
            fontSize: "12px",
            fontWeight: 600,
            marginTop: "-1px",
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
