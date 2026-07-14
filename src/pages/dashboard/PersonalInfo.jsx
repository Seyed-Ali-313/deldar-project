// src/pages/dashboard/PersonalInfo.jsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import FormInput from "../../components/common/FormInput";
import NumericInput from "../../components/common/NumericInput";
import SkeletonForm from "../../components/common/SkeletonForm";
import {
  getProfile,
  updateProfile,
  requestMobileChange,
  verifyMobileChange,
} from "../../services/dashboardService";
import { success, error, info, showErrors } from "../../utils/toast";
import { showError } from "../../utils/errorHandler";
import { useAuth } from "../../hooks/useAuth";

export default function PersonalInfo() {
  const { register, handleSubmit, reset, watch } = useForm();
  const [originalMobile, setOriginalMobile] = useState("");
  const [mobileVerified, setMobileVerified] = useState(true);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(true);
  const currentMobile = watch("mobile");
  const { user, refetchUser } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    getProfile()
      .then((res) => {
        reset(res.data);
        setOriginalMobile(res.data.mobile);
        setLoading(false);
      })
      .catch((err) => {
        showError(err);
        setLoading(false);
      });
  }, [reset]);

  useEffect(() => {
    if (currentMobile && currentMobile !== originalMobile) {
      setMobileVerified(false);
    } else {
      setMobileVerified(true);
    }
  }, [currentMobile, originalMobile]);

  const handleRequestMobileVerify = async () => {
    if (!currentMobile || currentMobile.length !== 11) {
      error("شماره موبایل معتبر نیست");
      return;
    }
    try {
      await requestMobileChange(currentMobile);
      info("کد تایید به شماره جدید ارسال شد");
      setShowOtpBox(true);
    } catch (err) {
      showError(err, "خطا در ارسال کد");
    }
  };

  const handleVerifyMobile = async () => {
    if (!otpCode || otpCode.length !== 4) {
      error("کد ۴ رقمی را وارد کنید");
      return;
    }
    try {
      await verifyMobileChange(currentMobile, otpCode);
      setMobileVerified(true);
      setShowOtpBox(false);
      setOtpCode("");
      success("شماره موبایل تایید شد");
    } catch (err) {
      showError(err, "کد وارد شده صحیح نیست");
    }
  };

  const onSubmit = async (data) => {
    if (!mobileVerified) {
      error("ابتدا شماره تلفن همراه خود را تایید کنید");
      return;
    }
    try {
      await updateProfile(data);
      await refetchUser();
      setOriginalMobile(data.mobile);
      success("اطلاعات با موفقیت بروزرسانی شد");
    } catch (err) {
      showError(err, "خطا در بروزرسانی اطلاعات");
    }
  };

  if (loading) {
    return <SkeletonForm fields={9} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, (formErrors) => {
      const msgs = [];
      for (const [, err] of Object.entries(formErrors)) {
        if (err?.message) msgs.push(err.message);
      }
      if (msgs.length > 0) showErrors(msgs);
    })} className="pill-grid">
      {/* ✅ 1. نام */}
      <FormInput
        placeholder="نام*"
        required
        register={register}
        name="first_name"
      />

      {/* ✅ 2. نام خانوادگی */}
      <FormInput
        placeholder="نام خانوادگی*"
        required
        register={register}
        name="last_name"
      />

      {/* ✅ 3. شغل */}
      <FormInput placeholder="شغل*" required register={register} name="job" />

      {/* ✅ 4. تاریخ تولد */}
      <FormInput
        placeholder="تاریخ تولد*"
        required
        register={register}
        name="birth_date"
      />

      {/* ✅ 5. کد ملی */}
      <NumericInput
        placeholder="کد ملی (۱۰ رقم)"
        required
        register={register}
        name="national_code"
        exactLength={10}
        maxLength={10}
      />

      {/* ✅ 6. شماره موبایل */}
      <div className="pill" style={{ position: "relative" }}>
        <input
          className="register-input"
          placeholder="تلفن همراه*"
          {...register("mobile")}
        />
        {!mobileVerified && (
          <motion.span
            onClick={handleRequestMobileVerify}
            whileHover={{ scale: 1.05 }}
            style={{
              position: "absolute",
              left: 14,
              color: "#C9A84C",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            تایید شماره همراه
          </motion.span>
        )}
      </div>

      {/* ✅ 7. استان */}
      <FormInput
        placeholder="استان محل سکونت*"
        required
        register={register}
        name="province"
      />

      {/* ✅ 8. شهر */}
      <FormInput
        placeholder="شهر محل سکونت*"
        required
        register={register}
        name="city"
      />

      {/* ✅ 9. آدرس */}
      <FormInput
        placeholder="آدرس محل سکونت*"
        required
        register={register}
        name="address"
      />

      {/* ✅ 10. کدپستی */}
      <NumericInput
        placeholder="کدپستی (۱۰ رقم)"
        required
        register={register}
        name="postal_code"
        exactLength={10}
        maxLength={10}
      />

      {/* ✅ 11. شناسه بله (اختیاری) */}
      <FormInput
        placeholder="شناسه در پیام‌رسان بله (اختیاری)"
        register={register}
        name="bale_id"
      />

      {/* ✅ 12. شناسه تلگرام (اختیاری) */}
      <FormInput
        placeholder="شناسه در پیام‌رسان تلگرام (اختیاری)"
        register={register}
        name="telegram_id"
      />

      {showOtpBox && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            gridColumn: "1 / -1",
            display: "flex",
            gap: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="pill" style={{ maxWidth: 150 }}>
            <input
              className="register-input"
              placeholder="کد تایید"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              maxLength={4}
              inputMode="numeric"
            />
          </div>
          <motion.button
            type="button"
            className="submit-btn"
            onClick={handleVerifyMobile}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{ minWidth: "100px", height: "42px" }}
          >
            تایید کد
          </motion.button>
        </motion.div>
      )}

      <div className="submit-row" style={{ gridColumn: "1 / -1" }}>
        <motion.button
          type="submit"
          className="submit-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          ثبت اطلاعات
        </motion.button>
      </div>
    </form>
  );
}
