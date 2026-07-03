// src/components/common/ConfirmModal.jsx
import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "تایید حذف",
  message = "آیا از حذف این مورد مطمئن هستید؟",
  confirmText = "حذف",
  cancelText = "انصراف",
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(8px)",
          padding: "20px",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2 }}
          style={{
            maxWidth: "420px",
            width: "100%",
            background: "#0f241a",
            borderRadius: "20px",
            padding: "32px 28px 24px",
            border: "1px solid rgba(164,135,77,0.1)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
            textAlign: "center",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* آیکون */}
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "rgba(176,1,1,0.12)",
              border: "1px solid rgba(176,1,1,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#B00101"
              strokeWidth="2"
            >
              <path d="M12 9v4M12 17h.01" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>

          {/* عنوان */}
          <h3
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: "w_Nian, sans-serif",
              marginBottom: "8px",
            }}
          >
            {title}
          </h3>

          {/* پیام */}
          <p
            style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.6)",
              fontFamily: "w_Lotus, sans-serif",
              lineHeight: "1.8",
              marginBottom: "24px",
            }}
          >
            {message}
          </p>

          {/* دکمه‌ها */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
            }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              style={{
                flex: 1,
                minHeight: "44px",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.6)",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.06)",
                fontSize: "15px",
                fontWeight: 600,
                fontFamily: "w_Lotus, sans-serif",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              }}
            >
              {cancelText}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onConfirm}
              style={{
                flex: 1,
                minHeight: "44px",
                background: "linear-gradient(135deg, #B00101, #d40202)",
                color: "#ffffff",
                borderRadius: "12px",
                border: "none",
                fontSize: "15px",
                fontWeight: 700,
                fontFamily: "w_Lotus, sans-serif",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(176,1,1,0.25)",
                transition: "all 0.2s ease",
              }}
            >
              {confirmText}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
