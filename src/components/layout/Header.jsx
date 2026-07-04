// src/components/layout/Header.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../assets/images/logo.svg";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    navigate("/");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  };

  const getDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user?.first_name) return user.first_name;
    if (user?.mobile) return user.mobile;
    return "کاربر";
  };

  const navLinks = [
    { label: "صفحه اصلی", to: "/" },
    { label: "فراخوان", to: "/announcement" },
    { label: "قوانین", to: "/rules" },
    { label: "تماس با ما", to: "/contact" },
    { label: "درباره ما", to: "/about" },
  ];

  const UserIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" fill="currentColor" />
      <path
        d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );

  return (
    <header className="header-premium">
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
          <button
            className="mobile-close-btn"
            onClick={() => setIsMenuOpen(false)}
            aria-label="بستن منو"
          >
            ✕
          </button>

          {isLoggedIn && (
            <div className="mobile-user-info">
              <div className="mobile-avatar">
                <UserIcon size={26} />
              </div>
              <div className="mobile-user-name">{getDisplayName()}</div>
              <button
                className="mobile-dashboard-btn"
                onClick={handleDashboard}
              >
                📊 داشبورد
              </button>
            </div>
          )}

          <ul>
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </Link>
                <span className="divider" />
              </li>
            ))}
          </ul>

          <div className="mobile-footer">
            {isLoggedIn ? (
              <button className="mobile-logout-btn" onClick={handleLogout}>
                🚪 خروج از حساب
              </button>
            ) : (
              <Link
                to="/login"
                className="mobile-login-link"
                onClick={() => setIsMenuOpen(false)}
              >
                ورود / ثبت‌نام
              </Link>
            )}
          </div>
        </nav>

        <div className="header-spacer" />

        {/* دکمه ورود / پروفایل (دسکتاپ) */}
        <div className="auth-section">
          {isLoggedIn ? (
            <div className="profile-wrapper" ref={dropdownRef}>
              <motion.button
                className="profile-btn"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.2 }}
              >
                <span className="profile-name">{getDisplayName()}</span>

                <span className="profile-icon-badge">
                  <UserIcon size={17} />
                </span>

                <motion.svg
                  className="profile-arrow"
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  animate={{ rotate: isProfileOpen ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    className="profile-dropdown"
                    initial={{ opacity: 0, y: -8, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.94 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="dropdown-header">
                      <div className="dropdown-info">
                        <div className="dropdown-name">{getDisplayName()}</div>
                        {user?.mobile && (
                          <div className="dropdown-mobile">{user.mobile}</div>
                        )}
                      </div>
                      <span className="dropdown-icon-badge">
                        <UserIcon size={22} />
                      </span>
                    </div>

                    <motion.button
                      className="dropdown-item"
                      onClick={handleDashboard}
                      whileHover={{ x: -3 }}
                      transition={{ duration: 0.15 }}
                    >
                      <span className="dropdown-item-icon">
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"
                            stroke="#034120"
                            strokeWidth="1.9"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span>داشبورد</span>
                    </motion.button>

                    <motion.button
                      className="dropdown-item logout"
                      onClick={handleLogout}
                      whileHover={{ x: -3 }}
                      transition={{ duration: 0.15 }}
                    >
                      <span className="dropdown-item-icon logout">
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m7 14l5-5-5-5m5 5H9"
                            stroke="#c0392b"
                            strokeWidth="1.9"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span>خروج از حساب</span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button className="login-btn" onClick={() => navigate("/login")}>
              <span className="login-btn-icon">
                <UserIcon size={15} />
              </span>
              <span className="login-btn-text">ورود / ثبت‌نام</span>
              <span className="login-btn-shine" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* دکمه همبرگر */}
        <button
          className={`menu-toggle ${isMenuOpen ? "active" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="منو"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </div>

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
        /* فونت سایت برای همه چیز داخل هدر، بدون استثنا */
        .header-premium,
        .header-premium * {
          font-family: "w_Nian", "w_Lotus", sans-serif;
        }

        .header-premium {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(201, 168, 76, 0.08);
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 24px rgba(0, 0, 0, 0.03);
        }

        .header-premium .header-inner {
          max-width: 1440px;
          margin: 0 auto;
          direction: rtl;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 10px clamp(20px, 3vw, 50px);
          gap: 18px;
        }

        .header-premium .brand {
          margin: 0;
          flex-shrink: 0;
        }

        .header-premium .brand-logo {
          display: flex;
          align-items: center;
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
          height: auto;
          object-fit: contain;
        }

        .header-premium .header-divider {
          width: 2px;
          height: 34px;
          margin: 0;
          background: linear-gradient(180deg, transparent, #C9A84C, #A4874D, #C9A84C, transparent);
          flex-shrink: 0;
          border-radius: 4px;
          opacity: 0.6;
        }

        .header-premium .main-nav {
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-shrink: 0;    margin-right: -11px;
        }

        .header-premium .main-nav ul {
          display: flex;
          align-items: center;
          gap: clamp(4px, 1vw, 16px);
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .header-premium .main-nav li {
          display: flex;
          align-items: center;
          gap: inherit;
        }

        /* ✅ حذف خط عمودی بعد از آخرین آیتم منو */
        .header-premium .main-nav li:last-child .divider {
          display: none;
        }

        .header-premium .main-nav a {
          font-size: clamp(13px, 1vw, 15px);
          font-weight: 600;
          color: #2d2d2d;
          text-decoration: none;
          padding: 6px 14px;
          border-radius: 10px;
          transition: all 0.3s ease;
          position: relative;
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

        .header-premium .main-nav .divider {
          width: 1.5px;
          height: 20px;
          background: linear-gradient(180deg, transparent, #C9A84C, #A4874D, #C9A84C, transparent);
          display: inline-block;
          flex-shrink: 0;
          opacity: 0.4;
          border-radius: 3px;
        }

        .header-premium .header-spacer {
          flex: 1 1 auto;
          min-width: 8px;
        }

        .header-premium .auth-section {
          flex-shrink: 0;
        }

        /* ===== دکمه ورود — سبز و طلایی سایت ===== */
        .header-premium .login-btn {
          position: relative;
          background: linear-gradient(135deg, #034120, #0a5a2e);
          color: #ffffff;
          border: 1.5px solid rgba(201, 168, 76, 0.35);
          border-radius: 30px;
          padding: 7px 3px 8px 8px;
          min-height: 44px;
          min-width: 130px;
          font-weight: 700;
          font-size: clamp(15px, 1vw, 15px);
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(3, 65, 32, 0.25);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          white-space: nowrap;
        }

        .header-premium .login-btn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: linear-gradient(135deg, #C9A84C, #8E703A);
          color: #ffffff;
          flex-shrink: 0;
          position: relative;
          z-index: 2;
          transition: transform 0.3s ease;
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
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transition: left 0.7s ease;
          z-index: 1;
        }

        .header-premium .login-btn:hover {
          background: linear-gradient(135deg, #0a5a2e, #034120);
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(3, 65, 32, 0.35);
          border-color: rgba(201, 168, 76, 0.6);
        }

        .header-premium .login-btn:hover .login-btn-icon {
          transform: scale(1.1) rotate(-6deg);
        }

        .header-premium .login-btn:hover .login-btn-shine {
          left: 100%;
        }

        /* ===================================================== */
        /* ===== دکمه پروفایل — سبز و طلایی سایت، حتی بک‌گراند ===== */
        /* ===================================================== */
        .header-premium .profile-wrapper {
          position: relative;
        }

        .header-premium .profile-btn {
          display: flex;
          align-items: center;
          gap: 11px;
          background: linear-gradient(135deg, #034120, #0a5a2e);
          border: 1.5px solid rgba(201, 168, 76, 0.4);
          border-radius: 30px;
          padding: 6px 8px 6px 20px;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(3, 65, 32, 0.2);
        }

        .header-premium .profile-btn:hover {
          border-color: rgba(201, 168, 76, 0.65);
          box-shadow: 0 8px 26px rgba(3, 65, 32, 0.32);
        }

        .header-premium .profile-name {
          font-size: 13.5px;
          font-weight: 700;
          color: #ffffff;
          max-width: 110px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* آیکون بزرگ‌تر و خوش‌تر با گرادیان طلایی */
        .header-premium .profile-icon-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          flex-shrink: 0;
          background: linear-gradient(135deg, #E0BE6B, #C9A84C 45%, #8E703A);
          color: #ffffff;
          box-shadow:
            0 0 0 2px rgba(255, 255, 255, 0.9),
            0 4px 12px rgba(164, 135, 77, 0.5);
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease;
        }

        .header-premium .profile-btn:hover .profile-icon-badge {
          transform: scale(1.1) rotate(-6deg);
          box-shadow:
            0 0 0 2.5px rgba(255, 255, 255, 0.95),
            0 6px 20px rgba(164, 135, 77, 0.7);
        }

        .header-premium .profile-arrow {
          color: #E0BE6B;
          flex-shrink: 0;
        }

        /* ===== Dropdown ===== */
        .header-premium .profile-dropdown {
          position: absolute;
          top: calc(100% + 14px);
          left: 0;
          min-width: 264px;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 28px 70px rgba(2, 33, 16, 0.22);
          border: 1px solid rgba(164, 135, 77, 0.18);
          overflow: hidden;
          padding: 12px;
        }

        .header-premium .dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 8px 16px;
          margin-bottom: 8px;
          border-bottom: 1.5px solid rgba(164, 135, 77, 0.14);
        }

        .header-premium .dropdown-icon-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          flex-shrink: 0;
          background: linear-gradient(135deg, #034120, #0a5a2e);
          color: #E0BE6B;
          box-shadow: 0 6px 18px rgba(3, 65, 32, 0.28);
          border: 2px solid rgba(201, 168, 76, 0.35);
        }

        .header-premium .dropdown-info {
          text-align: right;
        }

        .header-premium .dropdown-name {
          font-size: 15.5px;
          font-weight: 800;
          color: #1a1a1a;
        }

        .header-premium .dropdown-mobile {
          font-size: 12.5px;
          color: #888;
          margin-top: 3px;
          direction: ltr;
          text-align: right;
        }

        .header-premium .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 12px;
          background: rgba(3, 65, 32, 0.035);
          border: 1.5px solid transparent;
          border-radius: 14px;
          color: #1a1a1a;
          font-size: 14.5px;
          font-weight: 700;
          cursor: pointer;
          margin-bottom: 6px;
          text-align: right;
        }

        .header-premium .dropdown-item:last-child {
          margin-bottom: 0;
        }

        .header-premium .dropdown-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 11px;
          background: rgba(3, 65, 32, 0.1);
          flex-shrink: 0;
        }

        .header-premium .dropdown-item-icon.logout {
          background: rgba(192, 57, 43, 0.1);
        }

        .header-premium .dropdown-item:hover {
          background: rgba(164, 135, 77, 0.12);
          border-color: rgba(164, 135, 77, 0.3);
        }

        .header-premium .dropdown-item.logout {
          color: #c0392b;
          background: rgba(192, 57, 43, 0.05);
        }

        .header-premium .dropdown-item.logout:hover {
          background: rgba(192, 57, 43, 0.12);
          border-color: rgba(192, 57, 43, 0.3);
        }

        /* ===== همبرگر ===== */
        .header-premium .menu-toggle {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .header-premium .menu-toggle:hover {
          background: rgba(164, 135, 77, 0.1);
        }

        .header-premium .hamburger-line {
          width: 24px;
          height: 2.5px;
          background: #2d2d2d;
          border-radius: 3px;
          transition: all 0.3s ease;
          display: block;
        }

        .header-premium .menu-toggle.active .hamburger-line:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .header-premium .menu-toggle.active .hamburger-line:nth-child(2) {
          opacity: 0;
        }

        .header-premium .menu-toggle.active .hamburger-line:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        /* ===== منوی موبایل ===== */
        .header-premium .mobile-close-btn {
          display: none;
          position: absolute;
          top: 16px;
          left: 16px;
          background: rgba(255,255,255,0.06);
          border: none;
          color: #fff;
          font-size: 20px;
          cursor: pointer;
          padding: 6px 10px;
          border-radius: 8px;
        }

        .header-premium .mobile-user-info {
          display: none;
          text-align: center;
          padding: 20px 0 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 12px;
        }

        .header-premium .mobile-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #E0BE6B, #A4874D);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          margin: 0 auto 8px;
        }

        .header-premium .mobile-user-name {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
        }

        .header-premium .mobile-dashboard-btn {
          background: rgba(201, 168, 76, 0.15);
          color: #C9A84C;
          border: 1px solid rgba(201, 168, 76, 0.2);
          border-radius: 10px;
          padding: 8px 20px;
          margin-top: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .header-premium .mobile-dashboard-btn:hover {
          background: rgba(201, 168, 76, 0.25);
        }

        .header-premium .mobile-footer {
          display: none;
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .header-premium .mobile-logout-btn {
          width: 100%;
          padding: 12px;
          background: rgba(255, 0, 0, 0.08);
          color: #ff6b6b;
          border: 1px solid rgba(255, 0, 0, 0.1);
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .header-premium .mobile-logout-btn:hover {
          background: rgba(255, 0, 0, 0.14);
        }

        .header-premium .mobile-login-link {
          display: block;
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #C9A84C, #A4874D);
          color: #fff;
          text-align: center;
          border-radius: 10px;
          text-decoration: none;
          font-size: 15px;
          font-weight: 600;
        }

        /* ===== اوورلی ===== */
        .header-premium .menu-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(4px);
          z-index: 90;
          cursor: pointer;
        }

        /* ================================================================ */
        /* ===== ریسپانسیو — سه آیکون با چیدمان گرید و فاصله متقارن ===== */
        /* ================================================================ */
        @media (max-width: 900px) {
          .header-premium .header-inner {
            display: grid;
            grid-template-columns: 1fr 11fr;
            align-items: center;
            padding: 10px 16px;
            gap: 0;
          }

          .header-premium .header-divider,
          .header-premium .header-spacer {
            display: none;
          }

          /* همبرگر: راست */
          .header-premium .menu-toggle {
            display: flex !important;
            grid-column: 1;
            grid-row: 1;
            justify-self: center;
          }

          /* لوگوی برنامه: وسط */
          .header-premium .brand {
            grid-column: 2;
            grid-row: 1;
            justify-self: center;
          }

          /* آیکون کاربر / ورود: چپ */
          .header-premium .auth-section {
            grid-column: 3;
            grid-row: 1;
            justify-self: center;
          }

          .header-premium .main-nav {
            position: fixed;
            top: 0;
            right: -100%;
            width: 75%;
            max-width: 320px;
            height: 100vh;
            background: linear-gradient(180deg, #0a1a12, #034120);
            padding: 60px 20px 24px;
            transition: right 0.35s cubic-bezier(0.22, 1, 0.36, 1);
            z-index: 100;
            display: flex !important;
            flex-direction: column;
            justify-content: flex-start;
            overflow-y: auto;
            box-shadow: -8px 0 40px rgba(0, 0, 0, 0.4);
          }

          .header-premium .main-nav.is-open {
            right: 0;
          }

          .header-premium .mobile-close-btn {
            display: block !important;
          }

          .header-premium .mobile-user-info {
            display: block !important;
          }

          .header-premium .mobile-footer {
            display: block !important;
          }

          .header-premium .main-nav ul {
            flex-direction: column;
            gap: 2px;
            width: 100%;
          }

          .header-premium .main-nav li {
            display: block;
            border-bottom: 1px solid rgba(255,255,255,0.04);
          }

          .header-premium .main-nav a {
            font-size: 16px;
            color: rgba(255,255,255,0.85);
            display: block;
            padding: 12px 8px;
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

          .header-premium .profile-btn .profile-name {
            display: none;
          }

          .header-premium .profile-btn {
            padding: 5px 5px 5px 5px;
          }

          .header-premium .profile-icon-badge {
            width: 34px;
            height: 34px;
          }

          .header-premium .login-btn {
            min-width: 0;
            min-height: 38px;
            padding: 6px 14px 6px 6px;
            font-size: 11px;
          }

          .header-premium .login-btn-icon {
            width: 22px;
            height: 22px;
          }
        }

        @media (max-width: 480px) {
          .header-premium .brand-logo {
            width: 28px;
          }

          .header-premium .login-btn .login-btn-text {
            display: none;
          }

          .header-premium .login-btn {
            min-width: 38px;
            min-height: 38px;
            width: 38px;
            height: 38px;
            padding: 0;
            border-radius: 50%;
          }

          .header-premium .login-btn-icon {
            width: 100%;
            height: 100%;
          }

          .header-premium .profile-icon-badge {
            width: 32px;
            height: 32px;
          }

          .header-premium .main-nav {
            max-width: 280px;
            padding: 50px 14px 20px;
          }

          .header-premium .main-nav a {
            font-size: 14px;
            padding: 10px 6px;
          }
        }
      `}</style>
    </header>
  );
}
