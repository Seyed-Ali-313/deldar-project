// src/pages/dashboard/UploadSuccess.jsx
import { useNavigate } from "react-router-dom";

export default function UploadSuccess() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
        background: "rgba(3, 65, 32, 1)",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "440px",
          width: "100%",
          textAlign: "center",
          padding: "40px 32px",
          background: "rgba(2, 33, 16, 0.8)",
          borderRadius: "24px",
          border: "1px solid rgba(164, 135, 77, 0.08)",
          marginTop: "-150px", // ← اضافه شد: یکم به بالا میبره
        }}
      >
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#ffffff",
            fontFamily: "w_Nian, sans-serif",
            marginBottom: "20px",
            lineHeight: "1.6",
          }}
        >
          عکس‌های شما با موفقیت بارگذاری شد.
        </h1>

        <p
          style={{
            fontSize: "15px",
            color: "rgba(255,255,255,0.65)",
            fontFamily: "w_Lotus, sans-serif",
            lineHeight: "2",
            marginBottom: "24px",
            direction: "rtl",
          }}
        >
          تا پایان مرداد ۱۴۰۵، با ورود مجدد به سایت
          <br />
          می‌توانید عکس‌های خود را ویرایش کنید.
        </p>

        <p
          style={{
            fontSize: "15px",
            color: "rgba(201, 168, 76, 0.9)",
            fontFamily: "w_Lotus, sans-serif",
            fontWeight: 500,
            marginBottom: "28px",
          }}
        >
          از همراهی شما سپاسگزاریم.
        </p>

        <button
          onClick={() => navigate("/")}
          style={{
            width: "100%",
            maxWidth: "200px",
            minHeight: "44px",
            background: "rgba(165, 135, 77, 1)",
            color: "#ffffff",
            borderRadius: "24px",
            border: "none",
            fontSize: "15px",
            fontWeight: 600,
            fontFamily: "w_Lotus, sans-serif",
            cursor: "pointer",
            transition: "all 0.2s ease",
            margin: "0 auto",
            display: "block",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(178, 148, 90, 1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(165, 135, 77, 1)";
          }}
        >
          بازگشت به صفحه اصلی
        </button>
      </div>
    </div>
  );
}
