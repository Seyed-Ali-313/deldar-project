// src/pages/dashboard/PersonalInfo.jsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormInput from "../../components/common/FormInput";
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
  const currentMobile = watch("mobile");

  useEffect(() => {
    getProfile().then((res) => {
      reset(res.data);
      setOriginalMobile(res.data.mobile);
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
    try {
      await requestMobileChange(currentMobile);
      toast.success("کد تایید ارسال شد");
      setShowOtpBox(true);
    } catch {
      toast.error("خطا در ارسال کد");
    }
  };

  const handleVerifyMobile = async () => {
    try {
      await verifyMobileChange(currentMobile, otpCode);
      setMobileVerified(true);
      setShowOtpBox(false);
      toast.success("شماره موبایل تایید شد");
    } catch {
      toast.error("کد وارد شده صحیح نیست");
    }
  };

  const onSubmit = async (data) => {
    if (!mobileVerified) {
      toast.error(
        "ابتدا شماره تلفن همراه خود را تایید کنید سپس دکمه ثبت تغییرات رو بزنید.",
      );
      return;
    }
    try {
      await updateProfile(data);
      setOriginalMobile(data.mobile);
      toast.success("اطلاعات با موفقیت بروزرسانی شد");
    } catch {
      toast.error("خطا در بروزرسانی اطلاعات");
    }
  };

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
          <span
            onClick={handleRequestMobileVerify}
            style={{
              position: "absolute",
              left: 14,
              color: "var(--color-gold)",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            تایید شماره همراه
          </span>
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
        <div
          style={{
            gridColumn: "1 / -1",
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <div className="pill" style={{ maxWidth: 150 }}>
            <input
              className="register-input"
              placeholder="کد تایید"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="submit-btn"
            onClick={handleVerifyMobile}
          >
            تایید کد
          </button>
        </div>
      )}

      <div className="submit-row" style={{ gridColumn: "1 / -1" }}>
        <button type="submit" className="submit-btn">
          ثبت اطلاعات
        </button>
      </div>
    </form>
  );
}
