// src/components/common/SkeletonForm.jsx
export default function SkeletonForm({ fields = 6 }) {
  return (
    <div style={{ width: "100%", maxWidth: "750px", margin: "0 auto" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "18px",
        }}
      >
        {[...Array(fields)].map((_, i) => (
          <div
            key={i}
            style={{
              height: "42px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "21px",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
        ))}
      </div>
      <div
        style={{
          marginTop: "28px",
          height: "52px",
          width: "180px",
          marginLeft: "auto",
          background: "rgba(164,135,77,0.15)",
          borderRadius: "24px",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.3; }
          50% { opacity: 0.7; }
          100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
