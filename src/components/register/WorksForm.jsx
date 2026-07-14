import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { success, error, showErrors } from "../../utils/toast";
import { uploadWork, submitAllWorks } from "../../services/onboardingService";
import { getErrorMessage } from "../../utils/validators";
import useRegisterData from "../../hooks/useRegisterData";
import toPersianDigits from "../../utils/toPersianNumber";

const MAX_WORKS = 50;
const MAX_DESCRIPTION_LENGTH = 200;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// تبدیل base64 ذخیره‌شده در sessionStorage به File واقعی برای آپلود
async function dataURLtoFile(dataUrl, fileName, fileType) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], fileName || "photo.jpg", {
    type: fileType || blob.type,
  });
}

export default function WorksForm({
  onSuccess,
  uploadFn,
  showFinalSubmit = true,
}) {
  const { data, setWorks: persistWorks } = useRegisterData();

  const [currentWork, setCurrentWork] = useState({
    file: null,
    description: "",
    preview: null,
  });
  const [uploadedWorks, setUploadedWorksState] = useState(data.works || []);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [previewWork, setPreviewWork] = useState(null);
  const containerRef = useRef(null);

  const setUploadedWorks = (updater) => {
    setUploadedWorksState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      persistWorks(next);
      return next;
    });
  };

  useEffect(() => {
    if (containerRef.current && uploadedWorks.length > 0) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [uploadedWorks]);

  const validateFile = (file) => {
    const errs = [];
    if (!file) {
      errs.push("هیچ فایلی انتخاب نشده است");
      return errs;
    }
    if (file.size > MAX_FILE_SIZE_BYTES)
      errs.push(`حجم فایل باید کمتر از ${MAX_FILE_SIZE_MB} مگابایت باشد`);
    if (!file.type.startsWith("image/"))
      errs.push("فایل باید از نوع تصویر باشد");
    return errs;
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    const errs = validateFile(file);
    if (errs.length > 0) {
      showErrors(errs);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setCurrentWork({
        file,
        description: currentWork.description,
        preview: e.target.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const addWork = () => {
    const errs = [];
    if (!currentWork.file) errs.push("لطفاً ابتدا یک عکس انتخاب کنید");
    if (!currentWork.description.trim()) {
      errs.push("لطفاً شرح عکس را وارد کنید");
    } else if (currentWork.description.length > MAX_DESCRIPTION_LENGTH) {
      errs.push(`شرح عکس باید کمتر از ${MAX_DESCRIPTION_LENGTH} کاراکتر باشد`);
    }
    if (uploadedWorks.length >= MAX_WORKS)
      errs.push(`حداکثر ${toPersianDigits(MAX_WORKS)} اثر مجاز است`);

    if (errs.length > 0) {
      showErrors(errs);
      return;
    }

    const newWork = {
      id: Date.now(),
      description: currentWork.description.trim(),
      preview: currentWork.preview,
      fileName: currentWork.file.name,
      fileType: currentWork.file.type,
    };

    setUploadedWorks((prev) => [...prev, newWork]);

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
    success("عکس با موفقیت اضافه شد");
  };

  const removeWork = (index) => {
    setUploadedWorks((prev) => prev.filter((_, i) => i !== index));
    const newProgress = { ...uploadProgress };
    delete newProgress[index];
    setUploadProgress(newProgress);
  };

  const handleSubmitAll = async () => {
    if (uploadedWorks.length === 0) {
      error("لطفاً حداقل یک عکس آپلود کنید");
      return;
    }

    setUploading(true);
    try {
      const uploader = uploadFn || uploadWork;

      for (const work of uploadedWorks) {
        const file = await dataURLtoFile(
          work.preview,
          work.fileName,
          work.fileType,
        );
        const formData = new FormData();
        formData.append("image", file);
        formData.append("description", work.description);
        await uploader(formData);
      }

      if (showFinalSubmit) {
        await submitAllWorks();
      }

      success(
        `${toPersianDigits(uploadedWorks.length)} اثر با موفقیت ارسال شد`,
      );

      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      const errorData = err.response?.data;
      const errorList = [];
      if (errorData?.errors) {
        for (const [field, msgs] of Object.entries(errorData.errors)) {
          if (msgs && msgs.length > 0) errorList.push(msgs[0]);
        }
      }
      if (errorList.length > 0) {
        showErrors(errorList);
      } else if (!err.handledByInterceptor) {
        error(getErrorMessage(err, "خطا در ارسال آثار"));
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="works-form-outer submit-works-container"
      style={{
        width: "100%",
        maxWidth: "780px",
        margin: "-5px auto",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxHeight: "430px",
        paddingTop: "18px",
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
          <span style={{ color: "#C9A84C", fontWeight: 700, fontSize: "13px" }}>
            توجه:
          </span>
          <br />
          <span style={{ color: "rgba(255,255,255,0.7)" }}>
            • هر عکاس می‌تواند حداکثر{" "}
            <span style={{ color: "#C9A84C", fontWeight: 600 }}>
              {toPersianDigits(MAX_WORKS)}
            </span>{" "}
            تک عکس ارسال کند.
          </span>
          <br />
          <span style={{ color: "rgba(255,255,255,0.7)" }}>
            • ابعاد هر فایل ارسالی حداقل ۱۰۰۰ و حداکثر ۱۵۰۰ پیکسل باشد.
          </span>
          <br />
          <span style={{ color: "rgba(255,255,255,0.7)" }}>
            • حجم هر فایل ارسالی کمتر از {MAX_FILE_SIZE_MB} مگابایت باشد.
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
          {toPersianDigits(uploadedWorks.length)}
        </span>
        <span
          style={{
            fontSize: "15px",
            color: "rgba(255,255,255,0.25)",
            fontFamily: "w_Lotus, sans-serif",
            fontWeight: 300,
          }}
        >
          / {toPersianDigits(MAX_WORKS)}
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
            className="register-input"
            placeholder="توضیح عکس"
            value={currentWork.description}
            onChange={(e) =>
              setCurrentWork({ ...currentWork, description: e.target.value })
            }
            style={{
              fontSize: "16px",
              height: "100%",
              fontWeight: 600,
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
              if (e.target.files[0]) handleFileSelect(e.target.files[0]);
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
              fontSize: "15px",
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
                maxWidth: "100px",
              }}
            >
              {currentWork.preview ? (
                <>
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
                </>
              ) : (
                <>
                  <span style={{ fontSize: "18px", color: "rgba(0,0,0,0.5)" }}>
                    انتخاب عکس
                  </span>
                </>
              )}
            </span>
            <span style={{ color: "#C9A84C", fontSize: "14px" }}></span>
          </label>
        </div>

        <motion.button
          type="button"
          onClick={addWork}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={uploadedWorks.length >= MAX_WORKS}
          style={{
            minWidth: "46px",
            height: "42px",
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
                gridTemplateColumns: "40px 1fr 50px 30px",
                gap: "8px",
                alignItems: "center",
                background: "rgba(164, 135, 77, 0.03)",
                padding: "6px 12px",
                borderRadius: "12px",
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
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#C9A84C",
                    fontFamily: "w_Lotus, sans-serif",
                  }}
                >
                  #{toPersianDigits(index + 1)}
                </span>
              </div>

              <span
                style={{
                  fontSize: "15px",
                  color: "#ffffff",
                  fontFamily: "w_Lotus, sans-serif",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontWeight: 600,
                }}
              >
                {work.description}
              </span>

              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <img
                  src={work.preview}
                  alt="عکس"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "6px",
                    objectFit: "cover",
                    border: "1px solid rgba(164,135,77,0.12)",
                  }}
                />
              </div>

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
            <span>هیچ عکسی انتخاب نشده است</span>
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
              <img
                src={previewWork.preview}
                alt="پیش‌نمایش عکس"
                className="work-preview-img"
              />
              <p className="work-preview-desc">{previewWork.description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
  .works-form-outer.submit-works-container {
    max-width: 1050px !important;
  }
  @media (min-width: 901px) {
    .page .works-form-outer.submit-works-container {
      max-width: 1050px !important;
    }
  }

  .submit-works-scroll::-webkit-scrollbar { width: 3px; }
  .submit-works-scroll::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 4px; }
  .submit-works-scroll::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #A4874D, #C9A84C); border-radius: 4px; }
  .submit-works-scroll::-webkit-scrollbar-thumb:hover { background: #C9A84C; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

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
      grid-template-columns: 34px 1fr 44px 28px !important;
      gap: 6px !important;
    }
  }

  @media (max-width: 480px) {
    .submit-works-container {
      padding-top: 0 !important;
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
    .submit-works-add-row .pill {
      height: 42px !important;
    }
    .submit-works-add-row .register-input {
      font-size: 16px !important;
    }
  }
`}</style>
    </div>
  );
}
