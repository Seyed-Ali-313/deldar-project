// src/components/register/PersonalInfoForm.jsx
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { useRef } from "react";
import FormInput from "../common/FormInput";
import NumericInput from "../common/NumericInput";
import PersianDatePicker from "../common/PersianDatePicker";
import { submitStep1 } from "../../services/onboardingService";
import { toast } from "react-toastify";

export default function PersonalInfoForm({ onSuccess }) {
  const { register, handleSubmit, control } = useForm();
  const isSubmitting = useRef(false);

  const onSubmit = async (data) => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    try {
      // ✅ آماده‌سازی داده‌ها برای ارسال
      const payload = {
        first_name: data.first_name,
        last_name: data.last_name,
        job: data.job,
        birth_date: data.birth_date, // فرمت: YYYY-MM-DD
        national_code: data.national_code, // قبلاً به انگلیسی تبدیل شده
        mobile: data.mobile, // قبلاً به انگلیسی تبدیل شده
      };

      // ✅ لاگ برای دیباگ
      console.log("📤 ارسال به سرور:", JSON.stringify(payload, null, 2));

      const response = await submitStep1(payload);

      console.log("✅ پاسخ سرور:", response.data);

      toast.success("✅ اطلاعات با موفقیت ثبت شد");

      isSubmitting.current = false;
      onSuccess(data);
    } catch (err) {
      // ✅ نمایش کامل خطا
      console.log("❌ خطای کامل:", err);
      console.log("❌ پاسخ خطا:", err.response);

      let errorMsg = "خطا در ثبت اطلاعات";

      // بررسی انواع خطاهای احتمالی
      if (err.response?.data?.detail) {
        errorMsg = err.response.data.detail;
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.response?.data?.errors) {
        // نمایش خطاهای فیلدها
        const fieldErrors = Object.entries(err.response.data.errors)
          .map(([field, msgs]) => {
            const fieldName =
              {
                first_name: "نام",
                last_name: "نام خانوادگی",
                job: "شغل",
                birth_date: "تاریخ تولد",
                national_code: "کد ملی",
                mobile: "شماره موبایل",
              }[field] || field;
            return `${fieldName}: ${msgs.join(", ")}`;
          })
          .join(" | ");
        errorMsg = fieldErrors;
      } else if (typeof err.response?.data === "string") {
        errorMsg = err.response.data;
      }

      toast.error(errorMsg, {
        position: "top-center",
        autoClose: 5000,
        style: {
          background: "#2a0a0a",
          color: "#ffffff",
          borderRadius: "16px",
          padding: "16px 24px",
          fontFamily: "w_Lotus, sans-serif",
        },
      });

      isSubmitting.current = false;
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

      <Controller
        name="birth_date"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <PersianDatePicker
            value={field.value}
            onChange={field.onChange}
            placeholder="تاریخ تولد*"
            required
          />
        )}
      />

      <NumericInput
        placeholder="کدملی*"
        required
        register={register}
        name="national_code"
        maxLength={10}
        exactLength={10}
      />

      <NumericInput
        placeholder="تلفن همراه*"
        required
        register={register}
        name="mobile"
        maxLength={11}
        exactLength={11}
      />

      <div className="submit-row" style={{ gridColumn: "1 / -1" }}>
        <motion.button
          type="submit"
          className="submit-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.15 }}
          style={{
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(164,135,77,0.3)",
          }}
        >
          ثبت اطلاعات
        </motion.button>
      </div>
    </form>
  );
}
