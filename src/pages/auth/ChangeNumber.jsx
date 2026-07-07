// src/pages/auth/ChangeNumber.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { resendOtp } from "../../services/onboardingService";
import {
  success as toastSuccess,
  error as toastError,
} from "../../utils/toast";

export default function ChangeNumber() {
  const [newMobile, setNewMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanMobile = newMobile.replace(/[^0-9]/g, "");
    if (cleanMobile.length !== 11) {
      toastError("شماره موبایل باید ۱۱ رقم باشد");
      return;
    }

    if (!cleanMobile.startsWith("09")) {
      toastError("شماره موبایل باید با ۰۹ شروع شود");
      return;
    }

    setLoading(true);
    try {
      await resendOtp(cleanMobile);

      // ✅ به‌روزرسانی شماره در sessionStorage
      const step1Data = sessionStorage.getItem("register_step1");
      if (step1Data) {
        const data = JSON.parse(step1Data);
        data.mobile = cleanMobile;
        sessionStorage.setItem("register_step1", JSON.stringify(data));
      }

      toastSuccess("کد تایید به شماره جدید ارسال شد");
      navigate("/verify-otp", {
        state: { mobile: cleanMobile },
        replace: true,
      });
    } catch (err) {
      const msg = err.response?.data?.detail || "خطا در ارسال کد";
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
        background:
          "radial-gradient(circle at 30% 20%, rgba(201,168,76,0.08) 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgba(164,135,77,0.06) 0%, transparent 50%), rgba(3, 65, 32, 1)",
        padding: "20px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          maxWidth: "400px",
          width: "100%",
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          padding: "32px 28px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, rgba(201,168,76,0.25), rgba(201,168,76,0.08))",
            border: "1.5px solid rgba(201,168,76,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
            boxShadow: "0 4px 16px rgba(201,168,76,0.15)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
              stroke="#C9A84C"
              strokeWidth="1.8"
            />
            <path
              d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
              stroke="#C9A84C"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        <h2
          style={{
            fontSize: "20px",
            fontWeight: 800,
            color: "#ffffff",
            fontFamily: "w_Lotus, sans-serif",
            marginBottom: "6px",
          }}
        >
          تغییر شماره موبایل
        </h2>

        <p
          style={{
            fontSize: "15px",
            color: "rgba(255,255,255,0.6)",
            fontFamily: "w_Lotus, sans-serif",
            marginBottom: "24px",
            lineHeight: "1.8",
          }}
        >
          شماره موبایل جدید خود را وارد کنید
        </p>

        <form onSubmit={handleSubmit}>
          <div
            className="pill"
            style={{
              width: "100%",
              height: "54px",
              background: "#F3EFE6",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              border: "1.5px solid transparent",
              transition: "box-shadow 0.25s ease, border-color 0.25s ease",
            }}
          >
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="register-input"
              placeholder="شماره موبایل جدید: 09123456789"
              value={newMobile}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                if (val.length <= 11) setNewMobile(val);
              }}
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#1a1a1a",
              }}
              autoFocus
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "20px",
            }}
          >
            <motion.button
              type="button"
              onClick={() => navigate("/verify-otp")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)",
                color: "rgba(255,255,255,0.5)",
                fontSize: "15px",
                fontWeight: 600,
                fontFamily: "w_Lotus, sans-serif",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
            >
              انصراف
            </motion.button>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                flex: 2,
                padding: "12px",
                borderRadius: "16px",
                border: "none",
                background: loading
                  ? "rgba(255,255,255,0.06)"
                  : "linear-gradient(135deg, #A4874D, #C9A84C)",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 700,
                fontFamily: "w_Nian, sans-serif",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.5 : 1,
                transition: "all 0.25s ease",
              }}
            >
              {loading ? "در حال ارسال..." : "ارسال کد تایید"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
