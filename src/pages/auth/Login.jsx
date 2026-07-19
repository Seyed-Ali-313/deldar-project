// src/pages/auth/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logoBg from "../../assets/images/logo-bg.png";
import logoGold from "../../assets/images/logo-gold.png";
import { requestLoginOtp, verifyLoginOtp } from "../../services/authService";
import { showError, getServerMessage, getFriendlyErrorMessage } from "../../utils/errorHandler";
import {
  success as toastSuccess,
  error as toastError,
} from "../../utils/toast";
import { useAuth } from "../../hooks/useAuth";
import toPersianDigits from "../../utils/toPersianNumber";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState("identifier");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleIdentifierChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9۰-۹]/g, "");
    value = value.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));

    if (value.length > 11) {
      setError("شماره موبایل یا کدملی معتبر نیست");
      setTimeout(() => setError(""), 2500);
      return;
    }

    setError("");
    setIdentifier(value);
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();

    const cleanIdentifier = identifier.replace(/[^0-9]/g, "");
    if (
      !cleanIdentifier ||
      (cleanIdentifier.length !== 11 && cleanIdentifier.length !== 10)
    ) {
      toastError("شماره موبایل (۱۱ رقم) یا کدملی (۱۰ رقم) را وارد کنید");
      return;
    }

    setLoading(true);
    try {
      const res = await requestLoginOtp(identifier);
      toastSuccess(getServerMessage(res, "کد تایید به شماره شما ارسال شد"));
      setStep("otp");
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const cleanOtp = otpCode.replace(/[^0-9]/g, "");
    if (cleanOtp.length !== 4) {
      toastError("کد ۴ رقمی را کامل وارد کنید");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyLoginOtp(identifier, cleanOtp);
      console.log("✅ ورود موفق:", res.data);

      const success = await login(res.data.tokens, res.data.user);

      if (success) {
        toastSuccess(getServerMessage(res, "ورود با موفقیت انجام شد"));
        navigate("/dashboard", { replace: true });
      } else {
        toastError("خطا در دریافت اطلاعات کاربری");
      }
    } catch (err) {
      console.error("❌ خطا:", err);
      if (!err.handledByInterceptor) {
        toastError(getFriendlyErrorMessage(err) || "خطا در تایید کد");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page login-page-v2">
      <div className="lg-bg-glow" aria-hidden="true" />

      <div className="lg-layout">
        {/* ستون فرم — سمت راست */}
        <motion.div
          className="lg-right-col"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <AnimatePresence mode="wait">
            {step === "identifier" ? (
              <motion.form
                key="identifier"
                onSubmit={handleRequestOtp}
                className="lg-form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="lg-title">ورود به حساب</h1>
                <p className="lg-subtitle">
                  شماره موبایل یا کدملی خود را وارد کنید
                </p>

                <div className="lg-field">
                  <label className="lg-label" htmlFor="lg-identifier">
                    شماره موبایل / کدملی
                  </label>
                  <div className="lg-pill">
                    <input
                      id="lg-identifier"
                      type="text"
                      className="lg-input"
                      placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                      value={identifier}
                      onChange={handleIdentifierChange}
                      autoFocus
                      inputMode="numeric"
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="lg-error"
                    >
                      {error}
                    </motion.div>
                  )}
                </div>

                <motion.button
                  type="submit"
                  className="lg-submit-btn"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.97 }}
                  style={{ opacity: loading ? 0.75 : 1 }}
                >
                  <span className="lg-btn-text">
                    {loading
                      ? "در حال ارسال..."
                      : "دریافت کد ورود"}
                  </span>
                  <span className="lg-btn-shine" aria-hidden="true" />
                </motion.button>

                <p className="lg-register-hint">
                  حساب کاربری ندارید؟{" "}
                  <Link to="/rules" state={{ fromRegisterFlow: true }} className="lg-link-register">
                    ثبت‌نام کنید
                  </Link>
                </p>
              </motion.form>
            ) : (
              <motion.form
                key="otp"
                onSubmit={handleVerifyOtp}
                className="lg-form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="lg-title">کد تایید</h1>
                <p className="lg-subtitle">
                  کد ۴ رقمی ارسال‌شده به{" "}
                  <bdi className="lg-subtitle-strong">{toPersianDigits(identifier)}</bdi> را وارد
                  کنید
                </p>

                <div className="lg-otp-row">
                  {[...Array(4)].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      value={otpCode[i] || ""}
                      onChange={(e) => {
                        let val = e.target.value;
                        val = val.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
                        if (!/^\d?$/.test(val)) return;
                        const newOtp = otpCode.split("");
                        newOtp[i] = val;
                        setOtpCode(newOtp.join("").slice(0, 4));
                        if (val && i < 3) {
                          document.querySelector(`#lg-otp-${i + 1}`)?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otpCode[i] && i > 0) {
                          document.querySelector(`#lg-otp-${i - 1}`)?.focus();
                        }
                      }}
                      id={`lg-otp-${i}`}
                      className="lg-otp-box"
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                <motion.button
                  type="submit"
                  className="lg-submit-btn"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.97 }}
                  style={{ opacity: loading ? 0.75 : 1 }}
                >
                  <span className="lg-btn-text">
                    {loading
                      ? "در حال بررسی..."
                      : "تایید و ورود"}
                  </span>
                  <span className="lg-btn-shine" aria-hidden="true" />
                </motion.button>

                <button
                  type="button"
                  onClick={() => setStep("identifier")}
                  className="lg-back-link"
                >
                  بازگشت و اصلاح شماره
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* جداکننده با نشان طلایی مرکزی */}
        <div className="lg-divider">
          <span className="lg-divider-ornament" aria-hidden="true" />
        </div>

        {/* ستون لوگو — سمت چپ */}
        <motion.div
          className="lg-left-col"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="lg-logo-block">
            <div className="lg-logo-glow" aria-hidden="true" />
            <div className="lg-logo-stack">
              <img src={logoBg} alt="" className="lg-logo-bg" />
              <img src={logoGold} alt="" className="lg-logo-fg" />
            </div>
            <p className="lg-caption">
              دعوت به تولید و جمع‌آوری عکس مستند
              <br />
              از وداع ایران با رهبر شهید انقلاب اسلامی
            </p>
          </div>
        </motion.div>
      </div>

      <style>{`
        .login-page-v2 {
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .lg-bg-glow {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse 900px 600px at 30% 40%, rgba(164, 135, 77, 0.10), transparent 60%),
            radial-gradient(ellipse 700px 500px at 75% 65%, rgba(2, 33, 16, 0.55), transparent 65%);
        }

        .lg-layout {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          width: 100%;
          margin: 0 auto;
          flex: 1;
          min-height: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(40px, 6vw, 90px);
          padding: 20px clamp(16px, 3vw, 40px);
          direction: rtl;
        }

        .lg-left-col {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          flex-shrink: 0;
        }

        .lg-logo-block {
          position: relative;
          width: clamp(330px, 31vw, 470px);
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .lg-logo-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 370px;
          height: 370px;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(164, 135, 77, 0.28), transparent 70%);
          filter: blur(20px);
          z-index: 0;
          pointer-events: none;
        }

        .lg-logo-stack {
          position: relative;
          z-index: 1;
          width: 100%;
          aspect-ratio: 785 / 928;
          margin: 0;
        }

        .lg-logo-bg,
        .lg-logo-fg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          object-fit: contain;
          object-position: center;
        }

        .lg-logo-bg { z-index: 1; }
        .lg-logo-fg { z-index: 2; }

        .lg-caption {
          position: relative;
          z-index: 1;
          margin-top: -105px;
          margin-bottom: 90px;
          margin-right: -30px;
          font-size: clamp(15px, 1.6vw, 19px);
          width: 100%;
          color: #C9A84C;
          font-weight: 600;
          line-height: 1.7;
          font-family: "w_Lotus", sans-serif;
          letter-spacing: 0.3px;
          text-align: center;
        }

        .lg-divider {
          position: relative;
          width: 1px;
          align-self: stretch;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(201, 168, 76, 0.35) 20%,
            rgba(201, 168, 76, 0.35) 80%,
            transparent
          );
          flex-shrink: 0;
        }

        .lg-divider-ornament {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 14px;
          height: 14px;
          transform: translate(-50%, -50%) rotate(45deg);
          border: 1.5px solid #C9A84C;
          background: #022110;
        }

        .lg-divider-ornament::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 4px;
          height: 4px;
          transform: translate(-50%, -50%);
          background: #C9A84C;
          border-radius: 50%;
        }

        .lg-right-col {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          min-width: 280px;
        }

        .lg-form {
          width: 100%;
          max-width: 360px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: right;
        }

        .lg-eyebrow {
          display: inline-block;
          font-family: "w_Lotus", sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #C9A84C;
          letter-spacing: 1.5px;
          padding: 5px 14px;
          border-radius: 20px;
          background: rgba(201, 168, 76, 0.1);
          border: 1px solid rgba(201, 168, 76, 0.25);
          margin-bottom: 16px;
        }

        .lg-title {
          font-family: "w_Nian", sans-serif;
          font-size: clamp(26px, 3vw, 34px);
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 6px;
          letter-spacing: 0.5px;
        }

        .lg-subtitle {
          font-size: clamp(13px, 1.4vw, 15px);
          color: rgba(255, 255, 255, 0.5);
          font-family: "w_Lotus", sans-serif;
          margin-bottom: 26px;
          line-height: 1.9;
        }

        .lg-subtitle-strong {
          color: #C9A84C;
          font-weight: 700;
          unicode-bidi: plaintext;
        }

        .lg-field {
          width: 100%;
          margin-bottom: 20px;
        }

        .lg-label {
          display: block;
          font-family: "w_Lotus", sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.65);
          margin-bottom: 8px;
          padding-right: 4px;
        }

        .lg-pill {
          width: 100%;
          height: 54px;
          background: #F3EFE6;
          border-radius: 16px;
          display: flex;
          align-items: center;
          transition: box-shadow 0.25s ease, border-color 0.25s ease;
          border: 1.5px solid transparent;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06);
        }

        .lg-pill:focus-within {
          border-color: #A4874D;
          box-shadow: 0 0 0 4px rgba(164, 135, 77, 0.15);
        }

        .lg-input {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          background: transparent;
          border-radius: 16px;
          padding: 0 20px;
          direction: rtl;
          text-align: right;
          font-family: "w_Lotus", sans-serif;
          font-size: 19px;
          font-weight: 700;
          color: #1a1a1a;
        }

        .lg-input::placeholder {
          color: rgba(0, 0, 0, 0.55);
          font-weight: 700;
          font-size: 17px;
        }

        .lg-error {
          color: #c0392b;
          font-size: 12.5px;
          font-weight: 600;
          margin-top: 8px;
          padding-right: 6px;
          text-align: right;
          font-family: "w_Lotus", sans-serif;
        }

        .lg-submit-btn {
          position: relative;
          width: 100%;
          height: 54px;
          border: none;
          border-radius: 16px;
          background: linear-gradient(135deg, #A4874D, #C9A84C);
          color: #ffffff;
          font-family: "w_Lotus", sans-serif;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          box-shadow: 0 6px 24px rgba(164, 135, 77, 0.3);
          margin-top: 4px;
          letter-spacing: 0.3px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          overflow: hidden;
        }

        .lg-submit-btn .lg-btn-text {
          position: relative;
          z-index: 2;
        }

        .lg-submit-btn .lg-btn-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
          transition: left 0.6s ease;
          z-index: 1;
          border-radius: 16px;
        }

        .lg-submit-btn:hover .lg-btn-shine {
          left: 100%;
        }

        .lg-submit-btn:hover {
          background: linear-gradient(135deg, #b59659, #d4b55a);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(164, 135, 77, 0.45);
        }

        .lg-submit-btn:active {
          transform: scale(0.97);
        }

        .lg-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .lg-register-hint {
          margin-top: 24px;
          font-size: 15px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
          font-family: "w_Lotus", sans-serif;
          align-self: center;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .lg-link-register {
          color: #E8D5A3;
          font-weight: 800;
          text-decoration: none;
          font-size: 17px;
          padding: 6px 14px;
          border-radius: 14px;
          background: rgba(201, 168, 76, 0.08);
          border: 1.5px solid rgba(201, 168, 76, 0.15);
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          display: inline-block;
          position: relative;
          letter-spacing: 0.3px;
          text-shadow: 0 0 20px rgba(201, 168, 76, 0.05);
        }

        .lg-link-register::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(201, 168, 76, 0.1), transparent 50%);
          opacity: 0;
          transition: opacity 0.4s ease;
          border-radius: 14px;
        }

        .lg-link-register:hover {
          color: #F5E8C0;
          transform: translateY(-2px);
          border-color: rgba(201, 168, 76, 0.35);
          box-shadow: 0 6px 28px rgba(201, 168, 76, 0.2);
          background: rgba(201, 168, 76, 0.12);
          text-shadow: 0 0 30px rgba(201, 168, 76, 0.1);
        }

        .lg-link-register:hover::before {
          opacity: 1;
        }

        .lg-link-register:active {
          transform: scale(0.97);
        }

        .lg-back-link {
          margin-top: 18px;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.35);
          font-size: 13.5px;
          font-family: "w_Lotus", sans-serif;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: color 0.2s ease;
          align-self: center;
        }

        .lg-back-link:hover {
          color: #C9A84C;
        }

        .lg-otp-row {
          display: flex;
          gap: 12px;
          direction: ltr;
          margin-bottom: 26px;
        }

        .lg-otp-box {
          width: 58px;
          height: 64px;
          text-align: center;
          font-size: 26px;
          font-weight: 700;
          font-family: "w_Lotus", sans-serif;
          background: #F3EFE6;
          color: #1a1a1a;
          border: 1.5px solid transparent;
          border-radius: 14px;
          outline: none;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06);
        }

        .lg-otp-box:focus {
          border-color: #A4874D;
          box-shadow: 0 0 0 4px rgba(164, 135, 77, 0.15);
        }

        @media (max-width: 900px) {
          .lg-layout {
            flex-direction: column;
            gap: 24px;
          }
          .lg-divider {
            width: 60%;
            height: 1px;
            align-self: center;
            background: linear-gradient(
              to right,
              transparent,
              rgba(201, 168, 76, 0.35) 20%,
              rgba(201, 168, 76, 0.35) 80%,
              transparent
            );
          }
          .lg-form {
            align-items: center;
            text-align: center;
          }
          .lg-label {
            text-align: center;
          }
          .lg-error {
            text-align: center;
          }
          .lg-otp-row {
            justify-content: center;
          }
          /* ✅ هماهنگ و بزرگ‌تر از قبل، وسط‌چین */
          .lg-logo-block {
            width: clamp(600px, 80vw, 600px) !important;
            margin: 0 auto !important;
          }
          /* ✅ متن بزرگ‌تر و نزدیک‌تر به لوگو */
          .lg-caption {
            font-size: clamp(16px, 2.6vw, 20px) !important;
            margin-top: -30px !important;
          }
          .lg-register-hint {
            font-size: 14px;
          }
          .lg-link-register {
            font-size: 16px;
            padding: 4px 12px;
          }
        }

        @media (max-width: 480px) {
          .lg-otp-box {
            width: 48px;
            height: 54px;
            font-size: 21px;
          }
          /* ✅ بزرگ‌تر و وسط‌چین */
          .lg-logo-block {
            width: clamp(400px, 85vw, 520px) !important;
            margin: 0 auto !important;
          }
          /* ✅ متن بزرگ‌تر و نزدیک‌تر به لوگو */
          .lg-caption {
            font-size: clamp(16px, 4.2vw, 19px) !important;
            margin-top: -18px !important;
          }
          .lg-pill {
            height: 48px;
          }
          .lg-input {
            font-size: 15px;
          }
          .lg-submit-btn {
            height: 50px;
            font-size: 15px;
          }
          .lg-register-hint {
            font-size: 12px;
          }
          .lg-link-register {
            font-size: 14px;
            padding: 3px 8px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .lg-btn-arrow,
          .lg-submit-btn,
          .lg-pill,
          .lg-otp-box,
          .lg-link-register {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
