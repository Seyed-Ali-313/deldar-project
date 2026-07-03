// src/services/authService.js
import api from "./api";

// درخواست کد OTP برای ورود
export const requestLoginOtp = (identifier) =>
  api.post("/auth/login/request/", { identifier });

// تایید کد OTP و دریافت توکن
export const verifyLoginOtp = (identifier, otp_code) =>
  api.post("/auth/login/verify/", { identifier, otp_code });
