// src/pages/auth/VerifyOtp.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp } from "../../services/onboardingService";
import { toast } from "react-toastify";

const RESEND_SECONDS = 124;

export default function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(RESEND_SECONDS);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 3) inputsRef.current[index + 1]?.focus();
  };

  const handleSubmit = async () => {
    const code = otp.join("");
    if (code.length !== 4) {
      toast.error("کد ۴ رقمی را کامل وارد کنید");
      return;
    }
    try {
      const res = await verifyOtp(code);
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      toast.success("ثبت‌نام با موفقیت انجام شد");
      navigate("/dashboard");
    } catch (err) {
      toast.error("کد وارد شده صحیح نیست");
    }
  };

  return (
    <div
      className="page"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 80,
      }}
    >
      <p style={{ marginBottom: 24, textAlign: "center" }}>
        در یک‌بار مصرف ۴ رقمی که به شماره موبایل شما ارسال شده را وارد کنید.
      </p>

      <div style={{ display: "flex", gap: 16, direction: "ltr" }}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            style={{
              width: 60,
              height: 60,
              textAlign: "center",
              fontSize: 28,
              background: "var(--color-bg-dark)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
            }}
          />
        ))}
      </div>

      <p style={{ marginTop: 16, color: "#d9d9d9" }}>
        زمان باقی مانده: {timeLeft} ثانیه
      </p>

      {timeLeft <= 0 && (
        <button
          style={{
            background: "none",
            color: "var(--color-gold)",
            marginBottom: 16,
          }}
        >
          ارسال مجدد / تغییر شماره
        </button>
      )}

      <button className="submit-btn" onClick={handleSubmit}>
        تأیید و ارسال مجموع آثار
      </button>
    </div>
  );
}
