import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestLoginOtp, verifyLoginOtp } from "../../services/authService";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

export default function Login() {
  const [step, setStep] = useState("identifier"); // identifier | otp
  const [identifier, setIdentifier] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      await requestLoginOtp(identifier);
      toast.success("کد تایید ارسال شد");
      setStep("otp");
    } catch (err) {
      toast.error("کاربری با این مشخصات یافت نشد");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await verifyLoginOtp(identifier, otpCode);
      login(res.data.access, res.data.refresh, res.data.user);
      toast.success("ورود موفقیت‌آمیز بود");
      navigate("/dashboard");
    } catch (err) {
      toast.error("کد وارد شده صحیح نیست");
    }
  };

  return (
    <div
      className="page"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 80,
      }}
    >
      {step === "identifier" ? (
        <form
          onSubmit={handleRequestOtp}
          style={{ width: "100%", maxWidth: 313 }}
        >
          <div className="pill" style={{ marginBottom: 20 }}>
            <input
              className="register-input"
              placeholder="شماره موبایل یا کدملی"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="submit-btn"
            style={{ width: "100%" }}
          >
            دریافت کد ورود
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleVerifyOtp}
          style={{ width: "100%", maxWidth: 313 }}
        >
          <div className="pill" style={{ marginBottom: 20 }}>
            <input
              className="register-input"
              placeholder="کد تایید"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              maxLength={4}
            />
          </div>
          <button
            type="submit"
            className="submit-btn"
            style={{ width: "100%" }}
          >
            ورود
          </button>
        </form>
      )}
    </div>
  );
}
