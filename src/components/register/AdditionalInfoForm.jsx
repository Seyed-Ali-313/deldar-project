import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import FormInput from "../common/FormInput";
import NumericInput from "../common/NumericInput";
import { submitStep2 } from "../../services/onboardingService";
import { success, error, showErrors } from "../../utils/toast";
import { getServerMessage } from "../../utils/errorHandler";
import {
  validateRequired,
  validatePostalCode,
  getErrorMessage,
} from "../../utils/validators";
import useRegisterData from "../../hooks/useRegisterData";

export default function AdditionalInfoForm({ onSuccess }) {
  const { data, updateAdditional } = useRegisterData();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting: formSubmitting },
  } = useForm({
    defaultValues: data.additional,
    mode: "onBlur",
  });

  const isSubmitting = useRef(false);
  const [serverErrors, setServerErrors] = useState({});
  const saveTimeout = useRef(null);
  const watchedValues = watch();

  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      updateAdditional(watchedValues);
    }, 400);
    return () => clearTimeout(saveTimeout.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(watchedValues)]);

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
    if (errorMessages.length > 0) showErrors(errorMessages);
  };

  const getFieldError = (fieldName) =>
    errors[fieldName]?.message || serverErrors[fieldName] || null;

  const onInvalid = (formErrors) => {
    const msgs = [];
    for (const [, err] of Object.entries(formErrors)) {
      if (err?.message) msgs.push(err.message);
    }
    if (msgs.length > 0) showErrors(msgs);
  };

  const onSubmit = async (formData) => {
    if (isSubmitting.current || formSubmitting) return;

    const validationErrors = {};
    if (!formData.province?.trim())
      validationErrors.province = "استان الزامی است";
    if (!formData.city?.trim()) validationErrors.city = "شهر الزامی است";
    if (!formData.address?.trim()) validationErrors.address = "آدرس الزامی است";

    const postalClean = formData.postal_code?.replace(/[^0-9]/g, "");
    if (!postalClean) {
      validationErrors.postal_code = "کدپستی الزامی است";
    } else if (postalClean.length !== 10) {
      validationErrors.postal_code = "کدپستی باید ۱۰ رقم باشد";
    }

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
        province: formData.province.trim(),
        city: formData.city.trim(),
        address: formData.address.trim(),
        postal_code: postalClean,
        bale_id: formData.bale_id?.trim() || "",
        telegram_id: formData.telegram_id?.trim() || "",
      };

      const res = await submitStep2(payload);
      success(getServerMessage(res, "اطلاعات تکمیلی شما ثبت شد"));

      updateAdditional(payload);

      isSubmitting.current = false;
      onSuccess();
    } catch (err) {
      if (err.response?.data?.errors) {
        handleServerErrors(err.response.data);
      } else if (!err.handledByInterceptor) {
        // ✅ اگه اینترسپتور axios قبلاً پیام این خطا رو نشون داده،
        // دوباره پیام جدید نمی‌فرستیم تا پیام قبلی پاک نشه
        error(getErrorMessage(err, "خطا در ثبت اطلاعات"));
      }
      isSubmitting.current = false;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="pill-grid">
      <FormInput
        placeholder="استان محل سکونت*"
        required
        register={register}
        name="province"
        error={getFieldError("province")}
        validate={(v) => validateRequired(v, "استان")}
      />
      <FormInput
        placeholder="شهر محل سکونت"
        required
        register={register}
        name="city"
        error={getFieldError("city")}
        validate={(v) => validateRequired(v, "شهر")}
      />
      <FormInput
        placeholder="آدرس محل سکونت"
        required
        register={register}
        name="address"
        error={getFieldError("address")}
        validate={(v) => validateRequired(v, "آدرس")}
      />

      {/* ✅ اصلاح شد: قبلاً FormInput بود، الان NumericInput (فقط عدد، حداکثر ۱۰ رقم، کیبورد عددی) */}
      <NumericInput
        placeholder="کدپستی   (۱۰ رقم)"
        required
        register={register}
        name="postal_code"
        exactLength={10}
        maxLength={10}
        error={getFieldError("postal_code")}
        validate={validatePostalCode}
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
