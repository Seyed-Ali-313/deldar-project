// src/components/register/PersonalInfoForm.jsx
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { useRef } from "react";
import FormInput from "../common/FormInput";
import NumericInput from "../common/NumericInput";
import PersianDatePicker from "../common/PersianDatePicker";
import { submitStep1 } from "../../services/onboardingService";
import { toast } from "react-toastify";
import { showError } from "../../utils/errorHandler";

export default function PersonalInfoForm({ onSuccess }) {
  const { register, handleSubmit, control } = useForm();
  const isSubmitting = useRef(false);

  const onSubmit = async (data) => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    try {
      const payload = {
        first_name: data.first_name,
        last_name: data.last_name,
        job: data.job,
        birth_date: data.birth_date,
        national_code: data.national_code,
        mobile: data.mobile,
      };

      await submitStep1(payload);

      toast.success("✅ اطلاعات با موفقیت ثبت شد", {
        position: "top-center",
        autoClose: 2000,
        style: {
          background: "linear-gradient(135deg, #034120, #0a5a2e)",
          color: "#ffffff",
          borderRadius: "16px",
          padding: "16px 24px",
          fontFamily: "w_Lotus, sans-serif",
        },
        progressStyle: {
          background: "linear-gradient(90deg, #A4874D, #C9A84C)",
          height: "3px",
        },
      });

      isSubmitting.current = false;
      onSuccess(data);
    } catch (err) {
      // ✅ نمایش خطا با errorHandler
      showError(err);
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
