// src/pages/dashboard/SubmittedWorks.jsx
import { useEffect, useState } from "react";
import {
  getWorks,
  updateWork,
  deleteWork,
} from "../../services/dashboardService";
import { toast } from "react-toastify";

export default function SubmittedWorks() {
  const [works, setWorks] = useState([]);

  useEffect(() => {
    getWorks().then((res) => setWorks(res.data));
  }, []);

  const handleDescriptionChange = (id, value) => {
    setWorks((prev) =>
      prev.map((w) => (w.id === id ? { ...w, description: value } : w)),
    );
  };

  const handleSave = async (work) => {
    try {
      await updateWork(work.id, { description: work.description });
      toast.success("کپشن بروزرسانی شد");
    } catch {
      toast.error("خطا در بروزرسانی");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteWork(id);
      setWorks((prev) => prev.filter((w) => w.id !== id));
      toast.success("اثر حذف شد");
    } catch {
      toast.error("خطا در حذف");
    }
  };

  return (
    <div className="pill-grid">
      {works.map((work) => (
        <div key={work.id} style={{ display: "contents" }}>
          <div className="pill">
            <input
              className="register-input"
              value={work.description}
              onChange={(e) => handleDescriptionChange(work.id, e.target.value)}
              onBlur={() => handleSave(work)}
            />
          </div>
          <div className="pill" style={{ position: "relative" }}>
            <span
              className="register-input"
              style={{ display: "flex", alignItems: "center" }}
            >
              {work.image_name || "عکس"}
            </span>
            <button
              type="button"
              onClick={() => handleDelete(work.id)}
              style={{
                position: "absolute",
                left: 10,
                background: "none",
                color: "#B00101",
              }}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
