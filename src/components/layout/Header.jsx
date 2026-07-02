import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    <header className="site-header">
      <div className="header-inner">
        <div className="brand">
          <Link to="/" className="brand-logo">
            <img src={logo} alt="خانه عکاسان ایران" />
          </Link>
        </div>

        <span className="header-divider" />

        <nav className={`main-nav ${isMenuOpen ? "is-open" : ""}`}>
          <ul>
            {navLinks.map((link, i) => (
              <li
                key={link.to}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "inherit",
                }}
              >
                <Link to={link.to} onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </Link>
                {i < navLinks.length - 1 && <span className="divider" />}
              </li>
            ))}
          </ul>
        </nav>
        <button
          className="login-btn"
          onClick={() => navigate(isLoggedIn ? "/dashboard" : "/register")}
        >
          {isLoggedIn ? "" : "ورود / ثبت‌نام"}
        </button>
        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <img src={navIcon} alt="منو" className="nav_line" />
        </button>
      </div>

      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 1040,
          }}
        />
      )}
    </header>
  );
}
