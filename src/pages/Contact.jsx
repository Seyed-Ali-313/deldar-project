// src/pages/Contact.jsx
export default function Contact() {
  return (
    <div
      className="page contact-page"
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
          maxWidth: "520px",
          width: "100%",
          marginTop: "-13vh",
        }}
      >
        <h1
          style={{
            fontFamily: "w_Nian",
            fontSize: "clamp(16px, 3.5vw, 22px)",
            fontWeight: "bold",
            color: "#ffffff",
            textAlign: "center",
            marginBottom: "clamp(24px, 3.5vh, 36px)",
            lineHeight: 1.5,
          }}
        >
          ارتباط با ما
        </h1>

        <div
          className="contact-content"
          style={{
            maxWidth: "520px",
            width: "100%",
            margin: "0 auto",
            fontFamily: "w_Lotus",
            fontSize: "clamp(11px, 2.4vw, 13.5px)",
            lineHeight: 2,
            color: "rgba(255, 255, 255, 0.85)",
            textAlign: "center",
            direction: "rtl",
          }}
        >
          <div
            style={{
              paddingBottom: "clamp(12px, 2vh, 16px)",
              marginBottom: "clamp(12px, 2vh, 16px)",
              borderBottom: "1px solid rgba(164, 135, 77, 0.12)",
            }}
          >
            <div>
              تهران، خیابان سمیه، نرسیده به خیابان حافظ، حوزه هنری انقلاب
              اسلامی، خانه عکاسان ایران
            </div>
            <div style={{ marginTop: "6px" }}>تلفن: ۰۲۱۹۱۰۸۸۵۲۳</div>
          </div>

          <div
            style={{
              paddingBottom: "clamp(10px, 1.5vh, 14px)",
              marginBottom: "clamp(10px, 1.5vh, 14px)",
              borderBottom: "1px solid rgba(164, 135, 77, 0.12)",
            }}
          >
            <div>
              دبیرخانه: تهران، خیابان سمیه، نرسیده به خیابان استاد نجات‌اللهی،
              شماره ۲۴۱، طبقه ۴، واحد ۹
            </div>
            <div style={{ marginTop: "6px" }}>تلفن: ۰۲۱۹۱۰۸۸۵۷۸</div>
          </div>

          <div>
            <div>اینستاگرام: iran_ipc@</div>
            <div style={{ marginTop: "4px" }}>
              شبکه‌های اجتماعی: ۰۹۰۳۲۷۹۲۴۰۷
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-page {
            height: auto !important;
            min-height: 100vh !important;
            padding: 40px 16px !important;
            justify-content: flex-start !important;
            padding-top: 60px !important;
            margin-top: 70px ;
          }
          .contact-page h1 {
            font-size: 17px !important;
            margin-bottom: 24px !important;
          }
          .contact-page .contact-content {
            font-size: 11.5px !important;
            line-height: 1.9 !important;
          }
        }
        @media (max-width: 480px) {
          .contact-page {
            padding: 40px 12px !important;
            padding-top: 50px !important;
          }
          .contact-page h1 {
            font-size: 15px !important;
            margin-bottom: 20px !important;
          }
          .contact-page .contact-content {
            font-size: 10.5px !important;
            line-height: 1.8 !important;
          }
        }
      `}</style>
    </div>
  );
}
