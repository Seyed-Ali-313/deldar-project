// src/components/register/WorksForm.jsx
import { useState } from "react";
import {
  deleteWork as deleteOnboardingWork,
  submitAllWorks,
} from "../../services/onboardingService";
import { toast } from "react-toastify";

const MAX_WORKS = 50;

export default function WorksForm({
  onSuccess,
  uploadFn,
  deleteFn,
  showFinalSubmit = true,
}) {
  const [works, setWorks] = useState([
    { id: null, file: null, description: "" },
  ]);
  const [uploading, setUploading] = useState(false);

  const addRow = () => {
    if (works.length >= MAX_WORKS) {
      toast.warn("حداکثر ۵۰ اثر مجاز است");
      return;
    }
    setWorks([...works, { id: null, file: null, description: "" }]);
  };

  const updateRow = (index, field, value) => {
    const updated = [...works];
    updated[index][field] = value;
    setWorks(updated);
  };

  const removeRow = async (index) => {
    const work = works[index];
    const remover = deleteFn || deleteOnboardingWork;
    if (work.id) {
      try {
        await remover(work.id);
      } catch {
        toast.error("خطا در حذف عکس");
        return;
      }
    }
    setWorks(works.filter((_, i) => i !== index));
  };

  const handleSubmitAll = async () => {
    setUploading(true);
    const uploader = uploadFn;
    try {
      for (const work of works) {
        if (work.file && !work.id) {
          const formData = new FormData();
          formData.append("image", work.file);
          formData.append("description", work.description);
          await uploader(formData);
        }
      }
      if (showFinalSubmit) {
        await submitAllWorks();
      }
      toast.success("آثار با موفقیت ارسال شد");
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.detail || "خطا در ارسال آثار";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="pill-grid">
        {works.map((work, index) => (
          <div key={index} style={{ display: "contents" }}>
            <div className="pill">
              <input
                type="text"
                className="register-input"
                placeholder={`شرح عکس ${index + 1}*`}
                value={work.description}
                onChange={(e) =>
                  updateRow(index, "description", e.target.value)
                }
              />
              <span className="req">*</span>
            </div>
            <div className="pill" style={{ position: "relative" }}>
              <input
                type="file"
                accept="image/jpeg"
                id={`file-${index}`}
                style={{ display: "none" }}
                onChange={(e) => updateRow(index, "file", e.target.files[0])}
              />
              <label
                htmlFor={`file-${index}`}
                className="register-input"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {work.file ? work.file.name : `عکس ${index + 1}*`}
              </label>
              {works.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  style={{
                    position: "absolute",
                    left: 10,
                    background: "none",
                    color: "#B00101",
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="submit-row" style={{ gap: "12px" }}>
        <button type="button" className="btn btn-secondary" onClick={addRow}>
          افزودن عکس جدید
        </button>
        <button
          type="button"
          className="submit-btn"
          onClick={handleSubmitAll}
          disabled={uploading}
        >
          {uploading ? "در حال ارسال..." : "ارسال مجموع آثار"}
        </button>
      </div>
    </div>
  );
}
