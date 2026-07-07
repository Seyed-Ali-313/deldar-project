import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { verifyOtp } from "../../services/onboardingService";
import { useAuth } from "../../hooks/useAuth";
import {
  success as toastSuccess,
  error as toastError,
  info as toastInfo,
} from "../../utils/toast";
import useRegisterData from "../../hooks/useRegisterData";

const RESEND_SECONDS = 124;

export default function VerifyOtp() {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();
  const { data, setActiveTab } = useRegisterData();

  // ✅ شماره از context (نه location.state)
  const mobile = data.personal.mobile || "۰۹۱۲۳۴۵۶۷۸۹";

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(RESEND_SECONDS);
  const [activeIndex, setActiveIndex] = useState(null);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoggedIn, navigate]);

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

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async () => {
    const code = otp.join("");
    if (code.length !== 4) {
      toastError("کد ۴ رقمی را کامل وارد کنید");
      triggerShake();
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtp(code);
      const success = await login(res.data.tokens, res.data.user);

      if (success) {
        toastSuccess("ثبت‌نام با موفقیت انجام شد");
        navigate("/dashboard", { replace: true });
      } else {
        toastError("خطا در دریافت اطلاعات کاربری");
      }
    } catch (err) {
      const msg = err.response?.data?.detail || "کد وارد شده صحیح نیست";
      toastError(msg);
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (timeLeft > 0) return;
    setTimeLeft(RESEND_SECONDS);
    setOtp(["", "", "", ""]);
    inputsRef.current[0]?.focus();
    toastInfo("کد جدید برای شما ارسال شد");
  };

  // ✅ تغییر شماره: برگشت به مرحله اول Register (داده‌ها دست‌نخورده چون هر دو مسیر داخل فلو هستن)
  const handleChangeNumber = () => {
    setActiveTab("personal");
    navigate("/register");
  };

  const toPersianDigits = (num) => {
    const map = {
      0: "۰",
      1: "۱",
      2: "۲",
      3: "۳",
      4: "۴",
      5: "۵",
      6: "۶",
      7: "۷",
      8: "۸",
      9: "۹",
    };
    return String(num).replace(/[0-9]/g, (d) => map[d]);
  };

  const formattedMobile = toPersianDigits(mobile);
  const progressPercent = (timeLeft / RESEND_SECONDS) * 100;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
        background:
          "radial-gradient(circle at 30% 20%, rgba(201,168,76,0.08) 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgba(164,135,77,0.06) 0%, transparent 50%), rgba(3, 65, 32, 1)",
        padding: "20px",
        marginTop: "-60px",
        overflow: "hidden",
      }}
    >
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "8%",
          left: "10%",
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          background: "rgba(201,168,76,0.12)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{ y: [0, 25, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        style={{
          position: "absolute",
          bottom: "10%",
          right: "8%",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          background: "rgba(10,90,46,0.4)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          position: "relative",
          maxWidth: "380px",
          width: "100%",
          textAlign: "center",
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px",
          padding: "28px 22px",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
          zIndex: 1,
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
              d="M12 15a3 3 0 100-6 3 3 0 000 6z"
              stroke="#C9A84C"
              strokeWidth="1.8"
            />
            <path
              d="M5 10V8a7 7 0 1114 0v2M4 10h16a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1v-9a1 1 0 011-1z"
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
            letterSpacing: "0.4px",
          }}
        >
          تأیید شماره موبایل
        </h2>

        <p
          style={{
            fontSize: "15px",
            color: "rgba(255,255,255,0.85)",
            fontFamily: "w_Lotus, sans-serif",
            lineHeight: "2",
            marginBottom: "20px",
            direction: "rtl",
            fontWeight: 600,
          }}
        >
          کد ۴ رقمی ارسال‌شده به شماره
          <br />
          <span
            style={{
              color: "#C9A84C",
              fontWeight: 800,
              fontSize: "17px",
              direction: "ltr",
              display: "inline-block",
              marginTop: "4px",
              letterSpacing: "1.2px",
            }}
          >
            {formattedMobile}
          </span>
          <br />
          را وارد کنید
        </p>

        <motion.div
          animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "16px",
            direction: "ltr",
          }}
        >
          {otp.map((digit, i) => (
            <motion.input
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              ref={(el) => (inputsRef.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onFocus={() => setActiveIndex(i)}
              onBlur={() => setActiveIndex(null)}
              style={{
                width: "50px",
                height: "56px",
                textAlign: "center",
                fontSize: "28px",
                fontWeight: 800,
                fontFamily: "w_Lotus, sans-serif",
                background:
                  activeIndex === i
                    ? "rgba(201,168,76,0.12)"
                    : digit
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(255,255,255,0.05)",
                color: "#ffffff",
                border:
                  activeIndex === i
                    ? "2px solid #C9A84C"
                    : digit
                      ? "2px solid rgba(201,168,76,0.4)"
                      : "2px solid rgba(255,255,255,0.12)",
                borderRadius: "12px",
                outline: "none",
                boxShadow:
                  activeIndex === i
                    ? "0 0 0 4px rgba(201,168,76,0.18), 0 8px 20px rgba(201,168,76,0.25)"
                    : "none",
                transition: "all 0.25s ease",
              }}
            />
          ))}
        </motion.div>

        <div style={{ marginBottom: "14px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "7px",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.65)",
                fontFamily: "w_Lotus, sans-serif",
                fontWeight: 600,
              }}
            >
              زمان باقی‌مانده:
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={timeLeft}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: timeLeft < 30 ? "#e05555" : "#C9A84C",
                  fontFamily: "w_Lotus, sans-serif",
                  minWidth: "36px",
                  textAlign: "center",
                  direction: "ltr",
                }}
              >
                {timeLeft}
              </motion.span>
            </AnimatePresence>
            <span
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.5)",
                fontFamily: "w_Lotus, sans-serif",
                fontWeight: 600,
              }}
            >
              ثانیه
            </span>
          </div>

          <div
            style={{
              width: "100%",
              maxWidth: "200px",
              height: "3px",
              margin: "0 auto",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.1)",
              overflow: "hidden",
            }}
          >
            <motion.div
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.9, ease: "linear" }}
              style={{
                height: "100%",
                borderRadius: "999px",
                background:
                  timeLeft < 30
                    ? "linear-gradient(90deg, #e05555, #ff8080)"
                    : "linear-gradient(90deg, #A4874D, #C9A84C)",
              }}
            />
          </div>
        </div>

        {/* ✅ دو دکمه جدا: ارسال مجدد (فقط وقتی تایمر تموم شد) + تغییر شماره (همیشه فعال) */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "18px",
            marginBottom: "18px",
          }}
        >
          <button
            onClick={handleResend}
            disabled={timeLeft > 0}
            style={{
              background: "none",
              border: "none",
              color: timeLeft > 0 ? "rgba(255,255,255,0.25)" : "#C9A84C",
              fontSize: "13px",
              fontWeight: 700,
              fontFamily: "w_Lotus, sans-serif",
              cursor: timeLeft > 0 ? "not-allowed" : "pointer",
              padding: "6px 8px",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              textDecorationColor:
                timeLeft > 0 ? "transparent" : "rgba(201,168,76,0.4)",
            }}
          >
            ارسال مجدد کد
          </button>

          <button
            onClick={handleChangeNumber}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.55)",
              fontSize: "13px",
              fontWeight: 700,
              fontFamily: "w_Lotus, sans-serif",
              cursor: "pointer",
              padding: "6px 8px",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            تغییر شماره موبایل
          </button>
        </div>

        <motion.button
          onClick={handleSubmit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "320px",
            minHeight: "44px",
            background: loading
              ? "rgba(100,100,100,0.5)"
              : "linear-gradient(135deg, rgba(165,135,77,1), rgba(201,168,76,1))",
            color: "#ffffff",
            borderRadius: "22px",
            border: "none",
            fontSize: "16px",
            fontWeight: 800,
            fontFamily: "w_Lotus, sans-serif",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow:
              "0 8px 28px rgba(165,135,77,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            overflow: "hidden",
            letterSpacing: "0.4px",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "در حال تأیید..." : "تأیید و ورود"}
        </motion.button>
      </motion.div>
    </div>
  );
}
