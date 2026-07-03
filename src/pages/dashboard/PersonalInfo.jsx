// src/pages/dashboard/PersonalInfo.jsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import FormInput from "../../components/common/FormInput";
import SkeletonForm from "../../components/common/SkeletonForm";
import {
  getProfile,
  updateProfile,
  requestMobileChange,
  verifyMobileChange,
} from "../../services/dashboardService";
import { toast } from "react-toastify";

export default function PersonalInfo() {
  const { register, handleSubmit, reset, watch } = useForm();
  const [originalMobile, setOriginalMobile] = useState("");
  const [mobileVerified, setMobileVerified] = useState(true);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(true);
  const currentMobile = watch("mobile");

  // ✅ دریافت پروفایل از سرور
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
      .catch(() => {
        toast.error("خطا در دریافت اطلاعات");
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
      toast.error("شماره موبایل معتبر نیست");
      return;
    }
    try {
      await requestMobileChange(currentMobile);
      toast.success("✅ کد تایید به شماره جدید ارسال شد");
      setShowOtpBox(true);
    } catch (err) {
      const msg = err.response?.data?.detail || "خطا در ارسال کد";
      toast.error(msg);
    }
  };

  const handleVerifyMobile = async () => {
    if (!otpCode || otpCode.length !== 4) {
      toast.error("کد ۴ رقمی را وارد کنید");
      return;
    }
    try {
      await verifyMobileChange(currentMobile, otpCode);
      setMobileVerified(true);
      setShowOtpBox(false);
      setOtpCode("");
      toast.success("✅ شماره موبایل تایید شد");
    } catch (err) {
      const msg = err.response?.data?.detail || "کد وارد شده صحیح نیست";
      toast.error(msg);
    }
  };

  const onSubmit = async (data) => {
    if (!mobileVerified) {
      toast.error(
        "ابتدا شماره تلفن همراه خود را تایید کنید سپس دکمه ثبت تغییرات را بزنید.",
      );
      return;
    }
    try {
      await updateProfile(data);
      setOriginalMobile(data.mobile);
      toast.success("✅ اطلاعات با موفقیت بروزرسانی شد");
    } catch (err) {
      const msg = err.response?.data?.detail || "خطا در بروزرسانی اطلاعات";
      toast.error(msg);
    }
  };

  if (loading) {
    return <SkeletonForm fields={9} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pill-grid">
      <FormInput placeholder="شغل*" required register={register} name="job" />
      <FormInput
        placeholder="نام خانوادگی*"
        required
        register={register}
        name="last_name"
      />
      <FormInput
        placeholder="نام*"
        required
        register={register}
        name="first_name"
      />

      <div className="pill">
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

      <FormInput
        placeholder="کدملی*"
        required
        register={register}
        name="national_code"
      />
      <FormInput
        placeholder="تاریخ تولد*"
        required
        register={register}
        name="birth_date"
      />
      <FormInput
        placeholder="آدرس محل سکونت*"
        required
        register={register}
        name="address"
      />
      <FormInput
        placeholder="شهر محل سکونت*"
        required
        register={register}
        name="city"
      />
      <FormInput
        placeholder="استان محل سکونت*"
        required
        register={register}
        name="province"
      />
      <FormInput
        placeholder="شناسه در پیام‌رسان تلگرام"
        register={register}
        name="telegram_id"
      />
      <FormInput
        placeholder="شناسه در پیام‌رسان بله"
        register={register}
        name="bale_id"
      />
      <FormInput
        placeholder="کدپستی*"
        required
        register={register}
        name="postal_code"
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
