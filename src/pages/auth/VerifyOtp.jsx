// src/pages/auth/VerifyOtp.jsx
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
// import { verifyOtp } from "../../services/onboardingService";
// 🔴 API کامنت شد - وقتی بک‌اند آماده شد، این خط رو از کامنت خارج کن
import { toast } from "react-toastify";

const RESEND_SECONDS = 124;

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  const mobile = location.state?.mobile || "۰۹۱۲۳۴۵۶۷۸۹";

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(RESEND_SECONDS);
  const inputsRef = useRef([]);

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

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // ============================================================
  // 📌 تابع تأیید کد
  // ============================================================
  const handleSubmit = async () => {
    const code = otp.join("");
    if (code.length !== 4) {
      toast.error("❌ کد ۴ رقمی را کامل وارد کنید");
      return;
    }

    /* ============================================================
       🔴 API واقعی - وقتی بک‌اند آماده شد، این بخش رو از کامنت خارج کن
       و قسمت شبیه‌سازی رو حذف کن
       ============================================================ */
    /*
    try {
      const res = await verifyOtp(code);
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      
      toast.success("✅ ثبت‌نام با موفقیت انجام شد");
      
      setTimeout(() => {
        navigate("/upload-success");
      }, 1500);
    } catch (err) {
      toast.error("❌ کد وارد شده صحیح نیست");
    }
    */

    // ============================================================
    // ✅ شبیه‌سازی موفقیت (فعلاً برای تست - هر کدی قبول میشه)
    // ============================================================
    console.log("📝 کد وارد شده:", code);

    toast.success(
      <div style={{ textAlign: "right", fontFamily: "w_Lotus, sans-serif" }}>
        <div
          style={{
            fontSize: "18px",
            fontWeight: 700,
            marginBottom: "4px",
            color: "#C9A84C",
          }}
        >
          ✅ ثبت‌نام با موفقیت انجام شد
        </div>
        <div style={{ fontSize: "13px", opacity: 0.9 }}>
          در حال انتقال به صفحه موفقیت...
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: 2000,
        style: {
          background: "linear-gradient(135deg, #034120, #0a5a2e)",
          color: "#ffffff",
          borderRadius: "16px",
          padding: "20px 28px",
          boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
          border: "1px solid rgba(164,135,77,0.3)",
          fontFamily: "w_Lotus, sans-serif",
        },
        progressStyle: {
          background: "linear-gradient(90deg, #A4874D, #C9A84C)",
          height: "4px",
        },
      },
    );

    // ذخیره توکن تستی (برای دسترسی به داشبورد)
    localStorage.setItem("access_token", "test_token_123");
    localStorage.setItem("refresh_token", "test_refresh_456");

    // ✅ بعد از تأیید، به صفحه موفقیت میره
    setTimeout(() => {
      navigate("/upload-success");
    }, 1500);
  };

  const handleResend = () => {
    if (timeLeft > 0) return;
    setTimeLeft(RESEND_SECONDS);
    toast.info("📨 کد جدید برای شما ارسال شد");
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

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
        background: "rgba(3, 65, 32, 1)",
        padding: "20px",
        marginTop: "-60px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          maxWidth: "440px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "15px",
            color: "rgba(255,255,255,0.8)",
            fontFamily: "w_Lotus, sans-serif",
            lineHeight: "2",
            marginBottom: "32px",
            direction: "rtl",
          }}
        >
          کد یکبار مصرف ۴ رقمی که به شماره موبایل شما
          <br />
          <span
            style={{
              color: "#C9A84C",
              fontWeight: 600,
              fontSize: "18px",
              direction: "ltr",
              display: "inline-block",
              marginTop: "2px",
            }}
          >
            ({formattedMobile})
          </span>{" "}
          ارسال شده را وارد کنید.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            marginBottom: "32px",
            direction: "ltr",
          }}
        >
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              style={{
                width: "60px",
                height: "68px",
                textAlign: "center",
                fontSize: "30px",
                fontWeight: 600,
                fontFamily: "w_Lotus, sans-serif",
                background: "rgba(255,255,255,0.06)",
                color: "#ffffff",
                border: "2px solid rgba(255,255,255,0.1)",
                borderRadius: "14px",
                outline: "none",
                transition: "all 0.2s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(164,135,77,0.5)";
                e.target.style.background = "rgba(255,255,255,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.1)";
                e.target.style.background = "rgba(255,255,255,0.06)";
              }}
            />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "6px",
            marginBottom: "14px",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.5)",
              fontFamily: "w_Lotus, sans-serif",
            }}
          >
            زمان باقی مانده:
          </span>
          <span
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: timeLeft < 30 ? "#B00101" : "#C9A84C",
              fontFamily: "w_Lotus, sans-serif",
              minWidth: "36px",
              textAlign: "center",
              direction: "ltr",
            }}
          >
            {timeLeft}
          </span>
          <span
            style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.3)",
              fontFamily: "w_Lotus, sans-serif",
            }}
          >
            ثانیه
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "32px",
          }}
        >
          <button
            onClick={handleResend}
            disabled={timeLeft > 0}
            style={{
              background: "none",
              border: "none",
              color: timeLeft > 0 ? "rgba(255,255,255,0.2)" : "#C9A84C",
              fontSize: "14px",
              fontWeight: 500,
              fontFamily: "w_Lotus, sans-serif",
              cursor: timeLeft > 0 ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              padding: "4px 8px",
              borderRadius: "4px",
              textDecoration: "underline",
              textUnderlineOffset: "2px",
              textDecorationColor:
                timeLeft > 0 ? "transparent" : "rgba(164,135,77,0.2)",
            }}
          >
            ارسال مجدد / تغییر شماره
          </button>
        </div>

        <motion.button
          onClick={handleSubmit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            width: "100%",
            maxWidth: "380px",
            minHeight: "48px",
            background: "rgba(165, 135, 77, 1)",
            color: "#ffffff",
            borderRadius: "24px",
            border: "none",
            fontSize: "16px",
            fontWeight: 600,
            fontFamily: "w_Lotus, sans-serif",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(165,135,77,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(178, 148, 90, 1)";
            e.currentTarget.style.boxShadow = "0 6px 28px rgba(165,135,77,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(165, 135, 77, 1)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(165,135,77,0.3)";
          }}
        >
          تأیید و ارسال مجموع آثار
        </motion.button>
      </motion.div>
    </div>
  );
}
