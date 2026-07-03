// src/pages/Home.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import branchArt from "../assets/images/branch-art.svg";
import birdArt from "../assets/images/bird-art.svg";
import logoBg from "../assets/images/logo-bg.png";
import logoGold from "../assets/images/logo-gold.png";
import Countdown from "../components/common/Countdown";

export default function Home() {
  const navigate = useNavigate();

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
            <Countdown targetDate="2026-07-08T23:59:59" />
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
              onClick={() => navigate("/announcement")}
            >
              مطالعه فراخوان
            </button>
            <button
              className="hm-btn hm-btn-primary"
              onClick={() => navigate("/login")}
            >
              ثبت نام و ارسال عکس
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
        .hm-page {
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
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

        .hm-hero {
          position: relative;
          z-index: 1;
          max-width: 1400px;
          width: 100%;
          display: flex;
          align-items: center;
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
          height: 100%;
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

        /* ===== Countdown ===== */
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
          box-shadow: 
            0 16px 50px rgba(2, 20, 10, 0.6),
            0 0 0 1px rgba(164, 135, 77, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
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

        .hm-countdown-wrap:hover .countdown-numbers span {
          color: #ffffff;
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

        .hm-countdown-wrap:hover .countdown-numbers span::after {
          background: rgba(201, 168, 76, 0.8);
          box-shadow: 0 0 14px rgba(201, 168, 76, 0.4);
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

        /* ===== Buttons ===== */
        .hm-cta-row {
          display: flex;
          align-items: center;
          gap: 22px;
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

        /* ✅ دکمه طلایی - بزرگ‌تر */
        .hm-btn-primary {
          background: linear-gradient(135deg, #a4874d, #c9a84c);
          color: #fff;
          flex: 1.5 1 0; /* ← بزرگ‌تر از دکمه دیگر */
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: clamp(12px, 1.6vw, 18px);
          white-space: nowrap;
          padding: 12px 16px;
          box-shadow: 
            0 6px 24px rgba(164, 135, 77, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          position: relative;
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
          box-shadow: 
            0 8px 32px rgba(164, 135, 77, 0.5),
            0 0 0 1px rgba(201, 168, 76, 0.25);
          background: linear-gradient(135deg, #b59659, #d4b55a);
        }

        .hm-btn-primary:hover::before {
          opacity: 1;
        }

        /* ✅ دکمه خاکستری - کوچک‌تر */
        .hm-btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(8px);
          color: #f2e9d8;
          border: 1.5px solid rgba(255, 255, 255, 0.12) !important;
          flex: 0.8 1 0; /* ← کوچک‌تر از دکمه طلایی */
          min-width: 0;
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px 16px;
          font-size: clamp(12px, 1.6vw, 18px);
          letter-spacing: -0.02em;
          white-space: nowrap;
          box-shadow: 
            0 4px 16px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }

        .hm-btn-secondary::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(164, 135, 77, 0.15), transparent 50%);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: -1;
        }

        .hm-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(164, 135, 77, 0.35) !important;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 
            0 8px 24px rgba(0, 0, 0, 0.2),
            0 0 0 1px rgba(164, 135, 77, 0.15);
        }

        .hm-btn-secondary:hover::before {
          opacity: 1;
        }

        .hm-btn:active {
          transform: scale(0.97) !important;
        }

        /* ===== Logo Stack ===== */
        .hm-hero-right {
          text-align: center;
        }

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
          text-shadow: 
            0 2px 16px rgba(164, 135, 77, 0.3),
            0 0 40px rgba(164, 135, 77, 0.1);
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
          text-shadow: 
            0 2px 20px rgba(201, 168, 76, 0.4),
            0 0 50px rgba(201, 168, 76, 0.2);
        }

        /* ===== Responsive ===== */
        @media (max-width: 900px) {
          .hm-hero {
            flex-direction: column;
            gap: 40px;
            padding: 30px 16px;
          }
          .hm-hero-right {
            order: -1;
          }
          .hm-logo-stack {
            width: min(85vw, 420px);
            max-height: none;
          }
          .hm-caption {
            margin-left: 0;
          }
          .hm-caption::after {
            left: 50%;
            transform: translateX(-50%);
          }
        }

        @media (max-width: 640px) {
          .hm-hero {
            padding: 20px 16px;
            gap: 24px;
          }
          .hm-illustration {
            width: 160px;
            height: 220px;
          }
          .hm-bird-art {
            top: -14px;
            left: 130px;
            width: 50px;
            height: 51px;
          }
          .hm-countdown-wrap .countdown-card {
            max-width: 100%;
            padding: 18px 14px;
          }
          .hm-countdown-wrap .countdown-numbers {
            font-size: 28px;
          }
          .hm-cta-row {
            max-width: 100%;
            flex-wrap: wrap;
          }
          .hm-cta-row .hm-btn {
            flex: 1 1 120px !important;
            min-width: 100px;
          }
          .hm-logo-stack {
            width: min(85vw, 320px);
          }
          .hm-caption {
            font-size: 14px;
            margin-left: 0;
          }
          .hm-countdown-wrap .countdown-numbers span::after {
            right: -3px;
            width: 3px;
            height: 3px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hm-btn,
          .hm-btn-primary::before,
          .hm-logo-stack,
          .hm-caption {
            transition: none !important;
          }
          .hm-btn:hover {
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
