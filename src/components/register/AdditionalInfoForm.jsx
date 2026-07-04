// src/components/register/AdditionalInfoForm.jsx
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import FormInput from "../common/FormInput";
import { submitStep2 } from "../../services/onboardingService";
import { success, error, showErrors } from "../../utils/toast";
import {
  validateRequired,
  validatePostalCode,
  getErrorMessage,
} from "../../utils/validators";

export default function AdditionalInfoForm({ onSuccess }) {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting: formSubmitting },
  } = useForm({
    defaultValues: {
      province: "",
      city: "",
      address: "",
      postal_code: "",
      bale_id: "",
      telegram_id: "",
    },
    mode: "onBlur", // ✅ اعتبارسنجی در هنگام خروج از فیلد
  });

  const isSubmitting = useRef(false);
  const [serverErrors, setServerErrors] = useState({});

  const handleServerErrors = (errorData) => {
    const newErrors = {};
    const errorMessages = [];

    if (errorData?.errors) {
      for (const [field, messages] of Object.entries(errorData.errors)) {
        if (messages && messages.length > 0) {
          const msg = messages[0];
          newErrors[field] = msg;
          errorMessages.push(msg);
          setError(field, { type: "server", message: msg });
        }
      }
    }

    setServerErrors(newErrors);

    if (errorMessages.length > 0) {
      showErrors(errorMessages);
    }
  };

  const getFieldError = (fieldName) => {
    return errors[fieldName]?.message || serverErrors[fieldName] || null;
  };

  const onSubmit = async (data) => {
    if (isSubmitting.current || formSubmitting) return;

    // ✅ اعتبارسنجی دستی قبل از ارسال
    const validationErrors = {};

    if (!data.province?.trim()) validationErrors.province = "استان الزامی است";
    if (!data.city?.trim()) validationErrors.city = "شهر الزامی است";
    if (!data.address?.trim()) validationErrors.address = "آدرس الزامی است";

    // اعتبارسنجی کدپستی
    const postalClean = data.postal_code?.replace(/[^0-9]/g, "");
    if (!postalClean) {
      validationErrors.postal_code = "کدپستی الزامی است";
    } else if (postalClean.length !== 10) {
      validationErrors.postal_code = "کدپستی باید ۱۰ رقم باشد";
    }

    // اگر خطایی وجود داشت، نمایش بده و برگرد
    if (Object.keys(validationErrors).length > 0) {
      for (const [field, msg] of Object.entries(validationErrors)) {
        setError(field, { type: "manual", message: msg });
      }
      showErrors(Object.values(validationErrors));
      return;
    }

    isSubmitting.current = true;
    setServerErrors({});
    clearErrors();

    try {
      const payload = {
        province: data.province.trim(),
        city: data.city.trim(),
        address: data.address.trim(),
        postal_code: data.postal_code.replace(/[^0-9]/g, ""),
        bale_id: data.bale_id?.trim() || "",
        telegram_id: data.telegram_id?.trim() || "",
      };

      console.log("📤 ارسال به سرور (step-2):", payload);

      const response = await submitStep2(payload);
      console.log("✅ پاسخ سرور:", response.data);

      success("اطلاعات تکمیلی با موفقیت ثبت شد");

      isSubmitting.current = false;
      onSuccess();
    } catch (err) {
      console.log("❌ خطای کامل:", err);
      console.log("❌ پاسخ خطا:", err.response?.data);

      if (err.response?.data?.errors) {
        handleServerErrors(err.response.data);
      } else {
        const msg = getErrorMessage(err, "خطا در ثبت اطلاعات");
        error(msg);
      }

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
        error={getFieldError("province")}
        validate={(value) => validateRequired(value, "استان")}
      />

      <FormInput
        placeholder="شهر محل سکونت*"
        required
        register={register}
        name="city"
        error={getFieldError("city")}
        validate={(value) => validateRequired(value, "شهر")}
      />

      <FormInput
        placeholder="آدرس محل سکونت*"
        required
        register={register}
        name="address"
        error={getFieldError("address")}
        validate={(value) => validateRequired(value, "آدرس")}
      />

      <FormInput
        placeholder="کدپستی* (۱۰ رقم)"
        required
        register={register}
        name="postal_code"
        error={getFieldError("postal_code")}
        validate={(value) => validatePostalCode(value)}
      />

      <FormInput
        placeholder="شناسه در پیام‌رسان بله (اختیاری)"
        register={register}
        name="bale_id"
        error={getFieldError("bale_id")}
      />

      <FormInput
        placeholder="شناسه در پیام‌رسان تلگرام (اختیاری)"
        register={register}
        name="telegram_id"
        error={getFieldError("telegram_id")}
      />

      <div className="submit-row" style={{ gridColumn: "1 / -1" }}>
        <motion.button
          type="submit"
          className="submit-btn"
          disabled={isSubmitting.current || formSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.15 }}
          style={{
            cursor:
              isSubmitting.current || formSubmitting
                ? "not-allowed"
                : "pointer",
            opacity: isSubmitting.current || formSubmitting ? 0.6 : 1,
            boxShadow: "0 4px 16px rgba(164,135,77,0.3)",
          }}
        >
          {isSubmitting.current || formSubmitting
            ? "در حال ثبت..."
            : "ثبت اطلاعات"}
        </motion.button>
      </div>
    </form>
  );
}
