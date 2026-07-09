// src/pages/dashboard/UploadSuccess.jsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import successCard from "../../assets/images/success-card.png";

export default function UploadSuccess() {
  const navigate = useNavigate();

  return (
    <div
      className="upload-success-page"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
        background: "rgba(3, 65, 32, 1)",
        padding: "20px",
      }}
    >
      <motion.div
        className="upload-success-card"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          maxWidth: "687px",
          width: "100%",
          position: "relative",
          marginTop: "-190px",
        }}
      >
        {/* تصویر PNG */}
        <img
          src={successCard}
          alt=""
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />

        {/* محتوای داخل تصویر - با پدینگ بیشتر */}
        <div
          className="upload-success-overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 50px 50px", // ← پدینگ بیشتر
            textAlign: "center",
          }}
        >
          {/* عنوان - کوچک‌تر */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: "w_Nian, sans-serif",
              marginBottom: "1px",
              marginTop: "-18px",
              lineHeight: "1.6",
              letterSpacing: "0.5px",
            }}
          >
            عکس‌های شما با موفقیت بارگذاری شد.
          </motion.h1>

          {/* خط جداکننده */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "50px" }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              height: "2px",
              background: "linear-gradient(90deg, #A4874D, #C9A84C)",
              margin: "0 auto 14px",
              borderRadius: "2px",
            }}
          />

          {/* متن اصلی - کوچک‌تر */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              fontSize: "15px",
              color: "#C9A84C",
              fontFamily: "w_Lotus, sans-serif",
              lineHeight: "2",
              marginBottom: "12px",
              direction: "rtl",
            }}
          >
            تا پایان مرداد ۱۴۰۵، با ورود مجدد به سایت
            <br />
            می‌توانید عکس‌های خود را ویرایش کنید.
          </motion.p>

          {/* پیام تشکر */}
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            style={{
              fontSize: "15px",
              color: "#C9A84C",
              fontFamily: "w_Lotus, sans-serif",
              fontWeight: 600,
              marginBottom: 0,
              // background: "rgba(201, 168, 76, 0.08)",
              padding: "4px 20px",
              borderRadius: "16px",
              display: "inline-block",
            }}
          >
            از همراهی شما سپاسگزاریم
          </motion.p>
        </div>
      </motion.div>
      {/* ✅ دکمه بیرون از عکس - پایین */}
      <motion.button
        className="upload-success-btn"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        onClick={() => navigate("/dashboard")}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        style={{
          width: "100%",
          maxWidth: "300px",
          minHeight: "50px",
          background: "linear-gradient(135deg, #A4874D, #C9A84C)",
          color: "#ffffff",
          borderRadius: "24px",
          border: "none",
          fontSize: "17px",
          fontWeight: 600,
          fontFamily: "w_Lotus, sans-serif",
          cursor: "pointer",
          boxShadow: "0 4px 24px rgba(164,135,77,0.35)",
          marginTop: "24px",
          transition: "all 0.3s ease",
          letterSpacing: "0.5px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 8px 40px rgba(164,135,77,0.5)";
          e.currentTarget.style.transform = "translateY(-3px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 24px rgba(164,135,77,0.35)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        ورود به صفحه کاربری
      </motion.button>{" "}
      <style>{`
  @media (max-width: 900px) {
    .upload-success-card {
      margin-top: -60px !important;
    }
    .upload-success-overlay {
      padding: 8% 9% !important;
    }
    .upload-success-title {
      font-size: clamp(15px, 4.2vw, 20px) !important;
    }
    .upload-success-text {
      font-size: clamp(11px, 3.2vw, 15px) !important;
      line-height: 1.8 !important;
      margin-bottom: 8px !important;
    }
    .upload-success-thanks {
      font-size: clamp(10px, 2.8vw, 13px) !important;
    }
    .upload-success-btn {
      max-width: 260px !important;
      min-height: 46px !important;
      font-size: 14px !important;
      margin-top: 18px !important;
    }
  }

  @media (max-width: 480px) {
    .upload-success-page {
      padding: 14px !important;
    }
    .upload-success-card {
      margin-top: -30px !important;
    }
    .upload-success-overlay {
      padding: 7% 8% !important;
    }
    .upload-success-title {
      font-size: clamp(13px, 4vw, 17px) !important;
    }
    .upload-success-text {
      font-size: clamp(10px, 3vw, 13px) !important;
    }
    .upload-success-btn {
      max-width: 100% !important;
      min-height: 44px !important;
      font-size: 13px !important;
    }
  }
`}</style>
    </div>
  );
}
