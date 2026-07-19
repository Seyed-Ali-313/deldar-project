import { motion } from "framer-motion";

const PDF_URL = "/pdf/Deldar-Farakhan.pdf#navpanes=0&page=1&zoom=90";

export default function Announcement() {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = PDF_URL;
    link.download = "Deldar-Farakhan.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page announcement-page">
      <div className="announcement-inner">
        <div className="announcement-grid">
          <div className="announcement-card">
            <h2 className="announcement-card-title">درباره فراخوان</h2>
            <div className="announcement-text">
              <p>
                جشنواره ملی عکس دلدار با هدف کشف و معرفی استعدادهای برتر در حوزه
                عکاسی برگزار می‌گردد. هنرمندان و عکاسان سراسر کشور می‌توانند با
                مطالعه دقیق فراخوان و رعایت شرایط ذکر شده، آثار خود را در این
                رویداد هنری به ثبت رسانند.
              </p>
              <p>
                برای آگاهی از شرایط عمومی و اختصاصی شرکت در جشنواره، موارد مربوط
                به تعداد آثار، ابعاد و کیفیت تصاویر، مهلت ارسال و نحوه داوری،
                لطفاً فایل فراخوان را مطالعه فرمایید.
              </p>
            </div>

            <motion.button
              onClick={handleDownload}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="announcement-download-btn"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" />
              </svg>
              دانلود فایل PDF فراخوان
            </motion.button>
          </div>

          <div className="announcement-pdf-box">
            <div className="announcement-iframe-wrap">
              <iframe
                src={PDF_URL}
                title="فراخوان"
                className="announcement-iframe"
              />
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .announcement-page {
          padding: clamp(24px, 4vh, 48px) clamp(16px, 5vw, 40px);
        }

        .announcement-inner {
          max-width: 1150px;
          width: 100%;
          margin: 0 auto;
        }

        .announcement-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(20px, 3vw, 36px);
          align-items: stretch;
          padding: 2px;
        }

        .announcement-card,
        .announcement-pdf-box {
          background: linear-gradient(160deg, rgba(255,255,255,0.035), rgba(255,255,255,0.01));
          border: 1px solid rgba(201, 168, 76, 0.08);
          border-radius: 22px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.25);
          outline: 1px solid rgba(201, 168, 76, 0.2);
          outline-offset: -1px;
        }

        .announcement-card {
          padding: clamp(24px, 3vw, 34px);
          display: flex;
          flex-direction: column;
        }

        .announcement-card-title {
          font-family: "w_Nian", sans-serif;
          font-size: clamp(16px, 2.2vw, 19px);
          color: #C9A84C;
          margin: 0 0 16px;
        }

        .announcement-text {
          font-family: "w_Lotus", sans-serif;
          font-size: clamp(12.5px, 1.6vw, 14.5px);
          line-height: 2.1;
          color: rgba(255,255,255,0.82);
          text-align: justify;
        }

        .announcement-text p {
          margin-bottom: 14px;
        }

                .announcement-download-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 22px;
          padding: 15px 36px;
          background: linear-gradient(135deg, #A4874D, #C9A84C);
          color: #fff;
          border: none;
          border-radius: 28px;
          font-size: clamp(15px, 1.8vw, 17px);
          font-weight: 700;
          font-family: "w_Lotus", sans-serif;
          cursor: pointer;
          box-shadow: 0 8px 28px rgba(164,135,77,0.3);
          align-self: flex-start;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .announcement-download-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .announcement-download-btn:hover {
          background: linear-gradient(135deg, #B89B5A, #D4B85A);
          box-shadow: 0 10px 36px rgba(164,135,77,0.5);
          transform: translateY(-1px);
        }
        .announcement-download-btn:hover::before {
          opacity: 1;
        }

        .announcement-pdf-box {
          overflow: hidden;
          min-height: clamp(380px, 60vh, 620px);
          display: flex;
          flex-direction: column;
        }

        .announcement-iframe-wrap {
          flex: 1;
          overflow: hidden;
          display: flex;
          align-items: stretch;
          justify-content: stretch;
        }

        .announcement-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        @media (max-width: 900px) {
          .announcement-grid {
            grid-template-columns: 1fr;
          }
          .announcement-download-btn {
            align-self: stretch;
          }
        }

        @media (max-width: 480px) {
          .announcement-page { padding: 24px 14px; }
          .announcement-card { padding: 22px 18px; border-radius: 18px; }
          .announcement-pdf-box { border-radius: 18px; min-height: 320px; }
        }
      `}</style>
    </div>
  );
}
