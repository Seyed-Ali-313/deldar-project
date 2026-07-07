import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import FormInput from "../common/FormInput";
import NumericInput from "../common/NumericInput";
import PersianDatePicker from "../common/PersianDatePicker";
import { submitStep1 } from "../../services/onboardingService";
import { success, error, showErrors } from "../../utils/toast";
import {
  validateMobile,
  validateNationalCode,
  validateBirthDate,
  validateRequired,
  getErrorMessage,
} from "../../utils/validators";
import useRegisterData from "../../hooks/useRegisterData";

export default function PersonalInfoForm({ onSuccess }) {
  const { data, updatePersonal } = useRegisterData();

  const {
    register,
    handleSubmit,
    control,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting: formSubmitting },
  } = useForm({
    defaultValues: data.personal,
    mode: "onBlur",
  });

  const isSubmitting = useRef(false);
  const [serverErrors, setServerErrors] = useState({});
  const saveTimeout = useRef(null);
  const watchedValues = watch();

  // ✅ همگام‌سازی خودکار با sessionStorage حین تایپ (حتی بدون submit کردن)
  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      updatePersonal(watchedValues);
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

  const onSubmit = async (formData) => {
    if (isSubmitting.current || formSubmitting) return;

    const validationErrors = {};
    if (!formData.first_name?.trim())
      validationErrors.first_name = "نام الزامی است";
    if (!formData.last_name?.trim())
      validationErrors.last_name = "نام خانوادگی الزامی است";
    if (!formData.job?.trim()) validationErrors.job = "شغل الزامی است";
    if (!formData.birth_date)
      validationErrors.birth_date = "تاریخ تولد الزامی است";

    const nationalCodeClean = formData.national_code?.replace(/[^0-9]/g, "");
    if (!nationalCodeClean) {
      validationErrors.national_code = "کد ملی الزامی است";
    } else if (nationalCodeClean.length !== 10) {
      validationErrors.national_code = "کد ملی باید ۱۰ رقم باشد";
    }

    const mobileClean = formData.mobile?.replace(/[^0-9]/g, "");
    if (!mobileClean) {
      validationErrors.mobile = "شماره موبایل الزامی است";
    } else if (!/^09\d{9}$/.test(mobileClean)) {
      validationErrors.mobile = "شماره موبایل باید با ۰۹ شروع و ۱۱ رقم باشد";
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
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        job: formData.job.trim(),
        birth_date: formData.birth_date,
        national_code: nationalCodeClean,
        mobile: mobileClean,
      };

      await submitStep1(payload);
      success("اطلاعات شخصی شما ثبت شد");

      updatePersonal(payload);

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

  const getFieldError = (fieldName) =>
    errors[fieldName]?.message || serverErrors[fieldName] || null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pill-grid">
      <FormInput
        placeholder="نام"
        required
        register={register}
        name="first_name"
        error={getFieldError("first_name")}
        validate={(v) => validateRequired(v, "نام")}
      />
      <FormInput
        placeholder="نام خانوادگی"
        required
        register={register}
        name="last_name"
        error={getFieldError("last_name")}
        validate={(v) => validateRequired(v, "نام خانوادگی")}
      />
      <FormInput
        placeholder="شغل"
        required
        register={register}
        name="job"
        error={getFieldError("job")}
        validate={(v) => validateRequired(v, "شغل")}
      />

      <Controller
        name="birth_date"
        control={control}
        rules={{
          required: "تاریخ تولد الزامی است",
          validate: validateBirthDate,
        }}
        render={({ field, fieldState }) => (
          <PersianDatePicker
            value={field.value}
            onChange={field.onChange}
            placeholder="تاریخ تولد"
            required
            error={getFieldError("birth_date") || fieldState.error?.message}
          />
        )}
      />

      <NumericInput
        placeholder="کد ملی   (۱۰ رقم)"
        required
        register={register}
        name="national_code"
        exactLength={10}
        maxLength={10}
        error={getFieldError("national_code")}
        validate={validateNationalCode}
      />
      <NumericInput
        placeholder="شماره موبایل :   09123456789"
        required
        register={register}
        name="mobile"
        exactLength={11}
        maxLength={11}
        error={getFieldError("mobile")}
        validate={validateMobile}
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
