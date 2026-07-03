// src/pages/Rules.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import emtiaz from "../assets/images/emtiaz.svg";

const RULES = [
  "استفاده از هوش مصنوعی در ویرایش عکس‌ها به دلیل خدشه وارد شدن به سندیت آثار جایز نیست. در صورت اثبات خلاف این امر، اثر از مرحله انتخاب کنار گذاشته شده و موضوع اطلاع‌رسانی عمومی خواهد شد.",
  "عکس‌های ارسالی حتماً باید حداقل شامل اطلاعات مکان و زمان باشند که همراه عکس بارگذاری می‌شود.",
  "اطلاعات فرم ثبت‌نام و عناوین آثار در تهیه مطالب انتشاراتی و نمایشگاهی مورد استفاده قرار خواهد گرفت. مسئولیت صحت اطلاعات آثار دریافتی بر عهده شرکت‌کننده می‌باشد.",
  "شرکت‌کنندگان از درج اطلاعات اضافی شامل نام، امضاء، لوگو، تاریخ، کادر رنگی و... روی فایل ارسالی خودداری نمایند، در غیر این صورت اثر در مرحله انتخاب حذف خواهد شد.",
  "ارسال اثر به منزله اعلام مالکیت آن توسط ارسال‌کننده است. عواقب قانونی، عرفی و اخلاقی آن به عهده شرکت‌کننده بوده و از این بابت مسئولیتی متوجه برگزارکننده نخواهد بود.",
  "فایل‌های آثار ارسالی پذیرفته‌نشده پس از داوری معدوم می‌گردد.",
  "برگزارکننده می‌تواند از آثار منتخب، در امور رسانه‌ای، انتشاراتی، تبلیغاتی و نمایش در داخل و خارج از کشور با ذکر نام هنرمند بهره‌مند شود.",
  "ارسال آثار به معنای پذیرش تمامی مقررات این فراخوان است و تصمیم‌گیری در مورد مسائل پیش‌بینی‌نشده بر عهده خانه عکاسان ایران است.",
  "شرکت‌کنندگان موظفند در صورت انتخاب آثار، اصل فایل را با کیفیت مناسب برای چاپ در اندازه حداقل ۳۰ در ۴۵ سانتی‌متر با کیفیت (رزولوشن) DPI ۳۰۰ برای دبیرخانه ارسال نمایند.",
];

const AMTIAZ = [
  "پرداخت ۳ میلیون تومان حق‌التالیف به هر یک از آثار منتخب",
  "انتشار آثار در کتاب عکس",
  "برگزاری نمایشگاه عکس به همراه ارائه گواهی حضور",
];

const CONDITIONS = [
  "شرکت در این پروژه ملی برای همه هنرمندان و علاقه‌مندان از سراسر ایران آزاد و رایگان است.",
  "هر عکاس می‌تواند حداکثر ۵۰ تک عکس ارائه کند.",
  "ابعاد هر فایل ارسالی حداقل ۱۰۰۰ و حداکثر ۱۵۰۰ پیکسل و در قالب فایل jpg باشد.",
  "هر عکاس می‌تواند حداکثر ۵۰ تک عکس ارائه کند و ابعاد هر فایل ارسالی حداقل ۱۰۰۰ و حداکثر ۱۵۰۰ پیکسل و در قالب فایل jpg باشد.",
  "حجم هر فایل ارسالی باید کمتر از ۵ مگابایت باشد.",
  "عکس‌ها می‌توانند با تلفن همراه گرفته شده باشند ولی باید دارای کیفیت لازم جهت داوری بوده و فایل اصلی آن برای چاپ در دسترس باشد.",
  "آثار توسط خانه عکاسان ایران انتخاب خواهند شد.",
  "عکس‌ها باید کاملاً مستند بوده و ویرایش عکس‌ها باید به‌گونه‌ای باشد که در ماهیت و واقعیت عکس‌ها تغییری ایجاد نشود.",
];

