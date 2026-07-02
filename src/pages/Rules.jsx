import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import emtiaz from "../assets/images/emtiaz.svg";

const RULES = [
  "شرکت در این پروژه ملی برای همه هنرمندان و علاقه‌مندان از سراسر ایران آزاد و رایگان است.",
  "هر عکاس می‌تواند حداکثر ۵۰ تک عکس ارائه کند و ابعاد هر فایل ارسالی حداقل ۱۰۰۰ و حداکثر ۱۵۰۰ پیکسل و در قالب فایل jpg باشد.",
  "حجم هر فایل ارسالی باید کمتر از ۵ مگابایت باشد.",
  "عکس‌ها می‌توانند با تلفن همراه گرفته شده باشند ولی باید دارای کیفیت لازم جهت داوری بوده و فایل اصلی آن برای چاپ در دسترس باشد.",
  "آثار توسط خانه عکاسان ایران انتخاب خواهند شد.",
  "شرکت‌کنندگان موظفند در صورت انتخاب آثار، اصل فایل را با کیفیت مناسب برای چاپ در اندازه حداقل ۳۰ در ۴۵ سانتی‌متر با کیفیت (رزولوشن) DPI ۳۰۰ برای دبیرخانه ارسال نمایند.",
  "عکس‌ها باید کاملاً مستند بوده و ویرایش عکس‌ها باید به‌گونه‌ای باشد که در ماهیت و واقعیت عکس‌ها تغییری ایجاد نشود.",
  "استفاده از هوش مصنوعی در ویرایش عکس‌ها به دلیل خدشه وارد شدن به سندیت آثار جایز نیست. در صورت اثبات خلاف این امر، اثر از مرحله انتخاب کنار گذاشته شده و موضوع اطلاع‌رسانی عمومی خواهد شد.",
  "عکس‌های ارسالی حتماً باید حداقل شامل اطلاعات مکان و زمان باشند که همراه عکس بارگذاری می‌شود.",
  "اطلاعات فرم ثبت‌نام و عناوین آثار در تهیه مطالب انتشاراتی و نمایشگاهی مورد استفاده قرار خواهد گرفت. مسئولیت صحت اطلاعات آثار دریافتی بر عهده شرکت‌کننده می‌باشد.",
  "شرکت‌کنندگان از درج اطلاعات اضافی شامل نام، امضاء، لوگو، تاریخ، کادر رنگی و... روی فایل ارسالی خودداری نمایند، در غیر این صورت اثر در مرحله انتخاب حذف خواهد شد.",
  "ارسال اثر به منزله اعلام مالکیت آن توسط ارسال‌کننده است. عواقب قانونی، عرفی و اخلاقی آن به عهده شرکت‌کننده بوده و از این بابت مسئولیتی متوجه برگزارکننده نخواهد بود.",
  "فایل‌های آثار ارسالی پذیرفته‌نشده پس از داوری معدوم می‌گردد.",
  "برگزارکننده می‌تواند از آثار منتخب، در امور رسانه‌ای، انتشاراتی، تبلیغاتی و نمایش در داخل و خارج از کشور با ذکر نام هنرمند بهره‌مند شود.",
  "ارسال آثار به معنای پذیرش تمامی مقررات این فراخوان است و تصمیم‌گیری در مورد مسائل پیش‌بینی‌نشده بر عهده خانه عکاسان ایران است.",
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

          <div className="cta-section">
            <label className="agreement-check">
              <span
                className={`checkbox ${agreed ? "checked" : ""}`}
                onClick={() => setAgreed(!agreed)}
              />
              <span>
                قوانین و&emsp;
                <Link
                  to="/announcement"
                  style={{
                    color: "#2563eb",
                    fontSize: "1.125rem",
                    fontWeight: "500",
                    textDecoration: "none",
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
                </Link>
                &emsp;را مطالعه کرده و می‌پذیرم
              </span>
            </label>
            <button
              className="btn-secondary-second"
              onClick={handleContinue}
              disabled={!agreed}
              style={{
                opacity: agreed ? 1 : 0.5,
                cursor: agreed ? "pointer" : "not-allowed",
              }}
            >
              پذیرش و ادامه ثبت‌نام
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
