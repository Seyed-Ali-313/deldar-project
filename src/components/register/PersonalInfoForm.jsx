// src/components/register/PersonalInfoForm.jsx
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
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
  fieldNameMap,
  getErrorMessage,
} from "../../utils/validators";

export default function PersonalInfoForm({ onSuccess }) {
  const {
    register,
    handleSubmit,
    control,
    setError,
    clearErrors,
    formState: { errors, isSubmitting: formSubmitting },
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      job: "",
      birth_date: "",
      national_code: "",
      mobile: "",
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
          const mappedField = fieldNameMap[field] || field;
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

  const onSubmit = async (data) => {
    if (isSubmitting.current || formSubmitting) return;

    // ✅ اعتبارسنجی دستی قبل از ارسال
    const validationErrors = {};

    if (!data.first_name?.trim())
      validationErrors.first_name = "نام الزامی است";
    if (!data.last_name?.trim())
      validationErrors.last_name = "نام خانوادگی الزامی است";
    if (!data.job?.trim()) validationErrors.job = "شغل الزامی است";
    if (!data.birth_date) validationErrors.birth_date = "تاریخ تولد الزامی است";

    // اعتبارسنجی کد ملی
    const nationalCodeClean = data.national_code?.replace(/[^0-9]/g, "");
    if (!nationalCodeClean) {
      validationErrors.national_code = "کد ملی الزامی است";
    } else if (nationalCodeClean.length !== 10) {
      validationErrors.national_code = "کد ملی باید ۱۰ رقم باشد";
    }

    // اعتبارسنجی شماره موبایل
    const mobileClean = data.mobile?.replace(/[^0-9]/g, "");
    if (!mobileClean) {
      validationErrors.mobile = "شماره موبایل الزامی است";
    } else if (!/^09\d{9}$/.test(mobileClean)) {
      validationErrors.mobile = "شماره موبایل باید با ۰۹ شروع و ۱۱ رقم باشد";
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
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        job: data.job.trim(),
        birth_date: data.birth_date,
        national_code: data.national_code.replace(/[^0-9]/g, ""),
        mobile: data.mobile.replace(/[^0-9]/g, ""),
      };

      console.log("📤 ارسال به سرور:", payload);

      const response = await submitStep1(payload);
      console.log("✅ پاسخ سرور:", response.data);

      success("اطلاعات با موفقیت ثبت شد");

      isSubmitting.current = false;
      onSuccess(data);
    } catch (err) {
      console.log("❌ خطا:", err.response?.data);

      if (err.response?.data?.errors) {
        handleServerErrors(err.response.data);
      } else {
        const msg = getErrorMessage(err, "خطا در ثبت اطلاعات");
        error(msg);
      }

      isSubmitting.current = false;
    }
  };

  const getFieldError = (fieldName) => {
    return errors[fieldName]?.message || serverErrors[fieldName] || null;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pill-grid">
      <FormInput
        placeholder="نام*"
        required
        register={register}
        name="first_name"
        error={getFieldError("first_name")}
        validate={(value) => validateRequired(value, "نام")}
      />

      <FormInput
        placeholder="نام خانوادگی*"
        required
        register={register}
        name="last_name"
        error={getFieldError("last_name")}
        validate={(value) => validateRequired(value, "نام خانوادگی")}
      />

      <FormInput
        placeholder="شغل*"
        required
        register={register}
        name="job"
        error={getFieldError("job")}
        validate={(value) => validateRequired(value, "شغل")}
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
            placeholder="تاریخ تولد* (مثال: 1370-01-15)"
            required
            error={getFieldError("birth_date") || fieldState.error?.message}
          />
        )}
      />

      <NumericInput
        placeholder="کد ملی* (۱۰ رقم)"
        required
        register={register}
        name="national_code"
        exactLength={10}
        maxLength={10}
        error={getFieldError("national_code")}
        validate={validateNationalCode}
      />

      <NumericInput
        placeholder="شماره موبایل* (مثال: 09123456789)"
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
