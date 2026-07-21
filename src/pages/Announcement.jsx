import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import emtiaz from "../assets/images/emtiaz.svg";

const PDF_PATH = `${import.meta.env.BASE_URL}pdf/Deldar-Farakhan.pdf`;

export default function Announcement() {
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfError, setPdfError] = useState(false);
  const [loading, setLoading] = useState(true);
  const objectUrlRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    fetch(PDF_PATH)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load PDF");
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/pdf")) {
          throw new Error("Response is not PDF");
        }
        return res.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        objectUrlRef.current = url;
        setPdfUrl(url);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setPdfError(true);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = PDF_PATH;
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
            <h2 className="announcement-card-title">
              <span className="announcement-title-icon" aria-hidden="true">
                <img src={emtiaz} alt="" style={{ width: 18 }} />
              </span>
              درباره فراخوان
            </h2>
            <div className="announcement-text">
              <p>
                تاریخ، لحظاتی نادر و بیبازگشت پیش رو ی انسان میگشاید که تنها
                یکبار یک مراسم رسمی رخ میدهند. آنچه در این روزها شاهدش هستیم،
                صرفا نیست؛ رخدادی تمدنی است، نمایشی از پیوند عمیق یک ملت با
                آرمانها و حافظهی تار یخی خود. خانه عکاسان ایران، همه هنرمندان و
                عالقهمندان به عکاسی مستند را به مشارکت در پروژهی ملی »دلدار «
                دعوت میکند؛ روایتــی تصویــری از وداع، تشــییع و تدفیــن رهبــر
                شــهید انقــاب اســامی در تمام ابعاد اجتماعی، عاطفی، آیینی و تار
                یخی آن.
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
              {loading && (
                <div className="announcement-pdf-loading">
                  <div className="announcement-loader">
                    <div className="announcement-loader-icon">
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#C9A84C"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>
                    <div className="announcement-loader-bar">
                      <div className="announcement-loader-bar-inner" />
                    </div>
                    <span className="announcement-loader-text">
                      بارگذاری فراخوان
                    </span>
                  </div>
                </div>
              )}
              {pdfError && (
                <div className="announcement-pdf-error">
                  امکان نمایش فایل وجود ندارد. لطفاً از دکمه دانلود استفاده
                  کنید.
                </div>
              )}
              {pdfUrl && (
                <iframe
                  src={pdfUrl}
                  title="فراخوان"
                  className="announcement-iframe"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .announcement-page {
          padding: clamp(24px, 4vh, 48px) clamp(16px, 5vw, 40px)!important;
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
          font-size: clamp(17px, 2.4vw, 21px);
          font-weight: 700;
          color: #C9A84C;
          margin: 0 0 16px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .announcement-title-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          line-height: 0;
        }

        .announcement-text {
          font-family: "w_Lotus", sans-serif;
          font-size: clamp(15px, 1.7vw, 16px);
          line-height: 2.1;
          color: rgba(255,255,255,0.82);
          text-align: justify;
        }

        .announcement-text p {
          margin-bottom: 42px;
        }

        .announcement-download-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          margin-top: auto;
          margin-bottom: -9px;
          padding: 10px 32px;
          background: linear-gradient(135deg, #A4874D, #C9A84C);
          color: #fff;
          border: none;
          border-radius: 999px;
          font-size: clamp(14px, 1.6vw, 15.5px);
          font-weight: 700;
          font-family: "w_Lotus", sans-serif;
          cursor: pointer;
          box-shadow: 0 6px 24px rgba(164,135,77,0.25);
          align-self: stretch;
          letter-spacing: 0.3px;
          transition: box-shadow 0.3s ease, transform 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .announcement-download-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.18), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 999px;
        }
        .announcement-download-btn:hover {
          box-shadow: 0 10px 32px rgba(164,135,77,0.45);
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
          position: relative;
        }

        .announcement-pdf-loading,
        .announcement-pdf-error {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .announcement-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .announcement-loader-icon {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(201,168,76,0.1), rgba(201,168,76,0.02));
          border: 1.5px solid rgba(201,168,76,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: announcementPulse 1.8s ease-in-out infinite;
          box-shadow: 0 0 40px rgba(201,168,76,0.06);
        }

        .announcement-loader-icon svg {
          animation: announcementBounce 1.8s ease-in-out infinite;
        }

        .announcement-loader-bar {
          width: 140px;
          height: 3px;
          background: rgba(201,168,76,0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .announcement-loader-bar-inner {
          height: 100%;
          width: 35%;
          background: linear-gradient(90deg, transparent, #C9A84C, transparent);
          border-radius: 4px;
          animation: announcementSlide 1.4s ease-in-out infinite;
        }

        .announcement-loader-text {
          font-family: "w_Lotus", sans-serif;
          font-size: clamp(13px, 1.6vw, 15px);
          color: rgba(255,255,255,0.45);
          letter-spacing: 1.5px;
          animation: announcementFade 1.8s ease-in-out infinite;
        }

        @keyframes announcementPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.06); opacity: 0.7; }
        }

        @keyframes announcementBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @keyframes announcementSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }

        @keyframes announcementFade {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 1; }
        }

        .announcement-pdf-error {
          color: rgba(255,180,80,0.8);
          font-family: "w_Lotus", sans-serif;
          font-size: clamp(13px, 1.6vw, 15px);
          text-align: center;
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

        @media (min-width: 901px) {
          .announcement-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            padding: clamp(54 px, 4vh, 48px) clamp(16px, 5vw, 40px) !important ;
            margin-top: 20px;
          }
          .announcement-inner {
            width: 100%;
          }
        }

        @media (max-width: 900px) {
          .announcement-grid {
            grid-template-columns: 1fr;
          }
          .announcement-download-btn {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .announcement-page { padding: 24px 14px !important; }
          .announcement-card { padding: 22px 18px; border-radius: 18px; }
          .announcement-pdf-box { border-radius: 18px; min-height: 320px; }
        }
      `}</style>
    </div>
  );
}
