// src/pages/dashboard/SubmitWorks.jsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addWork } from "../../services/dashboardService";
import toPersianDigits from "../../utils/toPersianNumber";
import {
  success as toastSuccess,
  error as toastError,
  warn as toastWarn,
} from "../../utils/toast";
import { showError } from "../../utils/errorHandler";
import getImageUrl from "../../utils/getImageUrl";

function SkeletonImage({ src, alt, style, className, onError }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div style={{ ...style, position: "relative", background: "transparent" }}>
      {!loaded && !error && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(164,135,77,0.06) 25%, rgba(164,135,77,0.12) 50%, rgba(164,135,77,0.06) 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
            borderRadius: style?.borderRadius || "8px",
          }}
        />
      )}
      {src && (
        <img
          src={src}
          alt={alt || ""}
          className={className}
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            setError(true);
            if (onError) onError(e);
          }}
          style={{
            ...style,
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.3s ease",
            width: "100%",
            height: "100%",
          }}
        />
      )}
    </div>
  );
}

export default function SubmitWorks({ totalCount, maxWorks, onWorksChange }) {
  const [currentWork, setCurrentWork] = useState({
    file: null,
    description: "",
    preview: null,
  });
  const [uploadedWorks, setUploadedWorks] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [previewWork, setPreviewWork] = useState(null);
  const containerRef = useRef(null);

  const combinedCount = totalCount + uploadedWorks.length;

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

    if (combinedCount >= maxWorks) {
      toastWarn(`حداکثر ${toPersianDigits(maxWorks)} اثر مجاز است`);
      return;
    }

    setUploadedWorks((prev) => [
      ...prev,
      {
        id: Date.now(),
        file: currentWork.file,
        description: currentWork.description.trim(),
        preview: currentWork.preview,
      },
    ]);

    setCurrentWork({ file: null, description: "", preview: null });
    toastSuccess("عکس به لیست اضافه شد");
  };

  const handleSubmitAll = async () => {
    if (uploadedWorks.length === 0) {
      toastError("لطفاً حداقل یک عکس اضافه کنید");
      return;
    }

    setUploading(true);
    try {
      const results = [];
      for (const work of uploadedWorks) {
        const formData = new FormData();
        formData.append("image", work.file);
        formData.append("description", work.description);
        const res = await addWork(formData);
        const serverWork = res.data.work || res.data;
        results.push({
          id: serverWork.id,
          description: serverWork.description,
          preview: getImageUrl(serverWork.image),
          image: serverWork.image,
          created_at: serverWork.created_at,
        });
      }

      onWorksChange((prev) => [...prev, ...results]);
      toastSuccess(`${toPersianDigits(results.length)} اثر با موفقیت ثبت شد`);
      setUploadedWorks([]);
      setCurrentWork({ file: null, description: "", preview: null });
    } catch (err) {
      showError(err, "خطا در ارسال آثار");
    } finally {
      setUploading(false);
    }
  };

  const removeWork = (index) => {
    setUploadedWorks((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      className="submit-works-container"
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
              {toPersianDigits(maxWorks)}
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
          {toPersianDigits(combinedCount)}
        </span>
        <span
          style={{
            fontSize: "15px",
            color: "rgba(255,255,255,0.25)",
            fontFamily: "w_Lotus, sans-serif",
            fontWeight: 300,
          }}
        >
          / {toPersianDigits(maxWorks)}
        </span>
      </div>

      <div
        className="submit-works-add-row"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr auto",
          gap: "10px",
          alignItems: "center",
          padding: "8px 12px",
          background:
            "linear-gradient(135deg, rgba(164, 135, 77, 0.06), rgba(164, 135, 77, 0.02))",
          borderRadius: "12px",
          border: "1px solid rgba(164, 135, 77, 0.08)",
          marginBottom: "8px",
          flexShrink: 0,
        }}
      >
        <div className="pill" style={{ height: "42px", maxWidth: "100%" }}>
          <input
            type="text"
            className="register-input submit-works-input"
            placeholder="توضیح عکس"
            value={currentWork.description}
            onChange={(e) =>
              setCurrentWork({ ...currentWork, description: e.target.value })
            }
            style={{
              height: "100%",
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
            height: "42px",
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
              e.target.value = "";
            }}
          />
          <label
            htmlFor="current-file"
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "0 28px",
              cursor: "pointer",
              fontSize: "17px",
              color: currentWork.preview ? "#000000" : "rgba(0,0,0,0)",
              fontFamily: "w_Lotus, sans-serif",
              fontWeight: 500,
              direction: "rtl",
            }}
          >
            {currentWork.preview ? (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "100px",
                }}
              >
                <img
                  src={currentWork.preview}
                  alt="پیش‌نمایش"
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "6px",
                    objectFit: "cover",
                    border: "1px solid rgba(164,135,77,0.15)",
                  }}
                />
                <span style={{ fontSize: "12px", color: "#000" }}>
                  {currentWork.file?.name?.slice(0, 10)}...
                </span>
              </span>
            ) : (
              <span style={{ color: "rgba(0,0,0,0.5)", fontWeight: 500 }}>
                انتخاب عکس
              </span>
            )}
          </label>
        </div>

        <motion.button
          type="button"
          onClick={addWorkHandler}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          disabled={combinedCount >= maxWorks}
          style={{
            minWidth: "46px",
            height: "42px",
            background:
              combinedCount >= maxWorks
                ? "rgba(255,255,255,0.05)"
                : "linear-gradient(135deg, #A4874D, #C9A84C)",
            color:
              combinedCount >= maxWorks
                ? "rgba(255,255,255,0.2)"
                : "#ffffff",
            borderRadius: "10px",
            border: "none",
            cursor:
              combinedCount >= maxWorks
                ? "not-allowed"
                : "pointer",
            opacity: combinedCount >= maxWorks ? 0.4 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            fontWeight: 300,
            transition: "all 0.2s ease",
            boxShadow:
              combinedCount >= maxWorks
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
          height: "140px",
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
              className="submit-work-item"
              key={work.id}
              onClick={() => setPreviewWork(work)}
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              style={{
                display: "grid",
                gridTemplateColumns: "36px 1fr 28px",
                gap: "10px",
                alignItems: "center",
                background: "rgba(164, 135, 77, 0.03)",
                padding: "6px 8px",
                borderRadius: "10px",
                border: "1px solid rgba(164, 135, 77, 0.06)",
                marginBottom: "4px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              whileHover={{
                borderColor: "rgba(164, 135, 77, 0.15)",
                background: "rgba(164, 135, 77, 0.05)",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid rgba(164,135,77,0.12)",
                  flexShrink: 0,
                }}
              >
                <SkeletonImage
                  src={work.preview}
                  alt="عکس"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    borderRadius: "8px",
                  }}
                />
              </div>

              <span
                style={{
                  fontSize: "clamp(12px, 2.6vw, 14px)",
                  color: "#ffffff",
                  fontFamily: "w_Lotus, sans-serif",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontWeight: 500,
                }}
              >
                {work.description}
              </span>

              <motion.button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeWork(index);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  background: "rgba(176, 1, 1, 0.06)",
                  border: "none",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  cursor: "pointer",
                  color: "#B00101",
                  fontSize: "12px",
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
              color: "rgba(255,255,255,0.1)",
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
          marginBottom: "20px",
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
            <span style={{ fontSize: "18px" }}></span>
            <span>
              ارسال مجموع آثار ({toPersianDigits(uploadedWorks.length)} عکس)
            </span>
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {previewWork && (
          <motion.div
            className="work-preview-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewWork(null)}
          >
            <motion.div
              className="work-preview-card"
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="work-preview-close"
                onClick={() => setPreviewWork(null)}
              >
                ✕
              </button>
              <SkeletonImage
                src={
                  previewWork.preview ||
                  previewWork.image ||
                  "/src/assets/images/logo-bg.png"
                }
                alt="پیش‌نمایش عکس"
                className="work-preview-img"
                style={{
                  width: "100%",
                  maxHeight: "60vh",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
                onError={(e) => {
                  e.target.src = "/src/assets/images/logo-bg.png";
                }}
              />
              <p className="work-preview-desc">{previewWork.description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

  .submit-works-input {
    font-size: 17px !important;
    font-weight: 500 !important;
  }
  .submit-works-input::placeholder {
    font-size: 17px !important;
    font-weight: 500 !important;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .work-preview-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(4px);
    z-index: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    cursor: pointer;
  }

  .work-preview-card {
    position: relative;
    background: #0a2416;
    border: 1px solid rgba(201, 168, 76, 0.25);
    border-radius: 18px;
    padding: 16px;
    max-width: 420px;
    width: 100%;
    max-height: 85vh;
    overflow: auto;
    cursor: default;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
  }

  .work-preview-img {
    width: 100%;
    max-height: 60vh;
    object-fit: contain;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.03);
  }

  .work-preview-desc {
    margin: 12px 0 0;
    color: rgba(255, 255, 255, 0.9);
    font-family: "w_Lotus", sans-serif;
    font-size: 17px;
    font-weight: 600;
    line-height: 1.8;
    text-align: center;
  }

  .work-preview-close {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }

  .work-preview-close:hover {
    background: rgba(192, 57, 43, 0.5);
  }

  @media (max-width: 900px) {
    .submit-works-container {
      max-height: 520px !important;
      margin: 0 auto !important;
    }
    .submit-works-add-row {
      grid-template-columns: 1fr 1fr !important;
      grid-template-rows: auto auto !important;
    }
    .submit-works-add-row > button {
      grid-column: 1 / -1 !important;
      width: 100% !important;
      min-width: unset !important;
      height: 42px !important;
    }
    .submit-works-scroll {
      height: 140px !important;
    }
    .submit-work-item {
      
    }
  }

  @media (max-width: 480px) {
    .submit-works-container {
      padding-top: 0 !important;
    }
    .submit-works-add-row {
      grid-template-columns: 1fr !important;
      grid-template-rows: auto auto auto !important;
      gap: 6px !important;
    }
    .submit-works-add-row .pill {
      height: 42px !important;
    }
    .submit-works-add-row .register-input {
      font-size: 16px !important;
    }
    .submit-work-item {
      grid-template-columns: 28px 1fr 22px !important;
      gap: 8px !important;
      padding: 4px 6px !important;
    }
    .submit-work-item > div:first-child {
      width: 28px !important;
      height: 28px !important;
    }
    .submit-work-item > div:first-child img {
      width: 28px !important;
      height: 28px !important;
    }
    .submit-work-item > span {
      font-size: 11.5px !important;
    }
    .submit-work-item > button {
      width: 22px !important;
      height: 22px !important;
      font-size: 10px !important;
    }
  }
`}</style>
    </div>
  );
}