export default function Rules() {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!agreed) return;
    navigate("/register");
  };

  return (
    <div className="page">
      <div className="page-content">
        <div className="info-column">
          <div className="info-section">
            <h2>
              <img src={emtiaz} alt="" className="icon" style={{ width: 18 }} />
              امتیازات
            </h2>
            <ul>
              {AMTIAZ.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <hr className="section-divider" />

          <div className="info-section">
            <h2>شرایط عمومی فراخوان</h2>
            <ul>
              {CONDITIONS.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rules-column">
          <ul className="rules-list">
            {RULES.map((rule, i) => (
              <li key={i}>{rule}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="cta-section">
        <label className="agreement-check">
          <span
            className={`checkbox ${agreed ? "checked" : ""}`}
            onClick={() => setAgreed(!agreed)}
          />
          <span>
            قوانین و &emsp;
            <Link
              to="/announcement"
              style={{
                color: "#2563eb",
                fontWeight: "700",
                textDecoration: "none",
                fontSize: "1.1rem",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "#1d4ed8";
                e.target.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "#2563eb";
                e.target.style.textDecoration = "none";
              }}
            >
              فراخوان
            </Link>{" "}
            &emsp;را مطالعه کرده و می‌پذیرم
          </span>
        </label>
        <button
          className="btn-accept"
          onClick={handleContinue}
          disabled={!agreed}
          style={{
            opacity: agreed ? 1 : 0.5,
            cursor: agreed ? "pointer" : "not-allowed",
          }}
        >
          پذیرش و ادامه ثبت‌ نام
        </button>
      </div>

      <style>{`
        .page-content {
          max-width: 1440px;
          margin: 0 auto;
          padding: clamp(16px, 3vw, 40px) clamp(16px, 4vw, 50px);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(30px, 5vw, 80px);
          align-items: start;
          direction: rtl;
          margin-top: -18px;
        }

        /* ===== قوانین ===== */
        .rules-column {
          display: flex;
          flex-direction: column;
        }

        .rules-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          margin: 0;
          padding: 0;
        }

        .rules-list li {
          position: relative;
          padding-right: 20px;
          padding-bottom: 10px;
          font-size: clamp(12px, 1vw, 13px);
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.85);
          font-family: "w_Lotus", sans-serif;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          transition: color 0.25s ease;
          cursor: default;
        }

        .rules-list li:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .rules-list li::before {
          content: "•";
          position: absolute;
          right: 0;
          top: 1px;
          color: #C9A84C;
          font-size: 16px;
          line-height: 1.8;
          transition: none;
        }

        /* ✅ فقط تغییر رنگ متن در هاور */
        .rules-list li:hover {
          color: #C9A84C;
        }

        /* ===== اطلاعات ===== */
        .info-column {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: -11px;
        }

        .info-section h2 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: clamp(16px, 1.8vw, 20px);
          font-weight: 700;
          color: #ffffff;
          font-family: "w_Nian", sans-serif;
          margin-bottom: 12px;
          letter-spacing: 0.3px;
        }

        .info-section ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin: 0;
          padding: 0;
        }

        .info-section ul li {
          position: relative;
          padding-right: 20px;
          font-size: clamp(12px, 1vw, 13px);
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.8);
          font-family: "w_Lotus", sans-serif;
          transition: color 0.25s ease;
          cursor: default;
        }

        .info-section ul li::before {
          content: "•";
          position: absolute;
          right: 0;
          top: 1px;
          color: #C9A84C;
          font-size: 14px;
          line-height: 1.7;
          transition: none;
        }

        /* ✅ فقط تغییر رنگ متن در هاور */
        .info-section ul li:hover {
          color: #C9A84C;
        }

        .section-divider {
          border: none;
          border-top: 1px solid rgba(201, 168, 76, 0.1);
          margin: 0;
        }

        /* ===== بخش پایین ===== */
        .cta-section {
          max-width: 1440px;
          margin: 0 auto;
          padding: 10px clamp(16px, 4vw, 50px) clamp(16px, 2.5vw, 30px);
          display: flex;
          align-items: center;
          justify-content: end;
          gap: 16px;
          direction: rtl;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          flex-wrap: nowrap;
          margin-right: -88px;

        }

        /* ===== چک‌باکس ===== */
        .agreement-check {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          user-select: none;
          flex-shrink: 0;
        }

        .agreement-check .checkbox {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          border: 2px solid rgba(255, 255, 255, 0.35);
          background: transparent;
          flex-shrink: 0;
          transition: all 0.25s ease;
          cursor: pointer;
          position: relative;
        }

        .agreement-check .checkbox.checked {
          background: #C9A84C;
          border-color: #C9A84C;
          box-shadow: 0 0 20px rgba(201, 168, 76, 0.15);
        }

        .agreement-check .checkbox.checked::after {
          content: "✓";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #1a1a1a;
          font-size: 14px;
          font-weight: 700;
        }

        .agreement-check span:last-child {
          font-size: clamp(12px, 1vw, 14px);
          font-weight: 400;
          color: rgba(255, 255, 255, 0.85);
          font-family: "w_Lotus", sans-serif;
          white-space: nowrap;
        }

        /* ===== دکمه طلایی ===== */
        .btn-accept {
          background: linear-gradient(135deg, #A4874D, #C9A84C);
          color: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 180px;
          min-height: 44px;
          padding: 8px 24px;
          border-radius: 24px;
          border: none;
          font-size: clamp(13px, 1vw, 15px);
          font-weight: 700;
          font-family: "w_Lotus", sans-serif;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          box-shadow: 0 4px 20px rgba(164, 135, 77, 0.3);
          letter-spacing: 0.3px;
          flex-shrink: 0;
          white-space: nowrap;
        }

        .btn-accept:hover:not(:disabled) {
          background: linear-gradient(135deg, #b59659, #d4b55a);
          transform: translateY(-2px);
          box-shadow: 0 6px 28px rgba(164, 135, 77, 0.45);
        }

        .btn-accept:active:not(:disabled) {
          transform: scale(0.97);
        }

        .btn-accept:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* ===== ریسپانسیو ===== */
        @media (max-width: 900px) {
          .page-content {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 16px 16px;
          }

          .cta-section {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
            padding: 10px 16px 16px;
            flex-wrap: wrap;
          }

          .agreement-check {
            justify-content: center;
          }

          .agreement-check span:last-child {
            white-space: normal;
            text-align: center;
          }

          .btn-accept {
            width: 100%;
            min-width: unset;
            min-height: 42px;
          }
        }

        @media (max-width: 480px) {
          .rules-list li {
            font-size: 11px;
            padding-bottom: 8px;
            padding-right: 16px;
          }

          .rules-list li::before {
            font-size: 13px;
          }

          .info-section ul li {
            font-size: 11px;
            padding-right: 16px;
          }

          .info-section ul li::before {
            font-size: 13px;
          }

          .info-section h2 {
            font-size: 14px;
          }

          .agreement-check span:last-child {
            font-size: 11px;
          }

          .btn-accept {
            font-size: 12px;
            min-height: 38px;
            padding: 6px 14px;
          }

          .cta-section {
            padding: 8px 12px 14px;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}
