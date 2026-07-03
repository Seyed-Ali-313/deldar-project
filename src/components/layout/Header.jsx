// src/components/layout/Header.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/images/logo.svg";
import navIcon from "../../assets/images/nav.png";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = false;

  const navLinks = [
    { label: "صفحه اصلی", to: "/" },
    { label: "فراخوان", to: "/announcement" },
    { label: "امتیازات و شرایط عمومی", to: "/rules" },
    { label: "ارتباط با ما", to: "/contact" },
    { label: "درباره ما", to: "/about" },
  ];

  return (
    <header className="site-header header-premium">
      <div className="header-inner">
        {/* لوگو */}
        <div className="brand">
          <Link to="/" className="brand-logo">
            <img src={logo} alt="خانه عکاسان ایران" />
          </Link>
        </div>

        <span className="header-divider" />

        {/* منو */}
        <nav className={`main-nav ${isMenuOpen ? "is-open" : ""}`}>
          <ul>
            {navLinks.map((link, i) => (
              <li key={link.to}>
                <Link to={link.to} onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </Link>
                {i < navLinks.length - 1 && <span className="divider" />}
              </li>
            ))}
          </ul>
        </nav>

        {/* دکمه ورود */}
        <button
          className="login-btn"
          onClick={() => navigate(isLoggedIn ? "/dashboard" : "/login")}
        >
          <span className="login-btn-text">
            {isLoggedIn ? "داشبورد" : "ورود / ثبت‌نام"}
          </span>
          <span className="login-btn-shine" aria-hidden="true" />
        </button>

        {/* دکمه همبرگری */}
        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="منو"
        >
          <img src={navIcon} alt="منو" className="nav_line" />
        </button>
      </div>

      {/* اوورلی برای بستن منو */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <style>{`
        /* ===== هدر حرفه‌ای ===== */
        .header-premium {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(201, 168, 76, 0.08);
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 24px rgba(0, 0, 0, 0.02);
          transition: all 0.3s ease;
        }

        .header-premium .header-inner {
          max-width: 1440px;
          margin: 0 auto;
          direction: rtl;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px clamp(20px, 3vw, 50px);
          gap: 20px;
          flex-wrap: wrap;
        }

        /* ===== لوگو ===== */
        .header-premium .brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          width: clamp(36px, 4vw, 48px);
          height: auto;
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }

        .header-premium .brand-logo:hover {
          transform: scale(1.05);
        }

        .header-premium .brand-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.04));
        }

        /* ===== خط جداکننده اصلی (طلایی) ===== */
        .header-premium .header-divider {
          width: 2px;
          height: 34px;
          background: linear-gradient(180deg, transparent, #C9A84C, #A4874D, #C9A84C, transparent);
          flex-shrink: 0;
          border-radius: 4px;
          opacity: 0.7;
          box-shadow: 0 0 12px rgba(201, 168, 76, 0.15);
        }

        /* ===== منو ===== */
        .header-premium .main-nav ul {
          display: flex;
          align-items: center;
          gap: clamp(6px, 1.2vw, 18px);
          flex-wrap: wrap;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .header-premium .main-nav li {
          display: flex;
          align-items: center;
          gap: inherit;
          position: relative;
        }

        .header-premium .main-nav a {
          font-size: clamp(14px, 1.1vw, 16px);
          font-weight: 600;
          color: #2d2d2d;
          text-decoration: none;
          padding: 6px 14px;
          border-radius: 10px;
          transition: all 0.3s ease;
          position: relative;
          letter-spacing: 0.2px;
          font-family: "w_Nian", sans-serif;
        }

        .header-premium .main-nav a::after {
          content: "";
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2.5px;
          background: linear-gradient(90deg, #A4874D, #C9A84C);
          border-radius: 3px;
          transition: width 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .header-premium .main-nav a:hover::after {
          width: 50%;
        }

        .header-premium .main-nav a:hover {
          color: #034120;
          background: rgba(3, 65, 32, 0.04);
        }

        .header-premium .main-nav a.active {
          color: #034120;
          background: rgba(3, 65, 32, 0.04);
        }

        .header-premium .main-nav a.active::after {
          width: 50%;
        }

        /* ===== خطوط جداکننده بین آیتم‌های منو (طلایی) - بدون تغییر در هاور ===== */
        .header-premium .main-nav .divider {
          width: 1.5px;
          height: 22px;
          background: linear-gradient(180deg, transparent, #C9A84C, #A4874D, #C9A84C, transparent);
          display: inline-block;
          flex-shrink: 0;
          opacity: 0.5;
          border-radius: 3px;
          box-shadow: 0 0 8px rgba(201, 168, 76, 0.08);
          transition: none;
        }

        .header-premium .main-nav li:hover .divider {
          opacity: 0.5;
          box-shadow: 0 0 8px rgba(201, 168, 76, 0.08);
        }

        /* ===== دکمه ورود ===== */
        .header-premium .login-btn {
          position: relative;
          background: linear-gradient(135deg, #034120, #0a5a2e);
          color: #ffffff;
          border: none;
          border-radius: 30px;
          padding: 10px 24px;
          min-height: 42px;
          min-width: 120px;
          font-family: "w_Nian", sans-serif;
          font-weight: 600;
          font-size: clamp(13px, 1vw, 15px);
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(3, 65, 32, 0.25);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          gap: 6px;
          letter-spacing: 0.3px;
        }

        .header-premium .login-btn .login-btn-text {
          position: relative;
          z-index: 2;
        }

        .header-premium .login-btn .login-btn-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
          transition: left 0.7s ease;
          z-index: 1;
        }

        .header-premium .login-btn:hover {
          background: linear-gradient(135deg, #0a5a2e, #034120);
          transform: translateY(-2px);
          box-shadow: 0 6px 32px rgba(3, 65, 32, 0.35);
        }

        .header-premium .login-btn:hover .login-btn-shine {
          left: 100%;
        }

        .header-premium .login-btn:active {
          transform: scale(0.97);
        }

        /* ===== دکمه همبرگری ===== */
        .header-premium .menu-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 12px;
          transition: all 0.3s ease;
          align-items: center;
          justify-content: center;
        }

        .header-premium .menu-toggle:hover {
          background: rgba(3, 65, 32, 0.06);
        }

        .header-premium .menu-toggle img {
          width: 26px;
          height: 26px;
          display: block;
          opacity: 0.5;
          transition: opacity 0.3s ease;
        }

        .header-premium .menu-toggle:hover img {
          opacity: 1;
        }

        /* ===== اوورلی منو ===== */
        .header-premium .menu-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
          z-index: 1040;
          cursor: pointer;
        }

        /* ===== موبایل ===== */
        @media (max-width: 900px) {
          .header-premium .header-inner {
            padding: 8px 14px;
            flex-wrap: nowrap;
            gap: 10px;
          }

          .header-premium .brand-logo {
            width: 32px;
          }

          .header-premium .header-divider {
            display: none;
          }

          .header-premium .login-btn {
            min-width: 80px;
            min-height: 34px;
            padding: 6px 14px;
            font-size: 11px;
            margin-left: auto;
            order: 2;
            box-shadow: 0 3px 14px rgba(3, 65, 32, 0.2);
          }

          .header-premium .menu-toggle {
            display: flex !important;
            order: 3;
            margin-right: 2px;
          }

          .header-premium .menu-toggle img {
            width: 22px;
            height: 22px;
          }

          .header-premium .brand {
            order: 1;
          }

          /* منو کشویی */
          .header-premium .main-nav {
            position: fixed;
            top: 0;
            right: -100%;
            width: 78%;
            max-width: 310px;
            height: 100vh;
            background: linear-gradient(180deg, #0a1a12, #034120);
            backdrop-filter: blur(20px);
            padding: 80px 24px 30px;
            transition: right 0.4s cubic-bezier(0.22, 1, 0.36, 1);
            z-index: 1050;
            box-shadow: -8px 0 40px rgba(0, 0, 0, 0.5);
            display: block !important;
            overflow-y: auto;
            border-left: 1px solid rgba(201, 168, 76, 0.08);
          }

          .header-premium .main-nav.is-open {
            right: 0;
          }

          .header-premium .main-nav ul {
            flex-direction: column;
            gap: 2px;
            align-items: stretch;
          }

          .header-premium .main-nav li {
            display: block;
            padding: 4px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          }

          .header-premium .main-nav a {
            font-size: 17px;
            color: rgba(255, 255, 255, 0.85);
            font-weight: 500;
            display: block;
            padding: 12px 8px;
            border-radius: 10px;
            transition: all 0.25s ease;
          }

          .header-premium .main-nav a::after {
            display: none;
          }

          .header-premium .main-nav a:hover {
            color: #C9A84C;
            background: rgba(201, 168, 76, 0.06);
            padding-right: 16px;
          }

          .header-premium .main-nav .divider {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .header-premium .login-btn {
            min-width: 60px;
            min-height: 28px;
            padding: 4px 10px;
            font-size: 9px;
            border-radius: 20px;
          }

          .header-premium .brand-logo {
            width: 26px;
          }

          .header-premium .menu-toggle img {
            width: 18px;
            height: 18px;
          }

          .header-premium .main-nav {
            max-width: 260px;
            padding: 70px 16px 20px;
          }

          .header-premium .main-nav a {
            font-size: 15px;
            padding: 10px 6px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .header-premium .main-nav a,
          .header-premium .login-btn,
          .header-premium .brand-logo,
          .header-premium .login-btn .login-btn-shine {
            transition: none !important;
          }
        }
      `}</style>
    </header>
  );
}
