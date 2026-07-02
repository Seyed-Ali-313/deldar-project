// src/pages/dashboard/SubmitWorks.jsx — نسخه اصلاح‌شده
import WorksForm from "../../components/register/WorksForm";
import { addWork } from "../../services/dashboardService";
import { toast } from "react-toastify";

export default function SubmitWorks() {
  const handleSuccess = () => {
    toast.success("آثار جدید با موفقیت اضافه شد");
  };

  return (
    <WorksForm
      uploadFn={addWork}
      onSuccess={handleSuccess}
      showFinalSubmit={false}
    />
  );
}
