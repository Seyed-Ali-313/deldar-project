import api from "./api";

export const requestLoginOtp = (identifier) =>
  api.post("/auth/login/request/", { identifier });

export const verifyLoginOtp = (identifier, otp_code) =>
  api.post("/auth/login/verify/", { identifier, otp_code });
