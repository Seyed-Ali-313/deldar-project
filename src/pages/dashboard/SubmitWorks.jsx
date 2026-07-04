// src/pages/dashboard/SubmitWorks.jsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addWork } from "../../services/dashboardService";
import { showError } from "../../utils/errorHandler";
import {
  success as toastSuccess,
  error as toastError,
  warn as toastWarn,
} from "../../utils/toast";

const MAX_WORKS = 50;
const MAX_DESCRIPTION_LENGTH = 200;

export default function SubmitWorks() {
  const [currentWork, setCurrentWork] = useState({
    file: null,
    description: "",
    preview: null,
  });
  const [uploadedWorks, setUploadedWorks] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && uploadedWorks.length > 0) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [uploadedWorks]);

  const handleFileSelect = (file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toastError("حجم فایل باید کمتر از ۵ مگابایت باشد");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toastError("فایل باید از نوع تصویر باشد");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setCurrentWork({
        file: file,
        description: currentWork.description,
        preview: e.target.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const addWorkHandler = () => {
    if (!currentWork.file) {
      toastError("لطفاً ابتدا یک عکس انتخاب کنید");
      return;
    }

    if (!currentWork.description.trim()) {
      toastError("لطفاً شرح عکس را وارد کنید");
      return;
    }

    if (uploadedWorks.length >= MAX_WORKS) {
      toastWarn(`حداکثر ${MAX_WORKS} اثر مجاز است`);
      return;
    }

    setUploadedWorks([
      ...uploadedWorks,
      {
        id: Date.now(),
        file: currentWork.file,
        description: currentWork.description,
        preview: currentWork.preview,
      },
    ]);

    const newIndex = uploadedWorks.length;
    setUploadProgress({ [newIndex]: 0 });
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const current = prev[newIndex] || 0;
        if (current >= 100) {
          clearInterval(interval);
          return { ...prev, [newIndex]: 100 };
        }
        return { ...prev, [newIndex]: Math.min(current + 10, 100) };
      });
    }, 150);

    setCurrentWork({ file: null, description: "", preview: null });
    toastSuccess("عکس با موفقیت اضافه شد");
  };

  const removeWork = (index) => {
    const updated = uploadedWorks.filter((_, i) => i !== index);
    setUploadedWorks(updated);
    const newProgress = { ...uploadProgress };
    delete newProgress[index];
    setUploadProgress(newProgress);
  };

  const handleSubmitAll = async () => {
    if (uploadedWorks.length === 0) {
      toastError("لطفاً حداقل یک عکس آپلود کنید");
      return;
    }

    setUploading(true);
    try {
      for (const work of uploadedWorks) {
        const formData = new FormData();
        formData.append("image", work.file);
        formData.append("description", work.description);
        await addWork(formData);
      }

      toastSuccess(`${uploadedWorks.length} اثر با موفقیت اضافه شد`);
      setUploadedWorks([]);
    } catch (err) {
      showError(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "780px",
        margin: " -5px auto",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxHeight: "430px",
        paddingTop: "4px",
      }}
    >
      <div
        style={{
          textAlign: "right",
          marginBottom: "8px",
          marginTop: "-40px",
          padding: "8px 14px",
          background:
            "linear-gradient(135deg, rgba(164, 135, 77, 0.08), rgba(164, 135, 77, 0.03))",
          borderRadius: "12px",
          border: "1px solid rgba(164, 135, 77, 0.12)",
          flexShrink: 0,
        }}
      >
        <p
          style={{
            fontSize: "12px",
            color: "#d0c5b0",
            fontWeight: 400,
            lineHeight: "1.6",
            fontFamily: "w_Lotus, sans-serif",
            margin: 0,
          }}
        >
          <span
            style={{
              color: "#C9A84C",
              fontWeight: 700,
              fontSize: "13px",
            }}
          >
            توجه:
          </span>
          <br />
          <span style={{ color: "rgba(255,255,255,0.7)" }}>
            • هر عکاس می‌تواند حداکثر{" "}
            <span style={{ color: "#C9A84C", fontWeight: 600 }}>
              {MAX_WORKS}
            </span>{" "}
            تک عکس ارسال کند.
          </span>
          <br />
          <span style={{ color: "rgba(255,255,255,0.7)" }}>
            • ابعاد هر فایل ارسالی حداقل ۱۰۰۰ و حداکثر ۱۵۰۰ پیکسل باشد.
          </span>
          <br />
          <span style={{ color: "rgba(255,255,255,0.7)" }}>
            • حجم هر فایل ارسالی کمتر از ۵ مگابایت باشد.
          </span>
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          marginBottom: "8px",
          padding: "6px 16px",
          background:
            "linear-gradient(135deg, rgba(164, 135, 77, 0.1), rgba(164, 135, 77, 0.04))",
          borderRadius: "10px",
          border: "1px solid rgba(164, 135, 77, 0.1)",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: "13px",
            color: "rgba(255,255,255,0.5)",
            fontFamily: "w_Lotus, sans-serif",
            fontWeight: 500,
          }}
        >
          تعداد آثار:
        </span>
        <span
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#C9A84C",
            fontFamily: "w_Lotus, sans-serif",
            background: "rgba(164, 135, 77, 0.12)",
            padding: "0 14px",
            borderRadius: "8px",
            minWidth: "40px",
            textAlign: "center",
          }}
        >
          {uploadedWorks.length}
        </span>
        <span
          style={{
            fontSize: "15px",
            color: "rgba(255,255,255,0.25)",
            fontFamily: "w_Lotus, sans-serif",
            fontWeight: 300,
          }}
        >
          / {MAX_WORKS}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr auto",
          gap: "8px",
          alignItems: "center",
          padding: "6px 10px",
          background:
            "linear-gradient(135deg, rgba(164, 135, 77, 0.06), rgba(164, 135, 77, 0.02))",
          borderRadius: "12px",
          border: "1px solid rgba(164, 135, 77, 0.08)",
          marginBottom: "8px",
          flexShrink: 0,
        }}
      >
        <div className="pill" style={{ height: "38px", maxWidth: "100%" }}>
          <input
            type="text"
            className="register-input"
            placeholder="شرح عکس جدید..."
            value={currentWork.description}
            onChange={(e) =>
              setCurrentWork({ ...currentWork, description: e.target.value })
            }
            style={{
              fontSize: "13px",
              height: "100%",
              fontWeight: 500,
              color: "#000000",
            }}
          />
        </div>

        <div
          className="pill"
          style={{
            position: "relative",
            overflow: "hidden",
            cursor: "pointer",
            height: "38px",
            maxWidth: "100%",
          }}
        >
          <input
            type="file"
            accept="image/*"
            id="current-file"
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
          />
          <label
            htmlFor="current-file"
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 12px",
              cursor: "pointer",
              fontSize: "12px",
              color: currentWork.preview ? "#000000" : "rgba(0,0,0,0.4)",
              fontFamily: "w_Lotus, sans-serif",
              fontWeight: 500,
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "90px",
              }}
            >
              {currentWork.preview ? (
                <>
                  <img
                    src={currentWork.preview}
                    alt="پیش‌نمایش"
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "4px",
                      objectFit: "cover",
                      border: "1px solid rgba(164,135,77,0.15)",
                    }}
                  />
                  <span style={{ fontSize: "10px", color: "#000" }}>
                    {currentWork.file?.name?.slice(0, 8)}...
                  </span>
                </>
              ) : (
                <>
                  <span style={{ fontSize: "14px" }}>🖼</span>
                  <span style={{ fontSize: "11px", color: "rgba(0,0,0,0.5)" }}>
                    انتخاب عکس
                  </span>
                </>
              )}
            </span>
            <span style={{ color: "#C9A84C", fontSize: "14px" }}>📷</span>
          </label>
        </div>

        <motion.button
          type="button"
          onClick={addWorkHandler}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={uploadedWorks.length >= MAX_WORKS}
          style={{
            minWidth: "42px",
            height: "38px",
            background:
              uploadedWorks.length >= MAX_WORKS
                ? "rgba(255,255,255,0.05)"
                : "linear-gradient(135deg, #A4874D, #C9A84C)",
            color:
              uploadedWorks.length >= MAX_WORKS
                ? "rgba(255,255,255,0.2)"
                : "#ffffff",
            borderRadius: "10px",
            border: "none",
            cursor:
              uploadedWorks.length >= MAX_WORKS ? "not-allowed" : "pointer",
            opacity: uploadedWorks.length >= MAX_WORKS ? 0.4 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            fontWeight: 300,
            transition: "all 0.2s ease",
            boxShadow:
              uploadedWorks.length >= MAX_WORKS
                ? "none"
                : "0 3px 10px rgba(164,135,77,0.25)",
          }}
        >
          +
        </motion.button>
      </div>

      <div
        ref={containerRef}
        style={{
          height: "115px",
          overflowY: "auto",
          paddingRight: "2px",
          marginBottom: "8px",
          scrollBehavior: "smooth",
          flexShrink: 0,
        }}
        className="submit-works-scroll"
      >
        <AnimatePresence>
          {uploadedWorks.map((work, index) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              style={{
                display: "grid",
                gridTemplateColumns: "36px 1fr 1fr 28px",
                gap: "6px",
                alignItems: "center",
                background: "rgba(164, 135, 77, 0.03)",
                padding: "5px 10px",
                borderRadius: "10px",
                border: "1px solid rgba(164, 135, 77, 0.06)",
                marginBottom: "4px",
                transition: "all 0.2s ease",
              }}
              whileHover={{
                borderColor: "rgba(164, 135, 77, 0.15)",
                background: "rgba(164, 135, 77, 0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#C9A84C",
                    fontFamily: "w_Lotus, sans-serif",
                  }}
                >
                  #{index + 1}
                </span>
                <span style={{ color: "#4CAF50", fontSize: "9px" }}>✓</span>
              </div>

              <span
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.85)",
                  fontFamily: "w_Lotus, sans-serif",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontWeight: 500,
                }}
              >
                {work.description}
              </span>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <img
                  src={work.preview}
                  alt="عکس"
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "4px",
                    objectFit: "cover",
                    border: "1px solid rgba(164,135,77,0.08)",
                  }}
                />
                <span
                  style={{
                    fontSize: "9px",
                    color: "rgba(255,255,255,0.3)",
                    fontFamily: "w_Lotus, sans-serif",
                  }}
                >
                  {work.file?.name?.slice(0, 8)}...
                </span>
              </div>

              <motion.button
                type="button"
                onClick={() => removeWork(index)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  background: "rgba(176, 1, 1, 0.06)",
                  border: "none",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  cursor: "pointer",
                  color: "#B00101",
                  fontSize: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(176, 1, 1, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(176, 1, 1, 0.06)";
                }}
              >
                ✕
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>

        {uploadedWorks.length === 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "rgba(255,255,255,0.15)",
              fontSize: "12px",
              fontFamily: "w_Lotus, sans-serif",
              gap: "2px",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "rgba(255,255,255,0.2)",
              }}
            >
              هیچ عکسی انتخاب نشده است
            </span>
          </div>
        )}
      </div>

      <motion.button
        type="button"
        onClick={handleSubmitAll}
        disabled={uploading || uploadedWorks.length === 0}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        style={{
          width: "100%",
          minHeight: "44px",
          background:
            uploading || uploadedWorks.length === 0
              ? "rgba(255,255,255,0.04)"
              : "linear-gradient(135deg, #A4874D, #C9A84C)",
          color:
            uploading || uploadedWorks.length === 0
              ? "rgba(255,255,255,0.2)"
              : "#ffffff",
          borderRadius: "20px",
          border: "none",
          fontSize: "15px",
          fontWeight: 700,
          cursor:
            uploading || uploadedWorks.length === 0 ? "not-allowed" : "pointer",
          opacity: uploading || uploadedWorks.length === 0 ? 0.4 : 1,
          boxShadow:
            uploading || uploadedWorks.length === 0
              ? "none"
              : "0 3px 20px rgba(164,135,77,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          transition: "all 0.3s ease",
          fontFamily: "w_Lotus, sans-serif",
          flexShrink: 0,
          letterSpacing: "0.3px",
        }}
      >
        {uploading ? (
          <>
            <span
              style={{
                display: "inline-block",
                animation: "spin 1s linear infinite",
                fontSize: "18px",
              }}
            >
              ⏳
            </span>
            <span>در حال ارسال آثار...</span>
          </>
        ) : (
          <>
            <span style={{ fontSize: "18px" }}>📤</span>
            <span>ارسال مجموع آثار ({uploadedWorks.length} عکس)</span>
          </>
        )}
      </motion.button>

      <style>{`
        .submit-works-scroll::-webkit-scrollbar {
          width: 3px;
        }
        .submit-works-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }
        .submit-works-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #A4874D, #C9A84C);
          border-radius: 4px;
        }
        .submit-works-scroll::-webkit-scrollbar-thumb:hover {
          background: #C9A84C;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
