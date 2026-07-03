// src/components/common/SkeletonWorks.jsx
import { motion } from "framer-motion";

export default function SkeletonWorks({ count = 5 }) {
  return (
    <div style={{ width: "100%", maxWidth: "680px", margin: "0 auto" }}>
      {/* هدر اسکلت */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
          padding: "10px 16px",
          borderRadius: "14px",
        }}
      >
        <div
          style={{
            width: "120px",
            height: "20px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: "8px",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            width: "60px",
            height: "28px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: "10px",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      </div>

      {/* لیست اسکلت */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {[...Array(count)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.08 }}
            style={{
              display: "grid",
              gridTemplateColumns: "52px 1fr 36px",
              gap: "14px",
              alignItems: "center",
              padding: "8px 14px 8px 8px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            {/* تصویر اسکلت */}
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.05)",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />

            {/* توضیحات اسکلت */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <div
                style={{
                  width: "80%",
                  height: "14px",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "6px",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
              <div
                style={{
                  width: "40%",
                  height: "10px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "4px",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            </div>

            {/* دکمه حذف اسکلت */}
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.03)",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          </motion.div>
        ))}
      </div>

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
