// src/pages/Contact.jsx
export default function Contact() {
  return (
    <div
      className="page"
      style={{
        padding: "clamp(32px, 8vh, 60px) clamp(16px, 5vw, 20px)",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontFamily: "w_Nian",
          marginBottom: 20,
          fontSize: "clamp(20px, 5vw, 28px)",
          color: "#ffffff",
        }}
      >
        ارتباط با ما
      </h1>
      <p
        style={{
          maxWidth: 700,
          margin: "0 auto",
          lineHeight: 2,
          fontSize: "clamp(13px, 3.6vw, 16px)",
          color: "rgba(255,255,255,0.8)",
          padding: "0 4px",
        }}
      >
        اطلاعات تماس اینجا قرار می‌گیرد.
      </p>
    </div>
  );
}
