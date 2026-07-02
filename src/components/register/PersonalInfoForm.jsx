// src/components/register/PersonalInfoForm.jsx
import { useForm } from "react-hook-form";
import FormInput from "../common/FormInput";
import { submitStep1 } from "../../services/onboardingService";
import { toast } from "react-toastify";

export default function PersonalInfoForm({ onSuccess }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      await submitStep1({
        first_name: data.first_name,
        last_name: data.last_name,
        job: data.job,
        birth_date: data.birth_date,
        national_code: data.national_code,
        mobile: data.mobile,
      });
      toast.success("اطلاعات با موفقیت ثبت شد");
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.detail || "خطا در ثبت اطلاعات";
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pill-grid">
      <FormInput
        placeholder="نام*"
        required
        register={register}
        name="first_name"
      />
      <FormInput
        placeholder="نام خانوادگی*"
        required
        register={register}
        name="last_name"
      />
      <FormInput placeholder="شغل*" required register={register} name="job" />
      <FormInput
        placeholder="تاریخ تولد*"
        required
        register={register}
        name="birth_date"
      />
      <FormInput
        placeholder="کدملی*"
        required
        register={register}
        name="national_code"
      />
      <FormInput
        placeholder="تلفن همراه*"
        required
        register={register}
        name="mobile"
      />
      <div className="submit-row" style={{ gridColumn: "1 / -1" }}>
        <button type="submit" className="submit-btn">
          ثبت اطلاعات
        </button>
      </div>
    </form>
  );
}
