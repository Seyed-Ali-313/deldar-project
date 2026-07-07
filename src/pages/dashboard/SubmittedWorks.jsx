// src/pages/dashboard/SubmittedWorks.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getWorks, deleteWork } from "../../services/dashboardService";
import { showError } from "../../utils/errorHandler";
import { success as toastSuccess } from "../../utils/toast";
import ConfirmModal from "../../components/common/ConfirmModal";
import SkeletonWorks from "../../components/common/SkeletonWorks";

export default function SubmittedWorks() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    getWorks()
      .then((res) => {
        setWorks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        showError(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteWork(deleteTargetId);
      setWorks((prev) => prev.filter((w) => w.id !== deleteTargetId));
      toastSuccess("اثر با موفقیت حذف شد");
      setShowDeleteModal(false);
      setDeleteTargetId(null);
    } catch (err) {
      showError(err);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return <SkeletonWorks count={5} />;
  }

  if (works.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "160px",
          color: "rgba(255,255,255,0.2)",
          fontFamily: "w_Lotus, sans-serif",
          gap: "4px",
        }}
      >
        <span style={{ fontSize: "13px", fontWeight: 500 }}>
          هیچ اثری ارسال نشده است
        </span>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          width: "100%",
          maxWidth: "680px",
          margin: "0 auto",
          marginTop: "-25px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
            padding: "10px 16px",
            background: "rgba(201, 168, 76, 0.05)",
            borderRadius: "14px",
            border: "1px solid rgba(201, 168, 76, 0.08)",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.8)",
              fontFamily: "w_Lotus, sans-serif",
              letterSpacing: "0.5px",
            }}
          >
            آثار ارسال شده
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.35)",
                fontFamily: "w_Lotus, sans-serif",
                fontWeight: 500,
              }}
            >
              تعداد
            </span>
            <span
              style={{
                fontSize: "28px",
                fontWeight: 800,
                color: "#C9A84C",
                fontFamily: "w_Lotus, sans-serif",
                lineHeight: 1,
                minWidth: "36px",
                textAlign: "center",
                background: "rgba(201, 168, 76, 0.1)",
                padding: "2px 14px",
                borderRadius: "10px",
                border: "1px solid rgba(201, 168, 76, 0.1)",
              }}
            >
              {works.length}
            </span>
          </div>
        </div>

        <div
          style={{
            maxHeight: "280px",
            overflowY: "auto",
            paddingRight: "4px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
          className="submitted-scroll"
        >
          <AnimatePresence>
            {works.map((work, index) => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "52px 1fr 36px",
                  gap: "14px",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.02)",
                  padding: "8px 14px 8px 8px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.04)",
                  transition: "all 0.25s ease",
                }}
                whileHover={{
                  borderColor: "rgba(164, 135, 77, 0.15)",
                  background: "rgba(255,255,255,0.035)",
                  y: -1,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={work.image || "/src/assets/images/logo-bg.png"}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width="44"
                    height="44"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.src = "/src/assets/images/logo-bg.png";
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.85)",
                      fontFamily: "w_Lotus, sans-serif",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {work.description || "بدون شرح"}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      color: "rgba(255,255,255,0.2)",
                      fontFamily: "w_Lotus, sans-serif",
                    }}
                  >
                    شناسه: {String(work.id).padStart(3, "0")}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(work.id)}
                  style={{
                    background: "rgba(176, 1, 1, 0.06)",
                    border: "1px solid rgba(176, 1, 1, 0.1)",
                    padding: "6px",
                    cursor: "pointer",
                    color: "#B00101",
                    fontSize: "14px",
                    borderRadius: "8px",
                    transition: "all 0.25s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1,
                    width: "30px",
                    height: "30px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(176, 1, 1, 0.15)";
                    e.currentTarget.style.borderColor = "rgba(176, 1, 1, 0.3)";
                    e.currentTarget.style.color = "#ff3333";
                    e.currentTarget.style.transform = "scale(1.08)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 16px rgba(176, 1, 1, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(176, 1, 1, 0.06)";
                    e.currentTarget.style.borderColor = "rgba(176, 1, 1, 0.1)";
                    e.currentTarget.style.color = "#B00101";
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6L6 18M6 6L18 18" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <style>{`
          .submitted-scroll::-webkit-scrollbar {
            width: 4px;
          }
          .submitted-scroll::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.015);
            border-radius: 6px;
          }
          .submitted-scroll::-webkit-scrollbar-thumb {
            background: rgba(201, 168, 76, 0.3);
            border-radius: 6px;
          }
          .submitted-scroll::-webkit-scrollbar-thumb:hover {
            background: rgba(201, 168, 76, 0.5);
          }

          @media (max-width: 500px) {
            .submitted-scroll > div {
              grid-template-columns: 40px 1fr 30px !important;
              gap: 10px !important;
              padding: 6px 10px 6px 6px !important;
            }
            .submitted-scroll > div > div:first-child {
              width: 36px !important;
              height: 36px !important;
            }
            .submitted-scroll > div > div:nth-child(2) span:first-child {
              font-size: 12px !important;
            }
          }
        `}</style>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteTargetId(null);
        }}
        onConfirm={confirmDelete}
        title="حذف اثر"
        message="آیا از حذف این اثر مطمئن هستید؟ این عمل قابل بازگشت نیست."
        confirmText="حذف"
        cancelText="انصراف"
      />
    </>
  );
}
