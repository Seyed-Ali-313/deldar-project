// src/components/register/AdditionalInfoForm.jsx
import { useForm } from "react-hook-form";
import FormInput from "../common/FormInput";
import { submitStep2 } from "../../services/onboardingService";
import { toast } from "react-toastify";

export default function AdditionalInfoForm({ onSuccess }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      await submitStep2({
        province: data.province,
        city: data.city,
        address: data.address,
        postal_code: data.postal_code,
        bale_id: data.bale_id || "",
        telegram_id: data.telegram_id || "",
      });
      toast.success("اطلاعات با موفقیت ثبت شد");
      onSuccess();
    } catch (err) {
      toast.error("خطا در ثبت اطلاعات");
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
        <button type="submit" className="submit-btn">
          ثبت اطلاعات
        </button>
      </div>
    </form>
  );
}
