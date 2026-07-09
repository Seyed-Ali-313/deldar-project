// src/pages/dashboard/SubmittedWorks.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getWorks,
  deleteWork,
  updateWork,
} from "../../services/dashboardService";
import { showError } from "../../utils/errorHandler";
import {
  success as toastSuccess,
  error as toastError,
} from "../../utils/toast";
import ConfirmModal from "../../components/common/ConfirmModal";
import SkeletonWorks from "../../components/common/SkeletonWorks";

export default function SubmittedWorks() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const [editingWork, setEditingWork] = useState(null);
  const [editDescription, setEditDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);

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

  const handleEdit = (work) => {
    setEditingWork(work);
    setEditDescription(work.description || "");
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editingWork) return;

    try {
      await updateWork(editingWork.id, { description: editDescription });

      setWorks((prev) =>
        prev.map((w) =>
          w.id === editingWork.id ? { ...w, description: editDescription } : w,
        ),
      );

      toastSuccess("توضیحات با موفقیت ویرایش شد");
      setIsEditing(false);
      setEditingWork(null);
      setEditDescription("");
    } catch (err) {
      toastError("خطا در ویرایش توضیحات");
      showError(err);
    }
  };

  const closeEditModal = () => {
    setIsEditing(false);
    setEditingWork(null);
    setEditDescription("");
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
                  gridTemplateColumns: "52px 1fr auto auto",
                  gap: "10px",
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
                  onClick={() => handleEdit(work)}
                  style={{
                    background: "rgba(201, 168, 76, 0.08)",
                    border: "1px solid rgba(201, 168, 76, 0.15)",
                    padding: "6px",
                    cursor: "pointer",
                    color: "#C9A84C",
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
                    e.currentTarget.style.background =
                      "rgba(201, 168, 76, 0.2)";
                    e.currentTarget.style.borderColor =
                      "rgba(201, 168, 76, 0.3)";
                    e.currentTarget.style.color = "#E8D5A3";
                    e.currentTarget.style.transform = "scale(1.08)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 16px rgba(201, 168, 76, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "rgba(201, 168, 76, 0.08)";
                    e.currentTarget.style.borderColor =
                      "rgba(201, 168, 76, 0.15)";
                    e.currentTarget.style.color = "#C9A84C";
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>

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

  @media (max-width: 900px) {
    .submitted-scroll {
      max-height: 320px !important;
    }
    .submitted-scroll > div {
      grid-template-columns: 46px 1fr 30px 30px !important;
      gap: 9px !important;
      padding: 7px 12px 7px 7px !important;
    }
  }

  @media (max-width: 500px) {
    .submitted-scroll > div {
      grid-template-columns: 40px 1fr 28px 28px !important;
      gap: 8px !important;
      padding: 6px 10px 6px 6px !important;
    }
    .submitted-scroll > div > div:first-child {
      width: 36px !important;
      height: 36px !important;
    }
    .submitted-scroll > div > div:nth-child(2) span:first-child {
      font-size: 12px !important;
    }
    .submitted-scroll > div button {
      width: 26px !important;
      height: 26px !important;
      font-size: 12px !important;
    }
  }

  @media (max-width: 420px) {
    .edit-modal-card {
      padding: 28px 18px 22px !important;
    }
    .edit-modal-actions {
      flex-direction: column-reverse !important;
      gap: 10px !important;
    }
    .edit-modal-actions button {
      flex: 1 1 auto !important;
      width: 100% !important;
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

      <AnimatePresence>
        {isEditing && editingWork && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(12px)",
              padding: "20px",
            }}
            onClick={closeEditModal}
          >
            <motion.div
              className="edit-modal-card"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                maxWidth: "520px",
                width: "100%",
                background: "linear-gradient(145deg, #0f241a, #0a1a12)",
                borderRadius: "24px",
                padding: "36px 32px 28px",
                border: "1px solid rgba(201,168,76,0.12)",
                boxShadow:
                  "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.05)",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeEditModal}
                style={{
                  position: "absolute",
                  top: "14px",
                  left: "18px",
                  background: "rgba(255,255,255,0.04)",
                  border: "none",
                  color: "rgba(255,255,255,0.3)",
                  fontSize: "18px",
                  cursor: "pointer",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.3)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                }}
              >
                ✕
              </button>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))",
                  border: "1.5px solid rgba(201,168,76,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                  boxShadow: "0 0 40px rgba(201,168,76,0.06)",
                }}
              >
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C9A84C"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </motion.div>

              <h3
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#ffffff",
                  fontFamily: "w_Nian, sans-serif",
                  marginBottom: "4px",
                  letterSpacing: "0.3px",
                }}
              >
                ويرايش توضيحات
              </h3>

              <p
                style={{
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.35)",
                  fontFamily: "w_Lotus, sans-serif",
                  marginBottom: "20px",
                  lineHeight: "1.6",
                }}
              >
                توضيحات جديد را براي اين اثر وارد کنيد
              </p>

              {/* ✅ بخش با بک‌گراند طلایی */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  background: "rgba(201, 168, 76, 0.08)",
                  padding: "12px 16px",
                  borderRadius: "14px",
                  border: "1px solid rgba(201, 168, 76, 0.1)",
                  marginBottom: "20px",
                  textAlign: "right",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    flexShrink: 0,
                    background: "rgba(201, 168, 76, 0.06)",
                    border: "1px solid rgba(201, 168, 76, 0.08)",
                  }}
                >
                  <img
                    src={editingWork.image || "/src/assets/images/logo-bg.png"}
                    alt=""
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
                    flex: 1,
                    textAlign: "right",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "rgba(201, 168, 76, 0.4)",
                      fontFamily: "w_Lotus, sans-serif",
                    }}
                  >
                    توضيحات فعلي
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#C9A84C",
                      fontFamily: "w_Lotus, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {editingWork.description || "بدون شرح"}
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.06)",
                  padding: "4px",
                  marginBottom: "16px",
                  transition: "border-color 0.25s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                }}
              >
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="توضيحات جديد را وارد کنيد..."
                  autoFocus
                  maxLength={200}
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#ffffff",
                    fontSize: "15px",
                    fontFamily: "w_Lotus, sans-serif",
                    borderRadius: "12px",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: "22px",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color:
                      editDescription.length > 180
                        ? editDescription.length > 190
                          ? "#e05555"
                          : "#C9A84C"
                        : "rgba(255,255,255,0.2)",
                    fontFamily: "w_Lotus, sans-serif",
                    transition: "color 0.2s ease",
                    direction: "ltr",
                  }}
                >
                  {editDescription.length} / 200
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "center",
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={closeEditModal}
                  style={{
                    flex: 1,
                    minHeight: "48px",
                    background: "rgba(255,255,255,0.04)",
                    color: "rgba(255,255,255,0.5)",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.06)",
                    fontSize: "15px",
                    fontWeight: 600,
                    fontFamily: "w_Lotus, sans-serif",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                  }}
                >
                  انصراف
                </motion.button>

                <motion.button
                  className="edit-modal-actions"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleSaveEdit}
                  style={{
                    flex: 1.5,
                    minHeight: "48px",
                    background: "linear-gradient(135deg, #A4874D, #C9A84C)",
                    color: "#ffffff",
                    borderRadius: "14px",
                    border: "none",
                    fontSize: "15px",
                    fontWeight: 700,
                    fontFamily: "w_Lotus, sans-serif",
                    cursor: "pointer",
                    boxShadow: "0 4px 24px rgba(164,135,77,0.25)",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 8px 32px rgba(164,135,77,0.4)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 24px rgba(164,135,77,0.25)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  ذخيره تغييرات
                </motion.button>
              </div>

              <div
                style={{
                  marginTop: "20px",
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(201,168,76,0.08), transparent)",
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
