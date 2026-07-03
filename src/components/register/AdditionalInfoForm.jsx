// src/components/register/AdditionalInfoForm.jsx
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useRef } from "react";
import FormInput from "../common/FormInput";
import { submitStep2 } from "../../services/onboardingService";
import { toast } from "react-toastify";
import { showError } from "../../utils/errorHandler";

export default function AdditionalInfoForm({ onSuccess }) {
  const { register, handleSubmit } = useForm();
  const isSubmitting = useRef(false);

  const onSubmit = async (data) => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    try {
      await submitStep2({
        province: data.province,
        city: data.city,
        address: data.address,
        postal_code: data.postal_code,
        bale_id: data.bale_id || "",
        telegram_id: data.telegram_id || "",
      });

      toast.success("✅ اطلاعات تکمیلی با موفقیت ثبت شد", {
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
      onSuccess();
    } catch (err) {
      // ✅ نمایش خطا با errorHandler
      showError(err);
      isSubmitting.current = false;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pill-grid">
      <FormInput
        placeholder="استان محل سکونت*"
        required
        register={register}
        name="province"
      />
      <FormInput
        placeholder="شهر محل سکونت*"
        required
        register={register}
        name="city"
      />
      <FormInput
        placeholder="آدرس محل سکونت*"
        required
        register={register}
        name="address"
      />
      <FormInput
        placeholder="کدپستی*"
        required
        register={register}
        name="postal_code"
      />
      <FormInput
        placeholder="شناسه در پیام‌رسان بله"
        register={register}
        name="bale_id"
      />
      <FormInput
        placeholder="شناسه در پیام‌رسان تلگرام"
        register={register}
        name="telegram_id"
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
