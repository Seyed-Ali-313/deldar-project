// src/components/register/AdditionalInfoForm.jsx
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useRef } from "react";
import FormInput from "../common/FormInput";
import { submitStep2 } from "../../services/onboardingService"; // ✅ فعال شد
import { toast } from "react-toastify";

export default function AdditionalInfoForm({ onSuccess }) {
  const { register, handleSubmit } = useForm();
  const isSubmitting = useRef(false);

  const onSubmit = async (data) => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    try {
      // ✅ ارسال به API واقعی
      await submitStep2({
        province: data.province,
        city: data.city,
        address: data.address,
        postal_code: data.postal_code,
        bale_id: data.bale_id || "",
        telegram_id: data.telegram_id || "",
      });

      toast.success(
        <div style={{ textAlign: "right", fontFamily: "w_Lotus, sans-serif" }}>
          <div
            style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}
          >
            ✅ اطلاعات تکمیلی ثبت شد
          </div>
          <div style={{ fontSize: "13px", opacity: 0.8 }}>
            در حال انتقال به مرحله ارسال آثار...
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: 2000,
          style: {
            background: "linear-gradient(135deg, #034120, #0a5a2e)",
            color: "#ffffff",
            borderRadius: "16px",
            padding: "16px 24px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
            border: "1px solid rgba(164,135,77,0.3)",
            fontFamily: "w_Lotus, sans-serif",
          },
          progressStyle: {
            background: "linear-gradient(90deg, #A4874D, #C9A84C)",
            height: "3px",
          },
        },
      );

      isSubmitting.current = false;
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.detail || "خطا در ثبت اطلاعات";
      toast.error(msg);
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
