// src/pages/Home.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import branchArt from "../assets/images/branch-art.svg";
import birdArt from "../assets/images/bird-art.svg";
import logoBg from "../assets/images/logo-bg.png";
import logoGold from "../assets/images/logo-gold.png";
import Countdown from "../components/common/Countdown";

export default function Home() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  // ✅ دکمه ثبت نام و ارسال عکس - کاربر جدید به قوانین هدایت بشه
  const handleRegisterClick = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/rules", { state: { fromRegisterFlow: true } });
    }
  };

  // ✅ دکمه مطالعه فراخوان - همیشه به فراخوان میره
  const handleAnnouncementClick = () => {
    navigate("/announcement");
  };
  return (
    <div className="page hm-page">
      <div className="hm-bg-glow" aria-hidden="true" />

      <section className="hm-hero">
        <motion.div
          className="hm-hero-left"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="hm-illustration"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <div className="hm-branch-art">
              <img src={branchArt} alt="" />
            </div>
            <motion.div
              className="hm-bird-art"
              initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.34, 1.56, 0.64, 1],
                delay: 0.4,
              }}
            >
              <img src={birdArt} alt="" />
            </motion.div>
          </motion.div>

          <motion.div
            className="hm-countdown-wrap"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.25,
            }}
          >
            <Countdown targetDate="2026-08-08T23:59:59" />
          </motion.div>

          <motion.div
            className="hm-cta-row"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.35,
            }}
          >
            <button
              className="hm-btn hm-btn-secondary"
              onClick={handleAnnouncementClick}
            >
              مطالعه فراخوان
            </button>
            <button
              className="hm-btn hm-btn-primary"
              onClick={handleRegisterClick}
            >
              {isLoggedIn ? "ورود به صفحه کاربری" : "ثبت نام و ارسال عکس"}
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          className="hm-hero-right"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <div className="hm-logo-stack">
            <div className="hm-logo-glow" aria-hidden="true" />
            <img src={logoBg} alt="" className="hm-logo-bg" />
            <img src={logoGold} alt="" className="hm-logo-fg" />
          </div>
          <motion.p
            className="hm-caption"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
          >
            دعوت به تولید و جمع‌آوری عکس مستند
            <br />
            از وداع ایران با رهبر شهید انقلاب اسلامی
          </motion.p>
        </motion.div>
      </section>

      <style>{`
        /* ===== صفحه اصلی - نسخه نهایی ===== */
        .hm-page {
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        .hm-bg-glow {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse 900px 600px at 22% 35%, rgba(164, 135, 77, 0.12), transparent 60%),
            radial-gradient(ellipse 800px 600px at 80% 60%, rgba(2, 33, 16, 0.6), transparent 65%),
            radial-gradient(circle 600px at 50% 50%, rgba(164, 135, 77, 0.04), transparent);
        }

        /* ===== Hero ===== */
        .hm-hero {
          position: relative;
          z-index: 1;
          max-width: 1400px;
          width: 100%;
          display: flex;
          align-items: stretch;
          justify-content: center;
          padding: 20px clamp(16px, 2vw, 32px);
          gap: 188px;
          direction: ltr;
          margin-top: -115px;
        }

        .hm-hero-left,
        .hm-hero-right {
          direction: rtl;
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: auto;
          flex-shrink: 0;
        }

        .hm-hero-left {
          gap: clamp(16px, 3vh, 32px);
        }

        .hm-hero-right {
          text-align: center;
        }

        /* ===== تصویر شاخه ===== */
        .hm-illustration {
          position: relative;
          width: clamp(180px, 15vw, 250px);
          height: clamp(240px, 22vh, 340px);
          filter: drop-shadow(0 8px 30px rgba(0, 0, 0, 0.2));
        }

        .hm-branch-art {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .hm-branch-art img {
    width: 100%;
    height: 106%;
    margin-top: -7px;
    filter: drop-shadow(0 2px 16px rgba(164, 135, 77, 0.25));
}

        .hm-bird-art {
          position: absolute;
          top: -20px;
          left: 220px;
          width: 75px;
          height: 76px;
        }
        .hm-bird-art img {
          width: 233%;
          height: 100%;
          filter: drop-shadow(0 6px 20px rgba(0, 0, 0, 0.3));
        }

        /* ===== تایمر ===== */
        .hm-countdown-wrap {
          width: 100%;
          position: relative;
        }

        .hm-countdown-wrap .countdown-card {
          background: linear-gradient(160deg, rgba(6, 48, 26, 0.92), rgba(2, 26, 15, 0.96));
          backdrop-filter: blur(16px);
          border: 1px solid rgba(164, 135, 77, 0.2);
          border-radius: 24px;
          width: 100%;
          max-width: 300px;
          padding: clamp(20px, 2.5vh, 22px) 16px;
          direction: ltr;
          box-shadow: 
            0 12px 40px rgba(2, 20, 10, 0.5),
            0 0 0 1px rgba(164, 135, 77, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          transition: all 0.4s ease;
        }

        .hm-countdown-wrap:hover .countdown-card {
          border-color: rgba(164, 135, 77, 0.35);
          box-shadow: 0 16px 50px rgba(2, 20, 10, 0.6), 0 0 0 1px rgba(164, 135, 77, 0.12);
        }

        .hm-countdown-wrap .countdown-numbers {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          direction: ltr;
          font-family: "w_Lotus";
          font-weight: 600;
          font-size: clamp(32px, 5.5vh, 46px);
          line-height: 100%;
          letter-spacing: 0.08em;
          text-align: center;
          color: #f2e9d8;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
        }

        .hm-countdown-wrap .countdown-numbers span {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          transition: color 0.3s ease;
        }

        .hm-countdown-wrap .countdown-numbers span::after {
          content: "";
          position: absolute;
          top: 50%;
          right: -4px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(201, 168, 76, 0.5);
          transform: translateY(-50%);
          box-shadow: 0 0 8px rgba(201, 168, 76, 0.2);
          transition: all 0.3s ease;
        }

        .hm-countdown-wrap .countdown-numbers span:last-child::after {
          display: none;
        }

        .hm-countdown-wrap .countdown-labels {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          direction: ltr;
          color: #a4874d;
          font-family: "w_Lotus";
          font-weight: 600;
          font-size: 15px;
          line-height: 100%;
          letter-spacing: 0.08em;
          text-align: center;
          margin-top: 8px;
          transition: color 0.3s ease;
        }

        .hm-countdown-wrap:hover .countdown-labels {
          color: #c9a84c;
        }

        /* ===== دکمه‌ها ===== */
        .hm-cta-row {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: nowrap;
          width: 100%;
          max-width: 300px;
        }

        .hm-btn {
          position: relative;
          border-radius: 24px;
          font-size: clamp(13px, 2vw, 15px);
          font-weight: 700;
          font-family: "w_Lotus", sans-serif;
          border: none;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          overflow: hidden;
        }

        .hm-btn-primary {
          background: linear-gradient(135deg, #a4874d, #c9a84c);
          color: #fff;
          flex: 1.5 1 0;
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: clamp(12px, 1.6vw, 18px);
          white-space: nowrap;
          padding: 12px 16px;
          box-shadow: 0 6px 24px rgba(164, 135, 77, 0.35);
        }

        .hm-btn-primary::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent 50%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .hm-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(164, 135, 77, 0.5);
          background: linear-gradient(135deg, #b59659, #d4b55a);
        }

        .hm-btn-primary:hover::before {
          opacity: 1;
        }

        .hm-btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(8px);
          color: #f2e9d8;
          border: 1.5px solid rgba(255, 255, 255, 0.12) !important;
          flex: 0.8 1 0;
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px 16px;
          font-size: clamp(12px, 1.6vw, 18px);
          white-space: nowrap;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .hm-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(164, 135, 77, 0.35) !important;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .hm-btn:active {
          transform: scale(0.97) !important;
        }

        /* ===== لوگو ===== */
        .hm-logo-stack {
          position: relative;
          width: clamp(400px, 32vw, 620px);
          aspect-ratio: 785 / 928;
          margin: 0 auto;
          max-height: 62vh;
          filter: drop-shadow(0 8px 40px rgba(164, 135, 77, 0.15));
        }

        .hm-logo-glow {
          position: absolute;
          top: 45%;
          left: 50%;
          width: 70%;
          height: 70%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(164, 135, 77, 0.3), transparent 65%);
          filter: blur(60px);
          z-index: 0;
          pointer-events: none;
        }

        .hm-logo-bg,
        .hm-logo-fg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          object-fit: contain;
          margin-top: -75px;
          z-index: 1;
          transition: all 0.4s ease;
        }

        .hm-logo-stack:hover .hm-logo-fg {
          filter: drop-shadow(0 0 30px rgba(201, 168, 76, 0.3));
        }

        .hm-logo-bg {
          opacity: 0.9;
        }

        .hm-logo-fg {
          z-index: 2;
          height: auto;
        }

        .hm-caption {
          position: relative;
          z-index: 1;
          color: #b8964f;
          font-size: clamp(15px, 1.8vw, 20px);
          font-weight: 700;
          line-height: 1.9;
          margin-bottom: 20px;
          margin-top: -40px;
          margin-left: 33px;
          width: 100%;
          max-width: 620px;
          text-shadow: 0 2px 16px rgba(164, 135, 77, 0.3);
          letter-spacing: 0.3px;
          transition: all 0.4s ease;
        }

        .hm-caption::after {
          content: "";
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #c9a84c, transparent);
          border-radius: 2px;
          opacity: 0.4;
          transition: all 0.4s ease;
        }

        .hm-caption:hover::after {
          width: 80px;
          opacity: 0.8;
        }

        .hm-caption:hover {
          color: #c9a84c;
        }

        /* ============================================================ */
        /* ===== ریسپانسیو (نسخه یکپارچه - بدون تکرار و تداخل) ===== */
        /* ============================================================ */

        @media (max-width: 1200px) {
          .hm-hero {
            gap: 80px;
          }
          .hm-logo-stack {
            width: clamp(320px, 28vw, 500px);
          }
          .hm-caption {
            margin-left: 0;
          }
        }

        @media (max-width: 1024px) {
          .hm-hero {
            gap: 50px;
            padding: 20px clamp(16px, 2vw, 32px);
            margin-top: -80px;
          }
          .hm-logo-stack {
            width: clamp(280px, 30vw, 400px);
          }
          .hm-illustration {
            width: clamp(160px, 18vw, 200px);
            height: clamp(220px, 25vh, 280px);
          }
          .hm-bird-art {
            width: 60px;
            height: 61px;
            left: 180px;
          }
        }

        /* ===== حالت تبلت (900px) - همون مدل موبایل (480) ولی کاستوم خودش ===== */
        @media (max-width: 900px) {
          .hm-hero {
            flex-direction: column-reverse;
            gap: 40px !important;
            padding: 10px 16px 24px;
            margin-top: 0;
          }

          .hm-logo-stack {
            width: clamp(420px, 62vw, 520px) !important;
            max-height: none;
          }

          .hm-logo-bg,
          .hm-logo-fg {
            margin-top: -20% !important;
            margin-left: -3.5% !important;
          }

          .hm-caption {
            font-size: clamp(16px, 2.6vw, 20px) !important;
            margin-top: -180px !important;
            margin-bottom: 20px !important;
            margin-left: 0;
            max-width: 94% !important;
            line-height: 1.5 !important;
          }

          .hm-caption br {
            display: block !important;
          }

          .hm-caption::after {
            left: 50%;
            transform: translateX(-50%);
            width: 250px;
            bottom: -15px;
          }

          .hm-illustration {
            width: clamp(170px, 22vw, 210px);
            height: clamp(230px, 34vh, 280px);
          }

          .hm-bird-art {
            width: clamp(48px, 5vw, 56px);
            height: clamp(48px, 5vw, 57px);
            left: clamp(90px, 11vw, 110px);
          }

          /* ----- تایمر: ۷۰٪ عرض صفحه ----- */
          .hm-countdown-wrap {
            width: 70vw !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }

          .hm-countdown-wrap .countdown-card {
            padding: 18px 14px !important;
            border-radius: 22px !important;
            max-width: 100% !important;
            width: 100% !important;
          }

          .hm-countdown-wrap .countdown-numbers {
            font-size: clamp(34px, 6.5vh, 44px) !important;
          }

          .hm-countdown-wrap .countdown-labels {
            font-size: clamp(13px, 2vh, 16px) !important;
            margin-top: 8px !important;
          }

          .hm-countdown-wrap .countdown-numbers span::after {
            display: block !important;
            right: -3px !important;
            width: 3px !important;
            height: 3px !important;
          }

          .hm-countdown-wrap .countdown-numbers span:last-child::after {
            display: none !important;
          }

          /* ----- دکمه‌ها: ردیف هم ۷۰٪ عرض صفحه، گردی گوشه هم‌اندازه تایمر ----- */
          .hm-cta-row {
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            gap: 10px !important;
            max-width: 70vw !important;
            width: 70vw !important;
          }

          .hm-btn {
            flex: none !important;
          }

          .hm-btn-primary {
            width: 65% !important;
            min-height: 48px !important;
            height: 48px !important;
            padding: 0 14px !important;
            font-size: clamp(16px, 2.4vw, 18px) !important;
            font-weight: 800 !important;
            border-radius: 22px !important;
          }

          .hm-btn-secondary {
            width: 33% !important;
            min-height: 48px !important;
            height: 48px !important;
            padding: 0 8px !important;
            font-size: clamp(14px, 2vw, 16px) !important;
            font-weight: 700 !important;
            border-radius: 22px !important;
          }
        }

        /* ===== موبایل (480px و کمتر) ===== */
        @media (max-width: 480px) {
          .hm-hero {
            padding: 1px 8px 18px !important;
            gap: 62px !important;
          }

          .hm-logo-stack {
            width: clamp(380px, 80vw, 500px) !important;
            max-height: none !important;
          }

          .hm-logo-bg,
          .hm-logo-fg {
            margin-top: -20% !important;
            margin-left: -3.5% !important;
          }

          .hm-caption {
            font-size: clamp(15px, 4vw, 18px) !important;
            margin-top: -180px !important;
            margin-bottom: 6px !important;
            margin-left: 0;
            max-width: 94% !important;
            line-height: 1.5 !important;
          }

          .hm-caption::after {
            width: 250px;
            bottom: -15px;
          }

          .hm-illustration {
            width: clamp(150px, 36vw, 190px);
            height: clamp(200px, 42vh, 250px);
          }

          .hm-bird-art {
            width: clamp(42px, 8vw, 50px);
            height: clamp(42px, 8vw, 51px);
            left: clamp(70px, 18vw, 95px);
          }

          /* ----- تایمر: ۷۰٪ عرض صفحه ----- */
          .hm-countdown-wrap {
            width: 70vw !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }

          .hm-countdown-wrap .countdown-card {
            padding: 16px 12px !important;
            border-radius: 20px !important;
            max-width: 100% !important;
            width: 100% !important;
          }

          .hm-countdown-wrap .countdown-numbers {
            font-size: clamp(28px, 7.5vh, 36px) !important;
          }

          .hm-countdown-wrap .countdown-labels {
            font-size: clamp(11px, 2.2vh, 14px) !important;
            margin-top: 6px !important;
          }

          .hm-countdown-wrap .countdown-numbers span::after {
            display: block !important;
            right: -3px !important;
            width: 3px !important;
            height: 3px !important;
          }

          .hm-countdown-wrap .countdown-numbers span:last-child::after {
            display: none !important;
          }

          /* ----- دکمه‌ها: ردیف هم ۷۰٪ عرض صفحه، گردی گوشه هم‌اندازه تایمر ----- */
          .hm-cta-row {
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            gap: 8px !important;
            max-width: 70vw !important;
            width: 70vw !important;
          }

          .hm-btn {
            flex: none !important;
          }

          .hm-btn-primary {
            width: 66% !important;
            min-height: 44px !important;
            height: 44px !important;
            padding: 0 10px !important;
            font-size: clamp(14px, 3.6vw, 16px) !important;
            font-weight: 800 !important;
            border-radius: 14px !important;
          }

          .hm-btn-secondary {
            width: 32% !important;
            min-height: 44px !important;
            height: 44px !important;
            padding: 0 6px !important;
            font-size: clamp(12px, 2.8vw, 14px) !important;
            font-weight: 700 !important;
            border-radius: 14px !important;
          }
        }

        /* ===== موبایل خیلی کوچک (420px و کمتر) - رفع عدم مرکزیت لوگو ===== */
        @media (max-width: 420px) {
          .hm-logo-stack {
            width: 85vw !important;
            margin: 0 auto !important;
          }

          .hm-logo-bg,
          .hm-logo-fg {
            margin-left: 0 !important;
            left: 46% !important;
            transform: translateX(-50%) !important;
          }

          .hm-hero {
            gap: 50px !important;
          }

          .hm-caption {
            margin-top: -150px !important;
          }
        }

        /* ============================================================ */
        /* ===== فقط دسکتاپ (۹۰۱px به بالا) - بدون دست‌زدن به کلاس‌های اصلی ===== */
        /* ============================================================ */
        /* ============================================================ */
/* ===== فقط دسکتاپ (۹۰۱px به بالا) ===== */
/* ============================================================ */
@media (min-width: 901px) {
  .hm-hero {
        max-width: 1800px !important;
        justify-content: space-around !important;
        padding: 20px clamp(38px, 7vw, 74px) !important;
        gap: clamp(60px, 8vw, 160px) !important;
        margin-top: -80px !important;
    }

  .hm-hero-left, .hm-hero-right {
        align-self: stretch !important;
    }
    .hm-hero-right {
        margin-left: 80px;
    }

  .hm-logo-stack {
    width: clamp(380px, 42vw, 780px) !important;
    max-height: 68vh !important;
    margin-bottom: 0 !important;
  }

  .hm-logo-bg,
  .hm-logo-fg {
    top: -26.7% !important;
    margin-top: 0 !important;
  }

  .hm-caption {
    margin-left: clamp(12px, 2.5vw, 36px) !important;
    margin-top: -41px !important;
    margin-bottom: 32px;
  }
}
      `}</style>
    </div>
  );
}
