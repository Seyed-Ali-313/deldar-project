// src/pages/NotFound.jsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
        background: "rgba(3, 65, 32, 1)",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* عدد ۴۰۴ */}
        <div
          style={{
            fontSize: "120px",
            fontWeight: 800,
            color: "rgba(201,168,76,0.15)",
            fontFamily: "w_Nian, sans-serif",
            lineHeight: 1,
            marginBottom: "8px",
          }}
        >
          ۴۰۴
        </div>

        {/* خط طلایی */}
        <div
          style={{
            width: "80px",
            height: "2px",
            background: "linear-gradient(90deg, #A4874D, #C9A84C)",
            margin: "0 auto 16px",
          }}
        />

        {/* عنوان */}
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#ffffff",
            fontFamily: "w_Nian, sans-serif",
            marginBottom: "12px",
          }}
        >
          صفحه مورد نظر یافت نشد
        </h1>

        {/* توضیحات */}
        <p
          style={{
            fontSize: "16px",
            color: "rgba(255,255,255,0.5)",
            fontFamily: "w_Lotus, sans-serif",
            lineHeight: "1.8",
            maxWidth: "400px",
            margin: "0 auto 32px",
          }}
        >
          صفحه‌ای که به دنبال آن هستید ممکن است حذف شده یا آدرس آن تغییر کرده
          باشد.
        </p>

        {/* دکمه بازگشت */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/")}
          style={{
            padding: "12px 32px",
            background: "linear-gradient(135deg, #A4874D, #C9A84C)",
            color: "#ffffff",
            borderRadius: "24px",
            border: "none",
            fontSize: "16px",
            fontWeight: 600,
            fontFamily: "w_Lotus, sans-serif",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(164,135,77,0.25)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 6px 32px rgba(164,135,77,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              "0 4px 20px rgba(164,135,77,0.25)";
          }}
        >
          بازگشت به صفحه اصلی
        </motion.button>
      </motion.div>
    </div>
  );
}
