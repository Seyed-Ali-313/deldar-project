// src/pages/About.jsx
export default function About() {
  return (
    <div
      className="page about-page"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "clamp(20px, 3vh, 40px) clamp(16px, 5vw, 40px)",
        direction: "rtl",
        boxSizing: "border-box",
        minHeight: "100vh",
        height: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "720px",
          width: "100%",
          marginTop: "-2vh",
        }}
      >
        <h1
          style={{
            fontFamily: "w_Nian",
            fontSize: "clamp(16px, 3.5vw, 24px)",
            fontWeight: "bold",
            color: "#ffffff",
            textAlign: "right",
            maxWidth: "700px",
            margin: "0 auto clamp(20px, 3vh, 32px)",
            lineHeight: 1.5,
          }}
        >
          خانه عکاسان ایران؛ پیشگام عکاسی متعهد و حرفه‌ای
        </h1>

        <div
          className="about-text"
          style={{
            maxWidth: "700px",
            width: "100%",
            margin: "0 auto",
            fontFamily: "w_Lotus",
            fontSize: "clamp(12px, 2.4vw, 14px)",
            lineHeight: "clamp(2, 2.2, 2.4)",
            color: "rgba(255, 255, 255, 0.8)",
            textAlign: "justify",
            direction: "rtl",
          }}
        >
          <p style={{ marginBottom: "clamp(12px, 2vh, 16px)" }}>
            خانه عکاسان ایران، به عنوان یکی از مراکز تخصصی وابسته به حوزه هنری
            انقلاب اسلامی، فعالیت رسمی خود را از ۲۳ شهریور ۱۳۷۳ آغاز کرد. این
            مرکز با هدف تحکیم بنیان‌های فرهنگی، ارتقای کیفی هنر عکاسی و سواد
            بصری و فراهم‌آوردن بستری پویا برای رشد هنرمندان، پا به عرصه وجود
            نهاد. از همان ابتدا، این مجموعه کوشیده تا ضمن کشف و معرفی استعدادهای
            نوپدید، به بزرگداشت مفاخر و پیشکسوتان این عرصه نیز بپردازد.
          </p>
          <p style={{ marginBottom: "clamp(10px, 1.5vh, 14px)" }}>
            خانه عکاسان ایران با برگزاری نمایشگاه‌های متعدد داخلی و بین‌المللی،
            نشست‌های تخصصی و کارگاه‌های آموزشی هدفمند، به یکی از ارکان اصلی حیات
            هنر عکاسی در کشور بدل شده است. رویکرد حرفه‌ای این مرکز، توأم با
            پایبندی به ارزش‌های فرهنگی و انقلابی، چشم‌اندازی نو به سوی ثبت و
            روایت مستند از جامعه و هویت ایرانی گشوده است. تمرکز ویژه این مجموعه
            بر حوزه عکاسی مستند، موجب تولید و گردآوری آثاری ارزشمند و ماندگار در
            این حوزه شده است.
          </p>
          <p style={{ marginBottom: 0 }}>
            هرچند که حضور دیجیتال و فضای مجازی این مرکز به اندازه فعالیت‌های
            عینی و میدانی آن پررنگ و شناخته‌شده نیست، اما خانه عکاسان ایران در
            میان جامعه هنری و اهالی عکاسی، جایگاهی مرجع و تأثیرگذار دارد. این
            نهاد همواره به عنوان یک پایگاه معتبر و پویا در مسیر اعتلای هنر عکاسی
            و تربیت نسل‌های آینده این عرصه، گام‌های استوار و مؤثری برداشته است.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-page {
            height: auto !important;
            min-height: 100vh !important;
            padding: 40px 16px !important;
            justify-content: flex-start !important;
            padding-top: 60px !important;
          }
          .about-page h1 {
            font-size: 17px !important;
            margin-bottom: 20px !important;
          }
          .about-page .about-text {
            font-size: 12px !important;
            line-height: 2 !important;
          }
          .about-page .about-text p {
            margin-bottom: 12px !important;
          }
        }
        @media (max-width: 480px) {
          .about-page {
            padding: 40px 12px !important;
            padding-top: 50px !important;
          }
          .about-page h1 {
            font-size: 15px !important;
            margin-bottom: 16px !important;
          }
          .about-page .about-text {
            font-size: 11px !important;
            line-height: 1.9 !important;
          }
          .about-page .about-text p {
            margin-bottom: 10px !important;
          }
        }
      `}</style>
    </div>
  );
}
