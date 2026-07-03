// src/pages/auth/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import logoBg from "../../assets/images/logo-bg.png";
import logoGold from "../../assets/images/logo-gold.png";

export default function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState("identifier");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleIdentifierChange = (e) => {
    const value = e.target.value;
    const cleaned = value.replace(/[^0-9۰-۹]/g, "");
    if (value !== cleaned) {
      setError("لطفاً فقط از اعداد استفاده کنید.");
      setTimeout(() => setError(""), 2500);
    } else {
      setError("");
    }
    setIdentifier(cleaned);
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!identifier) {
      toast.error("لطفاً شماره موبایل یا کدملی را وارد کنید");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    toast.success("کد تایید به شماره شما ارسال شد");
    setStep("otp");
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otpCode.length !== 4) {
      toast.error("کد ۴ رقمی را کامل وارد کنید");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    toast.success("ورود با موفقیت انجام شد");
    navigate("/dashboard");
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
                  whileHover={{ scale: loading ? 1 : 1.015 }}
                  whileTap={{ scale: loading ? 1 : 0.97 }}
                  style={{ opacity: loading ? 0.75 : 1 }}
                >
                  <span>{loading ? "در حال ارسال..." : "دریافت کد ورود"}</span>
                </motion.button>

                <p className="lg-register-hint">
                  حساب کاربری ندارید؟{" "}
                  <Link to="/rules" className="lg-link-register">
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
                <span className="lg-eyebrow">تایید هویت</span>
                <h1 className="lg-title">کد تایید</h1>
                <p className="lg-subtitle">
                  کد ۴ رقمی ارسال‌شده به{" "}
                  <bdi className="lg-subtitle-strong">{identifier}</bdi> را وارد
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
                        const val = e.target.value;
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
                  whileHover={{ scale: loading ? 1 : 1.015 }}
                  whileTap={{ scale: loading ? 1 : 0.97 }}
                  style={{ opacity: loading ? 0.75 : 1 }}
                >
                  <span>{loading ? "در حال بررسی..." : "تایید و ورود"}</span>
                  {!loading && <span className="lg-btn-arrow">←</span>}
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

        /* پس‌زمینه با گرادیان شعاعی برای ایجاد عمق */
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

        /* ===== ستون لوگو ===== */
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

        /* ===== جداکننده با نشان مرکزی ===== */
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

        /* ===== ستون فرم ===== */
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
          color: #E8746A;
          font-size: 12.5px;
          font-weight: 600;
          margin-top: 8px;
          padding-right: 6px;
          text-align: right;
          font-family: "w_Lotus", sans-serif;
        }

        .lg-submit-btn {
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
          transition: box-shadow 0.3s ease, transform 0.15s ease;
          box-shadow: 0 6px 20px rgba(164, 135, 77, 0.28);
          margin-top: 4px;
          letter-spacing: 0.3px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .lg-btn-arrow {
          transition: transform 0.25s ease;
          display: inline-block;
        }

        .lg-submit-btn:hover .lg-btn-arrow {
          transform: translateX(-4px);
        }

        .lg-submit-btn:hover {
          box-shadow: 0 8px 28px rgba(164, 135, 77, 0.4);
        }

        .lg-submit-btn:focus-visible {
          outline: 2px solid #C9A84C;
          outline-offset: 3px;
        }

        .lg-submit-btn:active {
          transform: scale(0.98);
        }

        .lg-register-hint {
          margin-top: 24px;
          font-size: 15px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.62);
          font-family: "w_Lotus", sans-serif;
          align-self: center;
        }

        .lg-link-register {
          color: #E0BE6B;
          font-weight: 800;
          text-decoration: none;
          transition: color 0.2s ease, background 0.2s ease;
          padding: 3px 4px;
          border-bottom: 2px solid rgba(201, 168, 76, 0.55);
        }

        .lg-link-register:hover {
          color: #E8D5A3;
          border-color: #E8D5A3;
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
          .lg-logo-block {
            width: clamp(220px, 48vw, 320px);
          }
          .lg-caption {
            font-size: 13px;
            margin-top: -52px;
          }
        }

        @media (max-width: 480px) {
          .lg-otp-box {
            width: 48px;
            height: 54px;
            font-size: 21px;
          }
          .lg-logo-block {
            width: clamp(165px, 58vw, 235px);
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
