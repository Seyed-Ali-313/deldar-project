import branchArt from "../assets/images/branch-art.svg";
import birdArt from "../assets/images/bird-art.svg";
import logoBg from "../assets/images/logo-bg.png";
import logoGold from "../assets/images/logo-gold.png";
import Countdown from "../components/common/Countdown";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-left">
          <div className="hero-illustration">
            <div className="branch-art">
              <img src={branchArt} alt="" />
            </div>
            <div className="bird-art">
              <img src={birdArt} alt="" />
            </div>
          </div>
          <Countdown targetDate="2026-07-08T23:59:59" />
          <div className="cta-row">
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/announcement")}
            >
              مطالعه فراخوان
            </button>
            {/* ✅ فقط این خط تغییر کرد: از /register به /rules */}
            <button
              className="btn btn-primary"
              onClick={() => navigate("/login")}
            >
              ثبت نام و ارسال عکس
            </button>
          </div>
        </div>

        <div className="hero-right">
          <div className="logo-stack">
            <img src={logoBg} alt="" className="logo-bg" />
            <img src={logoGold} alt="" className="logo-fg" />
          </div>
          <p className="hero-caption">
            دعوت به تولید و جمع‌آوری عکس مستند
            <br />
            از وداع ایران با رهبر شهید انقلاب اسلامی
          </p>
        </div>
      </section>
    </div>
  );
}
