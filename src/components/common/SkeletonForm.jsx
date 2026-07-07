// src/components/common/SkeletonForm.jsx
import { motion } from "framer-motion";

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
          <motion.div
            key={i}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.08,
              ease: "easeInOut",
            }}
            style={{
              height: "42px",
              background: "rgba(201, 168, 76, 0.06)",
              borderRadius: "21px",
              border: "1px solid rgba(201, 168, 76, 0.04)",
            }}
          />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 0.4,
          ease: "easeInOut",
        }}
        style={{
          marginTop: "28px",
          height: "52px",
          width: "180px",
          marginLeft: "auto",
          background: "rgba(201, 168, 76, 0.08)",
          borderRadius: "24px",
          border: "1px solid rgba(201, 168, 76, 0.04)",
        }}
      />
    </div>
  );
}
