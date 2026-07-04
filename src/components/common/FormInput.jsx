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
  ...props
}) {
  const [touched, setTouched] = useState(false);
  const [clientError, setClientError] = useState(null);

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
          onBlur={handleBlur}
          style={{
            color: displayError ? "#c0392b" : "#1a1a1a",
          }}
          {...(register ? register(name, { required }) : {})}
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
